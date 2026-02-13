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
    // Wait for auth to load
    if (loading) return;

    // If no user, redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    // If user is not a provider, redirect to appropriate dashboard
    if (user.role !== "provider") {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
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

  // Don't render anything if not authenticated or wrong role
  if (!user || user.role !== "provider") {
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