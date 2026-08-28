import type { MetadataRoute } from "next";
import { locales, projectSlugs, type Locale } from "@/i18n";
import { absoluteUrl, languageAlternates, localizedPath } from "@/lib/site";

interface PublicPath {
  pathname: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

const publicPaths: PublicPath[] = [
  { pathname: "", changeFrequency: "monthly", priority: 1 },
  { pathname: "/projects", changeFrequency: "monthly", priority: 0.9 },
  { pathname: "/certifications", changeFrequency: "monthly", priority: 0.8 },
  ...projectSlugs.map((slug) => ({
    pathname: `/projects/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap(({ pathname, changeFrequency, priority }) => {
    const alternates = Object.fromEntries(
      Object.entries(languageAlternates(pathname)).map(([language, path]) => [language, absoluteUrl(path)]),
    );

    return locales.map((locale: Locale) => ({
      url: absoluteUrl(localizedPath(locale, pathname)),
      changeFrequency,
      priority,
      alternates: { languages: alternates },
    }));
  });
}
