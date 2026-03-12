import { useEffect, useRef } from "react";
import { Home, Building2, Wrench, MessageCircle, ArrowRight } from "lucide-react";

const services = [
  {
    Icon: Home,
    title: "Residential Solar",
    subtitle: "Home Installations",
    description: "Transform your home with rooftop solar panels. Reduce electricity bills by up to 90% with our custom-designed residential solar systems.",
    features: ["Net Metering Setup", "Smart Monitoring", "10-Year Warranty"],
    color: "from-blue-500 to-blue-700",
    accent: "#3B82F6",
  },
  {
    Icon: Building2,
    title: "Commercial Solar",
    subtitle: "Business Solutions",
    description: "Large-scale solar installations for factories, offices, and commercial buildings. Maximize ROI with our industrial-grade solar solutions.",
    features: ["Scalable Systems", "Tax Benefits", "Priority Support"],
    color: "from-[#1a5695] to-[#0F2D6B]",
    accent: "#1a5695",
  },
  {
    Icon: Wrench,
    title: "Solar Maintenance",
    subtitle: "AMC Services",
    description: "Keep your solar system performing at peak efficiency. Our comprehensive maintenance plans ensure maximum energy output year-round.",
    features: ["Quarterly Cleaning", "Performance Reports", "Emergency Repairs"],
    color: "from-yellow-400 to-orange-500",
    accent: "#F5C518",
  },
  {
    Icon: MessageCircle,
    title: "Solar Consultation",
    subtitle: "Expert Advisory",
    description: "Free expert consultation to find the perfect solar solution for your needs. We analyze your energy consumption and design the optimal system.",
    features: ["Site Analysis", "ROI Calculation", "Subsidy Guidance"],
    color: "from-emerald-400 to-teal-600",
    accent: "#10b981",
  },
];

function ServiceCard({ service }) {
  const { Icon, title, subtitle, description, features, color, accent } = service;
  return (
    <div className="group relative bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-5 shadow-md`}
        style={{ boxShadow: `0 8px 20px ${accent}30` }}
      >
        <Icon size={26} strokeWidth={1.5} />
      </div>
      <p className="text-xs font-semibold font-body tracking-widest uppercase mb-1" style={{ color: accent }}>
        {subtitle}
      </p>
      <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed font-body mb-5">{description}</p>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-600 font-body">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
            {f}
          </li>
        ))}
      </ul>
      <div
        className="mt-6 flex items-center gap-2 text-sm font-semibold font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: accent }}
      >
        Learn More <ArrowRight size={14} />
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("revealed"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 reveal opacity-0 translate-y-4 transition-all duration-500">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1a5695] text-sm font-semibold font-body rounded-full mb-4 tracking-wide">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Solar<span className="text-[#1a5695]"> Solutions</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-body">
            From consultation to installation and beyond — BHSquare handles every aspect
            of your solar journey with expertise and care.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="reveal opacity-0 translate-y-4 transition-all duration-500"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .reveal.revealed { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </section>
  );
}
