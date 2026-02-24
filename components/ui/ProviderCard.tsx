"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Star, Clock, Banknote } from "lucide-react";

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

export interface ProviderCardData {
    _id: string;
    experience_years: number;
    is_verified: number;
    rating: number;
    bio?: string;
    address?: string;
    imageUrl?: string;
    price_per_hour: number;
    rating_count?: number;
    Useruser_id: PopulatedUser;
    ServiceCategorycatgeory_id: PopulatedCategory;
}

interface ProviderCardProps {
    provider: ProviderCardData;
    onClick?: (id: string) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function resolveAvatar(imageUrl?: string) {
    if (!imageUrl) return undefined;
    return imageUrl.startsWith("http") ? imageUrl : `${BASE_URL}${imageUrl}`;
}

export function ProviderCard({ provider, onClick }: ProviderCardProps) {
    const user = provider.Useruser_id;
    const category = provider.ServiceCategorycatgeory_id;
    const avatar = resolveAvatar(provider.imageUrl || user?.imageUrl);
    const hasRating = provider.rating > 0;

    return (
        <Card
            onClick={() => onClick?.(provider._id)}
            className={[
                "relative overflow-hidden rounded-2xl border-0 bg-white py-0 gap-0",
                "h-full flex flex-col",                          // ← full height, column layout
                "shadow-[0_2px_16px_rgba(0,0,0,0.07)]",
                "transition-all duration-300 ease-out",
                "hover:shadow-[0_8px_30px_rgba(238,122,64,0.18)] hover:-translate-y-1",
                onClick ? "cursor-pointer" : "",
            ].join(" ")}
        >
            {/* Accent top bar */}
            <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />

            {/* flex-1 so this section grows and pushes button to bottom */}
            <CardContent className="p-5 flex flex-col flex-1">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative shrink-0">
                        <Avatar className="w-12 h-12 rounded-xl ring-2 ring-orange-100">
                            <AvatarImage src={avatar} alt={user?.fullname} className="object-cover" />
                            <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#EE7A40] font-bold text-sm">
                                {user?.fullname ? getInitials(user.fullname) : "?"}
                            </AvatarFallback>
                        </Avatar>
                        {provider.is_verified === 1 && (
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white">
                                <ShieldCheck className="w-3 h-3 text-white" />
                            </span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-[15px] truncate leading-snug">
                            {user?.fullname ?? "—"}
                        </p>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-[#EE7A40] bg-orange-50 px-2 py-0.5 rounded-full">
                            {category?.category_name ?? "—"}
                        </span>
                    </div>
                </div>

                {/* Bio — takes up available space, pushing stats+button down */}
                <div className="flex-1">
                    {provider.bio && (
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                            {provider.bio}
                        </p>
                    )}
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 mt-4 mb-4">
                    <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                            <Star className={`w-3.5 h-3.5 ${hasRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                            <span className="text-xs font-bold text-gray-800">
                                {hasRating ? provider.rating.toFixed(1) : "—"}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-400 leading-none">
                            {provider.rating_count ? `${provider.rating_count} ratings` : "No ratings"}
                        </span>
                    </div>

                    <div className="w-px h-6 bg-gray-200" />

                    <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-bold text-gray-800">
                                {provider.experience_years} yr{provider.experience_years !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-400 leading-none">Experience</span>
                    </div>

                    <div className="w-px h-6 bg-gray-200" />

                    <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-0.5">
                            <Banknote className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-bold text-gray-800">{provider.price_per_hour}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 leading-none">NPR/hr</span>
                    </div>
                </div>

                {/* Book button — always at bottom */}
                <button
                    onClick={(e) => { e.stopPropagation(); onClick?.(provider._id); }}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] text-white text-sm font-bold
                               shadow-[0_4px_14px_rgba(238,122,64,0.35)]
                               hover:shadow-[0_6px_20px_rgba(238,122,64,0.5)] hover:brightness-105
                               active:scale-[0.98] transition-all duration-200"
                >
                    Book Now
                </button>

            </CardContent>
        </Card>
    );
}