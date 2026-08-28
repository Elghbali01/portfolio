import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
const configuredSiteUrl =
  publicSiteUrl ||
  (vercelProductionUrl
    ? `https://${vercelProductionUrl}`
    : "http://localhost:3000");

export const siteUrl = new URL(configuredSiteUrl);
export const siteName = "Issam Elghbali — Portfolio";

export const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_MA",
};

export function localizedPath(locale: Locale, pathname = "") {
  const suffix = pathname === "/" ? "" : pathname;
  return `/${locale}${suffix}`;
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteUrl).toString();
}

export function languageAlternates(pathname = ""): Record<string, string> {
  const entries = locales.map(
    (locale) => [locale, localizedPath(locale, pathname)] as const,
  );
  return Object.fromEntries([
    ...entries,
    ["x-default", localizedPath(defaultLocale, pathname)],
  ]);
}

interface LocalizedMetadataInput {
  locale: Locale;
  pathname?: string;
  title: string;
  titleTemplate?: string;
  description: string;
  imageAlt?: string;
  type?: "website" | "article";
}

export function buildLocalizedMetadata({
  locale,
  pathname = "",
  title,
  titleTemplate,
  description,
  imageAlt = title,
  type = "website",
}: LocalizedMetadataInput): Metadata {
  const canonical = localizedPath(locale, pathname);
  const resolvedTitle = titleTemplate ? titleTemplate.replace("%s", title) : title;

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      type,
      title: resolvedTitle,
      description,
      siteName,
      url: canonical,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => openGraphLocales[candidate]),
      images: [
        {
          url: localizedPath(locale, "/social-card"),
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [localizedPath(locale, "/social-card")],
    },
  };
}
