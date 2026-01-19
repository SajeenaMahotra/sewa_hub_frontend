"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { login } from "@/lib/api/auth";

import { LoginData, loginSchema } from "../schema";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  // read success message from query param
  const initialSuccess = searchParams.get("success") || null;
  const [success, setSuccess] = useState<string | null>(initialSuccess);
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      try {
        setError(null); // clear previous API errors

        const response = await login(values);
        console.log("Login success:", response);

        setSuccess("Login successful!");

        // Redirect after 1.5s
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } catch (err: any) {
        // Handle API errors
        setError(err.response?.data?.message || err.message || "Login failed");
        setSuccess(null);
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
        {error && (
          <div className="flex justify-center">
            <Alert className="w-fit max-w-[90%] border border-red-500/50 bg-red-500/10 px-3 py-2">
              <AlertDescription className="flex items-center gap-2 text-sm font-medium text-red-500">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="flex justify-center mb-4">
            <Alert className="w-fit min-w-[260px] max-w-[90%] border border-green-500/50 bg-green-500/10 px-3 py-2">
              <AlertDescription className="flex items-center justify-center text-sm font-medium text-green-600">
                {success}
              </AlertDescription>
            </Alert>
          </div>
        )}
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

          <Link href="#" className="text-muted-foreground hover:underline">
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

      {/* Register */}
      <p className="mt-4 text-center text-sm">
        Don’t have an account?{" "}
        <Link href="/register" className="font-semibold">
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
