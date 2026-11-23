import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Phone,
  Search,
  Sparkles,
  Sun,
  Tag,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { EASE, useSpotlight } from "../../lib/motion";
import logo from "../../assets/bhsquare-logo-white.png";
import {
  ALL_POSTS,
  BLOG_POSTS,
  CATEGORIES,
  FEATURED_ID,
  PHONE_DISPLAY,
  PHONE_LINK,
  RECOMMENDED_POSTS,
  WHATSAPP_LINK,
  getPostsByCategory,
  searchPosts,
} from "./blogData";

const FEATURED_POST = BLOG_POSTS.find((post) => post.id === FEATURED_ID);
const JOURNAL_PATH = "/blogs";

/* ---------------------------------------------------------------- helpers */

function openPostUrl(post) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.pathname = JOURNAL_PATH;
  url.search = "";
  url.searchParams.set("post", post.slug);
  window.history.replaceState({}, "", url.toString());
}

function closePostUrl() {
  if (typeof window === "undefined") return;
  window.history.replaceState({}, "", JOURNAL_PATH);
}

function Avatar({ initials, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
  };
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#FFD54A] to-[#FF8A00] font-display font-extrabold text-[#0B1220] shadow-[0_6px_18px_-6px_rgba(255,138,0,0.65)] ${sizes[size]}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function CategoryPill({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0B1220]/80 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--gold)] backdrop-blur-md ${className}`}
    >
      <Tag size={10} />
      {children}
    </span>
  );
}

function Meta({ post, className = "" }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-white/45 ${className}`}
    >
      <span className="inline-flex items-center gap-1.5">
        <Calendar size={12} className="text-[#FF8A00]" />
        {post.date}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock size={12} className="text-[var(--gold)]" />
        {post.readTime}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------- nav */

function JournalNav({ onBrowse, onCategory }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1220]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-4 px-5 md:px-10">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="BHsquare home"
        >
          <img src={logo} alt="BHsquare" className="h-10 w-auto" />
          <span className="hidden h-5 w-px bg-white/15 sm:block" />
          <span className="hidden font-display text-[10px] font-semibold uppercase tracking-[0.26em] text-white/45 sm:block">
            The Solar Journal
          </span>
        </Link>

        <nav
          aria-label="Journal sections"
          className="hidden items-center gap-1 lg:flex"
        >
          <button
            onClick={() => onBrowse("All")}
            className="rounded-full px-4 py-2 font-display text-xs font-semibold text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            All stories
          </button>
          <button
            onClick={() => onCategory("Government Subsidy")}
            className="rounded-full px-4 py-2 font-display text-xs font-semibold text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Subsidy
          </button>
          <button
            onClick={() => onCategory("Solar Tech")}
            className="rounded-full px-4 py-2 font-display text-xs font-semibold text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Technology
          </button>
          <button
            onClick={() => onCategory("Savings & ROI")}
            className="rounded-full px-4 py-2 font-display text-xs font-semibold text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Savings
          </button>
          <button
            onClick={() => onCategory("Maintenance")}
            className="rounded-full px-4 py-2 font-display text-xs font-semibold text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            Care
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-3 text-[#7CFFB2] transition-colors hover:bg-[#25D366]/20 sm:px-4"
          >
            <FaWhatsapp size={17} />
            <span className="hidden font-display text-xs font-semibold sm:inline">
              WhatsApp
            </span>
          </a>
          <a
            href="/#contact"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] px-3.5 font-display text-xs font-bold text-[#0B1220] transition-transform hover:scale-[1.03] sm:px-5"
          >
            <Sun size={14} strokeWidth={2.6} className="hidden sm:block" />
            <span>Free site visit</span>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- masthead */

function Masthead() {
  const stats = [
    { value: "₹78,000", label: "max central subsidy" },
    { value: "25 years", label: "panel warranty" },
    { value: "3–4 years", label: "typical payback" },
    { value: "85–95%", label: "bill reduction" },
  ];

  return (
    <section className="relative z-10 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 font-display text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40"
        >
          <span className="inline-flex items-center gap-2 text-[var(--gold)]">
            <BookOpen size={13} /> The BHsquare Journal
          </span>
          <span className="hidden md:block">Practical solar intelligence</span>
          <span>Issue 04 · November 2026</span>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
          >
            <h1 className="font-display text-[clamp(3.4rem,8.2vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.045em] text-white">
              Sunlight,
              <br />
              <span className="text-gradient-sun">engineered.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="lg:pb-2"
          >
            <p className="max-w-md text-base leading-relaxed text-[var(--muted)] md:text-[17px]">
              Field-tested guides on rooftop solar, government subsidies and the
              economics of powering a Gujarat home with the sun. Written by the
              people who design, install and service these systems.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#0B1220] px-4 py-4">
                  <div className="font-display text-lg font-bold tracking-tight text-white md:text-xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ featured post */

function FeaturedStory({ post, onOpen }) {
  return (
    <section className="relative z-10 mt-16 md:mt-20">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="mb-5 flex items-center gap-4">
          <span className="inline-flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
            <Sparkles size={13} /> Editor's pick
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-[#FF8A00]/40 via-white/10 to-transparent" />
          <span className="font-display text-[10px] uppercase tracking-[0.2em] text-white/30">
            Guide 01 / 05
          </span>
        </div>

        <motion.article
          role="button"
          tabIndex={0}
          aria-label={`Read ${post.title}`}
          onClick={() => onOpen(post)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpen(post);
            }
          }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
          whileHover={{ y: -4 }}
          data-testid="blog-featured"
          className="group grid cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-[#0F172A]/80 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] outline-none transition-colors hover:border-[#FF8A00]/35 focus-visible:ring-2 focus-visible:ring-[#FF8A00]/60 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative flex flex-col justify-between gap-10 p-7 md:p-10 lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <CategoryPill>{post.category}</CategoryPill>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/20 bg-[#25D366]/10 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7CFFB2]">
                  Updated for 2026
                </span>
              </div>

              <h2 className="mt-6 max-w-xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white transition-colors group-hover:text-[var(--gold)] sm:text-4xl lg:text-[2.9rem]">
                {post.title}
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-5">
                <div className="flex items-center gap-3">
                  <Avatar initials={post.initials} />
                  <div>
                    <div className="font-display text-xs font-semibold text-white/85">
                      {post.author}
                    </div>
                    <Meta post={post} className="mt-1" />
                  </div>
                </div>

                <span className="inline-flex items-center gap-3 font-display text-xs font-bold text-[var(--gold)]">
                  Read the full guide
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFD54A]/30 bg-[#FF8A00]/10 text-[#FFD54A] transition-all duration-300 group-hover:bg-[#FF8A00] group-hover:text-[#0B1220]">
                    <ArrowUpRight size={16} />
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden sm:min-h-[390px] lg:min-h-[520px]">
            <img
              src={post.image}
              alt={post.imageAlt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.05) 45%, rgba(11,18,32,0.25) 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/2"
              style={{
                background:
                  "linear-gradient(0deg, rgba(11,18,32,0.75) 0%, transparent 100%)",
              }}
            />

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-medium text-white/70 backdrop-blur-md">
              <Clock size={11} className="text-[var(--gold)]" />
              {post.readTime}
            </div>

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#0B1220]/70 p-4 backdrop-blur-xl sm:right-auto sm:min-w-[230px]">
              <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Maximum central subsidy
              </div>
              <div className="mt-1 font-display text-3xl font-extrabold tracking-tight text-white">
                ₹78,000
              </div>
              <div className="mt-1 text-[11px] text-white/50">
                for a 3 kW+ residential system
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- post card */

function PostCard({ post, index, onOpen }) {
  const { onMove, background } = useSpotlight();

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`Read ${post.title}`}
      onClick={() => onOpen(post)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(post);
        }
      }}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.07 }}
      whileHover={{ y: -5 }}
      data-testid={`blog-card-${post.id}`}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A]/65 outline-none transition-colors hover:border-[#FF8A00]/35 focus-visible:ring-2 focus-visible:ring-[#FF8A00]/60"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />

      <div className="relative h-56 overflow-hidden sm:h-60">
        <img
          src={post.image}
          alt={post.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.08) 65%, transparent 100%)",
          }}
        />
        <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3">
          <CategoryPill>{post.category}</CategoryPill>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-medium text-white/65 backdrop-blur-md">
            <Clock size={10} className="text-[var(--gold)]" />
            {post.readTime}
          </span>
        </div>
      </div>

      <div className="relative z-30 flex flex-1 flex-col p-6 md:p-7">
        <Meta post={post} />

        <h3 className="mt-3 font-display text-xl font-bold leading-snug text-white transition-colors group-hover:text-[var(--gold)] md:text-[22px]">
          {post.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar initials={post.initials} size="sm" />
              <div className="min-w-0">
                <div className="truncate font-display text-[11px] font-semibold text-white/80">
                  {post.author}
                </div>
                <div className="truncate text-[10px] text-white/35">
                  {post.authorRole}
                </div>
              </div>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-all duration-300 group-hover:border-[#FF8A00]/40 group-hover:bg-[#FF8A00] group-hover:text-[#0B1220]">
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------ recommendations */

function RecommendedReads({ posts, onOpen }) {
  return (
    <section className="relative z-10 mt-20 md:mt-28">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF8A00]">
              <Sparkles size={13} /> Recommended next
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Keep the momentum going.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
            Three short reads our engineers send to homeowners before the first
            site visit.
          </p>
        </div>

        <div className="mt-9 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025]">
          <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                role="button"
                tabIndex={0}
                aria-label={`Read ${post.title}`}
                onClick={() => onOpen(post)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen(post);
                  }
                }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: index * 0.08,
                }}
                className="group relative cursor-pointer p-6 outline-none transition-colors hover:bg-white/[0.035] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF8A00]/60 md:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[11px] font-bold tracking-[0.22em] text-white/20">
                    0{index + 1}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-white/35">
                    <Clock size={10} />
                    {post.readTime}
                  </span>
                </div>

                <div className="mt-6">
                  <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                    {post.category}
                  </span>
                  <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-[var(--gold)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-[var(--muted)]">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="truncate pr-3 text-[10px] text-white/35">
                    {post.author}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 font-display text-[11px] font-bold text-[#FFD54A]">
                    Read
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ whatsapp cta */

function WhatsAppPanel() {
  return (
    <section className="relative z-10 mt-20 md:mt-28">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <motion.div
          id="journal-whatsapp-panel"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] border border-[#25D366]/20 bg-gradient-to-br from-[#0B2B1D] via-[#0B1D18] to-[#0B1220] p-7 shadow-[0_30px_80px_-50px_rgba(37,211,102,0.35)] md:p-10 lg:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#25D366]/15 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#FFD54A]/10 blur-[110px]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_12px_40px_-10px_rgba(37,211,102,0.8)]">
                <FaWhatsapp size={30} />
              </div>
              <div>
                <span className="inline-flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.24em] text-[#7CFFB2]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                  Ask a solar engineer
                </span>
                <h2 className="mt-3 max-w-xl font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl">
                  A five-minute chat can save you lakhs.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55 sm:text-[15px]">
                  Send us your latest electricity bill on WhatsApp. We will tell
                  you the realistic system size, the subsidy you can claim and
                  the questions worth asking before you sign anything.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:max-w-xs lg:w-[280px]">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                data-testid="blog-whatsapp-cta"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-4 font-display text-sm font-bold text-[#06281A] shadow-[0_15px_40px_-12px_rgba(37,211,102,0.75)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#2BE070]"
              >
                <FaWhatsapp size={20} />
                Chat on WhatsApp
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={PHONE_LINK}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3.5 font-display text-xs font-semibold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <Phone size={14} />
                Call {PHONE_DISPLAY}
              </a>
              <p className="text-center text-[10px] uppercase tracking-[0.16em] text-white/30">
                Mon–Sat · 9 AM–7 PM · Replies in ~15 min
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- floating whatsapp */

function FloatingWhatsApp({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with BHsquare on WhatsApp"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full border border-[#25D366]/25 bg-[#0B1220]/90 p-1.5 text-white shadow-[0_16px_40px_-16px_rgba(37,211,102,0.8)] backdrop-blur-xl transition-colors hover:border-[#25D366]/50 sm:pr-4 md:bottom-7 md:right-7"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-[#06281A]">
            <FaWhatsapp size={20} />
          </span>
          <span className="hidden font-display text-xs font-bold sm:block">
            WhatsApp us
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------- footer */

function JournalFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/10">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="BHsquare" className="h-9 w-auto" />
            <span className="h-5 w-px bg-white/15" />
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Solar installation & services
            </span>
          </Link>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-white/45"
          >
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <a href="/#projects" className="transition-colors hover:text-white">
              Projects
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              WhatsApp
            </a>
            <Link to="/login" className="transition-colors hover:text-white">
              Portal login
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/30 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} BHsquare Solar Installation & Services.
          </span>
          <span className="hidden sm:block">Navsari, Gujarat · India</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white/70"
          >
            Back to top <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------- reader */

function Reader({ post, onClose, onChangePost }) {
  const readerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const postIndex = ALL_POSTS.findIndex((item) => item.id === post.id);
  const upNext = ALL_POSTS[(postIndex + 1) % ALL_POSTS.length];
  const morePosts = [2, 3]
    .map((offset) => ALL_POSTS[(postIndex + offset) % ALL_POSTS.length])
    .filter((item) => item.id !== post.id && item.id !== upNext.id);

  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${JOURNAL_PATH}?post=${post.slug}`
      : "";

  useEffect(() => {
    if (readerRef.current) readerRef.current.scrollTop = 0;
  }, [post.id]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", articleUrl);
    }
  };

  const jumpToSection = (index) => {
    document
      .getElementById(`article-section-${post.id}-${index}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const scrollable = scrollHeight - clientHeight;
    setProgress(scrollable > 0 ? Math.min(100, (scrollTop / scrollable) * 100) : 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      ref={readerRef}
      onScroll={handleScroll}
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-[#0B1220] text-[var(--ink)]"
    >
      <div
        className="fixed left-0 top-0 z-[130] h-[3px] bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1220]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 md:px-8">
          <button
            onClick={onClose}
            aria-label="Back to all stories"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">All stories</span>
          </button>

          <span className="hidden items-center gap-2 font-display text-[9px] font-semibold uppercase tracking-[0.26em] text-white/35 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A00]" />
            The Solar Journal
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              aria-label={copied ? "Link copied" : "Copy article link"}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 text-[11px] font-semibold text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              {copied ? (
                <Check size={13} className="text-[#25D366]" />
              ) : (
                <Copy size={13} />
              )}
              <span className="hidden sm:inline">
                {copied ? "Link copied" : "Copy link"}
              </span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close article"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 md:px-8 md:pt-12">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-[var(--gold)]"
        >
          <ArrowLeft size={12} /> Back to the journal
        </button>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CategoryPill>{post.category}</CategoryPill>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/40">
            <Calendar size={12} className="text-[#FF8A00]" /> {post.date}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/40">
            <Clock size={12} className="text-[var(--gold)]" /> {post.readTime}
          </span>
        </div>

        <h1 className="mt-5 max-w-4xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
          {post.title}
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {post.excerpt}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-4 border-b border-white/10 pb-7">
          <Avatar initials={post.initials} size="lg" />
          <div>
            <div className="font-display text-sm font-bold text-white">
              {post.author}
            </div>
            <div className="text-xs text-white/40">{post.authorRole}</div>
          </div>
          <span className="ml-auto hidden text-[10px] uppercase tracking-[0.18em] text-white/25 sm:block">
            BHsquare Journal · Issue 04
          </span>
        </div>

        <div className="relative mt-7 overflow-hidden rounded-[1.5rem] border border-white/10">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="h-[240px] w-full object-cover sm:h-[360px] lg:h-[420px]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(11,18,32,0.55) 0%, transparent 55%)",
            }}
          />
          <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white/65 backdrop-blur-md">
            {post.imageAlt}
          </span>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-14">
          <div className="min-w-0">
            <p className="text-[18px] leading-[1.85] text-white/80 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-[#FFD54A] sm:text-[19px]">
              {post.intro}
            </p>

            <div className="mt-8 rounded-2xl border border-[#FFD54A]/20 bg-[#FF8A00]/[0.055] p-5 sm:p-6">
              <div className="flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                <Sparkles size={13} /> Key takeaways
              </div>
              <ul className="mt-4 space-y-3">
                {post.takeaways.map((takeaway) => (
                  <li
                    key={takeaway}
                    className="flex items-start gap-3 text-[14px] leading-relaxed text-white/70"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#FFD54A]"
                    />
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/[0.05] p-4 lg:hidden"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <FaWhatsapp size={17} />
                </span>
                <div>
                  <div className="font-display text-xs font-bold text-white">
                    Have a question about this guide?
                  </div>
                  <div className="text-[10px] text-white/45">
                    Ask a BHsquare engineer on WhatsApp.
                  </div>
                </div>
              </div>
              <ArrowUpRight size={16} className="shrink-0 text-[#7CFFB2]" />
            </a>

            {post.sections.map((section, index) => (
              <section
                key={section.heading}
                id={`article-section-${post.id}-${index}`}
                className="scroll-mt-28"
              >
                <div className="mt-10 flex items-start gap-3">
                  <span className="mt-1.5 font-display text-[10px] font-bold tracking-[0.16em] text-[#FF8A00]">
                    0{index + 1}
                  </span>
                  <h2 className="font-display text-2xl font-bold leading-tight text-white">
                    {section.heading}
                  </h2>
                </div>

                <div className="mt-4 space-y-4 text-[16.5px] leading-[1.85] text-white/65 sm:text-[17px]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {section.bullets && (
                  <ul className="mt-5 space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF8A00]" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {index === 1 && post.quote && (
                  <blockquote className="mt-8 border-l-2 border-[#FF8A00] pl-5">
                    <p className="font-display text-xl font-semibold leading-snug text-white/85 italic">
                      “{post.quote.text}”
                    </p>
                    <footer className="mt-2 text-[11px] uppercase tracking-[0.16em] text-white/35">
                      {post.quote.by}
                    </footer>
                  </blockquote>
                )}
              </section>
            ))}

            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium text-white/45"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar initials={post.initials} />
                <div>
                  <div className="font-display text-xs font-bold text-white">
                    {post.author}
                  </div>
                  <div className="text-[11px] text-white/40">
                    {post.authorRole}
                  </div>
                </div>
              </div>
              <button
                onClick={copyLink}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 font-display text-[11px] font-semibold text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                {copied ? (
                  <Check size={13} className="text-[#25D366]" />
                ) : (
                  <Copy size={13} />
                )}
                {copied ? "Link copied" : "Share this guide"}
              </button>
            </div>

            <div className="mt-14">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF8A00]">
                  <Sparkles size={12} /> Up next
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-[#FF8A00]/35 to-transparent" />
              </div>

              <article
                role="button"
                tabIndex={0}
                aria-label={`Read next: ${upNext.title}`}
                onClick={() => onChangePost(upNext)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChangePost(upNext);
                  }
                }}
                className="group mt-5 grid cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A] transition-colors hover:border-[#FF8A00]/40 sm:grid-cols-[210px_1fr]"
              >
                <div className="relative h-44 overflow-hidden sm:h-full sm:min-h-[190px]">
                  <img
                    src={upNext.image}
                    alt={upNext.imageAlt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F172A]/50" />
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-[0.16em]">
                    <span className="font-semibold text-[var(--gold)]">
                      {upNext.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-white/35">{upNext.readTime}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold leading-snug text-white transition-colors group-hover:text-[var(--gold)]">
                    {upNext.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/45">
                    {upNext.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 font-display text-[11px] font-bold text-[#FFD54A]">
                    Continue reading
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </article>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {morePosts.map((nextPost) => (
                  <article
                    key={nextPost.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Read ${nextPost.title}`}
                    onClick={() => onChangePost(nextPost)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onChangePost(nextPost);
                      }
                    }}
                    className="group cursor-pointer rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.045]"
                  >
                    <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.14em]">
                      <span className="truncate font-semibold text-white/35">
                        {nextPost.category}
                      </span>
                      <span className="shrink-0 text-white/25">
                        {nextPost.readTime}
                      </span>
                    </div>
                    <h4 className="mt-2 font-display text-sm font-bold leading-snug text-white/85 transition-colors group-hover:text-[var(--gold)]">
                      {nextPost.title}
                    </h4>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-display text-[10px] font-semibold text-white/40 transition-colors group-hover:text-[#FFD54A]">
                      Read story <ArrowUpRight size={12} />
                    </span>
                  </article>
                ))}
              </div>

              <div className="mt-10 flex justify-center border-t border-white/10 pt-8">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 font-display text-xs font-semibold text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <ArrowLeft size={14} /> Back to all stories
                </button>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-2 font-display text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                  <BookOpen size={12} /> In this guide
                </div>
                <nav className="mt-4 space-y-3">
                  {post.sections.map((section, index) => (
                    <button
                      key={section.heading}
                      onClick={() => jumpToSection(index)}
                      className="group flex w-full items-start gap-2.5 text-left text-[11px] leading-relaxed text-white/45 transition-colors hover:text-white"
                    >
                      <span className="mt-0.5 font-display text-[9px] font-bold text-[#FF8A00]/60 group-hover:text-[#FF8A00]">
                        0{index + 1}
                      </span>
                      {section.heading}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="rounded-2xl border border-[#25D366]/20 bg-[#25D366]/[0.045] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <FaWhatsapp size={18} />
                </div>
                <div className="mt-3 font-display text-sm font-bold text-white">
                  Talk to a solar engineer
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
                  Send your latest electricity bill for a quick, honest savings
                  check.
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-display text-[10px] font-bold text-[#7CFFB2] transition-colors hover:text-white"
                >
                  Chat on WhatsApp <ArrowUpRight size={12} />
                </a>
              </div>

              <button
                onClick={copyLink}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 text-left transition-colors hover:bg-white/[0.05]"
              >
                <span className="inline-flex items-center gap-2 font-display text-[10px] font-semibold text-white/45">
                  {copied ? (
                    <Check size={13} className="text-[#25D366]" />
                  ) : (
                    <Copy size={13} />
                  )}
                  {copied ? "Link copied" : "Share this guide"}
                </span>
                <ArrowUpRight size={13} className="text-white/25" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------- page */

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [activePost, setActivePost] = useState(() => {
    if (typeof window === "undefined") return null;
    const slug = new URLSearchParams(window.location.search).get("post");
    if (!slug) return null;
    return ALL_POSTS.find((post) => post.slug === slug) ?? null;
  });
  const [showFloatingWa, setShowFloatingWa] = useState(false);
  const archiveRef = useRef(null);

  useEffect(() => {
    if (!activePost) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActivePost(null);
        closePostUrl();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePost]);

  useEffect(() => {
    const panel = document.getElementById("journal-whatsapp-panel");
    let panelVisible = false;
    let hasScrolled = false;

    const sync = () => setShowFloatingWa(hasScrolled && !panelVisible);
    const handleScroll = () => {
      hasScrolled = window.scrollY > 560;
      sync();
    };

    const observer = panel
      ? new IntersectionObserver(
          ([entry]) => {
            panelVisible = entry.isIntersecting;
            sync();
          },
          { threshold: 0.12 },
        )
      : null;

    observer?.observe(panel);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const categoryPosts = getPostsByCategory(BLOG_POSTS, selectedCategory);
    const matchedPosts = searchPosts(categoryPosts, query);
    if (selectedCategory === "All" && !query.trim()) {
      return matchedPosts.filter((post) => post.id !== FEATURED_ID);
    }
    return matchedPosts;
  }, [selectedCategory, query]);

  const showFeatured = selectedCategory === "All" && !query.trim();

  const openPost = (post) => {
    openPostUrl(post);
    setActivePost(post);
  };

  const changePost = (post) => {
    openPostUrl(post);
    setActivePost(post);
  };

  const closePost = () => {
    setActivePost(null);
    closePostUrl();
  };

  const browseJournal = (category = "All") => {
    setSelectedCategory(category);
    setQuery("");
    window.requestAnimationFrame(() => {
      archiveRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setQuery("");
  };

  return (
    <div className="website-theme relative min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--ink)]">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -top-56 left-[6%] h-[520px] w-[520px] rounded-full bg-[#FF8A00]/10 blur-[140px]" />
        <div className="absolute right-[-12%] top-[24%] h-[440px] w-[440px] rounded-full bg-[#FFD54A]/[0.055] blur-[130px]" />
        <div className="absolute bottom-[8%] left-[-10%] h-[420px] w-[420px] rounded-full bg-[#3B82F6]/[0.05] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "76px 76px",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 70%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <JournalNav onBrowse={browseJournal} onCategory={browseJournal} />

        <main>
          <Masthead />

          {showFeatured && FEATURED_POST && (
            <FeaturedStory post={FEATURED_POST} onOpen={openPost} />
          )}

          <section
            ref={archiveRef}
            className="relative z-10 mt-16 scroll-mt-24 md:mt-24"
          >
            <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <span className="inline-flex items-center gap-2 font-display text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">
                    <BookOpen size={13} /> The archive
                  </span>
                  <h2 className="mt-3 max-w-xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Field notes, not fluff.
                  </h2>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
                    Search the guides or filter by the question you are trying
                    to answer.
                  </p>
                </div>

                <div className="relative w-full lg:w-[320px]">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search guides, topics, authors…"
                    aria-label="Search the journal"
                    className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-11 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:bg-white/[0.06]"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  {CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        aria-pressed={isActive}
                        className={`rounded-full px-4 py-2 font-display text-[11px] font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] text-[#0B1220] shadow-lg shadow-[#FF8A00]/20"
                            : "border border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                  {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "story" : "stories"}
                </span>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {filteredPosts.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={index}
                      onOpen={openPost}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
                  <BookOpen size={30} className="text-white/20" />
                  <h3 className="mt-4 font-display text-xl font-bold text-white">
                    No stories match that search.
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
                    Try a broader topic, or clear the filters to browse every
                    guide in the journal.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFD54A] px-5 py-2.5 font-display text-xs font-bold text-[#0B1220] transition-transform hover:scale-[1.03]"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </section>

          <RecommendedReads posts={RECOMMENDED_POSTS} onOpen={openPost} />

          <WhatsAppPanel />
        </main>

        <JournalFooter />
      </div>

      <FloatingWhatsApp visible={showFloatingWa} />

      <AnimatePresence>
        {activePost && (
          <Reader
            key="journal-reader"
            post={activePost}
            onClose={closePost}
            onChangePost={changePost}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
