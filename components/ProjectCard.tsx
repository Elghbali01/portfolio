"use client";

import { motion } from "framer-motion";
import type { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      key={project.slug}
      id={project.slug}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      className="bg-[#1E293B]/50 backdrop-blur-md border border-[#334155] rounded-xl overflow-hidden shadow-xl hover:border-[#3B82F6] transition"
    >
      {/* IMAGE */}
      <div className="h-52 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover hover:scale-110 transition duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">{project.title}</h3>

        <p className="text-sm text-[#94A3B8]">
          {project.shortDescription}
        </p>

        {/* TECH BADGES */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="group relative overflow-hidden text-xs px-3 py-1 rounded-full border border-[#334155] bg-[#0F172A]"
            >
              {/* Animated background fill */}
              <span className="absolute inset-0 bg-[#94A3B8]/25 scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />

              {/* Text */}
              <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors duration-300">
                {tech}
              </span>
            </span>
          ))}
        </div>

        {/* LINKS */}
        <div className="flex justify-between items-center pt-4">
          <a
            href={project.github}
            target="_blank"
            className="text-sm text-[#3B82F6] hover:underline"
          >
            GitHub →
          </a>

          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              className="text-sm bg-[#3B82F6] px-4 py-2 rounded-lg hover:bg-[#2563EB] transition"
            >
              Demo
            </a>
          ) : (
            <button
              disabled
              className="text-sm bg-[#3B82F6] px-4 py-2 rounded-lg opacity-50 cursor-not-allowed"
            >
              Demo
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
