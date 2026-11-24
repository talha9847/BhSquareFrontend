import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import {
  Zap,
  Calculator,
  Loader2,
  Layers,
  FileText,
  IndianRupee,
  Package,
  Download,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-toastify";

// =========================================================
// HELPERS
// =========================================================
const normalizeWaNumber = (value) => {
  let n = String(value || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
  if (n.length === 10) n = "91" + n; // default to India
  return n;
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(val) || 0,
  );

const isMobile = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);

const groupItemsByCategory = (items = []) =>
  items.reduce((groups, item) => {
    const category = item.type || "OTHER";
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

// Downsamples the canvas and checks whether every pixel is blank (white or
// fully transparent). Some browsers — mainly WebKit/iOS — render a fully
// blank canvas when html2canvas clones a `position: fixed` element parked
// off-screen.
const isCanvasBlank = (canvas) => {
  try {
    const probe = document.createElement("canvas");
    probe.width = 120;
    probe.height = Math.max(
      1,
      Math.round((canvas.height / canvas.width) * 120),
    );
    const ctx = probe.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(canvas, 0, 0, probe.width, probe.height);
    const { data } = ctx.getImageData(0, 0, probe.width, probe.height);
    for (let i = 0; i < data.length; i += 4) {
      const hasInk =
        data[i + 3] > 10 &&
        (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245);
      if (hasInk) return false;
    }
    return true;
  } catch {
    // If pixels cannot be read (tainted canvas), assume content is fine.
    return false;
  }
};

// Captures the A4 template. The live template is parked off-screen
// (position: fixed, left: -10000px). It is brought on-screen ONLY inside the
// cloned document that html2canvas renders, so the visible page never flashes.
const captureTemplate = (el) =>
  html2canvas(el, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
    windowWidth: 794,
    onclone: (clonedDoc) => {
      const wrapper = clonedDoc.querySelector(".pdf-wrapper");
      if (wrapper) {
        wrapper.style.left = "0px";
        wrapper.style.top = "0px";
        wrapper.style.zIndex = "-1";
      }
    },
  });

const Field = ({ label, className = "bg-slate-50", ...props }) => (
  <div>
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
      {label}
    </label>
    <input
      {...props}
      className={`w-full mt-1.5 p-3.5 border border-slate-200 rounded-xl outline-none font-bold text-sm ${className}`}
    />
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-xs font-black uppercase tracking-widest text-[#1a5695] mb-3">
    {children}
  </h3>
);

// =========================================================
// COMPONENT
// =========================================================
const EstimationPanel = ({
  initialData,
  initialProfit = 0,
  initialDiscount = 0,
  initialDealerCost = 0,
  onResultChange,
  onExtraStateChange,
  onRegisterActions,
  showDownload = true,
  downloadButtonOnly = false,
}) => {
  const printRef = useRef(null);

  const [inverterRate, setInverterRate] = useState(0);
  const [profitPerKw, setProfitPerKw] = useState(initialProfit);
  const [discountPerKw, setDiscountPerKw] = useState(initialDiscount);
  const [dealerCost, setDealerCost] = useState(initialDealerCost);
  const [profitAfterDis, setProfitAfterDis] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [subsidyAmount, setSubsidyAmount] = useState(0);
  const [inputData, setInputData] = useState({
    panel_qty: 0,
    panel_wattage: 0,
    panel_rate_per_watt: 0,
    inverter_wattage: 0,
    customer_name: "",
    customer_address: "",
    customer_mobile: "+91 ",
    panel_brand: "",
    inverter_brand: "",
    customer_type: "Residential",
    dealer_cost: 0,
  });

  const totalKw = (inputData.panel_wattage * inputData.panel_qty) / 1000;
  const [estimationResult, setEstimationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingWa, setSendingWa] = useState(false);

  // =========================================================
  // SEED FROM PROPS
  // =========================================================
  useEffect(() => {
    if (!initialData) return;
    setInputData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  useEffect(() => setProfitPerKw(initialProfit || 0), [initialProfit]);
  useEffect(() => setDiscountPerKw(initialDiscount || 0), [initialDiscount]);
  useEffect(() => setDealerCost(initialDealerCost || 0), [initialDealerCost]);

  // =========================================================
  // NOTIFY PARENT
  // =========================================================
  useEffect(() => {
    onExtraStateChange?.({
      profitPerKw,
      discountPerKw,
      dealerCost,
      inverterRate,
    });
  }, [profitPerKw, discountPerKw, dealerCost, inverterRate]);

  useEffect(() => {
    onResultChange?.(estimationResult);
  }, [estimationResult]);

  // =========================================================
  // DERIVED NUMBERS (single source of truth for UI + PDF)
  // =========================================================
  const kw =
    (Number(inputData.panel_qty) * Number(inputData.panel_wattage)) / 1000 || 0;
  const grandTotalBase = Number(estimationResult?.grand_total) || 0;
  const subsidy = Number(estimationResult?.subsidy_amount) || 0;
  const dealerTotal = kw * (Number(dealerCost) || 0);
  const profitTotal = kw * (Number(profitPerKw) || 0);
  const discountTotal = kw * (Number(discountPerKw) || 0);

  const grandTotalWithDealer = grandTotalBase + dealerTotal; // shown in the on-screen cards
  const grossCost = grandTotalBase + profitTotal + dealerTotal; // total system cost
  const payable = grossCost - discountTotal; // after discount
  const netCost = payable - subsidy; // after subsidy

  // =========================================================
  // HANDLERS
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
        response.data.data.items?.forEach((i) => {
          if (i.name === "INVERTER") setInverterRate(i.price);
        });
        setSubsidyAmount(response.data.data.subsidy_amount);
        setMaterialCost(response.data.data.grand_total);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!printRef.current) return;

    const fileName =
      `${inputData.customer_name} ${inputData.panel_brand} ${kw} KW`
        .replace(/[\\/:*?"<>|]/g, "_")
        .trim() + ".pdf";

    // Mobile: use the html2canvas/jsPDF blob instead of window.print()
    if (isMobile()) {
      try {
        const blob = await buildPdfBlob();
        const file = new File([blob], fileName, { type: "application/pdf" });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: fileName });
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } catch (err) {
        if (err?.name !== "AbortError")
          toast.error(err.message || "Failed to create PDF");
      }
      return;
    }

    // Desktop: keep the existing print flow
    const previousTitle = document.title;
    document.title = fileName.replace(/\.pdf$/, "");
    document.body.classList.add("printing");
    const handleAfterPrint = () => {
      document.body.classList.remove("printing");
      document.title = previousTitle;
      window.removeEventListener("afterprint", handleAfterPrint);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    window.print();
  }, [inputData.customer_name, inputData.panel_brand, kw]);

  // ---------- Browser print (Download button) ----------

  useEffect(() => {
    onRegisterActions?.({ downloadPdf: handleDownloadPDF });
  }, [handleDownloadPDF]);

  // ---------- Build a PDF blob from the A4 template ----------
  const buildPdfBlob = async () => {
    const el = printRef.current;
    if (!el) throw new Error("Estimate template not ready");

    if (document.fonts?.ready) await document.fonts.ready;

    let canvas = await captureTemplate(el);
    let blank = !canvas.width || !canvas.height || isCanvasBlank(canvas);

    // Blank-capture fallback (WebKit/iOS + some mobile browsers): briefly
    // bring the REAL template on-screen behind the page content and capture
    // again. Styles are always restored.
    if (blank) {
      const wrapper = el.closest(".pdf-wrapper") || el.parentElement;
      const prevStyle = wrapper?.getAttribute("style") || "";
      try {
        if (wrapper) {
          wrapper.style.left = "0px";
          wrapper.style.top = "0px";
          wrapper.style.zIndex = "-1";
        }
        canvas = await captureTemplate(el);
      } finally {
        if (wrapper) wrapper.setAttribute("style", prevStyle);
      }
      blank = !canvas.width || !canvas.height || isCanvasBlank(canvas);
    }

    // Never share a blank document — fail loudly instead.
    if (blank) {
      throw new Error(
        "Could not render the estimate. Please use the Download button or try a different browser.",
      );
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth(); // 210
    const pageH = pdf.internal.pageSize.getHeight(); // 297

    // Fit to one A4 page keeping the real aspect ratio (no stretching)
    const ratio = canvas.height / canvas.width;
    let w = pageW;
    let h = pageW * ratio;
    if (h > pageH) {
      h = pageH;
      w = pageH / ratio;
    }
    const x = (pageW - w) / 2;

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.92),
      "JPEG",
      x,
      0,
      w,
      h,
      undefined,
      "FAST",
    );

    return pdf.output("blob");
  };

  // ---------- Send on WhatsApp ----------
  const handleShareWhatsApp = async () => {
    if (!estimationResult || !printRef.current) {
      toast.error("Please generate the estimation first");
      return;
    }

    const raw = normalizeWaNumber(inputData.customer_mobile);
    if (raw.length < 11 || raw.length > 15) {
      toast.error(
        "Enter a valid WhatsApp number (10 digits or with country code)",
      );
      return;
    }

    setSendingWa(true);
    try {
      const pdfBlob = await buildPdfBlob();

      const safeName =
        (inputData.customer_name || "Estimation")
          .replace(/[\\/:*?"<>|]/g, "_")
          .trim() || "Estimation";

      const formData = new FormData();
      formData.append("number", raw);
      formData.append(
        "caption",
        `Hello ${inputData.customer_name},\n\nPlease find your solar estimation attached.\n\n— BHSQUARE SOLAR`,
      );
      formData.append("pdf", pdfBlob, `${safeName}.pdf`);

      // Do NOT set Content-Type manually: the browser adds the boundary.
      const res = await axios.post("/api/whatsapp/share-pdf", formData, {
        withCredentials: true,
      });

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to send");
      }

      toast.success(`PDF sent to +${res.data?.data?.number || raw}`);

      if (initialData?.leadId) {
        await axios
          .patch(
            `/api/leads/updateLeadFlags/${initialData.leadId}`,
            { estimation_sent: true },
            { withCredentials: true },
          )
          .catch(() => {});
      }
    } catch (error) {
      console.error("Share WhatsApp error:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to share PDF",
      );
    } finally {
      setSendingWa(false);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body {
            width: 210mm !important; min-width: 210mm !important;
            margin: 0 !important; padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body.printing .no-print, body.printing .print\\:hidden { display: none !important; }
          /* The whole app shell (min-h-screen wrapper, sidebar, etc.) must
             collapse during print — otherwise it occupies a full blank page
             and pushes the A4 template to page 2. The template itself is
             portaled to <body>, outside #root, so it still prints. */
          body.printing #root { display: none !important; }
          body.printing .pdf-wrapper {
            position: static !important;
            left: auto !important;
            top: auto !important;
            width: auto !important;
            display: block !important;
          }
          body.printing .print-page {
            display: block !important;
            width: 210mm !important; height: 297mm !important; min-height: 0 !important;
            margin: 0 !important; padding: 0 !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      {/* ======================= FORM ======================= */}
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
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerateEstimation} className="space-y-6">
          {/* Customer Details */}
          <div>
            <SectionTitle>Customer Details</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field
                label="Customer Name"
                type="text"
                name="customer_name"
                value={inputData.customer_name}
                onChange={handleInputChange}
              />
              <Field
                label="Customer Address"
                type="text"
                name="customer_address"
                value={inputData.customer_address}
                onChange={handleInputChange}
              />
              <Field
                label="Customer Mobile"
                type="text"
                name="customer_mobile"
                value={inputData.customer_mobile}
                onChange={handleInputChange}
              />
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                  Customer Type
                </label>
                <select
                  name="customer_type"
                  required
                  value={inputData.customer_type}
                  onChange={handleInputChange}
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Panel Details */}
          <div>
            <SectionTitle>Panel Details</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <Field
                label="Panel Brand"
                className="bg-slate-50 uppercase"
                type="text"
                name="panel_brand"
                required
                value={inputData.panel_brand}
                onChange={handleInputChange}
              />
              <Field
                label="Panel Wattage (Wp)"
                type="text"
                inputMode="numeric"
                name="panel_wattage"
                required
                value={inputData.panel_wattage}
                onChange={handleInputChange}
              />
              <Field
                label="Panel Quantity"
                type="text"
                inputMode="numeric"
                name="panel_qty"
                required
                value={inputData.panel_qty}
                onChange={handleInputChange}
              />
              <Field
                label="Rate Per Watt (₹)"
                type="number"
                inputMode="numeric"
                name="panel_rate_per_watt"
                required
                value={inputData.panel_rate_per_watt}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Inverter Details */}
          <div>
            <SectionTitle>Inverter Details</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field
                label="Inverter Brand"
                className="bg-slate-50 uppercase"
                type="text"
                name="inverter_brand"
                required
                value={inputData.inverter_brand}
                onChange={handleInputChange}
              />
              <Field
                label="Inverter Wattage (kW)"
                type="number"
                name="inverter_wattage"
                required
                value={inputData.inverter_wattage}
                onChange={handleInputChange}
              />
              <Field
                label="Inverter Rate (₹)"
                className="bg-slate-100"
                type="text"
                readOnly
                value={formatCurrency(inverterRate)}
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <SectionTitle>Pricing Details</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Field
                  label="Profit Per kW (₹)"
                  type="text"
                  inputMode="numeric"
                  value={profitPerKw}
                  onChange={(e) => {
                    const newProfit = Number(e.target.value);
                    setProfitPerKw(newProfit);

                    const kw = Number(totalKw) || 0;
                    const disc = Number(discountPerKw) || 0;
                    setProfitAfterDis(kw * newProfit - kw * disc);
                  }}
                />
                <div>
                  {profitPerKw} * {totalKw} = {totalKw * profitPerKw}
                </div>
              </div>
              <div>
                <Field
                  label="Discount Per kW (₹)"
                  type="text"
                  inputMode="numeric"
                  value={discountPerKw}
                  onChange={(e) => {
                    const newDiscount = Number(e.target.value);
                    setDiscountPerKw(newDiscount);

                    const kw = Number(totalKw) || 0;
                    const profit = Number(profitPerKw) || 0;
                    setProfitAfterDis(kw * profit - kw * newDiscount);
                  }}
                />
                <div>
                  {discountPerKw} * {totalKw} = {totalKw * discountPerKw}
                </div>
              </div>
              <div>
                <Field
                  label="Dealer Cost (₹/kW)"
                  className="bg-slate-100"
                  type="text"
                  inputMode="numeric"
                  value={dealerCost}
                  onChange={(e) => setDealerCost(e.target.value)}
                />

                <div>
                  {dealerCost} * {totalKw} = {dealerCost * totalKw}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <Field
                  label="Total Profit After Discount"
                  type="text"
                  value={formatCurrency(profitAfterDis)}
                  readOnly
                />
              </div>
              <div>
                <Field
                  label="Material Cost"
                  type="text"
                  value={formatCurrency(materialCost)}
                  readOnly
                />
              </div>
              <div>
                <Field
                  label="Total Amount"
                  type="text"
                  value={formatCurrency(
                    materialCost + profitAfterDis + dealerCost * totalKw,
                  )}
                  readOnly
                />
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Field
                  label="Subsidy"
                  type="text"
                  value={subsidyAmount}
                  onChange={(e) => {
                    setSubsidyAmount(e.target.value);
                  }}
                />
                <Field
                  label="After Subsidy"
                  type="text"
                  value={formatCurrency(
                    Number(
                      materialCost +
                        profitAfterDis +
                        dealerCost * totalKw -
                        subsidyAmount,
                    ),
                  )}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#1a5695] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#144477] disabled:opacity-50"
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

        {/* Itemized Table */}
        {estimationResult?.items?.length > 0 && (
          <div className="mt-6 space-y-5">
            {Object.entries(groupItemsByCategory(estimationResult.items)).map(
              ([category, items]) => {
                const categorySubtotal = items.reduce(
                  (s, i) => s + (Number(i.qty) || 1) * (Number(i.price) || 0),
                  0,
                );
                const categoryGST = items.reduce((s, i) => {
                  const q = Number(i.qty) || 1;
                  const p = Number(i.price) || 0;
                  const st = q * p;
                  return (
                    s +
                    (Number(i.gst_amount) || (st * (Number(i.gst) || 0)) / 100)
                  );
                }, 0);
                const categoryTotal = categorySubtotal + categoryGST;

                return (
                  <div
                    key={category}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200">
                      <div>
                        <h3 className="text-sm font-black text-[#1a5695] uppercase tracking-wider">
                          {category.replaceAll("_", " ")}
                        </h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {items.length} Item{items.length !== 1 ? "s" : ""}
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
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-white border-b border-slate-200">
                          <tr>
                            {[
                              ["No.", "w-14 text-center"],
                              ["Product", ""],
                              ["Qty", "text-center"],
                              ["Unit Price", ""],
                              ["Subtotal", ""],
                              ["GST %", "text-center"],
                              ["GST Amount", ""],
                              ["Total", ""],
                            ].map(([h, cls]) => (
                              <th
                                key={h}
                                className={`px-5 py-3 text-[9px] font-black text-slate-400 uppercase ${cls}`}
                              >
                                {h}
                              </th>
                            ))}
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
                            return (
                              <tr
                                key={item.id || `${category}-${index}`}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                <td className="px-5 py-3 text-center font-bold text-slate-400">
                                  {index + 1}
                                </td>
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
                                <td className="px-5 py-3 text-center font-black text-slate-800">
                                  {qty}
                                </td>
                                <td className="px-5 py-3">
                                  ₹{formatCurrency(price)}
                                </td>
                                <td className="px-5 py-3 font-bold text-slate-800">
                                  ₹{formatCurrency(subtotal)}
                                </td>
                                <td className="px-5 py-3 text-center font-bold text-slate-500">
                                  {taxRate}%
                                </td>
                                <td className="px-5 py-3 text-slate-600">
                                  ₹{formatCurrency(taxAmt)}
                                </td>
                                <td className="px-5 py-3 font-black text-slate-900">
                                  ₹{formatCurrency(itemTotal)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              },
            )}

            <div className="bg-[#1a5695] text-white rounded-xl p-5 shadow-md flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">
                  Complete Estimation
                </p>
                <h3 className="text-lg font-black uppercase">Grand Total</h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">
                  ₹{formatCurrency(grandTotalWithDealer)}
                </p>
                <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">
                  Including GST
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============ DASHBOARD PREVIEW & ACTION BUTTONS ============ */}
      {estimationResult && showDownload && (
        <div className="space-y-6 print:hidden mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 bg-slate-50 text-[#1a5695] rounded-xl">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Capacity
                </p>
                <p className="text-base font-black text-slate-800">
                  {estimationResult.total_kw} KW
                </p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 bg-slate-50 text-[#1a5695] rounded-xl">
                <Package size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Panels
                </p>
                <p className="text-base font-black text-slate-800">
                  {estimationResult.panel_qty} Units
                </p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-3.5">
              <div className="p-2.5 bg-slate-50 text-[#1a5695] rounded-xl">
                <Layers size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Rating & Price
                </p>
                <p className="text-base font-black text-slate-800">
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
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Grand Total
                </p>
                <p className="text-base font-black text-slate-800">
                  ₹{formatCurrency(grandTotalWithDealer)}
                </p>
              </div>
            </div>
          </div>

          {!downloadButtonOnly && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  A4 Estimate Template Ready
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Download or share exact formatted PDF document
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md active:scale-95"
                >
                  <Download size={14} /> Download
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  disabled={sendingWa}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {sendingWa ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <MessageCircle size={14} />
                  )}
                  {sendingWa ? "Sending..." : "WhatsApp"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          A4 PDF TEMPLATE
          Rendered through a portal to <body>, parked off-screen at a
          real A4 width. NOT display:none, so it can always be measured
          and captured by html2canvas.
      ===================================================== */}
      {estimationResult &&
        createPortal(
          <div
            className="pdf-wrapper"
            aria-hidden="true"
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              width: "210mm",
              pointerEvents: "none",
            }}
          >
            <div
              id="printable-a4-template"
              ref={printRef}
              className="print-page w-[210mm] min-h-[297mm] bg-white text-[#222222] text-[8.5px] leading-[1.12] font-sans shadow-none"
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
                        GSTIN:{" "}
                        <span className="font-bold text-slate-900">
                          24ABDFB4169R1ZZ
                        </span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="bg-amber-100 text-amber-900 text-[7px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wider inline-block">
                        {inputData.customer_type} Solar Estimate
                      </span>
                      <p className="text-[7px] text-slate-700 mt-0.5">
                        Estimate Date:{" "}
                        <span className="font-bold text-slate-900">
                          {new Date().toLocaleDateString("en-GB")}
                        </span>
                      </p>
                      <p className="text-[7px] text-slate-700">
                        Validity:{" "}
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
                        {inputData.customer_type} Solar Project
                      </h2>
                      <p className="text-blue-100 text-[8px] mt-0.5 font-medium">
                        Turnkey EPC with {inputData.panel_brand.toUpperCase()}{" "}
                        {estimationResult.panel_wattage}W TOPCon / Bifacial
                        modules & {inputData.inverter_brand.toUpperCase()}{" "}
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
                        {estimationResult.panel_qty} ×{" "}
                        {inputData.panel_brand.toUpperCase()}{" "}
                        {estimationResult.panel_wattage}W
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-300">
                      <p className="text-[7px] text-slate-600 font-semibold">
                        Gross Project Cost
                      </p>
                      <p className="text-[16px] font-extrabold text-blue-900 mt-0.5">
                        ₹{formatCurrency(grossCost)}
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
                        ₹{formatCurrency(discountTotal)}
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
                        ₹{formatCurrency(netCost)}
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
                          ₹{formatCurrency(grossCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[12px] pb-1 border-b border-slate-200">
                        <span className="text-rose-700 font-bold">
                          Special Discount
                        </span>
                        <span className="font-extrabold text-rose-700">
                          - ₹{formatCurrency(discountTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 px-2 bg-slate-900 text-white rounded-md">
                        <span className="font-bold text-[12px]">
                          Total Payable After Discount
                        </span>
                        <span className="font-extrabold text-[14px]">
                          ₹{formatCurrency(payable)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[12px] py-1 border-b border-slate-200">
                        <span className="text-emerald-700 font-bold">
                          Subsidy Get Back
                        </span>
                        <span className="font-extrabold text-emerald-700">
                          - ₹{formatCurrency(subsidy)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[12px] py-1">
                        <span className="font-extrabold">
                          Total Cost After Subsidy
                        </span>
                        <span className="font-extrabold">
                          ₹{formatCurrency(netCost)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[6.5px] text-slate-500 italic mt-1">
                      Amount in Words: Rupees {formatCurrency(netCost)} Only
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
                      installation labour are included in the total system cost
                      above.
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
                        `${inputData.inverter_wattage} kW - ${inputData.inverter_brand.toUpperCase()} On-Grid`,
                      ],
                      [
                        "Monthly Generation:",
                        `~${Math.round(estimationResult.total_kw * 120)} Units / Month`,
                      ],
                      ["Structure Spec:", "Heavy HDGI (40×60)"],
                      ["Avg DISCOM Tariff:", "₹8.00 / Unit"],
                      ["Protection Systems:", "ACDB/DCDB + LA"],
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
                        <span className="text-slate-600">Account Number:</span>
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
                    <div className="text-[11px]">
                      <p className="font-medium text-slate-700 leading-relaxed">
                        • આ ESTIMATE બનાવ્યા તારીખથી 15 દિવસ સુધી જ માન્ય ગણાશે.
                      </p>
                      <p className="font-medium text-slate-700 leading-relaxed">
                        • Mandatory GEB/DGVCL agreement on ₹300 E-Stamp paper.
                      </p>
                    </div>
                  </div>
                </div>

                {/* WARNINGS + TERMS */}
                <div className="grid grid-cols-2 gap-4 pdf-section mb-2 mt-5">
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5">
                    <p className="text-[14px] font-extrabold uppercase tracking-wider text-rose-800 border-b border-rose-300 pb-0.5 mb-1">
                      Important Warnings
                    </p>
                    <ul className="text-[9px] text-rose-900 font-medium">
                      <li>
                        • Meter / DISCOM charges, where applicable, are borne by
                        the customer.
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
                    <ul className="text-[9px] text-slate-700 font-medium">
                      <li>
                        • 30 Years linear performance warranty on solar panels.
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
                  BHsquare Solar Installation And Services &nbsp;•&nbsp; Page 1
                  of 1 &nbsp;•&nbsp; Proposal for {inputData.customer_name}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default EstimationPanel;
