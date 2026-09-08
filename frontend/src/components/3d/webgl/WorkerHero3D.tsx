import React, { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  Zap,
  Wrench,
  Hammer,
  PaintBucket,
  PenTool,
  CheckCircle2,
  Award,
  Sun
} from "lucide-react";

interface TradePreset {
  id: string;
  name: string;
  workerName: string;
  title: string;
  location: string;
  rating: number;
  completedJobs: number;
  imageUrl: string;
  experience: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRADES_PRESETS: TradePreset[] = [
  {
    id: "electrician",
    name: "Electrician",
    workerName: "Ramesh Kumar",
    title: "Master Electrical Specialist",
    location: "Kukatpally, Hyderabad",
    rating: 4.96,
    completedJobs: 412,
    experience: "9 Yrs Exp",
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&q=85",
    icon: Zap
  },
  {
    id: "plumber",
    name: "Plumber",
    workerName: "Suresh Patil",
    title: "Sanitary & Pressure Piping",
    location: "Gachibowli, Hyderabad",
    rating: 4.92,
    completedJobs: 326,
    experience: "7 Yrs Exp",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=85",
    icon: Wrench
  },
  {
    id: "carpenter",
    name: "Carpenter",
    workerName: "Anand Verma",
    title: "Master Wood & Joinery Artisan",
    location: "Secunderabad",
    rating: 4.95,
    completedJobs: 540,
    experience: "12 Yrs Exp",
    imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1000&q=85",
    icon: Hammer
  },
  {
    id: "technician",
    name: "Appliance Tech",
    workerName: "Sujatha Devi",
    title: "HVAC & Inverter Diagnostics",
    location: "Hanamkonda, Warangal",
    rating: 4.98,
    completedJobs: 388,
    experience: "8 Yrs Exp",
    imageUrl: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=1000&q=85",
    icon: PenTool
  },
  {
    id: "solar",
    name: "Solar Specialist",
    workerName: "Manoj Yadav",
    title: "Rooftop Solar & Micro-Grid",
    location: "Banjara Hills, Hyderabad",
    rating: 4.91,
    completedJobs: 290,
    experience: "6 Yrs Exp",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1000&q=85",
    icon: Sun
  }
];

export const WorkerHero3D: React.FC = () => {
  const [selectedTrade, setSelectedTrade] = useState<TradePreset>(TRADES_PRESETS[0]);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt physics capped gracefully
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 240, damping: 26, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D Interactive Stage Container */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full max-w-[460px] flex flex-col items-center cursor-grab active:cursor-grabbing"
      >
        {/* Soft Ambient Depth Aura */}
        <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-blue-200/50 via-teal-100/40 to-amber-100/40 blur-2xl pointer-events-none" />

        {/* Central Realistic Worker Photography Frame with perfect aspect ratio */}
        <div
          className="relative z-10 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group transition-all duration-300 hover:shadow-blue-500/15"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Top Status Header inside card */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-slate-800 tracking-tight">
                Active Cooperative Artisan
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>NSQF Level 4</span>
            </div>
          </div>

          {/* Main Worker Image: Properly proportioned & fitted (aspect-[4/3] or 280px tall) */}
          <div className="relative w-full h-[280px] sm:h-[320px] overflow-hidden bg-slate-900">
            <img
              src={selectedTrade.imageUrl}
              alt={`${selectedTrade.workerName} - ${selectedTrade.title}`}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            {/* Subtle Vignette & Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent pointer-events-none" />

            {/* Bottom Overlay Info on Photo */}
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight drop-shadow-md">
                    {selectedTrade.workerName}
                  </h3>
                  <p className="text-xs text-slate-200 drop-shadow-sm font-medium">
                    {selectedTrade.title} • {selectedTrade.experience}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-amber-300 font-black text-xs sm:text-sm bg-black/40 px-2.5 py-1 rounded-xl backdrop-blur-xs border border-amber-300/30">
                    ★ {selectedTrade.rating.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    {selectedTrade.completedJobs}+ jobs
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Neatly Integrated Guarantee Pillars (Placed below photo, NEVER overlapping worker's face!) */}
          <div className="p-3.5 sm:p-4 bg-white grid grid-cols-2 gap-2.5 border-t border-slate-100">
            <div className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-2.5 hover:bg-emerald-50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                0%
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate">100% Wage Retained</div>
                <div className="text-[10px] text-emerald-700 font-semibold truncate">Zero Commission</div>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-2.5 hover:bg-blue-50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate">₹2L Health Cover</div>
                <div className="text-[10px] text-blue-700 font-semibold truncate">Cooperative Welfare</div>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-2.5 hover:bg-amber-50 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                ⚡
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate">Instant UPI Pay</div>
                <div className="text-[10px] text-amber-800 font-semibold truncate">0.4s OTP Transfer</div>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate">Nearby Radar</div>
                <div className="text-[10px] text-slate-600 font-semibold truncate">28 Active Calls</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trade Selector Switcher Chips below stage */}
      <div className="mt-5 w-full max-w-[460px] flex flex-wrap items-center justify-center gap-2">
        {TRADES_PRESETS.map((trade) => {
          const isSelected = selectedTrade.id === trade.id;
          const Icon = trade.icon;
          return (
            <button
              key={trade.id}
              type="button"
              onClick={() => setSelectedTrade(trade)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isSelected
                  ? "bg-[#0b84f3] text-white border border-blue-600 shadow-sm scale-105"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{trade.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
