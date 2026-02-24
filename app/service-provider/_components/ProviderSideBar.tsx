"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Calendar, Star, MessageSquare, User} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/service-provider"           },
  { title: "Bookings",  icon: Calendar,        href: "/service-provider/bookings"  },
  { title: "Reviews",   icon: Star,            href: "/service-provider/reviews"   },
  { title: "Messages",  icon: MessageSquare,   href: "/service-provider/messages"  },
  { title: "Profile",   icon: User,            href: "/service-provider/profile"   },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-gray-100 shadow-[2px_0_16px_rgba(0,0,0,0.04)] flex flex-col">

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-100 px-5">
        <Link href="/service-provider">
          <Image src="/sewahublogo.png" alt="SewaHub" width={130} height={130} />
        </Link>
      </div>

      {/* Label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provider Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-orange-50 text-[#EE7A40]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                isActive ? "bg-[#EE7A40]/10" : "bg-gray-50 group-hover:bg-gray-100"
              )}>
                <item.icon className={cn("h-4 w-4", isActive ? "text-[#EE7A40]" : "text-gray-400 group-hover:text-gray-600")} />
              </div>
              {item.title}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EE7A40]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom divider hint */}
      <div className="px-5 py-4 border-t border-gray-100">
        <p className="text-[10px] text-gray-300 text-center">SewaHub Provider v1.0</p>
      </div>
    </aside>
  );
}