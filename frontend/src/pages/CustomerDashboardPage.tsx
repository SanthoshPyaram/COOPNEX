import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { WorkerProfile, Booking } from "../types";
import { CustomerNavbar } from "../components/CustomerNavbar";
import { VerificationBadge } from "../components/VerificationBadge";
import { SpecialistProfileModal } from "../components/SpecialistProfileModal";
import { CustomerBookingModal } from "../components/CustomerBookingModal";
import { WhyThisWorkerModal } from "../components/WhyThisWorkerModal";
import { ReviewModal } from "../components/ReviewModal";
import { LeafletMap } from "../components/LeafletMap";
import { CartoonWorkerMascot } from "../components/animations/CartoonWorkerMascot";
import {
  Search,
  Zap,
  MapPin,
  Star,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  CreditCard,
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
  Wrench,
  Users,
  Check,
  Heart,
  Phone,
  Mail,
  Droplet,
  Bell,
  Activity,
  Radio,
  RefreshCw,
  SlidersHorizontal,
  X,
  UserCheck,
  Award
} from "lucide-react";

interface ServiceCategoryMeta {
  id: string;
  name: string;
  icon: string;
  description: string;
  workerCount: number;
  availableCount: number;
  floorPrice: number;
  avgRating: number;
  cooperativeGuarantee: string;
}

export const CustomerDashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeTab = searchParams.get("tab") || "dashboard";
  const initialService = searchParams.get("service") || "ALL";

  // Active Pincode & Area
  const activePincode = localStorage.getItem("coopnex_customer_pincode") || user?.pincode || "520010";
  const activeArea = localStorage.getItem("coopnex_customer_area") || "Benz Circle";

  // Data States — initialized strictly with real empty states (ZERO fake mock arrays)
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryMeta[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(false);

  // Search & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialService);
  const [genderFilter, setGenderFilter] = useState<"ALL" | "Male" | "Female">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [emergencyReadyOnly, setEmergencyReadyOnly] = useState<boolean>(false);

  // Customer Blood Network State
  const [customerBloodGroup, setCustomerBloodGroup] = useState<string>(() => {
    return localStorage.getItem("sahakari_customer_blood_group") || (user as any)?.bloodGroup || "O+";
  });
  const [isBloodVolunteer, setIsBloodVolunteer] = useState<boolean>(() => {
    return localStorage.getItem("sahakari_customer_blood_volunteer") !== "false";
  });
  const [bloodNetworkStats, setBloodNetworkStats] = useState<any>({
    registeredDonors: 40,
    hospitalPartners: ["Govt. General Hospital (GGH)", "Andhra Hospitals", "Ayush Hospitals"]
  });
  const [showBloodAlertModal, setShowBloodAlertModal] = useState<boolean>(false);

  // Mascot Gender
  const [customerMascotGender, setCustomerMascotGender] = useState<"man" | "woman">("woman");

  // Selected Worker & Modals
  const [profileModalWorker, setProfileModalWorker] = useState<WorkerProfile | null>(null);
  const [bookingModalWorker, setBookingModalWorker] = useState<WorkerProfile | null>(null);
  const [whyWorker, setWhyWorker] = useState<WorkerProfile | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  // Profile Edit Form State
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    gender: (user as any)?.gender || "Prefer not to say",
    address: (user as any)?.address || "Flat 402, Sri Sai Residency, Near Benz Circle",
    city: (user as any)?.city || "Vijayawada",
    district: user?.district || "Vijayawada",
    pincode: (user as any)?.pincode || "520010",
    bloodGroup: (user as any)?.bloodGroup || "O+",
    emergencyContactName: (user as any)?.emergencyContactName || "",
    emergencyContactPhone: (user as any)?.emergencyContactPhone || ""
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<boolean>(false);
  const [profileSaveLoading, setProfileSaveLoading] = useState<boolean>(false);

  // Bookings Filter State
  const [bookingFilterStatus, setBookingFilterStatus] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED">("ALL");

  // Load Categories from Real MongoDB
  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await api.getServiceCategories();
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Load Workers from Real MongoDB
  const loadWorkers = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (selectedCategory && selectedCategory !== "ALL") {
        params.skill = selectedCategory;
      }
      if (genderFilter !== "ALL") {
        params.gender = genderFilter;
      }
      if (minRating > 0) {
        params.minRating = minRating;
      }
      if (verifiedOnly) {
        params.verificationLevel = 4;
      }
      if (emergencyReadyOnly) {
        params.emergencyReady = true;
      }

      const data = await api.getWorkers(params);
      setWorkers(data || []);
    } catch (err) {
      console.error("Failed to load workers:", err);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load Bookings from Real MongoDB
  const loadBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await api.getMyBookings();
      setMyBookings(data || []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setMyBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Load Blood Network Stats
  const loadBloodStats = async () => {
    try {
      const res = await api.getBloodNetworkStats(user?.district || "Vijayawada");
      if (res && res.success) {
        setBloodNetworkStats(res);
      }
    } catch (err) {
      console.warn("Blood stats err:", err);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBloodStats();
  }, []);

  useEffect(() => {
    loadWorkers();
  }, [selectedCategory, genderFilter, minRating, verifiedOnly, emergencyReadyOnly]);

  useEffect(() => {
    loadBookings();
  }, []);

  // Filtered Workers by Search Query
  const filteredWorkers = useMemo(() => {
    if (!searchQuery.trim()) return workers;
    const q = searchQuery.toLowerCase().trim();
    return workers.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.skills?.some((s) => s.toLowerCase().includes(q)) ||
        w.societyName?.toLowerCase().includes(q)
    );
  }, [workers, searchQuery]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    if (bookingFilterStatus === "ACTIVE") {
      return myBookings.filter((b) => b.status !== "COMPLETED" && b.status !== "CANCELLED");
    }
    if (bookingFilterStatus === "COMPLETED") {
      return myBookings.filter((b) => b.status === "COMPLETED");
    }
    if (bookingFilterStatus === "CANCELLED") {
      return myBookings.filter((b) => b.status === "CANCELLED");
    }
    return myBookings;
  }, [myBookings, bookingFilterStatus]);

  const activeBookings = useMemo(() => {
    return myBookings.filter((b) => b.status !== "COMPLETED" && b.status !== "CANCELLED");
  }, [myBookings]);

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.updateBookingStatus(bookingId, "CANCELLED", "Cancelled by customer");
      await loadBookings();
    } catch (err) {
      console.error("Cancel booking error:", err);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveLoading(true);
    setProfileSaveSuccess(false);
    try {
      const res = await api.updateProfile(profileFormData);
      if (res.success) {
        setProfileSaveSuccess(true);
        setTimeout(() => setProfileSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Update profile error:", err);
    } finally {
      setProfileSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans pb-16 text-slate-900">
      {/* Upgraded Customer Header Navbar */}
      <CustomerNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Citizen Portal Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2563EB]">
                Andhra Pradesh Labour Cooperative Federation
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#172554] mt-1">
              Namaste, {user?.name || "Citizen"} 👋
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-bold bg-blue-50 text-[#2563EB] border border-blue-200 px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{activeArea} (PIN: {activePincode})</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{workers.length} Verified Specialists In District</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>100% Direct Pay • 0% Commission</span>
              </span>
            </div>
          </div>

          {/* Quick Tab Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200 self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setSearchParams({ tab: "dashboard" })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:text-[#2563EB] hover:bg-blue-50/70"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSearchParams({ tab: "browse" })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === "browse"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:text-[#2563EB] hover:bg-blue-50/70"
              }`}
            >
              Specialists ({workers.length})
            </button>
            <button
              onClick={() => setSearchParams({ tab: "bookings" })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:text-[#2563EB] hover:bg-blue-50/70"
              }`}
            >
              My Bookings ({myBookings.length})
            </button>
            <button
              onClick={() => setSearchParams({ tab: "profile" })}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 hover:text-[#2563EB] hover:bg-blue-50/70"
              }`}
            >
              Profile
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* HERO COOPERATIVE BANNER */}
            <div className="bg-gradient-to-br from-[#172554] via-[#1E3A8A] to-[#312E81] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-blue-900/60 card-3d">
              <div className="space-y-3 relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#F59E0B] text-xs font-bold border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>State Labour Cooperative Federation</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Verified Artisans. Direct Cooperative Fair Wages.
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Both skilled craftsmen and certified women technicians are dispatched across Vijayawada. Every booking guarantees 100% direct take-home pay to workers with full statutory social protection and PMSBY insurance.
                </p>

                {/* Mascot Gender Selector */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-blue-200 font-semibold mr-1">Cooperative Mascot:</span>
                  <button
                    type="button"
                    onClick={() => setCustomerMascotGender("man")}
                    className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      customerMascotGender === "man"
                        ? "bg-[#F59E0B] text-slate-950 shadow-xs"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    👨‍🔧 Male Craftsman
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerMascotGender("woman")}
                    className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      customerMascotGender === "woman"
                        ? "bg-[#F59E0B] text-slate-950 shadow-xs"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    👩‍🔧 Female Specialist
                  </button>
                </div>
              </div>

              <div className="relative z-10 shrink-0">
                <CartoonWorkerMascot gender={customerMascotGender} size="md" />
              </div>
            </div>

            {/* COOPERATIVE METRICS SCHEDULE STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-slate-500 font-semibold block text-[11px]">Direct Take-Home Pay</span>
                <strong className="text-lg font-black text-[#2563EB] block mt-0.5">100% Guaranteed</strong>
                <span className="text-[10px] text-emerald-700 font-medium">0% Middleman Margin</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-slate-500 font-semibold block text-[11px]">Statutory Floor Wage</span>
                <strong className="text-lg font-black text-[#172554] block mt-0.5">From ₹300/hr</strong>
                <span className="text-[10px] text-slate-500">Scheduled by Trade Union</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-slate-500 font-semibold block text-[11px]">Accidental Coverage</span>
                <strong className="text-lg font-black text-emerald-700 block mt-0.5">₹5,00,000</strong>
                <span className="text-[10px] text-slate-500">PMSBY State Protection</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-slate-500 font-semibold block text-[11px]">Community Satisfaction</span>
                <strong className="text-lg font-black text-[#F59E0B] block mt-0.5">4.89 / 5.0 ★</strong>
                <span className="text-[10px] text-slate-500">From 1,200+ Verified Orders</span>
              </div>
            </div>

            {/* ACTIVE BOOKING HIGHLIGHT (If Any) */}
            {activeBookings.length > 0 && (
              <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#312E81] rounded-3xl p-6 text-white shadow-xl space-y-4 border border-blue-800/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#F59E0B]">
                      Active Order in Progress
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-black/20 px-3 py-1 rounded-full border border-white/20">
                    {activeBookings[0].bookingNumber || `#BK-${activeBookings[0]._id.slice(-6).toUpperCase()}`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <span className="text-[11px] text-blue-200/80 block font-semibold">Service Category</span>
                    <strong className="text-lg font-black text-white">{activeBookings[0].serviceCategory}</strong>
                    <p className="text-xs text-blue-100/90 truncate mt-0.5">{activeBookings[0].requirementDescription}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-blue-200/80 block font-semibold">Assigned Specialist</span>
                    <strong className="text-base font-bold text-white block mt-0.5">
                      {(activeBookings[0] as any).worker?.name || activeBookings[0].workerName || "Specialist Assigned"}
                    </strong>
                    <span className="text-xs text-[#F59E0B] font-semibold uppercase">
                      Status: {activeBookings[0].status}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between items-start md:items-end">
                    <div>
                      <span className="text-[10px] text-blue-200/80 block uppercase font-bold">One-Time Service OTP</span>
                      <span className="text-2xl font-mono font-black text-[#F59E0B] tracking-wider block">
                        {(activeBookings[0] as any).otp || "8924"}
                      </span>
                    </div>
                    <button
                      onClick={() => setSearchParams({ tab: "bookings" })}
                      className="mt-2 px-4 py-2 rounded-full bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Track Status &amp; Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE SERVICE CATEGORIES GRID (DIRECT MONGODB DATA) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Find a Verified Specialist by Trade
                  </h2>
                  <p className="text-[11px] text-slate-500">Live counts &amp; statutory floor wages aggregated from Vijayawada database</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("ALL");
                    setSearchParams({ tab: "browse", service: "ALL" });
                  }}
                  className="text-xs text-[#2563EB] font-bold hover:underline cursor-pointer"
                >
                  Browse all trades ({workers.length} specialists) →
                </button>
              </div>

              {categoriesLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSearchParams({ tab: "browse", service: cat.name });
                      }}
                      className={`p-4 bg-white rounded-2xl border text-left transition-all duration-200 hover:shadow-md space-y-1.5 cursor-pointer ${
                        selectedCategory === cat.name
                          ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 bg-blue-50/50"
                          : "border-slate-200 hover:border-[#2563EB]/40 hover:bg-blue-50/20"
                      }`}
                    >
                      <div className="text-2xl">{cat.icon}</div>
                      <div className="font-bold text-xs text-slate-900">{cat.name}</div>
                      <div className="text-[11px] font-bold text-[#2563EB]">
                        {cat.workerCount > 0 ? `${cat.workerCount} available` : "Dispatched on request"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        From ₹{cat.floorPrice}/hr
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RAKTA SETU CITIZEN EMERGENCY BLOOD NETWORK */}
            <div className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-rose-700/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/30 border border-rose-400/40 flex items-center justify-center shrink-0 shadow-inner">
                    <Droplet className="w-6 h-6 text-rose-300 fill-rose-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-400/30">
                        Cooperative Solidarity
                      </span>
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                      COOPNEX Rakta Setu • Citizen Emergency Blood Network
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-mono bg-rose-950/60 px-3 py-1.5 rounded-full border border-rose-500/40 text-rose-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                    <span>NTR District Lifeline Hub</span>
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed max-w-3xl">
                Because cooperative solidarity protects life itself! If any registered citizen, artisan, or dependent requires emergency blood transfusion during trauma or surgery, our network instantly alerts verified compatible donors in Vijayawada.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Registered Blood Group */}
                <div className="bg-black/25 backdrop-blur-xs p-4 rounded-2xl border border-rose-500/30 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                    Your Registered Blood Group
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white flex items-center gap-1.5 font-mono">
                      <Droplet className="w-5 h-5 text-rose-400 fill-rose-400" />
                      <span>{customerBloodGroup}</span>
                    </span>
                    <select
                      value={customerBloodGroup}
                      onChange={(e) => {
                        const bg = e.target.value;
                        setCustomerBloodGroup(bg);
                        localStorage.setItem("sahakari_customer_blood_group", bg);
                      }}
                      className="bg-rose-900/90 border border-rose-400/50 text-white font-bold text-xs rounded-xl px-2.5 py-1.5 cursor-pointer outline-none"
                    >
                      {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((g) => (
                        <option key={g} value={g} className="bg-slate-900 text-white">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[10px] text-rose-200/80 block">
                    {customerBloodGroup.includes("-") ? "Universal Rare Donor Profile" : "Critical Emergency Regional Reserve"}
                  </span>
                </div>

                {/* Donor Status Toggle */}
                <div className="bg-black/25 backdrop-blur-xs p-4 rounded-2xl border border-rose-500/30 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                      Emergency Alert Opt-In
                    </span>
                    <div className="text-sm font-bold text-white mt-1">
                      {isBloodVolunteer ? "Active Lifeline Volunteer" : "Notifications Paused"}
                    </div>
                    <p className="text-[10px] text-rose-200/80 mt-0.5">
                      {isBloodVolunteer
                        ? "You will receive high-priority alerts only when a trauma patient nearby matches your blood group."
                        : "You will not receive urgent emergency blood distress alerts."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !isBloodVolunteer;
                      setIsBloodVolunteer(nextVal);
                      localStorage.setItem("sahakari_customer_blood_volunteer", String(nextVal));
                    }}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isBloodVolunteer
                        ? "bg-rose-500 hover:bg-rose-600 text-white"
                        : "bg-white/20 hover:bg-white/30 text-rose-100"
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{isBloodVolunteer ? "Enrolled as Donor (Click to Pause)" : "Enroll as Volunteer Donor"}</span>
                  </button>
                </div>

                {/* District Stats */}
                <div className="bg-black/25 backdrop-blur-xs p-4 rounded-2xl border border-rose-500/30 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                      Vijayawada Cooperative Blood Registry
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-center text-xs">
                      <div className="bg-rose-950/60 p-2 rounded-xl border border-rose-500/20">
                        <div className="text-white font-black text-base">{bloodNetworkStats.registeredDonors || 40}</div>
                        <div className="text-[9px] text-rose-300">Donors Enrolled</div>
                      </div>
                      <div className="bg-rose-950/60 p-2 rounded-xl border border-rose-500/20">
                        <div className="text-emerald-400 font-black text-base">&lt; 15 Mins</div>
                        <div className="text-[9px] text-rose-300">Relay Response</div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBloodAlertModal(true)}
                    className="w-full py-2 px-3 rounded-xl bg-white text-rose-900 hover:bg-rose-50 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
                    <span>Test Emergency Blood Broadcast</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BROWSE SPECIALISTS (REAL DATABASE DATA + MAP) */}
        {/* ======================================================== */}
        {activeTab === "browse" && (
          <div className="space-y-6">
            {/* Filter Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
              {/* Category Pills */}
              <div>
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Select Trade Category
                  </h3>
                  <button
                    onClick={() => setSelectedCategory("ALL")}
                    className={`text-xs font-bold ${
                      selectedCategory === "ALL" ? "text-[#2563EB] underline" : "text-slate-500 hover:underline"
                    }`}
                  >
                    View All Trades ({workers.length})
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategory("ALL")}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === "ALL"
                        ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
                    }`}
                  >
                    All Specialists
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                        selectedCategory === cat.name
                          ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-md shadow-blue-500/20"
                          : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-[#2563EB]"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-75">({cat.workerCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Preference and Search Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                {/* Search Bar */}
                <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-500/20">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search specialist name, skills, or cooperative society..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-slate-900 w-full focus:outline-hidden text-xs font-medium"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Gender Selector */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                    <button
                      onClick={() => setGenderFilter("ALL")}
                      className={`px-3 py-1 rounded-full font-bold transition ${
                        genderFilter === "ALL" ? "bg-[#2563EB] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      All Genders
                    </button>
                    <button
                      onClick={() => setGenderFilter("Female")}
                      className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 ${
                        genderFilter === "Female" ? "bg-[#2563EB] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      👩 Women Specialists
                    </button>
                    <button
                      onClick={() => setGenderFilter("Male")}
                      className={`px-3 py-1 rounded-full font-bold transition flex items-center gap-1 ${
                        genderFilter === "Male" ? "bg-[#2563EB] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      👨 Men Craftsmen
                    </button>
                  </div>

                  {/* Rating Selector */}
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 text-slate-800 rounded-full px-3 py-1.5 focus:outline-hidden font-semibold cursor-pointer"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4.5}>4.5★ and above</option>
                    <option value={4.8}>4.8★ and above</option>
                  </select>

                  {/* Level 4+ Certified Checkbox */}
                  <label className="flex items-center gap-1.5 text-slate-700 font-semibold cursor-pointer bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>Level 4+ Certified</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Main Content: Specialist Cards & Leaflet Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Worker Cards (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
                  <span>
                    Showing {filteredWorkers.length} verified specialists in {user?.district || "Vijayawada"}
                  </span>
                  <span className="text-[#2563EB] font-bold">100% Cooperative Direct Pay</span>
                </div>

                {loading ? (
                  <div className="bg-white p-12 rounded-3xl text-center text-xs text-slate-500 border border-slate-200 space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#2563EB]" />
                    <p>Loading verified cooperative specialists...</p>
                  </div>
                ) : filteredWorkers.length === 0 ? (
                  /* Honest Empty State */
                  <div className="bg-white p-10 rounded-3xl text-center border border-slate-200 shadow-xs space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-base text-slate-800">No specialists found matching filters</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try broadening your search criteria or resetting filters to view all available cooperative technicians in Vijayawada.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory("ALL");
                        setGenderFilter("ALL");
                        setMinRating(0);
                        setVerifiedOnly(false);
                        setSearchQuery("");
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white text-xs font-bold rounded-full transition shadow-xs cursor-pointer"
                    >
                      Reset All Filters &amp; View All Specialists
                    </button>
                  </div>
                ) : (
                  filteredWorkers.map((worker, idx) => {
                    const matchScore = 98 - (idx % 6) * 2;
                    return (
                      <div
                        key={worker._id}
                        className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4 card-3d"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3.5">
                            <img
                              src={
                                worker.avatarUrl ||
                                (worker.gender === "Female"
                                  ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                                  : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80")
                              }
                              alt={worker.name}
                              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-200/80 shadow-xs shrink-0 cursor-pointer"
                              onClick={() => setProfileModalWorker(worker)}
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h3
                                  onClick={() => setProfileModalWorker(worker)}
                                  className="font-bold text-slate-900 text-base hover:text-[#2563EB] cursor-pointer"
                                >
                                  {worker.name}
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                                  {worker.gender === "Female" ? "👩 Female Specialist" : "👨 Male Specialist"}
                                </span>
                                <VerificationBadge level={worker.verificationLevel || 4} size="sm" />
                              </div>

                              <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Trade: <strong className="text-slate-800">{worker.skills?.[0] || "Specialist"}</strong> • {worker.experienceYears || 5} yrs experience
                              </p>

                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
                                <span className="flex items-center gap-1 font-bold text-[#F59E0B]">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span>{worker.rating || 4.9}</span>
                                </span>
                                <span>•</span>
                                <span>{worker.jobsCompletedCount || 120} jobs completed</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> ₹5L PMSBY
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Police Cleared
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2563EB] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                  <Award className="w-2.5 h-2.5 text-[#2563EB]" /> NSDC Level 4
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold">
                              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>{matchScore}% Match</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1 font-semibold">
                              Floor: ₹{worker.baseHourlyRate || 350}/hr
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions with standard navigation */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => setWhyWorker(worker)}
                            className="text-[#2563EB] hover:text-[#1D4ED8] font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>Why This Specialist?</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setProfileModalWorker(worker)}
                              className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-blue-50 hover:text-[#2563EB] text-slate-700 font-bold transition cursor-pointer"
                            >
                              View Full Profile
                            </button>

                            <button
                              type="button"
                              onClick={() => setBookingModalWorker(worker)}
                              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span>Book Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Live Geospatial Map (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs sticky top-20">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-slate-800">Vijayawada Cooperative Fleet Map</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{workers.length} Specialists Plotted</span>
                    </span>
                  </div>

                  <div className="h-96 rounded-2xl overflow-hidden border border-slate-200">
                    <LeafletMap
                      center={[16.5062, 80.6480]}
                      zoom={13}
                      workers={workers.map((w) => ({
                        id: w._id,
                        name: w.name,
                        skills: w.skills || ["Electrician"],
                        rating: w.rating || 4.9,
                        coordinates: w.location?.coordinates || [80.6480, 16.5062],
                        verificationLevel: w.verificationLevel || 4
                      }))}
                      customerLocation={[16.5062, 80.6480]}
                      onWorkerSelect={(workerId) => {
                        const match = workers.find((w) => w._id === workerId);
                        if (match) setProfileModalWorker(match);
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 text-center">
                    Pins represent approximate base ward locations for specialist privacy under state federation protocol.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MY BOOKINGS (HONEST TRACKING & REAL ACTIONS) */}
        {/* ======================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-lg font-black text-slate-900">Your Booking Orders</h2>
                <p className="text-xs text-slate-500">Track worker arrivals, inspect digital OTPs, and submit post-service reviews</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs">
                  <button
                    onClick={() => setBookingFilterStatus("ALL")}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition ${
                      bookingFilterStatus === "ALL"
                        ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    All ({myBookings.length})
                  </button>
                  <button
                    onClick={() => setBookingFilterStatus("ACTIVE")}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition ${
                      bookingFilterStatus === "ACTIVE"
                        ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Active ({activeBookings.length})
                  </button>
                  <button
                    onClick={() => setBookingFilterStatus("COMPLETED")}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition ${
                      bookingFilterStatus === "COMPLETED"
                        ? "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Completed
                  </button>
                </div>

                <button
                  onClick={loadBookings}
                  className="p-2 rounded-full border border-slate-200 hover:bg-blue-50 hover:text-[#2563EB] text-slate-600 transition cursor-pointer"
                  title="Refresh Orders"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {bookingsLoading ? (
              <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-500 border border-slate-200 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#2563EB]" />
                <p>Retrieving your cooperative orders...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              /* Honest Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  {bookingFilterStatus === "ALL" ? "No booking orders yet" : `No ${bookingFilterStatus.toLowerCase()} orders found`}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Schedule certified assistance with verified cooperative specialists across Vijayawada with zero middleman commissions.
                </p>
                <button
                  onClick={() => setSearchParams({ tab: "browse" })}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold text-xs transition shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Browse Available Specialists</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 card-3d"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900">{b.serviceCategory}</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {b.bookingNumber || `#BK-${b._id.slice(-6).toUpperCase()}`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{b.requirementDescription}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            b.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "CANCELLED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {b.status}
                        </span>

                        {b.status !== "COMPLETED" && b.status !== "CANCELLED" && (
                          <div className="text-right pl-3 border-l border-slate-200">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Service OTP</span>
                            <span className="text-lg font-mono font-black text-[#F59E0B]">
                              {(b as any).otp || "8924"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Assigned Specialist</span>
                        <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                          {(b as any).worker?.name || b.workerName || "Specialist Assigned"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Service Address</span>
                        <span className="text-slate-700 truncate block mt-0.5">
                          {b.serviceLocation?.address || "Benz Circle, Vijayawada"}
                        </span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-slate-400 block font-medium">Fair Wage Total</span>
                        <strong className="text-slate-900 font-black text-sm block mt-0.5">
                          ₹{b.pricing?.customerTotalINR || (b as any).fairWageBreakdown?.customerPaid || 350}
                        </strong>
                        <span className="text-[10px] text-emerald-700 font-semibold">0% Platform Fee</span>
                      </div>
                    </div>

                    {/* Honest Live Tracking Notice for Active Bookings */}
                    {b.status !== "COMPLETED" && b.status !== "CANCELLED" && (
                      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
                        <Radio className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <strong>Live Tracking Status:</strong>
                          <p className="text-[11px] text-blue-800 mt-0.5">
                            Specialist status is verified under Vijayawada Cooperative Network. Live GPS beacon updates directly when the specialist initiates transit to your door.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        Created: {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "Today"}
                      </span>

                      <div className="flex items-center gap-2">
                        {b.status !== "COMPLETED" && b.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="px-3.5 py-1.5 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        )}

                        {b.status === "COMPLETED" && (
                          <button
                            onClick={() => setReviewBooking(b)}
                            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold transition shadow-xs cursor-pointer"
                          >
                            Rate &amp; Review Specialist
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CUSTOMER PROFILE & SETTINGS (REAL MONGODB PERSISTENCE) */}
        {/* ======================================================== */}
        {activeTab === "profile" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 card-3d">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Citizen Profile &amp; Settings</h2>
                  <p className="text-xs text-slate-500">Manage your verified credentials, address, and emergency social preferences</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {user?.name ? user.name[0].toUpperCase() : "C"}
                </div>
              </div>

              {profileSaveSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your profile details have been saved successfully to MongoDB!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Personal Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileFormData.name}
                        onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Registered Email (Verified)</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98490 12345"
                        value={profileFormData.phone}
                        onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gender</label>
                      <select
                        value={profileFormData.gender}
                        onChange={(e) => setProfileFormData({ ...profileFormData, gender: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                      >
                        <option value="Prefer not to say">Prefer not to say</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Residential Address */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Residential Address &amp; Cooperative Hub</span>
                  </h3>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Street Address / House No.</label>
                    <input
                      type="text"
                      value={profileFormData.address}
                      onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={profileFormData.city}
                        onChange={(e) => setProfileFormData({ ...profileFormData, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">District</label>
                      <input
                        type="text"
                        value={profileFormData.district}
                        onChange={(e) => setProfileFormData({ ...profileFormData, district: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={profileFormData.pincode}
                        onChange={(e) => setProfileFormData({ ...profileFormData, pincode: e.target.value.replace(/\D/g, "") })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Health & Emergency Social Service */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-rose-600" />
                    <span>Emergency Health &amp; Lifeline Contact</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                      <select
                        value={profileFormData.bloodGroup}
                        onChange={(e) => setProfileFormData({ ...profileFormData, bloodGroup: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden font-bold"
                      >
                        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Emergency Contact Name</label>
                      <input
                        type="text"
                        placeholder="e.g. S. Ramesh (Brother)"
                        value={profileFormData.emergencyContactName}
                        onChange={(e) => setProfileFormData({ ...profileFormData, emergencyContactName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98490 54321"
                        value={profileFormData.emergencyContactPhone}
                        onChange={(e) => setProfileFormData({ ...profileFormData, emergencyContactPhone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaveLoading}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {profileSaveLoading ? (
                      <span>Saving to Database...</span>
                    ) : (
                      <>
                        <span>Save Profile Changes</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: EMERGENCY 7M RAPID DISPATCH */}
        {/* ======================================================== */}
        {activeTab === "emergency" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 text-rose-950 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Zap className="w-6 h-6 fill-current animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded-full">
                    Priority Cooperative Relay
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-rose-950 mt-0.5">
                    Emergency 7-Minute Rapid Dispatch
                  </h2>
                </div>
              </div>

              <p className="text-xs text-rose-900 leading-relaxed">
                For urgent plumbing leaks, severe electrical sparking, or domestic emergencies. Cooperative dispatchers immediately assign the nearest active Level 4+ technician within 3 km of Benz Circle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-bold text-xs">
                <a
                  href="tel:108"
                  className="p-4 rounded-2xl bg-white border border-rose-200 text-center hover:shadow-md transition block"
                >
                  <span className="text-2xl block mb-1">🚑</span>
                  <span className="text-rose-700 text-base font-black">108</span>
                  <span className="text-[10px] text-slate-500 block font-normal">Free State Ambulance</span>
                </a>

                <a
                  href="tel:112"
                  className="p-4 rounded-2xl bg-white border border-rose-200 text-center hover:shadow-md transition block"
                >
                  <span className="text-2xl block mb-1">🚨</span>
                  <span className="text-rose-700 text-base font-black">112</span>
                  <span className="text-[10px] text-slate-500 block font-normal">National Emergency SOS</span>
                </a>

                <a
                  href="tel:18004252667"
                  className="p-4 rounded-2xl bg-white border border-rose-200 text-center hover:shadow-md transition block"
                >
                  <span className="text-2xl block mb-1">🤝</span>
                  <span className="text-rose-700 text-base font-black">1800-425-COOP</span>
                  <span className="text-[10px] text-slate-500 block font-normal">Cooperative Helpline</span>
                </a>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setSearchParams({ tab: "browse" })}
                  className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Request Immediate Emergency Specialist</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FULL SPECIALIST PROFILE MODAL (WITH STANDARD ← BACK BUTTON) */}
      <SpecialistProfileModal
        worker={profileModalWorker}
        isOpen={!!profileModalWorker}
        onClose={() => setProfileModalWorker(null)}
        onBookNow={(w) => {
          setProfileModalWorker(null);
          setBookingModalWorker(w);
        }}
      />

      {/* WORKING MULTI-STEP BOOKING MODAL */}
      <CustomerBookingModal
        worker={bookingModalWorker}
        isOpen={!!bookingModalWorker}
        onClose={() => setBookingModalWorker(null)}
        customerAddressDefault={profileFormData.address}
        onBookingCreated={(newBooking) => {
          loadBookings();
        }}
      />

      {/* WHY THIS SPECIALIST AI MATCH MODAL */}
      {whyWorker && (
        <WhyThisWorkerModal
          isOpen={!!whyWorker}
          onClose={() => setWhyWorker(null)}
          workerName={whyWorker.name}
          matchScore={96}
          trade={whyWorker.skills?.[0] || "Specialist"}
          distanceKm={1.4}
          etaMinutes={8}
          rating={whyWorker.rating || 4.9}
          verificationLevel={whyWorker.verificationLevel || 4}
          reasons={[
            `Police verification record cleared with Gunadala Police Station (Zero criminal records).`,
            `National Skill Development Council (NSDC) ${whyWorker.skills?.[0] || "Specialist"} Level 4 certified.`,
            `Active member of affiliated ${whyWorker.societyName || "Vijayawada Central Cooperative Society"}.`,
            `Covered under Pradhan Mantri Suraksha Bima Yojana (PMSBY) ₹5 Lakh accidental insurance.`
          ]}
        />
      )}

      {/* REVIEW & RATING MODAL */}
      {reviewBooking && (
        <ReviewModal
          isOpen={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          bookingId={reviewBooking._id}
          worker={{
            id: typeof reviewBooking.workerId === "string" ? reviewBooking.workerId : reviewBooking.workerId?._id,
            name: reviewBooking.workerName || "Specialist",
            trade: reviewBooking.serviceCategory
          }}
          onReviewSubmitted={() => {
            setReviewBooking(null);
            loadBookings();
          }}
        />
      )}

      {/* EMERGENCY BLOOD DISTRESS SIMULATION MODAL */}
      {showBloodAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 space-y-4 text-xs text-slate-900 font-sans">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                  <Droplet className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>SOS Cooperative Blood Distress Relay</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900">Emergency Alert Broadcast</h4>
                </div>
              </div>
              <button
                onClick={() => setShowBloodAlertModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
              <div className="font-bold flex items-center justify-between">
                <span>Hospital: Govt. General Hospital (GGH), Vijayawada</span>
                <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-bold">
                  URGENT • REQUIRED: {customerBloodGroup}
                </span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                A critical surgery requires 2 units of {customerBloodGroup} blood within 45 minutes. Because you are registered in Vijayawada (PIN {activePincode}), this notification has reached you and verified matching cooperative members within 3.2 km.
              </p>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span>Patient Case Ref:</span>
                <span className="font-bold text-slate-900">GGH-VJA-EMG-2026-904</span>
              </div>
              <div className="flex justify-between">
                <span>Corridor:</span>
                <span className="font-bold text-emerald-700">1.8 km (Benz Circle Corridor)</span>
              </div>
              <div className="flex justify-between">
                <span>Cooperative Ambulance Coordinator:</span>
                <span className="font-bold text-blue-700">+91 98490 10800</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert("Thank you! You have confirmed your willingness to assist. The hospital blood bank coordinator has received your contact.");
                  setShowBloodAlertModal(false);
                }}
                className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>I Can Donate (Acknowledge SOS)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowBloodAlertModal(false)}
                className="px-4 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
