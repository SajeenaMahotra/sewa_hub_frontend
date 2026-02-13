"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import StatsCard from "@/app/service-provider/_components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  DollarSign,
  Star,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is a provider
    if (user && user.role !== "provider") {
      router.push("/dashboard");
    } else if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Bookings",
      value: "8",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Earnings",
      value: "NPR 45,000",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Rating",
      value: "4.8",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Growth",
      value: "+12%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      service: "House Cleaning",
      customer: "John Doe",
      date: "Feb 15, 2026",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      service: "Plumbing Repair",
      customer: "Jane Smith",
      date: "Feb 16, 2026",
      time: "2:00 PM",
      status: "Pending",
    },
    {
      id: 3,
      service: "Electrical Work",
      customer: "Bob Johnson",
      date: "Feb 17, 2026",
      time: "11:30 AM",
      status: "Confirmed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#EE7A40]" />
            Recent Bookings
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                    <Briefcase className="h-6 w-6 text-[#EE7A40]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {booking.service}
                    </h4>
                    <p className="text-sm text-gray-600">{booking.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {booking.date} • {booking.time}
                  </div>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Completed Jobs</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours Worked</span>
                <span className="font-semibold">36 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Earnings</span>
                <span className="font-semibold text-green-600">NPR 18,500</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-semibold">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-semibold text-yellow-600">4.8/5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}