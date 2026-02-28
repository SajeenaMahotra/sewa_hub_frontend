"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { handleGetProviderById, handleGetAllProviders } from "@/lib/actions/provider-actions";
import { ProviderCard, ProviderCardData } from "@/components/ui/ProviderCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BookingForm from "@/app/(user)/_components/BookingForm";
import DetailSkeleton from "@/app/(user)/_components/DetailSkeleton";
import ReviewsCard from "@/app/(user)/_components/ReviewsCard";
import { ShieldCheck, Star, Clock, MapPin, ArrowLeft, Mail } from "lucide-react";

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
    ratingCount?: number;
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

//  Page 
export default function ProviderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [provider, setProvider] = useState<Provider | null>(null);
    const [similar, setSimilar]   = useState<ProviderCardData[]>([]);
    const [loading, setLoading]   = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        handleGetProviderById(id)
            .then((res) => {
                const p: Provider = res.data;
                setProvider(p);
                return handleGetAllProviders(1, 4, p.ServiceCategorycatgeory_id?._id);
            })
            .then((res) => {
                const others = (res.data?.providers ?? []).filter((p: ProviderCardData) => p._id !== id);
                setSimilar(others.slice(0, 3));
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <DetailSkeleton />;

    if (notFound || !provider) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500">Provider not found.</p>
            <button onClick={() => router.back()} className="text-[#EE7A40] text-sm font-semibold">← Go back</button>
        </div>
    );
    const user      = provider.Useruser_id;
    const category  = provider.ServiceCategorycatgeory_id;
    const avatar    = resolveAvatar(provider.imageUrl || user?.imageUrl);
    const hasRating = provider.rating > 0;
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Back */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/*  Left column  */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Profile card */}
                    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
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
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <Star className={`w-4 h-4 ${hasRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                                        <span className="text-sm font-bold text-gray-800">{hasRating ? provider.rating.toFixed(1) : "—"}</span>
                                        <span className="text-xs text-gray-400">
                                            {provider.ratingCount ? `(${provider.ratingCount} ratings)` : "No ratings yet"}
                                        </span>
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
                                        <span className="text-[#EE7A40] text-sm">📞</span>
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

                    {/* Reviews */}
                    <ReviewsCard rating={provider.rating} ratingCount={provider.ratingCount} />

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
                                        onClick={(pid) => router.push(`/providers-detail/${pid}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/*  Right column: booking form  */}
                <div className="lg:col-span-1">
                    <BookingForm provider={provider} />
                </div>

            </div>
        </div>
    );
}