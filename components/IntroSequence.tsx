"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Locale, TextDirection } from "@/i18n";
import PageIntroLoader, {
  CIRCLE_EXIT_DURATION_MS,
  LOGO_ASSEMBLY_HOLD_MS,
  LOGO_ASSEMBLY_SETTLE_MS,
  LOGO_SPLIT_DURATION_MS,
} from "@/components/PageIntroLoaderCinematic";

export type IntroPhase =
  | "loading"
  | "circleExit"
  | "logo"
  | "assembling"
  | "assembled"
  | "moving"
  | "reveal"
  | "complete";

export interface IntroElementOrigin {
  x: number;
  y: number;
  scale: number;
}

export interface IntroHeroOrigins {
  photo: IntroElementOrigin;
  copy: IntroElementOrigin;
}

export interface IntroSequenceContextValue {
  active: boolean;
  phase: IntroPhase;
  progress: number;
  reducedMotion: boolean;
  revealStarted: boolean;
  heroOrigins: IntroHeroOrigins | null;
}

const INTRO_STORAGE_KEY = "portfolio-intro-sequence-v1";
const PROGRESS_DURATION_MS = 2_500;
const LOGO_MOVE_DURATION_MS = 900;
const REVEAL_DURATION_MS = 1_050;
const HERO_REVEAL_OVERLAP_DELAY_MS = 320;
const FAILSAFE_MS = 12_000;

let introStartedThisDocument = false;

const defaultContext: IntroSequenceContextValue = {
  active: false,
  phase: "complete",
  progress: 100,
  reducedMotion: false,
  revealStarted: true,
  heroOrigins: null,
};

const IntroSequenceContext = createContext<IntroSequenceContextValue>(defaultContext);

interface IntroSequenceProviderProps {
  children: ReactNode;
  locale: Locale;
  phrase: string;
  direction: TextDirection;
}

function isLocalizedHome(pathname: string | null, locale: Locale) {
  return pathname === `/${locale}` || pathname === `/${locale}/`;
}

function hasPlayedIntro() {
  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "played";
  } catch {
    return false;
  }
}

function markIntroAsPlayed() {
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "played");
  } catch {
    // Private browsing modes can deny sessionStorage. The failsafe still applies.
  }
}

function isDocumentReload() {
  const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const legacyNavigation = performance as Performance & { navigation?: { type?: number } };
  return navigationEntry?.type === "reload" || legacyNavigation.navigation?.type === 1;
}

function getUntransformedCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const transform = window.getComputedStyle(element).transform;
  const matrix = transform === "none" ? null : new DOMMatrixReadOnly(transform);

  return {
    x: rect.left + rect.width / 2 - (matrix?.m41 ?? 0),
    y: rect.top + rect.height / 2 - (matrix?.m42 ?? 0),
  };
}

export default function IntroSequenceProvider({
  children,
  locale,
  phrase,
  direction,
}: IntroSequenceProviderProps) {
  const pathname = usePathname();
  const homeRoute = isLocalizedHome(pathname, locale);
  const [active, setActive] = useState(homeRoute);
  const [phase, setPhase] = useState<IntroPhase>(homeRoute ? "loading" : "complete");
  const [progress, setProgress] = useState(homeRoute ? 1 : 100);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [heroRevealStarted, setHeroRevealStarted] = useState(!homeRoute);
  const [heroOrigins, setHeroOrigins] = useState<IntroHeroOrigins | null>(null);
  const initialPathnameRef = useRef(pathname);
  const activeRunRef = useRef<{ key: string; cancel: () => void } | null>(null);
  const cleanupTimerRef = useRef<number | null>(null);
  const assemblyCompleteRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = motionQuery.matches;
    setReducedMotion(reduceMotion);
    const runKey = `${pathname ?? ""}|${locale}`;
    const currentRun = activeRunRef.current;

    if (currentRun && currentRun.key !== runKey) {
      currentRun.cancel();
      activeRunRef.current = null;
    }

    if (!homeRoute || reduceMotion || !isLocalizedHome(initialPathnameRef.current, locale)) {
      setActive(false);
      setPhase("complete");
      setProgress(100);
      setHeroRevealStarted(true);
      setHeroOrigins(null);
      return undefined;
    }

    if (activeRunRef.current?.key === runKey) return undefined;

    const shouldPlay = !introStartedThisDocument && (isDocumentReload() || !hasPlayedIntro());
    if (!shouldPlay) {
      setActive(false);
      setPhase("complete");
      setProgress(100);
      setHeroRevealStarted(true);
      setHeroOrigins(null);
      return undefined;
    }

    introStartedThisDocument = true;
    // Persist the fact that this document has started the sequence so locale changes
    // that remount the layout do not launch a second intro in the same tab session.
    markIntroAsPlayed();
    setActive(true);
    setHeroRevealStarted(false);
    setHeroOrigins(null);
    setPhase("loading");
    setProgress(1);

    let animationFrame = 0;
    let circleExitTimer = 0;
    let splitTimer = 0;
    let assemblyTimer = 0;
    let assemblyHoldTimer = 0;
    let heroRevealTimer = 0;
    let heroRevealFrame = 0;
    let moveTimer = 0;
    let revealTimer = 0;
    let failsafeTimer = 0;
    let startedAt: number | null = null;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(circleExitTimer);
      window.clearTimeout(splitTimer);
      window.clearTimeout(assemblyTimer);
      window.clearTimeout(assemblyHoldTimer);
      window.clearTimeout(heroRevealTimer);
      window.cancelAnimationFrame(heroRevealFrame);
      window.clearTimeout(moveTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(failsafeTimer);
      assemblyCompleteRef.current = null;
      setProgress(100);
      setPhase("complete");
      setHeroRevealStarted(true);
      setActive(false);
      if (activeRunRef.current?.key === runKey) activeRunRef.current = null;
    };

    const revealHeroFromLogo = () => {
      if (settled) return;

      const logo = document.querySelector<HTMLElement>("[data-intro-logo-motion]");
      const photo = document.querySelector<HTMLElement>("[data-intro-hero-photo]");
      const copy = document.querySelector<HTMLElement>("[data-intro-hero-copy]");
      const navbarLogo = document.querySelector<HTMLElement>("[data-portfolio-logo-target]");

      if (logo && photo && copy && navbarLogo) {
        const logoRect = logo.getBoundingClientRect();
        const photoCenter = getUntransformedCenter(photo);
        const copyCenter = getUntransformedCenter(copy);
        const navbarRect = navbarLogo.getBoundingClientRect();
        const navbarCenter = {
          x: navbarRect.left + navbarRect.width / 2,
          y: navbarRect.top + navbarRect.height / 2,
        };
        const logoCenter = {
          x: logoRect.left + logoRect.width / 2,
          y: logoRect.top + logoRect.height / 2,
        };

        setHeroOrigins({
          photo: { x: logoCenter.x - photoCenter.x, y: logoCenter.y - photoCenter.y, scale: 0.38 },
          copy: { x: navbarCenter.x - copyCenter.x, y: navbarCenter.y - copyCenter.y, scale: 0.96 },
        });
      }

      heroRevealFrame = window.requestAnimationFrame(() => {
        if (!settled) setHeroRevealStarted(true);
      });
    };

    const beginReveal = () => {
      if (settled) return;
      setHeroRevealStarted(true);
      setPhase("reveal");
      revealTimer = window.setTimeout(finish, REVEAL_DURATION_MS);
    };

    const beginMove = () => {
      if (settled) return;
      setPhase("moving");
      heroRevealTimer = window.setTimeout(revealHeroFromLogo, HERO_REVEAL_OVERLAP_DELAY_MS);
      moveTimer = window.setTimeout(beginReveal, LOGO_MOVE_DURATION_MS);
    };

    const holdAssembledLogo = () => {
      if (settled) return;
      assemblyCompleteRef.current = null;
      window.clearTimeout(assemblyTimer);
      setPhase("assembled");
      assemblyHoldTimer = window.setTimeout(beginMove, LOGO_ASSEMBLY_HOLD_MS);
    };

    const beginAssembly = () => {
      if (settled) return;
      assemblyCompleteRef.current = holdAssembledLogo;
      setPhase("assembling");
      // The letters report their actual animation completion. Keep a fallback for
      // browsers that cannot render the CSS 3D layer or if the overlay fails to mount.
      assemblyTimer = window.setTimeout(holdAssembledLogo, LOGO_ASSEMBLY_SETTLE_MS + 500);
    };

    const beginLogoSplit = () => {
      if (settled) return;
      setPhase("logo");
      splitTimer = window.setTimeout(beginAssembly, LOGO_SPLIT_DURATION_MS);
    };

    const finishProgress = () => {
      if (settled) return;
      setProgress(100);
      setPhase("circleExit");
      circleExitTimer = window.setTimeout(beginLogoSplit, CIRCLE_EXIT_DURATION_MS);
    };

    const updateProgress = (timestamp: number) => {
      if (settled) return;
      startedAt ??= timestamp;
      const elapsed = timestamp - startedAt;
      const linearProgress = Math.min(1, elapsed / PROGRESS_DURATION_MS);
      const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
      const nextProgress = Math.max(1, Math.min(100, Math.floor(easedProgress * 100)));
      setProgress(nextProgress);

      if (linearProgress < 1) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      } else {
        finishProgress();
      }
    };

    animationFrame = window.requestAnimationFrame(updateProgress);
    failsafeTimer = window.setTimeout(finish, FAILSAFE_MS);

    const cancel = () => {
      if (settled) return;
      settled = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(circleExitTimer);
      window.clearTimeout(splitTimer);
      window.clearTimeout(assemblyTimer);
      window.clearTimeout(assemblyHoldTimer);
      window.clearTimeout(heroRevealTimer);
      window.cancelAnimationFrame(heroRevealFrame);
      window.clearTimeout(moveTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(failsafeTimer);
      assemblyCompleteRef.current = null;
    };

    activeRunRef.current = { key: runKey, cancel };

    return () => {
      cleanupTimerRef.current = window.setTimeout(() => {
        if (activeRunRef.current?.key === runKey) {
          activeRunRef.current.cancel();
          activeRunRef.current = null;
        }
        cleanupTimerRef.current = null;
      }, 0);
    };
  }, [homeRoute, locale, pathname, phrase]);

  const value = useMemo<IntroSequenceContextValue>(
    () => ({
      active,
      phase,
      progress,
      reducedMotion,
      revealStarted: !active || heroRevealStarted || phase === "reveal" || phase === "complete",
      heroOrigins,
    }),
    [active, heroOrigins, heroRevealStarted, phase, progress, reducedMotion],
  );

  return (
    <IntroSequenceContext.Provider value={value}>
      {homeRoute && active && phase !== "complete" && (
        <PageIntroLoader
          phrase={phrase}
          direction={direction}
          phase={phase}
          progress={progress}
          onAssemblyAnimationComplete={() => {
            if (phase === "assembling") assemblyCompleteRef.current?.();
          }}
        />
      )}
      {children}
    </IntroSequenceContext.Provider>
  );
}

export function useIntroSequence() {
  return useContext(IntroSequenceContext);
}
