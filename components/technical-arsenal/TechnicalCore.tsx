"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, type PointerEvent } from "react";
import type { SkillDomainId } from "@/data/skills";

const nodePositions: Readonly<Record<SkillDomainId, { x: number; y: number }>> = {
  "backend-engineering": { x: 50, y: 11 },
  "frontend-engineering": { x: 88, y: 50 },
  "data-science": { x: 50, y: 89 },
  "ai-machine-learning": { x: 12, y: 50 },
};

interface TechnicalCoreProps {
  domainId: SkillDomainId;
  domainTitle: string;
  coreLabel: string;
  activeDomainLabel: string;
  accentToken: string;
}

export default function TechnicalCore({
  domainId,
  domainTitle,
  coreLabel,
  activeDomainLabel,
  accentToken,
}: TechnicalCoreProps) {
  const shouldReduceMotion = useReducedMotion();
  const pointerRect = useRef<DOMRect | null>(null);
  const supportsFinePointer = useRef(false);
  const tiltXTarget = useMotionValue(0);
  const tiltYTarget = useMotionValue(0);
  const tiltX = useSpring(tiltXTarget, { stiffness: 180, damping: 24, mass: 0.5 });
  const tiltY = useSpring(tiltYTarget, { stiffness: 180, damping: 24, mass: 0.5 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncPointer = () => {
      supportsFinePointer.current = media.matches;
      if (!media.matches) {
        tiltXTarget.set(0);
        tiltYTarget.set(0);
      }
    };
    syncPointer();
    media.addEventListener("change", syncPointer);
    return () => media.removeEventListener("change", syncPointer);
  }, [tiltXTarget, tiltYTarget]);

  useEffect(() => {
    if (!shouldReduceMotion) return;
    pointerRect.current = null;
    tiltXTarget.set(0);
    tiltYTarget.set(0);
  }, [shouldReduceMotion, tiltXTarget, tiltYTarget]);

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (supportsFinePointer.current && !shouldReduceMotion) {
      pointerRect.current = event.currentTarget.getBoundingClientRect();
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = pointerRect.current;
    if (!rect || !supportsFinePointer.current || shouldReduceMotion) return;
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
    tiltXTarget.set(-normalizedY * 5);
    tiltYTarget.set(normalizedX * 5);
  };

  const resetPointer = () => {
    pointerRect.current = null;
    tiltXTarget.set(0);
    tiltYTarget.set(0);
  };

  return (
    <figure className="flex min-w-0 flex-col items-center justify-center">
      <motion.div
        role="img"
        aria-label={`${coreLabel}. ${activeDomainLabel}: ${domainTitle}`}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
        className="relative aspect-square w-48 select-none sm:w-56 lg:w-60"
      >
        <div
          aria-hidden="true"
          className="absolute inset-[13%] rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: `var(${accentToken})` }}
        />
        <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" className="relative h-full w-full overflow-visible">
          <circle cx="50" cy="50" r="47" fill="none" stroke="var(--theme-outline-subtle)" strokeWidth="0.35" strokeDasharray="1 3" />
          <motion.ellipse
            cx="50"
            cy="50"
            rx="39"
            ry="19"
            transform="rotate(-28 50 50)"
            fill="none"
            stroke={`var(${accentToken})`}
            strokeWidth="0.7"
            strokeDasharray="1.5 2.5"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
            transition={shouldReduceMotion ? { duration: 0 } : { repeat: Infinity, duration: 46, ease: "linear" }}
          />

          {Object.entries(nodePositions).map(([id, position]) => {
            const isActive = id === domainId;
            return (
              <motion.line
                key={`link-${id}`}
                x1="50"
                y1="50"
                x2={position.x}
                y2={position.y}
                stroke={isActive ? `var(${accentToken})` : "var(--theme-outline-default)"}
                strokeWidth={isActive ? "1.6" : "0.65"}
                strokeLinecap="round"
                initial={false}
                animate={{ opacity: isActive ? 0.95 : 0.4 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
              />
            );
          })}

          <circle cx="50" cy="50" r="22" fill="var(--theme-surface)" stroke="var(--theme-outline-subtle)" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="17.5" fill="none" stroke={`var(${accentToken})`} strokeWidth="0.55" opacity="0.6" />
          <circle cx="50" cy="50" r="8" fill={`var(${accentToken})`} opacity="0.13" />
          <circle cx="50" cy="50" r="2.8" fill={`var(${accentToken})`} />
          {Object.entries(nodePositions).map(([id, position]) => {
            const isActive = id === domainId;
            return (
              <g key={`node-${id}`}>
                <motion.circle
                  cx={position.x}
                  cy={position.y}
                  r={isActive ? 8.2 : 5.5}
                  fill={`var(${accentToken})`}
                  opacity={isActive ? 0.15 : 0.08}
                  initial={false}
                  animate={{ r: isActive ? 8.2 : 5.5, opacity: isActive ? 0.2 : 0.08 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
                />
                <motion.circle
                  cx={position.x}
                  cy={position.y}
                  r={isActive ? 3.1 : 2.2}
                  fill={isActive ? `var(${accentToken})` : "var(--theme-content-muted)"}
                  stroke="var(--theme-surface)"
                  strokeWidth="1"
                  initial={false}
                  animate={{ r: isActive ? 3.1 : 2.2 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
                />
              </g>
            );
          })}
        </svg>
      </motion.div>

      <figcaption className="mt-1 text-center">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-content-muted">{coreLabel}</span>
        <span className="mt-1 block text-sm font-semibold text-content-primary">{domainTitle}</span>
      </figcaption>
    </figure>
  );
}
