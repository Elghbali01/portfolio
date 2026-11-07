"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  Maximize,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Certification, CertificationKnowledge } from "@/data/certifications";
import type { Locale } from "@/i18n/config";
import { formatLocalizedNumber } from "@/i18n/helpers";
import { formatCertificationDate, getCertificationDomain } from "@/lib/certifications";

export interface CertificatePreviewModalLabels {
  close: string;
  closePreview: string;
  verifyCertificate: string;
  verifyCertificateAriaLabel: string;
  viewOnLinkedIn: string;
  viewOnLinkedInAriaLabel: string;
  certificateImageAlt: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  fit: string;
  previous: string;
  next: string;
  position: string;
  issuerLabel: string;
  dateLabel: string;
  domainLabel: string;
  download: string;
}

type CertificationDomain = CertificationKnowledge["domain"];

const DEFAULT_LABELS: CertificatePreviewModalLabels = {
  close: "Close",
  closePreview: "Close certificate viewer",
  verifyCertificate: "Verify credential",
  verifyCertificateAriaLabel: "Verify {title} (opens in a new tab)",
  viewOnLinkedIn: "View on LinkedIn",
  viewOnLinkedInAriaLabel: "View {title} on LinkedIn (opens in a new tab)",
  certificateImageAlt: "Certificate image: {title}",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resetZoom: "Reset zoom",
  fit: "Fit to screen",
  previous: "Previous credential",
  next: "Next credential",
  position: "Credential {current} of {total}",
  issuerLabel: "Issuer",
  dateLabel: "Completion date",
  domainLabel: "Technical domain",
  download: "Download original file",
};

interface CertificatePreviewModalProps {
  cert: Certification | null;
  collection?: readonly Certification[];
  onNavigate?: (id: string) => void;
  onClose: () => void;
  labels?: Partial<CertificatePreviewModalLabels>;
  dir?: "ltr" | "rtl";
  locale?: Locale;
  imageAlt?: string;
  categoryLabels?: Record<CertificationDomain, string>;
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
  return template.replace("{title}", title).replace("{certificate}", title);
}

function formatPosition(template: string, current: number, total: number, locale: Locale) {
  return template
    .replace("{current}", formatLocalizedNumber(current, locale))
    .replace("{total}", formatLocalizedNumber(total, locale));
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
      if (ariaHidden === null) element.removeAttribute("aria-hidden");
      else element.setAttribute("aria-hidden", ariaHidden);
    }
  };
}

export default function CertificatePreviewModal({
  cert,
  collection,
  onNavigate,
  onClose,
  labels,
  dir = "ltr",
  locale = "en",
  imageAlt,
  categoryLabels,
}: CertificatePreviewModalProps) {
  const copy: CertificatePreviewModalLabels = { ...DEFAULT_LABELS, ...labels };
  const titleId = useId();
  const issuerId = useId();
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const imageViewportRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const certRef = useRef(cert);
  const collectionRef = useRef(collection);
  const onNavigateRef = useRef(onNavigate);
  const onCloseRef = useRef(onClose);
  const [zoomState, setZoomState] = useState({ certificateId: "", value: 1 });
  const zoom = cert && zoomState.certificateId === cert.id ? zoomState.value : 1;
  const shouldReduceMotion = useReducedMotion();
  const isOpen = Boolean(cert);
  const navigationCollection = collection?.length ? collection : cert ? [cert] : [];
  const activeIndex = cert
    ? Math.max(0, navigationCollection.findIndex((item) => item.id === cert.id))
    : 0;
  const canNavigate = navigationCollection.length > 1 && Boolean(onNavigate);
  const domain = cert ? getCertificationDomain(cert.id) : null;
  const completionDate = cert ? formatCertificationDate(cert, locale) : undefined;
  const localDownload = cert?.pdf ?? cert?.downloadImage ?? null;
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" as const };

  useEffect(() => {
    certRef.current = cert;
    collectionRef.current = collection;
    onNavigateRef.current = onNavigate;
    onCloseRef.current = onClose;
  }, [cert, collection, onNavigate, onClose]);

  useEffect(() => {
    if (!isOpen || !backdropRef.current || !dialogRef.current) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restoreBackground = makeBackgroundInert(backdropRef.current);
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const navigate = (step: number) => {
      const current = certRef.current;
      const items = collectionRef.current?.length ? collectionRef.current : current ? [current] : [];
      if (!current || items.length < 2) return;
      const index = items.findIndex((item) => item.id === current.id);
      if (index < 0) return;
      const nextIndex = (index + step + items.length) % items.length;
      imageViewportRef.current?.scrollTo({ top: 0, left: 0 });
      onNavigateRef.current?.(items[nextIndex].id);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter((element) => !element.hasAttribute("hidden") && element.getAttribute("aria-hidden") !== "true");
        if (focusableElements.length === 0) {
          event.preventDefault();
          dialogRef.current.focus();
          return;
        }
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (!dialogRef.current.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      if (
        !dialogRef.current?.contains(event.target as Node) ||
        event.target instanceof HTMLElement && event.target.closest("input, select, textarea, [contenteditable='true']")
      ) return;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const previousKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
        navigate(event.key === previousKey ? -1 : 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown, true);
      restoreBackground();
      document.body.style.overflow = previousOverflow;
      const elementToRestore = previouslyFocusedRef.current;
      window.requestAnimationFrame(() => {
        if (elementToRestore?.isConnected) elementToRestore.focus();
      });
    };
  }, [isOpen, dir]);

  if (!cert) return null;

  const changeZoom = (delta: number) => {
    setZoomState({
      certificateId: cert.id,
      value: Math.min(3, Math.max(1, Number((zoom + delta).toFixed(2)))),
    });
  };
  const resetZoom = () => {
    setZoomState({ certificateId: cert.id, value: 1 });
    imageViewportRef.current?.scrollTo({ top: 0, left: 0, behavior: shouldReduceMotion ? "instant" : "smooth" });
  };
  const goTo = (step: number) => {
    if (!canNavigate) return;
    const nextIndex = (activeIndex + step + navigationCollection.length) % navigationCollection.length;
    imageViewportRef.current?.scrollTo({ top: 0, left: 0 });
    onNavigate?.(navigationCollection[nextIndex].id);
  };
  const previousIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const nextIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
  const PreviousIcon = previousIcon;
  const NextIcon = nextIcon;
  const downloadName = localDownload?.split("/").pop();

  return createPortal(
    <motion.div
      ref={backdropRef}
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-surface-inset/80 p-2 backdrop-blur-sm sm:p-4"
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
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={transition}
        className="relative grid h-[min(94dvh,56rem)] max-h-[94vh] w-full max-w-7xl grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden rounded-2xl border border-outline-default bg-surface-elevated text-start shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-outline-default px-4 py-3 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="line-clamp-2 text-base font-semibold leading-snug text-content-primary sm:text-lg">
              {cert.title}
            </h2>
            <p id={issuerId} className="mt-1 truncate text-sm text-accent-soft">{cert.issuer}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={copy.closePreview}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-outline-strong bg-surface text-content-secondary transition-colors hover:border-accent hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-default bg-surface/50 px-3 py-2.5 sm:px-5">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={copy.fit}>
            <button
              type="button"
              onClick={() => changeZoom(-0.25)}
              disabled={zoom <= 1}
              aria-label={copy.zoomOut}
              title={copy.zoomOut}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-outline-default text-content-secondary hover:border-accent hover:text-content-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            ><Minus aria-hidden="true" size={17} /></button>
            <span className="min-w-14 text-center font-mono text-xs tabular-nums text-content-muted" aria-live="polite">
              {formatLocalizedNumber(Math.round(zoom * 100), locale)}%
            </span>
            <button
              type="button"
              onClick={() => changeZoom(0.25)}
              disabled={zoom >= 3}
              aria-label={copy.zoomIn}
              title={copy.zoomIn}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-outline-default text-content-secondary hover:border-accent hover:text-content-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            ><Plus aria-hidden="true" size={17} /></button>
            <button
              type="button"
              onClick={resetZoom}
              aria-label={copy.fit}
              title={copy.fit}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-outline-default px-3 text-xs font-medium text-content-strong hover:border-accent hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            ><Maximize aria-hidden="true" size={15} /><span className="hidden sm:inline">{copy.fit}</span></button>
            <button
              type="button"
              onClick={resetZoom}
              aria-label={copy.resetZoom}
              title={copy.resetZoom}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-outline-default text-content-secondary hover:border-accent hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            ><RotateCcw aria-hidden="true" size={15} /></button>
          </div>

          {canNavigate && (
            <div
              className="flex items-center gap-1.5"
              role="group"
              aria-label={formatPosition(copy.position, activeIndex + 1, navigationCollection.length, locale)}
            >
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label={copy.previous}
                title={copy.previous}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-outline-default text-content-secondary hover:border-accent hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              ><PreviousIcon aria-hidden="true" size={17} /></button>
              <span className="min-w-24 text-center text-xs tabular-nums text-content-muted" aria-live="polite">
                {formatPosition(copy.position, activeIndex + 1, navigationCollection.length, locale)}
              </span>
              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label={copy.next}
                title={copy.next}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-outline-default text-content-secondary hover:border-accent hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              ><NextIcon aria-hidden="true" size={17} /></button>
            </div>
          )}
        </div>

        <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_18rem] md:grid-rows-1">
          <div
            ref={imageViewportRef}
            className="relative min-h-0 min-w-0 overflow-auto bg-surface-inset/35"
            aria-label={copy.certificateImageAlt.replace("{title}", cert.title)}
          >
            <div
              className="relative min-h-full min-w-full"
              style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
            >
              <Image
                src={cert.image}
                alt={imageAlt ?? formatLabel(copy.certificateImageAlt, cert.title)}
                fill
                sizes="(min-width: 768px) 72vw, 100vw"
                className="object-contain p-3 sm:p-6"
                priority
              />
            </div>
          </div>

          <aside className="max-h-44 overflow-y-auto border-t border-outline-default bg-surface/70 p-4 sm:p-5 md:max-h-none md:border-s md:border-t-0">
            <dl className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-content-muted">{copy.issuerLabel}</dt>
                <dd className="mt-1 text-sm font-medium text-content-primary">{cert.issuer}</dd>
              </div>
              {completionDate && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-content-muted">{copy.dateLabel}</dt>
                  <dd className="mt-1 text-sm font-medium text-content-primary"><time dateTime={cert.dateISO}>{completionDate}</time></dd>
                </div>
              )}
              {domain && (
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-content-muted">{copy.domainLabel}</dt>
                  <dd className="mt-1 text-sm font-medium text-content-primary">
                    {categoryLabels?.[domain] ?? domain.replaceAll("-", " ")}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-4 flex flex-wrap gap-2 md:flex-col">
              {cert.verificationUrl ? (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={formatLabel(copy.verifyCertificateAriaLabel, cert.title)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-action px-4 py-2 text-sm font-semibold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {copy.verifyCertificate}<ExternalLink aria-hidden="true" size={15} />
                </a>
              ) : cert.externalUrl ? (
                <a
                  href={cert.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={formatLabel(copy.viewOnLinkedInAriaLabel, cert.title)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-action px-4 py-2 text-sm font-semibold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {copy.viewOnLinkedIn}<ExternalLink aria-hidden="true" size={15} />
                </a>
              ) : null}
              {localDownload && (
                <a
                  href={localDownload}
                  download={downloadName}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-outline-default px-4 py-2 text-sm font-medium text-content-strong transition-colors hover:border-accent hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <Download aria-hidden="true" size={15} />{copy.download}
                </a>
              )}
            </div>
          </aside>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
