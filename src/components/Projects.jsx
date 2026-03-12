import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

const projects = [
  { id: 1, title: "Rajkot Residence", category: "Residential", capacity: "5 kW", savings: "₹8,000/mo", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=700&q=80", location: "Rajkot, Gujarat", year: "2024" },
  { id: 2, title: "Surat Textile Factory", category: "Commercial", capacity: "200 kW", savings: "₹1.8L/mo", image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=700&q=80", location: "Surat, Gujarat", year: "2023" },
  { id: 3, title: "Ahmedabad IT Park", category: "Commercial", capacity: "500 kW", savings: "₹4.2L/mo", image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=700&q=80", location: "Ahmedabad, Gujarat", year: "2024" },
  { id: 4, title: "Vadodara Bungalow", category: "Residential", capacity: "10 kW", savings: "₹14,000/mo", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=700&q=80", location: "Vadodara, Gujarat", year: "2023" },
  { id: 5, title: "Jaipur Farm Estate", category: "Agricultural", capacity: "75 kW", savings: "₹65,000/mo", image: "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=700&q=80", location: "Jaipur, Rajasthan", year: "2024" },
  { id: 6, title: "Mumbai Office Complex", category: "Commercial", capacity: "300 kW", savings: "₹2.5L/mo", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=700&q=80", location: "Mumbai, Maharashtra", year: "2024" },
];

const categories = ["All", "Residential", "Commercial", "Agricultural"];

const categoryColors = {
  Residential: { bg: "bg-blue-100", text: "text-blue-700" },
  Commercial: { bg: "bg-yellow-100", text: "text-yellow-700" },
  Agricultural: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".proj-reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("proj-in"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="proj-reveal opacity-0 translate-y-4 transition-all duration-500">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1a5695] text-sm font-semibold font-body rounded-full mb-4">Our Work</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Featured<span className="text-[#1a5695]"> Projects</span>
            </h2>
          </div>
          <div className="proj-reveal opacity-0 translate-y-4 transition-all duration-500 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold font-body transition-all duration-200 ${
                  filter === cat
                    ? "bg-[#1a5695] text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => {
            const colors = categoryColors[project.category] || { bg: "bg-gray-100", text: "text-gray-700" };
            return (
              <div
                key={project.id}
                className="proj-reveal opacity-0 translate-y-4 transition-all duration-500 group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold font-body ${colors.bg} ${colors.text}`}>
                    {project.category}
                  </span>
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold font-body bg-black/30 text-white backdrop-blur-sm">
                    {project.year}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm font-body mb-4 flex items-center gap-1">
                    <MapPin size={13} />
                    {project.location}
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 font-body">System Size</p>
                      <p className="font-display font-bold text-[#1a5695]">{project.capacity}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div>
                      <p className="text-xs text-gray-400 font-body">Monthly Savings</p>
                      <p className="font-display font-bold text-emerald-600">{project.savings}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="proj-reveal opacity-0 translate-y-4 transition-all duration-500 text-center mt-12">
          <p className="text-gray-500 font-body mb-4">Want to see your project here?</p>
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3.5 bg-[#1a5695] text-white font-semibold font-body rounded-xl hover:bg-[#1e40af] transition-all duration-200 shadow-lg shadow-blue-200"
          >
            Start Your Project
          </button>
        </div>
      </div>

      <style>{`
        .proj-reveal.proj-in { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </section>
  );
}
