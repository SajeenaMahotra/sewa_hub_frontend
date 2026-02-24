"use client";

import { useAuth } from "@/context/authContext";
import { Calendar, DollarSign, Star, Briefcase, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Bookings",  value: "—", icon: Calendar,    color: "bg-blue-50",   iconColor: "text-blue-500"   },
  { label: "Total Earnings",  value: "—", icon: DollarSign,  color: "bg-green-50",  iconColor: "text-green-500"  },
  { label: "Average Rating",  value: "—", icon: Star,        color: "bg-amber-50",  iconColor: "text-amber-500"  },
  { label: "Active Services", value: "—", icon: Briefcase,   color: "bg-purple-50", iconColor: "text-purple-500" },
];

const quickLinks = [
  { label: "View Bookings",  href: "/service-provider/bookings",  icon: Calendar, desc: "Manage incoming requests" },
  { label: "My Services",    href: "/service-provider/services",  icon: Briefcase, desc: "Update your offerings"   },
  { label: "Earnings",       href: "/service-provider/earnings",  icon: DollarSign, desc: "Track your income"      },
];

export default function ProviderDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EE7A40] via-[#e8702e] to-[#d45e1a] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(238,122,64,0.3)]">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-4 right-24 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
            Provider Dashboard
          </span>
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-1">
            Hello, {user?.fullname?.split(" ")[0]} 👋
          </h2>
          <p className="text-white/70 text-sm">Here's what's happening with your services today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
        <div className="p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickLinks.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#EE7A40]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#EE7A40] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Placeholder recent activity */}
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Recent Bookings</h3>
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-1">
            <Clock className="w-5 h-5 text-[#EE7A40]" />
          </div>
          <p className="text-sm font-medium text-gray-500">No recent bookings yet</p>
          <p className="text-xs text-gray-400">Bookings from customers will appear here</p>
        </div>
      </div>

    </div>
  );
}
