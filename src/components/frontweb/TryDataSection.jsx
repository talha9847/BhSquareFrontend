import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Zap,
  IndianRupee,
  Leaf,
  TreePine,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { MaskText, Reveal, CountUp } from "../../lib/motion";
// import { getLiveDashboard } from "../../lib/api";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../ui/accordion";

/* ---------------- SECTION 10 — LIVE ENERGY DASHBOARD ---------------- */
// export function Dashboard() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     let alive = true;
//     const load = () =>
//       getLiveDashboard()
//         .then((d) => alive && setData(d))
//         .catch(() => {});
//     load();
//     const t = setInterval(load, 15000);
//     return () => {
//       alive = false;
//       clearInterval(t);
//     };
//   }, []);

//   const tiles = data
//     ? [
//         {
//           icon: Lightning,
//           label: "Today's Generation",
//           value: data.today_generation_kwh,
//           suffix: " kWh",
//         },
//         {
//           icon: CurrencyInr,
//           label: "Monthly Savings",
//           value: data.monthly_savings_inr,
//           prefix: "₹",
//         },
//         {
//           icon: Leaf,
//           label: "CO₂ Saved",
//           value: data.co2_saved_kg,
//           suffix: " kg",
//         },
//         {
//           icon: Tree,
//           label: "Trees Equivalent",
//           value: data.trees_equivalent,
//           suffix: "",
//         },
//       ]
//     : [];

//   return (
//     <section
//       id="dashboard"
//       data-testid="section-dashboard"
//       className="relative z-10 py-28"
//     >
//       <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
//         <div className="flex items-center gap-3">
//           <span className="font-display text-xs tracking-[0.25em] text-[var(--gold)]">
//             10 — LIVE ENERGY DASHBOARD
//           </span>
//           <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-300">
//             <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />{" "}
//             Live
//           </span>
//         </div>
//         <h2 className="mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
//           <MaskText lines={["Watch The Sun", "Pay Your Bills."]} />
//         </h2>

//         <div className="mt-12 grid gap-6 lg:grid-cols-3">
//           <div className="rounded-3xl glass-strong p-6 lg:col-span-2">
//             <div className="mb-4 flex items-center justify-between">
//               <span className="font-display font-bold text-white">
//                 Today's Production Curve
//               </span>
//               <span className="font-display text-2xl font-extrabold text-gradient-sun">
//                 {data ? `${data.live_kw} kW` : "—"}{" "}
//                 <span className="text-sm font-normal text-[var(--muted)]">
//                   now
//                 </span>
//               </span>
//             </div>
//             <div className="h-64 w-full">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={data?.hourly || []}>
//                   <defs>
//                     <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#FFD54A" stopOpacity={0.7} />
//                       <stop
//                         offset="100%"
//                         stopColor="#FF8A00"
//                         stopOpacity={0.02}
//                       />
//                     </linearGradient>
//                   </defs>
//                   <XAxis
//                     dataKey="hour"
//                     stroke="#93A0B4"
//                     fontSize={11}
//                     tickLine={false}
//                     axisLine={false}
//                     interval={1}
//                   />
//                   <YAxis
//                     stroke="#93A0B4"
//                     fontSize={11}
//                     tickLine={false}
//                     axisLine={false}
//                     width={30}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       background: "#0F172A",
//                       border: "1px solid rgba(255,255,255,0.1)",
//                       borderRadius: 12,
//                       color: "#fff",
//                     }}
//                     labelStyle={{ color: "#FFD54A" }}
//                     formatter={(v) => [`${v} kW`, "Output"]}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="kw"
//                     stroke="#FF8A00"
//                     strokeWidth={2.5}
//                     fill="url(#solarFill)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
//             {tiles.map((t, i) => (
//               <Reveal key={t.label} delay={i * 0.08}>
//                 <div
//                   data-testid={`dash-tile-${i}`}
//                   className="rounded-3xl glass p-5"
//                 >
//                   <t.icon size={26} weight="duotone" color="#FFD54A" />
//                   <div className="mt-3 font-display text-2xl font-extrabold text-white">
//                     <CountUp
//                       to={t.value}
//                       prefix={t.prefix || ""}
//                       suffix={t.suffix || ""}
//                       duration={1.4}
//                     />
//                   </div>
//                   <div className="text-xs text-[var(--muted)]">{t.label}</div>
//                 </div>
//               </Reveal>
//             ))}
//           </div>
//         </div>
//         <p className="mt-4 text-xs text-[var(--muted)]">
//           * Representative live demo data. Ready to connect to your real
//           inverter cloud (Solis / Growatt / SolarEdge).
//         </p>
//       </div>
//     </section>
//   );
// }

/* ---------------- TESTIMONIALS ---------------- */
const REVIEWS = [
  {
    name: "Rajesh Patel",
    city: "Navsari",
    text: "BHsquare handled everything — subsidy paperwork, net metering, installation. My bill went from ₹5,200 to almost nothing.",
  },
  {
    name: "Meena Desai",
    city: "Surat",
    text: "Professional engineers and clean workmanship. The monitoring app lets me see production every single day.",
  },
  {
    name: "Amit Shah",
    city: "Valsad",
    text: "Best decision for our factory. 120 kW installed on time and the ROI is exactly as they promised.",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % REVIEWS.length);
  const prev = () => setI((p) => (p - 1 + REVIEWS.length) % REVIEWS.length);
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section data-testid="section-testimonials" className="relative z-10 py-28">
      <div className="mx-auto w-full max-w-3xl px-5 text-center md:px-10">
        <Quote size={48} weight="fill" color="#FF8A00" className="mx-auto" />
        <div className="relative mt-8 min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              data-testid="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-display text-2xl font-medium leading-snug text-white md:text-3xl">
                "{REVIEWS[i].text}"
              </p>
              <div className="mt-6 font-display text-lg font-bold text-gradient-sun">
                {REVIEWS[i].name}
              </div>
              <div className="text-sm text-[var(--muted)]">
                {REVIEWS[i].city}, Gujarat
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            data-testid="testimonial-prev"
            onClick={prev}
            className="rounded-full glass p-3 text-white hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Review ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-[var(--orange)]" : "w-2 bg-white/20"}`}
              />
            ))}
          </div>
          <button
            data-testid="testimonial-next"
            onClick={next}
            className="rounded-full glass p-3 text-white hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const FAQS = [
  {
    q: "How much does a rooftop solar system cost?",
    a: "Cost depends on system size. A typical residential 3 kW system starts around ₹1.8–2 lakh before subsidy. Use our calculator above for an instant estimate tailored to your bill.",
  },
  {
    q: "How does the PM Surya Ghar subsidy work?",
    a: "Eligible residential consumers receive up to ₹78,000 in central financial assistance, credited after installation and inspection. BHsquare handles the full application and documentation.",
  },
  {
    q: "How long does installation take?",
    a: "Most residential rooftops are installed within 2–4 days once materials arrive. Net metering approval timelines depend on the local DISCOM.",
  },
  {
    q: "What warranty do I get?",
    a: "Tier-1 panels carry a 25-year performance warranty, with product warranties on panels and inverters as per manufacturer terms.",
  },
  {
    q: "Do you serve areas outside Navsari?",
    a: "Yes. We install across Gujarat including Surat, Valsad, Bharuch and surrounding regions for both residential and commercial projects.",
  },
];

// export function FAQ() {
//   return (
//     <section data-testid="section-faq" className="relative z-10 py-28">
//       <div className="mx-auto w-full max-w-3xl px-5 md:px-10">
//         <span className="mb-4 inline-block font-display text-xs tracking-[0.25em] text-[var(--gold)]">
//           FREQUENTLY ASKED
//         </span>
//         <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
//           Questions, Answered
//         </h2>
//         <Accordion type="single" collapsible className="mt-10 w-full">
//           {FAQS.map((f, i) => (
//             <AccordionItem
//               key={i}
//               value={`item-${i}`}
//               data-testid={`faq-item-${i}`}
//               className="border-white/10"
//             >
//               <AccordionTrigger className="text-left font-display text-lg text-white hover:text-[var(--gold)] hover:no-underline">
//                 {f.q}
//               </AccordionTrigger>
//               <AccordionContent className="text-base text-[var(--muted)]">
//                 {f.a}
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       </div>
//     </section>
//   );
// }
