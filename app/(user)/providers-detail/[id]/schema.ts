import { z } from "zod";

export const bookingSchema = z.object({
    date:     z.string().min(1, { message: "Please select a date" }),
    time:     z.string().min(1, { message: "Please select a time" }),
    address:  z.string().min(5, { message: "Please enter a valid address" }),
    note:     z.string().optional(),
    severity: z.enum(["normal", "emergency", "urgent"]).default("normal"),
});

export type BookingData   = z.infer<typeof bookingSchema>;
export type BookingErrors = Partial<Record<keyof BookingData, string>>;