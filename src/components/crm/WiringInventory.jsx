import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Box,
  Loader2,
  X,
  Layers,
  Palette,
  Minus,
  ArrowRight,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";

const WiringInventory = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingWire, setEditingWire] = useState(null);

  // Adjustment States
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [adjustmentValue, setAdjustmentValue] = useState("");
  const fetchAll = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/wiring/fetchAllWireInventory`);
      if (res.status == 200) {
        console.log(res.data.data);
        setInventory(res.data.data);
      }
    } catch (error) {}
  };
  // --- DUMMY DATA ---
  const [inventory, setInventory] = useState([
    {
      id: 1,
      brand_name: "Finolex",
      wire_type: "DC Wire",
      gauge: "4",
      color: "Red",
      stock: 450,
    },
    {
      id: 2,
      brand_name: "Polycab",
      wire_type: "AC Wire",
      gauge: "2.5",
      color: "Black",
      stock: 210,
    },
    {
      id: 3,
      brand_name: "RR Kabel",
      wire_type: "LA Wire",
      gauge: "10",
      color: "Green",
      stock: 85,
    },
    {
      id: 4,
      brand_name: "Finolex",
      wire_type: "DC Wire",
      gauge: "4",
      color: "Black",
      stock: 380,
    },
  ]);
  useEffect(() => {
    fetchAll();
  }, []);
  const [formData, setFormData] = useState({
    brand_name: "",
    wire_type: "DC Wire",
    gauge: "",
    color: "Red",
    stock: "",
  });

  const handleOpenModal = (wire = null) => {
    setAdjustmentValue("");
    setAdjustmentType("add");
    if (wire) {
      setEditingWire(wire);
      setFormData(wire);
    } else {
      setEditingWire(null);
      setFormData({
        brand_name: "",
        wire_type: "DC Wire",
        gauge: "",
        color: "Red",
        stock: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingWire) {
        console.log(editingWire);
        console.log(adjustmentType);
        let qty = 0;
        if (adjustmentType == "deduct") {
          qty = adjustmentValue * -1;
        } else {
          qty = adjustmentValue;
        }
        
        setLoading(false);
      } else {
        const res = await axios.post(
          `${apiUrl}/api/wiring/createWireInventory`,
          formData,
        );

        if (res.status == 201) {
          fetchAll();
          toast.success("Created Successfully");
          setLoading(false);

          setIsModalOpen(false);
        }
      }
    } catch (error) {
      toast.error("Some error");
      console.log(error);
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  // --- SEARCH LOGIC ---
  const filteredInventory = inventory.filter(
    (item) =>
      item.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wire_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const previewTotal = editingWire
    ? adjustmentType === "add"
      ? Number(editingWire.stock) + (Number(adjustmentValue) || 0)
      : Number(editingWire.stock) - (Number(adjustmentValue) || 0)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Inventory"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
              <Box className="text-[#1a5695]" size={28} />
              Master Stock
            </h1>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#15467a] transition-all shadow-lg active:scale-95"
            >
              <Plus size={16} /> Add New Wire
            </button>
          </div>

          {/* Search Filter */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:bg-white focus:border-[#1a5695]/20 transition-all"
                placeholder="Search brand_name, type or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[32px] border border-slate-200 p-6 hover:border-[#1a5695]/30 transition-all shadow-sm relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-[#1a5695] text-white text-[9px] font-black uppercase rounded-lg tracking-tighter">
                      {item.brand_name}
                    </span>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-slate-800 uppercase mb-1">
                    {item.wire_type}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                      <Layers size={12} /> {item.gauge} sq mm
                    </span>
                    <span className="text-slate-200">•</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                      <Palette size={12} /> {item.color}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Available
                    </div>
                    <div className="text-xl font-black text-[#1a5695]">
                      {item.stock}
                      <span className="text-[10px] ml-1 uppercase">mtr</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL - POLISHED UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="bg-[#1a5695] p-6 lg:p-8 text-white flex justify-between items-center shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingWire ? "Adjust Inventory" : "New Stock Entry"}
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Warehouse Management
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="relative z-10 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 lg:p-8 custom-scrollbar">
              <form onSubmit={handleSave} className="space-y-8">
                {/* Section 1: brand_name & Type Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">
                        Brand Name
                      </label>
                      <input
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#1a5695] transition-all placeholder:text-slate-300"
                        placeholder="e.g. Finolex"
                        value={formData.brand_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider">
                        Wire Type
                      </label>
                      <select
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#1a5695] appearance-none"
                        value={formData.wire_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            wire_type: e.target.value,
                          })
                        }
                      >
                        <option value="DC Wire">DC Wire</option>
                        <option value="AC Wire">AC Wire</option>
                        <option value="LA Wire">LA Wire</option>
                        <option value="EARTHING Wire">EARTHING Wire</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Color Specification */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider flex items-center gap-2">
                    <Palette size={14} className="text-[#1a5695]" /> Color
                    Specification
                  </label>
                  <div className="grid grid-cols-1 gap-3 p-4 bg-slate-50 rounded-[28px] border border-slate-200">
                    <div className="flex flex-wrap gap-2">
                      {["Red", "Black", "Green", "Blue"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: c })}
                          className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase transition-all flex flex-col items-center justify-center gap-2 border ${
                            formData.color === c
                              ? "bg-[#1a5695] text-white border-[#1a5695] shadow-lg scale-105"
                              : "bg-white text-slate-500 border-slate-200 hover:border-[#1a5695]/30 shadow-sm"
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-black/10"
                            style={{
                              backgroundColor:
                                c.toLowerCase() === "black"
                                  ? "#111"
                                  : c.toLowerCase(),
                            }}
                          />
                          {c}
                        </button>
                      ))}
                    </div>
                    <input
                      placeholder="Other color (e.g. Yellow-Green)"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:border-[#1a5695] placeholder:text-slate-300 shadow-sm"
                      value={
                        ["Red", "Black", "Green", "Blue"].includes(
                          formData.color,
                        )
                          ? ""
                          : formData.color
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Section 3: Gauge & Measurements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-wider flex items-center gap-2">
                      <Layers size={14} className="text-[#1a5695]" /> Gauge Info
                    </label>
                    <input
                      placeholder="e.g. 4"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#1a5695] transition-all"
                      value={formData.gauge}
                      onChange={(e) =>
                        setFormData({ ...formData, gauge: e.target.value })
                      }
                    />
                  </div>

                  <div className="bg-[#1a5695]/5 p-4 rounded-[28px] border border-[#1a5695]/10 flex flex-col justify-center">
                    <label className="text-[9px] font-black uppercase text-[#1a5695] tracking-widest mb-3 text-center">
                      {editingWire ? "Update Quantity" : "Initial Stock"}
                    </label>
                    {editingWire ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setAdjustmentType(
                              adjustmentType === "add" ? "deduct" : "add",
                            )
                          }
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg transition-all active:scale-90 ${adjustmentType === "add" ? "bg-emerald-500" : "bg-rose-500"}`}
                        >
                          {adjustmentType === "add" ? (
                            <Plus size={20} />
                          ) : (
                            <Minus size={20} />
                          )}
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-lg font-black text-slate-700 outline-none focus:border-[#1a5695] shadow-sm"
                            value={adjustmentValue}
                            onChange={(e) => setAdjustmentValue(e.target.value)}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">
                            Mtrs
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="number"
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-700 outline-none focus:border-[#1a5695] shadow-sm"
                          placeholder="0"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">
                          Mtrs
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Review Display */}
                {editingWire && (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1a5695]/20 to-blue-400/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative flex items-center justify-between bg-white p-5 rounded-[28px] border border-blue-100 shadow-sm">
                      <div className="text-center flex-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter">
                          Existing
                        </p>
                        <p className="text-sm font-black text-slate-600 tracking-tight">
                          {editingWire.stock}m
                        </p>
                      </div>
                      <div className="px-4">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <ArrowRight size={18} className="text-[#1a5695]" />
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-[9px] font-black text-[#1a5695] uppercase mb-1 tracking-tighter">
                          New Total
                        </p>
                        <p
                          className={`text-lg font-black tracking-tight ${previewTotal < 0 ? "text-rose-500" : "text-emerald-500"}`}
                        >
                          {Math.max(0, previewTotal)}m
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  disabled={loading}
                  className="group relative w-full py-5 bg-[#1a5695] text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:bg-[#15467a] active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        {editingWire
                          ? "Update Inventory Record"
                          : "Save to Warehouse"}
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WiringInventory;
