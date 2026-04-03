import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Loader2, Lock } from "lucide-react";

const AccessControl = ({ type = "denied" }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      navigate("/login");
    }

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  const isNoAuth = type === "login";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden p-10 text-center relative">
        {/* Background Decorative Icon */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Lock size={120} />
        </div>

        {/* Status Icon */}
        <div
          className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center animate-bounce ${
            isNoAuth ? "bg-blue-50 text-[#1a5695]" : "bg-rose-50 text-rose-500"
          }`}
        >
          <ShieldAlert size={40} />
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
          {isNoAuth ? "Authentication Required" : "Access Restricted"}
        </h1>

        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
          {isNoAuth
            ? "You need to be logged in to view this high-security sector."
            : "Your current clearance level does not permit access to this module."}
        </p>

        {/* Countdown Indicator */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100 flex items-center justify-center gap-3">
          <Loader2 className="animate-spin text-slate-300" size={18} />
          <span className="text-[10px] font-black uppercase text-slate-500">
            Redirecting in <span className="text-[#1a5695]">{countdown}s</span>
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#1a5695] text-white text-[11px] font-black uppercase rounded-2xl hover:bg-[#15467a] shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </button>

        <div className="mt-6">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
            System Security v3.0.4 • Automated Protocol
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;
