"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/auth-actions";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const ResetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({
    token,
}: {
    token: string;
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordDTO>({
        resolver: zodResolver(ResetPasswordSchema)
    });
    const router = useRouter();
    
    const onSubmit = async (data: ResetPasswordDTO) => {
        try {
            const response = await handleResetPassword(token, data.password);
            if (response.success) {
                toast.success("Password reset successfully");
                router.replace('/login');
            } else {
                toast.error(response.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    }

    return (
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
                <p className="mt-2 text-sm font-semibold">RESET PASSWORD</p>
                <p className="text-sm text-muted-foreground">
                    Enter your new password below
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* New Password */}
                <div className="space-y-1">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••"
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-600">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#EE7A40] hover:bg-orange-500"
                >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
            </form>

            {/* Links */}
            <div className="mt-4 space-y-2 text-center text-sm">
                <p>
                    Remember your password?{" "}
                    <Link href="/login" className="font-semibold text-[#EE7A40] hover:underline">
                        Back to Login
                    </Link>
                </p>
                <p>
                    Need a new reset link?{" "}
                    <Link href="/request-reset-password" className="font-semibold text-[#EE7A40] hover:underline">
                        Request again
                    </Link>
                </p>
            </div>
        </div>
    );
}