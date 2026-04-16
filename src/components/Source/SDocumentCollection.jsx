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
import Navbar from "../crm/Navbar";
import Sidebar from "./Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SDocumentCollection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId } = location.state || {};
  const { customerName } = location.state || {};
  const { contactNumber } = location.state || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");
  const [leadsData, setLeadsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL;

  const [docId, setDocId] = useState(0);
  const [gotoNext, setGotoNext] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [docInfo, setDocInfo] = useState({});

  const [documents, setDocuments] = useState([
    { id: 1, name: "Aadhar Card", file: null },
    { id: 2, name: "Vera Bill", file: null },
    { id: 3, name: "Bank Passbook", file: null },
    { id: 4, name: "Light Bill", file: null },
  ]);
  const [docLoad, setDocLoad] = useState(false);

  // --- NEW: Validation State ---

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
      formData.append("customerName", customerName);
      formData.append("contactNumber", contactNumber);

      documents.forEach((doc) => {
        if (doc.file) {
          formData.append(doc.name, doc.file);
        }
      });

      const res = await axios.post(`/api/docs/uploadDocsToDrive`, formData, {
        withCredentials: true,
      });
      if (res.status == 200) {
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
      // if (!docInfo.registration_number?.trim())
      //   tempErrors.registration_number = "Registration ID required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
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

  useEffect(() => {
    getDocInfo();
  }, []);

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
            <div className="lg:col-span-2 space-y-6">
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
                      setDocInfo({ ...docInfo, sub_division: v.toUpperCase() });
                      if (errors.sub_division)
                        setErrors({ ...errors, sub_division: null });
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
                        onChange={(e) =>
                          setNewDocName(e.target.value.toUpperCase())
                        }
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
        onChange={(e) => onChange(e.target.value.toUpperCase())}
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

export default SDocumentCollection;
