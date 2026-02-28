"use client";

import { useEffect, useState } from "react";
import { getMyBookings } from "@/lib/api/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import UserBookingCard, { UserBookingCardData, BookingStatus } from "@/app/(user)/_components/UserBookingCard";
import UserBookingDetailModal from "@/app/(user)/_components/UserBookingDetailModal";

const PAGE_SIZE = 9;

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
    const [bookings, setBookings]               = useState<UserBookingCardData[]>([]);
    const [loading, setLoading]                 = useState(true);
    const [activeFilter, setActiveFilter]       = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<UserBookingCardData | null>(null);
    const [search, setSearch]                   = useState("");
    const [page, setPage]                       = useState(1);

    useEffect(() => {
        getMyBookings(1, 200)
            .then((res) => setBookings(res.data?.bookings ?? []))
            .catch(() => toast.error("Failed to load bookings"))
            .finally(() => setLoading(false));
    }, []);

    // Reset to page 1 on filter or search change
    useEffect(() => { setPage(1); }, [activeFilter, search]);

    const handleCancelled = (id: string) => {
        setBookings((prev) =>
            prev.map((b) => b._id === id ? { ...b, status: "cancelled" as BookingStatus } : b)
        );
    };

    //  Filter + Search 
    const afterFilter = activeFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === activeFilter);

    const q = search.trim().toLowerCase();
    const afterSearch = q
        ? afterFilter.filter((b) =>
            b.address?.toLowerCase().includes(q) ||
            (b.provider_id as any)?.Useruser_id?.fullname?.toLowerCase().includes(q) ||
            b.severity?.toLowerCase().includes(q)
          )
        : afterFilter;

    //  Pagination
    const totalPages = Math.max(1, Math.ceil(afterSearch.length / PAGE_SIZE));
    const paginated  = afterSearch.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-sm text-gray-400 mt-1">Track and manage your service bookings</p>
            </div>

            {/* Search + Filter row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">

                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by provider, address or severity…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition"
                    />
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setActiveFilter(f.value)}
                            className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200
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
            </div>

            {/* Results count */}
            {!loading && (
                <p className="text-xs text-gray-400 mb-4">
                    Showing {afterSearch.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, afterSearch.length)} of {afterSearch.length} bookings
                </p>
            )}

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => <BookingCardSkeleton key={i} />)}
                </div>
            ) : paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                        <PackageOpen className="w-6 h-6 text-[#EE7A40]" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">No bookings found</p>
                    <p className="text-gray-400 text-xs">
                        {search
                            ? `No results for "${search}".`
                            : activeFilter === "all"
                                ? "You haven't made any bookings yet."
                                : `No ${activeFilter} bookings.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginated.map((booking) => (
                        <UserBookingCard
                            key={booking._id}
                            booking={booking}
                            onCancel={handleCancelled}
                            onClick={() => setSelectedBooking(booking)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#EE7A40] hover:text-[#EE7A40] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((p, idx) =>
                            p === "..." ? (
                                <span key={`ellipsis-${idx}`} className="text-gray-400 text-sm px-1">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p as number)}
                                    className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all duration-200
                                        ${page === p
                                            ? "bg-[#EE7A40] text-white border-[#EE7A40] shadow-[0_4px_12px_rgba(238,122,64,0.3)]"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-[#EE7A40] hover:text-[#EE7A40]"
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-[#EE7A40] hover:text-[#EE7A40] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
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