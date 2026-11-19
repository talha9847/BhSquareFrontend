import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import EstimationPanel from "./EstimationPanel";

const EstimationGenerator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="crm-shell min-h-screen bg-slate-50 flex">
      <div className="no-print">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activePage="Estimator"
        />
      </div>

      <div className="crm-workspace flex-1 lg:ml-64 flex flex-col min-w-0">
        <div className="print:hidden">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <main className="crm-main p-4 lg:p-8 space-y-6 text-slate-800 print:p-0 print:m-0">
          <div className="flex justify-end print:hidden">
            <button
              onClick={() => navigate("/estimationmanage")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a5695] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#144477] transition-all"
            >
              Manage Data
            </button>
          </div>

          {/* This renders your entire form, A4 template, and share buttons */}
          <EstimationPanel showDownload />
        </main>
      </div>
    </div>
  );
};

export default EstimationGenerator;
