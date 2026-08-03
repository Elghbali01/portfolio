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

/**
 * Synchronous check — runs during the very first render so the LoadingScreen
 * component is never mounted when navigating back from /projects or /certifications.
 */
function shouldSkipLoading(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.hash.length > 0) return true;
  if (sessionStorage.getItem(LOADING_SEEN_KEY) === "true") return true;
  return false;
}

export default function Home() {
  const [loadingFinished, setLoadingFinished] = useState(shouldSkipLoading);

  // Scroll to the hash target after mount (loading is already skipped)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.length > 0) {
      const id = hash.slice(1);
      // Small delay so the DOM is fully painted before scrolling
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
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

