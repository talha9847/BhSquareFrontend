import { useEffect, useRef } from "react";
import { Zap, ShieldCheck, Leaf } from "lucide-react";

const milestones = [
  {
    year: "2024",
    event:
      "BHSquare was founded with a mission to transform energy consumption through solar. Successfully completed 500kW+ residential solar installations in Gujarat.",
  },
  {
    year: "2025",
    event:
      "Expanded into commercial and apartment projects across South Gujarat. Achieved 1MW+ total capacity, marking a significant growth milestone.",
  },
];

const values = [
  {
    Icon: Zap,
    title: "Efficiency First",
    desc: "We use high-performance Tier-1 solar panels with 21%+ efficiency for maximum output.",
  },
  {
    Icon: ShieldCheck,
    title: "Expert Team",
    desc: "Skilled professionals delivering safe, reliable, and high-quality solar installations.",
  },
  {
    Icon: Leaf,
    title: "Eco Commitment",
    desc: "Each installation offsets 2+ tonnes of CO₂ annually, contributing to a sustainable future.",
  },
];

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".abt-reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("abt-in"), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* REFINED IMAGE COLLAGE */}
          <div className="abt-reveal opacity-0 -translate-x-6 transition-all duration-700 relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80"
                  alt="Solar installation"
                  className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-500"
                />
                <img
                  src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80"
                  alt="Solar team"
                  className="w-full h-32 sm:h-44 object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="space-y-3 sm:space-y-4 pt-8 sm:pt-12">
                <img
                  src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80"
                  alt="Solar field"
                  className="w-full h-32 sm:h-44 object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-500"
                />
                <img
                  src="https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=600&q=80"
                  alt="Solar rooftop"
                  className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

            {/* FLOATING BADGE - Improved Positioning */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-1/4 bg-[#0F2D6B] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 whitespace-nowrap z-20">
              <div className="flex flex-col items-center leading-none">
                <span className="text-2xl font-bold text-[#F5C518]">2.5+</span>
              </div>
              <div className="h-8 w-[1px] bg-white/20" />
              <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">
                Years of Excellence
              </span>
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="abt-reveal opacity-0 translate-y-4 transition-all duration-500">
              <span className="inline-block px-4 py-1 bg-blue-50 text-[#1a5695] text-xs sm:text-sm font-bold uppercase tracking-widest rounded-full mb-4">
                About BHSquare
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-[1.15]">
                Powering India's
                <span className="text-[#1a5695]"> Solar Future</span>
              </h2>
            </div>

            <p className="abt-reveal opacity-0 translate-y-4 transition-all duration-500 text-gray-600 text-base sm:text-lg leading-relaxed">
              Founded in 2024, BHSquare is rapidly emerging as a trusted solar
              solutions provider in Gujarat. We are committed to making clean
              energy accessible, affordable, and reliable for every home and
              business.
            </p>

            {/* CORE VALUES */}
            <div className="abt-reveal opacity-0 translate-y-4 transition-all duration-500 grid gap-4">
              {values.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 p-4 border border-gray-100 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100/50 flex items-center justify-center flex-shrink-0">
                    <Icon size={22} className="text-[#1a5695]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-0.5">
                      {title}
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm leading-snug">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* JOURNEY TIMELINE */}
            <div className="abt-reveal opacity-0 translate-y-4 transition-all duration-500 pt-4">
              <h4 className="font-bold text-gray-400 mb-6 text-[11px] uppercase tracking-[0.2em]">
                Our Journey
              </h4>
              <div className="relative ml-2">
                <div className="absolute left-[31px] top-2 bottom-2 w-[1.5px] bg-blue-100" />
                <div className="space-y-6">
                  {milestones.map(({ year, event }) => (
                    <div
                      key={year}
                      className="flex items-start gap-6 relative group"
                    >
                      <div className="w-8 text-right text-xs font-black text-[#1a5695] pt-1">
                        {year}
                      </div>
                      <div className="relative flex items-center justify-center pt-1">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#1a5695] border-2 border-white shadow-sm z-10 group-hover:scale-125 transition-transform" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md">
                        {event}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .abt-reveal.abt-in { opacity: 1 !important; transform: translate(0) !important; }
      `}</style>
    </section>
  );
}
