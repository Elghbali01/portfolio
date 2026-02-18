"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const fullText = "Engineering Ideas into Digital Reality…";

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "deleting" | "exit">("typing");

  // ------------------------
  // PROGRESS ANIMATION
  // ------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("deleting"); // lance suppression
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  // ------------------------
  // TYPEWRITER LOGIC
  // ------------------------
  useEffect(() => {
    if (phase === "typing") {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(fullText.slice(0, i + 1));
        i++;
        if (i === fullText.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }

    if (phase === "deleting") {
      let i = fullText.length;
      const interval = setInterval(() => {
        setDisplayed(fullText.slice(0, i - 1));
        i--;
        if (i <= 0) {
          clearInterval(interval);
          setPhase("exit");
        }
      }, 30);
      return () => clearInterval(interval);
    }

    if (phase === "exit") {
      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  }, [phase, onComplete]);

  const radiusOuter = 85;
  const radiusInner = 70;
  const circumferenceInner = 2 * Math.PI * radiusInner;
  const offsetInner =
    circumferenceInner - (progress / 100) * circumferenceInner;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#0b1120] z-50"
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={phase === "exit" ? { y: 300, opacity: 0 } : { y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <div className="relative w-[220px] h-[220px] flex items-center justify-center">
          {/* Cercle extérieur */}
          <svg className="absolute" width="220" height="220">
            <circle
              cx="110"
              cy="110"
              r={radiusOuter}
              stroke="#475569"
              strokeWidth="4"
              fill="transparent"
            />
          </svg>

          {/* Cercle progress */}
          <svg className="absolute rotate-[-90deg]" width="220" height="220">
            <motion.circle
              cx="110"
              cy="110"
              r={radiusInner}
              stroke="url(#gradient)"
              strokeWidth="5"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumferenceInner}
              strokeDashoffset={offsetInner}
              transition={{ duration: 0.15 }}
            />

            <defs>
              <linearGradient id="gradient">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          <span className="text-white text-3xl font-semibold">{progress}%</span>
        </div>

        {/* Phrase */}
        <p className="mt-6 text-blue-400 text-sm tracking-wide">{displayed}</p>
      </motion.div>
    </motion.div>
  );
}
