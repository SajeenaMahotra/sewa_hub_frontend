// app/(dashboard)/profile/page.tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Trash2, LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Split fullname into first and last name
  const getFirstName = () => user?.fullname?.split(" ")[0] || "";
  const getLastName = () => user?.fullname?.split(" ").slice(1).join(" ") || "";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePicture = () => {
    setProfileImage(null);
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
      <Card className="border-0 shadow-sm ">
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            Profile
          </h2>

          {/* Profile Picture Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
              <AvatarImage src={profileImage || undefined} />
              <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <label htmlFor="picture-upload">
                <Button
                  type="button"
                  className="bg-[#1e293b] hover:bg-[#334155] text-white w-full sm:w-auto"
                  onClick={() =>
                    document.getElementById("picture-upload")?.click()
                  }
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Change picture
                </Button>
              </label>
              <input
                id="picture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              <Button
                variant="outline"
                onClick={handleDeletePicture}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete picture
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 sm:space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  defaultValue={getFirstName()}
                  className="h-11 sm:h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  defaultValue={getLastName()}
                  className="h-11 sm:h-12"
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
                defaultValue={user?.email || ""}
                className="h-11 sm:h-12"
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
                placeholder="Kathmandu, Nepal"
                className="h-11 sm:h-12"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 sm:pt-4">
              <Button className="bg-[#EE7A40] hover:bg-[#d66a35] text-white px-8 w-full sm:w-auto">
                Save Changes
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
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:bg-white hover:text-gray-900"
                  } ${tab.id === "logout" ? "text-red-500 hover:text-red-600" : ""}`}
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

