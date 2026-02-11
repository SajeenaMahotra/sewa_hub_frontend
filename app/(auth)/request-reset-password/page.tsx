"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/lib/api/auth";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const RequestPasswordResetSchema = z.object({
    email: z.string().email("Please enter a valid email address")
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;

export default function Page() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RequestPasswordResetDTO>({
        resolver: zodResolver(RequestPasswordResetSchema)
    });
    
    const onSubmit = async (data: RequestPasswordResetDTO) => {
        try {
            const response = await requestPasswordReset(data.email);
            if (response.success) {
                toast.success('Password reset link sent to your email.');
            } else {
                toast.error(response.message || 'Failed to request password reset.');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Failed to request password reset.');
        }
    }
    
    return (
        <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}>
            
            {/* Dim overlay */}
            <div className="absolute inset-0 bg-white/30"></div>

            {/* Form */}
            <div className="relative w-full max-w-md z-10">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <Link href="/" className="flex justify-center">
                            <Image
                                src="/sewahublogo.png"
                                alt="Sewahub Logo"
                                width={100}
                                height={100}
                            />
                        </Link>
                        <p className="mt-2 text-sm font-semibold">FORGOT PASSWORD?</p>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to receive a reset link
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="johndoe@gmail.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#EE7A40] hover:bg-orange-500"
                        >
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </form>

                    {/* Back to Login */}
                    <p className="mt-4 text-center text-sm">
                        Remember your password?{" "}
                        <Link href="/login" className="font-semibold text-[#EE7A40] hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}