"use client";

import { useRef, useState, useEffect } from "react";
import { Bell, Check, Trash2, BookCheck, BookX, BookOpen, Ban, BellOff } from "lucide-react";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { INotification } from "@/lib/api/notification";
import { formatDistanceToNow } from "date-fns";

type NotifType = INotification["type"];

const TYPE_CONFIG: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
    booking_created:   { icon: <BookOpen  className="w-4 h-4" />, color: "text-blue-600",   bg: "bg-blue-50"   },
    booking_accepted:  { icon: <BookCheck className="w-4 h-4" />, color: "text-green-600",  bg: "bg-green-50"  },
    booking_rejected:  { icon: <BookX     className="w-4 h-4" />, color: "text-red-600",    bg: "bg-red-50"    },
    booking_completed: { icon: <BookCheck className="w-4 h-4" />, color: "text-orange-600", bg: "bg-orange-50" },
    booking_cancelled: { icon: <Ban       className="w-4 h-4" />, color: "text-gray-600",   bg: "bg-gray-100"  },
};

export default function NotificationDropdown() {
    const { notifications, unreadCount, loading, markAllRead, markOneRead, deleteAll } =
        useNotifications();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
                <Bell className="h-4 w-4 text-gray-500" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs bg-[#EE7A40] text-white font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1 text-xs text-[#EE7A40] hover:text-orange-600 font-medium px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors"
                                >
                                    <Check className="w-3 h-3" />
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={deleteAll}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
                        {loading ? (
                            <div className="flex flex-col gap-3 p-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-3 animate-pulse">
                                        <div className="w-8 h-8 rounded-xl bg-gray-100 shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-gray-100 rounded w-3/4" />
                                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                                <BellOff className="w-8 h-8" />
                                <p className="text-sm font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const cfg = TYPE_CONFIG[notif.type];
                                return (
                                    <button
                                        key={notif._id}
                                        onClick={() => !notif.is_read && markOneRead(notif._id)}
                                        className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                                            !notif.is_read ? "bg-orange-50/40" : ""
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}>
                                            {cfg.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium leading-snug ${!notif.is_read ? "text-gray-900" : "text-gray-600"}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                                            </p>
                                        </div>

                                        {/* Unread dot */}
                                        {!notif.is_read && (
                                            <div className="w-2 h-2 rounded-full bg-[#EE7A40] shrink-0 mt-2" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}