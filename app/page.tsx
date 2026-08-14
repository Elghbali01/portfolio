"use client";

import { useCallback, useEffect, useState } from "react";
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

type LoadingState = "loading" | "complete";

export default function Home() {
  // Every full home-page load starts from the same server/client state.
  // No persisted flag can skip the visual loading sequence.
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const loadingFinished = loadingState === "complete";

  // Final safety net: an animation can never block portfolio access forever.
  useEffect(() => {
    if (loadingState !== "loading") return;
    const failsafe = window.setTimeout(() => setLoadingState("complete"), 5_000);
    return () => window.clearTimeout(failsafe);
  }, [loadingState]);

  // Preserve hash navigation while the loader remains a visual overlay.
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

  // Called whenever the loading animation finishes.
  const handleLoadingComplete = useCallback(() => {
    setLoadingState("complete");
  }, []);

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
      {loadingState === "loading" && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
    </>
  );
}
