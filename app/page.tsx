"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Projects from "../sections/Projects";
import Skills from "../sections/Skills";
import Certifications from "../sections/Certifications";
import Experience from "../sections/Experience";
import Contact from "../sections/Contact";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";

const LOADING_SEEN_KEY = "portfolio-loading-seen";

export default function Home() {
  // Start with loading NOT finished (safe for SSR)
  const [loadingFinished, setLoadingFinished] = useState(false);

  // On mount (client only): check if we should skip the loading screen
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(LOADING_SEEN_KEY) === "true";
    const hash = window.location.hash;

    if (alreadySeen || hash.length > 0) {
      // Skip loading screen immediately
      setLoadingFinished(true);

      // If there's a hash, scroll to the target section
      if (hash.length > 0) {
        const id = hash.slice(1);
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  // Called when the loading animation finishes for the first time
  const handleLoadingComplete = () => {
    sessionStorage.setItem(LOADING_SEEN_KEY, "true");
    setLoadingFinished(true);
  };

  return (
    <>
      {/* MAIN CONTENU (toujours monté) */}
      <main className="relative overflow-hidden">
        <AnimatedBackground />
        <Navbar visible={loadingFinished} />

        <div className="pt-24">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Certifications />
          <Experience />
          <Contact />
          <Footer />
        </div>
      </main>

      {/* LOADER AU DESSUS */}
      {!loadingFinished && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
    </>
  );
}
