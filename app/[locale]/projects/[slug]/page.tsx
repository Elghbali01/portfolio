import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import DirectionalArrow from "@/components/DirectionalArrow";
import JsonLd from "@/components/JsonLd";
import ProjectCaseStudy from "@/components/ProjectCaseStudy";
import ProjectImageLightbox from "@/components/ProjectImageLightbox";
import {
  formatLocalizedNumber,
  getDictionary,
  getDirection,
  isLocale,
  localeConfig,
  locales,
  projectSlugs,
  toRenderableCaseStudy,
  type Locale,
} from "@/i18n";
import { getLocalizedProject, getLocalizedProjectCards } from "@/lib/localized-portfolio";
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
  const orderedProjects = getLocalizedProjectCards(dictionary);
  const projectIndex = Math.max(0, orderedProjects.findIndex((item) => item.slug === project.slug));
  const previousProject = projectIndex > 0 ? orderedProjects[projectIndex - 1] : null;
  const nextProject = projectIndex < orderedProjects.length - 1 ? orderedProjects[projectIndex + 1] : null;
  const normalizedGithub = project.github.replace(/\.git$/, "").replace(/\/$/, "");
  const isProfileLink = normalizedGithub === "https://github.com/Elghbali01";
  const pageUrl = absoluteUrl(`/${locale}/projects/${project.slug}`);
  const projectOrdinal = new Intl.NumberFormat(localeConfig[locale].intlLocale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(projectIndex + 1);
  const projectPosition = dictionary.projects.detail.projectPosition
    .replace("{current}", formatLocalizedNumber(projectIndex + 1, locale))
    .replace("{total}", formatLocalizedNumber(orderedProjects.length, locale));

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
    <main id="main-content" tabIndex={-1} className="relative min-h-screen px-5 pb-20 pt-28 text-content-primary sm:px-8 md:px-10">
      <JsonLd data={projectJsonLd} />
      <article dir={dir} className="relative z-10 mx-auto max-w-7xl">
        <Breadcrumbs
          locale={locale}
          label={dictionary.breadcrumbs.ariaLabel}
          items={[
            { label: dictionary.breadcrumbs.home, href: `/${locale}` },
            { label: dictionary.breadcrumbs.projects, href: `/${locale}/projects` },
            { label: project.title },
          ]}
        />

        <header className="mt-7 grid gap-0 rounded-[1.6rem] border border-outline-default bg-surface-elevated/60 shadow-xl shadow-black/5 backdrop-blur-md lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10 xl:p-12">
            <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span dir="auto" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">
                <span>{dictionary.projects.card.projectOrdinal}</span>
                <bdi dir="ltr">{projectOrdinal}</bdi>
              </span>
              <span aria-hidden="true" className="size-1 rounded-full bg-outline-default" />
              <p className="text-sm font-medium text-content-secondary">{project.category}</p>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-content-primary sm:text-4xl xl:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-content-secondary sm:text-lg">
              {project.shortDescription}
            </p>

            <section aria-labelledby="technologies-heading" className="mt-8">
              <h2 id="technologies-heading" className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-content-muted">
                {dictionary.projects.detail.technologiesHeading}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <li key={technology} className="rounded-full border border-outline-default bg-surface/70 px-3 py-1.5 text-xs font-medium text-content-strong">
                    <bdi dir="ltr">{technology}</bdi>
                  </li>
                ))}
              </ul>
            </section>

            <div data-chat-safe-zone className="mt-8">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group/source inline-flex min-h-11 items-center gap-2 rounded-lg border border-outline-default bg-surface/70 px-4 py-2.5 text-sm font-semibold text-content-primary transition-[border-color,background-color,color] hover:border-accent hover:bg-surface hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                {isProfileLink ? dictionary.projects.detail.githubProfile : dictionary.projects.detail.githubRepository}
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-200 motion-safe:group-hover/source:-translate-y-0.5 motion-safe:group-hover/source:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div className="relative aspect-[16/9] min-w-0 rounded-b-[1.6rem] bg-surface-inset lg:aspect-auto lg:min-h-[32rem] lg:self-stretch lg:rounded-e-[1.6rem] lg:rounded-b-none">
            <ProjectImageLightbox
              images={[{ src: project.image, alt: project.imageAlt }]}
              locale={localeConfig[locale].intlLocale}
              label={dictionary.projects.detail.projectImageLabel.replace("{project}", project.title)}
              closeLabel={dictionary.common.close}
              previousLabel={dictionary.common.previous}
              nextLabel={dictionary.common.next}
              imageCounterLabel={dictionary.projects.detail.imageCounterLabel}
            />
          </div>
        </header>

        <div className="mt-14 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          {project.translation.caseStudy.length > 0 && (
            <aside className="min-w-0">
              <nav
                aria-label={dictionary.projects.detail.contentsLabel}
                className="rounded-2xl border border-outline-subtle bg-surface-elevated/55 p-4 sm:p-5 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
              >
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-content-muted">
                  {dictionary.projects.detail.contentsLabel}
                </h2>
                <ol className="mt-3 space-y-1 border-s border-outline-subtle ps-3">
                  {project.translation.caseStudy.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group/contents flex items-start gap-2 rounded-md px-2 py-2 text-sm leading-snug text-content-secondary transition-colors hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      >
                        <span dir="ltr" aria-hidden="true" className="shrink-0 text-xs tabular-nums text-content-muted">
                          {formatLocalizedNumber(index + 1, locale)}
                        </span>
                        <span className="min-w-0">{section.heading}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}

          <section id="case-study" aria-labelledby="case-study-heading" className="min-w-0 scroll-mt-28">
            <div className="border-b border-outline-subtle pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">{dictionary.projects.detail.caseStudyHeading}</p>
              <h2 id="case-study-heading" className="mt-2 text-2xl font-bold tracking-tight text-content-primary sm:text-3xl">
                {project.title}
              </h2>
            </div>
            <ProjectCaseStudy
              content={toRenderableCaseStudy(project.translation, locale, project.technologies)}
              technologies={project.technologies}
              lang={locale}
              dir={dir}
              projectTitle={project.title}
              architectureDiagramLabel={dictionary.projects.detail.architectureDiagramLabel}
              className="mt-7"
            />
          </section>
        </div>

        <footer className="mt-16 border-t border-outline-subtle pt-7">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-content-muted">
            {projectPosition}
          </p>
          <nav aria-label={dictionary.projects.detail.projectNavigationLabel} className="grid gap-3 sm:grid-cols-2">
            {previousProject ? (
              <Link
                href={`/${locale}/projects/${previousProject.slug}`}
                className="group/nav flex min-h-20 items-center gap-4 rounded-xl border border-outline-default bg-surface-elevated/45 p-4 transition-[border-color,background-color] hover:border-accent hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <DirectionalArrow locale={locale} direction="back" className="size-5 shrink-0 text-accent-soft transition-transform duration-200 group-hover/nav:-translate-x-0.5 rtl:group-hover/nav:translate-x-0.5" />
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-content-muted">{dictionary.projects.detail.previousProject}</span>
                  <span className="mt-1 block truncate font-semibold text-content-primary">{previousProject.title}</span>
                </span>
              </Link>
            ) : <span aria-hidden="true" className="hidden sm:block" />}

            {nextProject ? (
              <Link
                href={`/${locale}/projects/${nextProject.slug}`}
                className="group/nav flex min-h-20 items-center justify-end gap-4 rounded-xl border border-outline-default bg-surface-elevated/45 p-4 text-end transition-[border-color,background-color] hover:border-accent hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-medium text-content-muted">{dictionary.projects.detail.nextProject}</span>
                  <span className="mt-1 block truncate font-semibold text-content-primary">{nextProject.title}</span>
                </span>
                <DirectionalArrow locale={locale} direction="forward" className="size-5 shrink-0 text-accent-soft transition-transform duration-200 group-hover/nav:translate-x-0.5 rtl:group-hover/nav:-translate-x-0.5" />
              </Link>
            ) : <span aria-hidden="true" className="hidden sm:block" />}
          </nav>

          <div className="mt-6 flex justify-center">
            <Link
              href={`/${locale}/projects`}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-accent px-5 py-2.5 text-sm font-semibold text-accent-soft transition-[background-color,color] hover:bg-action hover:text-on-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <DirectionalArrow locale={locale} direction="back" />
              {dictionary.projects.detail.backToProjects}
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
