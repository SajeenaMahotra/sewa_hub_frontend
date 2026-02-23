"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { clearAuthCookies,setAuthToken, setUserData } from "@/lib/cookie";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    logout: () => Promise<void>;
    loading: boolean;
    login: (token: string, userData: any) => Promise<void>;
    checkAuth: () => Promise<void>;
    refreshUser?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const checkAuth = async () => {
    try {
        if (typeof window !== 'undefined') {
            const userDataCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('user_data='))
                ?.split('=').slice(1).join('=');
            
            const tokenCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('auth_token='))
                ?.split('=').slice(1).join('=');

            if (userDataCookie && tokenCookie) {
                const userData = JSON.parse(decodeURIComponent(userDataCookie));
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        }
    } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (user) {
            setUserData(user);
        }
    }, [user]);


    const logout = async () => {
        try {
            await clearAuthCookies();
            setIsAuthenticated(false);
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    const login = async (token: string, userData: any) => {
        setIsAuthenticated(true);
        setUser(userData);
        setLoading(false);
        await setAuthToken(token);
        await setUserData(userData);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, logout, loading, login, checkAuth, refreshUser: checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
