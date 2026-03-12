import { useEffect, useRef } from "react";
import { ClipboardList, LayoutDashboard, HardHat, Power, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    Icon: ClipboardList,
    title: "Site Inspection",
    description: "Our certified engineers visit your site to assess roof structure, orientation, shading, and electrical setup to determine the ideal solar configuration.",
    duration: "1-2 Days",
    color: "#F5C518",
  },
  {
    number: "02",
    Icon: LayoutDashboard,
    title: "System Design",
    description: "We create a custom solar system design tailored to your energy needs, roof dimensions, and budget — complete with 3D layout and ROI projections.",
    duration: "2-3 Days",
    color: "#3B82F6",
  },
  {
    number: "03",
    Icon: HardHat,
    title: "Installation",
    description: "Our expert team installs premium solar panels, inverters, and mounting structures with precision. Full installation typically completed in 1-3 days.",
    duration: "1-3 Days",
    color: "#1a5695",
  },
  {
    number: "04",
    Icon: Power,
    title: "Activation",
    description: "System testing, grid connection, monitoring app setup, and handover. We also handle all paperwork for subsidies and net metering with your DISCOM.",
    duration: "1-2 Days",
    color: "#10b981",
  },
];

export default function Process() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".proc-reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("proc-in"), i * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-[#0F2D6B] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #F5C518 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a5695]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F5C518]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 proc-reveal opacity-0 translate-y-4 transition-all duration-500">
          <span className="inline-block px-4 py-1.5 bg-[#F5C518]/15 text-[#F5C518] text-sm font-semibold font-body rounded-full mb-4">How It Works</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Your Solar Journey<span className="text-[#F5C518]"> in 4 Steps</span>
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto font-body">
            We make going solar simple, fast, and hassle-free. From first call to first kilowatt, we handle everything.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="proc-reveal opacity-0 translate-y-6 transition-all duration-500 relative"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-5xl font-bold opacity-20 group-hover:opacity-40 transition-opacity" style={{ color: step.color }}>
                      {step.number}
                    </span>
                    <span className="text-xs font-body font-semibold px-3 py-1 rounded-full bg-white/10 text-blue-200">{step.duration}</span>
                  </div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `linear-gradient(135deg, ${step.color}30, ${step.color}15)`, border: `1px solid ${step.color}40` }}
                  >
                    <step.Icon size={24} style={{ color: step.color }} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-blue-200 text-sm leading-relaxed font-body">{step.description}</p>
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: step.color }} />
                </div>

                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-3 z-10 text-blue-400 items-center">
                    <ArrowRight size={18} className="opacity-40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="proc-reveal opacity-0 translate-y-4 transition-all duration-500 text-center mt-14">
          <p className="text-blue-200 mb-4 font-body">Ready to start your solar journey?</p>
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3.5 bg-[#F5C518] text-[#0F2D6B] font-bold font-body rounded-xl hover:bg-[#F0A500] transition-all duration-200 shadow-lg shadow-yellow-500/30"
          >
            Start Your Project Today
          </button>
        </div>
      </div>

      <style>{`
        .proc-reveal.proc-in { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </section>
  );
}
