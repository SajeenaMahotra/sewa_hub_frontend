"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GoogleErrorPage() {
    const router = useRouter();
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-xl font-semibold">Google Login Failed</h1>
                <p className="text-muted-foreground text-sm">Something went wrong during Google sign-in.</p>
                <Button
                    className="bg-[#EE7A40] hover:bg-orange-500"
                    onClick={() => router.push("/login")}
                >
                    Back to Login
                </Button>
            </div>
        </div>
    );
}