import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Phone, MessageCircle, Mail, MapPin, Send, Sun } from "lucide-react";
import { MaskText, Reveal, Magnetic } from "../../lib/motion";
import logo from "../../assets/logo2.png";

import axios from "axios";
const PHONE = "+919824431526";
const WA = "919824431526";
const EMAIL = "harshwork2422@gmail.com";

/* ---------------- SECTION 11 — CONTACT ---------------- */
export function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Navsari",
    property_type: "residential",
    monthly_bill: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      alert("Please add your name and phone number.");
      return;
    }

    setSending(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/leads`,
        {
          ...form,
          monthly_bill: form.monthly_bill ? Number(form.monthly_bill) : null,
          source: "website-contact",
        },
      );

      console.log("Lead submitted:", response.data);

      alert("Request received! Our solar expert will call you shortly. ☀");

      setForm({
        name: "",
        phone: "",
        email: "",
        city: "Navsari",
        property_type: "residential",
        monthly_bill: "",
        message: "",
      });
    } catch (error) {
      console.error("Lead submission error:", error);
      alert("Something went wrong. Please call us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="section-contact"
      className="relative z-10 overflow-hidden py-28"
    >
      <motion.div
        className="pointer-events-none absolute -bottom-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,138,0,0.35), transparent 65%)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <span className="mb-4 inline-block font-display text-xs tracking-[0.25em] text-[var(--gold)]">
              11 — CONTACT
            </span>
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
              <MaskText lines={["Book Your Free", "Solar Consultation"]} />
            </h2>
            <Reveal
              delay={0.3}
              className="mt-6 max-w-md text-lg text-[var(--muted)]"
            >
              No pressure, no obligation. Our engineers will assess your rooftop
              and show you exactly how much you can save.
            </Reveal>

            <div className="mt-10 space-y-3">
              <a
                data-testid="contact-call-link"
                href={`tel:${PHONE}`}
                className="flex items-center gap-4 rounded-2xl glass px-5 py-4 transition-colors hover:bg-white/10"
              >
                <Phone size={22} weight="fill" color="#FFD54A" />
                <div>
                  <div className="text-xs text-[var(--muted)]">Call us</div>
                  <div className="font-display font-semibold text-white">
                    +91 98244 31526
                  </div>
                </div>
              </a>
              <a
                data-testid="contact-whatsapp-link"
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl glass px-5 py-4 transition-colors hover:bg-white/10"
              >
                <MessageCircle size={22} weight="fill" color="#25D366" />
                <div>
                  <div className="text-xs text-[var(--muted)]">WhatsApp</div>
                  <div className="font-display font-semibold text-white">
                    Chat with us
                  </div>
                </div>
              </a>
              <a
                data-testid="contact-email-link"
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 rounded-2xl glass px-5 py-4 transition-colors hover:bg-white/10"
              >
                <Mail size={22} weight="fill" color="#3B82F6" />
                <div>
                  <div className="text-xs text-[var(--muted)]">Email</div>
                  <div className="font-display font-semibold text-white">
                    {EMAIL}
                  </div>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-2xl glass px-5 py-4">
                <MapPin size={22} weight="fill" color="#FF8A00" />
                <div>
                  <div className="text-xs text-[var(--muted)]">Location</div>
                  <div className="font-display font-semibold text-white">
                    Navsari, Gujarat, India
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="BHsquare Solar Navsari location"
                data-testid="contact-map"
                src="https://www.google.com/maps?q=Navsari,Gujarat,India&output=embed"
                width="100%"
                height="220"
                loading="lazy"
                style={{
                  border: 0,
                  filter: "grayscale(0.3) invert(0.9) hue-rotate(180deg)",
                }}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <Reveal delay={0.2}>
            <form
              data-testid="contact-form"
              onSubmit={submit}
              className="rounded-3xl glass-strong p-7 md:p-9"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name *">
                  <input
                    data-testid="contact-name-input"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#FF8A00]"
                  />
                </Field>

                <Field label="Phone *">
                  <input
                    data-testid="contact-phone-input"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 …"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#FF8A00]"
                  />
                </Field>

                <Field label="Email">
                  <input
                    data-testid="contact-email-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#FF8A00]"
                  />
                </Field>

                <Field label="City">
                  <input
                    data-testid="contact-city-input"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#FF8A00]"
                  />
                </Field>

                <Field label="Property Type">
                  <select
                    data-testid="contact-property-select"
                    value={form.property_type}
                    onChange={(e) => set("property_type", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-[#FF8A00]"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </Field>

                <Field label="Monthly Bill (₹)">
                  <input
                    data-testid="contact-bill-input"
                    type="number"
                    value={form.monthly_bill}
                    onChange={(e) => set("monthly_bill", e.target.value)}
                    placeholder="4500"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#FF8A00]"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Message">
                  <textarea
                    data-testid="contact-message-input"
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell us about your rooftop…"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#FF8A00]"
                  />
                </Field>
              </div>

              <button
                data-testid="contact-submit-btn"
                type="submit"
                disabled={sending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] py-4 font-semibold text-[#0B1220] transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
              >
                {sending ? "Sending…" : "Book My Free Site Visit"}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Footer() {
  const go = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer
      data-testid="site-footer"
      className="relative z-10 overflow-hidden bg-[#0B1220]"
    >
      {/* ================= HERO FOOTER SECTION ================= */}
      <div className="relative h-[60vh] min-h-[420px]">
        {/* Sunset Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, #0B1220 0%, #2a1c34 45%, #7a3a1e 72%, #FF8A00 92%, #FFD54A 100%)",
          }}
        />

        {/* Animated Sun */}
        <motion.div
          className="
            absolute
            bottom-[8%]
            left-1/2
            h-28 w-28
            sm:h-36 sm:w-36
            md:h-40 md:w-40
            -translate-x-1/2
            rounded-full
            shadow-[0_0_60px_rgba(255,138,0,0.35)]
          "
          style={{
            background: "radial-gradient(circle,#FFF3C4,#FFD54A 55%,#FF8A00)",
          }}
          animate={{ y: [10, -6, 10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hero Taglines */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          <MaskText
            testId="footer-tagline"
            lines={["Powering Homes."]}
            className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-sm"
          />
          <MaskText
            lines={["Empowering Tomorrow."]}
            className="font-display text-4xl font-extrabold tracking-tight text-[#0B1220] sm:text-6xl"
            delay={0.2}
          />
        </div>
      </div>

      {/* ================= BOTTOM METADATA BAR ================= */}
      <div className="border-t border-white/10 bg-[#0B1220]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-5 py-8 sm:px-8 md:flex-row md:py-6">
          {/* Logo & Tagline Wrapper */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <button
              data-testid="nav-logo"
              onClick={() => go("sun")}
              className="relative flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orange,#f97316)] rounded-lg"
              aria-label="Back to top"
            >
              <img
                src={logo}
                alt="BHSquare Logo"
                className="h-8 scale-[4.0] sm:h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </button>
          </div>

          {/* Location & Copyright */}
          <div className="text-center text-xs sm:text-sm text-[var(--muted,#94a3b8)] md:text-right">
            Navsari, Gujarat · www.bhsquare.in · © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- FLOATING WHATSAPP ---------------- */
export function FloatingWhatsApp() {
  return (
    <motion.a
      data-testid="floating-whatsapp"
      href={`https://wa.me/${WA}`}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_40px_-8px_rgba(37,211,102,0.7)]"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={30} weight="fill" color="#fff" />
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
    </motion.a>
  );
}
