"use client";

import { motion } from "framer-motion";
import { FaUsers, FaClock, FaTools, FaCalendarCheck, FaDollarSign, FaHeadset } from "react-icons/fa";

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

export default function AboutUs() {
  return (
    <div  id="about" className="bg-[#fdf9f4] min-h-screen flex flex-col items-center py-24 px-8">
      {/* Intro */}
      <motion.p
        className="text-center mb-16 text-xl md:text-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        At SewaHub, we make life a little easier!
      </motion.p>

      {/* Features Grid */}
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
  );
}
