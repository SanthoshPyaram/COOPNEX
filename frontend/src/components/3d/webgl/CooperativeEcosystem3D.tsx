import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  HeartHandshake,
  Award,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Users,
  CreditCard,
  Building2
} from "lucide-react";

export const CooperativeEcosystem3D: React.FC = () => {
  const [jobAmount, setJobAmount] = useState<number>(650);
  const [comparisonMode, setComparisonMode] = useState<"cooperative" | "corporate">("cooperative");

  // Financial breakdown values
  const artisanShare = comparisonMode === "cooperative" ? jobAmount : Math.round(jobAmount * 0.72);
  const corporateCut = comparisonMode === "cooperative" ? 0 : Math.round(jobAmount * 0.28);
  const welfareAllocation = comparisonMode === "cooperative" ? Math.round(jobAmount * 0.03) : 0;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50/60 via-white to-blue-50/50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#075E54]" />
            <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
              Transparent Value Distribution &amp; Welfare Ledger
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time simulation of sovereign 0% cooperative economics vs private aggregator cuts.
          </p>
        </div>

        {/* Comparison Toggle */}
        <div className="inline-flex rounded-2xl border border-slate-200 p-1 bg-slate-50 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setComparisonMode("cooperative")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer font-bold ${
              comparisonMode === "cooperative"
                ? "bg-[#075E54] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            COOPNEX (0% Cut)
          </button>
          <button
            type="button"
            onClick={() => setComparisonMode("corporate")}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer font-bold ${
              comparisonMode === "corporate"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Commercial App (28% Cut)
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: Realistic Human Value Flow Diagram (replacing abstract spheres) */}
        <div className="lg:col-span-8 p-6 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex flex-col justify-between relative overflow-hidden">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Escrow Order: ₹{jobAmount}</span>
            </span>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-2xs ${
              comparisonMode === "cooperative"
                ? "bg-emerald-50 text-[#075E54] border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {comparisonMode === "cooperative" ? "Direct 100% Payout" : "28% Extraction Penalty"}
            </span>
          </div>

          {/* Visual Human Flow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto relative z-10">
            {/* Step 1: Real Customer Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3 relative group">
              <div className="relative w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=200&q=80"
                  alt="Indian Citizen Customer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-blue-600 block">Citizen Customer</span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">Fair Service Bill</h4>
                <div className="text-lg font-black text-slate-900 font-mono mt-1">₹{jobAmount}</div>
                <p className="text-[10px] text-slate-500 mt-0.5">0% Hidden Booking Charges</p>
              </div>
            </div>

            {/* Step 2: Escrow / Routing Engine Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3 relative">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border-2 shadow-md ${
                comparisonMode === "cooperative"
                  ? "bg-emerald-50 border-[#075E54] text-[#075E54]"
                  : "bg-red-50 border-red-500 text-red-600"
              }`}>
                {comparisonMode === "cooperative" ? (
                  <ShieldCheck className="w-8 h-8 animate-bounce [animation-duration:3s]" />
                ) : (
                  <AlertTriangle className="w-8 h-8 animate-pulse" />
                )}
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
                  {comparisonMode === "cooperative" ? "Sovereign Escrow" : "Commercial Intermediary"}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">
                  {comparisonMode === "cooperative" ? "Bharat Jan Dhan DBT" : "Corporate App Fee"}
                </h4>
                <div className={`text-lg font-black font-mono mt-1 ${
                  comparisonMode === "cooperative" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {comparisonMode === "cooperative" ? "₹0 Deductions" : `-₹${corporateCut}`}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {comparisonMode === "cooperative" ? "Instant UPI Handshake" : "Retained by Venture Firm"}
                </p>
              </div>
            </div>

            {/* Step 3: Real Artisan Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3 relative">
              <div className="relative w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&q=80"
                  alt="Verified Indian Worker"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-[#075E54] block">Verified Artisan</span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">Actual Take-Home</h4>
                <div className="text-lg font-black text-[#075E54] font-mono mt-1">₹{artisanShare}</div>
                <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                  {comparisonMode === "cooperative" ? "100% Floor Wage Kept" : "28% Slashed by App"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Guarantee Note */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-[#075E54]" />
              <span>Govt of India Multi-State Cooperative Societies Act Compliant</span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">UIDAI Verhoeff Verified</span>
          </div>
        </div>

        {/* Right: Financial Breakdown Panel */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Job Value Simulator
            </div>

            {/* Slider */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-700">Customer Bill</span>
                <span className="text-xl font-black text-[#075E54] font-mono">₹{jobAmount}</span>
              </div>
              <input
                type="range"
                min={300}
                max={2500}
                step={50}
                value={jobAmount}
                onChange={(e) => setJobAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#075E54]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>₹300 (Standard)</span>
                <span>₹2,500 (Complex)</span>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="space-y-2.5">
              {/* Worker Wallet */}
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-[#075E54]">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Artisan Direct Payout</div>
                    <div className="text-[11px] text-slate-500">Instant UPI Soundbox credit</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-[#075E54] font-mono">₹{artisanShare}</div>
                  <div className="text-[10px] font-bold text-emerald-700">
                    {comparisonMode === "cooperative" ? "100%" : "72%"}
                  </div>
                </div>
              </div>

              {/* Commission cut or Welfare */}
              {comparisonMode === "cooperative" ? (
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cooperative Welfare Pool</div>
                      <div className="text-[11px] text-slate-500">Accident insurance &amp; tool bank</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-amber-800 font-mono">₹{welfareAllocation}</div>
                    <div className="text-[10px] font-bold text-amber-700">Federation Pool</div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-red-50/70 border border-red-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                      <TrendingUp className="w-4 h-4 rotate-180" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-red-950">Commercial Platform Cut</div>
                      <div className="text-[11px] text-red-600">Middleman commission taken</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-red-600 font-mono">-₹{corporateCut}</div>
                    <div className="text-[10px] font-bold text-red-600">28% Lost</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Callout */}
          <div className="pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle className="w-4 h-4 text-[#075E54] shrink-0" />
            <span className="leading-tight">
              {comparisonMode === "cooperative"
                ? "Every rupee stays within the cooperative ecosystem to empower Indian workers and their families."
                : "Aggregator platforms take up to ₹18,000/month from each artisan's hard-earned labour."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CooperativeEcosystem3D;
