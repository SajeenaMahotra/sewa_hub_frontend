"use client";

import { LogOut } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-actions";
import { useAuth } from "@/context/authContext";
import NotificationDropdown from "@/components/NotificationDropdown"; // ADD

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export default function ProviderHeader() {
    const { user, logout } = useAuth();

    const handleLogoutClick = async () => {
        logout();
        await handleLogout();
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div className="flex h-16 items-center justify-between px-6">

                {/* Left: greeting */}
                <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Provider Dashboard</p>
                    <h1 className="text-base font-bold text-gray-900 leading-tight">
                        Welcome back, <span className="text-[#EE7A40]">{user?.fullname?.split(" ")[0]}</span>
                    </h1>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2">

                    {/* ✅ Real notification dropdown */}
                    <NotificationDropdown />

                    {/* Logout */}
                    <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-2 h-9 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}