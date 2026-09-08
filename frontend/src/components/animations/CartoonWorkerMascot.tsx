import React from "react";
import { motion } from "framer-motion";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  mood?: "happy" | "waving" | "working";
  gender?: "man" | "woman" | "duo";
  showBadges?: boolean;
  className?: string;
}

export const CartoonWorkerMascot: React.FC<MascotProps> = ({
  size = "md",
  mood = "waving",
  gender = "duo",
  showBadges = true,
  className = ""
}) => {
  const dimensions = gender === "duo" ? {
    sm: "w-44 h-28 sm:w-52 sm:h-32",
    md: "w-64 h-44 sm:w-72 sm:h-52",
    lg: "w-80 h-60 sm:w-96 sm:h-72"
  }[size] : {
    sm: "w-28 h-28 sm:w-32 sm:h-32",
    md: "w-44 h-44 sm:w-52 sm:h-52",
    lg: "w-60 h-60 sm:w-72 sm:h-72"
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${dimensions} ${className}`}>
      {/* Floating Sparkles & Tool Badges - only on md & lg or when explicitly enabled */}
      {showBadges && size !== "sm" && (
        <>
          <motion.div
            animate={{ y: [-3, 4, -3], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1 -left-2 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-md border border-blue-200 dark:border-slate-700 flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-100"
          >
            <span>{gender === "woman" ? "👩‍🔧" : gender === "duo" ? "👥" : "⚡"}</span>
            <span className="text-blue-600 dark:text-blue-400">
              {gender === "woman" ? "Verified Woman Pro" : gender === "duo" ? "Verified Male & Female Duo" : "Certified Pro"}
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [3, -4, 3], rotate: [0, -5, 4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-1 -right-2 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-md border border-emerald-200 dark:border-slate-700 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"
          >
            <span>🛡️</span>
            <span>100% Floor Wage Guaranteed</span>
          </motion.div>
        </>
      )}

      {/* Pulsing Soft Halo Background */}
      <motion.div
        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-2 bg-gradient-to-tr from-blue-500/20 via-indigo-200/40 to-amber-400/20 rounded-full blur-xl -z-10"
      />

      {gender === "duo" ? (
        <motion.svg
          viewBox="0 0 320 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Dual floor shadows */}
          <ellipse cx="90" cy="188" rx="42" ry="7" fill="#1E293B" fillOpacity="0.14" />
          <ellipse cx="230" cy="188" rx="42" ry="7" fill="#1E293B" fillOpacity="0.14" />

          {/* MALE ARTISAN (RAMESH) - LEFT */}
          <g transform="translate(0, 0)">
            {/* Torso */}
            <path d="M50 140 C50 115, 130 115, 130 140 L135 180 L45 180 Z" fill="#2563EB" />
            <path d="M68 128 L90 148 L112 128 L90 120 Z" fill="#FFFFFF" />
            {/* Straps */}
            <path d="M64 126 L68 180 L78 180 L74 126 Z" fill="#1D4ED8" />
            <path d="M116 126 L112 180 L102 180 L106 126 Z" fill="#1D4ED8" />
            <circle cx="71" cy="142" r="3.5" fill="#F59E0B" />
            <circle cx="109" cy="142" r="3.5" fill="#F59E0B" />
            {/* Badge */}
            <rect x="78" y="152" width="24" height="16" rx="4" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M86 156 L94 156 M84 162 L96 162" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
            {/* Left Arm resting */}
            <path d="M52 132 C36 142, 32 165, 42 176" stroke="#1D4ED8" strokeWidth="13" strokeLinecap="round" />
            <circle cx="43" cy="177" r="7" fill="#F8B179" />
            {/* Head & Neck */}
            <circle cx="90" cy="88" r="34" fill="#F8B179" />
            <circle cx="56" cy="88" r="6.5" fill="#F8B179" />
            <circle cx="124" cy="88" r="6.5" fill="#F8B179" />
            {/* Hair */}
            <path d="M58 80 C58 55, 122 55, 122 80 C115 70, 105 68, 90 68 C75 68, 65 70, 58 80 Z" fill="#2D2118" />
            {/* Blinking eyes */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
            >
              <ellipse cx="78" cy="86" rx="4" ry="5.5" fill="#101828" />
              <circle cx="76.5" cy="84" r="1.6" fill="#FFFDF7" />
              <ellipse cx="102" cy="86" rx="4" ry="5.5" fill="#101828" />
              <circle cx="100.5" cy="84" r="1.6" fill="#FFFDF7" />
            </motion.g>
            <path d="M72 76 C75 73, 83 73, 85 76" stroke="#2D2118" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M95 76 C97 73, 105 73, 108 76" stroke="#2D2118" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="68" cy="94" rx="4.5" ry="3" fill="#F472B6" fillOpacity="0.35" />
            <ellipse cx="112" cy="94" rx="4.5" ry="3" fill="#F472B6" fillOpacity="0.35" />
            <path d="M79 97 C83 105, 97 105, 101 97" stroke="#101828" strokeWidth="2.8" strokeLinecap="round" fill="#DC2626" />
            <path d="M82 98 C86 100, 94 100, 98 98" fill="#FFFDF7" />
            {/* Hard Hat */}
            <path d="M50 70 C50 38, 130 38, 130 70 L136 72 C136 75, 44 75, 44 72 Z" fill="#F59E0B" />
            <path d="M84 40 C84 36, 96 36, 96 40 L97 70 L83 70 Z" fill="#D97706" />
            <circle cx="90" cy="56" r="5.5" fill="#2563EB" />
            <circle cx="90" cy="56" r="2.5" fill="#FFFFFF" />
            {/* Right Arm waving with wrench */}
            <motion.g
              animate={{ rotate: [0, 14, -6, 14, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "125px 135px" }}
            >
              <path d="M125 135 C138 120, 148 100, 144 82" stroke="#1D4ED8" strokeWidth="13" strokeLinecap="round" />
              <circle cx="144" cy="80" r="7" fill="#F8B179" />
              <g transform="translate(138, 62) rotate(-25)">
                <path d="M0 22 L0 7 C-3 6, -5 3, -3 -2 C-1 -5, 4 -5, 6 -2 C8 3, 6 6, 3 7 L3 22 Z" fill="#94A3B8" stroke="#64748B" strokeWidth="1.2" />
              </g>
            </motion.g>
          </g>

          {/* FEMALE COOPERATIVE LEADER (SUJATHA) - RIGHT */}
          <g transform="translate(140, 0)">
            {/* Hair bun */}
            <circle cx="128" cy="74" r="14" fill="#2D2118" />
            {/* Torso / Purple-Indigo Uniform */}
            <path d="M50 140 C50 115, 130 115, 130 140 L135 180 L45 180 Z" fill="#4F46E5" />
            <path d="M68 128 L90 148 L112 128 L90 120 Z" fill="#FFFFFF" />
            {/* Straps */}
            <path d="M64 126 L68 180 L78 180 L74 126 Z" fill="#4338CA" />
            <path d="M116 126 L112 180 L102 180 L106 126 Z" fill="#4338CA" />
            <circle cx="71" cy="142" r="3.5" fill="#F59E0B" />
            <circle cx="109" cy="142" r="3.5" fill="#F59E0B" />
            {/* Badge */}
            <rect x="78" y="152" width="24" height="16" rx="4" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
            <circle cx="85" cy="160" r="4" fill="#10B981" />
            <line x1="91" y1="160" x2="98" y2="160" stroke="#0F172A" strokeWidth="1.5" />
            {/* Left Arm holding federation tablet */}
            <path d="M52 132 C36 142, 30 162, 38 174" stroke="#4338CA" strokeWidth="13" strokeLinecap="round" />
            <circle cx="39" cy="175" r="7" fill="#FBC69D" />
            <rect x="22" y="154" width="20" height="26" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
            <rect x="25" y="157" width="14" height="18" fill="#1E293B" />
            <circle cx="32" cy="177" r="1.5" fill="#38BDF8" />
            {/* Head & Face */}
            <circle cx="90" cy="88" r="34" fill="#FBC69D" />
            <circle cx="56" cy="88" r="6.5" fill="#FBC69D" />
            <circle cx="124" cy="88" r="6.5" fill="#FBC69D" />
            {/* Earrings */}
            <circle cx="55" cy="94" r="2.5" fill="#E7A93B" />
            <circle cx="125" cy="94" r="2.5" fill="#E7A93B" />
            {/* Hair */}
            <path d="M56 82 C56 52, 124 52, 124 82 C115 68, 105 66, 90 66 C75 66, 65 68, 56 82 Z" fill="#2D2118" />
            <path d="M56 82 C54 96, 58 108, 60 114" stroke="#2D2118" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M124 82 C126 96, 122 108, 120 114" stroke="#2D2118" strokeWidth="3.5" strokeLinecap="round" />
            {/* Blinking eyes with eyelashes */}
            <motion.g
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
            >
              <ellipse cx="78" cy="86" rx="4" ry="5.5" fill="#101828" />
              <circle cx="76.5" cy="84" r="1.6" fill="#FFFDF7" />
              <ellipse cx="102" cy="86" rx="4" ry="5.5" fill="#101828" />
              <circle cx="100.5" cy="84" r="1.6" fill="#FFFDF7" />
              <path d="M74 82 L71 79" stroke="#101828" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M106 82 L109 79" stroke="#101828" strokeWidth="1.6" strokeLinecap="round" />
            </motion.g>
            <path d="M72 76 C75 73, 83 73, 85 76" stroke="#2D2118" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M95 76 C97 73, 105 73, 108 76" stroke="#2D2118" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="68" cy="94" rx="4.5" ry="3" fill="#F472B6" fillOpacity="0.55" />
            <ellipse cx="112" cy="94" rx="4.5" ry="3" fill="#F472B6" fillOpacity="0.55" />
            {/* Red Bindi */}
            <circle cx="90" cy="79" r="2.2" fill="#DC2626" />
            <path d="M79 97 C83 105, 97 105, 101 97" stroke="#101828" strokeWidth="2.8" strokeLinecap="round" fill="#F43F5E" />
            <path d="M82 98 C86 100, 94 100, 98 98" fill="#FFFDF7" />
            {/* Hard Hat */}
            <path d="M50 70 C50 38, 130 38, 130 70 L136 72 C136 75, 44 75, 44 72 Z" fill="#10B981" />
            <path d="M84 40 C84 36, 96 36, 96 40 L97 70 L83 70 Z" fill="#047857" />
            <circle cx="90" cy="56" r="5.5" fill="#FFFFFF" />
            <circle cx="90" cy="56" r="2.5" fill="#10B981" />
            {/* Right Arm welcoming */}
            <motion.g
              animate={{ rotate: [0, -10, 5, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "125px 135px" }}
            >
              <path d="M125 135 C138 122, 145 105, 142 90" stroke="#4338CA" strokeWidth="13" strokeLinecap="round" />
              <circle cx="142" cy="88" r="7" fill="#FBC69D" />
            </motion.g>
          </g>
        </motion.svg>
      ) : (
        /* Main Animated Cartoon SVG Character */
        <motion.svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Shadow under character */}
          <ellipse cx="100" cy="188" rx="46" ry="7" fill="#1E293B" fillOpacity="0.12" />

          {/* Hair Bun for Woman Worker */}
          {gender === "woman" && (
            <circle cx="138" cy="74" r="14" fill="#2D2118" />
          )}

          {/* Worker Torso / Overalls in Electric Blue */}
          <motion.path
            d="M60 140 C60 115, 140 115, 140 140 L145 180 L55 180 Z"
            fill={gender === "woman" ? "#4F46E5" : "#2563EB"}
          />

          {/* Inner Shirt in White */}
          <path d="M78 128 L100 148 L122 128 L100 120 Z" fill="#FFFFFF" />

          {/* Overalls Straps with Brass Buttons */}
          <path d="M74 126 L78 180 L88 180 L84 126 Z" fill={gender === "woman" ? "#4338CA" : "#1D4ED8"} />
          <path d="M126 126 L122 180 L112 180 L116 126 Z" fill={gender === "woman" ? "#4338CA" : "#1D4ED8"} />
          <circle cx="81" cy="142" r="3.5" fill="#F59E0B" />
          <circle cx="119" cy="142" r="3.5" fill="#F59E0B" />

          {/* Front Cooperative Chest Badge */}
          <rect x="88" y="152" width="24" height="16" rx="4" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
          <path d="M96 156 L104 156 M94 162 L106 162" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />

          {/* Left Arm resting friendly */}
          <motion.path
            d="M62 132 C46 142, 42 165, 52 176"
            stroke={gender === "woman" ? "#4338CA" : "#1D4ED8"}
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Left Hand */}
          <circle cx="53" cy="177" r="8" fill={gender === "woman" ? "#FBC69D" : "#F8B179"} />

          {/* Head / Face */}
          <circle cx="100" cy="88" r="36" fill={gender === "woman" ? "#FBC69D" : "#F8B179"} />

          {/* Ears */}
          <circle cx="64" cy="88" r="7" fill={gender === "woman" ? "#FBC69D" : "#F8B179"} />
          <circle cx="136" cy="88" r="7" fill={gender === "woman" ? "#FBC69D" : "#F8B179"} />

          {/* Earrings for woman */}
          {gender === "woman" && (
            <>
              <circle cx="63" cy="94" r="2.5" fill="#E7A93B" />
              <circle cx="137" cy="94" r="2.5" fill="#E7A93B" />
            </>
          )}

          {/* Hair Base */}
          {gender === "man" ? (
            <path d="M68 80 C68 55, 132 55, 132 80 C125 70, 115 68, 100 68 C85 68, 75 70, 68 80 Z" fill="#2D2118" />
          ) : (
            <>
              <path d="M66 82 C66 52, 134 52, 134 82 C125 68, 115 66, 100 66 C85 66, 75 68, 66 82 Z" fill="#2D2118" />
              {/* Side-hair strands */}
              <path d="M66 82 C64 96, 68 108, 70 114" stroke="#2D2118" strokeWidth="4" strokeLinecap="round" />
              <path d="M134 82 C136 96, 132 108, 130 114" stroke="#2D2118" strokeWidth="4" strokeLinecap="round" />
            </>
          )}

          {/* Friendly Cartoon Eyes with Blinking Animation */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
          >
            {/* Eye Left */}
            <ellipse cx="88" cy="86" rx="4.5" ry="6" fill="#101828" />
            <circle cx="86.5" cy="84" r="1.8" fill="#FFFDF7" />

            {/* Eye Right */}
            <ellipse cx="112" cy="86" rx="4.5" ry="6" fill="#101828" />
            <circle cx="110.5" cy="84" r="1.8" fill="#FFFDF7" />

            {/* Eyelashes for Woman Worker */}
            {gender === "woman" && (
              <>
                <path d="M83 82 L80 79" stroke="#101828" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M86 80 L85 76" stroke="#101828" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M117 82 L120 79" stroke="#101828" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M114 80 L115 76" stroke="#101828" strokeWidth="1.8" strokeLinecap="round" />
              </>
            )}
          </motion.g>

          {/* Cheerful Eyebrows */}
          <path d="M82 76 C85 73, 93 73, 95 76" stroke="#2D2118" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M105 76 C107 73, 115 73, 118 76" stroke="#2D2118" strokeWidth="2.5" strokeLinecap="round" />

          {/* Cute Blushing Cheeks */}
          <ellipse cx="78" cy="94" rx="5" ry="3" fill="#F472B6" fillOpacity={gender === "woman" ? "0.55" : "0.35"} />
          <ellipse cx="122" cy="94" rx="5" ry="3" fill="#F472B6" fillOpacity={gender === "woman" ? "0.55" : "0.35"} />

          {/* Nose */}
          <path d="M99 88 C99 92, 101 92, 102 91" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />

          {/* Broad Happy Smile */}
          <path d="M89 97 C93 105, 107 105, 111 97" stroke="#101828" strokeWidth="3" strokeLinecap="round" fill={gender === "woman" ? "#F43F5E" : "#DC2626"} />
          {/* Teeth highlight */}
          <path d="M92 98 C96 100, 104 100, 108 98" fill="#FFFDF7" />

          {/* Safety Helmet / Hard Hat */}
          <path
            d="M60 70 C60 38, 140 38, 140 70 L146 72 C146 75, 54 75, 54 72 Z"
            fill={gender === "woman" ? "#F59E0B" : "#F59E0B"}
          />
          {/* Helmet Ridge */}
          <path d="M94 40 C94 36, 106 36, 106 40 L107 70 L93 70 Z" fill="#D97706" />
          {/* Emblem on Helmet */}
          <circle cx="100" cy="56" r="6" fill="#2563EB" />
          <circle cx="100" cy="56" r="3" fill="#FFFFFF" />

          {/* Right Animated Waving Arm holding Tool */}
          <motion.g
            animate={{ rotate: [0, 15, -8, 15, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "135px 135px" }}
          >
            {/* Arm */}
            <path
              d="M135 135 C150 120, 160 100, 156 82"
              stroke={gender === "woman" ? "#4338CA" : "#1D4ED8"}
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle cx="156" cy="80" r="8" fill={gender === "woman" ? "#FBC69D" : "#F8B179"} />

            {/* Shiny Chrome Wrench */}
            <g transform="translate(150, 60) rotate(-25)">
              <path
                d="M0 25 L0 8 C-4 7, -6 3, -4 -2 C-1 -6, 4 -6, 7 -2 C9 3, 7 7, 3 8 L3 25 Z"
                fill="#94A3B8"
                stroke="#64748B"
                strokeWidth="1.5"
              />
              <circle cx="1.5" cy="0" r="2.5" fill="#E2E8F0" />
              {/* Sparkle on wrench */}
              <motion.path
                d="M-2 -8 L1 -4 L-2 0 L-5 -4 Z"
                fill="#E7A93B"
                animate={{ scale: [0, 1.2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
              />
            </g>
          </motion.g>
        </motion.svg>
      )}
    </div>
  );
};

