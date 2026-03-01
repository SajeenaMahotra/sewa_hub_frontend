"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { handleUpdateProviderProfile, handleGetServiceCategories } from "@/lib/actions/provider-actions";
import { toast } from "sonner";

interface ProviderInfoSectionProps {
    providerProfile: any;
}

export default function ProviderInfoSection({ providerProfile }: ProviderInfoSectionProps) {
    const [bio,             setBio]             = useState(providerProfile?.bio || "");
    const [phone,           setPhone]           = useState(providerProfile?.phone || "");
    const [address,         setAddress]         = useState(providerProfile?.address || "");
    const [experienceYears, setExperienceYears] = useState(String(providerProfile?.experience_years ?? ""));
    const [pricePerHour,    setPricePerHour]    = useState(String(providerProfile?.price_per_hour ?? ""));
    const [categoryId,      setCategoryId]      = useState(
        providerProfile?.ServiceCategorycatgeory_id?._id ||
        providerProfile?.ServiceCategorycatgeory_id ||
        ""
    );
    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
    const [isLoading,  setIsLoading]  = useState(false);

    useEffect(() => {
        handleGetServiceCategories().then((res) => {
            if (res.success && res.data) {
                setCategories(res.data.map((c: any) => ({ label: c.category_name, value: c._id })));
            }
        });
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const fd = new FormData();
            fd.append("bio",              bio);
            fd.append("phone",            phone);
            fd.append("address",          address);
            fd.append("experience_years", experienceYears);
            fd.append("price_per_hour",   pricePerHour);
            if (categoryId) fd.append("serviceCategoryId", categoryId);

            const res = await handleUpdateProviderProfile(fd);
            if (res.success) {
                toast.success("Provider info updated!");
            } else {
                toast.error(res.message || "Failed to update");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a]" />
            <div className="p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">Provider Information</h2>

                <div className="flex flex-col gap-4">
                    {/* Row 1 — Phone + Experience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                Phone Number
                            </Label>
                            <Input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={isLoading}
                                placeholder="+977 98XXXXXXXX"
                                className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm"
                            />
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                Experience (Years)
                            </Label>
                            <Input
                                type="number"
                                value={experienceYears}
                                onChange={(e) => setExperienceYears(e.target.value)}
                                disabled={isLoading}
                                placeholder="e.g. 3"
                                min={0}
                                max={50}
                                className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm"
                            />
                        </div>
                    </div>

                    {/* Row 2 — Price + Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                Price Per Hour (NPR)
                            </Label>
                            <Input
                                type="number"
                                value={pricePerHour}
                                onChange={(e) => setPricePerHour(e.target.value)}
                                disabled={isLoading}
                                placeholder="e.g. 500"
                                min={0}
                                className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm"
                            />
                        </div>
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                                Service Category
                            </Label>
                            <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoading}>
                                <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                            Address
                        </Label>
                        <Input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={isLoading}
                            placeholder="Your service area / address"
                            className="h-11 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                            Bio
                        </Label>
                        <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={isLoading}
                            placeholder="Tell customers about your experience and services..."
                            rows={4}
                            className="rounded-xl border-gray-200 focus:ring-2 focus:ring-[#EE7A40]/30 focus:border-[#EE7A40] text-sm resize-none"
                        />
                    </div>

                    {/* Save */}
                    <div className="pt-2">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#EE7A40] to-[#f59e5a] hover:brightness-105 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-[0_4px_14px_rgba(238,122,64,0.35)] hover:shadow-[0_6px_20px_rgba(238,122,64,0.5)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Provider Info"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}