import type { ProjectCardData } from "@/components/ProjectCard";
import { certifications, type Certification } from "@/data/certifications";
import { projects, type Project } from "@/data/projects";
import {
  certificationIds,
  experienceIds,
  formatLocalizedDate,
  projectSlugs,
  type CertificationId,
  type Dictionary,
  type ExperienceId,
  type Locale,
  type ProjectSlug,
} from "@/i18n";

const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
const certificationById = new Map(certifications.map((certification) => [certification.id, certification]));

function isProjectSlug(value: string): value is ProjectSlug {
  return (projectSlugs as readonly string[]).includes(value);
}

function isCertificationId(value: string): value is CertificationId {
  return (certificationIds as readonly string[]).includes(value);
}

export interface LocalizedProject extends Project {
  imageAlt: string;
  translation: Dictionary["projects"]["items"][ProjectSlug];
}

export function getLocalizedProject(
  slug: string,
  dictionary: Dictionary,
): LocalizedProject | null {
  if (!isProjectSlug(slug)) return null;
  const project = projectBySlug.get(slug);
  if (!project) return null;
  const translation = dictionary.projects.items[slug];

  return {
    ...project,
    title: translation.title,
    category: translation.category,
    shortDescription: translation.shortDescription,
    imageAlt: translation.imageAlt,
    translation,
  };
}

export function getLocalizedProjectCards(dictionary: Dictionary): ProjectCardData[] {
  return projects.flatMap((project) => {
    const localized = getLocalizedProject(project.slug, dictionary);
    if (!localized) return [];
    return [
      {
        title: localized.title,
        slug: localized.slug,
        category: localized.category,
        shortDescription: localized.shortDescription,
        technologies: localized.technologies,
        github: localized.github,
        image: localized.image,
      },
    ];
  });
}

export function getLocalizedFeaturedProjectCards(dictionary: Dictionary): ProjectCardData[] {
  const featuredSlugs = new Set(projects.filter((project) => project.featured).map((project) => project.slug));
  return getLocalizedProjectCards(dictionary).filter((project) => featuredSlugs.has(project.slug));
}

export function getLocalizedCertifications(
  dictionary: Dictionary,
  locale: Locale,
): Certification[] {
  return certifications.flatMap((certification) => {
    if (!isCertificationId(certification.id)) return [];
    const translation = dictionary.certifications.items[certification.id];
    return [
      {
        ...certification,
        title: translation.title,
        issuer: translation.issuer,
        date: certification.date
          ? formatLocalizedDate(certification.date, locale)
          : undefined,
      },
    ];
  });
}

export function getLocalizedFeaturedCertifications(
  dictionary: Dictionary,
  locale: Locale,
): Certification[] {
  return getLocalizedCertifications(dictionary, locale).filter((certification) => certification.featured);
}

export function getCertificationImageAlt(id: string, dictionary: Dictionary) {
  return isCertificationId(id) ? dictionary.certifications.items[id].imageAlt : "";
}

export function getLocalizedJourney(dictionary: Dictionary) {
  return experienceIds.map((id: ExperienceId) => ({
    id,
    ...dictionary.experience.items[id],
  }));
}

export function getBaseProject(slug: string) {
  return projectBySlug.get(slug) ?? null;
}

export function getBaseCertification(id: string) {
  return certificationById.get(id) ?? null;
}
