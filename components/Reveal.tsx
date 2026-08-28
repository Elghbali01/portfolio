"use client";

import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  from?: "up" | "start" | "end";
  rtl?: boolean;
  delay?: number;
}

export default function Reveal({
  children,
  className,
  from = "up",
  rtl = false,
  delay = 0,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const horizontal = from === "start" ? (rtl ? 32 : -32) : from === "end" ? (rtl ? -32 : 32) : 0;
  const vertical = from === "up" ? 32 : 0;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, x: horizontal, y: vertical }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.65, delay: shouldReduceMotion ? 0 : delay }}
      viewport={{ once: true, amount: 0.12 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
