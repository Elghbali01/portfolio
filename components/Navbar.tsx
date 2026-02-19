"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

interface NavbarProps {
  visible: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("light");
  };

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const links = [
    "home",
    "about",
    "projects",
    "skills",
    "experience",
    "contact",
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0B1120]/80 backdrop-blur-xl border-b border-[#1E293B]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-5 text-white">
        {/* LOGO (Apparaît en premier) */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={visible ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          onClick={() => handleScrollTo("home")}
          className="text-2xl font-bold tracking-wide cursor-pointer"
        >
          Port<span className="text-[#3B82F6]">folio</span>
        </motion.div>

        {/* DESKTOP LINKS (delay après logo) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="hidden md:flex gap-8 text-sm text-[#94A3B8]"
        >
          {links.map((item) => (
            <button
              key={item}
              onClick={() => handleScrollTo(item)}
              className="relative capitalize transition-colors duration-300 hover:text-[#3B82F6] group"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#3B82F6] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </motion.div>

        {/* RIGHT SIDE DESKTOP (dernier élément) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="hidden md:flex items-center gap-5"
        >
          <span className="text-[#334155] text-lg">|</span>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#334155] hover:border-[#3B82F6] transition"
          >
            {darkMode ? (
              <Sun size={16} className="text-yellow-400" />
            ) : (
              <Moon size={16} className="text-blue-400" />
            )}
          </button>
        </motion.div>

        {/* MOBILE RIGHT SIDE */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#334155] hover:border-[#3B82F6] transition"
          >
            {darkMode ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-blue-400" />
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-md border border-[#334155]"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0B1120] border-t border-[#1E293B]"
          >
            <div className="flex flex-col items-center gap-6 py-6 text-[#94A3B8]">
              {links.map((item) => (
                <button
                  key={item}
                  onClick={() => handleScrollTo(item)}
                  className="relative capitalize transition-colors duration-300 hover:text-[#3B82F6] text-lg group"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#3B82F6] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
