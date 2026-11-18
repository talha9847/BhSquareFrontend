import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/crm/Navbar";
import Sidebar from "../components/crm/Sidebar";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/authContext";

const DocumentCollectionGuard = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  // FIX 1: correct key
  const customerId = location.state?.customerId;

  const [allowed, setAllowed] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!customerId) {
      setAllowed(false);
      return;
    }

    const checkAccess = async () => {
      try {
        // FIX 2: pass customerId to backend
        const res = await axios.get(
          `/api/docs/checkDocumentCollectionAccess/${customerId}`,
          { withCredentials: true },
        );

        setAllowed(res.data.success);
      } catch (error) {
        setAllowed(false);
      }
    };

    checkAccess();
  }, [customerId]);

  if (allowed === null)
    return (
      <div className="crm-shell flex min-h-screen bg-slate-50">
        <Sidebar />

        <div className="crm-workspace flex-1 lg:ml-64 flex flex-col min-w-0">
          <Navbar />

          <main className="crm-main flex flex-1 items-center justify-center p-6">
            <div className="crm-surface flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white px-10 py-9">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#1a5695]">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Verifying access
                </p>
                <p className="mt-1.5 text-sm font-bold text-slate-700">
                  Preparing your workspace…
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );

  if (!allowed) {
    if (user.role == "source") {
      return <Navigate to="/source/customers" replace />;
    }
    if (user.role == "admin") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  return children;
};

export default DocumentCollectionGuard;
