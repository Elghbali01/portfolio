"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Certification } from "../data/certifications";

interface CertificatePreviewModalProps {
  cert: Certification | null;
  onClose: () => void;
}

export default function CertificatePreviewModal({
  cert,
  onClose,
}: CertificatePreviewModalProps) {
  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (cert) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [cert, handleKey]);

  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* Modal content */}
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-3xl w-full max-h-[90vh] bg-[#1E293B] border border-[#334155]
                       rounded-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {cert.title}
                </h3>
                <p className="text-sm text-[#3B82F6]">{cert.issuer}</p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-4 w-9 h-9 flex items-center justify-center rounded-lg
                           bg-[#0F172A] border border-[#334155] text-[#94A3B8]
                           hover:text-white hover:border-[#3B82F6] transition-colors duration-200"
                aria-label="Close preview"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-[#0F172A]/60 p-6">
              <img
                src={cert.image}
                alt={cert.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Footer action */}
            <div className="px-6 py-4 border-t border-[#334155] flex justify-end gap-3">
              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify ${cert.title} certificate (opens in a new tab)`}
                  className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]
                             text-white text-sm font-medium px-5 py-2.5 rounded-lg
                             transition-colors duration-300"
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
                  Verify Certificate
                </a>
              )}

              {!cert.verificationUrl && cert.actionType === "external" && cert.externalUrl && (
                <a
                  href={cert.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${cert.title} on LinkedIn (opens in a new tab)`}
                  className="inline-flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB]
                             text-white text-sm font-medium px-5 py-2.5 rounded-lg
                             transition-colors duration-300"
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
                </a>
              )}

              <button
                onClick={onClose}
                className="text-[#94A3B8] hover:text-white text-sm font-medium px-5 py-2.5
                           rounded-lg border border-[#334155] hover:border-[#3B82F6]
                           transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
