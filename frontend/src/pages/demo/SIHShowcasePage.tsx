import React from "react";
import { Link } from "react-router-dom";
import { DemoNavbar } from "../../components/DemoNavbar";
import {
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  MapPin,
  HeartHandshake,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
  Play,
  Layers,
  FileText
} from "lucide-react";

export const SIHShowcasePage: React.FC = () => {
  const criteria = [
    {
      title: "1. Problem Understanding",
      desc: "Millions of skilled cooperative workers (electricians, plumbers, caregivers) remain underutilized while private aggregators extract 25-35% commission and deny social security. Cooperatives have local trust but lack modern digital public infrastructure."
    },
    {
      title: "2. The Cooperative Solution",
      desc: "A cooperative-owned digital marketplace platform uniting Labour Federations, Primary Societies, and certified workers into a unified digital ecosystem where workers are shareholders, not gig commodities."
    },
    {
      title: "3. How It Works (End-to-End)",
      desc: "Customer Service Request ➔ 2dsphere Geo-Spatial Search ➔ AI Multi-Objective Match Score (96%) ➔ Transparent Booking ➔ Escrow Payment ➔ Direct Worker Wage Disbursement (84%) ➔ Co-op Welfare Fund ➔ Federation AI Demand Balancing."
    },
    {
      title: "4. Key Innovations",
      desc: "1. Mathematical Fair Wage Engine; 2. Cooperative Workforce Exchange (cross-society surplus-deficit load balancing); 3. 5-Tier Verification Badge; 4. Explainable AI Match Score ('Why This Worker?')."
    },
    {
      title: "5. Artificial Intelligence Engine",
      desc: "Python FastAPI microservice using scikit-learn GradientBoosting time-series forecasting, statistical demand surge anomaly detection (+144%), and bipartite workforce allocation optimization."
    },
    {
      title: "6. Geo-Spatial Intelligence",
      desc: "Native MongoDB 2dsphere spatial indexing with GeoJSON Point representation, radius constraints, and real-time street transit ETA decay modeling."
    },
    {
      title: "7. Fair Wage Engine",
      desc: "Zero hidden commission. Formula: Base Wage + Skill Tier Premium + Experience Bonus + Transit Fuel Allowance + Emergency Dispatch Premium = 100% Direct Take-Home. Plus 12% transparently retained for member healthcare."
    },
    {
      title: "8. Worker Welfare & Insurance",
      desc: "Embedded Pradhan Mantri Suraksha Bima Yojana (PMSBY) + PM-JAY coverage (₹5,00,000 accidental cover), subsidized toolkit grants, and children's polytechnic scholarships."
    },
    {
      title: "9. Cooperative Hierarchy",
      desc: "State Federation (Macro demand forecasting, inter-society exchange, welfare corpus) ➔ Primary Labour Society (Worker verification, local shift roster, grievance redressal) ➔ Cooperative Workers."
    },
    {
      title: "10. Social & Economic Impact",
      desc: "Replaces precarious gig labor with formal cooperative equity, increasing daily worker income by 32%, ensuring guaranteed insurance coverage, and building verifiable digital trade credentials."
    },
    {
      title: "11. Scalability & DPI Architecture",
      desc: "Built as modular Digital Public Infrastructure (DPI) ready for nationwide rollout across all 28 states and union territories under Ministry of Cooperation guidelines."
    },
    {
      title: "12. Technology Architecture",
      desc: "React 18 + TypeScript + Tailwind CSS + Framer Motion frontend; Node.js + Express + TypeScript backend; MongoDB Atlas with 2dsphere indexes; Python FastAPI ML forecasting microservice."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <DemoNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-950 to-teal-950 text-white p-8 rounded-3xl border border-teal-900 shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              SMART INDIA HACKATHON 2026 • 3-MINUTE EVALUATION SHOWCASE
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              COOPNEX: EXECUTIVE SUMMARY
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cooperative Labour Digital Service Marketplace Platform. Empowering Workers. Strengthening Cooperatives. Serving Communities.
            </p>
          </div>

          <Link
            to="/demo/journey"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2 text-sm flex-shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Winning Demo Story</span>
          </Link>
        </div>

        {/* 12 Official SIH Evaluation Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {criteria.map((c, idx) => (
            <div
              key={idx}
              className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xs hover:border-teal-500 transition space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <h3 className="font-black text-white text-sm">{c.title}</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Architecture & Live Demo CTAs */}
        <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              Ready to verify the working full-stack implementation?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Experience the 1-click live walkthrough from customer emergency request to federation surplus reallocation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/demo/architecture"
              className="px-5 py-3 rounded-xl border border-slate-600 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4" /> System Architecture
            </Link>

            <Link
              to="/demo/journey"
              className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-black text-xs transition shadow-md flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-current text-amber-300" /> Start Interactive Walkthrough
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

