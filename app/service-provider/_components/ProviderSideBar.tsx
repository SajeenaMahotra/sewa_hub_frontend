"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  DollarSign,
  Star,
  Settings,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/service-provider",
  },
  {
    title: "My Services",
    icon: Briefcase,
    href: "/service-provider/services",
  },
  {
    title: "Bookings",
    icon: Calendar,
    href: "/service-provider/bookings",
  },
  {
    title: "Earnings",
    icon: DollarSign,
    href: "/service-provider/earnings",
  },
  {
    title: "Reviews",
    icon: Star,
    href: "/service-provider/reviews",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/service-provider/messages",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/service-provider/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/service-provider/settings",
  },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/service-provider" className="flex items-center gap-2">
          <Image
            src="/sewahublogo.png"
            alt="SewaHub"
            width={140}
            height={140}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-50 text-[#EE7A40]"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}