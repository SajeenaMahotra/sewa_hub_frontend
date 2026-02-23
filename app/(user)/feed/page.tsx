"use client";

import { useState } from "react";
import Image from "next/image";
import { LucideSearch, MapPin, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const categories = [
    { name: "Cleaning", icon: "/icons/cleaning.png" },
    { name: "Plumbing", icon: "/icons/plumbing.png" },
    { name: "Electrician", icon: "/icons/electrician.png" },
    { name: "Carpenter", icon: "/icons/carpenter.png" },
    { name: "AC Repair", icon: "/icons/repair.png" },
    { name: "Painter", icon: "/icons/painter.png" },
    { name: "Gardening", icon: "/icons/gardening.png" },
    { name: "Laundry", icon: "/icons/laundry.png" },
];

const featuredProviders = [
    {
        id: 1,
        name: "Rajesh Sharma",
        service: "Electrician",
        rating: 4.9,
        reviews: 128,
        location: "Kathmandu",
        avatar: "/avatars/provider1.png",
        badge: "Top Rated",
    },
    {
        id: 2,
        name: "Sunita Thapa",
        service: "Cleaning",
        rating: 4.8,
        reviews: 95,
        location: "Lalitpur",
        avatar: "/avatars/provider2.png",
        badge: "Verified",
    },
    {
        id: 3,
        name: "Bikash Karki",
        service: "Plumbing",
        rating: 4.7,
        reviews: 74,
        location: "Bhaktapur",
        avatar: "/avatars/provider3.png",
        badge: "Top Rated",
    },
    {
        id: 4,
        name: "Anita Rai",
        service: "Painter",
        rating: 4.9,
        reviews: 110,
        location: "Kathmandu",
        avatar: "/avatars/provider4.png",
        badge: "New",
    },
];

export default function FeedPage() {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const firstName = user?.fullname?.split(" ")[0] || "there";

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const getBadgeClasses = (badge: string) => {
        if (badge === "Top Rated") return "bg-orange-50 text-[#EE7A40] border-orange-200";
        if (badge === "Verified") return "bg-green-50 text-green-600 border-green-200";
        return "bg-blue-50 text-blue-600 border-blue-200";
    };

    return (
        <div className="min-h-screen bg-[#F8F5F2]">

            {/* Hero Section */}
            <div className="bg-[#EE7A40] px-6 md:px-16 pt-12 pb-20 relative">
                <div className="relative z-10 mb-8">
                    <p className="text-orange-100 text-sm font-medium tracking-widest uppercase mb-1">
                        {getTimeGreeting()}
                    </p>
                    <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">
                        Welcome back, <span className="text-orange-100">{firstName}</span>
                    </h1>
                    <p className="text-orange-100 mt-2 text-base">
                        Find trusted home services near you.
                    </p>
                </div>

                {/* Search */}
                <div className="relative z-10 max-w-2xl">
                    <div className="relative">
                        <LucideSearch
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                            size={20}
                        />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for a service..."
                            className="pl-12 h-14 bg-white rounded-2xl text-gray-800 placeholder-gray-400 shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-white/50 text-sm font-medium"
                        />
                    </div>

                    <button className="mt-4 flex items-center gap-2 text-white/90 text-sm font-medium hover:scale-105 transition-transform duration-200">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            <MapPin size={14} className="text-white" />
                        </div>
                        Use My Location
                    </button>
                </div>
            </div>

            {/* Browse Categories  */}
            <div className="px-6 md:px-16 pt-8 pb-4 bg-[#F8F5F2]">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-gray-900 text-lg font-bold">Browse Categories</h2>
                    <Button
                        variant="ghost"
                        className="text-[#EE7A40] hover:text-orange-600 hover:bg-orange-50 text-sm font-semibold px-2 gap-1"
                    >
                        See all <ChevronRight size={16} />
                    </Button>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto scroll-smooth scrollbar-hide pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() =>
                                setActiveCategory(activeCategory === cat.name ? null : cat.name)
                            }
                            className={`flex flex-col items-center justify-center min-w-[100px] h-[100px] gap-2 rounded-2xl bg-white shadow-sm transition-all duration-200 hover:shadow-md ${activeCategory === cat.name
                                ? "ring-2 ring-[#EE7A40]"
                                : ""
                                }`}
                        >
                            <Image
                                src={cat.icon}
                                alt={cat.name}
                                width={38}
                                height={38}
                                className="object-contain transition-transform duration-200 hover:scale-110"
                            />
                            <span className={`text-xs font-semibold ${activeCategory === cat.name ? "text-[#EE7A40]" : "text-gray-700"}`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 md:px-16 pb-16">

                {/* Top Providers */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-gray-900 text-lg font-bold">Top Providers Near You</h2>
                        <Button
                            variant="ghost"
                            className="text-[#EE7A40] hover:text-orange-600 hover:bg-orange-50 text-sm font-semibold px-2 gap-1"
                        >
                            View all <ChevronRight size={16} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {featuredProviders.map((provider) => (
                            <Card
                                key={provider.id}
                                className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <CardContent className="p-5">
                                    {/* Top row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge
                                            variant="outline"
                                            className={`text-xs font-bold rounded-full ${getBadgeClasses(provider.badge)}`}
                                        >
                                            {provider.badge}
                                        </Badge>
                                        <div className="flex items-center gap-1">
                                            <span className="text-amber-400 text-sm">★</span>
                                            <span className="text-xs font-bold text-gray-700">
                                                {provider.rating}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Avatar + Info */}
                                    <div className="flex flex-col items-center text-center">
                                        <Avatar className="w-14 h-14 rounded-2xl mb-3 group-hover:scale-105 transition-transform">
                                            <AvatarImage src={provider.avatar} className="object-cover" />
                                            <AvatarFallback className="rounded-2xl bg-orange-100 text-[#EE7A40] font-bold text-lg">
                                                {provider.name[0]}
                                            </AvatarFallback>
                                        </Avatar>

                                        <h3 className="font-bold text-gray-900 text-sm">{provider.name}</h3>
                                        <p className="text-[#EE7A40] text-xs font-semibold mt-0.5">
                                            {provider.service}
                                        </p>

                                        <Separator className="my-3" />

                                        <div className="flex items-center gap-1 text-gray-400">
                                            <MapPin size={11} />
                                            <span className="text-xs">{provider.location}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">{provider.reviews} reviews</p>
                                    </div>

                                    {/* Book Button */}
                                    <Button
                                        variant="outline"
                                        className="mt-4 w-full h-9 bg-orange-50 hover:bg-[#EE7A40] text-[#EE7A40] hover:text-white text-xs font-bold rounded-xl border-0 transition-all duration-200"
                                    >
                                        Book Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <Card className="rounded-3xl border-0 overflow-hidden shadow-md">
                    <CardContent className="p-0">
                        <div className="bg-gradient-to-r from-[#EE7A40] to-[#e8622a] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-white font-bold text-lg">Need something done today?</h3>
                                <p className="text-orange-100 text-sm mt-1">
                                    Browse all available providers and book instantly.
                                </p>
                            </div>
                            <Button className="bg-white text-[#EE7A40] hover:bg-orange-50 font-bold text-sm px-6 rounded-xl shadow-md whitespace-nowrap">
                                Explore All Services
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}