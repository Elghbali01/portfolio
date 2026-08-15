import { certificationKnowledge, certifications } from "@/data/certifications";
import { journey } from "@/data/journey";
import { profile } from "@/data/profile";
import { projectKnowledge, projects } from "@/data/projects";
import { aiSkills, dataSkills, devSkills } from "@/data/skills";
import { chatResources } from "./resources";
import { normalizeMessage } from "./language";

type ContextTopic = "journey" | "skills" | "projects" | "certifications";
type Domain = "backend" | "data-science" | "general";

function analyzeQuery(message: string) {
  const text = normalizeMessage(message);
  const topics = new Set<ContextTopic>();
  const backend = /backend|back end|java|spring|api|postgres|enterprise/.test(text);
  const dataScience = /data science|data scientist|machine learning|ml\b|python|pandas|scikit|churn|shap|football intelligence|recommendation|recommandation|cosine|donn[eé]es|علم البيانات/.test(text);
  if (/skill|comp[eé]tence|technology|technologie|kubernetes|مهار|كيعرف|kay3ref/.test(text) || backend || dataScience) topics.add("skills");
  if (/project|projet|مشروع|مشاريع|mashari|chno homa|churn|football|player|joueur|recommendation|recommandation|cosine|shap/.test(text) || /candidate|candidat|poste|role|profil/.test(text)) topics.add("projects");
  if (/certif|certificate|شهاد/.test(text) || (dataScience && /recruiter|recruteur/.test(text))) topics.add("certifications");
  if (/experience|intern|stage|education|study|studies|[eé]tude|parcours|bac|degree|dipl[oô]me|قرا|خبر|candidate|candidat|poste|role|profil/.test(text)) topics.add("journey");
  if (topics.size === 0) {
    topics.add("journey"); topics.add("skills"); topics.add("projects"); topics.add("certifications");
  }
  const domain: Domain = backend && !dataScience ? "backend" : dataScience && !backend ? "data-science" : "general";
  const comparison = /between|compare|compar|versus|vs\b|stronger|plus fort|أقوى/.test(text);
  const selection = /best|meilleur|mieux|most relevant|pertinent|strongest|which|quels?|أفضل|الأكثر صلة/.test(text);
  const explanation = /why|pourquoi|3lach|لماذا/.test(text);
  return { text, topics, domain, comparison, selection, explanation };
}

function selectProjects(text: string, domain: Domain, comparison: boolean) {
  const specific = projects.filter((project) => project.title.toLocaleLowerCase().split(/\s+/).some((word) => word.length > 5 && text.includes(word)));
  const candidates = specific.length ? specific : projects.filter((project) => {
    if (comparison || domain === "general") return true;
    const knowledge = projectKnowledge[project.slug];
    return domain === "backend"
      ? knowledge.primaryDomain === "backend" || knowledge.secondaryDomains.includes("backend")
      : knowledge.primaryDomain === "data-science" || knowledge.secondaryDomains.includes("ai-ml");
  });
  return candidates.map((project) => ({
    title: project.title, slug: project.slug, category: project.category,
    description: specific.includes(project) ? project.fullDescription.trim() : project.shortDescription,
    technologies: project.technologies, featured: project.featured,
    knowledge: projectKnowledge[project.slug],
  }));
}

function selectCertifications(domain: Domain) {
  return certifications.filter((certification) => {
    if (domain === "general") return true;
    const knowledge = certificationKnowledge[certification.id];
    return domain === "backend"
      ? knowledge.domain === "backend-java" || knowledge.domain === "software-engineering"
      : knowledge.domain === "data-science" || knowledge.domain === "machine-learning";
  }).map((certification) => ({ ...certification, knowledge: certificationKnowledge[certification.id] }));
}

export function buildPortfolioContext(message = "") {
  const query = analyzeQuery(message);
  const selectedProjects = query.topics.has("projects") ? selectProjects(query.text, query.domain, query.comparison) : [];
  const selectedCertifications = query.topics.has("certifications") ? selectCertifications(query.domain) : [];
  const projectIds = new Set(selectedProjects.map(({ slug }) => slug));
  const certificationIds = new Set(selectedCertifications.map(({ id }) => id));
  const relevantResources = chatResources.filter((resource) => {
    if (resource.id.startsWith("profile:")) return true;
    const [, id] = resource.id.split(":");
    if (resource.id.startsWith("project:") || resource.id.startsWith("github:")) return projectIds.has(id);
    if (resource.id.startsWith("certificate:")) return certificationIds.has(id);
    return false;
  });
  return {
    queryScope: {
      domain: query.domain,
      comparisonRequested: query.comparison,
      selectionRequested: query.selection,
      explanationRequested: query.explanation,
      responseRequirements: [
        "State the direct conclusion in the first sentence.",
        ...(query.comparison ? ["Make an explicit comparison and choose a stronger side only if the evidence supports it."] : []),
        ...(query.selection ? ["Select a small relevant subset rather than listing everything."] : []),
        ...(query.explanation ? ["Explain why with at least one specific portfolio fact for every selected item."] : []),
      ],
    },
    profile,
    ...(query.topics.has("journey") ? { journey } : {}),
    ...(query.topics.has("skills") ? { skills: {
      development: devSkills.map(({ name }) => name), dataScience: dataSkills.map(({ name }) => name),
      artificialIntelligence: aiSkills.map(({ name }) => name),
    }} : {}),
    ...(selectedProjects.length ? { projects: selectedProjects } : {}),
    ...(selectedCertifications.length ? { certifications: selectedCertifications } : {}),
    availableResources: relevantResources.map(({ id, type, title, description }) => ({ id, type, title, description })),
  };
}
