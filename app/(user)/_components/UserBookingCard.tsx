"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, MapPin, Clock, ChevronRight, XCircle, Zap, AlertTriangle, Minus, MessageCircle, Star,Trash2 } from "lucide-react";
import { toast } from "sonner";
import { handleCancelBooking, handleDeleteBooking } from "@/lib/actions/booking-actions";
import { handleRateProvider } from "@/lib/actions/provider-actions";
import { useAuth } from "@/context/authContext";
import ChatWindow from "@/components/ChatWindow";

//  Types

export type BookingStatus   = "pending" | "accepted" | "rejected" | "completed" | "cancelled";
export type BookingSeverity = "normal" | "emergency" | "urgent";

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
    severity: BookingSeverity;
    effective_price_per_hour: number;
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
export function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" });
}
export function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" });
}

//  Severity badge

const severityConfig: Record<BookingSeverity, { label: string; icon: React.ReactNode; classes: string; dot: string }> = {
    normal:    { label: "Normal",    icon: <Minus className="w-3 h-3" />,         classes: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-400" },
    emergency: { label: "Emergency", icon: <AlertTriangle className="w-3 h-3" />, classes: "bg-amber-50 text-amber-600 border-amber-200",       dot: "bg-amber-400"   },
    urgent:    { label: "Urgent",    icon: <Zap className="w-3 h-3" />,           classes: "bg-red-50 text-red-500 border-red-200",             dot: "bg-red-500"     },
};

export function SeverityBadge({ severity }: { severity: BookingSeverity }) {
    const cfg = severityConfig[severity ?? "normal"];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.classes}`}>
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

//  Status badge

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
    onDelete: (id: string) => void;
    onClick?: () => void;
}

const CHAT_ALLOWED: BookingStatus[] = ["pending", "accepted"];


function StarRatingModal({
    open, onClose, onSubmit, providerName,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (rating: number) => Promise<void>;
    providerName: string;
}) {
    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(0);
    const [submitting, setSubmitting] = useState(false);
   

    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    const handleSubmit = async () => {
        if (!selected) return;
        setSubmitting(true);
        await onSubmit(selected);
        setSubmitting(false);
        setSelected(0);
        setHovered(0);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#EE7A40] fill-[#EE7A40]" />
                </div>
                <div className="text-center">
                    <p className="text-base font-bold text-gray-900">Rate your experience</p>
                    <p className="text-xs text-gray-400 mt-0.5">with <span className="font-semibold text-gray-600">{providerName}</span></p>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHovered(star)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setSelected(star)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-9 h-9 transition-colors ${
                                    star <= (hovered || selected)
                                        ? "text-[#EE7A40] fill-[#EE7A40]"
                                        : "text-gray-200 fill-gray-200"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Label */}
                <p className="text-sm font-semibold text-[#EE7A40] h-5">
                    {labels[hovered || selected] || ""}
                </p>

                <div className="flex gap-2 w-full mt-1">
                    <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selected || submitting}
                        className="flex-1 py-2 rounded-xl bg-[#EE7A40] text-white text-sm font-semibold hover:bg-[#d96e35] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UserBookingCard({ booking, onCancel, onClick,onDelete }: UserBookingCardProps) {
    const { user } = useAuth();
    const provider     = booking.provider_id;
    const providerUser = provider?.Useruser_id;
    const avatar       = resolveAvatar(provider?.imageUrl || providerUser?.imageUrl);
    const [cancelling, setCancelling] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [rateOpen, setRateOpen] = useState(false);


    const severity        = booking.severity ?? "normal";
    const basePrice       = booking.price_per_hour;
    const effectivePrice  = booking.effective_price_per_hour ?? basePrice;
    const isPriceModified = effectivePrice !== basePrice;
    const canChat         = CHAT_ALLOWED.includes(booking.status);
    const canDelete = booking.status === "cancelled" || booking.status === "rejected"; 

    const handleCancel = async () => {
        setCancelling(true);
        try {
            await handleCancelBooking(booking._id);
            toast.success("Booking cancelled");
            onCancel(booking._id);
        } catch {
            toast.error("Could not cancel booking");
        } finally {
            setCancelling(false);
        }
    };

    const handleDelete = async () => {
    setDeleting(true);
    try {
        await handleDeleteBooking(booking._id);
        toast.success("Booking deleted");
        onDelete(booking._id);
    } catch {
        toast.error("Could not delete booking");
    } finally {
        setDeleting(false);
    }
};

    const handleRate = async (rating: number) => {
        try {
            await handleRateProvider(booking._id, rating);
            toast.success("Thank you for your rating!");
        } catch {
            toast.error("Could not submit rating. Please try again.");
        }
    };

    return (
        <>
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
                    <div className="flex flex-col gap-3">
                        {/* Row 1: pricing + severity + chevron */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                    {isPriceModified && (
                                        <span className="text-[10px] text-gray-400 line-through">NPR {basePrice}/hr</span>
                                    )}
                                    <span className="text-xs font-bold text-gray-800">NPR {effectivePrice}/hr</span>
                                </div>
                                <SeverityBadge severity={severity} />
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>

                        {/* Row 2: action buttons */}
                        {(canChat || booking.status === "pending" || booking.status === "completed" || canDelete) && (
                            <div className="flex items-center gap-2 pt-1 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                {/* Chat — pending/accepted only */}
                                {canChat && (
                                    <button
                                        onClick={() => setChatOpen(true)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#EE7A40] hover:text-white border border-[#EE7A40] hover:bg-[#EE7A40] px-3 py-2 rounded-lg transition-all duration-200"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        Message 
                                    </button>
                                )}

                                {/* Rate — completed only */}
                                {booking.status === "completed" && (
                                    <button
                                        onClick={() => setRateOpen(true)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-white border border-amber-300 hover:bg-amber-400 px-3 py-2 rounded-lg transition-all duration-200"
                                    >
                                        <Star className="w-3.5 h-3.5" />
                                        Rate Provider
                                    </button>
                                )}

                                {/* Cancel — pending only */}
                                {booking.status === "pending" && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                disabled={cancelling}
                                                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
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

                                {/* Delete — cancelled/rejected only */}
        {canDelete && (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        disabled={deleting}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your <strong>{booking.status}</strong> booking with{" "}
                            <strong>{providerUser?.fullname}</strong>. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep It</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Yes, Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
                            </div>

                            
                            
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Modal */}
            <Dialog open={chatOpen} onOpenChange={setChatOpen}>
                <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl h-[600px] flex flex-col [&>button]:hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Chat with {providerUser?.fullname}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                        <ChatWindow
                            bookingId={booking._id}
                            currentUserId={user?._id}
                            partnerName={providerUser?.fullname || "Provider"}
                            partnerAvatar={provider?.imageUrl || providerUser?.imageUrl}
                            onClose={() => setChatOpen(false)}
                            isModal
                            readOnly={!["pending", "accepted"].includes(booking.status)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Rate Modal */}
            <StarRatingModal
                open={rateOpen}
                onClose={() => setRateOpen(false)}
                onSubmit={handleRate}
                providerName={providerUser?.fullname || "Provider"}
            />
        </>
    );
}