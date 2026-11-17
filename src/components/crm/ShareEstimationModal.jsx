import React, { useState } from "react";
import { X, Zap } from "lucide-react";
import EstimationPanel from "./EstimationPanel";

const ShareEstimationModal = ({ open, lead, whatsappNumber, onClose }) => {
  const [estimationResult, setEstimationResult] = useState(null);

  if (!open) return null;

  // Pre-fill the panel with lead data
  const initialData = {
    leadId: lead?.id,
    panel_qty: lead?.number_of_panels || 0,
    panel_wattage: lead?.panel_wattage || 0,
    inverter_wattage: lead?.inverter_kw || 0,
    customer_name: lead?.customer_name || "",
    customer_address: lead?.address || "",
    customer_mobile: whatsappNumber ? `+${whatsappNumber}` : "+91 ",
    customer_type: lead?.installation_type || "Residential",
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl my-4 rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        {/* Header */}
        <div className="bg-[#1a5695] text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">
                Estimation · {lead?.customer_name}
              </h2>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                Configure & share via WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* The Reusable Panel */}
        <div className="overflow-y-auto custom-scrollbar flex-1 p-5 space-y-5">
          <EstimationPanel
            initialData={initialData}
            onResultChange={setEstimationResult}
            showDownload
            // removed downloadButtonOnly so the WhatsApp button shows up!
          />
        </div>
      </div>
    </div>
  );
};

export default ShareEstimationModal;
