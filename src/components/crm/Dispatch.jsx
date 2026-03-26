import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Truck,
  User,
  Calendar,
  Package,
  ChevronRight,
  Filter,
  Loader2,
  Clock,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  X,
  Check,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dispatch = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [formData, setFormData] = useState({
    driver_name: "",
    vehicle: "",
    status: "done",
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const [dispatches, setDispatches] = useState([]);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "dispatched" || s === "done")
      return "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-100/50";
    if (s === "pending") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  const getDispatch = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(`${apiUrl}/api/dispatch/fetchDispatches`);
      if (res.status === 200) {
        console.log(res.data.data);
        setDispatches(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch dispatches");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getDispatch();
  }, []);

  const handleOpenModal = (d) => {
    setSelectedDispatch(d);
    setFormData({
      driver_name: d.driver_name || "",
      vehicle: d.vehicle || "",
      status: "done",
    });
    setIsModalOpen(true);
  };

  const handleUpdateDispatch = async () => {
    if (!formData.driver_name || !formData.vehicle) {
      toast.warning("Please fill all logistics details");
      return;
    }

    console.log(formData.driver_name);
    console.log(formData.vehicle);
    console.log(formData.status);

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/api/dispatch/updateDispatch`, {
        customer_id: selectedDispatch.customer_id,
        ...formData,
      });

      if (res.status === 200) {
        toast.success("Shipment Dispatched!");
        setIsModalOpen(false);
        getDispatch();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredDispatches = dispatches.filter(
    (d) =>
      d.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driver_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicle?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Dispatch"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight font-syne uppercase">
                Logistics & Dispatch
              </h1>
              <p className="text-sm text-slate-500">
                Track and manage outgoing equipment
              </p>
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
                placeholder="Search records..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Syncing Logistics...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Customer & Site
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Logistics
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Date
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                        Status
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredDispatches.map((d) => (
                      <tr
                        key={d.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 text-sm">
                            {d.customer_name}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-1">
                            <MapPin size={10} />{" "}
                            <span className="truncate max-w-[150px]">
                              {d.address}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {d.driver_name ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <User size={12} className="text-slate-400" />{" "}
                                {d.driver_name}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black text-[#1a5695] uppercase">
                                <Truck size={12} /> {d.vehicle}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-300 italic">
                              No logistics assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-600">
                              {d.driver_name && d.vehicle
                                ? d.date
                                : "Not Dispatched"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase inline-flex items-center gap-1.5 ${getStatusStyle(d.status)}`}
                          >
                            {d.status === "done" ? (
                              <ShieldCheck size={10} />
                            ) : (
                              <Clock size={10} />
                            )}
                            {d.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              d.status === "pending" && handleOpenModal(d);
                              d.status == "done" && navigate("/fabrication");
                            }}
                            className={`group/btn flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border shadow-sm ${
                              d.status === "done"
                                ? "bg-white text-slate-300 border-slate-100 cursor-default"
                                : "bg-slate-50 text-slate-700 hover:bg-[#1a5695] hover:text-white active:scale-95"
                            }`}
                          >
                            {d.status === "done"
                              ? "Go To Fabrication"
                              : "Mark Dispatch"}
                            <ChevronRight
                              size={14}
                              className="group-hover/btn:translate-x-1 transition-transform"
                            />
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

      {/* DISPATCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center relative">
              <div className="relative z-10">
                <h2 className="text-xl font-black font-syne uppercase tracking-tight">
                  Finalize Dispatch
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Assign logistics & driver
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Driver Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1a5695]/10 outline-none transition-all text-sm font-bold"
                    placeholder="Enter driver name"
                    value={formData.driver_name}
                    onChange={(e) =>
                      setFormData({ ...formData, driver_name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Vehicle Number
                </label>
                <div className="relative">
                  <Truck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1a5695]/10 outline-none transition-all text-sm font-bold uppercase"
                    placeholder="GJ-XX-XXXX"
                    value={formData.vehicle}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white">
                    <Package size={16} />
                  </div>
                  <span className="text-xs font-black text-emerald-700 uppercase">
                    Set Status: Dispatched
                  </span>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
                  <Check size={20} />
                </div>
              </div>

              <button
                onClick={() => {
                  handleUpdateDispatch();
                }}
                disabled={loading}
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#15467a] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <ShieldCheck size={18} />
                )}
                Confirm Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dispatch;
