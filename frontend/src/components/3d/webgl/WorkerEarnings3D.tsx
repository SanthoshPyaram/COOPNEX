import React, { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Coins,
  Check,
  Zap,
  ArrowUpRight
} from "lucide-react";

interface TradeRate {
  id: string;
  name: string;
  avgJobRate: number;
  icon: string;
  artisanName: string;
  artisanPhoto: string;
  tradeDesc: string;
}

const TRADES: TradeRate[] = [
  {
    id: "electrician",
    name: "Electrician",
    avgJobRate: 650,
    icon: "⚡",
    artisanName: "Rajesh Sharma",
    artisanPhoto: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    tradeDesc: "Level 4 Master Electrician • 12 Years Field Experience"
  },
  {
    id: "plumber",
    name: "Plumber",
    avgJobRate: 600,
    icon: "🔧",
    artisanName: "Manoj Verma",
    artisanPhoto: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
    tradeDesc: "Certified District Plumber • Pipe & Fixture Specialist"
  },
  {
    id: "appliance",
    name: "Appliance Tech",
    avgJobRate: 850,
    icon: "❄️",
    artisanName: "Sujatha Devi",
    artisanPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    tradeDesc: "HVAC & Inverter Specialist • Solar & Smart Tech"
  },
  {
    id: "carpenter",
    name: "Carpenter",
    avgJobRate: 750,
    icon: "🪚",
    artisanName: "Anand Mistri",
    artisanPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    tradeDesc: "Master Wood Craftsman • Furniture & Architectural Joinery"
  },
  {
    id: "painter",
    name: "Painter & Finisher",
    avgJobRate: 700,
    icon: "🎨",
    artisanName: "Kishore Pal",
    artisanPhoto: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    tradeDesc: "Surface Preparation & Premium Emulsion Specialist"
  },
  {
    id: "mason",
    name: "Mason & Tile Specialist",
    avgJobRate: 800,
    icon: "🧱",
    artisanName: "Rameshwar Rao",
    artisanPhoto: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    tradeDesc: "Precision Masonry & Tile Setting Guild Member"
  }
];

const RECENT_DISPATCHES = [
  "⚡ Rajesh S. • Sector 4: ₹750 Disbursed via UPI • 0% Cut",
  "🔧 Suresh P. • Green Valley: ₹600 Disbursed via UPI • 0% Cut",
  "❄️ Sujatha D. • Sector 8: ₹950 Disbursed via UPI • 0% Cut",
  "🪚 Anand M. • Anand Vihar: ₹800 Disbursed via UPI • 0% Cut",
  "🎨 Kishore P. • Banjara Hills: ₹700 Disbursed via UPI • 0% Cut"
];

export const WorkerEarnings3D: React.FC = () => {
  const [selectedTrade, setSelectedTrade] = useState<TradeRate>(TRADES[0]);
  const [jobsPerWeek, setJobsPerWeek] = useState<number>(18);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // 3D subtle tilt calculations on the wealth card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-4deg", "4deg"]);

  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
    setGlarePos({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100)
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsCardHovered(false);
  };

  // Financial calculations
  const monthlyJobs = Math.round(jobsPerWeek * 4.33);
  const grossMonthly = monthlyJobs * selectedTrade.avgJobRate;

  // COOPNEX: 0% platform commission on base wage!
  const coopTakeHome = grossMonthly;

  // Private Corporate Aggregator: ~28% commission deduction
  const aggregatorCut = Math.round(grossMonthly * 0.28);
  const aggregatorTakeHome = grossMonthly - aggregatorCut;

  // Extra money retained by the artisan's family
  const extraRetainedMonthly = aggregatorCut;
  const extraRetainedYearly = extraRetainedMonthly * 12;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider shadow-2xs">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent Livelihood Calculator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Calculate What You Actually Take Home.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          See the mathematical reality of 0% platform commission. Every single rupee of your hard labor stays in your household.
        </p>
      </div>

      {/* Automatically Sliding Live Payouts Ticker Marquee */}
      <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl bg-emerald-50/80 border border-emerald-200/80 p-2.5 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-600 text-white flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            Live UPI Feed
          </span>

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 24 }}
            className="flex items-center gap-8 whitespace-nowrap text-xs font-semibold text-emerald-900 font-mono"
          >
            {RECENT_DISPATCHES.concat(RECENT_DISPATCHES).map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span>{item}</span>
                <span className="text-emerald-400">•</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Interactive Grid: Calculator on Left (6 cols), Real Worker & Wealth Stack on Right (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Interactive Controls & Rates (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xl space-y-7 flex flex-col justify-between">
          <div>
            {/* Step 1: Select Trade */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                1. Select Your Certified Trade:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TRADES.map((trade) => {
                  const isSelected = selectedTrade.id === trade.id;
                  return (
                    <motion.button
                      key={trade.id}
                      type="button"
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTrade(trade)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-sm"
                          : "bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{trade.icon}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#0b84f3] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 truncate">
                          {trade.name}
                        </div>
                        <div className="text-[11px] font-bold text-slate-500 font-mono">
                          ₹{trade.avgJobRate} avg/job
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Jobs Per Week Slider */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                  2. Average Completed Jobs Per Week:
                </label>
                <div className="text-lg font-black text-[#0b84f3] font-mono px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 shadow-xs">
                  {jobsPerWeek} jobs/wk
                </div>
              </div>

              <input
                type="range"
                min="5"
                max="35"
                step="1"
                value={jobsPerWeek}
                onChange={(e) => setJobsPerWeek(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0b84f3]"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Part-Time (5 jobs)</span>
                <span>Standard (18 jobs)</span>
                <span>Full-Time (35 jobs)</span>
              </div>
            </div>
          </div>

          {/* District Floor Wage Assurance Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs text-slate-600">
              <strong className="text-slate-900">District Cooperative Tariff:</strong> Rate card
              guaranteed by your local board. No arbitrary surge discounting or customer underbidding.
            </div>
          </div>
        </div>

        {/* Right Column: Properly Fitted Worker Photography & Tangible Wealth Stack (6 cols) */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsCardHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 text-white p-6 sm:p-7 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-5 relative overflow-hidden group"
        >
          {/* Spotlight Glare Effect on Hover */}
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
            style={{
              background: `radial-gradient(500px circle at ${glarePos.x}% ${glarePos.y}%, rgba(16, 185, 129, 0.15), transparent 70%)`
            }}
          />

          {/* Floating Subtle Rupee Coins drifting smoothly */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5 + i * 0.8,
                  delay: i * 0.7,
                  ease: "easeInOut"
                }}
                className="absolute text-amber-300 font-mono font-black text-2xl"
                style={{
                  left: `${15 + i * 24}%`,
                  bottom: `${10 + i * 15}%`
                }}
              >
                ₹
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 space-y-4">
            {/* PROPERLY FITTED ARTISAN PHOTO BANNER (Full width, proper aspect ratio, not squashed!) */}
            <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-slate-700/80 shadow-md bg-slate-900">
              <img
                src={selectedTrade.artisanPhoto}
                alt={selectedTrade.artisanName}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Floating Status Badges on Photo */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                  0% Commission
                </span>
                <span className="text-[10px] font-bold text-slate-200 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                  {selectedTrade.name}
                </span>
              </div>

              {/* Bottom Photo Overlay Info */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                <div>
                  <h4 className="text-sm sm:text-base font-black tracking-tight drop-shadow-md">
                    {selectedTrade.artisanName}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {selectedTrade.tradeDesc}
                  </p>
                </div>
                <span className="text-xs font-black text-amber-300 bg-black/40 px-2 py-0.5 rounded-lg border border-amber-300/30">
                  ★ 4.96
                </span>
              </div>
            </div>

            {/* Monthly Take-Home Animated Figure */}
            <div className="space-y-1 text-center sm:text-left pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Monthly Cooperative Take-Home
              </div>
              <motion.div
                key={coopTakeHome}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 font-mono"
              >
                ₹{coopTakeHome.toLocaleString("en-IN")}
              </motion.div>
              <div className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Based on ~{monthlyJobs} jobs/month @ ₹{selectedTrade.avgJobRate} fixed avg
                </span>
              </div>
            </div>

            {/* Breakdown Stack: COOPNEX vs Private App */}
            <div className="space-y-2.5 pt-1">
              {/* COOPNEX Net */}
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between transition-all group-hover:border-emerald-400">
                <div>
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>COOPNEX (Cooperative)</span>
                  </div>
                  <div className="text-[10px] text-emerald-200/70 mt-0.5">
                    0% commission cut • 100% direct bank payout
                  </div>
                </div>
                <div className="text-sm sm:text-base font-black text-emerald-300 font-mono">
                  ₹{coopTakeHome.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Corporate Gig App Cut */}
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 flex items-center justify-between opacity-85">
                <div>
                  <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Private Corporate Aggregator</span>
                  </div>
                  <div className="text-[10px] text-rose-200/70 mt-0.5">
                    Takes ~28% cut (-₹{aggregatorCut.toLocaleString("en-IN")})
                  </div>
                </div>
                <div className="text-sm font-bold text-rose-300 font-mono line-through">
                  ₹{aggregatorTakeHome.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {/* Annual Extra Retained Banner */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-400/40 flex items-center gap-3">
            <Coins className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-300">
                Annual Household Livelihood Advantage
              </div>
              <div className="text-xs sm:text-sm font-black text-white font-mono mt-0.5">
                +₹{extraRetainedYearly.toLocaleString("en-IN")} Retained Every Year
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                Plus ₹2,00,000 accidental insurance &amp; children's education grants.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
