import axios from "@/lib/api/axios";

export const sendMessage = async (booking_id: string, content: string) => {
    const res = await axios.post("/api/chat", { booking_id, content });
    return res.data;
};

export const getMessages = async (bookingId: string, page = 1, size = 50) => {
    const res = await axios.get(`/api/chat/${bookingId}`, { params: { page, size } });
    return res.data;
};

export const markAsRead = async (bookingId: string) => {
    const res = await axios.patch(`/api/chat/${bookingId}/read`);
    return res.data;
};

export const getUnreadCount = async (bookingId: string) => {
    const res = await axios.get(`/api/chat/${bookingId}/unread`);
    return res.data;
};