import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/crm/Navbar";
import Sidebar from "../components/Source/Sidebar";
import { Loader2 } from "lucide-react";

const SourceGuard = ({ children }) => {
  const location = useLocation();

  // FIX 1: correct key
  const customerId = location.state?.customerId;
  const pageId = location.state?.pageId;

  const [allowed, setAllowed] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!customerId || !pageId) {
      setAllowed(false);
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await axios.get(
          `/api/sources/checkPermission/${customerId}/${pageId}`,
          {
            withCredentials: true,
          },
        );

        setAllowed(!!res.data?.success);
      } catch (error) {
        setAllowed(false);
      }
    };

    checkAccess();
  }, [customerId, pageId]);

  if (allowed === null)
    return (
      <div className="flex">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
          </div>
        </div>
      </div>
    );

  if (!allowed) return <Navigate to="/customers" replace />;

  return children;
};

export default SourceGuard;
