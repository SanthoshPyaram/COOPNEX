import React from "react";
import { Link } from "react-router-dom";
import {
  Target,
  ShieldCheck,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  Layers,
  Globe,
  Share2
} from "lucide-react";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1220] min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A66C2] via-[#004182] to-[#0B1220] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Brand Definition &amp; Architecture</span>
          </div>

          <div className="flex justify-center py-2">
            <CoopnexLogo variant="stacked" size="xl" theme="dark" showTagline />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            People. Skills. Cooperatives. Connected.
          </h1>

          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-medium">
            COOPNEX is a next-generation cooperative network that connects people, skilled workers, local services and cooperative communities into one unified, trusted ecosystem.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1. WHAT DOES COOPNEX MEAN? (BRAND FORMULA & STORY)                        */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0A66C2] dark:text-blue-400">
            Brand Identity Breakdown
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            What Does <span className="text-[#0A66C2]">COOP</span><span className="text-[#059669]">NEX</span> Mean?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            COOPNEX represents the harmonious union of cooperative collective strength and next-generation opportunity networks.
          </p>
        </div>

        {/* The COOP + NEX Formula Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* COOP Card */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-blue-900/50 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#0A66C2] flex items-center justify-center font-black text-xl font-display">
                COOP
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Cooperation &amp; Collective Strength
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Represents our grassroots cooperative foundations, democratic worker ownership, collective dignity, and mutual community welfare.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
              {["Collaboration", "Community", "Collective Strength", "Fair Wages"].map((tag) => (
                <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#0A66C2] dark:text-blue-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Plus Sign / Connection Card */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-slate-900 dark:to-slate-850 border-2 border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm mb-3">
              +
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              The Nexus Connection
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-2">
              Technology connecting people, not replacing people.
            </p>
          </div>

          {/* NEX Card */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-emerald-900/50 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-[#059669] flex items-center justify-center font-black text-xl font-display">
                NEX
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Next-Gen Network &amp; Opportunity
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Represents our real-time geospatial dispatch, intelligent matching engine, instant zero-commission digital payments, and future-ready livelihoods.
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
              {["Next-Generation", "Network", "Connection", "Continuous Opportunity"].map((tag) => (
                <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Brand Promise Banner */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-900 text-white shadow-xl text-center space-y-2">
          <p className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
            Official Brand Definition
          </p>
          <p className="text-base sm:text-lg font-bold max-w-2xl mx-auto leading-relaxed">
            &quot;COOPNEX brings these ideas together into one connected platform where people, skills and cooperative communities create and access genuine opportunities.&quot;
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE COOPNEX LOGO SYMBOL EXPLANATION                                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#0A66C2] dark:text-blue-400">
              Symbol Geometry
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              The Story Behind the COOPNEX Symbol
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Every curve of our geometric icon carries purposeful, human-centered meaning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* The Human Forms */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0A66C2] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                The Human Forms
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Represents real workers, customers, and community families. People are at the very center of everything COOPNEX designs.
              </p>
            </div>

            {/* The Connection Loop */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#059669] flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                The Connection Loop
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Represents cooperation, continuous network reliability, and shared opportunity looping workers and citizens together.
              </p>
            </div>

            {/* The Green Element */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-[#059669] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                The Green Element
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Symbolizes organic economic growth, cooperative solidarity, progressive training, and better livelihoods for informal labour.
              </p>
            </div>

            {/* The Blue Element */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0A66C2] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                The Blue Element
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Symbolizes digital trust, verified institutional integrity, statutory transparency, and secure real-time technology.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>&quot;People becoming stronger when they connect and cooperate.&quot;</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRODUCT ECOSYSTEM ARCHITECTURE                                         */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#059669] dark:text-emerald-400">
            Unified Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            The COOPNEX Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          {[
            { title: "COOPNEX Services", desc: "Customer Marketplace", icon: <Target className="w-4 h-4" /> },
            { title: "COOPNEX Workers", desc: "Artisan Empowerment", icon: <Users className="w-4 h-4" /> },
            { title: "COOPNEX Cooperatives", desc: "Federation Network", icon: <HeartHandshake className="w-4 h-4" /> },
            { title: "COOPNEX Intelligence", desc: "AI Demand & Allocation", icon: <Layers className="w-4 h-4" /> },
            { title: "COOPNEX COMMAND", desc: "Operations Console", icon: <ShieldCheck className="w-4 h-4" /> }
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0A66C2] flex items-center justify-center mx-auto">
                {item.icon}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Ready to Connect with COOPNEX?
          </h3>
          <div className="flex justify-center gap-3">
            <Link
              to="/services"
              className="px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm"
            >
              Explore Services
            </Link>
            <Link
              to="/for-workers"
              className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition shadow-sm"
            >
              Join as an Artisan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
