// app/admin/users/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user data from API
    // const fetchUser = async () => {
    //   try {
    //     const response = await fetch(`/api/admin/users/${userId}`);
    //     const data = await response.json();
    //     setUser(data);
    //   } catch (error) {
    //     console.error("Error fetching user:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchUser();

    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [userId]);

  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete user:", userId);
  };

  const getInitials = (name: string) => {
    const names = name?.split(" ") || [];
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0]?.[0]?.toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#EE7A40]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Link>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">User not found</h3>
            <p className="text-sm text-gray-500 mb-4">
              The user you're looking for doesn't exist
            </p>
            <Button
              onClick={() => router.push("/admin/users")}
              className="bg-[#EE7A40] hover:bg-[#d66a35]"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/users"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Users
      </Link>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-500 mt-1">View user information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleEdit} className="bg-[#EE7A40] hover:bg-[#d66a35]">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleDelete} variant="outline" className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="text-2xl bg-[#EE7A40] text-white">
                {getInitials(user?.fullname)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.fullname}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={user?.role === "provider" ? "default" : "secondary"}
                    className={
                      user?.role === "provider"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {user?.role}
                  </Badge>
                  <Badge
                    variant={user?.isActive ? "default" : "secondary"}
                    className={
                      user?.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {user?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Mail className="h-5 w-5 text-[#EE7A40]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Phone className="h-5 w-5 text-[#EE7A40]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#EE7A40]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{user?.location || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#EE7A40]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium text-gray-900">{userId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#EE7A40]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium text-gray-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#EE7A40]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}