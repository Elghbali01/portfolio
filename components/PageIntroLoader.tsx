"use client";

import { useEffect, useRef, useState } from "react";

const PROGRESS_DURATION_MS = 1_400;
const COMPLETION_HOLD_MS = 120;
const FADE_DURATION_MS = 180;
const FAILSAFE_MS = 2_400;
const TYPEWRITER_COMPLETE_AT_PERCENT = 82;
const RADIUS = 64;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type LoaderPhase = "running" | "exiting" | "complete";

interface PageIntroLoaderProps {
  phrase: string;
  direction: "ltr" | "rtl";
}

export default function PageIntroLoader({ phrase, direction }: PageIntroLoaderProps) {
  const [phase, setPhase] = useState<LoaderPhase>("running");
  const loaderRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("complete");
      return;
    }

    let animationFrame = 0;
    let completionTimer = 0;
    let removalTimer = 0;
    let failsafeTimer = 0;
    let startedAt: number | null = null;
    let finishing = false;
    let settled = false;
    let renderedCharacterCount = -1;

    const renderProgress = (progress: number) => {
      if (loaderRef.current) loaderRef.current.dataset.progress = String(progress);
      if (progressTextRef.current) progressTextRef.current.textContent = `${progress}%`;
      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress / 100));
      }

      const phraseProgress = Math.min(1, progress / TYPEWRITER_COMPLETE_AT_PERCENT);
      const characterCount = Math.min(phrase.length, Math.floor(phrase.length * phraseProgress));

      if (phraseRef.current && characterCount !== renderedCharacterCount) {
        renderedCharacterCount = characterCount;
        phraseRef.current.textContent = phrase.slice(0, characterCount);
        phraseRef.current.style.opacity = characterCount > 0 ? "1" : "0";
      }
    };

    const removeLoader = () => {
      if (settled) return;
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(completionTimer);
      window.clearTimeout(removalTimer);
      window.clearTimeout(failsafeTimer);
      setPhase("complete");
    };

    const finish = () => {
      if (settled || finishing) return;
      finishing = true;
      renderProgress(100);
      window.clearTimeout(failsafeTimer);
      completionTimer = window.setTimeout(() => {
        if (settled) return;
        setPhase("exiting");
        removalTimer = window.setTimeout(removeLoader, FADE_DURATION_MS);
      }, COMPLETION_HOLD_MS);
    };

    const updateProgress = (timestamp: number) => {
      if (settled || finishing) return;
      startedAt ??= timestamp;
      const elapsed = timestamp - startedAt;
      const nextProgress = Math.min(100, Math.floor((elapsed / PROGRESS_DURATION_MS) * 100));

      renderProgress(nextProgress);

      if (nextProgress < 100) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      } else {
        finish();
      }
    };

    animationFrame = window.requestAnimationFrame(updateProgress);
    failsafeTimer = window.setTimeout(removeLoader, FAILSAFE_MS);

    return () => {
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(completionTimer);
      window.clearTimeout(removalTimer);
      window.clearTimeout(failsafeTimer);
    };
  }, [phrase]);

  if (phase === "complete") return null;

  return (
    <div
      ref={loaderRef}
      aria-hidden="true"
      data-progress="0"
      data-testid="portfolio-loading-screen"
      className="motion-reduce:hidden"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #020617 0%, #0B1120 55%, #111827 100%)",
        opacity: phase === "exiting" ? 0 : 1,
        transition: `opacity ${FADE_DURATION_MS}ms ease-out`,
        pointerEvents: phase === "exiting" ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "11.5rem",
            height: "11.5rem",
            alignItems: "center",
            justifyContent: "center",
            direction: "ltr",
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 180 180"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(96, 165, 250, 0.16)" strokeWidth="1" />
            <circle cx="90" cy="90" r="71" fill="none" stroke="rgba(148, 163, 184, 0.28)" strokeWidth="3" />
            <circle
              ref={progressCircleRef}
              cx="90"
              cy="90"
              r={RADIUS}
              fill="none"
              stroke="url(#loader-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              transform="rotate(-90 90 90)"
              style={{ filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.55))" }}
            />
            <defs>
              <linearGradient id="loader-gradient" x1="20" y1="20" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          <span
            ref={progressTextRef}
            style={{
              color: "#F8FAFC",
              fontFamily: "var(--font-geist-sans), Arial, sans-serif",
              fontSize: "1.875rem",
              fontWeight: 650,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.04em",
            }}
          >
            0%
          </span>
        </div>

        <p
          ref={phraseRef}
          data-testid="portfolio-loading-phrase"
          dir={direction}
          style={{
            width: "min(82vw, 30rem)",
            minHeight: "2.75rem",
            margin: "1.25rem 1rem 0",
            color: "#60A5FA",
            fontFamily: "var(--font-geist-sans), Arial, sans-serif",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            letterSpacing: direction === "rtl" ? "normal" : "0.035em",
            overflowWrap: "anywhere",
            textAlign: "center",
            opacity: 0,
            transition: "opacity 180ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
