import axios from "axios";
import { useAuth } from "../context/authContext";
import AccessControl from "./AccessControl";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  console.log(user);

  // If user is not logged in
  if (!user) {
    return <AccessControl type="login" />;
  }

  // If user doesn't have the right role
  if (!allowedRoles.includes(user.role)) {
    return <AccessControl type="denied" />;
  }

  return children;
};

export default ProtectedRoute;
