"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { skills } from "../data/skills";

export default function Skills() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      id="skills"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-10 text-white overflow-hidden"
    >
      {/* TITLE */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold">
          Technical <span className="text-[#3B82F6]">Arsenal</span>
        </h2>
        <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
          The technologies I leverage to transform ideas into scalable,
          intelligent, and high-impact digital solutions.
        </p>
      </div>

      {/* SCROLLER CONTAINER */}
      <div className="relative h-[320px] md:h-[420px] w-full max-w-xl overflow-hidden">
        {/* Fade Top */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#0B1120] to-transparent z-10 pointer-events-none" />

        {/* Fade Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0B1120] to-transparent z-10 pointer-events-none" />

        {/* Animated List */}
        <motion.div
          animate={!isPaused ? { y: ["0%", "-50%"] } : {}}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="flex flex-col gap-6"
        >
          {[...skills, ...skills].map((skill, index) => {
            const Icon = skill.icon;

            return (
              <motion.div
                key={index}
                onHoverStart={() => setIsPaused(true)}
                onHoverEnd={() => setIsPaused(false)}
                whileHover={{ scale: 1.1 }}
                className="group flex items-center justify-center gap-4 text-lg md:text-xl font-medium cursor-pointer transition-all duration-300"
              >
                <Icon size={28} />

                <span className="text-gray-400 transition-colors duration-300 group-hover:text-white">
                  {skill.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
