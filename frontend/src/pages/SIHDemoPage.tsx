import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { VerificationBadge } from "../components/VerificationBadge";
import { FairWageBreakdownCard } from "../components/FairWageBreakdownCard";
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

export const SIHDemoPage: React.FC = () => {
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<any | null>(null);
  const [exchangeApproved, setExchangeApproved] = useState(false);

  // Execute Step Actions
  const handleNext = async () => {
    if (currentStep === 1) {
      // Trigger live emergency API call
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
      // Customer confirms Raj Kumar
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Simulate transit and completion
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
      // Customer pays & invoice generated
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Switch persona to Federation Admin
      await switchDemoRoleForTesting("FEDERATION_ADMIN");
      setCurrentStep(6);
    } else if (currentStep === 6) {
      // Review Workforce Exchange
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
    <div className="min-h-screen bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
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
              Follow the complete end-to-end ecosystem story: From a citizen's midnight electrical emergency to hyper-local AI matching, transparent fair wage disbursement, and federation-wide surplus reallocation.
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
                In Vijayawada Benz Circle, a customer suddenly notices hazardous electrical switchboard sparking with a burning smell. Instead of risking an unverified private stranger, the customer opens <strong>COOPNEX</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border border-red-700/80 space-y-4">
              <div className="flex items-center justify-between text-xs text-red-200">
                <span>📍 Location Detected: Benz Circle, Vijayawada</span>
                <span className="text-amber-400 font-bold">GPS Precision: 12 meters</span>
              </div>

              <div className="text-center py-4">
                <button
                  onClick={handleNext}
                  className="bg-red-600 hover:bg-red-500 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-red-500/30 transition duration-200 flex items-center gap-3 mx-auto animate-pulse"
                >
                  <Zap className="w-6 h-6 fill-current text-amber-300" />
                  <span>🚨 TRIGGER EMERGENCY ELECTRICAL SERVICE</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-red-200">
                Clicking above instantly initiates hyper-local 2dsphere search and multi-objective AI ranking.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: AI MULTI-OBJECTIVE RANKING & RAJ KUMAR (96%) */}
        {currentStep === 2 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                Scene 2 • Intelligent AI Matching
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                AI Engine Evaluates & Ranks Candidates: Top Match Found
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                The algorithm normalizes skill fit (30%), transit ETA (25%), verification level (15%), customer ratings (15%), and workload anti-fatigue equity (15%).
              </p>
            </div>

            {/* Candidate Card: Raj Kumar */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-teal-500/50 shadow-lg flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                  alt="Raj Kumar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">RAJ KUMAR</h3>
                    <VerificationBadge level={4} size="sm" />
                  </div>
                  <p className="text-xs text-teal-300 font-semibold mt-0.5">
                    Level 4 State Certified Electrician • Vijayawada Central Co-op
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                    <span className="text-amber-400 font-bold">⭐ 4.9 Rating (48 reviews)</span>
                    <span>•</span>
                    <span className="text-white font-bold">📍 1.4 km away</span>
                    <span>•</span>
                    <span className="text-red-400 font-black">ETA: 7 min</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-amber-300">96%</div>
                <div className="text-[10px] text-teal-300 uppercase font-bold">AI MATCH SCORE</div>
              </div>
            </div>

            {/* Why this worker explanation tags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Level 4 State Certified</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>1.4 km (ETA 7m transit)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>4.9★ Customer Rating</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Workload Fatigue</span>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <span>Confirm & Dispatch Raj Kumar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: LIVE TRACKING TIMELINE */}
        {currentStep === 3 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">
                Scene 3 • Worker Dispatched
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Worker Accepts & Reaches Customer Site
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Raj Kumar receives mobile priority alert on his two-wheeler, accepts immediately, and navigates via the cooperative routing corridor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Worker Status:</span>
                <span className="text-emerald-400 font-black font-mono">ON_THE_WAY ➔ ARRIVED</span>
              </div>

              {/* Status Tracker */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>14:32 - Customer Emergency Request Received</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>14:33 - AI Match: Raj Kumar Assigned (96% Fit)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>14:34 - Worker Accepted • Priority Departure</span>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-950 border border-teal-600 text-teal-200 flex items-center gap-2 animate-pulse">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>14:39 - Raj Kumar Arrived at Customer Site (Transit time: 5.4m)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <span>Simulate Work Completion & View Fair Wage Breakdown</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: FAIR WAGE ENGINE & INVOICE */}
        {currentStep === 4 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Scene 4 • The Core SIH Innovation
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Transparent Fair Wage Engine Calculates Worker Take-Home
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Unlike private apps where aggregators take 30%, COOPNEX transparently shows every rupee.
              </p>
            </div>

            {/* Fair Wage Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-lg">
              <FairWageBreakdownCard
                breakdown={{
                  customerPaid: 764,
                  baseWorkerWage: 450,
                  skillPremium: 70,
                  experiencePremium: 40,
                  travelAllowance: 30,
                  emergencyAllowance: 60,
                  workerEarning: 650,
                  cooperativeContribution: 78,
                  taxGst: 36
                }}
              />
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <span>Authorize Payment & Submit Rating</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 5: RATING & SWITCH TO FEDERATION ADMIN */}
        {currentStep === 5 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-white">Customer Submits 5.0 Rating</h2>
              <div className="flex justify-center gap-1 text-amber-400 text-xl py-1">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="text-xs text-slate-300">
                "Raj Kumar safely replaced the damaged main breaker in 18 minutes. Extremely polite and verified cooperative professional."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 max-w-md mx-auto text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Raj Kumar's Wallet:</span>
                <span className="text-emerald-400 font-bold font-mono">+₹650 Credited Immediately</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Society Healthcare Reserve:</span>
                <span className="text-teal-300 font-bold font-mono">+₹78 Credited</span>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-3.5 rounded-xl text-sm transition shadow-lg inline-flex items-center gap-2"
            >
              <span>Switch Persona to Federation Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 6: FEDERATION INTELLIGENCE UPDATE (+29% SURGE FORECAST) */}
        {currentStep === 6 && (
          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                Scene 6 • State Federation Command Center
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Cooperative Intelligence Center Immediately Reflects Job & Predicts Surge
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                The state director inspects real-time aggregated metrics. AI time-series forecasting flags a +29% electrician surge for tomorrow.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                <span className="text-slate-400 block uppercase">Emergency Jobs Completed:</span>
                <strong className="text-lg font-black text-white">15 Today</strong>
                <div className="text-[10px] text-emerald-400 font-semibold">+1 just now (Raj Kumar)</div>
              </div>
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

            {/* Exchange Proposal Card */}
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
      </div>
    </div>
  );
};

