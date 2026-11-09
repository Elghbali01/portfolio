"use client";

import Image from "next/image";
import {
  motion,
  type HTMLMotionProps,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { Download, Github, Linkedin } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useIntroSequence } from "@/components/IntroSequence";
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

interface RevealOrigin {
  x: number;
  y: number;
  scale: number;
}

const DEFAULT_PHOTO_ORIGIN: RevealOrigin = { x: -48, y: -26, scale: 0.82 };
const DEFAULT_COPY_ORIGIN: RevealOrigin = { x: 34, y: -14, scale: 0.96 };

function MagneticAnchor({
  children,
  className,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: HTMLMotionProps<"a">) {
  const shouldReduceMotion = useReducedMotion() === true;
  const positionX = useMotionValue(0);
  const positionY = useMotionValue(0);
  const springX = useSpring(positionX, { stiffness: 280, damping: 22, mass: 0.2 });
  const springY = useSpring(positionY, { stiffness: 280, damping: 22, mass: 0.2 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(event);

    if (
      shouldReduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    positionX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 7);
    positionY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 7);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(event);
    positionX.set(0);
    positionY.set(0);
  };

  return (
    <motion.a
      {...props}
      className={className}
      style={{ ...style, x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.a>
  );
}

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
  const intro = useIntroSequence();
  const reduceMotion = shouldReduceMotion === true || intro.reducedMotion;
  const revealStarted = intro.revealStarted;
  const photoOrigin = intro.heroOrigins?.photo ?? DEFAULT_PHOTO_ORIGIN;
  const copyOrigin = intro.heroOrigins?.copy ?? DEFAULT_COPY_ORIGIN;

  return (
    <motion.section
      id="home"
      initial={reduceMotion || !intro.active ? false : { opacity: 0 }}
      animate={{ opacity: revealStarted ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.42, ease: "easeOut" }}
      className="relative flex min-h-[100svh] scroll-mt-24 items-center justify-center overflow-hidden px-6 pb-16 pt-24 text-content-primary md:px-10 lg:py-28"
    >
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-gradient-start via-gradient-middle to-surface" />
      <div aria-hidden="true" className="absolute -start-52 -top-52 -z-20 h-[600px] w-[600px] rounded-full bg-glow-primary opacity-20 blur-[220px]" />
      <div aria-hidden="true" className="absolute -bottom-52 -end-52 -z-20 h-[500px] w-[500px] rounded-full bg-glow-secondary opacity-20 blur-[200px]" />

      <div
        dir="ltr"
        className="grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-16"
      >
        <motion.div
          data-intro-hero-photo
          initial={reduceMotion || !intro.active ? false : { opacity: 0, scale: photoOrigin.scale, x: photoOrigin.x, y: photoOrigin.y, filter: "blur(10px)" }}
          animate={
            revealStarted
              ? { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }
              : { opacity: 0, scale: photoOrigin.scale, x: photoOrigin.x, y: photoOrigin.y, filter: "blur(10px)" }
          }
          transition={{
            duration: reduceMotion ? 0 : revealStarted ? 0.9 : 0,
            delay: reduceMotion ? 0 : revealStarted ? 0.04 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative flex items-center justify-center"
        >
          <div aria-hidden="true" className="absolute h-[320px] w-[320px] rounded-full bg-glow-primary opacity-20 blur-[140px] lg:h-[520px] lg:w-[520px] lg:blur-[200px]" />
          <div aria-hidden="true" className="absolute h-[260px] w-[260px] rounded-[60%_40%_50%_70%/60%_50%_70%_40%] bg-gradient-to-br from-action to-glow-primary opacity-70 blur-sm lg:h-[400px] lg:w-[400px]" />
          <div aria-hidden="true" className="absolute h-[240px] w-[240px] rounded-[60%_40%_50%_70%/60%_50%_70%_40%] border border-accent/40 lg:h-[360px] lg:w-[360px]" />
          <div className="relative h-fit w-fit">
            <div aria-hidden="true" className="hero-orbit hero-orbit--outer" />
            <div aria-hidden="true" className="hero-orbit hero-orbit--inner" />
            <div className="relative z-10 h-52 w-52 overflow-hidden rounded-full border-4 border-surface shadow-2xl sm:h-60 sm:w-60 lg:h-80 lg:w-80">
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
        </motion.div>

        <motion.div
          data-chat-safe-zone
          data-intro-hero-copy
          dir={isRtl ? "rtl" : "ltr"}
          initial={reduceMotion || !intro.active ? false : { opacity: 0, scale: copyOrigin.scale, x: copyOrigin.x, y: copyOrigin.y, filter: "blur(6px)" }}
          animate={
            revealStarted
              ? { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" }
              : { opacity: 0, scale: copyOrigin.scale, x: copyOrigin.x, y: copyOrigin.y, filter: "blur(6px)" }
          }
          transition={{
            duration: reduceMotion ? 0 : revealStarted ? 0.76 : 0,
            delay: reduceMotion ? 0 : revealStarted ? 0.14 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="min-w-0 space-y-5 text-center lg:text-start"
        >
          <motion.p
            initial={reduceMotion || !intro.active ? false : { opacity: 0, y: 8 }}
            animate={revealStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : revealStarted ? 0.08 : 0, ease: "easeOut" }}
            className="text-lg text-content-secondary"
          >
            {copy.eyebrow}
          </motion.p>

          <h1
            aria-label={`${copy.firstName} ${copy.lastName}`.trim()}
            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            <span aria-hidden="true">
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  initial={reduceMotion || !intro.active ? false : { opacity: 0, y: "105%" }}
                  animate={revealStarted ? { opacity: 1, y: "0%" } : { opacity: 0, y: "105%" }}
                  transition={{ duration: reduceMotion ? 0 : 0.58, delay: reduceMotion ? 0 : revealStarted ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {copy.firstName}
                </motion.span>
              </span>{" "}
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  initial={reduceMotion || !intro.active ? false : { opacity: 0, y: "105%" }}
                  animate={revealStarted ? { opacity: 1, y: "0%" } : { opacity: 0, y: "105%" }}
                  transition={{ duration: reduceMotion ? 0 : 0.62, delay: reduceMotion ? 0 : revealStarted ? 0.24 : 0, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-accent"
                >
                  {copy.lastName}
                </motion.span>
              </span>
            </span>
          </h1>

          <motion.div
            initial={reduceMotion || !intro.active ? false : { opacity: 0, y: 8 }}
            animate={revealStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : revealStarted ? 0.22 : 0, ease: "easeOut" }}
          >
            <RotatingText
              phrases={copy.roles}
              locale={locale}
              dir={isRtl ? "rtl" : "ltr"}
            />
          </motion.div>
          <motion.p
            initial={reduceMotion || !intro.active ? false : { opacity: 0, y: 8 }}
            animate={revealStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.36, delay: reduceMotion ? 0 : revealStarted ? 0.3 : 0, ease: "easeOut" }}
            className="mx-auto max-w-xl text-base leading-relaxed text-content-secondary lg:mx-0"
          >
            {copy.descriptor}
          </motion.p>

          <motion.div
            initial={reduceMotion || !intro.active ? false : { opacity: 0, y: 12 }}
            animate={revealStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : revealStarted ? 0.4 : 0, ease: "easeOut" }}
            className="flex justify-center gap-4 pt-1 lg:justify-start"
          >
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.linkedinLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-default transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Linkedin aria-hidden="true" size={18} />
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.githubLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-default transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Github aria-hidden="true" size={18} />
            </a>
          </motion.div>

          <motion.div
            initial={reduceMotion || !intro.active ? false : { opacity: 0, y: 16 }}
            animate={revealStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: reduceMotion ? 0 : 0.56, delay: reduceMotion ? 0 : revealStarted ? 0.52 : 0, ease: "easeOut" }}
            className="flex flex-col flex-wrap justify-center gap-3 pt-3 sm:flex-row md:gap-2 lg:justify-start"
          >
            <MagneticAnchor
              href={`/${locale}#projects`}
              className="rounded-lg bg-action px-6 py-3 text-center font-medium text-on-action shadow-lg shadow-glow-primary/20 transition-[background-color,border-color,color,box-shadow] hover:bg-action-hover hover:shadow-glow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {copy.viewProjects}
            </MagneticAnchor>
            <MagneticAnchor
              href={`/${locale}#contact`}
              className="rounded-lg border border-outline-default px-6 py-3 text-center font-medium text-content-strong transition-[background-color,border-color,color,box-shadow] hover:border-accent hover:bg-hover-surface hover:text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              {copy.contact}
            </MagneticAnchor>
            <MagneticAnchor
              href={cvUrl}
              download
              className="flex items-center justify-center gap-2 rounded-lg border border-content-primary/20 bg-content-primary/5 px-6 py-3 text-center font-medium text-content-strong backdrop-blur-md transition-[background-color,border-color,color,box-shadow] hover:border-accent hover:bg-hover-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Download aria-hidden="true" size={18} />
              {copy.downloadCv}
            </MagneticAnchor>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
