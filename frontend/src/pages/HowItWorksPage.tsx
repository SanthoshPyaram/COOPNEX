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
  Sparkles,
  Building2,
  FileCheck2,
  Lock,
  Layers,
  Award
} from "lucide-react";
import { HowCoopnexWorksContinuousPath } from "../components/home/HowCoopnexWorksContinuousPath";
import { HeroWorkflowPipeline } from "../components/home/HeroWorkflowPipeline";

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1220] min-h-screen text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Cooperative Transparency Standard</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How COOPNEX Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            A cooperative digital service network designed for fairness, trust, and zero exploitation. See how our connected pipeline links citizens, verified workers, and community cooperatives.
          </p>
        </div>

        {/* 1. Connected System Pipeline */}
        <div className="max-w-5xl mx-auto">
          <HeroWorkflowPipeline />
        </div>

        {/* 2. Interactive Continuous 6-Stage Visual Journey */}
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-8">
          <HowCoopnexWorksContinuousPath />
        </div>

        {/* 3. Fair Wage & Escrow Transparency Breakdown */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Zero Platform Deductions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Where Does Your Payment Go?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Unlike private commercial aggregators taking up to 30% commission, COOPNEX pays 100% of fair floor wages directly to the artisan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                85%
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Direct Worker Wallet</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Disbursed immediately via DBT on service approval. Full floor wage compensation for skilled hours worked.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                10%
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Artisan Welfare Fund</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pool funds PMSBY ₹5 Lakh accidental cover, tool replacement micro-grants, and artisan children scholarships.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                5%
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Society Administration</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Covers primary society audit compliance, police clearance processing, and continuous skill upskilling workshops.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Ready to Experience Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white text-center space-y-5 shadow-xl max-w-5xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mx-auto border border-white/20">
            <Award className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Experience Transparent Cooperative Services
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Support local verified trade artisans across Andhra Pradesh and Telangana with verified background certifications and direct benefit transfers.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition shadow-md cursor-pointer"
            >
              <span>Find a Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/join-worker"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-6 py-3 rounded-xl text-xs transition border border-white/20 cursor-pointer"
            >
              <span>Work With COOPNEX</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
