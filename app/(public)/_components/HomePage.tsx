"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { LucideSearch } from "lucide-react";

const categories = [
  { name: "Cleaning", icon: "/icons/cleaning.png" },
  { name: "Plumbing", icon: "/icons/plumbing.png" },
  { name: "Electrician", icon: "/icons/electrician.png" },
  { name: "Carpenter", icon: "/icons/carpenter.png" },
  { name: "AC Repair", icon: "/icons/repair.png" },
  { name: "Painter", icon: "/icons/painter.png" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#EE7A40] to-[#FFFFFF] px-6 md:px-20 py-10">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-20">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Your Trusted Home <br />Services, Anytime.
          </h1>
          <p className=" mb-6 text-white">
            Connect with verified local professionals for fast, reliable home services.
          </p>
          <div className="relative w-full max-w-xl">
            <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={30} />
            <Input
              placeholder="What service are you looking for?"
              className="w-full pl-12 h-14 bg-white rounded-xl border border-black shadow-md focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
        {/* <div className="flex-1 relative w-full max-w-sm">
          <Image
            src="/images/auth-bg.jpg"
            alt="Home Services Worker"
            width={400}
            height={1000}

          />
          <div className="absolute top-4 right-4 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
            Certified
          </div>
        </div> */}
      </div>

      {/* Categories Section */}
      <div className="mt-14">
    
        <div className="relative">
          {/* Scroll container */}
          <div
            id="services-scroll"
            className="flex items-center gap-10 overflow-x-auto scroll-smooth px-8 py-6 bg-white rounded-2xl shadow-md scrollbar-hide"
          >
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col items-center min-w-[90px] cursor-pointer group"
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={40}
                    height={40}
                    className="group-hover:scale-110 transition"
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-800">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => {
              const el = document.getElementById("services-scroll");
              el?.scrollBy({ left: 200, behavior: "smooth" });
            }}
            className="absolute right-[-18px] top-1/2 -translate-y-1/2 bg-[#EE7A40] hover:bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          >
            ❯
          </button>
        </div>
      </div>

    </div>
  );
}
