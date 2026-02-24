"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface ProviderBookingCardData {
    _id: string;
    user_id: { _id: string; fullname: string; email: string; imageUrl?: string };
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

// ─── Component ────────────────────────────────────────────────────────────────

interface ProviderBookingCardProps {
    booking: ProviderBookingCardData;
    onClick: () => void;
}

export default function ProviderBookingCard({ booking, onClick }: ProviderBookingCardProps) {
    const customer = booking.user_id;
    const avatar   = resolveAvatar(customer?.imageUrl);

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow duration-200 cursor-pointer"
        >
            {/* Status bar */}
            <div className={`h-1 ${
                booking.status === "accepted"  ? "bg-green-400" :
                booking.status === "completed" ? "bg-blue-400"  :
                booking.status === "rejected" || booking.status === "cancelled" ? "bg-gray-300" :
                "bg-amber-400"
            }`} />

            <div className="p-5">
                {/* Customer info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-11 h-11 rounded-xl ring-2 ring-orange-50 shrink-0">
                            <AvatarImage src={avatar} className="object-cover" />
                            <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#EE7A40] font-bold text-sm">
                                {customer?.fullname ? getInitials(customer.fullname) : "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{customer?.fullname || "Customer"}</p>
                            <p className="text-xs text-gray-400">{customer?.email}</p>
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
                    {booking.status === "pending" && (
                        <span className="text-[11px] text-amber-500 font-semibold">Tap to respond →</span>
                    )}
                </div>
            </div>
        </div>
    );
}