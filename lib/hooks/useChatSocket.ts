"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
    _id: string;
    booking_id: string;
    sender_id: { _id: string; fullname: string; email: string; imageUrl?: string };
    sender_role: "user" | "provider";
    content: string;
    is_read: boolean;
    created_at: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function getToken(): string | undefined {
    if (typeof window === "undefined") return undefined;
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")
        .slice(1)
        .join("=");
    return token ? decodeURIComponent(token) : undefined;
}

export function useChatSocket(bookingId: string | null) {
    const socketRef = useRef<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!bookingId) return;

        const token = getToken();
        if (!token) return;

        const socket = io(BASE_URL, {
            path: "/socket.io",
            auth: { token },
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            socket.emit("join_room", { bookingId });
        });

        socket.on("room_joined", ({ messages: history }: { messages: ChatMessage[]; total: number }) => {
            setMessages(history);
        });

        socket.on("new_message", (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
            socket.emit("mark_read", { bookingId });
        });

        socket.on("user_typing", () => setIsTyping(true));
        socket.on("user_stopped_typing", () => setIsTyping(false));

        socket.on("disconnect", () => setIsConnected(false));

        socket.on("error", (err: { message: string }) => {
            console.error("[Chat socket error]", err.message);
        });

        return () => {
            socket.emit("leave_room", { bookingId });
            socket.disconnect();
            socketRef.current = null;
            setMessages([]);
            setIsConnected(false);
        };
    }, [bookingId]);

    const sendMessage = useCallback(
        (content: string) => {
            if (!socketRef.current || !bookingId) return;
            socketRef.current.emit("send_message", { bookingId, content });
        },
        [bookingId]
    );

    const emitTyping = useCallback(() => {
        if (!socketRef.current || !bookingId) return;
        socketRef.current.emit("typing_start", { bookingId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("typing_stop", { bookingId });
        }, 1500);
    }, [bookingId]);

    return { messages, isConnected, isTyping, sendMessage, emitTyping };
}