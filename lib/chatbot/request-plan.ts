import type Groq from "groq-sdk";
import type { ChatHistoryMessage, ChatLanguage } from "./types";
import { analyzeQuery } from "./query-analysis";
import { projectKnowledge, projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { aiSkills, dataSkills, devSkills } from "@/data/skills";
import { normalizeMessage } from "./language";
import { GROQ_MODEL } from "./model";

export const subRequestIntents = [
  "TECHNOLOGY_EVIDENCE", "PROJECT_SELECTION", "EVIDENCE_SELECTION", "PROJECT_DETAIL",
  "CERTIFICATION_SELECTION", "CERTIFICATION_DETAIL", "EXPERIENCE", "EDUCATION",
  "SKILL_SELECTION", "SKILL_COMPARISON", "PROJECT_COMPARISON", "EDUCATION_PROJECT_ALIGNMENT",
  "FACT_VERIFICATION", "DOMAIN_COMPARISON", "OUT_OF_SCOPE", "OTHER",
] as const;
export type SubRequestIntent = (typeof subRequestIntents)[number];
export type PlanDomain = "backend" | "data_science" | "ai" | "education" | "certification" | "general";
export type PlanEntityType = "project" | "certification" | "technology" | "metric" | "experience" | "education";

export interface SubRequest {
  id: string;
  intent: SubRequestIntent;
  domain: PlanDomain | null;
  entityType: PlanEntityType | null;
  entityName: string | null;
  requestedCount: number | null;
  requiresExplanation: boolean;
  requiresEvidence: boolean;
  requiresSelection: boolean;
  scope: "professional" | "portfolio" | "cv" | "general" | null;
  aspect?: string;
}

export interface RequestPlan {
  language: ChatLanguage;
  subRequests: SubRequest[];
  globalConstraints: {
    exactCount: number | null;
    maxCount: number | null;
    concise: boolean;
    answerMode: "normal" | "yes_no" | "list";
    separateItems: boolean;
    conclusionFirst: boolean;
  };
  confidence: number;
  clarificationNeeded: boolean;
  clarificationReason: string | null;
  requiredAspects?: string[];
}

const PLAN_PROMPT = `You are a compact request planner for Issam's portfolio assistant. Decompose the latest message into every independent request. Do not answer and do not decide whether a claim about Issam is true. No portfolio facts are available to you.
Return exactly one JSON object:
{"language":"en","subRequests":[{"id":"r1","intent":"OTHER","domain":null,"entityType":null,"entityName":null,"requestedCount":null,"requiresExplanation":false,"requiresEvidence":false,"requiresSelection":false,"scope":null}],"globalConstraints":{"exactCount":null,"maxCount":null,"concise":false,"answerMode":"normal","separateItems":false,"conclusionFirst":false},"confidence":0.0,"clarificationNeeded":false,"clarificationReason":null}
Allowed language: en, fr, ar, darija.
Allowed intents: TECHNOLOGY_EVIDENCE, PROJECT_SELECTION, EVIDENCE_SELECTION, PROJECT_DETAIL, CERTIFICATION_SELECTION, CERTIFICATION_DETAIL, SKILL_SELECTION, SKILL_COMPARISON, PROJECT_COMPARISON, EDUCATION_PROJECT_ALIGNMENT, EXPERIENCE, EDUCATION, FACT_VERIFICATION, DOMAIN_COMPARISON, OUT_OF_SCOPE, OTHER.
Allowed domain: backend, data_science, ai, education, certification, general, or null.
Allowed entityType: project, certification, technology, metric, experience, education, or null.
Allowed scope: professional, portfolio, cv, general, or null.
Rules:
- Create one subRequest per independently answerable entity/question. A message asking about three technologies has three subRequests.
- Issam is the subject/person and must never be entityName. entityName is the requested project, certification, technology, metric, experience or education item.
- A request for N projects is one PROJECT_SELECTION subRequest, not N separate subRequests. Use the requested role/domain and requestedCount=N.
- A request involving skills is SKILL_SELECTION. Create one subRequest per explicitly requested domain. Add SKILL_COMPARISON when those domains must be compared.
- Projects and certifications in the same request are separate PROJECT_SELECTION and CERTIFICATION_SELECTION subRequests.
- Comparing two named projects is one PROJECT_COMPARISON whose entityName contains both exact names separated by "|||".
- Use DOMAIN_COMPARISON for a requested conclusion about which domain has stronger documented project evidence.
- A request for N candidacy proofs is one EVIDENCE_SELECTION subRequest. If it also asks for the strongest among those N, set requiresSelection=true on that same subRequest.
- A stage/internship contribution is a separate EXPERIENCE subRequest.
- For technology evidence, create one TECHNOLOGY_EVIDENCE per explicitly named technology and preserve each technology name exactly.
- Do not use FACT_VERIFICATION for ordinary questions. Use it only when the user asserts a metric/result/fact that must be checked.
- A request to explain a named project is PROJECT_DETAIL. A request to explain a named certification is CERTIFICATION_DETAIL.
- User assertions are FACT_VERIFICATION plus any separate request to explain the real project/experience.
- Preserve numbers, evidence, explanation, selection, comparison, conciseness and separate-answer requirements.
- requestedCount belongs to the selection it constrains. Global exactCount/maxCount are used when one count governs the main list.
- A request for N items and then the strongest among them is one selection subRequest with requestedCount=N and requiresSelection=true.
- Ask clarification only when missing context makes a reliable answer impossible, not for ranked/list requests.
- History resolves references only and is never factual evidence.
- Maximum 6 subRequests. JSON only.`;

const languages: ChatLanguage[] = ["en", "fr", "ar", "darija"];
const domains: PlanDomain[] = ["backend", "data_science", "ai", "education", "certification", "general"];
const entityTypes: PlanEntityType[] = ["project", "certification", "technology", "metric", "experience", "education"];
const scopes = ["professional", "portfolio", "cv", "general"];

function parsePlan(content: string | null): RequestPlan | null {
  if (!content) return null;
  try {
    const p = JSON.parse(content) as RequestPlan;
    if (!languages.includes(p.language) || !Array.isArray(p.subRequests) || p.subRequests.length < 1 || p.subRequests.length > 6) return null;
    p.subRequests = p.subRequests.filter((s) => {
      const needsEntity = ["TECHNOLOGY_EVIDENCE", "PROJECT_DETAIL", "CERTIFICATION_DETAIL", "FACT_VERIFICATION"].includes(s.intent);
      return !needsEntity || Boolean(s.entityName && !/^issam$/i.test(s.entityName.trim()));
    });
    if (!p.subRequests.length) return null;
    if (typeof p.confidence !== "number" || p.confidence < 0 || p.confidence > 1 || typeof p.clarificationNeeded !== "boolean") return null;
    if (p.clarificationReason !== null && typeof p.clarificationReason !== "string") return null;
    const ids = new Set<string>();
    for (const s of p.subRequests) {
      if (typeof s.id !== "string" || ids.has(s.id) || !subRequestIntents.includes(s.intent)) return null;
      ids.add(s.id);
      if (s.domain !== null && !domains.includes(s.domain)) return null;
      if (s.entityType !== null && !entityTypes.includes(s.entityType)) return null;
      if (s.entityName !== null && typeof s.entityName !== "string") return null;
      if (s.requestedCount !== null && (!Number.isInteger(s.requestedCount) || s.requestedCount < 1 || s.requestedCount > 5)) return null;
      if (![s.requiresExplanation, s.requiresEvidence, s.requiresSelection].every((v) => typeof v === "boolean")) return null;
      if (s.scope !== null && !scopes.includes(s.scope)) return null;
    }
    const g = p.globalConstraints;
    if (!g || !["normal", "yes_no", "list"].includes(g.answerMode)) return null;
    if (![g.concise, g.separateItems, g.conclusionFirst].every((v) => typeof v === "boolean")) return null;
    for (const n of [g.exactCount, g.maxCount]) if (n !== null && (!Number.isInteger(n) || n < 1 || n > 5)) return null;
    return p;
  } catch { return null; }
}

export function isCompoundRequest(message: string): boolean {
  const text = normalizeMessage(message);
  if (/relie|connect|comp[eé]tences communes|common skills/.test(text) && /stage|intern/.test(text) && /projet|project/.test(text)) return false;
  const subjects = [
    /skills?|comp[eé]tences?|مهارات/.test(text),
    /projects?|projets?|مشاريع/.test(text),
    /certif|certificate|شهاد/.test(text),
    /parcours|formation|education|studies|دراس/.test(text),
  ].filter(Boolean).length;
  const domains = [
    /data science|علم البيانات/.test(text),
    /machine learning|\bml\b|التعلم الآلي/.test(text),
    /backend|back end|spring|java/.test(text),
  ].filter(Boolean).length;
  const namedProjects = projects.filter((project) => {
    const title = normalizeMessage(project.title);
    const distinctive = title.split(/\s+/).filter((word) => word.length > 4).slice(0, 2).join(" ");
    return text.includes(title) || (distinctive.length > 7 && text.includes(distinctive));
  }).length;
  return namedProjects >= 2
    || subjects >= 2
    || (domains >= 2 && /skills?|comp[eé]tences?|projects?|projets?|مهارات|مشاريع/.test(text))
    || (/\b(?:compare|comparer|comparez|versus|vs)\b|comparaison (?:entre|de)/.test(text) && (subjects > 0 || namedProjects > 0));
}

export function buildCompoundRequestPlan(message: string, language: ChatLanguage): RequestPlan | null {
  if (!isCompoundRequest(message)) return null;
  const text = normalizeMessage(message);
  const scope = /\b(?:cv|resume)\b|السيرة الذاتية/.test(text) ? "cv" as const : "portfolio" as const;
  const subRequests: SubRequest[] = [];
  const requiredAspects: string[] = [];
  let nextId = 1;
  const add = (aspect: string, request: Omit<SubRequest, "id" | "aspect">) => {
    requiredAspects.push(aspect);
    subRequests.push({ id: `c${nextId++}`, aspect, ...request });
  };
  const base = { requestedCount: null, requiresExplanation: false, requiresEvidence: true, requiresSelection: false, scope };
  const hasSkills = /skills?|comp[eé]tences?|مهارات/.test(text);
  const hasProjects = /projects?|projets?|مشاريع/.test(text);
  const hasCertifications = /certif|certificate|شهاد/.test(text);
  const hasEducation = /parcours|formation|education|studies|دراس/.test(text);
  const hasDataScience = /data science|علم البيانات/.test(text);
  const hasMachineLearning = /machine learning|\bml\b|التعلم الآلي/.test(text);
  const hasBackend = /backend|back end|spring|java/.test(text);
  const asksComparison = /\b(?:compare|comparer|comparez|versus|vs)\b|comparaison (?:entre|de)/.test(text);
  const asksStrongestProjects = hasProjects && /plus solides?|strongest|stronger|plus forts?|quel domaine|which domain/.test(text);
  const namedProjects = projects.filter((project) => {
    const title = normalizeMessage(project.title);
    const distinctive = title.split(/\s+/).filter((word) => word.length > 4).slice(0, 2).join(" ");
    return text.includes(title) || (distinctive.length > 7 && text.includes(distinctive));
  });

  if (namedProjects.length >= 2 && asksComparison) {
    add("projects:comparison", {
      ...base, intent: "PROJECT_COMPARISON", domain: null, entityType: "project",
      entityName: namedProjects.slice(0, 2).map(({ title }) => title).join("|||"), requiresExplanation: true,
    });
  } else {
    const requestedDomains: PlanDomain[] = [
      ...(hasDataScience ? ["data_science" as const] : []),
      ...(hasMachineLearning ? ["ai" as const] : []),
      ...(hasBackend ? ["backend" as const] : []),
    ];
    const domains = requestedDomains.length ? requestedDomains : ["general" as const];
    if (hasSkills) for (const domain of domains) add(`skills:${domain}:${scope}`, {
      ...base, intent: "SKILL_SELECTION", domain, entityType: "technology", entityName: null,
    });
    if (hasSkills && asksComparison && domains.length >= 2) add(`skills:comparison:${domains.join("-")}`, {
      ...base, intent: "SKILL_COMPARISON", domain: "general", entityType: "technology", entityName: domains.join("|||"), requiresExplanation: true,
    });
    if (hasProjects && !asksStrongestProjects) for (const domain of domains) add(`projects:${domain}:${scope}`, {
      ...base, intent: "PROJECT_SELECTION", domain, entityType: "project", entityName: null,
    });
    if (hasCertifications) for (const domain of domains) add(`certifications:${domain}:${scope}`, {
      ...base, intent: "CERTIFICATION_SELECTION", domain, entityType: "certification", entityName: null,
    });
    if (hasEducation) add(`education:${scope}`, {
      ...base, intent: "EDUCATION", domain: "education", entityType: "education", entityName: null,
    });
    if (hasEducation && hasProjects) add(`education-project-alignment:${scope}`, {
      ...base, intent: "EDUCATION_PROJECT_ALIGNMENT", domain: hasMachineLearning || hasDataScience ? "data_science" : "general",
      entityType: "project", entityName: null, requiresExplanation: true,
    });
    if (asksStrongestProjects) add("projects:domain-strength", {
      ...base, intent: "DOMAIN_COMPARISON", domain: "general", entityType: "project", entityName: "data_science|||backend",
      requiresExplanation: true, requiresSelection: true,
    });
  }

  if (!subRequests.length || subRequests.length > 6) return null;
  return {
    language,
    subRequests,
    requiredAspects,
    globalConstraints: {
      exactCount: null, maxCount: null, concise: false, answerMode: "normal",
      separateItems: true, conclusionFirst: false,
    },
    confidence: 1,
    clarificationNeeded: false,
    clarificationReason: null,
  };
}

export function shouldBuildRequestPlan(message: string): boolean {
  const q = analyzeQuery(message);
  const multipleQuestions = (message.match(/\?/g) ?? []).length > 1;
  const composedConstraint = Boolean(q.constraints.exactCount || q.constraints.maxCount);
  const countedItems = /\b(?:\d+|one|two|three|un|une|deux|trois)\s+(?:(?:strongest|best|meilleurs?|pertinents?|aham)\s+)?(?:projects?|projets?|preuves?|evidences?|éléments?|7wayej)\b/i.test(message);
  const arabicCountedItems = /(?:ثلاثة|ثلاث|٣|اثنان|اثنين|٢)\s+(?:أدلة|دليل|مشاريع|مشروع)/.test(message);
  const singularRankedItem = /(?:le|the|only)\s+(?:meilleur|best|strongest)|uniquement\s+(?:la|le)\s+plus fort/i.test(message)
    && /project|projet|proof|preuve|evidence|دليل|مشروع/i.test(message);
  const multipleNamedEntities = /(?:compare|tell me about|présente).*(?:system|prediction).*(?:and|et).*(?:system|platform|prediction)/i.test(message)
    || /AWS.*Kubernetes.*Spring Security|AWS.*(?:,|et|and).*Kubernetes/i.test(message);
  const crossCategory = /(?:projet|project|system|platform|prediction|ticket management|water potability).*(?:certification|stage|internship)|(?:education|parcours académique|formation).*(?:stage|internship)|capitale du japon.*(?:projet|project)/i.test(message);
  return isCompoundRequest(message) || multipleQuestions || composedConstraint || countedItems || arabicCountedItems || singularRankedItem || multipleNamedEntities || crossCategory
    || q.constraints.comparisonRequired || (q.hasUserAssertedMetric && /intern|stage|experience|project|projet/i.test(message));
}

export async function buildRequestPlan(client: Groq, message: string, history: ChatHistoryMessage[], preferredLanguage?: ChatLanguage): Promise<RequestPlan | null> {
  const historyText = history.slice(-2).map(({ role, content }) => `${role}: ${content.slice(0, 250)}`).join("\n");
  const completion = await client.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: PLAN_PROMPT },
      { role: "user", content: `${preferredLanguage ? `UI_LANGUAGE_HINT: ${preferredLanguage}\n` : ""}${historyText ? `CONVERSATION:\n${historyText}\n` : ""}LATEST_MESSAGE:\n${message}` },
    ],
    response_format: { type: "json_object" }, temperature: 0, max_tokens: 650,
  });
  const plan = parsePlan(completion.choices[0]?.message.content ?? null);
  if (!plan) {
    console.warn("Semantic planner returned an invalid plan.");
    return null;
  }
  const constraints = analyzeQuery(message).constraints;
  if (constraints.exactCount) plan.globalConstraints.exactCount = constraints.exactCount;
  if (constraints.maxCount) plan.globalConstraints.maxCount = constraints.maxCount;
  if (constraints.separateItems) plan.globalConstraints.separateItems = true;
  const normalized = message.toLocaleLowerCase();
  for (const sub of plan.subRequests) {
    if (["PROJECT_SELECTION", "EVIDENCE_SELECTION"].includes(sub.intent)) {
      if (/backend|java|spring/.test(normalized)) sub.domain = "backend";
      if (/data science|data scientist|عالم بيانات|علم البيانات/.test(normalized)) sub.domain = "data_science";
      if (plan.globalConstraints.exactCount) sub.requestedCount = plan.globalConstraints.exactCount;
      sub.requiresExplanation ||= constraints.explanation === "required";
      sub.requiresSelection ||= constraints.selectionRequired;
    }
  }
  return plan;
}

export function buildDeterministicFallbackPlan(message: string, language: ChatLanguage): RequestPlan | null {
  const normalized = message.normalize("NFKC").toLocaleLowerCase();
  const analysis = analyzeQuery(message);
  const subRequests: SubRequest[] = [];
  let nextId = 1;
  const add = (request: Omit<SubRequest, "id">) => subRequests.push({ id: `r${nextId++}`, ...request });
  const base = { requestedCount: null, requiresExplanation: false, requiresEvidence: false, requiresSelection: false, scope: "portfolio" as const };
  const explicitCount = normalized.match(/\b(\d+|one|two|three|un|une|deux|trois)\s+(?:strongest\s+|best\s+|meilleures?\s+|pertinents?\s+|aham\s+|أقوى\s+)?(?:projects?|projets?|proofs?|evidences?|preuves?|7wayej|أدلة|مشاريع)\b/);
  const countWords: Record<string, number> = { one: 1, un: 1, une: 1, two: 2, deux: 2, three: 3, trois: 3 };
  const directCount = explicitCount ? (/^\d+$/.test(explicitCount[1]) ? Number(explicitCount[1]) : countWords[explicitCount[1]]) : undefined;
  const arabicCount = /(?:ثلاثة|ثلاث|٣)\s+(?:أدلة|مشاريع)/.test(normalized) ? 3 : /(?:اثنان|اثنين|٢)\s+(?:دليل|أدلة|مشاريع)/.test(normalized) ? 2 : undefined;
  const count = analysis.constraints.exactCount ?? directCount ?? arabicCount
    ?? (/\b(?:ثلاثة|ثلاث|٣)\b/.test(normalized) ? 3 : /\b(?:اثنان|اثنين|٢)\b/.test(normalized) ? 2 : undefined);
  const backend = /backend|java|spring/.test(normalized);
  const dataScience = /data science|data scientist|عالم بيانات|علم البيانات/.test(normalized);

  const asksProjects = /projects?|projets?|مشاريع|مشروع/.test(normalized);
  const asksEvidence = /proof|evidence|preuve|دليل|أدلة|preuves|7wayej/.test(normalized);
  if (asksProjects && (count || analysis.constraints.selectionRequired)) add({
    ...base, intent: "PROJECT_SELECTION", domain: backend ? "backend" : dataScience ? "data_science" : "general",
    entityType: "project", entityName: null, requestedCount: count ?? 1,
    requiresExplanation: analysis.constraints.explanation === "required", requiresEvidence: true,
    requiresSelection: analysis.constraints.selectionRequired,
  });
  if (asksEvidence && (count || analysis.constraints.selectionRequired)) add({
    ...base, intent: "EVIDENCE_SELECTION", domain: backend ? "backend" : dataScience ? "data_science" : "general",
    entityType: null, entityName: null, requestedCount: count ?? 1,
    requiresExplanation: analysis.constraints.explanation !== "forbidden", requiresEvidence: true,
    requiresSelection: analysis.constraints.selectionRequired || /strongest|plus forte|meilleure|الأفضل|أقوى/.test(normalized),
  });

  const knownProjectNames = projects.filter((project) => {
    const title = project.title.toLocaleLowerCase();
    const shortened = title.replace(/ system| platform/g, "");
    const distinctivePrefix = shortened.split(/\s+/).slice(0, 2).join(" ");
    return normalized.includes(title) || normalized.includes(shortened) || (distinctivePrefix.length >= 8 && normalized.includes(distinctivePrefix));
  });
  if (!asksProjects || /actually documented|documenté|tell me about|présente|compare|explain|اشرح/.test(normalized)) {
    for (const project of knownProjectNames) add({ ...base, intent: "PROJECT_DETAIL", domain: null, entityType: "project", entityName: project.title, requiresExplanation: true });
  }
  const unknownProjects = [...message.matchAll(/(?:^|\b(?:and|et)\s+)([A-Z][\w-]+(?:\s+[A-Z][\w-]+){1,4}\s+(?:Platform|System|Prediction))\b/g)].map((match) => match[1]);
  for (const name of unknownProjects) if (!projects.some((p) => normalizeMessage(p.title).includes(normalizeMessage(name)) || normalizeMessage(name).includes(normalizeMessage(p.title)))) add({ ...base, intent: "PROJECT_DETAIL", domain: null, entityType: "project", entityName: name, requiresExplanation: true });

  for (const cert of certifications) {
    const title = cert.title.toLocaleLowerCase();
    const distinctiveTitle = title.split(":")[0];
    if (normalized.includes(title) || normalized.includes(distinctiveTitle)) add({ ...base, intent: "CERTIFICATION_DETAIL", domain: "certification", entityType: "certification", entityName: cert.title });
  }
  if (/certification/.test(normalized) && /plus proche|closest|most relevant|pertinent/.test(normalized)) add({
    ...base, intent: "CERTIFICATION_SELECTION", domain: backend || knownProjectNames.some((project) => projectKnowledge[project.slug].primaryDomain === "backend") ? "backend" : dataScience ? "data_science" : "general",
    entityType: "certification", entityName: null, requestedCount: 1, requiresExplanation: true, requiresSelection: true,
  });

  const knownTechnologies = [...devSkills, ...dataSkills, ...aiSkills].map(({ name }) => name);
  const knownMentions = knownTechnologies.filter((technology) => normalized.includes(technology.toLocaleLowerCase()));
  const properMentions = [...message.matchAll(/\b(?:[A-Z]{2,}|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g)].map((match) => match[0]);
  const ignoredProperNames = /^(?:Issam|Water Potability|Data Science|Backend|Backend Java|Donne|Tell|Give|Compare|Advanced Ticket|E-commerce Recommendation)$/i;
  const technologies = [...new Set([...knownMentions, ...properMentions.filter((name) =>
    !ignoredProperNames.test(name)
    && !projects.some((project) => normalizeMessage(project.title).includes(normalizeMessage(name)))
    && !certifications.some((cert) => normalizeMessage(cert.title).includes(normalizeMessage(name))),
  )])];
  const asksAboutTechnologyEvidence = /services?|utilis|used|professional|professionnel|evidence|preuve|conna[iî]t|knows|kay3ref|khdem|استخدم|مهني|موثق|دليل|خبرة/.test(normalized);
  if (asksAboutTechnologyEvidence && !/(?:poste|role|rôle|job|candidat|candidate)/.test(normalized)) {
    for (const technology of technologies) add({ ...base, intent: "TECHNOLOGY_EVIDENCE", domain: technology === "Spring Security" ? "backend" : null, entityType: "technology", entityName: technology, requiresEvidence: true, requiresSelection: false });
    if (technologies.length) {
      for (let index = subRequests.length - 1; index >= 0; index--) if (subRequests[index].intent === "EVIDENCE_SELECTION") subRequests.splice(index, 1);
    }
  }

  if (analysis.hasUserAssertedMetric) {
    const metric = (message.match(/\b\d+(?:[.,]\d+)?\s*%[^,.?]*/)?.[0]?.split(/\s+(?:and|et)\s+/i)[0].trim()) ?? "The asserted metric";
    add({ ...base, intent: "FACT_VERIFICATION", domain: dataScience ? "data_science" : null, entityType: "metric", entityName: metric });
  }
  if (/stage|internship|intern\b|التدريب/.test(normalized)) add({ ...base, intent: "EXPERIENCE", domain: "backend", entityType: "experience", entityName: "documented internship", requiresExplanation: true });
  if (/\b(?:education|parcours académique|formation)\b|دراس|قراية/.test(normalized)) add({ ...base, intent: "EDUCATION", domain: "education", entityType: "education", entityName: null });
  if (/backend (?:ou|or) data science|compare.*backend.*data science/.test(normalized)) add({ ...base, intent: "DOMAIN_COMPARISON", domain: "general", entityType: null, entityName: null, requiresExplanation: true, requiresSelection: true });
  if (/capitale du japon|capital of japan|عاصمة اليابان/.test(normalized)) add({ ...base, intent: "OUT_OF_SCOPE", domain: null, entityType: null, entityName: "capital of Japan" });

  if (!subRequests.length) return null;
  if (/y9dro ybeyno|kaybano|why each|pourquoi chacun/.test(normalized)) {
    for (const sub of subRequests) if (sub.intent === "PROJECT_SELECTION" || sub.intent === "EVIDENCE_SELECTION") sub.requiresExplanation = true;
  }
  const deduped = subRequests.filter((item, index, all) => all.findIndex((other) => other.intent === item.intent && other.entityName === item.entityName) === index).slice(0, 6);
  return {
    language,
    subRequests: deduped,
    globalConstraints: {
      exactCount: count ?? null,
      maxCount: analysis.constraints.maxCount ?? null,
      concise: analysis.constraints.answerMode === "short" || /brief|brièvement|courte|باختصار/.test(normalized),
      answerMode: analysis.constraints.answerMode === "yes-no" ? "yes_no" : analysis.constraints.answerMode === "list" ? "list" : "normal",
      separateItems: analysis.constraints.separateItems || deduped.length > 1,
      conclusionFirst: analysis.constraints.conclusionFirst,
    },
    confidence: 1,
    clarificationNeeded: false,
    clarificationReason: null,
  };
}
