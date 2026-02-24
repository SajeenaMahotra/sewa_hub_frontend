"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProviderById, getAllProviders } from "@/lib/api/provider";
import { ProviderCard, ProviderCardData } from "@/components/ui/ProviderCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ShieldCheck, Star, Clock, Banknote, MapPin,
    ArrowLeft, Mail, Calendar, CheckCircle2, ChevronDown
} from "lucide-react";

//  Types 

interface PopulatedUser {
    _id: string;
    fullname: string;
    email: string;
    imageUrl?: string;
}
interface PopulatedCategory {
    _id: string;
    category_name: string;
}
interface Provider {
    _id: string;
    experience_years: number;
    is_verified: number;
    rating: number;
    bio?: string;
    address?: string;
    phone?: string;
    imageUrl?: string;
    price_per_hour: number;
    rating_count?: number;
    Useruser_id: PopulatedUser;
    ServiceCategorycatgeory_id: PopulatedCategory;
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

// ─── Booking Form ─────────────────────────────────────────────────────────────

function BookingForm({ provider }: { provider: Provider }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [hours, setHours] = useState(1);
    const [note, setNote] = useState("");
    const [address, setAddress] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const total = provider.price_per_hour * hours;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // UI only — backend not ready yet
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden sticky top-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] px-6 py-5">
                <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">Book this provider</p>
                <div className="flex items-end gap-1">
                    <span className="text-white text-3xl font-bold">NPR {provider.price_per_hour}</span>
                    <span className="text-white/70 text-sm mb-1">/hr</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                {/* Date */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                        Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            required
                            value={date}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors"
                        />
                    </div>
                </div>

                {/* Time */}
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                        Time
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors"
                        />
                    </div>
                </div>



                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                        Your Address
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your full address...  e.g. 45 Thamel Marg, Kathmandu"
                            rows={2}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] transition-colors resize-none"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (!navigator.geolocation) return;
                        navigator.geolocation.getCurrentPosition(
                            async (pos) => {
                                const { latitude, longitude } = pos.coords;
                                try {
                                    const res = await fetch(
                                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                                    );
                                    const data = await res.json();
                                    setAddress(data.display_name || `${latitude}, ${longitude}`);
                                } catch {
                                    setAddress(`${latitude}, ${longitude}`);
                                }
                            },
                            () => alert("Location access denied.")
                        );
                    }}
                    className="flex items-center gap-1.5 text-[#EE7A40] text-xs font-semibold hover:underline mt-1"
                >
                    <MapPin className="w-3.5 h-3.5" />
                    Use my current location
                </button>

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

                {/* Total */}
                <div className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-600 font-medium">Estimated total</span>
                    <span className="text-lg font-bold text-gray-900">NPR {total}</span>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] text-white font-bold text-sm
                               shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:shadow-[0_6px_20px_rgba(238,122,64,0.5)]
                               hover:brightness-105 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                >
                    {submitted ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            Request Sent!
                        </>
                    ) : (
                        "Request Booking"
                    )}
                </button>

                <p className="text-center text-[11px] text-gray-400">
                    Booking confirmation coming soon
                </p>
            </form>
        </div>
    );
}

// Skeleton 

function DetailSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white rounded-2xl p-6 flex gap-5">
                    <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-4 w-56 mt-1" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 flex flex-col gap-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                </div>
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>
        </div>
    );
}

//  Page 

export default function ProviderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [provider, setProvider] = useState<Provider | null>(null);
    const [similar, setSimilar] = useState<ProviderCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        getProviderById(id)
            .then((res) => {
                const p: Provider = res.data;
                setProvider(p);
                // Fetch similar providers in same category
                return getAllProviders(1, 4, p.ServiceCategorycatgeory_id?._id);
            })
            .then((res) => {
                // Exclude current provider
                const others = (res.data?.providers ?? []).filter((p: ProviderCardData) => p._id !== id);
                setSimilar(others.slice(0, 3));
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen" style={{ backgroundColor: "#faf9f7", backgroundImage: "radial-gradient(circle, #e5e0d8 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
            <DetailSkeleton />
        </div>
    );

    if (notFound || !provider) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500">Provider not found.</p>
            <button onClick={() => router.back()} className="text-[#EE7A40] text-sm font-semibold">← Go back</button>
        </div>
    );

    const user = provider.Useruser_id;
    const category = provider.ServiceCategorycatgeory_id;
    const avatar = resolveAvatar(provider.imageUrl || user?.imageUrl);
    const hasRating = provider.rating > 0;

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: "#faf9f7", backgroundImage: "radial-gradient(circle, #e5e0d8 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        >
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left column ─────────────────────────────────────── */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        {/* Profile card */}
                        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
                            {/* Orange accent bar */}
                            <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
                            <div className="p-6 flex flex-col sm:flex-row gap-5">
                                <div className="relative shrink-0">
                                    <Avatar className="w-20 h-20 rounded-2xl ring-2 ring-orange-100">
                                        <AvatarImage src={avatar} alt={user?.fullname} className="object-cover" />
                                        <AvatarFallback className="rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#EE7A40] font-bold text-xl">
                                            {user?.fullname ? getInitials(user.fullname) : "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    {provider.is_verified === 1 && (
                                        <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-start gap-2 mb-1">
                                        <h1 className="text-xl font-bold text-gray-900">{user?.fullname}</h1>
                                        {provider.is_verified === 1 && (
                                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                                                <ShieldCheck className="w-3 h-3" /> Verified
                                            </span>
                                        )}
                                    </div>
                                    <span className="inline-block text-[12px] font-semibold text-[#EE7A40] bg-orange-50 px-2.5 py-0.5 rounded-full mb-3">
                                        {category?.category_name}
                                    </span>

                                    {/* Quick stats */}
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Star className={`w-4 h-4 ${hasRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                                            <span className="text-sm font-bold text-gray-800">
                                                {hasRating ? provider.rating.toFixed(1) : "—"}
                                            </span>
                                            {provider.rating_count ? (
                                                <span className="text-xs text-gray-400">({provider.rating_count} ratings)</span>
                                            ) : (
                                                <span className="text-xs text-gray-400">No ratings yet</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm">{provider.experience_years} yr{provider.experience_years !== 1 ? "s" : ""} experience</span>
                                        </div>
                                        {provider.address && (
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{provider.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        {provider.bio && (
                            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-3">About</h2>
                                <p className="text-sm text-gray-600 leading-relaxed">{provider.bio}</p>
                            </div>
                        )}

                        {/* Contact info */}
                        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Contact Info</h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-[#EE7A40]" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Email</p>
                                        <p className="text-sm text-gray-800 font-medium">{user?.email}</p>
                                    </div>
                                </div>
                                {provider.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                            <span className="text-[#EE7A40] text-sm font-bold">📞</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Phone</p>
                                            <p className="text-sm text-gray-800 font-medium">{provider.phone}</p>
                                        </div>
                                    </div>
                                )}
                                {provider.address && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-[#EE7A40]" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Address</p>
                                            <p className="text-sm text-gray-800 font-medium">{provider.address}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews placeholder */}
                        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-900">Reviews</h2>
                                <span className="text-xs text-gray-400">
                                    {provider.rating_count ? `${provider.rating_count} total` : "No reviews yet"}
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-1">
                                    <Star className="w-5 h-5 text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">Reviews coming soon</p>
                                <p className="text-xs text-gray-400">Be the first to book and review this provider</p>
                            </div>
                        </div>

                        {/* Similar providers */}
                        {similar.length > 0 && (
                            <div>
                                <h2 className="text-base font-bold text-gray-900 mb-4">
                                    Similar Providers in {category?.category_name}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {similar.map((p) => (
                                        <ProviderCard
                                            key={p._id}
                                            provider={p}
                                            onClick={(pid) => router.push(`/providers/${pid}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column: booking form */}
                    <div className="lg:col-span-1">
                        <BookingForm provider={provider} />
                    </div>

                </div>
            </div>
        </div>
    );
}