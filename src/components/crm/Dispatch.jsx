import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Truck,
  User,
  Package,
  ChevronRight,
  Loader2,
  Clock,
  ShieldCheck,
  X,
  Check,
  Users,
  Car,
  Inbox, // Added for the empty state
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
  const [cars, setCars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [formData, setFormData] = useState({
    driver_id: "",
    car_id: "",
    status: "done",
  });

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "dispatched" || s === "done")
      return "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-100/50";
    if (s === "pending") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await axios.get(endpoint, { withCredentials: true });
      if (res.status === 200) setter(res.data.data || []);
    } catch (error) {
      toast.error(`Failed to load ${endpoint.split("/").pop()}`);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setPageLoading(true);
      await Promise.all([
        fetchData(`/api/dispatch/fetchDispatches`, setDispatches),
        fetchData(`/api/dispatch/fetchDrivers`, setDrivers),
        fetchData(`/api/dispatch/fetchCars`, setCars),
      ]);
      setPageLoading(false);
    };
    loadAll();
  }, []);

  const handleOpenModal = (d) => {
    setSelectedDispatch(d);
    setFormData({
      driver_id: d.driver_id || "",
      car_id: d.car_id || "",
      status: "done",
    });
    setIsModalOpen(true);
  };

  const handleUpdateDispatch = async () => {
    if (!formData.driver_id || !formData.car_id) {
      toast.warning("Please fill all logistics details");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `/api/dispatch/updateDispatch`,
        { customer_id: selectedDispatch.customer_id, ...formData },
        { withCredentials: true },
      );
      if (res.status === 200) {
        toast.success("Shipment Dispatched!");
        setIsModalOpen(false);
        fetchData(`/api/dispatch/fetchDispatches`, setDispatches);
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
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                Logistics & Dispatch
                <button
                  onClick={() => navigate("/alldispatch")}
                  className="flex items-center gap-1 bg-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-full hover:bg-slate-300 transition-all cursor-pointer"
                >
                  SHOW ALL DISPATCH <ChevronRight size={12} />
                </button>
              </h1>
              <p className="text-xs md:text-sm text-slate-500">
                Track and manage outgoing equipment
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => navigate("/drivers")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Users size={14} className="text-[#1a5695]" /> Drivers
              </button>
              <button
                onClick={() => navigate("/cars")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <Car size={14} className="text-[#1a5695]" /> Fleet
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by customer, driver or car..."
                className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-200 overflow-hidden shadow-sm min-h-[400px] flex flex-col">
            {pageLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Syncing Logistics...
                </p>
              </div>
            ) : filteredDispatches.length > 0 ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                          Customer & Site
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                          Logistics
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 text-center">
                          Date
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 text-center">
                          Status
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 text-right">
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
                            {/* Name & Badge Container */}
                            <div className="flex items-center gap-2">
                              <p
                                onClick={() =>
                                  navigate("/master", {
                                    state: {
                                      customerId: d.customer_id,
                                      leadId: d.lead_id,
                                    },
                                  })
                                }
                                className="font-bold text-slate-800 text-sm cursor-pointer hover:text-[#1a5695] transition-colors leading-tight"
                              >
                                {d.customer_name}
                              </p>

                              {/* Colorful Type Badge */}
                              <span
                                className={`
        text-[9px] px-1 rounded font-bold uppercase border
        ${
          d.installation_type === "Residential"
            ? "bg-blue-50 text-blue-600 border-blue-100"
            : d.installation_type === "Commercial"
              ? "bg-purple-50 text-purple-600 border-purple-100"
              : d.installation_type === "Industrial"
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-slate-50 text-slate-400 border-slate-100"
        }
      `}
                              >
                                {d.installation_type?.substring(0, 3)}
                              </span>
                            </div>

                            {/* Address Row */}
                            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-1">
                              <MapPin size={10} />
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
                          <td className="px-6 py-4 text-center text-xs font-bold text-slate-600">
                            {d.driver_name && d.vehicle ? d.date : "—"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase inline-flex items-center gap-1.5 ${getStatusStyle(d.status)}`}
                            >
                              {d.status === "done" ? (
                                <ShieldCheck size={10} />
                              ) : (
                                <Clock size={10} />
                              )}{" "}
                              {d.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() =>
                                d.status === "pending"
                                  ? handleOpenModal(d)
                                  : navigate("/fabrication")
                              }
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all border shadow-sm ${
                                d.status === "done"
                                  ? "bg-white text-slate-300 border-slate-100"
                                  : "bg-slate-50 text-slate-700 hover:bg-[#1a5695] hover:text-white"
                              }`}
                            >
                              {d.status === "done" ? "Fabrication" : "Dispatch"}{" "}
                              <ChevronRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List View */}
                <div className="md:hidden divide-y divide-slate-100">
                  {filteredDispatches.map((d) => (
                    <div key={d.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {d.customer_name}
                          </p>
                          <div className="flex items-center gap-1 text-slate-400 text-[10px] mt-0.5">
                            <MapPin size={10} /> {d.address}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[9px] font-black border uppercase ${getStatusStyle(d.status)}`}
                        >
                          {d.status}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                        <div className="text-[10px]">
                          <p className="text-slate-400 uppercase font-black">
                            Logistics
                          </p>
                          <p className="font-bold text-slate-700">
                            {d.driver_name || "Unassigned"}
                          </p>
                          <p className="text-[#1a5695] font-bold">
                            {d.vehicle || ""}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            d.status === "pending"
                              ? handleOpenModal(d)
                              : navigate("/fabrication")
                          }
                          className="p-2 bg-white border border-slate-200 rounded-lg text-[#1a5695]"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* NO DATA FOUND VIEW */
              <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <Inbox className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  No Dispatches Found
                </h3>
                <p className="text-[10px] text-slate-300 font-bold uppercase mt-1 tracking-tighter">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "The dispatch queue is currently empty"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-[10px] font-black text-[#1a5695] uppercase hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* DISPATCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="bg-[#1a5695] p-6 md:p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg md:text-xl font-black uppercase">
                  Finalize Dispatch
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase mt-1">
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
            <div className="p-6 md:p-8 space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <select
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-bold"
                    value={formData.driver_id}
                    onChange={(e) =>
                      setFormData({ ...formData, driver_id: e.target.value })
                    }
                  >
                    <option value="">--Select Driver--</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} - {d.mobile}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Truck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <select
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white outline-none text-sm font-bold uppercase"
                    value={formData.car_id}
                    onChange={(e) =>
                      setFormData({ ...formData, car_id: e.target.value })
                    }
                  >
                    <option value="">--Select Car--</option>
                    {cars.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} - {e.number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="text-emerald-500" size={20} />
                  <span className="text-[10px] font-black text-emerald-700 uppercase">
                    Set Status: Dispatched
                  </span>
                </div>
                <Check className="text-emerald-500" size={20} />
              </div>
              <button
                onClick={handleUpdateDispatch}
                disabled={loading}
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mb-4 sm:mb-0"
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
