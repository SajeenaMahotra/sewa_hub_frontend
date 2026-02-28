"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectRole: (role: "user" | "provider") => void;
}

export default function GoogleRoleModal({ isOpen, onClose, onSelectRole }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-5 text-center">
                    <Image
                        src="/images/google.png"
                        alt="Google"
                        width={32}
                        height={32}
                        className="mx-auto mb-3"
                    />
                    <h2 className="text-lg font-semibold">Continue with Google</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        How do you want to continue? This sets your account type.
                    </p>
                </div>

                {/* Role Options */}
                <div className="space-y-3">
                    <button
                        onClick={() => onSelectRole("user")}
                        className="w-full rounded-xl border-2 border-transparent p-4 text-left transition hover:border-[#EE7A40] hover:bg-orange-50"
                    >
                        <p className="font-semibold"> Looking for a Service</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            I want to book services
                        </p>
                    </button>

                    <button
                        onClick={() => onSelectRole("provider")}
                        className="w-full rounded-xl border-2 border-transparent p-4 text-left transition hover:border-[#EE7A40] hover:bg-orange-50"
                    >
                        <p className="font-semibold">Service Provider</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            I want to offer services
                        </p>
                    </button>
                </div>

                {/* Cancel */}
                <Button
                    variant="ghost"
                    className="mt-4 w-full text-muted-foreground"
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}