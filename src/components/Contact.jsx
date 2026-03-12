import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, CheckCircle2, ArrowRight, CircleAlert } from "lucide-react";

const contactInfo = [
  { Icon: Phone, label: "Phone", value: "+91 98765 43210", sub: "Mon-Sat, 9am-6pm" },
  { Icon: Mail, label: "Email", value: "hello@bhsquare.in", sub: "We reply within 24 hours" },
  { Icon: MapPin, label: "Office", value: "SG Highway, Ahmedabad", sub: "Gujarat, India - 380054" },
];

const perks = [
  "Free site visit & consultation",
  "Subsidy application support",
  "10-year system warranty",
  "24/7 monitoring support",
];

export default function Contact() {
  const ref = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".con-reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("con-in"), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit phone required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
    setErrors({});
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <section id="contact" ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 con-reveal opacity-0 translate-y-4 transition-all duration-500">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1a5695] text-sm font-semibold font-body rounded-full mb-4">Get in Touch</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start Your Solar<span className="text-[#1a5695]"> Journey</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-body">
            Get a free consultation and detailed quote. Our solar experts are ready to design the perfect system for your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map(({ Icon, label, value, sub }, i) => (
              <div
                key={label}
                className="con-reveal opacity-0 translate-y-4 transition-all duration-500 flex gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1a5695] flex items-center justify-center flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-body font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="font-display font-semibold text-gray-900">{value}</p>
                  <p className="text-gray-400 text-sm font-body">{sub}</p>
                </div>
              </div>
            ))}

            <div className="con-reveal opacity-0 translate-y-4 transition-all duration-500 bg-[#0F2D6B] rounded-2xl p-6 text-white">
              <h4 className="font-display font-bold mb-4">Why Choose BHSquare?</h4>
              <ul className="space-y-3">
                {perks.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-blue-100 text-sm font-body">
                    <CheckCircle2 size={16} className="text-[#F5C518] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3 con-reveal opacity-0 translate-y-4 transition-all duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-emerald-500" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 font-body mb-6">Our team will contact you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                    className="px-6 py-2.5 bg-[#1a5695] text-white font-semibold font-body rounded-xl hover:bg-[#1e40af] transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 font-body mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Ramesh Patel"
                        className={`w-full px-4 py-3 border rounded-xl font-body text-sm outline-none transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1 font-body flex items-center gap-1"><CircleAlert size={12} />{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 font-body mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="ramesh@example.com"
                        className={`w-full px-4 py-3 border rounded-xl font-body text-sm outline-none transition-colors ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-body flex items-center gap-1"><CircleAlert size={12} />{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 font-body mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="9876543210"
                      className={`w-full px-4 py-3 border rounded-xl font-body text-sm outline-none transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-body flex items-center gap-1"><CircleAlert size={12} />{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 font-body mb-1.5">Message *</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Tell us about your solar requirements — property type, monthly electricity bill, location..."
                      className={`w-full px-4 py-3 border rounded-xl font-body text-sm outline-none transition-colors resize-none ${errors.message ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"}`}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1 font-body flex items-center gap-1"><CircleAlert size={12} />{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#1a5695] text-white font-bold font-body rounded-xl hover:bg-[#1e40af] transition-all duration-200 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                  >
                    Get Free Quote
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-gray-400 text-xs font-body">
                    Free consultation • No commitment required • Response within 24 hours
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .con-reveal.con-in { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </section>
  );
}
