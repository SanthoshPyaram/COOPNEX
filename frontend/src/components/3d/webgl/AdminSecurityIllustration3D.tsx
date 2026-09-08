import React, { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ShieldCheck,
  Shield,
  Users,
  Home,
  Building2,
  MapPin,
  CreditCard,
  Lock,
  Sparkles,
  Zap,
  Activity
} from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  photoUrl?: string;
  color: string;
  xPct: number;
  yPct: number;
  status: string;
}

const NETWORK_NODES: NetworkNode[] = [
  {
    id: "workers",
    name: "Workforce",
    label: "👷 12,480 Verified Artisans",
    icon: Users,
    photoUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&q=80",
    color: "#075E54",
    xPct: 22,
    yPct: 24,
    status: "Active & Monitored"
  },
  {
    id: "customers",
    name: "Households",
    label: "🏠 48,200 Consumer Accounts",
    icon: Home,
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
    color: "#0b84f3",
    xPct: 78,
    yPct: 22,
    status: "Verified Residents"
  },
  {
    id: "cooperatives",
    name: "Cooperatives",
    label: "🤝 286 Primary Societies",
    icon: Building2,
    photoUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&q=80",
    color: "#d97706",
    xPct: 82,
    yPct: 74,
    status: "Federation Affiliated"
  },
  {
    id: "service-areas",
    name: "Service Areas",
    label: "📍 142 Active District Zones",
    icon: MapPin,
    color: "#059669",
    xPct: 18,
    yPct: 76,
    status: "GIS Verified"
  },
  {
    id: "payments",
    name: "Payments",
    label: "💳 ₹18.6L Daily Escrow",
    icon: CreditCard,
    color: "#7c3aed",
    xPct: 50,
    yPct: 12,
    status: "Automated UPI"
  },
  {
    id: "security",
    name: "Security",
    label: "🛡 Zero Breaches • MFA Active",
    icon: Shield,
    color: "#dc2626",
    xPct: 50,
    yPct: 88,
    status: "Encrypted & Audited"
  }
];

export const AdminSecurityIllustration3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Subtle 3-5 degree 3D tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredNode(null);
  };

  const centerX = 50;
  const centerY = 50;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="relative w-full h-[400px] sm:h-[440px] rounded-2xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-4 overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center select-none"
    >
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50 pointer-events-none" />

      {/* Subtle Orbital Rings */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-teal-500/15 pointer-events-none" />
      <div className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-blue-500/20 pointer-events-none" />

      {/* Connecting Network Rays (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="adminRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#075E54" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0b84f3" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="idleRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {NETWORK_NODES.map((node) => {
          const isHighlighted = hoveredNode === node.id;
          return (
            <g key={node.id}>
              <line
                x1={`${centerX}%`}
                y1={`${centerY}%`}
                x2={`${node.xPct}%`}
                y2={`${node.yPct}%`}
                stroke={isHighlighted ? "url(#adminRayGrad)" : "url(#idleRayGrad)"}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray={isHighlighted ? "none" : "3,3"}
                className="transition-all duration-300"
              />

              {/* Flowing Energy Dot */}
              <circle r={isHighlighted ? "3.5" : "2"} fill={isHighlighted ? "#075E54" : "#94a3b8"}>
                <animateMotion
                  path={`M${centerX * 4.4},${centerY * 4.2} L${node.xPct * 4.4},${node.yPct * 4.2}`}
                  dur={isHighlighted ? "1.2s" : "3s"}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* CENTRAL NODE: ADMINISTRATOR / GOVERNANCE HUB */}
      <div
        className="absolute z-20 flex flex-col items-center cursor-pointer"
        style={{
          left: `${centerX}%`,
          top: `${centerY}%`,
          transform: "translate(-50%, -50%)"
        }}
      >
        <div className="relative group">
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-400 opacity-60 blur-md animate-pulse" />

          {/* Central Admin Profile Badge */}
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#075E54] border-2 border-emerald-300 shadow-xl flex flex-col items-center justify-center text-white p-1.5">
            <ShieldCheck className="w-8 h-8 text-amber-300 drop-shadow-md" />
            <span className="text-[9px] font-black tracking-widest text-emerald-100 uppercase mt-0.5">
              SUPER ADMIN
            </span>
          </div>

          {/* Golden Crown Ribbon */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md whitespace-nowrap border border-amber-300">
            One Command Center
          </div>
        </div>
      </div>

      {/* 6 SURROUNDING ENTITY NODES (Workers, Customers, Cooperatives, Areas, Payments, Security) */}
      {NETWORK_NODES.map((node) => {
        const isHovered = hoveredNode === node.id;
        const Icon = node.icon;

        return (
          <motion.div
            key={node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute z-20 cursor-pointer"
            style={{
              left: `${node.xPct}%`,
              top: `${node.yPct}%`,
              transform: "translate(-50%, -50%)"
            }}
            whileHover={{ scale: 1.15 }}
          >
            <div className="flex flex-col items-center group">
              {/* Photo or Icon Disc */}
              <div
                className={`relative w-12 h-12 rounded-2xl overflow-hidden p-0.5 transition-all duration-300 ${
                  isHovered
                    ? "ring-3 ring-[#075E54] shadow-xl scale-110"
                    : "border border-slate-200 bg-white shadow-sm"
                }`}
              >
                {node.photoUrl ? (
                  <img
                    src={node.photoUrl}
                    alt={node.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${node.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: node.color }} />
                  </div>
                )}

                {/* Small indicator tag */}
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: node.color }}
                >
                  ✓
                </div>
              </div>

              {/* Node Label Pill */}
              <div
                className={`mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border whitespace-nowrap transition-all shadow-2xs ${
                  isHovered
                    ? "bg-[#075E54] text-white border-[#075E54] shadow-md font-black"
                    : "bg-white text-slate-800 border-slate-200"
                }`}
              >
                {node.name}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Bottom Live Signal Ticker */}
      <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5 text-[#075E54] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Central Network Coordination Active
        </span>
        <span className="text-slate-500">Super Administrator Governance</span>
      </div>
    </motion.div>
  );
};
