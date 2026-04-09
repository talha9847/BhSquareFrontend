import React, { useState, useEffect } from "react";
import { X, User, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const LeadPopUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  useEffect(() => {
    // Show popup after 3 seconds of visiting
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("hasSeenLeadPopup");
      if (!hasSeenPopup) {
        setIsVisible(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("hasSeenLeadPopup", "true");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Mobile validation (India: 10 digits, starts 6-9)
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/sources/addWebLead", {
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
        status: "pending",
      });

      toast.success("Thank you! We will contact you soon.");
      handleClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Top Accent Bar */}
        <div className="h-2 bg-[#f39200] w-full" />

        <div className="p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black text-[#1a5695] uppercase tracking-tight font-syne">
              Get a Free Quote
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Leave your details and our solar experts will call you back.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                required
                type="text"
                placeholder="Your Name"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#1a5695] transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                required
                type="tel"
                placeholder="Mobile Number"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#1a5695] transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-slate-400"
                size={18}
              />
              <textarea
                required
                placeholder="Site Address"
                rows="2"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#1a5695] transition-all resize-none"
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              ></textarea>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-[#1a5695] text-white rounded-2xl font-bold shadow-lg shadow-blue-900/20 hover:bg-[#15467a] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send size={18} /> Send Details
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
            ⚡ Secure & Confidential
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadPopUp;
