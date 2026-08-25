import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  X,
  Loader2,
  Save,
  Layers,
  IndianRupee,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const EstimationManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const [estimations, setEstimations] = useState([]);
  const [estimationTypes, setEstimationTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type_id: "",
    qty: "",
    price: "",
    gst: "",
  });

  const getEstimations = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get("/api/estimation/getEstimations", {
        withCredentials: true,
      });
      if (res.data?.success) {
        setEstimations(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load estimations");
    } finally {
      setTableLoading(false);
    }
  };

  const getEstimationTypes = async () => {
    try {
      const res = await axios.get("/api/estimation/getEstimationTypes", {
        withCredentials: true,
      });
      if (res.data?.success) {
        setEstimationTypes(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getEstimations();
    getEstimationTypes();
  }, []);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      type_id: item.type_id || item.type?.id || "",
      qty: item.qty || "",
      price: item.price || "",
      gst: item.gst || "",
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: "",
      type_id: "",
      qty: "",
      price: "",
      gst: "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res = editingId
        ? await axios.put(
            `/api/estimation/updateEstimation/${editingId}`,
            formData,
            { withCredentials: true },
          )
        : await axios.post("/api/estimation/addEstimation", formData, {
            withCredentials: true,
          });

      if (res.status === 200 || res.status === 201) {
        toast.success(
          editingId ? "Estimation updated!" : "Estimation created!",
        );
        setIsModalOpen(false);
        getEstimations();
      }
    } catch (error) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate total cost when GST is a percentage
  const calculateItemTotal = (price, qty, gstPercent) => {
    const baseCost = parseFloat(price || 0) * parseFloat(qty || 0);
    const gstRate = parseFloat(gstPercent || 0) / 100;
    return baseCost + baseCost * gstRate;
  };

  // Grand total across all estimations
  const globalGrandTotal = estimations.reduce((sum, item) => {
    return sum + calculateItemTotal(item.price, item.qty, item.gst);
  }, 0);

  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  const groupedEstimations = estimations
    .filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .reduce((acc, item) => {
      const typeName = item.type?.name || "Uncategorized";
      if (!acc[typeName]) acc[typeName] = [];
      acc[typeName].push(item);
      return acc;
    }, {});

  // Real-time calculation for modal preview
  const currentModalTotal = calculateItemTotal(
    formData.price,
    formData.qty,
    formData.gst,
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Estimations"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Estimation Services
            </h1>
            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  <Plus size={16} /> Add Estimation
                </button>
              </div>
              <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                  <IndianRupee size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Total Estimations Value (Incl. GST)
                  </p>
                  <p className="text-xl font-black text-slate-800 tracking-tight">
                    {formatCurrency(globalGrandTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-8 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search estimations by name..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {tableLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-200">
              <Loader2 className="animate-spin text-[#1a5695]" size={48} />
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(groupedEstimations).map(([typeGroup, items]) => {
                const groupTotal = items.reduce(
                  (sum, item) =>
                    sum + calculateItemTotal(item.price, item.qty, item.gst),
                  0,
                );

                return (
                  <div
                    key={typeGroup}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <div className="flex items-center gap-4 mb-4 px-2">
                      <div className="p-2 bg-[#1a5695] rounded-xl text-white shadow-md">
                        <Layers size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                          {typeGroup}
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {items.length} Items
                        </p>
                      </div>
                      <div className="flex-1 h-[1px] bg-slate-200 ml-2"></div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-slate-200 overflow-x-auto shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50">
                          <tr>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-16 text-center">
                              No.
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase min-w-[200px]">
                              Estimation Name
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-28 text-center">
                              Qty
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-36">
                              Unit Price
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-32">
                              GST (%)
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-44">
                              Total Cost (Incl. GST)
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-20 text-right">
                              Edit
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {items.map((item, index) => {
                            const itemTotal = calculateItemTotal(
                              item.price,
                              item.qty,
                              item.gst,
                            );

                            return (
                              <tr
                                key={item.id}
                                className="hover:bg-slate-50/80 transition-colors"
                              >
                                <td className="px-6 py-4 text-xs font-black text-slate-300 text-center">
                                  #{index + 1}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-bold text-slate-800 text-sm">
                                    {item.name}
                                  </div>
                                  <div className="text-[9px] font-black text-[#1a5695] uppercase">
                                    {item.type?.name || "Service"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className="text-sm font-black px-3 py-1 rounded-lg text-slate-700 bg-slate-100">
                                    {parseFloat(item.qty || 0).toFixed(2)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-600 text-sm">
                                  {formatCurrency(parseFloat(item.price || 0))}
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-600 text-sm">
                                  {item.gst
                                    ? `${parseFloat(item.gst).toFixed(2)}%`
                                    : "—"}
                                </td>
                                <td className="px-6 py-4 font-black text-emerald-600 text-sm">
                                  {formatCurrency(
                                    Math.round(Math.abs(itemTotal)),
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleEditClick(item)}
                                    className="p-2 text-slate-400 hover:text-[#1a5695] border border-slate-100 rounded-xl"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-slate-50/80 border-t border-slate-100">
                          <tr className="font-black text-slate-800">
                            <td
                              colSpan="5"
                              className="px-6 py-4 text-[10px] uppercase text-right text-slate-400"
                            >
                              Type Subtotal (Incl. GST):
                            </td>
                            <td className="px-6 py-4 text-sm text-[#1a5695]">
                              {formatCurrency(Math.round(Math.abs(groupTotal)))}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-300">
            <div
              className={`p-8 text-white flex justify-between items-center ${
                editingId ? "bg-amber-500" : "bg-[#1a5695]"
              }`}
            >
              <div>
                <h2 className="text-xl font-black uppercase">
                  {editingId ? "Edit Estimation" : "Add New Estimation"}
                </h2>
                <p className="text-white/60 text-[10px] font-bold uppercase mt-1">
                  Estimation Management
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Estimation Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold uppercase"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Estimation Type
                </label>
                <select
                  required
                  className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                  value={formData.type_id}
                  onChange={(e) =>
                    setFormData({ ...formData, type_id: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  {estimationTypes.length > 0 ? (
                    estimationTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Installation</option>
                      <option value="2">Electrical</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Quantity
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                    value={formData.qty}
                    onChange={(e) =>
                      setFormData({ ...formData, qty: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Price (₹)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    GST (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 18"
                    className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                    value={formData.gst}
                    onChange={(e) =>
                      setFormData({ ...formData, gst: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Total Cost (Incl. GST)
                  </label>
                  <div className="w-full mt-1 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm font-black text-emerald-700">
                    {formatCurrency(currentModalTotal)}
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className={`w-full py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95 ${
                  editingId ? "bg-amber-500" : "bg-[#1a5695]"
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Save size={18} />
                    {editingId ? "Update Estimation" : "Confirm Entry"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimationManager;
