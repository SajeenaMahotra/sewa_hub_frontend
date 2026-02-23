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
      <div className="bg-gradient-to-b from-[#EE7A40] to-[#F8F5F2] px-6 md:px-16 pt-12 pb-20 relative">
        <div className="relative z-10 mb-8">
          <p className="text-white text-sm font-medium tracking-widest uppercase mb-1">
            {getTimeGreeting()} !
          </p>
          <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">
            Welcome back, <span className="text-white">{firstName}</span>
          </h1>
          <p className="text-white mt-2 text-base">
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
              className="pl-12 h-14 bg-white rounded-2xl text-gray-800 placeholder-gray-400 shadow-xl focus-visible:ring-2 focus-visible:ring-white/50 text-sm font-medium"
            />
          </div>

          <Button
            variant="ghost"
            className="mt-2 text-white/90 hover:text-white hover:bg-white/10 px-0 gap-2 text-sm font-medium"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
            Use My Location
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-16 -mt-8 relative z-10 pb-16">

        {/* Categories Card */}
        <Card className="mb-8 rounded-3xl shadow-lg border-0">
          <CardContent className="px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 text-lg font-bold">Browse Services</h2>
              <Button
                variant="ghost"
                className="text-[#EE7A40] hover:text-orange-600 hover:bg-orange-50 text-sm font-semibold px-2 gap-1"
              >
                See all <ChevronRight size={16} />
              </Button>
            </div>

            <div className="relative">
              <div
                id="cat-scroll"
                className="flex items-center gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-1"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() =>
                      setActiveCategory(activeCategory === cat.name ? null : cat.name)
                    }
                    className="flex flex-col items-center min-w-[72px] gap-2 group"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                        activeCategory === cat.name
                          ? "bg-[#EE7A40] shadow-md shadow-orange-200"
                          : "bg-orange-50 group-hover:bg-orange-100"
                      }`}
                    >
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        width={30}
                        height={30}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold text-center leading-tight ${
                        activeCategory === cat.name ? "text-[#EE7A40]" : "text-gray-600"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const el = document.getElementById("cat-scroll");
                  el?.scrollBy({ left: 200, behavior: "smooth" });
                }}
                className="absolute right-[-12px] top-5 bg-[#EE7A40] hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg text-xs transition-colors"
              >
                ❯
              </button>
            </div>
          </CardContent>
        </Card>

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