"use client";

import { motion } from "framer-motion";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative min-h-screen px-6 md:px-10 py-24 text-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            Featured <span className="text-[#3B82F6]">Projects</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
            A selection of projects showcasing full-stack development,
            data-driven systems, and scalable architectures.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
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

                {/* TECH */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-[#0F172A] px-3 py-1 rounded-full border border-[#334155]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

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
          ))}
        </div>
      </div>
    </section>
  );
}
