import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  CalendarCheck,
  Zap,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Activity,
  FileText,
  Settings,
  ArrowRight,
  Sparkles,
  Command,
  X
} from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Workforce" | "Operations" | "Finance" | "System";
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
  meta?: string;
}

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const AdminCommandPalette: React.FC<AdminCommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems: CommandItem[] = [
    {
      id: "nav-command",
      title: "Operations Command Center",
      category: "Navigation",
      shortcut: "G D",
      icon: LayoutDashboard,
      onSelect: () => onNavigateTab("command"),
      meta: "KPIs, 3D Cooperative Network, Live Alerts"
    },
    {
      id: "nav-mandate",
      title: "What Does Admin Do? (Administrative Mandate)",
      category: "Navigation",
      shortcut: "G M",
      icon: Sparkles,
      onSelect: () => onNavigateTab("mandate"),
      meta: "6 Core Super Admin Responsibilities, Verification, 100% Escrow, SOS Dispatch"
    },
    {
      id: "nav-kyc",
      title: "Worker KYC & Verification",
      category: "Workforce",
      shortcut: "G K",
      icon: ShieldCheck,
      onSelect: () => onNavigateTab("kyc"),
      meta: "Police Clearance, Aadhaar Verhoeff, Dossier Scrutiny"
    },
    {
      id: "nav-workers",
      title: "Artisans & Workforce Registry",
      category: "Workforce",
      shortcut: "G W",
      icon: Users,
      onSelect: () => onNavigateTab("workers"),
      meta: "Tier progression, availability, trade skills"
    },
    {
      id: "nav-societies",
      title: "Cooperative Societies & 9 Districts",
      category: "Operations",
      shortcut: "G S",
      icon: Building2,
      onSelect: () => onNavigateTab("societies"),
      meta: "Primary Societies, SLA, District Overhead"
    },
    {
      id: "nav-emergency",
      title: "Emergency Dispatch Command",
      category: "Operations",
      shortcut: "G E",
      icon: Zap,
      onSelect: () => onNavigateTab("emergency"),
      meta: "7-minute SOS routing, nearest worker beacons"
    },
    {
      id: "nav-payments",
      title: "Payments & Escrow Accounting",
      category: "Finance",
      shortcut: "G P",
      icon: CreditCard,
      onSelect: () => onNavigateTab("payments"),
      meta: "100% Base wage payout, 2% welfare corpus"
    },
    {
      id: "nav-fraud",
      title: "Fraud Detection Sentinel",
      category: "System",
      shortcut: "G F",
      icon: AlertTriangle,
      onSelect: () => onNavigateTab("fraud"),
      meta: "Graph anomalies, duplicate accounts, device collisions"
    },
    {
      id: "nav-ai",
      title: "AI Demand & Workforce Allocation",
      category: "System",
      shortcut: "G A",
      icon: TrendingUp,
      onSelect: () => onNavigateTab("ai"),
      meta: "3D Demand Forecast, capacity optimization"
    },
    {
      id: "nav-health",
      title: "System Services Health",
      category: "System",
      shortcut: "G H",
      icon: Activity,
      onSelect: () => onNavigateTab("health"),
      meta: "API, Database, WebSocket, Payment Gateways"
    },
    {
      id: "nav-audit",
      title: "Security & Audit Trail",
      category: "System",
      shortcut: "G L",
      icon: FileText,
      onSelect: () => onNavigateTab("audit"),
      meta: "Administrator action timestamps, IP records"
    }
  ];

  const filteredItems = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.meta && item.meta.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-white dark:bg-[#101828] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
          >
            {/* Top Search Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
              <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search workers, societies, logs..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden font-medium"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500">
                  No matching operations or modules found for "{query}".
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs ${
                        isSelected
                          ? "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-[#075E54] text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{item.title}</div>
                          {item.meta && (
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                              {item.meta}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.shortcut && (
                          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500">
                            {item.shortcut}
                          </kbd>
                        )}
                        <ArrowRight
                          className={`w-3.5 h-3.5 ${
                            isSelected ? "text-[#075E54] dark:text-emerald-400" : "opacity-0"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Guidance */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                    ↑↓
                  </kbd>{" "}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                    ↵
                  </kbd>{" "}
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                    Esc
                  </kbd>{" "}
                  Dismiss
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                COOPNEX OPERATIONS
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

