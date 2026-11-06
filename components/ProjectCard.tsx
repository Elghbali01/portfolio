"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import DirectionalArrow from "@/components/DirectionalArrow";
import type { Project } from "@/data/projects";
import { localeConfig, type Locale } from "@/i18n/config";

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
  moreTechnologies: string;
  projectOrdinal: string;
}

const defaultLabels: ProjectCardLabels = {
  githubRepository: "GitHub repository",
  githubProfile: "GitHub profile",
  viewDetails: "View details",
  viewDetailsFor: "View project details for",
  imageAlt: "Preview of",
  technologiesLabel: "Technologies used",
  moreTechnologies: "+{count} more",
  projectOrdinal: "Project",
};

interface ProjectCardProps {
  project: ProjectCardData;
  index: number;
  ordinal?: number;
  locale?: Locale;
  labels?: Partial<ProjectCardLabels>;
  headingLevel?: "h2" | "h3";
  imageAlt?: string;
}

export default function ProjectCard({
  project,
  index,
  ordinal = index + 1,
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
  const detailLabel = copy.viewDetailsFor.includes("{project}")
    ? copy.viewDetailsFor.replace("{project}", project.title)
    : `${copy.viewDetailsFor} ${project.title}`;
  const number = new Intl.NumberFormat(localeConfig[locale].intlLocale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(ordinal);
  const visibleTechnologies = project.technologies.slice(0, 4);
  const hiddenTechnologyCount = Math.max(0, project.technologies.length - visibleTechnologies.length);
  const hiddenTechnologyLabel = copy.moreTechnologies.replace(
    "{count}",
    new Intl.NumberFormat(localeConfig[locale].intlLocale).format(hiddenTechnologyCount),
  );

  return (
    <motion.article
      id={project.slug}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.25) }}
      viewport={{ once: true, amount: 0.08 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      className="group overflow-hidden rounded-[1.4rem] border border-outline-default bg-surface-elevated/70 shadow-xl shadow-black/5 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent hover:shadow-lg hover:shadow-glow-primary/10 focus-within:border-accent"
    >
      <Link
        href={`/${locale}/projects/${project.slug}`}
        aria-label={detailLabel}
        className="relative block aspect-[16/9] overflow-hidden bg-surface-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
      >
        <Image
          src={project.image}
          alt={imageAlt ?? `${copy.imageAlt} ${project.title}`}
          fill
          quality={82}
          sizes="(min-width: 1280px) 592px, (min-width: 768px) 46vw, 100vw"
          className="object-contain transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02]"
        />
      </Link>

      <div className="space-y-5 p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p dir="auto" className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
            <bdi>{copy.projectOrdinal}</bdi>{" "}<bdi dir="ltr">{number}</bdi>
          </p>
          <p className="rounded-full border border-outline-default bg-surface px-3 py-1 text-xs font-medium text-content-secondary">
            {project.category}
          </p>
        </div>

        <div className="space-y-3">
          <Heading className="text-2xl font-semibold leading-tight tracking-tight text-content-primary transition-colors duration-200 group-hover:text-accent-soft md:text-[1.75rem]">
            {project.title}
          </Heading>
          <p className="max-w-3xl text-sm leading-relaxed text-content-secondary md:text-base">
            {project.shortDescription}
          </p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label={copy.technologiesLabel}>
          {visibleTechnologies.map((technology) => (
            <li
              key={technology}
              className="group/pill relative overflow-hidden rounded-full border border-outline-default bg-surface px-3 py-1.5 text-xs"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-start scale-x-0 bg-content-subtle/20 transition-transform duration-300 ease-out group-hover/pill:scale-x-100" />
              <bdi dir="ltr" className="relative z-10 text-content-strong">{technology}</bdi>
            </li>
          ))}
          {hiddenTechnologyCount > 0 && (
            <li aria-hidden="true" className="rounded-full border border-dashed border-outline-default px-3 py-1.5 text-xs text-content-secondary">
              {hiddenTechnologyLabel}
            </li>
          )}
          {hiddenTechnologyCount > 0 && (
            <li className="sr-only">
              {hiddenTechnologyLabel}: {project.technologies.slice(visibleTechnologies.length).join(", ")}
            </li>
          )}
        </ul>

        <div data-chat-safe-zone className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-subtle pt-5">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group/source inline-flex min-h-10 items-center gap-1.5 rounded-md py-2 text-sm font-medium text-content-secondary transition-colors duration-200 hover:text-accent-soft hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {isProfileLink ? copy.githubProfile : copy.githubRepository}
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-200 motion-safe:group-hover/source:-translate-y-0.5 motion-safe:group-hover/source:translate-x-0.5" />
          </a>

          <Link
            href={`/${locale}/projects/${project.slug}`}
            aria-label={detailLabel}
            className="group/details inline-flex min-h-11 items-center gap-2 rounded-lg bg-action px-5 py-2.5 text-sm font-semibold text-on-action shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-action-hover hover:shadow-md hover:shadow-glow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {copy.viewDetails}
            <DirectionalArrow locale={locale} direction="forward" className="size-4 transition-transform duration-200 group-hover/details:translate-x-0.5 rtl:group-hover/details:-translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
