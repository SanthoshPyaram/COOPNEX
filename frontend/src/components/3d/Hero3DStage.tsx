import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  MapPin,
  Star,
  ArrowUpRight,
  Radio,
  Award
} from "lucide-react";
import { CartoonWorkerMascot } from "../animations/CartoonWorkerMascot";

interface Hero3DStageProps {
  gender: "man" | "woman";
  onGenderChange: (gender: "man" | "woman") => void;
  onBookTrial?: () => void;
}

export const Hero3DStage: React.FC<Hero3DStageProps> = ({
  gender,
  onGenderChange,
  onBookTrial
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for natural weight and responsiveness
  const springConfig = { damping: 22, stiffness: 280, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D rotations for the entire floating stage
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);

  // Automated gender rotation every 7 seconds when idle
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      onGenderChange(gender === "man" ? "woman" : "man");
    }, 7000);
    return () => clearInterval(interval);
  }, [isHovered, gender, onGenderChange]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
      className="relative w-full max-w-lg mx-auto select-none py-4"
    >
      {/* 3D Background Glow & Volumetric Lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-blue-600/25 via-indigo-500/20 to-amber-400/20 blur-3xl animate-pulse" />
      </div>

      {/* Main 3D Floating Stage Canvas */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        animate={
          isHovered
            ? undefined
            : {
                y: [-3, 5, -3]
              }
        }
        transition={
          isHovered
            ? undefined
            : {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }
        }
        className="relative w-full rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-700/80 p-5 sm:p-6 shadow-2xl shadow-blue-950/15 dark:shadow-black/60 transition-shadow duration-300"
      >
        {/* TOP LEVEL: 3D Holographic Verification Badge Floating in Space */}
        <motion.div
          style={{ transform: "translateZ(65px)" }}
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-2 z-40"
        >
          <div className="relative px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white font-mono text-[11px] font-black shadow-xl shadow-emerald-500/30 border border-white/40 flex items-center gap-1.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <ShieldCheck className="w-4 h-4 text-emerald-100" />
            <span>UIDAI 5-TIER VERIFIED</span>
          </div>
        </motion.div>

        {/* 3D Floating Orbiting Trade Badge 1: High-Voltage Electrical */}
        <motion.div
          style={{ transform: "translateZ(55px)" }}
          animate={{ y: [-4, 5, -4], rotate: [-2, 3, -2] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 -left-3 z-40 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 border border-amber-300"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Solar & Electrical</span>
        </motion.div>

        {/* 3D Floating Orbiting Trade Badge 2: 0% Middleman Commission Guarantee */}
        <motion.div
          style={{ transform: "translateZ(60px)" }}
          animate={{ y: [4, -5, 4], rotate: [2, -2, 2] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-4 -left-3 z-40 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-blue-600/30 border border-blue-400/40"
        >
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>0% Aggregator Commission</span>
        </motion.div>

        {/* Floating 3D Gender Switcher Header */}
        <div style={{ transform: "translateZ(30px)" }} className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>LIVE COOPERATIVE DISPATCH</span>
            </span>
          </div>

          {/* Interactive Gender Switcher */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => onGenderChange("man")}
              className={`px-3 py-1 rounded-full font-bold text-xs transition-all cursor-pointer ${
                gender === "man"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              👨‍🔧 Male
            </button>
            <button
              type="button"
              onClick={() => onGenderChange("woman")}
              className={`px-3 py-1 rounded-full font-bold text-xs transition-all cursor-pointer ${
                gender === "woman"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              👩‍🔧 Female
            </button>
          </div>
        </div>

        {/* 3D Mascot Stage Backdrop with Depth Rings */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="relative py-4 px-2 rounded-2xl bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900/90 border border-blue-100 dark:border-slate-700/60 flex items-center justify-center overflow-hidden"
        >
          {/* 3D Background Concentric Wave Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-25">
            <div className="w-48 h-48 rounded-full border border-blue-400/30 animate-ping [animation-duration:3s]" />
            <div className="w-36 h-36 rounded-full border border-indigo-400/40" />
            <div className="w-24 h-24 rounded-full border border-emerald-400/30" />
          </div>

          {/* Central Animated Mascot Component */}
          <motion.div
            key={gender}
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -20 }}
            transition={{ duration: 0.4 }}
            style={{ transform: "translateZ(45px)" }}
            className="relative z-10"
          >
            <CartoonWorkerMascot gender={gender} size="sm" showBadges={false} />
          </motion.div>
        </div>

        {/* 3D Verified Artisan Card Banner (Floating at translateZ: 40px) */}
        <motion.div
          key={gender}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ transform: "translateZ(40px)" }}
          className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={
                gender === "man"
                  ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
                  : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
              }
              alt="Featured Worker"
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/40 shrink-0"
            />
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                  {gender === "man" ? "Rajesh Sharma" : "P. Sunitha Reddy"}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {gender === "man" ? "Certified Electrician (Level 4)" : "Solar & Smart HVAC Specialist"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-500 text-xs font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="ml-0.5">4.98</span>
                </div>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  ₹{gender === "man" ? "380" : "400"}/hr Locked
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-300 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </span>
            {onBookTrial && (
              <button
                type="button"
                onClick={onBookTrial}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <span>Book Trial</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* 3D Dispatch Radar Indicator Floating Forward */}
        <motion.div
          style={{ transform: "translateZ(50px)" }}
          className="mt-3 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-red-500 animate-bounce" />
            <span>Nearest Hub: Vijayawada Central Co-op</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            ETA: 8-12 mins
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};
