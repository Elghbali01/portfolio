"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface BackToTopButtonProps {
  label?: string;
}

export default function BackToTopButton({ label = "Back to top" }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);
  const [insideInteractivePanel, setInsideInteractivePanel] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isLocalizedHomePage = /^\/(?:en|fr|ar)\/?$/.test(pathname ?? "");

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 480);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  useEffect(() => {
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("[data-back-to-top-safe-zone]"),
    );
    if (panels.length === 0) return;

    const visiblePanels = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visiblePanels.add(entry.target);
        else visiblePanels.delete(entry.target);
      });
      setInsideInteractivePanel(visiblePanels.size > 0);
    });
    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence initial={false}>
      {visible && !(isLocalizedHomePage && insideInteractivePanel) ? (
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
