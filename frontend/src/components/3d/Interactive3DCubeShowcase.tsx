import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  MapPin,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface PillarData {
  id: number;
  badge: string;
  title: string;
  headline: string;
  desc: string;
  metric: string;
  metricLabel: string;
  gradient: string;
  borderGlow: string;
  icon: React.ReactNode;
}

const PILLARS: PillarData[] = [
  {
    id: 0,
    badge: "DEMOCRATIC FAIR WAGES",
    title: "0% Commission Guarantee",
    headline: "100% of Statutory Floor Wage Goes Directly to Artisans",
    desc: "Private aggregator apps tax blue-collar technicians 25% to 35% in commission and lead fees. COOPNEX charges 0% middleman cut. ₹800 billed = ₹800 deposited directly into the worker's cooperative bank account.",
    metric: "0% CUT",
    metricLabel: "Middleman Intermediary Fee",
    gradient: "from-blue-600 via-indigo-600 to-emerald-600",
    borderGlow: "border-blue-500/40 shadow-blue-500/20",
    icon: <DollarSign className="w-6 h-6 text-emerald-300" />
  },
  {
    id: 1,
    badge: "HOUSEHOLD SAFETY FIRST",
    title: "5-Tier UIDAI & Police Verification",
    headline: "Biometric Checksum, Skill Council & Police Clearance",
    desc: "Every technician is strictly screened across five verified checkpoints: UIDAI Verhoeff biometric checksum, NSDC Level-4 skill certification, criminal record verification with local state police, physical trade assessment, and peer guild endorsement.",
    metric: "100%",
    metricLabel: "Verified Household Trust",
    gradient: "from-emerald-600 via-teal-600 to-blue-600",
    borderGlow: "border-emerald-500/40 shadow-emerald-500/20",
    icon: <ShieldCheck className="w-6 h-6 text-cyan-300" />
  },
  {
    id: 2,
    badge: "PRECISION DOORSTEP LOGISTICS",
    title: "Live GPS Radar & Safety OTP",
    headline: "Real-Time Fleet Dispatch with 4-Digit Doorstep Authentication",
    desc: "Track your technician's live route via our electric dispatch network with accurate minute-by-minute ETAs. Technicians cannot initiate work until you verify their photo ID badge and enter your encrypted 4-digit safety OTP.",
    metric: "~15 MINS",
    metricLabel: "Average Doorstep Arrival",
    gradient: "from-amber-600 via-orange-600 to-rose-600",
    borderGlow: "border-amber-500/40 shadow-amber-500/20",
    icon: <MapPin className="w-6 h-6 text-amber-300" />
  },
  {
    id: 3,
    badge: "INSTANT DBT ESCROW SETTLEMENT",
    title: "Bharat UPI & Geo-Tagged Work Media",
    headline: "Direct Escrow Release with Tamper-Proof Photo Evidence",
    desc: "Upon service completion, review timestamped photo and video proof of the repair. Approve payment instantly with Bharat UPI, RuPay, or Cash. Payments release immediately from escrow to the worker with automated GST breakdown.",
    metric: "+₹800",
    metricLabel: "Instant DBT Credit Released",
    gradient: "from-purple-600 via-indigo-600 to-emerald-600",
    borderGlow: "border-purple-500/40 shadow-purple-500/20",
    icon: <CreditCard className="w-6 h-6 text-purple-300" />
  }
];

const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds per pillar

export const Interactive3DCubeShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking for subtle 3D physical response
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const tiltRotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const tiltRotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsPaused(false);
  };

  // Automated cycling effect without manual clicking
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev + 1) % PILLARS.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, activeIdx]);

  const goTo = (idx: number, dir?: number) => {
    setDirection(dir ?? (idx > activeIdx ? 1 : -1));
    setActiveIdx(idx);
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % PILLARS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + PILLARS.length) % PILLARS.length);
  };

  const current = PILLARS[activeIdx];

  // 3D cube rotation transition variants
  const cubeVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      rotateY: dir > 0 ? 30 : -30,
      translateZ: -80,
      scale: 0.95
    }),
    center: {
      opacity: 1,
      rotateY: 0,
      translateZ: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: (dir: number) => ({
      opacity: 0,
      rotateY: dir > 0 ? -30 : 30,
      translateZ: -80,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    })
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 px-4 select-none">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-4 py-1.5 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin [animation-duration:8s]" />
          <span className="font-mono uppercase tracking-wider">3D COOPERATIVE PILLARS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">AUTO-ACTIVE</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
          Why COOPNEX is Built Different
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Interactive 3D overview of the four cooperative principles protecting both citizens and informal artisans.
        </p>
      </div>

      {/* 4 Pillar Selection Tabs with Animated Progress Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {PILLARS.map((p, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? "bg-blue-600 text-white border-blue-400 shadow-xl shadow-blue-600/30 scale-[1.02] ring-2 ring-blue-400/40"
                  : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 relative z-10">
                <span className={`text-[10px] font-mono font-bold tracking-wider ${isActive ? "text-blue-100" : "opacity-70"}`}>
                  PILLAR 0{idx + 1}
                </span>
                {isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </div>
              <h4 className="font-display font-bold text-xs sm:text-sm truncate relative z-10">{p.title}</h4>

              {/* Automatic Progress Countdown Line */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
                  <motion.div
                    key={`progress-${idx}-${isPlaying && !isPaused ? "play" : "pause"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: isPlaying && !isPaused ? "100%" : undefined }}
                    transition={{
                      duration: AUTOPLAY_INTERVAL / 1000,
                      ease: "linear"
                    }}
                    className="h-full bg-amber-300 shadow-sm"
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 3D Perspective Stage Container with Interactive Tilt and Auto-Hover Pause */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200 }}
        className="relative"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={cubeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              rotateX: tiltRotateX,
              rotateY: tiltRotateY,
              transformStyle: "preserve-3d"
            }}
            className={`relative rounded-3xl p-6 sm:p-10 text-white bg-slate-950 border ${current.borderGlow} shadow-2xl overflow-hidden transition-colors duration-500`}
          >
            {/* Ambient Dynamic Background Gradient Lighting */}
            <div className={`absolute inset-0 pointer-events-none opacity-25 bg-gradient-to-br ${current.gradient}`} />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Details */}
              <div className="lg:col-span-8 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-mono font-bold backdrop-blur-md">
                  {current.icon}
                  <span>{current.badge}</span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                  {current.headline}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {current.desc}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <a
                    href="#workers-directory"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30"
                  >
                    <span>Experience On Platform</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: 3D Metric Hologram */}
              <motion.div
                style={{ transform: "translateZ(35px)" }}
                className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md text-center space-y-2 shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  {current.icon}
                </div>
                <div className="font-mono font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white">
                  {current.metric}
                </div>
                <div className="text-xs font-medium text-slate-400 max-w-[180px]">
                  {current.metricLabel}
                </div>
              </motion.div>
            </div>

            {/* Navigation & Automated Status Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white">
                  PILLAR {activeIdx + 1} OF {PILLARS.length}
                </span>

                {/* Live Automation Status Indicator */}
                {isPlaying && !isPaused ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Auto-Rotating (Hover to Pause)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                    <Pause className="w-2.5 h-2.5" />
                    <span>Paused ({isPaused ? "Hovering" : "User"})</span>
                  </span>
                )}
              </div>

              {/* Autoplay & Direction Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
                  title={isPlaying ? "Pause Automatic Cycling" : "Resume Automatic Cycling"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Previous Pillar (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Next Pillar (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
