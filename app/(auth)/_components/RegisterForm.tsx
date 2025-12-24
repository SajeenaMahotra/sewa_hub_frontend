"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { RegisterData, registerSchema } from "../schema";

export default function RegisterForm() {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });

    const submit = async (values: RegisterData) => {
        startTransition(async () => {
            await new Promise((r) => setTimeout(r, 1000));
            console.log("register", values);
            // router.push("/");
        });
    };

    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            {/* Header */}
            <div className="mb-6 text-center">
                <div className="flex items-center justify-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/sewahublogo.png"
                            alt="Sewahub Logo"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </Link>
                </div>
                <p className="mt-2 text-sm font-semibold">Create Your Account</p>
                <p className="text-sm text-muted-foreground">
                    Empowering You With Trusted Local Services.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(submit)} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-600">{errors.name.message}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
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

                {/* Password */}
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
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
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••"
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-600">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isSubmitting || pending}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                >
                    {isSubmitting || pending ? "Signing up..." : "SIGN UP"}
                </Button>
            </form>

            {/* Register */}
            <p className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold">
                    Login
                </Link>
            </p>

            {/* Divider */}
            <div className="my-4 flex items-center">
                <div className="h-px flex-1 bg-muted" />
                <span className="px-3 text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-muted" />
            </div>

            {/* Google */}
            <Button variant="outline" type="button" className="w-full gap-2">
                <Image src="/images/google.png" alt="Google" width={18} height={18} />
                Continue with Google
            </Button>

            {/* Terms */}
            <p className="mt-2 text-center text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="underline">
                    Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    );
}
