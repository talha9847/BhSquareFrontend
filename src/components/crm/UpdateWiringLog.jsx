import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  MinusCircle,
  Plus,
  Zap,
  Box,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const UpdateWiringLog = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- DUMMY DATA ---
  const [inventory] = useState([
    { id: 1, brand: "Finolex", wire_type: "DC Wire (Red)", current_qty: 450 },
    { id: 2, brand: "Finolex", wire_type: "DC Wire (Black)", current_qty: 380 },
    { id: 3, brand: "Polycab", wire_type: "AC Wire", current_qty: 210 },
  ]);

  const [technicians] = useState([
    { id: 101, name: "Rahul Sharma", role: "Senior Electrician" },
    { id: 102, name: "Amit Patel", role: "Technician" },
    { id: 103, name: "Suresh Kumar", role: "Junior Helper" },
  ]);

  // --- STATE ---
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selections, setSelections] = useState([
    { inventory_id: "", length: "" },
  ]);

  const addLineItem = () =>
    setSelections([...selections, { inventory_id: "", length: "" }]);

  const removeLineItem = (index) => {
    if (selections.length > 1) {
      setSelections(selections.filter((_, i) => i !== index));
    }
  };

  const handleFinalize = (e) => {
    e.preventDefault();
    if (!selectedTechnician) return toast.error("Please select a technician");

    const isValid = selections.every((s) => s.inventory_id && s.length > 0);
    if (!isValid) return toast.error("Please fill all wire details");

    setLoading(true);
    setTimeout(() => {
      toast.success("Wiring Log Updated Successfully");
      setLoading(false);
      navigate("/wiring");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Wiring"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 mb-6 font-black uppercase text-[10px] tracking-widest hover:text-[#1a5695] transition-all"
          >
            <ArrowLeft size={14} /> Back to Customer List
          </button>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Form Details */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-[#1a5695] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase text-slate-800 leading-none">
                      Issue Material
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                      Job ID: {id || "NEW"}
                    </p>
                  </div>
                </div>

                {/* Dynamic Wire Rows */}
                <div className="space-y-4">
                  {selections.map((sel, idx) => {
                    const selectedItem = inventory.find(
                      (i) => i.id === Number(sel.inventory_id),
                    );
                    const isOverLimit =
                      selectedItem &&
                      Number(sel.length) > selectedItem.current_qty;

                    return (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-end transition-all"
                      >
                        <div className="flex-1 w-full">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-2 mb-1 block tracking-widest">
                            Wire Specification
                          </label>
                          <select
                            className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:border-[#1a5695] shadow-sm"
                            value={sel.inventory_id}
                            onChange={(e) => {
                              const newSels = [...selections];
                              newSels[idx].inventory_id = e.target.value;
                              setSelections(newSels);
                            }}
                          >
                            <option value="">Choose from stock...</option>
                            {inventory.map((wire) => (
                              <option key={wire.id} value={wire.id}>
                                {wire.brand} {wire.wire_type} (
                                {wire.current_qty}m avail)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-full sm:w-32">
                          <label className="text-[9px] font-black uppercase text-slate-400 ml-2 mb-1 block tracking-widest">
                            Length
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              className={`w-full p-4 bg-white border rounded-2xl font-black text-sm outline-none transition-all ${isOverLimit ? "border-rose-500 text-rose-500 ring-4 ring-rose-500/10" : "border-slate-200 focus:border-[#1a5695]"}`}
                              placeholder="0"
                              value={sel.length}
                              onChange={(e) => {
                                const newSels = [...selections];
                                newSels[idx].length = e.target.value;
                                setSelections(newSels);
                              }}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">
                              mtr
                            </span>
                          </div>
                        </div>

                        {selections.length > 1 && (
                          <button
                            onClick={() => removeLineItem(idx)}
                            className="p-4 text-rose-400 hover:bg-rose-50 rounded-2xl transition-all"
                          >
                            <MinusCircle size={20} />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  <button
                    onClick={addLineItem}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-[#1a5695]/30 hover:text-[#1a5695] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Add More Wires
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Technician & Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-200">
                <label className="text-[10px] font-black uppercase text-slate-400 mb-4 block tracking-widest flex items-center gap-2">
                  <User size={14} className="text-[#1a5695]" /> Assigned
                  Technician
                </label>
                <div className="space-y-3">
                  {technicians.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => setSelectedTechnician(tech.id)}
                      className={`w-full p-4 rounded-2xl border flex flex-col items-start transition-all ${
                        selectedTechnician === tech.id
                          ? "bg-[#1a5695] border-[#1a5695] text-white shadow-lg"
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-xs font-black uppercase">
                        {tech.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase ${selectedTechnician === tech.id ? "text-blue-200" : "text-slate-400"}`}
                      >
                        {tech.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleFinalize}
                disabled={loading}
                className="w-full py-6 bg-[#1a5695] text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 hover:bg-[#15467a] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={18} /> Finalize & Deduct
                  </>
                )}
              </button>

              <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100 flex gap-3">
                <AlertCircle className="text-amber-500 shrink-0" size={18} />
                <p className="text-[9px] font-bold text-amber-700 leading-relaxed uppercase">
                  Note: Confirming this will permanently deduct{" "}
                  {selections.reduce(
                    (acc, s) => acc + (Number(s.length) || 0),
                    0,
                  )}
                  m from master stock.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateWiringLog;
