import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileText,
  Sparkles,
  UserCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  ChevronRight,
  HeartHandshake
} from "lucide-react";

export interface PipelineStage {
  id: string;
  step: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  glowColor: string;
  badge: string;
  detail: {
    title: string;
    description: string;
    metric: string;
    metricLabel: string;
  };
}

export const HeroWorkflowPipeline: React.FC = () => {
  const stages: PipelineStage[] = [
    {
      id: "customer",
      step: "01",
      label: "Customer",
      sublabel: "Citizen in need",
      icon: User,
      accentColor: "from-blue-600 to-indigo-600",
      glowColor: "rgba(37, 99, 235, 0.35)",
      badge: "Citizen App",
      detail: {
        title: "Verified Citizen Request",
        description: "Customer selects skilled service, sets location, and submits transparent booking with zero upfront surge pricing.",
        metric: "< 45s",
        metricLabel: "Average Request Time"
      }
    },
    {
      id: "request",
      step: "02",
      label: "Service Request",
      sublabel: "Needs & Location",
      icon: FileText,
      accentColor: "from-indigo-600 to-violet-600",
      glowColor: "rgba(79, 70, 229, 0.35)",
      badge: "Fair Scope",
      detail: {
        title: "Standardized Scope Definition",
        description: "Task parameters, required tools, and estimated hours are mapped to official state cooperative rate schedules.",
        metric: "100%",
        metricLabel: "Transparent Scope"
      }
    },
    {
      id: "smart_match",
      step: "03",
      label: "Smart Match",
      sublabel: "Location + Skills",
      icon: Sparkles,
      accentColor: "from-violet-600 to-fuchsia-600",
      glowColor: "rgba(124, 58, 237, 0.35)",
      badge: "AI Proximity",
      detail: {
        title: "Algorithmic Nearest Dispatch",
        description: "Hyper-local geo-matching engine pairs request with nearest active certified artisan to minimize transit delay.",
        metric: "2.4 km",
        metricLabel: "Avg Dispatch Radius"
      }
    },
    {
      id: "worker",
      step: "04",
      label: "Verified Worker",
      sublabel: "Artisan dispatched",
      icon: UserCheck,
      accentColor: "from-emerald-600 to-teal-600",
      glowColor: "rgba(16, 185, 129, 0.35)",
      badge: "KYC Cleared",
      detail: {
        title: "Aadhaar + PCC Verified Artisan",
        description: "Skilled worker with background clearance arrives equipped with Smart ID card, verified tools, and safety gear.",
        metric: "Level-4",
        metricLabel: "Skill Certification"
      }
    },
    {
      id: "cooperative",
      step: "05",
      label: "Cooperative",
      sublabel: "Welfare & Escrow",
      icon: Building2,
      accentColor: "from-amber-600 to-orange-600",
      glowColor: "rgba(245, 158, 11, 0.35)",
      badge: "Society Trust",
      detail: {
        title: "Primary Labour Cooperative",
        description: "Local society guarantees job quality, protects member insurance coverage, and holds payment securely in escrow.",
        metric: "0%",
        metricLabel: "Corporate Commission"
      }
    },
    {
      id: "successful_service",
      step: "06",
      label: "Successful Service",
      sublabel: "Direct Fair Pay",
      icon: CheckCircle2,
      accentColor: "from-teal-600 to-blue-600",
      glowColor: "rgba(20, 184, 166, 0.35)",
      badge: "Completed",
      detail: {
        title: "Direct Floor Wage Disbursement",
        description: "Citizen approves completed work; escrow dispatches 100% floor wage directly into worker wallet with zero exploitation.",
        metric: "Instant",
        metricLabel: "DBT Settlement"
      }
    }
  ];

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance narrative pipeline
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStageIdx((prev) => (prev + 1) % stages.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isPaused, stages.length]);

  const activeStage = stages[activeStageIdx];

  return (
    <div className="w-full max-w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-blue-50/20 p-5 sm:p-7 shadow-xs">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-black">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-900">
              The COOPNEX Connected System
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Real-time cooperative fulfillment pipeline
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE PIPELINE
          </span>
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-100 transition"
          >
            {isPaused ? "Auto-Play ▶" : "Pause ⏸"}
          </button>
        </div>
      </div>

      {/* Horizontal Pipeline Steps for Desktop / Scrollable for Mobile */}
      <div className="relative mb-6">
        {/* Connecting Progress Track Line */}
        <div className="hidden sm:block absolute top-6 left-6 right-6 h-0.5 bg-slate-200 -z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600"
            initial={{ width: "0%" }}
            animate={{ width: `${(activeStageIdx / (stages.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 relative z-10">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = idx === activeStageIdx;
            const isCompleted = idx < activeStageIdx;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  setActiveStageIdx(idx);
                  setIsPaused(true);
                }}
                className={`relative flex flex-col items-center text-center p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white shadow-md border border-blue-600/30 scale-[1.03]"
                    : isCompleted
                    ? "bg-white/80 hover:bg-white border border-slate-200/60"
                    : "bg-white/40 hover:bg-white/80 border border-transparent"
                }`}
              >
                {/* Node icon pill */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 mb-2 ${
                    isActive
                      ? `bg-gradient-to-br ${stage.accentColor} text-white shadow-md shadow-blue-500/25`
                      : isCompleted
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Stage number & label */}
                <div className="flex items-center gap-1 text-[10px] font-black tracking-wider text-slate-400">
                  <span>{stage.step}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />}
                </div>
                <div
                  className={`text-xs font-black truncate max-w-full mt-0.5 ${
                    isActive ? "text-slate-900" : "text-slate-600"
                  }`}
                >
                  {stage.label}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-full hidden sm:block">
                  {stage.sublabel}
                </div>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="activePipelineIndicator"
                    className="absolute -bottom-1.5 w-3 h-1 rounded-full bg-blue-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Spotlight Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  Stage {activeStage.step}: {activeStage.badge}
                </span>
                <span className="text-xs font-bold text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-600">{activeStage.label}</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {activeStage.detail.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeStage.detail.description}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-3 text-center min-w-[120px]">
                <div className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight">
                  {activeStage.detail.metric}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  {activeStage.detail.metricLabel}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStageIdx((prev) => (prev + 1) % stages.length)}
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-blue-600 text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0"
                title="Next stage"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
