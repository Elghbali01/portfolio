import {
  defaultLocale,
  isLocale,
  localeConfig,
  type Locale,
} from "./config";
import type {
  PluralForms,
  ProjectTranslation,
  RenderableCaseStudy,
  RenderableCaseStudyBlock,
} from "./types";

const localePrefixPattern = /^\/(en|fr|ar)(?=\/|$)/;

/**
 * Replaces an existing locale prefix or adds one while preserving the path,
 * query string, and hash. This helper intentionally does not inspect browser
 * state and is safe to call from Server Components.
 */
export function localizePath(path: string, locale: Locale): string {
  const url = new URL(path || "/", "https://portfolio.local");
  const pathname = url.pathname.replace(localePrefixPattern, "") || "/";
  const localizedPath = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return `${localizedPath}${url.search}${url.hash}`;
}

export function getLocaleFromPath(pathname: string): Locale | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return firstSegment && isLocale(firstSegment) ? firstSegment : null;
}

export function stripLocaleFromPath(pathname: string): string {
  const stripped = pathname.replace(localePrefixPattern, "");
  return stripped || "/";
}

export function getLocalizedAlternates(path: string): Record<Locale | "x-default", string> {
  return {
    en: localizePath(path, "en"),
    fr: localizePath(path, "fr"),
    ar: localizePath(path, "ar"),
    "x-default": localizePath(path, defaultLocale),
  };
}

export function formatLocalizedDate(
  value: Date | string | number,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid date value: ${String(value)}`);
  }

  return new Intl.DateTimeFormat(localeConfig[locale].intlLocale, options).format(date);
}

export function formatLocalizedNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(localeConfig[locale].intlLocale, options).format(value);
}

export function formatCount(
  count: number,
  locale: Locale,
  forms: PluralForms,
): string {
  const pluralCategory = new Intl.PluralRules(localeConfig[locale].intlLocale).select(count);
  const template = forms[pluralCategory] ?? forms.other;
  return template.replace("{count}", formatLocalizedNumber(count, locale));
}

/** Converts dictionary case-study data into the serializable renderer shape. */
export function toRenderableCaseStudy(
  translation: ProjectTranslation,
  locale: Locale,
  technologyTerms: readonly string[] = [],
): RenderableCaseStudy {
  return {
    lang: localeConfig[locale].htmlLang,
    dir: localeConfig[locale].direction,
    technologyTerms,
    introduction: translation.introduction.map((text) => ({
      type: "paragraph" as const,
      text,
    })),
    sections: translation.caseStudy.map((section) => {
      const blocks: RenderableCaseStudyBlock[] = [];

      for (const text of section.paragraphs ?? []) {
        blocks.push({ type: "paragraph", text });
      }

      if (section.items && section.items.length > 0) {
        blocks.push({ type: "list", items: section.items });
      }

      if (section.metrics && section.metrics.length > 0) {
        blocks.push({
          type: "list",
          items: section.metrics.map((metric) => `${metric.label}: ${metric.value}`),
        });
      }

      return {
        id: section.id,
        heading: section.heading,
        blocks,
      };
    }),
  };
}
