"use server";
import {
    getNotifications,
    markAllRead,
    markOneRead,
    deleteAllNotifications,
} from "@/lib/api/notification";

export const handleGetNotifications = async (page = 1, size = 20) => {
    try {
        const response = await getNotifications(page, size);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to fetch notifications" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch notifications" };
    }
};

export const handleMarkAllRead = async () => {
    try {
        const response = await markAllRead();
        if (response.success) return { success: true, message: "All marked as read" };
        return { success: false, message: response.message || "Failed to mark all as read" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to mark all as read" };
    }
};

export const handleMarkOneRead = async (id: string) => {
    try {
        const response = await markOneRead(id);
        if (response.success) return { success: true, message: "Marked as read" };
        return { success: false, message: response.message || "Failed to mark as read" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to mark as read" };
    }
};

export const handleDeleteAllNotifications = async () => {
    try {
        const response = await deleteAllNotifications();
        if (response.success) return { success: true, message: "Notifications cleared" };
        return { success: false, message: response.message || "Failed to delete notifications" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete notifications" };
    }
};