import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Star,
  Users,
  HeartHandshake,
  TrendingUp,
  Award,
  ChevronRight,
  Clock,
  Sparkles,
  PhoneCall,
  Search,
  Check,
  CreditCard,
  UserCheck,
  Play,
  Pause,
  X,
  Calendar,
  Briefcase,
  Camera,
  Lock,
  Building2,
  Radio,
  FileCheck2,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Wrench,
  Hammer,
  Paintbrush,
  Trees,
  Landmark,
  Laptop,
  Waves,
  Compass,
  RotateCcw,
  BadgeCheck,
  Heart,
  Navigation
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { PincodeCheckerModal } from "../components/PincodeCheckerModal";
import { checkLocalPincode, PincodeCheckResult, getPanIndiaWorkers } from "../data/indiaLocations";
import { RealisticPaymentModal } from "../components/RealisticPaymentModal";
import { ReviewModal } from "../components/ReviewModal";
import { ContinuousPortalVideo } from "../components/ContinuousPortalVideo";
import { VoiceButton } from "../components/VoiceButton";
import { ttsService } from "../services/tts";
import { TiltCard3D } from "../components/3d/TiltCard3D";
import { API_BASE } from "../services/api";

// WebGL 3D Components
import { HeroCoopNetwork3D } from "../components/3d/webgl/HeroCoopNetwork3D";
import { ServicesConstellation3D } from "../components/3d/webgl/ServicesConstellation3D";
import { LocationMatching3D } from "../components/3d/webgl/LocationMatching3D";
import { CooperativeEcosystem3D } from "../components/3d/webgl/CooperativeEcosystem3D";
import { AIDemandForecast3D } from "../components/3d/webgl/AIDemandForecast3D";
import { EmergencyRadar3D } from "../components/3d/webgl/EmergencyRadar3D";
import { CooperativeGlobe3D } from "../components/3d/webgl/CooperativeGlobe3D";
import { HolographicArtisanCard3D } from "../components/3d/webgl/HolographicArtisanCard3D";
import { Soundbox3DViewer } from "../components/3d/webgl/Soundbox3DViewer";
import { TharDoorstepRoadAnimation } from "../components/animations/TharDoorstepRoadAnimation";
import { CooperativeMottoPrinciples } from "../components/animations/CooperativeMottoPrinciples";
import { EmergencyBloodCoopBanner } from "../components/animations/EmergencyBloodCoopBanner";

export const LandingPage: React.FC = () => {
  const { isAuthenticated, switchDemoRoleForTesting } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // ----------------------------------------------------
  // 1. REAL-TIME LIVE DISPATCH TICKER STREAM
  // ----------------------------------------------------
  const LIVE_DISPATCH_EVENTS = [
    {
      id: "evt-1",
      badge: "LIVE DISPATCH",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      text: "Rajesh Kumar (Level-4 Electrician) dispatched in Vijayawada (520001)",
      time: "12s ago",
      eta: "ETA 9 mins"
    },
    {
      id: "evt-2",
      badge: "5.0 ★ REVIEW",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      text: "Priya S. reviewed Ramesh Babu (Plumber, Guntur): 'Fixed main pipeline in 20 mins!'",
      time: "42s ago",
      eta: "Verified Proof"
    },
    {
      id: "evt-3",
      badge: "ESCROW RELEASED",
      badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      text: "₹650 disbursed directly to Sarada Devi's DBT account with 0% platform deductions",
      time: "1m ago",
      eta: "100% Floor Wage"
    },
    {
      id: "evt-4",
      badge: "NEW COOPERATIVE",
      badgeColor: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
      text: "Bengaluru East Labour Cooperative Society enrolled 84 certified carpenters",
      time: "2m ago",
      eta: "State Council Certified"
    },
    {
      id: "evt-5",
      badge: "WELFARE COVER",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      text: "PMSBY ₹5 Lakh accidental cover activated for 310 artisans in Hyderabad Central",
      time: "3m ago",
      eta: "Universal Social Security"
    }
  ];

  const [currentEventIdx, setCurrentEventIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEventIdx((prev) => (prev + 1) % LIVE_DISPATCH_EVENTS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [LIVE_DISPATCH_EVENTS.length]);

  // ----------------------------------------------------
  // 2. PINCODE SEARCH & SERVICE SELECTION STATE
  // ----------------------------------------------------
  const [pincodeInput, setPincodeInput] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("Electrician");
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [heroDetectionResult, setHeroDetectionResult] = useState<PincodeCheckResult | null>(null);
  const [showLocationMatcher, setShowLocationMatcher] = useState(false);
  const [showPortalVideo, setShowPortalVideo] = useState(true);

  // Active Pan-India Location State (defaults to Vijayawada Central Hub)
  const [selectedPincode, setSelectedPincode] = useState<string>("520001");
  const [locationPincodeInput, setLocationPincodeInput] = useState<string>("");
  const [currentLocationInfo, setCurrentLocationInfo] = useState<{
    city: string;
    district: string;
    state: string;
    cooperativeName: string;
    pincode: string;
  }>({
    city: "Vijayawada",
    district: "NTR District",
    state: "Andhra Pradesh",
    cooperativeName: "Vijayawada Central Primary Labour Cooperative Society (PLCS)",
    pincode: "520001"
  });

  const updateActiveLocation = (pin: string) => {
    const clean = pin.trim();
    if (clean.length === 6) {
      const res = checkLocalPincode(clean, selectedTrade);
      setSelectedPincode(clean);
      setCurrentLocationInfo({
        city: res.city || "Local City",
        district: res.district || `${res.city} District`,
        state: res.state || "India",
        cooperativeName: res.cooperativeName || `${res.city} Labour Cooperative Society`,
        pincode: clean
      });
      setTrialAddress(`${res.city} Central Cooperative Hub, ${res.district || ""}, ${res.state} - ${clean}`);
    }
  };

  // Auto-detect when 6 digits are typed
  useEffect(() => {
    if (pincodeInput.length === 6) {
      const res = checkLocalPincode(pincodeInput, selectedTrade);
      setHeroDetectionResult(res);
      setShowLocationMatcher(true);
      updateActiveLocation(pincodeInput);
    } else if (pincodeInput.length === 0) {
      setHeroDetectionResult(null);
      setShowLocationMatcher(false);
    }
  }, [pincodeInput, selectedTrade]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincodeInput.replace(/\D/g, "").trim();
    if (!clean) {
      setPincodeModalOpen(true);
      return;
    }
    const targetPin = clean.length === 6 ? clean : clean.length >= 2 ? clean.padEnd(6, "0") : "520001";
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const res = checkLocalPincode(targetPin, selectedTrade);
      setHeroDetectionResult(res);
      setShowLocationMatcher(true);
      updateActiveLocation(targetPin);
    }, 250);
  };

  const handleQuickHub = (pin: string) => {
    const clean = pin.replace(/\D/g, "").trim();
    setPincodeInput(clean);
    const res = checkLocalPincode(clean, selectedTrade);
    setHeroDetectionResult(res);
    setShowLocationMatcher(true);
    updateActiveLocation(clean);
  };

  // ----------------------------------------------------
  // 3. EXPLAINER VIDEO PLAYER MODAL
  // ----------------------------------------------------
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // ----------------------------------------------------
  // 4. LIVE WORKERS & REALISTIC TRIAL BOOKING STATE
  // ----------------------------------------------------
  const [activeWorkerTrade, setActiveWorkerTrade] = useState("ALL");
  const [liveWorkers, setLiveWorkers] = useState<any[]>(() =>
    getPanIndiaWorkers("Vijayawada", "NTR District", "Andhra Pradesh", "520001", "ALL")
  );
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [trialWorker, setTrialWorker] = useState<any | null>(null);
  const [trialDate, setTrialDate] = useState("Today");
  const [trialSlot, setTrialSlot] = useState("Evening (5:00 PM - 7:00 PM)");
  const [trialAddress, setTrialAddress] = useState("Governorpet, Benz Circle, Vijayawada - 520001");
  const [trialNotes, setTrialNotes] = useState("");
  const [trialConfirmed, setTrialConfirmed] = useState(false);
  const [trialBookingId, setTrialBookingId] = useState("");

  // Auth Gating Modal State
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [pendingWorkerForAuth, setPendingWorkerForAuth] = useState<any | null>(null);

  // Realistic Post-Service Payment & Review Flow
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [, setPaymentDone] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBehaviour, setReviewBehaviour] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [, setReviewSubmitted] = useState(false);

  // Fetch verified workers from backend API or Pan-India generator
  useEffect(() => {
    const fetchWorkers = async () => {
      setLoadingWorkers(true);
      try {
        const params = new URLSearchParams();
        if (activeWorkerTrade !== "ALL") params.append("skill", activeWorkerTrade);
        if (selectedPincode) params.append("pincode", selectedPincode);
        const res = await fetch(`${API_BASE}/workers?${params.toString()}`);
        const data = await res.json();
        if (data.workers && data.workers.length > 0) {
          setLiveWorkers(data.workers);
        } else {
          const adapted = getPanIndiaWorkers(
            currentLocationInfo.city,
            currentLocationInfo.district,
            currentLocationInfo.state,
            selectedPincode,
            activeWorkerTrade
          );
          setLiveWorkers(adapted);
        }
      } catch {
        const adapted = getPanIndiaWorkers(
          currentLocationInfo.city,
          currentLocationInfo.district,
          currentLocationInfo.state,
          selectedPincode,
          activeWorkerTrade
        );
        setLiveWorkers(adapted);
      } finally {
        setLoadingWorkers(false);
      }
    };

    fetchWorkers();
  }, [activeWorkerTrade, selectedPincode, currentLocationInfo.city, currentLocationInfo.district, currentLocationInfo.state]);

  const handleOpenTrialBooking = (worker: any) => {
    if (!isAuthenticated) {
      setPendingWorkerForAuth(worker);
      setAuthPromptOpen(true);
      return;
    }
    setTrialWorker(worker);
    setTrialConfirmed(false);
    setTrialBookingId(`SS-TR-${Math.floor(1000 + Math.random() * 9000)}`);
    setTrialAddress(
      `${worker.societyName || currentLocationInfo.cooperativeName}, ${currentLocationInfo.city}, ${currentLocationInfo.state} - ${selectedPincode}`
    );
  };

  const handle1ClickCitizenLogin = async () => {
    await switchDemoRoleForTesting("CUSTOMER");
    setAuthPromptOpen(false);
    if (pendingWorkerForAuth) {
      setTrialWorker(pendingWorkerForAuth);
      setTrialConfirmed(false);
      setTrialBookingId(`SS-TR-${Math.floor(1000 + Math.random() * 9000)}`);
      setPendingWorkerForAuth(null);
    }
  };

  const handleConfirmTrialBooking = () => {
    setTrialConfirmed(true);
  };

  const handleTriggerPayment = () => {
    setPaymentModalOpen(true);
    setPaymentDone(false);
  };

  // ----------------------------------------------------
  // 5. WORKER INCOME CALCULATOR
  // ----------------------------------------------------
  const [monthlyJobs, setMonthlyJobs] = useState(32);
  const avgJobValue = 500;
  const privateCommissionRate = 0.28;
  const grossIncome = monthlyJobs * avgJobValue;
  const privateLostMoney = Math.round(grossIncome * privateCommissionRate);
  const cooperativeTakeHome = grossIncome;
  const privateTakeHome = grossIncome - privateLostMoney;

  // ----------------------------------------------------
  // 6. COMPLETED WORK PROOF GALLERY DATA
  // ----------------------------------------------------
  const [activeProofCategory, setActiveProofCategory] = useState<"All" | "Electrical" | "Plumbing" | "Woodwork" | "Cleaning">("All");

  const WORK_PROOFS = [
    {
      id: "wp-1",
      category: "Electrical",
      title: "Full MCB Panel Replacement & Copper Earthing",
      location: "Governorpet, Vijayawada",
      worker: "Rajesh Kumar (Level-4)",
      beforeImg: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
      rating: 5,
      customerQuote: "Arrived within 11 minutes of emergency sparking call. Re-wired everything with ISI copper cables.",
      verifiedBadge: "ISI Standard Verified"
    },
    {
      id: "wp-2",
      category: "Plumbing",
      title: "Concealed Pressure Leakage & PPR Pipe Jointing",
      location: "Gachibowli, Hyderabad",
      worker: "Ramesh Babu (Master Plumber)",
      beforeImg: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
      rating: 5,
      customerQuote: "Saved our bathroom tiles from demolition. Detected concealed leak acoustically and repaired joint.",
      verifiedBadge: "Zero Tile Damage"
    },
    {
      id: "wp-3",
      category: "Woodwork",
      title: "Custom Teakwood Wardrobe Latch & Precision Hinges",
      location: "Indiranagar, Bengaluru",
      worker: "Ch. Lakshmi Narayana",
      beforeImg: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80",
      rating: 5,
      customerQuote: "Master craftsman quality. Aligned heavy antique timber doors smoothly with zero creaking.",
      verifiedBadge: "Handcrafted Guarantee"
    },
    {
      id: "wp-4",
      category: "Cleaning",
      title: "Deep Sanitization & Commercial Chimney Degreasing",
      location: "Connaught Place, New Delhi",
      worker: "K. Padma (Specialist)",
      beforeImg: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
      rating: 5,
      customerQuote: "Spotless kitchen deep clean. Used certified non-toxic, hospital-grade disinfectants.",
      verifiedBadge: "Eco Safe Certified"
    }
  ];

  const filteredProofs =
    activeProofCategory === "All"
      ? WORK_PROOFS
      : WORK_PROOFS.filter((p) => p.category === activeProofCategory);

  // ----------------------------------------------------
  // 7. TESTIMONIALS STATE
  // ----------------------------------------------------
  const [activeTestimonialTab, setActiveTestimonialTab] = useState<"citizens" | "artisans">("citizens");

  // Service categories array
  const serviceCategories = [
    { key: "electrician", name: "Electrician", rate: "₹380/hr" },
    { key: "plumber", name: "Plumber", rate: "₹350/hr" },
    { key: "carpenter", name: "Carpenter", rate: "₹420/hr" },
    { key: "painter", name: "Painter", rate: "₹450/day" },
    { key: "cleaner", name: "Deep Cleaner", rate: "₹550/session" },
    { key: "caregiver", name: "Elder Caregiver", rate: "₹650/shift" },
    { key: "technician", name: "Appliance Tech", rate: "₹450/hr" },
    { key: "gardener", name: "Gardener", rate: "₹320/visit" },
  ];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1220] min-h-screen text-slate-900 dark:text-slate-100 transition-colors selection:bg-[#0A66C2] selection:text-white">

      {/* ========================================================================= */}
      {/* 2. WORLD-CLASS 3D HERO SECTION                                            */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-20 border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-white via-blue-50/25 to-indigo-50/20 dark:from-slate-950 dark:via-[#0c1322] dark:to-[#080d19]">
        {/* Vibrant Ambient Background Elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-400/15 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center">
            {/* Left Column: Authoritative Indian Cooperative Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <ShieldCheck className="w-4 h-4 text-[#0A66C2] dark:text-blue-400" />
                  <span>COOPNEX • CONNECTED COOPERATIVE NETWORK</span>
                </div>
              </div>

              {/* Headline & Core Brand Statement */}
              <div className="space-y-2">
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  People. Skills.{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent block sm:inline">
                    Cooperatives. Connected.
                  </span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed pt-1">
                  Connect with trusted local services and skilled workers through a cooperative-powered network built around people and opportunity.
                </p>
              </div>

              {/* Quick Service Search Console */}
              <div className="bg-white dark:bg-slate-900/95 p-3.5 sm:p-4 rounded-2xl shadow-xl shadow-blue-900/5 dark:shadow-black/40 border border-slate-200 dark:border-white/10 max-w-xl" id="services-marketplace">
                <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-Digit Pincode (e.g. 520001)"
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden placeholder:text-slate-400"
                    />
                  </div>

                  <div className="w-full sm:w-44 px-3 py-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center">
                    <select
                      value={selectedTrade}
                      onChange={(e) => setSelectedTrade(e.target.value)}
                      aria-label="Select Trade"
                      className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                    >
                      {serviceCategories.map((s) => (
                        <option key={s.name} value={s.name} className="dark:bg-slate-900">
                          {s.name} ({s.rate})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-[#0A66C2] hover:bg-[#004182] text-white !min-h-[44px] !py-2 !px-5 rounded-xl text-xs font-bold shrink-0 cursor-pointer shadow-md shadow-blue-500/25 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                  >
                    {isSearching ? (
                      <span>Searching...</span>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Find Pro</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Hub Chips */}
                <div className="mt-3 px-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    Quick hubs:{" "}
                    {[
                      { name: "Vijayawada", pin: "520001" },
                      { name: "Hyderabad", pin: "500001" },
                      { name: "Bengaluru", pin: "560001" },
                      { name: "Delhi", pin: "110001" },
                      { name: "Mumbai", pin: "400001" }
                    ].map((hub, i) => (
                      <React.Fragment key={hub.pin}>
                        {i > 0 && ", "}
                        <button
                          type="button"
                          onClick={() => handleQuickHub(hub.pin)}
                          className="text-[#0A66C2] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                        >
                          {hub.name}
                        </button>
                      </React.Fragment>
                    ))}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPincodeModalOpen(true)}
                    className="text-[#0A66C2] dark:text-blue-400 font-bold hover:underline hidden sm:inline cursor-pointer"
                  >
                    All 28 States →
                  </button>
                </div>
              </div>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Primary CTA: Find a Service */}
                <a
                  href="#services-marketplace"
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#0A66C2] to-[#0256A8] hover:from-[#004182] hover:to-[#023e7d] text-white text-xs font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 transition active:scale-[0.98]"
                >
                  <Search className="w-4 h-4 text-blue-200" />
                  <span>Find a Service</span>
                </a>

                {/* Secondary CTA: Join as a Worker */}
                <Link
                  to="/for-workers"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065F46] text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2 transition active:scale-[0.98]"
                >
                  <Briefcase className="w-4 h-4 text-emerald-200" />
                  <span>Join as a Worker</span>
                </Link>

                {/* Video Tour */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPortalVideo(true);
                    const el = document.getElementById("portal-video-tour");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-4 py-3 rounded-xl bg-white dark:bg-white/10 text-slate-700 dark:text-white border border-slate-200 dark:border-white/15 text-xs font-bold flex items-center gap-2 group cursor-pointer shadow-xs hover:border-[#0A66C2] hover:bg-slate-50 transition active:scale-[0.98]"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-white" />
                  </div>
                  <span>Watch Video Tour</span>
                </button>
              </div>

              {/* Trust Stats Bar */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">3,800+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t("hero.verifiedArtisans") || "Verified Artisans"}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">4.94 / 5.0</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t("hero.citizenRating") || "Citizen Rating"}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">100%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t("hero.directFloorWages") || "Direct Floor Wages"}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Purposeful 3D WebGL Hero Stage (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <HeroCoopNetwork3D
                onTradeSelect={(trade: string) => {
                  setSelectedTrade(trade);
                  setActiveWorkerTrade(trade);
                }}
              />
            </div>
          </div>

          {/* Interactive 3D Pincode Location Matcher (Expands when 6-digits typed) */}
          {showLocationMatcher && (
            <div className="mt-8 animate-fadeIn">
              <LocationMatching3D
                pincode={pincodeInput || selectedPincode}
                locationName={currentLocationInfo.city}
                onMatchFound={(w) =>
                  handleOpenTrialBooking({
                    name: w.name,
                    trade: w.trade,
                    rate: 380,
                    rating: w.rating,
                    society: currentLocationInfo.cooperativeName
                  })
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2B. PROMINENT MULTILINGUAL VIDEO EXPLAINER TOUR SHOWCASE                   */}
      {/* ========================================================================= */}
      <section id="portal-video-tour" className="relative py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-6 space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-purple-500/15 text-slate-800 dark:text-slate-100 px-4 py-1.5 rounded-full border border-rose-500/30 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 dark:from-rose-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
              {t("video.badge") || "24/7 MULTILINGUAL EXPLAINER VIDEO"}
            </span>
            <span className="text-slate-400 text-[10px]">10 Indian Languages</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("video.headline") || "How COOPNEX Works"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {t("video.subheadline") || "Experience our interactive video walkthrough with authentic conversational voice narration in Telugu, Hindi, Tamil, English, and more. See how verified artisans receive 100% statutory floor wages with zero aggregator commission."}
          </p>
        </div>

        {showPortalVideo ? (
          <div className="relative animate-fadeIn">
            <ContinuousPortalVideo
              currentLanguage={language}
              onClose={() => setShowPortalVideo(false)}
            />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E11D48] to-[#BE185D] text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/25">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Multilingual Video Tour Minimized
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Listen to the full spoken explainer with animated artisan visuals in Telugu, Hindi, Tamil, Kannada, Marathi, and more.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPortalVideo(true)}
              className="btn-primary !min-h-[44px] !px-6 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Re-Open Video Tour</span>
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. 24/7 RAPID EMERGENCY DISPATCH RADAR (WEBGL)                            */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmergencyRadar3D />
      </section>

      {/* ========================================================================= */}
      {/* 4. 3D TRADE & SERVICES CONSTELLATION (WEBGL)                              */}
      {/* ========================================================================= */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-white/10 px-4 py-1 rounded-full border border-blue-200 dark:border-white/15 shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("services.badge") || "Interactive Trade Galaxy"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("services.title") || "Verified Cooperative Trades"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t("services.subtitle") || "Browse verified artisan trades with statutory minimum hourly rates, safety certifications, and primary society rosters."}
          </p>
        </div>

        <ServicesConstellation3D
          onSelectService={(trade) => {
            setSelectedTrade(trade);
            setActiveWorkerTrade(trade);
            const el = document.getElementById("workers-directory");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </section>

      {/* ========================================================================= */}
      {/* 5. NATIONAL COOPERATIVE DISPATCH EXPRESS (ROAD ANIMATION JOURNEY)        */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E11D48] dark:text-pink-300 bg-pink-50 dark:bg-white/10 px-4 py-1 rounded-full border border-pink-200 dark:border-white/15 shadow-2xs">
            <Navigation className="w-3.5 h-3.5 text-[#E11D48] dark:text-pink-400" />
            <span>{t("how.badge") || "End-to-End Road Transparency"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("how.headline") || "How COOPNEX Works"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Follow the complete 5-stage dispatch corridor with real-time road telemetry from automated society dispatch to direct Bharat UPI soundbox settlement.
          </p>
        </div>

        <TharDoorstepRoadAnimation />
      </section>

      {/* ========================================================================= */}
      {/* 6. TRANSPARENT 3D VALUE DISTRIBUTION LEDGER & WELFARE FLOW                */}
      {/* ========================================================================= */}
      <section id="economics" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-pink-300 bg-pink-50 dark:bg-white/10 px-4 py-1 rounded-full border border-pink-200 dark:border-white/15 shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span>{t("about.badge") || "Radical Economic Fairness"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            0% Platform Cut. <span className="text-blue-600 dark:text-blue-400">100% Dignity.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t("about.subheadline") || "Unlike commercial gig apps that extract 25-35% from every job, COOPNEX passes the entire base wage directly to the artisan."}
          </p>
        </div>

        <CooperativeEcosystem3D />
      </section>

      {/* ========================================================================= */}
      {/* 6B. NATIONAL COOPERATIVE MOTTO & 6 PRINCIPLES AUTOSLIDER (HUMAN GUIDE)   */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <CooperativeMottoPrinciples />
      </section>

      {/* ========================================================================= */}
      {/* 6C. COMMUNITY EMERGENCY BLOOD SOLIDARITY NETWORK (MULTILINGUAL 10 LANGS)  */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Official Heading: Our Social Services */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-4 py-1.5 rounded-full border border-rose-200 dark:border-rose-800 shadow-2xs">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-current animate-pulse" />
            <span>Community Welfare &amp; Mutual Aid</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Social Services
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Beyond livelihood generation: 24x7 emergency blood bank matching, artisan family healthcare, and community mutual aid across India.
          </p>
        </div>

        <EmergencyBloodCoopBanner />
      </section>

      {/* ========================================================================= */}
      {/* 7. NATIONAL 3D COOPERATIVE NETWORK GLOBE                                  */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-white/10 px-4 py-1 rounded-full border border-amber-200 dark:border-white/15 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>{t("network.badge") || "Pan-India Cooperative Grid"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("network.title") || "Federal Cooperative Infrastructure"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            {t("network.subtitle") || "Interactive 3D network linking district labour societies, state federations, and urban primary centers."}
          </p>
        </div>

        <CooperativeGlobe3D />
      </section>

      {/* ========================================================================= */}
      {/* 8. 3D AI DEMAND & COOPERATIVE DISPATCH SIMULATION                         */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AIDemandForecast3D />
      </section>

      {/* ========================================================================= */}
      {/* 9. LIVE VERIFIED WORKERS DIRECTORY & TRIAL BOOKING                        */}
      {/* ========================================================================= */}
      <section id="workers-directory" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-white/10 border border-blue-200 dark:border-white/15 px-3.5 py-1 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t("directory.badge") || "Verified Society Rosters"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("directory.headline") || "Meet Verified Local Artisans"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            {t("directory.subheadline") || "Government UIDAI Verhoeff verified, police cleared, and backed by primary cooperative societies."}
          </p>
        </div>

        {/* Pan-India Active Location Selector */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-5 sm:p-7 mb-8 shadow-xl border border-blue-500/20 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>{t("directory.activeZone") || "ACTIVE COOPERATIVE CIRCLE"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white flex flex-wrap items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{t("directory.serving") || "Serving"} {currentLocationInfo.city}, {currentLocationInfo.state}</span>
                <span className="text-xs bg-white/15 text-white border border-white/20 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  PIN: {selectedPincode}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Society: <span className="text-white font-semibold">{currentLocationInfo.cooperativeName}</span> • Standard Dispatch SLA: <span className="text-rose-400 font-bold">~15-18 mins</span>
              </p>
            </div>

            {/* Custom Pincode Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                maxLength={6}
                value={locationPincodeInput}
                onChange={(e) => setLocationPincodeInput(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && locationPincodeInput.length === 6) {
                    updateActiveLocation(locationPincodeInput);
                    setLocationPincodeInput("");
                  }
                }}
                placeholder={t("hero.searchPlaceholder") || "Enter 6-digit PIN"}
                className="w-40 sm:w-44 px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/25 text-white placeholder-slate-400 focus:bg-white focus:text-slate-900 focus:outline-hidden font-mono transition"
              />
              <button
                type="button"
                disabled={locationPincodeInput.length !== 6}
                onClick={() => {
                  if (locationPincodeInput.length === 6) {
                    updateActiveLocation(locationPincodeInput);
                    setLocationPincodeInput("");
                  }
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 !min-h-[38px] !px-4 text-xs font-bold rounded-xl shrink-0 disabled:opacity-40 cursor-pointer transition"
              >
                {t("directory.changePin") || "Change PIN"}
              </button>
            </div>
          </div>

          {/* Quick City Selector Chips */}
          <div className="mt-5 pt-4 border-t border-white/10 relative z-10">
            <span className="text-[11px] font-semibold text-slate-300 block mb-2">
              {t("directory.quickSwitch") || "Quick switch federation circles:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Vijayawada", pin: "520001" },
                { name: "Hyderabad", pin: "500001" },
                { name: "Bengaluru", pin: "560001" },
                { name: "Chennai", pin: "600001" },
                { name: "New Delhi", pin: "110001" },
                { name: "Mumbai", pin: "400001" },
                { name: "Jaipur", pin: "302001" },
                { name: "Ahmedabad", pin: "380001" },
                { name: "Kolkata", pin: "700001" }
              ].map((hub) => (
                <button
                  key={hub.pin}
                  type="button"
                  onClick={() => updateActiveLocation(hub.pin)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden ${
                    selectedPincode === hub.pin
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold shadow-md scale-105"
                      : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
                  }`}
                >
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>{hub.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({hub.pin})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Filter Tabs with accessible tablist and SVG icons */}
        <div
          role="tablist"
          aria-label="Filter Artisans by Trade"
          className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8"
        >
          {[
            { id: "ALL", labelKey: "services.all", defaultLabel: "All Artisans", icon: Users },
            { id: "Electrician", labelKey: "services.electrician", defaultLabel: "Electrician", icon: Zap },
            { id: "Plumber", labelKey: "services.plumber", defaultLabel: "Plumber", icon: Wrench },
            { id: "Carpenter", labelKey: "services.carpenter", defaultLabel: "Carpenter", icon: Hammer },
            { id: "Painter", labelKey: "services.painter", defaultLabel: "Painter", icon: Paintbrush },
            { id: "Cleaner", labelKey: "services.cleaner", defaultLabel: "Deep Cleaner", icon: Sparkles },
            { id: "Caregiver", labelKey: "services.caregiver", defaultLabel: "Caregiver", icon: HeartHandshake },
            { id: "Gardener", labelKey: "services.gardener", defaultLabel: "Gardener", icon: Trees }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeWorkerTrade === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                type="button"
                onClick={() => setActiveWorkerTrade(tab.id)}
                className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105"
                    : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t(tab.labelKey) || tab.defaultLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Worker Cards Grid with Empty State Fallback */}
        {loadingWorkers ? (
          <div className="text-center py-16 text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-coop-forest border-t-transparent animate-spin" />
            <span>Loading verified artisans for {currentLocationInfo.city}...</span>
          </div>
        ) : liveWorkers.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white dark:bg-white/5 rounded-2xl border border-coop-forest/15 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-coop-mint dark:bg-white/10 text-coop-forest dark:text-rose-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">No artisans found for &quot;{activeWorkerTrade}&quot;</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              There are currently no active artisans in this trade category in {currentLocationInfo.city}. Try another trade or view all available artisans.
            </p>
            <button
              type="button"
              onClick={() => setActiveWorkerTrade("ALL")}
              className="btn-primary !min-h-[40px] !px-4 text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show All Artisans</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveWorkers.map((worker) => (
              <TiltCard3D key={worker._id} maxTilt={6} scaleOnHover={1.01} className="h-full">
                <div className="card-worker dark:bg-coop-navy dark:border-white/10 flex flex-col justify-between space-y-4 group relative h-full">
                  <div>
                    {/* Card Header with Avatar & Badge */}
                    <div className="flex items-start justify-between">
                      <div className="relative overflow-hidden rounded-xl border-2 border-rose-600/30 group-hover:border-rose-500 transition-colors shadow-xs">
                        <img
                          src={
                            worker.avatarUrl ||
                            (worker.gender === "Female"
                              ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                              : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80")
                          }
                          alt={worker.name}
                          className="w-16 h-16 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-coop-navy flex items-center justify-center text-[9px] text-white font-black">
                          ✓
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 dark:text-white block font-mono">
                          ₹{worker.baseHourlyRate || 380}/hr
                        </span>
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 block mt-0.5">
                          {t("ticker.zeroComm") || "0% Commission"}
                        </span>
                      </div>
                    </div>

                    {/* Worker Name & Trade */}
                    <div className="mt-3">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">{worker.name}</h3>
                        <span className="text-rose-500 font-bold" title="Verified Artisan">✓</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-pink-500/10 text-rose-700 dark:text-emerald-300 border border-emerald-500/25">
                          {worker.skills?.[0] || "Specialist"}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25">
                          UIDAI Aadhaar
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-1 font-medium">
                        {worker.societyName || currentLocationInfo.cooperativeName}
                      </p>
                      <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5 flex items-center gap-1 font-mono">
                        <span>📍 {worker.district || currentLocationInfo.city}</span>
                        <span>•</span>
                        <span>⚡ ~{worker.etaMinutes || 15} min dispatch</span>
                      </p>
                    </div>

                    {/* Experience & Rating Chips */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-white/10 text-xs">
                      <span className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{worker.rating || 4.9}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {worker.experienceYears || 5}+ yrs • {worker.jobsCompletedCount || 180}+ jobs
                      </span>
                    </div>
                  </div>

                  {/* Trial Booking Button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenTrialBooking({
                        name: worker.name,
                        trade: worker.skills?.[0] || "Specialist",
                        rate: worker.baseHourlyRate || 380,
                        rating: worker.rating || 4.9,
                        society: worker.societyName || currentLocationInfo.cooperativeName,
                        avatar: worker.avatarUrl
                      })
                    }
                    className="w-full btn-accent !min-h-[42px] text-xs font-bold justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden"
                  >
                    <span>{t("trial.bookTrialBtn") || "Book Trial Service"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </TiltCard3D>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 10. DEDICATED WORKER PORTAL ON HOME PAGE + INCOME CALCULATOR              */}
      {/* ========================================================================= */}
      <section id="worker-cooperative-portal" className="py-20 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 text-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-slate-200">
        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E11D48] bg-pink-50 px-4 py-1 rounded-full border border-pink-200 shadow-2xs">
              <Users className="w-3.5 h-3.5" />
              <span>{t("worker.badge") || "For Labourers & Societies"}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t("worker.headline") || "Earn Fair Wages. Own Your Platform."}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {t("worker.subheadline") || "No middleman commission cuts. Free PMSBY insurance, pension fund allocation, and transparent daily payouts."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Extra Earnings Calculator (Light Theme) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{t("worker.calcTitle") || "Monthly Take-Home Calculator"}</h3>
                  <p className="text-xs text-slate-500">Comparing 0% cooperative cut vs. 28% commercial aggregator commission</p>
                </div>
                <span className="text-xs font-mono font-bold text-rose-700 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full shadow-2xs">
                  Instant Daily UPI
                </span>
              </div>

              {/* Slider for monthly jobs */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{t("worker.monthlyJobs") || "Monthly Completed Jobs"}</span>
                  <span className="text-[#E11D48] font-mono text-sm">{monthlyJobs} Jobs</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  value={monthlyJobs}
                  onChange={(e) => setMonthlyJobs(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E11D48]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Part-time (10 jobs)</span>
                  <span>Full-time (45 jobs)</span>
                  <span>Master Crew (80 jobs)</span>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-700">Commercial Gig App</span>
                  <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono">
                    ₹{privateTakeHome.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[11px] text-red-600 font-semibold">
                    -₹{privateLostMoney.toLocaleString("en-IN")} lost in app commission
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/80 border border-pink-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-800">COOPNEX</span>
                  <div className="text-xl sm:text-2xl font-black text-[#E11D48] font-mono">
                    ₹{cooperativeTakeHome.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[11px] text-rose-700 font-bold">
                    +₹{privateLostMoney.toLocaleString("en-IN")} extra retained in your wallet!
                  </p>
                </div>
              </div>

              {/* Core Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>No experience certificates required</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Free ₹5 Lakh PMSBY accidental insurance</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Tools & equipment federation subsidy</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Democratic voting shareholder status</span>
                </div>
              </div>
            </div>

            {/* Direct Action Hub with Real Worker Imagery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
                <div className="relative h-36 rounded-2xl overflow-hidden mb-2 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80"
                    alt="Join COOPNEX Artisan Cooperative"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white">
                    National Labour Cooperative Mission • 1 Worker = 1 Vote
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Day Aadhaar Onboarding</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Join as an Independent Artisan or Cooperative Society
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Whether you are an electrician, plumber, carpenter, painter, or technician, enroll with Aadhaar or through your district primary society.
                </p>

                <div className="space-y-2.5 pt-2">
                  <Link
                    to="/join-worker"
                    className="w-full py-3 px-4 rounded-xl bg-[#E11D48] hover:bg-[#BE185D] active:scale-98 text-white font-bold text-xs shadow-md shadow-[#E11D48]/25 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>{t("worker.registerBtn") || "Register as Artisan (0% Cut)"}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </Link>

                  <Link
                    to="/for-workers"
                    className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t("worker.portalBtn") || "Worker Portal & Welfare Dashboard"}</span>
                  </Link>

                  <Link
                    to="/for-cooperatives"
                    className="w-full py-2.5 text-center text-xs font-bold text-slate-500 hover:text-[#E11D48] transition block"
                  >
                    Primary Society Registration & Federation Onboarding →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. REAL COMPLETED WORK PROOF GALLERY                                     */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-white/10 px-4 py-1 rounded-full border border-blue-200 dark:border-white/15 shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("proof.badge") || "Verified Work Proof"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("proof.headline") || "Real Completed Repairs"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            {t("proof.subheadline") || "Every completed job submits photo proof and customer verification before escrow payment release."}
          </p>

          {/* Category Switcher Tabs */}
          <div className="flex justify-center gap-2 pt-4 flex-wrap">
            {(["All", "Electrical", "Plumbing", "Woodwork", "Cleaning"] as const).map((cat) => {
              const catKey = cat === "All" ? "proof.catAll" : cat === "Electrical" ? "proof.catElectrical" : cat === "Plumbing" ? "proof.catPlumbing" : cat === "Woodwork" ? "proof.catWoodwork" : "proof.catCleaning";
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveProofCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeProofCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                      : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50"
                  }`}
                >
                  {t(catKey) || cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProofs.map((proof) => {
            const categoryBadgeStyle =
              proof.category === "Electrical"
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                : proof.category === "Plumbing"
                ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30"
                : proof.category === "Woodwork"
                ? "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30"
                : "bg-pink-500/15 text-rose-700 dark:text-pink-300 border-pink-500/30";

            return (
              <div
                key={proof.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Vertically large, uniform 3:4 aspect container for all 4 cards */}
                  <div className="relative aspect-[3/4] h-84 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img
                      src={proof.beforeImg}
                      alt={proof.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-rose-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-xs flex items-center gap-1">
                      <span>✓</span>
                      <span>{proof.verifiedBadge}</span>
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold px-2 py-0.5 rounded-md border text-[11px] ${categoryBadgeStyle}`}>
                        {proof.category}
                      </span>
                      <div className="flex items-center text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1">{proof.rating}.0</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {proof.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3 leading-relaxed">
                      &quot;{proof.customerQuote}&quot;
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-white/10 text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span className="truncate font-semibold text-slate-700 dark:text-slate-200">
                    {proof.worker}
                  </span>
                  <span className="truncate text-right text-blue-600 dark:text-blue-400 font-mono text-[10px] font-semibold">
                    📍 {proof.location}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. CITIZEN & ARTISAN TESTIMONIALS                                        */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-50/70 dark:bg-slate-950/70 border-y border-slate-200/80 dark:border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3.5 py-1 rounded-full border border-blue-200 dark:border-blue-800/30">
              {t("testimonials.badge") || "Community Trust"}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("testimonials.headline") || "Voices of the Cooperative"}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {t("testimonials.subheadline") || "Real experiences from citizens and skilled workers across India."}
            </p>

            {/* Testimonial Switcher Tabs */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setActiveTestimonialTab("citizens")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTestimonialTab === "citizens"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-white/10"
                }`}
              >
                {t("testimonials.citizens") || "From Citizens"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTestimonialTab("artisans")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTestimonialTab === "artisans"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-slate-200 dark:border-white/10"
                }`}
              >
                {t("testimonials.artisans") || "From Artisans"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTestimonialTab === "citizens" ? (
              <>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      &quot;When our main distribution box sparked at 9 PM in Vijayawada, an emergency cooperative electrician arrived within 11 minutes. Zero surge price gouging.&quot;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Priya Sundaram</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Governorpet, Vijayawada</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 px-2.5 py-0.5 rounded-full">
                      Emergency Electrician
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      &quot;Knowing that the caregiver who assists my elderly mother has verified police records and is an actual cooperative member gives our family peace of mind.&quot;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Raghavendra Rao</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Gachibowli, Hyderabad</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 px-2.5 py-0.5 rounded-full">
                      Elder Care
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      &quot;Private gig apps charged exorbitant platform fees while the worker barely received 70%. On COOPNEX, 100% of my payment reached the carpenter.&quot;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dr. Arvind Varma</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Indiranagar, Bengaluru</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 px-2.5 py-0.5 rounded-full">
                      Home Carpentry
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      &quot;In corporate apps, I was losing 28% commission and had zero rights. In COOPNEX, I am a co-owner of my primary cooperative. 100% goes to my UPI account.&quot;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Raj Kumar</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Vijayawada Central Co-op</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 px-2.5 py-0.5 rounded-full">
                      Electrician • 8 Yrs
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      &quot;Because of COOPNEX&apos;s cooperative network with government welfare, my entire family is covered under ₹5 Lakh accidental insurance and my daughter received a study grant.&quot;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Suresh Babu</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Guntur Urban Labour Union</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 px-2.5 py-0.5 rounded-full">
                      Master Plumber
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-blue-500/30 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      &quot;As a female domestic technician, doorstep safety is everything. The customer OTP confirmation before work starts gives me complete confidence.&quot;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sarada Devi</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Vijayawada North Co-op</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 px-2.5 py-0.5 rounded-full">
                      Caregiver • 6 Yrs
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FINAL COMMUNITY CALL-TO-ACTION                                        */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/25">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t("cta.headline") || "Ready for Fair, Guaranteed Service?"}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
          {t("cta.subheadline") || "Experience the dignity of cooperative labour and the reliability of government-verified local craftsmanship today."}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/services"
            className="btn-primary !min-h-[46px] !px-8 text-sm font-bold shadow-lg"
          >
            <span>{t("cta.bookBtn") || "Book Verified Service"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/join-worker"
            className="btn-accent !min-h-[46px] !px-8 text-sm font-bold"
          >
            {t("cta.joinBtn") || "Join as Artisan"}
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: EXPLAINER VIDEO LIGHTBOX MODAL                                   */}
      {/* ========================================================================= */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-coop-navy rounded-2xl border border-white/15 shadow-2xl max-w-4xl w-full overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-coop-emerald animate-pulse" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  COOPNEX Platform Walkthrough (Interactive Multi-Trade Tour)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  ttsService.stop();
                  setVideoModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 sm:p-4">
              <ContinuousPortalVideo
                currentLanguage={language}
                onClose={() => {
                  ttsService.stop();
                  setVideoModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INTERACTIVE TRIAL BOOKING MODAL                                   */}
      {/* ========================================================================= */}
      {trialWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/15 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-blue-50/40 dark:bg-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {trialConfirmed ? "Trial Booking Confirmed!" : "1-Click Trial Booking"}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Direct cooperative connection • Zero intermediary cut
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrialWorker(null)}
                className="w-8 h-8 rounded-full bg-white dark:bg-white/10 text-slate-500 dark:text-slate-400 flex items-center justify-center transition cursor-pointer border border-slate-200 dark:border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                <div className="relative inline-block mx-auto mb-2">
                  <img
                    src={
                      trialWorker.avatar ||
                      "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                    }
                    alt={trialWorker.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-blue-500/30 shadow-md mx-auto"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-[10px] text-white font-black">
                    ✓
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  {trialWorker.name}
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  {trialWorker.trade} • {trialWorker.society || "Vijayawada Labour Co-op"}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                  <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      Citizen Rating
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center justify-center gap-0.5 mt-0.5">
                      ★ {trialWorker.rating || 4.9}
                    </span>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      Floor Wage
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                      ₹{trialWorker.rate || 380}/hr
                    </span>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      Commission
                    </span>
                    <span className="text-xs font-bold text-rose-500 mt-0.5 block">
                      0% (Zero Cut)
                    </span>
                  </div>
                </div>
              </div>

              {!trialConfirmed ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleConfirmTrialBooking();
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Service Date
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Today", "Tomorrow", "Pick Custom"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setTrialDate(d)}
                          className={`py-2 px-3 rounded-xl font-bold border transition text-center cursor-pointer ${
                            trialDate === d
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-xs"
                              : "bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={trialSlot}
                      onChange={(e) => setTrialSlot(e.target.value)}
                      className="input-coop"
                    >
                      <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                      <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                      <option value="Evening (5:00 PM - 7:00 PM)">Evening (5:00 PM - 7:00 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Service Address
                    </label>
                    <input
                      type="text"
                      value={trialAddress}
                      onChange={(e) => setTrialAddress(e.target.value)}
                      required
                      placeholder="Enter flat/door no, landmark, pincode"
                      className="input-coop"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Task Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={trialNotes}
                      onChange={(e) => setTrialNotes(e.target.value)}
                      placeholder="e.g., Fix ceiling fan wiring, check master switchboard"
                      className="input-coop"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Cooperative Statutory Labour (1 hr):</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹{trialWorker.rate || 380}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Worker Welfare &amp; Insurance Fund:</span>
                      <span className="font-bold text-slate-900 dark:text-white">₹40</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Platform Tech Fee:</span>
                      <span className="font-bold text-rose-500">₹0 (Zero Middleman Cut)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                      <span>Estimated Total:</span>
                      <span className="text-blue-600 dark:text-blue-400">₹{(trialWorker.rate || 380) + 40}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary !min-h-[46px] text-xs font-bold justify-center cursor-pointer shadow-md"
                  >
                    <span>Confirm Trial Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center py-2 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl font-black">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200">
                      ID: {trialBookingId}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mt-2">
                      Trial Request Dispatched!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                      <strong>{trialWorker.name}</strong> from{" "}
                      <em>{trialWorker.society || "Vijayawada Labour Co-op"}</em> has received your trial booking.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">Worker ETA:</span>
                      <span className="font-bold text-slate-900 dark:text-white">12-15 Minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">Safety OTP:</span>
                      <span className="font-mono font-black text-amber-500 text-sm tracking-widest">
                        4892
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/10">
                      Share this 4-digit OTP with the technician only upon arrival at your doorstep.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                    <button
                      type="button"
                      onClick={handleTriggerPayment}
                      className="w-full btn-accent !min-h-[42px] text-xs font-bold justify-center cursor-pointer shadow-md"
                    >
                      <span>Simulate Service Complete ➔ Pay &amp; Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => navigate("/customer")}
                      className="flex-1 btn-primary !min-h-[38px] text-xs font-bold justify-center cursor-pointer"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrialWorker(null)}
                      className="flex-1 btn-secondary dark:bg-white/10 dark:text-white dark:border-white/10 !min-h-[38px] text-xs font-bold justify-center cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SIGN-IN REQUIRED FOR TRIAL BOOKING (AUTH GATING)                 */}
      {/* ========================================================================= */}
      {authPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/15 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-blue-50/40 dark:bg-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Citizen Sign-In Required
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Doorstep safety &amp; verified dispatch
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuthPromptOpen(false)}
                className="w-8 h-8 rounded-full bg-white dark:bg-white/10 text-slate-500 dark:text-slate-400 flex items-center justify-center transition border border-slate-200 dark:border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-center">
              {pendingWorkerForAuth && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-left">
                  <img
                    src={pendingWorkerForAuth.avatar || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"}
                    alt={pendingWorkerForAuth.name}
                    className="w-12 h-12 rounded-lg object-cover border border-blue-500/20 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {pendingWorkerForAuth.name}
                    </h4>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      {pendingWorkerForAuth.trade} • {pendingWorkerForAuth.society || "Vijayawada Labour Co-op"}
                    </p>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      ₹{pendingWorkerForAuth.rate || 380}/hr statutory rate
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                To confirm your service address, verify safety OTPs, and dispatch registered cooperative artisans, please sign in or create a citizen account.
              </p>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handle1ClickCitizenLogin}
                  className="w-full btn-primary !min-h-[44px] text-xs font-bold justify-center shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Sign In as Citizen (Instant Demo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login?redirect=/")}
                  className="w-full btn-secondary dark:bg-white/10 dark:text-white dark:border-white/10 !min-h-[42px] text-xs font-bold justify-center cursor-pointer"
                >
                  <span>Sign In with Password / Email OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="w-full py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition cursor-pointer"
                >
                  New to COOPNEX? Create Free Account →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: REALISTIC NPCI BHARAT SEVA PAYMENT GATEWAY                       */}
      {/* ========================================================================= */}
      {paymentModalOpen && trialWorker && (
        <RealisticPaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          booking={{
            bookingNumber: "SS-AP-2026-8941",
            serviceType: trialWorker.trade || "General Trade",
            amount: (trialWorker.rate || 380) + 40,
            workerName: trialWorker.name,
            workerPhone: trialWorker.phone || "+91 98765 43210"
          }}
          onPaymentSuccess={() => {
            setPaymentDone(true);
          }}
          onOpenReview={() => {
            setPaymentModalOpen(false);
            setReviewModalOpen(true);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: WORKER EXPERIENCE, BEHAVIOUR & WORK MEDIA REVIEW MODAL            */}
      {/* ========================================================================= */}
      {reviewModalOpen && trialWorker && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          bookingId="SS-AP-2026-8941"
          worker={{
            name: trialWorker.name,
            avatar: trialWorker.avatar,
            trade: trialWorker.trade,
            society: trialWorker.society || "Vijayawada Central Cooperative Society"
          }}
          initialRating={reviewRating}
          initialBehaviour={reviewBehaviour}
          initialComment={reviewComment}
          onReviewSubmitted={(payload) => {
            setReviewRating(payload.rating);
            setReviewBehaviour(payload.behaviourRating);
            setReviewComment(payload.comment);
            setReviewSubmitted(true);
          }}
        />
      )}

      {/* Pincode Service Availability Modal */}
      <PincodeCheckerModal
        isOpen={pincodeModalOpen}
        onClose={() => setPincodeModalOpen(false)}
        initialPincode={pincodeInput}
        initialService={selectedTrade}
        onSelectPincode={(pin) => updateActiveLocation(pin)}
      />
    </div>
  );
};
export default LandingPage;
