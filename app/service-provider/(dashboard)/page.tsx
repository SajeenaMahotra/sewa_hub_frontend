"use client";

import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { Calendar, Star, Briefcase, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { handleGetProviderProfile } from "@/lib/actions/provider-actions";
import { getProviderBookings } from "@/lib/api/booking";

export default function ProviderDashboard() {
    const { user } = useAuth();

    const [profile,  setProfile]  = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, bookingRes] = await Promise.all([
                    handleGetProviderProfile(),
                    getProviderBookings(1, 100), // fetch all to compute stats
                ]);
                if (profileRes.success)  setProfile(profileRes.data);
                if (bookingRes.success)  setBookings(bookingRes.data?.bookings ?? []);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived stats
    const total     = bookings.length;
    const pending   = bookings.filter(b => b.status === "pending").length;
    const accepted  = bookings.filter(b => b.status === "accepted").length;
    const completed = bookings.filter(b => b.status === "completed").length;
    const cancelled = bookings.filter(b => b.status === "cancelled").length;
    const rating    = profile?.rating ?? 0;
    const ratingCount = profile?.ratingCount ?? 0;
    const pricePerHour = profile?.price_per_hour ?? 0;

    // 5 most recent bookings
    const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        pending:   { label: "Pending",   color: "bg-amber-50 text-amber-600",   icon: Clock        },
        accepted:  { label: "Accepted",  color: "bg-blue-50 text-blue-600",     icon: CheckCircle  },
        completed: { label: "Completed", color: "bg-green-50 text-green-600",   icon: CheckCircle  },
        rejected:  { label: "Rejected",  color: "bg-red-50 text-red-500",       icon: XCircle      },
        cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500",    icon: AlertCircle  },
    };

    const Skeleton = () => (
        <div className="animate-pulse bg-gray-100 rounded-xl h-8 w-16" />
    );

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

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        {loading ? <Skeleton /> : <p className="text-2xl font-bold text-gray-900">{total}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">Total Bookings</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        {loading ? <Skeleton /> : (
                            <p className="text-2xl font-bold text-gray-900">
                                {ratingCount > 0 ? rating.toFixed(1) : "—"}
                                {ratingCount > 0 && <span className="text-sm text-gray-400 font-normal ml-1">/ 5</span>}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                            {ratingCount > 0 ? `${ratingCount} review${ratingCount > 1 ? "s" : ""}` : "No ratings yet"}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        {loading ? <Skeleton /> : <p className="text-2xl font-bold text-gray-900">{completed}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">Completed</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                        {loading ? <Skeleton /> : (
                            <p className="text-2xl font-bold text-gray-900">
                                Rs {pricePerHour.toLocaleString()}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">Price / Hour</p>
                    </div>
                </div>
            </div>

            {/* Booking status breakdown */}
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
                <div className="p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Booking Overview</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Pending",   value: pending,   color: "bg-amber-50",  text: "text-amber-600"  },
                            { label: "Accepted",  value: accepted,  color: "bg-blue-50",   text: "text-blue-600"   },
                            { label: "Completed", value: completed, color: "bg-green-50",  text: "text-green-600"  },
                            { label: "Cancelled", value: cancelled, color: "bg-gray-50",   text: "text-gray-500"   },
                        ].map(({ label, value, color, text }) => (
                            <div key={label} className={`${color} rounded-xl p-4 text-center`}>
                                {loading
                                    ? <div className="animate-pulse bg-white/60 rounded h-7 w-10 mx-auto mb-1" />
                                    : <p className={`text-2xl font-bold ${text}`}>{value}</p>
                                }
                                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent bookings */}
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900">Recent Bookings</h3>
                        <Link href="/service-provider/bookings" className="text-xs font-semibold text-[#EE7A40] hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                    <div className="w-9 h-9 rounded-xl bg-gray-200 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : recentBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-[#EE7A40]" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">No bookings yet</p>
                            <p className="text-xs text-gray-400">Bookings from customers will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentBookings.map((booking) => {
                                const cfg = statusConfig[booking.status] ?? statusConfig["pending"];
                                const StatusIcon = cfg.icon;
                                const customerName = booking.user_id?.fullname ?? "Customer";
                                const date = new Date(booking.scheduled_at).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric"
                                });
                                return (
                                    <div key={booking._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-[#EE7A40]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{customerName}</p>
                                            <p className="text-xs text-gray-400 truncate">{date} · {booking.address}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${cfg.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {cfg.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}