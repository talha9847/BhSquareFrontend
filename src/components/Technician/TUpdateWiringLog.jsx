import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  Loader2,
  PackageOpen,
  Check,
  CheckCircle2,
  Trash2,
  Box,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import Swal from "sweetalert2";

const TUpdateWiringLog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const wiringId = location.state?.wiring_id;
  const customerId = location.state?.customer_id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [uL, setUL] = useState(false);

  // Data States
  const [inventory, setInventory] = useState([]);
  const [kitItems, setKitItems] = useState([]);
  const [localLog, setLocalLog] = useState([]); // Issued Wires
  const [unusedLogs, setUnusedLogs] = useState([]); // Database Returns

  // Form States
  const [wireSelection, setWireSelection] = useState({
    inventory_id: "",
    length: "",
  });
  const [unusedSelection, setUnusedSelection] = useState({
    kit_item_id: "",
    qty: "",
  });
  const [done, setDone] = useState("");

  const isEditable = done === "pending";

  // --- API CALLS ---

  const fetchData = useCallback(async () => {
    if (!wiringId) return;
    setPageLoading(true);
    try {
      const [invRes, issuedRes, unusedRes, kitRes] = await Promise.all([
        axios.get(`/api/wiring/getAvailableWireInventory/${wiringId}`, {
          withCredentials: true,
        }),
        axios.get(`/api/wiring/fetchIssuedWires/${wiringId}`, {
          withCredentials: true,
        }),
        axios.get(
          `/api/kitready/getUnusedInventoryByCustomerId/${customerId}`,
          {
            withCredentials: true,
          },
        ),
        axios.get(`/api/kitready/getKitByCustomerId/${customerId}`, {
          withCredentials: true,
        }),
      ]);

      setInventory(invRes.data.data || []);
      setLocalLog(issuedRes.data.data || []);
      setUnusedLogs(unusedRes.data.data || []);
      setKitItems(kitRes.data.data || []);
      setDone(issuedRes.data.extraData?.inventory_status || "pending");
    } catch (error) {
      toast.error("Failed to load inventory data");
    } finally {
      setPageLoading(false);
    }
  }, [wiringId, customerId]);

  useEffect(() => {
    if (!customerId || !wiringId) return navigate("/technician/wiring");
    fetchData();
  }, [fetchData, navigate, customerId, wiringId]);

  // --- LOGIC HELPERS ---

  const selectedWire = inventory.find(
    (i) => i.id === Number(wireSelection.inventory_id),
  );
  const isWireOverLimit =
    selectedWire && Number(wireSelection.length) > selectedWire.stock;

  const selectedKitItem = kitItems.find(
    (i) => i.id === Number(unusedSelection.kit_item_id),
  );
  const isUnusedOverLimit =
    selectedKitItem && Number(unusedSelection.qty) > selectedKitItem.qty;

  // --- ACTIONS ---

  const saveWireToStore = async () => {
    if (
      !isEditable ||
      !wireSelection.inventory_id ||
      !wireSelection.length ||
      isWireOverLimit
    )
      return;
    setActionLoading(true);
    try {
      await axios.post(
        `/api/wiring/createWiringItem`,
        {
          wiring_id: wiringId,
          wire_inventory_id: Number(wireSelection.inventory_id),
          qty: Number(wireSelection.length),
        },
        { withCredentials: true },
      );

      toast.success("Wire Issued");
      setWireSelection({ inventory_id: "", length: "" });
      fetchData(); // Refresh list and stock
    } catch (e) {
      toast.error("Wire issuance failed");
    } finally {
      setActionLoading(false);
    }
  };

  const logUnusedMaterial = async () => {
    if (
      !unusedSelection.kit_item_id ||
      !unusedSelection.qty ||
      isUnusedOverLimit
    )
      return;
    setActionLoading(true);

    try {
      const payload = {
        customer_id: Number(customerId),
        kit_item_id: Number(unusedSelection.kit_item_id),
        inventory_id: selectedKitItem?.inventory_id,
        unused_qty: Number(unusedSelection.qty),
      };

      await axios.post(`/api/kitready/createUnusedInventory`, payload, {
        withCredentials: true,
      });

      toast.success("Return logged");
      setUnusedSelection({ kit_item_id: "", qty: "" });
      fetchData(); // Refresh the list from DB
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to log unused material",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUnused = async (unusedId, customer_id, inventory_id) => {
    Swal.fire({
      title: "Remove Logged Return?",
      text: "This will revert the status of this item in the customer's kit.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a5695",
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "Yes, Delete",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await axios.delete(
            `/api/kitready/deleteUnusedInventory`,
            {
              data: {
                unusedId: Number(unusedId),
                customer_id: Number(customer_id),
                inventory_id: Number(inventory_id),
              },
              withCredentials: true,
            },
          );
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(
            `Delete failed: ${error.response?.data?.message || "Server Error"}`,
          );
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        toast.info("Item restored to kit inventory");
        fetchData(); // Refresh the dynamic lists
      }
    });
  };

  const handleNextStep = async () => {
    try {
      setUL(true);
      toast.info("Moving to next stage...");
      console.log(wiringId);
      const res = await axios.put(
        `/api/wiring/updateInventoryStatus/${wiringId}`,
        {},
        { withCredentials: true },
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
                  Finalized
                </span>
              </div>
            )}
          </div>

          {pageLoading ? (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border border-slate-200 shadow-sm">
              <Loader2 className="animate-spin text-[#1a5695] mb-2" />
              <p className="text-[10px] font-black text-slate-300 uppercase">
                Syncing Data...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WIRE BOX */}
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
                      Issue Wire
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <select
                      disabled={!isEditable || actionLoading}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none"
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
                    <input
                      disabled={!isEditable || actionLoading}
                      type="number"
                      placeholder="Length (MTR)"
                      className={`w-full p-4 bg-slate-50 border rounded-2xl font-black text-xs outline-none ${isWireOverLimit ? "border-red-500 bg-red-50" : "border-slate-100"}`}
                      value={wireSelection.length}
                      onChange={(e) =>
                        setWireSelection({
                          ...wireSelection,
                          length: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={saveWireToStore}
                      disabled={
                        !isEditable ||
                        actionLoading ||
                        isWireOverLimit ||
                        !wireSelection.inventory_id
                      }
                      className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex justify-center"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        "Save Wire"
                      )}
                    </button>
                  </div>
                </div>

                {/* UNUSED BOX */}
                <div
                  className={`bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm ${!isEditable && "opacity-60"}`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Box
                      size={18}
                      className="text-orange-500"
                      fill="currentColor"
                    />
                    <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">
                      Unused Material
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <select
                      disabled={!isEditable || actionLoading}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-xs outline-none"
                      value={unusedSelection.kit_item_id}
                      onChange={(e) =>
                        setUnusedSelection({
                          ...unusedSelection,
                          kit_item_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Sent Item...</option>
                      {kitItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.qty} sent)
                        </option>
                      ))}
                    </select>
                    <input
                      disabled={!isEditable || actionLoading}
                      type="number"
                      placeholder="Unused Qty"
                      className={`w-full p-4 bg-slate-50 border rounded-2xl font-black text-xs outline-none ${isUnusedOverLimit ? "border-red-500 bg-red-50" : "border-slate-100"}`}
                      value={unusedSelection.qty}
                      onChange={(e) =>
                        setUnusedSelection({
                          ...unusedSelection,
                          qty: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={logUnusedMaterial}
                      disabled={
                        !isEditable ||
                        actionLoading ||
                        !unusedSelection.kit_item_id ||
                        isUnusedOverLimit
                      }
                      className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex justify-center"
                    >
                      {actionLoading ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        "Log Unused"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* UNUSED LOGS LIST */}
              {unusedLogs.length > 0 && (
                <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden mt-6">
                  <div className="p-4 bg-orange-50/50 border-b border-orange-100">
                    <h3 className="font-black text-orange-600 uppercase text-[10px] tracking-widest">
                      Logged Returns
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {unusedLogs.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                      >
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase">
                            {item.name || "Item"}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">
                            {item.unused_qty} units returned
                          </p>
                        </div>
                        <button
                          disabled={actionLoading}
                          onClick={() =>
                            handleDeleteUnused(
                              item.id,
                              customerId,
                              item.inventory_id,
                            )
                          }
                          className="text-red-400 hover:text-red-600 transition-colors p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RECENT ACTIVITY (WIRES) */}
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                  <h3 className="font-black text-slate-500 uppercase text-[10px] tracking-widest">
                    Issued Wire History
                  </h3>
                </div>
                <div className="p-4">
                  {localLog.length > 0 ? (
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-slate-50">
                        {localLog.map((log, i) => (
                          <tr
                            key={i}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="p-4 text-xs font-black text-[#1a5695] uppercase">
                              {log.brand_name} {log.wire_type}
                            </td>
                            <td className="p-4 text-[10px] font-black">
                              {log.qty}m Issued
                            </td>
                            <td className="p-4 text-right">
                              <Check
                                size={14}
                                className="ml-auto text-emerald-500"
                              />
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
                        No wires logged
                      </p>
                    </div>
                  )}
                </div>
              </div>

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

export default TUpdateWiringLog;
