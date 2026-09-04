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
import { form, input } from "framer-motion/m";

const EstimationGenerator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inverterRate, setInverterRate] = useState(0);
  const [profitPerKw, setProfitPerKw] = useState(0);
  const [discountPerKw, setDiscountPerKw] = useState(0);
  const [dealerCost, setDealerCost] = useState(0);

  const navigate = useNavigate();
  const printRef = useRef(null);

  // =========================================================
  // INPUT STATE
  // =========================================================

  const [inputData, setInputData] = useState({
    panel_qty: 9,
    panel_wattage: 615,
    panel_rate_per_watt: 25,
    inverter_wattage: 3.6,
    customer_name: "Talha",
    customer_address: "zankharda",
    customer_mobile: "+91 98329823",
    panel_brand: "Adani",
    inverter_brand: "Adani",
    customer_type: "Residential",
    dealer_cost: 1000,
  });

  // =========================================================
  // RESPONSE DATA
  // =========================================================

  const [estimationResult, setEstimationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT CHANGES
  // =========================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInputData((prev) => ({
      ...prev,
      [name]:
        name.includes("name") ||
        name.includes("address") ||
        name.includes("panel_brand") ||
        name.includes("inverter_brand") ||
        name.includes("customer_type") ||
        name.includes("mobile")
          ? value
          : value === ""
            ? ""
            : Number(value),
    }));
  };

  // =========================================================
  // GENERATE ESTIMATION
  // =========================================================

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
        let res = response.data.data;

        console.log(res.items);
        res.items.map((i) => {
          if (i.name == "INVERTER") {
            setInverterRate(i.price);
          }
        });
      }
    } catch (error) {
      console.error("API Error, using current calculation baseline:", error);

      // Fallback calculation
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CURRENCY FORMATTER
  // =========================================================

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(val || 0);

  const groupItemsByCategory = (items = []) => {
    return items.reduce((groups, item) => {
      const category = item.type || "OTHER";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);

      return groups;
    }, {});
  };

  // =========================================================
  // PRINT / PDF
  // =========================================================

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    document.title = `${inputData.customer_name} ${inputData.panel_brand} ${(inputData.panel_qty * inputData.panel_wattage) / 1000} KW`;
    document.body.classList.add("printing");

    const handleAfterPrint = () => {
      document.body.classList.remove("printing");
      window.removeEventListener("afterprint", handleAfterPrint);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* =====================================================
          PRINT CSS
      ===================================================== */}

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            width: 210mm !important;
            min-width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body.printing {
            overflow: visible !important;
          }

          /*
           * Hide only application UI.
           * Do NOT use body * { visibility: hidden }.
           */
          body.printing .print\\:hidden,
          body.printing .no-print {
            display: none !important;
          }

          /*
           * Remove the normal application layout from the
           * printable flow.
           */
          body.printing > #root {
            width: 210mm !important;
            min-width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          body.printing .pdf-wrapper {
            display: block !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /*
           * Exact A4 page.
           */
          body.printing .print-page {
            display: block !important;
            position: relative !important;
            width: 210mm !important;
            height: 297mm !important;
            min-width: 210mm !important;
            min-height: 297mm !important;
            max-width: 210mm !important;
            max-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
            transform: none !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            break-after: avoid-page !important;
          }

          body.printing .pdf-page {
            display: block !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid-page !important;
          }

          body.printing .pdf-section {
            page-break-inside: avoid !important;
            break-inside: avoid-page !important;
          }

          body.printing .pdf-footer {
            page-break-inside: avoid !important;
            break-inside: avoid-page !important;
          }

          /*
           * Prevent the browser from inserting an additional
           * page after the A4 template.
           */
          body.printing .pdf-wrapper::after {
            display: none !important;
            content: none !important;
          }
        }
      `}</style>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div className="no-print">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activePage="Estimator"
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Navbar hidden automatically during print */}
        <div className="print:hidden">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <main className="p-4 lg:p-8 space-y-6 text-slate-800 print:p-0 print:m-0">
          {/* =================================================
              INPUT FORM
          ================================================= */}

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
              {/* =====================================================
      CUSTOMER DETAILS
  ===================================================== */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1a5695] mb-3">
                  Customer Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Customer Name */}
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
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="Name..."
                    />
                  </div>

                  {/* Customer Address */}
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
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="Address..."
                    />
                  </div>

                  {/* Customer Mobile */}
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
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="Mobile..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Customer Type
                    </label>
                    <select
                      name="customer_type"
                      required
                      value={inputData.customer_type}
                      onChange={handleInputChange}
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-800"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* =====================================================
      PANEL DETAILS
  ===================================================== */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1a5695] mb-3">
                  Panel Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  {/* Panel Brand */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Panel Brand
                    </label>
                    <input
                      type="text"
                      name="panel_brand"
                      required
                      value={inputData.panel_brand}
                      onChange={handleInputChange}
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm uppercase"
                      placeholder="ADANI..."
                    />
                  </div>

                  {/* Panel Quantity */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Panel Quantity
                    </label>
                    <input
                      type="text"
                      name="panel_qty"
                      min="1"
                      required
                      value={inputData.panel_qty}
                      onChange={handleInputChange}
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="QTY..."
                    />
                  </div>

                  {/* Panel Wattage */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Panel Wattage (Wp)
                    </label>
                    <input
                      type="text"
                      name="panel_wattage"
                      min="1"
                      required
                      value={inputData.panel_wattage}
                      onChange={handleInputChange}
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="WATTAGE..."
                    />
                  </div>

                  {/* Rate Per Watt */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Rate Per Watt (₹)
                    </label>
                    <input
                      type="text"
                      name="panel_rate_per_watt"
                      step="0.01"
                      min="0"
                      required
                      value={inputData.panel_rate_per_watt}
                      onChange={handleInputChange}
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="RATE..."
                    />
                  </div>
                </div>
              </div>

              {/* =====================================================
      INVERTER DETAILS
  ===================================================== */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1a5695] mb-3">
                  Inverter Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Inverter Brand */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Inverter Brand
                    </label>
                    <input
                      type="text"
                      name="inverter_brand"
                      required
                      value={inputData.inverter_brand}
                      onChange={handleInputChange}
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm uppercase"
                      placeholder="ADANI..."
                    />
                  </div>

                  {/* Inverter Wattage */}
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
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="WATTAGE..."
                    />
                  </div>

                  {/* Inverter Rate */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Inverter Rate (₹)
                    </label>
                    <input
                      type="text"
                      name="inverter_rate"
                      step="0.01"
                      min="0"
                      readOnly
                      value={formatCurrency(inverterRate)}
                      className="w-full mt-1.5 p-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* =====================================================
      OTHER / PRICING DETAILS
  ===================================================== */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1a5695] mb-3">
                  Pricing Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Profit Per KW */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Profit Per kW (₹)
                    </label>
                    <input
                      type="text"
                      name="profit_per_kw"
                      step="0.01"
                      min="0"
                      value={profitPerKw}
                      onChange={(e) => {
                        setProfitPerKw(e.target.value);
                      }}
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="PROFIT..."
                    />
                    {formatCurrency(profitPerKw)} *{" "}
                    {(inputData.panel_qty * inputData.panel_wattage) / 1000} ={" "}
                    {(profitPerKw *
                      inputData.panel_qty *
                      inputData.panel_wattage) /
                      1000}{" "}
                  </div>

                  {/* Discount Per KW */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Discount Per kW (₹)
                    </label>
                    <input
                      type="text"
                      name="discount_per_kw"
                      step="0.01"
                      min="0"
                      value={discountPerKw}
                      onChange={(e) => {
                        setDiscountPerKw(e.target.value);
                      }}
                      className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                      placeholder="DISCOUNT..."
                    />
                    {formatCurrency(discountPerKw)} *{" "}
                    {(inputData.panel_qty * inputData.panel_wattage) / 1000} ={" "}
                    {(discountPerKw *
                      inputData.panel_qty *
                      inputData.panel_wattage) /
                      1000}{" "}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Dealer Cost (₹)
                    </label>
                    <input
                      type="text"
                      name="dealer_cost"
                      step="0.01"
                      min="0"
                      value={dealerCost}
                      onChange={(e) => {
                        setDealerCost(e.target.value);
                      }}
                      className="w-full mt-1.5 p-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    />
                    {formatCurrency(dealerCost)} *{" "}
                    {(inputData.panel_qty * inputData.panel_wattage) / 1000} ={" "}
                    {formatCurrency(
                      (dealerCost *
                        inputData.panel_qty *
                        inputData.panel_wattage) /
                        1000,
                    )}
                  </div>
                  {/* Total Cost */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Only Material Costing (₹)
                    </label>
                    <input
                      type="text"
                      name=""
                      step="0.01"
                      min="0"
                      readOnly
                      value={formatCurrency(
                        estimationResult?.grand_total +
                          (dealerCost *
                            inputData.panel_qty *
                            inputData.panel_wattage) /
                            1000,
                      )}
                      className="w-full mt-1.5 p-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Total Profit After Discount (₹)
                    </label>
                    <input
                      type="text"
                      name=""
                      step="0.01"
                      min="0"
                      readOnly
                      value={formatCurrency(
                        ((inputData.panel_qty * inputData.panel_wattage) /
                          1000) *
                          profitPerKw -
                          ((inputData.panel_qty * inputData.panel_wattage) /
                            1000) *
                            discountPerKw,
                      )}
                      className="w-full mt-1.5 p-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                      Final Rate (₹)
                    </label>
                    <input
                      type="text"
                      name=""
                      step="0.01"
                      min="0"
                      readOnly
                      value={formatCurrency(
                        estimationResult?.grand_total +
                          ((inputData.panel_qty * inputData.panel_wattage) /
                            1000) *
                            dealerCost +
                          ((inputData.panel_qty * inputData.panel_wattage) /
                            1000) *
                            profitPerKw,
                      )}
                      className="w-full mt-1.5 p-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* =====================================================
      SUBMIT BUTTON
  ===================================================== */}
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
                      <Calculator size={16} />
                      Calculate Bill of Materials
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* =================================================
                ITEMIZED TABLE
            ================================================= */}
            {/* =================================================
    ITEMIZED TABLE - GROUPED BY CATEGORY
================================================= */}

            {estimationResult?.items?.length > 0 && (
              <div className="mt-6 space-y-5">
                {Object.entries(
                  groupItemsByCategory(estimationResult.items),
                ).map(([category, items]) => {
                  const categorySubtotal = items.reduce((sum, item) => {
                    const qty = Number(item.qty) || 1;
                    const price = Number(item.price) || 0;

                    return sum + qty * price;
                  }, 0);

                  const categoryGST = items.reduce((sum, item) => {
                    const qty = Number(item.qty) || 1;
                    const price = Number(item.price) || 0;

                    const subtotal = qty * price;
                    const gstRate = Number(item.gst) || 0;

                    return (
                      sum +
                      (Number(item.gst_amount) || (subtotal * gstRate) / 100)
                    );
                  }, 0);

                  const categoryTotal = categorySubtotal + categoryGST;

                  return (
                    <div
                      key={category}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                    >
                      {/* CATEGORY HEADER */}
                      <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200">
                        <div>
                          <h3 className="text-sm font-black text-[#1a5695] uppercase tracking-wider">
                            {category.replaceAll("_", " ")}
                          </h3>

                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {items.length} Item
                            {items.length !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Category Total
                          </p>

                          <p className="text-sm font-black text-emerald-700">
                            ₹{formatCurrency(categoryTotal)}
                          </p>
                        </div>
                      </div>

                      {/* CATEGORY TABLE */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-white border-b border-slate-200">
                            <tr>
                              <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase w-14 text-center">
                                No.
                              </th>

                              <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase">
                                Product
                              </th>

                              {items.some(
                                (item) =>
                                  item.type === "PANEL" ||
                                  item.type === "INVERTER" ||
                                  item.type === "Solar Modules",
                              ) && (
                                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase">
                                  Wattage
                                </th>
                              )}

                              <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase text-center">
                                Qty
                              </th>

                              <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase">
                                Unit Price
                              </th>

                              <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase">
                                Subtotal
                              </th>

                              <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase text-center">
                                GST %
                              </th>

                              <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase">
                                GST Amount
                              </th>

                              <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase">
                                Total
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                            {items.map((item, index) => {
                              const qty = Number(item.qty) || 1;
                              const price = Number(item.price) || 0;

                              const subtotal = qty * price;

                              const taxRate = Number(item.gst) || 0;

                              const taxAmt =
                                Number(item.gst_amount) ||
                                (subtotal * taxRate) / 100;

                              const itemTotal =
                                Number(item.total) || subtotal + taxAmt;

                              const showWattage =
                                item.type === "PANEL" ||
                                item.type === "INVERTER" ||
                                item.type === "Solar Modules";

                              return (
                                <tr
                                  key={item.id || `${category}-${index}`}
                                  className="hover:bg-slate-50 transition-colors"
                                >
                                  {/* NO */}
                                  <td className="px-5 py-3 text-center font-bold text-slate-400">
                                    {index + 1}
                                  </td>

                                  {/* PRODUCT */}
                                  <td className="px-5 py-3">
                                    <p className="font-bold text-slate-800">
                                      {item.name}
                                    </p>

                                    {item.description && (
                                      <p className="text-[9px] text-slate-400 mt-0.5">
                                        {item.description}
                                      </p>
                                    )}
                                  </td>

                                  {/* WATTAGE */}
                                  {items.some(
                                    (i) =>
                                      i.type === "PANEL" ||
                                      i.type === "INVERTER" ||
                                      i.type === "Solar Modules",
                                  ) && (
                                    <td className="px-5 py-3 text-slate-600">
                                      {showWattage
                                        ? item.type === "PANEL" ||
                                          item.type === "Solar Modules"
                                          ? `${estimationResult.panel_wattage} W`
                                          : `${inputData.inverter_wattage} kW`
                                        : "-"}
                                    </td>
                                  )}

                                  {/* QTY */}
                                  <td className="px-5 py-3 text-center font-black text-slate-800">
                                    {qty}
                                  </td>

                                  {/* UNIT PRICE */}
                                  <td className="px-5 py-3">
                                    ₹{formatCurrency(price)}
                                  </td>

                                  {/* SUBTOTAL */}
                                  <td className="px-5 py-3 font-bold text-slate-800">
                                    ₹{formatCurrency(subtotal)}
                                  </td>

                                  {/* GST */}
                                  <td className="px-5 py-3 text-center font-bold text-slate-500">
                                    {taxRate}%
                                  </td>

                                  {/* GST AMOUNT */}
                                  <td className="px-5 py-3 text-slate-600">
                                    ₹{formatCurrency(taxAmt)}
                                  </td>

                                  {/* TOTAL */}
                                  <td className="px-5 py-3 font-black text-slate-900">
                                    ₹{formatCurrency(itemTotal)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>

                          {/* CATEGORY TOTAL */}
                          <tfoot className="bg-slate-50 border-t border-slate-200">
                            <tr>
                              <td
                                colSpan={
                                  items.some(
                                    (i) =>
                                      i.type === "PANEL" ||
                                      i.type === "INVERTER" ||
                                      i.type === "Solar Modules",
                                  )
                                    ? 6
                                    : 5
                                }
                                className="px-5 py-3 text-right text-[10px] font-black uppercase text-slate-400"
                              >
                                Category Total
                              </td>

                              <td className="px-5 py-3 font-black">
                                ₹{formatCurrency(categoryGST)}
                              </td>

                              <td className="px-5 py-3 font-black text-emerald-700">
                                ₹{formatCurrency(categoryTotal)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  );
                })}

                {/* =================================================
        GRAND TOTAL
    ================================================= */}

                <div className="bg-[#1a5695] text-white rounded-xl p-5 shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                        Complete Estimation
                      </p>

                      <h3 className="text-lg font-black uppercase">
                        Grand Total
                      </h3>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black">
                        ₹
                        {formatCurrency(
                          estimationResult.grand_total +
                            (dealerCost *
                              inputData.panel_qty *
                              inputData.panel_wattage) /
                              1000,
                        )}
                      </p>

                      <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">
                        Including GST
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              DASHBOARD PREVIEW
          ================================================= */}

          {estimationResult && (
            <div className="space-y-6 print:hidden">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Capacity */}
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

                {/* Panels */}
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

                {/* Rating */}
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

                {/* Grand Total */}
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
                        estimationResult.grand_total +
                          (dealerCost *
                            inputData.panel_qty *
                            inputData.panel_wattage) /
                            1000,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Download */}
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
                  <Download size={14} />
                  Download PDF
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              PDF TEMPLATE
          ================================================= */}

          {estimationResult && (
            <div className="pdf-wrapper flex justify-center my-4 print:m-0 print:p-0">
              <div
                id="printable-a4-template"
                ref={printRef}
                className="print-page w-[210mm] h-[297mm] mx-auto bg-white shadow-xl border border-gray-300 box-border text-[#222222] text-[8.5px] leading-[1.12] font-sans print:shadow-none print:border-0 print:m-0"
              >
                <div className="pdf-page relative bg-white px-4 py-3">
                  {/* HEADER */}
                  <div className="border-b-4 border-amber-500 pb-2.5 mb-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight leading-tight">
                          BHsquare Solar Installation And Services
                        </h1>
                        <p className="text-[8px] text-slate-700 font-semibold mt-0.5">
                          Kharel, Gandevi, Navsari, Gujarat - 396430
                        </p>
                        <p className="text-[8px] text-slate-700 mt-0.5">
                          Contact: Harsh Patel (+91 8733817262) &nbsp;|&nbsp;
                          GSTIN:
                          <span className="font-bold text-slate-900">
                            24ABDFB4169R1ZZ
                          </span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="bg-amber-100 text-amber-900 text-[7px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider inline-block">
                          {inputData.customer_type + " "} Solar Estimate
                        </span>
                        <p className="text-[7px] text-slate-700 mt-0.5">
                          Estimate Date:
                          <span className="font-bold text-slate-900">
                            {new Date().toLocaleDateString("en-GB")}
                          </span>
                        </p>
                        <p className="text-[7px] text-slate-700">
                          Validity:
                          <span className="font-bold text-rose-700">
                            15 Days From Date
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PROJECT */}
                  <div className="bg-gradient-to-r from-[#0f172a] via-[#1e3a8a] to-[#0369a1] text-white p-5 rounded-lg mb-4">
                    <div className="flex justify-between items-center gap-3">
                      <div className="min-w-0">
                        <p className="text-[7px] text-amber-300 font-extrabold uppercase tracking-widest">
                          Project Name & Capacity
                        </p>
                        <h2 className="text-[16px] font-extrabold mt-0.5 leading-tight">
                          {estimationResult.total_kw} kWp On-Grid{" "}
                          {inputData.customer_type + " "}
                          Solar Project
                        </h2>
                        <p className="text-blue-100 text-[8px] mt-0.5 font-medium">
                          Turnkey EPC with
                          {inputData.panel_brand.toUpperCase() + " "}
                          {estimationResult.panel_wattage}W TOPCon / Bifacial
                          modules &
                          {" " + inputData.inverter_brand.toUpperCase() + " "}
                          inverter
                        </p>
                      </div>

                      <div className="bg-white/15 p-1.5 rounded-lg border border-white/30 text-right shrink-0">
                        <p className="text-[6px] text-blue-100 uppercase font-bold">
                          Prepared For Client
                        </p>
                        <p className="text-[16px] font-extrabold text-white">
                          {inputData.customer_name}
                        </p>
                        <p className="text-[7px] text-amber-300 font-bold">
                          DISCOM Net-Metering Connection
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* INVESTMENT SUMMARY */}
                  <div className="mb-4 pdf-section">
                    <h3 className="text-[8px] font-extrabold text-slate-600 uppercase tracking-wider mb-1">
                      Project & Subsidy Investment Summary
                    </h3>

                    <div className="grid grid-cols-5 gap-1.5">
                      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300">
                        <p className="text-[7px] text-slate-600 font-semibold">
                          System Capacity
                        </p>
                        <p className="text-[13px] font-extrabold text-slate-900 mt-0.5">
                          {estimationResult.total_kw} kWp
                        </p>
                        <p className="text-[6.5px] text-slate-500">
                          {estimationResult.panel_qty} × Adani
                          {estimationResult.panel_wattage}W
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300">
                        <p className="text-[7px] text-slate-600 font-semibold">
                          Gross Project Cost
                        </p>
                        <p className="text-[16px] font-extrabold text-blue-900 mt-0.5">
                          ₹
                          {formatCurrency(
                            estimationResult?.grand_total +
                              ((inputData.panel_qty * inputData.panel_wattage) /
                                1000) *
                                profitPerKw +
                              (dealerCost *
                                inputData.panel_qty *
                                inputData.panel_wattage) /
                                1000,
                          )}
                        </p>
                        <p className="text-[6.5px] text-slate-500">
                          Incl. GST & Civil
                        </p>
                      </div>

                      <div className="bg-rose-50 p-3.5 rounded-lg border border-rose-300">
                        <p className="text-[7px] text-rose-800 font-bold uppercase">
                          Special Discount
                        </p>
                        <p className="text-[16px] font-extrabold text-rose-700 mt-0.5">
                          ₹
                          {formatCurrency(
                            ((inputData.panel_qty * inputData.panel_wattage) /
                              1000) *
                              discountPerKw,
                          )}
                        </p>
                        <p className="text-[6.5px] text-rose-600">
                          Total Project Cost
                        </p>
                      </div>

                      <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-300">
                        <p className="text-[7px] text-amber-900 font-bold uppercase">
                          Govt Subsidy Benefit
                        </p>
                        <p className="text-[16px] font-extrabold text-amber-700 mt-0.5">
                          ₹
                          {formatCurrency(
                            estimationResult.subsidy_amount || 78000,
                          )}
                        </p>
                        <p className="text-[6.5px] text-amber-800">
                          Estimated Benefit
                        </p>
                      </div>

                      <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-400">
                        <p className="text-[7px] text-emerald-900 font-bold uppercase">
                          Net Cost To Customer
                        </p>
                        <p className="text-[16px] font-extrabold text-emerald-800 mt-0.5">
                          ₹
                          {formatCurrency(
                            estimationResult.grand_total +
                              ((inputData.panel_qty * inputData.panel_wattage) /
                                1000) *
                                dealerCost +
                              ((inputData.panel_qty * inputData.panel_wattage) /
                                1000) *
                                profitPerKw -
                              ((inputData.panel_qty * inputData.panel_wattage) /
                                1000) *
                                discountPerKw -
                              estimationResult.subsidy_amount,
                          )}
                        </p>
                        <p className="text-[6.5px] text-emerald-700">
                          Effective Investment
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PRICE + DOCUMENTS */}
                  <div className="grid grid-cols-2 gap-4 pdf-section mb-6">
                    <div>
                      <p className="text-[14px] font-extrabold uppercase tracking-wider text-[#1d4e89] border-b-2 border-[#1d4e89] pb-0.5 mb-1">
                        Price
                      </p>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex justify-between text-[12px] pb-1 border-b border-slate-200">
                          <span>Total System Cost</span>
                          <span className="font-extrabold">
                            ₹
                            {formatCurrency(
                              estimationResult.grand_total +
                                ((inputData.panel_qty *
                                  inputData.panel_wattage) /
                                  1000) *
                                  profitPerKw +
                                (dealerCost *
                                  inputData.panel_qty *
                                  inputData.panel_wattage) /
                                  1000,
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between text-[12px] pb-1 border-b border-slate-200">
                          <span className="text-rose-700 font-bold">
                            Special Discount
                          </span>
                          <span className="font-extrabold text-rose-700">
                            - ₹
                            {formatCurrency(
                              ((inputData.panel_qty * inputData.panel_wattage) /
                                1000) *
                                discountPerKw,
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between py-1.5 px-2 bg-slate-900 text-white rounded-md">
                          <span className="font-bold text-[12px]">
                            Total Payable After Discount
                          </span>
                          <span className="font-extrabold text-[14px]">
                            ₹
                            {formatCurrency(
                              estimationResult.grand_total +
                                ((inputData.panel_qty *
                                  inputData.panel_wattage) /
                                  1000) *
                                  dealerCost -
                                ((inputData.panel_qty *
                                  inputData.panel_wattage) /
                                  1000) *
                                  discountPerKw +
                                ((inputData.panel_qty *
                                  inputData.panel_wattage) /
                                  1000) *
                                  profitPerKw,
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between text-[12px] py-1 border-b border-slate-200">
                          <span className="text-emerald-700 font-bold">
                            Subsidy Get Back
                          </span>
                          <span className="font-extrabold text-emerald-700">
                            - ₹{formatCurrency(estimationResult.subsidy_amount)}
                          </span>
                        </div>

                        <div className="flex justify-between text-[12px] py-1">
                          <span className="font-extrabold">
                            Total Cost After Subsidy
                          </span>
                          <span className="font-extrabold">
                            ₹
                            {formatCurrency(
                              estimationResult.grand_total +
                                ((inputData.panel_qty *
                                  inputData.panel_wattage) /
                                  1000) *
                                  dealerCost +
                                ((inputData.panel_qty *
                                  inputData.panel_wattage) /
                                  1000) *
                                  profitPerKw -
                                ((inputData.panel_qty *
                                  inputData.panel_wattage) /
                                  1000) *
                                  discountPerKw -
                                estimationResult.subsidy_amount,
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="text-[6.5px] text-slate-500 italic mt-1">
                        Amount in Words: Rupees
                        {formatCurrency(estimationResult.net_cost)} Only
                      </p>
                    </div>

                    <div>
                      <p className="text-[14px] font-extrabold uppercase tracking-wider text-[#1d4e89] border-b-2 border-[#1d4e89] pb-0.5 mb-3">
                        Required Documents
                      </p>

                      <div className="border border-slate-300 rounded-lg overflow-hidden grid grid-cols-2">
                        {[
                          "Electricity Bill",
                          "Bank Details",
                          "Aadhar Card",
                          "Property Tax Bill",
                          "Pan Card",
                        ].map((doc) => (
                          <div
                            key={doc}
                            className="flex items-center gap-1.5 p-2 border-b border-slate-200"
                          >
                            <span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-700 text-[7px] font-bold flex items-center justify-center shrink-0">
                              ✓
                            </span>

                            <span className="text-slate-800 font-bold text-[12px]">
                              {doc}
                            </span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[6.5px] text-slate-500 italic mt-1">
                        * All taxes, freight, DISCOM connectivity fees and
                        installation labour are included in the total system
                        cost above.
                      </p>
                    </div>
                  </div>

                  {/* TECHNICAL */}
                  <div className="mb-3.5 pdf-section mt-2">
                    <p className="text-[12px] font-extrabold uppercase tracking-wider text-[#1d4e89] border-b-2 border-[#1d4e89] pb-0.5 mb-1">
                      Technical System Configuration
                    </p>

                    <div className="grid grid-cols-2 gap-x-5">
                      {[
                        [
                          "Solar Panels:",
                          `${inputData.panel_brand.toUpperCase()} ${estimationResult.panel_wattage}W TOPCon / Bifacial (${estimationResult.panel_qty} Pcs)`,
                        ],
                        [
                          "Daily Generation:",
                          `~${Math.round(estimationResult.total_kw * 4)} Units / Day`,
                        ],
                        [
                          "Solar Inverter:",
                          `${Math.ceil(inputData.inverter_wattage)} kW - ${inputData.inverter_brand.toUpperCase()} On-Grid`,
                        ],
                        [
                          "Monthly Generation:",
                          `~${Math.round(estimationResult.total_kw * 120)} Units / Month`,
                        ],
                        ["Structure Spec:", "Heavy HDGI (40×60)"],
                        ["Avg DISCOM Tariff:", "₹8.00 / Unit"],
                        [
                          "Protection Systems:",
                          "ACDB/DCDB + LA",
                        ],
                        ["Scope of Work:", "Turnkey EPC (Design to Net-Meter)"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="flex justify-between py-2 border-b border-slate-100 gap-2"
                        >
                          <span className="text-slate-600 text-[14px]">
                            {label}
                          </span>

                          <span
                            className={`font-bold text-right text-[12px] ${
                              label === "Scope of Work:"
                                ? "text-emerald-700"
                                : "text-slate-900"
                            }`}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BANK + PAYMENT */}
                  <div className="grid grid-cols-2 gap-4 pdf-section mb-6 mt-8">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[14px]">
                      <p className="font-extrabold text-blue-900 mb-1">
                        Official Bank Account Details
                      </p>

                      <div className="grid grid-cols-2 gap-x-3 text-[10px]">
                        <div className="py-1 border-b border-slate-200">
                          <span className="text-slate-600">Account Name:</span>
                          <span className="font-bold text-slate-900 block leading-tight">
                            BHSQUARE SOLAR INSTALLATION AND SERVICES
                          </span>
                        </div>

                        <div className="py-1 border-b border-slate-200">
                          <span className="text-slate-600">
                            Account Number:
                          </span>
                          <span className="font-bold text-slate-900 block tracking-wider">
                            3422 0200 0012 50
                          </span>
                        </div>

                        <div className="py-1">
                          <span className="text-slate-600">Bank & Branch:</span>
                          <span className="font-bold text-slate-900 block">
                            Bank of Baroda, Kharel
                          </span>
                        </div>

                        <div className="py-1">
                          <span className="text-slate-600">IFSC Code:</span>
                          <span className="font-bold text-emerald-800 block tracking-widest">
                            BARB0KHAREL
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-300 text-[12px]">
                      <p className="font-extrabold text-amber-900 mb-1">
                        Payment & Execution Notes
                      </p>

                      <p className="font-bold text-rose-800 bg-rose-100 p-1 rounded border border-rose-200 leading-relaxed mb-1 text-[11px]">
                        • કામ પૂર્ણ થાય ત્યાં સુધીમાં 80% પેમેન્ટ કરવાનું રહેશે.
                        નહિતર મીટર ફાઈલ GEB / DISCOM માં મુકવામાં આવશે નહિ.
                      </p>

                      <div className=" text-[11px]">
                        <p className="font-medium text-slate-700 leading-relaxed">
                          • આ ESTIMATE બનાવ્યા તારીખથી 15 દિવસ સુધી જ માન્ય
                          ગણાશે.
                        </p>

                        <p className="font-medium text-slate-700 leading-relaxed">
                          • Mandatory GEB/DGVCL agreement on ₹300 E-Stamp paper.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WARNINGS + TERMS & CONDITIONS */}
                  <div className="grid grid-cols-2 gap-4 pdf-section mb-2 mt-5">
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                      <p className="text-[14px] font-extrabold uppercase tracking-wider text-rose-800 border-b border-rose-300 pb-0.5 mb-1">
                        Important Warnings
                      </p>

                      <ul className=" text-[9px] text-rose-900 font-medium">
                        <li>
                          • Meter / DISCOM charges, where applicable, are borne
                          by the customer.
                        </li>
                        <li>
                          • Physical or environmental damage is excluded from
                          warranty scope.
                        </li>
                        <li>
                          • Final generation depends on weather, site conditions
                          and system availability.
                        </li>
                        <li>
                          • Subsidy is subject to applicable government / DISCOM
                          approval and eligibility.
                        </li>
                      </ul>
                    </div>

                    <div className="border border-slate-200 rounded-lg p-2.5">
                      <p className="text-[14px] font-extrabold uppercase tracking-wider text-[#1d4e89] border-b-2 border-[#1d4e89] pb-0.5 mb-1">
                        Terms & Conditions
                      </p>

                      <ul className=" text-[9px] text-slate-700 font-medium">
                        <li>
                          • 30 Years linear performance warranty on solar
                          panels.
                        </li>
                        <li>• 8 Years warranty on solar on-grid inverter.</li>
                        <li>• 5 Years comprehensive system O&M warranty.</li>
                        <li>
                          • Three-Phase / 6 kW+ DISCOM meter charges borne by
                          customer.
                        </li>
                        <li>
                          • Standard manufacturer terms apply to component
                          warranties.
                        </li>
                        <li>
                          • Warranty excludes physical or environmental damage.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* SIGNATURES */}
                  <div className="pt-2 mt-6 border-t-2 border-slate-200 pdf-section">
                    <div className="grid grid-cols-3 gap-4 items-end">
                      <div className="text-[9px] text-slate-600">
                        <p className="font-extrabold text-[10px] text-slate-800">
                          Sales Contact
                        </p>
                        <p className="font-bold text-slate-900">Harsh Patel</p>
                        <p className="font-semibold text-blue-800">
                          +91 8733817262
                        </p>
                        <p>BHsquare Solar, Navsari</p>
                      </div>

                      <div className="border-t border-slate-400 pt-1 text-center">
                        <p className="font-bold text-[12px] text-slate-800">
                          {inputData.customer_name}
                        </p>
                        <p className="text-[6.5px] text-slate-500 mt-2">
                          (Client Signature & Stamp)
                        </p>
                      </div>

                      <div className="border-t border-amber-500 pt-1 text-center">
                        <p className="font-bold text-[12px] text-slate-800">
                          BHsquare Solar
                        </p>
                        <p className="text-[6.5px] text-slate-500 mt-2">
                          (Authorized Signatory & Stamp)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pdf-footer text-center text-[6.5px] mt-3 text-slate-400 border-t border-slate-100">
                    BHsquare Solar Installation And Services &nbsp;•&nbsp; Page
                    1 of 1 &nbsp;•&nbsp; Proposal for {inputData.customer_name}
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
