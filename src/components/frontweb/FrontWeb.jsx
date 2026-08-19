import { useState } from "react";

import TryLoader from "./TryLoader";
import TryNav from "./TryNav";
import TryCanvasScene from "./TryCanvasScene";
import SunCursor from "./SunCursor";
import Popup from "./Popup";

import { HeroSun, Earth, Problem, Solution } from "./TryStoryTop";

import { HowItWorks, PMSuryaGhar, Family } from "./TryStoryMid";

import { WhyBHsquare, Projects, ROICalculator } from "./TryShowcase";

import { Testimonials } from "./TryDataSection";
// import { Dashboard, Testimonials, FAQ } from "./TryDataSections";

// import { Contact, Footer, FloatingWhatsApp } from "./TryContact";

const MARQUEE = [
  "Tier-1 Panels",
  "PM Surya Ghar",
  "25-Year Warranty",
  "Net Metering",
  "Smart Monitoring",
  "MNRE Approved",
  "Free Site Visit",
];

function Marquee() {
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/10 bg-[#0F172A]/60 py-5">
      <div className="marquee-track">
        {[0, 1].map((rep) => (
          <div
            key={rep}
            className="flex shrink-0 items-center"
            aria-hidden={rep === 1}
          >
            {MARQUEE.map((item, index) => (
              <div
                key={`${rep}-${index}`}
                className="mx-8 flex shrink-0 items-center gap-8 whitespace-nowrap font-display text-2xl font-bold text-white/80 md:text-3xl"
              >
                {item}

                <span className="text-[var(--orange)]">✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const FrontWeb = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="select-none cursor-none">
      {!loaded && <TryLoader onDone={() => setLoaded(true)} />}

      <TryCanvasScene />

      <SunCursor />

      <Popup />

      {/* <FloatingWhatsApp /> */}

      <section id="home">
        <TryNav />

        <HeroSun />

        <Earth />

        <Problem />

        <Solution />

        {/* EXACTLY like the original App */}
        <Marquee />

        <HowItWorks />

        <PMSuryaGhar />

        <Family />

        <WhyBHsquare />

        <ROICalculator />
        <Testimonials />
        {/*


        <Projects />

        <Dashboard />


        <FAQ /> */}

        {/* <Contact /> */}
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default FrontWeb;
