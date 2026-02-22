import { z } from "zod";

export const setupProfileSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(3, "Address is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  experience_years: z.number()
    .min(0, "Cannot be negative")
    .max(50, "Too many years"),
  serviceCategoryId: z.string().min(1, "Please select a service category"),
});

export type SetupProfileData = z.infer<typeof setupProfileSchema>;