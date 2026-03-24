import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Loader2,
  PackageCheck,
  Minus,
  Plus,
  AlertTriangle,
  ArrowDownRight,
  PlusCircle,
  X,
  Layers,
  PackagePlus,
  Inbox,
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

  // States for Data
  const [baseKit, setBaseKit] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
  const [inventoryLookup, setInventoryLookup] = useState([]);
  const [modalSearch, setModalSearch] = useState("");

  // Initial Data Fetch
  useEffect(() => {
    if (customerId) {
      fetchMainData();
    } else {
      toast.error("No Customer ID found. Redirecting...");
    }
  }, [customerId]);

  const fetchMainData = async () => {
    setTableLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/kitready/fetchKitItems/${customerId}`,
      );
      if (res.status === 200) {
        // Assuming API separates core and extra, or we handle it based on a flag
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
      if (res.status === 200) {
        setInventoryLookup(res.data.data || []);
      }
    } catch (error) {
      toast.error("Error fetching inventory");
    } finally {
      setModalLoading(false);
    }
  };

  // Logic: Stats & Math
  const allItems = useMemo(
    () => [...baseKit, ...extraItems],
    [baseKit, extraItems],
  );

  const stats = useMemo(() => {
    const total = allItems.length;
    const verified = allItems.filter((i) => i.verified && i.qty > 0).length;
    const progress = total === 0 ? 0 : Math.round((verified / total) * 100);
    return { total, verified, progress };
  }, [allItems]);

  // Actions
  const updateQty = (id, delta, isExtra = false) => {
    const updateFn = (prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, (item.qty || 0) + delta);
          if (newQty > item.stock) {
            toast.error(`Stock Limit! Only ${item.stock} left.`);
            return item;
          }
          return { ...item, qty: newQty, verified: false };
        }
        return item;
      });

    if (isExtra) setExtraItems(updateFn);
    else setBaseKit(updateFn);
  };

  const toggleVerify = (id, isExtra = false) => {
    const targetList = isExtra ? extraItems : baseKit;
    const item = targetList.find((i) => i.id === id);
    if (!item || item.qty === 0) {
      toast.warning("Qty is 0. Cannot verify.");
      return;
    }
    const updateFn = (prev) =>
      prev.map((i) => (i.id === id ? { ...i, verified: !i.verified } : i));

    if (isExtra) setExtraItems(updateFn);
    else setBaseKit(updateFn);
  };

  const addItemToKit = async (product) => {
    try {
      const res = await axios.post(`${apiUrl}/api/kitready/addItem`, {
        kit_id: product.kit_id,
        inventory_id: product.id,
      });

      if (res.status === 200) {
        toast.success(`${product.name} added to kit`);
        fetchMainData(); // Refresh table
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  // Filtered Modal Content
  const filteredInventory = inventoryLookup.filter(
    (item) =>
      item.name?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      item.brand?.toLowerCase().includes(modalSearch.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Kit Ready"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-[1000] text-slate-800 tracking-tight uppercase italic flex items-center gap-3">
                <Layers className="text-[#1a5695]" /> Kit Preparation
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${stats.progress}%` }}
                  ></div>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {stats.verified} / {stats.total} Components Verified
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  fetchAvailableProducts();
                }}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white border border-slate-200 text-slate-600 hover:border-[#1a5695] transition-all"
              >
                <PlusCircle size={18} /> Add Extra Product
              </button>

              <button
                disabled={stats.progress < 100 || tableLoading}
                className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                  stats.progress === 100
                    ? "bg-[#1a5695] text-white shadow-xl scale-105"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                Confirm Dispatch
              </button>
            </div>
          </div>

          {/* MAIN TABLE */}
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
            {tableLoading ? (
              <div className="flex flex-col items-center justify-center h-[400px] gap-3">
                <Loader2 className="animate-spin text-[#1a5695]" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                  Syncing Inventory...
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-6">Product Identity</th>
                    <th className="px-8 py-6 text-center">Warehouse Stock</th>
                    <th className="px-8 py-6 text-center">Pick Quantity</th>
                    <th className="px-8 py-6 text-center italic text-[#1a5695]">
                      Remaining
                    </th>
                    <th className="px-8 py-6 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {baseKit.map((item) => (
                    <KitRow
                      key={item.id}
                      item={item}
                      updateQty={updateQty}
                      toggleVerify={toggleVerify}
                      isExtra={false}
                    />
                  ))}

                  {extraItems.length > 0 && (
                    <>
                      <tr className="bg-blue-50/30">
                        <td
                          colSpan="5"
                          className="px-8 py-3 text-[9px] font-black text-blue-500 uppercase tracking-widest border-y border-blue-100"
                        >
                          Additional Custom Items
                        </td>
                      </tr>
                      {extraItems.map((item) => (
                        <KitRow
                          key={item.id}
                          item={item}
                          updateQty={updateQty}
                          toggleVerify={toggleVerify}
                          isExtra={true}
                        />
                      ))}
                    </>
                  )}

                  {allItems.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <Inbox
                          className="mx-auto text-slate-200 mb-2"
                          size={48}
                        />
                        <p className="text-slate-400 font-bold text-sm">
                          No items found in this kit.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* SEARCHABLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black uppercase italic text-slate-800 flex items-center gap-2">
                  <PackagePlus className="text-blue-600" /> Add to Kit
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              {/* SEARCH INPUT */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search product or brand..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500 transition-all"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {modalLoading ? (
                <div className="py-10 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Searching Store...
                  </p>
                </div>
              ) : filteredInventory.length > 0 ? (
                filteredInventory.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addItemToKit(product)}
                    className="w-full flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="text-left">
                      <p className="font-black text-sm text-slate-800 uppercase">
                        {product.name}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {product.brand} •{" "}
                        <span
                          className={product.stock < 5 ? "text-red-500" : ""}
                        >
                          {product.stock} in stock
                        </span>
                      </span>
                    </div>
                    <Plus
                      className="text-slate-300 group-hover:text-blue-600"
                      size={20}
                    />
                  </button>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                  No products match your search
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KitRow = ({ item, updateQty, toggleVerify, isExtra }) => {
  const remaining = (item.stock || 0) - (item.qty || 0);
  const isLowStock = remaining < 5;

  return (
    <tr
      className={`group transition-colors ${item.verified ? "bg-emerald-50/30" : "hover:bg-slate-50/50"}`}
    >
      <td className="px-8 py-6">
        <div className="flex flex-col">
          <p className="font-black text-sm text-slate-800 uppercase italic leading-none mb-1">
            {item.name}
          </p>
          <span className="text-[9px] font-black bg-slate-800 text-white px-2 py-0.5 rounded w-fit uppercase tracking-tighter">
            {item.brand}
          </span>
        </div>
      </td>
      <td className="px-8 py-6 text-center">
        <span className="text-xs font-black text-slate-300">{item.stock}</span>
      </td>
      <td className="px-8 py-6 text-center">
        <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => updateQty(item.id, -1, isExtra)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 font-bold"
          >
            -
          </button>
          <span className="text-sm font-black text-slate-800 px-4 min-w-[40px]">
            {item.qty || 0}
          </span>
          <button
            onClick={() => updateQty(item.id, 1, isExtra)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 font-bold"
          >
            +
          </button>
        </div>
      </td>
      <td className="px-8 py-6 text-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isLowStock ? "bg-red-50 border-red-100 text-red-600" : "bg-slate-50 border-slate-100 text-slate-600"}`}
        >
          <ArrowDownRight
            size={14}
            className={isLowStock ? "animate-pulse" : ""}
          />
          <span className="text-xs font-[1000]">{remaining}</span>
          {isLowStock && <AlertTriangle size={12} />}
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <button
          onClick={() => toggleVerify(item.id, isExtra)}
          className={`w-10 h-10 rounded-xl border-2 inline-flex items-center justify-center transition-all ${
            item.verified
              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200"
              : "bg-white border-slate-100 text-slate-200 hover:border-blue-200 hover:text-blue-300"
          }`}
        >
          <CheckCircle2 size={20} />
        </button>
      </td>
    </tr>
  );
};

export default PrepareKit;
