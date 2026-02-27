"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { notificationApi, INotification } from "../api/notification";
import { useAuth } from "@/context/authContext";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

export function useNotifications() {
    const { user, isAuthenticated } = useAuth();
    const socketRef = useRef<Socket | null>(null);

    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch persisted notifications from DB on mount
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await notificationApi.getAll();
            setNotifications(res.data.data.notifications);
            setUnreadCount(res.data.data.unread);
        } catch (err) {
            console.error("[Notifications] Failed to fetch:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Connect socket and listen for real-time notifications
    useEffect(() => {
        if (!isAuthenticated || !user?._id) return;

        fetchNotifications();

        const socket = io(SOCKET_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("register", user._id);
        });

        socket.on("notification", (notif: INotification) => {
            setNotifications((prev) => [notif, ...prev]);
            setUnreadCount((prev) => prev + 1);
        });

        return () => {
            socket.disconnect();
        };
    }, [isAuthenticated, user?._id, fetchNotifications]);

    const markAllRead = async () => {
        try {
            await notificationApi.markAllRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("[Notifications] markAllRead failed:", err);
        }
    };

    const markOneRead = async (id: string) => {
        try {
            await notificationApi.markOneRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, is_read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("[Notifications] markOneRead failed:", err);
        }
    };

    const deleteAll = async () => {
        try {
            await notificationApi.deleteAll();
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error("[Notifications] deleteAll failed:", err);
        }
    };

    return { notifications, unreadCount, loading, markAllRead, markOneRead, deleteAll };
}