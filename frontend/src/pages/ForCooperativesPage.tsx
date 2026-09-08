import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  GitBranch,
  BarChart3,
  ShieldCheck,
  Users,
  Layers,
  ArrowRight,
  Sparkles,
  Scale,
  CheckCircle2,
  FileSpreadsheet,
  Globe
} from "lucide-react";

export const ForCooperativesPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-teal-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Digital Transformation for Cooperatives</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Strengthening India's Cooperative <br />
            <span className="text-amber-400">Labour Federations & Societies</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            COOPNEX equips Primary Labour Cooperative Societies and District Federations with modern digital infrastructure — automated member dispatch, inter-society workforce exchanges, and transparent wage governance.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition shadow-lg hover:shadow-amber-400/20 flex items-center justify-center gap-2"
            >
              <span>Society & Federation Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#hierarchy"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition text-center"
            >
              Learn the 3-Tier Model
            </a>
          </div>
        </div>
      </section>

      {/* 3-Tier Cooperative Governance Structure */}
      <section id="hierarchy" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            A 3-Tier Democratic Federation Architecture
          </h2>
          <p className="text-sm text-slate-600">
            Engineered in harmony with the Multi-State Co-operative Societies Act and State Cooperative Department frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="text-xs font-black tracking-wider uppercase text-teal-700 mb-2">
                Tier 1: Ground Operations
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">
                Primary Labour Societies (PACS)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Locally registered ward or mandal-level societies directly managing member livelihoods, physical verification, and community trust.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Physical KYC, Aadhaar & Skill level inspections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Local dispute conciliation & grievance resolution</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Tooling micro-loans & safety gear distribution</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-bold text-teal-800">
              Role: Society Admin Console
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-white rounded-3xl p-8 border-2 border-teal-600 shadow-md relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-8 bg-teal-700 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              Intelligence Hub
            </div>
            <div>
              <div className="text-xs font-black tracking-wider uppercase text-teal-700 mb-2">
                Tier 2: District Level
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">
                District Cooperative Federations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Apex district bodies coordinating demand across multiple primary societies, operating workforce exchanges, and managing emergency teams.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Algorithmic Workforce Exchange for surplus rebalancing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>District AI demand forecasting by skill and ward</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Welfare fund oversight & emergency insurance clearance</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-bold text-teal-800">
              Role: Federation Intelligence Console
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="text-xs font-black tracking-wider uppercase text-teal-700 mb-2">
                Tier 3: Apex Policy
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">
                State Apex Federation & Ministry
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                State-level cooperative governance ensuring statutory compliance, minimum wage adherence, and interoperability with National databases.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Statewide minimum wage notification enforcement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>Integration with e-Shram and National Skill Registry</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>State cooperative development subsidy auditing</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-bold text-teal-800">
              Role: State Governance & Ministry Console
            </div>
          </div>
        </div>
      </section>

      {/* Key Enterprise Modules */}
      <section className="bg-slate-100 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Built Specifically for Cooperative Administrations
            </h2>
            <p className="text-xs text-slate-500">
              Transforming manual paper ledgers into verified real-time digital registries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <GitBranch className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Workforce Exchange</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When one society experiences high seasonal demand and a neighbor has surplus workers, execute a 1-click inter-society loan agreement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">AI Demand Heatmap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visual geospatial density maps predict worker shortages 7 days ahead, allowing proactive batch skill training and mobilization.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Fair Wage Auditor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated compliance checks verify that no customer pays below the statutory minimum wage floor for any trade or duration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Audit & Welfare Ledger</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export comprehensive statutory financial ledgers detailing gross bookings, worker credits, and society welfare reserves in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding / Contact Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Ready to Modernize Your Cooperative?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Primary societies and district federations registered under State or Central Cooperative Acts can request digital onboarding, training, and deployment support.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-sm transition shadow-md"
          >
            Access Society Portal
          </Link>
          <a
            href="mailto:cooperatives@coopnex.org"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm transition"
          >
            Contact Department Desk
          </a>
        </div>
      </section>
    </div>
  );
};

