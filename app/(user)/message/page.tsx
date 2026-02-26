"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Calendar, ChevronRight, Search, Inbox } from "lucide-react";
import { getMyBookings } from "@/lib/api/booking";
import { getMessages, getUnreadCount } from "@/lib/api/chat";
import { useAuth } from "@/context/authContext";
import ChatWindow from "@/components/ChatWindow";
import { UserBookingCardData, formatDate, formatTime } from "@/app/(user)/_components/UserBookingCard";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function resolveAvatar(url?: string) {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}
function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const CHAT_ALLOWED = ["pending", "accepted","cancelled", "rejected", "completed"];

interface BookingWithUnread extends UserBookingCardData {
  unread: number;
}

export default function MessagesPage() {
  const { user,loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingWithUnread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BookingWithUnread | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading || !user) return; 
    const load = async () => {
      try {
        setLoading(true);
        const res = await getMyBookings(1, 50);
        const all: UserBookingCardData[] = res?.data?.bookings ?? [];

        const chatBookings = all.filter((b) => CHAT_ALLOWED.includes(b.status));

        // Just fetch unread counts, don't filter by message existence
        const withUnread: BookingWithUnread[] = (
          await Promise.all(
            chatBookings.map(async (b) => {
              try {
                const [unreadRes, msgRes] = await Promise.all([
                  getUnreadCount(b._id),
                  getMessages(b._id, 1, 1),
                ]);
                const total = msgRes?.data?.total ?? 0;
                if (total === 0) return null; // ← skip bookings with no messages
                return { ...b, unread: unreadRes?.data?.unread ?? 0 };
              } catch {
                return null;
              }
            })
          )
        ).filter(Boolean) as BookingWithUnread[];

        setBookings(withUnread);
        if (withUnread.length > 0 && !selected) {
          setSelected(withUnread[0]);
        }
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authLoading, user]);

  const filtered = bookings.filter((b) => {
    const name = b.provider_id?.Useruser_id?.fullname?.toLowerCase() ?? "";
    return name.includes(search.toLowerCase());
  });

  const statusColor: Record<string, string> = {
    pending: "bg-amber-400",
    accepted: "bg-green-400",
    completed: "bg-blue-400",
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Chat with your service providers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">

        {/* Sidebar — conversation list */}
        <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col shrink-0 ${selected ? "hidden md:flex" : "flex"}`}>
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search providers..."
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#EE7A40] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-16 gap-3">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-[#EE7A40]" />
                </div>
                <p className="text-sm text-gray-400 font-medium">No conversations yet</p>
                <p className="text-xs text-gray-300 text-center px-6">
                  Conversations appear here once you have a booking
                </p>
              </div>
            )}

            {filtered.map((booking) => {
              const provider = booking.provider_id;
              const providerUser = provider?.Useruser_id;
              const avatar = resolveAvatar(provider?.imageUrl || providerUser?.imageUrl);
              const isActive = selected?._id === booking._id;

              return (
                <button
                  key={booking._id}
                  onClick={() => setSelected(booking)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-orange-50/50 border-b border-gray-50 ${isActive ? "bg-orange-50 border-l-2 border-l-[#EE7A40]" : ""
                    }`}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-11 h-11 rounded-xl">
                      <AvatarImage src={avatar} className="object-cover" />
                      <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-[#EE7A40] font-bold text-sm">
                        {providerUser?.fullname ? getInitials(providerUser.fullname) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    {/* Status dot */}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColor[booking.status] ?? "bg-gray-300"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {providerUser?.fullname || "Provider"}
                      </p>
                      {booking.unread > 0 && (
                        <span className="shrink-0 w-5 h-5 rounded-full bg-[#EE7A40] text-white text-[10px] font-bold flex items-center justify-center">
                          {booking.unread > 9 ? "9+" : booking.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                      <p className="text-xs text-gray-400 truncate">
                        {formatDate(booking.scheduled_at)} · {formatTime(booking.scheduled_at)}
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold capitalize px-1.5 py-0.5 rounded-full mt-1 inline-block ${booking.status === "accepted" ? "bg-green-50 text-green-600" :
                      booking.status === "completed" ? "bg-blue-50 text-blue-600" :
                        "bg-amber-50 text-amber-600"
                      }`}>
                      {booking.status}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat panel */}
        <div className={`flex-1 flex flex-col ${!selected ? "hidden md:flex" : "flex"}`}>
          {selected ? (
            <>
              {/* Mobile back button */}
              <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-[#EE7A40] font-semibold flex items-center gap-1"
                >
                  ← Back
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatWindow
                  bookingId={selected._id}
                  currentUserId={user?._id}
                  partnerName={selected.provider_id?.Useruser_id?.fullname || "Provider"}
                  partnerAvatar={selected.provider_id?.imageUrl || selected.provider_id?.Useruser_id?.imageUrl}
                  readOnly={!["pending", "accepted"].includes(selected.status)}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-[#EE7A40]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">Select a conversation</p>
                <p className="text-xs text-gray-400 mt-1">Choose a booking from the left to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}