// app/admin/users/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import CreateUserForm from "../../_components/CreateUserForm";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user data from API
    // const fetchUser = async () => {
    //   try {
    //     const response = await fetch(`/api/admin/users/${userId}`);
    //     const data = await response.json();
    //     setUserData(data);
    //   } catch (error) {
    //     console.error("Error fetching user:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchUser();

    // Simulating API call
    setTimeout(() => {
      // Replace with actual user data from API
      setUserData({
        id: userId,
        fullname: "",
        email: "",
        role: "customer",
        location: "",
        phone: "",
        imageUrl: "",
      });
      setIsLoading(false);
    }, 500);
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#EE7A40]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href={`/admin/users/${userId}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to User Details
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        <p className="text-gray-500 mt-1">Update user information</p>
      </div>

      {/* Form */}
      <CreateUserForm initialData={userData} isEdit={true} />
    </div>
  );
}