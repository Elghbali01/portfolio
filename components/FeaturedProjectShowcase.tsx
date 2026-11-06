"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import DirectionalArrow from "@/components/DirectionalArrow";
import type { ProjectCardData, ProjectCardLabels } from "@/components/ProjectCard";
import { localeConfig, type Locale } from "@/i18n/config";

interface FeaturedProjectShowcaseProps {
  project: ProjectCardData;
  index: number;
  ordinal: number;
  total: number;
  locale: Locale;
  labels: ProjectCardLabels;
  imageAlt?: string;
}

export default function FeaturedProjectShowcase({
  project,
  index,
  ordinal,
  total,
  locale,
  labels,
  imageAlt,
}: FeaturedProjectShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const normalizedGithub = project.github.replace(/\.git$/, "").replace(/\/$/, "");
  const isProfileLink = normalizedGithub === "https://github.com/Elghbali01";
  const number = (value: number) => new Intl.NumberFormat(localeConfig[locale].intlLocale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(value);
  const detailLabel = labels.viewDetailsFor.includes("{project}")
    ? labels.viewDetailsFor.replace("{project}", project.title)
    : `${labels.viewDetailsFor} ${project.title}`;
  const shownTechnologies = project.technologies.slice(0, 4);
  const moreCount = project.technologies.length - shownTechnologies.length;
  const moreLabel = labels.moreTechnologies.replace(
    "{count}",
    new Intl.NumberFormat(localeConfig[locale].intlLocale).format(moreCount),
  );
  const isReversed = index % 2 === 1;

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : index * 0.1 }}
      viewport={{ once: true, amount: 0.12 }}
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      dir={localeConfig[locale].direction}
      className="group grid overflow-hidden rounded-[1.6rem] border border-outline-default bg-surface-elevated/65 shadow-xl shadow-black/5 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-glow-primary/10 lg:grid-cols-12"
    >
      <div className={`relative min-h-64 bg-surface-inset sm:min-h-80 lg:col-span-7 lg:min-h-[27rem] ${isReversed ? "lg:col-start-6" : "lg:col-start-1"}`}>
        <Image
          src={project.image}
          alt={imageAlt ?? `${labels.imageAlt} ${project.title}`}
          fill
          quality={86}
          sizes="(min-width: 1280px) 58vw, (min-width: 768px) 55vw, 100vw"
          className="object-contain transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.015]"
          priority={index === 0}
        />
        <span dir="auto" className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-full border border-outline-default/70 bg-surface/90 px-3.5 py-2 text-xs font-semibold tracking-wide text-content-primary shadow-lg backdrop-blur-md sm:start-7 sm:top-7">
          <span>{labels.projectOrdinal}</span>
          <bdi dir="ltr">{number(ordinal)}</bdi>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
          <span className="text-content-muted"><bdi dir="ltr">{number(index + 1)} / {number(total)}</bdi></span>
        </span>
      </div>

      <div className={`flex flex-col justify-center gap-6 p-6 sm:p-9 lg:col-span-5 lg:p-10 xl:p-12 ${isReversed ? "lg:col-start-1 lg:row-start-1" : ""}`}>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">{project.category}</p>
          <h3 className="text-2xl font-bold leading-tight tracking-tight text-content-primary sm:text-3xl xl:text-4xl">
            {project.title}
          </h3>
          <p className="max-w-xl text-base leading-relaxed text-content-secondary sm:text-lg">
            {project.shortDescription}
          </p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label={labels.technologiesLabel}>
          {shownTechnologies.map((technology) => (
            <li key={technology} className="rounded-full border border-outline-default bg-surface/70 px-3 py-1.5 text-xs font-medium text-content-strong">
              <bdi dir="ltr">{technology}</bdi>
            </li>
          ))}
          {moreCount > 0 && <li aria-hidden="true" className="rounded-full border border-dashed border-outline-default px-3 py-1.5 text-xs text-content-secondary">{moreLabel}</li>}
          {moreCount > 0 && <li className="sr-only">{moreLabel}: {project.technologies.slice(shownTechnologies.length).join(", ")}</li>}
        </ul>

        <div data-chat-safe-zone className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-outline-subtle pt-5">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            aria-label={detailLabel}
            className="group/details inline-flex min-h-12 items-center gap-2 rounded-lg bg-action px-5 py-3 text-sm font-semibold text-on-action shadow-md shadow-glow-primary/10 transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-action-hover hover:shadow-glow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {labels.viewDetails}
            <DirectionalArrow locale={locale} direction="forward" className="size-4 transition-transform duration-200 motion-safe:group-hover/details:translate-x-0.5 rtl:group-hover/details:-translate-x-0.5" />
          </Link>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group/source inline-flex min-h-11 items-center gap-1.5 rounded-md py-2 text-sm font-medium text-content-secondary transition-colors hover:text-accent-soft hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {isProfileLink ? labels.githubProfile : labels.githubRepository}
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-200 motion-safe:group-hover/source:-translate-y-0.5 motion-safe:group-hover/source:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
