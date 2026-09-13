import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wrench,
  MapPin,
  UserCheck,
  CalendarCheck,
  Navigation,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  Phone,
  Building2,
  Layers,
  ChevronRight
} from "lucide-react";

interface StepData {
  step: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeColor: string;
  description: string;
  visualPreview: {
    heading: string;
    subheading: string;
    highlight: string;
    pill: string;
  };
}

export const HowCoopnexWorksContinuousPath: React.FC = () => {
  const steps: StepData[] = [
    {
      step: "01",
      title: "Choose a Service",
      subtitle: "Transparent Skilled Trades",
      badge: "SKILL SELECTION",
      icon: Wrench,
      color: "from-blue-600 to-indigo-600",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      description: "Select from certified household trades including electricians, plumbers, carpenters, appliance technicians, painters, and caregivers with clear minimum statutory floor rates.",
      visualPreview: {
        heading: "Select Trade Category",
        subheading: "Electrician • Level 4 Certified",
        highlight: "Statutory Rate: ₹350 / hr",
        pill: "Guaranteed Floor Wages"
      }
    },
    {
      step: "02",
      title: "Share Location",
      subtitle: "Hyper-local Pincode Resolution",
      badge: "GEO-PROXIMITY",
      icon: MapPin,
      color: "from-indigo-600 to-violet-600",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description: "Enter your 6-digit postal code. The platform instantly resolves state, district, mandal, and local cooperative society coverage without hardcoded whitelists.",
      visualPreview: {
        heading: "Location Resolution",
        subheading: "Vijayawada • NTR District (520001)",
        highlight: "Society: Central Labour Co-op (PLCS-04)",
        pill: "Active Coverage"
      }
    },
    {
      step: "03",
      title: "Find a Verified Worker",
      subtitle: "KYC & Background Verified",
      badge: "AUTHENTIC PROFILES",
      icon: UserCheck,
      color: "from-violet-600 to-purple-600",
      badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
      description: "Review authenticated local artisans with real uploaded profile photos, Aadhaar & Police Clearance certification, genuine customer ratings, and distance estimates.",
      visualPreview: {
        heading: "Artisan Verification",
        subheading: "Rajesh Kumar • 4.9 ★ (142 Jobs)",
        highlight: "Distance: 2.1 km • Police Cleared",
        pill: "Aadhaar + PCC Verified"
      }
    },
    {
      step: "04",
      title: "Book with Ease",
      subtitle: "Transparent Price Itemization",
      badge: "NO SURGE",
      icon: CalendarCheck,
      color: "from-purple-600 to-emerald-600",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      description: "Select date and preferred time slot. View transparent price breakdown with statutory labor, distance fuel allowance, and zero hidden platform commissions.",
      visualPreview: {
        heading: "Confirmed Schedule",
        subheading: "Today • Evening Slot (5:00 - 7:00 PM)",
        highlight: "Invoice: ₹380 Labor + ₹40 Travel",
        pill: "Zero Commission Deduction"
      }
    },
    {
      step: "05",
      title: "Worker Arrives",
      subtitle: "Smart ID & Safety Verification",
      badge: "DOORSTEP SERVICE",
      icon: Navigation,
      color: "from-emerald-600 to-teal-600",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description: "Your assigned artisan arrives wearing official cooperative insignia. Verify their authentic Smart ID card with rotating QR code before authorizing entry.",
      visualPreview: {
        heading: "Doorstep Dispatch",
        subheading: "Live GPS Tracking Active • ETA 8 mins",
        highlight: "Smart ID: COOP-WRK-52001",
        pill: "Verified On-Site"
      }
    },
    {
      step: "06",
      title: "Complete & Pay",
      subtitle: "Cooperative Escrow & Direct Pay",
      badge: "DBT SETTLEMENT",
      icon: CreditCard,
      color: "from-teal-600 to-blue-600",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      description: "Approve completed work and release escrow. 100% of fair floor wages transfer directly to the worker's wallet with zero aggregator commission.",
      visualPreview: {
        heading: "Escrow Disbursement",
        subheading: "Direct Benefit Transfer to Artisan",
        highlight: "100% Floor Wage Settled • Rating 5★",
        pill: "Secure Trust Settlement"
      }
    }
  ];

  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive Journey</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How COOPNEX Works
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From service discovery to doorstep arrival and cooperative escrow payment — follow our 6-step transparent journey built for fairness and zero exploitation.
        </p>
      </div>

      {/* Continuous Visual Path Layout */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive 6-Stage Stepper List (7 cols) */}
        <div className="lg:col-span-7 space-y-4 relative">
          {/* Vertical Connecting SVG Path */}
          <div className="absolute top-8 bottom-8 left-6 w-0.5 bg-slate-200 -z-0 hidden sm:block">
            <motion.div
              className="w-full bg-gradient-to-b from-blue-600 via-indigo-600 to-teal-600"
              initial={{ height: "0%" }}
              animate={{ height: `${(activeStepIdx / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeStepIdx;
            const isCompleted = idx < activeStepIdx;

            return (
              <div
                key={s.step}
                onClick={() => setActiveStepIdx(idx)}
                className={`relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white border-2 border-blue-600 shadow-md shadow-blue-500/10 scale-[1.01]"
                    : "bg-white/80 hover:bg-white border border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* Step Circle Node */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm transition-all duration-300 relative z-10 ${
                    isActive
                      ? `bg-gradient-to-br ${s.color} text-white shadow-md shadow-blue-500/25`
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">Step {s.step}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{s.title}</span>
                    <span className="text-xs font-normal text-slate-400 hidden sm:inline">— {s.subtitle}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Contextual Spotlight Display (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/70 to-blue-50/20 p-6 sm:p-7 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {steps[activeStepIdx].step}
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-900">
                    {steps[activeStepIdx].title}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {steps[activeStepIdx].subtitle}
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${steps[activeStepIdx].badgeColor}`}>
                {steps[activeStepIdx].badge}
              </span>
            </div>

            {/* Visual simulation card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Action Simulation
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {steps[activeStepIdx].visualPreview.pill}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-base font-black text-slate-900">
                  {steps[activeStepIdx].visualPreview.heading}
                </div>
                <div className="text-xs font-medium text-slate-600">
                  {steps[activeStepIdx].visualPreview.subheading}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-blue-600 flex items-center justify-between">
                <span>{steps[activeStepIdx].visualPreview.highlight}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Step navigation buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={activeStepIdx === 0}
                onClick={() => setActiveStepIdx((p) => Math.max(0, p - 1))}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-center"
              >
                Previous Step
              </button>

              <button
                type="button"
                disabled={activeStepIdx === steps.length - 1}
                onClick={() => setActiveStepIdx((p) => Math.min(steps.length - 1, p + 1))}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition shadow-sm disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-center"
              >
                Next Step →
              </button>
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition hover:underline"
              >
                <span>Ready to start? Browse all cooperative services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
