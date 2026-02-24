"use client";

import { ReactNode, useEffect } from "react";
import ProviderSidebar from "@/app/service-provider/_components/ProviderSideBar";
import ProviderHeader from "@/app/service-provider/_components/ProviderHeader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function ProviderDashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "provider") { router.push(user.role === "admin" ? "/admin" : "/feed"); return; }
    if (!user.isProfileSetup) { router.push("/setup-profile"); return; }
  }, [user, loading, router]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center"
      style={{ backgroundColor: "#faf9f7", backgroundImage: "radial-gradient(circle, #e5e0d8 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EE7A40] to-[#f59e5a] animate-pulse" />
        <p className="text-sm text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );

  if (!user || user.role !== "provider" || !user.isProfileSetup) return null;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "#faf9f7",
        backgroundImage: "radial-gradient(circle, #e5e0d8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden pl-64">
        <ProviderHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
