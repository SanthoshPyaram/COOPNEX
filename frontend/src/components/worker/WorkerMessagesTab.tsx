import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Booking } from "../../types";
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
  ArrowLeft
} from "lucide-react";

interface WorkerMessagesTabProps {
  jobs: Booking[];
}

interface ChatMessage {
  id: string;
  sender: "customer" | "worker";
  text: string;
  timestamp: string;
}

export const WorkerMessagesTab: React.FC<WorkerMessagesTabProps> = ({ jobs }) => {
  const { t } = useTranslation();

  const customerConversations = React.useMemo(() => {
    if (jobs && jobs.length > 0) {
      return jobs.map((job) => ({
        id: job._id,
        bookingId: job.bookingNumber || "BK-VJA-2026",
        customerName: job.customerName || "Citizen Customer",
        phone: job.customerPhone || "+91 98480 22341",
        service: job.serviceCategory || "Electrical Maintenance",
        address: job.serviceLocation?.address || "Benz Circle, Vijayawada",
        lastMessage: "Thank you for accepting. We are waiting at the house.",
        lastTime: "10:15 AM",
        status: job.status
      }));
    }

    return [
      {
        id: "demo-cust-1",
        bookingId: "BK-VJA-2026-801",
        customerName: "Smt. Priya Sharma",
        phone: "+91 98480 22341",
        service: "MCB Main Board Sparking",
        address: "Flat 402, Sri Sai Residency, Benz Circle",
        lastMessage: "Please call when you reach the gate security.",
        lastTime: "Just now",
        status: "ASSIGNED"
      },
      {
        id: "demo-cust-2",
        bookingId: "BK-VJA-2026-794",
        customerName: "Sri K. Venkat Rao",
        phone: "+91 98480 33452",
        service: "AC 16A Power Circuit Wiring",
        address: "Gunadala Ring Road, Vijayawada",
        lastMessage: "Service finished nicely. Sent the 4-digit OTP.",
        lastTime: "Yesterday",
        status: "COMPLETED"
      }
    ];
  }, [jobs]);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customerConversations[0]?.id || "demo-cust-1"
  );
  const [inputText, setInputText] = useState("");
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

  const activeCustomer =
    customerConversations.find((c) => c.id === selectedCustomerId) || customerConversations[0];

  const storageKey = `sahakari_worker_chat_${activeCustomer?.id || "default"}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const s = localStorage.getItem(storageKey);
      if (s) return JSON.parse(s);
    } catch {
      // safe
    }
    return [
      {
        id: "m-1",
        sender: "customer",
        text: "Namaste Arjun garu. The kitchen MCB is tripping intermittently when we turn on the geyser.",
        timestamp: "10:10 AM"
      },
      {
        id: "m-2",
        sender: "worker",
        text: "Namaste! I have accepted your service dispatch. I am carrying the standard 32A replacement breaker and multimeter. Arriving in 12 minutes.",
        timestamp: "10:12 AM"
      },
      {
        id: "m-3",
        sender: "customer",
        text: "Great, please let security know you are visiting Flat 402.",
        timestamp: "10:14 AM"
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(storageKey);
      if (s) {
        setMessages(JSON.parse(s));
      } else {
        setMessages([
          {
            id: "m-1",
            sender: "customer",
            text: "Namaste! The service is requested at Flat 402.",
            timestamp: "10:10 AM"
          },
          {
            id: "m-2",
            sender: "worker",
            text: "Namaste! I am on the way with official cooperative toolkit.",
            timestamp: "10:12 AM"
          }
        ]);
      }
    } catch {
      // safe
    }
  }, [selectedCustomerId, storageKey]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "worker",
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

    // Customer automated response simulation
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: "customer",
        text: "Thank you Arjun. The doorbell is active, we are waiting.",
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
    }, 1400);
  };

  const quickChips = [
    t("messages.quick_arrived", "I have arrived at the location"),
    t("messages.quick_security", "Please inform gate security for entry"),
    t("messages.quick_5min", "Estimated arrival in 5 minutes"),
    t("messages.quick_otp", "Work completed. Please share the 4-digit OTP")
  ];

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setMobileShowChat(true);
  };

  return (
    <div className="w-full max-w-full min-w-0 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* DESKTOP SPLIT PANE GRID & MOBILE SELECTIVE VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(250px,320px)_minmax(0,1fr)] w-full min-w-0 h-[calc(100vh-13rem)] min-h-[580px] max-h-[760px]">
        {/* LEFT COLUMN: CONVERSATION ROSTER */}
        <div
          className={`${
            mobileShowChat ? "hidden md:flex" : "flex"
          } flex-col w-full min-w-0 border-r border-slate-200 bg-slate-50/50 h-full overflow-hidden`}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-white shrink-0">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 truncate">
              <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{t("messages.citizen_chats", "Citizen Chats")}</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {t("messages.direct_chat_desc", "Direct chat with customers for active jobs")}
            </p>
          </div>

          {/* Conversation Items List */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {customerConversations.map((cust) => {
              const isSelected = cust.id === activeCustomer?.id;
              return (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => handleSelectCustomer(cust.id)}
                  className={`w-full text-left p-3 rounded-2xl transition flex items-start gap-3 cursor-pointer min-w-0 ${
                    isSelected
                      ? "bg-blue-50 border border-blue-200 shadow-2xs"
                      : "hover:bg-slate-100 bg-white border border-transparent"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {cust.customerName.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {cust.customerName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{cust.lastTime}</span>
                    </div>
                    <p className="text-[11px] font-bold text-blue-600 truncate">{cust.service}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{cust.lastMessage}</p>
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
          } flex-col flex-1 min-w-0 h-full bg-white overflow-hidden`}
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
                {activeCustomer?.customerName.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {activeCustomer?.customerName}
                  </h4>
                  <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    UIDAI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {activeCustomer?.address} &bull; <span className="font-mono text-slate-400">#{activeCustomer?.bookingId}</span>
                </p>
              </div>
            </div>

            {/* Call Customer Action */}
            <a
              href={`tel:${activeCustomer?.phone}`}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{t("messages.call_customer", "Call Customer")}</span>
              <span className="sm:hidden">{t("common.call", "Call")}</span>
            </a>
          </div>

          {/* Messages Stream Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
            <div className="text-center my-2">
              <span className="text-[10px] font-mono text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                {t("messages.encrypted_notice", "Cooperative Field Dispatch Encrypted Chat")}
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender === "worker";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md p-3 sm:p-3.5 rounded-2xl text-xs space-y-1 shadow-2xs ${
                      isMe
                        ? "bg-blue-600 text-white rounded-tr-xs"
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

          {/* Quick Response Chips (Contained horizontally inside chat panel) */}
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
              placeholder={t("messages.type_placeholder_worker", "Type message to citizen customer...")}
              className="flex-1 bg-slate-100 focus:bg-white text-xs px-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition text-slate-900 placeholder-slate-400 min-w-0"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer shrink-0"
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
