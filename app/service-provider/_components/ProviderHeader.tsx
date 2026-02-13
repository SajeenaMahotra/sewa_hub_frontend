"use client";

import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";
import Link from "next/link";
import { handleLogout } from "@/lib/actions/auth-actions";
import { useAuth } from "@/context/authContext";

export default function ProviderHeader() {
  const { user, logout } = useAuth();

  const handleLogoutClick = async () => {
    logout();
    await handleLogout();
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, {user?.fullname}!</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          {/* Profile */}
          <Link href="/service-provider/profile">
            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>

          {/* Logout */}
          <Button variant="outline" size="sm" onClick={handleLogoutClick}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}