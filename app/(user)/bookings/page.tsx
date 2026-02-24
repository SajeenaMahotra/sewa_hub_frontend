"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyBookings, cancelBooking } from "@/lib/api/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Clock, ChevronRight, PackageOpen, XCircle } from "lucide-react";
import { toast } from "sonner";

//  Types 
type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

interface PopulatedUser {
    _id: string;
    fullname: string;
    email: string;
    imageUrl?: string;
}
interface PopulatedProvider {
    _id: string;
    price_per_hour: number;
    imageUrl?: string;
    Useruser_id: PopulatedUser;
    ServiceCategorycatgeory_id?: { category_name: string };
}
interface Booking {
    _id: string;
    provider_id: PopulatedProvider;
    scheduled_at: string;
    address: string;
    note?: string;
    price_per_hour: number;
    status: BookingStatus;
    created_at: string;
}

//  Helpers 

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveAvatar(url?: string) {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}
function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" });
}

//  Status badge 

const statusConfig: Record<BookingStatus, { label: string; classes: string }> = {
    pending:   { label: "Pending",   classes: "bg-amber-50 text-amber-600 border-amber-200"   },
    accepted:  { label: "Accepted",  classes: "bg-green-50 text-green-600 border-green-200"   },
    rejected:  { label: "Rejected",  classes: "bg-red-50 text-red-500 border-red-200"         },
    completed: { label: "Completed", classes: "bg-blue-50 text-blue-600 border-blue-200"      },
    cancelled: { label: "Cancelled", classes: "bg-gray-100 text-gray-500 border-gray-200"     },
};

function StatusBadge({ status }: { status: BookingStatus }) {
    const { label, classes } = statusConfig[status];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${classes}`}>
            {label}
        </span>
    );
}

//  Booking Card 

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
    const router = useRouter();
    const provider = booking.provider_id;
    const providerUser = provider?.Useruser_id;
    const avatar = resolveAvatar(provider?.imageUrl || providerUser?.imageUrl);
    const [cancelling, setCancelling] = useState(false);

    const handleCancel = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Cancel this booking?")) return;
        setCancelling(true);
        try {
            await cancelBooking(booking._id);
            toast.success("Booking cancelled");
            onCancel(booking._id);
        } catch {
            toast.error("Could not cancel booking");
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow duration-200 cursor-pointer"
            onClick={() => router.push(`/providers-detail/${provider?._id}`)}
        >
            {/* Status top bar */}
            <div className={`h-1 ${
                booking.status === "accepted"  ? "bg-green-400" :
                booking.status === "completed" ? "bg-blue-400"  :
                booking.status === "rejected" || booking.status === "cancelled" ? "bg-gray-300" :
                "bg-amber-400"
            }`} />

            <div className="p-5">
                {/* Provider info row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-11 h-11 rounded-xl ring-2 ring-orange-50 shrink-0">
                            <AvatarImage src={avatar} className="object-cover" />
                            <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#EE7A40] font-bold text-sm">
                                {providerUser?.fullname ? getInitials(providerUser.fullname) : "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{providerUser?.fullname || "Provider"}</p>
                            {provider?.ServiceCategorycatgeory_id?.category_name && (
                                <span className="text-[11px] font-semibold text-[#EE7A40] bg-orange-50 px-2 py-0.5 rounded-full">
                                    {provider.ServiceCategorycatgeory_id.category_name}
                                </span>
                            )}
                        </div>
                    </div>
                    <StatusBadge status={booking.status} />
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-4" />

                {/* Details */}
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-[#EE7A40]" />
                        <span className="text-xs">{formatDate(booking.scheduled_at)}</span>
                        <Clock className="w-3.5 h-3.5 shrink-0 text-[#EE7A40] ml-2" />
                        <span className="text-xs">{formatTime(booking.scheduled_at)}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#EE7A40] mt-0.5" />
                        <span className="text-xs line-clamp-1">{booking.address}</span>
                    </div>
                    {booking.note && (
                        <p className="text-xs text-gray-400 italic line-clamp-1 mt-0.5">"{booking.note}"</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        NPR <span className="font-bold text-gray-700">{booking.price_per_hour}</span>/hr
                    </span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {booking.status === "pending" && (
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-50"
                            >
                                <XCircle className="w-3.5 h-3.5" />
                                {cancelling ? "Cancelling..." : "Cancel"}
                            </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}

//  Skeleton 

function BookingCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gray-100" />
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="h-px bg-gray-100" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-40" />
                <div className="flex justify-between mt-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-7 w-20 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

//  Filter tabs 

const filters: { label: string; value: string }[] = [
    { label: "All",       value: "all"       },
    { label: "Pending",   value: "pending"   },
    { label: "Accepted",  value: "accepted"  },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

// Page 

export default function BookingsPage() {
    const [bookings, setBookings]         = useState<Booking[]>([]);
    const [loading, setLoading]           = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        getMyBookings(1, 50)
            .then((res) => setBookings(res.data?.bookings ?? []))
            .catch(() => toast.error("Failed to load bookings"))
            .finally(() => setLoading(false));
    }, []);

    const handleCancelled = (id: string) => {
        setBookings((prev) =>
            prev.map((b) => b._id === id ? { ...b, status: "cancelled" as BookingStatus } : b)
        );
    };

    const filtered = activeFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === activeFilter);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-sm text-gray-400 mt-1">Track and manage your service bookings</p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-6">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200
                            ${activeFilter === f.value
                                ? "bg-[#EE7A40] text-white border-[#EE7A40] shadow-[0_4px_12px_rgba(238,122,64,0.3)]"
                                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {f.label}
                        {f.value !== "all" && !loading && (
                            <span className={`ml-1.5 text-[11px] ${activeFilter === f.value ? "text-white/80" : "text-gray-400"}`}>
                                {bookings.filter((b) => b.status === f.value).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <BookingCardSkeleton key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                        <PackageOpen className="w-6 h-6 text-[#EE7A40]" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">No bookings found</p>
                    <p className="text-gray-400 text-xs">
                        {activeFilter === "all" ? "You haven't made any bookings yet." : `No ${activeFilter} bookings.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((booking) => (
                        <BookingCard key={booking._id} booking={booking} onCancel={handleCancelled} />
                    ))}
                </div>
            )}
        </div>
    );
}