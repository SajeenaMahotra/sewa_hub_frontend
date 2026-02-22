"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/context/authContext";
import { setupProviderProfile, getServiceCategories } from "@/lib/api/provider";
import { setupProfileSchema, SetupProfileData } from "./schema"; 

// Types
interface ServiceCategory {
    catgeory_id: number;
    category_name: string;
}

const STEPS = ["Personal Info", "Service Details", "Review & Submit"];

export default function SetupProviderProfile() {
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [step, setStep] = useState(0);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<SetupProfileData>({
        resolver: zodResolver(setupProfileSchema),
        mode: "onChange",
    });

    const watchedValues = watch();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else if (user.role !== "provider") {
                router.push("/dashboard");
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        getServiceCategories()
            .then((res) => setCategories(res.data || []))
            .catch(() => {
                setCategories([
                    { catgeory_id: 1, category_name: "Electrician" },
                    { catgeory_id: 2, category_name: "Plumber" },
                    { catgeory_id: 3, category_name: "Carpenter" },
                    { catgeory_id: 4, category_name: "Painter" },
                    { catgeory_id: 5, category_name: "Cleaner" },
                    { catgeory_id: 6, category_name: "AC Technician" },
                ]);
            });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB");
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const stepFields: (keyof SetupProfileData)[][] = [
        ["phone", "address"],
        ["bio", "experience_years", "serviceCategoryId"],
        [],
    ];

    const nextStep = async () => {
        const valid = await trigger(stepFields[step]);
        if (valid) setStep((s) => s + 1);
    };

    const prevStep = () => setStep((s) => s - 1);

    const onSubmit = (values: SetupProfileData) => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("phone", values.phone);
                formData.append("address", values.address);
                formData.append("bio", values.bio);
                formData.append("experience_years", String(values.experience_years));
                formData.append("serviceCategoryId", values.serviceCategoryId);
                if (imageFile) formData.append("image", imageFile);

                await setupProviderProfile(formData);

                toast.success("Profile set up successfully! Welcome to SewaHub 🎉");
                await refreshUser?.();

                setTimeout(() => router.push("/service-provider/dashboard"), 1000);
            } catch (err: any) {
                toast.error(err.message || "Failed to set up profile");
            }
        });
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                <div className="text-center mb-8">
                    <Image
                        src="/sewahublogo.png"
                        alt="SewaHub"
                        width={80}
                        height={80}
                        className="mx-auto mb-3"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">
                        Complete Your Provider Profile
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Help customers find and trust you
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8 gap-2">
                    {STEPS.map((label, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${i < step
                                            ? "bg-[#EE7A40] text-white"
                                            : i === step
                                                ? "bg-[#EE7A40] text-white ring-4 ring-orange-100"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {i < step ? "✓" : i + 1}
                                </div>
                                <span
                                    className={`text-xs hidden sm:block ${i === step ? "text-[#EE7A40] font-medium" : "text-gray-400"
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`h-0.5 w-12 sm:w-20 mb-4 transition-colors ${i < step ? "bg-[#EE7A40]" : "bg-gray-200"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <Card className="shadow-lg border-0">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {step === 0 && (
                                <div className="space-y-5">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Personal Information
                                    </h2>
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-24 h-24 rounded-full border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer overflow-hidden bg-orange-50 hover:border-[#EE7A40] transition-colors"
                                        >
                                            {imagePreview ? (
                                                <Image
                                                    src={imagePreview}
                                                    alt="Profile preview"
                                                    width={96}
                                                    height={96}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="text-center p-2">
                                                    <div className="text-2xl">📷</div>
                                                    <p className="text-xs text-gray-400 mt-1">Add Photo</p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                        <p className="text-xs text-gray-400">Optional · Max 5MB</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" placeholder="98XXXXXXXX" {...register("phone")} />
                                        {errors.phone && (
                                            <p className="text-xs text-red-500">{errors.phone.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="address">Address / Location</Label>
                                        <Input id="address" placeholder="Kathmandu, Baneshwor" {...register("address")} />
                                        {errors.address && (
                                            <p className="text-xs text-red-500">{errors.address.message}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-5">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Service Details
                                    </h2>

                                    <div className="space-y-1">
                                        <Label>Service Category</Label>
                                        <Select
                                            onValueChange={(val) => setValue("serviceCategoryId", val)}
                                            defaultValue={watchedValues.serviceCategoryId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your specialty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.catgeory_id} value={String(cat.catgeory_id)}>
                                                        {cat.category_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.serviceCategoryId && (
                                            <p className="text-xs text-red-500">{errors.serviceCategoryId.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="experience_years">Years of Experience</Label>
                                        <Input
                                            id="experience_years"
                                            type="number"
                                            min={0}
                                            max={50}
                                            placeholder="e.g. 3"
                                            {...register("experience_years", { valueAsNumber: true })}
                                        />
                                        {errors.experience_years && (
                                            <p className="text-xs text-red-500">{errors.experience_years.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <Textarea
                                            id="bio"
                                            rows={4}
                                            placeholder="Describe your skills, expertise and what makes you reliable..."
                                            {...register("bio")}
                                            className="resize-none"
                                        />
                                        <div className="flex justify-between">
                                            {errors.bio ? (
                                                <p className="text-xs text-red-500">{errors.bio.message}</p>
                                            ) : (
                                                <span />
                                            )}
                                            <span className="text-xs text-gray-400">
                                                {watchedValues.bio?.length || 0} chars
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Review Your Profile
                                    </h2>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        {imagePreview && (
                                            <div className="flex justify-center mb-2">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Profile"
                                                    width={80}
                                                    height={80}
                                                    className="rounded-full object-cover w-20 h-20 border-2 border-orange-200"
                                                />
                                            </div>
                                        )}
                                        {[
                                            { label: "Name", value: user?.fullname },
                                            { label: "Phone", value: watchedValues.phone },
                                            { label: "Address", value: watchedValues.address },
                                            {
                                                label: "Category",
                                                value: categories.find(
                                                    (c) => String(c.catgeory_id) === watchedValues.serviceCategoryId
                                                )?.category_name,
                                            },
                                            {
                                                label: "Experience",
                                                value: `${watchedValues.experience_years} year(s)`,
                                            },
                                        ].map(({ label, value }) => (
                                            <div
                                                key={label}
                                                className="flex justify-between text-sm border-b border-gray-100 pb-2"
                                            >
                                                <span className="text-gray-500 font-medium">{label}</span>
                                                <span className="text-gray-800 font-semibold">{value || "—"}</span>
                                            </div>
                                        ))}
                                        <div className="text-sm">
                                            <p className="text-gray-500 font-medium mb-1">Bio</p>
                                            <p className="text-gray-700 bg-white rounded-lg p-2 text-xs leading-relaxed">
                                                {watchedValues.bio}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 text-center">
                                        You can update your profile anytime from your dashboard.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between mt-8 gap-3">
                                {step > 0 ? (
                                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                                        ← Back
                                    </Button>
                                ) : (
                                    <div className="flex-1" />
                                )}
                                {step < STEPS.length - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-1 bg-[#EE7A40] hover:bg-orange-500"
                                    >
                                        Next →
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={pending}
                                        className="flex-1 bg-[#EE7A40] hover:bg-orange-500"
                                    >
                                        {pending ? "Setting up..." : "Complete Setup 🚀"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}