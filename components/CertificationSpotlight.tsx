"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Eye, ExternalLink } from "lucide-react";
import CertificatePreviewModal, { type CertificatePreviewModalLabels } from "@/components/CertificatePreviewModal";
import type { Certification, CertificationKnowledge } from "@/data/certifications";
import type { Locale } from "@/i18n/config";
import { formatLocalizedNumber } from "@/i18n/helpers";
import { formatCertificationDate, getCertificationDomain } from "@/lib/certifications";

type CertificationDomain = CertificationKnowledge["domain"];

export interface CertificationSpotlightLabels {
  eyebrow: string;
  selectorsLabel: string;
  selectedLabel: string;
  positionLabel: string;
  previewLabel: string;
  previewActionLabel: string;
  verifyLabel: string;
  verifyAriaLabel: string;
  linkedInLabel: string;
  linkedInAriaLabel: string;
  categories: Record<CertificationDomain, string>;
}

interface CertificationSpotlightProps {
  certifications: Certification[];
  locale: Locale;
  imageAlts: Record<string, string>;
  labels: CertificationSpotlightLabels;
  viewerLabels: Partial<CertificatePreviewModalLabels>;
}

function withTitle(template: string, title: string) {
  return template.replace("{title}", title).replace("{certificate}", title);
}

function withPosition(template: string, current: number, total: number, locale: Locale) {
  return template
    .replace("{current}", formatLocalizedNumber(current, locale))
    .replace("{total}", formatLocalizedNumber(total, locale));
}

export default function CertificationSpotlight({
  certifications,
  locale,
  imageAlts,
  labels,
  viewerLabels,
}: CertificationSpotlightProps) {
  const [selectedId, setSelectedId] = useState(certifications[0]?.id ?? "");
  const [viewerId, setViewerId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const selected = certifications.find((certification) => certification.id === selectedId) ?? certifications[0];
  const viewerCertificate = certifications.find((certification) => certification.id === viewerId) ?? null;
  const selectedIndex = Math.max(0, certifications.findIndex((certification) => certification.id === selected?.id));
  const category = selected ? getCertificationDomain(selected.id) : null;
  const completionDate = selected ? formatCertificationDate(selected, locale) : undefined;
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" as const };

  if (!selected) return null;

  return (
    <div data-chat-safe-zone data-chat-desktop-safe-zone data-back-to-top-safe-zone className="space-y-7">
      <div className="flex items-end justify-between gap-4 border-b border-outline-default/50 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{labels.eyebrow}</p>
          <p className="mt-2 text-sm text-content-muted">{withPosition(labels.positionLabel, selectedIndex + 1, certifications.length, locale)}</p>
        </div>
        <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-content-subtle sm:block">
          {String(selectedIndex + 1).padStart(2, "0")} / {String(certifications.length).padStart(2, "0")}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)] lg:gap-7">
        <div className="overflow-hidden rounded-3xl border border-outline-default/70 bg-surface-elevated/50 shadow-xl shadow-surface-inset/10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected.id}
              initial={shouldReduceMotion ? false : { opacity: 0.65 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0.65 }}
              transition={transition}
            >
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={withTitle(labels.previewLabel, selected.title)}
                onClick={() => setViewerId(selected.id)}
                className="group relative block aspect-[1.38] w-full cursor-zoom-in overflow-hidden bg-surface-inset/25 p-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:p-5"
              >
                <Image
                  src={selected.image}
                  alt={imageAlts[selected.id] ?? selected.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-contain p-2 sm:p-4"
                />
                <span className="absolute bottom-4 end-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-outline-default/70 bg-canvas/95 px-4 text-xs font-semibold text-content-primary shadow-lg backdrop-blur-sm transition-colors group-hover:border-accent group-hover:text-accent-soft">
                  <Eye aria-hidden="true" size={15} />
                  {labels.previewActionLabel}
                </span>
              </button>
              <div className="grid gap-4 border-t border-outline-default/50 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${selected.id}-metadata`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                    transition={transition}
                    className="min-w-0"
                  >
                    <h3 className="text-xl font-semibold leading-snug text-content-primary sm:text-2xl">{selected.title}</h3>
                    <p className="mt-2 text-sm font-medium text-accent-soft">{selected.issuer}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-content-muted">
                      {completionDate && <span><time dateTime={selected.dateISO}>{completionDate}</time></span>}
                      {category && (
                        <span className="rounded-full border border-outline-default/60 px-2.5 py-1">
                          {labels.categories[category]}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {selected.verificationUrl ? (
                    <a
                      href={selected.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={withTitle(labels.verifyAriaLabel, selected.title)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-action px-4 text-sm font-semibold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
                    >
                      {labels.verifyLabel}
                      <ExternalLink aria-hidden="true" size={15} />
                    </a>
                  ) : selected.externalUrl ? (
                    <a
                      href={selected.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={withTitle(labels.linkedInAriaLabel, selected.title)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-action px-4 text-sm font-semibold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
                    >
                      {labels.linkedInLabel}
                      <ArrowUpRight aria-hidden="true" size={15} />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-3" role="group" aria-label={labels.selectorsLabel}>
          {certifications.map((certification, index) => {
            const isSelected = certification.id === selected.id;
            const domain = getCertificationDomain(certification.id);

            return (
              <button
                key={certification.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedId(certification.id)}
                className={`group flex min-h-[112px] items-center gap-4 rounded-2xl border p-3 text-start transition-[border-color,background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas motion-reduce:transition-none ${
                  isSelected
                    ? "border-accent bg-hover-surface shadow-md shadow-glow-primary/10"
                    : "border-outline-default/60 bg-surface-elevated/35 hover:-translate-y-0.5 hover:border-outline-strong hover:bg-hover-surface"
                }`}
              >
                <span className="relative h-[84px] w-[112px] shrink-0 overflow-hidden rounded-xl border border-outline-default/50 bg-surface-inset/30">
                  <Image
                    src={certification.image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  {isSelected && <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.15em] text-accent">{labels.selectedLabel}</span>}
                  <span className="block line-clamp-2 text-sm font-semibold leading-snug text-content-primary">{certification.title}</span>
                  <span className="mt-1 block truncate text-xs text-content-muted">{certification.issuer}</span>
                  {domain && <span className="mt-1.5 block truncate text-[11px] text-content-subtle">{labels.categories[domain]}</span>}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-content-subtle">{formatLocalizedNumber(index + 1, locale).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <CertificatePreviewModal
        cert={viewerCertificate}
        collection={certifications}
        onClose={() => setViewerId(null)}
        onNavigate={setViewerId}
        labels={viewerLabels}
        dir={locale === "ar" ? "rtl" : "ltr"}
        imageAlt={viewerCertificate ? imageAlts[viewerCertificate.id] : undefined}
        categoryLabels={labels.categories}
        locale={locale}
      />
    </div>
  );
}
