import React from "react";
import { motion } from "framer-motion";

interface AnimeTradeIllustrationProps {
  trade: "electrician" | "plumber" | "carpenter" | "painter" | "cleaner" | "caregiver" | "technician";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AnimeTradeIllustration: React.FC<AnimeTradeIllustrationProps> = ({
  trade,
  size = "md",
  className = ""
}) => {
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32"
  };

  const sz = sizeMap[size];

  switch (trade) {
    case "electrician":
      return (
        <motion.div
          whileHover={{ rotateY: 18, rotateX: -12, scale: 1.15 }}
          style={{ transformStyle: "preserve-3d" }}
          className={`relative flex items-center justify-center select-none cursor-pointer perspective-800 ${sz} ${className}`}
        >
          {/* Animated Spark Particles in 3D */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              {/* Background Glow */}
              <circle cx="50" cy="50" r="42" fill="#FEF08A" fillOpacity="0.4" />
              <circle cx="50" cy="50" r="36" fill="#FDE047" fillOpacity="0.3" />

              {/* Anime Spark Eyes Face / Electric Mascot */}
              <circle cx="50" cy="50" r="32" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
              
              {/* Chibi Anime Eyes */}
              <ellipse cx="40" cy="46" rx="4.5" ry="6.5" fill="#0F172A" />
              <circle cx="38.5" cy="43.5" r="2" fill="#FFFFFF" />
              <circle cx="41.5" cy="48.5" r="1" fill="#FFFFFF" />

              <ellipse cx="60" cy="46" rx="4.5" ry="6.5" fill="#0F172A" />
              <circle cx="58.5" cy="43.5" r="2" fill="#FFFFFF" />
              <circle cx="61.5" cy="48.5" r="1" fill="#FFFFFF" />

              {/* Cheerful Anime Open Mouth */}
              <path d="M43 56 Q50 64 57 56 Z" fill="#EF4444" />
              <path d="M43 56 Q50 64 57 56" stroke="#0F172A" strokeWidth="1.5" fill="none" />

              {/* Blushing Anime Cheeks */}
              <ellipse cx="34" cy="52" rx="3.5" ry="2" fill="#FB7185" fillOpacity="0.6" />
              <ellipse cx="66" cy="52" rx="3.5" ry="2" fill="#FB7185" fillOpacity="0.6" />

              {/* Lightning Bolt Helmet */}
              <path d="M50 14 L38 28 L48 28 L40 40 L60 25 L49 25 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />

              {/* Lightning Sparks floating */}
              <path d="M18 30 L24 24 M15 45 L22 45 M82 30 L76 24 M85 45 L78 45" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>
      );

    case "plumber":
      return (
        <motion.div
          whileHover={{ rotateY: -18, rotateX: 12, scale: 1.15 }}
          style={{ transformStyle: "preserve-3d" }}
          className={`relative flex items-center justify-center select-none cursor-pointer perspective-800 ${sz} ${className}`}
        >
          <motion.div
            animate={{ y: [-2, 3, -2], rotate: [-4, 4, -4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              {/* Hydro Glow */}
              <circle cx="50" cy="50" r="42" fill="#BAE6FD" fillOpacity="0.4" />
              
              {/* Plumber Droplet Character */}
              <path
                d="M50 16 C50 16, 24 50, 24 64 C24 78, 36 88, 50 88 C64 88, 76 78, 76 64 C76 50, 50 16, 50 16 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="2.5"
              />

              {/* Highlight shine */}
              <path d="M34 56 C34 46, 42 34, 48 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

              {/* Chibi Eyes */}
              <ellipse cx="42" cy="62" rx="4" ry="5.5" fill="#0F172A" />
              <circle cx="41" cy="60" r="1.8" fill="#FFFFFF" />

              <ellipse cx="58" cy="62" rx="4" ry="5.5" fill="#0F172A" />
              <circle cx="57" cy="60" r="1.8" fill="#FFFFFF" />

              {/* Smile */}
              <path d="M46 72 Q50 76 54 72" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Rosy Cheeks */}
              <ellipse cx="36" cy="68" rx="3" ry="1.8" fill="#F472B6" fillOpacity="0.6" />
              <ellipse cx="64" cy="68" rx="3" ry="1.8" fill="#F472B6" fillOpacity="0.6" />

              {/* Tiny Plumber Wrench */}
              <rect x="64" y="44" width="6" height="22" rx="2" fill="#94A3B8" transform="rotate(25 64 44)" />
              <circle cx="74" cy="44" r="5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </motion.div>
      );

    case "carpenter":
      return (
        <motion.div
          whileHover={{ rotateY: 18, rotateX: 12, scale: 1.15 }}
          style={{ transformStyle: "preserve-3d" }}
          className={`relative flex items-center justify-center select-none cursor-pointer perspective-800 ${sz} ${className}`}
        >
          <motion.div
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              <circle cx="50" cy="50" r="42" fill="#FED7AA" fillOpacity="0.4" />
              {/* Wooden Block Chibi Mascot */}
              <rect x="26" y="26" width="48" height="48" rx="14" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
              
              {/* Wood Grain Lines */}
              <path d="M32 38 Q42 42 54 36 Q64 34 68 40" stroke="#EA580C" strokeWidth="2" fill="none" />
              <path d="M30 62 Q44 58 56 64 Q64 66 70 60" stroke="#EA580C" strokeWidth="2" fill="none" />

              {/* Chibi Eyes */}
              <circle cx="42" cy="48" r="4" fill="#0F172A" />
              <circle cx="41" cy="46" r="1.5" fill="#FFFFFF" />

              <circle cx="58" cy="48" r="4" fill="#0F172A" />
              <circle cx="57" cy="46" r="1.5" fill="#FFFFFF" />

              {/* Big Smile */}
              <path d="M45 56 Q50 62 55 56" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Carpenter Pencil behind ear */}
              <rect x="66" y="24" width="5" height="24" rx="2" fill="#EAB308" transform="rotate(30 66 24)" />
              <path d="M80 43 L84 48 L78 47 Z" fill="#0F172A" />
            </svg>
          </motion.div>
        </motion.div>
      );

    case "caregiver":
      return (
        <motion.div
          whileHover={{ rotateY: -18, rotateX: -12, scale: 1.15 }}
          style={{ transformStyle: "preserve-3d" }}
          className={`relative flex items-center justify-center select-none cursor-pointer perspective-800 ${sz} ${className}`}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              <circle cx="50" cy="50" r="42" fill="#FBCFE8" fillOpacity="0.4" />
              {/* Heart Shape Chibi Mascot */}
              <path
                d="M50 82 C50 82, 18 62, 18 42 C18 28, 30 20, 42 24 C46 25.5, 49 28, 50 31 C51 28, 54 25.5, 58 24 C70 20, 82 28, 82 42 C82 62, 50 82, 50 82 Z"
                fill="#EC4899"
                stroke="#BE185D"
                strokeWidth="2.5"
              />

              {/* Cheerful Anime Eyes */}
              <ellipse cx="40" cy="44" rx="3.5" ry="5" fill="#0F172A" />
              <circle cx="39" cy="42" r="1.5" fill="#FFFFFF" />

              <ellipse cx="60" cy="44" rx="3.5" ry="5" fill="#0F172A" />
              <circle cx="59" cy="42" r="1.5" fill="#FFFFFF" />

              {/* Sweet Smile */}
              <path d="M45 52 Q50 58 55 52" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="34" cy="50" r="2.5" fill="#FDA4AF" />
              <circle cx="66" cy="50" r="2.5" fill="#FDA4AF" />

              {/* Nurse / Stethoscope Badge */}
              <circle cx="50" cy="66" r="4.5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </motion.div>
      );

    default: // technician
      return (
        <motion.div
          whileHover={{ rotateY: 18, rotateX: 12, scale: 1.15 }}
          style={{ transformStyle: "preserve-3d" }}
          className={`relative flex items-center justify-center select-none cursor-pointer perspective-800 ${sz} ${className}`}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
              <circle cx="50" cy="50" r="42" fill="#E2E8F0" fillOpacity="0.4" />
              {/* High-tech Gear / Cog Mascot */}
              <circle cx="50" cy="50" r="32" fill="#6366F1" stroke="#4338CA" strokeWidth="2.5" />
              <rect x="46" y="10" width="8" height="12" rx="2" fill="#4338CA" />
              <rect x="46" y="78" width="8" height="12" rx="2" fill="#4338CA" />
              <rect x="10" y="46" width="12" height="8" rx="2" fill="#4338CA" />
              <rect x="78" y="46" width="12" height="8" rx="2" fill="#4338CA" />

              {/* Chibi Robot / Tech Eyes */}
              <circle cx="42" cy="48" r="4" fill="#67E8F9" />
              <circle cx="58" cy="48" r="4" fill="#67E8F9" />
              <rect x="44" y="58" width="12" height="3" rx="1.5" fill="#67E8F9" />
            </svg>
          </motion.div>
        </motion.div>
      );
  }
};

