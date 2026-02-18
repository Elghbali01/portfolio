"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import RotatingText from "../components/RotatingText";
import { Github, Linkedin } from "lucide-react";

export default function Hero() {
  return (
    <motion.section
      id="home"
      initial={{ opacity: 0, x: -120, y: -120 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative min-h-screen flex items-center justify-center text-white px-6 md:px-10 overflow-hidden"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#1E1B4B]" />

      <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center max-w-6xl w-full">
        {/* PHOTO SIDE */}
        <div className="relative flex justify-center items-center">
          {/* MOBILE SIZE */}
          <div className="absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-[#3B82F6] rounded-full blur-[150px] md:blur-[220px] opacity-20" />

          <div
            className="absolute w-[260px] h-[260px] md:w-[420px] md:h-[420px] 
              bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6]
              rounded-[60%_40%_50%_70%/60%_50%_70%_40%]
              blur-sm opacity-70"
          />

          <div
            className="absolute w-[240px] h-[240px] md:w-[380px] md:h-[380px]
              rounded-[60%_40%_50%_70%/60%_50%_70%_40%]
              border border-[#60A5FA]/40"
          />

          <div
            className="relative w-[200px] h-[200px] md:w-[320px] md:h-[320px] 
              rounded-full overflow-hidden border-4 border-[#0F172A] shadow-2xl"
          >
            <Image
              src="/profile.jpg"
              alt="Issam"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* TEXT SIDE */}
        <div className="space-y-6 text-center md:text-left">
          <p className="text-[#94A3B8] tracking-wide text-lg">Hi, I'm</p>

          <h1 className="text-3xl md:text-6xl font-bold leading-tight">
            Issam <span className="text-[#3B82F6]">Elghbali</span>
          </h1>

          <RotatingText />

          {/* SOCIAL LINKS */}
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a
              href="https://www.linkedin.com/in/issam-elghbali-2937b6258/"
              target="_blank"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-[#334155] hover:border-[#3B82F6] hover:text-[#3B82F6] transition"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="https://github.com/Elghbali01"
              target="_blank"
              className="w-11 h-11 flex items-center justify-center rounded-full border border-[#334155] hover:border-[#3B82F6] hover:text-[#3B82F6] transition"
            >
              <Github size={18} />
            </a>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-8">
            <button
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-3 bg-[#3B82F6] hover:bg-[#2563EB] transition rounded-lg font-medium shadow-lg shadow-blue-500/20"
            >
              View Projects
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-7 py-3 border border-[#334155] hover:border-white transition rounded-lg"
            >
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
