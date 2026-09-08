import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { AdminCommandPalette } from "./AdminCommandPalette";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  CalendarCheck,
  Zap,
  CreditCard,
  HeartHandshake,
  MapPin,
  TrendingUp,
  ShieldAlert,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  LogOut,
  Sparkles,
  Shield,
  KeyRound,
  CheckCircle2,
  Menu,
  X,
  Lock
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

interface AdminShellProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  pendingKycCount?: number;
  criticalFraudCount?: number;
  activeEmergencyCount?: number;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  activeTab,
  onTabChange,
  children,
  pendingKycCount = 3,
  criticalFraudCount = 1,
  activeEmergencyCount = 2
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 13 Required SUPER_ADMIN Administrative Modules
  const navigationSections: NavSection[] = [
    {
      title: "OPERATIONS",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "mandate", label: "Admin Mandate", icon: Sparkles },
        { id: "workers", label: "Workers", icon: Users },
        {
          id: "kyc",
          label: "Verification",
          icon: ShieldCheck,
          badge: pendingKycCount > 0 ? pendingKycCount : undefined,
          badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
        },
        { id: "societies", label: "Cooperatives", icon: Building2 },
        { id: "bookings", label: "Bookings", icon: CalendarCheck },
        {
          id: "emergency",
          label: "Emergency Operations",
          icon: Zap,
          badge: activeEmergencyCount > 0 ? `${activeEmergencyCount} SOS` : undefined,
          badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300"
        }
      ]
    },
    {
      title: "FINANCE & WELFARE",
      items: [
        { id: "payments", label: "Payments & Escrow", icon: CreditCard },
        { id: "welfare", label: "Worker Welfare", icon: HeartHandshake },
        { id: "areas", label: "Service Areas", icon: MapPin }
      ]
    },
    {
      title: "INTELLIGENCE & TRUST",
      items: [
        { id: "ai", label: "AI Intelligence", icon: TrendingUp },
        {
          id: "security",
          label: "Security Center",
          icon: ShieldAlert,
          badge: criticalFraudCount > 0 ? "Alert" : undefined,
          badgeColor: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
        },
        { id: "audit", label: "Audit Logs", icon: FileText },
        { id: "settings", label: "System Settings", icon: Settings }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#0B1220] text-[#101828] dark:text-[#F8FAFC] flex font-sans antialiased transition-colors duration-200">
      {/* 1. COLLAPSIBLE DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#E4E9F0] dark:border-slate-800 bg-white dark:bg-[#101828] transition-all duration-200 z-30 select-none ${
          isSidebarCollapsed ? "w-[72px]" : "w-[250px]"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E4E9F0] dark:border-slate-800">
          {!isSidebarCollapsed ? (
            <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#075E54] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                SS
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white truncate">
                  COOPNEX
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight truncate">
                  Command Center
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-lg bg-[#075E54] text-white flex items-center justify-center font-black text-sm shadow-xs">
              SS
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Modules List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center rounded-xl transition-all duration-150 font-medium text-xs ${
                      isSidebarCollapsed ? "justify-center p-2.5" : "justify-between px-3 py-2"
                    } ${
                      isActive
                        ? "bg-[#075E54]/10 dark:bg-emerald-950/40 text-[#075E54] dark:text-emerald-400 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? "text-[#075E54] dark:text-emerald-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isSidebarCollapsed && item.badge && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E4E9F0] dark:border-slate-800 space-y-2">
          {!isSidebarCollapsed && (
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-mono">Role:</span>
              <span className="font-bold text-[#075E54] dark:text-emerald-400 font-mono text-[10px]">
                SUPER_ADMIN
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition p-2 ${
              isSidebarCollapsed ? "justify-center" : "gap-2.5"
            }`}
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP COMMAND BAR */}
        {!isFocusMode && (
          <header className="h-16 border-b border-[#E4E9F0] dark:border-slate-800 bg-white dark:bg-[#101828] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
            {/* Mobile Menu Toggle & Command Center Title */}
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="hidden xl:block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  COOPNEX COMMAND
                </span>
              </div>

              {/* Global Search Button */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition group"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  <span className="truncate">Search workers, bookings, societies, logs...</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-500">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Right Controls: System Status, Notifications, Dark Mode, Focus Mode, Profile */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* System Operational Status Pill */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Operational</span>
              </div>

              {/* Focus Mode Toggle */}
              <button
                onClick={() => setIsFocusMode(!isFocusMode)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                title="Toggle Focus Mode"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notifications Popover */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {pendingKycCount + criticalFraudCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#101828] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span>Security &amp; Operations Alerts</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Real-time</span>
                    </div>

                    <div
                      onClick={() => {
                        onTabChange("kyc");
                        setIsNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-start gap-2.5 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {pendingKycCount} KYC Dossiers Pending
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Police clearance &amp; Aadhaar verification awaiting review.
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        onTabChange("security");
                        setIsNotificationsOpen(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-start gap-2.5 transition"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Security Alert: Collision Flagged
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Hardware device IMEI collision detected across accounts.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Administrator Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#075E54] text-white font-bold flex items-center justify-center text-xs">
                    SA
                  </div>
                  <div className="hidden sm:block text-left text-xs pr-1">
                    <div className="font-bold text-slate-900 dark:text-white leading-tight">
                      Administrator
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold leading-tight">
                      SUPER_ADMIN
                    </div>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#101828] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs space-y-3">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div className="font-bold text-slate-900 dark:text-white">
                        Master Administrator
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        super.admin@coopnex.org
                      </div>
                      <div className="mt-1.5 inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                        Privilege: SUPER_ADMIN
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          onTabChange("security");
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Security Center &amp; MFA</span>
                      </button>
                      <button
                        onClick={() => {
                          onTabChange("audit");
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Audit Timeline</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Exit Focus Mode Floating Pill */}
        {isFocusMode && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={() => setIsFocusMode(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-slate-800 transition"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Focus Mode</span>
            </button>
          </div>
        )}

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* 3. COMMAND PALETTE MODAL */}
      <AdminCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={(tab) => {
          onTabChange(tab);
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* 4. MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            />

            {/* Slide-out Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative w-72 max-w-[85vw] bg-white dark:bg-[#101828] h-full shadow-2xl flex flex-col z-10 border-r border-[#E4E9F0] dark:border-slate-800"
            >
              <div className="h-16 px-4 flex items-center justify-between border-b border-[#E4E9F0] dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#075E54] text-white flex items-center justify-center font-black text-sm shadow-xs">
                    SS
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      COOPNEX
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      SUPER_ADMIN
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
                {navigationSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                      {section.title}
                    </div>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onTabChange(item.id);
                            setIsMobileNavOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium text-xs ${
                            isActive
                              ? "bg-[#075E54]/10 dark:bg-emerald-950/40 text-[#075E54] dark:text-emerald-400 font-bold"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-4 h-4 ${
                                isActive ? "text-[#075E54] dark:text-emerald-400" : "text-slate-400"
                              }`}
                            />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-[#E4E9F0] dark:border-slate-800 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 p-2.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
