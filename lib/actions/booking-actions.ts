"use server";
import {
    createBooking,
    getMyBookings,
    cancelBooking,
    getProviderBookings,
    updateBookingStatus,
    deleteBooking,
} from "@/lib/api/booking";

export const handleCreateBooking = async (data: {
    provider_id: string;
    scheduled_at: string;
    address: string;
    phone_number: string;
    note?: string;
    severity?: "normal" | "emergency" | "urgent";
}) => {
    try {
        const response = await createBooking(data);
        if (response.success) return { success: true, message: "Booking created", data: response.data };
        return { success: false, message: response.message || "Failed to create booking" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to create booking" };
    }
};

export const handleGetMyBookings = async (page = 1, size = 200) => {
    try {
        const response = await getMyBookings(page, size);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to fetch bookings" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch bookings" };
    }
};

export const handleCancelBooking = async (id: string) => {
    try {
        const response = await cancelBooking(id);
        if (response.success) return { success: true, message: "Booking cancelled" };
        return { success: false, message: response.message || "Failed to cancel booking" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to cancel booking" };
    }
};

export const handleGetProviderBookings = async (page = 1, size = 200) => {
    try {
        const response = await getProviderBookings(page, size);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to fetch bookings" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch bookings" };
    }
};

export const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
        const response = await updateBookingStatus(id, status);
        if (response.success) return { success: true, message: "Status updated", data: response.data };
        return { success: false, message: response.message || "Failed to update status" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update status" };
    }
};

export const handleDeleteBooking = async (id: string) => {
    try {
        const response = await deleteBooking(id);
        if (response.success) return { success: true, message: "Booking deleted" };
        return { success: false, message: response.message || "Failed to delete booking" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete booking" };
    }
};