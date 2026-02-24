"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Loader2, CheckCircle2, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createBooking } from "@/lib/api/booking";
import { bookingSchema, BookingErrors } from "@/app/(user)/providers-detail/[id]/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopulatedUser {
    _id: string;
    fullname: string;
    email: string;
    imageUrl?: string;
}
interface Provider {
    _id: string;
    price_per_hour: number;
    Useruser_id: PopulatedUser;
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

interface ConfirmModalProps {
    provider: Provider;
    date: string;
    time: string;
    address: string;
    onConfirm: () => void;
    onCancel: () => void;
    submitting: boolean;
}

function ConfirmModal({ provider, date, time, address, onConfirm, onCancel, submitting }: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Orange top bar */}
                <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />

                <div className="p-6">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-[#EE7A40]" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm Booking</h3>
                    <p className="text-sm text-gray-400 mb-5">Review your booking details before sending</p>

                    {/* Details */}
                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Provider</span>
                            <span className="font-semibold text-gray-800">{provider.Useruser_id?.fullname}</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date</span>
                            <span className="font-semibold text-gray-800">{date}</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Time</span>
                            <span className="font-semibold text-gray-800">{time}</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex justify-between text-sm gap-4">
                            <span className="text-gray-500 shrink-0">Address</span>
                            <span className="font-semibold text-gray-800 text-right line-clamp-2">{address}</span>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Rate</span>
                            <span className="font-bold text-[#EE7A40]">NPR {provider.price_per_hour}/hr</span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center mb-5">
                        The provider will accept or reject your request
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={submitting}
                            className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={submitting}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] text-white text-sm font-bold
                                       shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:brightness-105 active:scale-[0.98]
                                       transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {submitting
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                : <><CheckCircle2 className="w-4 h-4" /> Confirm</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingForm({ provider }: { provider: Provider }) {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    const [address, setAddress] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [locating, setLocating] = useState(false);
    const [errors, setErrors] = useState<BookingErrors>({});
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUseLocation = () => {
        if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();
                    setAddress(data.display_name || `${latitude}, ${longitude}`);
                    setErrors((prev) => ({ ...prev, address: undefined }));
                    toast.success("Location detected!");
                } catch {
                    toast.error("Could not get address. Please type manually.");
                    setAddress("");
                } finally {
                    setLocating(false);
                }
            },
            () => { toast.error("Location access denied."); setLocating(false); }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = bookingSchema.safeParse({ date, time, address, note });
        if (!result.success) {
            const fieldErrors: BookingErrors = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof BookingErrors;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setSubmitting(true);
        try {
            const scheduled_at = new Date(`${date}T${time}:00`).toISOString();
            await createBooking({
                provider_id: provider._id,
                scheduled_at,
                address,
                note: note || undefined,
            });
            setShowConfirm(false);
            toast.success("Booking request sent! Waiting for provider to accept.");
            setDate(""); setTime(""); setAddress(""); setNote("");
            setTimeout(() => router.push("/bookings"), 1500);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to send booking request");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* Confirm Modal */}
            {showConfirm && (
                <ConfirmModal
                    provider={provider}
                    date={date}
                    time={time}
                    address={address}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowConfirm(false)}
                    submitting={submitting}
                />
            )}

            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden sticky top-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] px-6 py-5">
                    <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Book this provider</p>
                    <div className="flex items-end gap-1">
                        <span className="text-white text-3xl font-bold">NPR {provider.price_per_hour}</span>
                        <span className="text-white/70 text-sm mb-1">/hr</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="p-6 flex flex-col gap-4">

                    {/* Date */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={date}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: undefined })); }}
                                className={`w-full pl-10 pr-4 h-11 rounded-xl border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors
                                    ${errors.date ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                            />
                        </div>
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>

                    {/* Time */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => { setTime(e.target.value); setErrors((p) => ({ ...p, time: undefined })); }}
                                className={`w-full pl-10 pr-4 h-11 rounded-xl border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors
                                    ${errors.time ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                            />
                        </div>
                        {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Your Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                                value={address}
                                onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: undefined })); }}
                                placeholder="e.g. 45 Thamel Marg, Kathmandu 44600"
                                rows={2}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors resize-none
                                    ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                            />
                        </div>
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        <button
                            type="button"
                            onClick={handleUseLocation}
                            disabled={locating}
                            className="flex items-center gap-1.5 text-[#EE7A40] text-xs font-semibold hover:underline mt-1.5 disabled:opacity-50"
                        >
                            {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                            {locating ? "Detecting location..." : "Use my current location"}
                        </button>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                            Note <span className="text-gray-300 normal-case font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Describe what you need..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors resize-none"
                        />
                    </div>

                    {/* Rate */}
                    <div className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-3">
                        <span className="text-sm text-gray-600 font-medium">Rate</span>
                        <span className="text-base font-bold text-gray-900">NPR {provider.price_per_hour}/hr</span>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] text-white font-bold text-sm
                                   shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:shadow-[0_6px_20px_rgba(238,122,64,0.5)]
                                   hover:brightness-105 active:scale-[0.98] transition-all duration-200
                                   flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Request Booking
                    </button>

                    <p className="text-center text-[11px] text-gray-400">
                        Provider will accept or reject your request
                    </p>
                </form>
            </div>
        </>
    );
}