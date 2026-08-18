import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import {
  Lightbulb,
  Fan,
  Wind,
  Droplet,
  Car,
  Building,
  ArrowDown,
  CloudRain,
  TrendingUp,
} from "lucide-react";
import { MaskText, Reveal, Magnetic } from "../../lib/motion";

const IMG = {
  earth:
    "https://images.unsplash.com/photo-1769251971680-005dfa536f07?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHw0fHxlYXJ0aCUyMGZyb20lMjBzcGFjZSUyMG5pZ2h0fGVufDB8fHx8MTc4NTQ5NjQ4M3ww&ixlib=rb-4.1.0&q=85",
  problem:
    "https://images.unsplash.com/photo-1545652320-45a2d4555049?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwyfHxwb3dlciUyMGxpbmVzJTIwZGFyayUyMHN0b3JtfGVufDB8fHx8MTc4NTQ5NjQ4M3ww&ixlib=rb-4.1.0&q=85",
  roof: "https://images.unsplash.com/photo-1780445392694-c95056ed12e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxzb2xhciUyMHBhbmVscyUyMG9uJTIwbW9kZXJuJTIwcm9vZnxlbnwwfHx8fDE3ODU0OTY0ODR8MA&ixlib=rb-4.1.0&q=85",
};

/* ---------------- SECTION 1 — THE SUN (hero) ---------------- */
export function HeroSun() {
  return (
    <section
      id="sun"
      data-testid="section-sun"
      className="relative flex min-h-screen items-center"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 font-display text-xs tracking-[0.25em] text-[var(--gold)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /> 01 —
            THE SUN
          </span>
        </Reveal>

        <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
          <MaskText
            testId="hero-headline"
            lines={["The Power That", "Lights Our"]}
            className="text-white"
          />
          <MaskText
            lines={["World."]}
            className="text-gradient-sun"
            delay={0.25}
          />
        </h1>

        <Reveal delay={0.5} className="mt-8 max-w-xl">
          <p className="text-lg text-[var(--muted)] md:text-xl">
            Every second, the sun creates more energy than humanity could ever
            consume. BHsquare helps you capture a fraction of it — right from
            your rooftop.
          </p>
        </Reveal>

        <Reveal delay={0.7} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <button
              data-testid="hero-cta-btn"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] px-7 py-3.5 font-semibold text-[#0B1220] transition-transform duration-300 hover:scale-[1.04]"
            >
              Book Free Site Visit
            </button>
          </Magnetic>
          <button
            data-testid="hero-explore-btn"
            onClick={() =>
              document
                .getElementById("earth")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-2 rounded-full glass px-6 py-3.5 font-medium text-white transition-colors hover:bg-white/10"
          >
            Begin the journey <ArrowDown size={18} />
          </button>
        </Reveal>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[var(--muted)]"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown size={22} />
      </motion.div>
    </section>
  );
}

/* ---------------- SECTION 2 — EARTH ---------------- */
const NEEDS = [
  { icon: Lightbulb, label: "Lights" },
  { icon: Fan, label: "Fans" },
  { icon: Wind, label: "Air Conditioner" },
  { icon: Droplet, label: "Water Pump" },
  { icon: Car, label: "Electric Vehicle" },
  { icon: Building, label: "Businesses" },
];

export function Earth() {
  return (
    <section
      id="earth"
      data-testid="section-earth"
      className="relative flex min-h-screen items-center py-24"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="mb-6 inline-block font-display text-xs tracking-[0.25em] text-[var(--gold)]">
              02 — EARTH
            </span>
          </Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            <MaskText lines={["Every Home", "Needs Energy"]} />
          </h2>
          <Reveal
            delay={0.3}
            className="mt-6 max-w-md text-lg text-[var(--muted)]"
          >
            From the smallest bulb to the busiest factory — modern life runs on
            electricity. And it all traces back to a single star.
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {NEEDS.map((n, i) => (
              <Reveal key={n.label} delay={0.1 * i}>
                <motion.div
                  whileHover={{ y: -6 }}
                  data-testid={`need-card-${i}`}
                  className="flex items-center gap-3 rounded-2xl glass px-4 py-4"
                >
                  <n.icon size={24} weight="duotone" color="#FFD54A" />
                  <span className="text-sm font-medium text-white">
                    {n.label}
                  </span>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="relative">
          <motion.div
            className="relative mx-auto aspect-square w-[85%] overflow-hidden rounded-full glow-orange"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <img
              src={IMG.earth}
              alt="Earth from space at night showing city lights"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- SECTION 3 — THE PROBLEM ---------------- */
const BILLS = [2500, 4800, 7200, 10500];

export function Problem() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      id="problem"
      ref={ref}
      data-testid="section-problem"
      className="relative flex min-h-screen items-center overflow-hidden py-24"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={IMG.problem}
          alt="Power lines in stormy weather"
          className="h-full w-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,18,32,0.85), rgba(11,18,32,0.95))",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 md:px-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 font-display text-xs tracking-[0.25em] text-red-400">
              <CloudRain size={14} /> 03 — THE PROBLEM
            </span>
          </Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            <MaskText lines={["Electricity Costs", "Never Stop Rising"]} />
          </h2>
          <Reveal
            delay={0.3}
            className="mt-6 max-w-md text-lg text-[var(--muted)]"
          >
            Tariffs climb every year. What you pay today is only the beginning —
            and that money is gone forever.
          </Reveal>

          <Reveal
            delay={0.5}
            className="mt-8 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4"
          >
            <TrendingUp size={28} weight="bold" color="#f87171" />
            <span className="text-sm text-red-200">
              Grid tariffs in Gujarat have risen steadily year after year.
            </span>
          </Reveal>
        </div>

        <motion.div
          style={{ y }}
          className="relative flex flex-col items-end gap-4"
        >
          {BILLS.map((b, i) => (
            <motion.div
              key={b}
              data-testid={`bill-card-${i}`}
              initial={{ opacity: 0, y: 40, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="glass-strong flex w-full max-w-sm items-center justify-between rounded-2xl border border-red-500/20 px-6 py-5"
              style={{ marginRight: `${i * 8}px` }}
            >
              <span className="font-display text-sm text-[var(--muted)]">
                Monthly Bill
              </span>
              <span className="font-display text-3xl font-extrabold text-red-300">
                ₹{b.toLocaleString("en-IN")}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- SECTION 4 — THE SOLUTION ---------------- */
export function Solution() {
  return (
    <section
      id="solution"
      data-testid="section-solution"
      className="relative flex min-h-screen items-center overflow-hidden py-24"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={IMG.roof}
          alt="Solar panels on a modern roof"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(11,18,32,0.95) 0%, rgba(11,18,32,0.55) 55%, rgba(255,138,0,0.15) 100%)",
          }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute -right-40 top-0 h-full w-[60%] z-0"
        style={{
          background:
            "radial-gradient(circle at 70% 40%, rgba(255,213,74,0.35), transparent 60%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <span className="mb-6 inline-block font-display text-xs tracking-[0.25em] text-[var(--gold)]">
            04 — THE SOLUTION
          </span>
        </Reveal>
        <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
          <MaskText lines={["The Smartest", "Investment Starts"]} />
          <MaskText
            lines={["On Your Roof."]}
            className="text-gradient-sun"
            delay={0.25}
          />
        </h2>
        <Reveal delay={0.5} className="mt-8 max-w-xl text-lg text-white/80">
          Sunlight breaks through the clouds. Panels come alive. Your rooftop
          quietly turns free sunshine into decades of savings.
        </Reveal>
      </div>
    </section>
  );
}
