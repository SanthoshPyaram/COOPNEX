import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { CoopnexLogo } from "../brand/CoopnexLogo";
import { LanguageDropdown } from "../LanguageDropdown";
import { HumanVisual } from "../HumanVisual";
import { AvatarPlaceholder } from "../common/AvatarPlaceholder";
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  TrendingUp,
  Wallet,
  MessageSquare,
  Bell,
  HeartHandshake,
  CreditCard,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  X,
  Search,
  CheckCircle2,
  Phone,
  Power,
  ShieldCheck,
  Clock,
  ChevronDown
} from "lucide-react";

export interface WorkerNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface WorkerAppShellProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isAvailable: boolean;
  onToggleAvailability: () => void;
  unreadNotificationsCount?: number;
  newRequestsCount?: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  children: React.ReactNode;
}

export const WorkerAppShell: React.FC<WorkerAppShellProps> = ({
  activeTab,
  onTabChange,
  isAvailable,
  onToggleAvailability,
  unreadNotificationsCount = 2,
  newRequestsCount = 1,
  searchQuery = "",
  onSearchChange,
  children
}) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const employeeId = (user as any)?.employeeId || (user as any)?.workerProfile?.employeeId || (user as any)?.workerProfile?.workerIdNumber || "COOP-WRK-MEMBER";
  const workerName = user?.name || "COOPNEX Member";
  const verificationStatus = (user as any)?.verificationStatus || (user as any)?.workerProfile?.verificationStatus || "PENDING";
  const verificationLevel = (user as any)?.verificationLevel || (user as any)?.workerProfile?.level || 1;
  const isVerified = verificationStatus === "VERIFIED" || verificationStatus === "APPROVED";
  const workerAvatarUrl = (user as any)?.avatarUrl || (user as any)?.profileImage || (user as any)?.workerProfile?.avatarUrl || (user as any)?.workerProfile?.profileImage;

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate("/worker/login");
  };

  const navItems: WorkerNavItem[] = [
    { id: "dashboard", label: t("worker_nav.dashboard", "Dashboard"), icon: LayoutDashboard },
    {
      id: "jobs",
      label: t("worker_nav.jobs", "Jobs"),
      icon: Briefcase,
      badge: newRequestsCount > 0 ? newRequestsCount : undefined,
      badgeColor: "bg-blue-600 text-white"
    },
    { id: "schedule", label: t("worker_nav.schedule", "Schedule"), icon: Calendar },
    { id: "earnings", label: t("worker_nav.earnings", "Earnings"), icon: TrendingUp },
    { id: "wallet", label: t("worker_nav.wallet", "Wallet"), icon: Wallet },
    { id: "messages", label: t("worker_nav.messages", "Messages"), icon: MessageSquare },
    {
      id: "notifications",
      label: t("worker_nav.notifications", "Notifications"),
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      badgeColor: "bg-amber-500 text-white"
    },
    { id: "welfare", label: t("worker_nav.welfare", "Welfare"), icon: HeartHandshake },
    { id: "smart-id", label: t("worker_nav.smart_id", "Smart ID"), icon: CreditCard },
    { id: "profile", label: t("worker_nav.profile", "Profile & KYC"), icon: User },
    { id: "settings", label: t("worker_nav.settings", "Settings"), icon: Settings }
  ];

  // Mobile Bottom Navigation
  const mobileNavItems = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "jobs", label: "Jobs", icon: Briefcase, badge: newRequestsCount },
    { id: "earnings", label: "Earnings", icon: TrendingUp },
    { id: "notifications", label: "Alerts", icon: Bell, badge: unreadNotificationsCount },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 text-center">
              Sign out of Worker Portal?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Your active status will be set to Offline while signed out.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white shadow-sm transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPBAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile toggle + Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 block leading-tight">
                  COOPNEX <span className="text-blue-600">WORKER</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 leading-none">
                  Command Center
                </span>
              </div>
            </div>
          </div>

          {/* Center: Search Jobs */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                  if (activeTab !== "jobs" && e.target.value.trim().length > 0) {
                    onTabChange("jobs");
                  }
                }}
                placeholder="Search jobs, customers, areas, booking IDs..."
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs pl-10 pr-4 py-2 rounded-xl border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right: Availability Toggle, Notifications, Language, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online / Offline Availability Toggle */}
            <button
              type="button"
              onClick={onToggleAvailability}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-2xs border cursor-pointer ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
              }`}
              title="Toggle field dispatch availability"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{isAvailable ? "Online" : "Offline"}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-[10px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900">Worker Alerts</h4>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {unreadNotificationsCount} pending
                    </span>
                  </div>
                  <div className="py-2 divide-y divide-slate-100 text-xs text-slate-700">
                    <div className="py-2">
                      <p className="font-bold text-slate-900">New Emergency Request</p>
                      <p className="text-[11px] text-slate-500">MCB Tripping at Benz Circle (₹800 wage)</p>
                    </div>
                    <div className="py-2">
                      <p className="font-bold text-slate-900">Instant DBT Settlement Credited</p>
                      <p className="text-[11px] text-slate-500">₹720 credited via IMPS to APGB account</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(false);
                      onTabChange("notifications");
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageDropdown />
            </div>

            {/* Worker Profile Pill */}
            <button
              type="button"
              onClick={() => onTabChange("profile")}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
            >
              <AvatarPlaceholder
                src={workerAvatarUrl}
                name={workerName}
                size="xs"
                shape="circle"
              />
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[90px]">
                  {workerName}
                </span>
                <span className="text-[9px] font-mono text-slate-400 block leading-none">
                  {employeeId}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER (SIDEBAR + CONTENT) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 gap-6">
        {/* DESKTOP LEFT SIDEBAR (~240px) */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
            {/* Worker Identity Card */}
            <div className="p-3 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 rounded-2xl border border-blue-100 mb-3 text-left">
              <div className="flex items-center gap-3">
                <AvatarPlaceholder
                  src={workerAvatarUrl}
                  name={workerName}
                  size="sm"
                  shape="rounded"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-extrabold text-slate-900 truncate">
                    {workerName}
                  </h3>
                  <p className="text-[10px] text-blue-600 font-mono font-bold truncate">
                    {employeeId}
                  </p>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-1">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Level {verificationLevel} Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mt-1">
                      <Clock className="w-2.5 h-2.5" />
                      {t("auth.verificationPending", "Verification Pending")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition text-left cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
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

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>{t("auth.sign_out", "Sign Out")}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex">
            <div className="bg-white w-72 max-w-[80vw] h-full p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span className="font-black text-sm text-slate-900">Worker Console</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="my-4 p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <AvatarPlaceholder
                    src={workerAvatarUrl}
                    name={workerName}
                    size="sm"
                    shape="rounded"
                  />
                  <div>
                    <p className="text-xs font-black text-slate-900">{workerName}</p>
                    <p className="text-[10px] font-mono text-blue-600">{employeeId}</p>
                    {isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded mt-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Level {verificationLevel} Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {t("auth.verificationPending", "Verification Pending")}
                      </span>
                    )}
                  </div>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs text-left cursor-pointer ${
                          isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
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
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
          </div>
        )}

        {/* MAIN PAGE CONTENT */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
                isActive ? "text-blue-600 font-black" : "text-slate-500 font-medium hover:text-slate-900"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
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

