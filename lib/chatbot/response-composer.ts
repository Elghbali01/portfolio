import { certificationKnowledge, certifications } from "@/data/certifications";
import { profile } from "@/data/profile";
import { projectKnowledge, projects } from "@/data/projects";
import { normalizeMessage } from "./language";
import type { RequestPlan, SubRequest } from "./request-plan";
import type { ChatLanguage } from "./types";

export interface ComposedPlanResponse { answer: string; resourceIds: string[]; resolvedSubRequestIds: string[] }

const backendSlugs = ["ticket-management-system", "resource-management-system", "employee-management"];
const dataEvidence = [
  { name: "Master in Data Science", detail: "advanced academic alignment with Data Science", resource: "profile:cv" },
  { name: "Water Potability Prediction System", detail: "an end-to-end ML workflow with preprocessing, model comparison, evaluation, cross-validation and deployment", resource: "project:water-potability-ml" },
  { name: "Customer Churn Prediction", detail: "applied classification, feature engineering, model comparison and SHAP interpretation", resource: "profile:cv" },
  { name: "Intelligent Product Recommendation System", detail: "content-based and collaborative filtering with relevance evaluation", resource: "profile:cv" },
];

const labels: Record<ChatLanguage, Record<string, string>> = {
  en: { strongest: "Strongest", internship: "Internship", notDocumented: "is not documented in Issam's portfolio or CV", proof: "Documented proof", out: "Out of scope" },
  fr: { strongest: "Preuve la plus forte", internship: "Stage", notDocumented: "n'est pas documenté dans le portfolio ou le CV d'Issam", proof: "Preuve documentée", out: "Hors périmètre" },
  ar: { strongest: "أقوى دليل", internship: "التدريب", notDocumented: "غير موثق في ملف عصام أو سيرته الذاتية", proof: "الدليل الموثق", out: "خارج النطاق" },
  darija: { strongest: "أقوى دليل", internship: "الـ stage", notDocumented: "ما موثقش فالـ portfolio ولا فالـ CV ديال Issam", proof: "الدليل الموثق", out: "خارج النطاق" },
};

function countFor(plan: RequestPlan, sub: SubRequest, available: number): number {
  const exact = sub.requestedCount ?? plan.globalConstraints.exactCount;
  const max = plan.globalConstraints.maxCount;
  return Math.min(available, exact ?? max ?? available);
}

function localizedProjectReason(slug: string, language: ChatLanguage): string {
  const fallback = projectKnowledge[slug].recruiterValue;
  const reasons: Partial<Record<string, Record<ChatLanguage, string>>> = {
    "ticket-management-system": {
      en: fallback,
      fr: "une preuve claire d'architecture Backend Java ciblée avec Spring Boot, REST, JPA et PostgreSQL",
      ar: "دليل واضح على بناء Backend بـ Java وSpring Boot وREST وJPA وPostgreSQL",
      darija: "كيبيّن Backend Java واضح بـ Spring Boot وREST وJPA وPostgreSQL",
    },
    "resource-management-system": {
      en: fallback,
      fr: "une preuve de workflows d'entreprise complexes, de Spring Security et de contrôle d'accès par rôles",
      ar: "دليل على تدفقات عمل مؤسساتية معقدة وSpring Security والتحكم حسب الأدوار",
      darija: "كيبيّن workflows ديال enterprise وSpring Security وrole-based access",
    },
  };
  return reasons[slug]?.[language] ?? fallback;
}

function localizedEvidenceDetail(name: string, fallback: string, language: ChatLanguage): string {
  if (language === "en") return fallback;
  const details: Record<string, Record<Exclude<ChatLanguage, "en">, string>> = {
    "Master in Data Science": {
      fr: "un alignement académique avancé avec la Data Science",
      ar: "تكوين أكاديمي متقدم ومتوافق مباشرة مع علم البيانات",
      darija: "تكوين أكاديمي متقدم ومركز على Data Science",
    },
    "Water Potability Prediction System": {
      fr: "un workflow ML complet avec prétraitement, comparaison, évaluation, validation croisée et déploiement",
      ar: "مسار تعلم آلي متكامل يشمل المعالجة والمقارنة والتقييم والتحقق المتقاطع والنشر",
      darija: "workflow ML كامل فيه preprocessing ومقارنة وتقييم وcross-validation وdeployment",
    },
    "Customer Churn Prediction": {
      fr: "une classification appliquée avec feature engineering, comparaison de modèles et interprétation SHAP",
      ar: "تصنيف تطبيقي مع هندسة الخصائص ومقارنة النماذج وتفسير SHAP",
      darija: "classification تطبيقية فيها feature engineering ومقارنة models وSHAP",
    },
  };
  return details[name]?.[language] ?? fallback;
}

function projectSelection(plan: RequestPlan, sub: SubRequest) {
  const domain = sub.domain ?? "general";
  const candidates = domain === "data_science"
    ? projects.filter((p) => projectKnowledge[p.slug].primaryDomain === "data-science")
    : backendSlugs.map((slug) => projects.find((p) => p.slug === slug)!).filter(Boolean);
  const selected = candidates.slice(0, countFor(plan, sub, candidates.length));
  if (!selected.length) return null;
  const lines = selected.map((project, index) => {
    const reason = localizedProjectReason(project.slug, plan.language);
    return `${index + 1}. ${project.title}${sub.requiresExplanation ? ` — ${reason}` : ""}`;
  });
  if (sub.requiresSelection) lines[lines.length - 1] += ` ${labels[plan.language].strongest}: ${selected[0].title}.`;
  return { text: lines.join("\n"), resources: selected.map((p) => `project:${p.slug}`) };
}

function evidenceSelection(plan: RequestPlan, sub: SubRequest, language: ChatLanguage) {
  const evidence = sub.domain === "backend"
    ? backendSlugs.map((slug) => {
        const p = projects.find((item) => item.slug === slug)!;
        return { name: p.title, detail: projectKnowledge[slug].recruiterValue, resource: `project:${slug}` };
      })
    : dataEvidence;
  const selected = evidence.slice(0, countFor(plan, sub, evidence.length));
  const lines = selected.map((item, index) => `${index + 1}. ${item.name}${sub.requiresExplanation ? ` — ${localizedEvidenceDetail(item.name, item.detail, language)}.` : ""}`);
  if (sub.requiresSelection) {
    const strongest = sub.domain === "backend" ? selected[0] : selected.find((item) => item.name.includes("Water Potability")) ?? selected[0];
    lines[lines.length - 1] += ` ${labels[language].strongest}: ${strongest.name} — ${localizedEvidenceDetail(strongest.name, strongest.detail, language)}.`;
  }
  return { text: lines.join("\n"), resources: [...new Set(selected.map((item) => item.resource))] };
}

function technologyEvidence(sub: SubRequest, language: ChatLanguage) {
  const name = sub.entityName?.trim() || "Cette technologie";
  const normalized = normalizeMessage(name);
  if (normalized.includes("spring security")) return {
    text: `${name} — ${labels[language].proof}: University Material Resource Management System (${language === "en" ? "Spring Security and role-based access control" : language === "fr" ? "Spring Security et contrôle d'accès par rôles" : language === "ar" ? "Spring Security والتحكم في الوصول حسب الأدوار" : "Spring Security وrole-based access"}).`,
    resources: ["project:resource-management-system"],
  };
  return { text: `${name} ${labels[language].notDocumented}.`, resources: [] as string[] };
}

function experience(language: ChatLanguage) {
  const text: Record<ChatLanguage, string> = {
    en: "Internship — Issam completed a documented two-month Full-Stack internship at École Polytechnique des Génies in Fez, designing Java/Spring Boot REST APIs and integrating React.js.",
    fr: "Stage — Issam a effectué un stage Full-Stack documenté de deux mois à l'École Polytechnique des Génies à Fès, avec conception d'API REST Java/Spring Boot et intégration React.js.",
    ar: "التدريب — أنجز عصام تدريباً موثقاً لمدة شهرين في École Polytechnique des Génies بفاس، وصمم واجهات REST بـ Java/Spring Boot ودمج React.js.",
    darija: "الـ stage — Issam دار stage موثق ديال شهرين فـ École Polytechnique des Génies ففاس، صايب REST APIs بـ Java/Spring Boot ودمج React.js.",
  };
  return { text: text[language], resources: ["profile:cv"] };
}

function education(language: ChatLanguage) {
  const sequence = profile.education.map((item) => `${item.degree} (${item.period})`).reverse().join(" → ");
  return { text: `${language === "ar" ? "المسار الدراسي" : language === "darija" ? "القراية" : language === "fr" ? "Parcours académique" : "Education"}: ${sequence}.`, resources: ["profile:cv"] };
}

function factVerification(sub: SubRequest, language: ChatLanguage) {
  const fact = sub.entityName ?? "The asserted value";
  return { text: `${fact} ${labels[language].notDocumented}; ${language === "fr" ? "je ne peux donc pas le confirmer" : language === "en" ? "so it cannot be confirmed" : language === "ar" ? "ولذلك لا يمكن تأكيده" : "وداكشي علاش ما نقدرش نأكدها"}.`, resources: [] as string[] };
}

function certificationSelection(plan: RequestPlan, sub: SubRequest) {
  const candidates = certifications.filter((cert) => {
    const domain = certificationKnowledge[cert.id].domain;
    return sub.domain === "data_science" ? domain === "data-science" || domain === "machine-learning" : true;
  }).sort((a, b) => {
    if (sub.domain !== "backend") return 0;
    const backendScore = (title: string) => /spring/i.test(title) ? 3 : /software engineering/i.test(title) ? 2 : /java/i.test(title) ? 1 : 0;
    return backendScore(b.title) - backendScore(a.title);
  });
  const selected = candidates.slice(0, countFor(plan, sub, candidates.length));
  return { text: selected.map((cert, i) => `${i + 1}. ${cert.title}${sub.requiresExplanation ? ` — ${certificationKnowledge[cert.id].relevance}` : ""}`).join("\n"), resources: selected.map((c) => `certificate:${c.id}`) };
}

function projectDetail(sub: SubRequest, language: ChatLanguage) {
  const query = normalizeMessage(sub.entityName ?? "");
  const project = projects.find((p) => query.includes(normalizeMessage(p.title)) || normalizeMessage(p.title).includes(query));
  if (!project) return { text: `${sub.entityName ?? "Ce projet"} ${labels[language].notDocumented}.`, resources: [] as string[] };
  return { text: `${project.title} — ${project.shortDescription} ${projectKnowledge[project.slug].objective}`, resources: [`project:${project.slug}`] };
}

function certificationDetail(sub: SubRequest, language: ChatLanguage) {
  const query = normalizeMessage(sub.entityName ?? "");
  const cert = certifications.find((c) => query.includes(normalizeMessage(c.title)) || normalizeMessage(c.title).includes(query));
  if (!cert) return { text: `${sub.entityName ?? "Cette certification"} ${labels[language].notDocumented}.`, resources: [] as string[] };
  return { text: `${cert.title} — ${cert.issuer}${cert.date ? ` (${cert.date})` : ""}.`, resources: [`certificate:${cert.id}`] };
}

function domainComparison(language: ChatLanguage) {
  const text: Record<ChatLanguage, string> = {
    en: "Data Science is currently the stronger documented direction overall because of Issam's current Master's degree, applied ML projects and Data/ML certifications; Backend remains well supported by his internship and Spring enterprise projects.",
    fr: "La Data Science est actuellement le domaine globalement le plus fortement documenté grâce au Master actuel, aux projets ML appliqués et aux certifications Data/ML ; le Backend reste solide grâce au stage et aux projets Spring d'entreprise.",
    ar: "علم البيانات هو المسار الأقوى توثيقاً حالياً بفضل الماستر ومشاريع التعلم الآلي والشهادات، مع بقاء جانب Backend قوياً بفضل التدريب ومشاريع Spring.",
    darija: "Data Science هي اللي باينة أقوى فالتوثيق دابا بفضل الـ Master ومشاريع ML والـ certifications، مع Backend مزيان بفضل الـ stage ومشاريع Spring.",
  };
  return { text: text[language], resources: ["project:water-potability-ml", "project:ticket-management-system"] };
}

function resolveSubRequest(plan: RequestPlan, sub: SubRequest, language: ChatLanguage) {
  switch (sub.intent) {
    case "PROJECT_SELECTION": return projectSelection(plan, sub);
    case "EVIDENCE_SELECTION": return evidenceSelection(plan, sub, language);
    case "TECHNOLOGY_EVIDENCE": return technologyEvidence(sub, language);
    case "EXPERIENCE": return experience(language);
    case "EDUCATION": return education(language);
    case "FACT_VERIFICATION": return factVerification(sub, language);
    case "CERTIFICATION_SELECTION": return certificationSelection(plan, sub);
    case "PROJECT_DETAIL": return projectDetail(sub, language);
    case "CERTIFICATION_DETAIL": return certificationDetail(sub, language);
    case "DOMAIN_COMPARISON": return domainComparison(language);
    case "OUT_OF_SCOPE": return { text: `${labels[language].out}: ${language === "fr" ? "je réponds uniquement sur le portfolio et le CV d'Issam" : language === "en" ? "I only answer from Issam's portfolio and CV" : "أجيب فقط انطلاقاً من ملف عصام وسيرته الذاتية"}.`, resources: [] as string[] };
    default: return null;
  }
}

export function composeRequestPlan(plan: RequestPlan): ComposedPlanResponse | null {
  if (plan.clarificationNeeded) return null;
  const parts: string[] = [];
  const resources: string[] = [];
  const resolved: string[] = [];
  for (const sub of plan.subRequests) {
    const result = resolveSubRequest(plan, sub, plan.language);
    if (!result) return null;
    parts.push(result.text);
    resources.push(...result.resources);
    resolved.push(sub.id);
  }
  const uniqueResources = [...new Set(resources)];
  const projectLimit = plan.globalConstraints.exactCount ?? plan.globalConstraints.maxCount;
  const limitedResources = projectLimit
    ? [...uniqueResources.filter((id) => id.startsWith("project:")).slice(0, projectLimit), ...uniqueResources.filter((id) => !id.startsWith("project:"))]
    : uniqueResources;
  return { answer: parts.join("\n\n"), resourceIds: limitedResources.slice(0, 4), resolvedSubRequestIds: resolved };
}

export function validateComposedResponse(plan: RequestPlan, response: ComposedPlanResponse): boolean {
  if (response.resolvedSubRequestIds.length !== plan.subRequests.length) return false;
  if (!plan.subRequests.every((s) => response.resolvedSubRequestIds.includes(s.id))) return false;
  const limit = plan.globalConstraints.exactCount ?? plan.globalConstraints.maxCount;
  if (limit && response.resourceIds.filter((id) => id.startsWith("project:")).length > limit) return false;
  const mainSelection = plan.subRequests.find((s) => s.intent === "PROJECT_SELECTION" || s.intent === "EVIDENCE_SELECTION");
  const expected = mainSelection?.requestedCount ?? plan.globalConstraints.exactCount;
  if (expected && response.answer.split("\n").filter((line) => /^\d+\./.test(line.trim())).length !== expected) return false;
  if (plan.subRequests.some((s) => (s.intent === "PROJECT_SELECTION" || s.intent === "EVIDENCE_SELECTION") && s.requiresSelection)
    && !response.answer.includes(labels[plan.language].strongest)) return false;
  return true;
}
