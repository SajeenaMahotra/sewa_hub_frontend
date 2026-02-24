"use client";

import { useEffect, useState } from "react";
import { getProviderBookings, updateBookingStatus } from "@/lib/api/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, MapPin, Clock, PackageOpen, CheckCircle2, XCircle, Check, X, Banknote, Mail } from "lucide-react";
import { toast } from "sonner";

// Types

type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

interface PopulatedUser {
    _id: string;
    fullname: string;
    email: string;
    imageUrl?: string;
}
interface Booking {
    _id: string;
    user_id: PopulatedUser;
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
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso: string) {
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

function StatusBadge({ status }: { status: BookingStatus }) {
    const { label, classes } = statusConfig[status];
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${classes}`}>
            {label}
        </span>
    );
}

// ─── Booking Detail Modal ─────────────────────────────────────────────────────

interface BookingModalProps {
    booking: Booking;
    onClose: () => void;
    onAction: (id: string, action: "accepted" | "rejected" | "completed") => void;
}

function BookingDetailModal({ booking, onClose, onAction }: BookingModalProps) {
    const customer = booking.user_id;
    const avatar   = resolveAvatar(customer?.imageUrl);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Top bar */}
                <div className={`h-1 ${
                    booking.status === "accepted"  ? "bg-green-400" :
                    booking.status === "completed" ? "bg-blue-400"  :
                    booking.status === "rejected" || booking.status === "cancelled" ? "bg-gray-300" :
                    "bg-amber-400"
                }`} />

                <div className="p-6">
                    {/* Close + title */}
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900">Booking Details</h3>
                        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* Customer info */}
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

                    {/* Details grid */}
                    <div className="flex flex-col gap-3 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                <Calendar className="w-4 h-4 text-[#EE7A40]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Date & Time</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {formatDate(booking.scheduled_at)} at {formatTime(booking.scheduled_at)}
                                </p>
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

                    {/* Action buttons */}
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

//  Confirm Dialog 

interface ActionDialogProps {
    open: boolean;
    action: "accepted" | "rejected" | "completed" | null;
    booking: Booking | null;
    onConfirm: () => void;
    onClose: () => void;
    loading: boolean;
}

function ActionDialog({ open, action, booking, onConfirm, onClose, loading }: ActionDialogProps) {
    if (!action || !booking) return null;

    const config = {
        accepted:  { title: "Accept Booking",    desc: "Are you sure you want to accept this booking? The customer will be notified.",  actionLabel: "Accept",   actionClass: "bg-green-500 hover:bg-green-600 text-white" },
        rejected:  { title: "Reject Booking",    desc: "Are you sure you want to reject this booking? This cannot be undone.",          actionLabel: "Reject",   actionClass: "bg-red-500 hover:bg-red-600 text-white"     },
        completed: { title: "Mark as Completed", desc: "Confirm that the service has been completed successfully.",                     actionLabel: "Complete", actionClass: "bg-blue-500 hover:bg-blue-600 text-white"   },
    };
    const { title, desc, actionLabel, actionClass } = config[action];

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {desc}<br /><br />
                        Customer: <strong>{booking.user_id?.fullname}</strong><br />
                        Date: <strong>{formatDate(booking.scheduled_at)}</strong> at <strong>{formatTime(booking.scheduled_at)}</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={loading} className={actionClass}>
                        {loading ? "Processing..." : actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

//  Booking Card 

function BookingCard({ booking, onClick }: { booking: Booking; onClick: () => void }) {
    const customer = booking.user_id;
    const avatar   = resolveAvatar(customer?.imageUrl);

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow duration-200 cursor-pointer"
        >
            <div className={`h-1 ${
                booking.status === "accepted"  ? "bg-green-400" :
                booking.status === "completed" ? "bg-blue-400"  :
                booking.status === "rejected" || booking.status === "cancelled" ? "bg-gray-300" :
                "bg-amber-400"
            }`} />

            <div className="p-5">
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
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="h-px bg-gray-100" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-40" />
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
    { label: "Rejected",  value: "rejected"  },
];

//  Page 

export default function ProviderBookingsPage() {
    const [bookings, setBookings]               = useState<Booking[]>([]);
    const [loading, setLoading]                 = useState(true);
    const [activeFilter, setActiveFilter]       = useState("all");
    const [actionLoading, setActionLoading]     = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
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
                        <BookingCard
                            key={booking._id}
                            booking={booking}
                            onClick={() => setSelectedBooking(booking)}
                        />
                    ))}
                </div>
            )}

            {/* Detail modal */}
            {selectedBooking && !dialogOpen && (
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onAction={openActionDialog}
                />
            )}

            {/* Confirm dialog */}
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