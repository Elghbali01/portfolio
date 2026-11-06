"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIntroSequence } from "@/components/IntroSequence";

const interactiveSelector = "a, button, input, select, textarea, summary, [role='button'], [data-cursor-hover]";

export default function CursorFollower() {
  const intro = useIntroSequence();
  const [enabled, setEnabled] = useState(false);
  const [positioned, setPositioned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const positionedRef = useRef(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const ringTargetX = useMotionValue(0);
  const ringTargetY = useMotionValue(0);
  const ringX = useSpring(ringTargetX, { stiffness: 480, damping: 36, mass: 0.28 });
  const ringY = useSpring(ringTargetY, { stiffness: 480, damping: 36, mass: 0.28 });

  useEffect(() => {
    const pointerCapability = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let listening = false;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const nextRingX = event.clientX - 20;
      const nextRingY = event.clientY - 20;
      const nextDotX = event.clientX - 5;
      const nextDotY = event.clientY - 5;
      if (!positionedRef.current) {
        ringX.jump(nextRingX);
        ringY.jump(nextRingY);
        positionedRef.current = true;
        setPositioned(true);
      }
      ringTargetX.set(nextRingX);
      ringTargetY.set(nextRingY);
      pointerX.set(nextDotX);
      pointerY.set(nextDotY);
    };

    const getInteractiveTarget = (target: EventTarget | null) =>
      target instanceof Element ? target.closest(interactiveSelector) : null;

    const handlePointerOver = (event: PointerEvent) => {
      const nextTarget = getInteractiveTarget(event.target);
      const previousTarget = getInteractiveTarget(event.relatedTarget);
      if (nextTarget !== previousTarget) setHovered(Boolean(nextTarget));
    };

    const handlePointerOut = (event: PointerEvent) => {
      const previousTarget = getInteractiveTarget(event.target);
      const nextTarget = getInteractiveTarget(event.relatedTarget);
      if (previousTarget !== nextTarget) setHovered(Boolean(nextTarget));
    };

    const addPointerListeners = () => {
      if (listening) return;
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerover", handlePointerOver, { passive: true });
      window.addEventListener("pointerout", handlePointerOut, { passive: true });
      listening = true;
    };

    const removePointerListeners = () => {
      if (!listening) return;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerout", handlePointerOut);
      listening = false;
    };

    const syncCapability = () => {
      const canFollow = pointerCapability.matches && !reducedMotion.matches && !intro.reducedMotion;
      setEnabled(canFollow);
      if (canFollow) {
        addPointerListeners();
      } else {
        removePointerListeners();
        positionedRef.current = false;
        setPositioned(false);
        setHovered(false);
      }
    };

    syncCapability();
    pointerCapability.addEventListener("change", syncCapability);
    reducedMotion.addEventListener("change", syncCapability);

    return () => {
      removePointerListeners();
      pointerCapability.removeEventListener("change", syncCapability);
      reducedMotion.removeEventListener("change", syncCapability);
    };
  }, [intro.reducedMotion, pointerX, pointerY, ringTargetX, ringTargetY, ringX, ringY]);

  if (!enabled) return null;

  const visible = positioned && !intro.active && !intro.reducedMotion;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[70] h-10 w-10 rounded-full border will-change-transform"
        style={{
          x: ringX,
          y: ringY,
          borderColor: "var(--theme-cursor-ring)",
          boxShadow: "0 0 14px color-mix(in srgb, var(--theme-cursor-ring) 22%, transparent)",
        }}
        animate={{ opacity: visible ? 0.58 : 0, scale: hovered ? 1.2 : 1 }}
        transition={{ opacity: { duration: 0.18 }, scale: { duration: 0.18, ease: "easeOut" } }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[70] h-2.5 w-2.5 rounded-full will-change-transform"
        style={{
          x: pointerX,
          y: pointerY,
          backgroundColor: "var(--theme-accent)",
          boxShadow: "0 0 11px color-mix(in srgb, var(--theme-accent) 42%, transparent)",
        }}
        animate={{ opacity: visible ? 0.92 : 0 }}
        transition={{ opacity: { duration: 0.12 } }}
      />
    </>
  );
}
