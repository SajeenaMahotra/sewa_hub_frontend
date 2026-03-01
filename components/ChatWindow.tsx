"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Wifi, WifiOff, X, MessageCircle } from "lucide-react";
import { useChatSocket, ChatMessage } from "@/lib/hooks/useChatSocket";
import { getMessages } from "@/lib/api/chat";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveAvatar(url?: string) {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatMessageTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NP", { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(iso: string) {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" });
}

interface ChatWindowProps {
    bookingId: string;
    currentUserId: string;
    partnerName: string;
    partnerAvatar?: string;
    onClose?: () => void;
    isModal?: boolean;
    readOnly?: boolean;
}

export default function ChatWindow({
    bookingId,
    currentUserId,
    partnerName,
    partnerAvatar,
    onClose,
    isModal = false,
    readOnly = false, // ← destructured
}: ChatWindowProps) {
    const { messages, isConnected, isTyping, sendMessage, emitTyping } = useChatSocket(bookingId);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoading(true);
        getMessages(bookingId)
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [bookingId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        sendMessage(trimmed);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const grouped: { label: string; msgs: ChatMessage[] }[] = [];
    messages.forEach((msg) => {
        const label = formatDateLabel(msg.created_at);
        const last = grouped[grouped.length - 1];
        if (last && last.label === label) {
            last.msgs.push(msg);
        } else {
            grouped.push({ label, msgs: [msg] });
        }
    });

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-xl ring-2 ring-orange-50">
                        <AvatarImage src={resolveAvatar(partnerAvatar)} className="object-cover" />
                        <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#EE7A40] font-bold text-sm">
                            {getInitials(partnerName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{partnerName}</p>
                        <div className="flex items-center gap-1">
                            {isConnected ? (
                                <>
                                    <Wifi className="w-3 h-3 text-green-500" />
                                    <span className="text-[10px] text-green-500 font-medium">Connected</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-3 h-3 text-gray-400" />
                                    <span className="text-[10px] text-gray-400">Connecting...</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {isModal && onClose && (
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#faf9f7]">
                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-[#EE7A40] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!loading && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-[#EE7A40]" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">No messages yet</p>
                        <p className="text-xs text-gray-300">Start the conversation!</p>
                    </div>
                )}

                {grouped.map(({ label, msgs }) => (
                    <div key={label}>
                        <div className="flex items-center gap-2 my-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-[10px] font-semibold text-gray-400 px-2">{label}</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <div className="space-y-1.5">
                            {msgs.filter(msg => msg.sender_id).map((msg, i) => {
                                const isMe = msg.sender_id?._id === currentUserId;
const showAvatar = !isMe && (i === 0 || msgs[i - 1]?.sender_id?._id !== msg.sender_id?._id);

                                return (
                                    <div key={msg._id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className="w-7 shrink-0">
                                            {!isMe && showAvatar && (
                                                <Avatar className="w-7 h-7 rounded-lg">
                                                    <AvatarImage src={resolveAvatar(msg.sender_id.imageUrl)} className="object-cover" />
                                                    <AvatarFallback className="rounded-lg bg-orange-100 text-[#EE7A40] text-[10px] font-bold">
                                                        {getInitials(msg.sender_id?.fullname ?? "?")}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>

                                        <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                            <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                                                isMe
                                                    ? "bg-[#EE7A40] text-white rounded-br-sm"
                                                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                                            }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-gray-400 px-1">
                                                {formatMessageTime(msg.created_at)}
                                                {isMe && (
                                                    <span className="ml-1 text-[10px]">
                                                        {msg.is_read ? "· Seen" : "· Sent"}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex items-end gap-2">
                        <div className="w-7 shrink-0" />
                        <div className="bg-white border border-gray-100 shadow-sm px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input — disabled if readOnly */}
            {readOnly ? (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
                    <p className="text-xs text-gray-400 font-medium">This conversation is closed</p>
                </div>
            ) : (
                <div className="px-4 py-3 bg-white border-t border-gray-100">
                    <div className="flex items-end gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                emitTyping();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#EE7A40] focus:ring-1 focus:ring-[#EE7A40]/20 transition-all max-h-28 overflow-y-auto"
                            style={{ height: "auto" }}
                            onInput={(e) => {
                                const t = e.currentTarget;
                                t.style.height = "auto";
                                t.style.height = Math.min(t.scrollHeight, 112) + "px";
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || !isConnected}
                            className="w-10 h-10 rounded-xl bg-[#EE7A40] text-white flex items-center justify-center shrink-0 hover:bg-[#d96e35] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}