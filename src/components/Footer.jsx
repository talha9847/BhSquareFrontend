import { Link } from "react-router-dom";
import { Sun, MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter, Youtube, ArrowRight } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const services = [
  "Residential Solar",
  "Commercial Solar",
  "Agricultural Solar",
  "Solar Maintenance",
  "Solar Consultation",
  "Net Metering",
];

const socials = [
  { name: "Facebook", Icon: Facebook, href: "#" },
  { name: "Instagram", Icon: Instagram, href: "#" },
  { name: "LinkedIn", Icon: Linkedin, href: "#" },
  { name: "Twitter", Icon: Twitter, href: "#" },
  { name: "YouTube", Icon: Youtube, href: "#" },
];

const contactDetails = [
  { Icon: MapPin, text: "SG Highway, Ahmedabad\nGujarat, India - 380054" },
  { Icon: Phone, text: "+91 98765 43210\n+91 79 2345 6789" },
  { Icon: Mail, text: "hello@bhsquare.in\nsupport@bhsquare.in" },
  { Icon: Clock, text: "Mon-Sat: 9:00 AM - 6:00 PM\nSun: Emergency only" },
];

export default function Footer() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0a1f4e] text-white">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#F5C518] to-[#F0A500]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display font-bold text-[#1a5695] text-xl">Ready to power your life with solar? ☀️</p>
          <button
            onClick={() => scrollTo("#contact")}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white font-bold font-body rounded-xl hover:bg-[#1B4FD8] transition-colors shadow-md"
          >
            Get Free Quote Today
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#1B4FD8] flex items-center justify-center">
                <Sun size={20} className="text-[#F5C518]" fill="#F5C518" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white">BH<span className="text-[#F5C518]">Square</span></span>
                <p className="text-[10px] text-blue-300 -mt-0.5 tracking-wider uppercase">Solar Energy</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed font-body mb-5">
              India's trusted solar installation partner. Making clean energy accessible for every home and business since 2014.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {socials.map(({ name, Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="w-9 h-9 rounded-xl bg-blue-800/50 hover:bg-[#1B4FD8] text-blue-200 hover:text-white transition-all duration-200 flex items-center justify-center"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="text-blue-200 hover:text-[#F5C518] text-sm font-body transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 group-hover:bg-[#F5C518] transition-colors" />
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/login" className="text-blue-200 hover:text-[#F5C518] text-sm font-body transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-blue-500 group-hover:bg-[#F5C518] transition-colors" />
                  CRM Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-white mb-5">Our Services</h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s} className="text-blue-200 text-sm font-body flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#F5C518]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-5">Contact Us</h4>
            <div className="space-y-4">
              {contactDetails.map(({ Icon, text }) => (
                <div key={text} className="flex gap-3">
                  <Icon size={16} className="text-[#F5C518] flex-shrink-0 mt-0.5" />
                  <p className="text-blue-200 text-sm font-body whitespace-pre-line leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-400 font-body">
          <p>© {new Date().getFullYear()} BHSquare Solar Energy. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
