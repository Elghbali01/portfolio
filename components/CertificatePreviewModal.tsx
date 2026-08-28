"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Certification } from "../data/certifications";

export interface CertificatePreviewModalLabels {
  close: string;
  closePreview: string;
  verifyCertificate: string;
  verifyCertificateAriaLabel: string;
  viewOnLinkedIn: string;
  viewOnLinkedInAriaLabel: string;
  certificateImageAlt: string;
}

const DEFAULT_LABELS: CertificatePreviewModalLabels = {
  close: "Close",
  closePreview: "Close certificate preview",
  verifyCertificate: "Verify Certificate",
  verifyCertificateAriaLabel:
    "Verify {title} certificate (opens in a new tab)",
  viewOnLinkedIn: "View on LinkedIn",
  viewOnLinkedInAriaLabel:
    "View {title} on LinkedIn (opens in a new tab)",
  certificateImageAlt: "Certificate preview: {title}",
};

interface CertificatePreviewModalProps {
  cert: Certification | null;
  onClose: () => void;
  labels?: Partial<CertificatePreviewModalLabels>;
  dir?: "ltr" | "rtl";
  imageAlt?: string;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function formatLabel(template: string, title: string) {
  return template
    .replace("{title}", title)
    .replace("{certificate}", title);
}

function makeBackgroundInert(modal: HTMLElement) {
  const changedElements: Array<{
    element: HTMLElement;
    inert: boolean;
    ariaHidden: string | null;
  }> = [];

  let current: HTMLElement | null = modal;

  while (current.parentElement) {
    const parent: HTMLElement = current.parentElement;

    for (const sibling of Array.from(parent.children)) {
      if (sibling === current || !(sibling instanceof HTMLElement)) continue;

      changedElements.push({
        element: sibling,
        inert: sibling.inert,
        ariaHidden: sibling.getAttribute("aria-hidden"),
      });
      sibling.inert = true;
      sibling.setAttribute("aria-hidden", "true");
    }

    if (parent === document.body) break;
    current = parent;
  }

  return () => {
    for (const { element, inert, ariaHidden } of changedElements.reverse()) {
      element.inert = inert;
      if (ariaHidden === null) {
        element.removeAttribute("aria-hidden");
      } else {
        element.setAttribute("aria-hidden", ariaHidden);
      }
    }
  };
}

export default function CertificatePreviewModal({
  cert,
  onClose,
  labels,
  dir,
  imageAlt,
}: CertificatePreviewModalProps) {
  const copy: CertificatePreviewModalLabels = {
    ...DEFAULT_LABELS,
    ...labels,
  };
  const titleId = useId();
  const issuerId = useId();
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!cert || !backdropRef.current || !dialogRef.current) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restoreBackground = makeBackgroundInert(backdropRef.current);

    const focusDialog = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          !element.hasAttribute("hidden") &&
          element.getAttribute("aria-hidden") !== "true",
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (!dialogRef.current.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.cancelAnimationFrame(focusDialog);
      document.removeEventListener("keydown", handleKeyDown, true);
      restoreBackground();
      document.body.style.overflow = previousOverflow;

      const elementToRestore = previouslyFocusedRef.current;
      window.requestAnimationFrame(() => {
        if (elementToRestore?.isConnected) elementToRestore.focus();
      });
    };
  }, [cert]);

  if (!cert) return null;

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2 };

  return createPortal(
    <motion.div
      ref={backdropRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={issuerId}
        tabIndex={-1}
        dir={dir}
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={transition}
        className="relative flex h-[min(90dvh,48rem)] max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#475569] bg-[#1E293B] text-start shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#475569] px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold leading-snug text-white"
            >
              {cert.title}
            </h2>
            <p id={issuerId} className="mt-1 text-sm text-[#60A5FA]">
              {cert.issuer}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#64748B] bg-[#0F172A] text-[#CBD5E1] transition-colors duration-200 hover:border-[#60A5FA] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B]"
            aria-label={copy.closePreview}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
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

        <div className="relative min-h-0 flex-1 bg-[#0F172A]/60">
          <Image
            src={cert.image}
            alt={
              imageAlt ?? formatLabel(copy.certificateImageAlt, cert.title)
            }
            fill
            sizes="(min-width: 768px) 768px, calc(100vw - 2rem)"
            className="object-contain p-4 sm:p-6"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#475569] px-4 py-4 sm:px-6">
          {cert.verificationUrl && (
            <a
              href={cert.verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={formatLabel(
                copy.verifyCertificateAriaLabel,
                cert.title,
              )}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B]"
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
          )}

          {!cert.verificationUrl &&
            cert.actionType === "external" &&
            cert.externalUrl && (
              <a
                href={cert.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={formatLabel(
                  copy.viewOnLinkedInAriaLabel,
                  cert.title,
                )}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B]"
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
            )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-[#64748B] px-5 py-2.5 text-sm font-medium text-[#CBD5E1] transition-colors duration-200 hover:border-[#60A5FA] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E293B]"
          >
            {copy.close}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
