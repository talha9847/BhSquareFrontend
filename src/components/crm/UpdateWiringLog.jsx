import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Zap,
  User,
  Loader2,
  PackageOpen,
  Check,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";

const UpdateWiringLog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const wiringId = location.state?.wiring_id;
  const customerId = location.state?.customer_id;
  const apiUrl = import.meta.env.VITE_API_URL;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [l, setL] = useState(false);
  const [uL, setUL] = useState(false);

  // Data States
  const [inventory, setInventory] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [wireSelection, setWireSelection] = useState({
    inventory_id: "",
    length: "",
  });
  const [done, setDone] = useState("");
  const [localLog, setLocalLog] = useState([]);

  // Logic Check
  const isEditable = done === "pending";

  const fetchData = useCallback(async () => {
    setPageLoading(true);
    try {
      const [invRes, techRes, issuedRes] = await Promise.all([
        axios.get(`${apiUrl}/api/wiring/getAvailableWireInventory/${wiringId}`),
        axios.get(`${apiUrl}/api/wiring/fetchTechnicians`),
        axios.get(`${apiUrl}/api/wiring/fetchIssuedWires/${wiringId}`),
      ]);

      setInventory(invRes.data.data || []);
      setTechnicians(techRes.data.data || []);
      setLocalLog(issuedRes.data.data || []);
      setSelectedTechnician(issuedRes.data.extraData.technician_id || "");
      setDone(issuedRes.data.extraData.inventory_status);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setPageLoading(false);
    }
  }, [apiUrl, wiringId]);

  useEffect(() => {
    if (!customerId || !wiringId) return navigate("/wiring");
    fetchData();
  }, [fetchData, navigate, customerId, wiringId]);

  const selectedWire = inventory.find(
    (i) => i.id === Number(wireSelection.inventory_id),
  );
  const isOverLimit =
    selectedWire && Number(wireSelection.length) > selectedWire.stock;

  const saveTechnician = async () => {
    if (!isEditable) return;
    setL(true);
    try {
      const res = await axios.put(
        `${apiUrl}/api/wiring/updateTechni/${wiringId}`,
        {
          technician_id: selectedTechnician,
        },
      );
      if (res.status === 200) toast.success("Technician Assigned");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setL(false);
    }
  };

  const saveWireToStore = async () => {
    if (
      !isEditable ||
      !wireSelection.inventory_id ||
      !wireSelection.length ||
      isOverLimit
    )
      return;
    setActionLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/api/wiring/createWiringItem`, {
        wiring_id: wiringId,
        wire_inventory_id: Number(wireSelection.inventory_id),
        qty: Number(wireSelection.length),
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Wire Issued");
        setWireSelection({ inventory_id: "", length: "" });
        fetchData();
      }
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleNextStep = async () => {
    try {
      setUL(true);
      // Add your API call here to change status to 'completed' or next phase
      toast.info("Moving to next stage...");
      console.log(wiringId);
      const res = await axios.put(
        `${apiUrl}/api/wiring/updateInventoryStatus/${wiringId}`,
      );
      if (res.status == 200) {
        navigate("/wiring");
      }
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setUL(false);
    }
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

        <main className="p-4 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-[#1a5695]"
            >
              <ArrowLeft size={14} /> Back
            </button>
            {!isEditable && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Inventory Finalized
                </span>
              </div>
            )}
          </div>

          {pageLoading ? (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border border-slate-200 shadow-sm">
              <Loader2 className="animate-spin text-[#1a5695] mb-2" />
              <p className="text-[10px] font-black text-slate-300 uppercase">
                Loading Details...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BOX 1: TECHNICIAN */}
                <div
                  className={`bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm flex flex-col ${!isEditable && "opacity-60"}`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <User size={18} className="text-[#1a5695]" />
                    <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">
                      Technician
                    </h3>
                  </div>
                  <select
                    disabled={!isEditable}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none focus:border-[#1a5695] disabled:cursor-not-allowed"
                    value={selectedTechnician}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                  >
                    <option value="">Select Staff...</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <button
                    disabled={!isEditable || l}
                    onClick={saveTechnician}
                    className="mt-4 w-full py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    {l ? "Updating..." : "Update Technician"}
                  </button>
                </div>

                {/* BOX 2: SINGLE WIRE SAVE */}
                <div
                  className={`bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm ${!isEditable && "opacity-60"}`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Zap
                      size={18}
                      className="text-[#1a5695]"
                      fill="currentColor"
                    />
                    <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">
                      Issue Material
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <select
                      disabled={!isEditable}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none focus:border-[#1a5695] disabled:cursor-not-allowed"
                      value={wireSelection.inventory_id}
                      onChange={(e) =>
                        setWireSelection({
                          ...wireSelection,
                          inventory_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Choose Wire...</option>
                      {inventory.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.brand_name} {i.wire_type} ({i.stock}m left)
                        </option>
                      ))}
                    </select>
                    <div className="relative">
                      <input
                        disabled={!isEditable}
                        type="number"
                        placeholder="Length"
                        className={`w-full p-4 bg-slate-50 border rounded-2xl font-black text-xs outline-none transition-all ${isOverLimit ? "border-red-500 bg-red-50 text-red-600 ring-2 ring-red-100" : "border-slate-100 focus:border-[#1a5695] disabled:cursor-not-allowed"}`}
                        value={wireSelection.length}
                        onChange={(e) =>
                          setWireSelection({
                            ...wireSelection,
                            length: e.target.value,
                          })
                        }
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">
                        MTR
                      </span>
                    </div>
                    {isOverLimit && (
                      <p className="text-[9px] font-black text-red-500 uppercase ml-2 animate-pulse flex items-center gap-1">
                        <AlertCircle size={10} /> Limit: {selectedWire.stock}m
                      </p>
                    )}
                    <button
                      onClick={saveWireToStore}
                      disabled={
                        !isEditable ||
                        actionLoading ||
                        isOverLimit ||
                        !wireSelection.inventory_id ||
                        !wireSelection.length
                      }
                      className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#15467a] disabled:opacity-30 transition-all"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin mx-auto" size={14} />
                      ) : (
                        "Save Wire to Store"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* LOG TABLE */}
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-black text-slate-500 uppercase text-[10px] tracking-widest">
                    Recent Activity
                  </h3>
                </div>
                <div className="p-4">
                  {localLog.length > 0 ? (
                    <table className="w-full">
                      <tbody className="divide-y divide-slate-50">
                        {localLog.map((log, i) => (
                          <tr
                            key={i}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="p-4 text-xs font-black text-[#1a5695] uppercase">
                              {log.brand_name} {log.wire_type}
                            </td>
                            <td className="p-4 text-center text-[10px] font-black">
                              {log.qty}m Issued
                            </td>
                            <td className="p-4 text-right text-emerald-500">
                              <Check size={14} className="ml-auto" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-12 text-center text-slate-300">
                      <PackageOpen
                        size={32}
                        className="mx-auto mb-2 opacity-20"
                      />
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        No wire sent
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* NEXT STEP BUTTON */}
              {isEditable && (
                <div className="pt-4">
                  <button
                    onClick={handleNextStep}
                    className="w-full py-6 bg-emerald-500 text-white rounded-[32px] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
                  >
                    {uL ? (
                      "Moving..."
                    ) : (
                      <>
                        Move to Next Step <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default UpdateWiringLog;
