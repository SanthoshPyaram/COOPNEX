import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  MapPin,
  Zap,
  User,
  LogOut,
  FileText,
  CheckCircle2,
  Bell,
  ShieldCheck,
  ChevronDown,
  X,
  CreditCard,
  AlertTriangle,
  Sparkles,
  Menu
} from "lucide-react";
import { CoopnexLogo } from "./brand/CoopnexLogo";
import { LanguageDropdown } from "./LanguageDropdown";
import { CustomerLocationModal } from "./CustomerLocationModal";

export const CustomerNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Selected Local Area
  const [activeArea, setActiveArea] = useState(() => {
    return localStorage.getItem("coopnex_customer_area") || "Benz Circle";
  });
  const [activePincode, setActivePincode] = useState(() => {
    return localStorage.getItem("coopnex_customer_pincode") || user?.pincode || "520010";
  });
  const [customPincodeInput, setCustomPincodeInput] = useState("");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Load Notifications
  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res.success && Array.isArray(res.notifications)) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      console.warn("Could not load notifications:", e);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
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

  const handleMarkSingleRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectArea = (area: string, pincode: string) => {
    setActiveArea(area);
    setActivePincode(pincode);
    localStorage.setItem("coopnex_customer_area", area);
    localStorage.setItem("coopnex_customer_pincode", pincode);
    setLocationModalOpen(false);
  };

  const predefinedAreas = [
    { name: "Benz Circle", pincode: "520010", ward: "Central Hub" },
    { name: "Governorpet", pincode: "520002", ward: "Commercial District" },
    { name: "Patamata", pincode: "520010", ward: "East Sector" },
    { name: "One Town", pincode: "520001", ward: "Heritage Ward" },
    { name: "Bhavanipuram", pincode: "520012", ward: "West Gateway" },
    { name: "Gollapudi", pincode: "521225", ward: "Suburban Hub" }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Location Pill */}
          <div className="flex items-center gap-3">
            {/* Citizen Portal Badge */}
            <Link to="/app" className="flex items-center gap-2 group shrink-0">
              <CoopnexLogo variant="full" size="sm" />
              <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider hidden sm:inline">
                Citizen Portal
              </span>
            </Link>

            {/* Interactive Location Selector Button */}
            <button
              onClick={() => setLocationModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200/80 transition cursor-pointer font-semibold shadow-xs"
              title="Click to switch location/pincode"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span className="font-bold truncate max-w-[140px] sm:max-w-[170px]">
                {user?.district || "Vijayawada"} • {activeArea}
              </span>
              <ChevronDown className="w-3 h-3 text-[#2563EB] opacity-70" />
            </button>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <button
              onClick={() => setSearchParams({ tab: "dashboard" })}
              className={`px-4 py-2 rounded-full transition cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                  : "hover:text-[#2563EB] hover:bg-blue-50/70"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSearchParams({ tab: "browse" })}
              className={`px-4 py-2 rounded-full transition cursor-pointer ${
                activeTab === "browse"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                  : "hover:text-[#2563EB] hover:bg-blue-50/70"
              }`}
            >
              Browse Specialists
            </button>
            <button
              onClick={() => setSearchParams({ tab: "bookings" })}
              className={`px-4 py-2 rounded-full transition cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                  : "hover:text-[#2563EB] hover:bg-blue-50/70"
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setSearchParams({ tab: "profile" })}
              className={`px-4 py-2 rounded-full transition cursor-pointer ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                  : "hover:text-[#2563EB] hover:bg-blue-50/70"
              }`}
            >
              Profile &amp; Settings
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Urgent Help Button */}
            <button
              onClick={() => setSearchParams({ tab: "emergency" })}
              className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-[#F43F5E] border border-rose-200 text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-[#F43F5E] animate-bounce" />
              <span className="hidden xs:inline">Emergency</span> 7m
            </button>

            {/* Global Language Selector */}
            <div className="hidden sm:block">
              <LanguageDropdown variant="pill" />
            </div>

            {/* Notification Center */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-2 rounded-full text-slate-600 hover:text-[#2563EB] hover:bg-blue-50 transition cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 text-xs animate-fadeIn">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                      <p className="text-[10px] text-slate-500">Real-time cooperative service alerts</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400">
                        <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleMarkSingleRead(n._id)}
                          className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 items-start ${
                            !n.read ? "bg-blue-50/40" : ""
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {n.type === "BOOKING" && (
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {n.type === "PAYMENT" && (
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <CreditCard className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {n.type === "EMERGENCY" && (
                              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {n.type === "SYSTEM" && (
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center">
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </div>
                            )}
                            {n.type === "WORKER" && (
                              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`font-bold truncate ${!n.read ? "text-slate-900" : "text-slate-700"}`}>
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-100 hover:bg-blue-50 rounded-full border border-slate-200 transition cursor-pointer"
                title="Account Menu"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user?.name ? user.name[0].toUpperCase() : "C"}
                </div>
                <span className="text-xs font-bold text-slate-900 hidden sm:block pr-2">
                  {user?.name || "Customer"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block pr-1" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-fadeIn">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user?.name || "Customer User"}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Citizen Member
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setSearchParams({ tab: "profile" });
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] transition cursor-pointer font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile &amp; Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setSearchParams({ tab: "bookings" });
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] transition cursor-pointer font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    <span>My Bookings</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-2 text-xs font-bold animate-fadeIn">
            <button
              onClick={() => {
                setSearchParams({ tab: "dashboard" });
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl transition ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs"
                  : "text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setSearchParams({ tab: "browse" });
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl transition ${
                activeTab === "browse"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs"
                  : "text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
              }`}
            >
              Browse Specialists
            </button>
            <button
              onClick={() => {
                setSearchParams({ tab: "bookings" });
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl transition ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs"
                  : "text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => {
                setSearchParams({ tab: "profile" });
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl transition ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs"
                  : "text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
              }`}
            >
              Profile &amp; Settings
            </button>
            <div className="pt-2 border-t border-slate-200">
              <LanguageDropdown variant="pill" />
            </div>
          </div>
        )}
      </div>

      {/* Location / Pincode Selector Modal */}
      <CustomerLocationModal
        isOpen={locationModalOpen}
        activeArea={activeArea}
        activePincode={activePincode}
        onClose={() => setLocationModalOpen(false)}
        onSelectArea={handleSelectArea}
      />
    </header>
  );
};
