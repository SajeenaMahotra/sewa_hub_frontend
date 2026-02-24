"use client";

import { useEffect, useState } from "react";
import { getMyBookings } from "@/lib/api/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageOpen } from "lucide-react";
import { toast } from "sonner";
import UserBookingCard, { UserBookingCardData, BookingStatus } from "@/app/(user)/_components/UserBookingCard";
import UserBookingDetailModal from "@/app/(user)/_components/UserBookingDetailModal";

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

//  Filters 

const filters = [
    { label: "All",       value: "all"       },
    { label: "Pending",   value: "pending"   },
    { label: "Accepted",  value: "accepted"  },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

//  Page 

export default function BookingsPage() {
    const [bookings, setBookings]             = useState<UserBookingCardData[]>([]);
    const [loading, setLoading]               = useState(true);
    const [activeFilter, setActiveFilter]     = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<UserBookingCardData | null>(null);

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
                        <UserBookingCard
                            key={booking._id}
                            booking={booking}
                            onCancel={handleCancelled}
                            onClick={() => setSelectedBooking(booking)}
                        />
                    ))}
                </div>
            )}

            {/* Detail modal */}
            {selectedBooking && (
                <UserBookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
}