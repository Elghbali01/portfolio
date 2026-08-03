"use client";

import { motion } from "framer-motion";
import type { Certification } from "../data/certifications";

interface CertificationCardProps {
  cert: Certification;
  index: number;
  /** "preview" = homepage (no action button)  |  "full" = all-certifications page */
  variant: "preview" | "full";
  /** Called when the user clicks the thumbnail (full page only) */
  onImageClick?: (cert: Certification) => void;
}

export default function CertificationCard({
  cert,
  index,
  variant,
  onImageClick,
}: CertificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group bg-[#1E293B]/40 backdrop-blur-md border border-[#334155] rounded-xl
                 overflow-hidden flex flex-col
                 hover:border-[#3B82F6]/60 hover:shadow-lg hover:shadow-blue-500/10
                 transition-all duration-300"
    >
      {/* ── Thumbnail ────────────────────────────────────────────────── */}
      <div
        className={`relative bg-[#0F172A]/60 flex items-center justify-center overflow-hidden
                    ${variant === "full" ? "cursor-pointer" : ""}`}
        style={{ aspectRatio: "4 / 3" }}
        onClick={() => variant === "full" && onImageClick?.(cert)}
      >
        <img
          src={cert.image}
          alt={cert.title}
          className="w-full h-full object-contain p-3
                     transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 gap-1">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-white leading-snug min-h-[2.6rem] line-clamp-2">
          {cert.title}
        </h3>

        {/* Issuer */}
        <p className="text-sm text-[#3B82F6] font-medium">{cert.issuer}</p>

        {/* Date */}
        {cert.date && (
          <p className="text-xs text-[#94A3B8] mt-0.5">{cert.date}</p>
        )}

        {/* Spacer to push the action to the bottom */}
        <div className="flex-1" />

        {/* ── Action (full page only) ──────────────────────────────── */}
        {variant === "full" && (
          <div className="mt-4">
            {cert.actionType === "download" && cert.pdf ? (
              <a
                href={cert.pdf}
                download={cert.pdf.split("/").pop() || "certificate.pdf"}
                className="inline-flex items-center gap-2 w-full justify-center
                           bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium
                           px-4 py-2.5 rounded-lg transition-colors duration-300"
              >
                {/* Download icon */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download PDF
              </a>
            ) : cert.actionType === "external" ? (
              cert.externalUrl ? (
                <a
                  href={cert.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center
                             bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium
                             px-4 py-2.5 rounded-lg transition-colors duration-300"
                >
                  {/* External-link icon */}
                  <svg
                    className="w-4 h-4"
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
                  View on LinkedIn
                </a>
              ) : (
                /* Disabled state when externalUrl is empty */
                <button
                  disabled
                  className="inline-flex items-center gap-2 w-full justify-center
                             bg-[#334155] text-[#64748B] text-sm font-medium
                             px-4 py-2.5 rounded-lg cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
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
                  View on LinkedIn
                </button>
              )
            ) : null}
          </div>
        )}
      </div>
    </motion.div>
  );
}
