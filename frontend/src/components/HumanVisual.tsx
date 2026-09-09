import React from "react";
import { motion } from "framer-motion";

export type HumanRole =
  | "electrician"
  | "plumber"
  | "carpenter"
  | "technician"
  | "driver"
  | "caregiver"
  | "cleaner"
  | "customer-rep"
  | "analyst"
  | "welcoming";

export type HumanPose = "working" | "standing" | "portrait" | "action" | "greeting";
export type HumanSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";
export type HumanAnimation = "breathe" | "float" | "subtle" | "none";

export interface HumanVisualProps {
  role?: HumanRole | string;
  pose?: HumanPose;
  size?: HumanSize;
  animation?: HumanAnimation;
  background?: "subtle" | "glow" | "none" | "gradient";
  alt?: string;
  className?: string;
  badgeText?: string;
  showStatusBadge?: boolean;
}

// High-fidelity stylized realistic 3D human artwork & renders for Indian trade specialists
const HUMAN_MODELS: Record<
  string,
  {
    image: string;
    title: string;
    tradeName: string;
    accentGlow: string;
    badgeColor: string;
  }
> = {
  electrician: {
    // Realistic stylized 3D rendered Indian Master Electrician with safety helmet & insulated tools
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=700&auto=format&fit=crop&q=85",
    title: "Arjun Kumar",
    tradeName: "NSQF Level-4 Master Electrician",
    accentGlow: "rgba(37, 99, 235, 0.25)",
    badgeColor: "bg-blue-600 text-white"
  },
  plumber: {
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&auto=format&fit=crop&q=85",
    title: "Lakshmi Narayana",
    tradeName: "Certified Master Plumber",
    accentGlow: "rgba(14, 165, 233, 0.25)",
    badgeColor: "bg-sky-600 text-white"
  },
  carpenter: {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=85",
    title: "S. Rama Rao",
    tradeName: "Master Joiner & Carpenter",
    accentGlow: "rgba(217, 119, 6, 0.25)",
    badgeColor: "bg-amber-600 text-white"
  },
  technician: {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=700&auto=format&fit=crop&q=85",
    title: "K. Satish",
    tradeName: "HVAC & Appliance Specialist",
    accentGlow: "rgba(79, 70, 229, 0.25)",
    badgeColor: "bg-indigo-600 text-white"
  },
  cleaner: {
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&auto=format&fit=crop&q=85",
    title: "M. Lakshmi",
    tradeName: "Deep Cleaning & Sanitation Expert",
    accentGlow: "rgba(16, 185, 129, 0.25)",
    badgeColor: "bg-emerald-600 text-white"
  },
  "customer-rep": {
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&auto=format&fit=crop&q=85",
    title: "P. Sunitha",
    tradeName: "Citizen Support Officer",
    accentGlow: "rgba(59, 130, 246, 0.25)",
    badgeColor: "bg-blue-600 text-white"
  },
  analyst: {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=700&auto=format&fit=crop&q=85",
    title: "Divya Sharma",
    tradeName: "Operations & AI Intelligence Lead",
    accentGlow: "rgba(99, 102, 241, 0.25)",
    badgeColor: "bg-indigo-600 text-white"
  },
  welcoming: {
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=700&auto=format&fit=crop&q=85",
    title: "K. Venkata Rao",
    tradeName: "Verified Citizen Member",
    accentGlow: "rgba(16, 185, 129, 0.25)",
    badgeColor: "bg-emerald-600 text-white"
  }
};

const SIZE_CLASSES: Record<HumanSize, { container: string; img: string }> = {
  xs: { container: "w-10 h-10 rounded-xl", img: "w-10 h-10 rounded-xl" },
  sm: { container: "w-14 h-14 rounded-2xl", img: "w-14 h-14 rounded-2xl" },
  md: { container: "w-24 h-24 sm:w-28 sm:h-28 rounded-3xl", img: "w-24 h-24 sm:w-28 sm:h-28 rounded-3xl" },
  lg: { container: "w-36 h-36 sm:w-44 sm:h-44 rounded-3xl", img: "w-36 h-36 sm:w-44 sm:h-44 rounded-3xl" },
  xl: { container: "w-52 h-52 sm:w-64 sm:h-64 rounded-3xl", img: "w-52 h-52 sm:w-64 sm:h-64 rounded-3xl" },
  hero: { container: "w-64 h-64 sm:w-80 sm:h-80 rounded-3xl", img: "w-64 h-64 sm:w-80 sm:h-80 rounded-3xl" }
};

export const HumanVisual: React.FC<HumanVisualProps> = ({
  role = "electrician",
  pose = "standing",
  size = "md",
  animation = "breathe",
  background = "glow",
  alt,
  className = "",
  badgeText,
  showStatusBadge = false
}) => {
  const model = HUMAN_MODELS[role.toLowerCase()] || HUMAN_MODELS.electrician;
  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  // Animation variants: subtle breathing and floating motions (never cartoonish spinning)
  const getAnimationProps = () => {
    if (animation === "breathe") {
      return {
        animate: {
          scale: [1, 1.018, 1],
          y: [0, -3, 0]
        },
        transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      };
    }
    if (animation === "float") {
      return {
        animate: {
          y: [0, -6, 0],
          rotateZ: [0, 0.5, -0.5, 0]
        },
        transition: {
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      };
    }
    if (animation === "subtle") {
      return {
        animate: {
          opacity: [0.95, 1, 0.95]
        },
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      };
    }
    return {};
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeConfig.container} ${className}`}>
      {/* Ambient background lighting glow */}
      {background === "glow" && (
        <div
          className="absolute inset-0 rounded-3xl blur-xl opacity-60 pointer-events-none transition-all duration-700"
          style={{ background: model.accentGlow }}
        />
      )}

      {background === "subtle" && (
        <div className="absolute inset-0 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
      )}

      {/* Main Stylized Animated Human Visual */}
      <motion.div
        className={`relative z-10 overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-700/80 bg-slate-100 ${sizeConfig.img}`}
        {...getAnimationProps()}
      >
        <img
          src={model.image}
          alt={alt || `${model.title} - ${model.tradeName}`}
          className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
          loading="lazy"
        />

        {/* Soft studio rim lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-white/15 pointer-events-none" />
      </motion.div>

      {/* Optional contextual status badge */}
      {(showStatusBadge || badgeText) && (
        <span
          className={`absolute -bottom-2 z-20 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase shadow-xs whitespace-nowrap ${
            badgeText ? "bg-slate-900 text-white" : model.badgeColor
          }`}
        >
          {badgeText || "Level 4 Verified"}
        </span>
      )}
    </div>
  );
};
