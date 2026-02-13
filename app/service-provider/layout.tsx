import { ReactNode } from "react";
import ProviderSidebar from "@/app/service-provider/_components/ProviderSideBar";
import ProviderHeader from "@/app/service-provider/_components/ProviderHeader";

export default function ProviderDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
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