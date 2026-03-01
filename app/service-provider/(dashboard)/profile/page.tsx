"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, LogOut, Loader2, User, Briefcase, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleUpdateProviderAuthInfo, handleGetProviderProfile } from "@/lib/actions/provider-actions";
import { toast } from "sonner";
import ProviderInfoSection from "../../_components/ProviderInfoSection";
import ProviderAccountSettings from "../../_components/ProviderAccountSettings";

// Tab config
const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "provider", label: "Provider Info", icon: Briefcase },
    { id: "account", label: "Account Settings", icon: Settings },
    { id: "logout", label: "Logout", icon: LogOut },
];

export default function ProviderProfilePage() {
    const { user, logout, setUser } = useAuth();

    const [activeTab, setActiveTab] = useState("profile");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [providerProfile, setProviderProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    // Sync user data into form
    useEffect(() => {
        if (user) {
            setFullName(user.fullname || "");
            setEmail(user.email || "");
            if (user.imageUrl && !imageFile) {
                const url = user.imageUrl.startsWith("http")
                    ? user.imageUrl
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050"}${user.imageUrl}`;
                setProfileImage(url);
            } else if (!user.imageUrl && !imageFile) {
                setProfileImage(null);
            }
        }
    }, [user]);

    // Fetch provider profile when that tab is opened
    useEffect(() => {
        if (activeTab === "provider" && !providerProfile) {
            setProfileLoading(true);
            handleGetProviderProfile()
                .then((res) => { if (res.success) setProviderProfile(res.data); })
                .finally(() => setProfileLoading(false));
        }
    }, [activeTab]);

    const getInitials = () => {
        if (!user?.fullname) return "U";
        const names = user.fullname.split(" ");
        return names.length > 1
            ? `${names[0][0]}${names[1][0]}`.toUpperCase()
            : names[0][0].toUpperCase();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDeletePicture = () => {
        setProfileImage(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };


    const handleSaveChanges = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("fullname", fullName);
            formData.append("email", email);
            if (imageFile) formData.append("image", imageFile);

            const result = await handleUpdateProviderAuthInfo(formData);
            if (result.success) {
                toast.success(result.message || "Profile updated!");

                // IMPORTANT: merge with prev user to preserve role in AuthContext
                if (result.data && setUser) {
                    setUser((prev: any) => ({
                        ...prev,
                        ...result.data,
                        role: prev?.role ?? result.data.role, // never overwrite role
                    }));
                }

                if (result.data?.imageUrl) {
                    const url = result.data.imageUrl.startsWith("http")
                        ? result.data.imageUrl
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050"}${result.data.imageUrl}`;
                    setProfileImage(url);
                }
                setImageFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    // Tab content
    const renderContent = () => {
        switch (activeTab) {

            case "logout":
                return (
                    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Sign out</h2>
                        <p className="text-sm text-gray-500 mb-8">You'll need to sign in again to access your account.</p>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-6 py-3 rounded-xl border border-red-200 transition-colors duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out of SewaHub
                        </button>
                    </div>
                );

            case "account":
                return <ProviderAccountSettings />;

            case "provider":
                return profileLoading ? (
                    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-12 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#EE7A40]" />
                    </div>
                ) : (
                    <ProviderInfoSection providerProfile={providerProfile} />
                );

            default: // profile
                return (
                    <div className="flex flex-col gap-5">

                        {/* Avatar card */}
                        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
                            <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                                <div className="relative shrink-0">
                                    <Avatar className="w-20 h-20 rounded-2xl ring-4 ring-orange-50">
                                        <AvatarImage src={profileImage || undefined} className="object-cover" />
                                        <AvatarFallback className="rounded-2xl bg-gradient-to-br from-[#EE7A40] to-[#f59e5a] text-white text-2xl font-bold">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-gray-900 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors duration-200"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-bold text-gray-900">{user?.fullname || "—"}</h3>
                                    <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-xs font-semibold text-[#EE7A40] hover:underline"
                                        >
                                            Change photo
                                        </button>
                                        {profileImage && (
                                            <>
                                                <span className="text-gray-200">·</span>
                                                <button
                                                    type="button"
                                                    onClick={handleDeletePicture}
                                                    className="text-xs font-semibold text-red-400 hover:underline flex items-center gap-1"
                                                >
                                                    <Trash2 className="w-3 h-3" /> Remove
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal info form card */}
                        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6">
                            <h2 className="text-base font-bold text-gray-900 mb-5">Personal Information</h2>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                        Full Name
                                    </Label>
                                    <Input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={isLoading}
                                        className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm"
                                    />
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                        Email Address
                                    </Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] hover:brightness-105 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:shadow-[0_6px_20px_rgba(238,122,64,0.5)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

            {/* Page title */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your account and provider preferences</p>
            </div>

            {/* Mobile dropdown */}
            <div className="lg:hidden mb-6">
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full h-12 bg-white rounded-xl border-gray-200">
                        <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                        {tabs.map((tab) => (
                            <SelectItem key={tab.id} value={tab.id} className={tab.id === "logout" ? "text-red-500" : ""}>
                                {tab.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Desktop layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-2 sticky top-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isLogout = tab.id === "logout";
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? "bg-orange-50 text-[#EE7A40] shadow-sm"
                                            : isLogout
                                                ? "text-red-400 hover:bg-red-50 hover:text-red-500"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {tab.label}
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EE7A40]" />}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Main content */}
                <main className="lg:col-span-3">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}