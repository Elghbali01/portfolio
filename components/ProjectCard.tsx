"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";

export type ProjectCardData = Pick<
  Project,
  "title" | "slug" | "category" | "shortDescription" | "technologies" | "github" | "image"
>;

export interface ProjectCardLabels {
  githubRepository: string;
  githubProfile: string;
  viewDetails: string;
  viewDetailsFor: string;
  imageAlt: string;
  technologiesLabel: string;
}

const defaultLabels: ProjectCardLabels = {
  githubRepository: "GitHub repository",
  githubProfile: "GitHub profile",
  viewDetails: "View details",
  viewDetailsFor: "View project details for",
  imageAlt: "Preview of",
  technologiesLabel: "Technologies used",
};

interface ProjectCardProps {
  project: ProjectCardData;
  index: number;
  locale?: Locale;
  labels?: Partial<ProjectCardLabels>;
  headingLevel?: "h2" | "h3";
  imageAlt?: string;
}

export default function ProjectCard({
  project,
  index,
  locale = "en",
  labels,
  headingLevel = "h3",
  imageAlt,
}: ProjectCardProps) {
  const copy = { ...defaultLabels, ...labels };
  const shouldReduceMotion = useReducedMotion();
  const Heading = headingLevel;
  const normalizedGithub = project.github.replace(/\.git$/, "").replace(/\/$/, "");
  const isProfileLink = normalizedGithub === "https://github.com/Elghbali01";

  return (
    <motion.article
      id={project.slug}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : Math.min(index * 0.08, 0.32) }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      className="group scroll-mt-28 overflow-hidden rounded-xl border border-outline-default bg-surface-elevated/50 shadow-xl backdrop-blur-md transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent hover:shadow-lg hover:shadow-glow-primary/10 focus-within:border-accent"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        <Image
          src={project.image}
          alt={imageAlt ?? `${copy.imageAlt} ${project.title}`}
          fill
          quality={76}
          sizes="(min-width: 1280px) 592px, (min-width: 768px) 44vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
        />
      </div>

      <div className="space-y-4 p-6">
        <p className="text-sm font-medium text-accent-soft">{project.category}</p>
        <Heading className="text-xl font-semibold text-content-primary">{project.title}</Heading>
        <p className="text-sm leading-relaxed text-content-secondary">{project.shortDescription}</p>

        <ul className="flex flex-wrap gap-2" aria-label={copy.technologiesLabel}>
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="group relative overflow-hidden rounded-full border border-outline-default bg-surface px-3 py-1 text-xs"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-start scale-x-0 bg-content-subtle/25 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <bdi className="relative z-10 text-content-strong transition-colors group-hover:text-content-primary">
                {technology}
              </bdi>
            </li>
          ))}
        </ul>

        <div data-chat-safe-zone className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1 rounded-sm py-2 text-sm font-medium text-accent-soft transition-colors duration-200 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {isProfileLink ? copy.githubProfile : copy.githubRepository}
            <span aria-hidden="true" className="transition-transform duration-200 motion-safe:group-hover/link:translate-x-0.5 motion-safe:group-hover/link:-translate-y-0.5">↗</span>
          </a>

          <Link
            href={`/${locale}/projects/${project.slug}`}
            aria-label={copy.viewDetailsFor.includes("{project}")
              ? copy.viewDetailsFor.replace("{project}", project.title)
              : `${copy.viewDetailsFor} ${project.title}`}
            className="group/details inline-flex items-center gap-1 rounded-lg bg-action px-4 py-2 text-sm font-medium text-on-action transition-[background-color,box-shadow] duration-300 hover:bg-action-hover hover:shadow-md hover:shadow-glow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {copy.viewDetails}
            <span aria-hidden="true" className="transition-transform duration-200 motion-safe:group-hover/details:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
