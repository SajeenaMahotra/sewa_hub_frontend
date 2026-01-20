"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clearAuthCookies, getAuthToken, getUserData } from "../lib/cookie";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (token: string, userData: any) => void; // NEW
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state
  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const userData = await getUserData();
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await clearAuthCookies();
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Login function (update context immediately after login)
  const login = (token: string, userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    // optionally set cookies here if not already set
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout, loading, checkAuth, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
