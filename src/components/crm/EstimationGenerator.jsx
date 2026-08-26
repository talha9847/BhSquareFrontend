import React, { useState, useRef } from "react";
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
  Download,
} from "lucide-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const EstimationGenerator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const printRef = useRef(null);

  // Input State
  const [inputData, setInputData] = useState({
    panel_qty: 9,
    panel_wattage: 615,
    panel_rate_per_watt: 25,
    customer_name: "Valued Customer",
    customer_address: "Site Address Details, Navsari",
    customer_mobile: "+91 9876543210",
  });

  // Response Data State
  const [estimationResult, setEstimationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]:
        name.includes("name") ||
        name.includes("address") ||
        name.includes("mobile")
          ? value
          : value === ""
            ? ""
            : Number(value),
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
      console.error("API Error, using current calculation baseline:", error);
      // Fallback object matching template logic
      const totalKw = (
        (inputData.panel_qty * inputData.panel_wattage) /
        1000
      ).toFixed(3);
      const totalCost =
        inputData.panel_qty *
        inputData.panel_wattage *
        inputData.panel_rate_per_watt;
      const discount = 10000;
      const payable = totalCost - discount;
      const subsidy = 78000;
      const netCost = payable - subsidy;

      setEstimationResult({
        total_kw: totalKw,
        panel_qty: inputData.panel_qty,
        panel_wattage: inputData.panel_wattage,
        panel_rate_per_watt: inputData.panel_rate_per_watt,
        total_cost: totalCost,
        discount: discount,
        payable_amount: payable,
        subsidy_amount: subsidy,
        net_cost: netCost,
        subtotal: payable,
        total_gst: payable * 0.12,
        grand_total: payable * 1.12,
        items: [
          {
            id: 1,
            name: `Solar PV Modules ${inputData.panel_wattage}W`,
            type: "Solar Modules",
            qty: inputData.panel_qty,
            price: inputData.panel_rate_per_watt * inputData.panel_wattage,
            gst: 12,
            gst_amount:
              inputData.panel_rate_per_watt * inputData.panel_wattage * 0.12,
            total:
              inputData.panel_rate_per_watt *
              inputData.panel_wattage *
              1.12 *
              inputData.panel_qty,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // Currency Formatter
  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(val || 0);

  // Print/Download PDF Trigger
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Dynamic Print Styles for exact A4 template rendering */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-a4-template, #printable-a4-template * {
            visibility: visible;
          }
          #printable-a4-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

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
          {/* INPUT FORM PANEL */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm print:hidden">
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
                    Configure Panel Specifications & Customer Details
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a5695] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#144477] transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
                onClick={() => navigate("/estimationmanage")}
              >
                Manage Data
              </button>
            </div>

            <form onSubmit={handleGenerateEstimation} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    value={inputData.customer_name}
                    onChange={handleInputChange}
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-800 focus:border-slate-400 transition-all"
                    placeholder="Name..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Customer Address
                  </label>
                  <input
                    type="text"
                    name="customer_address"
                    required
                    value={inputData.customer_address}
                    onChange={handleInputChange}
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-800 focus:border-slate-400 transition-all"
                    placeholder="Address..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                    Customer Mobile
                  </label>
                  <input
                    type="text"
                    name="customer_mobile"
                    required
                    value={inputData.customer_mobile}
                    onChange={handleInputChange}
                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-800 focus:border-slate-400 transition-all"
                    placeholder="Mobile..."
                  />
                </div>

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
                    Inverter Wattage (kW)
                  </label>
                  <input
                    type="number"
                    name="inverter_wattage"
                    min="1"
                    step="0.01"
                    required
                    value={inputData.inverter_wattage}
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

            {/* Dynamic API Itemized Table */}
            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-16 text-center">
                      No.
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase min-w-[200px]">
                      Product
                    </th>
                    {/* Conditional Wattage Header */}
                    {estimationResult?.items?.some(
                      (item) =>
                        item.type === "PANEL" ||
                        item.type === "INVERTER" ||
                        item.type === "Solar Modules",
                    ) ? (
                      <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-32">
                        Wattage
                      </th>
                    ) : null}
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-24 text-center">
                      Qty
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-32">
                      Unit Price
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-32">
                      Subtotal
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-20 text-center">
                      Tax %
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-32">
                      Tax Amt
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase w-32">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {estimationResult?.items?.map((item, index) => {
                    // Calculate subtotal, GST, and totals per item if not calculated by backend
                    const qty = item.qty || 1;
                    const price = item.price || 0;
                    const subtotal = qty * price;
                    const taxRate = item.gst || 12;
                    const taxAmt =
                      item.gst_amount || (subtotal * taxRate) / 100;
                    const itemTotal = item.total || subtotal + taxAmt;

                    const showWattage = estimationResult.items.some(
                      (i) =>
                        i.type === "PANEL" ||
                        i.type === "INVERTER" ||
                        i.type === "Solar Modules",
                    );

                    return (
                      <tr
                        key={item.id || index}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* 1. No. */}
                        <td className="px-6 py-4 text-center font-bold text-slate-400">
                          {index + 1}
                        </td>

                        {/* 2. Product Name */}
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {item.name}
                          {item.type && (
                            <span className="block text-[10px] text-slate-400 font-semibold tracking-wide">
                              Category: {item.type}
                            </span>
                          )}
                        </td>

                        {/* 3. Conditional Wattage Column */}
                        {showWattage ? (
                          <td className="px-6 py-4 text-slate-600">
                            {item.type === "PANEL" ||
                            item.type === "INVERTER" ||
                            item.type === "Solar Modules"
                              ? `${estimationResult.panel_wattage || 615} W`
                              : "-"}
                          </td>
                        ) : null}

                        {/* 4. Qty */}
                        <td className="px-6 py-4 text-center font-black text-slate-800">
                          {qty}
                        </td>

                        {/* 5. Unit Price */}
                        <td className="px-6 py-4">₹{formatCurrency(price)}</td>

                        {/* 6. Subtotal */}
                        <td className="px-6 py-4 text-slate-800">
                          ₹{formatCurrency(subtotal)}
                        </td>

                        {/* 7. Tax % */}
                        <td className="px-6 py-4 text-center font-bold text-slate-500">
                          {taxRate}%
                        </td>

                        {/* 8. Tax Amount */}
                        <td className="px-6 py-4 text-slate-600">
                          ₹{formatCurrency(taxAmt)}
                        </td>

                        {/* 9. Total */}
                        <td className="px-6 py-4 font-black text-slate-900">
                          ₹{formatCurrency(itemTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Table Footer Summary */}
                <tfoot className="bg-slate-50/80 font-black text-xs text-slate-800 border-t border-slate-200">
                  <tr>
                    <td
                      colSpan={
                        estimationResult?.items?.some(
                          (i) =>
                            i.type === "PANEL" ||
                            i.type === "INVERTER" ||
                            i.type === "Solar Modules",
                        )
                          ? 5
                          : 4
                      }
                      className="px-6 py-4 text-right uppercase tracking-wider text-slate-400"
                    >
                      Grand Totals:
                    </td>
                    <td className="px-6 py-4">
                      ₹
                      {formatCurrency(
                        estimationResult?.subtotal ||
                          estimationResult?.payable_amount ||
                          0,
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">-</td>
                    <td className="px-6 py-4 text-slate-600">
                      ₹{formatCurrency(estimationResult?.total_gst || 0)}
                    </td>
                    <td className="px-6 py-4 text-emerald-700 text-sm">
                      ₹
                      {formatCurrency(
                        estimationResult?.grand_total ||
                          estimationResult?.payable_amount ||
                          0,
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* DASHBOARD PREVIEW METRICS */}
          {estimationResult && (
            <div className="space-y-6 print:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                      ₹
                      {formatCurrency(
                        estimationResult.grand_total ||
                          estimationResult.payable_amount ||
                          0,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION BAR FOR PDF DOWNLOAD */}
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    A4 Estimate Template Ready
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Download or print the exact formatted PDF document
                  </p>
                </div>

                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>
          )}

          {/* EXACT A4 PDF TEMPLATE CONTAINER (Renders in preview screen and directly triggers on Print/PDF download) */}
          {estimationResult && (
            <div className="flex justify-center my-6 print:m-0 print:p-0">
              <div
                id="printable-a4-template"
                ref={printRef}
                className="page-card w-[210mm] h-[297mm] mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-300 flex flex-col justify-between box-border text-[#222222] text-[11px] leading-tight font-sans"
              >
                {/* Top Content Area */}
                <div className="flex-1 flex flex-col justify-between">
                  {/* Compact Header */}
                  <div className="bg-[#0c2340] text-white px-6 py-4 flex justify-between items-center">
                    <div>
                      <h1 className="text-xl font-bold tracking-wide uppercase">
                        BHsquare Solar
                      </h1>
                      <p className="text-[10.5px] text-[#9db6d4] mt-0.5">
                        Solar Energy Solutions
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#9db6d4] uppercase tracking-wider text-[9px] font-semibold">
                        Estimate Date
                      </div>
                      <div className="font-bold text-sm text-white mt-0.5">
                        {new Date().toLocaleDateString("en-GB")}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    {/* Company & Customer Info Grid */}
                    <div className="grid grid-cols-2 gap-6 pb-3 border-b border-gray-200">
                      <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#1d4e89] mb-1.5">
                          Provider Details
                        </h2>
                        <p className="font-bold text-xs">
                          BHsquare Solar Installation &amp; Services
                        </p>
                        <p className="text-[#666666] mt-1">
                          Kharel, Gandevi, Navsari, Gujarat
                        </p>
                        <p className="text-[#666666] mt-0.5">
                          Contact:{" "}
                          <span className="font-medium text-[#222222]">
                            8733817262
                          </span>
                        </p>
                        <p className="text-[#666666] mt-0.5">
                          GSTIN:{" "}
                          <span className="font-medium text-[#222222]">
                            24ABCDE1234F1ZH
                          </span>
                        </p>
                      </div>
                      <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#1d4e89] mb-1.5">
                          Customer Details
                        </h2>
                        <p className="font-bold text-xs">
                          {inputData.customer_name}
                        </p>
                        <p className="text-[#666666] mt-1">
                          {inputData.customer_address}
                        </p>
                        <p className="text-[#666666] mt-0.5">
                          Mobile:{" "}
                          <span className="font-medium text-[#222222]">
                            {inputData.customer_mobile}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* System Specifications Table */}
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#1d4e89] mb-1.5">
                        System Specifications
                      </h2>
                      <table className="w-full text-left border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100 text-[#0c2340] uppercase text-[9px] tracking-wider">
                            <th className="p-2 border border-gray-200">
                              System Capacity
                            </th>
                            <th className="p-2 border border-gray-200">
                              System Type
                            </th>
                            <th className="p-2 border border-gray-200">
                              PV Modules
                            </th>
                            <th className="p-2 border border-gray-200">
                              Inverter
                            </th>
                            <th className="p-2 border border-gray-200">
                              Est. Monthly Gen.
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-[11px]">
                            <td className="p-2 border border-gray-200 font-semibold">
                              <span>{estimationResult.total_kw}</span> kW
                            </td>
                            <td className="p-2 border border-gray-200">
                              On-Grid
                            </td>
                            <td className="p-2 border border-gray-200">
                              <span>ADANI</span> (
                              <span>{estimationResult.panel_wattage} W</span> ×{" "}
                              <span>{estimationResult.panel_qty}</span> Nos)
                            </td>
                            <td className="p-2 border border-gray-200">
                              <span>
                                {Math.ceil(estimationResult.total_kw)} kW
                              </span>{" "}
                              - <span>Polycab</span>
                            </td>
                            <td className="p-2 border border-gray-200 font-semibold text-green-700">
                              <span>
                                {Math.round(estimationResult.total_kw * 120)}
                              </span>{" "}
                              kWh
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Financial Breakdown Table */}
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#1d4e89] mb-1.5">
                        Financial Overview
                      </h2>
                      <table className="w-full text-left border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100 text-[#0c2340] uppercase text-[9px] tracking-wider">
                            <th className="p-2 border border-gray-200">
                              Total System Cost
                            </th>
                            <th className="p-2 border border-gray-200">
                              Discount
                            </th>
                            <th className="p-2 border border-gray-200">
                              Payable Amount
                            </th>
                            <th className="p-2 border border-gray-200">
                              Govt. Subsidy
                            </th>
                            <th className="p-2 border border-gray-200">
                              Net Cost to Customer
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-[11px]">
                            <td className="p-2 border border-gray-200 font-medium">
                              ₹
                              <span>
                                {formatCurrency(
                                  estimationResult.total_cost || 285000,
                                )}
                              </span>
                            </td>
                            <td className="p-2 border border-gray-200 text-red-600 font-medium">
                              - ₹
                              <span>
                                {formatCurrency(
                                  estimationResult.discount || 10000,
                                )}
                              </span>
                            </td>
                            <td className="p-2 border border-gray-200 font-semibold">
                              ₹
                              <span>
                                {formatCurrency(
                                  estimationResult.payable_amount || 275000,
                                )}
                              </span>
                            </td>
                            <td className="p-2 border border-gray-200 text-green-700 font-medium">
                              ₹
                              <span>
                                {formatCurrency(
                                  estimationResult.subsidy_amount || 78000,
                                )}
                              </span>
                            </td>
                            <td className="p-2 border border-gray-200 font-bold text-xs text-[#1d4e89]">
                              ₹
                              <span>
                                {formatCurrency(
                                  estimationResult.net_cost || 197000,
                                )}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Terms & Warranties */}
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#1d4e89] mb-1.5">
                        Terms &amp; Warranties
                      </h2>
                      <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                        <ul className="m-0 pl-4 list-disc space-y-1 text-[#666666]">
                          <li>
                            <span className="font-semibold text-[#222222]">
                              30
                            </span>{" "}
                            yrs warranty on solar modules (<span>ADANI</span>).
                          </li>
                          <li>
                            <span className="font-semibold text-[#222222]">
                              8
                            </span>{" "}
                            yrs warranty on solar on-grid inverter.
                          </li>
                          <li>
                            <span className="font-semibold text-[#222222]">
                              5
                            </span>{" "}
                            yrs operational &amp; maintenance warranty.
                          </li>
                        </ul>

                        <ul className="m-0 pl-4 list-disc space-y-1 text-[#666666]">
                          <li>
                            3 Ph / 6 kW Up DISCOM metering charges borne by
                            customer.
                          </li>
                          <li>
                            Product warranty subject to manufacturer T&amp;C.
                          </li>
                          <li>
                            Physical damage is not covered under warranty.
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Payment Condition Callout */}
                    <div className="bg-[#fff8e0] border-l-4 border-[#f5a623] rounded px-3.5 py-2 text-[11px]">
                      <b className="inline-block text-[11px] text-[#1d4e89] mr-1">
                        ચૂકવણીની શરત (Payment Condition):
                      </b>
                      કામ પૂર્ણ થાય ત્યાં સુધીમાં 80% પેમેન્ટ કરવાનું રહેશે.
                      નહિતર મીટર ફાઇલ GEB માં મુકવામાં આવશે નહિ.
                    </div>

                    <div className="text-[11px] text-[#666666]">
                      This estimate is valid for{" "}
                      <b className="text-[#222222]">15 days</b>.
                    </div>

                    {/* Bank Details */}
                    <div className="bg-gradient-to-r from-[#0c2340] to-[#1d4e89] text-white rounded-lg px-5 py-3 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[8.5px] tracking-wider uppercase text-[#9db6d4]">
                          Bank
                        </div>
                        <div className="text-xs font-bold leading-tight">
                          Bank of Baroda, KHAREL Branch
                        </div>

                        <div className="text-[8.5px] tracking-wider uppercase text-[#9db6d4] mt-2">
                          Account Name
                        </div>
                        <div className="text-xs font-bold leading-tight">
                          BHSQUARE SOLAR INSTALLATION AND SERVICES
                        </div>
                      </div>

                      <div>
                        <div className="text-[8.5px] tracking-wider uppercase text-[#9db6d4]">
                          Account Number
                        </div>
                        <div className="text-xs font-bold tracking-wider">
                          3422 0200 0012 50
                        </div>

                        <div className="text-[8.5px] tracking-wider uppercase text-[#9db6d4] mt-2">
                          IFSC
                        </div>
                        <div className="text-xs font-bold tracking-wider">
                          BARBOKHAREL
                        </div>
                      </div>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-12 pt-6 pb-2">
                      <div className="border-t border-[#c7d2de] pt-1.5 text-center text-[10px] tracking-wider uppercase text-[#666666] font-bold">
                        Customer Signature
                      </div>
                      <div className="border-t border-[#c7d2de] pt-1.5 text-center text-[10px] tracking-wider uppercase text-[#666666] font-bold">
                        Authorized Signature
                        <div className="mt-0.5 text-[10.5px] text-[#1d4e89] font-semibold normal-case tracking-normal">
                          BHsquare Solar Installation &amp; Services
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Banner */}
                <div className="bg-[#0c2340] text-[#9db6d4] text-center text-[10px] py-2.5 px-3 border-t border-[#1d4e89]">
                  <span>BHsquare Solar Installation &amp; Services</span>
                  &nbsp;·&nbsp;
                  <span>Kharel, Gandevi, Navsari</span>
                  &nbsp;·&nbsp;
                  <span>8733817262</span>
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
