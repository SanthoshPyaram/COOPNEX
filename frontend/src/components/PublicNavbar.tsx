import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LanguageDropdown } from "./LanguageDropdown";
import { CoopnexLogo } from "./brand/CoopnexLogo";
import {
  Menu,
  X,
  LogOut,
  UserCheck,
  Sun,
  Moon,
  LogIn,
  Briefcase
} from "lucide-react";

export const PublicNavbar: React.FC = () => {
  const { isAuthenticated, user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Streamlined Navigation: Home, Workers, and Admin Panel (ONLY for authenticated SUPER_ADMIN)
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Workers", path: "/for-workers" },
    ...(role === "SUPER_ADMIN" ? [{ name: "Admin Panel", path: "/admin" }] : [])
  ];

  const getDashboardRoute = () => {
    if (role === "CUSTOMER") return "/app";
    if (role === "WORKER") return "/worker";
    if (role === "SOCIETY_ADMIN") return "/society";
    if (role === "FEDERATION_ADMIN") return "/federation";
    if (role === "SUPER_ADMIN") return "/admin";
    return "/app";
  };

  const isLinkActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/for-workers") return location.pathname === "/for-workers" || location.pathname === "/worker";
    if (path.includes("/admin")) return location.pathname.startsWith("/admin") || location.pathname === "/admin-portal";
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Brand Identity: COOPNEX Logo & Tagline */}
          <Link to="/" className="flex items-center group shrink-0" title="COOPNEX — People. Skills. Cooperatives. Connected.">
            <CoopnexLogo variant="full" size="md" showTagline />
          </Link>

          {/* Center Navigation Links: ONLY Home, Workers, Admin Panel */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "text-[#0A66C2] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#0A66C2] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Languages, Dark Mode, Sign In */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <LanguageDropdown variant="pill" />
            </div>

            {/* Dark Mode Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Sign In Options */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to={getDashboardRoute()}
                  className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-bold text-xs text-white bg-[#0A66C2] hover:bg-[#004182] transition shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>{user?.name?.split(" ")[0] || "Dashboard"}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0A66C2] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Sign In as Customer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>Customer Login</span>
                </Link>
                <Link
                  to="/worker/login"
                  className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold text-white bg-[#0A66C2] hover:bg-[#004182] transition shadow-xs cursor-pointer"
                  title="Sign In as Worker"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-300" />
                  <span>Worker Login</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageDropdown variant="pill" />
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-amber-400"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1220] px-4 py-4 space-y-3 shadow-xl">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                    active
                      ? "text-[#0A66C2] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 font-bold"
                      : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Sign In */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardRoute()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0A66C2] text-white font-bold text-xs shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{user?.name?.split(" ")[0] || "Dashboard"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#0A66C2]" />
                  <span>Customer Sign In</span>
                </Link>
                <Link
                  to="/worker/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0A66C2] text-white font-bold text-xs shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-300" />
                  <span>Worker Sign In</span>
                </Link>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-bold text-center">
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Register Customer
                  </Link>
                  <Link
                    to="/join-worker"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#0A66C2] dark:text-blue-300 hover:bg-blue-100"
                  >
                    Register Worker
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
