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
import Footer from "../components/Footer";

export default function Home() {
  const [loadingFinished, setLoadingFinished] = useState(false);

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
          <Experience />
          <Contact />
          <Footer />
        </div>
      </main>

      {/* LOADER AU DESSUS */}
      {!loadingFinished && (
        <LoadingScreen onComplete={() => setLoadingFinished(true)} />
      )}
    </>
  );
}
