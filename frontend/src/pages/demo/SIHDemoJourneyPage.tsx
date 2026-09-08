import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { DemoNavbar } from "../../components/DemoNavbar";
import { VerificationBadge } from "../../components/VerificationBadge";
import { FairWageBreakdownCard } from "../../components/FairWageBreakdownCard";
import {
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Star,
  Layers,
  ChevronRight,
  Check
} from "lucide-react";

export const SIHDemoJourneyPage: React.FC = () => {
  const { switchDemoRoleForTesting } = useAuth();
  const navigate = useNavigate();

  // Step 1: Customer Emergency Trigger
  // Step 2: AI Multi-Objective Match & Raj Kumar Ranked #1 (96%)
  // Step 3: Confirmation & Live Tracking (ETA 7m -> Arrived)
  // Step 4: Service Completed & Transparent Fair Wage Invoice
  // Step 5: Customer Rating (5★) & Wallet Credit (₹650)
  // Step 6: Federation Intelligence Update (+29% AI Forecast & Shortage)
  // Step 7: Cooperative Workforce Exchange 1-Click Approval
  const [currentStep, setCurrentStep] = useState(1);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<any | null>(null);
  const [exchangeApproved, setExchangeApproved] = useState(false);

  // Execute Step Actions
  const handleNext = async () => {
    if (currentStep === 1) {
      try {
        const res = await api.triggerEmergency({
          serviceCategory: "Electrician",
          emergencyIssue: "Sparking switchboard and burning smell",
          customerLatitude: 16.5062,
          customerLongitude: 80.6480,
          customerAddress: "Flat 402, Sri Sai Residency, Near Benz Circle, Vijayawada"
        });
        if (res.booking) {
          setActiveBookingId(res.booking._id);
        }
      } catch (err) {
        console.error(err);
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (activeBookingId) {
        try {
          await api.updateBookingStatus(activeBookingId, "COMPLETED", "Electrical MCB repaired safely.");
          const inv = await api.getInvoice(activeBookingId);
          setInvoiceData(inv.invoice);
        } catch (err) {
          console.error(err);
        }
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      await switchDemoRoleForTesting("FEDERATION_ADMIN");
      setCurrentStep(6);
    } else if (currentStep === 6) {
      setCurrentStep(7);
    }
  };

  const handleApproveExchangeInDemo = async () => {
    try {
      await api.approveWorkforceExchange("EXC-2026-AP-01");
      setExchangeApproved(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setExchangeApproved(false);
    setActiveBookingId(null);
    setInvoiceData(null);
    switchDemoRoleForTesting("CUSTOMER");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <DemoNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Story Header */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                SIH 2026 OFFICIAL EVALUATION SCRIPT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              THE WINNING SIH DEMONSTRATION JOURNEY
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Follow the complete end-to-end ecosystem story: From a citizen's electrical emergency to hyper-local AI matching, transparent fair wage disbursement, and federation-wide surplus reallocation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Journey</span>
            </button>

            {currentStep < 7 && (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition"
              >
                <span>Step {currentStep + 1}: Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 7-Step Visual Stepper Bar */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center justify-between overflow-x-auto gap-2">
          {[
            { num: 1, label: "Emergency Trigger" },
            { num: 2, label: "AI 96% Match" },
            { num: 3, label: "Live Tracking" },
            { num: 4, label: "Fair Wage Engine" },
            { num: 5, label: "Rating & Settlement" },
            { num: 6, label: "Federation Intelligence" },
            { num: 7, label: "Surplus Reallocation" }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition whitespace-nowrap text-xs ${
                currentStep === s.num
                  ? "bg-teal-600 text-white font-black shadow-sm"
                  : currentStep > s.num
                  ? "text-emerald-400 font-semibold"
                  : "text-slate-500"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === s.num
                    ? "bg-white text-teal-900"
                    : currentStep > s.num
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {currentStep > s.num ? "✓" : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* STEP 1: CUSTOMER EMERGENCY TRIGGER */}
        {currentStep === 1 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-red-400 tracking-wider">
                Scene 1 • Customer Experience
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Customer Experiences an Electrical Emergency
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                In Vijayawada Benz Circle, a customer suddenly notices hazardous electrical switchboard sparking with a burning smell. Instead of risking an unverified private stranger, the customer triggers rapid emergency dispatch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border border-red-700/80 space-y-4">
              <div className="flex items-center justify-between text-xs text-red-200">
                <span>📍 Location Detected: Benz Circle, Vijayawada</span>
                <span className="text-amber-400 font-bold">GPS Precision: 12 meters</span>
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-red-500/30 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Zap className="w-5 h-5 fill-current text-amber-300" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">7-Minute Rapid Dispatch Mode</div>
                  <div className="text-xs text-red-200 mt-0.5">
                    "Sparking switchboard and burning smell in residential master bedroom"
                  </div>
                  <div className="text-[11px] text-amber-300 font-semibold mt-1">
                    Cooperative SLA: Nearest verified technician dispatched in under 7 minutes.
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>Trigger Emergency & Run AI Multi-Objective Match</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AI MULTI-OBJECTIVE MATCH (RAJ KUMAR) */}
        {currentStep === 2 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                Scene 2 • AI Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Scikit-Learn Multi-Objective Algorithm Selects Raj Kumar (96% Match)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                The platform does not merely pick the closest person. It runs a multi-objective scoring function factoring skill tier, verified experience, customer ratings, distance, and fair rotation fairness.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-teal-500/50 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                    alt="Raj Kumar"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg">RAJ KUMAR</h3>
                      <VerificationBadge level={4} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400">
                      Vijayawada Central Labour Co-op Society • ID: SS-AP-2026-104
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                      <span className="text-amber-400 font-bold">⭐ 4.9 (48 reviews)</span>
                      <span>•</span>
                      <span>142 Jobs Completed</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">1.2 km away (6m ETA)</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/40 text-xs font-black">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>96% AI Multi-Objective Match</span>
                  </div>
                </div>
              </div>

              {/* Scikit-Learn Match Vector Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Skill Tier Match:</span>
                  <strong className="text-emerald-400">1.00 (Master)</strong>
                </div>
                <div className="p-2.5 bg-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Proximity Score:</span>
                  <strong className="text-teal-300">0.94 (1.2 km)</strong>
                </div>
                <div className="p-2.5 bg-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Reputation Weight:</span>
                  <strong className="text-amber-300">0.98 (4.9★)</strong>
                </div>
                <div className="p-2.5 bg-slate-800 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Fair Rotation Index:</span>
                  <strong className="text-blue-300">0.92 (Ready)</strong>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <span>Confirm Raj Kumar & Launch Live GPS Tracking</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LIVE TRACKING & ARRIVAL */}
        {currentStep === 3 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Scene 3 • Real-Time Dispatch
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Live GPS Tracking & Rapid 7-Minute Arrival
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Worker Raj Kumar is notified on two-wheeler and accepts immediately. The customer tracks his live location with transparent ETA updates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold text-emerald-300 uppercase">Worker En Route (Transit)</span>
                </div>
                <span className="text-xs font-mono text-slate-400">ETA: 4 minutes remaining</span>
              </div>

              {/* Transit Map / Route Simulation Box */}
              <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                <div className="text-center space-y-2 z-10">
                  <div className="text-xs font-mono text-teal-400">
                    [Live Map Simulation: Worker coordinates (16.5080, 80.6450) → Benz Circle]
                  </div>
                  <div className="text-sm font-bold text-white flex items-center justify-center gap-2">
                    <span>🏍️ Raj Kumar on Honda Activa</span>
                    <span className="text-slate-400">• Speed: 28 km/h</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl text-xs text-amber-200 flex items-center justify-between">
                <span>Customer Verification OTP (Give after service inspection):</span>
                <strong className="font-mono text-base text-amber-400">8924</strong>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <span>Simulate Inspection & Complete Service (Enter OTP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SERVICE COMPLETED & FAIR WAGE INVOICE */}
        {currentStep === 4 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Scene 4 • Transparency Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Transparent Fair Wage Digital Invoice
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                The job is inspected and completed. The customer receives an itemized breakdown where 100% of base labor is protected for the worker.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-xl space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="font-black text-sm text-teal-800">COOPNEX DIGITAL INVOICE</div>
                  <div className="text-[11px] text-slate-500 font-mono">Invoice #INV-2026-9482</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    VERIFIED COMPLIANT
                  </span>
                </div>
              </div>

              <FairWageBreakdownCard
                breakdown={{
                  customerPaid: 850,
                  baseWorkerWage: 650,
                  skillPremium: 50,
                  experiencePremium: 25,
                  travelAllowance: 50,
                  emergencyAllowance: 75,
                  workerEarning: 650,
                  cooperativeContribution: 50,
                  taxGst: 25
                }}
              />

              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-teal-800 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <span>Customer Pays ₹850 & Submits 5★ Rating</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RATING & WORKER WALLET CREDIT */}
        {currentStep === 5 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Scene 5 • Livelihood Impact
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Customer Gives 5★ & ₹650 Instantly Credited to Worker Wallet
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                No delayed contractor settlement. Payout occurs via UPI instantly upon OTP verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/50 space-y-4">
              <div className="p-4 bg-emerald-950/60 rounded-xl border border-emerald-500/40 text-center space-y-1">
                <div className="text-xs text-emerald-300 uppercase font-mono">Instant UPI Disbursal to Raj Kumar</div>
                <div className="text-3xl font-black text-emerald-400">₹650.00</div>
                <div className="text-xs text-slate-300">
                  Transferred to Bank of Baroda A/C ••4021 (0% platform commission deducted)
                </div>
              </div>

              <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Customer Feedback:</span>
                  <strong className="text-white">"Lightning fast arrival in 6 mins, fixed burnt MCB safely."</strong>
                </div>
                <div className="text-amber-400 font-bold text-sm">★★★★★</div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <span>Switch to Federation Admin & View Demand Spike</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: FEDERATION INTELLIGENCE UPDATE */}
        {currentStep === 6 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
                Scene 6 • Federation Command
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Federation Command Center: AI Detects District Worker Shortage
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                As bookings rise across Vijayawada, the Federation's predictive model forecasts a 29% demand surge over the weekend, leading to an imminent deficit of electricians.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-slate-400 block uppercase">Electrician Utilization:</span>
                <strong className="text-lg font-black text-amber-400">88.4% (Deficit Zone)</strong>
                <div className="text-[10px] text-red-400 font-semibold">Near Capacity Ceiling</div>
              </div>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-slate-400 block uppercase">Tomorrow's Forecast:</span>
                <strong className="text-lg font-black text-teal-300">42 Requests</strong>
                <div className="text-[10px] text-amber-300 font-semibold">+29% Weekend Spike</div>
              </div>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-slate-400 block uppercase">Projected Shortage:</span>
                <strong className="text-lg font-black text-red-400">12 Electricians</strong>
                <div className="text-[10px] text-slate-400">In Vijayawada Sector 4</div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <span>Open Cooperative Workforce Exchange Solver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 7: COOPERATIVE WORKFORCE EXCHANGE (ADMIN APPROVES) */}
        {currentStep === 7 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Scene 7 • Grand Finale Innovation
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Cooperative Workforce Exchange: Cross-Society Allocation
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                AI detects Guntur East Society has +8 idle plumbers/electricians while Vijayawada Central faces -10 shortage. AI formulates a temporary mutual aid transfer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/50 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-amber-400 font-bold text-sm">EXC-2026-AP-01</span>
                <span className="bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-400/40">
                  AI RECOMMENDATION READY
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Surplus Source:</span>
                  <strong className="text-white text-sm">Guntur East Labour Cooperative Society</strong>
                  <div className="text-emerald-400 font-bold mt-0.5">+8 Idle Verified Workers</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Deficit Target:</span>
                  <strong className="text-white text-sm">Vijayawada Central Labour Co-op</strong>
                  <div className="text-red-400 font-bold mt-0.5">-10 Worker Shortage</div>
                </div>
              </div>

              <div className="p-3 bg-teal-950/70 border border-teal-800 rounded-xl text-teal-200 leading-relaxed">
                <strong>AI Optimization Vector:</strong> Temporarily allocate 6 qualified workers from Guntur East to Vijayawada Central for 3 days. Travel allowance of ₹180/day subsidized by Federation Inter-Society Fund. Unmet demand prevention rate: <strong>82.5%</strong>.
              </div>

              {!exchangeApproved ? (
                <button
                  onClick={handleApproveExchangeInDemo}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>FEDERATION ADMIN: APPROVE CROSS-SOCIETY WORKFORCE ALLOCATION</span>
                </button>
              ) : (
                <div className="p-4 bg-emerald-900 border border-emerald-500 rounded-xl text-center space-y-2">
                  <div className="text-emerald-300 font-black text-base flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span>COOPERATIVE ALLOCATION APPROVED & AUDITED!</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    6 workers notified with fuel pass. Deficit resolved without surge pricing. Complete cooperative circle executed.
                  </p>
                </div>
              )}
            </div>

            {/* Victory Summary Strip */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 border border-teal-700/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">You Have Experienced the Full COOPNEX Ecosystem</h4>
                <p className="text-xs text-slate-400">
                  Problem understood • Real AI forecasting • Mathematical Fair Wage • Cooperative Ownership demonstrated.
                </p>
              </div>

              <Link
                to="/federation"
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition"
              >
                Inspect Federation Command Center
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
