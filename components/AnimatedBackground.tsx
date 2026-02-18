"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E1B4B]">
      {/* Shape 1 */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl opacity-30"
        animate={{
          x: [0, 200, -200, 0],
          y: [0, -150, 150, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "10%" }}
      />

      {/* Shape 2 */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-blue-600 rounded-full blur-3xl opacity-30"
        animate={{
          x: [0, -150, 150, 0],
          y: [0, 200, -200, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "10%", right: "10%" }}
      />
    </div>
  );
}
