"use client";

import { useId, useRef } from "react";
import {
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { journey } from "../data/journey";

export interface JourneyItem {
  id?: string;
  title: string;
  period: string;
  type: "education" | "experience";
  institution: string;
  location: string;
  duration?: string;
  description: string;
  typeLabel?: string;
}

export interface ExperienceLabels {
  heading: string;
  headingHighlight: string;
  description: string;
  timelineLabel: string;
}

const DEFAULT_LABELS: ExperienceLabels = {
  heading: "Professional",
  headingHighlight: "Journey",
  description:
    "My academic and professional path, from scientific foundations to software engineering and intelligent systems.",
  timelineLabel: "Academic and professional timeline",
};

interface ExperienceProps {
  labels?: Partial<ExperienceLabels>;
  items?: readonly JourneyItem[];
  dir?: "ltr" | "rtl";
}

interface JourneyMilestoneProps {
  item: JourneyItem;
  index: number;
  reduceMotion: boolean;
}

function JourneyMilestone({
  item,
  index,
  reduceMotion,
}: JourneyMilestoneProps) {
  const titleId = useId();
  const nodeRef = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: nodeRef,
    offset: ["start 62%", "start 48%"],
  });
  const activation = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, 0, 1, 1]),
    { stiffness: 190, damping: 30, mass: 0.35 },
  );
  const dotOpacity = useTransform(activation, [0, 1], [0.22, 1]);
  const haloOpacity = useTransform(activation, [0, 1], [0, 0.42]);
  const connectorOpacity = useTransform(activation, [0, 1], [0.45, 0.85]);
  const cardLift = useTransform(activation, [0, 1], [5, 0]);
  const Icon = item.type === "experience" ? BriefcaseBusiness : GraduationCap;
  const cardColumn = index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-3";
  const connectorColumn =
    index % 2 === 0
      ? "lg:[inset-inline-start:auto] lg:[inset-inline-end:50%]"
      : "lg:[inset-inline-end:auto] lg:[inset-inline-start:50%]";
  const isInternship = item.type === "experience";

  return (
    <li className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-4 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:gap-x-6">
      <motion.span
        aria-hidden="true"
        className={`pointer-events-none absolute top-10 h-px w-[1.1875rem] bg-outline-default lg:w-10 ${connectorColumn}`}
        style={{ opacity: reduceMotion ? 0.75 : connectorOpacity }}
      />

      <span
        ref={nodeRef}
        aria-hidden="true"
        className="relative z-10 col-start-1 row-start-1 mt-8 flex size-[1.125rem] items-center justify-center justify-self-center rounded-full border-2 border-accent/70 bg-canvas shadow-sm shadow-glow-primary/15 lg:col-start-2"
      >
        <motion.span
          className="absolute -inset-2 rounded-full bg-accent/15 blur-md"
          style={{ opacity: reduceMotion ? 0.45 : haloOpacity }}
        />
        <motion.span
          className="relative size-2 rounded-full bg-accent"
          style={{ opacity: reduceMotion ? 1 : dotOpacity }}
        />
      </span>

      <motion.article
        aria-labelledby={titleId}
        data-chat-safe-zone
        data-chat-desktop-safe-zone
        data-back-to-top-safe-zone
        className={`relative z-[1] col-start-2 row-start-1 min-w-0 overflow-hidden rounded-[1.35rem] border p-5 text-start shadow-xl shadow-black/5 sm:p-6 lg:col-span-1 ${
          isInternship
            ? "border-accent/45 bg-surface-elevated/75"
            : "border-outline-default bg-surface-elevated/60"
        } ${cardColumn}`}
        style={{ y: reduceMotion ? 0 : cardLift }}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 inset-inline-start-0 w-1 bg-gradient-to-b from-accent via-glow-primary to-transparent"
          style={{ opacity: reduceMotion ? 0.55 : haloOpacity }}
        />

        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <p className="text-sm font-semibold tracking-wide text-accent">
            <bdi>{item.period}</bdi>
          </p>
          <span
            className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
              isInternship
                ? "border-accent/35 bg-accent/10 text-accent"
                : "border-outline-default bg-canvas/55 text-content-secondary"
            }`}
          >
            <Icon aria-hidden="true" size={14} strokeWidth={1.8} />
            {item.typeLabel}
          </span>
        </div>

        <h3
          id={titleId}
          className="mt-4 text-xl font-semibold leading-snug tracking-tight text-content-primary sm:text-2xl"
        >
          {item.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-relaxed text-content-strong">
          <bdi className="font-medium">{item.institution}</bdi>
          <span aria-hidden="true" className="text-content-secondary">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" size={13} className="shrink-0 text-accent" />
            <bdi>{item.location}</bdi>
          </span>
          {item.duration ? (
            <>
              <span aria-hidden="true" className="text-content-secondary">
                ·
              </span>
              <span className="font-medium text-content-primary">
                <bdi>{item.duration}</bdi>
              </span>
            </>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-7 text-content-secondary sm:text-[0.95rem]">
          {item.description}
        </p>
      </motion.article>
    </li>
  );
}

export default function Experience({
  labels,
  items = journey,
  dir,
}: ExperienceProps) {
  const copy: ExperienceLabels = { ...DEFAULT_LABELS, ...labels };
  const headingId = useId();
  const reduceMotion = Boolean(useReducedMotion());
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 78%", "end 28%"],
  });
  const lineProgress = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1]),
    { stiffness: 150, damping: 28, mass: 0.45 },
  );

  return (
    <section
      id="experience"
      dir={dir}
      aria-labelledby={headingId}
      className="relative min-h-screen scroll-mt-24 px-5 py-24 text-content-primary sm:px-8 lg:py-32"
    >
      <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
        <p
          aria-hidden="true"
          className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent sm:text-sm"
        >
          {copy.timelineLabel}
        </p>
        <h2
          id={headingId}
          className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
        >
          {copy.heading} <span className="text-accent">{copy.headingHighlight}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-content-secondary sm:text-lg sm:leading-8">
          {copy.description}
        </p>
      </div>

      <div ref={timelineRef} className="relative mx-auto w-full max-w-6xl">
        <span
          aria-hidden="true"
          className="absolute bottom-10 top-10 w-px bg-outline-subtle [inset-inline-start:0.75rem] lg:[inset-inline-start:50%]"
        />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-10 top-10 w-px origin-top bg-gradient-to-b from-accent via-glow-primary to-accent [inset-inline-start:0.75rem] lg:[inset-inline-start:50%]"
          style={{ scaleY: reduceMotion ? 1 : lineProgress }}
        />

        <ol
          aria-label={copy.timelineLabel}
          className="relative space-y-7 md:space-y-8 lg:space-y-10"
        >
          {items.map((item, index) => (
            <JourneyMilestone
              key={item.id ?? `${item.period}-${item.title}`}
              item={item}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
