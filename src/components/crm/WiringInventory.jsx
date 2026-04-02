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
  TrendingUp,
  Percent,
  Calculator,
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
  const [inventory, setInventory] = useState([]);

  const [adjustmentType, setAdjustmentType] = useState("add");
  const [adjustmentValue, setAdjustmentValue] = useState("");

  const [formData, setFormData] = useState({
    brand_name: "",
    wire_type: "DC Wire",
    gauge: "",
    color: "Red",
    stock: "",
    price: "0.00",
    tax: "0.00",
  });

  const fetchAll = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/wiring/fetchAllWireInventory`);
      if (res.status === 200) {
        setInventory(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredInventory = inventory.filter(
    (item) =>
      item.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wire_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const grandTotalExclTax = filteredInventory.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.stock),
    0,
  );
  const totalTaxAmount = filteredInventory.reduce((acc, item) => {
    const itemTotal = Number(item.price) * Number(item.stock);
    return acc + itemTotal * (Number(item.tax) / 100);
  }, 0);
  const grandTotalInclTax = grandTotalExclTax + totalTaxAmount;

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
        price: "0.00",
        tax: "0.00",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        tax: Number(formData.tax),
        stock: Number(formData.stock),
      };

      if (editingWire) {
        const adjustmentNum = Number(adjustmentValue);
        let qty = adjustmentType === "deduct" ? -adjustmentNum : adjustmentNum;
        payload.stock = Number(formData.stock) + qty;

        const res = await axios.put(
          `${apiUrl}/api/wiring/updateWireInventory/${formData.id}`,
          payload,
        );
        if (res.status === 200) {
          fetchAll();
          toast.success("Updated Successfully");
          setIsModalOpen(false);
        }
      } else {
        const res = await axios.post(
          `${apiUrl}/api/wiring/createWireInventory`,
          payload,
        );
        if (res.status === 201) {
          fetchAll();
          toast.success("Created Successfully");
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      toast.error("Error saving data");
    } finally {
      setLoading(false);
    }
  };

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
          {/* Header & Valuation Cards */}
          <div className="flex flex-col xl:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                <Box className="text-[#1a5695]" size={28} />
                Master Stock Management
              </h1>
              <button
                onClick={() => handleOpenModal()}
                className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#15467a] shadow-lg transition-all"
              >
                <Plus size={16} /> Add New Wire
              </button>
            </div>

            <div className="flex flex-wrap gap-4 self-end">
              <div className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm min-w-[160px]">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-tighter">
                  Total Excl. Tax
                </p>
                <p className="text-lg font-black text-slate-700">
                  ₹{grandTotalExclTax.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#1a5695] p-4 rounded-[24px] shadow-blue-200 shadow-lg min-w-[180px] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[9px] font-black text-blue-100 uppercase mb-1 tracking-tighter">
                    Grand Total (Incl. Tax)
                  </p>
                  <p className="text-xl font-black text-white">
                    ₹{grandTotalInclTax.toLocaleString()}
                  </p>
                </div>
                <Calculator
                  className="absolute right-[-10px] bottom-[-10px] text-white/10"
                  size={60}
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:bg-white focus:border-[#1a5695]/20 transition-all"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE VIEW */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Wire Details
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
                      Stock (Mtr)
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Unit Price
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Sub-Total
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Tax Amt
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-[#1a5695] tracking-widest">
                      Final Total
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => {
                    const subTotal = Number(item.price) * Number(item.stock);
                    const taxAmt = subTotal * (Number(item.tax) / 100);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#1a5695] uppercase">
                              {item.brand_name}
                            </span>
                            <span className="text-sm font-bold text-slate-700 uppercase">
                              {item.wire_type}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                              {item.gauge} sqmm • {item.color}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-lg text-xs font-black ${Number(item.stock) < 50 ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"}`}
                          >
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-600">
                          ₹{Number(item.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-600">
                          ₹{subTotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-slate-400">
                          ₹{taxAmt.toFixed(2)}{" "}
                          <span className="text-[9px]">({item.tax}%)</span>
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-[#1a5695]">
                          ₹{(subTotal + taxAmt).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-slate-300 hover:text-[#1a5695] transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* RE-CONFIGURED MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="bg-[#1a5695] p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingWire ? "Adjust Entry" : "New Entry"}
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Product & Valuation Specs
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-8 custom-scrollbar">
              <form onSubmit={handleSave} className="space-y-6">
                {/* 1. Brand & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Brand Name
                    </label>
                    <input
                      required
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#1a5695]"
                      value={formData.brand_name}
                      onChange={(e) =>
                        setFormData({ ...formData, brand_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                      Wire Type
                    </label>
                    <select
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                      value={formData.wire_type}
                      onChange={(e) =>
                        setFormData({ ...formData, wire_type: e.target.value })
                      }
                    >
                      <option value="DC Wire">DC Wire</option>
                      <option value="AC Wire">AC Wire</option>
                      <option value="LA Wire">LA Wire</option>
                      <option value="EARTHING Wire">EARTHING Wire</option>
                    </select>
                  </div>
                </div>

                {/* 2. Gauge & Color (ADDED BACK) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                      <Layers size={12} /> Gauge (sqmm)
                    </label>
                    <input
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                      value={formData.gauge}
                      onChange={(e) =>
                        setFormData({ ...formData, gauge: e.target.value })
                      }
                      placeholder="e.g. 4.00"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                      <Palette size={12} /> Wire Color
                    </label>
                    <input
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      placeholder="Red, Black, Green..."
                    />
                  </div>
                </div>

                {/* 3. Pricing & Tax */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                      <TrendingUp size={12} /> Unit Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                      <Percent size={12} /> Tax (%)
                    </label>
                    <input
                      type="number"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold"
                      value={formData.tax}
                      onChange={(e) =>
                        setFormData({ ...formData, tax: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* 4. Stock Adjustment */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <label className="text-[10px] font-black uppercase text-[#1a5695] mb-4 block">
                    {editingWire
                      ? "Qty Adjustment (Mtrs)"
                      : "Initial Stock (Mtrs)"}
                  </label>
                  {editingWire ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setAdjustmentType(
                            adjustmentType === "add" ? "deduct" : "add",
                          )
                        }
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${adjustmentType === "add" ? "bg-emerald-500 shadow-emerald-200" : "bg-rose-500 shadow-rose-200"} shadow-lg transition-all`}
                      >
                        {adjustmentType === "add" ? (
                          <Plus size={24} />
                        ) : (
                          <Minus size={24} />
                        )}
                      </button>
                      <input
                        type="number"
                        className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 text-xl font-black outline-none focus:border-[#1a5695]"
                        placeholder="Qty"
                        value={adjustmentValue}
                        onChange={(e) => setAdjustmentValue(e.target.value)}
                      />
                    </div>
                  ) : (
                    <input
                      type="number"
                      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-[#1a5695]"
                      placeholder="Enter opening stock"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                    />
                  )}
                </div>

                <button
                  disabled={loading}
                  className="w-full py-5 bg-[#1a5695] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#15467a] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={20} />
                  ) : editingWire ? (
                    "Update Record"
                  ) : (
                    "Save to Warehouse"
                  )}
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
