import { useEffect, useRef } from "react";
import { ArrowRight, PlayCircle, Zap, BarChart2, Leaf } from "lucide-react";

const stats = [
  { value: "500+", label: "Installations" },
  { value: "15MW", label: "Power Generated" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "10yr", label: "Warranty" },
];

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".animate-on-enter").forEach((el, i) => {
              setTimeout(() => el.classList.add("entered"), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0F2D6B]"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1800&q=80"
          alt="Solar panels"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F2D6B]/90 via-[#1a5695]/70 to-[#0F2D6B]/80" />
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#F5C518]/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-[#3B82F6]/20 blur-3xl" />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="animate-on-enter opacity-0 translate-y-4 transition-all duration-500">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5C518]/15 border border-[#F5C518]/30 text-[#F5C518] text-sm font-medium font-body">
                <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse" />
                India's Trusted Solar Partner
              </span>
            </div>

            <div className="animate-on-enter opacity-0 translate-y-4 transition-all duration-500">
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Smart Solar
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C518] to-[#F0A500]">
                  Solutions
                </span>
                <br />
                <span className="text-blue-200">for Every Space</span>
              </h1>
            </div>

            <p className="animate-on-enter opacity-0 translate-y-4 transition-all duration-500 text-blue-100 text-lg leading-relaxed max-w-lg font-body">
              BHSquare delivers premium solar installation for homes and businesses across India.
              Cut energy costs by up to 90% with our certified, end-to-end solar solutions.
            </p>

            <div className="animate-on-enter opacity-0 translate-y-4 transition-all duration-500 flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection("#contact")}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#F5C518] text-[#0F2D6B] font-semibold font-body rounded-xl hover:bg-[#F0A500] transition-all duration-200 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:-translate-y-0.5"
              >
                Get Free Quote
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection("#projects")}
                className="flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white font-semibold font-body rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                <PlayCircle size={16} />
                View Projects
              </button>
            </div>
          </div>

          {/* Right card */}
          <div className="animate-on-enter opacity-0 translate-y-4 transition-all duration-500">
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 rounded-lg border border-[#F5C518]/40"
                      style={{
                        background: `linear-gradient(135deg, #1a5695 0%, #0F2D6B ${30 + i * 5}%, #1a5695 100%)`,
                      }}
                    >
                      <div className="w-full h-full rounded-lg opacity-40 grid grid-cols-2 gap-0.5 p-0.5">
                        {[0,1,2,3].map(j => (
                          <div key={j} className="bg-[#F5C518]/30 rounded-sm" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4 mb-4">
                  <div>
                    <p className="text-blue-200 text-xs font-body mb-1">Today's Generation</p>
                    <p className="text-white text-2xl font-bold font-display">28.4 kWh</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-[#F5C518]/50 flex items-center justify-center">
                    <span className="text-[#F5C518] text-lg font-bold font-display">94%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "Solar Input", value: 94, color: "#F5C518", Icon: Zap },
                    { label: "Grid Save", value: 78, color: "#3B82F6", Icon: BarChart2 },
                    { label: "CO₂ Offset", value: 88, color: "#10b981", Icon: Leaf },
                  ].map(({ label, value, color, Icon }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon size={13} style={{ color }} className="flex-shrink-0" />
                      <span className="text-blue-200 text-xs w-20 font-body">{label}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${value}%`, background: color }}
                        />
                      </div>
                      <span className="text-white text-xs font-body">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-[#F5C518] text-[#0F2D6B] rounded-2xl px-4 py-2 shadow-lg font-body text-sm font-semibold">
                🏆 #1 Rated
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className="animate-on-enter opacity-0 translate-y-4 transition-all duration-500 text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
              style={{ transitionDelay: `${500 + i * 100}ms` }}
            >
              <p className="font-display text-3xl font-bold text-[#F5C518]">{value}</p>
              <p className="text-blue-200 text-sm mt-1 font-body">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-on-enter.entered {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
}