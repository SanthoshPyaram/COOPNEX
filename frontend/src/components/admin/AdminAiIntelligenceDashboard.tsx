import React, { useState } from "react";
import {
  TrendingUp,
  BrainCircuit,
  Cpu,
  Zap,
  Users,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Sliders,
  Compass
} from "lucide-react";
import { AiDemand3D } from "./3d/AiDemand3D";

interface DemandForecastPoint {
  timeLabel: string;
  electrician: number;
  plumber: number;
  carpenter: number;
  cleaning: number;
  totalDemand: number;
  isPeak?: boolean;
}

interface AreaAllocation {
  id: string;
  areaName: string;
  district: string;
  primaryTrade: string;
  requiredWorkers: number;
  availableWorkers: number;
  shortage: number; // positive = shortage, negative = surplus
  urgency: "CRITICAL" | "HIGH" | "BALANCED" | "SURPLUS";
  recommendation: string;
  donorArea?: string;
  distanceKm?: number;
  etaMinutes?: number;
}

interface ExplainableDispatch {
  id: string;
  bookingRef: string;
  serviceCategory: string;
  selectedWorker: string;
  workerBadge: string;
  confidenceScore: number;
  timestamp: string;
  weights: {
    skillMatch: { score: number; weight: string; note: string };
    proximity: { score: number; weight: string; note: string };
    availability: { score: number; weight: string; note: string };
    customerRating: { score: number; weight: string; note: string };
    fatigueBalance: { score: number; weight: string; note: string };
  };
  alternativesConsidered: {
    name: string;
    score: number;
    exclusionReason: string;
  }[];
}

export const AdminAiIntelligenceDashboard: React.FC = () => {
  const [timeHorizon, setTimeHorizon] = useState<"24H" | "7D" | "30D">("24H");
  const [selectedTrade, setSelectedTrade] = useState<string>("ALL");
  const [rebalanceLoading, setRebalanceLoading] = useState<string | null>(null);
  const [rebalancedAreas, setRebalancedAreas] = useState<Record<string, boolean>>({});
  const [selectedDispatch, setSelectedDispatch] = useState<ExplainableDispatch | null>(null);

  // 24-Hour Forecast Data
  const FORECAST_24H: DemandForecastPoint[] = [
    { timeLabel: "06:00", electrician: 12, plumber: 28, carpenter: 8, cleaning: 22, totalDemand: 70 },
    { timeLabel: "08:00", electrician: 34, plumber: 52, carpenter: 18, cleaning: 44, totalDemand: 148, isPeak: true },
    { timeLabel: "10:00", electrician: 58, plumber: 42, carpenter: 32, cleaning: 38, totalDemand: 170, isPeak: true },
    { timeLabel: "12:00", electrician: 45, plumber: 30, carpenter: 28, cleaning: 25, totalDemand: 128 },
    { timeLabel: "14:00", electrician: 38, plumber: 24, carpenter: 30, cleaning: 20, totalDemand: 112 },
    { timeLabel: "16:00", electrician: 50, plumber: 38, carpenter: 35, cleaning: 30, totalDemand: 153 },
    { timeLabel: "18:00", electrician: 76, plumber: 46, carpenter: 24, cleaning: 48, totalDemand: 194, isPeak: true },
    { timeLabel: "20:00", electrician: 68, plumber: 35, carpenter: 15, cleaning: 32, totalDemand: 150 },
    { timeLabel: "22:00", electrician: 25, plumber: 15, carpenter: 4, cleaning: 12, totalDemand: 56 }
  ];

  // 7-Day Forecast Data
  const FORECAST_7D: DemandForecastPoint[] = [
    { timeLabel: "Mon", electrician: 240, plumber: 195, carpenter: 130, cleaning: 160, totalDemand: 725 },
    { timeLabel: "Tue", electrician: 220, plumber: 180, carpenter: 140, cleaning: 145, totalDemand: 685 },
    { timeLabel: "Wed", electrician: 250, plumber: 210, carpenter: 150, cleaning: 170, totalDemand: 780 },
    { timeLabel: "Thu", electrician: 235, plumber: 190, carpenter: 145, cleaning: 165, totalDemand: 735 },
    { timeLabel: "Fri", electrician: 280, plumber: 240, carpenter: 165, cleaning: 210, totalDemand: 895, isPeak: true },
    { timeLabel: "Sat", electrician: 340, plumber: 290, carpenter: 210, cleaning: 320, totalDemand: 1160, isPeak: true },
    { timeLabel: "Sun", electrician: 310, plumber: 270, carpenter: 190, cleaning: 340, totalDemand: 1110, isPeak: true }
  ];

  // 30-Day Forecast Data
  const FORECAST_30D: DemandForecastPoint[] = [
    { timeLabel: "Week 1", electrician: 1850, plumber: 1520, carpenter: 1100, cleaning: 1420, totalDemand: 5890 },
    { timeLabel: "Week 2", electrician: 1920, plumber: 1580, carpenter: 1140, cleaning: 1490, totalDemand: 6130 },
    { timeLabel: "Week 3", electrician: 2140, plumber: 1710, carpenter: 1250, cleaning: 1680, totalDemand: 6780, isPeak: true },
    { timeLabel: "Week 4", electrician: 2380, plumber: 1890, carpenter: 1380, cleaning: 1940, totalDemand: 7590, isPeak: true }
  ];

  const activeForecast = timeHorizon === "24H" ? FORECAST_24H : timeHorizon === "7D" ? FORECAST_7D : FORECAST_30D;
  const maxDemand = Math.max(...activeForecast.map((p) => p.totalDemand));

  // Dynamic Workforce Allocation Table
  const AREA_ALLOCATIONS: AreaAllocation[] = [
    {
      id: "AREA-01",
      areaName: "Autonagar Industrial Hub",
      district: "Vijayawada (NTR)",
      primaryTrade: "Electrician (3-Phase)",
      requiredWorkers: 32,
      availableWorkers: 20,
      shortage: 12,
      urgency: "CRITICAL",
      recommendation: "Relocate 8 electricians from Governorpet surplus buffer (2.1 km away).",
      donorArea: "Governorpet",
      distanceKm: 2.1,
      etaMinutes: 7
    },
    {
      id: "AREA-02",
      areaName: "Benz Circle Commercial Sector",
      district: "Vijayawada (NTR)",
      primaryTrade: "Plumbing & Sanitization",
      requiredWorkers: 24,
      availableWorkers: 16,
      shortage: 8,
      urgency: "HIGH",
      recommendation: "Relocate 5 plumbers from Patamata residential cluster (1.4 km away).",
      donorArea: "Patamata",
      distanceKm: 1.4,
      etaMinutes: 5
    },
    {
      id: "AREA-03",
      areaName: "Gunadala Residential Zone",
      district: "Vijayawada (NTR)",
      primaryTrade: "Appliance & Solar Repair",
      requiredWorkers: 18,
      availableWorkers: 17,
      shortage: 1,
      urgency: "BALANCED",
      recommendation: "Within optimal capacity threshold. Zero dispatch shift needed."
    },
    {
      id: "AREA-04",
      areaName: "Governorpet Commercial Center",
      district: "Vijayawada (NTR)",
      primaryTrade: "General Electrical & Maintenance",
      requiredWorkers: 15,
      availableWorkers: 26,
      shortage: -11,
      urgency: "SURPLUS",
      recommendation: "Surplus 11 workers idle. Available as reserve donor pool for Autonagar."
    },
    {
      id: "AREA-05",
      areaName: "Bhavanipuram River Zone",
      district: "Vijayawada (NTR)",
      primaryTrade: "Carpentry & Masonry",
      requiredWorkers: 14,
      availableWorkers: 14,
      shortage: 0,
      urgency: "BALANCED",
      recommendation: "Workforce in equilibrium. 100% SLA coverage."
    }
  ];

  // Explainable AI Dispatch Records
  const EXPLAINABLE_DISPATCHES: ExplainableDispatch[] = [
    {
      id: "DISP-8901",
      bookingRef: "BK-VJA-2026-801",
      serviceCategory: "Electrician (Emergency MCB Spark)",
      selectedWorker: "Arjun Kumar (COOP-EMP-0001)",
      workerBadge: "NSQF Level-4 Master Electrician • 4.95 ★",
      confidenceScore: 96.8,
      timestamp: "Today, 14:32",
      weights: {
        skillMatch: { score: 100, weight: "30%", note: "Level 4 NSQF Certified; exact match for MCB high-voltage sparking." },
        proximity: { score: 96, weight: "25%", note: "1.4 km geodesic distance, 6m transit SLA." },
        availability: { score: 100, weight: "20%", note: "Active online in Emergency Rapid Dispatch pool." },
        customerRating: { score: 98, weight: "15%", note: "Historical rating 4.95 with 184 verified completed jobs." },
        fatigueBalance: { score: 90, weight: "10%", note: "Completed 2 jobs today; within safe daily load limit (<5 jobs)." }
      },
      alternativesConsidered: [
        { name: "K. Raghava", score: 88.2, exclusionReason: "0.6 km closer but currently in Level 3 apprentice tier (safety requirement missed)." },
        { name: "M. Venkatesh", score: 84.1, exclusionReason: "Already completed 5 jobs today; fatigue threshold lock triggered." }
      ]
    },
    {
      id: "DISP-8902",
      bookingRef: "BK-VJA-2026-794",
      serviceCategory: "Plumber (Main Pipe Burst)",
      selectedWorker: "Lakshmi Narayana (WRK-KYC-002)",
      workerBadge: "Certified Master Plumber • 4.88 ★",
      confidenceScore: 94.2,
      timestamp: "Today, 12:15",
      weights: {
        skillMatch: { score: 98, weight: "30%", note: "Master hydraulic piping certification with 10+ yrs experience." },
        proximity: { score: 92, weight: "25%", note: "2.3 km distance, 9m estimated transit." },
        availability: { score: 100, weight: "20%", note: "Completed prior booking 18 minutes ago; verified resting interval satisfied." },
        customerRating: { score: 94, weight: "15%", note: "4.88 average over 142 bookings." },
        fatigueBalance: { score: 88, weight: "10%", note: "1st job of afternoon shift." }
      },
      alternativesConsidered: [
        { name: "P. Naresh", score: 86.5, exclusionReason: "Distance was 5.1 km (exceeded 3.5 km rapid response radius)." }
      ]
    }
  ];

  const handleExecuteRebalance = (areaId: string) => {
    setRebalanceLoading(areaId);
    setTimeout(() => {
      setRebalancedAreas((prev) => ({ ...prev, [areaId]: true }));
      setRebalanceLoading(null);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#2563EB] dark:text-blue-400 font-extrabold">
              Explainable AI Intelligence Matrix • v4.2
            </span>
            <span className="text-[9px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
              AI DEMO
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Predictive Demand & Explainable Workforce Allocation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time algorithmic dispatch transparency, trade demand forecasts, and cooperative labor reallocation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>Inference: 340ms • 99.2% Trust</span>
          </span>
        </div>
      </div>

      {/* TOP 4 AI TELEMETRY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Dispatch Accuracy</span>
            <BrainCircuit className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">94.8%</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+3.2% vs baseline heuristic</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Mean Response Time</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">4.8 min</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <ArrowDownRight className="w-3 h-3" />
            <span>-2.4 min transit optimization</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Idle Hours Saved</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,420 hrs</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            <span>₹4.26L extra worker earnings</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Fair Fatigue Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">98.4 / 100</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            <span>Zero worker burnout violations</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE 3D DEMAND TOPOGRAPHY */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#2563EB]">
                Visual Geo-Spatial Heatmap
              </span>
              <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                WebGL 3D
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              District Labor Demand Topography
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click & drag to rotate view • Hover nodes to inspect district buffers
          </span>
        </div>

        <div className="w-full">
          <AiDemand3D />
        </div>
      </div>

      {/* SECTION 2: DEMAND FORECASTING MATRIX (24H, 7D, 30D) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Predictive Demand Curves by Trade
              </h3>
              <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">
                ARIMA + LSTM Hybrid Model
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Anticipates surge windows to preemptively alert cooperative dispatchers.
            </p>
          </div>

          {/* Time Horizon Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            <button
              onClick={() => setTimeHorizon("24H")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                timeHorizon === "24H"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeHorizon("7D")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                timeHorizon === "7D"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeHorizon("30D")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                timeHorizon === "30D"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Trade Legend & Summary Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
          <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-md bg-blue-600" />
            Electricians (+24% evening surge)
          </span>
          <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-md bg-cyan-500" />
            Plumbing (+18% morning surge)
          </span>
          <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-md bg-amber-500" />
            Carpentry (Stable day workload)
          </span>
          <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span className="w-3 h-3 rounded-md bg-emerald-500" />
            Cleaning / Sanitation (+35% weekend peak)
          </span>
        </div>

        {/* Visual Forecast Chart Bars */}
        <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-9 gap-2 pt-4">
          {activeForecast.map((point, idx) => {
            const heightPct = Math.round((point.totalDemand / maxDemand) * 100);
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-end h-48 transition-all ${
                  point.isPeak
                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                }`}
              >
                {point.isPeak && (
                  <span className="text-[9px] font-black uppercase text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/80 px-1.5 py-0.5 rounded-full mb-1">
                    Peak
                  </span>
                )}
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {point.totalDemand}
                </span>
                <span className="text-[10px] text-slate-400">jobs</span>

                {/* Stacked representation bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden my-2 flex flex-col-reverse" style={{ height: `${Math.max(20, heightPct)}%` }}>
                  <div style={{ height: `${(point.electrician / point.totalDemand) * 100}%` }} className="bg-blue-600 w-full" />
                  <div style={{ height: `${(point.plumber / point.totalDemand) * 100}%` }} className="bg-cyan-500 w-full" />
                  <div style={{ height: `${(point.carpenter / point.totalDemand) * 100}%` }} className="bg-amber-500 w-full" />
                  <div style={{ height: `${(point.cleaning / point.totalDemand) * 100}%` }} className="bg-emerald-500 w-full" />
                </div>

                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {point.timeLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: DYNAMIC WORKFORCE ALLOCATION & RELOCATION RECOMMENDATIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Real-Time Dynamic Workforce Allocation
              </h3>
              <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Live Capacity
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identifies micro-cluster shortages and computes optimal relocation from surplus sectors.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Area & District</th>
                <th className="py-3 px-3">Primary Trade</th>
                <th className="py-3 px-3 text-center">Required</th>
                <th className="py-3 px-3 text-center">Available</th>
                <th className="py-3 px-3 text-center">Shortage / Surplus</th>
                <th className="py-3 px-3">AI Rebalance Recommendation</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {AREA_ALLOCATIONS.map((area) => {
                const isRebalanced = rebalancedAreas[area.id];
                const isLoading = rebalanceLoading === area.id;
                return (
                  <tr key={area.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      <div>{area.areaName}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{area.district}</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {area.primaryTrade}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {area.requiredWorkers}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {isRebalanced ? area.requiredWorkers : area.availableWorkers}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isRebalanced ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Equilibrium (0)
                        </span>
                      ) : area.shortage > 0 ? (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          area.urgency === "CRITICAL"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          -{area.shortage} Shortage
                        </span>
                      ) : area.shortage < 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          +{Math.abs(area.shortage)} Surplus
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Balanced
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 max-w-xs text-[11px] text-slate-600 dark:text-slate-400">
                      {isRebalanced ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Reallocation Dispatched & Confirmed via SMS
                        </span>
                      ) : (
                        area.recommendation
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {area.shortage > 0 && !isRebalanced ? (
                        <button
                          onClick={() => handleExecuteRebalance(area.id)}
                          disabled={isLoading}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Dispatching...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3" />
                              <span>Approve Relocation</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Nominal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: EXPLAINABLE AI (XAI) TRANSPARENCY CONSOLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Explainable AI (XAI) Dispatch Auditing
              </h3>
              <span className="text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                Zero Black-Box Guarantee
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every algorithmic dispatch exposes its multi-factor mathematical weights and non-selection rationale.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {EXPLAINABLE_DISPATCHES.map((disp) => (
            <div
              key={disp.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{disp.bookingRef} • {disp.timestamp}</span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{disp.serviceCategory}</h4>
                  <p className="text-xs text-[#2563EB] font-bold mt-0.5">Matched: {disp.selectedWorker}</p>
                  <p className="text-[10px] text-slate-500">{disp.workerBadge}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{disp.confidenceScore}%</span>
                  <span className="text-[9px] font-bold block text-slate-400">Match Confidence</span>
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Algorithmic Factor Weights & Rationale
                </span>

                <div className="space-y-1.5 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Skill & NSQF Level ({disp.weights.skillMatch.weight})</span>
                      <p className="text-[10px] text-slate-500">{disp.weights.skillMatch.note}</p>
                    </div>
                    <span className="text-xs font-black text-blue-600">{disp.weights.skillMatch.score}%</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Geodesic Proximity ({disp.weights.proximity.weight})</span>
                      <p className="text-[10px] text-slate-500">{disp.weights.proximity.note}</p>
                    </div>
                    <span className="text-xs font-black text-indigo-600">{disp.weights.proximity.score}%</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Worker Availability ({disp.weights.availability.weight})</span>
                      <p className="text-[10px] text-slate-500">{disp.weights.availability.note}</p>
                    </div>
                    <span className="text-xs font-black text-emerald-600">{disp.weights.availability.score}%</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Fair Fatigue Balance ({disp.weights.fatigueBalance.weight})</span>
                      <p className="text-[10px] text-slate-500">{disp.weights.fatigueBalance.note}</p>
                    </div>
                    <span className="text-xs font-black text-amber-600">{disp.weights.fatigueBalance.score}%</span>
                  </div>
                </div>
              </div>

              {/* Alternatives Considered */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Alternatives Evaluated & Non-Selection Rationale:
                </span>
                <div className="space-y-1">
                  {disp.alternativesConsidered.map((alt, i) => (
                    <div key={i} className="text-slate-600 dark:text-slate-400">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{alt.name} ({alt.score}%):</span> {alt.exclusionReason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

