import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calculator,
  Coins,
  Droplet
} from "lucide-react";
import { WorkerHero3D } from "../components/3d/webgl/WorkerHero3D";
import { WorkerBenefitCard, WORKER_BENEFITS } from "../components/worker/WorkerBenefitCard";
import { WorkerJourney3D } from "../components/3d/webgl/WorkerJourney3D";
import { WorkerJobRadar3D } from "../components/3d/webgl/WorkerJobRadar3D";
import { WorkerEarnings3D } from "../components/3d/webgl/WorkerEarnings3D";
import { WorkerCommunityNetwork3D } from "../components/3d/webgl/WorkerCommunityNetwork3D";
import { WorkerFinalCta3D } from "../components/3d/webgl/WorkerFinalCta3D";
import { WorkerTestimonialCard, WORKER_STORIES } from "../components/worker/WorkerTestimonialCard";
import "../styles/okaygo-gig.css";

export const ForWorkersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#0b84f3] selection:text-white overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH 3D PHYSICAL HUMAN STAGE & FLOATING BADGES            */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 text-slate-900 pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        
        {/* Subtle background matrix glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#0b84f3_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none gig-halo-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Value Proposition, Action Buttons (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0b84f3] gig-blink" />
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>National Cooperative Labour Mission</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900">
              Work With Dignity. <br className="hidden sm:inline" />
              Earn With Confidence. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
                Zero Exploitative Commissions.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Join India’s first sovereign cooperative labour federation. Work directly under your local Primary Labour Society, receive guaranteed statutory floor wages, same-day instant UPI disbursals, and ₹2,00,000 accidental welfare coverage.
            </p>

            {/* Quick Assurance Checklist */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-700 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>0% Commission on Base Wage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant Bank Payouts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Holographic Smart ID</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/join-worker"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0b84f3] hover:bg-[#0651a8] text-white font-black text-sm transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Join as a Verified Worker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#calculator"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition text-center shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Calculate Your Take-Home</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Physical Human Photo Stage & Multi-layer Parallax (5 cols) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="w-full max-w-[480px]">
              <WorkerHero3D />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATUTORY TRUST & DIGNITY COUNTERS                                     */}
      {/* ========================================================================= */}
      <section className="border-b border-slate-200 bg-white py-10 shadow-xs relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            {/* Stat 1 */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all duration-300 group shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 font-mono group-hover:scale-105 transition-transform">
                0%
              </div>
              <div className="text-xs text-slate-700 font-bold uppercase tracking-wider mt-1">
                Platform Cut on Base Wage
              </div>
              <div className="text-[11px] text-slate-500">100% of your labor stays yours</div>
            </div>

            {/* Stat 2 */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all duration-300 group shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 font-mono group-hover:scale-105 transition-transform">
                ₹650/day
              </div>
              <div className="text-xs text-slate-700 font-bold uppercase tracking-wider mt-1">
                District Floor Rate
              </div>
              <div className="text-[11px] text-slate-500">Statutory minimum protection</div>
            </div>

            {/* Stat 3 */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all duration-300 group shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 font-mono group-hover:scale-105 transition-transform">
                ₹2,00,000
              </div>
              <div className="text-xs text-slate-700 font-bold uppercase tracking-wider mt-1">
                Cooperative Welfare Cover
              </div>
              <div className="text-[11px] text-slate-500">Accidental &amp; disability security</div>
            </div>

            {/* Stat 4 */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all duration-300 group shadow-xs">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono group-hover:scale-105 transition-transform flex items-center justify-center gap-1">
                <Coins className="w-6 h-6 gig-coin-bob text-emerald-500" />
                <span>Instant</span>
              </div>
              <div className="text-xs text-slate-700 font-bold uppercase tracking-wider mt-1">
                Direct UPI / Bank Payout
              </div>
              <div className="text-[11px] text-slate-500">Immediate upon OTP validation</div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY JOIN: 6 CORE BENEFIT PILLARS (WITH 3D FLIP & DIVERSIFIED HOVER)   */}
      {/* ========================================================================= */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Cooperative Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Why Cooperative Labour Beats Private Aggregator Apps
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Corporate apps extract 20% to 35% in hidden cuts, treat workers as replaceable numbers, and offer zero safety net. COOPNEX returns dignity, legal protection, and full financial security.
          </p>
        </div>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {WORKER_BENEFITS.map((benefit, index) => (
            <WorkerBenefitCard key={benefit.id} benefit={benefit} index={index} />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WORKER JOURNEY: 6-STAGE INTERACTIVE PROGRESSION PATHWAY                */}
      {/* ========================================================================= */}
      <section id="journey" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <WorkerJourney3D />
      </section>

      {/* ========================================================================= */}
      {/* 5. AUTONOMOUS JOB RADAR & WORKER PROXIMITY DISPATCH                       */}
      {/* ========================================================================= */}
      <section id="radar" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <WorkerJobRadar3D />
      </section>

      {/* ========================================================================= */}
      {/* 6. DYNAMIC EARNINGS CALCULATOR & TANGIBLE WEALTH STACK                    */}
      {/* ========================================================================= */}
      <section id="calculator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <WorkerEarnings3D />
      </section>

      {/* ========================================================================= */}
      {/* 7. COOPERATIVE GUILD CONSTELLATION & SOLIDARITY NETWORK                   */}
      {/* ========================================================================= */}
      <section id="community" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <WorkerCommunityNetwork3D />
      </section>

      {/* ========================================================================= */}
      {/* 8. REAL PEOPLE. REAL SKILLS. REAL OPPORTUNITIES. (WORKER STORIES)         */}
      {/* ========================================================================= */}
      <section id="stories" className="bg-slate-100/70 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Real People. Real Skills. Real Opportunities.</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Voices of Self-Reliant Indian Artisans
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Meet the licensed master technicians, guild leaders, and women specialists earning full statutory wages and building lifelong dignity in their own districts.
            </p>
          </div>

          {/* 4-Column Worker Testimonial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKER_STORIES.map((story, index) => (
              <WorkerTestimonialCard key={story.id} story={story} index={index} />
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. COOPERATIVE EMERGENCY BLOOD SOLIDARITY BANNER                           */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 text-white p-6 sm:p-8 border border-rose-400/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white shrink-0 shadow-lg gig-float">
              <Droplet className="w-8 h-8 fill-white text-rose-100 gig-blink" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-200" />
                <span>Cooperative Mutual Aid Registry</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Lifesaving Blood Donors Solidarity Network
              </h3>
              <p className="text-xs sm:text-sm text-rose-100 max-w-xl mt-1 leading-relaxed">
                Every worker's Smart ID records their blood group. When local citizens or fellow cooperative families face critical hospital emergencies, our proximity SOS notifies willing nearby donors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <Link
              to="/join-worker"
              className="px-6 py-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-black text-xs transition shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Enroll on Smart ID</span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-700" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL CALL TO ACTION SHOWCASE                                         */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <WorkerFinalCta3D />
      </section>

    </div>
  );
};

export default ForWorkersPage;
