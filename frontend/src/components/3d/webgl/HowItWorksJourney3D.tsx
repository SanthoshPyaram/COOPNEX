import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  Send,
  Wrench,
  CheckCircle2,
  Play,
  Pause,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  UserCheck,
  CreditCard,
  MapPin
} from "lucide-react";

export interface StepData {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  stat: string;
  icon: React.ElementType;
  themeColor: string;
  checkpointLabel: string;
  eta: string;
  photoUrl: string;
  keyPoints: string[];
}

export const ROAD_STEPS: StepData[] = [
  {
    id: 1,
    number: "01",
    title: "Citizen Request & Pincode Match",
    subtitle: "Automated Society Match",
    badge: "Instant Mapping",
    description: "Citizen selects certified trade or speaks in native voice. Automated dispatch engine assigns nearest Primary Labour Cooperative within 1.5 km radius.",
    stat: "< 30 sec auto-allocation",
    icon: Search,
    themeColor: "from-blue-600 to-indigo-600",
    checkpointLabel: "CHECKPOINT 1 • BOOKING",
    eta: "0 Mins",
    photoUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80",
    keyPoints: [
      "Zero registration charges or surge markup for citizens",
      "Instant allocation to certified primary society within 1.5 km",
      "Multilingual voice search in 10 Indian languages"
    ]
  },
  {
    id: 2,
    number: "02",
    title: "Society Biometric & Police Verification",
    subtitle: "UIDAI Verhoeff Cleared",
    badge: "100% Vetted",
    description: "Local society confirms technician's Aadhaar Verhoeff biometric KYC, State Skill Council NSQF Level-4 trade badge, and police record clearance.",
    stat: "Zero Proxy Artisans",
    icon: ShieldCheck,
    themeColor: "from-emerald-600 to-teal-600",
    checkpointLabel: "CHECKPOINT 2 • VERIFIED",
    eta: "+2 Mins",
    photoUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&q=80",
    keyPoints: [
      "Physical tool kit check and safety protocol audit",
      "Govt-recognized trade certification badge",
      "Active ₹5 Lakh accidental insurance cover active"
    ]
  },
  {
    id: 3,
    number: "03",
    title: "7-Minute Rapid Electric Fleet Transit",
    subtitle: "Live GPS Road Navigation",
    badge: "Electric Fleet",
    description: "Technician departs immediately on electric two-wheeler with diagnostic toolkit. Citizen tracks live road movement on map with real-time ETA.",
    stat: "7-Min Average SLA",
    icon: Send,
    themeColor: "from-amber-600 to-orange-600",
    checkpointLabel: "CHECKPOINT 3 • EN ROUTE",
    eta: "+5 Mins",
    photoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    keyPoints: [
      "Green EV fleet dispatch reduces urban carbon footprint",
      "Continuous live telemetry sharing for household safety",
      "Artisan brings standard cooperative toolbank inventory"
    ]
  },
  {
    id: 4,
    number: "04",
    title: "Doorstep Arrival & 4-Digit Handshake OTP",
    subtitle: "Encrypted Safety Handshake",
    badge: "Double Authenticated",
    description: "Worker presents photo ID badge and cooperative uniform. Work begins strictly after citizen enters their encrypted 4-digit safety OTP.",
    stat: "Statutory Floor Pricing",
    icon: Wrench,
    themeColor: "from-purple-600 to-indigo-600",
    checkpointLabel: "CHECKPOINT 4 • DOORSTEP",
    eta: "+7 Mins",
    photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    keyPoints: [
      "Clear rate card pre-approved with zero hidden surcharges",
      "Official photo ID badge and verified uniform inspectable",
      "Emergency SOS button available for both parties"
    ]
  },
  {
    id: 5,
    number: "05",
    title: "Direct Bharat UPI Escrow Settlement",
    subtitle: "0% Commission Direct Payout",
    badge: "Zero Cuts",
    description: "Post-repair inspection completed with before/after photos. 100% of fair floor wage releases instantly into worker's cooperative DBT Jan Dhan account.",
    stat: "100% to Worker Family",
    icon: CheckCircle2,
    themeColor: "from-emerald-600 to-green-600",
    checkpointLabel: "CHECKPOINT 5 • SETTLED",
    eta: "+15 Mins",
    photoUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80",
    keyPoints: [
      "Zero platform cut deducted from worker wage",
      "Instant soundbox audio confirmation in local language",
      "Citizen receives official GST-compliant cooperative invoice"
    ]
  }
];

export const HowItWorksJourney3D: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [tourSpeed, setTourSpeed] = useState<"slow" | "normal" | "fast">("normal");

  const speedIntervals = {
    slow: 6500,
    normal: 4500,
    fast: 2800
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ROAD_STEPS.length);
    }, speedIntervals[tourSpeed]);
    return () => clearInterval(timer);
  }, [isPlaying, tourSpeed]);

  const currentStep = ROAD_STEPS[activeStep];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % ROAD_STEPS.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + ROAD_STEPS.length) % ROAD_STEPS.length);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Controls Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50/60 via-white to-emerald-50/40 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#075E54] animate-pulse" />
            <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">
              Interactive 5-Stage Doorstep Journey
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Transparent, vetted, and sovereign from booking to direct Bharat UPI release.
          </p>
        </div>

        {/* Speed & Auto-Slide Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl text-xs font-mono shadow-2xs">
            {(["slow", "normal", "fast"] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setTourSpeed(spd)}
                className={`px-2.5 py-1 rounded-lg capitalize transition cursor-pointer ${
                  tourSpeed === spd
                    ? "bg-[#075E54] text-white font-bold shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {spd}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#075E54] hover:bg-[#064e46] text-white font-bold text-xs shadow-md shadow-[#075E54]/20 transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Drive</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step Progress Indicators Strip */}
      <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50/70 divide-x divide-slate-200">
        {ROAD_STEPS.map((step, idx) => {
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-3 text-left transition cursor-pointer relative ${
                isActive
                  ? "bg-white text-[#075E54] font-black shadow-xs"
                  : "hover:bg-slate-100/70 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 ${
                    isActive
                      ? "bg-[#075E54] text-white"
                      : isPassed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isPassed ? "✓" : step.number}
                </span>
                <span className="text-xs font-bold truncate hidden md:inline">
                  {step.title.split("&")[0]}
                </span>
              </div>
              {isActive && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#075E54]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage with Realistic Photography & Framer Motion Transitions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: Realistic Step Photography */}
        <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[400px] bg-slate-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <img
                src={currentStep.photoUrl}
                alt={currentStep.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Badges on image */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#075E54] border border-emerald-300 text-xs font-bold shadow-md">
              <StepIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentStep.checkpointLabel}</span>
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-mono">
              <Clock className="w-3 h-3" />
              <span>ETA {currentStep.eta}</span>
            </span>
          </div>

          {/* Bottom Headline on Image */}
          <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
            <div className="inline-block px-2.5 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-xs font-mono text-emerald-300 font-bold mb-1">
              {currentStep.badge}
            </div>
            <h4 className="text-xl font-black drop-shadow-sm text-white">
              {currentStep.title}
            </h4>
          </div>

          {/* Previous / Next buttons */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition cursor-pointer"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition cursor-pointer"
            aria-label="Next step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Step Details & Trust Points */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white to-slate-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {currentStep.subtitle}
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {currentStep.stat}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentStep.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {currentStep.description}
            </p>

            {/* Key trust bullets */}
            <div className="space-y-2.5 pt-2">
              {currentStep.keyPoints.map((pt) => (
                <div key={pt} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-mono">
              Step {currentStep.id} of {ROAD_STEPS.length}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[#075E54] hover:bg-[#064e46] text-white font-bold text-xs shadow-md shadow-[#075E54]/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{currentStep.id === ROAD_STEPS.length ? "Restart Tour" : "Next Milestone"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
