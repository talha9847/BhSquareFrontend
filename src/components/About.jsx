import { useEffect, useRef } from "react";
import { Zap, ShieldCheck, Leaf } from "lucide-react";

const milestones = [
  { year: "2014", event: "BHSquare founded in Ahmedabad" },
  { year: "2017", event: "Expanded to 5 states across India" },
  { year: "2020", event: "Crossed 250+ commercial installations" },
  { year: "2024", event: "500+ installations, 15MW+ generated" },
];

const values = [
  { Icon: Zap, title: "Efficiency First", desc: "We use only Tier-1 solar panels with 21%+ efficiency ratings for maximum output." },
  { Icon: ShieldCheck, title: "Certified Experts", desc: "MNRE-certified team with 10+ years of solar installation experience." },
  { Icon: Leaf, title: "Eco Committed", desc: "Every installation offsets 2+ tonnes of CO₂ annually — we're building a greener India." },
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image collage */}
          <div className="abt-reveal opacity-0 -translate-x-6 transition-all duration-700 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80" alt="Solar installation" className="w-full h-52 object-cover rounded-2xl shadow-md" />
                <img src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80" alt="Solar team" className="w-full h-36 object-cover rounded-2xl shadow-md" />
              </div>
              <div className="space-y-4 mt-8">
                <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80" alt="Solar field" className="w-full h-36 object-cover rounded-2xl shadow-md" />
                <img src="https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=600&q=80" alt="Solar rooftop" className="w-full h-52 object-cover rounded-2xl shadow-md" />
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#0F2D6B] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 whitespace-nowrap">
              <span className="text-2xl font-display font-bold text-[#F5C518]">10+</span>
              <span className="text-sm font-body">Years of Excellence</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="abt-reveal opacity-0 translate-y-4 transition-all duration-500">
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1a5695] text-sm font-semibold font-body rounded-full mb-4">About BHSquare</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Powering India's<span className="text-[#1a5695]"> Solar Future</span>
              </h2>
            </div>

            <p className="abt-reveal opacity-0 translate-y-4 transition-all duration-500 text-gray-600 text-lg leading-relaxed font-body">
              Founded in 2014, BHSquare has been at the forefront of India's solar revolution.
              We believe clean energy should be accessible, affordable, and reliable for every
              Indian home and business.
            </p>

            <p className="abt-reveal opacity-0 translate-y-4 transition-all duration-500 text-gray-500 leading-relaxed font-body">
              Our MNRE-certified engineers design custom solar systems optimized for your specific
              energy needs and roof type. With over 500 successful installations across Gujarat,
              Rajasthan, Maharashtra and beyond, we bring unmatched expertise to every project.
            </p>

            <div className="abt-reveal opacity-0 translate-y-4 transition-all duration-500 space-y-4">
              {values.map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-[#1a5695]" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-gray-900 mb-1">{title}</h4>
                    <p className="text-gray-500 text-sm font-body">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="abt-reveal opacity-0 translate-y-4 transition-all duration-500">
              <h4 className="font-display font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Our Journey</h4>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-100" />
                <div className="space-y-3">
                  {milestones.map(({ year, event }) => (
                    <div key={year} className="flex items-center gap-4">
                      <div className="w-16 text-right text-xs font-bold text-[#1a5695] font-body flex-shrink-0">{year}</div>
                      <div className="w-4 h-4 rounded-full bg-[#1a5695] border-2 border-white shadow-sm flex-shrink-0 z-10" />
                      <p className="text-sm text-gray-600 font-body">{event}</p>
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
