"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  certifications,
  featuredCertifications,
} from "../data/certifications";
import CertificationCard from "../components/CertificationCard";

export default function Certifications() {
  return (
    <section
      id="certifications"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-10 py-24 text-white"
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
            My <span className="text-[#3B82F6]">Certifications</span>
          </h2>
          <p className="text-[#94A3B8] mt-4 max-w-2xl mx-auto">
            Industry-recognized credentials validating my expertise in
            full-stack development, data science, and machine learning.
          </p>
        </motion.div>

        {/* FEATURED GRID — preview cards only */}
        <div className="grid md:grid-cols-3 gap-8">
          {featuredCertifications.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={index}
              variant="preview"
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
            href="/certifications"
            className="inline-flex items-center gap-2 bg-transparent border border-[#3B82F6] text-[#3B82F6]
                       hover:bg-[#3B82F6] hover:text-white text-sm font-medium
                       px-7 py-3 rounded-lg transition-all duration-300"
          >
            View All Certifications ({certifications.length})
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
