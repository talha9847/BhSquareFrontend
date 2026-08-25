import React, { useState } from "react";
import axios from "axios";
import {
  Zap,
  Calculator,
  Printer,
  Loader2,
  Layers,
  FileText,
  IndianRupee,
  Package,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const EstimationGenerator = () => {
  // Sidebar state to control responsive toggle across Navbar and Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Input State
  const [inputData, setInputData] = useState({
    panel_qty: 10,
    panel_wattage: 550,
    panel_rate_per_watt: 25,
  });

  // Response Data State
  const [estimationResult, setEstimationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  // Call Estimation API
  const handleGenerateEstimation = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/estimation/generateEstimation",
        inputData,
      );
      if (response.data?.success) {
        setEstimationResult(response.data.data);
      }
    } catch (error) {
      console.error("API Error, loading fallback data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Currency Formatter
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val || 0);

  // Group items by Type
  const groupedItems = estimationResult?.items?.reduce((acc, item) => {
    const group = item.type || "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  // Trigger Native Browser Print Dialog (Save to PDF)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Estimator"
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8 space-y-6 text-slate-800 print:p-0 print:m-0">
          {/* INPUT FORM PANEL - Hidden when printing */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm print:hidden">
            {/* Form Header Area */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm">
                  <Zap size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-800">
                    System Estimation Calculator
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Configure Panel Specifications & Parameters
                  </p>
                </div>
              </div>

              {/* Manage Data Button positioned at top-right */}
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a5695] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#144477] transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
                onClick={() => {
                  navigate("/estimationmanage");
                }}
              >
                Manage Data
              </button>
            </div>

            <form onSubmit={handleGenerateEstimation} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Panel Quantity
                  </label>
                  <input
                    type="number"
                    name="panel_qty"
                    min="1"
                    required
                    value={inputData.panel_qty}
                    onChange={handleInputChange}
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-800 uppercase focus:border-slate-400 transition-all"
                    placeholder="QTY..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Panel Wattage (Wp)
                  </label>
                  <input
                    type="number"
                    name="panel_wattage"
                    min="1"
                    required
                    value={inputData.panel_wattage}
                    onChange={handleInputChange}
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-800 uppercase focus:border-slate-400 transition-all"
                    placeholder="WATTAGE..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Rate Per Watt (₹)
                  </label>
                  <input
                    type="number"
                    name="panel_rate_per_watt"
                    step="0.01"
                    min="0"
                    required
                    value={inputData.panel_rate_per_watt}
                    onChange={handleInputChange}
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-800 uppercase focus:border-slate-400 transition-all"
                    placeholder="RATE..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#144477] transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Calculator size={16} /> Calculate Bill of Materials
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ESTIMATION RESULTS BLOCK */}
          {estimationResult && (
            <div className="space-y-6 print:space-y-4">
              {/* TOP METRIC CARDS ROW - Hidden when printing */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 print:hidden">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-50 text-[#1a5695] rounded-xl">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Capacity
                    </p>
                    <p className="text-base font-black text-slate-800 tracking-tight">
                      {estimationResult.total_kw} KW
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-50 text-[#1a5695] rounded-xl">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Panels Needed
                    </p>
                    <p className="text-base font-black text-slate-800 tracking-tight">
                      {estimationResult.panel_qty} Units
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3.5">
                  <div className="p-2.5 bg-slate-50 text-[#1a5695] rounded-xl">
                    <Layers size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Rating & Price
                    </p>
                    <p className="text-base font-black text-slate-800 tracking-tight">
                      {estimationResult.panel_wattage}W @ ₹
                      {estimationResult.panel_rate_per_watt}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3.5">
                  <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                    <IndianRupee size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Grand Total
                    </p>
                    <p className="text-base font-black text-slate-800 tracking-tight">
                      {formatCurrency(estimationResult.grand_total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* PRINT ONLY HEADER */}
              <div className="hidden print:flex justify-between items-center bg-[#1a5695] text-white p-6 rounded-2xl mb-6">
                <div>
                  <h1 className="text-xl font-black uppercase tracking-tight">
                    Solar System Quotation
                  </h1>
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-200 mt-1">
                    System Capacity: {estimationResult.total_kw} KW
                  </p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                  {estimationResult.panel_qty} x{" "}
                  {estimationResult.panel_wattage}W
                </div>
              </div>

              {/* PRINT ONLY SUMMARY BOX */}
              <div className="hidden print:grid grid-cols-3 gap-4 bg-slate-100 p-4 rounded-xl mb-6">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Total Panels
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    {estimationResult.panel_qty} Units
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Panel Wattage
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    {estimationResult.panel_wattage} W
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Rate / Watt
                  </p>
                  <p className="text-sm font-black text-slate-800">
                    ₹{estimationResult.panel_rate_per_watt}
                  </p>
                </div>
              </div>

              {/* BOM INVENTORY TABLE CONTAINER */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
                <div className="flex justify-between items-center border-b border-slate-100 pb-5 print:hidden">
                  <div>
                    <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">
                      Material & Cost Breakdown
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                      Generated BOM for {estimationResult.total_kw} KW
                      Installation
                    </p>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                  >
                    <Printer size={14} /> Print / Save PDF
                  </button>
                </div>

                {Object.entries(groupedItems || {}).map(
                  ([groupName, items]) => (
                    <div key={groupName} className="space-y-3 print:space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-[#1a5695] uppercase tracking-widest border-b border-slate-100 pb-2">
                        <Layers size={14} className="print:hidden" />{" "}
                        {groupName} Breakdown
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 print:bg-slate-100">
                              <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Item Description
                              </th>
                              <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                                Qty
                              </th>
                              <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                                Rate
                              </th>
                              <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                                GST %
                              </th>
                              <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                                GST Tax
                              </th>
                              <th className="py-2.5 px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                                Total Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {items.map((item) => (
                              <tr
                                key={item.id}
                                className="text-xs font-bold text-slate-700"
                              >
                                <td className="py-3 px-3 font-black text-slate-800 uppercase">
                                  {item.name}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {item.qty}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  {formatCurrency(item.price)}
                                </td>
                                <td className="py-3 px-3 text-right">
                                  {item.gst}%
                                </td>
                                <td className="py-3 px-3 text-right text-slate-400 print:text-slate-600">
                                  {formatCurrency(item.gst_amount)}
                                </td>
                                <td className="py-3 px-3 text-right font-black text-slate-800">
                                  {formatCurrency(item.total)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ),
                )}

                {/* TOTALS SUMMARY */}
                <div className="border-t border-slate-100 pt-5 flex justify-end">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Subtotal:</span>
                      <span className="text-slate-700">
                        {formatCurrency(estimationResult.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>GST Total:</span>
                      <span className="text-slate-700">
                        {formatCurrency(estimationResult.total_gst)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-800 uppercase tracking-tight border-t border-slate-100 pt-3">
                      <span>Net Total:</span>
                      <span className="text-[#1a5695]">
                        {formatCurrency(estimationResult.grand_total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EstimationGenerator;
