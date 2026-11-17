import React, { useEffect, useState } from "react";
import {
  Save,
  User,
  Phone,
  Zap,
  Hash,
  Globe,
  ClipboardCheck,
  FileText,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Navigation,
  X,
  Check,
  CheckCircle,
  ChevronDown,
  Layers,
  Loader2,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const DocumentCollection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId } = location.state || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [leadsData, setLeadsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [docInfo, setDocInfo] = useState({});
  const [isFound, setIsFound] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [docId, setDocId] = useState(0);
  const [gotoNext, setGotoNext] = useState(false);
  const [collectionStatus, setCollectionStatus] = useState([]);
  const [brands, setBrands] = useState([]);
  const [inverters, setInverters] = useState([]);

  const [panels, setPanels] = useState([]);
  const [selectPanelBrand, setselectPanelBrand] = useState(0);
  const [selectInverterBrand, setselectInverterBrand] = useState(0);
  const [documents, setDocuments] = useState([
    { id: 1, name: "Aadhar Card", file: null },
    { id: 2, name: "Vera Bill", file: null },
    { id: 3, name: "Bank Passbook", file: null },
    { id: 4, name: "Light Bill", file: null },
  ]);
  const [docLoad, setDocLoad] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);

  const [errors, setErrors] = useState({});

  const [finalizeForm, setFinalizeForm] = useState({
    cs_no: "",
    panel_brand_id: "",
    inverter_brand_id: "",
    panel_id: "",
    inverter_id: "",
    panel_capacity: "",
    inverter_capacity: "",
    panel_qty: "",
    inverter_qty: "",
  });
  const [finalizeErrors, setFinalizeErrors] = useState({});
  const [finalizeLoading, setFinalizeLoading] = useState(false);

  const fileteredPanel = panels.filter(
    (panel) => panel.brand.id == selectPanelBrand,
  );
  const fileteredInverter = inverters.filter(
    (inv) => inv.brand.id == selectInverterBrand,
  );

  const getBrands = async () => {
    try {
      const res = await axios.get(`/api/kitready/getAllBrands`, {
        withCredentials: true,
      });
      if (res.status == 200) {
        setBrands(res.data.data);
      }
    } catch (error) {}
  };
  const validate = (type) => {
    let tempErrors = {};
    if (type === "identity") {
      if (!leadsData.customer_name?.trim())
        tempErrors.customer_name = "Full name is required";
      if (!leadsData.contact_number?.trim())
        tempErrors.contact_number = "Contact is required";
      else if (!/^\d{10}$/.test(leadsData.contact_number))
        tempErrors.contact_number = "Enter valid 10-digit number";
      if (!leadsData.address?.trim())
        tempErrors.address = "Address is required";
    }
    if (type === "registration") {
      if (!docInfo.consumer_number?.trim())
        tempErrors.consumer_number = "Consumer number required";
      if (!docInfo.geo_coordinate?.trim())
        tempErrors.geo_coordinate = "Coordinates required";
      if (!docInfo.sub_division?.trim())
        tempErrors.sub_division = "Sub division required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const saveIdentity = async () => {
    if (!validate("identity")) {
      toast.error("Please fill all identity fields correctly");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `/api/leads/updateLead`,
        {
          id: leadsData.id,
          customer_name: leadsData.customer_name,
          contact_number: leadsData.contact_number,
          address: leadsData.address,
        },
        { withCredentials: true },
      );
      if (res.status == 200) {
        setLoading(false);
        getLeadsData();
        toast.success("Leads identity updated");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Internal server error");
    }
  };

  const getDocInfo = async () => {
    try {
      const res = await axios.get(
        `/api/docs/getCustomerDocumentByCustomerId/${customerId}`,
        { withCredentials: true },
      );
      if (res.data.data) {
        setDocInfo(res.data.data);
        setDocId(res.data.data.id);
        setIsFound(true);
      } else {
        setDocInfo({
          customer_id: customerId,
          consumer_number: "",
          geo_coordinate: "",
          registration_number: "",
          sub_division: "",
        });
      }
    } catch (error) {}
  };

  const getDocCollectStatus = async () => {
    try {
      const res = await axios.get(
        `/api/docs/getCustomerDocumentStatus/${customerId}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setCollectionStatus(res.data.data.documents);
      }
    } catch (error) {
      console.error("Error fetching status", error);
    }
  };

  const handleDocClick = (itemName, fileId, isGot, docId) => {
    if (!docId) {
      toast.error("Please fill all registration fields");
      return;
    }
    Swal.fire({
      title: `Verify ${itemName}?`,
      text: `Do you want to mark this document as ${isGot ? "Pending" : "Received"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1a5695",
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "Yes, Update it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await axios.post(
            `/api/docs/upsertCustomerDocumentFile`,
            { doc_id: docId, name: itemName },
            { withCredentials: true },
          );
          if (response.status !== 200) {
            throw new Error(response.data.message || "Update failed");
          }
          getLeadsData();
          return response.data;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        getDocCollectStatus();
        Swal.fire({
          title: "Updated!",
          text: `${itemName} status has been updated.`,
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
  };

  const saveRegistratin = async () => {
    if (!validate("registration")) {
      toast.error("Please fill all registration fields");
      return;
    }
    try {
      setRegLoading(true);
      const res = await axios.put(`/api/docs/upsertCustomerDocument`, docInfo, {
        withCredentials: true,
      });
      if (res.status == 200) {
        getDocInfo();
        setRegLoading(false);
        getDocCollectStatus();
        setIsFound(true);
        toast.success(
          isFound ? "Updated Successfully" : "Created Successfully",
        );
      }
    } catch (error) {
      setRegLoading(false);
      toast.error("Error saving registration");
    }
  };

  const updateCapacity = async () => {
    try {
      setUpdateLoading(true);
      const res = await axios.post(
        `/api/leads/updateLead`,
        {
          id: leadsData.id,
          panel_wattage: leadsData.panel_wattage,
          number_of_panels: leadsData.number_of_panels,
          inverter_kw: leadsData.inverter_kw,
          number_of_inverters: leadsData.number_of_inverters,
        },
        { withCredentials: true },
      );
      if (res.status == 200) {
        setUpdateLoading(false);
        getLeadsData();
        toast.success("Capacity updated");
      }
    } catch (error) {
      setUpdateLoading(false);
      toast.error("Internal server error");
    }
  };

  const saveAllDocs = async () => {
    if (!isFound) {
      toast.error("Fill detail above and then upload docs");
      return;
    }
    const hasFiles = documents.some((doc) => doc.file !== null);
    if (!hasFiles) {
      toast.error("Please select at least one document to upload");
      return;
    }
    try {
      setDocLoad(true);
      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("docId", docId);
      formData.append("customerName", leadsData.customer_name);
      formData.append("contactNumber", leadsData.contact_number);
      documents.forEach((doc) => {
        if (doc.file) formData.append(doc.name, doc.file);
      });
      const res = await axios.post(`/api/docs/uploadDocsToDrive`, formData, {
        withCredentials: true,
      });
      if (res.status == 200) {
        setGotoNext(res.data.readyForNextStage.status);
        setDocuments([
          { id: 1, name: "Aadhar Card", file: null },
          { id: 2, name: "Vera Bill", file: null },
          { id: 3, name: "Bank Passbook", file: null },
          { id: 4, name: "Light Bill", file: null },
        ]);
        toast.success("Uploaded successfully");
        setDocLoad(false);
      }
    } catch (error) {
      toast.error("Internal server error during upload");
      setDocLoad(false);
    }
  };

  const getLeadsData = async () => {
    try {
      const res = await axios.get(
        `/api/docs/getLeadDetailFromCustomerId/${customerId}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setLeadsData(res.data.data);
        setGotoNext(res.data.readyForNextStage.status);
      }
    } catch (error) {}
  };

  const getInverters = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/registrations/getInventoryByCategoryThree`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setInverters(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const getPanels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/registrations/getInventoryByCategory`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setPanels(res.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLeadsData();
    getDocInfo();
    getDocCollectStatus();
    getBrands();
    getPanels();
    getInverters();
  }, []);

  const confirmAddDoc = () => {
    if (newDocName.trim()) {
      setDocuments((prev) => [
        ...prev,
        { id: Date.now(), name: newDocName, file: null },
      ]);
      setNewDocName("");
      setIsAddingDoc(false);
    }
  };

  const removeDoc = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleFileChange = (id, file) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, file } : doc)),
    );
  };

  const goToNextStage = async () => {
    setNextLoad(true);
    try {
      const res = await axios.post(
        `/api/docs/completeStageAndPrepareNext`,
        { customer_id: customerId },
        { withCredentials: true },
      );
      if (res.status == 201) {
        toast.success("Stage changed successfully");
        setNextLoad(false);
        navigate("/registration");
      }
    } catch (error) {
      setNextLoad(false);
      toast.error("Internal server error");
    }
  };

  // ── Safe numeric math (no more "NaN kW" on empty fields) ──
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && v !== "" && v !== null ? n : 0;
  };
  const totalPanelCapacity = (
    (num(leadsData.panel_wattage) * num(leadsData.number_of_panels)) /
    1000
  ).toFixed(2);
  const totalInverterCapacity = (
    num(leadsData.inverter_kw) * num(leadsData.number_of_inverters)
  ).toFixed(2);

  const verifiedCount = collectionStatus.filter((d) => d.is_got).length;
  const progressPct = collectionStatus.length
    ? Math.round((verifiedCount / collectionStatus.length) * 100)
    : 0;

  const saveTechnicalFinalization = (e) => {
    e?.preventDefault();
    const errs = {};
    if (!finalizeForm.cs_no.trim()) errs.cs_no = "Consumer number is required";
    if (!finalizeForm.panel_brand_id)
      errs.panel_brand_id = "Panel brand is required";
    if (!finalizeForm.inverter_brand_id)
      errs.inverter_brand_id = "Inverter brand is required";
    if (!finalizeForm.panel_id) errs.panel_id = "Panel is required";
    if (!finalizeForm.inverter_id) errs.inverter_id = "Inverter is required";

    setFinalizeErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fill required fields");
      return;
    }

    setFinalizeLoading(true);
    setTimeout(() => {
      console.log("✅ Technical Finalize Saved:", finalizeForm);
      toast.success("Technical finalization saved (UI preview)");
      setFinalizeLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-syne">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Customers"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {/* ── Page header ───────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 lg:mb-8">
              <div className="flex items-center gap-4 min-w-0">
                <button
                  onClick={() => window.history.back()}
                  aria-label="Go back"
                  className="p-3 shrink-0 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1a5695] hover:border-[#1a5695] transition-all group"
                >
                  <ArrowLeft
                    size={20}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                </button>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight uppercase truncate">
                    Customer Profile
                  </h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                    ID: {customerId || "New Lead"}
                  </p>
                </div>
              </div>

              {/* status chips — makes the header feel complete */}
              <div className="flex items-center gap-2 flex-wrap">
                <StatusChip
                  tone="blue"
                  icon={<Zap size={12} />}
                  label={`${totalPanelCapacity} kW`}
                />
                <StatusChip
                  tone={progressPct === 100 ? "emerald" : "slate"}
                  icon={<ClipboardCheck size={12} />}
                  label={`${verifiedCount}/${collectionStatus.length || 0} docs`}
                />
                <StatusChip
                  tone={gotoNext ? "emerald" : "slate"}
                  icon={<Layers size={12} />}
                  label={gotoNext ? "Ready" : "In progress"}
                />
              </div>
            </div>

            {/* ── 12-col layout: sticky rail + fluid content ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* ══════════ LEFT: sticky summary rail ══════════ */}
              <aside
                className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24
                           lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1 lg:-mr-1
                           [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]
                           [&::-webkit-scrollbar]:w-1.5
                           [&::-webkit-scrollbar-thumb]:rounded-full
                           [&::-webkit-scrollbar-thumb]:bg-slate-200
                           [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {/* Lead Identity */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <SectionHeading
                    icon={<User size={14} />}
                    title="Lead Identity"
                  />
                  <div className="space-y-5 mb-6">
                    <CustomInput
                      label="Full Name"
                      value={leadsData.customer_name}
                      error={errors.customer_name}
                      onChange={(v) => {
                        setLeadsData({ ...leadsData, customer_name: v });
                        if (errors.customer_name)
                          setErrors({ ...errors, customer_name: null });
                      }}
                    />
                    <CustomInput
                      label="Contact"
                      icon={<Phone size={14} />}
                      value={leadsData.contact_number}
                      error={errors.contact_number}
                      onChange={(v) => {
                        setLeadsData({ ...leadsData, contact_number: v });
                        if (errors.contact_number)
                          setErrors({ ...errors, contact_number: null });
                      }}
                    />
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Site Address
                      </label>
                      <textarea
                        className={`w-full p-4 bg-slate-50 border ${
                          errors.address
                            ? "border-rose-500"
                            : "border-slate-100"
                        } rounded-2xl text-sm font-bold text-slate-700 min-h-[80px] outline-none focus:bg-white focus:border-[#1a5695] transition-all resize-y`}
                        value={leadsData.address || ""}
                        onChange={(e) => {
                          setLeadsData({
                            ...leadsData,
                            address: e.target.value,
                          });
                          if (errors.address)
                            setErrors({ ...errors, address: null });
                        }}
                      />
                      {errors.address && (
                        <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase animate-in fade-in slide-in-from-bottom-2">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={saveIdentity}
                    disabled={loading}
                    className="mt-auto w-full bg-[#1a5695] text-white py-3 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-[#15467a] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Save size={14} /> Saving…{" "}
                        <Loader2 className="animate-spin h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Save Identity
                      </>
                    )}
                  </button>
                </div>

                {/* System Calculation */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <SectionHeading
                    icon={<Zap size={14} />}
                    title="System Calculation"
                  />
                  <div className="space-y-4 mb-5">
                    <div className="grid grid-cols-2 gap-3">
                      <CustomInput
                        label="Wattage"
                        placeholder="540"
                        value={leadsData.panel_wattage}
                        onChange={(v) =>
                          setLeadsData({ ...leadsData, panel_wattage: v })
                        }
                      />
                      <CustomInput
                        label="Total Panels"
                        placeholder="10"
                        value={leadsData.number_of_panels}
                        onChange={(v) =>
                          setLeadsData({ ...leadsData, number_of_panels: v })
                        }
                      />
                    </div>
                    <ResultBar
                      label="Panel Capacity"
                      value={`${totalPanelCapacity} kW`}
                    />
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                      <CustomInput
                        label="Inverter KW"
                        placeholder="5"
                        value={leadsData.inverter_kw}
                        onChange={(v) =>
                          setLeadsData({ ...leadsData, inverter_kw: v })
                        }
                      />
                      <CustomInput
                        label="Total Inverters"
                        placeholder="2"
                        value={leadsData.number_of_inverters}
                        onChange={(v) =>
                          setLeadsData({ ...leadsData, number_of_inverters: v })
                        }
                      />
                    </div>
                    <ResultBar
                      label="Inverter Capacity"
                      value={`${totalInverterCapacity} kW`}
                    />
                  </div>
                  <button
                    onClick={updateCapacity}
                    disabled={updateLoading}
                    className="mt-auto w-full bg-[#1a5695] text-white py-3 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-[#15467a] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {updateLoading ? (
                      <>
                        <Save size={14} /> Updating…{" "}
                        <Loader2 className="animate-spin h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Update Capacity
                      </>
                    )}
                  </button>
                </div>

                {/* Collection Checklist — moved here so the rail doesn't die early */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="min-w-0">
                      <SectionHeading
                        icon={<ClipboardCheck size={14} />}
                        title="Collection Checklist"
                        noMargin
                      />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                        {verifiedCount} of {collectionStatus.length || 0}{" "}
                        verified
                      </p>
                    </div>
                    <ProgressRing pct={progressPct} />
                  </div>

                  <ul className="space-y-2">
                    {collectionStatus.map((item, index) => {
                      const got = item.is_got;
                      return (
                        <li key={index}>
                          <button
                            type="button"
                            onClick={() =>
                              handleDocClick(
                                item.name,
                                item.file_id,
                                item.is_got,
                                item.doc_id,
                              )
                            }
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all active:scale-[0.99] ${
                              got
                                ? "bg-emerald-50/70 border-emerald-100 hover:border-emerald-200"
                                : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white"
                            }`}
                          >
                            <span
                              className={`grid place-items-center h-6 w-6 rounded-lg shrink-0 ${
                                got
                                  ? "bg-emerald-500 text-white"
                                  : "bg-slate-200 text-slate-400"
                              }`}
                            >
                              {got ? (
                                <Check size={12} strokeWidth={4} />
                              ) : (
                                <X size={12} strokeWidth={4} />
                              )}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase tracking-tight truncate ${
                                got ? "text-emerald-700" : "text-slate-500"
                              }`}
                            >
                              {item.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}

                    {collectionStatus.length === 0 && (
                      <li className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3 text-center">
                        No checklist available
                      </li>
                    )}
                  </ul>
                </div>
              </aside>

              {/* ══════════ RIGHT: main work area ══════════ */}
              <div className="lg:col-span-7 xl:col-span-8 2xl:col-span-8 space-y-6">
                {/* Registration Info */}
                <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center gap-4 mb-8 flex-wrap">
                    <SectionHeading
                      icon={<ClipboardCheck size={14} />}
                      title="Registration Info"
                      noMargin
                    />
                    <button
                      onClick={saveRegistratin}
                      disabled={regLoading}
                      className="bg-[#1a5695] text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase flex items-center gap-2 hover:bg-[#15467a] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {regLoading ? (
                        <>
                          <Save size={14} />
                          {isFound ? "Updating…" : "Saving…"}
                          <Loader2 className="animate-spin h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          {isFound ? "Update Data" : "Save Data"}
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <CustomInput
                      label="Consumer Number"
                      icon={<Hash size={14} />}
                      value={docInfo.consumer_number}
                      error={errors.consumer_number}
                      onChange={(v) => {
                        setDocInfo({
                          ...docInfo,
                          consumer_number: v.toUpperCase(),
                        });
                        if (errors.consumer_number)
                          setErrors({ ...errors, consumer_number: null });
                      }}
                    />
                    <CustomInput
                      label="Geo Coordinates"
                      icon={<Globe size={16} />}
                      value={docInfo.geo_coordinate}
                      error={errors.geo_coordinate}
                      onChange={(v) => {
                        setDocInfo({
                          ...docInfo,
                          geo_coordinate: v.toUpperCase(),
                        });
                        if (errors.geo_coordinate)
                          setErrors({ ...errors, geo_coordinate: null });
                      }}
                    />
                    <CustomInput
                      label="Sub Division"
                      icon={<Navigation size={16} />}
                      value={docInfo.sub_division}
                      error={errors.sub_division}
                      onChange={(v) => {
                        setDocInfo({
                          ...docInfo,
                          sub_division: v.toUpperCase(),
                        });
                        if (errors.sub_division)
                          setErrors({ ...errors, sub_division: null });
                      }}
                    />
                  </div>
                </div>

                {/* Technical Finalization */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* ── Header ─────────────────────────────────────────── */}
                  <div className="flex flex-wrap items-start justify-between gap-4 p-6 lg:p-8 border-b border-slate-100 bg-gradient-to-br from-slate-50/90 via-white to-white">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="grid place-items-center h-10 w-10 rounded-2xl bg-[#1a5695]/10 text-[#1a5695] shrink-0">
                        <CheckCircle size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-800">
                          Technical Finalization
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                          Provide final system specifications
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={saveTechnicalFinalization}
                      disabled={finalizeLoading}
                      className="bg-[#1a5695] text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase flex items-center gap-2 hover:bg-[#15467a] transition-all shadow-md shadow-[#1a5695]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {finalizeLoading ? (
                        <>
                          <Save size={14} /> Saving…{" "}
                          <Loader2 className="animate-spin h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <Save size={14} /> Save Finalization
                        </>
                      )}
                    </button>
                  </div>

                  <form
                    onSubmit={saveTechnicalFinalization}
                    className="p-6 lg:p-8 space-y-7"
                  >
                    {/* ── 1. Connection Identity + Loan ─────────────────── */}
                    <section>
                      <StepHeading
                        step="01"
                        title="Connection Identity"
                        hint="Required"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ModalInput
                          label="Consumer No (CS_NO)"
                          placeholder="Enter CS Number"
                          value={finalizeForm.cs_no}
                          error={finalizeErrors.cs_no}
                          onChange={(e) => {
                            setFinalizeForm({
                              ...finalizeForm,
                              cs_no: e.target.value.toUpperCase(),
                            });
                            if (finalizeErrors.cs_no)
                              setFinalizeErrors({
                                ...finalizeErrors,
                                cs_no: null,
                              });
                          }}
                        />

                        <LoanToggle
                          value={finalizeForm.loan_required}
                          error={finalizeErrors.loan_required}
                          onChange={(v) => {
                            setFinalizeForm({
                              ...finalizeForm,
                              loan_required: v,
                            });
                            if (finalizeErrors.loan_required)
                              setFinalizeErrors({
                                ...finalizeErrors,
                                loan_required: null,
                              });
                          }}
                        />
                      </div>
                    </section>

                    {/* ── 2. Brand Selection ────────────────────────────── */}
                    <section>
                      <StepHeading
                        step="02"
                        title="Brand Selection"
                        hint="Required"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ModalSelect
                          label="Panel Brand"
                          name="panel_brand_id"
                          value={finalizeForm.panel_brand_id}
                          error={finalizeErrors.panel_brand_id}
                          onChange={(e) => {
                            const v = e.target.value;
                            setselectPanelBrand(v);
                            setFinalizeForm({
                              ...finalizeForm,
                              panel_brand_id: v,
                              // reset dependent picks so stale components can't survive a brand swap
                              panel_id: "",
                              panel_capacity: "",
                              panel_qty: "",
                            });
                            if (finalizeErrors.panel_brand_id)
                              setFinalizeErrors({
                                ...finalizeErrors,
                                panel_brand_id: null,
                              });
                          }}
                        >
                          <option value="">-- Select Panel Brand --</option>
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </ModalSelect>

                        <ModalSelect
                          label="Inverter Brand"
                          name="inverter_brand_id"
                          value={finalizeForm.inverter_brand_id}
                          error={finalizeErrors.inverter_brand_id}
                          onChange={(e) => {
                            const v = e.target.value;
                            setselectInverterBrand(v);
                            setFinalizeForm({
                              ...finalizeForm,
                              inverter_brand_id: v,
                              inverter_id: "",
                              inverter_capacity: "",
                              inverter_qty: "",
                            });
                            if (finalizeErrors.inverter_brand_id)
                              setFinalizeErrors({
                                ...finalizeErrors,
                                inverter_brand_id: null,
                              });
                          }}
                        >
                          <option value="">-- Select Inverter Brand --</option>
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </ModalSelect>
                      </div>
                    </section>

                    {/* ── 3. Component Selection ────────────────────────── */}
                    <section>
                      <StepHeading
                        step="03"
                        title="Component Selection"
                        hint="Required"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ModalSelect
                          label="Select Panel"
                          name="panel_id"
                          value={finalizeForm.panel_id}
                          error={finalizeErrors.panel_id}
                          disabled={!finalizeForm.panel_brand_id}
                          onChange={(e) => {
                            const id = e.target.value;
                            const found = fileteredPanel.find(
                              (p) => p.id === id,
                            );
                            setFinalizeForm({
                              ...finalizeForm,
                              panel_id: id,
                              panel_capacity: found ? "5.40" : "",
                              panel_qty: found ? String(found.qty) : "",
                            });
                            if (finalizeErrors.panel_id)
                              setFinalizeErrors({
                                ...finalizeErrors,
                                panel_id: null,
                              });
                          }}
                          className={
                            !finalizeForm.panel_brand_id
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }
                        >
                          <option value="">
                            {finalizeForm.panel_brand_id
                              ? "-- Select Panel --"
                              : "Select a brand first"}
                          </option>
                          {finalizeForm.panel_brand_id &&
                            fileteredPanel.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.qty})
                              </option>
                            ))}
                        </ModalSelect>

                        <ModalSelect
                          label="Select Inverter"
                          name="inverter_id"
                          value={finalizeForm.inverter_id}
                          error={finalizeErrors.inverter_id}
                          disabled={!finalizeForm.inverter_brand_id}
                          onChange={(e) => {
                            const id = e.target.value;
                            const found = fileteredInverter.find(
                              (i) => i.id === id,
                            );
                            setFinalizeForm({
                              ...finalizeForm,
                              inverter_id: id,
                              inverter_capacity: found ? "5.00" : "",
                              inverter_qty: found ? String(found.qty) : "",
                            });
                            if (finalizeErrors.inverter_id)
                              setFinalizeErrors({
                                ...finalizeErrors,
                                inverter_id: null,
                              });
                          }}
                          className={
                            !finalizeForm.inverter_brand_id
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }
                        >
                          <option value="">
                            {finalizeForm.inverter_brand_id
                              ? "-- Select Inverter --"
                              : "Select a brand first"}
                          </option>
                          {finalizeForm.inverter_brand_id &&
                            fileteredInverter.map((i) => (
                              <option key={i.id} value={i.id}>
                                {i.name} ({i.qty})
                              </option>
                            ))}
                        </ModalSelect>
                      </div>
                    </section>

                    {/* ── Live summary footer ───────────────────────────── */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#1a5695] to-[#123f6d] p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                      <div className="grid place-items-center h-9 w-9 rounded-xl bg-white/10 text-white shrink-0">
                        <Layers size={16} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 flex-1 min-w-0">
                        <SummaryCell
                          label="Panel"
                          name={
                            fileteredPanel.find(
                              (p) => p.id === finalizeForm.panel_id,
                            )?.name || "—"
                          }
                          qty={finalizeForm.panel_qty}
                        />
                        <SummaryCell
                          label="Inverter"
                          name={
                            fileteredInverter.find(
                              (i) => i.id === finalizeForm.inverter_id,
                            )?.name || "—"
                          }
                          qty={finalizeForm.inverter_qty}
                        />
                      </div>

                      {finalizeForm.loan_required && (
                        <span
                          className={`shrink-0 self-start sm:self-auto px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                            finalizeForm.loan_required === "yes"
                              ? "bg-emerald-400 text-emerald-950"
                              : "bg-white/15 text-white ring-1 ring-inset ring-white/20"
                          }`}
                        >
                          {finalizeForm.loan_required === "yes"
                            ? "Loan Required"
                            : "No Loan"}
                        </span>
                      )}
                    </div>
                  </form>
                </div>

                {/* Documentation */}
                <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
                    <SectionHeading
                      icon={<FileText size={14} />}
                      title="Documentation"
                      noMargin
                    />
                    <div className="flex gap-3 flex-wrap">
                      {!isAddingDoc && (
                        <button
                          onClick={() => setIsAddingDoc(true)}
                          className="text-[10px] font-black uppercase text-[#1a5695] bg-blue-50 px-4 py-2 rounded-xl hover:bg-[#1a5695] hover:text-white transition-all flex items-center gap-2"
                        >
                          <Plus size={14} /> Add Item
                        </button>
                      )}
                      <button
                        onClick={saveAllDocs}
                        disabled={docLoad}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-[10px] uppercase flex items-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {docLoad ? (
                          <>
                            <Save size={14} /> Saving Docs…{" "}
                            <Loader2 className="animate-spin h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <Save size={14} /> Save All Docs
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                    {isAddingDoc && (
                      <div className="p-6 border-2 border-[#1a5695] border-dashed rounded-3xl bg-blue-50/50 flex flex-col justify-between h-40 animate-in zoom-in duration-200">
                        <p className="text-[10px] font-black text-[#1a5695] uppercase">
                          New Doc Name
                        </p>
                        <input
                          autoFocus
                          type="text"
                          value={newDocName}
                          onChange={(e) =>
                            setNewDocName(e.target.value.toUpperCase())
                          }
                          className="bg-transparent border-b border-[#1a5695] outline-none py-1 font-bold text-sm text-slate-700"
                          onKeyDown={(e) =>
                            e.key === "Enter" && confirmAddDoc()
                          }
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setIsAddingDoc(false)}
                            aria-label="Cancel new document"
                            className="p-2 text-slate-400 hover:text-rose-500"
                          >
                            <X size={18} />
                          </button>
                          <button
                            onClick={confirmAddDoc}
                            aria-label="Confirm new document"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="group relative p-6 border-2 border-dashed border-slate-100 rounded-3xl hover:border-[#1a5695] hover:bg-blue-50/30 transition-all bg-slate-50/50 flex flex-col items-center justify-center text-center h-40"
                      >
                        <div className="flex justify-between items-center absolute top-4 left-0 right-0 px-5">
                          <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-[#1a5695] truncate pr-2">
                            {doc.name}
                          </span>
                          <button
                            onClick={() => removeDoc(doc.id)}
                            aria-label={`Remove ${doc.name}`}
                            className="text-slate-300 hover:text-rose-500 transition-colors shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <label className="flex flex-col items-center justify-center cursor-pointer w-full mt-4">
                          <div className="p-3 bg-white rounded-2xl shadow-sm mb-2 text-slate-300 group-hover:text-[#1a5695] group-hover:scale-110 transition-all">
                            <Upload size={20} />
                          </div>
                          {doc.file ? (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase truncate max-w-[160px]">
                              {doc.file.name}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Click to Upload
                            </span>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              handleFileChange(doc.id, e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ready-to-advance banner — now sticky at the bottom of the flow */}
                {gotoNext && (
                  <div className="sticky bottom-4 z-30 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white/95 backdrop-blur-md border border-emerald-200 ring-1 ring-emerald-100 shadow-xl shadow-emerald-900/10 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 bg-emerald-400 rounded-2xl animate-ping opacity-20" />
                          <div className="relative p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-200">
                            <ClipboardCheck size={20} />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                            Verification Complete
                          </h4>
                          <p className="text-sm font-bold text-slate-700 truncate">
                            Ready to transition this lead to the next stage
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={goToNextStage}
                        disabled={nextLoad}
                        className="group shrink-0 bg-[#1a5695] hover:bg-[#15467a] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/10 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {nextLoad ? (
                          <>
                            Confirming…{" "}
                            <Loader2 className="animate-spin h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Proceed to Next Stage
                            <ArrowLeft
                              size={16}
                              className="rotate-180 group-hover:translate-x-1 transition-transform"
                            />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
const StepHeading = ({ step, title, hint }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <span className="grid place-items-center h-5 w-5 rounded-md bg-[#1a5695]/10 text-[9px] font-black text-[#1a5695] shrink-0">
      {step}
    </span>
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
      {title}
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
    {hint && (
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
        {hint}
      </span>
    )}
  </div>
);

const SummaryCell = ({ label, name, qty }) => (
  <div className="min-w-0">
    <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/50">
      {label}
    </p>
    <p className="text-[11px] font-black text-white truncate mt-0.5">
      {name}
      <span className="text-white/60 font-bold"> × {qty || "—"}</span>
    </p>
  </div>
);

const LoanToggle = ({ value, onChange, error }) => {
  const on = value === "yes";

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">
        Loan Required
      </label>

      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-invalid={!!error}
        aria-describedby={error ? "loan-toggle-error" : undefined}
        onClick={() => onChange(on ? "no" : "yes")}
        className={`w-full h-[52px] px-4 flex items-center justify-between gap-3 rounded-2xl border
          transition-all outline-none focus:ring-2 focus:ring-[#1a5695]/20 ${
            error
              ? "border-red-200 bg-red-50"
              : on
                ? "border-[#1a5695]/30 bg-blue-50/60"
                : "border-slate-100 bg-slate-50"
          }`}
      >
        <span
          className={`text-[10px] font-black uppercase tracking-wider transition-colors ${
            value
              ? on
                ? "text-[#1a5695]"
                : "text-slate-500"
              : "text-slate-400"
          }`}
        >
          {value
            ? on
              ? "Yes — Loan Required"
              : "No — Cash / Self Funded"
            : "Not set"}
        </span>

        <span
          className={`relative shrink-0 h-6 w-11 rounded-full transition-colors duration-200 ${
            on ? "bg-[#1a5695]" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm
              transition-transform duration-200 ease-out ${
                on ? "translate-x-5" : "translate-x-0"
              }`}
          />
        </span>
      </button>

      {error && (
        <p
          id="loan-toggle-error"
          className="text-[9px] text-red-500 font-bold italic ml-1 uppercase animate-in fade-in slide-in-from-bottom-2"
        >
          {error}
        </p>
      )}
    </div>
  );
};
/* ─────────────────────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────────────────────── */

const SectionHeading = ({ icon, title, noMargin }) => (
  <div className={`flex items-center gap-2 ${noMargin ? "" : "mb-6"}`}>
    <span className="text-[#1a5695]">{icon}</span>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {title}
    </span>
  </div>
);

const StatusChip = ({ icon, label, tone = "slate" }) => {
  const tones = {
    slate: "bg-white border-slate-200 text-slate-500",
    blue: "bg-blue-50 border-blue-100 text-[#1a5695]",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider ${tones[tone]}`}
    >
      {icon}
      {label}
    </span>
  );
};

const ProgressRing = ({ pct }) => (
  <div
    className="relative grid place-items-center h-11 w-11 rounded-full shrink-0"
    style={{
      background: `conic-gradient(#1a5695 ${pct * 3.6}deg, #e2e8f0 0deg)`,
    }}
    role="img"
    aria-label={`${pct}% of documents verified`}
  >
    <div className="h-9 w-9 rounded-full bg-white grid place-items-center">
      <span className="text-[9px] font-black text-[#1a5695]">{pct}%</span>
    </div>
  </div>
);

const ResultBar = ({ label, value }) => (
  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center gap-2">
    <span className="text-[10px] font-black text-[#1a5695] uppercase truncate">
      {label}
    </span>
    <span className="text-lg font-black text-[#1a5695] whitespace-nowrap">
      {value}
    </span>
  </div>
);

const CustomInput = ({ label, placeholder, icon, value, onChange, error }) => {
  const inputId = `field-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  const errId = `${inputId}-error`;
  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={inputId}
        className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wide"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-4 text-slate-300">{icon}</div>}
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={`w-full ${icon ? "pl-11" : "px-4"} py-3.5 bg-slate-50 border ${
            error
              ? "border-rose-500 shadow-[0_0_0_1px_rgba(244,63,94,0.1)]"
              : "border-slate-100"
          } rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#1a5695] transition-all`}
        />
      </div>
      {error && (
        <p
          id={errId}
          className="text-[10px] text-rose-500 font-bold ml-1 uppercase animate-in fade-in slide-in-from-bottom-2"
        >
          {error}
        </p>
      )}
    </div>
  );
};

const ModalSectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-6 h-6 rounded-lg bg-slate-100 text-[#1a5695] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
      {title}
    </span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
);

const ModalInput = ({ label, placeholder, error, id, autoFocus, ...rest }) => {
  const inputId =
    id || `modal-input-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  const errorId = `${inputId}-error`;
  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={inputId}
        className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          {...rest}
          id={inputId}
          autoFocus={autoFocus}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${
            error
              ? "border-red-200 bg-red-50"
              : "border-slate-100 focus:border-[#1a5695] focus:bg-white"
          }`}
        />
      </div>
      {error && (
        <p
          id={errorId}
          className="text-[9px] text-red-500 font-bold italic ml-1 uppercase animate-in fade-in slide-in-from-bottom-2"
        >
          {error.message || error}
        </p>
      )}
    </div>
  );
};

const ModalSelect = ({ label, error, children, id, name, ...rest }) => {
  const selectId =
    id || `modal-select-${(name || label)?.replace(/\s+/g, "-").toLowerCase()}`;
  const errorId = `${selectId}-error`;
  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={selectId}
        className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest"
      >
        {label}
      </label>
      <div className="relative">
        <select
          {...rest}
          id={selectId}
          name={name}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`w-full appearance-none px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all pr-10 ${
            error
              ? "border-red-200 bg-red-50"
              : "border-slate-100 focus:border-[#1a5695] focus:bg-white"
          }`}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
      {error && (
        <p
          id={errorId}
          className="text-[9px] text-red-500 font-bold italic ml-1 uppercase animate-in fade-in slide-in-from-bottom-2"
        >
          {error.message || error}
        </p>
      )}
    </div>
  );
};

const SpecTile = ({ icon, label, value, unit }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-3 flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-slate-400">
      <span className="text-[#1a5695]">{icon}</span>
      <span className="text-[8px] font-black uppercase tracking-widest truncate">
        {label}
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-black text-slate-800 leading-none">
        {value || "—"}
      </span>
      {unit && (
        <span className="text-[9px] font-bold text-slate-400 uppercase">
          {unit}
        </span>
      )}
    </div>
  </div>
);

export default DocumentCollection;
