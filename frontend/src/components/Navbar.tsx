import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { ShieldCheck, Zap, User, Menu, X, CheckCircle2, ChevronRight } from "lucide-react";
import { CoopnexLogo } from "./brand/CoopnexLogo";

export const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: t("nav.home") || "Home", path: "/" },
    { name: "Workers", path: "/for-workers" },
    { name: "Admin Panel", path: role === "SUPER_ADMIN" ? "/admin" : "/admin/login" }
  ];

  return (
    <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo: COOPNEX */}
          <Link to="/" className="flex items-center group">
            <CoopnexLogo variant="full" size="md" showTagline />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-teal-800 bg-teal-50/80 font-semibold"
                      : "text-slate-600 hover:text-teal-700 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions: Emergency Callout & User Info */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/customer?tab=emergency"
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition duration-150 animate-pulse hover:animate-none"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>🚨 7m Emergency</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs">
                {user?.name ? user.name[0] : "U"}
              </div>
              <div className="text-left leading-none">
                <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                  {user?.name || "Guest"}
                </div>
                <div className="text-[10px] text-teal-700 font-medium">
                  {role ? role.replace("_", " ") : "USER"}
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-50"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 mt-2">
            <Link
              to="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-teal-700 text-white font-medium py-2 rounded-md"
            >
              Run Winning SIH Demo Journey
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

