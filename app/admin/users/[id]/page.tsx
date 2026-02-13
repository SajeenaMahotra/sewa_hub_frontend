"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { handleGetUserById, handleDeleteUser } from "@/lib/actions/admin/user-actions";
import { toast } from "sonner";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await handleGetUserById(userId);
      
      if (response.success) {
        setUser(response.data);
      } else {
        toast.error(response.message || "Failed to fetch user");
        setUser(null);
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      toast.error(error.message || "Failed to fetch user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDeleteConfirmed = async () => {
    try {
      setIsDeleting(true);
      const response = await handleDeleteUser(userId);
      
      if (response.success) {
        toast.success(response.message || "User deleted successfully");
        router.push("/admin/users");
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  const getUserImage = (imageUrl: string) => {
    if (!imageUrl) return undefined;
    return imageUrl.startsWith('http')
      ? imageUrl
      : `${API_BASE_URL}${imageUrl}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "N/A";
    }
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
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
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
              <AvatarImage src={getUserImage(user?.imageUrl)} />
              <AvatarFallback className="text-2xl bg-[#EE7A40] text-white">
                {getInitials(user?.fullname)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.fullname}</h2>
                  <p className="text-gray-500 mt-1">{user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={user?.role === "admin" ? "default" : "secondary"}
                    className={
                      user?.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {user.role}
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
                <p className="font-medium text-gray-900 text-xs break-all">{user?._id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#EE7A40]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium text-gray-900">
                  {formatDate(user?.createdAt)}
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
                  {formatDate(user?.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              <span className="font-semibold"> {user?.fullname}</span> and remove all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmed}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}