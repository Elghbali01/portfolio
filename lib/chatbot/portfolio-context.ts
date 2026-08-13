import { certifications } from "@/data/certifications";
import { journey } from "@/data/journey";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { aiSkills, dataSkills, devSkills } from "@/data/skills";
import { chatResources } from "./resources";

type ContextTopic = "profile" | "journey" | "skills" | "projects" | "certifications";

function selectTopics(message: string): Set<ContextTopic> {
  const text = message.toLocaleLowerCase();
  const topics = new Set<ContextTopic>(["profile"]);
  if (/skill|comp[eé]tence|technology|technologie|kubernetes|spring|java|python|مهار|كيعرف|kay3ref/.test(text)) topics.add("skills");
  if (/project|projet|مشروع|مشاريع|mashari|chno homa/.test(text)) topics.add("projects");
  if (/certif|certificate|شهاد/.test(text)) topics.add("certifications");
  if (/experience|intern|education|study|studies|étude|parcours|قرا|خبر/.test(text)) topics.add("journey");
  if (topics.size === 1) {
    topics.add("journey");
    topics.add("skills");
    topics.add("projects");
    topics.add("certifications");
  }
  return topics;
}

export function buildPortfolioContext(message = "") {
  const topics = selectTopics(message);
  const normalizedMessage = message.toLocaleLowerCase();
  const relevantResources = chatResources.filter((resource) => {
    if (resource.id.startsWith("profile:")) return true;
    if (resource.id.startsWith("project:") || resource.id.startsWith("github:")) return topics.has("projects");
    if (resource.id.startsWith("certificate:")) return topics.has("certifications");
    return false;
  });
  return {
    profile,
    ...(topics.has("journey") ? { journey } : {}),
    ...(topics.has("skills") ? { skills: {
      development: devSkills.map(({ name }) => name),
      dataScience: dataSkills.map(({ name }) => name),
      artificialIntelligence: aiSkills.map(({ name }) => name),
    }} : {}),
    ...(topics.has("projects") ? { projects: projects.map((project) => {
      const titleWords = project.title.toLocaleLowerCase().split(/\s+/).filter((word) => word.length > 4);
      const isSpecificProject = titleWords.some((word) => normalizedMessage.includes(word));
      return {
        title: project.title,
        slug: project.slug,
        category: project.category,
        description: isSpecificProject ? project.fullDescription.trim() : project.shortDescription,
        technologies: project.technologies,
        featured: project.featured,
      };
    }) } : {}),
    ...(topics.has("certifications") ? { certifications } : {}),
    availableResources: relevantResources.map(({ id, type, title, description }) => ({
      id,
      type,
      title,
      description,
    })),
  };
}
