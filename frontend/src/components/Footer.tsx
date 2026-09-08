import { CoopnexLogo } from "./brand/CoopnexLogo";
import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Heart, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center">
              <CoopnexLogo variant="full" size="md" theme="dark" showTagline />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A cooperative-powered digital network that connects people, skilled workers, and local services.
              Empowering skilled informal workers with collective ownership, fair wages,
              social security, and digital public infrastructure.
            </p>
            <div className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
              <span>Under Ministry of Cooperation Guidelines</span>
            </div>
          </div>

          {/* Col 2: Cooperative Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Cooperative System
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/customer" className="hover:text-teal-400 transition">
                  Verified Worker Services
                </Link>
              </li>
              <li>
                <Link to="/customer?tab=emergency" className="hover:text-amber-400 transition">
                  🚨 7-Min Emergency Response
                </Link>
              </li>
              <li>
                <Link to="/worker" className="hover:text-teal-400 transition">
                  Worker Welfare & Insurance
                </Link>
              </li>
              <li>
                <Link to="/federation" className="hover:text-teal-400 transition">
                  Workforce Exchange Engine
                </Link>
              </li>
              <li>
                <Link to="/sih-showcase" className="hover:text-teal-400 transition">
                  Fair Wage Formula Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Administrative Federation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Governance & Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/society-admin" className="hover:text-teal-400 transition">
                  Society Verification Queue
                </Link>
              </li>
              <li>
                <Link to="/federation" className="hover:text-teal-400 transition">
                  Cooperative Intelligence Center
                </Link>
              </li>
              <li>
                <Link to="/federation" className="hover:text-teal-400 transition">
                  GIS Demand Heatmap
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="hover:text-teal-400 transition">
                  System Architecture
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-teal-400 transition">
                  Live SIH Demonstration Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: SIH 2026 Innovation Badge */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Smart India Hackathon 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Designed as scalable National Digital Public Infrastructure (DPI) integrating
              FastAPI scikit-learn demand forecasting, MongoDB 2dsphere GIS matching, and transparent fair wage algorithms.
            </p>
            <div className="text-[10px] text-slate-400 border-t border-slate-700 pt-2 flex items-center justify-between">
              <span>National Prototype</span>
              <span className="text-amber-400 font-semibold">SIH Grand Finale</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 COOPNEX. Cooperative Labour Digital Service Marketplace Platform.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
            <span>for Indian Labour Cooperative Federations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

