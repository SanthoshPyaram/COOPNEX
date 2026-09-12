import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";
import { WorkerProfile, Booking, FairWageBreakdown } from "../types";
import { VerificationBadge } from "../components/VerificationBadge";
import { FairWageBreakdownCard } from "../components/FairWageBreakdownCard";
import { WhyThisWorkerModal } from "../components/WhyThisWorkerModal";
import { StatusTimeline } from "../components/StatusTimeline";
import { LeafletMap } from "../components/LeafletMap";
import { resolveWorkerAvatar } from "../utils/workerAvatar";
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
  Send,
  Download
} from "lucide-react";

export const CustomerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useLanguage();

  const activeTab = searchParams.get("tab") || "browse";
  const initialService = searchParams.get("service") || "Electrician";
  const currentPincode = searchParams.get("pincode") || "520001";

  // Search & Filter State
  const [selectedService, setSelectedService] = useState(initialService);
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Data State
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected Worker & Modals
  const [selectedWorkerForWhy, setSelectedWorkerForWhy] = useState<any | null>(null);
  const [bookingModalWorker, setBookingModalWorker] = useState<WorkerProfile | null>(null);

  // Booking Flow State (Guided Steps)
  const [bookingStep, setBookingStep] = useState(1);
  const [requirementText, setRequirementText] = useState("");
  const [isEmergencyOption, setIsEmergencyOption] = useState(false);
  const [bookingAddress, setBookingAddress] = useState("Flat 402, Sri Sai Residency, Near Benz Circle, Vijayawada");
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any | null>(null);

  // Rating Modal
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Emergency Flow Specific State
  const [emergencyCategory, setEmergencyCategory] = useState("Electrician");
  const [emergencyDescription, setEmergencyDescription] = useState("Sparking switchboard with burning smell in bedroom");
  const [emergencyActiveBooking, setEmergencyActiveBooking] = useState<Booking | null>(null);
  const [emergencyStep, setEmergencyStep] = useState<"IDLE" | "MATCHING" | "ASSIGNED" | "TRACKING" | "COMPLETED">("IDLE");

  // Load Workers & Bookings
  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkers({
        skill: selectedService,
        pincode: currentPincode,
        minRating: minRating > 0 ? minRating : undefined,
        verificationLevel: verifiedOnly ? 4 : undefined
      });
      if (data && Array.isArray(data)) {
        setWorkers(data);
      } else {
        setWorkers([]);
      }
    } catch (err) {
      console.error(err);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await api.getMyBookings();
      setMyBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadWorkers();
    loadBookings();
  }, [selectedService, minRating, verifiedOnly]);

  // Trigger Emergency Electrical / Plumbing Request
  const handleTriggerEmergency = async () => {
    setEmergencyStep("MATCHING");
    try {
      const res = await api.triggerEmergency({
        serviceCategory: emergencyCategory,
        emergencyIssue: emergencyDescription,
        customerLatitude: 16.5062,
        customerLongitude: 80.6480,
        customerAddress: bookingAddress
      });

      if (res.success && res.booking) {
        setEmergencyActiveBooking(res.booking);
        setEmergencyStep("ASSIGNED");

        // Simulate fast transition to ON_THE_WAY for live demonstration
        setTimeout(async () => {
          await api.updateBookingStatus(res.booking._id, "ON_THE_WAY", "Worker Raj Kumar dispatched on two-wheeler. Transit ETA 6 min.");
          setEmergencyStep("TRACKING");
          loadBookings();
        }, 2200);
      }
    } catch (err) {
      console.error(err);
      setEmergencyStep("IDLE");
    }
  };

  // Complete Emergency Service Simulation
  const handleSimulateCompletion = async () => {
    if (!emergencyActiveBooking) return;
    try {
      await api.updateBookingStatus(emergencyActiveBooking._id, "COMPLETED", "Service safely inspected, damaged MCB replaced, hazard cleared.");
      setEmergencyStep("COMPLETED");
      const inv = await api.getInvoice(emergencyActiveBooking._id);
      setCurrentInvoice(inv.invoice);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  // Standard Guided Booking Confirmation
  const handleConfirmStandardBooking = async () => {
    if (!bookingModalWorker) return;
    setLoading(true);
    try {
      const res = await api.createBooking({
        serviceCategory: selectedService,
        requirementDescription: requirementText || `Scheduled ${selectedService} maintenance`,
        serviceLocation: {
          address: bookingAddress,
          coordinates: [80.6480, 16.5062]
        },
        workerId: bookingModalWorker._id,
        bookingType: isEmergencyOption ? "EMERGENCY" : "STANDARD"
      });

      if (res.success && res.booking) {
        setCreatedBooking(res.booking);
        setBookingStep(3); // Payment step
        loadBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Payment Execution (Mock Razorpay Sandbox)
  const handleProcessPayment = async () => {
    const targetBooking = createdBooking || emergencyActiveBooking;
    if (!targetBooking) return;

    setIsProcessingPayment(true);
    try {
      const res = await api.verifyPayment({
        bookingId: targetBooking._id,
        razorpayPaymentId: `pay_mock_${Date.now()}`,
        razorpayOrderId: `order_mock_${Date.now()}`,
        method: "UPI (Google Pay / PhonePe)"
      });

      if (res.success) {
        setPaymentSuccess(true);
        setCurrentInvoice(res.invoice);
        if (bookingModalWorker) setBookingStep(4);
        loadBookings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Submit Feedback
  const handleSubmitFeedback = async () => {
    if (!reviewBookingId) return;
    try {
      await api.submitReview({
        bookingId: reviewBookingId,
        rating: reviewRating,
        qualityScore: reviewRating,
        punctualityScore: reviewRating,
        professionalismScore: reviewRating,
        valueScore: reviewRating,
        comment: reviewComment || "Excellent punctual service provided by cooperative worker."
      });
      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewBookingId(null);
        setReviewSubmitted(false);
        loadBookings();
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Tabs Header */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchParams({ tab: "browse" })}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === "browse"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Browse Services & Verified Workers
            </button>

            <button
              onClick={() => setSearchParams({ tab: "emergency" })}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === "emergency"
                  ? "bg-red-600 text-white shadow-xs animate-pulse"
                  : "text-red-700 bg-red-50 hover:bg-red-100"
              }`}
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>🚨 7m Emergency Dispatch</span>
            </button>

            <button
              onClick={() => setSearchParams({ tab: "bookings" })}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === "bookings"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              My Bookings ({myBookings.length})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Vijayawada Central (Benz Circle)</span>
          </div>
        </div>

        {/* TAB 1: BROWSE SERVICES & WORKERS */}
        {activeTab === "browse" && (
          <div className="space-y-6">
            {/* Category Pill Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  "Electrician",
                  "Plumber",
                  "Carpenter",
                  "Painter",
                  "Cleaner",
                  "Caregiver",
                  "Driver",
                  "Gardener",
                  "Technician",
                  "Domestic Helper"
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedService(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedService === cat
                        ? "bg-blue-800 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Rating Filter Bar */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by worker name, certification or colony..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-slate-900 w-full focus:outline-hidden text-xs"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Level 4+ State Certified Only</span>
                  </label>

                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-hidden"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4.5}>4.5★ and above</option>
                    <option value={4.8}>4.8★ and above</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Grid: Interactive Leaflet Map + Worker Result Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Worker Cards (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
                  <span>Found {workers.length} verified {selectedService}s nearby</span>
                  <span>Sorted by AI Multi-Objective Match</span>
                </div>

                {workers.filter((w) => (searchQuery ? w.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)).length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
                    <p className="text-sm font-semibold text-slate-700">
                      No workers found matching "{searchQuery}".
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl hover:bg-blue-900 transition cursor-pointer"
                    >
                      Clear Search & View All {selectedService}s
                    </button>
                  </div>
                ) : (
                  workers
                    .filter((w) =>
                      searchQuery ? w.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
                    )
                    .map((worker, idx) => {
                      const matchScore = 96 - idx * 2;
                      return (
                        <div
                        key={worker._id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={resolveWorkerAvatar(worker)}
                              alt={worker.name}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-slate-900">{worker.name}</h3>
                                <VerificationBadge level={worker.verificationLevel} size="sm" />
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {worker.skills.join(" • ")} • {worker.societyName}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5 font-medium">
                                <span className="flex items-center gap-1 text-amber-600 font-bold">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  {worker.rating}
                                  <span className="text-slate-400 font-normal">({worker.reviewCount})</span>
                                </span>
                                <span>•</span>
                                <span>{worker.experienceYears} yrs exp</span>
                                <span>•</span>
                                <span className="text-blue-600 font-semibold">1.4 km (ETA 7m)</span>
                              </div>
                            </div>
                          </div>

                          {/* Match Score Badge */}
                          <div className="text-right">
                            <button
                              onClick={() =>
                                setSelectedWorkerForWhy({
                                  name: worker.name,
                                  matchScore,
                                  trade: selectedService,
                                  distanceKm: 1.4 + idx * 0.4,
                                  etaMinutes: 7 + idx * 2,
                                  rating: worker.rating,
                                  verificationLevel: worker.verificationLevel,
                                  reasons: [
                                    `✓ ${selectedService} Competency Certified`,
                                    `✓ Level ${worker.verificationLevel} Cooperative Verified`,
                                    `✓ 1.4 km away from your location`,
                                    `✓ Zero active workload fatigue today`
                                  ],
                                  breakdown: {
                                    skill_fit: 96,
                                    distance_proximity: 92 - idx * 3,
                                    verification_level: worker.verificationLevel * 20,
                                    reputation_experience: Math.round(worker.rating * 20),
                                    workload_equity: 95
                                  }
                                })
                              }
                              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-xl text-right transition"
                            >
                              <div className="text-xs font-black text-blue-800 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                {matchScore}% MATCH
                              </div>
                              <div className="text-[10px] text-blue-600 underline font-medium">
                                Why this worker?
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Price & Action Row */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-500">Floor Wage: </span>
                            <span className="font-bold text-slate-900 text-sm">₹{worker.baseHourlyRate || 450}</span>
                            <span className="text-[10px] text-emerald-700 font-semibold ml-1">
                              (Direct Worker Take-Home)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setBookingModalWorker(worker);
                                setBookingStep(1);
                              }}
                              className="bg-blue-600 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl transition shadow-xs"
                            >
                              Book Worker
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Live Map (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Nearby Verified Workers Map
                  </h4>
                  <LeafletMap
                    center={[16.5062, 80.6480]}
                    customerLocation={[16.5062, 80.6480]}
                    workers={workers.map((w) => ({
                      id: w._id,
                      name: w.name,
                      skills: w.skills,
                      rating: w.rating,
                      coordinates: w.location.coordinates,
                      verificationLevel: w.verificationLevel
                    }))}
                    height="420px"
                  />
                  <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Your Location
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Verified Worker
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 🚨 EMERGENCY SERVICE (Winning SIH Demo Journey Scene) */}
        {activeTab === "emergency" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Urgent Banner */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase text-amber-300">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Priority 24/7 Cooperative Emergency Dispatch
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Urgent Household & Electrical Hazard Service
                </h2>
                <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
                  Automatic GPS detection assigns the nearest Level-4 certified cooperative worker with a verified average response time under 7 minutes.
                </p>
              </div>
            </div>

            {emergencyStep === "IDLE" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <h3 className="font-bold text-base text-slate-900">1. Select Emergency Category</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "Electrician", label: "Electrical Short Circuit / Spark", icon: "⚡" },
                    { id: "Plumber", label: "Major Pipe Burst / Flooding", icon: "💧" },
                    { id: "Caregiver", label: "Urgent Patient / Elder Care", icon: "🩺" },
                    { id: "Technician", label: "Gas / Critical Appliance Issue", icon: "⚠️" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setEmergencyCategory(cat.id)}
                      className={`p-4 rounded-2xl border text-left transition ${
                        emergencyCategory === cat.id
                          ? "border-red-500 bg-red-50/50 text-red-950 font-bold ring-2 ring-red-200"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="text-2xl block mb-2">{cat.icon}</span>
                      <span className="text-xs font-semibold leading-tight block">{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Describe the urgency</label>
                  <textarea
                    rows={2}
                    value={emergencyDescription}
                    onChange={(e) => setEmergencyDescription(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Detected Location:</span>
                    <span className="text-slate-600">{bookingAddress}</span>
                  </div>
                  <span className="text-blue-600 font-bold">📍 GPS Active</span>
                </div>

                <button
                  onClick={handleTriggerEmergency}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base shadow-lg hover:shadow-red-500/25 transition duration-200 flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 fill-current text-amber-300" />
                  <span>DISPATCH EMERGENCY {emergencyCategory.toUpperCase()} NOW</span>
                </button>
              </div>
            )}

            {emergencyStep === "MATCHING" && (
              <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto animate-spin">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  AI Matching & Geospatial Routing Active...
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Analyzing 14 nearby available certified workers against trade skill, safety clearance, and urban road transit conditions.
                </p>
              </div>
            )}

            {(emergencyStep === "ASSIGNED" || emergencyStep === "TRACKING" || emergencyStep === "COMPLETED") &&
              emergencyActiveBooking && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  {/* Top Matched Worker Strip */}
                  <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                        alt="Raj Kumar"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900">RAJ KUMAR</h3>
                          <VerificationBadge level={4} size="sm" />
                        </div>
                        <p className="text-xs text-blue-800 font-semibold">
                          Level 4 State Certified Electrician • Vijayawada Central Co-op
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                          <span className="font-bold text-amber-600">⭐ 4.9 (48 jobs)</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-900">📍 1.4 km away</span>
                          <span>•</span>
                          <span className="font-black text-red-600">ETA: 7 min</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-blue-800">96%</div>
                      <div className="text-[10px] uppercase font-bold text-blue-600">AI Match Score</div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Live Emergency Status Timeline
                    </h4>
                    <StatusTimeline
                      currentStatus={emergencyActiveBooking.status}
                      timeline={emergencyActiveBooking.statusTimeline}
                    />
                  </div>

                  {/* Fair Wage Engine Breakdown for this Emergency Booking */}
                  <div>
                    <FairWageBreakdownCard breakdown={emergencyActiveBooking.fairWageBreakdown} />
                  </div>

                  {/* Action Buttons for Demo Journey */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    {emergencyStep === "TRACKING" && (
                      <button
                        onClick={handleSimulateCompletion}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
                      >
                        ✓ Simulate: Worker Arrived & Work Completed
                      </button>
                    )}

                    {emergencyStep === "COMPLETED" && !paymentSuccess && (
                      <button
                        onClick={handleProcessPayment}
                        disabled={isProcessingPayment}
                        className="bg-blue-600 hover:bg-blue-600 text-white font-black px-6 py-3 rounded-xl text-sm transition shadow-md flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>
                          {isProcessingPayment
                            ? "Verifying Payment..."
                            : `Pay ₹${emergencyActiveBooking.fairWageBreakdown.customerPaid} (Instant Co-op Settlement)`}
                        </span>
                      </button>
                    )}

                    {paymentSuccess && (
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Paid & Invoice Generated
                        </span>
                        <button
                          onClick={() => setReviewBookingId(emergencyActiveBooking._id)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                        >
                          Rate Raj Kumar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* TAB 3: MY BOOKINGS & INVOICES */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Your Past & Active Bookings</h3>
            {myBookings.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No bookings found. Book a service or try the Emergency 7m dispatch above!
              </div>
            ) : (
              myBookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{b.serviceCategory}</span>
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                          {b.bookingNumber}
                        </span>
                        {b.bookingType === "EMERGENCY" && (
                          <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                            🚨 EMERGENCY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{b.requirementDescription}</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          b.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <span>Worker: </span>
                      <span className="font-bold text-slate-900">{b.workerName || "Assigned Worker"}</span>
                      <span className="ml-2 text-blue-600 font-semibold">
                        (Direct Take-Home: ₹{b.fairWageBreakdown?.workerEarning})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const inv = await api.getInvoice(b._id);
                          setCurrentInvoice(inv.invoice);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-900 font-semibold underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Invoice
                      </button>

                      {b.status === "COMPLETED" && !b.rating && (
                        <button
                          onClick={() => setReviewBookingId(b._id)}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg font-bold text-xs"
                        >
                          Rate Service
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MODAL: WHY THIS WORKER? */}
        {selectedWorkerForWhy && (
          <WhyThisWorkerModal
            isOpen={!!selectedWorkerForWhy}
            onClose={() => setSelectedWorkerForWhy(null)}
            workerName={selectedWorkerForWhy.name}
            matchScore={selectedWorkerForWhy.matchScore}
            trade={selectedWorkerForWhy.trade}
            distanceKm={selectedWorkerForWhy.distanceKm}
            etaMinutes={selectedWorkerForWhy.etaMinutes}
            rating={selectedWorkerForWhy.rating}
            verificationLevel={selectedWorkerForWhy.verificationLevel}
            reasons={selectedWorkerForWhy.reasons}
            breakdown={selectedWorkerForWhy.breakdown}
          />
        )}

        {/* MODAL: STANDARD GUIDED BOOKING FLOW (14 STEPS) */}
        {bookingModalWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Book Verified Worker: {bookingModalWorker.name}</h3>
                  <p className="text-xs text-blue-200">{selectedService} • Level {bookingModalWorker.verificationLevel} Verified</p>
                </div>
                <button
                  onClick={() => setBookingModalWorker(null)}
                  className="text-blue-200 hover:text-white text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Service Requirement</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Living room fan regulator replacement and light socket check"
                        value={requirementText}
                        onChange={(e) => setRequirementText(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Service Address</label>
                      <input
                        type="text"
                        value={bookingAddress}
                        onChange={(e) => setBookingAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <button
                      onClick={() => setBookingStep(2)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-600 text-white font-bold"
                    >
                      Next: Inspect Transparent Fair Wage
                    </button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <FairWageBreakdownCard
                      breakdown={{
                        customerPaid: (bookingModalWorker.baseHourlyRate || 450) + 70 + 40 + 30 + 78 + 36,
                        baseWorkerWage: bookingModalWorker.baseHourlyRate || 450,
                        skillPremium: 70,
                        experiencePremium: 40,
                        travelAllowance: 30,
                        emergencyAllowance: 0,
                        workerEarning: (bookingModalWorker.baseHourlyRate || 450) + 70 + 40 + 30,
                        cooperativeContribution: 78,
                        taxGst: 36
                      }}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleConfirmStandardBooking}
                        className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-600 text-white font-bold"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-base text-slate-900">Cooperative Escrow Payment</h4>
                    <p className="text-slate-500">
                      Payment is held in cooperative trust and disbursed directly to the worker's wallet upon completion.
                    </p>

                    <button
                      onClick={handleProcessPayment}
                      disabled={isProcessingPayment}
                      className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold"
                    >
                      {isProcessingPayment ? "Settling..." : "Authorize Test Payment"}
                    </button>
                  </div>
                )}

                {bookingStep === 4 && (
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-base text-slate-900">Booking Confirmed & Settled!</h4>
                    <p className="text-slate-500">
                      Worker {bookingModalWorker.name} has accepted. You can track progress in 'My Bookings'.
                    </p>
                    <button
                      onClick={() => {
                        setBookingModalWorker(null);
                        setSearchParams({ tab: "bookings" });
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold"
                    >
                      View Bookings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DIGITAL INVOICE VIEWER */}
        {currentInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Digital Cooperative Invoice</h3>
                  <p className="text-xs text-slate-400 font-mono">{currentInvoice.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setCurrentInvoice(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Customer:</span>
                    <strong className="text-slate-900">{currentInvoice.customerDetails?.name}</strong>
                    <p className="text-slate-500 text-[11px]">{currentInvoice.customerDetails?.address}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Verified Worker:</span>
                    <strong className="text-slate-900">{currentInvoice.workerDetails?.name}</strong>
                    <p className="text-slate-500 text-[11px]">ID: {currentInvoice.workerDetails?.workerIdNumber}</p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Base Wage Floor:</span>
                    <span className="font-bold">₹{currentInvoice.itemizedBreakdown?.baseWorkerWage}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Skill Premium (State Certified):</span>
                    <span className="font-bold">+₹{currentInvoice.itemizedBreakdown?.skillPremium}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Experience Premium:</span>
                    <span className="font-bold">+₹{currentInvoice.itemizedBreakdown?.experiencePremium}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Travel Fuel Allowance:</span>
                    <span className="font-bold">+₹{currentInvoice.itemizedBreakdown?.travelAllowance}</span>
                  </div>
                  {currentInvoice.itemizedBreakdown?.emergencyAllowance > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100 text-red-600 font-bold">
                      <span>Emergency Dispatch Allowance:</span>
                      <span>+₹{currentInvoice.itemizedBreakdown?.emergencyAllowance}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 bg-emerald-50 px-2 rounded-lg text-emerald-900 font-bold">
                    <span>Direct Worker Earnings (Credited to Wallet):</span>
                    <span>₹{currentInvoice.itemizedBreakdown?.totalWorkerWage}</span>
                  </div>
                  <div className="flex justify-between py-1 text-blue-800">
                    <span>Cooperative Welfare Fund (12%):</span>
                    <span>+₹{currentInvoice.itemizedBreakdown?.cooperativeWelfareFund}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-500">
                    <span>GST (5%):</span>
                    <span>+₹{currentInvoice.itemizedBreakdown?.taxGstAmount}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-slate-900 font-black text-sm text-slate-900">
                    <span>Total Amount Paid:</span>
                    <span>₹{currentInvoice.itemizedBreakdown?.totalAmountPaid}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 text-center">
                  This document serves as an official GST-compliant cooperative service invoice issued under the Andhra Pradesh Cooperative Societies Act.
                </div>

                <button
                  onClick={() => alert("Digital invoice saved to downloads.")}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download Official PDF Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RATING AND REVIEWS */}
        {reviewBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
              <h3 className="font-bold text-base text-slate-900 text-center">Rate Your Cooperative Worker</h3>
              <p className="text-slate-500 text-center">
                Your rating directly influences worker skill tier progression and bonus welfare dividends.
              </p>

              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-2xl transition hover:scale-125"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= reviewRating ? "text-amber-500 fill-current" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                placeholder="Share your experience (punctuality, quality, safety, demeanor)..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setReviewBookingId(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-600 text-white font-bold"
                >
                  {reviewSubmitted ? "✓ Submitted!" : "Submit Feedback"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

