import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Ramesh Patel", title: "Homeowner", location: "Ahmedabad, Gujarat", rating: 5, text: "BHSquare installed a 5kW system on our home. Our electricity bill dropped from ₹7,500 to just ₹400 per month! The team was professional, clean, and completed the work in just 2 days. Highly recommend!", avatar: "https://randomuser.me/api/portraits/men/32.jpg", savings: "₹7,100/mo saved" },
  { name: "Priya Mehta", title: "Factory Owner", location: "Surat, Gujarat", rating: 5, text: "We installed a 200kW system for our textile factory. ROI in less than 3 years! BHSquare handled all the DISCOM paperwork and subsidy applications. Outstanding service from start to finish.", avatar: "https://randomuser.me/api/portraits/women/44.jpg", savings: "₹1.8L/mo saved" },
  { name: "Amit Sharma", title: "IT Manager", location: "Pune, Maharashtra", rating: 5, text: "Our 300kW rooftop installation was completed ahead of schedule. BHSquare's monitoring app is excellent — I can track generation in real time. Their after-sales support is genuinely world-class.", avatar: "https://randomuser.me/api/portraits/men/67.jpg", savings: "₹2.5L/mo saved" },
  { name: "Sunita Joshi", title: "Farm Owner", location: "Jaipur, Rajasthan", rating: 5, text: "Our 75kW agricultural solar pump system transformed our farm operations. No more power cuts or diesel costs. BHSquare provided excellent consultation and the system has been running flawlessly for 18 months.", avatar: "https://randomuser.me/api/portraits/women/89.jpg", savings: "₹65,000/mo saved" },
  { name: "Vikram Desai", title: "Office Complex Owner", location: "Vadodara, Gujarat", rating: 5, text: "Best decision for our commercial building. The BHSquare team was thorough in their site analysis and proposed a system that exceeded our expectations. Zero hassle, all benefits.", avatar: "https://randomuser.me/api/portraits/men/54.jpg", savings: "₹1.2L/mo saved" },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} fill={i < count ? "#F5C518" : "#e5e7eb"} className={i < count ? "text-[#F5C518]" : "text-gray-200"} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".test-reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("test-in"), i * 120);
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
    <section ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 test-reveal opacity-0 translate-y-4 transition-all duration-500">
          <span className="inline-block px-4 py-1.5 bg-yellow-50 text-yellow-600 text-sm font-semibold font-body rounded-full mb-4">Customer Stories</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers<span className="text-[#F5C518]"> Say</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-body">Join 500+ happy customers who've made the switch to solar with BHSquare.</p>
        </div>

        {/* Featured */}
        <div className="test-reveal opacity-0 translate-y-4 transition-all duration-500 max-w-3xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-[#0F2D6B] to-[#1a5695] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-6 right-8 text-[120px] leading-none font-display text-white/5 select-none">"</div>
            <div className="relative">
              <StarRating count={testimonials[current].rating} />
              <p className="text-blue-100 text-lg leading-relaxed font-body mt-4 mb-6 italic">"{testimonials[current].text}"</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <img src={testimonials[current].avatar} alt={testimonials[current].name} className="w-12 h-12 rounded-full border-2 border-[#F5C518]" />
                  <div>
                    <p className="font-display font-bold text-white">{testimonials[current].name}</p>
                    <p className="text-blue-200 text-sm font-body">{testimonials[current].title} · {testimonials[current].location}</p>
                  </div>
                </div>
                <div className="bg-[#F5C518]/20 border border-[#F5C518]/30 px-4 py-2 rounded-xl">
                  <p className="text-[#F5C518] font-bold font-display">{testimonials[current].savings}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2.5 bg-[#1a5695]" : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.slice(0, 3).map((t, i) => (
            <div
              key={t.name}
              className="test-reveal opacity-0 translate-y-4 transition-all duration-500 bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <StarRating count={t.rating} />
              <p className="text-gray-600 text-sm leading-relaxed font-body mt-3 mb-4 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-display font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs font-body">{t.location}</p>
                </div>
                <span className="ml-auto text-emerald-600 text-xs font-bold font-body">{t.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .test-reveal.test-in { opacity: 1 !important; transform: translateY(0) !important; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </section>
  );
}
