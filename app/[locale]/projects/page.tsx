import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import DirectionalArrow from "@/components/DirectionalArrow";
import JsonLd from "@/components/JsonLd";
import ProjectGallery, { type ProjectGalleryItem } from "@/components/ProjectGallery";
import Reveal from "@/components/Reveal";
import { getDictionary, isLocale, projectSlugs, type Locale } from "@/i18n";
import { getProjectDomainFilters } from "@/lib/project-gallery";
import { getLocalizedProjectCards } from "@/lib/localized-portfolio";
import { absoluteUrl, buildLocalizedMetadata } from "@/lib/site";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

async function resolveLocale(params: ProjectsPageProps["params"]): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);
  return buildLocalizedMetadata({
    locale,
    pathname: "/projects",
    title: dictionary.seo.projects.title,
    titleTemplate: dictionary.seo.titleTemplate,
    description: dictionary.seo.projects.description,
    imageAlt: dictionary.seo.openGraphImageAlt,
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);
  const projects = getLocalizedProjectCards(dictionary);
  const galleryProjects: ProjectGalleryItem[] = projects.map((project, index) => ({
    ...project,
    ordinal: index + 1,
    filters: getProjectDomainFilters(project.slug),
  }));
  const imageAlts = Object.fromEntries(projectSlugs.map((slug) => [slug, dictionary.projects.items[slug].imageAlt]));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dictionary.seo.projects.title,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: absoluteUrl(`/${locale}/projects/${project.slug}`),
    })),
  };

  return (
    <main id="main-content" tabIndex={-1} className="relative min-h-screen px-6 pb-16 pt-28 text-content-primary md:px-10">
      <JsonLd data={itemListJsonLd} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <Breadcrumbs
          locale={locale}
          label={dictionary.breadcrumbs.ariaLabel}
          items={[
            { label: dictionary.breadcrumbs.home, href: `/${locale}` },
            { label: dictionary.breadcrumbs.projects },
          ]}
        />

        <Reveal className="mb-16 text-center">
          <h1 className="text-3xl font-bold md:text-5xl">
            {dictionary.projects.listing.titleLead}{" "}
            <span className="text-accent">{dictionary.projects.listing.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-content-secondary">
            {dictionary.projects.listing.description}
          </p>
        </Reveal>

        <ProjectGallery
          projects={galleryProjects}
          locale={locale}
          collectionLabel={dictionary.projects.listing.collectionLabel}
          imageAlts={imageAlts}
          cardLabels={{
            githubRepository: dictionary.projects.card.githubRepository,
            githubProfile: dictionary.projects.card.githubProfile,
            viewDetails: dictionary.projects.card.viewDetails,
            viewDetailsFor: dictionary.projects.card.viewDetailsFor,
            imageAlt: dictionary.projects.card.imageAlt,
            technologiesLabel: dictionary.projects.card.technologiesLabel,
            moreTechnologies: dictionary.projects.card.moreTechnologies,
            projectOrdinal: dictionary.projects.card.projectOrdinal,
          }}
          labels={{
            filterLabel: dictionary.projects.listing.filters.label,
            count: dictionary.projects.listing.count,
            filters: {
              all: dictionary.projects.listing.filters.all,
              "software-engineering": dictionary.projects.listing.filters.softwareEngineering,
              "data-science-ai": dictionary.projects.listing.filters.dataScienceAi,
              "web-development": dictionary.projects.listing.filters.webDevelopment,
            },
            emptyTitle: dictionary.projects.listing.filters.emptyTitle,
            emptyDescription: dictionary.projects.listing.filters.emptyDescription,
            reset: dictionary.projects.listing.filters.reset,
          }}
        />

        <div data-chat-safe-zone className="mt-16 flex justify-center">
          <Link
            href={`/${locale}#projects`}
            className="inline-flex items-center gap-2 rounded-lg border border-outline-default px-7 py-3 text-sm font-medium text-content-strong transition hover:border-accent hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <DirectionalArrow locale={locale} direction="back" />
            {dictionary.projects.listing.backToPortfolio}
          </Link>
        </div>
      </div>
    </main>
  );
}
