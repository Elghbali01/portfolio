"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
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

  return (
    <section
      id="experience"
      dir={dir}
      aria-labelledby={headingId}
      className="relative flex min-h-screen scroll-mt-24 flex-col items-center justify-center px-6 py-24 text-white md:px-10"
    >
      <div className="mb-16 text-center">
        <h2 id={headingId} className="text-3xl font-bold md:text-5xl">
          {copy.heading}{" "}
          <span className="text-[#60A5FA]">{copy.headingHighlight}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#CBD5E1]">
          {copy.description}
        </p>
      </div>

      <div className="relative w-full max-w-5xl">
        <span
          aria-hidden="true"
          className="absolute bottom-6 top-6 w-0.5 bg-[#475569] [inset-inline-start:0.625rem] lg:[inset-inline-start:50%]"
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
                transition={{ duration: shouldReduceMotion ? 0 : 0.55 }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-4 lg:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] lg:gap-x-6"
              >
                <span
                  aria-hidden="true"
                  className="relative z-10 col-start-1 row-start-1 mt-6 h-4 w-4 justify-self-center rounded-full border-4 border-[#0B1120] bg-[#3B82F6] lg:col-start-2"
                />

                <article
                  className={`relative z-[1] col-start-2 row-start-1 w-full rounded-xl border border-[#475569] bg-[#1E293B]/50 p-6 text-start backdrop-blur-md lg:col-span-1 ${cardColumn}`}
                >
                  <p className="text-sm font-medium text-[#60A5FA]">
                    {item.typeLabel ? (
                      <span className="sr-only">{item.typeLabel}: </span>
                    ) : null}
                    <bdi>{item.period}</bdi>
                  </p>

                  <h3 className="mb-3 mt-2 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="mb-2 text-xs leading-relaxed text-[#E2E8F0]">
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

                  <p className="text-sm leading-relaxed text-[#CBD5E1]">
                    {item.description}
                  </p>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
