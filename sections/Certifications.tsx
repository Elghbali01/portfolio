import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CertificationSpotlight, {
  type CertificationSpotlightLabels,
} from "@/components/CertificationSpotlight";
import type { CertificatePreviewModalLabels } from "@/components/CertificatePreviewModal";
import type { Certification, CertificationKnowledge } from "@/data/certifications";
import type { Locale } from "@/i18n/config";
import { formatLocalizedNumber } from "@/i18n/helpers";

type CertificationDomain = CertificationKnowledge["domain"];

export interface CertificationsCopy {
  title: string;
  highlightedTitle: string;
  introduction: string;
  viewAll: string;
  spotlight: CertificationSpotlightLabels;
  viewer: Partial<CertificatePreviewModalLabels>;
}

const defaultCopy: CertificationsCopy = {
  title: "My",
  highlightedTitle: "Certifications",
  introduction:
    "Credentials supporting my foundations in Software Engineering, Data Science, Machine Learning, Python, and Java.",
  viewAll: "View all certifications",
  spotlight: {
    eyebrow: "Featured credentials",
    selectorsLabel: "Select a featured credential",
    selectedLabel: "Selected",
    positionLabel: "Credential {current} of {total}",
    previewLabel: "Preview {title}",
    previewActionLabel: "Preview",
    verifyLabel: "Verify credential",
    verifyAriaLabel: "Verify {title} (opens in a new tab)",
    linkedInLabel: "View on LinkedIn",
    linkedInAriaLabel: "View {title} on LinkedIn (opens in a new tab)",
    categories: {
      "software-engineering": "Software Engineering",
      "backend-java": "Backend & Java",
      "data-science": "Data Science",
      "machine-learning": "Machine Learning",
    },
  },
  viewer: {},
};

interface CertificationsProps {
  locale?: Locale;
  copy?: Partial<Omit<CertificationsCopy, "spotlight" | "viewer">> & {
    spotlight?: Partial<Omit<CertificationSpotlightLabels, "categories">> & {
      categories?: Record<CertificationDomain, string>;
    };
    viewer?: Partial<CertificatePreviewModalLabels>;
  };
  certifications?: Certification[];
  totalCount?: number;
  imageAlts?: Record<string, string>;
}

export default function Certifications({
  locale = "en",
  copy: overrides,
  certifications,
  totalCount,
  imageAlts = {},
}: CertificationsProps) {
  const items = certifications ?? [];
  const spotlight: CertificationSpotlightLabels = {
    ...defaultCopy.spotlight,
    ...overrides?.spotlight,
    categories: {
      ...defaultCopy.spotlight.categories,
      ...overrides?.spotlight?.categories,
    },
  };
  const copy = {
    ...defaultCopy,
    ...overrides,
    spotlight,
    viewer: { ...defaultCopy.viewer, ...overrides?.viewer },
  };
  const credentialCount = totalCount ?? items.length;
  const paddedCount = (value: number) => formatLocalizedNumber(value, locale, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="relative scroll-mt-24 px-5 py-20 text-content-primary sm:px-8 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-10 border-b border-outline-subtle/80 pb-8 sm:mb-12 sm:pb-10">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <h2
              id="certifications-heading"
              className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              {copy.title} <span className="text-accent">{copy.highlightedTitle}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-content-secondary sm:text-lg sm:leading-8">
              {copy.introduction}
            </p>
          </div>
          <p className="mt-4 font-mono text-sm font-medium tabular-nums text-content-muted lg:absolute lg:bottom-8 lg:end-0 lg:mt-0 lg:text-end">
            {paddedCount(items.length)} / {paddedCount(credentialCount)}
          </p>
        </header>

        <CertificationSpotlight
          certifications={items}
          locale={locale}
          imageAlts={imageAlts}
          labels={spotlight}
          viewerLabels={copy.viewer}
        />

        <div className="mt-10 flex justify-center sm:mt-12">
          <Link
            href={`/${locale}/certifications`}
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-outline-default px-6 py-3 text-sm font-semibold text-content-strong transition-colors hover:border-accent hover:bg-hover-surface hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {copy.viewAll} <span className="tabular-nums">({formatLocalizedNumber(credentialCount, locale)})</span>
            <ArrowUpRight aria-hidden="true" size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
