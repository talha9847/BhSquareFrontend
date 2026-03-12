import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Zap,
  BarChart2,
  Leaf,
} from "lucide-react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);

    try {
      const result = await axios.post(`${apiUrl}/api/users/login`, {
        email: form.email,
        pass: form.password,
      });

      if (result.status == 200) {
        console.log(result.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F2D6B] relative overflow-hidden flex-col items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #F5C518 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#1a5695]/40 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-[#F5C518]/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-sm">
          <div className="grid grid-cols-4 gap-3 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl border border-[#F5C518]/30"
                style={{
                  background:
                    "linear-gradient(135deg, #1a5695 0%, #0F2D6B 50%, #1a5695 100%)",
                }}
              >
                <div className="w-full h-full rounded-xl grid grid-cols-2 gap-1 p-1 opacity-40">
                  {[0, 1, 2, 3].map((j) => (
                    <div key={j} className="bg-[#F5C518]/30 rounded-sm" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-blue-200 text-sm font-body">System Overview</p>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "28.4", u: "kWh", l: "Generated", Icon: Zap },
                { v: "94%", u: "", l: "Efficiency", Icon: BarChart2 },
                { v: "₹420", u: "", l: "Saved Today", Icon: Leaf },
              ].map(({ v, u, l, Icon }) => (
                <div key={l} className="text-center">
                  <Icon size={14} className="text-[#F5C518] mx-auto mb-1" />
                  <p className="font-display text-xl font-bold text-white">
                    {v}
                    <span className="text-xs text-blue-300">{u}</span>
                  </p>
                  <p className="text-blue-300 text-xs font-body">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center mt-8">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            BHSquare CRM Portal
          </h2>
          <p className="text-blue-200 font-body">
            Manage installations, customers, and projects from one place.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#1a5695] font-body transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Back to website
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#0F2D6B] flex items-center justify-center">
              <Sun size={22} className="text-[#F5C518]" fill="#F5C518" />
            </div>
            <div>
              <p className="font-display font-bold text-xl text-[#0F2D6B]">
                BH<span className="text-[#1a5695]">Square</span>
              </p>
              <p className="text-xs text-gray-400 -mt-0.5 font-body">
                CRM Portal
              </p>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 font-body mb-8">
            Sign in to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 font-body mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@bhsquare.in"
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl font-body text-sm outline-none transition-all ${
                    errors.email
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-body">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700 font-body">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-[#1a5695] hover:underline font-body"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3.5 border rounded-xl font-body text-sm outline-none transition-all ${
                    errors.password
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                      : "border-gray-200 focus:border-[#1a5695] focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-body">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-gray-300 accent-[#1a5695]"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 font-body"
              >
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1a5695] text-white font-bold font-body rounded-xl hover:bg-[#1e40af] transition-all duration-200 shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In to CRM"
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs font-body mt-8">
            For access requests, contact{" "}
            <a
              href="mailto:admin@bhsquare.in"
              className="text-[#1a5695] hover:underline"
            >
              admin@bhsquare.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
