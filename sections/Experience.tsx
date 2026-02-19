"use client";

import { motion } from "framer-motion";
import { journey } from "../data/journey";

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-10 text-white"
    >
      {/* TITLE */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold">
          Professional <span className="text-[#3B82F6]">Journey</span>
        </h2>
        <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
          My academic and professional path shaping my expertise in software
          engineering and intelligent systems.
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative max-w-3xl w-full">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-[2px] bg-[#334155]" />

        <div className="space-y-12">
          {journey.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-[#3B82F6] rounded-full border-4 border-[#0B1120]" />

              {/* Card */}
              <div
                className={`bg-[#1E293B]/50 backdrop-blur-md border border-[#334155] p-6 rounded-xl w-full md:w-[45%] ${
                  index % 2 === 0 ? "md:ml-12" : "md:mr-12"
                }`}
              >
                <span className="text-sm text-[#3B82F6] font-medium">
                  {item.period}
                </span>

                <h3 className="text-lg font-semibold mt-2 mb-3">
                  {item.title}
                </h3>

                <p className="text-[#94A3B8] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
