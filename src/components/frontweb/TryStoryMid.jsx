import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  SolarPanel,
  BatteryCharging,
  House,
  Zap,
  PiggyBank,
  CircleCheck,
  ShieldCheck,
  Gauge,
  Award,
  Wifi,
  Wrench,
} from "lucide-react";
import { MaskText, Reveal, CountUp } from "../../lib/motion";

const IMG_FAMILY =
  "https://images.unsplash.com/photo-1758523669073-edfbea249144?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxoYXBweSUyMGZhbWlseSUyMG1vZGVybiUyMGhvbWV8ZW58MHx8fHwxNzg1NDk2NDgzfDA&ixlib=rb-4.1.0&q=85";

/* ---------------- SECTION 5 — HOW SOLAR WORKS ---------------- */
const FLOW = [
  { icon: Sun, label: "Sun", desc: "Free, unlimited sunlight" },
  { icon: SolarPanel, label: "Solar Panel", desc: "Tier-1 mono PERC modules" },
  { icon: BatteryCharging, label: "Inverter", desc: "DC → AC conversion" },
  { icon: House, label: "Home", desc: "Powers every appliance" },
  { icon: Zap, label: "Grid", desc: "Export surplus via net metering" },
  { icon: PiggyBank, label: "Savings", desc: "Bills drop close to zero" },
];

const FEATURES = [
  { icon: SolarPanel, t: "Tier-1 Panels" },
  { icon: ShieldCheck, t: "25-Year Warranty" },
  { icon: Gauge, t: "High Efficiency" },
  { icon: Wifi, t: "Remote Monitoring" },
  { icon: Wrench, t: "Safe Installation" },
  { icon: Award, t: "MNRE Approved" },
];

export function HowItWorks() {
  const [active, setActive] = useState(null);
  return (
    <section id="how" data-testid="section-how" className="relative z-10 py-28">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <span className="mb-4 inline-block font-display text-xs tracking-[0.25em] text-[var(--gold)]">
            05 — HOW SOLAR WORKS
          </span>
        </Reveal>
        <h2 className="max-w-2xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          <MaskText lines={["Sunlight In.", "Savings Out."]} />
        </h2>

        <div className="mt-14 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {FLOW.map((f, i) => (
            <div key={f.label} className="flex items-center">
              <motion.div
                data-testid={`flow-node-${i}`}
                onHoverStart={() => setActive(i)}
                onHoverEnd={() => setActive(null)}
                whileHover={{ y: -8 }}
                className="relative w-full rounded-3xl glass px-4 py-7 text-center"
              >
                <motion.div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(255,138,0,0.25),rgba(255,213,74,0.15))",
                  }}
                  animate={active === i ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <f.icon size={30} weight="duotone" color="#FFD54A" />
                </motion.div>
                <div className="font-display text-lg font-bold text-white">
                  {f.label}
                </div>
                <div className="mt-1 text-xs text-[var(--muted)]">{f.desc}</div>
                {/* energy pulse */}
                <motion.span
                  className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--gold)]"
                  animate={{ opacity: [0, 1, 0], y: [0, 6, 12] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.06}>
              <div
                data-testid={`feature-chip-${i}`}
                className="flex items-center gap-2 rounded-full glass px-4 py-2.5 text-sm text-white"
              >
                <f.icon size={18} weight="duotone" color="#FF8A00" /> {f.t}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SECTION 6 — PM SURYA GHAR ---------------- */
const SUBSIDY_LIST = [
  "Subsidy Support",
  "Documentation",
  "Installation",
  "Inspection",
  "Net Metering",
  "Monitoring",
];

export function PMSuryaGhar() {
  return (
    <section
      id="subsidy"
      data-testid="section-subsidy"
      className="relative z-10 py-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div
          className="overflow-hidden rounded-[2rem] glass-light p-8 md:p-14"
          style={{ boxShadow: "0 40px 120px -40px rgba(255,138,0,0.4)" }}
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0B1220] px-4 py-1.5 font-display text-xs tracking-[0.2em] text-[var(--gold)]">
                06 — GOVERNMENT SCHEME
              </span>
              <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-[#0B1220] sm:text-5xl">
                Government Subsidy Available
              </h2>
              <p className="mt-4 max-w-md text-lg text-[#334155]">
                Under the <strong>PM Surya Ghar Muft Bijli Yojana</strong>,
                eligible households receive direct central financial assistance
                on rooftop solar.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {SUBSIDY_LIST.map((s, i) => (
                  <Reveal key={s} delay={i * 0.08}>
                    <div
                      data-testid={`subsidy-item-${i}`}
                      className="flex items-center gap-2 text-[#0B1220]"
                    >
                      <CircleCheck size={22} weight="fill" color="#FF8A00" />
                      <span className="text-sm font-medium">{s}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal delay={0.2}>
              <div className="rounded-3xl bg-[#0B1220] p-10 text-center">
                <div className="font-display text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
                  Up to
                </div>
                <div className="mt-3 font-display text-6xl font-extrabold text-gradient-sun md:text-7xl">
                  <CountUp
                    testId="subsidy-counter"
                    to={78000}
                    prefix="₹"
                    duration={2.5}
                  />
                </div>
                <div className="mt-3 text-sm text-white/70">
                  Central subsidy for eligible residential rooftops
                </div>
                <button
                  data-testid="subsidy-cta-btn"
                  onClick={() =>
                    document
                      .getElementById("roi")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-8 w-full rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] py-3.5 font-semibold text-[#0B1220] transition-transform duration-300 hover:scale-[1.03]"
                >
                  Check My Subsidy
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SECTION 7 — THE FAMILY ---------------- */
export function Family() {
  return (
    <section
      id="family"
      data-testid="section-family"
      className="relative z-10 flex min-h-screen items-center overflow-hidden py-24"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={IMG_FAMILY}
          alt="Happy family at a modern home in golden evening light"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(11,18,32,0.95) 5%, rgba(11,18,32,0.35) 60%, rgba(255,138,0,0.12) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-end gap-10 px-5 md:px-10 lg:grid-cols-2">
        <div>
          <Reveal>
            <span className="mb-4 inline-block font-display text-xs tracking-[0.25em] text-[var(--gold)]">
              07 — THE FAMILY
            </span>
          </Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            <MaskText lines={["More Savings.", "More Happiness."]} />
          </h2>
          <Reveal delay={0.3} className="mt-6 max-w-md text-lg text-white/80">
            The meter slows. Then stops. As golden evening settles over the
            rooftop, the monthly bill quietly fades away.
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div
            data-testid="bill-transform-card"
            className="glass-strong rounded-3xl p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[var(--muted)]">Before</div>
                <div className="font-display text-4xl font-extrabold text-red-300 line-through decoration-2">
                  ₹4,500
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap size={40} weight="fill" color="#FFD54A" />
              </motion.div>
              <div className="text-right">
                <div className="text-sm text-[var(--muted)]">After</div>
                <div className="font-display text-5xl font-extrabold text-gradient-sun">
                  ₹0
                </div>
              </div>
            </div>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#FF8A00,#FFD54A)" }}
                initial={{ width: "100%" }}
                whileInView={{ width: "4%" }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="mt-3 text-xs text-[var(--muted)]">
              Electricity meter — winding down to near zero
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
