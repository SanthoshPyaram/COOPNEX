import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Award,
  Users,
  Wallet
} from "lucide-react";

export const WorkerFinalCta3D: React.FC = () => {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-white via-blue-50/50 to-slate-100 text-slate-900 p-8 sm:p-14 overflow-hidden shadow-2xl border border-slate-200">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0b84f3_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Inspiring Copy & CTAs (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>National Cooperative Labour Mission</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900">
            Reclaim Your Dignity, Your Voice, <br className="hidden sm:inline" />
            and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">100% of Your Hard-Earned Wage.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Stop losing 30% of your livelihood to private venture-backed platforms. Step into India’s self-reliant cooperative federation. Guaranteed district floor wages, instant UPI settlements, and comprehensive welfare protection.
          </p>

          {/* Quick Assurance Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              "100% Free Registration",
              "Zero Commission on Base Wage",
              "₹2 Lakh Insurance Cover",
              "Instant Bank Payouts"
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-semibold justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/join-worker"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0b84f3] hover:bg-[#0651a8] text-white font-black text-sm transition-all shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-3 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Join as a Verified Worker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#journey"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition text-center shadow-xs flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-blue-600" />
              <span>Review Verification Journey</span>
            </a>
          </div>

          {/* Helpline badge */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Artisan Helpdesk: 1800-COOPNEX</span>
            </div>
            <span>•</span>
            <span>Aadhaar, PAN &amp; Bank Account Required</span>
          </div>
        </div>

        {/* Right Column: Physical Human Stage with Guild Artisans & Verified Credentials (5 cols) */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 opacity-20 blur-xl" />

            {/* Composite Stage Card */}
            <div className="relative rounded-3xl bg-white p-5 border border-slate-200 shadow-xl overflow-hidden space-y-4">
              {/* Photo Showcase of Authentic Indian Artisans */}
              <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
                <img
                  src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&q=80"
                  alt="Verified Cooperative Artisans"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-black text-slate-900">
                    District Federation Verified
                  </span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <div className="text-xs font-black">All Trades Welcome</div>
                    <div className="text-[10px] text-slate-300">
                      Electrical • Plumbing • HVAC • Carpentry
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-amber-300/40">
                    ★ 4.98
                  </span>
                </div>
              </div>

              {/* Trust Pillars Micro-Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-slate-500">Commission</div>
                    <div className="text-xs font-black text-slate-900">0% Base Wage</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-slate-500">Governance</div>
                    <div className="text-xs font-black text-slate-900">1 Worker = 1 Vote</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
