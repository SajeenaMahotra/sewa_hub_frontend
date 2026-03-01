"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users } from "lucide-react";

const menuItems = [
    { title: "Dashboard", href: "/admin",       icon: LayoutDashboard },
    { title: "Users",     href: "/admin/users", icon: Users           },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-60 flex-col bg-white border-r">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/admin">
                    <Image
                        src="/sewahublogo.png"
                        alt="Sewahub Logo"
                        width={130}
                        height={40}
                        className="object-contain"
                    />
                </Link>
            </div>

            {/* Label */}
            <div className="px-4 pt-5 pb-2">
                <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase px-3">
                    Admin Panel
                </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-4">
                {menuItems.map(({ title, href, icon: Icon }) => {
                    const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#EE7A40] text-white shadow-[0_2px_8px_rgba(238,122,64,0.3)]"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-[#EE7A40]"
                            )}
                        >
                            <Icon className="h-4.5 w-4.5 shrink-0" />
                            {title}
                            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t">
                <p className="text-[10px] text-gray-300 text-center">SewaHub Admin v1.0</p>
            </div>
        </div>
    );
}