import Link from "next/link";
import CertificationCard, { type CertificationCardLabels } from "@/components/CertificationCard";
import DirectionalArrow from "@/components/DirectionalArrow";
import Reveal from "@/components/Reveal";
import { certifications as allCertifications, featuredCertifications, type Certification } from "@/data/certifications";
import type { Locale } from "@/i18n/config";

export interface CertificationsCopy {
  title: string;
  highlightedTitle: string;
  introduction: string;
  viewAll: string;
  card: CertificationCardLabels;
}

const defaultCopy: CertificationsCopy = {
  title: "My",
  highlightedTitle: "Certifications",
  introduction:
    "Credentials supporting my foundations in Software Engineering, Data Science, Machine Learning, Python, and Java.",
  viewAll: "View all certifications",
  card: {
    previewCertificateAriaLabel: "Preview {title}",
    verifyCertificate: "Verify certificate",
    verifyCertificateAriaLabel: "Verify {title} certificate (opens in a new tab)",
    viewOnLinkedIn: "View on LinkedIn",
    viewOnLinkedInAriaLabel: "View {title} on LinkedIn (opens in a new tab)",
    credentialUnavailable: "Credential link unavailable",
  },
};

interface CertificationsProps {
  locale?: Locale;
  copy?: Partial<CertificationsCopy> & { card?: Partial<CertificationCardLabels> };
  certifications?: Certification[];
  totalCount?: number;
  imageAlts?: Record<string, string>;
}

export default function Certifications({
  locale = "en",
  copy: overrides,
  certifications = featuredCertifications,
  totalCount = allCertifications.length,
  imageAlts = {},
}: CertificationsProps) {
  const copy: CertificationsCopy = {
    ...defaultCopy,
    ...overrides,
    card: { ...defaultCopy.card, ...overrides?.card },
  };

  return (
    <section id="certifications" className="relative flex min-h-screen scroll-mt-24 flex-col items-center justify-center px-6 py-24 text-white md:px-10">
      <div className="w-full max-w-6xl">
        <Reveal className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            {copy.title} <span className="text-[#60A5FA]">{copy.highlightedTitle}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-[#B7C3D4]">{copy.introduction}</p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3">
          {certifications.map((certification, index) => (
            <CertificationCard
              key={certification.id}
              cert={certification}
              index={index}
              variant="preview"
              labels={copy.card}
              imageAlt={imageAlts[certification.id]}
            />
          ))}
        </div>

        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <div data-chat-safe-zone>
            <Link
              href={`/${locale}/certifications`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#60A5FA] px-7 py-3 text-sm font-medium text-[#93C5FD] transition-all duration-300 hover:bg-[#2563EB] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {copy.viewAll} ({totalCount})
              <DirectionalArrow locale={locale} direction="forward" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
