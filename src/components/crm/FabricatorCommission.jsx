import React, { useState, useEffect } from "react";
import {
  Search,
  DollarSign,
  X,
  Loader2,
  Clock,
  CheckCircle2,
  Save,
  Zap,
  Calculator,
  Edit3,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FabricatorCommission = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [leads, setLeads] = useState([]);
  const [activeItem, setActiveItem] = useState(null);

  // Form State
  const [commissionValue, setCommissionValue] = useState("");
  const [status, setStatus] = useState("pending");

  const getCommissionData = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `/api/wiring/getPendingFabricatorCommissions`,
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) setLeads(res.data.data);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    getCommissionData();
  }, []);

  const handleOpenModal = (item) => {
    setActiveItem(item);

    // Auto-calculation logic: commission_per_kw * total_kw
    const calculated =
      parseFloat(item.commission_per_kw || 0) * parseFloat(item.total_kw || 0);

    // If a commission already exists in DB, use that, otherwise use calculated
    setCommissionValue(item.commission || calculated.toFixed(2));
    setStatus(item.status || "pending");
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(commissionValue);
    console.log(activeItem.id);
    setBtnLoading(true);
    try {
      const res = await axios.put(
        `/api/wiring/updateFabricatorCommission/${activeItem.id}`,
        {
          commission: commissionValue,
          status: status,
        },
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast.success("Commission updated");
        setIsModalOpen(false);
        getCommissionData();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const filteredItems = leads.filter((item) =>
    item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Commissions"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase flex items-center gap-3">
              Commission Management
              <button
                onClick={() => {
                  navigate("/allfabcommissions");
                }}
                className="flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-full hover:bg-slate-300 transition-all cursor-pointer"
              >
                SHOW ALL Fabricator Commissions <ChevronRight size={12} />
              </button>
            </h1>
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 shadow-sm">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold"
                placeholder="Search customer..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm relative min-h-[400px]">
            {tableLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <Loader2 className="animate-spin text-[#1a5695]" size={32} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        System
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Rate/KW
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total Commission
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 text-sm uppercase">
                            {item.customer_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold">
                            {item.mobile} | Supervisor: {item.source_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 font-black text-slate-700 text-xs">
                            <Zap size={12} className="text-amber-500" />{" "}
                            {item.total_kw} KW
                          </span>
                          <div className="text-[9px] uppercase text-slate-400 font-bold">
                            {item.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-600 text-sm">
                          ₹
                          {parseFloat(
                            item.commission_per_kw || 0,
                          ).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {item.commission ? (
                            <span className="text-[#1a5695] font-black text-sm">
                              ₹{parseFloat(item.commission).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic text-[11px] font-bold uppercase tracking-tighter">
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm border ${
                              item.commission
                                ? "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                : "bg-[#1a5695] text-white border-[#1a5695] hover:bg-[#15467a]"
                            }`}
                          >
                            {item.commission ? (
                              <Edit3 size={14} />
                            ) : (
                              <Calculator size={14} />
                            )}
                            {item.commission ? "Update" : "Assign Commission"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !btnLoading && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  Set Commission
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Calculation Preview
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">
                    {activeItem?.total_kw} KW × ₹
                    {activeItem?.commission_per_kw?.toFixed(2)}
                  </span>
                  <span className="text-sm font-black text-[#1a5695]">
                    ₹
                    {(
                      activeItem?.total_kw * activeItem?.commission_per_kw
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Commission Amount (Manual Edit Allowed)
                  </label>
                  <div className="relative">
                    <IndianRupee
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <input
                      type="number"
                      step="any"
                      value={commissionValue}
                      onChange={(e) => setCommissionValue(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none focus:border-[#1a5695] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={btnLoading}
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg hover:bg-[#15467a] transition-all flex items-center justify-center gap-2"
                >
                  {btnLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Save size={18} /> Update Commission
                    </>
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

export default FabricatorCommission;
