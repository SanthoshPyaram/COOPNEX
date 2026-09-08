import React, { useState, useEffect } from "react";
import {
  Zap,
  Navigation,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  Radio,
  AlertTriangle,
  User,
  Compass,
  CheckCircle2,
  Share2,
  Activity
} from "lucide-react";

export const EmergencyDispatch3D: React.FC = () => {
  const [progress, setProgress] = useState<number>(0.35); // 0 to 1 position along route
  const [etaSeconds, setEtaSeconds] = useState<number>(348); // ~5m 48s
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedPin, setSelectedPin] = useState<"customer" | "worker" | "location">("worker");

  // Animate the dispatched worker along the route
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.006;
        return next > 0.98 ? 0.05 : next;
      });
      setEtaSeconds((prev) => (prev > 10 ? prev - 1 : 360));
    }, 200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatEta = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  // Trajectory coordinates on a 1000x500 svg grid
  // Worker start: (160, 370) -> Location: (820, 140)
  const pathD = "M 160 370 Q 380 340 540 250 T 820 140";

  // Calculate approximate point along quadratic bezier
  const t = progress;
  const workerX = 160 + (820 - 160) * t;
  const workerY = 370 + (140 - 370) * t - Math.sin(t * Math.PI) * 45;

  return (
    <div className="relative w-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs text-slate-800 select-none">
      {/* Top Telemetry Header - Crisp Light Style */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-50/80 via-white to-blue-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold shadow-xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
                SOS Emergency Rapid Dispatch Command
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono text-[10px] font-bold border border-rose-200">
                ACTIVE INCIDENT #SS-EMG-902
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Real-time proximity GPS tracking • Sub-7-Minute Cooperative Emergency SLA
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-mono text-slate-700 border border-slate-200 transition"
          >
            {isPaused ? "Resume Live Tracking" : "Pause Tracking"}
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>GPS Tracking Active</span>
          </div>
        </div>
      </div>

      {/* Main 3D Perspective Map Canvas - Light Grid Theme */}
      <div className="relative w-full h-[360px] sm:h-[400px] overflow-hidden bg-gradient-to-b from-slate-50/60 via-white to-blue-50/20">
        {/* Subtle Light Grid Texture */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(to right, #E2E8F0 1px, transparent 1px)",
            backgroundSize: "36px 36px"
          }}
        />

        {/* Ambient Warm Gradient Spots */}
        <div className="absolute top-8 left-12 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-8 right-12 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        {/* SVG Route Spline & Moving Radar Beacon */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeLightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#075E54" />
              <stop offset="50%" stopColor="#0b84f3" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <filter id="lightGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Distress Radar Concentric Rings around Location */}
          <circle cx="820" cy="140" r="40" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.5" fill="none">
            <animate attributeName="r" values="20;85" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.7;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="820" cy="140" r="70" stroke="#EF4444" strokeWidth="1" strokeOpacity="0.25" fill="none" />

          {/* Road Base Track */}
          <path
            d={pathD}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Glowing Animated Trajectory Path */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#routeLightGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 6"
            filter="url(#lightGlow)"
          />

          {/* Moving Beacon Marker on SVG */}
          <circle cx={workerX} cy={workerY} r="7" fill="#075E54" filter="url(#lightGlow)">
            <animate attributeName="r" values="6;8.5;6" dur="1s" repeatCount="indefinite" />
          </circle>
          <line
            x1={workerX}
            y1={workerY}
            x2={workerX}
            y2={workerY + 28}
            stroke="#075E54"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            opacity="0.5"
          />
        </svg>

        {/* 1. DISPATCHED ARTISAN CARD (WORKER NODE) - Light Design */}
        <div
          onClick={() => setSelectedPin("worker")}
          className="absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition hover:scale-105"
          style={{ left: `${(workerX / 1000) * 100}%`, top: `${(workerY / 500) * 100}%` }}
        >
          <div className="relative">
            {/* Ping indicator */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
            </span>

            <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-white border-2 border-[#075E54] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                alt="Rajesh Kumar"
                className="w-9 h-9 rounded-xl object-cover border border-[#075E54] shrink-0"
              />
              <div className="text-left pr-2">
                <div className="font-black text-xs text-slate-900 leading-tight flex items-center gap-1">
                  <span>Rajesh Kumar</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#075E54]" />
                </div>
                <div className="text-[10px] text-[#075E54] font-mono font-bold">
                  En Route • 28 km/h
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DISTRESS LOCATION PIN (ADDRESS) - Light Design */}
        <div
          onClick={() => setSelectedPin("location")}
          className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition hover:scale-105"
          style={{ left: "82%", top: "28%" }}
        >
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-2xl bg-white border-2 border-rose-500 shadow-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-xs shadow-md">
                <MapPin className="w-4 h-4 animate-bounce" />
              </div>
              <div className="text-left pr-2">
                <div className="font-black text-xs text-slate-900">Flat 402, Green Meadows</div>
                <div className="text-[10px] text-rose-600 font-mono font-medium">Road No. 12, Banjara Hills</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CUSTOMER IN DISTRESS (CALLER) - Light Design */}
        <div
          onClick={() => setSelectedPin("customer")}
          className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition hover:scale-105"
          style={{ left: "88%", top: "60%" }}
        >
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
              alt="Ananya Iyer"
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="text-left pr-2">
              <div className="font-bold text-xs text-slate-900">Ananya Iyer (Resident)</div>
              <div className="text-[10px] text-slate-500 font-mono">SOS: Electrical Flashover</div>
            </div>
          </div>
        </div>

        {/* Floating Quick SLA Widget - Crisp Light Design */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 border border-slate-200 p-3 rounded-2xl shadow-lg backdrop-blur-sm flex items-center gap-4 text-xs font-mono">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Live ETA</div>
            <div className="text-lg font-black text-amber-600">{formatEta(etaSeconds)}</div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <div className="text-[10px] text-slate-400 uppercase">Proximity</div>
            <div className="text-lg font-black text-[#075E54]">1.2 km</div>
          </div>
          <div className="border-l border-slate-200 pl-4 hidden sm:block">
            <div className="text-[10px] text-slate-400 uppercase">Target SLA</div>
            <div className="text-lg font-black text-blue-600">&lt; 7.0m</div>
          </div>
        </div>
      </div>

      {/* Interactive Bottom Control Bar - Light Style */}
      <div className="p-4 bg-slate-50/90 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Hazard Type:</span>
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
              3-Phase Flashover &amp; Main Cutoff
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>PCC Verified: Gunadala Precinct, Vijayawada Police</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Calling Dispatched Artisan: Rajesh Kumar (+91 98765 43210)")}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#075E54]" />
            <span>Call Worker</span>
          </button>

          <button
            onClick={() => alert("Calling Resident: Ananya Iyer (+91 98490 11223)")}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call Resident</span>
          </button>

          <button
            onClick={() => alert("Emergency hazard marked safely resolved. Escrow settled to artisan.")}
            className="px-4 py-2 rounded-xl bg-[#075E54] hover:bg-[#064e46] text-white font-black transition shadow-xs"
          >
            Resolve Incident
          </button>
        </div>
      </div>
    </div>
  );
};
