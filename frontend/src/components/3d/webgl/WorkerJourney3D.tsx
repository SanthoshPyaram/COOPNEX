import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  ShieldCheck,
  Compass,
  Briefcase,
  Wallet,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface JourneyStage {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  duration: string;
  keyPoints: string[];
  photoUrl: string;
  caption: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    step: 1,
    title: "Digital Registration",
    subtitle: "Simple 3-minute mobile signup",
    description:
      "Enter your certified trades, mobile number, and home district. Select your language preference and upload your basic artisan profile. Zero broker fees.",
    badge: "Step 1 • Free Signup",
    duration: "3 Minutes",
    keyPoints: [
      "Select multiple certified trades (Electrician, Plumber, AC, etc.)",
      "Zero registration fees or platform sign-up charges",
      "Available in English, Hindi, Telugu, Tamil, Marathi & Kannada"
    ],
    photoUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80",
    caption: "Instant phone registration in your regional language",
    icon: UserCheck,
    accentColor: "#075E54"
  },
  {
    step: 2,
    title: "Cooperative Verification",
    subtitle: "Aadhaar & Skill Tier Validation",
    description:
      "Visit your local Primary Society office or complete digital Aadhaar validation. Receive your official Holographic Smart ID card and initial NSQF tier.",
    badge: "Step 2 • Trust & Safety",
    duration: "Within 24 Hours",
    keyPoints: [
      "Aadhaar, PAN & police clearance verification",
      "Official Smart ID Card with unique QR code & blood group",
      "Enrollment into ₹2,00,000 accidental welfare cover"
    ],
    photoUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&q=80",
    caption: "Official verification & smart credentials issued",
    icon: ShieldCheck,
    accentColor: "#0b84f3"
  },
  {
    step: 3,
    title: "Local Job Radar Dispatches",
    subtitle: "Fair proximity matching within 5 km",
    description:
      "Turn on 'Available for Work'. Transparent job requests from nearby households appear directly on your radar with guaranteed floor rates visible upfront.",
    badge: "Step 3 • Proximity Match",
    duration: "Live on Demand",
    keyPoints: [
      "Exact distance, job scope & homeowner address preview",
      "Guaranteed district floor wage clearly visible upfront",
      "You decide which jobs to accept; zero forced penalty algorithms"
    ],
    photoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    caption: "Nearby household dispatch request received on radar",
    icon: Compass,
    accentColor: "#0284C7"
  },
  {
    step: 4,
    title: "Dignified Professional Service",
    subtitle: "Respectful doorstep execution",
    description:
      "Arrive with your cooperative safety gear and verified ID badge. Complete the service under standard cooperative rates without awkward bargaining.",
    badge: "Step 4 • Safe Execution",
    duration: "Standard Job Time",
    keyPoints: [
      "Cooperative uniform & tool safety checklist",
      "24/7 Society SOS emergency support while on duty",
      "Itemized digital receipt presented directly to homeowner"
    ],
    photoUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80",
    caption: "Certified technician completing repair under safety norms",
    icon: Briefcase,
    accentColor: "#D97706"
  },
  {
    step: 5,
    title: "Instant Digital Payout",
    subtitle: "Zero wait direct bank / UPI settlement",
    description:
      "The customer validates completion with a secure OTP. 100% of the payment is disbursed instantaneously to your linked UPI ID or bank account.",
    badge: "Step 5 • 100% Retained",
    duration: "Under 0.4 Seconds",
    keyPoints: [
      "0% platform commission deducted from your base wage",
      "Instant bank transfer + regional audio voice announcement",
      "Automated digital invoice & receipt downloaded anytime"
    ],
    photoUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80",
    caption: "Immediate 100% UPI settlement confirmed upon customer OTP",
    icon: Wallet,
    accentColor: "#059669"
  },
  {
    step: 6,
    title: "Reputation & Dividend Growth",
    subtitle: "5-Star ratings & cooperative patronage",
    description:
      "Earn customer trust to climb from Apprentice to Master tier. Eligible for annual cooperative profit dividends and democratic leadership elections.",
    badge: "Step 6 • Lifelong Growth",
    duration: "Continuous",
    keyPoints: [
      "Unlock Tier 4 Master Craftsman higher base wage floor",
      "Annual cooperative patronage dividend share from society profits",
      "Opportunity to become a District Guild Mentor and trainer"
    ],
    photoUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    caption: "Annual cooperative dividend sharing & artisan guild meeting",
    icon: TrendingUp,
    accentColor: "#7C3AED"
  }
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 180 : -180,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -180 : 180,
    opacity: 0
  })
};

export const WorkerJourney3D: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  // By default, continuously autoplay by sliding (NO autoplay toggle button)
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveStep((prev) => (prev + 1) % JOURNEY_STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const goToStep = (newStep: number) => {
    setDirection(newStep > activeStep ? 1 : -1);
    setActiveStep(newStep);
  };

  const nextStep = () => {
    setDirection(1);
    setActiveStep((prev) => (prev + 1) % JOURNEY_STAGES.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setActiveStep((prev) => (prev === 0 ? JOURNEY_STAGES.length - 1 : prev - 1));
  };

  const currentStage = JOURNEY_STAGES[activeStep];
  const Icon = currentStage.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive 6-Stage Progression</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          How You Thrive as a COOPNEX Artisan.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From simple smartphone signup to certified master status with democratic voting rights and annual cooperative dividend sharing.
        </p>
      </div>

      {/* Interactive Step Stepper Bar with Sliding Progress Line */}
      <div className="max-w-5xl mx-auto space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {JOURNEY_STAGES.map((stage, idx) => {
            const isActive = activeStep === idx;
            const StageIcon = stage.icon;

            return (
              <button
                key={stage.step}
                type="button"
                onClick={() => goToStep(idx)}
                className={`p-3 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-2 cursor-pointer relative overflow-hidden ${
                  isActive
                    ? "bg-[#0b84f3] text-white border-blue-600 shadow-md ring-2 ring-blue-400/30 scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    0{stage.step}
                  </span>
                  <StageIcon className="w-4 h-4" />
                </div>
                <div className="text-xs font-black truncate">{stage.title}</div>

                {/* Active step progress indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliding Active Stage Showcase Card */}
      <div className="max-w-5xl mx-auto overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStage.step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 280, damping: 28 },
              opacity: { duration: 0.25 }
            }}
            className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    {currentStage.badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Duration: {currentStage.duration}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {currentStage.title}
                </h3>
                <div className="text-xs sm:text-sm font-bold text-[#0b84f3]">
                  {currentStage.subtitle}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentStage.description}
                </p>

                {/* Key Points Checklist */}
                <div className="space-y-2 pt-2">
                  {currentStage.keyPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action and Arrow Controls (NO autoplay/pause button) */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <Link
                  to="/join-worker"
                  className="px-6 py-3 rounded-xl bg-[#0b84f3] hover:bg-[#0651a8] text-white font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Step {currentStage.step} Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    aria-label="Previous Step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-400 px-2">
                    0{currentStage.step} / 06
                  </span>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    aria-label="Next Step"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Photography Stage (5 cols) with smooth fitting */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[420px] bg-slate-900 overflow-hidden">
              <img
                src={currentStage.photoUrl}
                alt={currentStage.title}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

              {/* Floating Stage Emblem */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-slate-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#075E54] text-white flex items-center justify-center text-xs font-black">
                  ★
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Progression</div>
                  <div className="text-xs font-black text-slate-900">Step 0{currentStage.step} of 06</div>
                </div>
              </div>

              {/* Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-xs font-bold drop-shadow-md">
                  {currentStage.caption}
                </div>
                <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                  COOPNEX Cooperative Standard
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
