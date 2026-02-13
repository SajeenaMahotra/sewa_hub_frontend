"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner"; 

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { handleLogin } from "@/lib/actions/auth-actions";
import { LoginData, loginSchema } from "../schema";

import { useAuth } from "@/context/authContext";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      try {
        const response = await handleLogin(values);

        if (!response.success) {
          throw new Error(response.message || "Login failed");
        }

        // Extract token and user from response.data
        const token = response.data.token;
        const userData = response.data.user || response.data;

        // Update AuthContext immediately
        login(token, userData);

        // Show success toast
        toast.success("Login successful!");

        // Role-based redirect
        setTimeout(() => {
          const userRole = userData.role;
          
          if (userRole === "admin") {
            router.push("/admin");
          } else if (userRole === "provider") {
            router.push("/provider-dashboard"); // Service provider dashboard
          } else {
            router.push("/dashboard"); // Customer dashboard (user role)
          }
        }, 100);
      } catch (err: any) {
        // Show error toast
        toast.error(err.message || "Login failed");
      }
    });
  };

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
        <p className="mt-2 text-sm font-semibold">WELCOME BACK !</p>
        <p className="text-sm text-muted-foreground">
          Your Trusted Services Await
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
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

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          <Link href="/request-reset-password" className="text-muted-foreground hover:underline">
            Forgot Password ?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-[#EE7A40] hover:bg-orange-500"
        >
          {isSubmitting || pending ? "Logging in..." : "LOGIN"}
        </Button>
      </form>

      {/* Register - Changed to point to role selection */}
      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/role-selection" className="font-semibold text-[#EE7A40] hover:underline">
          Create one.
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
    </div>
  );
}