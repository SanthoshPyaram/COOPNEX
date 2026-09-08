import React from "react";
import { motion } from "framer-motion";

export interface CoopnexLoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

/**
 * COOPNEX Official Loading Screen
 *
 * Motion Concept (600ms):
 * 1. Two human/connection elements gently converge toward the center.
 * 2. They interlock with the central warm gold nexus spark.
 * 3. The COOPNEX brand wordmark and tagline smoothly fade in.
 */
export const CoopnexLoadingScreen: React.FC<CoopnexLoadingScreenProps> = ({
  message = "Connecting people, skills and opportunities...",
  fullScreen = true
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen
          ? "fixed inset-0 z-50 bg-[#F8FAFC]/95 dark:bg-[#0B1220]/95 backdrop-blur-md"
          : "w-full py-12"
      } select-none`}
      role="status"
      aria-label="Loading COOPNEX"
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Connecting Symbol */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="loadBlue" x1="12" y1="10" x2="28" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#0A66C2" />
              </linearGradient>
              <linearGradient id="loadGreen" x1="36" y1="10" x2="52" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Left Converging Figure (Blue) */}
            <motion.g
              initial={{ x: -14, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <circle cx="21" cy="17" r="5.5" fill="url(#loadBlue)" />
              <path
                d="M 12,46 C 10,34 16,27 25,27 C 32,27 34,31 40,36 C 45,40 50,38 52,34"
                stroke="url(#loadBlue)"
                strokeWidth="5.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>

            {/* Right Converging Figure (Green) */}
            <motion.g
              initial={{ x: 14, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <circle cx="43" cy="17" r="5.5" fill="url(#loadGreen)" />
              <path
                d="M 52,46 C 54,34 48,27 39,27 C 32,27 30,31 24,36 C 19,40 14,38 12,34"
                stroke="url(#loadGreen)"
                strokeWidth="5.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>

            {/* Central Nexus Spark Ignition (Gold) */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3, ease: "backOut" }}
              style={{ transformOrigin: "32px 31.5px" }}
            >
              <circle cx="32" cy="31.5" r="3.6" fill="#F59E0B" />
              <circle cx="32" cy="31.5" r="1.5" fill="#FFFFFF" />
            </motion.g>
          </svg>
        </div>

        {/* Wordmark Fade-in */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="mt-4 flex flex-col items-center text-center"
        >
          <div className="font-display font-black text-2xl tracking-tight flex items-center">
            <span className="text-[#0A66C2] dark:text-blue-400">COOP</span>
            <span className="text-[#059669] dark:text-emerald-400">NEX</span>
          </div>

          <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mt-1">
            People • Skills • Cooperatives • Connected
          </p>

          {message && (
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-3 animate-pulse">
              {message}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CoopnexLoadingScreen;
