import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CertificationGallery from "@/components/CertificationGallery";
import DirectionalArrow from "@/components/DirectionalArrow";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import {
  certificationIds,
  formatCount,
  getDictionary,
  getDirection,
  isLocale,
  type Locale,
} from "@/i18n";
import { getLocalizedCertifications } from "@/lib/localized-portfolio";
import { absoluteUrl, buildLocalizedMetadata } from "@/lib/site";

interface CertificationsPageProps {
  params: Promise<{ locale: string }>;
}

async function resolveLocale(params: CertificationsPageProps["params"]): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: CertificationsPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);
  return buildLocalizedMetadata({
    locale,
    pathname: "/certifications",
    title: dictionary.seo.certifications.title,
    titleTemplate: dictionary.seo.titleTemplate,
    description: dictionary.seo.certifications.description,
    imageAlt: dictionary.seo.openGraphImageAlt,
  });
}

export default async function CertificationsPage({ params }: CertificationsPageProps) {
  const locale = await resolveLocale(params);
  const dictionary = await getDictionary(locale);
  const certifications = getLocalizedCertifications(dictionary, locale);
  const dir = getDirection(locale);
  const imageAlts = Object.fromEntries(
    certificationIds.map((id) => [id, dictionary.certifications.items[id].imageAlt]),
  );

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dictionary.seo.certifications.title,
    numberOfItems: certifications.length,
    itemListElement: certifications.map((certification, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: certification.title,
      url: certification.verificationUrl ?? certification.externalUrl ?? absoluteUrl(`/${locale}/certifications`),
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
            { label: dictionary.breadcrumbs.certifications },
          ]}
        />

        <Reveal className="mb-16 text-center">
          <h1 className="text-3xl font-bold md:text-5xl">
            {dictionary.certifications.listing.titleLead}{" "}
            <span className="text-[#60A5FA]">{dictionary.certifications.listing.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#B7C3D4]">
            {dictionary.certifications.listing.description}
          </p>
          <p className="mt-3 text-sm text-[#A8B6CA]">
            {formatCount(certifications.length, locale, dictionary.certifications.listing.count)}
          </p>
        </Reveal>

        <CertificationGallery
          certifications={certifications}
          collectionLabel={dictionary.certifications.listing.collectionLabel}
          imageAlts={imageAlts}
          dir={dir}
          cardLabels={{
            previewCertificateAriaLabel: dictionary.certifications.card.previewCertificate,
            verifyCertificate: dictionary.certifications.card.verify,
            verifyCertificateAriaLabel: `${dictionary.certifications.card.verifyCertificate}: {title} (${dictionary.common.opensInNewTab})`,
            viewOnLinkedIn: dictionary.certifications.card.viewOnLinkedIn,
            viewOnLinkedInAriaLabel: `${dictionary.certifications.card.viewOnLinkedIn}: {title} (${dictionary.common.opensInNewTab})`,
            credentialUnavailable: dictionary.common.notAvailable,
          }}
          modalLabels={{
            close: dictionary.certifications.modal.close,
            closePreview: dictionary.certifications.modal.closePreview,
            verifyCertificate: dictionary.certifications.card.verify,
            verifyCertificateAriaLabel: `${dictionary.certifications.card.verifyCertificate}: {title} (${dictionary.common.opensInNewTab})`,
            viewOnLinkedIn: dictionary.certifications.card.viewOnLinkedIn,
            viewOnLinkedInAriaLabel: `${dictionary.certifications.card.viewOnLinkedIn}: {title} (${dictionary.common.opensInNewTab})`,
            certificateImageAlt: dictionary.certifications.modal.imageLabel,
          }}
        />

        <div data-chat-safe-zone className="mt-16 flex justify-center">
          <Link
            href={`/${locale}#certifications`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#526176] px-7 py-3 text-sm font-medium text-[#D4DCE8] transition hover:border-[#60A5FA] hover:text-[#93C5FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            <DirectionalArrow locale={locale} direction="back" />
            {dictionary.certifications.listing.backToPortfolio}
          </Link>
        </div>
      </div>
    </main>
  );
}
