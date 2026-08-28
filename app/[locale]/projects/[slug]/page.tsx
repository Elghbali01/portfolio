import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import DirectionalArrow from "@/components/DirectionalArrow";
import JsonLd from "@/components/JsonLd";
import ProjectCaseStudy from "@/components/ProjectCaseStudy";
import {
  getDictionary,
  getDirection,
  isLocale,
  locales,
  projectSlugs,
  toRenderableCaseStudy,
  type Locale,
} from "@/i18n";
import { getLocalizedProject } from "@/lib/localized-portfolio";
import { absoluteUrl, buildLocalizedMetadata } from "@/lib/site";

interface ProjectPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

async function resolvePage(params: ProjectPageProps["params"]) {
  const { locale: localeValue, slug } = await params;
  if (!isLocale(localeValue)) notFound();
  const locale: Locale = localeValue;
  const dictionary = await getDictionary(locale);
  const project = getLocalizedProject(slug, dictionary);
  if (!project) notFound();
  return { locale, dictionary, project };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale, dictionary, project } = await resolvePage(params);
  return buildLocalizedMetadata({
    locale,
    pathname: `/projects/${project.slug}`,
    title: project.translation.seo.title,
    titleTemplate: dictionary.seo.titleTemplate,
    description: project.translation.seo.description,
    imageAlt: project.imageAlt,
    type: "article",
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, dictionary, project } = await resolvePage(params);
  const dir = getDirection(locale);
  const normalizedGithub = project.github.replace(/\.git$/, "").replace(/\/$/, "");
  const isProfileLink = normalizedGithub === "https://github.com/Elghbali01";
  const pageUrl = absoluteUrl(`/${locale}/projects/${project.slug}`);

  const projectJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.shortDescription,
    url: pageUrl,
    image: absoluteUrl(project.image),
    inLanguage: locale,
    applicationCategory: project.category,
    programmingLanguage: project.technologies,
    author: {
      "@type": "Person",
      name: "Issam Elghbali",
      url: absoluteUrl(`/${locale}`),
    },
  };
  if (!isProfileLink) projectJsonLd.codeRepository = project.github;

  return (
    <main id="main-content" tabIndex={-1} className="relative min-h-screen px-6 pb-16 pt-28 text-white md:px-10">
      <JsonLd data={projectJsonLd} />
      <article className="relative z-10 mx-auto max-w-6xl">
        <Breadcrumbs
          locale={locale}
          label={dictionary.breadcrumbs.ariaLabel}
          items={[
            { label: dictionary.breadcrumbs.home, href: `/${locale}` },
            { label: dictionary.breadcrumbs.projects, href: `/${locale}/projects` },
            { label: project.title },
          ]}
        />

        <div className="overflow-hidden rounded-2xl border border-[#475569] bg-[#1E293B]/50 shadow-xl backdrop-blur-md">
          <div className="relative aspect-[16/9] overflow-hidden bg-[#020617]">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              quality={76}
              sizes="(min-width: 1280px) 1152px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
              className="object-contain"
            />
          </div>

          <div className="p-6 md:p-10 lg:p-12">
            <p className="mb-3 text-sm font-medium text-[#93C5FD]">{project.category}</p>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">{project.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[#B7C3D4]">
              {project.shortDescription}
            </p>

            <section aria-labelledby="technologies-heading" className="mt-8">
              <h2 id="technologies-heading" className="sr-only">
                {dictionary.projects.detail.technologiesHeading}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <li key={technology} className="rounded-full border border-[#526176] bg-[#0F172A] px-3 py-1 text-xs text-[#D4DCE8]">
                    <bdi dir="ltr">{technology}</bdi>
                  </li>
                ))}
              </ul>
            </section>

            <ProjectCaseStudy
              content={toRenderableCaseStudy(project.translation, locale, project.technologies)}
              technologies={project.technologies}
              lang={locale}
              dir={dir}
              className="mt-12"
            />

            <div data-chat-safe-zone className="mt-12 flex flex-wrap gap-4">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 font-medium text-white transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
              >
                {isProfileLink ? dictionary.projects.detail.githubProfile : dictionary.projects.detail.githubRepository}
                <span aria-hidden="true">↗</span>
              </a>
              <Link
                href={`/${locale}/projects`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#526176] px-5 py-3 font-medium text-[#D4DCE8] transition hover:border-[#60A5FA] hover:text-[#93C5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
              >
                <DirectionalArrow locale={locale} direction="back" />
                {dictionary.projects.detail.backToProjects}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
