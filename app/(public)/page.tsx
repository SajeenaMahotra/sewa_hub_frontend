"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { LucideSearch } from "lucide-react";
import { motion } from "framer-motion";
import { FaUsers, FaClock, FaTools, FaCalendarCheck, FaDollarSign, FaHeadset } from "react-icons/fa";
import Link from "next/link";

const categories = [
  { name: "Cleaning", icon: "/icons/cleaning.png" },
  { name: "Plumbing", icon: "/icons/plumbing.png" },
  { name: "Electrician", icon: "/icons/electrician.png" },
  { name: "Carpenter", icon: "/icons/carpenter.png" },
  { name: "AC Repair", icon: "/icons/repair.png" },
  { name: "Painter", icon: "/icons/painter.png" },
];

const features = [
  {
    icon: <FaUsers className="text-2xl mb-2 mx-auto" style={{ color: "#EE7A40" }} />,
    title: "Trusted Professionals",
    description: "Connect with verified local experts ready to help you."
  },
  {
    icon: <FaClock className="text-2xl mb-2 mx-auto" style={{ color: "#EE7A40" }} />,
    title: "Fast & Reliable",
    description: "Get tasks done quickly and stress-free."
  },
  {
    icon: <FaTools className="text-2xl mb-2 mx-auto" style={{ color: "#EE7A40" }} />,
    title: "Wide Range of Services",
    description: "From repairs to personal assistance, we've got you covered."
  },
  {
    icon: <FaCalendarCheck className="text-2xl mb-2 mx-auto" style={{ color: "#EE7A40" }} />,
    title: "Easy Booking",
    description: "Schedule services simply and conveniently."
  },
  {
    icon: <FaDollarSign className="text-2xl mb-2 mx-auto" style={{ color: "#EE7A40" }} />,
    title: "Transparent Pricing",
    description: "Know the cost before you book any service."
  },
  {
    icon: <FaHeadset className="text-2xl mb-2 mx-auto" style={{ color: "#EE7A40" }} />,
    title: "Customer Support",
    description: "24/7 assistance to ensure your peace of mind."
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen w-full bg-gradient-to-b from-[#EE7A40] to-[#FFFFFF] px-6 md:px-20 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-20">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Your Trusted Home <br />Services, Anytime.
            </h1>
            <p className="mb-6 text-white">
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
        </div>

        {/* Categories Section */}
        <div className="mt-14">
          <div className="relative">
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

      {/* About Section */}
      <div id="about" className="bg-[#ffffff] min-h-screen flex flex-col items-center py-24 px-8">
        <motion.p
          className="text-center mb-16 text-xl md:text-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          At SewaHub, we make life a little easier!
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {feature.icon}
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gradient-to-b from-white to-gray-50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Book trusted home services in just a few simple steps
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Choose Service",
                description: "Browse our categories and select the service you need",
                icon: "🔍"
              },
              {
                step: "2",
                title: "Pick a Pro",
                description: "View verified professionals with ratings and reviews",
                icon: "👤"
              },
              {
                step: "3",
                title: "Schedule",
                description: "Book a time that works best for you",
                icon: "📅"
              },
              {
                step: "4",
                title: "Get It Done",
                description: "Relax while our expert gets the job done right",
                icon: "✅"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-6 relative inline-block">
                  <div className="w-20 h-20 mx-auto bg-[#EE7A40] rounded-full flex items-center justify-center text-4xl">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-[#EE7A40] rounded-full flex items-center justify-center font-bold text-[#EE7A40]">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>

                {/* Connector Arrow (hidden on last item and mobile) */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 -right-4 text-[#EE7A40] text-2xl">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#EE7A40] hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}