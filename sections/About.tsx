"use client";

import { motion } from "framer-motion";

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
            A Data Science Master's student with a strong foundation in Computer
            Science, passionate about building intelligent and scalable systems.
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
            <p>
              I specialize in{" "}
              <span className="text-[#3B82F6] font-medium">
                Machine Learning
              </span>
              ,{" "}
              <span className="text-[#3B82F6] font-medium">
                Artificial Intelligence
              </span>
              , and modern{" "}
              <span className="text-[#3B82F6] font-medium">
                Software Engineering
              </span>
              .
            </p>

            <p>
              My focus is on designing intelligent systems capable of solving
              real-world challenges through data-driven strategies and scalable
              architectures.
            </p>

            <p>
              Driven by curiosity and continuous learning, I aim to build
              impactful digital solutions that combine performance, innovation,
              and real-world value.
            </p>
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
