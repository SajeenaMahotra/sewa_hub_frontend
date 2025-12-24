"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { LucideSearch } from "lucide-react";

const categories = [
  { name: "Cleaning", icon: "/icons/cleaning.svg" },
  { name: "Plumbing", icon: "/icons/plumbing.svg" },
  { name: "Electrician", icon: "/icons/electrician.svg" },
  { name: "Carpenter", icon: "/icons/carpenter.svg" },
  { name: "Gardening", icon: "/icons/gardening.svg" },
  { name: "AC Repair", icon: "/icons/ac.svg" },
  { name: "Painter", icon: "/icons/painter.svg" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#EE7A40] to-[#FFFFFF] px-6 md:px-20 py-10">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Your Trusted Home Services, Anytime.
          </h1>
          <p className=" mb-6 text-white">
            Connect with verified local professionals for fast, reliable home services.
          </p>
          <div className="relative w-full max-w-md">
            <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="What service are you looking for?"
              className="w-full pl-12 h-14 bg-white rounded-xl border border-black shadow-md focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-sm">
          <Image
            src="/images/auth-bg.jpg"
            alt="Home Services Worker"
            width={400}
            height={1000}
            
          />
          <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
            Certified
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Popular Services</h2>
        <ScrollArea className="w-full py-2">
          <div className="flex gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col items-center min-w-[100px] p-4 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
              >
                <Image src={cat.icon} alt={cat.name} width={40} height={40} />
                <span className="mt-2 text-sm font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
