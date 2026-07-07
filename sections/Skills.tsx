"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { devSkills, testSkills, aiSkills } from "../data/skills";
import type { Skill } from "../data/skills";

// ─── Particle Stars ───────────────────────────────────────────────────────────
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.6 + 0.2,
}));

// ─── Single Tech Logo ─────────────────────────────────────────────────────────
function TechLogo({
  skill,
  hoveredId,
  onHover,
  onLeave,
}: {
  skill: Skill;
  hoveredId: string | null;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  const isHovered = hoveredId === skill.name;
  const grayed = hoveredId !== null && !isHovered;

  return (
    <motion.div
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.2, y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-2 cursor-pointer select-none px-3"
      style={{ flexShrink: 0 }}
    >
      <div
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
        style={{
          filter: grayed ? "grayscale(1) brightness(0.5)" : "grayscale(0) brightness(1)",
          transition: "filter 0.35s ease",
          background: isHovered
            ? `radial-gradient(circle at 50% 50%, ${skill.color}22, transparent 70%)`
            : "transparent",
        }}
      >
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: `0 0 20px 4px ${skill.color}55, 0 0 40px 8px ${skill.color}22` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        <Image
          src={skill.iconUrl}
          alt={skill.name}
          width={52}
          height={52}
          className="object-contain"
          unoptimized
        />
      </div>
      <span
        className="text-xs font-medium tracking-wide"
        style={{
          color: grayed ? "#374151" : isHovered ? skill.color : "#94A3B8",
          transition: "color 0.3s ease",
        }}
      >
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─── Infinite Scroll Row ───────────────────────────────────────────────────────
function InfiniteRow({
  skills,
  label,
  direction = 1,
  delay = 0,
}: {
  skills: Skill[];
  label: string;
  direction?: 1 | -1;
  delay?: number;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const controls = useAnimation();
  const looped   = [...skills, ...skills, ...skills];
  const duration = skills.length * 4;

  // Start scroll on mount
  useEffect(() => {
    controls.start({
      x: direction === 1 ? ["0%", "-33.33%"] : ["-33.33%", "0%"],
      transition: { duration, repeat: Infinity, ease: "linear", repeatType: "loop" },
    });
  }, []);

  const pauseScroll  = () => controls.stop();
  const resumeScroll = () =>
    controls.start({
      x: direction === 1 ? ["0%", "-33.33%"] : ["-33.33%", "0%"],
      transition: { duration, repeat: Infinity, ease: "linear", repeatType: "loop" },
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      viewport={{ once: true }}
      className="w-full"
    >
      {/* Label */}
      <p
        className="text-xs uppercase tracking-[0.25em] mb-4 pl-1 font-semibold"
        style={{ color: "#CBD5E1" }}
      >
        {label}
      </p>

      {/* Scrolling track */}
      <div
        className="relative overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
      >
        <motion.div
          className="flex"
          animate={controls}
          style={{ width: "max-content" }}
        >
          {looped.map((skill: Skill, i: number) => (
            <TechLogo
              key={`${skill.name}-${i}`}
              skill={skill}
              hoveredId={hoveredId}
              onHover={(id) => { setHoveredId(id); pauseScroll(); }}
              onLeave={() => { setHoveredId(null); resumeScroll(); }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Brain SVG (glowing) ──────────────────────────────────────────────────────
function GlowBrain() {
  return (
    <div className="relative flex items-center justify-center w-40 h-40 md:w-52 md:h-52">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-[#3B82F6] opacity-10 blur-3xl scale-125" />
      <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-5 blur-2xl" />

      {/* Pulsing rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#3B82F6]/20"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-400/10"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Brain SVG Icon */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-28 h-28 md:w-36 md:h-36 relative z-10"
        animate={{ filter: ["drop-shadow(0 0 8px #3B82F6aa)", "drop-shadow(0 0 18px #3B82F6cc)", "drop-shadow(0 0 8px #3B82F6aa)"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Left hemisphere */}
        <path
          d="M50 18 C 36 18 24 28 24 42 C 24 50 27 56 32 60 C 30 63 30 68 33 71 C 31 75 33 80 38 81 C 40 85 44 87 50 87"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Right hemisphere */}
        <path
          d="M50 18 C 64 18 76 28 76 42 C 76 50 73 56 68 60 C 70 63 70 68 67 71 C 69 75 67 80 62 81 C 60 85 56 87 50 87"
          fill="none"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Center divide */}
        <line x1="50" y1="18" x2="50" y2="87" stroke="#1D4ED8" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Wrinkle lines left */}
        <path d="M34 38 C 38 36 42 40 40 44" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M30 52 C 35 50 38 54 36 58" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M37 64 C 41 62 43 66 41 69" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {/* Wrinkle lines right */}
        <path d="M66 38 C 62 36 58 40 60 44" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M70 52 C 65 50 62 54 64 58" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M63 64 C 59 62 57 66 59 69" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Glowing nodes */}
        {[
          [35, 42], [30, 56], [38, 68], [44, 78],
          [65, 42], [70, 56], [62, 68], [56, 78],
          [50, 30], [50, 55], [50, 70],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="2"
            fill={i % 2 === 0 ? "#3B82F6" : "#60A5FA"}
            animate={{ opacity: [0.4, 1, 0.4], r: [1.5, 2.5, 1.5] }}
            transition={{
              duration: 2 + (i * 0.3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Skills() {
  return (
    <section
      id="skills"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-10 py-24 text-white overflow-hidden"
    >
      {/* ── Stars backdrop ── */}
      {STARS.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
          animate={{ opacity: [star.opacity, star.opacity * 0.3, star.opacity] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      <div className="relative z-10 max-w-6xl w-full flex flex-col gap-20">
        {/* ── TITLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Technical <span className="text-[#3B82F6]">Arsenal</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
            The technologies I leverage to transform ideas into scalable,
            intelligent, and high-impact digital solutions.
          </p>
        </motion.div>

        {/* ── DEVELOPER / BRAIN / TESTEUR ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center"
        >
          {/* LEFT — Developer */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-[#3B82F6]">
                Developer
              </span>
              <span className="text-2xl text-[#3B82F6]">⟨/⟩</span>
            </div>
            <p className="text-sm md:text-base text-[#94A3B8] leading-relaxed max-w-xs">
              I build full-stack applications with modern frameworks and scalable
              architectures — from crafting clean UIs to designing robust APIs
              and high-performance backends.
            </p>
            {/* Decorative dots */}
            <div className="flex gap-2 mt-1">
              {["#3B82F6", "#818CF8", "#60A5FA"].map((c, i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: c }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* CENTER — Brain */}
          <div className="flex justify-center">
            <GlowBrain />
          </div>

          {/* RIGHT — Testeur */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl text-[#06B6D4]">✓</span>
              <span className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#7C3AED]">
                Testeur
              </span>
            </div>
            <p className="text-sm md:text-base text-[#94A3B8] leading-relaxed max-w-xs">
              I ensure quality through rigorous testing strategies — unit, integration,
              and end-to-end tests — using industry-standard tools to deliver
              reliable and bug-free software.
            </p>
            {/* Decorative dots */}
            <div className="flex gap-2 mt-1">
              {["#06B6D4", "#7C3AED", "#0EA5E9"].map((c, i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: c }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── DIVIDER ── */}
        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent" />
          <span className="text-xs text-[#CBD5E1] tracking-widest uppercase font-semibold">Technologies</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent" />
        </div>

        {/* ── TECH LOGOS — infinite scroll ── */}
        <div className="flex flex-col gap-12">
          <InfiniteRow skills={devSkills}  label="Development"            direction={1}  delay={0.1} />
          <InfiniteRow skills={testSkills} label="Testing & QA"           direction={-1} delay={0.2} />
          <InfiniteRow skills={aiSkills}   label="AI / Machine Learning"   direction={1}  delay={0.3} />
        </div>
      </div>
    </section>
  );
}
