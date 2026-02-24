"use client";

import { useEffect, useState } from "react";
import { getProviderBookings, updateBookingStatus } from "@/lib/api/booking";
import { PackageOpen } from "lucide-react";
import { toast } from "sonner";
import ProviderBookingCard, { ProviderBookingCardData, BookingStatus } from "@/app/service-provider/_components/ProviderBookingCard";
import BookingDetailModal from "@/app/service-provider/_components/BookingDetailModal";
import ActionDialog from "@/app/service-provider/_components/ActionDialog";
import BookingCardSkeleton from "@/app/service-provider/_components/BookingCardSkeleton";

//  Filters 

const filters = [
    { label: "All",       value: "all"       },
    { label: "Pending",   value: "pending"   },
    { label: "Accepted",  value: "accepted"  },
    { label: "Completed", value: "completed" },
    { label: "Rejected",  value: "rejected"  },
];

//  Page 

export default function ProviderBookingsPage() {
    const [bookings, setBookings]               = useState<ProviderBookingCardData[]>([]);
    const [loading, setLoading]                 = useState(true);
    const [activeFilter, setActiveFilter]       = useState("all");
    const [actionLoading, setActionLoading]     = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<ProviderBookingCardData | null>(null);
    const [dialogOpen, setDialogOpen]           = useState(false);
    const [selectedAction, setSelectedAction]   = useState<"accepted" | "rejected" | "completed" | null>(null);

    useEffect(() => {
        getProviderBookings(1, 50)
            .then((res) => setBookings(res.data?.bookings ?? []))
            .catch(() => toast.error("Failed to load bookings"))
            .finally(() => setLoading(false));
    }, []);

    const openActionDialog = (id: string, action: "accepted" | "rejected" | "completed") => {
        const booking = bookings.find((b) => b._id === id) ?? null;
        setSelectedBooking(booking);
        setSelectedAction(action);
        setDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedBooking || !selectedAction) return;
        setActionLoading(true);
        try {
            await updateBookingStatus(selectedBooking._id, selectedAction);
            setBookings((prev) =>
                prev.map((b) => b._id === selectedBooking._id ? { ...b, status: selectedAction } : b)
            );
            toast.success(`Booking ${selectedAction} successfully`);
            setDialogOpen(false);
        } catch {
            toast.error("Failed to update booking status");
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = activeFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === activeFilter);

    return (
        <div className="flex flex-col gap-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                <p className="text-sm text-gray-400 mt-1">Manage and respond to customer booking requests</p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
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

            {/* Grid */}
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
                        {activeFilter === "all" ? "You have no bookings yet." : `No ${activeFilter} bookings.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((booking) => (
                        <ProviderBookingCard
                            key={booking._id}
                            booking={booking}
                            onClick={() => setSelectedBooking(booking)}
                        />
                    ))}
                </div>
            )}

            {selectedBooking && !dialogOpen && (
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onAction={openActionDialog}
                />
            )}

            <ActionDialog
                open={dialogOpen}
                action={selectedAction}
                booking={selectedBooking}
                onConfirm={handleConfirmAction}
                onClose={() => setDialogOpen(false)}
                loading={actionLoading}
            />
        </div>
    );
}