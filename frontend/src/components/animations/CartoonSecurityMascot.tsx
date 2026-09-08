import React from "react";
import { motion } from "framer-motion";

interface SecurityMascotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CartoonSecurityMascot: React.FC<SecurityMascotProps> = ({
  className = "",
  size = "md"
}) => {
  const dimensions = {
    sm: "w-32 h-32",
    md: "w-44 h-44 sm:w-56 sm:h-56",
    lg: "w-64 h-64 sm:w-72 sm:h-72"
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${dimensions} ${className}`}>
      {/* Background radial glow */}
      <motion.div
        animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 bg-gradient-to-tr from-[#2563EB]/25 via-blue-50 to-[#FF6B00]/20 rounded-full blur-2xl -z-10"
      />

      {/* Floating Golden Key Badge */}
      <motion.div
        animate={{ y: [-4, 6, -4], rotate: [-8, 8, -8] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2 -right-2 z-20 bg-white p-2 rounded-2xl shadow-xl border border-[#FF6B00] flex items-center gap-1.5 text-xs font-black text-slate-800"
      >
        <span className="text-base">🔑</span>
        <span className="text-[#2563EB]">256-bit Secure</span>
      </motion.div>

      {/* Floating Verified Badge */}
      <motion.div
        animate={{ y: [5, -5, 5], rotate: [6, -6, 6] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute -bottom-2 -left-2 z-20 bg-emerald-50 p-2 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-1.5 text-xs font-black text-emerald-700"
      >
        <span>✓</span>
        <span>Aadhaar Linked</span>
      </motion.div>

      {/* Shield Character SVG */}
      <motion.svg
        viewBox="0 0 180 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Ground shadow */}
        <ellipse cx="90" cy="188" rx="44" ry="7" fill="#1E40AF" fillOpacity="0.18" />

        {/* Shield Body in Electric Royal Sapphire */}
        <path
          d="M90 20 L145 42 C145 105, 125 155, 90 178 C55 155, 35 105, 35 42 Z"
          fill="#2563EB"
          stroke="#1D4ED8"
          strokeWidth="3"
        />

        {/* Inner Shield Layer in Soft Blue */}
        <path
          d="M90 32 L133 50 C133 100, 117 142, 90 162 C63 142, 47 100, 47 50 Z"
          fill="#DBEAFE"
        />

        {/* Warm White Core */}
        <path
          d="M90 44 L123 58 C123 96, 110 130, 90 148 C70 130, 57 96, 57 58 Z"
          fill="#FFFFFF"
        />

        {/* Sunset Tangerine Cooperative Emblem on Forehead */}
        <circle cx="90" cy="62" r="10" fill="#FF6B00" stroke="#EA580C" strokeWidth="1.5" />
        <path d="M85 62 L88 66 L95 58" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Expressive Cartoon Face */}
        {/* Blinking Eyes */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
        >
          <circle cx="76" cy="94" r="5" fill="#0F172A" />
          <circle cx="74.5" cy="92" r="1.8" fill="#FFFFFF" />

          <circle cx="104" cy="94" r="5" fill="#0F172A" />
          <circle cx="102.5" cy="92" r="1.8" fill="#FFFFFF" />
        </motion.g>

        {/* Eyebrows */}
        <path d="M70 86 C74 83, 80 83, 84 86" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M96 86 C100 83, 106 83, 110 86" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

        {/* Cheerful Smile */}
        <path d="M80 106 C85 114, 95 114, 100 106" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

        {/* Cute Blushing Cheeks */}
        <ellipse cx="68" cy="102" rx="4.5" ry="3" fill="#F472B6" fillOpacity="0.4" />
        <ellipse cx="112" cy="102" rx="4.5" ry="3" fill="#F472B6" fillOpacity="0.4" />

        {/* Padlock on Belly */}
        <g transform="translate(77, 122)">
          {/* Shackle */}
          <path d="M8 8 L8 4 C8 0, 18 0, 18 4 L18 8" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Body */}
          <rect x="3" y="8" width="20" height="14" rx="4" fill="#FF6B00" stroke="#EA580C" strokeWidth="1" />
          {/* Keyhole */}
          <circle cx="13" cy="13" r="2" fill="#FFFFFF" />
          <path d="M13 14 L13 18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </motion.svg>
    </div>
  );
};

