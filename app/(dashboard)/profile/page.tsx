"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Trash2, LogOut, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleUpdateProfile } from "@/lib/actions/auth-actions";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout, refreshUser, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      const names = user.fullname?.split(" ") || [];
      setFullName(user.fullname || "");
      setEmail(user.email || "");
      setLocation(user.location || "");

      // Set profile image if exists - using imageUrl from backend
      if (user.imageUrl && !imageFile) {
        // Backend returns path like "/uploads/filename.jpg"
        const imageUrl = user.imageUrl.startsWith('http')
          ? user.imageUrl
          : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050'}${user.imageUrl}`;
        setProfileImage(imageUrl);
      } else if (!user.imageUrl && !imageFile) {
        // Clear image if user no longer has imageUrl and no new file selected
        setProfileImage(null);
      }
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePicture = () => {
    setProfileImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);

      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Append text fields
      formData.append("fullname", fullName);
      formData.append("email", email);
      formData.append("location", location);

      // Append image if new one is selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Call the server action
      const result = await handleUpdateProfile(formData);

      if (result.success) {
        toast.success(result.message || "Profile updated successfully!");

        // Update auth context immediately with returned user data (if available)
        if (result.data && setUser) {
          setUser(result.data);
        }

        // If backend returned an image path, set it explicitly so the UI shows it
        if (result.data?.imageUrl) {
          const imageUrl = result.data.imageUrl.startsWith("http")
            ? result.data.imageUrl
            : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050'}${result.data.imageUrl}`;
          setProfileImage(imageUrl);
        }

        // Clear the file input and state
        setImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Optionally refresh user data from context (keeps server/cookie in sync)
        if (refreshUser) {
          await refreshUser();
        }
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (!user?.fullname) return "U";
    const names = user.fullname.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "account-settings", label: "Account settings" },
    { id: "notifications", label: "Notifications" },
    { id: "logout", label: "Logout" },
  ];

  const renderContent = () => {
    if (activeTab === "logout") {
      return (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Logout
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Are you sure you want to logout from your account?
            </p>
            <Button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            Profile
          </h2>

          {/* Profile Picture Section with Camera Icon Overlay */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                <AvatarImage src={profileImage || undefined} />
                <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              {/* Camera Icon Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-[#1e293b] hover:bg-[#334155] text-white rounded-full p-2.5 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleDeletePicture}
                disabled={!profileImage}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete picture
              </Button>
              <p className="text-xs text-gray-500 text-center sm:text-left">
                JPG or PNG  (max. 5MB)
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-sm font-medium">
                  Fullname
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 sm:h-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 sm:h-12"
                disabled={isLoading}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Kathmandu, Nepal"
                className="h-11 sm:h-12"
                disabled={isLoading}
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 sm:pt-4">
              <Button
                onClick={handleSaveChanges}
                disabled={isLoading}
                className="bg-[#EE7A40] hover:bg-[#d66a35] text-white px-8 w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdf9f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-12">
          Settings
        </h1>

        {/* Mobile Dropdown */}
        <div className="lg:hidden mb-6">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full h-12 bg-white">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              {tabs.map((tab) => (
                <SelectItem
                  key={tab.id}
                  value={tab.id}
                  className={tab.id === "logout" ? "text-red-500" : ""}
                >
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Hidden on Mobile */}
          <aside className="hidden lg:block lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:bg-white hover:text-gray-900"
                    } ${tab.id === "logout" ? "text-red-500 hover:text-red-600" : ""
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}