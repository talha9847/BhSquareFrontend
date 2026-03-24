import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Loader2,
  Layers,
  PlusCircle,
  X,
  PackagePlus,
  Inbox,
  ArrowDownRight,
  Menu,
  Plus,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PrepareKit = () => {
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const customerId = location.state?.customerId;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);

  const [baseKit, setBaseKit] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
  const [inventoryLookup, setInventoryLookup] = useState([]);
  const [modalSearch, setModalSearch] = useState("");

  useEffect(() => {
    if (customerId) fetchMainData();
    else toast.error("No Customer ID found.");
  }, [customerId]);

  const fetchMainData = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/kitready/fetchKitItems/${customerId}`,
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

  const fetchAvailableProducts = async () => {
    setModalLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/kitready/fetchAvailableProducts/${customerId}`,
      );
      if (res.status === 200) setInventoryLookup(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching inventory");
    } finally {
      setModalLoading(false);
    }
  };

  const allItems = useMemo(
    () => [...baseKit, ...extraItems],
    [baseKit, extraItems],
  );

  const stats = useMemo(() => {
    const total = allItems.length;
    const verifiedCount = allItems.filter((i) => i.verified).length;
    const progress =
      total === 0 ? 0 : Math.round((verifiedCount / total) * 100);
    return { total, verifiedCount, progress };
  }, [allItems]);

  const updateQty = (id, delta, isExtra = false) => {
    const updateFn = (prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, (item.qty || 0) + delta);
          if (newQty > item.stock) {
            toast.error(`Stock Limit! Only ${item.stock} available.`);
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
      const res = await axios.post(`${apiUrl}/api/kitready/allocateItem`, {
        kit_item_id: item.id,
        qty: item.qty,
      });
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

  const addItemToKit = async (product) => {
    try {
      const res = await axios.post(`${apiUrl}/api/kitready/addItem`, {
        kit_id: product.kit_id,
        inventory_id: product.id,
      });
      if (res.status === 200) {
        toast.success("Added to kit");
        fetchMainData();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-x-hidden">
      {/* Sidebar Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Kit Ready"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 w-full">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 w-full max-w-[1600px] mx-auto">
          {/* RESPONSIVE HEADER */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-[1000] text-slate-800 tracking-tight uppercase italic flex items-center gap-3">
                  <Layers className="text-[#1a5695]" /> Kit Preparation
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-1.5 w-20 lg:w-32 bg-slate-200 rounded-full overflow-hidden">
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
                  onClick={() => {
                    setIsModalOpen(true);
                    fetchAvailableProducts();
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white border border-slate-200 text-slate-600 hover:border-[#1a5695] transition-all"
                >
                  <PlusCircle size={16} /> Add Product
                </button>

                <button
                  disabled={stats.progress < 100 || tableLoading}
                  className={`px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    stats.progress === 100
                      ? "bg-[#1a5695] text-white shadow-lg"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  Confirm Dispatch
                </button>
              </div>
            </div>
          </div>

          {/* RESPONSIVE DATA VIEW */}
          <div className="bg-white rounded-3xl lg:rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
            {tableLoading ? (
              <div className="flex flex-col items-center justify-center h-[300px] gap-3">
                <Loader2 className="animate-spin text-[#1a5695]" size={32} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                  Syncing...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Mobile/Tablet Card View - Visible on small screens */}
                <div className="block lg:hidden divide-y divide-slate-100">
                  {allItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 ${item.verified ? "bg-emerald-50/20" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-black text-xs text-slate-800 uppercase italic">
                            {item.name}
                          </p>
                          <span className="text-[8px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded uppercase">
                            {item.brand}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black text-slate-400 uppercase">
                            Stock
                          </p>
                          <p className="text-xs font-black text-[#1a5695]">
                            {item.stock}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div
                          className={`flex items-center bg-slate-50 border rounded-lg p-1 ${item.verified ? "opacity-30" : ""}`}
                        >
                          <button
                            disabled={item.verified}
                            onClick={() =>
                              updateQty(item.id, -1, item.is_extra)
                            }
                            className="w-8 h-8 font-bold"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-black">
                            {item.qty || 0}
                          </span>
                          <button
                            disabled={item.verified}
                            onClick={() => updateQty(item.id, 1, item.is_extra)}
                            className="w-8 h-8 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          disabled={item.verified || verifyingId === item.id}
                          onClick={() =>
                            toggleVerify(item.id, item.is_extra, item)
                          }
                          className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border-2 font-black text-[10px] uppercase tracking-tighter transition-all ${
                            item.verified
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          {verifyingId === item.id ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : item.verified ? (
                            "Verified"
                          ) : (
                            "Verify"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View - Hidden on small screens */}
                <table className="hidden lg:table w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-8 py-6">Product</th>
                      <th className="px-8 py-6 text-center">Warehouse</th>
                      <th className="px-8 py-6 text-center">Pick Qty</th>
                      <th className="px-8 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allItems.map((item) => (
                      <KitRowDesktop
                        key={item.id}
                        item={item}
                        updateQty={updateQty}
                        toggleVerify={toggleVerify}
                        isVerifying={verifyingId === item.id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL RESPONSIVE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black uppercase italic text-slate-800 flex items-center gap-2 text-sm lg:text-base">
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
                className="w-full mb-4 p-3 border rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
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
                      className="w-full flex justify-between items-center p-4 border rounded-2xl mb-2 hover:bg-blue-50 active:scale-95 transition-transform"
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
    </div>
  );
};

// Separated Desktop Row for cleaner code
const KitRowDesktop = ({ item, updateQty, toggleVerify, isVerifying }) => (
  <tr
    className={`group transition-colors ${item.verified ? "bg-emerald-50/20" : "hover:bg-slate-50/50"}`}
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
        className={`inline-flex items-center bg-white border rounded-xl p-1 shadow-sm ${item.verified ? "opacity-30" : ""}`}
      >
        <button
          disabled={item.verified}
          onClick={() => updateQty(item.id, -1, item.is_extra)}
          className="w-8 h-8 font-bold"
        >
          -
        </button>
        <span className="px-4 text-sm font-black min-w-[40px]">
          {item.qty || 0}
        </span>
        <button
          disabled={item.verified}
          onClick={() => updateQty(item.id, 1, item.is_extra)}
          className="w-8 h-8 font-bold"
        >
          +
        </button>
      </div>
    </td>
    <td className="px-8 py-6 text-right">
      <button
        disabled={item.verified || isVerifying}
        onClick={() => toggleVerify(item.id, item.is_extra, item)}
        className={`w-10 h-10 rounded-xl border-2 inline-flex items-center justify-center transition-all ${
          item.verified
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "bg-white border-slate-100 text-slate-200 hover:border-blue-200 hover:text-blue-400"
        }`}
      >
        {isVerifying ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <CheckCircle2 size={20} />
        )}
      </button>
    </td>
  </tr>
);

export default PrepareKit;
