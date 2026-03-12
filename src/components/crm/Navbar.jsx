import React from "react";
import { Search, Bell, Plus, Download, Sun, Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-600"
        >
          <Menu size={20} />
        </button>

        <div className="hidden md:flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 w-64 text-slate-400 focus-within:border-[#1a5695] focus-within:bg-white transition-all">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search leads..."
            className="bg-transparent border-none text-sm focus:outline-none text-slate-800 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5">
          <Sun size={14} className="text-amber-500 animate-spin-slow" />
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-tight">
            Excellent Solar Day
          </span>
        </div>

        <button className="relative p-2 text-slate-500 hover:text-[#1a5695] transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#f39200] rounded-full border-2 border-white" />
        </button>

        <button className="hidden sm:flex items-center gap-2 bg-[#1a5695] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#0f3d6e] transition-all">
          <Plus size={16} />
          <span>New Lead</span>
        </button>
      </div>
    </header>
  );
};
export default Navbar;
