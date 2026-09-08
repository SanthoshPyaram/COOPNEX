import React from "react";
import { Link } from "react-router-dom";
import { DemoNavbar } from "../../components/DemoNavbar";
import {
  Layers,
  Server,
  Database,
  Cpu,
  Smartphone,
  ShieldCheck,
  Zap,
  ArrowDown,
  ArrowRight,
  Sparkles,
  ExternalLink
} from "lucide-react";

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      <DemoNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="bg-teal-900 text-teal-300 border border-teal-600/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            System Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            COOPNEX TECHNICAL ARCHITECTURE
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Multi-tiered Digital Public Infrastructure (DPI) decoupled into a reactive React PWA frontend, an Express TypeScript REST backend, MongoDB 2dsphere spatial data store, and a Python scikit-learn AI microservice.
          </p>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-8 rounded-3xl space-y-8 backdrop-blur-md">
          {/* Layer 1: Client Interfaces */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                1. Multi-Persona Client Interfaces (React 18 + Vite + Tailwind + Framer Motion)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-1.5">
                <span className="text-[10px] text-teal-400 font-bold uppercase">Customer App</span>
                <h4 className="font-bold text-sm text-white">Citizen Portal</h4>
                <p className="text-[11px] text-slate-400">
                  Geo-search, 4-step booking flow, 🚨 7m Emergency, transparent Fair Wage invoice, multilingual (EN/HI/TE).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-1.5">
                <span className="text-[10px] text-amber-400 font-bold uppercase">Worker App</span>
                <h4 className="font-bold text-sm text-white">Worker Dashboard</h4>
                <p className="text-[11px] text-slate-400">
                  Real-time status stepper, Worker Wallet (zero platform deduction), 5-tier verification, Welfare Center & PMSBY claims.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-1.5">
                <span className="text-[10px] text-blue-400 font-bold uppercase">Society Admin</span>
                <h4 className="font-bold text-sm text-white">Primary Society Console</h4>
                <p className="text-[11px] text-slate-400">
                  Trade skill verification queue, local shift roster, grievance redressal, and society revenue tracking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-1.5">
                <span className="text-[10px] text-purple-400 font-bold uppercase">Federation Admin</span>
                <h4 className="font-bold text-sm text-white">Intelligence Center</h4>
                <p className="text-[11px] text-slate-400">
                  Statewide GIS demand heatmap, AI 7-day forecasting, and 1-click Cooperative Workforce Exchange approval.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-teal-400">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>

          {/* Layer 2: Backend REST API Gateway */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                2. Backend API & Core Business Services (Node.js + Express + TypeScript)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-1.5">
                <span className="text-[10px] text-teal-400 font-bold uppercase">Security & Auth</span>
                <h4 className="font-bold text-sm text-white">RBAC & JWT Middleware</h4>
                <p className="text-[11px] text-slate-400">
                  Enforces strict access control for 5 roles: CUSTOMER, WORKER, SOCIETY_ADMIN, FEDERATION_ADMIN, SUPER_ADMIN.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 space-y-1.5 bg-emerald-950/20">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Core SIH Innovation</span>
                <h4 className="font-bold text-sm text-white">Fair Wage Calculation Engine</h4>
                <p className="text-[11px] text-slate-300">
                  Decoupled business rules calculating Base Wage + Skill Tier + Experience + Fuel Allowance + Co-op Health Fund.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-1.5">
                <span className="text-[10px] text-blue-400 font-bold uppercase">Geospatial Service</span>
                <h4 className="font-bold text-sm text-white">Haversine & Routing Engine</h4>
                <p className="text-[11px] text-slate-400">
                  Spherical trigonometry, dynamic street speed transit modeling, and bounding box polygon queries.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center text-teal-400">
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </div>

          {/* Layer 3 & 4: Data Layer & AI Microservice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                  3. MongoDB Atlas / Local MongoDB
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>• <strong>2dsphere Spatial Indexing:</strong> Real-time `$near` and `$geoWithin` worker searches.</li>
                <li>• <strong>Collections:</strong> users, workers, federations, societies, bookings, invoices, welfare, demandRecords.</li>
                <li>• <strong>Immutable Audit Logs:</strong> Tracking every verification elevation and workforce exchange approval.</li>
              </ul>
            </div>

            {/* AI Microservice */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/50 space-y-3 bg-purple-950/20">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                  4. Python FastAPI AI Microservice (Port 8000)
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>• <strong>Scikit-Learn Forecaster:</strong> GradientBoosting time-series regressor with weather & seasonal features.</li>
                <li>• <strong>Multi-Objective Matcher:</strong> Normalized scoring (0-100%) and "Why This Worker?" explainability tags.</li>
                <li>• <strong>Workforce Exchange Engine:</strong> Bipartite surplus-deficit optimization for cross-society redeployment.</li>
                <li>• <strong>Surge Anomaly Detector:</strong> Rolling z-score spike detection (+144% alert).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security & Data Privacy Box */}
        <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Cybersecurity & Sensitive Personal Data Protection (DPDP Act 2023)</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            All worker biometric Aadhaar tokens and customer payment credentials are strictly isolated.
            Secrets are managed exclusively via environment variables. The API strictly forbids exposing passwords, tokens, or unmasked identification numbers in client payloads.
          </p>
        </div>
      </main>
    </div>
  );
};

