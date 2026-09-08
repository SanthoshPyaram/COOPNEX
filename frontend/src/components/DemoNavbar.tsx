import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import {
  Sparkles,
  Play,
  Layers,
  Award,
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  User,
  Users,
  Building2,
  Cpu
} from "lucide-react";

export const DemoNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, switchDemoRoleForTesting } = useAuth();
  const [personaOpen, setPersonaOpen] = useState(false);

  const navLinks = [
    { label: "Evaluation Hub", path: "/demo", icon: <Cpu className="w-3.5 h-3.5" /> },
    { label: "7-Scene Winning Journey", path: "/demo/journey", icon: <Play className="w-3.5 h-3.5" /> },
    { label: "Judge Showcase", path: "/demo/showcase", icon: <Award className="w-3.5 h-3.5" /> },
    { label: "Technical Architecture", path: "/demo/architecture", icon: <Layers className="w-3.5 h-3.5" /> }
  ];

  const personas: { role: UserRole; name: string; desc: string; icon: any; route: string }[] = [
    { role: "CUSTOMER", name: "Ramesh Varma", desc: "Customer Portal", icon: <User className="w-4 h-4" />, route: "/app" },
    { role: "WORKER", name: "Raj Kumar", desc: "Level 4 Electrician", icon: <ShieldCheck className="w-4 h-4" />, route: "/worker" },
    { role: "SOCIETY_ADMIN", name: "K. Satyanarayana", desc: "Society Secretary", icon: <Users className="w-4 h-4" />, route: "/society" },
    { role: "FEDERATION_ADMIN", name: "P. Venkat Rao", desc: "District Federation", icon: <Building2 className="w-4 h-4" />, route: "/federation" },
    { role: "SUPER_ADMIN", name: "National Registrar", desc: "Ministry Console", icon: <Cpu className="w-4 h-4" />, route: "/admin" }
  ];

  const handleSelectPersona = async (p: typeof personas[0]) => {
    setPersonaOpen(false);
    await switchDemoRoleForTesting(p.role);
    navigate(p.route);
  };

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & SIH Evaluator Tag */}
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold mr-2 transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit to Public</span>
            </Link>

            <Link to="/demo" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                SIH
              </div>
              <span className="font-display font-black text-sm tracking-tight text-white hidden md:block">
                COOP<span className="text-emerald-400">NEX</span>
              </span>
            </Link>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/30">
              EVALUATION HUB
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isActive
                      ? "bg-teal-700 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPersonaOpen(!personaOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-slate-300">Active Persona:</span>
              <span className="text-amber-300 uppercase">{user?.role || "CUSTOMER"}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {personaOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Role & Jump to Portal
                </div>
                {personas.map((p) => (
                  <button
                    key={p.role}
                    onClick={() => handleSelectPersona(p)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-800 transition flex items-center gap-3 text-slate-200"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-800 text-amber-400">
                      {p.icon}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

