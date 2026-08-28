import Link from "next/link";
import DirectionalArrow from "@/components/DirectionalArrow";
import ProjectCard, { type ProjectCardData, type ProjectCardLabels } from "@/components/ProjectCard";
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
    viewDetailsFor: "View project details for",
    imageAlt: "Preview of",
    technologiesLabel: "Technologies used",
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
    <section id="projects" className="relative min-h-screen scroll-mt-24 px-6 py-24 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            {copy.title} <span className="text-[#60A5FA]">{copy.highlightedTitle}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#B7C3D4]">{copy.introduction}</p>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              locale={locale}
              labels={copy.card}
              imageAlt={imageAlts[project.slug]}
            />
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <div data-chat-safe-zone>
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#60A5FA] px-7 py-3 text-sm font-medium text-[#93C5FD] transition-all duration-300 hover:bg-[#2563EB] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {copy.viewAll} ({totalCount})
              <DirectionalArrow locale={locale} direction="forward" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
