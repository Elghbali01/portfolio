"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "../../data/projects";
import ProjectCard from "../../components/ProjectCard";
import AnimatedBackground from "../../components/AnimatedBackground";

export default function AllProjectsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* ── Back to portfolio ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#3B82F6]
                       text-sm font-medium transition-colors duration-300 mb-10"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Portfolio
          </Link>
        </motion.div>

        {/* ── Title ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold">
            All <span className="text-[#3B82F6]">Projects</span>
          </h1>
          <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
            A complete collection of my development projects spanning full-stack,
            data science, and enterprise applications.
          </p>
          <p className="text-[#64748B] text-sm mt-2">
            {projects.length} projects
          </p>
        </motion.div>

        {/* ── Grid ───────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* ── Back button (bottom) ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 border border-[#334155] text-[#94A3B8]
                       hover:border-[#3B82F6] hover:text-[#3B82F6]
                       text-sm font-medium px-7 py-3 rounded-lg transition-all duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Portfolio
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
