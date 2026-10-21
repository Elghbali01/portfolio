import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";

const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeConfiguredUrl(value: string, source: string): URL {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error(`${source} must be a valid http(s) URL.`);
  }

  if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error(`${source} must contain only an http(s) origin without credentials, path, query or hash.`);
  }
  return url;
}

function isLocalOrigin(url: URL): boolean {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
}

function resolveSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelEnvironment = process.env.VERCEL_ENV?.trim();
  const previewUrl = process.env.VERCEL_URL?.trim();
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  let configuredValue = explicit;
  let configuredSource = "NEXT_PUBLIC_SITE_URL";

  if (!configuredValue && vercelEnvironment === "preview") {
    configuredValue = previewUrl;
    configuredSource = "VERCEL_URL";
  }
  if (!configuredValue && vercelEnvironment === "production") {
    configuredValue = productionUrl;
    configuredSource = "VERCEL_PROJECT_PRODUCTION_URL";
  }

  if (!configuredValue) {
    if (process.env.NODE_ENV !== "production" && !vercelEnvironment) {
      return new URL(LOCAL_SITE_URL);
    }
    throw new Error(
      "Public site origin is not configured. Set NEXT_PUBLIC_SITE_URL, or provide the appropriate Vercel URL for this deployment.",
    );
  }

  const url = normalizeConfiguredUrl(configuredValue, configuredSource);
  if ((process.env.NODE_ENV === "production" || Boolean(vercelEnvironment)) && isLocalOrigin(url)) {
    throw new Error(`${configuredSource} cannot use localhost as a public origin in production or preview.`);
  }
  return url;
}

export const siteUrl = resolveSiteUrl();
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
