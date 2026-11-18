const ROLE_LABELS = {
  admin: "Administrator",
  source: "Source Team",
  supervisor: "Site Supervisor",
  fabricator: "Fabrication Team",
  technician: "Installation Team",
};

const ROLE_HOME = {
  admin: "/dashboard",
  source: "/source/leads",
  supervisor: "/supervisor/commission",
  fabricator: "/fabricator/fabrication",
  technician: "/technician/wiring",
};

const titleCase = (value) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const getRoleLabel = (role) => ROLE_LABELS[role] || "Team member";

export const getRoleHome = (role) => ROLE_HOME[role] || "/dashboard";

export const getUserIdentity = (user) => {
  const email = user?.email || "";
  const localPart = email.split("@")[0] || "";
  const name = localPart
    ? titleCase(localPart.replace(/[._-]+/g, " ").trim())
    : "BHSquare User";

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "BH";

  return {
    email,
    name,
    initials,
    roleLabel: getRoleLabel(user?.role),
    homePath: getRoleHome(user?.role),
  };
};
