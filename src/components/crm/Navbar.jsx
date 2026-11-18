import { Bell, CalendarDays, LogOut, Menu, Search, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { getUserIdentity } from "./userIdentity";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const identity = getUserIdentity(user);

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date());

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      navigate("/");
    } catch {
      // Preserve the existing behaviour: only leave when the session ends.
    }
  };

  return (
    <header className="crm-topbar sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-4 px-4 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="crm-icon-btn -ml-1.5 grid place-items-center lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>

        <div className="crm-search hidden md:flex">
          <Search size={15} className="shrink-0" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search leads, customers, orders..."
            aria-label="Search CRM"
          />
          <kbd aria-hidden="true">⌘ K</kbd>
        </div>

        <div className="hidden items-center gap-2 pl-1 text-[11px] font-bold text-slate-500 xl:flex">
          <CalendarDays size={14} className="text-slate-400" aria-hidden="true" />
          <span className="whitespace-nowrap">{today}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <div className="crm-solar-chip hidden lg:inline-flex">
          <Sun
            size={13}
            className="text-[#f39200]"
            strokeWidth={2.4}
            aria-hidden="true"
          />
          <span>Excellent Solar Day</span>
          <span className="crm-solar-dot" aria-hidden="true" />
        </div>

        <span className="crm-topbar-divider hidden lg:block" aria-hidden="true" />

        <button
          type="button"
          className="crm-icon-btn grid place-items-center"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="crm-notification-dot" aria-hidden="true" />
        </button>

        <div
          className="crm-identity hidden xl:flex"
          title={identity.email || identity.name}
        >
          <span className="crm-identity-avatar">{identity.initials}</span>
          <span className="min-w-0">
            <span className="crm-identity-name block">{identity.name}</span>
            <span className="crm-identity-role block">{identity.roleLabel}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="crm-icon-btn is-danger grid place-items-center"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
