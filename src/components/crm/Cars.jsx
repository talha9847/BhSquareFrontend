import React, { useEffect, useState } from "react";
import {
  Search,
  Truck,
  ShieldCheck,
  X,
  Plus,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const Cars = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // States for loading
  const [loading, setLoading] = useState(false); // Modal Action Loading
  const [pageLoading, setPageLoading] = useState(true); // Initial Fetch Loading

  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({ number: "", name: "" });

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchCars = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(`${apiUrl}/api/dispatch/fetchCars`);
      if (res.status === 200) {
        setCars(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load fleet data");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenModal = (car = null) => {
    if (car) {
      setEditingCar(car);
      setFormData({ number: car.number, name: car.name });
    } else {
      setEditingCar(null);
      setFormData({ number: "", name: "" });
    }
    setIsModalOpen(true);
  };

  const createCar = async () => {
    if (!formData.number || !formData.name) {
      toast.warning("Please fill all vehicle details");
      return;
    }

    try {
      setLoading(true);
      if (editingCar) {
        // Update Logic
        const res = await axios.put(
          `${apiUrl}/api/dispatch/updateCar/${editingCar.id}`,
          formData,
        );
        if (res.status === 200) {
          toast.success("Vehicle updated successfully");
          setIsModalOpen(false);
          fetchCars();
        }
      } else {
        // Create Logic
        const res = await axios.post(
          `${apiUrl}/api/dispatch/createCar`,
          formData,
        );
        if (res.status === 200 || res.status === 201) {
          toast.success("Vehicle registered successfully");
          setIsModalOpen(false);
          fetchCars();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter((car) =>
    car.number?.toLowerCase().includes(searchQuery.toLowerCase()),
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                Fleet Management
              </h1>
              <p className="text-sm text-slate-500">
                Manage solar transport vehicles
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#15467a] shadow-lg transition-all active:scale-95"
            >
              <Plus size={16} /> Register Vehicle
            </button>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-6 flex items-center gap-3 shadow-sm">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by plate number..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#1a5695] outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            {pageLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-10 h-10 text-[#1a5695] animate-spin mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Loading Fleet Data...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Vehicle Info
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredCars.map((car) => (
                      <tr
                        key={car.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1a5695]/10 flex items-center justify-center text-[#1a5695]">
                              <Truck size={18} />
                            </div>
                            <div>
                              <p className="font-black text-[#1a5695] text-sm uppercase">
                                {car.number}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {car.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(car)}
                              className="p-2 text-slate-400 hover:text-[#1a5695] hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {!pageLoading && filteredCars.length === 0 && (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-6 py-10 text-center text-slate-400 text-xs font-bold italic"
                        >
                          No vehicles found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* VEHICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#1a5695] p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingCar ? "Update Vehicle" : "New Vehicle"}
                </h2>
                <p className="text-blue-100/60 text-[10px] font-bold uppercase mt-1">
                  Fleet Assets
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
                  Plate Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1a5695]/10 outline-none transition-all text-sm font-bold uppercase"
                  placeholder="GJ-XX-XXXX"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      number: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Model / Type
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#1a5695]/10 outline-none transition-all text-sm font-bold"
                  placeholder="e.g. Tata Ace"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <button
                onClick={createCar}
                disabled={loading}
                className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#15467a] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <ShieldCheck size={18} />
                )}
                {editingCar ? "Confirm Update" : "Register Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
