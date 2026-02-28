"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Phone, Banknote, Mail, CheckCircle2, XCircle, Check, X, Zap, AlertTriangle, Loader2, MessageCircle,Map } from "lucide-react";
import { StatusBadge, formatDate, formatTime, ProviderBookingCardData } from "./ProviderBookingCard";
import ChatWindow from "@/components/ChatWindow";
import { useAuth } from "@/context/authContext";

const AddressMapView = dynamic(() => import("@/components/AddressMapView"), { ssr: false });

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
const SEVERITY_MULTIPLIERS = { normal: 1.0, emergency: 1.4, urgent: 1.8 };

function resolveAvatar(url?: string) {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}
function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface BookingDetailModalProps {
    booking: ProviderBookingCardData & { phone_number?: string };
    onClose: () => void;
    onAction: (id: string, action: "accepted" | "rejected" | "completed") => Promise<void>;
}

export default function BookingDetailModal({ booking, onClose, onAction }: BookingDetailModalProps) {
    const { user } = useAuth();
    const customer   = booking.user_id;
    const avatar     = resolveAvatar(customer?.imageUrl);
    const severity   = booking.severity ?? "normal";
    const basePrice  = booking.price_per_hour;
    const effPrice   = booking.effective_price_per_hour ?? basePrice;
    const multiplier = SEVERITY_MULTIPLIERS[severity];
    const isElevated = severity !== "normal";
    const canChat    = ["pending", "accepted", "cancelled", "rejected", "completed"].includes(booking.status);

    const [acting, setActing]     = useState<"accepted" | "rejected" | "completed" | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [mapOpen, setMapOpen]   = useState(false);

    const handleAction = async (action: "accepted" | "rejected" | "completed") => {
        setActing(action);
        await onAction(booking._id, action);
        setActing(null);
        onClose();
    };

    const sevStyle = {
        emergency: { icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, label: "Emergency", classes: "bg-amber-50 border-amber-200 text-amber-600" },
        urgent:    { icon: <Zap className="w-4 h-4 text-red-500" />,             label: "Urgent",    classes: "bg-red-50 border-red-200 text-red-500"       },
        normal:    { icon: null,                                                  label: "Normal",    classes: "bg-gray-50 border-gray-200 text-gray-500"    },
    }[severity];

    return (
        <>
        {/*  Address Map Modal */}
            {mapOpen && (
                <AddressMapView
                    address={booking.address}
                    customerName={customer?.fullname}
                    onClose={() => setMapOpen(false)}
                />
            )}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className={`h-1 ${
                    isElevated
                        ? severity === "urgent" ? "bg-red-500" : "bg-amber-400"
                        : booking.status === "accepted"  ? "bg-green-400"
                        : booking.status === "completed" ? "bg-blue-400"
                        : booking.status === "rejected" || booking.status === "cancelled" ? "bg-gray-300"
                        : "bg-amber-400"
                }`} />

                {chatOpen ? (
                    <div className="h-[520px] flex flex-col">
                        <ChatWindow
                            bookingId={booking._id}
                            currentUserId={user?._id}
                            partnerName={customer?.fullname || "Customer"}
                            partnerAvatar={customer?.imageUrl}
                            onClose={() => setChatOpen(false)}
                            isModal
                            readOnly={!["pending", "accepted"].includes(booking.status)}
                        />
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Customer */}
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

                            {/* Date & Time */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4 text-[#EE7A40]" />
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Date & Time</p>
                                    <p className="text-sm font-medium text-gray-800">{formatDate(booking.scheduled_at)} at {formatTime(booking.scheduled_at)}</p>
                                </div>
                            </div>

                            {/* Phone Number ← new */}
                            {booking.phone_number && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                        <Phone className="w-4 h-4 text-[#EE7A40]" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Phone</p>
                                        <a href={`tel:${booking.phone_number}`}
                                           className="text-sm font-medium text-gray-800 hover:text-[#EE7A40] transition-colors">
                                            {booking.phone_number}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Address */}
<div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
        <MapPin className="w-4 h-4 text-[#EE7A40]" />
    </div>
    <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Address</p>
        <p className="text-sm font-medium text-gray-800 mb-1.5">{booking.address}</p>

        {/*  View on Map Button */}
        <button
            onClick={() => setMapOpen(true)}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#EE7A40]
                       bg-orange-50 hover:bg-orange-100 border border-orange-200
                       px-2.5 py-1 rounded-lg transition-colors"
        >
            <Map className="w-3 h-3" />
            View on map
        </button>
    </div>
</div>

                            {/* Pricing */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                                    <Banknote className="w-4 h-4 text-[#EE7A40]" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-2">Pricing</p>
                                    <div className={`rounded-xl p-3 border flex flex-col gap-2 ${isElevated ? sevStyle.classes : "bg-gray-50 border-gray-200"}`}>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">Severity</span>
                                            <span className={`inline-flex items-center gap-1.5 font-bold ${sevStyle.classes.split(" ").slice(2).join(" ")}`}>
                                                {sevStyle.icon}{sevStyle.label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Base rate</span><span>NPR {basePrice}/hr</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Multiplier</span><span>×{multiplier.toFixed(1)}</span>
                                        </div>
                                        <div className="h-px bg-gray-200" />
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-gray-700">Effective rate</span>
                                            <span className="text-[#EE7A40]">NPR {effPrice}/hr</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            {booking.note && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                                        <Mail className="w-4 h-4 text-[#EE7A40]" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Note from customer</p>
                                        <p className="text-sm font-medium text-gray-500">{booking.note}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat button */}
                        {canChat && (
                            <button onClick={() => setChatOpen(true)}
                                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-[#EE7A40] text-[#EE7A40] hover:bg-orange-50 text-sm font-semibold transition-colors mb-3">
                                <MessageCircle className="w-4 h-4" />
                                Message Customer
                            </button>
                        )}

                        {/* Action buttons */}
                        {booking.status === "pending" && (
                            <div className="flex gap-3">
                                <button onClick={() => handleAction("accepted")} disabled={!!acting}
                                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 text-sm font-semibold border border-green-200 transition-colors disabled:opacity-60">
                                    {acting === "accepted" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Accept
                                </button>
                                <button onClick={() => handleAction("rejected")} disabled={!!acting}
                                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold border border-red-200 transition-colors disabled:opacity-60">
                                    {acting === "rejected" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                    Reject
                                </button>
                            </div>
                        )}
                        {booking.status === "accepted" && (
                            <button onClick={() => handleAction("completed")} disabled={!!acting}
                                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-semibold border border-blue-200 transition-colors disabled:opacity-60">
                                {acting === "completed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Mark as Completed
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
        </>
    );
}