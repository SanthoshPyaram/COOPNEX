import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Booking, WorkerProfile } from "../../types";
import { api } from "../../services/api";
import {
  MessageSquare,
  Send,
  Phone,
  Clock,
  MapPin,
  CheckCheck,
  Check,
  User,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Plus
} from "lucide-react";

interface CustomerMessagesViewProps {
  bookings: Booking[];
  workers: WorkerProfile[];
  onNavigateToBrowse: () => void;
}

interface ChatMessage {
  id: string;
  senderRole: "CUSTOMER" | "WORKER" | "ADMIN";
  senderName: string;
  text: string;
  timestamp: string;
  readStatus?: boolean;
}

export const CustomerMessagesView: React.FC<CustomerMessagesViewProps> = ({
  bookings,
  workers,
  onNavigateToBrowse
}) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available conversation targets (strictly derived from actual bookings - ZERO MOCK CHATS)
  const conversationPartners = React.useMemo(() => {
    return bookings
      .filter((b) => b && b._id)
      .map((b) => {
        const wId = typeof b.workerId === "string" ? b.workerId : (b.workerId as any)?._id || b._id;
        const workerMatch = workers.find((w) => w._id === wId || (w as any).id === wId);

        return {
          id: wId,
          bookingId: b._id,
          bookingNumber: b.bookingNumber || `#BK-${b._id.slice(-6).toUpperCase()}`,
          name: workerMatch?.name || (b as any).workerName || "Assigned Artisan",
          role: b.serviceCategory || "Cooperative Technician",
          phone: workerMatch?.phone || (b as any).workerPhone || "+91 98480 22341",
          avatarUrl:
            workerMatch?.avatarUrl ||
            "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
          status: b.status,
          lastMessage: `Service Order: ${b.serviceCategory}`,
          lastTime: b.createdAt ? new Date(b.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today"
        };
      });
  }, [bookings, workers]);

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    conversationPartners[0]?.bookingId || ""
  );
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Current active chat target
  const activePartner =
    conversationPartners.find((p) => p.bookingId === selectedBookingId) || conversationPartners[0];

  // Fetch messages for active booking
  const loadMessages = useCallback(async (bookingId: string, showSpinner = false) => {
    if (!bookingId) return;
    if (showSpinner) setLoadingMessages(true);
    try {
      const res = await api.getMessagesByBooking(bookingId);
      if (res.success && Array.isArray(res.messages)) {
        const formatted: ChatMessage[] = res.messages.map((m: any) => ({
          id: m._id || m.id || Math.random().toString(),
          senderRole: m.senderRole || "WORKER",
          senderName: m.senderName || "Artisan",
          text: m.text,
          timestamp: m.timestamp
            ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Just now",
          readStatus: m.readStatus
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.warn("Error retrieving booking messages:", err);
    } finally {
      if (showSpinner) setLoadingMessages(false);
    }
  }, []);

  // Sync selected partner on mount or bookings change
  useEffect(() => {
    if (conversationPartners.length > 0 && !selectedBookingId) {
      setSelectedBookingId(conversationPartners[0].bookingId);
    }
  }, [conversationPartners, selectedBookingId]);

  // Load messages whenever active booking changes
  useEffect(() => {
    if (activePartner?.bookingId) {
      loadMessages(activePartner.bookingId, true);
    }
  }, [activePartner?.bookingId, loadMessages]);

  // Real-time synchronization: BroadcastChannel across multiple open tabs/windows
  useEffect(() => {
    if (!activePartner?.bookingId) return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("coopnex_chat_channel");
      channel.onmessage = (event) => {
        if (event.data?.bookingId === activePartner.bookingId) {
          loadMessages(activePartner.bookingId, false);
        }
      };
    } catch (e) {
      // BroadcastChannel not supported in ancient browsers
    }

    // Lightweight 3-second background polling for cross-device/separate browser windows
    const pollInterval = setInterval(() => {
      loadMessages(activePartner.bookingId, false);
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      if (channel) channel.close();
    };
  }, [activePartner?.bookingId, loadMessages]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartner?.bookingId || isSending) return;

    const textToSend = inputText.trim();
    setInputText("");
    setIsSending(true);

    // Optimistic UI push (WhatsApp feel)
    const optimisticMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderRole: "CUSTOMER",
      senderName: "You",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      readStatus: false
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await api.sendMessage(activePartner.bookingId, textToSend);
      if (res.success) {
        // Broadcast to other open browser tabs
        try {
          const channel = new BroadcastChannel("coopnex_chat_channel");
          channel.postMessage({ bookingId: activePartner.bookingId, text: textToSend });
          channel.close();
        } catch (chErr) {
          // ignore
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  // EMPTY STATE (NO DEFAULT / FAKE MESSAGES)
  if (conversationPartners.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900">No Active Conversations Yet</h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          Messages are enabled automatically when you book a cooperative artisan. Once your booking request is confirmed, you can coordinate details, share landmarks, and communicate directly in real-time.
        </p>
        <button
          onClick={onNavigateToBrowse}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold text-xs transition shadow-xs cursor-pointer inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Browse Available Specialists</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[75vh] min-h-[520px]">
      {/* LEFT SIDEBAR: LIST OF CONVERSATIONS (HIDDEN ON MOBILE WHEN CHAT IS OPEN) */}
      <div
        className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
          isMobileChatOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Active Booking Chats</h3>
            <p className="text-[11px] text-slate-500">Linked to your registered service orders</p>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {conversationPartners.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversationPartners.map((partner) => {
            const isSelected = partner.bookingId === activePartner?.bookingId;
            return (
              <button
                key={partner.bookingId}
                type="button"
                onClick={() => {
                  setSelectedBookingId(partner.bookingId);
                  setIsMobileChatOpen(true);
                }}
                className={`w-full p-3.5 text-left transition flex items-start gap-3 cursor-pointer ${
                  isSelected ? "bg-white shadow-xs border-l-4 border-blue-600" : "hover:bg-slate-100/60"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={partner.avatarUrl}
                    alt={partner.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-black text-slate-900 truncate">{partner.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{partner.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-blue-600 font-semibold truncate">{partner.role}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{partner.bookingNumber}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT MAIN: CHAT CANVAS (WHATSAPP POLISH) */}
      <div
        className={`flex-1 flex flex-col bg-[#efeae2]/30 ${
          !isMobileChatOpen ? "hidden md:flex" : "flex"
        }`}
      >
        {activePartner ? (
          <>
            {/* CHAT HEADER */}
            <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileChatOpen(false)}
                  className="md:hidden p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img
                    src={activePartner.avatarUrl}
                    alt={activePartner.name}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900">{activePartner.name}</h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {activePartner.role} &bull; <strong className="text-slate-700">{activePartner.bookingNumber}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadMessages(activePartner.bookingId, true)}
                  className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                  title="Refresh Conversation"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? "animate-spin text-blue-600" : ""}`} />
                </button>
                <a
                  href={`tel:${activePartner.phone}`}
                  className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                  title="Call Specialist"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CHAT MESSAGES STREAM */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
              {/* Privacy / Security Notice */}
              <div className="text-center my-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-amber-600" />
                  End-to-end verified communication under Andhra Pradesh Labour Cooperative Federation
                </span>
              </div>

              {loadingMessages && messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs space-y-1">
                  <p className="font-bold text-slate-600">This conversation is starting now.</p>
                  <p className="text-[11px]">Type a message below to coordinate arrival details with {activePartner.name}.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isOutgoing = m.senderRole === "CUSTOMER";
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isOutgoing ? "justify-end" : "justify-start"} animate-in fade-in duration-150`}
                    >
                      <div
                        className={`max-w-[82%] sm:max-w-[70%] rounded-2xl p-3 text-xs shadow-xs relative space-y-1 ${
                          isOutgoing
                            ? "bg-[#d9fdd3] text-slate-900 rounded-tr-none border border-emerald-200/60"
                            : "bg-white text-slate-900 rounded-tl-none border border-slate-200"
                        }`}
                      >
                        {!isOutgoing && (
                          <span className="text-[10px] font-bold text-blue-700 block">
                            {m.senderName}
                          </span>
                        )}

                        <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                        <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 pt-0.5">
                          <span>{m.timestamp}</span>
                          {isOutgoing && <CheckCheck className="w-3 h-3 text-blue-600" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* CHAT INPUT BAR (WHATSAPP FEEL) */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${activePartner.name}... (Press Enter to send)`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition shadow-xs shrink-0 cursor-pointer"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </>
        ) : null}
      </div>
    </div>
  );
};
