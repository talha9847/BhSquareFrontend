import React from "react";
import { Wrench, Home, ArrowLeft, RefreshCw } from "lucide-react";

const Maintenance = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <main className="w-full max-w-2xl">
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-12 text-center relative overflow-hidden">
          {/* Background Accents */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full opacity-60 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-50 rounded-full opacity-70 blur-3xl"></div>

          {/* Maintenance Icon */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[100px] font-black text-slate-100 leading-none select-none">
              503
            </h1>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[#1a5695]">
                <Wrench size={46} strokeWidth={2.5} className="animate-pulse" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-3 mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              System Under Maintenance
            </h2>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-md mx-auto">
              We're currently performing scheduled maintenance and system
              improvements. Please check back shortly.
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-[#1a5695] text-white text-[10px] font-black uppercase rounded-2xl hover:bg-[#15467a] shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>

          {/* Home */}
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-50 transition-all active:scale-95 mx-auto"
          >
            <Home size={16} />
            Return Home
          </button>

          {/* System Label */}
          <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
            <div className="w-8 h-[1px] bg-slate-400"></div>

            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
              System Maintenance Protocol 503
            </span>

            <div className="w-8 h-[1px] bg-slate-400"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Maintenance;
