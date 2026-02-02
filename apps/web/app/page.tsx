"use client";

import { Navigation } from "./components/navigation";
import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { Comparison } from "./components/comparison";
import { Installation } from "./components/installation";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <div className="home-page min-h-screen bg-black text-white">
      <div className="terminal-noise" />
      <div className="screen-glitch" />
      <div className="home-page-flicker" />
      <Navigation />
      <Hero />
      <Features />
      <Comparison />
      <Installation />
      <Footer />
    </div>
  );
}
