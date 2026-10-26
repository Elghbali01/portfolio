import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { certificationIds, getDictionary, getDirection, isLocale, projectSlugs, type Locale } from "@/i18n";
import {
  getLocalizedFeaturedCertifications,
  getLocalizedFeaturedProjectCards,
  getLocalizedJourney,
} from "@/lib/localized-portfolio";
import { absoluteUrl, buildLocalizedMetadata } from "@/lib/site";
import About from "@/sections/About";
import Certifications from "@/sections/Certifications";
import Contact from "@/sections/Contact";
import Experience from "@/sections/Experience";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

async function resolveLocale(params: HomePageProps["params"]): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);
  return buildLocalizedMetadata({
    locale,
    title: dictionary.seo.home.title,
    titleTemplate: dictionary.seo.titleTemplate,
    description: dictionary.seo.home.description,
    imageAlt: dictionary.seo.openGraphImageAlt,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);
  const dir = getDirection(locale);
  const [firstName, ...lastNameParts] = dictionary.hero.name.split(" ");
  const featuredProjects = getLocalizedFeaturedProjectCards(dictionary).slice(0, 2);
  const featuredCertifications = getLocalizedFeaturedCertifications(dictionary, locale);
  const projectImageAlts = Object.fromEntries(
    projectSlugs.map((slug) => [slug, dictionary.projects.items[slug].imageAlt]),
  );
  const certificationImageAlts = Object.fromEntries(
    certificationIds.map((id) => [id, dictionary.certifications.items[id].imageAlt]),
  );

  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: dictionary.seo.home.title,
    description: dictionary.seo.home.description,
    url: absoluteUrl(`/${locale}`),
    inLanguage: locale,
    mainEntity: {
      "@type": "Person",
      name: "Issam Elghbali",
      url: absoluteUrl(`/${locale}`),
      image: absoluteUrl("/profile.webp"),
      jobTitle: dictionary.hero.stableHeadline,
      sameAs: [
        "https://github.com/Elghbali01",
        "https://www.linkedin.com/in/issam-elghbali-2937b6258/",
      ],
      knowsAbout: [
        "Software Engineering",
        "Data Science",
        "Machine Learning",
        "Spring Boot",
        "React",
        "Python",
      ],
    },
  };

  return (
    <main id="main-content" tabIndex={-1} className="relative overflow-hidden" aria-label={dictionary.accessibility.mainContentLabel}>
      <JsonLd data={profilePageJsonLd} />
      <Hero
        locale={locale}
        copy={{
          eyebrow: dictionary.hero.greeting,
          firstName,
          lastName: lastNameParts.join(" "),
          roles: [...dictionary.hero.rotatingRoles],
          descriptor: dictionary.hero.stableHeadline,
          viewProjects: dictionary.hero.viewProjects,
          contact: dictionary.hero.contactMe,
          downloadCv: dictionary.hero.downloadCv,
          imageAlt: dictionary.hero.profileImageAlt,
          linkedinLabel: dictionary.hero.linkedinLabel,
          githubLabel: dictionary.hero.githubLabel,
        }}
      />
      <About
        rtl={dir === "rtl"}
        copy={{
          title: dictionary.about.titleLead,
          highlightedTitle: dictionary.about.titleAccent,
          summary: dictionary.about.summary,
          paragraphs: [...dictionary.about.paragraphs],
          cards: dictionary.about.focusAreas.map(({ title, description }) => ({ title, description })),
        }}
      />
      <Projects
        locale={locale}
        projects={featuredProjects}
        imageAlts={projectImageAlts}
        copy={{
          title: dictionary.projects.section.titleLead,
          highlightedTitle: dictionary.projects.section.titleAccent,
          introduction: dictionary.projects.section.description,
          viewAll: dictionary.projects.section.viewAll,
          card: {
            githubRepository: dictionary.projects.card.githubRepository,
            githubProfile: dictionary.projects.card.githubProfile,
            viewDetails: dictionary.projects.card.viewDetails,
            viewDetailsFor: dictionary.projects.card.viewDetailsFor,
            technologiesLabel: dictionary.projects.card.technologiesLabel,
          },
        }}
      />
      <Skills
        content={{
          title: dictionary.skills.titleLead,
          titleAccent: dictionary.skills.titleAccent,
          introduction: dictionary.skills.description,
          developerTitle: dictionary.skills.developerTitle,
          developerDescription: dictionary.skills.developerDescription,
          dataTitle: dictionary.skills.dataScientistTitle,
          dataDescription: dictionary.skills.dataScientistDescription,
          technologiesLabel: dictionary.skills.technologiesLabel,
          developmentLabel: dictionary.skills.categories.development,
          dataScienceLabel: dictionary.skills.categories.dataScience,
          aiLabel: dictionary.skills.categories.aiMachineLearning,
        }}
      />
      <Certifications
        locale={locale}
        certifications={featuredCertifications}
        imageAlts={certificationImageAlts}
        copy={{
          title: dictionary.certifications.section.titleLead,
          highlightedTitle: dictionary.certifications.section.titleAccent,
          introduction: dictionary.certifications.section.description,
          viewAll: dictionary.certifications.section.viewAll,
          card: {
            previewCertificateAriaLabel: dictionary.certifications.card.previewCertificate,
            verifyCertificate: dictionary.certifications.card.verify,
            verifyCertificateAriaLabel: `${dictionary.certifications.card.verifyCertificate}: {title} (${dictionary.common.opensInNewTab})`,
            viewOnLinkedIn: dictionary.certifications.card.viewOnLinkedIn,
            viewOnLinkedInAriaLabel: `${dictionary.certifications.card.viewOnLinkedIn}: {title} (${dictionary.common.opensInNewTab})`,
            credentialUnavailable: dictionary.common.notAvailable,
          },
        }}
      />
      <Experience
        dir={dir}
        items={getLocalizedJourney(dictionary)}
        labels={{
          heading: dictionary.experience.titleLead,
          headingHighlight: dictionary.experience.titleAccent,
          description: dictionary.experience.description,
          timelineLabel: dictionary.experience.timelineLabel,
        }}
      />
      <Contact
        dir={dir}
        labels={{
          heading: dictionary.contact.titleLead,
          headingHighlight: dictionary.contact.titleAccent,
          description: dictionary.contact.description,
          formAriaLabel: dictionary.contact.formLabel,
          emailLinkAriaLabel: dictionary.contact.emailLabel,
          linkedInLinkAriaLabel: dictionary.contact.linkedinLabel,
          githubLinkAriaLabel: dictionary.contact.githubLabel,
          nameLabel: dictionary.contact.fields.name.label,
          namePlaceholder: dictionary.contact.fields.name.placeholder,
          nameRequiredError: dictionary.contact.fields.name.requiredError,
          emailLabel: dictionary.contact.fields.email.label,
          emailPlaceholder: dictionary.contact.fields.email.placeholder,
          emailRequiredError: dictionary.contact.fields.email.requiredError,
          invalidEmailError: dictionary.contact.fields.email.invalidError,
          messageLabel: dictionary.contact.fields.message.label,
          messagePlaceholder: dictionary.contact.fields.message.placeholder,
          messageRequiredError: dictionary.contact.fields.message.requiredError,
          sendMessage: dictionary.contact.send,
          sending: dictionary.contact.sending,
          successMessage: dictionary.contact.success,
          errorMessage: dictionary.contact.error,
        }}
      />
    </main>
  );
}
