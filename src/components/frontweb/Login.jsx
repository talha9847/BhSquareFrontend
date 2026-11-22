import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Users,
  Wrench,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import logoLight from "../../assets/bhsquare-logo-white.png";

const SUPPORT_EMAIL = "admin@bhsquare.in";
const FORGOT_PASSWORD_HREF = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "BHSquare CRM password reset request",
)}`;

const ROLE_HOME = {
  admin: "/dashboard",
  technician: "/technician/wiring",
  fabricator: "/fabricator/fabrication",
  source: "/source/leads",
  supervisor: "/supervisor/commission",
  site_supervisor: "/site-supervisor/kitready",
};

const FEATURES = [
  {
    icon: <Users size={19} aria-hidden="true" />,
    title: "One customer pipeline",
    description:
      "Leads, follow-ups, documents, and handovers in a single timeline.",
  },
  {
    icon: <Wrench size={19} aria-hidden="true" />,
    title: "Every project on track",
    description:
      "Fabrication, wiring, dispatch, and installation status in real time.",
  },
  {
    icon: <BarChart3 size={19} aria-hidden="true" />,
    title: "Clear accountability",
    description:
      "Role-based access, commissions, and reports without spreadsheets.",
  },
];

const ROLES = ["Admin", "Source", "Supervisor", "Fabricator", "Technician"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = ({ email, password }) => {
  const nextErrors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    nextErrors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    nextErrors.password = "Password is required.";
  }

  return nextErrors;
};

const getLoginErrorMessage = (error) => {
  const response = error?.response;
  const data = response?.data;
  const serverMessage =
    typeof data?.message === "string"
      ? data.message
      : typeof data?.error === "string"
        ? data.error
        : "";

  if (serverMessage) return serverMessage;

  if (response?.status === 401 || response?.status === 403) {
    return "Incorrect email or password. Please try again.";
  }
  if (response?.status === 429) {
    return "Too many sign-in attempts. Please wait a moment and try again.";
  }
  if (response?.status >= 500) {
    return "The server is unavailable right now. Please try again shortly.";
  }
  if (response) {
    return "We couldn't sign you in. Please try again.";
  }

  return "Can't reach the server. Check your connection and try again.";
};

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If an authenticated user opens /login directly, send them to their landing page.
  useEffect(() => {
    const destination = user?.role && ROLE_HOME[user.role];
    if (destination) navigate(destination, { replace: true });
  }, [user, navigate]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;

    setForm((current) => ({ ...current, [field]: value }));
    setSubmitError("");
    setErrors((current) => {
      if (!current[field]) return current;

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitError("");
    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await axios.post(
        "/api/users/login",
        {
          email: form.email.trim(),
          pass: form.password,
        },
        { withCredentials: true },
      );

      const account = data?.data;

      if (!account?.role) {
        setSubmitError(
          "We couldn't complete your sign-in. Please try again or contact your administrator.",
        );
        return;
      }

      const destination = ROLE_HOME[account.role];

      if (!destination) {
        setSubmitError(
          "This account doesn't have access to the CRM portal. Please contact your administrator.",
        );
        return;
      }

      login(account);
      navigate(destination, { replace: true });
    } catch (error) {
      setSubmitError(getLoginErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClasses = (hasError) =>
    `h-[50px] w-full rounded-xl border bg-white/[0.035] pl-11 pr-4 text-base font-medium text-white caret-[#F5C518] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-slate-500/80 focus:bg-white/[0.055] focus:ring-4 sm:text-sm ${
      hasError
        ? "border-red-400/40 bg-red-500/[0.06] focus:border-red-400/70 focus:ring-red-400/10"
        : "border-white/10 hover:border-white/[0.16] focus:border-[#F5C518]/45 focus:ring-[#F5C518]/10"
    }`;

  return (
    <div className="login-page relative min-h-dvh overflow-hidden bg-[#050b16] text-white">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 0%, rgba(18, 58, 112, 0.85) 0%, transparent 38%), radial-gradient(circle at 92% 18%, rgba(14, 42, 80, 0.7) 0%, transparent 42%), radial-gradient(ellipse at 44% 106%, rgba(245, 158, 11, 0.15) 0%, transparent 56%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148, 163, 184, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.055) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at 42% 30%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 42% 30%, black 0%, transparent 70%)",
          }}
        />

        <div className="animate-float absolute -left-36 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#1a5695]/20 blur-[130px]" />
        <div className="absolute right-[-12%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#123a70]/25 blur-[140px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F5C518]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-10 h-px bg-gradient-to-r from-transparent via-[#F5C518]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050b16] via-[#050b16]/55 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1480px]">
        {/* Brand panel */}
        <aside className="login-brand hidden w-[55%] flex-col px-10 py-10 lg:flex xl:px-16 xl:py-12">
          <header className="animate-rise flex items-center gap-4">
            <img
              src={logoLight}
              alt="BHSquare — Solar Installation & Services"
              className="h-12 w-auto"
            />
            <span className="h-6 w-px bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
              CRM Portal
            </span>
          </header>

          <div className="login-hero my-auto max-w-[31rem] py-12">
            <div
              className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-1.5 pl-2 pr-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              style={{ animationDelay: "60ms" }}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5C518]/10">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F5C518] shadow-[0_0_10px_rgba(245,197,24,0.9)]" />
              </span>
              BHSquare CRM
            </div>

            <h2
              className="login-headline animate-rise mt-7 max-w-[29rem] text-balance font-display text-[2.9rem] font-bold leading-[1.04] tracking-[-0.03em] text-white xl:text-[3.4rem]"
              style={{ animationDelay: "100ms" }}
            >
              Every project, every team,
              <span className="block bg-gradient-to-r from-[#F5C518] via-[#FFE58A] to-[#EAB308] bg-clip-text text-transparent">
                one portal.
              </span>
            </h2>

            <p
              className="animate-rise mt-5 max-w-[27rem] text-[15px] leading-[1.7] text-slate-400"
              style={{ animationDelay: "140ms" }}
            >
              From the first enquiry to final commissioning, give every team one
              reliable source of truth.
            </p>

            <ul
              className="login-features animate-rise mt-10 max-w-[31rem] divide-y divide-white/[0.055] border-y border-white/[0.055]"
              style={{ animationDelay: "180ms" }}
            >
              {FEATURES.map(({ icon, title, description }, index) => (
                <li
                  key={title}
                  className="group flex items-start gap-4 py-[18px]"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F5C518]/15 bg-gradient-to-br from-[#F5C518]/[0.14] via-[#F5C518]/[0.04] to-transparent text-[#F5C518] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors duration-300 group-hover:border-[#F5C518]/30 group-hover:text-[#FFE58A]">
                    {icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-[13.5px] font-semibold tracking-[-0.01em] text-white">
                        {title}
                      </p>
                      <span
                        aria-hidden="true"
                        className="font-mono text-[10px] tracking-[0.18em] text-white/20"
                      >
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-400">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <footer
            className="login-roles animate-rise border-t border-white/[0.055] pt-6"
            style={{ animationDelay: "220ms" }}
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <span className="text-[9.5px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Built for
              </span>
              <ul className="flex flex-wrap gap-1.5">
                {ROLES.map((role) => (
                  <li
                    key={role}
                    className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors duration-200 hover:border-[#F5C518]/25 hover:text-white"
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          </footer>
        </aside>

        {/* Sign-in panel */}
        <main className="login-main relative flex w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[45%] lg:bg-[#06101f]/40 lg:px-12 lg:py-12 xl:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 hidden h-28 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#F5C518]/45 to-transparent lg:block"
          />

          <div className="w-full max-w-[27.5rem]">
            <Link
              to="/"
              className="login-back group mb-7 inline-flex items-center gap-2.5 rounded-md text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]/40"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-slate-400 transition-all duration-200 group-hover:border-[#F5C518]/30 group-hover:text-[#F5C518]">
                <ArrowLeft
                  size={13}
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:-translate-x-px"
                />
              </span>
              Back to website
            </Link>

            <div className="animate-rise">
              <div className="login-card relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-gradient-to-b from-[#0b1a32]/95 via-[#0a172e]/90 to-[#081326]/95 p-6 shadow-[0_40px_100px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl sm:p-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#F5C518]/50 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[#F5C518]/[0.07] blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-[#1a5695]/[0.12] blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-4 h-3.5 w-3.5 rounded-tl-[3px] border-l border-t border-[#F5C518]/25"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 right-4 h-3.5 w-3.5 rounded-br-[3px] border-b border-r border-[#F5C518]/25"
                />

                <div className="relative">
                  <div className="mb-6 flex items-center justify-between border-b border-white/[0.06] pb-5 lg:hidden">
                    <img
                      src={logoLight}
                      alt="BHSquare — Solar Installation & Services"
                      className="h-9 w-auto"
                    />
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      CRM Portal
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-[#F5C518]/20 bg-[#F5C518]/[0.06] px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#F5C518]">
                    <ShieldCheck
                      size={12}
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    Secure sign-in
                  </div>

                  <h1 className="mt-5 font-display text-[2.1rem] font-bold leading-[1.1] tracking-[-0.025em] text-white sm:text-[2.3rem]">
                    Welcome back.
                  </h1>
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-400">
                    Sign in with your BHSquare work account to continue.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="login-form mt-8 flex flex-col gap-[18px]"
                  >
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="login-email"
                        className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
                      >
                        Email address
                      </label>
                      <div className="group relative">
                        <Mail
                          size={16}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-[#F5C518]"
                        />
                        <input
                          id="login-email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          autoCapitalize="none"
                          spellCheck={false}
                          required
                          value={form.email}
                          onChange={handleChange("email")}
                          placeholder="you@bhsquare.in"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={
                            errors.email ? "login-email-error" : undefined
                          }
                          className={fieldClasses(Boolean(errors.email))}
                        />
                      </div>
                      {errors.email && (
                        <p
                          id="login-email-error"
                          className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-red-300"
                        >
                          <AlertCircle
                            size={12}
                            aria-hidden="true"
                            className="shrink-0"
                          />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <label
                          htmlFor="login-password"
                          className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400"
                        >
                          Password
                        </label>
                        <a
                          href={FORGOT_PASSWORD_HREF}
                          className="rounded-sm text-[10.5px] font-semibold text-[#F5C518]/80 underline decoration-[#F5C518]/25 underline-offset-4 transition-colors hover:text-[#F5C518] hover:decoration-[#F5C518]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]/40"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="group relative">
                        <Lock
                          size={16}
                          aria-hidden="true"
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-[#F5C518]"
                        />
                        <input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={form.password}
                          onChange={handleChange("password")}
                          placeholder="Enter your password"
                          aria-invalid={Boolean(errors.password)}
                          aria-describedby={
                            errors.password ? "login-password-error" : undefined
                          }
                          className={`${fieldClasses(
                            Boolean(errors.password),
                          )} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((visible) => !visible)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          aria-pressed={showPassword}
                          title={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]/40"
                        >
                          {showPassword ? (
                            <EyeOff size={16} aria-hidden="true" />
                          ) : (
                            <Eye size={16} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p
                          id="login-password-error"
                          className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-red-300"
                        >
                          <AlertCircle
                            size={12}
                            aria-hidden="true"
                            className="shrink-0"
                          />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/[0.07] px-3.5 py-3 text-[12.5px] leading-relaxed text-red-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                      >
                        <AlertCircle
                          size={16}
                          aria-hidden="true"
                          className="mt-px shrink-0 text-red-300"
                        />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      aria-busy={submitting}
                      className="group relative mt-1.5 flex h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#E9B90E] via-[#F5C518] to-[#E9B90E] px-4 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#071226] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_40px_-18px_rgba(245,197,24,0.6)] transition-all duration-300 hover:brightness-[1.04] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_22px_50px_-16px_rgba(245,197,24,0.75)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081326] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
                      />
                      <span className="relative flex items-center gap-2.5">
                        {submitting ? (
                          <>
                            <Loader2
                              size={17}
                              aria-hidden="true"
                              className="animate-spin"
                            />
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign in to CRM
                            <ArrowRight
                              size={15}
                              aria-hidden="true"
                              className="transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="login-support mt-7 border-t border-white/[0.06] pt-5">
                    <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[11px] text-slate-400">
                      <Lock
                        size={11}
                        aria-hidden="true"
                        className="text-slate-500"
                      />
                      <span>Need access?</span>
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="font-semibold text-[#F5C518] underline-offset-4 transition-colors hover:text-[#FFE58A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]/40"
                      >
                        {SUPPORT_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="login-legal mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[10px] font-medium tracking-[0.04em] text-slate-500">
              <span>© {new Date().getFullYear()} BHSquare</span>
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-slate-700"
              />
              <span>Internal use only</span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
