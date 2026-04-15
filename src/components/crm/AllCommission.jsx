import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Loader2,
  Save,
  Zap,
  Calculator,
  Edit3,
  User,
  Phone,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllCommission = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Data States
  const [commissions, setCommissions] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [commissionValue, setCommissionValue] = useState("");
  const [status, setStatus] = useState("pending");
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      // Using the status param to filter between pending/paid in the backend
      const res = await axios.get(`/api/wiring/getCommissionsByStatus`, {
        params: { status: activeTab },
        withCredentials: true,
      });
      if (res.status === 200) setCommissions(res.data.data);
    } catch (error) {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [activeTab]);

  const handleOpenModal = (item) => {
    setActiveItem(item);

    const calculated =
      parseFloat(item.commission_per_kw || 0) * parseFloat(item.total_kw || 0);

    // Default to existing commission if present, else use calculated
    setCommissionValue(item.commission || calculated.toFixed(2));
    setStatus(item.status || activeTab);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const res = await axios.put(
        `/api/wiring/updateCommission/${activeItem.id}`,
        {
          commission: commissionValue,
          status: status,
        },
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast.success("Commission status updated");
        setIsModalOpen(false);
        fetchCommissions(); // Refresh the list
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const filteredList = commissions.filter(
    (item) =>
      item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Commissions"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase text-slate-800">
                Commission <span className="text-[#1a5695]">Logs</span>
              </h1>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                {activeTab} Records • {commissions.length} total
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm w-fit">
              {["pending", "paid"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-12 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? "bg-[#1a5695] text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                size={20}
              />
              <input
                type="text"
                placeholder="SEARCH BY CUSTOMER OR SOURCE..."
                className="w-full pl-16 pr-6 py-4.5 bg-white border border-slate-200 rounded-[24px] outline-none text-[11px] font-bold uppercase tracking-widest focus:border-[#1a5695] transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* LIST GRID */}
          {loading ? (
            <div className="py-40 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Fetching financial logs...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredList.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-[40px] border border-slate-200 p-8 hover:shadow-2xl hover:border-[#1a5695]/40 transition-all group"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl text-[#1a5695] group-hover:bg-[#1a5695] group-hover:text-white transition-all shadow-inner">
                      <IndianRupee size={24} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                        ID: {c.id}
                      </span>
                      <div
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter ${c.status === "paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                      >
                        {c.status}
                      </div>
                    </div>
                  </div>

                  <h3
                    onClick={() => {
                      navigate("/master", {
                        state: {
                          customerId: c.customer_id,
                          leadId: c.lead_id,
                        },
                      });
                    }}
                    className="text-2xl font-black text-slate-800 uppercase mb-2 line-clamp-1 cursor-pointer"
                  >
                    {c.customer_name}
                  </h3>
                  <div className="flex items-center gap-2 mb-8">
                    <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-lg">
                      <Zap
                        size={14}
                        className="text-[#1a5695]"
                        fill="#1a5695"
                      />
                      <span className="text-[10px] font-black text-[#1a5695] uppercase tracking-widest">
                        {c.total_kw} KW
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      ₹{c.commission_per_kw}/KW
                    </span>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-slate-400">
                        <User size={16} />
                        <span className="text-[11px] font-bold text-slate-700 uppercase">
                          {c.source_name}
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase">
                        Source
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <Phone size={16} />
                      <span className="text-[11px] font-bold text-slate-700 uppercase">
                        {c.mobile}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Total Payout
                      </p>
                      <p className="text-lg font-black text-[#1a5695]">
                        ₹
                        {c.commission
                          ? parseFloat(c.commission).toLocaleString()
                          : "0"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenModal(c)}
                      className={`p-3 rounded-xl transition-all shadow-md ${c.commission ? "bg-white text-slate-400 hover:text-[#1a5695]" : "bg-[#1a5695] text-white hover:bg-[#15467a]"}`}
                    >
                      {c.commission ? (
                        <Edit3 size={18} />
                      ) : (
                        <Calculator size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* REUSED MODAL LOGIC FROM COMMISSION.JSX */}
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
                  Update Commission
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
                    {activeItem?.total_kw} KW × ₹{activeItem?.commission_per_kw}
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
                    Commission Amount
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
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none focus:border-[#1a5695]"
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
                      <Save size={18} /> Save Changes
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

export default AllCommission;
