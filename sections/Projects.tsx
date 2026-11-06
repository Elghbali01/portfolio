import Link from "next/link";
import DirectionalArrow from "@/components/DirectionalArrow";
import FeaturedProjectShowcase from "@/components/FeaturedProjectShowcase";
import type { ProjectCardData, ProjectCardLabels } from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { featuredProjects, projects as allProjects } from "@/data/projects";
import type { Locale } from "@/i18n/config";

export interface ProjectsCopy {
  title: string;
  highlightedTitle: string;
  introduction: string;
  viewAll: string;
  card: ProjectCardLabels;
}

const defaultCopy: ProjectsCopy = {
  title: "Featured",
  highlightedTitle: "Projects",
  introduction:
    "A selection of projects spanning full-stack development, data products, and maintainable software architecture.",
  viewAll: "View all projects",
  card: {
    githubRepository: "GitHub repository",
    githubProfile: "GitHub profile",
    viewDetails: "View details",
    viewDetailsFor: "View project details for {project}",
    imageAlt: "Preview of",
    technologiesLabel: "Technologies used",
    moreTechnologies: "+{count} more",
    projectOrdinal: "Project",
  },
};

function toCardData(project: (typeof allProjects)[number]): ProjectCardData {
  return {
    title: project.title,
    slug: project.slug,
    category: project.category,
    shortDescription: project.shortDescription,
    technologies: project.technologies,
    github: project.github,
    image: project.image,
  };
}

interface ProjectsProps {
  locale?: Locale;
  copy?: Omit<Partial<ProjectsCopy>, "card"> & {
    card?: Partial<ProjectCardLabels>;
  };
  projects?: ProjectCardData[];
  totalCount?: number;
  imageAlts?: Record<string, string>;
}

export default function Projects({
  locale = "en",
  copy: overrides,
  projects = featuredProjects.slice(0, 2).map(toCardData),
  totalCount = allProjects.length,
  imageAlts = {},
}: ProjectsProps) {
  const copy: ProjectsCopy = {
    ...defaultCopy,
    ...overrides,
    card: { ...defaultCopy.card, ...overrides?.card },
  };

  return (
    <section id="projects" className="relative scroll-mt-24 px-5 py-24 text-content-primary sm:px-8 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-14 text-center md:mb-16">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">{copy.title}</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            <span className="text-content-primary">{copy.highlightedTitle}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-content-secondary">{copy.introduction}</p>
        </Reveal>

        <div className="space-y-8 md:space-y-10">
          {projects.map((project, index) => {
            const originalIndex = allProjects.findIndex((item) => item.slug === project.slug);
            return (
              <FeaturedProjectShowcase
                key={project.slug}
                project={project}
                index={index}
                ordinal={originalIndex >= 0 ? originalIndex + 1 : index + 1}
                total={totalCount}
                locale={locale}
                labels={copy.card}
                imageAlt={imageAlts[project.slug]}
              />
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-12 flex justify-center md:mt-14">
          <div data-chat-safe-zone>
            <Link
              href={`/${locale}/projects`}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-accent px-6 py-3 text-sm font-semibold text-accent-soft transition-[background-color,color,box-shadow] duration-200 hover:bg-action hover:text-on-action hover:shadow-md hover:shadow-glow-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {copy.viewAll} <span dir="ltr" className="tabular-nums">({totalCount})</span>
              <DirectionalArrow locale={locale} direction="forward" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
