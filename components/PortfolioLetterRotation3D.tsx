"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { PORTFOLIO_WORDMARK_TYPOGRAPHY_CLASS } from "@/components/PortfolioWordmark";

const EXTRUSION_LAYERS = 12;
const ROTATION_KEYFRAMES = [0, 90, 180, 270, 360] as const;
const ROTATION_KEYFRAME_TIMES = [0, 0.25, 0.5, 0.75, 1] as const;

export const PORTFOLIO_ROTATION_DURATION_MS = 1_600;

export interface PortfolioLetter3DPosition {
  glyph: string;
  left: number;
  top: number;
  color: string;
  accent: boolean;
}

interface PortfolioLetterRotation3DProps {
  letters: PortfolioLetter3DPosition[];
  fontSize: string;
  depth: number;
  settling: boolean;
  onComplete: () => void;
}

function getSideColors(accent: boolean) {
  return accent
    ? { near: "var(--theme-accent-soft)", far: "var(--theme-action)" }
    : { near: "var(--theme-content-strong)", far: "var(--theme-outline-strong)" };
}

export default function PortfolioLetterRotation3D({
  letters,
  fontSize,
  depth,
  settling,
  onComplete,
}: PortfolioLetterRotation3DProps) {
  const completedLetters = useRef(new Set<number>());

  return (
    <motion.div
      data-intro-logo-letter-overlay
      initial={false}
      animate={{ opacity: settling ? 0 : 1 }}
      transition={{ duration: settling ? 0.08 : 0, ease: "linear" }}
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        pointerEvents: "none",
      }}
    >
      {letters.map(({ glyph, left, top, color, accent }, letterIndex) => {
        const sideColors = getSideColors(accent);

        return (
          <motion.span
            key={`${glyph}-${letterIndex}`}
            data-intro-rotation-glyph={letterIndex}
            initial={{ rotateY: ROTATION_KEYFRAMES[0] }}
            animate={{ rotateY: [...ROTATION_KEYFRAMES] }}
            transition={{
              duration: PORTFOLIO_ROTATION_DURATION_MS / 1_000,
              ease: "linear",
              times: [...ROTATION_KEYFRAME_TIMES],
            }}
            onAnimationComplete={() => {
              completedLetters.current.add(letterIndex);
              if (completedLetters.current.size === letters.length) onComplete();
            }}
            className={PORTFOLIO_WORDMARK_TYPOGRAPHY_CLASS}
            style={{
              position: "absolute",
              top,
              left,
              display: "inline-block",
              fontSize,
              lineHeight: "1.333333",
              whiteSpace: "pre",
              color,
              backfaceVisibility: "visible",
              transformOrigin: "center center",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <span
              data-intro-letter-front
              style={{
                position: "relative",
                display: "inline-block",
                color,
                transform: `translateZ(${depth / 2}px)`,
                backfaceVisibility: "visible",
              }}
            >
              {glyph}
            </span>

            {Array.from({ length: EXTRUSION_LAYERS }, (_, layerIndex) => {
              const depthProgress = (layerIndex + 1) / (EXTRUSION_LAYERS + 1);
              const z = depth / 2 - depth * depthProgress;

              return (
                <span
                  key={`${glyph}-${letterIndex}-extrusion-${layerIndex}`}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "inline-block",
                    color: depthProgress < 0.45 ? sideColors.near : sideColors.far,
                    fontSize,
                    lineHeight: "1.333333",
                    whiteSpace: "pre",
                    transform: `translateZ(${z}px)`,
                    backfaceVisibility: "visible",
                  }}
                >
                  {glyph}
                </span>
              );
            })}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
