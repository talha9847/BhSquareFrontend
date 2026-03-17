import React, { useEffect, useState } from "react";
import {
  Save,
  User,
  Phone,
  MapPin,
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
  Loader2,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const DocumentCollection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId } = location.state || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [leadsData, setLeadsData] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [docInfo, setDocInfo] = useState({});
  const [isFound, setIsFound] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [docId, setDocId] = useState(0);
  const [gotoNext, setGotoNext] = useState(false);
  const [finalGo, setFinalGo] = useState(false);

  const [documents, setDocuments] = useState([
    { id: 1, name: "Aadhar Card", file: null },
    { id: 2, name: "Vera Bill", file: null },
    { id: 3, name: "Bank Passbook", file: null },
    { id: 4, name: "Light Bill", file: null },
  ]);
  const [docLoad, setDocLoad] = useState(false);
  const [nextLoad, setNextLoad] = useState(false);

  // --- NEW: Validation State ---
  const [errors, setErrors] = useState({});

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
      if (!docInfo.registration_number?.trim())
        tempErrors.registration_number = "Registration ID required";
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
      const res = await axios.post(`${apiUrl}/api/leads/updateLead`, {
        id: leadsData.id,
        customer_name: leadsData.customer_name,
        contact_number: leadsData.contact_number,
        address: leadsData.address,
      });

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
        `${apiUrl}/api/docs/getCustomerDocumentByCustomerId/${customerId}`,
      );
      if (res.data.data) {
        setDocInfo(res.data.data);
        console.log("i am talking about this");
        console.log(res.data.data);
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
    } catch (error) {
      console.error(error);
    }
  };

  const saveRegistratin = async () => {
    if (!validate("registration")) {
      toast.error("Please fill all registration fields");
      return;
    }
    try {
      setRegLoading(true);
      const res = await axios.put(
        `${apiUrl}/api/docs/upsertCustomerDocument`,
        docInfo,
      );
      if (res.status == 200) {
        getDocInfo();
        setRegLoading(false);
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
      const res = await axios.post(`${apiUrl}/api/leads/updateLead`, {
        id: leadsData.id,
        panel_wattage: leadsData.panel_wattage,
        number_of_panels: leadsData.number_of_panels,
      });
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
        if (doc.file) {
          formData.append(doc.name, doc.file);
        }
      });

      const res = await axios.post(
        `${apiUrl}/api/docs/uploadDocsToDrive`,
        formData,
      );
      if (res.status == 200) {
        console.log(res.data);
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
        `${apiUrl}/api/docs/getLeadDetailFromCustomerId/${customerId}`,
      );
      if (res.status === 200) {
        setLeadsData(res.data.data);
        console.log("thi ;dkjkdlfj lkdsjfklsd jfkldsj ;");
        // console.log(res.data.data);
        setGotoNext(res.data.readyForNextStage.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLeadsData();
    getDocInfo();
  }, []);

  const confirmAddDoc = () => {
    if (newDocName.trim()) {
      setDocuments((prevDocs) => [
        ...prevDocs,
        { id: Date.now(), name: newDocName, file: null },
      ]);
      setNewDocName("");
      setIsAddingDoc(false);
    }
  };

  const removeDoc = (id) => {
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
  };

  const handleFileChange = (id, file) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => (doc.id === id ? { ...doc, file: file } : doc)),
    );
  };

  const goToNextStage = async () => {
    setNextLoad(true);
    try {
      const res = await axios.post(
        `${apiUrl}/api/docs/completeStageAndPrepareNext`,
        {
          customer_id: customerId,
        },
      );

      if (res.status == 201) {
        toast.success("Staged Changed successfullyy");
        setNextLoad(false);
        navigate("/registration");
      }
    } catch (error) {
      setNextLoad(false);
      toast.error("Internal server error");
    }
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

        <main className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => window.history.back()}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1a5695] hover:border-[#1a5695] transition-all group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                Customer Profile
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ID: {customerId || "New Lead"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {/* Lead Identity */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User size={14} className="text-[#1a5695]" /> Lead Identity
                </h2>
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
                        errors.address ? "border-rose-500" : "border-slate-100"
                      } rounded-2xl text-sm font-bold text-slate-700 min-h-[80px] outline-none focus:bg-white focus:border-[#1a5695] transition-all`}
                      value={leadsData.address}
                      onChange={(e) => {
                        setLeadsData({ ...leadsData, address: e.target.value });
                        if (errors.address)
                          setErrors({ ...errors, address: null });
                      }}
                    />
                    {errors.address && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={saveIdentity}
                  className="w-full bg-[#1a5695] text-white py-3 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-[#15467a] transition-all"
                >
                  {loading ? (
                    <>
                      <Save size={14} /> Saving....
                      <Loader2 className="animate-spin h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save Identity
                    </>
                  )}
                </button>
              </div>

              {/* System Details */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Zap size={14} className="text-[#1a5695]" /> System
                  Calculation
                </h2>
                <div className="space-y-5 mb-6">
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-[#1a5695] uppercase">
                      Total Capacity
                    </span>
                    <span className="text-xl font-black text-[#1a5695]">
                      {(
                        (leadsData.panel_wattage * leadsData.number_of_panels) /
                        1000
                      ).toFixed(2)}{" "}
                      kW
                    </span>
                  </div>
                </div>
                <button
                  onClick={updateCapacity}
                  className="w-full bg-[#1a5695] text-white py-3 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-[#15467a] transition-all"
                >
                  {updateLoading ? (
                    <>
                      <Save size={14} /> Updating....
                      <Loader2 className="animate-spin h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Update Capacity
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Registration Info */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ClipboardCheck size={14} className="text-[#1a5695]" />{" "}
                    Registration Info
                  </h2>
                  <button
                    onClick={saveRegistratin}
                    disabled={regLoading}
                    className="bg-[#1a5695] text-white px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase flex items-center gap-2 hover:bg-[#15467a] transition-all shadow-md"
                  >
                    {regLoading ? (
                      <>
                        <Save size={14} />{" "}
                        {isFound ? "Updating..." : "Saving..."}
                        <Loader2 className="animate-spin h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Save size={14} />{" "}
                        {isFound ? "Update Data" : "Save Data"}
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    label="Consumer Number"
                    icon={<Hash size={14} />}
                    value={docInfo.consumer_number}
                    error={errors.consumer_number}
                    onChange={(v) => {
                      setDocInfo({ ...docInfo, consumer_number: v });
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
                      setDocInfo({ ...docInfo, geo_coordinate: v });
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
                      setDocInfo({ ...docInfo, sub_division: v });
                      if (errors.sub_division)
                        setErrors({ ...errors, sub_division: null });
                    }}
                  />
                  <CustomInput
                    label="Registration ID"
                    value={docInfo.registration_number}
                    error={errors.registration_number}
                    onChange={(v) => {
                      setDocInfo({ ...docInfo, registration_number: v });
                      if (errors.registration_number)
                        setErrors({ ...errors, registration_number: null });
                    }}
                  />
                </div>
              </div>

              {/* Documentation */}
              <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} className="text-[#1a5695]" />{" "}
                    Documentation
                  </h2>
                  <div className="flex gap-3">
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
                      className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-[10px] uppercase flex items-center gap-2 hover:bg-emerald-700 transition-all"
                    >
                      {docLoad ? (
                        <>
                          <Save size={14} /> Saving Docs....
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {isAddingDoc && (
                    <div className="p-6 border-2 border-[#1a5695] border-dashed rounded-[28px] bg-blue-50/50 flex flex-col justify-between h-40 animate-in zoom-in duration-200">
                      <p className="text-[10px] font-black text-[#1a5695] uppercase">
                        New Doc Name
                      </p>
                      <input
                        autoFocus
                        type="text"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        className="bg-transparent border-b border-[#1a5695] outline-none py-1 font-bold text-sm text-slate-700"
                        onKeyDown={(e) => e.key === "Enter" && confirmAddDoc()}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setIsAddingDoc(false)}
                          className="p-2 text-slate-400 hover:text-rose-500"
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={confirmAddDoc}
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
                      className="group relative p-6 border-2 border-dashed border-slate-100 rounded-[28px] hover:border-[#1a5695] hover:bg-blue-50/30 transition-all bg-slate-50/50 flex flex-col items-center justify-center text-center h-40"
                    >
                      <div className="flex justify-between items-center absolute top-4 w-full px-6">
                        <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-[#1a5695]">
                          {doc.name}
                        </span>
                        <button
                          onClick={() => removeDoc(doc.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <label className="flex flex-col items-center justify-center cursor-pointer w-full mt-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm mb-2 text-slate-300 group-hover:text-[#1a5695] group-hover:scale-110 transition-all">
                          <Upload size={20} />
                        </div>
                        {doc.file ? (
                          <span className="text-[10px] text-emerald-600 font-bold uppercase truncate max-w-[150px]">
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
            </div>
          </div>
        </main>

        {gotoNext && (
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-[24px] flex items-center justify-between animate-in slide-in-from-top-4 duration-500 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                <div className="relative p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-200">
                  <ClipboardCheck size={20} />
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                  Verification Complete
                </h4>
                <p className="text-sm font-bold text-slate-700">
                  Ready to transition this lead to the next stage
                </p>
              </div>
            </div>

            <button
              onClick={() => setFinalGo(true)} // Re-triggers the popup modal
              className="group bg-[#1a5695] hover:bg-[#15467a] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
            >
              Proceed to Next Stage
              <ArrowLeft
                size={16}
                className="rotate-180 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}

        {finalGo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-slate-100">
              {/* Close Button */}
              <button
                onClick={() => setFinalGo(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Header Section - Themed Blue */}
              <div className="bg-[#1a5695] p-8 text-white text-center relative overflow-hidden">
                {/* Decorative Background Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <ClipboardCheck size={120} />
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
                    <Navigation size={28} className="text-white" />
                  </div>
                  <h2 className="text-xl font-black font-syne uppercase tracking-tight">
                    Next Stage Transition
                  </h2>
                  <p className="text-blue-100/80 text-[10px] font-bold uppercase tracking-widest mt-1">
                    Lead: {leadsData.customer_name}
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-8">
                <div className="mb-8 space-y-4 text-center">
                  <p className="text-slate-600 font-medium leading-relaxed">
                    You are about to move this customer to the{" "}
                    <span className="text-[#1a5695] font-black italic">
                      Technical Verification
                    </span>{" "}
                    stage. All uploaded documents will be locked for review.
                  </p>

                  <div className="flex items-center gap-2 justify-center py-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Ready for Submission
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      goToNextStage();
                    }}
                    className="w-full py-4 bg-[#1a5695] hover:bg-[#15467a] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {nextLoad ? (
                      <>
                        Confirming.....
                        <ArrowLeft size={16} className="rotate-180" />
                        <Loader2 className="animate-spin h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Confirm & Proceed
                        <ArrowLeft size={16} className="rotate-180" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setFinalGo(false)}
                    className="w-full py-4 bg-white text-slate-400 hover:text-slate-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomInput = ({ label, placeholder, icon, value, onChange, error }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
      {label}
    </label>
    <div className="relative flex items-center">
      {icon && <div className="absolute left-4 text-slate-300">{icon}</div>}
      <input
        type="text"
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${icon ? "pl-11" : "px-4"} py-3.5 bg-slate-50 border ${
          error
            ? "border-rose-500 shadow-[0_0_0_1px_rgba(244,63,94,0.1)]"
            : "border-slate-100"
        } rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#1a5695] transition-all`}
      />
    </div>
    {error && (
      <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase animate-in fade-in slide-in-from-top-1">
        {error}
      </p>
    )}
  </div>
);

export default DocumentCollection;
