import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  RotateCcw,
  Sparkles,
  Loader2
} from "lucide-react";
import { LanguageDropdown } from "../components/LanguageDropdown";
import { AnimatedCoopBackground } from "../components/animations/AnimatedCoopBackground";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";
import { ForgotPasswordModal } from "../components/auth/ForgotPasswordModal";
import { FormField } from "../components/common/FormField";
import { FormHumanCompanion } from "../components/common/FormHumanCompanion";
import { validateEmailFormat, validateRequired } from "../utils/validation";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { t } = useLanguage();

  const { login, forgotPasswordSendOtp, forgotPasswordReset } = useAuth();

  // Standard Customer Login State (Email + Password ONLY)
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);

  const getCompanionState = () => {
    if (errorMessage?.includes("not registered") || errorMessage?.includes("Invalid email")) return "INVALID_EMAIL";
    if (emailError) return "INVALID_EMAIL";
    if (passwordError) return "WEAK_PASSWORD";
    if (email && password && !emailError && !passwordError) return "VALID_FORM";
    if (email || password) return "TYPING";
    return "IDLE";
  };

  const isFormValid = Boolean(
    email.trim() &&
    !emailError &&
    password &&
    !passwordError
  );

  const handleRoleNavigation = (role: string) => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    switch (role) {
      case "CUSTOMER":
        navigate("/app");
        break;
      case "WORKER":
        navigate("/worker");
        break;
      case "SUPER_ADMIN":
        navigate("/admin");
        break;
      default:
        navigate("/app");
    }
  };

  // Submit Customer Email + Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const emailRes = validateEmailFormat(cleanEmail);
    if (!emailRes.isValid) {
      setEmailError(emailRes.error || null);
      return;
    }
    const passRes = validateRequired(password, "Password");
    if (!passRes.isValid) {
      setPasswordError(passRes.error || null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await login(cleanEmail, password, "CUSTOMER");
    setIsLoading(false);

    if (res.success && res.role) {
      handleRoleNavigation(res.role);
    } else {
      const msg = res.message || "Invalid email or password. Please check your credentials.";
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("not registered") || msg.toLowerCase().includes("email")) {
        setEmailError(msg);
      }
    }
  };

  // Dev-Only Demo Fill
  const handleAutoFillDemo = () => {
    setEmail("customer@sahakariseva.gov.in");
    setPassword("DemoPassword123!");
    setEmailError(null);
    setPasswordError(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-slate-900 overflow-hidden font-sans">
      {/* Background Ambience */}
      <AnimatedCoopBackground variant="dark" />

      {/* Top Floating Language & Home Header */}
      <div className="absolute top-4 left-4 right-4 max-w-6xl mx-auto flex items-center justify-between z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/20 transition cursor-pointer"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageDropdown variant="pill" />
        </div>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10 my-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/15 backdrop-blur-xl">
          {/* Left Brand & Trust Showcase */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-[#0A66C2] via-[#084B8A] to-[#04284D] text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-400/10 pointer-events-none" />

            <div className="relative z-10">
              <Link to="/" className="inline-block" title="COOPNEX">
                <CoopnexLogo variant="full" size="md" />
              </Link>

              <div className="mt-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-amber-300 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>National Cooperative Network</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white tracking-tight">
                  Welcome to COOPNEX
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Find verified professionals and trusted cooperative services near you.
                </p>
              </div>

              {/* Authentic Workforce Trust Card */}
              <div className="my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=240&q=80"
                  alt="Verified Cooperative Member"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>UIDAI &amp; Skill India Verified</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium mt-0.5">
                    Direct connection to certified local cooperative artisans across 28 states.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Police Cleared &amp; Certified Artisans</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Direct Take-Home with Zero Intermediary Commission</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparent Floor Wages &amp; Bharat UPI Escrow</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/15 text-[11px] text-blue-200/80 flex items-center justify-between">
              <span>PEOPLE • SKILLS • COOPERATIVES</span>
              <span>v3.0 Production</span>
            </div>
          </div>

          {/* Right Citizen Sign In Form (Email + Password ONLY) */}
          <div className="lg:col-span-7 p-7 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 transition-colors">
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Citizen Portal Access</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Sign In
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Access your doorstep bookings, order tracking, and cooperative receipts.
                </p>
              </div>

              {/* Error Alert with shake animation */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 shadow-xs"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <span className="font-medium leading-relaxed">{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Character Companion */}
              <div className="flex justify-center pb-1">
                <FormHumanCompanion state={getCompanionState()} />
              </div>

              {/* Form: Email + Password ONLY */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  id="login-email"
                  label="Email Address"
                  required
                  error={emailError}
                >
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                        const res = validateEmailFormat(e.target.value);
                        setEmailError(res.isValid ? null : (res.error || null));
                      }}
                      onBlur={() => {
                        const res = validateEmailFormat(email);
                        setEmailError(res.isValid ? null : (res.error || null));
                      }}
                      placeholder="Enter your registered email"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </FormField>

                <FormField
                  id="login-password"
                  label="Password"
                  required
                  error={passwordError}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  }
                >
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                        const res = validateRequired(e.target.value, "Password");
                        setPasswordError(res.isValid ? null : (res.error || null));
                      }}
                      onBlur={() => {
                        const res = validateRequired(password, "Password");
                        setPasswordError(res.isValid ? null : (res.error || null));
                      }}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormField>

                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full py-3 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084B8A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SIGNING IN...</span>
                    </>
                  ) : (
                    <>
                      <span>SIGN IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Development-Only Demo Credentials Helper */}
              {import.meta.env.DEV && (
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Demo Access (Local Development Only)</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillDemo}
                      className="text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:underline bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-700 shadow-2xs cursor-pointer"
                    >
                      Auto-fill Demo Account
                    </button>
                  </div>
                  <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80 mt-1">
                    Demo Account: <span className="font-mono font-semibold">customer@sahakariseva.gov.in</span>
                  </p>
                </div>
              )}

              {/* Secondary Navigation Links */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Create Citizen Account</span>
                  </Link>
                </p>

                <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between gap-2">
                  <div className="text-left">
                    <p className="font-bold text-amber-950 dark:text-amber-200 text-xs">Are you a skilled worker?</p>
                    <p className="text-[11px] text-amber-800 dark:text-amber-400">Join verified trade cooperatives or sign in with your Employee ID.</p>
                  </div>
                  <Link
                    to="/worker/login"
                    className="px-3 py-1.5 rounded-xl bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold text-xs shrink-0 shadow-2xs inline-flex items-center gap-1 transition"
                  >
                    <span>Worker Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Forgot Password Recovery Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        defaultIdentifier={email}
        portalRole="CUSTOMER"
        onSuccess={(newPass, id) => {
          setPassword(newPass);
          if (id) setEmail(id);
          setShowForgotModal(false);
        }}
      />
    </div>
  );
};

export default LoginPage;
