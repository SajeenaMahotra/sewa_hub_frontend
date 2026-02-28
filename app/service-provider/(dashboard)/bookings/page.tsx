"use client";

import { useEffect, useState, useCallback } from "react";
import { getProviderBookings, updateBookingStatus } from "@/lib/api/booking";
import { PackageOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import ProviderBookingCard, {
    ProviderBookingCardData,
    BookingStatus,
} from "@/app/service-provider/_components/ProviderBookingCard";
import BookingDetailModal from "@/app/service-provider/_components/BookingDetailModal";
import BookingCardSkeleton from "@/app/service-provider/_components/BookingCardSkeleton";

const PAGE_SIZE = 9;

const filters = [
    { label: "All",       value: "all"       },
    { label: "Pending",   value: "pending"   },
    { label: "Accepted",  value: "accepted"  },
    { label: "Completed", value: "completed" },
    { label: "Rejected",  value: "rejected"  },
];

export default function ProviderBookingsPage() {
    const [bookings, setBookings]               = useState<ProviderBookingCardData[]>([]);
    const [loading, setLoading]                 = useState(true);
    const [activeFilter, setActiveFilter]       = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<ProviderBookingCardData | null>(null);
    const [search, setSearch]                   = useState("");
    const [page, setPage]                       = useState(1);

    useEffect(() => {
        setLoading(true);
        getProviderBookings(1, 200) // fetch all, filter/paginate client-side
            .then((res) => setBookings(res.data?.bookings ?? []))
            .catch(() => toast.error("Failed to load bookings"))
            .finally(() => setLoading(false));
    }, []);

    // Reset to page 1 whenever filter or search changes
    useEffect(() => { setPage(1); }, [activeFilter, search]);

    const handleAction = async (id: string, action: "accepted" | "rejected" | "completed") => {
        try {
            await updateBookingStatus(id, action);
            setBookings((prev) =>
                prev.map((b) => b._id === id ? { ...b, status: action as BookingStatus } : b)
            );
            toast.success(`Booking ${action} successfully`);
        } catch {
            toast.error("Failed to update booking status");
            throw new Error("action failed");
        }
    };

    //  Filter + Search 
    const afterFilter = activeFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === activeFilter);

    const q = search.trim().toLowerCase();
    const afterSearch = q
        ? afterFilter.filter((b) =>
            b.address?.toLowerCase().includes(q) ||
            (b.user_id as any)?.fullname?.toLowerCase().includes(q) ||
            (b.user_id as any)?.email?.toLowerCase().includes(q) ||
            b.severity?.toLowerCase().includes(q)
          )
        : afterFilter;

    //  Pagination 
    const totalPages = Math.max(1, Math.ceil(afterSearch.length / PAGE_SIZE));
    const paginated  = afterSearch.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Manage and respond to customer booking requests
                </p>
            </div>

            {/* Search + Filter row */}
            <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by customer, address or severity…"
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
                <p className="text-xs text-gray-400 -mt-2">
                    Showing {afterSearch.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, afterSearch.length)} of {afterSearch.length} bookings
                </p>
            )}

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                        <BookingCardSkeleton key={i} />
                    ))}
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
                                ? "You have no bookings yet."
                                : `No ${activeFilter} bookings.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginated.map((booking) => (
                        <ProviderBookingCard
                            key={booking._id}
                            booking={booking}
                            onClick={() => setSelectedBooking(booking)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
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
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onAction={handleAction}
                />
            )}
        </div>
    );
}