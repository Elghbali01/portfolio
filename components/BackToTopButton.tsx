"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

interface BackToTopButtonProps {
  label?: string;
}

export default function BackToTopButton({ label = "Back to top" }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label={label}
          title={label}
          onClick={scrollToTop}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.9 }}
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.03 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          className="fixed bottom-24 end-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-strong bg-surface-elevated/90 text-content-primary shadow-lg shadow-glow-primary/15 backdrop-blur-md transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:end-6"
        >
          <ArrowUp aria-hidden="true" size={18} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
