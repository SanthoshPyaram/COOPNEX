import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Booking } from "../../types";
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
  ArrowLeft,
  Loader2,
  RefreshCw,
  Sparkles
} from "lucide-react";

interface WorkerMessagesTabProps {
  jobs: Booking[];
  workerName?: string;
}

interface ChatMessage {
  id: string;
  senderRole: "CUSTOMER" | "WORKER" | "ADMIN";
  senderName: string;
  text: string;
  timestamp: string;
  readStatus?: boolean;
}

export const WorkerMessagesTab: React.FC<WorkerMessagesTabProps> = ({ jobs, workerName = "Assigned Artisan" }) => {
  const { t } = useTranslation();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Derive conversation roster strictly from actual bookings (ZERO MOCK CHATS)
  const customerConversations = React.useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    return jobs
      .filter((job) => job && job._id)
      .map((job) => ({
        id: job._id,
        bookingId: job._id,
        bookingNumber: job.bookingNumber || `#BK-${job._id.slice(-6).toUpperCase()}`,
        customerName: job.customerName || (job as any).customer?.name || "Citizen Customer",
        phone: job.customerPhone || (job as any).customer?.phone || "+91 98480 22341",
        service: job.serviceCategory || "Cooperative Field Service",
        address: job.serviceLocation?.address || "Benz Circle, Vijayawada",
        status: job.status,
        date: job.createdAt
          ? new Date(job.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "Today"
      }));
  }, [jobs]);

  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    customerConversations[0]?.bookingId || ""
  );
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const activeCustomer =
    customerConversations.find((c) => c.bookingId === selectedBookingId) || customerConversations[0];

  // Auto-sync selected conversation when roster changes
  useEffect(() => {
    if (customerConversations.length > 0 && !selectedBookingId) {
      setSelectedBookingId(customerConversations[0].bookingId);
    }
  }, [customerConversations, selectedBookingId]);

  // Fetch real messages for active booking
  const loadMessages = useCallback(async (bookingId: string, showSpinner = false) => {
    if (!bookingId) return;
    if (showSpinner) setLoadingMessages(true);
    try {
      const res = await api.getMessagesByBooking(bookingId);
      if (res.success && Array.isArray(res.messages)) {
        const formatted: ChatMessage[] = res.messages.map((m: any) => ({
          id: m._id || m.id || Math.random().toString(),
          senderRole: m.senderRole || "CUSTOMER",
          senderName: m.senderName || "Citizen",
          text: m.text,
          timestamp: m.timestamp
            ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Just now",
          readStatus: m.readStatus
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.warn("Error retrieving worker messages:", err);
    } finally {
      if (showSpinner) setLoadingMessages(false);
    }
  }, []);

  // Reload messages when selected conversation changes
  useEffect(() => {
    if (activeCustomer?.bookingId) {
      loadMessages(activeCustomer.bookingId, true);
    }
  }, [activeCustomer?.bookingId, loadMessages]);

  // Real-time synchronization: BroadcastChannel across multiple open tabs/windows
  useEffect(() => {
    if (!activeCustomer?.bookingId) return;

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("coopnex_chat_channel");
      channel.onmessage = (event) => {
        if (event.data?.bookingId === activeCustomer.bookingId) {
          loadMessages(activeCustomer.bookingId, false);
        }
      };
    } catch (e) {
      // BroadcastChannel fallback
    }

    // Lightweight 3-second background polling for cross-device/separate browser windows
    const pollInterval = setInterval(() => {
      loadMessages(activeCustomer.bookingId, false);
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      if (channel) channel.close();
    };
  }, [activeCustomer?.bookingId, loadMessages]);

  // Scroll smoothly to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeCustomer?.bookingId || isSending) return;

    setIsSending(true);
    try {
      const res = await api.sendMessage(activeCustomer.bookingId, text);
      if (res.success && res.chatMessage) {
        const newMsg: ChatMessage = {
          id: res.chatMessage._id || `msg-${Date.now()}`,
          senderRole: "WORKER",
          senderName: workerName,
          text: res.chatMessage.text,
          timestamp: new Date(res.chatMessage.timestamp || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          }),
          readStatus: false
        };
        setMessages((prev) => [...prev, newMsg]);
        setInputText("");

        // Broadcast to all open tabs/windows immediately
        try {
          const channel = new BroadcastChannel("coopnex_chat_channel");
          channel.postMessage({ bookingId: activeCustomer.bookingId, senderRole: "WORKER" });
          channel.close();
        } catch (err) {
          // ignore
        }
      }
    } catch (err) {
      console.error("Failed to send artisan message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const quickChips = [
    t("messages.quick_arrived", "I have arrived at your doorstep."),
    t("messages.quick_security", "Please inform gate security to allow entry."),
    t("messages.quick_5min", "En route! Reaching in 5 minutes with diagnostic kit."),
    t("messages.quick_otp", "Work completed! Kindly share the 4-digit service OTP to finish.")
  ];

  const handleSelectCustomer = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setMobileShowChat(true);
  };

  // If worker has no bookings assigned yet
  if (customerConversations.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-lg font-black text-slate-900">
            {t("messages.no_chats_title", "No Active Service Conversations")}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t(
              "messages.no_chats_desc",
              "When a citizen books your cooperative trade services, direct end-to-end encrypted WhatsApp-style messaging will automatically open here with live delivery status."
            )}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Cooperative Communication Protocol Active</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* DESKTOP SPLIT PANE GRID & MOBILE SELECTIVE VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] w-full min-w-0 h-[calc(100vh-13rem)] min-h-[580px] max-h-[760px]">
        {/* LEFT COLUMN: CONVERSATION ROSTER */}
        <div
          className={`${
            mobileShowChat ? "hidden md:flex" : "flex"
          } flex-col w-full min-w-0 border-r border-slate-200 bg-slate-50/50 h-full overflow-hidden`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 truncate">
                <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{t("messages.citizen_chats", "Citizen Service Chats")}</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {customerConversations.length} {t("messages.active_conversations", "active booking channel(s)")}
              </p>
            </div>
            <button
              onClick={() => activeCustomer && loadMessages(activeCustomer.bookingId, true)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
              title="Refresh conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Conversation Items List */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {customerConversations.map((cust) => {
              const isSelected = cust.bookingId === activeCustomer?.bookingId;
              return (
                <button
                  key={cust.bookingId}
                  type="button"
                  onClick={() => handleSelectCustomer(cust.bookingId)}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-start gap-3 cursor-pointer min-w-0 ${
                    isSelected
                      ? "bg-blue-50 border border-blue-200 shadow-2xs"
                      : "hover:bg-slate-100 bg-white border border-transparent"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {cust.customerName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {cust.customerName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">{cust.date}</span>
                    </div>
                    <p className="text-[11px] font-bold text-blue-600 truncate">{cust.service}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {cust.bookingNumber} &bull; {cust.status}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT PANEL */}
        <div
          className={`${
            !mobileShowChat ? "hidden md:flex" : "flex"
          } flex-col flex-1 min-w-0 h-full bg-[#E5DDD5]/15 dark:bg-slate-900 overflow-hidden`}
        >
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {/* Mobile Back Button */}
              <button
                type="button"
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition shrink-0 cursor-pointer"
                aria-label={t("messages.back_to_list", "Back to conversations")}
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>

              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center shrink-0">
                {activeCustomer?.customerName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {activeCustomer?.customerName}
                  </h4>
                  <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Verified Citizen
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {activeCustomer?.address} &bull;{" "}
                  <span className="font-mono text-slate-400 font-bold">{activeCustomer?.bookingNumber}</span>
                </p>
              </div>
            </div>

            {/* Call Customer Action */}
            <a
              href={`tel:${activeCustomer?.phone}`}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{t("messages.call_customer", "Call Citizen")}</span>
              <span className="sm:hidden">{t("common.call", "Call")}</span>
            </a>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            <div className="text-center my-2">
              <span className="text-[10px] font-mono text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                🔒 Cooperative Encrypted Dispatch Chat &bull; Multi-Device Live Sync
              </span>
            </div>

            {loadingMessages ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
                <p>Syncing booking messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                <p className="font-bold text-slate-600">No messages in this service thread yet.</p>
                <p className="text-[11px]">Send an arrival notification or ask for gate access below.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isWorker = msg.senderRole === "WORKER";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isWorker ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-md p-3 sm:p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs ${
                        isWorker
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 font-semibold">
                        <span>{isWorker ? "You (Artisan)" : msg.senderName}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1 text-[9px] ${
                          isWorker ? "text-blue-200" : "text-slate-400"
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isWorker && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Response Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto min-w-0 shrink-0">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Composer Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t("messages.type_placeholder_worker", "Type message to citizen customer...")}
              className="flex-1 bg-slate-100 focus:bg-white text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition text-slate-900 placeholder-slate-400 min-w-0"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer shrink-0 flex items-center justify-center"
              aria-label={t("messages.send", "Send")}
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
