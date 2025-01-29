import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [access, setAccess] = useState(localStorage.getItem("accessToken") || "");
  const [refresh, setRefresh] = useState(localStorage.getItem("refreshToken") || "");
  const navigate = useNavigate();

  const login = async (username, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setAccess(data.access);
      setRefresh(data.refresh);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      navigate("/");
    } else {
      throw new Error("Login failed");
    }
  };

  const logout = () => {
    setAccess("");
    setRefresh("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  useEffect(() => {
    const refreshAccessToken = async () => {
      const storedRefresh = localStorage.getItem("refreshToken");
      if (!storedRefresh) return;

      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: storedRefresh }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccess(data.access);
        localStorage.setItem("accessToken", data.access);
      } else {
        logout();
      }
    };

    if (!access && refresh) {
      refreshAccessToken();
    }

    const interval = setInterval(refreshAccessToken, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [access, refresh]);

  return (
    <AuthContext.Provider
      value={{ access, setAccess, refresh, setRefresh, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);