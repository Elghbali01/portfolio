"use client";

import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Projects from "../sections/Projects";
import Skills from "../sections/Skills";
import Experience from "../sections/Experience";
import Contact from "../sections/Contact";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home() {
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <>
      {!loadingDone && (
        <LoadingScreen onComplete={() => setLoadingDone(true)} />
      )}

      {loadingDone && (
        <main className="relative">
          <Navbar />
          <AnimatedBackground />

          <div className="pt-24">
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Experience />
            <Contact />
          </div>
        </main>
      )}
    </>
  );
}
