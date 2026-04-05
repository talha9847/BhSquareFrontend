import React, { useEffect, useState, useMemo } from "react";
import {
  Layers,
  PlusCircle,
  X,
  PackagePlus,
  CheckCircle2,
  Loader2,
  Plus,
  PenTool,
  Trash2,
  Minus,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PrepareKit = () => {
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const customerId = location.state?.customerId;
  const navigate = useNavigate();

  // Loading States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Data States
  const [baseKit, setBaseKit] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
  const [inventoryLookup, setInventoryLookup] = useState([]);
  const [modalSearch, setModalSearch] = useState("");

  const [panelQty, setPanelQty] = useState(0);
  const [inverterQty, setInverterQty] = useState(0);

  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [panelSerials, setPanelSerials] = useState([]);
  const [inverterSerials, setInverterSerials] = useState([]);
  const [confirmLoad, setConfirmLoad] = useState(false);
  const [kitStatus, setKitStatus] = useState(false);
  const [adjustmentVal, setAdjustmentVal] = useState("");
  const [adjustmentMode, setAdjustmentMode] = useState("add");
  useEffect(() => {
    if (customerId) {
      fetchMainData();
      fetchPanelAndInverterQuantities();
    } else {
      navigate("/dispatch");
    }
  }, [customerId]);

  const fetchMainData = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `/api/kitready/fetchKitItems/${customerId}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        const data = res.data.data || [];
        setBaseKit(data.filter((item) => !item.is_extra));
        setExtraItems(data.filter((item) => item.is_extra));
      }
    } catch (error) {
      toast.error("Failed to load kit items");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchPanelAndInverterQuantities = async () => {
    try {
      const res = await axios.get(
        `/api/kitready/getPanelAndInventer/${customerId}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        const pQty = parseInt(res.data.data.panel_qty) || 0;
        const iQty = parseInt(res.data.data.inverter_qty) || 0;
        if (res.data.data.kit_status === "done") setKitStatus(true);
        setPanelQty(pQty);
        setInverterQty(iQty);
        setPanelSerials(new Array(pQty).fill(""));
        setInverterSerials(new Array(iQty).fill(""));
      }
    } catch (error) {
      console.error("Error fetching quantities", error);
    }
  };

  // --- DELETE WITH LOADER ---
  const handleRemoveProduct = async (item) => {
    Swal.fire({
      title: "REMOVE PRODUCT?",
      text: `Are you sure you want to delete ${item.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1a5695",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "YES, DELETE",
      showLoaderOnConfirm: true, // This enables the loader inside SWAL
      background: "#fff",
      customClass: {
        title: "font-[1000] italic uppercase text-slate-800 tracking-tight",
        popup: "rounded-[32px] border-none shadow-2xl",
        confirmButton:
          "rounded-xl font-black text-[10px] uppercase tracking-widest px-6 py-3",
        cancelButton:
          "rounded-xl font-black text-[10px] uppercase tracking-widest px-6 py-3",
      },
      preConfirm: async () => {
        try {
          const response = await axios.delete(
            `/api/dispatch/deleteKitItem/${item.id}`,
            { withCredentials: true },
          );
          return response;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Item removed");
        fetchMainData();
      }
    });
  };

  // --- EDIT MODAL LOGIC ---
  const openEditModal = (item) => {
    setEditingItem({ ...item }); // Clone item to avoid direct state mutation
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const val = parseInt(adjustmentVal);

    if (!val || val <= 0) {
      return toast.error("Please enter a valid quantity");
    }

    // 1. Determine the signed value to send (e.g., +6 or -3)
    const deltaValue = adjustmentMode === "add" ? val : -val;

    // 2. Safety Check: Don't allow reducing more than what is already picked
    const currentQty = editingItem.qty || 0;
    if (adjustmentMode === "sub" && val > currentQty) {
      return toast.error(
        `Cannot reduce by ${val}. Only ${currentQty} currently in kit.`,
      );
    }

    // 3. Stock Check: If adding, ensure warehouse has enough
    if (adjustmentMode === "add" && currentQty + val > editingItem.stock) {
      return toast.error(
        `Warehouse limit exceeded! Max available: ${editingItem.stock}`,
      );
    }

    setModalLoading(true);
    console.log(deltaValue);
    try {
      const res = await axios.put(
        `/api/dispatch/updateKitItemQty`,
        {
          kitItemId: editingItem.id,
          qty: deltaValue,
        },
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast.success(
          `Inventory ${adjustmentMode === "add" ? "increased" : "decreased"} successfully`,
        );
        setIsEditModalOpen(false);
        setAdjustmentVal(""); // Clear input
        fetchMainData(); // Refresh table
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setModalLoading(false);
    }
  };

  const updateQty = (id, delta, isExtra = false) => {
    const updateFn = (prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, (item.qty || 0) + delta);
          if (newQty > item.stock) {
            toast.error(`Only ${item.stock} in stock!`);
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      });
    isExtra ? setExtraItems(updateFn) : setBaseKit(updateFn);
  };

  const toggleVerify = async (id, isExtra, item) => {
    if (item.verified || item.qty <= 0) return;
    setVerifyingId(id);
    try {
      const res = await axios.post(
        `/api/kitready/allocateItem`,
        {
          kit_item_id: item.id,
          qty: item.qty,
        },
        { withCredentials: true },
      );
      if (res.status === 200) {
        toast.success("Verified and allocated.");
        await fetchMainData();
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setVerifyingId(null);
    }
  };

  const allItems = useMemo(
    () => [...baseKit, ...extraItems],
    [baseKit, extraItems],
  );

  const groupedItems = useMemo(() => {
    return allItems.reduce((acc, item) => {
      const categoryName = item.category || "Uncategorized";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(item);
      return acc;
    }, {});
  }, [allItems]);

  const stats = useMemo(() => {
    const total = allItems.length;
    const verifiedCount = allItems.filter((i) => i.verified).length;
    return {
      total,
      verifiedCount,
      progress: total === 0 ? 0 : Math.round((verifiedCount / total) * 100),
    };
  }, [allItems]);

  // Handle Inventory Adding
  const fetchAvailableProducts = async () => {
    setModalLoading(true);
    try {
      const res = await axios.get(
        `/api/kitready/fetchAvailableProducts/${customerId}`,
        { withCredentials: true },
      );
      if (res.status === 200) setInventoryLookup(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching inventory");
    } finally {
      setModalLoading(false);
    }
  };

  const addItemToKit = async (product) => {
    try {
      setIsModalOpen(false);
      const res = await axios.post(
        `/api/kitready/addItem`,
        {
          kit_id: product.kit_id,
          inventory_id: product.id,
        },
        { withCredentials: true },
      );
      if (res.status === 201) {
        toast.success("Added to kit");
        fetchMainData();
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleOpenDispatch = () => {
    if (panelSerials.length !== panelQty)
      setPanelSerials(new Array(panelQty).fill(""));
    if (inverterSerials.length !== inverterQty)
      setInverterSerials(new Array(inverterQty).fill(""));
    setIsDispatchModalOpen(true);
  };

  const handleFinalDispatch = async () => {
    setConfirmLoad(true);

    if (!customerId) {
      toast.error("customer not found.");
      setConfirmLoad(false);
      return;
    }

    const panelItem = allItems.find((item) => item.categoryId == 1);

    const inverterItem = allItems.find((item) => item.categoryId === 3);
    console.log(panelItem);
    try {
      const res = await axios.post(
        `/api/kitready/addCustomerSerials`,
        {
          customerId,
          panelId: panelItem.id,
          inverterId: inverterItem.id,
        },
        { withCredentials: true },
      );
      if (res.status === 201) navigate("/dispatch");
    } catch (error) {
      setConfirmLoad(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-x-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Kit Ready"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 w-full">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl lg:text-2xl font-[1000] text-slate-800 tracking-tight uppercase italic flex items-center gap-3">
                <Layers className="text-[#1a5695]" /> Kit Preparation
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${stats.progress}%` }}
                  />
                </div>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
                  {stats.verifiedCount}/{stats.total} Verified
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                disabled={tableLoading || kitStatus}
                onClick={() => {
                  setIsModalOpen(true);
                  fetchAvailableProducts();
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white border border-slate-200 text-slate-600 hover:border-[#1a5695] transition-all"
              >
                <PlusCircle size={16} /> Add Product
              </button>

              <button
                disabled={stats.progress < 100 || tableLoading || kitStatus}
                onClick={handleOpenDispatch}
                className={`px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  stats.progress === 100 && !kitStatus
                    ? "bg-[#1a5695] text-white shadow-lg cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {kitStatus ? "Already Dispatched" : "Confirm Dispatch"}
              </button>
            </div>
          </div>

          {/* Grouped Table */}
          <div className="space-y-10 min-h-[400px]">
            {tableLoading ? (
              <div className="bg-white rounded-[40px] border border-slate-200 flex flex-col items-center justify-center h-[300px] gap-3">
                <Loader2 className="animate-spin text-[#1a5695]" size={32} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                  Syncing...
                </p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([categoryName, items]) => (
                <div
                  key={categoryName}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="p-1.5 bg-[#1a5695] rounded-lg text-white">
                      <Layers size={14} />
                    </div>
                    <h2 className="text-xs font-[1000] text-slate-800 uppercase tracking-widest italic">
                      {categoryName}
                    </h2>
                    <div className="flex-1 h-[1px] bg-slate-200"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">
                      {items.length} Products
                    </span>
                  </div>

                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-slate-50/50">
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-5">Product</th>
                            <th className="px-8 py-5 text-center">Warehouse</th>
                            <th className="px-8 py-5 text-center">Pick Qty</th>
                            <th className="px-8 py-5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {items.map((item) => (
                            <KitRowDesktop
                              key={item.id}
                              item={item}
                              updateQty={updateQty}
                              toggleVerify={toggleVerify}
                              isVerifying={verifyingId === item.id}
                              onRemove={handleRemoveProduct}
                              onEdit={openEditModal}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* INVENTORY ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black uppercase italic text-slate-800 flex items-center gap-2 text-sm">
                <PackagePlus className="text-blue-600" /> Add to Kit
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <input
                type="text"
                placeholder="Search..."
                className="w-full mb-4 p-3 border rounded-xl text-xs font-bold"
                onChange={(e) => setModalSearch(e.target.value)}
              />
              {modalLoading ? (
                <Loader2 className="animate-spin mx-auto my-10" />
              ) : (
                inventoryLookup
                  .filter((p) =>
                    p.name.toLowerCase().includes(modalSearch.toLowerCase()),
                  )
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addItemToKit(p)}
                      className="w-full flex justify-between items-center p-4 border rounded-2xl mb-2 hover:bg-blue-50"
                    >
                      <div className="text-left">
                        <p className="font-black text-xs uppercase">{p.name}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">
                          {p.brand} • {p.stock} In Stock
                        </p>
                      </div>
                      <Plus size={18} className="text-blue-600" />
                    </button>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT QUANTITY MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black uppercase italic text-slate-800 flex items-center gap-2 text-xs">
                <PenTool className="text-[#1a5695]" size={16} /> Edit Inventory
              </h3>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {editingItem?.brand}
                </p>
                <h4 className="text-lg font-[1000] text-slate-800 uppercase italic tracking-tight">
                  {editingItem?.name}
                </h4>
                <p className="text-[9px] font-bold text-[#1a5695] uppercase mt-2">
                  Currently Picked: {editingItem?.qty}
                </p>
              </div>

              {/* MODE TOGGLES + INPUT */}
              <div className="flex flex-col gap-4">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setAdjustmentMode("add")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${
                      adjustmentMode === "add"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    <Plus size={14} /> Increase
                  </button>
                  <button
                    onClick={() => setAdjustmentMode("sub")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${
                      adjustmentMode === "sub"
                        ? "bg-white text-red-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    <Minus size={14} /> Decrease
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={adjustmentVal}
                    onChange={(e) => setAdjustmentVal(e.target.value)}
                    placeholder="Enter Value (e.g. 6)"
                    className={`w-full border-2 rounded-2xl py-5 px-6 text-center text-3xl font-[1000] outline-none transition-all ${
                      adjustmentMode === "add"
                        ? "focus:border-emerald-500/30 text-emerald-700"
                        : "focus:border-red-500/30 text-red-700"
                    } bg-slate-50 border-slate-100`}
                  />
                </div>
              </div>

              {/* FINAL UPDATE BUTTON AT BOTTOM */}
              <div className="pt-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={modalLoading || !adjustmentVal}
                  className={`w-full py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${
                    adjustmentMode === "add"
                      ? "bg-emerald-600 shadow-emerald-200"
                      : "bg-red-600 shadow-red-200"
                  } hover:scale-[1.02] active:scale-95 disabled:opacity-50`}
                >
                  {modalLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    `Update ${adjustmentMode === "add" ? "Plus" : "Minus"} ${adjustmentVal || 0}`
                  )}
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full mt-2 py-2 text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH MODAL - (Logic preserved from original) */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-[1000] uppercase italic text-slate-800 flex items-center gap-2 text-lg">
                <CheckCircle2 className="text-emerald-500" /> Final Dispatch
              </h3>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white border border-slate-200 text-slate-500"
              >
                Go Back
              </button>
              <button
                onClick={handleFinalDispatch}
                className="flex-[2] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-[#1a5695] text-white shadow-lg"
              >
                {confirmLoad ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                    Dispatching...
                  </>
                ) : (
                  "Confirm & Dispatch"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KitRowDesktop = ({
  item,
  updateQty,
  toggleVerify,
  isVerifying,
  onRemove,
  onEdit,
}) => (
  <tr
    className={`group transition-all duration-300 ${item.verified ? "bg-emerald-50/20" : "hover:bg-slate-50/50"}`}
  >
    <td className="px-8 py-6">
      <div className="flex flex-col">
        <p className="font-black text-sm text-slate-800 uppercase italic mb-1">
          {item.name}
        </p>
        <span className="text-[9px] font-black bg-slate-800 text-white px-2 py-0.5 rounded w-fit uppercase">
          {item.brand}
        </span>
      </div>
    </td>
    <td className="px-8 py-6 text-center">
      <span
        className={`text-xs font-black ${item.verified ? "text-emerald-600" : "text-slate-300"}`}
      >
        {item.stock}
      </span>
    </td>
    <td className="px-8 py-6 text-center">
      <div
        className={`inline-flex items-center bg-white border rounded-xl p-1 shadow-sm transition-opacity ${item.verified ? "opacity-30 grayscale pointer-events-none" : ""}`}
      >
        <button
          disabled={item.verified}
          onClick={() => updateQty(item.id, -1, item.is_extra)}
          className="w-8 h-8 font-bold hover:text-[#1a5695]"
        >
          -
        </button>
        <span className="px-4 text-sm font-black min-w-[40px]">
          {item.qty || 0}
        </span>
        <button
          disabled={item.verified}
          onClick={() => updateQty(item.id, 1, item.is_extra)}
          className="w-8 h-8 font-bold hover:text-[#1a5695]"
        >
          +
        </button>
      </div>
    </td>
    <td className="px-8 py-6 text-right">
      <div className="flex items-center justify-end gap-2">
        {/* If item isn't verified, show delete icon */}
        {!item.verified && (
          <button
            onClick={() => onRemove(item)}
            className="w-10 h-10 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
          >
            <Trash2 size={18} />
          </button>
        )}

        {/* If item IS verified, show the Edit/Pen icon to modify quantity */}
        {item.verified && (
          <button
            onClick={() => onEdit(item)}
            className="w-10 h-10 rounded-xl border border-slate-200 text-slate-400 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all flex items-center justify-center bg-white"
          >
            <PenTool size={16} />
          </button>
        )}

        {/* Action / Verify Button */}
        <button
          disabled={item.verified || isVerifying}
          onClick={() => toggleVerify(item.id, item.is_extra, item)}
          className={`w-10 h-10 rounded-xl border-2 inline-flex items-center justify-center transition-all ${
            item.verified
              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
              : "bg-white border-slate-100 text-slate-200 hover:border-[#1a5695] hover:text-[#1a5695]"
          }`}
        >
          {isVerifying ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CheckCircle2 size={20} />
          )}
        </button>
      </div>
    </td>
  </tr>
);

export default PrepareKit;
