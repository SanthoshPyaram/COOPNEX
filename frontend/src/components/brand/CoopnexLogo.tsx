import React from "react";

export interface CoopnexLogoProps {
  /**
   * Layout variant:
   * - "full": Symbol + COOPNEX Wordmark (default)
   * - "symbol": Standalone icon for small screens, favicon, avatars
   * - "stacked": Symbol centered above wordmark
   */
  variant?: "full" | "symbol" | "stacked";
  /**
   * Size presets:
   * - "sm": icon 24px, font text-base
   * - "md": icon 34px, font text-xl (default)
   * - "lg": icon 46px, font text-2xl
   * - "xl": icon 64px, font text-3xl
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Whether to display the primary brand tagline under the wordmark
   */
  showTagline?: boolean;
  /**
   * Optional custom classes for container
   */
  className?: string;
  /**
   * Theme mode override ("auto" adapts to dark: classes)
   */
  theme?: "light" | "dark" | "auto";
}

/**
 * COOPNEX Official Geometric Logo Component
 *
 * Symbol Architecture:
 * - Left Human Form: Deep Blue (#0A66C2) representing Workers, Technology & Reliability
 * - Right Human Form: Cooperative Green (#059669) representing Customers, Community & Growth
 * - Continuous Nexus Arc: Seamless interlocking geometric loop forming an abstract "C" and infinity link
 * - Central Nexus Spark: Warm Gold (#F59E0B) representing Opportunity & Connection
 */
export const CoopnexLogo: React.FC<CoopnexLogoProps> = ({
  variant = "full",
  size = "md",
  showTagline = false,
  className = "",
  theme = "auto"
}) => {
  // Size mapping
  const iconDimensions = {
    sm: { w: 24, h: 24, stroke: 4.8 },
    md: { w: 34, h: 34, stroke: 5.2 },
    lg: { w: 46, h: 46, stroke: 5.6 },
    xl: { w: 64, h: 64, stroke: 6.0 }
  }[size];

  const textSizeClasses = {
    sm: "text-base tracking-tight",
    md: "text-xl tracking-tight",
    lg: "text-2xl tracking-tight",
    xl: "text-3xl tracking-tight"
  }[size];

  const taglineSizeClasses = {
    sm: "text-[8px] tracking-wider",
    md: "text-[9.5px] tracking-wider",
    lg: "text-[11px] tracking-wider",
    xl: "text-[12px] tracking-wider"
  }[size];

  const isDark = theme === "dark";

  // Standalone Symbol SVG
  const symbolElement = (
    <div
      className="relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
      style={{ width: iconDimensions.w, height: iconDimensions.h }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="coopnexBlueGrad" x1="12" y1="10" x2="28" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="60%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="coopnexVioletGrad" x1="36" y1="10" x2="52" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="60%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="nexusLoopGrad" x1="14" y1="28" x2="50" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>

        {/* Left Human Form Head: Workers / Skills (Royal Blue) */}
        <circle cx="21" cy="17" r="5.5" fill="url(#coopnexBlueGrad)" />

        {/* Right Human Form Head: Community / Customers (Indigo-Violet) */}
        <circle cx="43" cy="17" r="5.5" fill="url(#coopnexVioletGrad)" />

        {/* Connecting Geometric Loop (Interlocking Nexus Arc) */}
        {/* Left Body Arc: Flows into central infinity nexus */}
        <path
          d="M 12,46 C 10,34 16,27 25,27 C 32,27 34,31 40,36 C 45,40 50,38 52,34"
          stroke="url(#coopnexBlueGrad)"
          strokeWidth={iconDimensions.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Body Arc: Flows under and links leftward */}
        <path
          d="M 52,46 C 54,34 48,27 39,27 C 32,27 30,31 24,36 C 19,40 14,38 12,34"
          stroke="url(#coopnexVioletGrad)"
          strokeWidth={iconDimensions.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Nexus Connection Spark in Warm Gold */}
        <circle cx="32" cy="31.5" r="3.2" fill="#F59E0B" />
        <circle cx="32" cy="31.5" r="1.2" fill="#FFFFFF" />
      </svg>
    </div>
  );

  if (variant === "symbol") {
    return (
      <div className={`inline-flex items-center ${className}`} title="COOPNEX">
        {symbolElement}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex ${
        variant === "stacked" ? "flex-col items-center text-center gap-1.5" : "items-center gap-2.5"
      } select-none group ${className}`}
    >
      {symbolElement}

      <div className="flex flex-col leading-none">
        {/* Unified Modern Wordmark: COOP in Royal Blue, NEX in Indigo/Violet */}
        <div className={`font-display font-black ${textSizeClasses} flex items-center leading-none tracking-tight`}>
          <span
            className={
              isDark
                ? "text-blue-400"
                : theme === "light"
                ? "text-[#2563EB]"
                : "text-[#2563EB] dark:text-blue-400"
            }
          >
            COOP
          </span>
          <span
            className={
              isDark
                ? "text-indigo-400"
                : theme === "light"
                ? "text-[#4F46E5]"
                : "text-[#4F46E5] dark:text-indigo-400"
            }
          >
            NEX
          </span>
        </div>

        {/* Official Subtitle / Tagline */}
        {showTagline && (
          <span
            className={`font-mono uppercase font-bold text-slate-500 dark:text-slate-400 mt-1 ${taglineSizeClasses}`}
          >
            People • Skills • Cooperatives • Connected
          </span>
        )}
      </div>
    </div>
  );
};

export default CoopnexLogo;
