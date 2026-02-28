"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Phone, Loader2, CheckCircle2, AlertCircle, Zap, AlertTriangle, Minus } from "lucide-react";
import { toast } from "sonner";
import { createBooking } from "@/lib/api/booking";
import { bookingSchema, BookingErrors } from "@/app/(user)/providers-detail/[id]/schema";

type Severity = "normal" | "emergency" | "urgent";

interface PopulatedUser { _id: string; fullname: string; email: string; imageUrl?: string; }
interface Provider { _id: string; price_per_hour: number; Useruser_id: PopulatedUser; }

const SEVERITY_CONFIG: Record<Severity, {
    label: string; description: string; multiplier: number;
    icon: React.ReactNode; color: string; ring: string; bg: string; dot: string;
}> = {
    normal: { label: "Normal", description: "Flexible schedule", multiplier: 1.0, icon: <Minus className="w-4 h-4" />, color: "text-emerald-600", ring: "ring-emerald-400", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-400" },
    emergency: { label: "Emergency", description: "Within 24 hours", multiplier: 1.4, icon: <AlertTriangle className="w-4 h-4" />, color: "text-amber-600", ring: "ring-amber-400", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-400" },
    urgent: { label: "Urgent", description: "Within 2–3 hours", multiplier: 1.8, icon: <Zap className="w-4 h-4" />, color: "text-red-500", ring: "ring-red-400", bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
};

interface ConfirmModalProps {
    provider: Provider; date: string; time: string; address: string;
    phone_number: string; severity: Severity; effectivePrice: number;
    onConfirm: () => void; onCancel: () => void; submitting: boolean;
}

function ConfirmModal({ provider, date, time, address, phone_number, severity, effectivePrice, onConfirm, onCancel, submitting }: ConfirmModalProps) {
    const sev = SEVERITY_CONFIG[severity];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-[#EE7A40]" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 leading-tight">Confirm Booking</h3>
                            <p className="text-xs text-gray-400">Review your booking details before sending</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Provider</p>
                                <p className="text-sm font-semibold text-gray-800">{provider.Useruser_id?.fullname}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Severity</p>
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border ${sev.bg} ${sev.color}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />{sev.label}
                                </span>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Date</p>
                                <p className="text-sm font-semibold text-gray-800">{date}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Time</p>
                                <p className="text-sm font-semibold text-gray-800">{time}</p>
                            </div>
                            {/* ── Phone ── */}
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Phone</p>
                                <p className="text-sm font-semibold text-gray-800">{phone_number}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Address</p>
                                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{address}</p>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200 my-3" />
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Base rate</p>
                                <p className="text-sm font-semibold text-gray-600">NPR {provider.price_per_hour}/hr</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Multiplier</p>
                                <p className="text-sm font-semibold text-gray-600">×{sev.multiplier.toFixed(1)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Effective rate</p>
                                <p className="text-base font-bold text-[#EE7A40]">NPR {effectivePrice}/hr</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center mb-4">The provider will accept or reject your request</p>

                    <div className="flex gap-3">
                        <button onClick={onCancel} disabled={submitting}
                            className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button onClick={onConfirm} disabled={submitting}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] text-white text-sm font-bold
                                       shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:brightness-105 active:scale-[0.98]
                                       transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60">
                            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><CheckCircle2 className="w-4 h-4" /> Confirm</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingForm({ provider }: { provider: Provider }) {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [note, setNote] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");   // ← new
    const [severity, setSeverity] = useState<Severity>("normal");
    const [submitting, setSubmitting] = useState(false);
    const [locating, setLocating] = useState(false);
    const [errors, setErrors] = useState<BookingErrors & { phone_number?: string }>({});
    const [showConfirm, setShowConfirm] = useState(false);

    const basePrice = provider.price_per_hour;
    const multiplier = SEVERITY_CONFIG[severity].multiplier;
    const effectivePrice = parseFloat((basePrice * multiplier).toFixed(2));

    const handleUseLocation = () => {
        if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    setAddress(data.display_name || `${latitude}, ${longitude}`);
                    setErrors((prev) => ({ ...prev, address: undefined }));
                    toast.success("Location detected!");
                } catch {
                    toast.error("Could not get address. Please type manually.");
                    setAddress("");
                } finally { setLocating(false); }
            },
            () => { toast.error("Location access denied."); setLocating(false); }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};

        const result = bookingSchema.safeParse({ date, time, address, note });
        if (!result.success) {
            result.error.issues.forEach((err) => {
                newErrors[err.path[0] as keyof BookingErrors] = err.message;
            });
        }
        const NEPAL_PHONE = /^(98|97|96|95|94|93|92|91|984|985|986|980|981|982|974|975|961|962|963|964|972|971|970|988|989)[0-9]+$/;
        const cleanPhone = phoneNumber.replace(/[\s\-]/g, "");
        if (!cleanPhone || cleanPhone.length !== 10 || !NEPAL_PHONE.test(cleanPhone)) {
            newErrors.phone_number = "Enter a valid Nepali number (e.g. 98XXXXXXXX)";
        }
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

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
                phone_number: phoneNumber,
                severity,
            });
            setShowConfirm(false);
            toast.success("Booking request sent! Waiting for provider to accept.");
            setDate(""); setTime(""); setAddress(""); setNote(""); setPhoneNumber(""); setSeverity("normal");
            setTimeout(() => router.push("/bookings"), 1500);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to send booking request");
        } finally { setSubmitting(false); }
    };

    const activeSev = SEVERITY_CONFIG[severity];

    return (
        <>
            {showConfirm && (
                <ConfirmModal
                    provider={provider}
                    date={date}
                    time={time}
                    address={address}
                    phone_number={phoneNumber}
                    severity={severity}
                    effectivePrice={effectivePrice}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowConfirm(false)}
                    submitting={submitting}
                />
            )}

            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] px-6 py-5">
                    <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Book this provider</p>
                    <div className="flex items-end gap-1">
                        <span className="text-white text-3xl font-bold">NPR {provider.price_per_hour}</span>
                        <span className="text-white/70 text-sm mb-1">/hr</span>
                    </div>
                    <p className="text-white/60 text-xs mt-0.5">base rate - final price depends on severity</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="p-6 flex flex-col gap-4">

                    {/* Date */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="date" value={date} min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => { setDate(e.target.value); setErrors((p) => ({ ...p, date: undefined })); }}
                                className={`w-full pl-10 pr-4 h-11 rounded-xl border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors ${errors.date ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                            />
                        </div>
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>

                    {/* Time */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="time" value={time}
                                onChange={(e) => { setTime(e.target.value); setErrors((p) => ({ ...p, time: undefined })); }}
                                className={`w-full pl-10 pr-4 h-11 rounded-xl border text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors ${errors.time ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                            />
                        </div>
                        {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                    </div>

                    {/* Phone Number ← new */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="tel"
                                value={phoneNumber}
                                placeholder="e.g. 9841234567"
                                maxLength={10}                                    // ← cap at 10 digits
                                onChange={(e) => {
                                    // Only allow digits
                                    const val = e.target.value.replace(/\D/g, "");
                                    setPhoneNumber(val);
                                    setErrors((p) => ({ ...p, phone_number: undefined }));
                                }}
                                className={`w-full pl-10 pr-4 h-11 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors ${errors.phone_number ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                            />
                        </div>
                        {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Your Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea value={address} rows={2} placeholder="e.g. 45 Thamel Marg, Kathmandu 44600"
                                onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: undefined })); }}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors resize-none ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                            />
                        </div>
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        <button type="button" onClick={handleUseLocation} disabled={locating}
                            className="flex items-center gap-1.5 text-[#EE7A40] text-xs font-semibold hover:underline mt-1.5 disabled:opacity-50">
                            {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                            {locating ? "Detecting location..." : "Use my current location"}
                        </button>
                    </div>

                    {/* Severity */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Severity</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.entries(SEVERITY_CONFIG) as [Severity, typeof SEVERITY_CONFIG.normal][]).map(([key, cfg]) => (
                                <button key={key} type="button" onClick={() => setSeverity(key)}
                                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 text-center transition-all duration-200
                                        ${severity === key ? `${cfg.bg} border-current ring-2 ${cfg.ring} ring-offset-1 ${cfg.color}` : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                                    <span className={severity === key ? cfg.color : "text-gray-400"}>{cfg.icon}</span>
                                    <span className="text-[11px] font-bold leading-none">{cfg.label}</span>
                                    <span className="text-[10px] text-gray-400 leading-tight">{cfg.description}</span>
                                    <span className={`text-[10px] font-bold ${severity === key ? cfg.color : "text-gray-400"}`}>×{cfg.multiplier.toFixed(1)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                            Note <span className="text-gray-300 normal-case font-normal">(optional)</span>
                        </label>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)}
                            placeholder="Describe what you need..." rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors resize-none" />
                    </div>

                    {/* Pricing Summary */}
                    <div className={`rounded-xl p-4 border transition-colors duration-200 ${activeSev.bg}`}>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2.5">Pricing Summary</p>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Base rate</span><span>NPR {basePrice}/hr</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${activeSev.dot}`} />{activeSev.label} multiplier
                                </span>
                                <span>×{multiplier.toFixed(1)}</span>
                            </div>
                            <div className="h-px bg-gray-200 my-1" />
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-gray-700">Effective rate</span>
                                <span className={activeSev.color}>NPR {effectivePrice}/hr</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit"
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] text-white font-bold text-sm
                                   shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:shadow-[0_6px_20px_rgba(238,122,64,0.5)]
                                   hover:brightness-105 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Request Booking
                    </button>
                    <p className="text-center text-[11px] text-gray-400">Provider will accept or reject your request</p>
                </form>
            </div>
        </>
    );
}