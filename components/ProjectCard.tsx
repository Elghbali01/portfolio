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
      className="scroll-mt-28 overflow-hidden rounded-xl border border-[#475569] bg-[#1E293B]/50 shadow-xl backdrop-blur-md transition hover:border-[#60A5FA]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0F172A]">
        <Image
          src={project.image}
          alt={imageAlt ?? `${copy.imageAlt} ${project.title}`}
          fill
          quality={76}
          sizes="(min-width: 1280px) 592px, (min-width: 768px) 44vw, 100vw"
          className="object-cover transition duration-500 motion-safe:hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-6">
        <p className="text-sm font-medium text-[#93C5FD]">{project.category}</p>
        <Heading className="text-xl font-semibold text-white">{project.title}</Heading>
        <p className="text-sm leading-relaxed text-[#B7C3D4]">{project.shortDescription}</p>

        <ul className="flex flex-wrap gap-2" aria-label={copy.technologiesLabel}>
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="group relative overflow-hidden rounded-full border border-[#475569] bg-[#0F172A] px-3 py-1 text-xs"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-start scale-x-0 bg-[#94A3B8]/25 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <bdi className="relative z-10 text-[#D4DCE8] transition-colors group-hover:text-white">
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
            className="rounded-sm py-2 text-sm font-medium text-[#93C5FD] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            {isProfileLink ? copy.githubProfile : copy.githubRepository}
            <span aria-hidden="true"> ↗</span>
          </a>

          <Link
            href={`/${locale}/projects/${project.slug}`}
            aria-label={copy.viewDetailsFor.includes("{project}")
              ? copy.viewDetailsFor.replace("{project}", project.title)
              : `${copy.viewDetailsFor} ${project.title}`}
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            {copy.viewDetails}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
