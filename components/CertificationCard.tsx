"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Certification } from "../data/certifications";

export interface CertificationCardLabels {
  previewCertificateAriaLabel: string;
  verifyCertificate: string;
  verifyCertificateAriaLabel: string;
  viewOnLinkedIn: string;
  viewOnLinkedInAriaLabel: string;
  credentialUnavailable: string;
}

const DEFAULT_LABELS: CertificationCardLabels = {
  previewCertificateAriaLabel: "Preview {title}",
  verifyCertificate: "Verify Certificate",
  verifyCertificateAriaLabel:
    "Verify {title} certificate (opens in a new tab)",
  viewOnLinkedIn: "View on LinkedIn",
  viewOnLinkedInAriaLabel:
    "View {title} on LinkedIn (opens in a new tab)",
  credentialUnavailable: "Credential link unavailable",
};

interface CertificationCardProps {
  cert: Certification;
  index: number;
  /** "preview" = homepage (no action button) | "full" = certifications page */
  variant: "preview" | "full";
  /** Called when the user activates the thumbnail (full page only). */
  onImageClick?: (cert: Certification) => void;
  labels?: Partial<CertificationCardLabels>;
  headingLevel?: "h2" | "h3";
  imageAlt?: string;
}

function formatLabel(template: string, title: string) {
  return template
    .replace("{title}", title)
    .replace("{certificate}", title);
}

export default function CertificationCard({
  cert,
  index,
  variant,
  onImageClick,
  labels,
  headingLevel = "h3",
  imageAlt,
}: CertificationCardProps) {
  const copy: CertificationCardLabels = {
    ...DEFAULT_LABELS,
    ...labels,
  };
  const Heading = headingLevel;
  const shouldReduceMotion = useReducedMotion();
  const canOpenPreview = variant === "full" && Boolean(onImageClick);

  const thumbnail = (
    <Image
      src={cert.image}
      alt={canOpenPreview ? "" : (imageAlt ?? cert.title)}
      fill
      sizes={
        variant === "preview"
          ? "(min-width: 768px) 33vw, 100vw"
          : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      }
      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
    />
  );

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.6, delay: index * 0.1 }
      }
      viewport={{ once: true }}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#475569] bg-[#1E293B]/40 backdrop-blur-md transition-all duration-300 hover:border-[#60A5FA]/70 hover:shadow-lg hover:shadow-blue-500/10"
    >
      {canOpenPreview ? (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={formatLabel(
            copy.previewCertificateAriaLabel,
            cert.title,
          )}
          onClick={() => onImageClick?.(cert)}
          className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-[#0F172A]/60 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#60A5FA]"
        >
          {thumbnail}
        </button>
      ) : (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F172A]/60">
          {thumbnail}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1 p-5 text-start">
        <Heading className="min-h-[2.6rem] text-[15px] font-semibold leading-snug text-white">
          {cert.title}
        </Heading>

        <p className="text-sm font-medium text-[#60A5FA]">{cert.issuer}</p>

        {cert.date && (
          <p className="mt-0.5 text-xs text-[#94A3B8]">{cert.date}</p>
        )}

        <div className="flex-1" />

        {variant === "full" && (
          <div data-chat-safe-zone className="mt-4">
            {cert.verificationUrl ? (
              <a
                href={cert.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={formatLabel(
                  copy.verifyCertificateAriaLabel,
                  cert.title,
                )}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B]"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                {copy.verifyCertificate}
              </a>
            ) : cert.actionType === "external" ? (
              cert.externalUrl ? (
                <a
                  href={cert.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={formatLabel(
                    copy.viewOnLinkedInAriaLabel,
                    cert.title,
                  )}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B]"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  {copy.viewOnLinkedIn}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label={copy.credentialUnavailable}
                  className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#334155] px-4 py-2.5 text-sm font-medium text-[#94A3B8]"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  {copy.viewOnLinkedIn}
                </button>
              )
            ) : null}
          </div>
        )}
      </div>
    </motion.article>
  );
}
