import Image from "next/image";
import type { CSSProperties } from "react";
import { aiSkills, dataSkills, devSkills } from "../data/skills";
import type { Skill } from "../data/skills";

export type SkillsContent = {
  title: string;
  titleAccent: string;
  introduction: string;
  developerTitle: string;
  developerDescription: string;
  dataTitle: string;
  dataDescription: string;
  technologiesLabel: string;
  developmentLabel: string;
  dataScienceLabel: string;
  aiLabel: string;
};

type SkillsProps = {
  content?: SkillsContent;
};

const defaultContent: SkillsContent = {
  title: "Technical",
  titleAccent: "Arsenal",
  introduction:
    "The technologies I leverage to transform ideas into scalable, intelligent, and high-impact digital solutions.",
  developerTitle: "Developer",
  developerDescription:
    "I build full-stack applications with modern frameworks and scalable architectures — from crafting clean UIs to designing robust APIs and high-performance backends.",
  dataTitle: "Data Scientist",
  dataDescription:
    "I transform raw data into actionable insights using statistical analysis, machine learning algorithms, and data visualization to drive data-informed decisions.",
  technologiesLabel: "Technologies",
  developmentLabel: "Development",
  dataScienceLabel: "Data Science",
  aiLabel: "AI / Machine Learning",
};

function TechLogo({ skill }: { skill: Skill }) {
  return (
    <li
      className="skill-card flex w-24 shrink-0 snap-start select-none flex-col items-center gap-2 px-2 py-2 md:w-28"
      style={{ "--skill-color": skill.color } as CSSProperties}
    >
      <div className="skill-logo-shell relative flex h-16 w-16 items-center justify-center rounded-2xl md:h-20 md:w-20">
        <Image
          src={skill.iconUrl}
          alt=""
          aria-hidden="true"
          width={52}
          height={52}
          sizes="52px"
          loading="lazy"
          className="skill-logo object-contain"
          unoptimized
        />
      </div>
      <span className="skill-name text-center text-xs font-medium leading-snug tracking-wide text-[#A8B5C7]">
        {skill.name}
      </span>
    </li>
  );
}

function SkillRail({ skills, label }: { skills: Skill[]; label: string }) {
  const duration = `${Math.max(30, Math.round(skills.length * 1.25))}s`;

  return (
    <div className="w-full">
      <p className="skills-kicker mb-4 ps-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#CBD5E1]">
        {label}
      </p>

      <div
        className="skills-viewport relative"
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        <ul
          className="skills-track"
          style={{ "--skills-duration": duration } as CSSProperties}
        >
          {skills.map((skill) => (
            <TechLogo key={skill.name} skill={skill} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function GlowBrain() {
  const nodes = [
    [35, 42],
    [30, 56],
    [38, 68],
    [44, 78],
    [65, 42],
    [70, 56],
    [62, 68],
    [56, 78],
    [50, 30],
    [50, 55],
    [50, 70],
  ];

  return (
    <div
      className="skills-brain relative flex h-40 w-40 items-center justify-center md:h-52 md:w-52"
      aria-hidden="true"
    >
      <div className="absolute inset-0 scale-125 rounded-full bg-[#3B82F6] opacity-10 blur-3xl" />
      <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-5 blur-2xl" />
      <div className="skills-brain-ring absolute inset-0 rounded-full border border-[#3B82F6]/20" />
      <div className="skills-brain-ring skills-brain-ring-delayed absolute inset-0 rounded-full border border-cyan-400/10" />

      <svg
        viewBox="0 0 100 100"
        className="skills-brain-svg relative z-10 h-28 w-28 md:h-36 md:w-36"
        focusable="false"
      >
        <path
          d="M50 18 C 36 18 24 28 24 42 C 24 50 27 56 32 60 C 30 63 30 68 33 71 C 31 75 33 80 38 81 C 40 85 44 87 50 87"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M50 18 C 64 18 76 28 76 42 C 76 50 73 56 68 60 C 70 63 70 68 67 71 C 69 75 67 80 62 81 C 60 85 56 87 50 87"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="18"
          x2="50"
          y2="87"
          stroke="#1D4ED8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <path d="M34 38 C 38 36 42 40 40 44" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M30 52 C 35 50 38 54 36 58" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M37 64 C 41 62 43 66 41 69" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M66 38 C 62 36 58 40 60 44" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M70 52 C 65 50 62 54 64 58" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M63 64 C 59 62 57 66 59 69" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {nodes.map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="2"
            fill={index % 2 === 0 ? "#3B82F6" : "#60A5FA"}
          />
        ))}
      </svg>
    </div>
  );
}

export default function Skills({ content = defaultContent }: SkillsProps) {
  return (
    <section
      id="skills"
      className="skills-starfield relative flex min-h-screen scroll-mt-24 flex-col items-center justify-center overflow-hidden px-6 py-24 text-white md:px-10"
    >
      <div className="relative z-10 flex w-full max-w-6xl flex-col gap-16 lg:gap-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            {content.title} <span className="text-[#3B82F6]">{content.titleAccent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#A8B5C7]">
            {content.introduction}
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-start">
            <div className="flex items-center gap-3">
              <span className="bg-gradient-to-r from-[#818CF8] to-[#3B82F6] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                {content.developerTitle}
              </span>
              <span className="text-2xl text-[#3B82F6]" aria-hidden="true">
                ⟨/⟩
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#A8B5C7] md:text-base">
              {content.developerDescription}
            </p>
            <div className="mt-1 flex gap-2" aria-hidden="true">
              {["#3B82F6", "#818CF8", "#60A5FA"].map((color) => (
                <span key={color} className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <GlowBrain />
          </div>

          <div className="flex flex-col items-center gap-4 text-center lg:items-end lg:text-end">
            <div className="flex items-center gap-3">
              <span className="bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                {content.dataTitle}
              </span>
              <svg
                className="h-7 w-7 text-[#06B6D4]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16M4 14l4-4 4 4 8-8" />
                <circle cx={8} cy={10} r={1.5} fill="currentColor" />
                <circle cx={12} cy={14} r={1.5} fill="currentColor" />
                <circle cx={20} cy={6} r={1.5} fill="currentColor" />
              </svg>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#A8B5C7] md:text-base">
              {content.dataDescription}
            </p>
            <div className="mt-1 flex gap-2" aria-hidden="true">
              {["#06B6D4", "#7C3AED", "#0EA5E9"].map((color) => (
                <span key={color} className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent" />
          <span className="skills-kicker text-xs font-semibold uppercase tracking-widest text-[#CBD5E1]">
            {content.technologiesLabel}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent" />
        </div>

        <div className="flex flex-col gap-10 lg:gap-12">
          <SkillRail skills={devSkills} label={content.developmentLabel} />
          <SkillRail skills={dataSkills} label={content.dataScienceLabel} />
          <SkillRail skills={aiSkills} label={content.aiLabel} />
        </div>
      </div>
    </section>
  );
}
