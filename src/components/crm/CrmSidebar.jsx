import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import logo from "../../assets/bhsquare-logo.png";
import { getUserIdentity } from "./userIdentity";

const normalizePath = (value = "") => {
  const trimmed = String(value).trim();
  if (!trimmed) return "/";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.length > 1
    ? withLeadingSlash.replace(/\/+$/, "")
    : withLeadingSlash;
};

const CrmSidebar = ({ isOpen, toggleSidebar, menuItems = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeRef = useRef(null);
  const { user } = useAuth();
  const identity = getUserIdentity(user);

  const categories = [...new Set(menuItems.map((item) => item.type))];
  const currentPath = normalizePath(location.pathname);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [location.pathname]);

  const handleNavigate = (item) => {
    navigate(normalizePath(item.path));
    if (window.innerWidth < 1024) toggleSidebar?.();
  };

  return (
    <>
      {isOpen && (
        <div
          className="crm-sidebar-overlay fixed inset-0 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`crm-sidebar fixed left-0 top-0 z-50 flex h-full w-64 flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Primary navigation"
      >
        <div className="crm-sidebar-brand">
          <button
            type="button"
            onClick={() => navigate(identity.homePath)}
            className="crm-sidebar-brand-link"
            aria-label="Go to workspace home"
          >
            <img
              src={logo}
              alt="BHSquare"
              className="crm-sidebar-logo"
            />
            <span className="crm-brand-tag">CRM</span>
          </button>

          <button
            type="button"
            onClick={toggleSidebar}
            className="crm-sidebar-close grid place-items-center lg:hidden"
            aria-label="Close navigation"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="crm-sidebar-nav" aria-label="Workspace sections">
          {categories.map((category) => (
            <div key={category} className="crm-nav-group">
              <p className="crm-nav-group-label">{category}</p>

              {menuItems
                .filter((item) => item.type === category)
                .map((item) => {
                  const itemPath = normalizePath(item.path);
                  const isActive = item.activePaths?.length
                    ? item.activePaths
                        .map((path) => normalizePath(path))
                        .includes(currentPath)
                    : currentPath === itemPath;

                  return (
                    <button
                      type="button"
                      key={item.name}
                      ref={isActive ? activeRef : null}
                      onClick={() => handleNavigate(item)}
                      className={`crm-nav-item ${isActive ? "is-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="crm-nav-icon">{item.icon}</span>
                      <span className="crm-nav-label">{item.name}</span>

                      {typeof item.count === "number" && item.count > 0 && (
                        <span className="crm-nav-count">{item.count}</span>
                      )}

                      {item.alert && (
                        <span className="crm-nav-dot" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="crm-sidebar-footer">
          <div className="crm-user-card">
            <div className="crm-user-avatar">
              {identity.initials}
              <span className="crm-user-presence" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="crm-user-name" title={identity.name}>
                {identity.name}
              </p>
              <p className="crm-user-role">{identity.roleLabel}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CrmSidebar;
