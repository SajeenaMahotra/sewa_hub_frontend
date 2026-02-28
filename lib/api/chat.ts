import axios from "@/lib/api/axios";

export const sendMessage = async (booking_id: string, content: string) => {
    try {
        const res = await axios.post("/api/chat", { booking_id, content });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to send message');
    }
};

export const getMessages = async (bookingId: string, page = 1, size = 50) => {
    try {
        const res = await axios.get(`/api/chat/${bookingId}`, { params: { page, size } });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch messages');
    }
};

export const markAsRead = async (bookingId: string) => {
    try {
        const res = await axios.patch(`/api/chat/${bookingId}/read`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to mark as read');
    }
};

export const getUnreadCount = async (bookingId: string) => {
    try {
        const res = await axios.get(`/api/chat/${bookingId}/unread`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to get unread count');
    }
};