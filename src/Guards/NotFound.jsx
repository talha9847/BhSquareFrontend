import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchX, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    // Changed: Removed Sidebar/Navbar wrappers and used flex-col justify-center for full screen
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <main className="w-full max-w-2xl">
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-12 text-center relative overflow-hidden">
          {/* Background Accent */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-50 rounded-full opacity-50 blur-3xl"></div>

          {/* 404 Large Text */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[120px] font-black text-slate-100 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[#1a5695] animate-bounce">
                <SearchX size={48} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3 mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Endpoint Not Found
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
              The coordinates you entered do not match any known module in the
              system.
            </p>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
            >
              <ArrowLeft size={16} /> Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-[#1a5695] text-white text-[10px] font-black uppercase rounded-2xl hover:bg-[#15467a] shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <Home size={16} /> Dashboard
            </button>
          </div>

          {/* Bottom System Label */}
          <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
            <div className="w-8 h-[1px] bg-slate-400"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
              System Error Protocol 404
            </span>
            <div className="w-8 h-[1px] bg-slate-400"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
