"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LucideSearch, MapPin, ChevronRight, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { getAllProviders } from "@/lib/api/provider";
import { ProviderCard, ProviderCardData } from "@/components/ui/ProviderCard";

//  Constants 

const categories = [
    { name: "Cleaning",    icon: "/icons/cleaning.png",    color: "bg-sky-50",    ring: "ring-sky-200"    },
    { name: "Plumbing",    icon: "/icons/plumbing.png",    color: "bg-blue-50",   ring: "ring-blue-200"   },
    { name: "Electrician", icon: "/icons/electrician.png", color: "bg-yellow-50", ring: "ring-yellow-200" },
    { name: "Carpenter",   icon: "/icons/carpenter.png",   color: "bg-amber-50",  ring: "ring-amber-200"  },
    { name: "AC Repair",   icon: "/icons/repair.png",      color: "bg-cyan-50",   ring: "ring-cyan-200"   },
    { name: "Painter",     icon: "/icons/painter.png",     color: "bg-purple-50", ring: "ring-purple-200" },
    { name: "Gardening",   icon: "/icons/gardening.png",   color: "bg-green-50",  ring: "ring-green-200"  },
    { name: "Laundry",     icon: "/icons/laundry.png",     color: "bg-pink-50",   ring: "ring-pink-200"   },
];

//  Skeleton 

function ProviderCardSkeleton() {
    return (
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="h-1 bg-gray-100" />
            <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl mt-1" />
            </div>
        </div>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, onSeeAll }: { title: string; subtitle?: string; onSeeAll?: () => void }) {
    return (
        <div className="flex items-end justify-between mb-5">
            <div>
                <h2 className="text-gray-900 text-xl font-bold leading-tight">{title}</h2>
                {subtitle && <p className="text-gray-400 text-sm mt-0.5">{subtitle}</p>}
            </div>
            {onSeeAll && (
                <button
                    onClick={onSeeAll}
                    className="flex items-center gap-1 text-[#EE7A40] text-sm font-semibold hover:gap-2 transition-all duration-200"
                >
                    See all <ArrowRight size={14} />
                </button>
            )}
        </div>
    );
}

//  Page 

export default function FeedPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [providers, setProviders] = useState<ProviderCardData[]>([]);
    const [loading, setLoading] = useState(true);

    const firstName = user?.fullname?.split(" ")[0] || "there";

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    useEffect(() => {
        getAllProviders(1, 4)
            .then((res) => setProviders(res.data?.providers ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        /* ── Page background: warm white with a very subtle dot texture ── */
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "#faf9f7",
                backgroundImage: "radial-gradient(circle, #e5e0d8 1px, transparent 1px)",
                backgroundSize: "24px 24px",
            }}
        >
            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#EE7A40] via-[#e8702e] to-[#d45e1a] px-6 md:px-16 pt-12 pb-28">
                {/* Decorative blobs */}
                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
                <div className="absolute top-8 right-32 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 right-10 w-56 h-56 rounded-full bg-black/5" />
                <div className="absolute bottom-4 left-1/2 w-96 h-16 rounded-full bg-black/5 blur-2xl" />

                <div className="relative z-10 mb-8">
                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                        {getTimeGreeting()}
                    </span>
                    <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight drop-shadow-sm">
                        Welcome back,{" "}
                        <span className="text-white/90 underline decoration-white/30 underline-offset-4 decoration-2">
                            {firstName}
                        </span>
                    </h1>
                    <p className="text-white/75 mt-2 text-base font-normal">
                        Find trusted home services near you.
                    </p>
                </div>

                <div className="relative z-10 max-w-xl">
                    <div className="relative flex items-center bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden">
                        <LucideSearch className="absolute left-4 text-gray-400 shrink-0" size={18} />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for a service..."
                            className="pl-11 pr-28 h-14 bg-transparent border-0 text-gray-800 placeholder-gray-400 focus-visible:ring-0 text-sm font-medium"
                        />
                        <button className="absolute right-2 bg-[#EE7A40] hover:bg-[#d96a2e] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors duration-200">
                            Search
                        </button>
                    </div>
                    <button className="mt-4 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors duration-200">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            <MapPin size={13} className="text-white" />
                        </div>
                        Use My Location
                    </button>
                </div>
            </div>

            {/* ── Floating category strip — overlaps hero ───────────────────── */}
            <div className="px-6 md:px-16 -mt-10 relative z-10">
                <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <SectionHeader
                            title="Browse Categories"
                            subtitle="What do you need help with?"
                        />
                        <button
                            onClick={() => router.push("/providers")}
                            className="flex items-center gap-1 text-[#EE7A40] text-sm font-semibold hover:gap-2 transition-all duration-200 mb-5"
                        >
                            See all <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto scroll-smooth scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                                className={`
                                    flex flex-col items-center justify-center shrink-0
                                    min-w-[80px] h-[84px] gap-2 rounded-xl
                                    transition-all duration-200
                                    ${activeCategory === cat.name
                                        ? `${cat.color} ring-2 ${cat.ring} shadow-sm`
                                        : "bg-gray-50 hover:bg-gray-100"
                                    }
                                `}
                            >
                                <Image
                                    src={cat.icon}
                                    alt={cat.name}
                                    width={32}
                                    height={32}
                                    className={`object-contain transition-transform duration-200 ${activeCategory === cat.name ? "scale-110" : ""}`}
                                />
                                <span className={`text-[11px] font-semibold ${activeCategory === cat.name ? "text-[#EE7A40]" : "text-gray-600"}`}>
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Providers ─────────────────────────────────────────────────── */}
            <div className="px-6 md:px-16 pt-8 pb-16">
                <SectionHeader
                    title="Top Providers Near You"
                    subtitle="Verified professionals ready to help"
                    onSeeAll={() => router.push("/providers")}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <ProviderCardSkeleton key={i} />)
                        : providers.length === 0
                        ? <p className="col-span-4 text-center text-gray-400 text-sm py-10">No providers available yet.</p>
                        : providers.map((provider) => (
                            <ProviderCard
                                key={provider._id}
                                provider={provider}
                                onClick={(id) => router.push(`/providers/${id}`)}
                            />
                        ))
                    }
                </div>

                {/* ── CTA Banner ────────────────────────────────────────────── */}
                <div className="relative rounded-2xl overflow-hidden border border-orange-100 bg-orange-50/60 p-8 md:p-10">
                    <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-orange-100/60" />
                    <div className="absolute -bottom-8 right-32 w-24 h-24 rounded-full bg-orange-100/40" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-[#EE7A40] mb-3">
                                Available now
                            </span>
                            <h3 className="text-gray-900 font-bold text-xl md:text-2xl leading-snug">
                                Need something done today?
                            </h3>
                            <p className="text-gray-500 text-sm mt-2">
                                Browse verified professionals and book instantly.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/providers")}
                            className="shrink-0 group flex items-center gap-2 bg-[#EE7A40] hover:bg-[#e8622a] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:shadow-[0_6px_20px_rgba(238,122,64,0.5)] whitespace-nowrap"
                        >
                            Explore All Services
                            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}