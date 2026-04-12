import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Loader2,
  CheckCircle2,
  FileText,
  Calendar,
  IndianRupee,
  MapPin,
  Download,
  Trophy,
  Edit3,
  X,
  Save,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const Completion = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newExtraCost, setNewExtraCost] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const getCompletionData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/sources/getCompletionReport`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setData(res.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load completion records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCompletionData();
  }, []);

  const filteredItems = useMemo(() => {
    return data.filter((item) =>
      item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  const totalRevenue = useMemo(() => {
    return data.reduce((acc, curr) => acc + Number(curr.total_cost || 0), 0);
  }, [data]);

  // Open Edit Modal
  const handleEditClick = (item) => {
    setEditingItem(item);
    setNewExtraCost(item.extra_cost);
    setIsModalOpen(true);
  };

  // Save Extra Cost API Call
  const handleSaveExtraCost = async () => {
    setIsSaving(true);
    try {
      const res = await axios.post(
        `/api/sources/updateExtraCost`,
        {
          customerId: editingItem.id, // Or use your specific ID field
          extraCost: newExtraCost,
        },
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast.success("Extra cost updated successfully");
        setIsModalOpen(false);
        getCompletionData(); // Refresh table
      }
    } catch (error) {
      toast.error("Update failed: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const CostBox = ({ label, value, color = "slate" }) => (
    <div
      className={`flex flex-col items-center bg-${color}-50 px-3 py-2 rounded-xl border border-${color}-100 min-w-[80px]`}
    >
      <span className={`text-[8px] font-black text-${color}-400 uppercase`}>
        {label}
      </span>
      <span className={`text-[10px] font-bold text-${color}-700`}>
        ₹{Number(value).toLocaleString()}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Completion"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                <Trophy className="text-[#1a5695]" size={28} /> Project
                Completion
              </h1>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#1a5695] rounded-2xl font-black text-[10px] uppercase tracking-wider hover:shadow-md transition-all">
              <Download size={16} /> Export
            </button>
          </header>

          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                Total Completed
              </p>
              <h2 className="text-3xl font-black text-slate-800">
                {data.length}{" "}
                <span className="text-emerald-500 text-sm">Units</span>
              </h2>
            </div>
            <div className="bg-[#1a5695] p-6 rounded-[32px] shadow-lg shadow-blue-900/20">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-2">
                Total Revenue
              </p>
              <h2 className="text-3xl font-black text-white flex items-center gap-1">
                <IndianRupee size={24} />{" "}
                {totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>
          </section>

          {/* Main Table Container */}
          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">
                      Customer Information
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">
                      Cost Analysis
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase text-center">
                      Net Total
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <span className="font-black text-slate-800 text-sm uppercase">
                          {item.customer_name}
                        </span>
                      </td>
                      <td className="px-6 py-6 flex items-center justify-center gap-2">
                        <CostBox label="Kit" value={item.kit_cost} />
                        <CostBox label="Wire" value={item.wire_cost} />
                        <CostBox
                          label="Extra"
                          value={item.extra_cost}
                          color="amber"
                        />
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-emerald-600 font-black text-sm">
                          ₹{Number(item.total_cost).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-2 bg-slate-100 text-slate-400 hover:bg-[#1a5695] hover:text-white rounded-xl transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* --- EXTRA COST EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Adjust Extra Cost
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#1a5695] rounded-full flex items-center justify-center text-white font-black text-xs">
                    {editingItem?.customer_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Customer
                    </p>
                    <p className="font-bold text-slate-700">
                      {editingItem?.customer_name}
                    </p>
                  </div>
                </div>

                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  New Extra Cost (₹)
                </label>
                <div className="relative">
                  <IndianRupee
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    value={newExtraCost}
                    onChange={(e) => setNewExtraCost(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-800 focus:border-[#1a5695] transition-all"
                    placeholder="Enter amount..."
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveExtraCost}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-[#144477] shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Completion;
