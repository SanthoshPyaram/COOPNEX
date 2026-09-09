import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  CreditCard,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Transparent Experience
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How COOPNEX Works
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            A cooperative digital service marketplace designed for fairness, trust, and zero exploitation. Here is how our platform connects you with authenticated local trade workers.
          </p>
        </div>

        {/* 4 Steps Visual Flow */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl border border-slate-200 bg-stone-50/60 flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0">
              01
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Select Your Required Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose from verified household trades including electricians, plumbers, carpenters, painters, caregivers, and technicians. Describe your requirement in plain language and specify your location.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200 bg-stone-50/60 flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0">
              02
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Review Verified Cooperative Workers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our hyper-local matching engine displays verified members of local Labour Cooperative Societies within your neighborhood. Every profile displays verified skill tier levels, certifications, authentic customer ratings, and response times.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200 bg-stone-50/60 flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0">
              03
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Inspect Transparent Fair Wage Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before confirming your booking, our Fair Wage Engine itemizes the exact calculation: Base wage, skill certification premium, experience bonus, and travel fuel allowance. Zero hidden commissions.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200 bg-stone-50/60 flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0">
              04
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Secure Escrow & Direct Worker Pay</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your payment is securely held in cooperative trust until the job is completed. Once marked complete, 85% of your invoice is disbursed directly to the worker's wallet, with the remaining balance funding member medical insurance and tool replacement grants.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to book a verified worker?</h2>
          <p className="text-xs text-blue-100 max-w-md mx-auto">
            Experience community-owned digital services with complete transparency.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition"
          >
            <span>Browse Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

