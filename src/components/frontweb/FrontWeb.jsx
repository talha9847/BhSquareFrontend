import React from "react";
import Navbar from "../frontweb/Navbar";
import Hero from "../frontweb/Hero";
import Services from "../frontweb/Services";
import About from "../frontweb/About";
import Process from "../frontweb/Process";
import Projects from "../frontweb/Projects";
import Testimonials from "../frontweb/Testimonials";
import Footer from "../frontweb/Footer";
import Contact from "../frontweb/Contact";

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
