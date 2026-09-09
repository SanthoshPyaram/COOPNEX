import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Booking, WorkerProfile } from "../../types";
import {
  MessageSquare,
  Send,
  Phone,
  Clock,
  MapPin,
  CheckCheck,
  User,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  ArrowLeft
} from "lucide-react";

interface CustomerMessagesViewProps {
  bookings: Booking[];
  workers: WorkerProfile[];
  onNavigateToBrowse: () => void;
}

interface ChatMessage {
  id: string;
  sender: "customer" | "worker";
  text: string;
  timestamp: string;
}

export const CustomerMessagesView: React.FC<CustomerMessagesViewProps> = ({
  bookings,
  workers,
  onNavigateToBrowse
}) => {
  const { t } = useTranslation();

  // Available conversation targets (from bookings or verified workers)
  const conversationPartners = React.useMemo(() => {
    const list: {
      id: string;
      bookingId?: string;
      name: string;
      role: string;
      phone: string;
      avatarUrl?: string;
      status?: string;
      lastMessage: string;
      lastTime: string;
      unread: boolean;
    }[] = [];

    // Add booked workers first
    bookings.forEach((b) => {
      const wId = typeof b.workerId === "string" ? b.workerId : (b.workerId as any)?._id || b._id;
      const workerMatch = workers.find((w) => w._id === wId || (w as any).id === wId);
      list.push({
        id: wId,
        bookingId: b._id,
        name: workerMatch?.name || (b as any).workerName || "Assigned Artisan",
        role: b.serviceCategory || "Cooperative Technician",
        phone: workerMatch?.phone || "+91 98765 43210",
        avatarUrl:
          workerMatch?.avatarUrl ||
          "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
        status: b.status,
        lastMessage: "I am en route to your location with diagnostic tools.",
        lastTime: "Just now",
        unread: false
      });
    });

    // If no bookings, provide default verified artisans for immediate communication
    if (list.length === 0) {
      list.push(
        {
          id: "demo-wrk-1",
          name: "Arjun Kumar (COOP-EMP-0001)",
          role: "NSQF Level-4 Master Electrician",
          phone: "+91 98480 12345",
          avatarUrl:
            "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
          status: "ASSIGNED",
          lastMessage: "Namaste! I have received your request. On the way.",
          lastTime: "10:14 AM",
          unread: true
        },
        {
          id: "demo-wrk-2",
          name: "Lakshmi Narayana (WRK-KYC-002)",
          role: "Certified Master Plumber",
          phone: "+91 98480 67890",
          avatarUrl:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
          status: "COMPLETED",
          lastMessage: "Service completed. Please let me know if any issue arises.",
          lastTime: "Yesterday",
          unread: false
        }
      );
    }

    return list;
  }, [bookings, workers]);

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    conversationPartners[0]?.id || "demo-wrk-1"
  );
  const [inputText, setInputText] = useState("");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const activePartner =
    conversationPartners.find((p) => p.id === selectedPartnerId) || conversationPartners[0];

  // Chat message history from localStorage
  const storageKey = `sahakari_chat_${activePartner?.bookingId || activePartner?.id || "default"}`;
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: "m-1",
        sender: "worker",
        text: `Namaste! I am ${activePartner?.name || "your assigned artisan"}. I have accepted the service order and will arrive promptly.`,
        timestamp: "10:15 AM"
      },
      {
        id: "m-2",
        sender: "customer",
        text: "Thank you. Please call when you arrive at the gate.",
        timestamp: "10:17 AM"
      },
      {
        id: "m-3",
        sender: "worker",
        text: "Sure, I have noted the address. See you shortly.",
        timestamp: "10:18 AM"
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        setMessages([
          {
            id: "m-1",
            sender: "worker",
            text: `Namaste! I am ${activePartner?.name || "your assigned artisan"}. I have accepted the service order and will arrive promptly.`,
            timestamp: "10:15 AM"
          },
          {
            id: "m-2",
            sender: "customer",
            text: "Thank you. Please call when you arrive at the gate.",
            timestamp: "10:17 AM"
          },
          {
            id: "m-3",
            sender: "worker",
            text: "Sure, I have noted the address. See you shortly.",
            timestamp: "10:18 AM"
          }
        ]);
      }
    } catch {
      // fallback
    }
  }, [selectedPartnerId, storageKey, activePartner?.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "customer",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInputText("");

    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // safe
    }

    // Auto-reply simulation from worker
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: "worker",
        text: "Noted! Thank you for the update. Arriving as scheduled.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => {
        const next = [...prev, replyMsg];
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // safe
        }
        return next;
      });
    }, 1500);
  };

  const quickChips = [
    t("messages.quick_cust_waiting", "We are waiting at the house"),
    t("messages.quick_security", "Please inform gate security for entry"),
    t("messages.quick_cust_doorbell", "Doorbell is active, please ring twice")
  ];

  return (
    <div className="w-full max-w-full min-w-0 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* 2-COLUMN CSS GRID FOR DESKTOP & TOGGLED VIEW FOR MOBILE */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(240px,300px)_minmax(0,1fr)] w-full min-w-0 h-[calc(100vh-13rem)] min-h-[580px] max-h-[760px]">
        {/* LEFT COLUMN: ACTIVE CHATS LIST */}
        <div
          className={`${
            isMobileChatOpen ? "hidden md:flex" : "flex"
          } flex-col w-full min-w-0 border-r border-slate-200 bg-slate-50/50 h-full overflow-hidden`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white shrink-0">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 truncate">
              <MessageSquare className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>{t("messages.artisan_chats", "Artisan Messages")}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {t("messages.artisan_chat_desc", "Direct chat with assigned cooperative artisans")}
            </p>
          </div>

          {/* Partner Items */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {conversationPartners.map((partner) => {
              const isSelected = partner.id === activePartner?.id;
              return (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => {
                    setSelectedPartnerId(partner.id);
                    setIsMobileChatOpen(true);
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-center gap-3 cursor-pointer min-w-0 ${
                    isSelected
                      ? "bg-blue-50 border border-blue-200 shadow-2xs"
                      : "hover:bg-slate-100 bg-white border border-transparent"
                  }`}
                >
                  <img
                    src={partner.avatarUrl}
                    alt={partner.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {partner.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{partner.lastTime}</span>
                    </div>
                    <p className="text-[11px] font-bold text-[#2563EB] truncate">{partner.role}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{partner.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CHAT CONVERSATION */}
        <div
          className={`${
            !isMobileChatOpen ? "hidden md:flex" : "flex"
          } flex-col flex-1 min-w-0 h-full bg-white overflow-hidden`}
        >
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setIsMobileChatOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 shrink-0 cursor-pointer"
                aria-label={t("messages.back_to_list", "Back to conversations")}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <img
                src={activePartner?.avatarUrl}
                alt={activePartner?.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-slate-200 shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {activePartner?.name}
                  </h4>
                  <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full shrink-0">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                    {t("common.verified", "Verified")}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{activePartner?.role}</p>
              </div>
            </div>

            {/* Actions: Call Artisan & Details */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${activePartner?.phone}`}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t("messages.call_artisan", "Call Artisan")}</span>
                <span className="sm:hidden">{t("common.call", "Call")}</span>
              </a>
            </div>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
            <div className="text-center my-2">
              <span className="text-[10px] font-mono text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                {t("messages.encrypted_notice", "Cooperative Field Dispatch Encrypted Chat")}
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender === "customer";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md p-3 sm:p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs ${
                      isMe
                        ? "bg-[#2563EB] text-white rounded-tr-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[9px] ${
                        isMe ? "text-blue-200" : "text-slate-400"
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Response Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto min-w-0 shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] font-medium text-slate-600 hover:text-[#2563EB] hover:bg-blue-50 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Composer Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={t("messages.type_placeholder_customer", "Type message to assigned artisan...")}
              className="flex-1 bg-slate-100 focus:bg-white text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 outline-hidden transition text-slate-900 placeholder-slate-400 min-w-0"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer shrink-0"
              aria-label={t("messages.send", "Send")}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
