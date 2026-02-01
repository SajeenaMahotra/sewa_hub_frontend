"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clearAuthCookies, getAuthToken, getUserData, setUserData } from "../lib/cookie";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (token: string, userData: any) => void;
  refreshUser: () => Promise<void>; // NEW - Add this
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

  // Refresh user data from backend
  const refreshUser = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;

      const response = await fetch('http://localhost:8000/api/auth/whoami', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        // Update cookie with fresh user data
        await setUserData(data.data);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
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
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        user, 
        setUser, 
        logout, 
        loading, 
        checkAuth, 
        login,
        refreshUser // Add this to the provider value
      }}
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