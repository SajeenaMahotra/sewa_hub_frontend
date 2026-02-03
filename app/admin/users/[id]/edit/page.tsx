"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import CreateUserForm from "../../_components/CreateUserForm";
import { handleGetUserById } from "../../../../../lib/actions/admin/user-actions";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;

  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await handleGetUserById(userId);
        if (response.success) {
          setUserData(response.data);
        } else {
          setError(response.message || "Failed to fetch user");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-[#EE7A40]" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
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
