import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sun } from "lucide-react";
import { Magnetic } from "../../lib/motion";

const LINKS = [
  { id: "sun", label: "The Sun" },
  { id: "solution", label: "Solution" },
  { id: "how", label: "How It Works" },
  { id: "subsidy", label: "Subsidy" },
  { id: "why", label: "Why Us" },
  { id: "projects", label: "Projects" },
  { id: "dashboard", label: "Live" },
  { id: "contact", label: "Contact" },
];

export default function TryNav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-[background,border] duration-500 ${
        scrolled
          ? "glass-strong border-b border-white/10"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
        <button
          data-testid="nav-logo"
          onClick={() => go("sun")}
          className="font-display text-xl font-extrabold tracking-tight"
        >
          <span className="text-white">BH</span>
          <span className="text-gradient-sun">square</span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="relative rounded-full px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors duration-300 hover:text-white"
            >
              {active === l.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/8 ring-1 ring-[var(--orange)]/40"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              <span
                className={`relative z-10 ${
                  active === l.id ? "text-white" : ""
                }`}
              >
                {l.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Magnetic className="hidden md:block">
            <button
              data-testid="nav-cta-btn"
              onClick={() => go("contact")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] px-5 py-2.5 text-sm font-semibold text-[#0B1220] transition-transform duration-300 hover:scale-[1.03]"
            >
              <Sun size={16} strokeWidth={2.5} />
              Free Site Visit
            </button>
          </Magnetic>

          <button
            data-testid="nav-menu-toggle"
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="glass-strong overflow-hidden lg:hidden"
        >
          <div className="flex flex-col px-5 py-4">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={`nav-mobile-link-${l.id}`}
                onClick={() => go(l.id)}
                className="border-b border-white/5 py-3 text-left font-display text-lg text-white"
              >
                {l.label}
              </button>
            ))}

            <button
              data-testid="nav-mobile-cta"
              onClick={() => go("contact")}
              className="mt-4 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] py-3 font-semibold text-[#0B1220]"
            >
              Book Free Site Visit
            </button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
