"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

const defaultPhrases = [
  "Full-Stack Developer",
  "Data Scientist",
  "Machine Learning Explorer",
  "Building Intelligent Systems",
  "Data-Driven Problem Solver",
] as const;

export type RotatingTextProps = {
  phrases?: readonly string[];
  locale?: string;
  dir?: "ltr" | "rtl" | "auto";
};

function splitGraphemes(value: string, locale?: string) {
  if (typeof Intl.Segmenter === "function") {
    try {
      const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
      return Array.from(segmenter.segment(value), ({ segment }) => segment);
    } catch {
      // An invalid or unsupported locale should not break the visible heading.
    }
  }

  // Array.from keeps Unicode code points intact on older browsers. Modern
  // browsers use Intl.Segmenter above for complete grapheme clusters.
  return Array.from(value);
}

export default function RotatingText({
  phrases = defaultPhrases,
  locale,
  dir = "auto",
}: RotatingTextProps) {
  const usablePhrases = phrases.length > 0 ? phrases : defaultPhrases;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "holding",
  );
  const [visibleCount, setVisibleCount] = useState(() =>
    splitGraphemes(usablePhrases[0], locale).length,
  );
  const prefersReducedMotion = useReducedMotion();
  const phraseCount = usablePhrases.length;
  const currentPhrase = usablePhrases[index % phraseCount];
  const graphemes = useMemo(
    () => splitGraphemes(currentPhrase, locale),
    [currentPhrase, locale],
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let delay = 65;
    let next: () => void;

    if (phase === "holding") {
      delay = 1800;
      next = () => setPhase("deleting");
    } else if (phase === "deleting" && visibleCount > 0) {
      delay = 35;
      next = () => setVisibleCount((count) => Math.max(0, count - 1));
    } else if (phase === "deleting") {
      delay = 250;
      next = () => {
        setIndex((current) => (current + 1) % phraseCount);
        setPhase("typing");
      };
    } else if (visibleCount < graphemes.length) {
      next = () =>
        setVisibleCount((count) => Math.min(graphemes.length, count + 1));
    } else {
      delay = 0;
      next = () => setPhase("holding");
    }

    const timeout = window.setTimeout(next, delay);
    return () => window.clearTimeout(timeout);
  }, [
    graphemes.length,
    phase,
    phraseCount,
    prefersReducedMotion,
    visibleCount,
  ]);

  const visibleText = prefersReducedMotion
    ? currentPhrase
    : graphemes.slice(0, visibleCount).join("");

  return (
    <div className="min-h-8 overflow-visible text-blue-400">
      <span className="sr-only">{usablePhrases[0]}</span>
      <bdi
        dir={dir}
        aria-hidden="true"
        className="typewriter-caret inline font-medium leading-relaxed"
      >
        {visibleText}
      </bdi>
    </div>
  );
}
