"use client";

import { useMemo, useState } from "react";
import CertificatePreviewModal, { type CertificatePreviewModalLabels } from "@/components/CertificatePreviewModal";
import CertificationCard, { type CertificationCardLabels } from "@/components/CertificationCard";
import type { Certification, CertificationKnowledge } from "@/data/certifications";
import type { Locale } from "@/i18n/config";
import { formatCount, formatLocalizedNumber } from "@/i18n/helpers";
import type { PluralForms } from "@/i18n/types";
import {
  deriveCertificationStatistics,
  getAvailableCertificationDomains,
  getCertificationDomain,
  sortCertificationsByDate,
  type CertificationFilter,
  type CertificationSortOrder,
} from "@/lib/certifications";

type Domain = CertificationKnowledge["domain"];

interface CertificationGalleryProps {
  certifications: Certification[];
  collectionLabel: string;
  countForms: PluralForms;
  filterLabels: {
    label: string;
    all: string;
    categories: Record<Domain, string>;
    emptyTitle: string;
    emptyDescription: string;
  };
  sortLabels: { label: string; newest: string; oldest: string };
  statisticLabels: {
    total: string;
    domains: string;
    issuers: string;
    mostRecentYear: string;
  };
  cardLabels: Partial<CertificationCardLabels>;
  modalLabels: Partial<CertificatePreviewModalLabels>;
  imageAlts: Record<string, string>;
  locale: Locale;
  dir: "ltr" | "rtl";
}

export default function CertificationGallery({
  certifications,
  collectionLabel,
  countForms,
  filterLabels,
  sortLabels,
  statisticLabels,
  cardLabels,
  modalLabels,
  imageAlts,
  locale,
  dir,
}: CertificationGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<CertificationFilter>("all");
  const [sortOrder, setSortOrder] = useState<CertificationSortOrder>("newest");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const availableDomains = useMemo(
    () => getAvailableCertificationDomains(certifications),
    [certifications],
  );
  const sortedCertifications = useMemo(
    () => sortCertificationsByDate(certifications, sortOrder),
    [certifications, sortOrder],
  );
  const visibleCertifications = useMemo(
    () => activeFilter === "all"
      ? sortedCertifications
      : sortedCertifications.filter((certification) => getCertificationDomain(certification.id) === activeFilter),
    [activeFilter, sortedCertifications],
  );
  const statistics = useMemo(
    () => deriveCertificationStatistics(certifications),
    [certifications],
  );
  const previewCertificate = previewId
    ? visibleCertifications.find((certification) => certification.id === previewId) ?? null
    : null;
  const count = (value: number) => formatLocalizedNumber(value, locale);
  const year = (value: number) => formatLocalizedNumber(value, locale, { useGrouping: false });

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-6 border-y border-outline-subtle py-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-content-muted">{filterLabels.label}</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={filterLabels.label}>
            <button
              type="button"
              aria-pressed={activeFilter === "all"}
              onClick={() => {
                setActiveFilter("all");
                setPreviewId(null);
              }}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${activeFilter === "all" ? "border-accent bg-hover-surface text-accent-soft" : "border-outline-default text-content-strong hover:border-outline-strong hover:text-content-primary"}`}
            >
              {filterLabels.all}<span className="font-mono text-xs tabular-nums opacity-75">{count(certifications.length)}</span>
            </button>
            {availableDomains.map((domain) => {
              const domainCount = certifications.filter((certification) => getCertificationDomain(certification.id) === domain).length;
              const selected = activeFilter === domain;
              return (
                <button
                  key={domain}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setActiveFilter(domain);
                    setPreviewId(null);
                  }}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${selected ? "border-accent bg-hover-surface text-accent-soft" : "border-outline-default text-content-strong hover:border-outline-strong hover:text-content-primary"}`}
                >
                  {filterLabels.categories[domain]}<span className="font-mono text-xs tabular-nums opacity-75">{count(domainCount)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex shrink-0 flex-col gap-2 text-sm font-medium text-content-strong sm:flex-row sm:items-center sm:gap-3">
          <span>{sortLabels.label}</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as CertificationSortOrder)}
            className="min-h-11 min-w-44 rounded-xl border border-outline-default bg-surface px-3 text-sm text-content-primary outline-none transition-colors focus:border-focus focus:ring-2 focus:ring-focus/30"
          >
            <option value="newest">{sortLabels.newest}</option>
            <option value="oldest">{sortLabels.oldest}</option>
          </select>
        </label>
      </div>

      <dl className="grid grid-cols-2 border-b border-outline-subtle pb-6 sm:grid-cols-4">
        <Statistic label={statisticLabels.total} value={count(statistics.total)} />
        <Statistic label={statisticLabels.domains} value={count(statistics.domains)} />
        <Statistic label={statisticLabels.issuers} value={count(statistics.issuers)} />
        <Statistic label={statisticLabels.mostRecentYear} value={statistics.mostRecentYear === null ? "—" : year(statistics.mostRecentYear)} />
      </dl>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-content-secondary" aria-live="polite">
          {formatCount(visibleCertifications.length, locale, countForms)}
        </p>
        <span className="font-mono text-xs tabular-nums text-content-muted">
          {count(visibleCertifications.length)} / {count(certifications.length)}
        </span>
      </div>

      {visibleCertifications.length > 0 ? (
        <section aria-label={collectionLabel} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {visibleCertifications.map((certification, index) => {
            const domain = getCertificationDomain(certification.id);
            return (
              <CertificationCard
                key={certification.id}
                cert={certification}
                index={index}
                variant="full"
                headingLevel="h2"
                labels={cardLabels}
                imageAlt={imageAlts[certification.id]}
                locale={locale}
                categoryLabel={domain ? filterLabels.categories[domain] : undefined}
                onImageClick={(item) => setPreviewId(item.id)}
              />
            );
          })}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-outline-default px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-content-primary">{filterLabels.emptyTitle}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-content-secondary">{filterLabels.emptyDescription}</p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-outline-default px-5 text-sm font-semibold text-content-strong hover:border-accent hover:text-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >{filterLabels.all}</button>
        </div>
      )}

      <CertificatePreviewModal
        cert={previewCertificate}
        collection={visibleCertifications}
        onNavigate={setPreviewId}
        onClose={() => setPreviewId(null)}
        labels={modalLabels}
        dir={dir}
        locale={locale}
        imageAlt={previewCertificate ? imageAlts[previewCertificate.id] : undefined}
        categoryLabels={filterLabels.categories}
      />
    </div>
  );
}

function Statistic({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-s border-outline-subtle px-4 py-3 first:border-s-0 sm:px-6">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-content-muted sm:text-xs">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold tracking-tight text-content-primary sm:text-3xl">{value}</dd>
    </div>
  );
}
