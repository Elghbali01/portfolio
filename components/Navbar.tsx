"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useIntroSequence } from "@/components/IntroSequence";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PortfolioWordmark from "@/components/PortfolioWordmark";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import type { ThemeId } from "@/lib/theme";
import { sectionIds, type Locale, type SectionId } from "@/i18n";

export interface NavbarLabels {
  navigation: string;
  openMenu: string;
  closeMenu: string;
  languageSwitcher: string;
  themeSwitcher: string;
  themes: Record<ThemeId, string>;
  sections: Record<SectionId, string>;
}

const defaultLabels: NavbarLabels = {
  navigation: "Primary navigation",
  openMenu: "Open navigation menu",
  closeMenu: "Close navigation menu",
  languageSwitcher: "Choose language",
  themeSwitcher: "Color palette",
  themes: {
    "original-blue": "Original Blue",
    "royal-violet": "Royal Violet",
    "emerald-tech": "Emerald Tech",
    "midnight-gold": "Midnight Gold",
    "crimson-night": "Crimson Night",
  },
  sections: {
    home: "Home",
    about: "About",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certifications",
    experience: "Experience",
    contact: "Contact",
  },
};

interface NavbarProps {
  visible?: boolean;
  locale?: Locale;
  labels?: Partial<NavbarLabels> & {
    sections?: Partial<NavbarLabels["sections"]>;
    themes?: Partial<NavbarLabels["themes"]>;
  };
}

export default function Navbar({ visible = true, locale = "en", labels }: NavbarProps) {
  const copy: NavbarLabels = {
    ...defaultLabels,
    ...labels,
    sections: { ...defaultLabels.sections, ...labels?.sections },
    themes: { ...defaultLabels.themes, ...labels?.themes },
  };
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const intro = useIntroSequence();
  const reduceMotion = shouldReduceMotion === true || intro.reducedMotion;
  const brandVisible = visible && (!intro.active || intro.phase === "complete");
  const navigationVisible =
    visible && (!intro.active || intro.phase === "moving" || intro.phase === "reveal" || intro.phase === "complete");
  const homePath = `/${locale}`;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    const closeAtDesktop = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeAtDesktop);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeAtDesktop);
    };
  }, [menuOpen]);

  const sectionLink = (id: SectionId) => (id === "home" ? homePath : `${homePath}#${id}`);

  return (
    <motion.nav
      aria-label={copy.navigation}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4 }}
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-outline-subtle bg-canvas/95 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4 text-content-primary md:px-10">
        <div data-portfolio-logo-target className="inline-flex items-center">
          <motion.div
            initial={reduceMotion ? false : { x: locale === "ar" ? 24 : -24, opacity: 0 }}
            animate={{
              x: brandVisible ? 0 : locale === "ar" ? 24 : -24,
              opacity: brandVisible ? 1 : 0,
            }}
            transition={{ duration: reduceMotion ? 0 : brandVisible ? 0.24 : 0.5, ease: "easeOut" }}
            className="inline-flex"
          >
            <Link
              href={homePath}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <PortfolioWordmark />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={navigationVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
          className="hidden items-center gap-4 xl:flex"
        >
          <div className="flex items-center gap-5 text-sm text-content-secondary">
            {sectionIds.map((item, index) => (
              <motion.div
                key={item}
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={navigationVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                transition={{
                  delay: navigationVisible && !reduceMotion ? 0.1 + index * 0.07 : 0,
                  duration: reduceMotion ? 0 : 0.34,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={sectionLink(item)}
                  className="group relative rounded-sm py-2 transition-colors duration-300 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {copy.sections[item]}
                  <span className="absolute -bottom-0.5 start-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={navigationVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{
              delay: navigationVisible && !reduceMotion ? 0.1 + sectionIds.length * 0.07 : 0,
              duration: reduceMotion ? 0 : 0.34,
              ease: "easeOut",
            }}
            className="flex items-center gap-3"
          >
            <Suspense fallback={null}>
              <LanguageSwitcher locale={locale} label={copy.languageSwitcher} />
            </Suspense>
            <ThemeSwitcher label={copy.themeSwitcher} themes={copy.themes} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={false}
          animate={navigationVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: locale === "ar" ? 16 : -16 }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
          className="flex items-center xl:hidden"
        >
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-outline-default text-content-primary transition hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-outline-subtle bg-canvas xl:hidden"
          >
            <div className="flex flex-col px-6 py-4 text-content-secondary md:px-10">
              {sectionIds.map((item) => (
                <Link
                  key={item}
                  href={sectionLink(item)}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-lg transition hover:bg-content-primary/5 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {copy.sections[item]}
                </Link>
              ))}
              <div className="mt-3 border-t border-outline-subtle pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Suspense fallback={null}>
                    <LanguageSwitcher
                      locale={locale}
                      label={copy.languageSwitcher}
                      onNavigate={() => setMenuOpen(false)}
                    />
                  </Suspense>
                  <ThemeSwitcher label={copy.themeSwitcher} themes={copy.themes} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
