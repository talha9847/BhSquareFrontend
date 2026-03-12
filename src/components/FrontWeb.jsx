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
      <section id="home">
        <Hero />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="about">
        <About />
      </section>
      <Process />
      <section id="projects">
        <Projects />
      </section>
      <Testimonials />
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </div>
  );
};

export default FrontWeb;
