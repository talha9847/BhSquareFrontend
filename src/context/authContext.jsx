// context/AuthContext.js
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);
  // user = { email, role }
  const data = async () => {
    const res = await axios.get(`${apiUrl}/api/users/me`, {
      withCredentials: true,
    });

    if (res.status == 200) {
      setUser(res.data);
    }
  };
  useEffect(() => {
    data();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
