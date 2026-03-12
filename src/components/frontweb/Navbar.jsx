import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sun, Menu, X, LogIn } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (label, href) => {
    setActive(label);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg shadow-blue-100/50" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-[#1a5695] flex items-center justify-center">
              <Sun size={20} className="text-[#F5C518]" fill="#F5C518" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-800 text-lg text-[#0F2D6B] tracking-tight">
                BH<span className="text-[#1a5695]">Square</span>
              </span>
              <span className="text-[10px] text-gray-400 font-body tracking-wider uppercase -mt-0.5">Solar Energy</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, href }) => (
              <button
                key={label}
                onClick={() => handleNav(label, href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-body transition-all duration-200 ${
                  active === label
                    ? "text-[#1a5695] bg-blue-50"
                    : "text-gray-600 hover:text-[#1a5695] hover:bg-blue-50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 bg-[#1a5695] text-white text-sm font-medium font-body rounded-lg hover:bg-[#1e40af] transition-all duration-200 shadow-md shadow-blue-200"
            >
              <LogIn size={15} />
              CRM Login
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-blue-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white border-t border-blue-50 px-4 py-3 space-y-1">
          {navItems.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => handleNav(label, href)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === label ? "text-[#1a5695] bg-blue-50" : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              {label}
            </button>
          ))}
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-full mt-2 px-4 py-2.5 bg-[#1a5695] text-white text-sm font-medium rounded-lg"
            onClick={() => setMenuOpen(false)}
          >
            <LogIn size={15} />
            CRM Login
          </Link>
        </div>
      </div>
    </header>
  );
}