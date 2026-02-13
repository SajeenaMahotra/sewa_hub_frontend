"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

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

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Service Provider Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Hello, {user?.fullname || "Provider"}!
        </p>
      </div>
    </div>
  );
}