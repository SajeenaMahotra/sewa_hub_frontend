import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

export const createBooking = async (data: {
    provider_id: string;
    scheduled_at: string;
    address: string;
    phone_number: string;
    note?: string;
    severity?: "normal" | "emergency" | "urgent";
}) => {
    try {
        const res = await axios.post(API.BOOKING.CREATE, data);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to create booking');
    }
};

export const getMyBookings = async (page = 1, size = 200) => {
    try {
        const res = await axios.get(API.BOOKING.MY_BOOKINGS, { params: { page, size } });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch bookings');
    }
};

export const cancelBooking = async (id: string) => {
    try {
        const res = await axios.patch(API.BOOKING.CANCEL(id));
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to cancel booking');
    }
};

export const getProviderBookings = async (page = 1, size = 200) => {
    try {
        const res = await axios.get("/api/bookings/provider", { params: { page, size } });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch provider bookings');
    }
};

export const updateBookingStatus = async (id: string, status: string) => {
    try {
        const res = await axios.patch(`/api/bookings/${id}/status`, { status });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to update booking status');
    }
};