"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { handleWhoAmI } from "@/lib/actions/auth-actions";
import { setAuthToken } from "@/lib/cookie";
import { toast } from "sonner";

export default function GoogleSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const handleGoogleSuccess = async () => {
            const token = searchParams.get("token");

            if (!token) {
                toast.error("Google login failed. No token received.");
                router.push("/login");
                return;
            }

            try {
                await setAuthToken(token);

                const result = await handleWhoAmI();
                if (!result.success || !result.data) {
                    throw new Error("Failed to fetch user data");
                }

                const userData = result.data;
                await login(token, userData);
                toast.success("Logged in with Google!");

                if (userData.role === "admin") {
                    router.push("/admin");
                } else if (userData.role === "provider") {
                    router.push(userData.isProfileSetup ? "/service-provider" : "/setup-profile");
                } else {
                    router.push("/feed");
                }
            } catch (err: any) {
                toast.error(err.message || "Google login failed");
                router.push("/login");
            }
        };

        handleGoogleSuccess();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#EE7A40] border-t-transparent mx-auto" />
                <p className="text-muted-foreground text-sm">Signing you in with Google...</p>
            </div>
        </div>
    );
}