import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Process from "./Process";
import Services from "./Services";
import About from "./About";
import Projects from "./Projects";
import Testimonials from "./Testimonials";
import Contact from "./Contact";
import Footer from "./Footer";

const FrontWeb = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Process />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default FrontWeb;
