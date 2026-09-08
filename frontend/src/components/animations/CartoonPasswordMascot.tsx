import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, Check, AlertTriangle, Zap, EyeOff } from "lucide-react";

export interface CartoonPasswordMascotProps {
  password: string;
  strengthScore: number; // 0 to 100
  strengthLabel: string;
  showPassword?: boolean;
  hasMin8?: boolean;
  hasNumber?: boolean;
  hasUpper?: boolean;
  hasSpecial?: boolean;
  className?: string;
}

export const CartoonPasswordMascot: React.FC<CartoonPasswordMascotProps> = ({
  password,
  strengthScore,
  strengthLabel,
  showPassword = false,
  hasMin8 = false,
  hasNumber = false,
  hasUpper = false,
  hasSpecial = false,
  className = ""
}) => {
  // Determine state
  const isIdle = !password || password.length === 0;
  const isWeak = !isIdle && strengthScore <= 35;
  const isAverage = !isIdle && strengthScore > 35 && strengthScore < 75;
  const isStrong = !isIdle && strengthScore >= 75;

  // Mascot colors based on state
  const themeColors = isIdle
    ? {
        primary: "#0A66C2",
        light: "#EFF6FF",
        border: "#BFDBFE",
        glow: "rgba(10, 102, 194, 0.15)",
        badgeBg: "bg-blue-50 dark:bg-blue-950/40 text-[#0A66C2] dark:text-blue-300 border-blue-200 dark:border-blue-800",
        pill: "Waiting for password"
      }
    : isWeak
    ? {
        primary: "#E11D48",
        light: "#FFF1F2",
        border: "#FECDD3",
        glow: "rgba(225, 29, 72, 0.25)",
        badgeBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        pill: "Weak — Needs reinforcement"
      }
    : isAverage
    ? {
        primary: "#D97706",
        light: "#FFFBEB",
        border: "#FDE68A",
        glow: "rgba(217, 119, 6, 0.2)",
        badgeBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        pill: "Average — Almost there!"
      }
    : {
        primary: "#059669",
        light: "#ECFDF5",
        border: "#A7F3D0",
        glow: "rgba(5, 150, 105, 0.25)",
        badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
        pill: "Strong — Fortress Grade"
      };

  return (
    <div
      className={`relative p-3.5 rounded-2xl border transition-all duration-300 bg-white/95 dark:bg-[#0E1726]/90 shadow-sm ${className}`}
      style={{
        borderColor: themeColors.border,
        boxShadow: `0 4px 20px ${themeColors.glow}`
      }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-3.5">
        {/* MASCOT ANIMATED STAGE */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center select-none">
          {/* Ambient Glow Disk */}
          <motion.div
            animate={{
              scale: isWeak ? [0.9, 1.15, 0.9] : [0.95, 1.05, 0.95],
              opacity: isWeak ? [0.5, 0.9, 0.5] : [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: isWeak ? 0.8 : 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-2 rounded-full blur-xl -z-10"
            style={{ backgroundColor: themeColors.primary }}
          />

          {/* Floating Action Elements based on state */}
          <AnimatePresence mode="wait">
            {isWeak && (
              <motion.div
                key="weak-sweat"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: [1, 1, 0], y: [0, 8, 14] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute top-2 right-3 text-sm z-20"
              >
                💧
              </motion.div>
            )}

            {isAverage && (
              <motion.div
                key="avg-bulb"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1], rotate: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 right-2 text-base z-20 drop-shadow"
              >
                💡
              </motion.div>
            )}

            {isStrong && (
              <motion.div
                key="strong-sparkles"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-2 right-1 text-base z-20 drop-shadow"
              >
                ✨
              </motion.div>
            )}

            {showPassword && (
              <motion.div
                key="peek-monkey"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.1, 1] }}
                exit={{ scale: 0 }}
                className="absolute -bottom-1 -right-1 text-base z-20 drop-shadow bg-white dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700"
              >
                🙈
              </motion.div>
            )}
          </AnimatePresence>

          {/* CHARACTER SVG BODY */}
          <motion.svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
            animate={
              isWeak
                ? {
                    x: [-2, 2, -2, 2, 0],
                    rotate: [-1.5, 1.5, -1, 1, 0]
                  }
                : isStrong
                ? {
                    y: [0, -6, 0],
                    rotate: [0, -1, 1, 0]
                  }
                : isAverage
                ? {
                    rotate: [-2, 2, -2],
                    y: [0, -2, 0]
                  }
                : {
                    y: [0, -3, 0]
                  }
            }
            transition={{
              duration: isWeak ? 0.35 : isStrong ? 2 : 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Soft Drop Shadow */}
            <ellipse cx="60" cy="112" rx="34" ry="5" fill="#0F172A" fillOpacity="0.12" />

            {/* Mascot Robot/Shield Body */}
            <rect
              x="26"
              y="28"
              width="68"
              height="72"
              rx="24"
              fill={themeColors.primary}
              stroke={themeColors.border}
              strokeWidth="2.5"
            />

            {/* Glossy Top Highlight */}
            <path
              d="M36 34 C44 30, 76 30, 84 34"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.5"
            />

            {/* Belly Screen / Face Plate */}
            <rect
              x="34"
              y="40"
              width="52"
              height="44"
              rx="16"
              fill="#FFFFFF"
              className="dark:fill-[#0B1220]"
              stroke={themeColors.border}
              strokeWidth="1.5"
            />

            {/* Eyebrows */}
            {isWeak ? (
              // Worried slant eyebrows
              <>
                <path d="M42 50 L52 54" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M78 50 L68 54" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : isAverage ? (
              // Curious / thinking eyebrows
              <>
                <path d="M42 52 Q47 48 52 52" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <path d="M68 50 Q73 47 78 50" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : isStrong ? (
              // Confident arched superhero eyebrows
              <>
                <path d="M42 52 Q47 47 52 50" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M68 50 Q73 47 78 52" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              // Friendly calm eyebrows
              <>
                <path d="M43 51 Q47 48 51 51" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
                <path d="M69 51 Q73 48 77 51" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
              </>
            )}

            {/* Eyes */}
            {isStrong ? (
              // Golden Star / Sunglasses Eyes for Strong
              <g>
                {/* Superhero shades */}
                <rect x="39" y="53" width="18" height="11" rx="4" fill="#059669" />
                <rect x="63" y="53" width="18" height="11" rx="4" fill="#059669" />
                <line x1="57" y1="58" x2="63" y2="58" stroke="#059669" strokeWidth="2" />
                <line x1="41" y1="56" x2="48" y2="56" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="65" y1="56" x2="72" y2="56" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            ) : isWeak ? (
              // Scared / Trembling round eyes
              <g>
                <circle cx="48" cy="58" r="6" fill="#0F172A" />
                <circle cx="46" cy="56" r="2" fill="#FFFFFF" />
                <circle cx="72" cy="58" r="6" fill="#0F172A" />
                <circle cx="70" cy="56" r="2" fill="#FFFFFF" />
              </g>
            ) : (
              // Normal blinking eyes
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  times: [0, 0.45, 0.5, 0.55, 1]
                }}
              >
                <circle cx="48" cy="58" r="5" fill="#0F172A" />
                <circle cx="46.5" cy="56.5" r="1.8" fill="#FFFFFF" />
                <circle cx="72" cy="58" r="5" fill="#0F172A" />
                <circle cx="70.5" cy="56.5" r="1.8" fill="#FFFFFF" />
              </motion.g>
            )}

            {/* Mouth */}
            {isWeak ? (
              // Shivering wavy open mouth
              <path
                d="M52 74 Q56 71 60 74 Q64 77 68 74"
                stroke="#E11D48"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : isAverage ? (
              // Encouraging slight smirk
              <path
                d="M52 72 Q60 77 68 73"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : isStrong ? (
              // Big triumphant smile
              <path
                d="M48 70 Q60 82 72 70"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Gentle waiting smile
              <path
                d="M52 72 Q60 76 68 72"
                stroke="#0A66C2"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Blushing Cheeks */}
            <ellipse cx="40" cy="65" rx="3.5" ry="2" fill="#FB7185" fillOpacity={isWeak || showPassword ? 0.7 : 0.3} />
            <ellipse cx="80" cy="65" rx="3.5" ry="2" fill="#FB7185" fillOpacity={isWeak || showPassword ? 0.7 : 0.3} />

            {/* Hands (when peek mode is ON, hands cover eyes!) */}
            {showPassword ? (
              <motion.g
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Left cartoon glove covering left eye */}
                <ellipse cx="48" cy="58" rx="8" ry="6" fill="#F8FAFC" stroke={themeColors.primary} strokeWidth="1.5" />
                {/* Right cartoon glove covering right eye */}
                <ellipse cx="72" cy="58" rx="8" ry="6" fill="#F8FAFC" stroke={themeColors.primary} strokeWidth="1.5" />
              </motion.g>
            ) : (
              // Hands resting on side or holding shield
              <g>
                <circle cx="24" cy="68" r="5" fill="#FFFFFF" stroke={themeColors.primary} strokeWidth="1.5" />
                <circle cx="96" cy="68" r="5" fill="#FFFFFF" stroke={themeColors.primary} strokeWidth="1.5" />
              </g>
            )}

            {/* Antenna with status signal ball */}
            <line x1="60" y1="28" x2="60" y2="16" stroke={themeColors.primary} strokeWidth="3" strokeLinecap="round" />
            <motion.circle
              cx="60"
              cy="14"
              r="4.5"
              fill={themeColors.primary}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: isWeak ? 0.5 : 1.5, repeat: Infinity }}
            />
          </motion.svg>
        </div>

        {/* MASCOT SPEECH & REAL-TIME ADVICE */}
        <div className="flex-1 min-w-0 space-y-2 text-left">
          {/* Header Status Badge */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${themeColors.badgeBg}`}
            >
              {isWeak ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : isAverage ? (
                <Zap className="w-3.5 h-3.5" />
              ) : isStrong ? (
                <Shield className="w-3.5 h-3.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{themeColors.pill}</span>
            </span>

            {!isIdle && (
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200">
                Score: {strengthScore}%
              </span>
            )}
          </div>

          {/* Dynamic Mascot Cartoon Speech Bubble */}
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            {showPassword ? (
              <span className="text-amber-700 dark:text-amber-300 font-bold">
                🙈 Peek mode active! Make sure no one is looking over your shoulder!
              </span>
            ) : isIdle ? (
              <span>
                "Hey! I'm Vaulty, your security buddy. Start typing your password to test my defense!"
              </span>
            ) : isWeak ? (
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                "Yikes! That's too easy for a script to crack! Please add 8+ characters and numbers."
              </span>
            ) : isAverage ? (
              <span className="text-amber-700 dark:text-amber-300 font-bold">
                "Almost unbreakable! Mix in uppercase letters (A-Z) and symbols like @, #, $!"
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                "Boom! Fortress-grade protection! Your COOPNEX citizen profile is impenetrable!"
              </span>
            )}
          </div>

          {/* Animated Strength Gauge Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full transition-all duration-300"
              style={{
                backgroundColor: themeColors.primary,
                width: `${Math.max(isIdle ? 5 : strengthScore, 5)}%`
              }}
              animate={{
                opacity: [0.9, 1, 0.9]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* Interactive Checklist Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5 text-[10px]">
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                hasMin8
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <Check className={`w-3 h-3 ${hasMin8 ? "opacity-100 text-emerald-600" : "opacity-30"}`} />
              <span>8+ Chars</span>
            </div>

            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                hasNumber
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <Check className={`w-3 h-3 ${hasNumber ? "opacity-100 text-emerald-600" : "opacity-30"}`} />
              <span>Number (0-9)</span>
            </div>

            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                hasUpper
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <Check className={`w-3 h-3 ${hasUpper ? "opacity-100 text-emerald-600" : "opacity-30"}`} />
              <span>Uppercase (A-Z)</span>
            </div>

            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                hasSpecial
                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <Check className={`w-3 h-3 ${hasSpecial ? "opacity-100 text-emerald-600" : "opacity-30"}`} />
              <span>Symbol (!@#)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartoonPasswordMascot;
