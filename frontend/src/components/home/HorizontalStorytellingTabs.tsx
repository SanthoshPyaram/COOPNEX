import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Layers,
  HeartHandshake,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  QrCode,
  Users,
  Building2,
  Sparkles
} from "lucide-react";
import { ServicesConstellation3D } from "../3d/webgl/ServicesConstellation3D";
import { CooperativeEcosystem3D } from "../3d/webgl/CooperativeEcosystem3D";
import { EmergencyRadar3D } from "../3d/webgl/EmergencyRadar3D";
import { TharDoorstepRoadAnimation } from "../animations/TharDoorstepRoadAnimation";
import { ConnectionPulse } from "../common/ConnectionPulse";

interface HorizontalStorytellingTabsProps {
  onSelectTrade?: (trade: string) => void;
  onOpenVideoModal?: () => void;
}

export const HorizontalStorytellingTabs: React.FC<HorizontalStorytellingTabsProps> = ({
  onSelectTrade,
  onOpenVideoModal
}) => {
  const [activeTab, setActiveTab] = useState<"how-it-works" | "trades" | "economics" | "emergency">("how-it-works");

  const tabs = [
    {
      id: "how-it-works" as const,
      name: "How It Works",
      tagline: "4-Step Transparent Journey",
      icon: Compass,
      color: "blue"
    },
    {
      id: "trades" as const,
      name: "Verified Trades",
      tagline: "NSQF-4 Certified Specialists",
      icon: Layers,
      color: "cyan"
    },
    {
      id: "economics" as const,
      name: "Fair Wage & Escrow",
      tagline: "88% Artisan • 24h Defect Hold",
      icon: HeartHandshake,
      color: "emerald"
    },
    {
      id: "emergency" as const,
      name: "7-Min Emergency",
      tagline: "Rapid Hazard Radar",
      icon: Zap,
      color: "amber"
    }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-black border border-blue-200 dark:border-blue-800 shadow-xs">
          <ConnectionPulse variant="blue" size="sm" />
          <span>COOPNEX PLATFORM ARCHITECTURE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explore the Cooperative Ecosystem
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Switch between live interactive dimensions: dispatch workflow, verified trade constellation, fair-wage economic model, and emergency rapid response.
        </p>
      </div>

      {/* Horizontal Tab Navigation Bar */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl max-w-4xl mx-auto border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-850"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-left leading-tight hidden sm:block">
                <span className="block font-black text-slate-900 dark:text-white">{tab.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">{tab.tagline}</span>
              </div>
              <span className="sm:hidden font-black">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display Area */}
      <div className="bg-white dark:bg-[#0A1128] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 sm:p-8 min-h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          {/* TAB 1: HOW IT WORKS (4-STEP TRANSPARENT WORKFLOW) */}
          {activeTab === "how-it-works" && (
            <motion.div
              key="how-it-works"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Democratic 4-Stage Dispatch &amp; Escrow Journey
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Every service follows an auditable lifecycle from citizen request to 24-hour defect warranty maturity.
                  </p>
                </div>
                {onOpenVideoModal && (
                  <button
                    type="button"
                    onClick={onOpenVideoModal}
                    className="btn-secondary !min-h-[40px] !px-4 text-xs font-bold shrink-0 inline-flex items-center gap-2"
                  >
                    <span>▶ Watch Spoken Explainer</span>
                  </button>
                )}
              </div>

              {/* 4 Interactive Journey Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-900/60 border border-blue-200/70 dark:border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      01
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Demand Broadcast
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Citizen Requests Service</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Citizen specifies trade requirement, address, and selects emergency or standard timing. Statutory floor wage is locked with zero surge pricing.
                  </p>
                  <div className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fixed Floor Rate</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-cyan-50/50 dark:bg-slate-900/60 border border-cyan-200/70 dark:border-cyan-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      02
                    </span>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                      Nearest Co-op Hub
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI Cooperative Dispatch</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    System routes job to the nearest verified primary cooperative artisan with NSQF Level-4 badge, active tools, and clean background verification.
                  </p>
                  <div className="text-[11px] text-cyan-700 dark:text-cyan-300 font-semibold flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NSQF-4 Verified</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-900/60 border border-amber-200/70 dark:border-amber-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      03
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Job Finished
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Citizen 4-Digit OTP</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Citizen shares the 4-digit completion code only after service is completed satisfactorily. Worker enters the PIN to unlock customer payment.
                  </p>
                  <div className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5 pt-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Quality-Gated PIN</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-200/70 dark:border-emerald-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      04
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Settlement
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">24H Escrow &amp; Tax Invoice</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Citizen settles via Bharat UPI / Card. Worker receives 88% direct wage held in 24-hr defect warranty escrow; official APCLF tax invoice generated.
                  </p>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>24H Warranty Escrow</span>
                  </div>
                </div>
              </div>

              {/* Road Telemetry Journey Showcase */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <TharDoorstepRoadAnimation />
              </div>
            </motion.div>
          )}

          {/* TAB 2: VERIFIED TRADES CONSTELLATION */}
          {activeTab === "trades" && (
            <motion.div
              key="trades"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Interactive 3D Trade Constellation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any trade sphere to inspect statutory rate card, skills, and registered primary society artisan counts.
                  </p>
                </div>
              </div>

              <ServicesConstellation3D
                onSelectService={(trade) => {
                  onSelectTrade?.(trade);
                  const el = document.getElementById("workers-directory");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {/* TAB 3: FAIR WAGE & ESCROW ARCHITECTURE */}
          {activeTab === "economics" && (
            <motion.div
              key="economics"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Rapido-Benchmarked Wage Architecture &amp; Treasury Ledger
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    88% direct artisan wage + 100% travel allowance • 10% platform facilitation • 2% statutory PMSBY social security fund.
                  </p>
                </div>
              </div>

              <CooperativeEcosystem3D />
            </motion.div>
          )}

          {/* TAB 4: 7-MINUTE EMERGENCY DISPATCH RADAR */}
          {activeTab === "emergency" && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    24/7 Rapid Emergency Response Radar
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    7-minute dispatch beacon for urgent electrical short circuits, waterline bursts, and gas leaks.
                  </p>
                </div>
              </div>

              <EmergencyRadar3D />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

