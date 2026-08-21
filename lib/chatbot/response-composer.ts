import { certificationKnowledge, certifications } from "@/data/certifications";
import { profile } from "@/data/profile";
import { projectKnowledge, projects } from "@/data/projects";
import { aiSkills, dataSkills, devSkills } from "@/data/skills";
import { normalizeMessage } from "./language";
import type { RequestPlan, SubRequest } from "./request-plan";
import type { ChatLanguage } from "./types";

export interface ComposedPlanResponse { answer: string; resourceIds: string[]; resolvedSubRequestIds: string[]; coveredAspects: string[] }

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
  if (sub.scope === "cv") {
    const names = profile.cvDocumentedProjects.map(({ title }) => title);
    const intro = plan.language === "fr" ? "Projets Machine Learning documentés dans le CV" : plan.language === "en" ? "Machine Learning projects documented in the CV" : "مشاريع التعلم الآلي الموثقة في السيرة الذاتية";
    return { text: `${intro}: ${names.join(" ; ")}.`, resources: ["project:customer-churn-prediction", "profile:cv"] };
  }
  const candidates = domain === "data_science" || domain === "ai"
    ? projects.filter((p) => projectKnowledge[p.slug].primaryDomain === "data-science")
    : domain === "backend" ? backendSlugs.map((slug) => projects.find((p) => p.slug === slug)!).filter(Boolean) : projects;
  const selected = candidates.slice(0, countFor(plan, sub, candidates.length));
  if (!selected.length) return null;
  const lines = selected.map((project, index) => {
    const reason = localizedProjectReason(project.slug, plan.language);
    return `${index + 1}. ${project.title}${sub.requiresExplanation ? ` — ${reason}` : ""}`;
  });
  if (sub.requiresSelection) lines[lines.length - 1] += ` ${labels[plan.language].strongest}: ${selected[0].title}.`;
  return { text: lines.join("\n"), resources: selected.map((p) => `project:${p.slug}`) };
}

function skillSelection(sub: SubRequest, language: ChatLanguage) {
  const cvSkills = new Set<string>(profile.cvTechnicalSkills);
  const source = sub.domain === "backend" ? devSkills : sub.domain === "ai" ? aiSkills : dataSkills;
  const preferred = sub.domain === "backend"
    ? ["Java", "Spring Boot", "Spring Security", "REST API", "Spring Data JPA", "PostgreSQL", "MySQL"]
    : sub.domain === "ai"
      ? ["Machine Learning", "Deep Learning", "Supervised Learning", "Unsupervised Learning", "Classification", "Regression", "Clustering", "Cross-Validation", "Hyperparameter Tuning", "SHAP"]
      : ["Python", "NumPy", "Pandas", "SQL", "Scikit-Learn", "Exploratory Data Analysis (EDA)", "Data Cleaning", "Feature Engineering", "Statistics", "Model Evaluation", "Data Visualization"];
  const available = new Set(source.map(({ name }) => name));
  const selected = preferred.filter((name) => available.has(name) && (sub.scope !== "cv" || cvSkills.has(name) || [...cvSkills].some((item) => normalizeMessage(item) === normalizeMessage(name))));
  const fallbackCv = sub.scope === "cv" && sub.domain === "ai"
    ? profile.cvTechnicalSkills.filter((name) => /scikit|classification|regression|clustering|cross-validation|hyperparameter|shap|deep learning|mlops/i.test(name))
    : [];
  const skills = fallbackCv.length ? fallbackCv : selected;
  const heading = sub.domain === "backend" ? "Backend" : sub.domain === "ai" ? "Machine Learning" : "Data Science";
  const sourceLabel = sub.scope === "cv" ? (language === "fr" ? " dans le CV" : language === "en" ? " in the CV" : " في السيرة الذاتية") : "";
  return { text: `${heading}${sourceLabel}: ${skills.join(", ")}.`, resources: sub.scope === "cv" ? ["profile:cv"] : [] as string[] };
}

function skillComparison(language: ChatLanguage) {
  const text: Record<ChatLanguage, string> = {
    en: "Comparison: the Data Science toolkit is centered on data preparation, exploration, statistics and model evaluation, while the Backend toolkit is centered on Java/Spring services, security, persistence and REST API architecture. These are complementary documented strengths; no absolute proficiency score is defined.",
    fr: "Comparaison : le socle Data Science est centré sur la préparation et l’exploration des données, les statistiques et l’évaluation de modèles, tandis que le socle Backend est centré sur les services Java/Spring, la sécurité, la persistance et l’architecture d’API REST. Ce sont deux forces documentées complémentaires, sans niveau absolu inventé.",
    ar: "المقارنة: تركز مهارات علم البيانات على إعداد البيانات واستكشافها والإحصاء وتقييم النماذج، بينما تركز مهارات Backend على خدمات Java/Spring والأمان والتخزين وبنية REST. وهما جانبان موثقان متكاملان دون اختلاق تقييم مطلق.",
    darija: "المقارنة: Data Science مركزة على preparation وEDA وstatistics وmodel evaluation، وBackend مركز على Java/Spring services وsecurity وpersistence وREST architecture. بجوج نقاط قوة موثقين ومتكاملين بلا ما نخترعو niveau مطلق.",
  };
  return { text: text[language], resources: [] as string[] };
}

function projectComparison(sub: SubRequest, language: ChatLanguage) {
  const names = (sub.entityName ?? "").split("|||");
  const selected = names.map((name) => projects.find((project) => normalizeMessage(project.title) === normalizeMessage(name))).filter((project): project is (typeof projects)[number] => Boolean(project));
  if (selected.length !== 2) return null;
  const [first, second] = selected;
  const firstKnowledge = projectKnowledge[first.slug];
  const secondKnowledge = projectKnowledge[second.slug];
  const intro = language === "fr" ? "Comparaison documentée" : language === "en" ? "Documented comparison" : "مقارنة موثقة";
  const contrast = language === "fr"
    ? `${first.title} met davantage l’accent sur ${firstKnowledge.demonstratedCapabilities.slice(0, 3).join(", ")}, tandis que ${second.title} met davantage l’accent sur ${secondKnowledge.demonstratedCapabilities.slice(0, 3).join(", ")}. Aucun score absolu ne permet de déclarer arbitrairement l’un supérieur à l’autre.`
    : `${first.title} emphasizes ${firstKnowledge.demonstratedCapabilities.slice(0, 3).join(", ")}, while ${second.title} emphasizes ${secondKnowledge.demonstratedCapabilities.slice(0, 3).join(", ")}. No documented absolute score makes either project universally superior.`;
  return { text: `${intro}: ${contrast}`, resources: selected.map(({ slug }) => `project:${slug}`) };
}

function educationProjectAlignment(language: ChatLanguage) {
  const text: Record<ChatLanguage, string> = {
    en: "Education/project alignment: the current Data Science Master's is most directly reflected by Water Potability Prediction, Customer Churn Prediction and Football Intelligence through applied modeling, evaluation, explainability and recommendation systems.",
    fr: "Lien formation/projets : le Master Data Science actuel se reflète directement dans Water Potability Prediction, Customer Churn Prediction et Football Intelligence par la modélisation appliquée, l’évaluation, l’explicabilité et les systèmes de recommandation.",
    ar: "الربط بين التكوين والمشاريع: ينعكس ماستر علم البيانات مباشرة في مشاريع Water Potability وCustomer Churn وFootball Intelligence من خلال النمذجة والتقييم والتفسير وأنظمة التوصية.",
    darija: "العلاقة بين القراية والمشاريع: Master Data Science باين مباشرة فـ Water Potability وCustomer Churn وFootball Intelligence من خلال modeling وevaluation وexplainability وrecommendation systems.",
  };
  return { text: text[language], resources: ["project:water-potability-ml", "project:customer-churn-prediction"] };
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
    if (sub.scope === "cv") return (profile.cvCertificationIds as readonly string[]).includes(cert.id);
    if (sub.domain === "ai") return domain === "machine-learning";
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
    case "SKILL_SELECTION": return skillSelection(sub, language);
    case "SKILL_COMPARISON": return skillComparison(language);
    case "PROJECT_COMPARISON": return projectComparison(sub, language);
    case "EDUCATION_PROJECT_ALIGNMENT": return educationProjectAlignment(language);
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
  const coveredAspects: string[] = [];
  for (const sub of plan.subRequests) {
    const result = resolveSubRequest(plan, sub, plan.language);
    if (!result) return null;
    parts.push(result.text);
    resources.push(...result.resources);
    resolved.push(sub.id);
    if (sub.aspect) coveredAspects.push(sub.aspect);
  }
  const uniqueResources = [...new Set(resources)];
  const projectLimit = plan.globalConstraints.exactCount ?? plan.globalConstraints.maxCount;
  const limitedResources = plan.requiredAspects?.length
    ? [...uniqueResources.filter((id) => id.startsWith("project:")).slice(0, 2), ...uniqueResources.filter((id) => !id.startsWith("project:")).slice(0, 2)]
    : projectLimit
    ? [...uniqueResources.filter((id) => id.startsWith("project:")).slice(0, projectLimit), ...uniqueResources.filter((id) => !id.startsWith("project:"))]
    : uniqueResources;
  return { answer: parts.join("\n\n"), resourceIds: limitedResources.slice(0, 4), resolvedSubRequestIds: resolved, coveredAspects };
}

export function validateComposedResponse(plan: RequestPlan, response: ComposedPlanResponse): boolean {
  if (response.resolvedSubRequestIds.length !== plan.subRequests.length) return false;
  if (!plan.subRequests.every((s) => response.resolvedSubRequestIds.includes(s.id))) return false;
  if (plan.requiredAspects?.some((aspect) => !response.coveredAspects.includes(aspect))) return false;
  const limit = plan.globalConstraints.exactCount ?? plan.globalConstraints.maxCount;
  if (limit && response.resourceIds.filter((id) => id.startsWith("project:")).length > limit) return false;
  const mainSelection = plan.subRequests.find((s) => s.intent === "PROJECT_SELECTION" || s.intent === "EVIDENCE_SELECTION");
  const expected = mainSelection?.requestedCount ?? plan.globalConstraints.exactCount;
  if (expected && response.answer.split("\n").filter((line) => /^\d+\./.test(line.trim())).length !== expected) return false;
  if (plan.subRequests.some((s) => (s.intent === "PROJECT_SELECTION" || s.intent === "EVIDENCE_SELECTION") && s.requiresSelection)
    && !response.answer.includes(labels[plan.language].strongest)) return false;
  return true;
}
