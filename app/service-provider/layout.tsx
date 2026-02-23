"use client";

import { ReactNode, useEffect } from "react";
import ProviderSidebar from "@/app/service-provider/_components/ProviderSideBar";
import ProviderHeader from "@/app/service-provider/_components/ProviderHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";


export default function ProviderDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; 

    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "provider") {
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
      return;
    }
    if (!user.isProfileSetup) {
      router.push("/setup-profile");
      return;
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If we made it here the user is present, is a provider, and has completed setup.
  if (!user || user.role !== "provider" || !user.isProfileSetup) {
    // return null briefly while redirect logic from useEffect runs
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <ProviderSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden pl-64">
        {/* Header */}
        <ProviderHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}