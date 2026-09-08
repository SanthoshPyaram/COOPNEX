import React, { useState, useRef } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  CreditCard,
  MapPin,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  Shield,
  UserCheck
} from "lucide-react";

export interface NetworkNode {
  id: string;
  name: string;
  role: string;
  category: "worker" | "customer" | "society" | "area" | "escrow";
  avatar?: string;
  icon?: any;
  status: string;
  statusColor: string;
  location: string;
  telemetry: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
  };
  details: string;
  position: { x: number; y: number }; // Percentage offsets from center
}

const NETWORK_8_NODES: NetworkNode[] = [
  {
    id: "wrk-1",
    name: "Rajesh Kumar",
    role: "Master Electrician (Tier 4)",
    category: "worker",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    status: "On Job (SOS)",
    statusColor: "bg-emerald-500 text-emerald-100",
    location: "Vijayawada Central",
    telemetry: { label1: "Rating", val1: "4.95 ★", label2: "Response SLA", val2: "5.8m" },
    details: "Assigned to emergency MCB rewiring at Sharma Residence. Police cleared.",
    position: { x: -38, y: -28 }
  },
  {
    id: "wrk-2",
    name: "Lakshmi Narayana",
    role: "Senior Master Plumber",
    category: "worker",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    status: "Available",
    statusColor: "bg-teal-500 text-teal-100",
    location: "Guntur Urban",
    telemetry: { label1: "Rating", val1: "4.9 ★", label2: "Total Jobs", val2: "148" },
    details: "Awaiting next automated cooperative cluster dispatch in Arundelpet.",
    position: { x: -44, y: 15 }
  },
  {
    id: "wrk-3",
    name: "Sunita Devi",
    role: "Certified Elder Care Pro",
    category: "worker",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    status: "Active Shift",
    statusColor: "bg-emerald-500 text-emerald-100",
    location: "Auto Nagar, VJA",
    telemetry: { label1: "Experience", val1: "5 yrs", label2: "PCC Status", val2: "Verified" },
    details: "Active residential care shift. First aid certified with pristine record.",
    position: { x: -22, y: 36 }
  },
  {
    id: "wrk-4",
    name: "Anita Rao",
    role: "Home Culinary Artisan",
    category: "worker",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    status: "Verified Tier 3",
    statusColor: "bg-teal-500 text-teal-100",
    location: "Bengaluru South",
    telemetry: { label1: "Hygiene Score", val1: "100%", label2: "Active Orders", val2: "4" },
    details: "Guild-certified traditional catering. FSSAI & Cooperative certified.",
    position: { x: 38, y: -28 }
  },
  {
    id: "cust-1",
    name: "Priya Sharma",
    role: "Verified Customer",
    category: "customer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    status: "Job Active",
    statusColor: "bg-blue-500 text-blue-100",
    location: "Banjara Hills, HYD",
    telemetry: { label1: "Escrow Held", val1: "₹850", label2: "Security PIN", val2: "Generated" },
    details: "Initiated emergency service. Proximity worker dispatched.",
    position: { x: 44, y: 15 }
  },
  {
    id: "soc-1",
    name: "Vijayawada Co-op",
    role: "Registered Labour Society",
    category: "society",
    icon: Building2,
    status: "Apex Active",
    statusColor: "bg-emerald-600 text-emerald-100",
    location: "Reg: PLCS-04",
    telemetry: { label1: "Artisans", val1: "1,420", label2: "Welfare Fund", val2: "₹14.2 L" },
    details: "Primary cooperative hub coordinating NTR district trades & social welfare.",
    position: { x: -14, y: -38 }
  },
  {
    id: "area-1",
    name: "Hitech Cyber Hub",
    role: "Service Area Sector 4",
    category: "area",
    icon: MapPin,
    status: "High Demand",
    statusColor: "bg-amber-500 text-amber-100",
    location: "Pincode 500081",
    telemetry: { label1: "Demand Index", val1: "1.42x", label2: "Active Nodes", val2: "64" },
    details: "High emergency request frequency during peak commercial hours.",
    position: { x: 14, y: -38 }
  },
  {
    id: "esc-1",
    name: "Smart Escrow Vault",
    role: "NPCI / Bank Settlement Hub",
    category: "escrow",
    icon: CreditCard,
    status: "100% Settled",
    statusColor: "bg-emerald-600 text-emerald-100",
    location: "Statutory Escrow",
    telemetry: { label1: "Disbursed Today", val1: "₹2,14,500", label2: "Artisan Fee", val2: "100%" },
    details: "Direct account settlement upon customer completion OTP. 0% middlemen take.",
    position: { x: 22, y: 36 }
  }
];

export const CooperativeNetwork3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(NETWORK_8_NODES[0]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3-5 degree tilt max
    const tiltX = -((y - centerY) / centerY) * 4;
    const tiltY = ((x - centerX) / centerX) * 4;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredNode(null);
  };

  const activeInspect = hoveredNode || selectedNode;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[420px] sm:h-[460px] rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 overflow-hidden shadow-xs select-none flex flex-col justify-between p-4"
      style={{ perspective: "1200px" }}
    >
      {/* Top Bar Header & Signals */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-xs backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-[#075E54] dark:bg-emerald-400 animate-ping" />
          <span>Real-Entity Cooperative Topology (SUPER_ADMIN Governance)</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">
            8 Synchronized Nodes
          </span>
          <span>• 3–5° Spatial Depth</span>
        </div>
      </div>

      {/* 3D Spatial Interactive Board */}
      <div
        className="relative flex-1 w-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Dynamic Connective SVG Ray Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="rayGrad" x1="50%" y1="50%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#075E54" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#075E54" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#075E54" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central subtle glow aura */}
          <circle cx="50%" cy="50%" r="130" fill="url(#hubGlow)" />
          <circle cx="50%" cy="50%" r="90" stroke="#075E54" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.25" />
          <circle cx="50%" cy="50%" r="170" stroke="#075E54" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.15" />

          {/* Radial Lines from Center to each Node */}
          {NETWORK_8_NODES.map((node) => {
            const targetX = 50 + node.position.x;
            const targetY = 50 + node.position.y;
            const isHovered = activeInspect?.id === node.id;
            return (
              <g key={node.id}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${targetX}%`}
                  y2={`${targetY}%`}
                  stroke={isHovered ? "#10B981" : "#075E54"}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeOpacity={isHovered ? 0.7 : 0.25}
                  strokeDasharray={isHovered ? "none" : "3 3"}
                />
                {/* Moving signal packet pulse along ray */}
                <circle
                  cx={`${50 + node.position.x * 0.5}%`}
                  cy={`${50 + node.position.y * 0.5}%`}
                  r={isHovered ? 3 : 2}
                  fill={isHovered ? "#34D399" : "#075E54"}
                />
              </g>
            );
          })}
        </svg>

        {/* Central SUPER_ADMIN Command Hub */}
        <div
          className="absolute z-10 flex flex-col items-center justify-center cursor-default"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#075E54] to-emerald-500 rounded-2xl blur-xs opacity-40 group-hover:opacity-75 transition" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#075E54] text-white flex flex-col items-center justify-center p-2 shadow-xl border-2 border-emerald-400">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              <span className="text-[9px] font-black uppercase tracking-wider text-center mt-1">
                SUPER_ADMIN
              </span>
              <span className="text-[8px] font-mono text-emerald-200">
                Command Hub
              </span>
            </div>
          </div>
        </div>

        {/* 8 Outer Real-Entity Human / Cooperative Nodes */}
        {NETWORK_8_NODES.map((node) => {
          const isHovered = activeInspect?.id === node.id;
          const leftPct = 50 + node.position.x;
          const topPct = 50 + node.position.y;
          const IconComponent = node.icon;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              onMouseEnter={() => setHoveredNode(node)}
              className={`absolute cursor-pointer transition-all duration-200 z-10 flex items-center gap-2 p-1.5 rounded-xl border shadow-sm ${
                isHovered
                  ? "bg-white dark:bg-slate-900 border-[#075E54] dark:border-emerald-400 scale-110 shadow-lg -translate-y-1"
                  : "bg-white/95 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              }`}
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: `translate(-50%, -50%) translateZ(${isHovered ? 25 : 10}px)`
              }}
            >
              {/* Photo Avatar or Icon */}
              {node.avatar ? (
                <img
                  src={node.avatar}
                  alt={node.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-[#075E54] dark:text-emerald-400 flex items-center justify-center shrink-0 border border-teal-200 dark:border-teal-800">
                  <IconComponent className="w-4 h-4" />
                </div>
              )}

              {/* Text Label */}
              <div className="hidden sm:block text-left pr-1.5">
                <div className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight truncate max-w-[90px]">
                  {node.name}
                </div>
                <div className="text-[9px] text-slate-400 truncate max-w-[90px]">
                  {node.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Interactive Inspection HUD Bar - Crisp Light Style */}
      {activeInspect && (
        <div className="relative z-20 bg-white/95 text-slate-800 p-3.5 rounded-xl border border-slate-200 shadow-xl text-xs backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3 min-w-0">
            {activeInspect.avatar ? (
              <img
                src={activeInspect.avatar}
                alt={activeInspect.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#075E54] shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#075E54] flex items-center justify-center border border-teal-200 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900 truncate">
                  {activeInspect.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600">
                  {activeInspect.role}
                </span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${activeInspect.statusColor}`}>
                  {activeInspect.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                {activeInspect.details}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono shrink-0 sm:border-l sm:border-slate-200 sm:pl-4">
            <div>
              <span className="text-slate-400">{activeInspect.telemetry.label1}:</span>{" "}
              <strong className="text-[#075E54]">{activeInspect.telemetry.val1}</strong>
            </div>
            <div>
              <span className="text-slate-400">{activeInspect.telemetry.label2}:</span>{" "}
              <strong className="text-amber-600">{activeInspect.telemetry.val2}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
