import React, { useEffect, useState, useMemo } from "react";
import {
  Layers,
  PlusCircle,
  X,
  PackagePlus,
  Inbox,
  CheckCircle2,
  Loader2,
  Plus,
  PenTool,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PrepareKit = () => {
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const customerId = location.state?.customerId;
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);

  const [baseKit, setBaseKit] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
  const [inventoryLookup, setInventoryLookup] = useState([]);
  const [modalSearch, setModalSearch] = useState("");

  const [panelQty, setPanelQty] = useState(0);
  const [inverterQty, setInverterQty] = useState(0);

  // --- DISPATCH LOGIC ---
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [panelSerials, setPanelSerials] = useState([]);
  const [inverterSerials, setInverterSerials] = useState([]);
  const [confirmLoad, setConfirmLoad] = useState(false);
  const [kitStatus, setKitStatus] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchMainData();
      fetchPanelAndInverterQuantities();
    } else {
      navigate("/dispatch");
    }
  }, [customerId]);

  const fetchPanelAndInverterQuantities = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/kitready/getPanelAndInventer/${customerId}`,
      );
      if (res.status === 200) {
        const pQty = parseInt(res.data.data.panel_qty) || 0;
        const iQty = parseInt(res.data.data.inverter_qty) || 0;
        console.log(res.data.data);
        if (res.data.data.kit_status == "done") {
          setKitStatus(true);
        }
        setPanelQty(pQty);
        setInverterQty(iQty);

        // Pre-initialize the serial arrays
        setPanelSerials(new Array(pQty).fill(""));
        setInverterSerials(new Array(iQty).fill(""));
      }
    } catch (error) {
      console.error("Error fetching quantities", error);
    }
  };

  const handleOpenDispatch = () => {
    // Safety check: ensure arrays match the quantities
    if (panelSerials.length !== panelQty) {
      setPanelSerials(new Array(panelQty).fill(""));
    }
    if (inverterSerials.length !== inverterQty) {
      setInverterSerials(new Array(inverterQty).fill(""));
    }
    setIsDispatchModalOpen(true);
  };

  const handleFinalDispatch = async () => {
    setConfirmLoad(true);
    const panelsFilled = panelSerials.every((s) => s.trim() !== "");
    const invertersFilled = inverterSerials.every((s) => s.trim() !== "");

    if (!panelsFilled || !invertersFilled) {
      toast.error("Please fill all serial numbers.");
      return;
    }
    try {
      const res = await axios.post(
        `${apiUrl}/api/kitready/addCustomerSerials`,
        {
          customerId: customerId,
          panelSerials: panelSerials,
          inverterSerials: inverterSerials,
        },
      );
      if (res.status == 201) {
        navigate("/customers");
      }
    } catch (error) {
      setConfirmLoad(false);
    }
  };

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
      setIsModalOpen(false);
      const res = await axios.post(`${apiUrl}/api/kitready/addItem`, {
        kit_id: product.kit_id,
        inventory_id: product.id,
      });
      if (res.status === 201) {
        toast.success("Added to kit");
        fetchMainData();
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-x-hidden">
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
                  disabled={stats.progress < 100 || tableLoading || kitStatus}
                  onClick={handleOpenDispatch}
                  className={`px-4 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    stats.progress === 100
                      ? "bg-[#1a5695] text-white shadow-lg cursor-pointer"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {kitStatus ? "Already Dispatched" : "Confrim Dispatch"}
                </button>
              </div>
            </div>
          </div>

          {/* Table Rendering */}
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
                <table className="w-full text-left border-separate border-spacing-0">
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

      {/* INVENTORY MODAL - Same as before */}
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

      {/* DISPATCH SERIALS MODAL - Updated with Grid Layout */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-[1000] uppercase italic text-slate-800 flex items-center gap-2 text-lg">
                  <CheckCircle2 className="text-emerald-500" /> Final Dispatch
                </h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-10">
              {/* Solar Panels Grid */}
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <h3 className="text-[10px] font-black text-[#1a5695] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <PenTool size={14} /> Enter {panelQty} Panel Serial Numbers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {panelSerials.map((serial, index) => (
                    <div key={`panel-field-${index}`} className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                        Panel #{index + 1}
                      </label>
                      <input
                        type="text"
                        value={serial}
                        placeholder={`Serial ${index + 1}`}
                        onChange={(e) => {
                          const newArr = [...panelSerials];
                          newArr[index] = e.target.value;
                          setPanelSerials(newArr);
                        }}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-[#1a5695] transition-all shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Inverters Grid */}
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <h3 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <PenTool size={14} /> Enter {inverterQty} Inverter Serial
                  Numbers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {inverterSerials.map((serial, index) => (
                    <div key={`inverter-field-${index}`} className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                        Inverter #{index + 1}
                      </label>
                      <input
                        type="text"
                        value={serial}
                        placeholder={`Serial ${index + 1}`}
                        onChange={(e) => {
                          const newArr = [...inverterSerials];
                          newArr[index] = e.target.value;
                          setInverterSerials(newArr);
                        }}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-purple-600 transition-all shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
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
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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

// KitRowDesktop component
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
