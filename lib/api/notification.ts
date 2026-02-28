import axios from "./axios";

export interface INotification {
    _id: string;
    recipient_id: string;
    type: "booking_created" | "booking_accepted" | "booking_rejected" | "booking_completed" | "booking_cancelled";
    title: string;
    message: string;
    booking_id?: string;
    is_read: boolean;
    created_at: string;
}

export interface NotificationListResponse {
    notifications: INotification[];
    total: number;
    unread: number;
}

export const getNotifications = async (page = 1, size = 20) => {
    try {
        const res = await axios.get(`/api/notifications?page=${page}&size=${size}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch notifications');
    }
};

export const markAllRead = async () => {
    try {
        const res = await axios.patch("/api/notifications/read-all");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to mark all as read');
    }
};

export const markOneRead = async (id: string) => {
    try {
        const res = await axios.patch(`/api/notifications/${id}/read`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to mark as read');
    }
};

export const deleteAllNotifications = async () => {
    try {
        const res = await axios.delete("/api/notifications");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete notifications');
    }
};