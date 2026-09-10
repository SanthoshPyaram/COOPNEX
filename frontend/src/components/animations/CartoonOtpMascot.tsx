import React from "react";
import { motion } from "framer-motion";

interface OtpMascotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CartoonOtpMascot: React.FC<OtpMascotProps> = ({
  className = "",
  size = "md"
}) => {
  const dimensions = {
    sm: "w-32 h-32",
    md: "w-44 h-44 sm:w-52 sm:h-52",
    lg: "w-60 h-60 sm:w-72 sm:h-72"
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${dimensions} ${className}`}>
      {/* Glowing Pulsing Signal Waves behind phone */}
      <motion.div
        animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        className="absolute w-36 h-36 rounded-full border-2 border-[#2563EB]/40 -z-10"
      />
      <motion.div
        animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        className="absolute w-44 h-44 rounded-full border-2 border-[#FF6B00]/40 -z-10"
      />

      {/* Floating SMS Envelope flying toward phone */}
      <motion.div
        animate={{
          y: [-8, 6, -8],
          x: [-6, 6, -6],
          rotate: [-6, 6, -6]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 -right-2 z-20 bg-white p-2.5 rounded-2xl shadow-xl border border-[#FF6B00] flex items-center gap-1.5"
      >
        <span className="text-xl">📩</span>
        <div className="text-[10px] font-mono font-black text-[#2563EB]">
          OTP: ••••••
        </div>
      </motion.div>

      {/* Phone Character SVG */}
      <motion.svg
        viewBox="0 0 160 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
        animate={{ y: [0, -5, 0], rotate: [0, -1.5, 1.5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Soft shadow */}
        <ellipse cx="80" cy="188" rx="42" ry="7" fill="#2563EB" fillOpacity="0.18" />

        {/* Outer Phone Body in Electric Sapphire */}
        <rect x="35" y="20" width="90" height="155" rx="20" fill="#2563EB" stroke="#1D4ED8" strokeWidth="3" />

        {/* Inner Screen in Soft White */}
        <rect x="42" y="32" width="76" height="130" rx="14" fill="#FFFFFF" />

        {/* Top Speaker Grill & Camera */}
        <rect x="68" y="26" width="24" height="3" rx="1.5" fill="#DBEAFE" />
        <circle cx="98" cy="27.5" r="2" fill="#DBEAFE" />

        {/* Screen Antenna Signal Waves */}
        <path d="M50 44 L50 48 M54 42 L54 48 M58 40 L58 48 M62 38 L62 48" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
        {/* Battery Icon */}
        <rect x="94" y="40" width="14" height="7" rx="1.5" stroke="#2563EB" strokeWidth="1" fill="none" />
        <rect x="96" y="42" width="8" height="3" rx="0.5" fill="#10B981" />
        <rect x="108" y="42" width="1.5" height="3" fill="#2563EB" />

        {/* Happy Cartoon Face on Phone Screen */}
        {/* Blinking Eyes */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
        >
          <circle cx="66" cy="80" r="4.5" fill="#0F172A" />
          <circle cx="65" cy="78" r="1.5" fill="#FFFFFF" />

          <circle cx="94" cy="80" r="4.5" fill="#0F172A" />
          <circle cx="93" cy="78" r="1.5" fill="#FFFFFF" />
        </motion.g>

        {/* Cheerful Smile */}
        <path d="M72 90 C76 96, 84 96, 88 90" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

        {/* Rosy Cheeks */}
        <ellipse cx="58" cy="86" rx="4" ry="2.5" fill="#F472B6" fillOpacity="0.4" />
        <ellipse cx="102" cy="86" rx="4" ry="2.5" fill="#F472B6" fillOpacity="0.4" />

        {/* Glowing 6 OTP Digit Dots on Screen */}
        <rect x="50" y="108" width="60" height="24" rx="8" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="58" cy="120" r="3" fill="#2563EB" />
        <circle cx="66" cy="120" r="3" fill="#2563EB" />
        <circle cx="74" cy="120" r="3" fill="#2563EB" />
        <circle cx="84" cy="120" r="3" fill="#FF6B00" />
        <circle cx="92" cy="120" r="3" fill="#FF6B00" />
        <circle cx="100" cy="120" r="3" fill="#10B981" />

        {/* Cute Cartoon Hands holding phone sides */}
        <ellipse cx="32" cy="105" rx="6" ry="10" fill="#FDBA74" />
        <ellipse cx="128" cy="105" rx="6" ry="10" fill="#FDBA74" />

        {/* Floating Sparkle Stars */}
        <motion.g
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "78px 150px" }}
        >
          <path
            d="M78 142 L80 148 L86 150 L80 152 L78 158 L76 152 L70 150 L76 148 Z"
            fill="#FF6B00"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};

