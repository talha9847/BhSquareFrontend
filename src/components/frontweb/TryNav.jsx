import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun } from "lucide-react";
import { Magnetic } from "../../lib/motion";
import logo from "../../assets/logo2.png";

const LINKS = [
  { id: "sun", label: "The Sun" },
  { id: "solution", label: "Solution" },
  { id: "how", label: "How It Works" },
  { id: "subsidy", label: "Subsidy" },
  { id: "why", label: "Why Us" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
  { id: "login", label: "Login" },
];

export default function TryNav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  const go = (id) => {
    setOpen(false);
    if (id == "login") {
      window.location.href = "/login";
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      data-testid="site-nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "glass-strong border-b border-white/10 bg-black/60 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 md:py-4">
        {/* Brand / Logo */}
        <button
          data-testid="nav-logo"
          onClick={() => go("sun")}
          className="relative flex items-center focus:outline-none"
        >
          <img
            src={logo}
            alt="BHSquare Logo"
            /* Scaled up cleanly across device sizes without overflow */
            className="h-12 scale-[3.5] pl-3 sm:h-16 md:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </button>
        {/* Desktop Links (lg+) */}
        <div className="hidden items-center space-x-1 lg:flex">
          {LINKS.map((l) => {
            const isActive = active === l.id;
            return (
              <button
                key={l.id}
                data-testid={`nav-link-${l.id}`}
                onClick={() => go(l.id)}
                aria-current={isActive ? "page" : undefined}
                className="relative rounded-full px-3.5 py-1.5 text-sm font-medium text-[var(--muted,#94a3b8)] transition-colors duration-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-[var(--orange,#f97316)]/40"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    isActive ? "font-semibold text-white" : ""
                  }`}
                >
                  {l.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Magnetic className="hidden sm:block">
            <button
              data-testid="nav-cta-btn"
              onClick={() => go("contact")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] px-5 py-2 text-sm font-semibold text-[#0B1220] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#FF8A00]/20 active:scale-95"
            >
              <Sun size={16} strokeWidth={2.5} className="animate-spin-slow" />
              <span>Free Site Visit</span>
            </button>
          </Magnetic>

          {/* Mobile Menu Toggle Button */}
          <button
            data-testid="nav-menu-toggle"
            onClick={() => setOpen(!open)}
            className="p-2 lg:hidden text-white hover:text-white/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden glass-strong border-b border-white/10 bg-black/90 backdrop-blur-xl overflow-hidden max-h-[calc(100vh-70px)] overflow-y-auto"
          >
            <div className="flex flex-col px-6 py-6 space-y-1">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  data-testid={`nav-mobile-link-${l.id}`}
                  onClick={() => go(l.id)}
                  className={`flex items-center justify-between border-b border-white/5 py-3.5 text-left text-base font-medium transition-colors ${
                    active === l.id
                      ? "text-[var(--orange,#f97316)] font-semibold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <span>{l.label}</span>
                  {active === l.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--orange,#f97316)]" />
                  )}
                </button>
              ))}

              <div className="pt-4">
                <button
                  data-testid="nav-mobile-cta"
                  onClick={() => go("contact")}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] py-3 text-center text-base font-semibold text-[#0B1220] active:scale-[0.98] transition-transform"
                >
                  <Sun size={18} strokeWidth={2.5} />
                  Book Free Site Visit
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
