"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { Users, Wrench, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user-actions";
import { handleGetAllProviders } from "@/lib/actions/provider-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats,       setStats]       = useState({ total: 0, customers: 0, providers: 0 });
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading,     setLoading]     = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [usersRes, providersRes] = await Promise.all([
                    handleGetAllUsers("1", "100"),
                    handleGetAllProviders(1, 100),
                ]);
                console.log("usersRes:", JSON.stringify(usersRes));
console.log("providersRes:", JSON.stringify(providersRes));

                const allUsers  = Array.isArray(usersRes.data) ? usersRes.data : [];
const total     = usersRes.pagination?.totalItems ?? allUsers.length;
const providers = providersRes.data?.total ?? 0;
const customers = allUsers.filter((u: any) => u.role === "user").length;

                setStats({ total, customers, providers });
                setRecentUsers(
                    [...allUsers]
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 6)
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const Skeleton = () => <div className="animate-pulse bg-gray-100 rounded-xl h-8 w-14" />;

    const roleStyle: Record<string, string> = {
        user:     "bg-blue-50 text-blue-600",
        provider: "bg-orange-50 text-[#EE7A40]",
        admin:    "bg-purple-50 text-purple-600",
    };

    const getInitials = (name: string) =>
        name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) ?? "U";

    const getImg = (url?: string) =>
        !url ? undefined : url.startsWith("http") ? url : `${BASE_URL}${url}`;

    return (
        <div className="flex flex-col gap-6">

            {/* Welcome banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#EE7A40] via-[#e8702e] to-[#d45e1a] rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(238,122,64,0.3)]">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute top-4 right-24 w-20 h-20 rounded-full bg-white/5" />
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                        Admin Dashboard
                    </span>
                    <h2 className="text-white text-2xl md:text-3xl font-bold mb-1">
                        Hello, {user?.fullname?.split(" ")[0]} 👋
                    </h2>
                    <p className="text-white/70 text-sm">Here's an overview of the platform.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Users",        value: stats.total,     icon: Users,  bg: "bg-orange-50", color: "text-[#EE7A40]" },
                    { label: "Customers",          value: stats.customers, icon: Users,  bg: "bg-blue-50",   color: "text-blue-500"   },
                    { label: "Service Providers",  value: stats.providers, icon: Wrench, bg: "bg-green-50",  color: "text-green-500"  },
                ].map(({ label, value, icon: Icon, bg, color }) => (
                    <div key={label} className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <div>
                            {loading ? <Skeleton /> : <p className="text-2xl font-bold text-gray-900">{value}</p>}
                            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900">Recent Users</h3>
                        <Link href="/admin/users" className="text-xs font-semibold text-[#EE7A40] hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    </div>
                                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : recentUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                                <Users className="w-5 h-5 text-[#EE7A40]" />
                            </div>
                            <p className="text-sm text-gray-400">No users yet</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {recentUsers.map((u) => (
                                <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <Avatar className="w-9 h-9 shrink-0">
                                        <AvatarImage src={getImg(u.imageUrl)} className="object-cover" />
                                        <AvatarFallback className="bg-orange-100 text-[#EE7A40] text-xs font-bold rounded-full">
                                            {getInitials(u.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{u.fullname}</p>
                                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${roleStyle[u.role] ?? "bg-gray-100 text-gray-500"}`}>
                                        {u.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}