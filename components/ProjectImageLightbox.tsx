"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

export interface ProjectMediaImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ProjectImageLightboxProps {
  images: readonly ProjectMediaImage[];
  locale: string;
  label: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  imageCounterLabel: string;
}

export default function ProjectImageLightbox({
  images,
  locale,
  label,
  closeLabel,
  previousLabel,
  nextLabel,
  imageCounterLabel,
}: ProjectImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const imageCount = images.length;
  const activeImage = images[activeIndex] ?? images[0];

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        restoreFocusRef.current?.focus();
        restoreFocusRef.current = null;
      }
      return;
    }

    wasOpenRef.current = true;
    restoreFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const changeImage = (delta: number) => {
    if (imageCount < 2) return;
    setActiveIndex((index) => (index + delta + imageCount) % imageCount);
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }

    if (imageCount > 1 && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      const isRtl = document.documentElement.dir === "rtl";
      const delta = event.key === "ArrowRight" ? (isRtl ? -1 : 1) : (isRtl ? 1 : -1);
      changeImage(delta);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!activeImage) return null;

  const counterLabel = imageCounterLabel
    .replace("{current}", new Intl.NumberFormat(locale).format(activeIndex + 1))
    .replace("{total}", new Intl.NumberFormat(locale).format(imageCount));

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={label}
        onClick={() => {
          setActiveIndex(0);
          setOpen(true);
        }}
        className="group relative block h-full w-full cursor-zoom-in rounded-[inherit] text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
      >
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          quality={82}
          sizes="(min-width: 1280px) 58vw, (min-width: 768px) 52vw, 100vw"
          className="object-contain transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.025]"
        />
        <span className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-end">
          <span className="rounded-full border border-white/20 bg-black/60 p-2.5 text-white shadow-lg backdrop-blur-sm transition-colors group-hover:bg-black/75">
            <Expand aria-hidden="true" className="size-4" />
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && typeof document !== "undefined" && createPortal(
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md md:p-8"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
            onKeyDown={handleDialogKeyDown}
          >
            <motion.div
              ref={dialogRef}
              className="relative flex max-h-[94dvh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-surface-elevated shadow-2xl"
              initial={shouldReduceMotion ? false : { scale: 0.985, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { scale: 0.985, y: 8 }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
                className="absolute end-3 top-3 z-20 rounded-full border border-white/20 bg-black/65 p-2.5 text-white transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:end-4 md:top-4"
              >
                <X aria-hidden="true" className="size-5" />
              </button>

              <div className="relative min-h-0 flex-1 bg-surface-inset">
                <div className="relative h-[min(76dvh,820px)] w-full">
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    priority
                    quality={90}
                    sizes="(min-width: 1440px) 1280px, 96vw"
                    className="object-contain p-3 md:p-8"
                  />
                </div>

                {imageCount > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label={previousLabel}
                      onClick={() => changeImage(-1)}
                      className="absolute start-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/65 p-3 text-white shadow-lg transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:start-6"
                    >
                      <ChevronLeft aria-hidden="true" className="size-5 rtl:rotate-180" />
                    </button>
                    <button
                      type="button"
                      aria-label={nextLabel}
                      onClick={() => changeImage(1)}
                      className="absolute end-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/65 p-3 text-white shadow-lg transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:end-6"
                    >
                      <ChevronRight aria-hidden="true" className="size-5 rtl:rotate-180" />
                    </button>
                  </>
                )}
              </div>

              {imageCount > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-subtle px-4 py-3 md:px-6">
                  <p aria-live="polite" className="text-sm text-content-secondary">
                    {counterLabel}
                  </p>
                  {activeImage.caption && (
                    <p className="min-w-0 flex-1 text-sm text-content-secondary">{activeImage.caption}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2" aria-label={label}>
                    {images.map((image, index) => (
                      <button
                        key={`${image.src}-${index}`}
                        type="button"
                        aria-label={`${image.alt} (${index + 1} / ${imageCount})`}
                        aria-pressed={activeIndex === index}
                        onClick={() => setActiveIndex(index)}
                        className={`relative size-12 overflow-hidden rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                          activeIndex === index ? "border-accent" : "border-outline-default opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={image.src} alt="" fill sizes="48px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>,
          document.body,
        )}
      </AnimatePresence>
    </>
  );
}
