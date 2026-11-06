import {
  skillDomainIds,
  technicalSkills,
  type SkillDomainId,
  type TechnicalSkill,
} from "@/data/skills";
import {
  getLocalizedProject,
  type LocalizedProject,
} from "@/lib/localized-portfolio";
import { localizePath, projectSlugs, type Dictionary, type Locale } from "@/i18n";

export interface TechnicalWorkflowNode {
  id: string;
  label: string;
  skillIds: readonly string[];
}

export interface TechnicalWorkflow {
  heading: string;
  nodes: readonly TechnicalWorkflowNode[];
}

export interface TechnicalArsenalProject {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  href: string;
  technologies: readonly string[];
  workflow?: TechnicalWorkflow;
}

export interface SkillProjectEvidence {
  slug: string;
  title: string;
  href: string;
  workflowSteps: readonly string[];
}

export interface TechnicalArsenalSkill extends TechnicalSkill {
  projectEvidence: readonly SkillProjectEvidence[];
}

export interface TechnicalArsenalDomain {
  id: SkillDomainId;
  title: string;
  descriptor: string;
  description: string;
  accentToken: "--theme-accent" | "--theme-accent-secondary" | "--theme-glow-secondary" | "--theme-glow-tertiary";
  defaultSkillId: string;
  skills: readonly TechnicalArsenalSkill[];
  relatedProject: TechnicalArsenalProject;
}

const domainConfiguration: Record<SkillDomainId, {
  accentToken: TechnicalArsenalDomain["accentToken"];
  defaultSkillId: string;
  relatedProjectSlug: (typeof projectSlugs)[number];
}> = {
  "backend-engineering": {
    accentToken: "--theme-accent-secondary",
    defaultSkillId: "spring-boot",
    relatedProjectSlug: "resource-management-system",
  },
  "frontend-engineering": {
    accentToken: "--theme-accent",
    defaultSkillId: "react",
    relatedProjectSlug: "personal-portfolio",
  },
  "data-science": {
    accentToken: "--theme-glow-tertiary",
    defaultSkillId: "python",
    relatedProjectSlug: "customer-churn-prediction",
  },
  "ai-machine-learning": {
    accentToken: "--theme-glow-secondary",
    defaultSkillId: "machine-learning",
    relatedProjectSlug: "football-intelligence-player-recommendation-system",
  },
};

const technologyAliases: Readonly<Record<string, string>> = {
  "react js": "react",
  reactjs: "react",
  html: "html5",
  css: "css3",
};

function normalizeTechnologyName(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, " ")
    .trim();
}

const skillIdByNormalizedName = new Map<string, string>();
for (const skill of technicalSkills) {
  skillIdByNormalizedName.set(normalizeTechnologyName(skill.name), skill.id);
}

function resolveSkillId(technologyName: string): string | undefined {
  const normalizedName = normalizeTechnologyName(technologyName);
  const aliasedName = technologyAliases[normalizedName] ?? normalizedName;
  return skillIdByNormalizedName.get(aliasedName);
}

function skillIdsForWorkflowLabel(label: string): string[] {
  const normalizedLabel = normalizeTechnologyName(label);
  const labelTokens = normalizedLabel.split(" ");
  const includesPhrase = (phrase: string) => {
    const phraseTokens = phrase.split(" ");
    return labelTokens.some((_, index) =>
      labelTokens.slice(index, index + phraseTokens.length).join(" ") === phrase,
    );
  };
  const direct = [...skillIdByNormalizedName.entries()]
    .filter(([normalizedName]) => includesPhrase(normalizedName))
    .map(([, id]) => id);

  if (
    normalizedLabel.includes("api rest") ||
    normalizedLabel.includes("apis rest") ||
    normalizedLabel.includes("rest apis")
  ) {
    const restApiId = resolveSkillId("REST API");
    if (restApiId) direct.push(restApiId);
  }

  return [...new Set(direct)];
}

function getProjectWorkflow(project: LocalizedProject): TechnicalWorkflow | undefined {
  const section = project.translation.caseStudy.find(
    (caseStudySection) => caseStudySection.architectureFlow && caseStudySection.architectureFlow.length > 0,
  );
  if (!section?.architectureFlow) return undefined;

  return {
    heading: section.heading,
    nodes: section.architectureFlow.map((label, index) => ({
      id: `${project.slug}-step-${index + 1}`,
      label,
      skillIds: skillIdsForWorkflowLabel(label),
    })),
  };
}

function toArsenalProject(project: LocalizedProject, locale: Locale): TechnicalArsenalProject {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    shortDescription: project.shortDescription,
    image: project.image,
    imageAlt: project.imageAlt,
    href: localizePath(`/projects/${project.slug}`, locale),
    technologies: project.technologies,
    workflow: getProjectWorkflow(project),
  };
}

export function getTechnicalArsenalDomains(
  dictionary: Dictionary,
  locale: Locale,
): TechnicalArsenalDomain[] {
  const localizedProjects = projectSlugs.flatMap((slug) => {
    const project = getLocalizedProject(slug, dictionary);
    return project ? [toArsenalProject(project, locale)] : [];
  });
  const projectBySlug = new Map(localizedProjects.map((project) => [project.slug, project]));

  const projectSkillIds = new Map<string, Set<string>>();
  for (const project of localizedProjects) {
    for (const technology of project.technologies) {
      const skillId = resolveSkillId(technology);
      if (!skillId) continue;
      const associatedProjects = projectSkillIds.get(skillId) ?? new Set<string>();
      associatedProjects.add(project.slug);
      projectSkillIds.set(skillId, associatedProjects);
    }
  }

  return skillDomainIds.map((id) => {
    const configuration = domainConfiguration[id];
    const relatedProject = projectBySlug.get(configuration.relatedProjectSlug);
    if (!relatedProject) {
      throw new Error(`Technical Arsenal project association is missing: ${configuration.relatedProjectSlug}`);
    }

    const skills: TechnicalArsenalSkill[] = technicalSkills
      .filter((skill) => skill.domains.includes(id))
      .map((skill) => {
        const associatedProjects = projectSkillIds.get(skill.id) ?? new Set<string>();
        const projectEvidence = [...associatedProjects].flatMap((slug) => {
          const project = projectBySlug.get(slug);
          if (!project) return [];
          return [{
            slug: project.slug,
            title: project.title,
            href: project.href,
            workflowSteps: project.workflow?.nodes
              .filter((node) => node.skillIds.includes(skill.id))
              .map((node) => node.label) ?? [],
          }];
        });

        return { ...skill, projectEvidence };
      });

    const domainSkillIds = new Set(skills.map((skill) => skill.id));
    const domainProject: TechnicalArsenalProject = {
      ...relatedProject,
      workflow: relatedProject.workflow && {
        ...relatedProject.workflow,
        nodes: relatedProject.workflow.nodes.map((node) => ({
          ...node,
          skillIds: node.skillIds.filter((skillId) => domainSkillIds.has(skillId)),
        })),
      },
    };

    const copy = dictionary.skills.domains[id];
    return {
      id,
      title: copy.title,
      descriptor: copy.descriptor,
      description: copy.description,
      accentToken: configuration.accentToken,
      defaultSkillId: configuration.defaultSkillId,
      skills,
      relatedProject: domainProject,
    };
  });
}
