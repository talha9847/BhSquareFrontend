import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  Loader2,
  ClipboardCheck,
  PackageCheck,
  Info,
  Minus,
  Plus,
  Tags,
  AlertTriangle,
  ArrowDownRight,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const PrepareKit = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Static Data with Stock and Brand
  const [kitItems, setKitItems] = useState([
    {
      id: 1,
      name: "PNL - 540W",
      brand: "Mono Perc",
      category: "Panels",
      verified: false,
      qty: 6,
      stock: 122,
    },
    {
      id: 2,
      name: "INV - 5KW",
      brand: "Solis",
      category: "Inverters",
      verified: false,
      qty: 1,
      stock: 10,
    },
    {
      id: 3,
      name: "HD PIPE",
      brand: "Precision",
      category: "Conduit",
      verified: false,
      qty: 2,
      stock: 5,
    }, // Low Stock Example
    {
      id: 4,
      name: "J-BOLT",
      brand: "Local Mfg",
      category: "Hardware",
      verified: false,
      qty: 24,
      stock: 500,
    },
    {
      id: 5,
      name: "AC/DC BOX",
      brand: "Hensel",
      category: "Electrical",
      verified: false,
      qty: 1,
      stock: 1,
    }, // Exact Stock Example
    {
      id: 6,
      name: "EARTHING",
      brand: "Ashlok",
      category: "Protection",
      verified: false,
      qty: 3,
      stock: 100,
    },
    {
      id: 7,
      name: "CABLE TRAY",
      brand: "Indiana",
      category: "Structure",
      verified: false,
      qty: 0,
      stock: 100,
    },
    {
      id: 8,
      name: "CONDICT KIT",
      brand: "Generic",
      category: "Installation",
      verified: false,
      qty: 1,
      stock: 100,
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setTableLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const total = kitItems.length;
    const verified = kitItems.filter((i) => i.verified && i.qty > 0).length;
    const progress = Math.round((verified / total) * 100);
    return { total, verified, progress };
  }, [kitItems]);

  const updateQty = (id, delta) => {
    setKitItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.qty + delta);
          if (newQty > item.stock) {
            toast.error(
              `Stock Limit Reached! Only ${item.stock} ${item.brand} units left.`,
            );
            return item;
          }
          return { ...item, qty: newQty, verified: false };
        }
        return item;
      }),
    );
  };

  const toggleVerify = (id) => {
    const item = kitItems.find((i) => i.id === id);
    if (item.qty === 0) {
      toast.warning("Quantity is 0. Nothing to verify.");
      return;
    }
    setKitItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, verified: !i.verified } : i)),
    );
  };

  const filteredItems = kitItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()),
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-[1000] text-slate-800 tracking-tight uppercase italic">
                Kit Preparation
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                Real-time Stock Impact Analysis
              </p>
            </div>
            <button
              disabled={stats.progress < 100}
              className={`px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                stats.progress === 100
                  ? "bg-[#1a5695] text-white shadow-xl scale-105"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              Confirm Dispatch
            </button>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Component & Brand
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Current Stock
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Kit Quantity
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center italic">
                    Remaining In Wh
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Verification
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredItems.map((item) => {
                  const remaining = item.stock - item.qty;
                  const isLowStock = remaining < 5;

                  return (
                    <tr
                      key={item.id}
                      className={`group ${item.verified ? "bg-emerald-50/30" : "hover:bg-slate-50/50"}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <p className="font-black text-sm text-slate-800 uppercase italic leading-tight">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black bg-slate-800 text-white px-2 py-0.5 rounded uppercase">
                              {item.brand}
                            </span>
                            <span className="text-[9px] font-bold text-blue-500 uppercase">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <span className="text-xs font-black text-slate-400">
                          {item.stock}
                        </span>
                      </td>

                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 font-bold"
                          >
                            {" "}
                            -{" "}
                          </button>
                          <span className="text-sm font-black text-slate-800 px-4 min-w-[40px]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-600 font-bold"
                          >
                            {" "}
                            +{" "}
                          </button>
                        </div>
                      </td>

                      {/* REMAINING ITEMS COLUMN */}
                      <td className="px-8 py-6 text-center">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                            isLowStock
                              ? "bg-red-50 border-red-100 text-red-600"
                              : "bg-slate-50 border-slate-100 text-slate-600"
                          }`}
                        >
                          <ArrowDownRight
                            size={14}
                            className={isLowStock ? "animate-pulse" : ""}
                          />
                          <span className="text-xs font-[1000]">
                            {remaining}
                          </span>
                          {isLowStock && <AlertTriangle size={12} />}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => toggleVerify(item.id)}
                          className={`w-10 h-10 rounded-xl border-2 inline-flex items-center justify-center transition-all ${
                            item.verified
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-lg"
                              : "bg-white border-slate-100 text-slate-200"
                          }`}
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrepareKit;
