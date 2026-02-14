"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaMoneyBillWave, FaCalendarAlt, FaUserShield, FaChartLine, FaMobileAlt, FaHandshake } from "react-icons/fa";
import Image from "next/image";

const benefits = [
  {
    icon: <FaMoneyBillWave className="text-3xl" style={{ color: "#EE7A40" }} />,
    title: "Earn More",
    description: "Set your own rates and get paid directly for your skills"
  },
  {
    icon: <FaCalendarAlt className="text-3xl" style={{ color: "#EE7A40" }} />,
    title: "Flexible Schedule",
    description: "Work when you want, choose jobs that fit your schedule"
  },
  {
    icon: <FaUserShield className="text-3xl" style={{ color: "#EE7A40" }} />,
    title: "Verified Clients",
    description: "Connect with trusted customers in your area"
  },
  {
    icon: <FaChartLine className="text-3xl" style={{ color: "#EE7A40" }} />,
    title: "Grow Your Business",
    description: "Build your reputation with ratings and reviews"
  },
  {
    icon: <FaMobileAlt className="text-3xl" style={{ color: "#EE7A40" }} />,
    title: "Easy to Use",
    description: "Simple app to manage bookings and payments"
  },
  {
    icon: <FaHandshake className="text-3xl" style={{ color: "#EE7A40" }} />,
    title: "Support Team",
    description: "24/7 assistance whenever you need help"
  }
];

const steps = [
  {
    number: "1",
    title: "Sign Up",
    description: "Create your provider profile in minutes"
  },
  {
    number: "2",
    title: "Get Verified",
    description: "Complete our simple verification process"
  },
  {
    number: "3",
    title: "Start Working",
    description: "Accept jobs and start earning right away"
  }
];

export default function ProvidersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#EE7A40] to-[#d66a35] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join SewaHub as a Service Provider
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Turn your skills into income. Connect with customers who need your services.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/register?type=provider"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#EE7A40] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Become a Provider
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Join SewaHub?
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need to succeed as an independent service provider
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How to Get Started
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="mb-6 relative inline-block">
                  <div className="w-24 h-24 mx-auto bg-[#EE7A40] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {/* Arrow connector */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-6 text-[#EE7A40] text-4xl">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#EE7A40] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Start Earning?
          </motion.h2>
          <motion.p
            className="text-lg mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of service providers already growing their business with SewaHub
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/register?type=provider"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#EE7A40] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Sign Up as Provider
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}