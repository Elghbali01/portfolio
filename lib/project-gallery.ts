import { projectKnowledge } from "@/data/projects";

export const projectFilterIds = [
  "all",
  "software-engineering",
  "data-science-ai",
  "web-development",
] as const;

export type ProjectFilterId = (typeof projectFilterIds)[number];
export type ProjectDomainFilter = Exclude<ProjectFilterId, "all">;

/**
 * Uses the repository's explicit, slug-keyed domain classification. Category
 * membership never depends on translated names or description text.
 */
export function getProjectDomainFilters(slug: string): ProjectDomainFilter[] {
  const knowledge = projectKnowledge[slug];
  if (!knowledge) return [];

  const domains = new Set<string>([knowledge.primaryDomain, ...knowledge.secondaryDomains]);
  const filters: ProjectDomainFilter[] = [];

  if (domains.has("backend") || domains.has("fullstack")) {
    filters.push("software-engineering");
  }

  if (["data-science", "ai-ml", "data-engineering"].some((domain) => domains.has(domain))) {
    filters.push("data-science-ai");
  }

  if (domains.has("frontend") || domains.has("fullstack")) {
    filters.push("web-development");
  }

  return filters;
}
