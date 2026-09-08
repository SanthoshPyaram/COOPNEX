import React from "react";
import { motion } from "framer-motion";

interface BackgroundProps {
  variant?: "light" | "dark" | "hero";
  children?: React.ReactNode;
  className?: string;
}

export const AnimatedCoopBackground: React.FC<BackgroundProps> = ({
  variant = "light",
  children,
  className = ""
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Floating Gradient Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Orb 1: Royal Blue Glow (Top Left) */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -35, 20, 0],
            scale: [1, 1.1, 0.95, 1]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-blue-500/15 blur-3xl"
        />

        {/* Orb 2: Sunset Amber Glow (Center Right) */}
        <motion.div
          animate={{
            x: [0, -40, 25, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.15, 0.9, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -right-20 w-[380px] h-[380px] rounded-full bg-amber-500/15 blur-3xl"
        />

        {/* Orb 3: Luminous Indigo Glow (Bottom Left) */}
        <motion.div
          animate={{
            x: [0, 35, -30, 0],
            y: [0, -25, 35, 0],
            scale: [1, 1.08, 0.92, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-20 left-1/4 w-[450px] h-[450px] rounded-full bg-indigo-200/50 blur-3xl"
        />

        {/* 3D Floating Geometric Polyhedra Wireframe Elements */}
        <motion.div
          animate={{
            rotateX: [0, 180, 360],
            rotateY: [0, 360, 0],
            rotateZ: [0, 90, 180],
            y: [0, -30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute top-12 left-[12%] w-16 h-16 pointer-events-none opacity-25 dark:opacity-20 hidden md:block"
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-blue-500 dark:stroke-blue-400 stroke-[1.5]">
            <polygon points="50,10 90,35 90,75 50,95 10,75 10,35" strokeDasharray="3 3" />
            <polygon points="50,10 50,95" />
            <polygon points="10,35 90,75" />
            <polygon points="90,35 10,75" />
          </svg>
        </motion.div>

        <motion.div
          animate={{
            rotateX: [360, 180, 0],
            rotateY: [0, 180, 360],
            y: [0, 35, 0]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear", delay: 3 }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute bottom-20 right-[15%] w-20 h-20 pointer-events-none opacity-20 dark:opacity-15 hidden md:block"
        >
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-indigo-500 dark:stroke-indigo-400 stroke-[1.5]">
            <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
            <ellipse cx="50" cy="50" rx="40" ry="18" />
            <ellipse cx="50" cy="50" rx="18" ry="40" />
          </svg>
        </motion.div>

        {/* Floating Delicate Trade Icons & Particles */}
        <motion.div
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.45, 0.15], rotate: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[8%] text-2xl select-none"
        >
          ⚡
        </motion.div>

        <motion.div
          animate={{ y: [0, -50, 0], opacity: [0.2, 0.5, 0.2], rotate: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-2/3 right-[10%] text-2xl select-none"
        >
          🔧
        </motion.div>

        <motion.div
          animate={{ y: [0, -35, 0], opacity: [0.15, 0.4, 0.15], rotate: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/4 left-[15%] text-xl select-none"
        >
          ✨
        </motion.div>

        <motion.div
          animate={{ y: [0, -45, 0], opacity: [0.18, 0.45, 0.18], rotate: [0, -15, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/6 right-[25%] text-xl select-none"
        >
          🛠️
        </motion.div>

        {/* Subtle Geometric Dot Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#2563EB 1.5px, transparent 1.5px)`,
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      {/* Foreground Content */}
      {children}
    </div>
  );
};

