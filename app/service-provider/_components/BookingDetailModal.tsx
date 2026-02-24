"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Banknote, Mail, CheckCircle2, XCircle, Check, X } from "lucide-react";
import { StatusBadge, formatDate, formatTime, ProviderBookingCardData } from "./ProviderBookingCard";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveAvatar(url?: string) {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}
function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface BookingDetailModalProps {
    booking: ProviderBookingCardData;
    onClose: () => void;
    onAction: (id: string, action: "accepted" | "rejected" | "completed") => void;
}

export default function BookingDetailModal({ booking, onClose, onAction }: BookingDetailModalProps) {
    const customer = booking.user_id;
    const avatar   = resolveAvatar(customer?.imageUrl);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className={`h-1 ${
                    booking.status === "accepted"  ? "bg-green-400" :
                    booking.status === "completed" ? "bg-blue-400"  :
                    booking.status === "rejected" || booking.status === "cancelled" ? "bg-gray-300" :
                    "bg-amber-400"
                }`} />

                <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <Avatar className="w-12 h-12 rounded-xl ring-2 ring-orange-50 shrink-0">
                            <AvatarImage src={avatar} className="object-cover" />
                            <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#EE7A40] font-bold">
                                {customer?.fullname ? getInitials(customer.fullname) : "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900">{customer?.fullname}</p>
                            <p className="text-xs text-gray-400">{customer?.email}</p>
                        </div>
                        <StatusBadge status={booking.status} />
                    </div>

                    <div className="h-px bg-gray-100 mb-5" />

                    <div className="flex flex-col gap-3 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4 text-[#EE7A40]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Date & Time</p>
                                <p className="text-sm font-medium text-gray-800">{formatDate(booking.scheduled_at)} at {formatTime(booking.scheduled_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                                <MapPin className="w-4 h-4 text-[#EE7A40]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Address</p>
                                <p className="text-sm font-medium text-gray-800">{booking.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                <Banknote className="w-4 h-4 text-[#EE7A40]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Rate</p>
                                <p className="text-sm font-medium text-gray-800">NPR {booking.price_per_hour}/hr</p>
                            </div>
                        </div>
                        {booking.note && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                                    <Mail className="w-4 h-4 text-[#EE7A40]" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Note from customer</p>
                                    <p className="text-sm font-medium text-gray-800 italic">"{booking.note}"</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {booking.status === "pending" && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => { onClose(); onAction(booking._id, "accepted"); }}
                                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 text-sm font-semibold border border-green-200 transition-colors"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Accept
                            </button>
                            <button
                                onClick={() => { onClose(); onAction(booking._id, "rejected"); }}
                                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold border border-red-200 transition-colors"
                            >
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                        </div>
                    )}
                    {booking.status === "accepted" && (
                        <button
                            onClick={() => { onClose(); onAction(booking._id, "completed"); }}
                            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold border border-blue-200 transition-colors"
                        >
                            <Check className="w-4 h-4" /> Mark as Completed
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}