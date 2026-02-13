"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const router = useRouter();

  const handleContinue = () => {
    if (selectedRole === "provider") {
      router.push("/register?role=provider");
    } else if (selectedRole === "customer") {
      router.push("/register?role=customer");
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl bg-white px-12 py-8 shadow-xl">
      {/* Logo */}
      <div className="mb-6 text-center">
        <Link href="/" className="flex justify-center">
          <Image
            src="/sewahublogo.png"
            alt="Sewahub Logo"
            width={100}
            height={100}
          />
        </Link>
      </div>
      

      {/* Title */}
      <h2 className="mb-1 text-center text-xl font-medium text-gray-800">
        How would you like to use SewaHub?
      </h2>

      {/* Subtitle */}
      <p className="mb-6 text-center text-sm text-gray-600">I am</p>

      {/* Radio Group with bordered divs */}
      <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
        <div className="space-y-4">
          {/* Service Provider Option */}
          <label htmlFor="provider" className="cursor-pointer block">
            <div
              className={`rounded-xl border-2 p-5 transition-all duration-200 ${
                selectedRole === "provider"
                  ? "border-[#EE7A40] bg-orange-50/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="provider"
                  id="provider"
                  className="mt-1 data-[state=checked]:border-[#EE7A40] data-[state=checked]:text-[#EE7A40]"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="provider"
                    className="cursor-pointer text-base font-semibold text-gray-800"
                  >
                    Service Provider
                  </Label>
                  <p className="mt-1 text-sm text-gray-600">
                    I provide professional service
                  </p>
                </div>
              </div>
            </div>
          </label>

          {/* Looking for Service Option */}
          <label htmlFor="customer" className="cursor-pointer block">
            <div
              className={`rounded-xl border-2 p-5 transition-all duration-200 ${
                selectedRole === "customer"
                  ? "border-[#EE7A40] bg-orange-50/20"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="customer"
                  id="customer"
                  className="mt-1 data-[state=checked]:border-[#EE7A40] data-[state=checked]:text-[#EE7A40]"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="customer"
                    className="cursor-pointer text-base font-semibold text-gray-800"
                  >
                    Looking for Service
                  </Label>
                  <p className="mt-1 text-sm text-gray-600">
                    I am looking for home services.
                  </p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </RadioGroup>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!selectedRole}
        className="mt-6 w-full bg-[#EE7A40] hover:bg-orange-500 disabled:opacity-50"
      >
        Continue
      </Button>

      {/* Already have account */}
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="font-semibold text-gray-800 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}