"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, MapPin, Clock, ChevronRight, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cancelBooking } from "@/lib/api/booking";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface UserBookingCardData {
    _id: string;
    provider_id: {
        _id: string;
        price_per_hour: number;
        imageUrl?: string;
        Useruser_id: { _id: string; fullname: string; email: string; imageUrl?: string };
        ServiceCategorycatgeory_id?: { category_name: string };
    };
    scheduled_at: string;
    address: string;
    note?: string;
    price_per_hour: number;
    status: BookingStatus;
    created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveAvatar(url?: string) {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}
function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" });
}
export function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" });
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig: Record<BookingStatus, { label: string; classes: string }> = {
    pending:   { label: "Pending",   classes: "bg-amber-50 text-amber-600 border-amber-200"  },
    accepted:  { label: "Accepted",  classes: "bg-green-50 text-green-600 border-green-200"  },
    rejected:  { label: "Rejected",  classes: "bg-red-50 text-red-500 border-red-200"        },
    completed: { label: "Completed", classes: "bg-blue-50 text-blue-600 border-blue-200"     },
    cancelled: { label: "Cancelled", classes: "bg-gray-100 text-gray-500 border-gray-200"    },
};

export function StatusBadge({ status }: { status: BookingStatus }) {
    const { label, classes } = statusConfig[status];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${classes}`}>
            {label}
        </span>
    );
}

//  Component 

interface UserBookingCardProps {
    booking: UserBookingCardData;
    onCancel: (id: string) => void;
    onClick?: () => void;
}

export default function UserBookingCard({ booking, onCancel, onClick }: UserBookingCardProps) {
    const router        = useRouter();
    const provider      = booking.provider_id;
    const providerUser  = provider?.Useruser_id;
    const avatar        = resolveAvatar(provider?.imageUrl || providerUser?.imageUrl);
    const [cancelling, setCancelling] = useState(false);

    const handleCancel = async () => {
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
            onClick={onClick}
        >
            {/* Status bar */}
            <div className={`h-1 ${
                booking.status === "accepted"  ? "bg-green-400" :
                booking.status === "completed" ? "bg-blue-400"  :
                booking.status === "rejected" || booking.status === "cancelled" ? "bg-gray-300" :
                "bg-amber-400"
            }`} />

            <div className="p-5">
                {/* Provider info */}
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
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        NPR <span className="font-bold text-gray-700">{booking.price_per_hour}</span>/hr
                    </span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {booking.status === "pending" && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        disabled={cancelling}
                                        className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                    >
                                        <XCircle className="w-3.5 h-3.5" />
                                        {cancelling ? "Cancelling..." : "Cancel"}
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will cancel your booking with <strong>{providerUser?.fullname}</strong> on <strong>{formatDate(booking.scheduled_at)}</strong> at <strong>{formatTime(booking.scheduled_at)}</strong>. This cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleCancel} className="bg-red-500 hover:bg-red-600 text-white">
                                            Yes, Cancel
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}