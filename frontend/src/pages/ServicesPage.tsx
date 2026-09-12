import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { WorkerProfile, Booking } from "../types";
import { VerificationBadge } from "../components/VerificationBadge";
import { FairWageBreakdownCard } from "../components/FairWageBreakdownCard";
import { resolveWorkerAvatar } from "../utils/workerAvatar";
import {
  Search,
  Zap,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  Calendar,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  X,
  Lock,
  Sparkles
} from "lucide-react";

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user, switchDemoRoleForTesting } = useAuth();
  const navigate = useNavigate();

  const initialService = searchParams.get("service") || "Electrician";
  const isEmergencyParam = searchParams.get("emergency") === "true";
  const currentPincode = searchParams.get("pincode") || "520001";

  const [selectedService, setSelectedService] = useState(initialService);
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number>(0);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Auth Gating Modal State
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [pendingWorkerForAuth, setPendingWorkerForAuth] = useState<WorkerProfile | null>(null);

  // Booking Modal State (SERVICE -> DETAILS -> WORKER -> TIME -> PAYMENT -> CONFIRM)
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [issueDescription, setIssueDescription] = useState("");
  const [serviceAddress, setServiceAddress] = useState("Flat 402, Sri Sai Residency, Benz Circle, Vijayawada");
  const [bookingTimeType, setBookingTimeType] = useState<"NOW" | "SCHEDULE">("NOW");
  const [scheduledDate, setScheduledDate] = useState("");
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Emergency Mode state
  const [emergencyActive, setEmergencyActive] = useState(isEmergencyParam);
  const [emergencyDispatched, setEmergencyDispatched] = useState<Booking | null>(null);

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkers({
        skill: selectedService,
        pincode: currentPincode,
        minRating: minRating > 0 ? minRating : undefined
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

  useEffect(() => {
    loadWorkers();
  }, [selectedService, minRating]);

  // Auth-gated booking triggers
  const handleInitiateBooking = (worker: WorkerProfile) => {
    if (!isAuthenticated || user?.role !== "CUSTOMER") {
      setPendingWorkerForAuth(worker);
      setAuthPromptOpen(true);
      return;
    }
    setSelectedWorker(worker);
    setBookingStep(1);
  };

  const handleInitiateEmergency = () => {
    if (!isAuthenticated || user?.role !== "CUSTOMER") {
      setPendingWorkerForAuth(null);
      setAuthPromptOpen(true);
      return;
    }
    handleQuickEmergencyDispatch();
  };

  const handle1ClickCitizenLogin = async () => {
    await switchDemoRoleForTesting("CUSTOMER");
    setAuthPromptOpen(false);
    if (pendingWorkerForAuth) {
      setSelectedWorker(pendingWorkerForAuth);
      setBookingStep(1);
      setPendingWorkerForAuth(null);
    } else if (emergencyActive) {
      handleQuickEmergencyDispatch();
    }
  };

  // Handle Booking Confirmation
  const handleProceedToPayment = async () => {
    if (!selectedWorker) return;
    setIsProcessing(true);
    try {
      const res = await api.createBooking({
        serviceCategory: selectedService,
        requirementDescription: issueDescription || `Standard ${selectedService} inspection and repair`,
        serviceLocation: {
          address: serviceAddress,
          coordinates: [80.6480, 16.5062]
        },
        workerId: selectedWorker._id,
        bookingType: emergencyActive ? "EMERGENCY" : "STANDARD"
      });

      if (res.success && res.booking) {
        setCreatedBooking(res.booking);
        setBookingStep(3); // Payment step
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete Payment (Simulated Escrow Settlement)
  const handleCompletePayment = async () => {
    if (!createdBooking) return;
    setIsProcessing(true);
    try {
      const res = await api.verifyPayment({
        bookingId: createdBooking._id,
        method: "UPI / Escrow Deposit"
      });
      if (res.success) {
        setBookingComplete(true);
        setBookingStep(4);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Quick Emergency Request
  const handleQuickEmergencyDispatch = async () => {
    setIsProcessing(true);
    try {
      const res = await api.triggerEmergency({
        serviceCategory: selectedService,
        emergencyIssue: issueDescription || `Critical 24/7 emergency response for ${selectedService}`,
        customerAddress: serviceAddress
      });
      if (res.success && res.booking) {
        setEmergencyDispatched(res.booking);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Emergency Hazard Banner (if requested) */}
        {emergencyActive && !emergencyDispatched && (
          <div className="p-5 rounded-2xl bg-red-600 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center animate-pulse">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h3 className="font-black text-base">24/7 Priority Emergency Service Active</h3>
                <p className="text-xs text-red-100">
                  Instant geo-dispatch will assign the nearest Level-4 certified cooperative worker (Avg ETA: 7 minutes).
                </p>
              </div>
            </div>

            <button
              onClick={handleInitiateEmergency}
              disabled={isProcessing}
              className="bg-white text-red-700 hover:bg-red-50 font-black px-5 py-2.5 rounded-xl text-xs shadow-sm transition cursor-pointer"
            >
              {isProcessing ? "Dispatching..." : "Dispatch Nearest Worker Now"}
            </button>
          </div>
        )}

        {/* Emergency Dispatched Confirmation Banner */}
        {emergencyDispatched && (
          <div className="p-6 rounded-2xl bg-emerald-800 text-white shadow-lg space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                <h3 className="font-bold text-base">Worker Dispatched: Raj Kumar</h3>
              </div>
              <span className="bg-emerald-700 px-3 py-1 rounded-full text-xs font-mono font-bold">
                {emergencyDispatched.bookingNumber}
              </span>
            </div>
            <p className="text-xs text-emerald-100">
              Raj Kumar (Level 4 Certified Electrician) has received your priority call. Street transit distance: 1.4 km • ETA: 7 minutes.
            </p>
            {isAuthenticated && (
              <button
                onClick={() => navigate("/app")}
                className="bg-white text-emerald-900 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Go to My Dashboard to Track
              </button>
            )}
          </div>
        )}

        {/* Service Category Pills */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                onClick={() => {
                  setSelectedService(cat);
                  setSearchParams({ service: cat });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedService === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${selectedService}s by name, colony or skill...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-slate-900 w-full focus:outline-hidden text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Benz Circle, Vijayawada</span>
              </div>

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

        {/* Worker Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Showing {workers.length} verified {selectedService}s in your area</span>
            <span>Sorted by Proximity & Skill Verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workers.filter((w) => (searchQuery ? w.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)).length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
                <p className="text-sm font-semibold text-slate-700">
                  No {selectedService}s found matching your search.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setMinRating(0);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition cursor-pointer"
                >
                  Reset Filters & View Available {selectedService}s
                </button>
              </div>
            ) : (
              workers
                .filter((w) =>
                  searchQuery ? w.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
                )
                .map((w, idx) => (
                  <div
                  key={w._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={resolveWorkerAvatar(w)}
                      alt={w.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900">{w.name}</h3>
                        <VerificationBadge level={w.verificationLevel} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{w.societyName}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {w.rating}
                        </span>
                        <span>•</span>
                        <span>{w.experienceYears} yrs exp</span>
                        <span>•</span>
                        <span className="text-blue-600 font-semibold">{1.4 + idx * 0.5} km</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Base Floor Wage</span>
                      <strong className="text-slate-900 text-sm font-black">₹{w.baseHourlyRate || 450}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-blue-700 font-bold block">85% Direct Take-Home</span>
                      <span className="text-[10px] text-slate-400">Zero commission cut</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInitiateBooking(w)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Book {w.name.split(" ")[0]}
                  </button>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Guided Booking Modal (4 Steps: Issue -> Fair Wage -> Payment -> Confirmed) */}
        {selectedWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Book {selectedWorker.name}</h3>
                  <p className="text-xs text-blue-100">{selectedService} • Level {selectedWorker.verificationLevel} Verified</p>
                </div>
                <button
                  onClick={() => setSelectedWorker(null)}
                  className="text-blue-200 hover:text-white text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-xs">
                {/* Step 1: Issue Details & Address */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">
                        Describe What You Need Help With
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Switchboard sparking, fan regulator loose, light fixture repair..."
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Service Address</label>
                      <input
                        type="text"
                        value={serviceAddress}
                        onChange={(e) => setServiceAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1.5">Timing</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setBookingTimeType("NOW")}
                          className={`p-2.5 rounded-xl border font-semibold text-xs ${
                            bookingTimeType === "NOW"
                              ? "border-blue-600 bg-blue-50 text-blue-900"
                              : "border-slate-200 text-slate-600"
                          }`}
                        >
                          Book for Now (Next Available)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBookingTimeType("SCHEDULE")}
                          className={`p-2.5 rounded-xl border font-semibold text-xs ${
                            bookingTimeType === "SCHEDULE"
                              ? "border-blue-600 bg-blue-50 text-blue-900"
                              : "border-slate-200 text-slate-600"
                          }`}
                        >
                          Schedule for Later
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingStep(2)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Next: Inspect Transparent Pricing
                    </button>
                  </div>
                )}

                {/* Step 2: Transparent Fair Wage Review */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <FairWageBreakdownCard
                      breakdown={{
                        customerPaid: (selectedWorker.baseHourlyRate || 450) + 70 + 40 + 30 + 78 + 36,
                        baseWorkerWage: selectedWorker.baseHourlyRate || 450,
                        skillPremium: 70,
                        experiencePremium: 40,
                        travelAllowance: 30,
                        emergencyAllowance: emergencyActive ? 60 : 0,
                        workerEarning: (selectedWorker.baseHourlyRate || 450) + 70 + 40 + 30,
                        cooperativeContribution: 78,
                        taxGst: 36
                      }}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="w-1/3 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleProceedToPayment}
                        disabled={isProcessing}
                        className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                      >
                        {isProcessing ? "Initiating..." : "Confirm & Deposit to Escrow"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Escrow Payment Authorization */}
                {bookingStep === 3 && (
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-base text-slate-900">Cooperative Trust Deposit</h4>
                    <p className="text-slate-500 max-w-xs mx-auto text-xs">
                      Your payment is safely held in cooperative trust and disbursed directly to {selectedWorker.name}'s wallet upon satisfactory completion.
                    </p>

                    <button
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition"
                    >
                      {isProcessing ? "Processing..." : "Authorize Test Payment"}
                    </button>
                  </div>
                )}

                {/* Step 4: Booking Completed & Dispatched */}
                {bookingStep === 4 && (
                  <div className="space-y-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-base text-slate-900">Booking Confirmed!</h4>
                    <p className="text-slate-500 text-xs">
                      Worker {selectedWorker.name} has been notified and will arrive according to schedule.
                    </p>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedWorker(null);
                          if (isAuthenticated) navigate("/app");
                        }}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                      >
                        {isAuthenticated ? "Go to Dashboard" : "Done"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Citizen Sign-in Required Modal */}
        {authPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Citizen Sign-In Required
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Cooperative dispatch &amp; safety verification
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthPromptOpen(false)}
                  className="w-8 h-8 rounded-full bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center border border-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-center">
                {pendingWorkerForAuth && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left">
                    <img
                      src={resolveWorkerAvatar(pendingWorkerForAuth)}
                      alt={pendingWorkerForAuth.name}
                      className="w-12 h-12 rounded-lg object-cover border border-blue-500/20 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {pendingWorkerForAuth.name}
                      </h4>
                      <p className="text-[11px] text-blue-600 font-medium">
                        {pendingWorkerForAuth.skills?.[0] || selectedService} • {pendingWorkerForAuth.societyName}
                      </p>
                      <span className="text-[10px] font-bold text-slate-600">
                        ₹{pendingWorkerForAuth.baseHourlyRate || 450}/hr statutory base wage
                      </span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed">
                  To confirm your service location, generate secure arrival OTPs, and guarantee escrow safety, please sign in or register as a citizen.
                </p>

                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handle1ClickCitizenLogin}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold justify-center shadow-md flex items-center gap-2 cursor-pointer transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>1-Click Sign In as Citizen (Instant Demo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/login?redirect=/services")}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold justify-center cursor-pointer transition"
                  >
                    <span>Sign In with Password / Email OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="w-full py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-blue-600 transition cursor-pointer"
                  >
                    New to COOPNEX? Create Free Account →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

