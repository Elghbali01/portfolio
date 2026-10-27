"use client";

import { useId, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { journey } from "../data/journey";

export interface JourneyItem {
  id?: string;
  title: string;
  period: string;
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
    "My academic and professional path shaping my expertise in software engineering and intelligent systems.",
  timelineLabel: "Academic and professional timeline",
};

interface ExperienceProps {
  labels?: Partial<ExperienceLabels>;
  items?: readonly JourneyItem[];
  dir?: "ltr" | "rtl";
}

export default function Experience({
  labels,
  items = journey,
  dir,
}: ExperienceProps) {
  const copy: ExperienceLabels = { ...DEFAULT_LABELS, ...labels };
  const headingId = useId();
  const shouldReduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 78%", "end 28%"],
  });
  const lineProgress = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 150,
    damping: 28,
    mass: 0.45,
  });

  return (
    <section
      id="experience"
      dir={dir}
      aria-labelledby={headingId}
      className="relative flex min-h-screen scroll-mt-24 flex-col items-center justify-center px-6 py-24 text-content-primary md:px-10"
    >
      <div className="mb-16 text-center">
        <h2 id={headingId} className="text-3xl font-bold md:text-5xl">
          {copy.heading}{" "}
          <span className="text-accent">{copy.headingHighlight}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-content-secondary">
          {copy.description}
        </p>
      </div>

      <div ref={timelineRef} className="relative w-full max-w-5xl">
        <span
          aria-hidden="true"
          className="absolute bottom-6 top-6 w-0.5 bg-outline-subtle [inset-inline-start:0.625rem] lg:[inset-inline-start:50%]"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: shouldReduceMotion ? 1 : lineProgress }}
          className="absolute bottom-6 top-6 origin-top w-0.5 bg-gradient-to-b from-accent via-glow-primary to-accent [inset-inline-start:0.625rem] lg:[inset-inline-start:50%]"
        />

        <ol aria-label={copy.timelineLabel} className="space-y-8 lg:space-y-10">
          {items.map((item, index) => {
            const cardColumn =
              index % 2 === 0 ? "lg:col-start-1" : "lg:col-start-3";

            return (
              <motion.li
                key={item.id ?? `${item.period}-${item.title}`}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.55,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.07, 0.28),
                }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4 lg:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] lg:gap-x-6"
              >
                <motion.span
                  aria-hidden="true"
                  initial={shouldReduceMotion ? false : { opacity: 0.55, scale: 0.78 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.45 }}
                  className="relative z-10 col-start-1 row-start-1 mt-6 h-4 w-4 justify-self-center rounded-full border-4 border-canvas bg-accent lg:col-start-2"
                />

                <motion.article
                  whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                  className={`relative z-[1] col-start-2 row-start-1 w-full rounded-xl border border-outline-default bg-surface-elevated/50 p-6 text-start backdrop-blur-md transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent hover:shadow-lg hover:shadow-glow-primary/10 lg:col-span-1 ${cardColumn}`}
                >
                  <p className="text-sm font-medium text-accent">
                    {item.typeLabel ? (
                      <span className="sr-only">{item.typeLabel}: </span>
                    ) : null}
                    <bdi>{item.period}</bdi>
                  </p>

                  <h3 className="mb-3 mt-2 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mb-2 text-xs leading-relaxed text-content-strong">
                    <bdi>{item.institution}</bdi>
                    <span aria-hidden="true"> · </span>
                    <bdi>{item.location}</bdi>
                    {item.duration ? (
                      <>
                        <span aria-hidden="true"> · </span>
                        <bdi>{item.duration}</bdi>
                      </>
                    ) : null}
                  </p>

                  <p className="text-sm leading-relaxed text-content-secondary">
                    {item.description}
                  </p>
                </motion.article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
