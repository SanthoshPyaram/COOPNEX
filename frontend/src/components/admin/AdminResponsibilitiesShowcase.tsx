import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Zap,
  CreditCard,
  Building2,
  ShieldAlert,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Eye,
  Activity,
  Award,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export interface AdminResponsibility {
  id: string;
  tabId: string;
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  keyMetric: string;
  metricLabel: string;
  responsibilities: string[];
  actionLabel: string;
}

const ADMIN_RESPONSIBILITIES: AdminResponsibility[] = [
  {
    id: "resp-kyc",
    tabId: "kyc",
    badge: "WORKFORCE VERIFICATION",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    title: "Police Clearance Scrutiny & Skill Tier Certification",
    tagline: "Verifying every artisan before they touch customer homes",
    description:
      "The Super Administrator personally audits and certifies every registering worker. Scrutinizes Police Clearance Certificates (PCC) issued by City Commissionerates, validates UIDAI Aadhaar Verhoeff checksums, cross-checks CCTNS state crime databases, and awards certified Skill Tiers (Levels 1 to 4) before artisans can accept bookings.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    keyMetric: "12,480",
    metricLabel: "Artisans 100% Police Cleared",
    responsibilities: [
      "Physical and digital scrutiny of Police Clearance Certificates (PCC)",
      "Automated UIDAI Aadhaar Verhoeff checksum & PAN verification",
      "Assigning certified Skill Levels (Level 1 Apprentice to Level 4 Master Craftsman)",
      "Enforcing strict 6-digit cryptographic PIN authorization on status approval"
    ],
    actionLabel: "Audit Verification Dossiers"
  },
  {
    id: "resp-emergency",
    tabId: "emergency",
    badge: "RAPID RESPONSE",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    title: "Sub-7-Minute SOS Emergency Dispatch Coordination",
    tagline: "Live proximity GPS dispatch for life-safety hazards",
    description:
      "Oversees real-time rapid response operations for critical household emergencies: electrical flashovers, main MCB failures, gas line leakages, and water bursts. Uses automated proximity GPS vectoring to route the nearest verified Master Electrician or Plumber within 6.4 minutes, with direct phone override channels to workers and residents.",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80",
    keyMetric: "6.4 min",
    metricLabel: "Average Proximity Arrival SLA",
    responsibilities: [
      "Live 3D telemetry tracking of moving worker beacons to incident locations",
      "Direct rapid contact lines to customer residents and dispatched technicians",
      "Automated route re-vectoring if traffic or road obstacles arise",
      "Post-incident hazard resolution verification and statutory settlement"
    ],
    actionLabel: "Monitor Live Emergency Radar"
  },
  {
    id: "resp-payments",
    tabId: "payments",
    badge: "FINANCIAL SOVEREIGNTY",
    badgeColor: "bg-teal-50 text-[#075E54] border-teal-200",
    title: "100% Direct Escrow Disbursals & Welfare Fund Pooling",
    tagline: "Zero commission exploitation, guaranteed statutory welfare",
    description:
      "Enforces absolute financial protection for gig artisans. Releases 100% of base labor fees straight into the artisan's bank account via NPCI upon customer OTP sign-off. Simultaneously directs statutory 2% contributions into the Cooperative Welfare Corpus for accidental medical coverage, disability grants, and children's education scholarships.",
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80",
    keyMetric: "₹14.85 L",
    metricLabel: "Daily Labor Settled (0% Deductions)",
    responsibilities: [
      "100% direct labor payout release upon completion OTP verification",
      "Managing ₹48,50,000 active Cooperative Welfare Corpus in district bank escrow",
      "Authorizing accidental insurance claims (₹2,00,000 group cover)",
      "Distributing tool equipment upgrade microloans at 0% interest"
    ],
    actionLabel: "Inspect Statutory Escrow Ledger"
  },
  {
    id: "resp-governance",
    tabId: "overview",
    badge: "OPERATIONAL OVERSIGHT",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    title: "Platform Governance & Statutory Floor Wage Tariffs",
    tagline: "One unified administrator ensuring fair wages across 9 districts",
    description:
      "Sets and enforces minimum statutory floor wage tariffs across Andhra Pradesh and metropolitan clusters so no artisan is ever underpaid. Maintains complete platform health, monitors API microservice latencies, and provides sovereign democratic leadership free from corporate extraction.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
    keyMetric: "100%",
    metricLabel: "Statutory Floor Wage Compliance",
    responsibilities: [
      "Setting non-negotiable minimum labor rates per service category",
      "Monitoring live cluster operations, booking volumes, and completion SLAs",
      "Reviewing immutable cryptographic audit logs of all platform events",
      "Supervising core infrastructure and database response health"
    ],
    actionLabel: "View Platform Overview"
  },
  {
    id: "resp-security",
    tabId: "security",
    badge: "TRUST & DEFENSE",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    title: "Biometric Anti-Fraud & Hardware Collision Shield",
    tagline: "Protecting consumer trust and locking out malicious actors",
    description:
      "Deploys multi-layer fraud detection across the platform. Tracks hardware device IMEI collisions, duplicate beneficiary bank accounts, and forged certificate stamps. Enforces hardware-backed 2-Factor Authentication (TOTP) and requires a 6-digit cryptographic PIN on all critical administrative decisions.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    keyMetric: "0 Leaks",
    metricLabel: "Fraud Leaks • Tampered Seals Neutralized",
    responsibilities: [
      "Detecting hardware device collisions across multiple worker submissions",
      "Blacklisting forged police verification stamps and fake documents",
      "Mandating 6-digit cryptographic security PIN for status alterations",
      "Active session termination and 5-attempt rate-limiting lockout"
    ],
    actionLabel: "Open Security Sentinel"
  },
  {
    id: "resp-societies",
    tabId: "societies",
    badge: "COOPERATIVE FEDERATION",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    title: "9-District Cooperative Federation & Guild Leadership",
    tagline: "Bridging Primary Labour Societies with State Apex Federations",
    description:
      "Coordinates platform operations across 9 districts (Vijayawada, Guntur, Hyderabad, Visakhapatnam, Bengaluru, etc.) and 42 Primary Labour Societies (PLCS). Allocates emergency tool upgrade grants, audits local welfare treasuries, and mediates member artisan grievances.",
    image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80",
    keyMetric: "9 Districts",
    metricLabel: "42 Registered Labour Societies",
    responsibilities: [
      "Managing regional federation cluster boundaries and active pincodes",
      "Auditing Primary Labour Society treasury balances and worker rosters",
      "Facilitating artisan elections and cooperative guild dispute resolution",
      "Expanding new cooperative trade guilds into expanding urban zones"
    ],
    actionLabel: "Explore 9-District Map"
  }
];

interface AdminResponsibilitiesShowcaseProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminResponsibilitiesShowcase: React.FC<AdminResponsibilitiesShowcaseProps> = ({
  onNavigateTab
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Auto-play through responsibilities every 6 seconds if not paused
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ADMIN_RESPONSIBILITIES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const current = ADMIN_RESPONSIBILITIES[activeIdx];

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6 overflow-hidden">
      {/* Header Banner - Light Cooperative Theme */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#075E54] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#075E54]" />
            <span>Platform Governance Mandate</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            What Does the Super Administrator Do?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
            One privileged platform steward safeguarding 12,480 verified artisans, 9 cooperative districts, instant bank escrow payouts, and sub-7-minute emergency protection.
          </p>
        </div>

        {/* Carousel Prev/Next Navigation Controls */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveIdx((prev) => (prev - 1 + ADMIN_RESPONSIBILITIES.length) % ADMIN_RESPONSIBILITIES.length);
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200 shadow-2xs"
            title="Previous duty"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
            {activeIdx + 1} / {ADMIN_RESPONSIBILITIES.length}
          </div>
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setActiveIdx((prev) => (prev + 1) % ADMIN_RESPONSIBILITIES.length);
            }}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200 shadow-2xs"
            title="Next duty"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Tab Selectors for 6 Duties */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {ADMIN_RESPONSIBILITIES.map((resp, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={resp.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIdx(idx);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-[#075E54] text-white shadow-md shadow-emerald-900/10 scale-102"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-300 animate-pulse" : "bg-slate-400"}`} />
              <span>{resp.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Duty Spotlight Card with Image & Animated Interactions */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 border border-slate-200/90 overflow-hidden shadow-xs p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Duty Details & Responsibilities (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border ${current.badgeColor}`}>
              {current.badge}
            </span>
            <span className="text-xs font-mono text-slate-400">• Priority Administrative Action</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {current.description}
          </p>

          {/* Key Checklist of What Admin Performs */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-[#075E54]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Key Administrator Actions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
              {current.responsibilities.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics & Direct Jump CTA Button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#075E54]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black font-mono text-slate-900 leading-tight">
                  {current.keyMetric}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {current.metricLabel}
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab(current.tabId)}
              className="px-5 py-2.5 rounded-xl bg-[#075E54] hover:bg-[#064e46] text-white text-xs font-black shadow-md hover:shadow-lg transition flex items-center gap-2 group cursor-pointer"
            >
              <span>{current.actionLabel}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>

        {/* Right: High-Res Real Photography with Floating Visual Badges (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white aspect-4/3 group">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Soft gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

            {/* Bottom floating badge inside image */}
            <div className="absolute bottom-3 inset-x-3 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 text-slate-900 shadow-lg flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                  Verified Real-Time Operation
                </div>
                <div className="text-xs font-black text-slate-900 truncate">
                  {current.tagline}
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#075E54] flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
                SS
              </div>
            </div>

            {/* Top floating security badge */}
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white font-mono text-[10px] font-bold shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>SUPER_ADMIN Governance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

