import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  CircleAlert,
  Loader2, // Added for the loading spinner
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const contactInfo = [
  {
    Icon: Phone,
    label: "mobile",
    value: "+91  99094 31526",
    sub: "Mon-Sat, 9am-6pm",
  },
  {
    Icon: Mail,
    label: "Email",
    value: " harshwork2422@gmail.com",
    sub: "We reply within 24 hours",
  },
  {
    Icon: MapPin,
    label: "Office",
    value: "Kharel Shiv Campus , Near Kharel Chokdi Police Station",
    sub: "Gujarat, India - 396430",
  },
];

const perks = [
  "Free site visit & consultation",
  "Subsidy application support",
  "30 Years Of Warranty",
  "24/7 monitoring support",
];

export default function Contact() {
  const ref = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
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
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.replace(/\s/g, "")))
      e.mobile = "Valid 10-digit mobile required";
    if (!form.address.trim()) e.address = "Address is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate and check if any errors exist
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/sources/addWebLead", {
        name: form.name,
        mobile: form.mobile,
        address: form.address,
        status: "pending",
      });

      toast.success("Thank you! We will contact you soon.");
      setSubmitted(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <section id="contact" ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 con-reveal opacity-0 translate-y-4 transition-all duration-500">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#1a5695] text-sm font-semibold font-body rounded-full mb-4">
            Get in Touch
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Start Your Solar<span className="text-[#1a5695]"> Journey</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-body">
            Get a free consultation and detailed quote. Our solar experts are
            ready to design the perfect system for your needs.
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
                  <p className="text-xs text-gray-400 font-body font-semibold uppercase tracking-wider mb-0.5">
                    {label}
                  </p>
                  <p className="font-display font-semibold text-gray-900">
                    {value}
                  </p>
                  <p className="text-gray-400 text-sm font-body">{sub}</p>
                </div>
              </div>
            ))}

            <div className="con-reveal opacity-0 translate-y-4 transition-all duration-500 bg-[#0F2D6B] rounded-2xl p-6 text-white">
              <h4 className="font-display font-bold mb-4">
                Why Choose BHSquare?
              </h4>
              <ul className="space-y-3">
                {perks.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-blue-100 text-sm font-body"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-[#F5C518] flex-shrink-0"
                    />
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
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 font-body mb-6">
                    Our team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", mobile: "", address: "" });
                    }}
                    className="px-6 py-2.5 bg-[#1a5695] text-white font-semibold font-body rounded-xl hover:bg-[#1e40af] transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 font-body mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        disabled={loading}
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Harsh Patel"
                        className={`w-full px-4 py-3 border rounded-xl font-body text-sm outline-none transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"}`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 font-body flex items-center gap-1">
                          <CircleAlert size={12} />
                          {errors.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 font-body mb-1.5">
                      mobile Number *
                    </label>
                    <input
                      type="tel"
                      disabled={loading}
                      value={form.mobile}
                      onChange={(e) => handleChange("mobile", e.target.value)}
                      placeholder="9909431526"
                      className={`w-full px-4 py-3 border rounded-xl font-body text-sm outline-none transition-colors ${errors.mobile ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"}`}
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1 font-body flex items-center gap-1">
                        <CircleAlert size={12} />
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 font-body mb-1.5">
                      Address *
                    </label>
                    <textarea
                      rows={4}
                      disabled={loading}
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="Tell us about your solar requirements — property type, monthly electricity bill, location..."
                      className={`w-full px-4 py-3 border rounded-xl font-body text-sm outline-none transition-colors resize-none ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"}`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1 font-body flex items-center gap-1">
                        <CircleAlert size={12} />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 text-white font-bold font-body rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 group ${loading ? "bg-gray-400 cursor-wait" : "bg-[#1a5695] hover:bg-[#1e40af] shadow-blue-200"}`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending...
                      </>
                    ) : (
                      <>
                        Get Free Quote
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                  <p className="text-center text-gray-400 text-xs font-body">
                    Free consultation • No commitment required • Response within
                    24 hours
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
