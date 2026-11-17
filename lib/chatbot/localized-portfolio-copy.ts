import type { CertificationId, ProjectSlug } from "@/i18n/types";
import ar from "@/i18n/dictionaries/ar";
import en from "@/i18n/dictionaries/en";
import fr from "@/i18n/dictionaries/fr";
import type { ChatLanguage } from "./types";

export function getLocalizedProjectCopy(slug: string, language: ChatLanguage) {
  const key = slug as ProjectSlug;
  const dictionary = language === "fr" ? fr : language === "ar" ? ar : en;
  const copy = dictionary.projects.items[key];
  const detail = copy && language !== "darija"
    ? [
        copy.shortDescription,
        copy.introduction[0],
        ...copy.caseStudy.slice(0, 2).flatMap((section) => [
          ...("paragraphs" in section ? section.paragraphs.slice(0, 1) : []),
          ...("items" in section ? section.items.slice(0, 1) : []),
          ...("architectureFlow" in section ? section.architectureFlow.slice(0, 5) : []),
        ]),
      ].filter(Boolean).join(" ")
    : undefined;
  return copy ? { title: copy.title, shortDescription: language === "darija" ? undefined : copy.shortDescription, detail } : null;
}

export function getLocalizedCertificationCopy(id: string, language: ChatLanguage) {
  const key = id as CertificationId;
  const dictionary = language === "fr" ? fr : language === "ar" ? ar : en;
  const copy = dictionary.certifications.items[key];
  return copy ? { title: copy.title, issuer: copy.issuer } : null;
}
