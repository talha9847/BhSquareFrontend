import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, get } from "react-hook-form";
import {
  Send,
  X,
  Hash,
  Search,
  CheckCircle,
  Zap,
  Calendar,
  User,
  Loader2,
  Box,
  Layers,
  MapPin,
  PenTool,
  ClipboardCheck,
  Pencil,
  FileText,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const Registration = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cId, setCId] = useState(0);
  const [lId, setLId] = useState(0);
  const [edit, setEdit] = useState(false);
  const [load, setLoad] = useState(false);
  const [rId, setRId] = useState(0);
  const [dLoad, setDLoad] = useState(false);

  const [brands, setBrands] = useState([{}]);

  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const {
    register: re1,
    handleSubmit: hs1,
    reset: rs1,
    formState: { errors: errors1 },
  } = useForm();

  const { fields } = useFieldArray({
    control,
    name: "panel_serials",
  });

  const getCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/api/registrations/getCustomersWithSummary`,
      );
      if (res.status === 200) {
        setCustomers(res.data.data || []);
        console.log(res.data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBrands = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/kitready/getAllBrands`);
      if (res.status == 200) {
        console.log(res.data.data);
        setBrands(res.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCustomers();
    getBrands();
  }, []);

  const openRegistrationModal = (customer) => {
    console.log(customer);
    if (
      customer.registration?.status?.toLowerCase() === "pending" ||
      customer.registration?.status?.toLowerCase() === "approved"
    ) {
      setSelectedCustomer(customer);

      const panelCount = customer.lead?.number_of_panels || 0;
      const initialSerials =
        customer.registration?.panels?.length > 0
          ? customer.registration.panels.map((panel) => ({
              value: panel.serial_number,
            }))
          : Array.from({ length: panelCount }, () => ({ value: "" }));

      reset({
        customer_name: customer.lead?.customer_name || "",
        total_capacity: (customer.lead?.total_capacity / 1000).toFixed(2),
        registration_date: customer.registration?.registration_date,
        application_number: customer.registration?.application_number,
        agreement_date: customer.registration?.agreement_date,
        inverter_qty: customer.registration?.inverter_qty,
        panel_qty: panelCount,
        panel_serials: initialSerials,
      });

      setIsModalOpen(true);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoad(true);
      const res = await axios.post(`${apiUrl}/api/registrations/registration`, {
        data: data,
        leadId: lId,
        customerId: cId,
      });

      if (res.status == 201) {
        getCustomers();
        setLoad(false);
        if (edit) toast.success("Edited Successfully");
        else toast.success("Registration Done");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      setLoad(false);
      toast.error("Internal server error");
      setIsModalOpen(false);
    }
  };

  const confirmFinalize = async (data) => {
    try {
      if (rId > 0 && cId > 0 && lId > 0) {
        setLoad(true);
        console.log(data);
        const res = await axios.post(
          `${apiUrl}/api/registrations/markRegistrationAsDone`,
          {
            registrationId: rId,
            data: data,
            customerId: cId,
            leadId: lId,
          },
        );
        if (res.status == 200) {
          getCustomers();
          toast.success("Done......");
          setIsFinalizeModalOpen(false);
          setLoad(false);
        }
      }
    } catch (error) {
      toast.error("Error......");
      setIsFinalizeModalOpen(false);
      setLoad(false);
    }
  };

  const handleDownloadFile = async (item) => {
    try {
      if (item.registration.id > 0) {
        setDLoad(true);
        console.log(customers);
        const result = await axios.post(
          `${apiUrl}/api/registrations/getFileGeneration`,
          { registrationId: item.registration.id },
          { responseType: "blob" }, // ← tells axios to treat response as binary file
        );

        const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `agreement_${item.lead.customer_name}.docx`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setDLoad(false);
      }
    } catch (error) {
      console.error("Download failed:", error);
      setDLoad(false);
    }
  };

  const filteredCustomers = customers.filter((item) => {
    const name = item.lead?.customer_name?.toLowerCase() || "";
    const phone = item.lead?.contact_number || "";
    return (
      name.includes(searchQuery.toLowerCase()) || phone.includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex font-syne">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage="Registration"
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 lg:p-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                Portal Registration
              </h1>
              <p className="text-sm text-slate-500 font-medium tracking-wide">
                Manage government portal entries
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search name or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[20px] outline-none focus:border-[#1a5695] transition-all text-sm font-bold shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Address
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      Capacity
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-24 text-center">
                        <Loader2
                          className="animate-spin text-[#1a5695] mx-auto"
                          size={36}
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-all group"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 text-sm group-hover:text-[#1a5695] transition-colors">
                            {item.lead?.customer_name}
                          </p>
                          <p className="text-slate-400 text-[11px] font-medium">
                            {item.lead?.contact_number}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-500 text-xs font-medium max-w-[200px] truncate">
                            {item.lead?.address}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-black text-[#1a5695] text-sm">
                          {(item.lead?.total_capacity / 1000).toFixed(2)} kW
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${item.registration?.status?.toLowerCase() === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
                          >
                            {item.registration?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* PENDING -> PROCESS */}
                            {item.registration?.status?.toLowerCase() ===
                              "pending" && (
                              <button
                                onClick={() => {
                                  setEdit(false);
                                  openRegistrationModal(item);
                                  setCId(item.id);
                                  setLId(item.lead.id);
                                }}
                                className="px-5 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 shadow-lg bg-[#1a5695] text-white hover:bg-blue-800 shadow-blue-900/10"
                              >
                                <Send size={14} /> Process
                              </button>
                            )}

                            {/* APPROVED -> EDIT & FINALIZE */}
                            {item.registration?.status?.toLowerCase() ===
                              "approved" && (
                              <>
                                {/* Edit Button - Themed Blue Outline/Light */}
                                <button
                                  onClick={() => {
                                    setEdit(true);
                                    openRegistrationModal(item);
                                    setCId(item.id);
                                    setLId(item.lead.id);
                                  }}
                                  className="px-4 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 border-2 border-[#1a5695] text-[#1a5695] hover:bg-[#1a5695] hover:text-white"
                                >
                                  <PenTool size={14} /> Edit
                                </button>

                                {/* Finalize Button - High Visibility for State Change */}
                                <button
                                  onClick={() => {
                                    setRId(item.registration?.id);
                                    setCId(item.id);
                                    setLId(item.lead?.id);
                                    setIsFinalizeModalOpen(true);
                                  }}
                                  className="px-4 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/10"
                                >
                                  {load ? (
                                    <>
                                      <Loader2 className="animate-spin h-4 w-4" />
                                      Finalizing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle size={14} /> Finalize
                                    </>
                                  )}
                                </button>
                              </>
                            )}

                            {/* DONE STATUS */}
                            {item.registration?.status?.toLowerCase() ===
                              "done" && (
                              <button
                                onClick={() => {
                                  console.log(item);
                                  setRId(item.registration?.id);
                                  handleDownloadFile(item);
                                }}
                                className="px-4 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 border border-slate-200 text-[#1a5695] hover:bg-slate-50 hover:border-[#1a5695]/30 shadow-sm"
                              >
                                {dLoad ? (
                                  <>Downloading..... </>
                                ) : (
                                  <>
                                    {" "}
                                    <FileText
                                      size={14}
                                      className="text-[#1a5695]"
                                    />
                                    Download PDF
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[92vh] flex flex-col"
          >
            <div className="bg-[#1a5695] p-6 md:p-8 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Portal Registration
                </h2>
                <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">
                  Complete Entry for {selectedCustomer?.lead?.customer_name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="hover:rotate-90 transition-all p-2 bg-white/10 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Registration Number (New Field) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Registration No.
                    </label>
                    {errors.registration_date && (
                      <span className="text-[9px] text-red-500 font-bold uppercase italic">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <ClipboardCheck
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      {...register("registration_date", { required: true })}
                      type="date"
                      className={`w-full pl-11 pr-4 py-4 border rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm ${errors.registration_date ? "border-red-200 bg-red-50/30" : "border-slate-100 focus:border-[#1a5695]"}`}
                    />
                  </div>
                </div>

                {/* Application Number */}
                <div className="space-y-1.5">
                  <div className="flex justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Application Number
                    </label>
                    {errors.application_number && (
                      <span className="text-[9px] text-red-500 font-bold uppercase italic">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Hash
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      {...register("application_number", { required: true })}
                      placeholder="Portal ID"
                      className={`w-full pl-11 pr-4 py-4 border rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm ${errors.application_number ? "border-red-200 bg-red-50/30" : "border-slate-100 focus:border-[#1a5695]"}`}
                    />
                  </div>
                </div>

                {/* Agreement Date */}
                <div className="space-y-1.5">
                  <div className="flex justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Agreement Date
                    </label>
                    {errors.agreement_date && (
                      <span className="text-[9px] text-red-500 font-bold uppercase italic">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      {...register("agreement_date", { required: true })}
                      type="date"
                      className={`w-full pl-11 pr-4 py-4 border rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm ${errors.agreement_date ? "border-red-200 bg-red-50/30" : "border-slate-100 focus:border-[#1a5695]"}`}
                    />
                  </div>
                </div>

                {/* Inverter Qty */}
                <div className="space-y-1.5">
                  <div className="flex justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Inverter Qty
                    </label>
                    {errors.inverter_qty && (
                      <span className="text-[9px] text-red-500 font-bold uppercase italic">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Box
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      {...register("inverter_qty", { required: true })}
                      type="number"
                      placeholder="1"
                      className={`w-full pl-11 pr-4 py-4 border rounded-2xl outline-none transition-all font-bold text-slate-700 text-sm ${errors.inverter_qty ? "border-red-200 bg-red-50/30" : "border-slate-100 focus:border-[#1a5695]"}`}
                    />
                  </div>
                </div>

                {/* Panel Qty */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Fixed Panel Quantity
                  </label>
                  <div className="relative">
                    <Layers
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200"
                    />
                    <input
                      {...register("panel_qty")}
                      readOnly
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Capacity (kW)
                  </label>
                  <div className="relative">
                    <Zap
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-200"
                    />
                    <input
                      {...register("total_capacity")}
                      readOnly
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-400 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Panel Serials */}
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <h3 className="text-[10px] font-black text-[#1a5695] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <PenTool size={14} /> Enter{" "}
                  {selectedCustomer?.lead?.number_of_panels} Panel Serial
                  Numbers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                        Panel #{index + 1}
                      </label>
                      <input
                        {...register(`panel_serials.${index}.value`, {
                          required: true,
                        })}
                        placeholder={`Serial ${index + 1}`}
                        className={`w-full px-4 py-3 bg-white border rounded-xl font-bold text-xs outline-none focus:border-[#1a5695] transition-all ${errors.panel_serials?.[index] ? "border-red-200 bg-red-50/50" : "border-slate-200 shadow-sm"}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-5 bg-[#1a5695] text-white rounded-[24px] font-black shadow-xl shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                >
                  {load ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" />
                      Editing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} /> Complete Portal Entry
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* FINALIZE CONFIRMATION MODAL */}
      {isFinalizeModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm text-syne">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[92vh]">
            {/* Visual Header */}
            <div className="bg-emerald-50 p-6 flex flex-col items-center text-center shrink-0">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 border border-emerald-100">
                <CheckCircle className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Technical Finalization
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                Provide final system specifications
              </p>
            </div>

            <form
              onSubmit={hs1(confirmFinalize)}
              className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Consumer Number */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Consumer No (CS_NO)
                  </label>
                  <input
                    {...re1("cs_no", {
                      required: "Consumer number is required",
                    })}
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.cs_no ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                    placeholder="Enter CS Number"
                  />
                  {errors1.cs_no && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.cs_no.message}
                    </p>
                  )}
                </div>

                {/* Panel Brand */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Panel Brand
                  </label>
                  <select
                    {...re1("panel_brand", {
                      required: "Panel brand is required",
                    })}
                    name="panel_brand"
                    id=""
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.panel_brand ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                  >
                    <option value="">--select brand--</option>
                    {brands.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  {/* <input
                    {...re1("panel_brand", {
                      required: "Panel brand is required",
                    })}
                    
                    placeholder="e.g. Waaree, Adani"
                  /> */}
                  {errors1.panel_brand && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.panel_brand.message}
                    </p>
                  )}
                </div>

                {/* Inverter Brand */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Inverter Brand
                  </label>

                  <select
                    {...re1("inverter_brand", {
                      required: "Panel brand is required",
                    })}
                    name="inverter_brand"
                    id=""
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.panel_brand ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                  >
                    <option value="">--select brand--</option>
                    {brands.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  {/* <input
                    {...re1("inverter_brand", {
                      required: "Inverter brand is required",
                    })}
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.inverter_brand ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                    placeholder="e.g. Growatt, Solis"
                  /> */}
                  {errors1.inverter_brand && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_brand.message}
                    </p>
                  )}
                </div>

                {/* Inverter Capacity */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Inverter Capacity
                  </label>
                  <input
                    {...re1("inverter_capacity", {
                      required: "Capacity is required",
                    })}
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.inverter_capacity ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                    placeholder="e.g. 5kW"
                  />
                  {errors1.inverter_capacity && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_capacity.message}
                    </p>
                  )}
                </div>

                {/* Inverter Quantity (New Field) */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Inverter Quantity
                  </label>
                  <input
                    type="number"
                    {...re1("inverter_qty", {
                      required: "Inverter quantity is required",
                      min: { value: 1, message: "Min 1 required" },
                    })}
                    className={`w-full px-4 py-3.5 bg-slate-50 border rounded-2xl font-bold text-sm outline-none transition-all ${errors1.inverter_qty ? "border-red-200 bg-red-50" : "border-slate-100 focus:border-[#1a5695] focus:bg-white"}`}
                    placeholder="Enter number of inverters"
                  />
                  {errors1.inverter_qty && (
                    <p className="text-[9px] text-red-500 font-bold italic ml-1 uppercase">
                      {errors1.inverter_qty.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  {load ? "Confirming...." : "Confirm & Mark as Done"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFinalizeModalOpen(false);
                    rs1();
                  }}
                  className="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
