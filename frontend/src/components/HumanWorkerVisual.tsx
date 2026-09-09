import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";

export type TradeType =
  | "electrician"
  | "plumber"
  | "carpenter"
  | "painter"
  | "technician"
  | "driver"
  | "caregiver"
  | "cleaner"
  | "mason"
  | "gardener"
  | "general";

export interface HumanWorkerVisualProps {
  trade?: TradeType | string;
  name?: string;
  coopName?: string;
  verified?: boolean;
  rating?: number;
  experienceYears?: number;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  interactive?: boolean;
  customImage?: string;
}

// Curated realistic authentic photography of tradespersons
const TRADE_PROFILES: Record<
  string,
  {
    image: string;
    label: string;
    icon: string;
    color: string;
    badgeBg: string;
  }
> = {
  electrician: {
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    label: "Certified Electrician",
    icon: "⚡",
    color: "from-amber-500 to-amber-700",
    badgeBg: "bg-amber-500"
  },
  plumber: {
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
    label: "Master Plumber",
    icon: "🔧",
    color: "from-sky-500 to-blue-700",
    badgeBg: "bg-sky-600"
  },
  carpenter: {
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    label: "Artisan Carpenter",
    icon: "🪚",
    color: "from-orange-600 to-amber-800",
    badgeBg: "bg-amber-700"
  },
  technician: {
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    label: "Appliance Specialist",
    icon: "🛠️",
    color: "from-blue-600 to-indigo-800",
    badgeBg: "bg-blue-600"
  },
  painter: {
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80",
    label: "Professional Painter",
    icon: "🎨",
    color: "from-purple-500 to-pink-700",
    badgeBg: "bg-purple-600"
  },
  driver: {
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80",
    label: "Federation Chauffeur",
    icon: "🚗",
    color: "from-emerald-600 to-teal-800",
    badgeBg: "bg-emerald-600"
  },
  caregiver: {
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80",
    label: "Certified Caregiver",
    icon: "🤝",
    color: "from-rose-500 to-red-700",
    badgeBg: "bg-rose-600"
  },
  cleaner: {
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
    label: "Sanitation Specialist",
    icon: "✨",
    color: "from-teal-500 to-emerald-700",
    badgeBg: "bg-teal-600"
  },
  mason: {
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80",
    label: "Structural Mason",
    icon: "🧱",
    color: "from-stone-600 to-neutral-800",
    badgeBg: "bg-stone-600"
  },
  gardener: {
    image: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=600&auto=format&fit=crop&q=80",
    label: "Horticulture Specialist",
    icon: "🌱",
    color: "from-emerald-500 to-green-700",
    badgeBg: "bg-green-600"
  },
  general: {
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=600&auto=format&fit=crop&q=80",
    label: "Cooperative Member",
    icon: "👷",
    color: "from-blue-600 to-indigo-900",
    badgeBg: "bg-blue-600"
  }
};

const SIZE_CONFIGS = {
  sm: {
    container: "w-12 h-12 rounded-xl",
    img: "w-12 h-12 rounded-xl",
    badge: "text-[9px] px-1 py-0.5",
    text: "text-xs"
  },
  md: {
    container: "w-20 h-20 rounded-2xl",
    img: "w-20 h-20 rounded-2xl",
    badge: "text-[10px] px-1.5 py-0.5",
    text: "text-sm"
  },
  lg: {
    container: "w-32 h-32 rounded-3xl",
    img: "w-32 h-32 rounded-3xl",
    badge: "text-xs px-2 py-1",
    text: "text-base"
  },
  xl: {
    container: "w-48 h-48 sm:w-56 sm:h-56 rounded-3xl",
    img: "w-48 h-48 sm:w-56 sm:h-56 rounded-3xl",
    badge: "text-xs px-2.5 py-1",
    text: "text-lg"
  },
  hero: {
    container: "w-full max-w-md h-80 sm:h-96 rounded-3xl",
    img: "w-full h-full rounded-3xl",
    badge: "text-xs px-3 py-1.5",
    text: "text-xl font-bold"
  }
};

export const HumanWorkerVisual: React.FC<HumanWorkerVisualProps> = ({
  trade = "electrician",
  name = "Verified Specialist",
  coopName = "AP State Labour Cooperative Federation",
  verified = true,
  rating = 4.9,
  experienceYears = 8,
  size = "md",
  className = "",
  interactive = true,
  customImage
}) => {
  const [imgError, setImgError] = useState(false);
  const normalizedTrade = String(trade).toLowerCase();
  const profile = TRADE_PROFILES[normalizedTrade] || TRADE_PROFILES.general;
  const config = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
  const imageUrl = customImage || profile.image;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02, translateY: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={`relative group inline-block ${config.container} ${className}`}
    >
      {/* 3D Depth Card Outer Shadow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur-sm group-hover:blur-md transition-all duration-300 pointer-events-none" />

      {/* Main Image or Fallback */}
      <div className={`relative w-full h-full overflow-hidden border-2 border-white/80 shadow-lg ${config.img} bg-slate-100`}>
        {!imgError ? (
          <img
            src={imageUrl}
            alt={`${name} - ${profile.label}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${profile.color} text-white font-bold`}
          >
            <span className="text-2xl mb-1">{profile.icon}</span>
            <span className="font-mono text-sm tracking-widest">{initials || "CW"}</span>
          </div>
        )}

        {/* Ambient Gradient Overlay on Bottom for Hero/Large */}
        {(size === "lg" || size === "xl" || size === "hero") && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none flex flex-col justify-end p-4 text-white">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-semibold">
                {profile.icon} {profile.label}
              </span>
            </div>
            <div className="font-black text-sm sm:text-base leading-tight drop-shadow-xs">{name}</div>
            <div className="text-[11px] text-slate-300 font-medium truncate">{coopName}</div>
          </div>
        )}
      </div>

      {/* Floating Verification Badge */}
      {verified && (
        <div
          className={`absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white rounded-full flex items-center gap-1 shadow-md border-2 border-white font-black z-10 ${config.badge}`}
          title="Government Cooperative Verified"
        >
          <ShieldCheck className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline">VERIFIED</span>
        </div>
      )}

      {/* Experience / Rating Badge (only for medium and larger) */}
      {(size === "md" || size === "lg" || size === "xl" || size === "hero") && rating && (
        <div
          className="absolute -top-1.5 -left-1.5 bg-slate-900/90 text-amber-400 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-slate-700 text-[10px] font-bold z-10"
          title={`Rating: ${rating}/5.0 • ${experienceYears} yrs experience`}
        >
          <Star className="w-2.5 h-2.5 fill-amber-400" />
          <span>{rating}</span>
        </div>
      )}
    </motion.div>
  );
};

