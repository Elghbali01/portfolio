import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import DirectionalArrow from "@/components/DirectionalArrow";
import JsonLd from "@/components/JsonLd";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { formatCount, getDictionary, isLocale, projectSlugs, type Locale } from "@/i18n";
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
    <main id="main-content" tabIndex={-1} className="relative min-h-screen px-6 pb-16 pt-28 text-white md:px-10">
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
            <span className="text-[#60A5FA]">{dictionary.projects.listing.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#B7C3D4]">
            {dictionary.projects.listing.description}
          </p>
          <p className="mt-3 text-sm text-[#A8B6CA]">
            {formatCount(projects.length, locale, dictionary.projects.listing.count)}
          </p>
        </Reveal>

        <section aria-label={dictionary.projects.listing.collectionLabel} className="grid gap-10 lg:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              locale={locale}
              headingLevel="h2"
              imageAlt={imageAlts[project.slug]}
              labels={{
                githubRepository: dictionary.projects.card.githubRepository,
                githubProfile: dictionary.projects.card.githubProfile,
                viewDetails: dictionary.projects.card.viewDetails,
                viewDetailsFor: dictionary.projects.card.viewDetailsFor,
                technologiesLabel: dictionary.projects.card.technologiesLabel,
              }}
            />
          ))}
        </section>

        <div data-chat-safe-zone className="mt-16 flex justify-center">
          <Link
            href={`/${locale}#projects`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#526176] px-7 py-3 text-sm font-medium text-[#D4DCE8] transition hover:border-[#60A5FA] hover:text-[#93C5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            <DirectionalArrow locale={locale} direction="back" />
            {dictionary.projects.listing.backToPortfolio}
          </Link>
        </div>
      </div>
    </main>
  );
}
