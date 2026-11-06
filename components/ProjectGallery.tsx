"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import ProjectCard, { type ProjectCardData, type ProjectCardLabels } from "@/components/ProjectCard";
import { formatCount, formatLocalizedNumber, type Locale, type PluralForms } from "@/i18n";
import { projectFilterIds, type ProjectFilterId, type ProjectDomainFilter } from "@/lib/project-gallery";

export interface ProjectGalleryItem extends ProjectCardData {
  ordinal: number;
  filters: readonly ProjectDomainFilter[];
}

export interface ProjectGalleryLabels {
  filterLabel: string;
  count: PluralForms;
  filters: Record<ProjectFilterId, string>;
  emptyTitle: string;
  emptyDescription: string;
  reset: string;
}

interface ProjectGalleryProps {
  projects: readonly ProjectGalleryItem[];
  locale: Locale;
  labels: ProjectGalleryLabels;
  cardLabels: ProjectCardLabels;
  collectionLabel: string;
  imageAlts: Readonly<Record<string, string>>;
}

export default function ProjectGallery({
  projects,
  locale,
  labels,
  cardLabels,
  collectionLabel,
  imageAlts,
}: ProjectGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterId>("all");
  const shouldReduceMotion = useReducedMotion();

  const visibleProjects = useMemo(
    () => activeFilter === "all"
      ? projects
      : projects.filter((project) => project.filters.includes(activeFilter as ProjectDomainFilter)),
    [activeFilter, projects],
  );

  const counts = useMemo(() => {
    const result: Record<ProjectFilterId, number> = {
      all: projects.length,
      "software-engineering": 0,
      "data-science-ai": 0,
      "web-development": 0,
    };
    for (const filter of projectFilterIds.slice(1) as readonly ProjectDomainFilter[]) {
      result[filter] = projects.reduce(
        (count, project) => count + (project.filters.includes(filter) ? 1 : 0),
        0,
      );
    }
    return result;
  }, [projects]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-outline-subtle bg-surface-elevated/55 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-content-muted">{labels.filterLabel}</p>
          <p role="status" className="mt-1 text-sm font-medium text-content-secondary">
            {formatCount(visibleProjects.length, locale, labels.count)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={labels.filterLabel}>
          {projectFilterIds.map((filter) => {
            const selected = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={selected}
                aria-controls="project-gallery-grid"
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:px-4 ${selected
                  ? "border-accent bg-action text-on-action shadow-sm shadow-glow-primary/10"
                  : "border-outline-default bg-surface text-content-secondary hover:border-accent hover:text-content-primary"
                }`}
              >
                <span>{labels.filters[filter]}</span>
                <span dir="ltr" className={`rounded-full px-1.5 py-0.5 text-xs tabular-nums ${selected ? "bg-white/15 text-on-action" : "bg-surface-elevated text-content-muted"}`}>
                  {formatLocalizedNumber(counts[filter], locale)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section id="project-gallery-grid" aria-label={collectionLabel} className="scroll-mt-28">
        <motion.div layout className="grid items-stretch gap-6 md:grid-cols-2 xl:gap-8">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
                className="min-w-0"
              >
                <ProjectCard
                  project={project}
                  index={index}
                  ordinal={project.ordinal}
                  locale={locale}
                  headingLevel="h2"
                  imageAlt={imageAlts[project.slug]}
                  labels={cardLabels}
                />
              </motion.div>
            ))}
            {visibleProjects.length === 0 && (
              <motion.div
                key="empty-state"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                className="col-span-full rounded-2xl border border-dashed border-outline-default bg-surface-elevated/45 px-6 py-12 text-center"
              >
                <h2 className="text-xl font-semibold text-content-primary">{labels.emptyTitle}</h2>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-content-secondary">{labels.emptyDescription}</p>
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-action px-4 py-2 text-sm font-semibold text-on-action transition hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {labels.reset}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
