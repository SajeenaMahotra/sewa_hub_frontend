import api from "./axios";

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

export const notificationApi = {
    getAll: (page = 1, size = 20) =>
        api.get<{ success: boolean; data: NotificationListResponse }>(
            `/api/notifications?page=${page}&size=${size}`   // ✅ added /api prefix
        ),

    markAllRead: () =>
        api.patch("/api/notifications/read-all"),            // ✅ added /api prefix

    markOneRead: (id: string) =>
        api.patch(`/api/notifications/${id}/read`),          // ✅ added /api prefix

    deleteAll: () =>
        api.delete("/api/notifications"),                    // ✅ added /api prefix
};