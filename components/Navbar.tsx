"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n/config";

const sectionIds = [
  "home",
  "about",
  "projects",
  "skills",
  "certifications",
  "experience",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export interface NavbarLabels {
  navigation: string;
  openMenu: string;
  closeMenu: string;
  languageSwitcher: string;
  sections: Record<SectionId, string>;
}

const defaultLabels: NavbarLabels = {
  navigation: "Primary navigation",
  openMenu: "Open navigation menu",
  closeMenu: "Close navigation menu",
  languageSwitcher: "Choose language",
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
  labels?: Partial<NavbarLabels> & { sections?: Partial<NavbarLabels["sections"]> };
}

export default function Navbar({ visible = true, locale = "en", labels }: NavbarProps) {
  const copy: NavbarLabels = {
    ...defaultLabels,
    ...labels,
    sections: { ...defaultLabels.sections, ...labels?.sections },
  };
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
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
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
      className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled || menuOpen
          ? "border-b border-[#334155] bg-[#0B1120]/95 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-4 text-white md:px-10">
        <motion.div
          initial={shouldReduceMotion ? false : { x: locale === "ar" ? 24 : -24, opacity: 0 }}
          animate={visible ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        >
          <Link
            href={homePath}
            className="rounded-sm text-2xl font-bold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            Port<span className="text-[#60A5FA]">folio</span>
          </Link>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.4 }}
          className="hidden items-center gap-4 xl:flex"
        >
          <div className="flex items-center gap-5 text-sm text-[#B7C3D4]">
            {sectionIds.map((item) => (
              <Link
                key={item}
                href={sectionLink(item)}
                className="group relative rounded-sm py-2 transition-colors duration-300 hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
              >
                {copy.sections[item]}
                <span className="absolute -bottom-0.5 start-0 h-0.5 w-0 bg-[#60A5FA] transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
              </Link>
            ))}
          </div>
          <Suspense fallback={null}>
            <LanguageSwitcher locale={locale} label={copy.languageSwitcher} />
          </Suspense>
        </motion.div>

        <div className="flex items-center xl:hidden">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#475569] text-white transition hover:border-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
          >
            {menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-[#334155] bg-[#0B1120] xl:hidden"
          >
            <div className="flex flex-col px-6 py-4 text-[#CBD5E1] md:px-10">
              {sectionIds.map((item) => (
                <Link
                  key={item}
                  href={sectionLink(item)}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-lg transition hover:bg-white/5 hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
                >
                  {copy.sections[item]}
                </Link>
              ))}
              <div className="mt-3 border-t border-[#334155] pt-4">
                <Suspense fallback={null}>
                  <LanguageSwitcher
                    locale={locale}
                    label={copy.languageSwitcher}
                    onNavigate={() => setMenuOpen(false)}
                  />
                </Suspense>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
