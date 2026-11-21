// WiringTabs.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ListChecks, Camera } from "lucide-react";

const TWiringTabs = ({ selectedWiring, activeTab }) => {
  const navigate = useNavigate();

  const goTo = (tab) => {
    if (tab === activeTab || !selectedWiring) return;

    if (tab === "log") {
      navigate("/technician/updatewiring", {
        state: {
          wiring_id: selectedWiring.wiring_id,
          customer_id: selectedWiring.customer_id,
          selectedWiring,
        },
      });
    } else if (tab === "photos") {
      navigate("/technician/finalizewiring", {
        state: { selectedWiring },
      });
    }
  };

  const tabs = [
    {
      key: "log",
      label: "Wire & Material Log",
      shortLabel: "Log",
      icon: ListChecks,
    },
    {
      key: "photos",
      label: "Photos & Documents",
      shortLabel: "Photos",
      icon: Camera,
    },
  ];

  return (
    <div className="w-full sm:w-auto bg-white rounded-2xl border border-slate-200 p-1.5 flex sm:inline-flex gap-1 shadow-sm">
      {tabs.map(({ key, label, shortLabel, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => goTo(key)}
            className={`flex-1 sm:flex-none min-w-0 flex items-center justify-center gap-2 px-3 sm:px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              isActive
                ? "bg-[#1a5695] text-white shadow-md shadow-blue-900/20"
                : "text-slate-400 hover:text-[#1a5695] hover:bg-slate-50"
            }`}
          >
            <Icon size={14} className="shrink-0" />

            {/* Full label on sm+, short label on mobile */}
            <span className="hidden sm:inline truncate">{label}</span>
            <span className="sm:hidden truncate">{shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TWiringTabs;
