import axios from "@/lib/api/axios"; // your axios instance with auth token
import { API } from "@/lib/api/endpoints";

export const createBooking = async (data: {
    provider_id: string;
    scheduled_at: string;
    address: string;
    phone_number: string;
    note?: string;
    severity?: "normal" | "emergency" | "urgent";
}) => {
    const res = await axios.post(API.BOOKING.CREATE, data);
    return res.data;
};

export const getMyBookings = async (page = 1, size = 10) => {
    const res = await axios.get(API.BOOKING.MY_BOOKINGS, { params: { page, size } });
    return res.data;
};

export const cancelBooking = async (id: string) => {
    const res = await axios.patch(API.BOOKING.CANCEL(id));
    return res.data;
};

export const getProviderBookings = async (page = 1, size = 50) => {
    const res = await axios.get("/api/bookings/provider", { params: { page, size } });
    return res.data;
};

export const updateBookingStatus = async (id: string, status: string) => {
    const res = await axios.patch(`/api/bookings/${id}/status`, { status });
    return res.data;
};