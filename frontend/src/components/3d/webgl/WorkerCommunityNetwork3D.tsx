import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  Award,
  HeartHandshake,
  Home,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

interface ConstellationNode {
  id: string;
  name: string;
  shortName: string;
  role: string;
  description: string;
  benefits: string[];
  photoUrl: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  xPercent: number; // For responsive SVG placement (0 - 100)
  yPercent: number; // For responsive SVG placement (0 - 100)
  icon: React.ComponentType<{ className?: string }>;
}

const CONSTELLATION_NODES: ConstellationNode[] = [
  {
    id: "primary-society",
    name: "Primary Labour Society",
    shortName: "Primary Society",
    role: "Democratic Governance & Legal Defense",
    description:
      "Your local registered primary cooperative. 1 Worker = 1 Vote. Society stewards defend your standard district rates, mediate customer disputes, and provide safe community spaces.",
    benefits: [
      "Equal voting rights in cooperative elections & leadership",
      "Dedicated legal protection against unfair customer disputes",
      "Local society hall with tool bank and rest spaces"
    ],
    photoUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&q=80",
    color: "#075E54",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-300",
    xPercent: 18,
    yPercent: 26,
    icon: Shield
  },
  {
    id: "guild-mentors",
    name: "Artisan Guild & Mentors",
    shortName: "Guild Mentors",
    role: "Master Craftsmen Peer Support",
    description:
      "A brotherhood and sisterhood of veteran electricians, plumbers, carpenters, and technicians. Share rare diagnostic tools, safety tips, and on-site backup for complex jobs.",
    benefits: [
      "Experienced peer backup on complex industrial or large repairs",
      "Shared high-cost specialty equipment & tooling library",
      "Quarterly artisan meetings and peer mutual aid pool"
    ],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    color: "#0284C7",
    badgeBg: "bg-blue-50",
    badgeBorder: "border-blue-300",
    xPercent: 82,
    yPercent: 24,
    icon: Users
  },
  {
    id: "welfare-board",
    name: "District Welfare Board",
    shortName: "Welfare Board",
    role: "Health, Safety & Family Security",
    description:
      "Government-registered cooperative welfare board providing social safety nets so you and your family never face health emergencies or unforeseen accidents alone.",
    benefits: [
      "₹2,00,000 accidental life and permanent disability cover",
      "Emergency medical assistance grants accessible within 24 hours",
      "Annual education scholarships for artisans' children"
    ],
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    color: "#D97706",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-300",
    xPercent: 80,
    yPercent: 76,
    icon: HeartHandshake
  },
  {
    id: "skill-center",
    name: "Vocational Skill Academy",
    shortName: "Skill Academy",
    role: "Free Upskilling & Certification",
    description:
      "Continuous professional development centers. Upgrade your certification tier from Apprentice to Level 4 Master Craftsman at zero tuition fees.",
    benefits: [
      "Free hands-on workshops on solar, EV chargers, and smart inverter setups",
      "Official NSQF aligned government certification cards",
      "Direct pathway to higher statutory minimum floor wages"
    ],
    photoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80",
    color: "#7C3AED",
    badgeBg: "bg-purple-50",
    badgeBorder: "border-purple-300",
    xPercent: 20,
    yPercent: 78,
    icon: Award
  },
  {
    id: "local-customers",
    name: "Community Households",
    shortName: "Local Households",
    role: "Respectful Neighborhood Customers",
    description:
      "Verified local families and small businesses who value honest artisan labor and transparent cooperative pricing over exploitative corporate gig platforms.",
    benefits: [
      "Zero awkward bargaining: standard cooperative tariff card",
      "Safe, respectful residential working conditions",
      "Instant UPI payment settlement with zero deduction upon job OTP"
    ],
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    color: "#059669",
    badgeBg: "bg-teal-50",
    badgeBorder: "border-teal-300",
    xPercent: 50,
    yPercent: 12,
    icon: Home
  }
];

export const WorkerCommunityNetwork3D: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ConstellationNode>(CONSTELLATION_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeNode = hoveredNode
    ? CONSTELLATION_NODES.find((n) => n.id === hoveredNode) || selectedNode
    : selectedNode;

  // Center Worker Position
  const centerX = 50;
  const centerY = 50;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Human Solidarity Network</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          You Are Never Alone. <br className="hidden sm:inline" />
          Supported by a Resilient Human Ecosystem.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Unlike gig corporations that leave you isolated against customer disputes, COOPNEX wraps every artisan in a circle of real peer mentors, registered societies, and family welfare boards.
        </p>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Human Constellation Canvas (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[460px] sm:min-h-[520px] rounded-3xl bg-gradient-to-b from-white via-slate-50 to-blue-50/40 p-4 sm:p-6 border border-slate-200 shadow-xl overflow-hidden flex items-center justify-center">
          {/* Subtle concentric orbital rings */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-blue-200/60 pointer-events-none" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-blue-100 pointer-events-none" />
          <div className="absolute w-[180px] h-[180px] rounded-full border border-blue-200/40 pointer-events-none" />

          {/* SVG Connection Rays with Flowing Energy Pulses */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0b84f3" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#075E54" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="idleLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {CONSTELLATION_NODES.map((node) => {
              const isHighlighted = activeNode.id === node.id;
              return (
                <g key={node.id}>
                  {/* Base Line */}
                  <line
                    x1={`${centerX}%`}
                    y1={`${centerY}%`}
                    x2={`${node.xPercent}%`}
                    y2={`${node.yPercent}%`}
                    stroke={isHighlighted ? "url(#activeLineGrad)" : "url(#idleLineGrad)"}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={isHighlighted ? "none" : "4,4"}
                    className="transition-all duration-300"
                  />

                  {/* Pulsing Energy Dot moving along active line */}
                  {isHighlighted && (
                    <circle r="4" fill="#0b84f3">
                      <animateMotion
                        path={`M${centerX * 4.5},${centerY * 4.5} L${node.xPercent * 4.5},${node.yPercent * 4.5}`}
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Center Worker Node (You) */}
          <div
            className="absolute z-20 flex flex-col items-center"
            style={{
              left: `${centerX}%`,
              top: `${centerY}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            <div className="relative group cursor-pointer">
              {/* Glowing Aura Ring */}
              <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 opacity-60 blur-sm animate-pulse" />

              {/* Worker Portrait Avatar */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80"
                  alt="Verified Worker"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Center Floating Crown Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#075E54] text-white font-black text-[10px] uppercase tracking-wider border-2 border-white shadow-md whitespace-nowrap flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>You • Artisan</span>
              </div>
            </div>
          </div>

          {/* 5 Surrounding Human Constellation Nodes */}
          {CONSTELLATION_NODES.map((node) => {
            const isSelected = activeNode.id === node.id;
            const Icon = node.icon;

            return (
              <motion.div
                key={node.id}
                className="absolute z-20 cursor-pointer"
                style={{
                  left: `${node.xPercent}%`,
                  top: `${node.yPercent}%`,
                  transform: "translate(-50%, -50%)"
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex flex-col items-center">
                  {/* Photo & Ring */}
                  <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden p-0.5 transition-all duration-300 ${
                      isSelected
                        ? "shadow-2xl ring-4 ring-blue-500 scale-105"
                        : "shadow-md border-2 border-white opacity-90 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={node.photoUrl}
                      alt={node.name}
                      className="w-full h-full object-cover rounded-xl"
                    />

                    {/* Small Icon Badge */}
                    <div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-lg shadow-sm flex items-center justify-center text-white border border-white"
                      style={{ backgroundColor: node.color }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Name Pill */}
                  <div
                    className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border transition-all whitespace-nowrap shadow-xs ${
                      isSelected
                        ? "bg-[#0b84f3] text-white border-blue-600 shadow-md font-black"
                        : "bg-white/95 text-slate-800 border-slate-200"
                    }`}
                  >
                    {node.shortName}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Quick Guidance Tag */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Tap or hover any circle to inspect relationship</span>
            <span className="font-mono font-bold text-blue-600">5 Cooperative Pillars</span>
          </div>
        </div>

        {/* Right Column: Dynamic Relationship Explanation Card (5 cols) */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6"
            >
              {/* Header with Photo & Title */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md shrink-0">
                  <img
                    src={activeNode.photoUrl}
                    alt={activeNode.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Active Solidarity Link</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {activeNode.name}
                  </h3>
                  <div className="text-xs font-bold text-[#0b84f3]">
                    {activeNode.role}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeNode.description}
              </p>

              {/* Specific Benefits Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cooperative Guarantees for You:
                </div>
                {activeNode.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Quick Tab Selector for Mobile / Direct Access */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                  Explore other pillars:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CONSTELLATION_NODES.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setSelectedNode(n)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-bold ${
                        activeNode.id === n.id
                          ? "bg-[#0b84f3] text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {n.shortName}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
