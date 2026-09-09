import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";
import { CoopnexLogo } from "../brand/CoopnexLogo";
import { LanguageDropdown } from "../LanguageDropdown";
import { CustomerLocationModal } from "../CustomerLocationModal";
import {
  LayoutDashboard,
  Search,
  CalendarCheck,
  MessageSquare,
  Bell,
  CreditCard,
  Heart,
  Zap,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  X,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Phone,
  Radio,
  SlidersHorizontal
} from "lucide-react";

export interface CustomerNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  emergency?: boolean;
}

interface CustomerAppShellProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  children: React.ReactNode;
  unreadNotificationsCount?: number;
  activeBookingsCount?: number;
}

export const CustomerAppShell: React.FC<CustomerAppShellProps> = ({
  activeTab,
  onTabChange,
  searchQuery = "",
  onSearchChange,
  children,
  unreadNotificationsCount = 0,
  activeBookingsCount = 0
}) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Navigation State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(unreadNotificationsCount);

  // Active Pincode & Area
  const [activeArea, setActiveArea] = useState(() => {
    return localStorage.getItem("coopnex_customer_area") || "Benz Circle";
  });
  const [activePincode, setActivePincode] = useState(() => {
    return localStorage.getItem("coopnex_customer_pincode") || user?.pincode || "520010";
  });

  const notifRef = useRef<HTMLDivElement>(null);

  // Synchronize area/pincode from storage
  useEffect(() => {
    const handleStorage = () => {
      const a = localStorage.getItem("coopnex_customer_area");
      const p = localStorage.getItem("coopnex_customer_pincode");
      if (a) setActiveArea(a);
      if (p) setActivePincode(p);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fetch notifications
  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate("/login");
  };

  // Nav items definition
  const navItems: CustomerNavItem[] = [
    { id: "dashboard", label: t("nav.dashboard", "Dashboard"), icon: LayoutDashboard },
    { id: "browse", label: t("nav.find_workers", "Find Workers"), icon: Search },
    {
      id: "bookings",
      label: t("nav.bookings", "My Bookings"),
      icon: CalendarCheck,
      badge: activeBookingsCount > 0 ? activeBookingsCount : undefined,
      badgeColor: "bg-blue-600 text-white"
    },
    { id: "messages", label: t("nav.messages", "Messages"), icon: MessageSquare },
    {
      id: "notifications",
      label: t("nav.notifications", "Notifications"),
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: "bg-amber-500 text-white"
    },
    { id: "payments", label: t("nav.payments", "Payments & Escrow"), icon: CreditCard },
    { id: "favorites", label: t("nav.favorites", "Saved Artisans"), icon: Heart },
    {
      id: "emergency",
      label: t("nav.emergency", "SOS Emergency"),
      icon: Zap,
      emergency: true,
      badge: "15m SLA",
      badgeColor: "bg-rose-600 text-white animate-pulse"
    },
    { id: "profile", label: t("nav.profile", "Citizen Profile"), icon: User },
    { id: "settings", label: t("nav.settings", "Settings"), icon: Settings }
  ];

  // Mobile Bottom Navigation Primary Items
  const mobileNavItems = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "browse", label: "Find", icon: Search },
    { id: "bookings", label: "Bookings", icon: CalendarCheck, badge: activeBookingsCount },
    { id: "emergency", label: "SOS", icon: Zap, emergency: true },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Location Modal */}
      <CustomerLocationModal
        isOpen={locationModalOpen}
        activeArea={activeArea}
        activePincode={activePincode}
        onClose={() => setLocationModalOpen(false)}
        onSelectArea={(area: string, pin: string) => {
          setActiveArea(area);
          setActivePincode(pin);
          localStorage.setItem("coopnex_customer_area", area);
          localStorage.setItem("coopnex_customer_pincode", pin);
          setLocationModalOpen(false);
        }}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center">
              {t("auth.sign_out_confirm_title", "Sign out of COOPNEX?")}
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              {t("auth.sign_out_confirm_desc", "You will need to sign in again to view your bookings and contact artisans.")}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 transition"
              >
                {t("common.cancel", "Cancel")}
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white shadow-sm transition"
              >
                {t("auth.sign_out", "Sign Out")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPBAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <CoopnexLogo size="sm" />
              <div className="hidden sm:block">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] block leading-tight">
                  Citizen Portal
                </span>
                <span className="text-xs font-bold text-slate-600 leading-none">
                  Andhra Pradesh Federation
                </span>
              </div>
            </div>
          </div>

          {/* Center: Global Search & Location Selector */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                  if (activeTab !== "browse" && e.target.value.trim().length > 0) {
                    onTabChange("browse");
                  }
                }}
                placeholder={t("customer.search_placeholder", "Search verified electricians, plumbers, carpenters...")}
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Location detector badge */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#2563EB] rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shadow-2xs"
              title="Change detected district/pincode"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="max-w-[120px] truncate">{activeArea}</span>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-200/60 px-1.5 py-0.5 rounded">
                {activePincode}
              </span>
            </button>
          </div>

          {/* Right: Language Dropdown, Notification Bell, Profile quick pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <LanguageDropdown />
            </div>

            {/* Notification Drawer Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-[10px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#2563EB]" />
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-[#2563EB] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 my-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No new notifications
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n._id}
                          className={`py-2.5 px-1 text-xs ${n.read ? "opacity-70" : "font-medium"}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-slate-800 leading-snug">{n.title || n.message}</p>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recent"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      onTabChange("notifications");
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <button
              onClick={() => onTabChange("profile")}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center">
                {user?.name?.charAt(0) || "C"}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[100px]">
                  {user?.name || "Citizen"}
                </span>
                <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 gap-6">
        {/* DESKTOP LEFT SIDEBAR */}
        <aside
          className={`hidden lg:flex flex-col shrink-0 transition-all duration-200 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
            {/* Citizen Profile Card in Sidebar */}
            {!isCollapsed ? (
              <div className="p-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50 rounded-2xl border border-blue-100 mb-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
                    {user?.name?.charAt(0) || "C"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-extrabold text-slate-900 truncate">
                      {user?.name || "Citizen Consumer"}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {user?.phone || user?.email || "ID: CITIZEN-AP"}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md mt-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Aadhaar Linked
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {user?.name?.charAt(0) || "C"}
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition text-left cursor-pointer ${
                      item.emergency
                        ? isActive
                          ? "bg-rose-600 text-white shadow-sm"
                          : "text-rose-700 bg-rose-50/70 hover:bg-rose-100 border border-rose-200/80"
                        : isActive
                        ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                    title={item.label}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${item.emergency && !isActive ? "text-rose-600" : ""}`} />
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor || "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                title={t("auth.sign_out", "Sign Out")}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{t("auth.sign_out", "Sign Out")}</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE SLIDE-OVER DRAWER */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex">
            <div className="bg-white w-72 max-w-[80vw] h-full p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <CoopnexLogo size="sm" />
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="my-4 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-extrabold text-slate-900">{user?.name || "Citizen"}</p>
                  <p className="text-[10px] text-slate-500">{activeArea} (PIN: {activePincode})</p>
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setLocationModalOpen(true);
                    }}
                    className="mt-2 text-[10px] font-bold text-[#2563EB] hover:underline block cursor-pointer"
                  >
                    Change Pincode →
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs text-left cursor-pointer ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : item.emergency
                            ? "bg-rose-50 text-rose-700"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex justify-center">
                  <LanguageDropdown />
                </div>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-xl cursor-pointer"
                >
                  {t("auth.sign_out", "Sign Out")}
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
                item.emergency
                  ? "text-rose-600 font-extrabold"
                  : isActive
                  ? "text-[#2563EB] font-black"
                  : "text-slate-500 font-medium hover:text-slate-900"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.emergency ? "animate-pulse text-rose-600" : ""}`} />
                {Boolean(item.badge) && Number(item.badge) > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
