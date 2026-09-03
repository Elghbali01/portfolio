"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Download, Github, Linkedin } from "lucide-react";
import RotatingText from "@/components/RotatingText";
import type { Locale } from "@/i18n/config";

export interface HeroCopy {
  eyebrow: string;
  firstName: string;
  lastName: string;
  roles: string[];
  descriptor: string;
  viewProjects: string;
  contact: string;
  downloadCv: string;
  imageAlt: string;
  linkedinLabel: string;
  githubLabel: string;
}

const defaultCopy: HeroCopy = {
  eyebrow: "Hi, I’m",
  firstName: "Issam",
  lastName: "Elghbali",
  roles: ["Full-Stack Developer", "Data Scientist", "Machine Learning Enthusiast"],
  descriptor: "I build reliable software and data products grounded in real-world needs.",
  viewProjects: "View projects",
  contact: "Contact me",
  downloadCv: "Download CV",
  imageAlt: "Portrait of Issam Elghbali",
  linkedinLabel: "Issam Elghbali on LinkedIn",
  githubLabel: "Issam Elghbali on GitHub",
};

interface HeroProps {
  locale?: Locale;
  copy?: Partial<HeroCopy>;
  linkedinUrl?: string;
  githubUrl?: string;
  cvUrl?: string;
}

export default function Hero({
  locale = "en",
  copy: copyOverrides,
  linkedinUrl = "https://www.linkedin.com/in/issam-elghbali-2937b6258/",
  githubUrl = "https://github.com/Elghbali01",
  cvUrl = "/cv-issam_elghbali.pdf",
}: HeroProps) {
  const copy = { ...defaultCopy, ...copyOverrides };
  const isRtl = locale === "ar";
  const shouldReduceMotion = useReducedMotion();
  const entrance = shouldReduceMotion
    ? undefined
    : { opacity: 0, x: isRtl ? 48 : -48, y: -24 };

  return (
    <motion.section
      id="home"
      initial={entrance}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: "easeOut" }}
      className="relative flex min-h-[100svh] scroll-mt-24 items-center justify-center overflow-hidden px-6 pb-16 pt-24 text-white md:px-10 lg:py-28"
    >
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#020617] via-[#0B1120] to-[#0F172A]" />
      <div aria-hidden="true" className="absolute -start-52 -top-52 -z-20 h-[600px] w-[600px] rounded-full bg-blue-600 opacity-20 blur-[220px]" />
      <div aria-hidden="true" className="absolute -bottom-52 -end-52 -z-20 h-[500px] w-[500px] rounded-full bg-indigo-500 opacity-20 blur-[200px]" />

      <div
        dir="ltr"
        className="grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-16"
      >
        <div className="relative flex items-center justify-center">
          <div aria-hidden="true" className="absolute h-[320px] w-[320px] rounded-full bg-[#3B82F6] opacity-20 blur-[140px] lg:h-[520px] lg:w-[520px] lg:blur-[200px]" />
          <div aria-hidden="true" className="absolute h-[260px] w-[260px] rounded-[60%_40%_50%_70%/60%_50%_70%_40%] bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] opacity-70 blur-sm lg:h-[400px] lg:w-[400px]" />
          <div aria-hidden="true" className="absolute h-[240px] w-[240px] rounded-[60%_40%_50%_70%/60%_50%_70%_40%] border border-[#60A5FA]/40 lg:h-[360px] lg:w-[360px]" />
          <div className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-[#0F172A] shadow-2xl sm:h-60 sm:w-60 lg:h-80 lg:w-80">
            <Image
              src="/profile.webp"
              alt={copy.imageAlt}
              fill
              priority
              fetchPriority="high"
              quality={82}
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 240px, 208px"
              className="object-cover"
            />
          </div>
        </div>

        <div
          data-chat-safe-zone
          dir={isRtl ? "rtl" : "ltr"}
          className="min-w-0 space-y-5 text-center lg:text-start"
        >
          <p className="text-lg text-[#B7C3D4]">{copy.eyebrow}</p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {copy.firstName} <span className="text-[#60A5FA]">{copy.lastName}</span>
          </h1>

          <RotatingText
            phrases={copy.roles}
            locale={locale}
            dir={isRtl ? "rtl" : "ltr"}
          />
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[#B7C3D4] lg:mx-0">
            {copy.descriptor}
          </p>

          <div className="flex justify-center gap-4 pt-1 lg:justify-start">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.linkedinLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#475569] transition hover:border-[#60A5FA] hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <Linkedin aria-hidden="true" size={18} />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.githubLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#475569] transition hover:border-[#60A5FA] hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <Github aria-hidden="true" size={18} />
            </a>
          </div>

          <div className="flex flex-col flex-wrap justify-center gap-3 pt-3 sm:flex-row md:gap-2 lg:justify-start">
            <a
              href={`/${locale}#projects`}
              className="rounded-lg bg-[#2563EB] px-6 py-3 text-center font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {copy.viewProjects}
            </a>
            <a
              href={`/${locale}#contact`}
              className="rounded-lg border border-[#475569] px-6 py-3 text-center font-medium text-[#E2E8F0] transition hover:border-[#60A5FA] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              {copy.contact}
            </a>
            <a
              href={cvUrl}
              download
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-center font-medium text-[#E2E8F0] backdrop-blur-md transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]"
            >
              <Download aria-hidden="true" size={18} />
              {copy.downloadCv}
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
