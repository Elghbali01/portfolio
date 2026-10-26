"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { IntroPhase } from "@/components/IntroSequence";
import PortfolioWordmark, {
  PORTFOLIO_WORDMARK_TYPOGRAPHY_CLASS,
} from "@/components/PortfolioWordmark";
import PortfolioLetterRotation3D, {
  PORTFOLIO_ROTATION_DURATION_MS,
  type PortfolioLetter3DPosition,
} from "@/components/PortfolioLetterRotation3D";

const RADIUS = 64;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TYPEWRITER_COMPLETE_AT_PERCENT = 82;
const LOGO_EASE = [0.22, 1, 0.36, 1] as const;
const LOGO_SPLIT_EASE = [0.215, 0.61, 0.355, 1] as const;
const INTRO_LOGO_SIZE = "clamp(2.75rem, 8vw, 5.5rem)";

interface PageIntroLoaderProps {
  phrase: string;
  direction: "ltr" | "rtl";
  phase: IntroPhase;
  progress: number;
  onAssemblyAnimationComplete: () => void;
}

interface LogoTarget {
  x: number;
  y: number;
  scale: number;
}

interface LogoGeometry {
  folioLeft: number;
  letters: PortfolioLetter3DPosition[];
  depth: number;
}

export const CIRCLE_EXIT_DURATION_MS = 540;
export const LOGO_SPLIT_DURATION_MS = 1_150;
export const LOGO_ASSEMBLY_DURATION_MS = PORTFOLIO_ROTATION_DURATION_MS;
export const LOGO_ASSEMBLY_SETTLE_MS = PORTFOLIO_ROTATION_DURATION_MS + 50;
export const LOGO_ASSEMBLY_HOLD_MS = 240;

export default function PageIntroLoaderCinematic({
  phrase,
  direction,
  phase,
  progress,
  onAssemblyAnimationComplete,
}: PageIntroLoaderProps) {
  const [logoTarget, setLogoTarget] = useState<LogoTarget | null>(null);
  const [logoGeometry, setLogoGeometry] = useState<LogoGeometry | null>(null);
  const logoMotionRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const characterCount = Math.min(
    phrase.length,
    Math.floor(phrase.length * Math.min(1, progress / TYPEWRITER_COMPLETE_AT_PERCENT)),
  );
  const circleVisible = phase === "loading";
  const circleExiting = phase === "circleExit";
  const phraseVisible = phase === "loading" || phase === "circleExit";
  const logoVisible =
    phase === "logo" || phase === "assembling" || phase === "assembled" || phase === "moving" || phase === "reveal";
  const logoMoving = phase === "moving" || phase === "reveal";
  const assemblyActive = phase === "assembling";
  const assemblyVisible = assemblyActive || phase === "assembled";
  const supportsCss3d =
    typeof CSS !== "undefined" &&
    CSS.supports("transform-style", "preserve-3d") &&
    CSS.supports("perspective", "1100px");
  const rotationActive = assemblyActive && supportsCss3d;

  useLayoutEffect(() => {
    if (phase !== "moving") return;

    const measureTarget = () => {
      const target = document.querySelector<HTMLElement>("[data-portfolio-logo-target]");
      const logo = wordmarkRef.current;
      const motionLayer = logoMotionRef.current;
      if (!target || !logo || !motionLayer) return;

      const targetRect = target.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      const transform = window.getComputedStyle(motionLayer).transform;
      const matrix = transform === "none" ? null : new DOMMatrixReadOnly(transform);
      const currentScale = matrix?.a || 1;
      const baseCenterX = logoRect.left + logoRect.width / 2 - (matrix?.m41 ?? 0);
      const baseCenterY = logoRect.top + logoRect.height / 2 - (matrix?.m42 ?? 0);
      setLogoTarget({
        x: targetRect.left + targetRect.width / 2 - baseCenterX,
        y: targetRect.top + targetRect.height / 2 - baseCenterY,
        scale: targetRect.width / Math.max(1, logoRect.width / currentScale),
      });
    };

    measureTarget();
    window.addEventListener("resize", measureTarget);
    return () => window.removeEventListener("resize", measureTarget);
  }, [phase]);

  useLayoutEffect(() => {
    if (!logoVisible) return;

    const measureLogoGeometry = () => {
      const wordmark = wordmarkRef.current;
      const motionLayer = logoMotionRef.current;
      const portText = wordmark?.firstChild;
      const folioText = wordmark?.querySelector<HTMLElement>("[data-wordmark-accent]")?.firstChild;
      if (!wordmark || !motionLayer || !portText || !folioText) return;

      const parentTransform = window.getComputedStyle(motionLayer).transform;
      const parentMatrix = parentTransform === "none" ? null : new DOMMatrixReadOnly(parentTransform);
      const scale = parentMatrix?.a || 1;
      const wordRect = wordmark.getBoundingClientRect();
      const fontSize = Number.parseFloat(window.getComputedStyle(wordmark).fontSize);
      const measureRange = (node: Node, start: number, end: number) => {
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, end);
        return range.getBoundingClientRect();
      };
      const folioRect = measureRange(folioText, 0, folioText.textContent?.length ?? 0);
      const letters: PortfolioLetter3DPosition[] = [];

      for (const [node, text, color, accent] of [
        [portText, "Port", "var(--theme-content-primary)", false],
        [folioText, "folio", "var(--theme-accent)", true],
      ] as const) {
        Array.from(text).forEach((glyph, index) => {
          const rect = measureRange(node, index, index + 1);
          letters.push({
            glyph,
            left: (rect.left - wordRect.left) / scale,
            top: (rect.top - wordRect.top) / scale,
            color,
            accent,
          });
        });
      }

      setLogoGeometry({
        folioLeft: (folioRect.left - wordRect.left) / scale,
        letters,
        depth: Math.min(6, Math.max(3, fontSize * 0.065)),
      });
    };

    measureLogoGeometry();
    window.addEventListener("resize", measureLogoGeometry);
    return () => window.removeEventListener("resize", measureLogoGeometry);
  }, [logoVisible]);

  return (
    <motion.div
      aria-hidden="true"
      data-progress={progress}
      data-testid="portfolio-loading-screen"
      className="motion-reduce:hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "reveal" ? 0 : 1 }}
      transition={{ duration: phase === "reveal" ? 0.72 : 0.2, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, var(--theme-gradient-start) 0%, var(--theme-gradient-middle) 55%, var(--theme-gradient-end) 100%)",
        pointerEvents: phase === "reveal" ? "none" : "auto",
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
        <motion.div
          animate={{
            opacity: circleVisible ? 1 : 0,
            scale: circleVisible ? 1 : 0.92,
            y: circleExiting ? -280 : phase === "loading" ? 0 : -280,
          }}
          transition={{ duration: circleExiting ? CIRCLE_EXIT_DURATION_MS / 1000 : 0.34, ease: LOGO_EASE }}
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
            <circle cx="90" cy="90" r="78" fill="none" stroke="color-mix(in srgb, var(--theme-accent) 16%, transparent)" strokeWidth="1" />
            <circle cx="90" cy="90" r="71" fill="none" stroke="color-mix(in srgb, var(--theme-content-subtle) 28%, transparent)" strokeWidth="3" />
            <circle
              cx="90"
              cy="90"
              r={RADIUS}
              fill="none"
              stroke="url(#loader-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress / 100)}
              transform="rotate(-90 90 90)"
              style={{ filter: "drop-shadow(0 0 8px color-mix(in srgb, var(--theme-accent) 55%, transparent))" }}
            />
            <defs>
              <linearGradient id="loader-gradient" x1="20" y1="20" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--theme-accent)" />
                <stop offset="1" stopColor="var(--theme-glow-secondary)" />
              </linearGradient>
            </defs>
          </svg>

          <span
            style={{
              color: "var(--theme-content-primary)",
              fontFamily: "var(--font-geist-sans), Arial, sans-serif",
              fontSize: "1.875rem",
              fontWeight: 650,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.04em",
            }}
          >
            {progress}%
          </span>
        </motion.div>

        <motion.p
          data-testid="portfolio-loading-phrase"
          dir={direction}
          animate={{ opacity: phraseVisible ? 1 : 0, y: phraseVisible ? 0 : -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          style={{
            width: "min(82vw, 30rem)",
            minHeight: "2.75rem",
            margin: "1.25rem 1rem 0",
            color: "var(--theme-accent)",
            fontFamily: "var(--font-geist-sans), Arial, sans-serif",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            letterSpacing: direction === "rtl" ? "normal" : "0.035em",
            overflowWrap: "anywhere",
            textAlign: "center",
          }}
        >
          {phrase.slice(0, characterCount)}
        </motion.p>
      </div>

      {logoVisible && (
        <div
          data-intro-logo
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "max-content",
            perspective: "1100px",
            perspectiveOrigin: "center center",
            transform: "translate(-50%, -50%)",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            ref={logoMotionRef}
            data-intro-logo-motion
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
              opacity: 1,
              scale: logoMoving && logoTarget ? logoTarget.scale : 1,
              x: logoMoving && logoTarget ? logoTarget.x : 0,
              y: logoMoving && logoTarget ? logoTarget.y : 0,
            }}
            transition={{ duration: 0.9, ease: LOGO_EASE }}
            style={{
              position: "relative",
              display: "block",
              width: "max-content",
              fontSize: INTRO_LOGO_SIZE,
              lineHeight: "1.333333",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              willChange: "transform, opacity",
            }}
          >
            <PortfolioWordmark
              ref={wordmarkRef}
              data-intro-logo-word
              className="block"
              style={{
                fontSize: INTRO_LOGO_SIZE,
                whiteSpace: "nowrap",
                opacity: phase === "logo" || rotationActive ? 0 : 1,
                transition: "opacity 80ms linear",
              }}
            />

            {phase === "logo" && logoGeometry && (
              <>
                <motion.span
                  className={PORTFOLIO_WORDMARK_TYPOGRAPHY_CLASS}
                  initial={{ opacity: 0, x: "-55vw" }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.32 },
                    x: { duration: LOGO_SPLIT_DURATION_MS / 1000, ease: LOGO_SPLIT_EASE },
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    fontSize: INTRO_LOGO_SIZE,
                    whiteSpace: "nowrap",
                    willChange: "transform, opacity",
                  }}
                >
                  Port
                </motion.span>
                <motion.span
                  className={PORTFOLIO_WORDMARK_TYPOGRAPHY_CLASS}
                  initial={{ opacity: 0, x: "55vw" }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.32 },
                    x: { duration: LOGO_SPLIT_DURATION_MS / 1000, ease: LOGO_SPLIT_EASE },
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: logoGeometry.folioLeft,
                    color: "var(--theme-accent)",
                    fontSize: INTRO_LOGO_SIZE,
                    whiteSpace: "nowrap",
                    willChange: "transform, opacity",
                  }}
                >
                  folio
                </motion.span>
              </>
            )}

            {assemblyVisible && supportsCss3d && logoGeometry && (
              <PortfolioLetterRotation3D
                letters={logoGeometry.letters}
                fontSize={INTRO_LOGO_SIZE}
                depth={logoGeometry.depth}
                settling={phase === "assembled"}
                onComplete={onAssemblyAnimationComplete}
              />
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
