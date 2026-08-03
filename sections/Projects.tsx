"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects, featuredProjects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative min-h-screen px-6 md:px-10 py-24 text-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Featured <span className="text-[#3B82F6]">Projects</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
            A selection of projects showcasing full-stack development,
            data-driven systems, and scalable architectures.
          </p>
        </motion.div>

        {/* FEATURED GRID — 2 projects only */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-transparent border border-[#3B82F6] text-[#3B82F6]
                       hover:bg-[#3B82F6] hover:text-white text-sm font-medium
                       px-7 py-3 rounded-lg transition-all duration-300"
          >
            View All Projects ({projects.length})
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
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
