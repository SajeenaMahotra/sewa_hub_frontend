"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner"; // ✅ Import toast

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { RegisterData, registerSchema } from "../schema";
import { handleRegister } from "@/lib/actions/auth-actions";

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
      try {
        const response = await handleRegister(values);

        if (!response.success) {
          toast.error(response.message || "Registration failed");
          return;
        }

        // Show success toast
        toast.success("Account created successfully! Redirecting to login...");

        // Redirect to login
        setTimeout(() => {
          router.push("/login");
        }, 1500);

      } catch (err: any) {
        toast.error(err.message || "Registration failed");
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
            {...register("fullname")}
          />
          {errors.fullname && (
            <p className="text-xs text-red-600">{errors.fullname.message}</p>
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
            <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-[#EE7A40] hover:bg-orange-500"
        >
          {isSubmitting || pending ? "Signing up..." : "SIGN UP"}
        </Button>
      </form>

      {/* Login */}
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#EE7A40] hover:underline">
          Login
        </Link>
      </p>

      <div className="my-4 flex items-center">
        <div className="h-px flex-1 bg-muted" />
        <span className="px-3 text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-muted" />
      </div>

      {/* Google */}
      <Button
        variant="outline"
        type="button"
        className="w-full gap-2"
      >
        <Image
          src="/images/google.png"
          alt="Google"
          width={18}
          height={18}
        />
        Continue with Google
      </Button>
    </div>
  );
}