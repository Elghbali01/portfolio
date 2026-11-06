"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ProjectImageLightboxProps {
  src: string;
  alt: string;
  label: string;
  closeLabel: string;
}

function ExpandIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 3H3v5M3 3l6 6M16 3h5v5M21 3l-6 6M8 21H3v-5M3 21l6-6M16 21h5v-5M21 21l-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export default function ProjectImageLightbox({
  src,
  alt,
  label,
  closeLabel,
}: ProjectImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={label}
        onClick={() => setOpen(true)}
        className="group relative block h-full w-full cursor-zoom-in text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
      >
        <Image
          src={src}
          alt={alt}
          fill
          quality={82}
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-contain transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.025]"
        />
        <span className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-end">
          <span className="rounded-full border border-white/20 bg-black/55 p-2 text-white shadow-lg backdrop-blur-sm transition-colors group-hover:bg-black/70">
            <ExpandIcon />
            <span className="sr-only">{label}</span>
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="project-image-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-8"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-surface-elevated shadow-2xl"
              initial={shouldReduceMotion ? false : { scale: 0.98, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { scale: 0.98, y: 8 }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={closeLabel}
                onClick={() => setOpen(false)}
                className="absolute end-4 top-4 z-10 rounded-full border border-white/20 bg-black/60 p-2 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <CloseIcon />
              </button>
              <div className="relative h-[min(78vh,760px)] w-full bg-surface-inset">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  quality={90}
                  sizes="(min-width: 1280px) 1152px, 94vw"
                  className="object-contain p-4 md:p-8"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
