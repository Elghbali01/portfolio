"use client";

import { motion } from "framer-motion";
import { profile } from "../data/profile";

export default function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6 md:px-10 py-20 text-white"
    >
      <div className="max-w-6xl w-full">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Who <span className="text-[#3B82F6]">I Am</span>
          </h2>

          <p className="text-[#94A3B8] mt-4 max-w-3xl mx-auto">
            {profile.summary}
          </p>
        </motion.div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 text-[#CBD5E1] leading-relaxed"
          >
            {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </motion.div>

          {/* RIGHT CARDS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid gap-6"
          >
            {[
              {
                title: "Artificial Intelligence",
                desc: "Designing intelligent systems powered by Machine Learning and advanced algorithms.",
              },
              {
                title: "Data Science",
                desc: "Transforming raw data into meaningful insights and actionable solutions.",
              },
              {
                title: "Software Engineering",
                desc: "Building scalable, maintainable, and high-performance applications.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#1E293B]/40 backdrop-blur-md border border-[#334155] p-6 rounded-xl 
                           hover:border-[#3B82F6] hover:shadow-lg hover:shadow-blue-500/10
                           transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-[#3B82F6] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
