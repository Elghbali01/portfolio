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

const LOADING_SEEN_KEY = "portfolio-loading-seen";

type LoadingState = "checking" | "loading" | "complete";

export default function Home() {
  const [loadingState, setLoadingState] = useState<LoadingState>("checking");
  const loadingFinished = loadingState === "complete";

  // Resolve session state after hydration. Server and client now share the
  // same deterministic first render, and storage failures fail open.
  useEffect(() => {
    let active = true;
    let nextState: LoadingState = "complete";
    try {
      const seen = window.sessionStorage.getItem(LOADING_SEEN_KEY) === "true";
      nextState = window.location.hash.length > 0 || seen ? "complete" : "loading";
    } catch {}
    queueMicrotask(() => {
      if (active) setLoadingState(nextState);
    });
    return () => {
      active = false;
    };
  }, []);

  // Final safety net: an animation can never block portfolio access forever.
  useEffect(() => {
    if (loadingState !== "loading") return;
    const failsafe = window.setTimeout(() => setLoadingState("complete"), 5_000);
    return () => window.clearTimeout(failsafe);
  }, [loadingState]);

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
  const handleLoadingComplete = useCallback(() => {
    try {
      window.sessionStorage.setItem(LOADING_SEEN_KEY, "true");
    } catch {
      // Storage can be disabled; portfolio access must still continue.
    }
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
