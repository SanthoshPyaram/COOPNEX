import React, { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Wallet,
  HeartHandshake,
  Award,
  Zap,
  Shield,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export interface BenefitData {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  details: string[];
  imageUrl: string;
  workerCaption: string;
  iconColor: string;
  accentGradient: string;
  glowColor: string;
}

export const WORKER_BENEFITS: BenefitData[] = [
  {
    id: "wage-protection",
    title: "100% Wage Protection",
    badge: "0% Platform Commission",
    tagline: "Every single rupee of base labor belongs to you",
    description:
      "Unlike private corporate aggregators that extract 20% to 35% from every job, COOPNEX charges 0% commission on your base labor wage. What the customer pays goes directly to you.",
    details: [
      "Zero commission deducted from your hourly or fixed service rate",
      "Transparent minimum floor wages set by your district cooperative board",
      "Itemized digital receipt presented directly to the homeowner"
    ],
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
    workerCaption: "Rajesh S. • Certified District Electrician",
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    accentGradient: "from-emerald-500 to-teal-700",
    glowColor: "rgba(16, 185, 129, 0.25)"
  },
  {
    id: "welfare-fund",
    title: "Cooperative Welfare Fund",
    badge: "₹2,00,000 Insurance Cover",
    tagline: "Comprehensive healthcare and social security for your family",
    description:
      "Every verified artisan is enrolled in the District Cooperative Labour Welfare Board. Enjoy ₹2 Lakhs group accidental disability and life insurance, medical emergency assistance, and children's education grants.",
    details: [
      "₹2,00,000 accidental disability and life insurance cover",
      "Emergency medical assistance grants accessible within 24 hours via your society",
      "Annual cooperative dividend sharing and retirement savings pool"
    ],
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    workerCaption: "Suresh P. • Cooperative Artisan Member",
    iconColor: "text-amber-600 bg-amber-50 border-amber-200",
    accentGradient: "from-amber-500 to-orange-600",
    glowColor: "rgba(245, 158, 11, 0.25)"
  },
  {
    id: "skill-certification",
    title: "Skill Certification & Growth",
    badge: "NSQF Tier 1 to 4 Ladder",
    tagline: "Govt-aligned vocational ladder with certified master badges",
    description:
      "Level up your craft with formal vocational tier assessments. Progress from Apprentice (Level 1) to Master Craftsman (Level 4) with free cooperative workshops and unlock higher guaranteed floor earnings.",
    details: [
      "Quarterly free upskilling workshops on modern appliances and safety protocols",
      "Official holographic verification badge on your physical and smart ID card",
      "Higher base earnings floor unlocked as your certified skill tier rises"
    ],
    imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80",
    workerCaption: "Anand M. • Level 4 Master Carpenter",
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
    accentGradient: "from-blue-500 to-indigo-700",
    glowColor: "rgba(59, 130, 246, 0.25)"
  },
  {
    id: "instant-payouts",
    title: "Fast Digital UPI Payouts",
    badge: "Zero Settlement Delay",
    tagline: "Money hits your bank the moment job OTP is verified",
    description:
      "No 15-day waiting cycles or contractor withholding. As soon as the customer validates your one-time completion OTP, our automated escrow transfers 100% of your earnings directly to your UPI account.",
    details: [
      "Direct bank / UPI transfers within 0.4 seconds upon OTP validation",
      "Instant SMS and Soundbox audio confirmation in your local language",
      "Automated tax and earnings statements downloadable anytime for loan applications"
    ],
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    workerCaption: "Vikram R. • Direct UPI Payouts Daily",
    iconColor: "text-teal-600 bg-teal-50 border-teal-200",
    accentGradient: "from-teal-500 to-emerald-700",
    glowColor: "rgba(20, 184, 166, 0.25)"
  },
  {
    id: "emergency-incentives",
    title: "Emergency Service Incentives",
    badge: "+25% Rapid Response Stipend",
    tagline: "Extra earnings for critical neighborhood emergency calls",
    description:
      "Opt-in to attend emergency calls (burst pipes, main power outages, gas leaks) within 7 minutes. Receive an automatic 25% hazard and rapid-response stipend credited directly to you on top of standard rates.",
    details: [
      "+25% extra emergency response compensation automatically credited",
      "Priority customer badge highlighting your willingness to help neighbors in distress",
      "Complete freedom to accept or decline emergency calls without platform penalties"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    workerCaption: "Sunita B. • Emergency Response Tech",
    iconColor: "text-purple-600 bg-purple-50 border-purple-200",
    accentGradient: "from-purple-500 to-pink-600",
    glowColor: "rgba(168, 85, 247, 0.25)"
  },
  {
    id: "safety-legal-defense",
    title: "Worker Safety & Legal Defense",
    badge: "Society-Backed Protection",
    tagline: "Your Primary Cooperative Society stands with you on every job",
    description:
      "You are never alone at a customer's doorstep. Your local Primary Society provides immediate mediation for any customer dispute, safety SOS response, and dedicated legal assistance.",
    details: [
      "Emergency SOS button in worker app alerting nearest society stewards",
      "Free legal defense and mediation for unfair customer disputes or non-payment",
      "Respectful working guidelines strictly enforced on all customers"
    ],
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80",
    workerCaption: "Manoj V. • Society Union Steward",
    iconColor: "text-rose-600 bg-rose-50 border-rose-200",
    accentGradient: "from-rose-500 to-red-700",
    glowColor: "rgba(244, 63, 94, 0.25)"
  }
];

export const WorkerBenefitCard: React.FC<{
  benefit: BenefitData;
  index: number;
}> = ({ benefit, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 3D subtle tilt for selective cards
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 25 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
    setGlarePos({
      x: Math.round((mouseX / rect.width) * 100),
      y: Math.round((mouseY / rect.height) * 100)
    });
  };

  const isFlipCard = benefit.id === "wage-protection";

  // -------------------------------------------------------------
  // CARD TYPE 1: SELECTIVE 3D FLIP CARD (Wage Protection)
  // -------------------------------------------------------------
  if (isFlipCard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="group relative h-[480px] w-full [perspective:1200px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped || isHovered ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* FRONT FACE */}
          <div className="absolute inset-0 h-full w-full rounded-3xl bg-white p-6 sm:p-7 border border-slate-200 shadow-md flex flex-col justify-between overflow-hidden [backface-visibility:hidden]">
            {/* Top Bar */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{benefit.badge}</span>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs bg-emerald-50 border-emerald-200 text-emerald-700">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              {/* Photo Banner with Authentic Indian Trade Worker */}
              <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-slate-200 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={benefit.imageUrl}
                  alt={benefit.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-[11px] font-bold drop-shadow-md">
                    {benefit.workerCaption}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/90 text-white">
                    0% Commission
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                {benefit.tagline}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5 line-clamp-3">
                {benefit.description}
              </p>
            </div>

            {/* Bottom Footer & Flip Prompt */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Hover / Tap to See Commission Breakdown</span>
              </button>
              <span className="text-[10px] font-mono text-slate-400">FLIP 3D</span>
            </div>
          </div>

          {/* BACK FACE (Comparison vs Private Apps) */}
          <div className="absolute inset-0 h-full w-full rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 p-6 sm:p-7 text-white border border-teal-500/40 shadow-2xl flex flex-col justify-between overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-teal-500/30">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  Direct Commission Comparison
                </span>
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  Base Job: ₹1,000
                </span>
              </div>

              {/* Breakdown Stack */}
              <div className="mt-5 space-y-4">
                {/* COOPNEX */}
                <div className="p-3.5 rounded-2xl bg-emerald-900/40 border border-emerald-500/40">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      COOPNEX (Cooperative)
                    </span>
                    <span className="text-sm font-black text-emerald-400">₹1,000 Take-Home</span>
                  </div>
                  <div className="text-[11px] text-emerald-200/80 mt-1">
                    0% Commission cut • 100% of base labor is disbursed directly to your bank account instantly via OTP.
                  </div>
                </div>

                {/* Private Apps */}
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      Private Corporate Aggregators
                    </span>
                    <span className="text-sm font-black text-rose-400">₹680 – ₹720 Take-Home</span>
                  </div>
                  <div className="text-[11px] text-rose-200/80 mt-1">
                    28% to 32% platform deduction + lead fees + weekly delay penalties. You lose ₹300+ on every single job.
                  </div>
                </div>
              </div>

              {/* Annual Savings Badge */}
              <div className="mt-4 p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-[11px] text-amber-200">
                  <strong className="text-amber-300">₹24,000 to ₹36,000</strong> extra savings retained by each artisan family every year.
                </div>
              </div>
            </div>

            {/* Back face footer */}
            <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="text-teal-300 hover:text-white flex items-center gap-1.5 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to Overview</span>
              </button>
              <span className="text-[10px] text-slate-400 font-mono">100% WAGE RECLAIM</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // -------------------------------------------------------------
  // CARD TYPES 2-6: DIVERSIFIED HOVER STYLES (LIFT, SLIDE REVEAL, STACK EXPANSION)
  // -------------------------------------------------------------
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX: benefit.id === "skill-certification" ? rotateX : 0,
        rotateY: benefit.id === "skill-certification" ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative rounded-3xl bg-white p-6 sm:p-7 border border-slate-200 shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        // Interaction variations:
        benefit.id === "welfare-fund"
          ? "hover:-translate-y-2 hover:shadow-2xl hover:border-amber-400"
          : benefit.id === "skill-certification"
          ? "hover:shadow-2xl hover:border-blue-400"
          : benefit.id === "instant-payouts"
          ? "hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-400"
          : benefit.id === "emergency-incentives"
          ? "hover:-translate-y-2 hover:shadow-2xl hover:border-purple-400"
          : "hover:-translate-y-1.5 hover:shadow-xl hover:border-rose-400"
      }`}
    >
      {/* Interactive spotlight glare layer */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, ${benefit.glowColor}, transparent 70%)`
        }}
      />

      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border transition-colors shadow-2xs ${
              benefit.id === "welfare-fund"
                ? "bg-amber-50 text-amber-800 border-amber-200 group-hover:bg-amber-600 group-hover:text-white"
                : benefit.id === "skill-certification"
                ? "bg-blue-50 text-blue-800 border-blue-200 group-hover:bg-blue-600 group-hover:text-white"
                : benefit.id === "instant-payouts"
                ? "bg-teal-50 text-teal-800 border-teal-200 group-hover:bg-teal-600 group-hover:text-white"
                : benefit.id === "emergency-incentives"
                ? "bg-purple-50 text-purple-800 border-purple-200 group-hover:bg-purple-600 group-hover:text-white"
                : "bg-rose-50 text-rose-800 border-rose-200 group-hover:bg-rose-600 group-hover:text-white"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{benefit.badge}</span>
          </div>

          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-110 ${benefit.iconColor}`}
          >
            {benefit.id === "welfare-fund" && <HeartHandshake className="w-5 h-5" />}
            {benefit.id === "skill-certification" && <Award className="w-5 h-5" />}
            {benefit.id === "instant-payouts" && <Clock className="w-5 h-5" />}
            {benefit.id === "emergency-incentives" && <Zap className="w-5 h-5" />}
            {benefit.id === "safety-legal-defense" && <Shield className="w-5 h-5" />}
          </div>
        </div>

        {/* Photography Stage with Trade Worker */}
        <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4 border border-slate-200 shadow-inner group-hover:shadow-md transition-all">
          <img
            src={benefit.imageUrl}
            alt={benefit.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

          {/* Interactive Floating Micro-elements based on Benefit Type */}
          {benefit.id === "welfare-fund" && (
            <motion.div
              animate={{ y: isHovered ? -3 : 0 }}
              className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] shadow-md border border-amber-300 flex items-center gap-1"
            >
              <HeartHandshake className="w-3 h-3 text-slate-950" />
              <span>₹2L Health Cover</span>
            </motion.div>
          )}

          {benefit.id === "skill-certification" && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
              {["L1", "L2", "L3", "L4"].map((tier, idx) => (
                <span
                  key={tier}
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs ${
                    idx === 3
                      ? "bg-blue-600 text-white font-black border border-blue-400"
                      : "bg-white/80 text-slate-700 font-bold backdrop-blur-xs"
                  }`}
                >
                  {tier}
                </span>
              ))}
            </div>
          )}

          {benefit.id === "instant-payouts" && (
            <motion.div
              animate={{ x: isHovered ? [0, 4, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-black text-[10px] shadow-md border border-emerald-300 flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>0.4s UPI Speed</span>
            </motion.div>
          )}

          {benefit.id === "emergency-incentives" && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-purple-600 text-white font-black text-[10px] shadow-md border border-purple-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>7-Min SOS +25%</span>
            </div>
          )}

          {benefit.id === "safety-legal-defense" && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-[10px] shadow-md border border-rose-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Society Steward</span>
            </div>
          )}

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
            <span className="text-[11px] font-bold drop-shadow-md">
              {benefit.workerCaption}
            </span>
            <span className="text-[10px] font-semibold text-slate-200">
              Verified Artisan
            </span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0b84f3] transition-colors tracking-tight">
            {benefit.title}
          </h3>
          <p className="text-xs font-bold text-[#0b84f3] mt-1">
            {benefit.tagline}
          </p>
        </div>

        {/* Body Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5">
          {benefit.description}
        </p>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-slate-100 space-y-2"
          >
            {benefit.details.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-[#0b84f3] hover:text-blue-800 transition cursor-pointer"
        >
          <span>{isExpanded ? "Show Less" : "Cooperative Guarantee"}</span>
          <ArrowUpRight
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isExpanded ? "rotate-180 text-blue-800" : ""
            }`}
          />
        </button>

        <span className="text-[11px] font-mono text-slate-400">
          COOPNEX
        </span>
      </div>
    </motion.div>
  );
};
