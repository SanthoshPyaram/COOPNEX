import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { UserRole } from "../types";
import { Sparkles, Shield, Play, Users, Layers, Award } from "lucide-react";

export const DemoBar: React.FC = () => {
  const { role, switchDemoRoleForTesting } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const rolesList: { role: UserRole; label: string; route: string }[] = [
    { role: "CUSTOMER", label: "Customer", route: "/app" },
    { role: "WORKER", label: "Worker (Raj)", route: "/worker" },
    { role: "SOCIETY_ADMIN", label: "Society Admin", route: "/society" },
    { role: "FEDERATION_ADMIN", label: "Federation Command", route: "/federation" },
    { role: "SUPER_ADMIN", label: "Super Admin", route: "/admin" }
  ];

  const handleRoleChange = async (r: UserRole, targetRoute: string) => {
    await switchDemoRoleForTesting(r);
    navigate(targetRoute);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white text-xs border-b border-teal-800/40 px-3 py-1.5 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: SIH Demo Tag & Winning Journey Shortcut */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-400/30">
            <Award className="w-3 h-3 text-amber-400 animate-pulse" />
            SIH 2026 EVALUATION
          </span>

          <Link
            to="/demo"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-medium px-2.5 py-0.5 rounded shadow transition-all duration-200"
          >
            <Play className="w-3 h-3 fill-current text-white" />
            <span>Winning SIH Demo Journey</span>
          </Link>

          <Link
            to="/sih-showcase"
            className="hidden sm:inline-flex items-center gap-1 text-teal-200 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition"
          >
            <Sparkles className="w-3 h-3" />
            <span>Judge Showcase</span>
          </Link>

          <Link
            to="/architecture"
            className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-white px-2 py-0.5 rounded hover:bg-white/10 transition"
          >
            <Layers className="w-3 h-3" />
            <span>Architecture</span>
          </Link>
        </div>

        {/* Right: Persona Quick Switcher & Language */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/80 px-1.5 py-0.5 rounded-lg border border-slate-700">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Persona:
            </span>
            {rolesList.map((item) => (
              <button
                key={item.role}
                onClick={() => handleRoleChange(item.role, item.route)}
                className={`px-2 py-0.5 rounded font-medium transition ${
                  role === item.role
                    ? "bg-teal-600 text-white shadow-sm font-semibold"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800/80 rounded border border-slate-700 px-1 py-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-1.5 py-0.5 rounded ${language === "en" ? "bg-teal-700 text-white font-bold" : "text-slate-400"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-1.5 py-0.5 rounded ${language === "hi" ? "bg-teal-700 text-white font-bold" : "text-slate-400"}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage("te")}
              className={`px-1.5 py-0.5 rounded ${language === "te" ? "bg-teal-700 text-white font-bold" : "text-slate-400"}`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

