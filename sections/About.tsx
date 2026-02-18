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
            About <span className="text-[#3B82F6]">Me</span>
          </h2>

          <p className="text-[#94A3B8] mt-4 max-w-3xl mx-auto">
            Currently pursuing a Master’s degree in Data Science and Intelligent
            Systems at the Faculty of Sciences and Techniques of Fez, with a
            strong foundation in Computer Science.
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
              As a Master’s student in Data Science, I combine my academic
              background with a strong passion for Software Engineering and
              Artificial Intelligence.
            </p>

            <p>
              My interest lies in designing intelligent systems capable of
              solving real-world problems through Machine Learning, data-driven
              strategies, and scalable software architectures.
            </p>

            <p>
              I continuously strive to improve my technical skills while
              building modern, efficient, and impactful digital solutions.
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
                desc: "Transforming raw data into meaningful insights and data-driven solutions.",
              },
              {
                title: "Software Engineering",
                desc: "Building scalable, maintainable, and high-performance applications.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#1E293B]/40 backdrop-blur-md border border-[#334155] p-6 rounded-xl hover:border-[#3B82F6] transition"
              >
                <h3 className="text-lg font-semibold text-[#3B82F6] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
