import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  Zap,
  SolarPanel,
  Wrench,
  Timer,
  Wifi,
  ShieldCheck,
  ArrowRight,
  Calculator,
} from "lucide-react";
import { MaskText, Reveal, CountUp, useSpotlight } from "../../lib/motion";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- SECTION 8 — WHY BHSQUARE ---------------- */
const STATS = [
  { icon: Users, to: 500, suffix: "+", label: "Happy Families" },
  { icon: Zap, to: 1000, suffix: "+ kW", label: "Installed Capacity" },
  { icon: SolarPanel, to: 100, suffix: "%", label: "Tier-1 Panels" },
  { icon: ShieldCheck, to: 25, suffix: " yr", label: "Performance Warranty" },
];
const PERKS = [
  {
    icon: Wrench,
    t: "Expert Engineers",
    d: "In-house certified installation crew",
  },
  {
    icon: Timer,
    t: "Fast Installation",
    d: "Most homes energised within days",
  },
  {
    icon: Wifi,
    t: "Smart Monitoring",
    d: "Track generation from your phone",
  },
];

function SpotCard({ children, testId }) {
  const { onMove, background } = useSpotlight();
  return (
    <motion.div
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      data-testid={testId}
      className="relative overflow-hidden rounded-3xl glass p-7"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export function WhyBHsquare() {
  return (
    <section id="why" data-testid="section-why" className="relative z-10 py-28">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <span className="mb-4 inline-block font-display text-xs tracking-[0.25em] text-[var(--gold)]">
            08 — WHY BHSQUARE
          </span>
        </Reveal>
        <h2 className="max-w-2xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          <MaskText lines={["Engineered To Be", "Trusted."]} />
        </h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <SpotCard key={s.label} testId={`stat-card-${i}`}>
              <s.icon size={30} weight="duotone" color="#FF8A00" />
              <div className="mt-6 font-display text-4xl font-extrabold text-white">
                <CountUp to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-[var(--muted)]">{s.label}</div>
            </SpotCard>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {PERKS.map((p, i) => (
            <SpotCard key={p.t} testId={`perk-card-${i}`}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(255,138,0,0.25),rgba(255,213,74,0.12))",
                  }}
                >
                  <p.icon size={24} weight="duotone" color="#FFD54A" />
                </div>
                <div className="font-display text-lg font-bold text-white">
                  {p.t}
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">{p.d}</p>
            </SpotCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SECTION 9 — PROJECT SHOWCASE (horizontal) ---------------- */
const PROJECTS = [
  {
    img: "https://images.unsplash.com/photo-1780445392694-c95056ed12e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxzb2xhciUyMHBhbmVscyUyMG9uJTIwbW9kZXJuJTIwcm9vZnxlbnwwfHx8fDE3ODU0OTY0ODR8MA&ixlib=rb-4.1.0&q=85",
    t: "Residential Rooftop",
    loc: "Navsari",
    kw: "6.5 kW",
  },
  {
    img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwc29sYXIlMjBpbnN0YWxsYXRpb258ZW58MHx8fHwxNzg1NDk2NDgzfDA&ixlib=rb-4.1.0&q=85",
    t: "Commercial Rooftop",
    loc: "Surat",
    kw: "120 kW",
  },
  {
    img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    t: "Industrial Array",
    loc: "Gujarat",
    kw: "480 kW",
  },
  {
    img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    t: "Ground Mount",
    loc: "Valsad",
    kw: "250 kW",
  },
];

export function Projects() {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section || window.innerWidth < 1024) return;
    const ctx = gsap.context(() => {
      const scrollLen = track.scrollWidth - window.innerWidth + 120;
      gsap.to(track, {
        x: -scrollLen,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollLen}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      data-testid="section-projects"
      className="relative z-10 overflow-hidden py-28 lg:py-0 lg:min-h-screen lg:flex lg:items-center"
    >
      <div className="w-full">
        <div className="mx-auto mb-10 w-full max-w-[1400px] px-5 md:px-10 lg:mb-14">
          <span className="mb-4 inline-block font-display text-xs tracking-[0.25em] text-[var(--gold)]">
            09 — PROJECT SHOWCASE
          </span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Powering Gujarat, Rooftop by Rooftop
          </h2>
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 px-5 md:px-10 lg:flex-nowrap max-lg:overflow-x-auto max-lg:pb-6 max-lg:snap-x"
        >
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              data-testid={`project-card-${i}`}
              whileHover={{ scale: 0.99 }}
              className="group relative h-[420px] w-[85vw] shrink-0 overflow-hidden rounded-3xl max-lg:snap-center lg:w-[520px]"
            >
              <img
                src={p.img}
                alt={`${p.t} solar project in ${p.loc}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(11,18,32,0.9), transparent 55%)",
                }}
              />
              <div className="absolute bottom-0 left-0 w-full p-7">
                <div className="mb-2 inline-block rounded-full glass px-3 py-1 font-display text-xs tracking-widest text-[var(--gold)]">
                  {p.kw}
                </div>
                <div className="font-display text-2xl font-bold text-white">
                  {p.t}
                </div>
                <div className="text-sm text-white/70">{p.loc}, India</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const calculateROI = (monthlyBill) => {
  // Estimated annual electricity bill
  const yearlyBill = monthlyBill * 12;

  // Rough estimate: ₹1,500 monthly bill ≈ 1 kW system
  const systemSize = Math.max(1, Math.round(monthlyBill / 1500));

  // Example solar cost
  const costPerKW = 50000;
  const grossCost = systemSize * costPerKW;

  // Example subsidy calculation
  let subsidy = 0;

  if (systemSize <= 2) {
    subsidy = systemSize * 30000;
  } else {
    subsidy = 60000 + Math.min(systemSize - 2, 1) * 18000;
  }

  // Subsidy can't exceed the system cost
  subsidy = Math.min(subsidy, grossCost);

  const netCost = grossCost - subsidy;

  // Estimated yearly savings
  const yearlySavings = Math.round(yearlyBill * 0.85);

  // Payback
  const paybackYears =
    yearlySavings > 0 ? Number((netCost / yearlySavings).toFixed(1)) : 0;

  // 25-year savings
  const twentyFiveYearSavings = Math.max(
    0,
    Math.round(yearlySavings * 25 - netCost),
  );

  return {
    system_size_kw: systemSize,
    subsidy,
    net_cost: netCost,
    payback_years: paybackYears,
    yearly_savings: yearlySavings,
    twenty_five_year_savings: twentyFiveYearSavings,
  };
};

/* ---------------- ROI + SUBSIDY CALCULATOR ---------------- */
export function ROICalculator() {
  const [bill, setBill] = useState(4500);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const compute = (value) => {
    const r = calculateROI(value);
    setResult(r);
  };

  useEffect(() => {
    compute(4500);
  }, []);

  return (
    <section id="roi" data-testid="section-roi" className="relative z-10 py-28">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 font-display text-xs tracking-[0.25em] text-[var(--gold)]">
              <Calculator size={14} /> SOLAR ROI CALCULATOR
            </span>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              See Your Savings In Seconds
            </h2>
            <p className="mt-5 max-w-md text-lg text-[var(--muted)]">
              Slide your average monthly electricity bill — we’ll size your
              system and estimate your subsidy, payback and 25-year savings.
            </p>

            <div className="mt-10 rounded-3xl glass p-7">
              <div className="flex items-end justify-between">
                <span className="text-sm text-[var(--muted)]">
                  Monthly Electricity Bill
                </span>
                <span className="font-display text-3xl font-extrabold text-gradient-sun">
                  ₹{bill.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-6">
                <input
                  data-testid="roi-bill-slider"
                  type="range"
                  min="500"
                  max="25000"
                  step="100"
                  value={bill}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setBill(value);
                    setResult(calculateROI(value));
                  }}
                  className="mt-6 w-full cursor-pointer accent-orange-500"
                />
                <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
                  <span>₹500</span>
                  <span>₹25,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl glass-strong p-8">
            <div className="mb-6 font-display text-lg font-bold text-white">
              Your Solar Estimate
            </div>
            {result ? (
              <div className="grid grid-cols-2 gap-4" data-testid="roi-results">
                <ResultBox
                  label="Recommended System"
                  value={`${result.system_size_kw} kW`}
                />
                <ResultBox
                  label="PM Surya Ghar Subsidy"
                  value={`₹${result.subsidy.toLocaleString("en-IN")}`}
                  accent
                />
                <ResultBox
                  label="Net Investment"
                  value={`₹${result.net_cost.toLocaleString("en-IN")}`}
                />
                <ResultBox
                  label="Payback Period"
                  value={`${result.payback_years} yrs`}
                />
                <ResultBox
                  label="Yearly Savings"
                  value={`₹${result.yearly_savings.toLocaleString("en-IN")}`}
                  accent
                />
                <ResultBox
                  label="25-Year Savings"
                  value={`₹${result.twenty_five_year_savings.toLocaleString("en-IN")}`}
                  accent
                />
              </div>
            ) : (
              <div className="text-sm text-[var(--muted)]">
                {loading ? "Calculating…" : "Adjust the slider to begin."}
              </div>
            )}
            <button
              data-testid="roi-cta-btn"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] py-3.5 font-semibold text-[#0B1220] transition-transform duration-300 hover:scale-[1.02]"
            >
              Get My Exact Quote <ArrowRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultBox({ label, value, accent }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div
        className={`mt-1 font-display text-xl font-extrabold ${accent ? "text-gradient-sun" : "text-white"}`}
      >
        {value}
      </div>
    </div>
  );
}
