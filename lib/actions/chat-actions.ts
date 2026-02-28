"use server";
import {
    sendMessage,
    getMessages,
    markAsRead,
    getUnreadCount,
} from "@/lib/api/chat";

export const handleSendMessage = async (bookingId: string, content: string) => {
    try {
        const response = await sendMessage(bookingId, content);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to send message" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to send message" };
    }
};

export const handleGetMessages = async (bookingId: string, page = 1, size = 50) => {
    try {
        const response = await getMessages(bookingId, page, size);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to fetch messages" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch messages" };
    }
};

export const handleMarkAsRead = async (bookingId: string) => {
    try {
        const response = await markAsRead(bookingId);
        if (response.success) return { success: true };
        return { success: false, message: response.message || "Failed to mark as read" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to mark as read" };
    }
};

export const handleGetUnreadCount = async (bookingId: string) => {
    try {
        const response = await getUnreadCount(bookingId);
        if (response.success) return { success: true, data: response.data };
        return { success: false, message: response.message || "Failed to get unread count" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to get unread count" };
    }
};