import React from "react";
import { motion } from "framer-motion";

interface ConnectionPulseProps {
  variant?: "blue" | "cyan" | "emerald" | "amber";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  active?: boolean;
}

export const ConnectionPulse: React.FC<ConnectionPulseProps> = ({
  variant = "blue",
  size = "md",
  className = "",
  label,
  active = true
}) => {
  const colorMap = {
    blue: {
      dot: "bg-blue-600 dark:bg-blue-400",
      ring: "border-blue-500/60 bg-blue-500/20",
      glow: "shadow-blue-500/50",
      text: "text-blue-700 dark:text-blue-300"
    },
    cyan: {
      dot: "bg-cyan-500 dark:bg-cyan-400",
      ring: "border-cyan-500/60 bg-cyan-500/20",
      glow: "shadow-cyan-500/50",
      text: "text-cyan-700 dark:text-cyan-300"
    },
    emerald: {
      dot: "bg-emerald-500 dark:bg-emerald-400",
      ring: "border-emerald-500/60 bg-emerald-500/20",
      glow: "shadow-emerald-500/50",
      text: "text-emerald-700 dark:text-emerald-300"
    },
    amber: {
      dot: "bg-amber-500 dark:bg-amber-400",
      ring: "border-amber-500/60 bg-amber-500/20",
      glow: "shadow-amber-500/50",
      text: "text-amber-700 dark:text-amber-300"
    }
  };

  const sizeMap = {
    sm: { dot: "w-2 h-2", ring: "w-4 h-4", text: "text-[10px]" },
    md: { dot: "w-2.5 h-2.5", ring: "w-6 h-6", text: "text-xs" },
    lg: { dot: "w-3.5 h-3.5", ring: "w-8 h-8", text: "text-sm" }
  };

  const colors = colorMap[variant];
  const sizes = sizeMap[size];

  if (!active) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className={`${sizes.dot} rounded-full bg-slate-300 dark:bg-slate-700`} />
        {label && <span className={`${sizes.text} text-slate-400 font-medium`}>{label}</span>}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Luminous Expanding Shockwave Ring */}
        <motion.span
          animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute ${sizes.ring} rounded-full border ${colors.ring}`}
        />
        {/* Secondary subtle halo */}
        <span
          className={`absolute ${sizes.ring} rounded-full animate-ping opacity-35 ${colors.dot}`}
        />
        {/* Core Vibrant Light Node */}
        <span
          className={`relative ${sizes.dot} rounded-full ${colors.dot} shadow-md ${colors.glow}`}
        />
      </div>
      {label && (
        <span className={`${sizes.text} font-bold tracking-wide ${colors.text}`}>
          {label}
        </span>
      )}
    </div>
  );
};

