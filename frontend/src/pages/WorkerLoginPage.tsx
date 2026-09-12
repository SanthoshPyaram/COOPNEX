import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Briefcase,
  Wrench,
  Zap,
  Check,
  UserCheck,
  Award,
  Users
} from "lucide-react";
import { AnimatedCoopBackground } from "../components/animations/AnimatedCoopBackground";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";
import { LanguageDropdown } from "../components/LanguageDropdown";
import { ForgotPasswordModal } from "../components/auth/ForgotPasswordModal";
import { ForgotEmployeeIdModal } from "../components/auth/ForgotEmployeeIdModal";
import { FormField } from "../components/common/FormField";
import { FormHumanCompanion } from "../components/common/FormHumanCompanion";
import { validateEmailFormat, validateRequired } from "../utils/validation";

const tradeBadges = [
  { label: "Electrician", icon: "⚡" },
  { label: "Plumber", icon: "🔧" },
  { label: "Carpenter", icon: "🪚" },
  { label: "Technician", icon: "🛠️" },
  { label: "Painter", icon: "🎨" },
  { label: "Driver", icon: "🚗" },
  { label: "Caregiver", icon: "🤝" }
];

export const WorkerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/worker";

  const { workerLogin, forgotPasswordSendOtp, forgotPasswordReset } = useAuth();

  // Worker Credentials
  const [employeeId, setEmployeeId] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Modals State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showForgotIdModal, setShowForgotIdModal] = useState(false);

  const getCompanionState = () => {
    if (isSuccess) return "SUCCESS";
    if (errorMessage?.includes("not registered") || errorMessage?.includes("Invalid email")) return "INVALID_EMAIL";
    if (employeeIdError) return "INVALID_EMAIL";
    if (passwordError) return "WEAK_PASSWORD";
    if (employeeId && password && !employeeIdError && !passwordError) return "VALID_FORM";
    if (employeeId || password) return "TYPING";
    return "IDLE";
  };

  const isFormValid = Boolean(
    employeeId.trim() &&
    !employeeIdError &&
    password &&
    !passwordError
  );

  const validateWorkerIdOrEmail = (val: string): { isValid: boolean; error?: string } => {
    const clean = val.trim();
    if (!clean) {
      return { isValid: false, error: "❌ Employee ID or registered email is required. 🪪" };
    }
    if (clean.includes("@")) {
      return validateEmailFormat(clean);
    }
    if (clean.length < 3) {
      return { isValid: false, error: "❌ Please enter a valid Employee ID (minimum 3 characters). 🪪" };
    }
    return { isValid: true };
  };

  // Submit Worker Login with Employee ID or Email & Password
  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = employeeId.trim();
    const idCheck = validateWorkerIdOrEmail(cleanInput);
    if (!idCheck.isValid) {
      setEmployeeIdError(idCheck.error || null);
      return;
    }
    const passCheck = validateRequired(password, "Password");
    if (!passCheck.isValid) {
      setPasswordError(passCheck.error || null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await workerLogin(cleanInput, password);
    setIsLoading(false);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate(redirectUrl);
      }, 600);
    } else {
      const msg = res.message || "Invalid Employee ID or password. Please try again.";
      setErrorMessage(msg);
      if (msg.toLowerCase().includes("id") || msg.toLowerCase().includes("not found")) {
        setEmployeeIdError(msg);
      }
    }
  };

  return (
    <AnimatedCoopBackground className="min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Utility Bar with Language Switcher */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between mb-4 px-2">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#2563EB] transition">
          <span>&larr; Back to COOPNEX Home</span>
        </Link>
        <LanguageDropdown variant="pill" />
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-white/95 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]"
        >
          {/* ========================================================== */}
          {/* LEFT COLUMN: REALISTIC HUMAN-CENTERED WORKFORCE SHOWCASE */}
          {/* ========================================================== */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#2563EB] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Glow Accents */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand & Hero Message */}
            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-3 group" title="COOPNEX Home">
                <CoopnexLogo variant="full" size="md" theme="dark" showTagline />
              </Link>

              <div className="mt-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-[#F59E0B] text-xs font-black">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>National Cooperative Workforce Gateway</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white tracking-tight">
                  WORK WITH DIGNITY.<br />
                  <span className="text-[#F59E0B]">EARN WITH CONFIDENCE.</span>
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Join verified trade cooperatives across India. Receive fair opportunities, transparent earnings, and continuous job dispatch.
                </p>
              </div>

              {/* Skilled Trades Badges */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {tradeBadges.map((trade) => (
                  <span
                    key={trade.label}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition text-[11px] font-bold text-white/95 border border-white/15"
                  >
                    <span>{trade.icon}</span>
                    <span>{trade.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Realistic Human Worker Visuals & Trust Strip */}
            <div className="relative z-10 mt-6 pt-6 border-t border-white/15 space-y-4">
              {/* Layered 3D Human Photography Cards */}
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                    alt="Certified Indian Electrician"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-lg group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-white">
                    Verified
                  </span>
                </div>
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
                    alt="Certified Female Technician"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-lg group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-[#2563EB] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-white">
                    Level 4
                  </span>
                </div>
                <div className="relative group">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                    alt="Certified Plumber"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-lg group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-white">
                    Co-op
                  </span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>100% Direct Payouts &bull; Zero Commission Deductions</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>₹5,00,000 State Accidental Insurance Coverage</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>Statutory Floor Rate Guarantee (From ₹300/hr)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT COLUMN: WORKER AUTHENTICATION (EMPLOYEE ID + PASS) */}
          {/* ========================================================== */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
            <div>
              {/* Header with Switcher to Customer */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#2563EB] mb-1">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Worker Portal</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Worker Sign In
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Enter your cooperative credentials to access your dispatch dashboard.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-500 hover:text-[#2563EB] flex items-center gap-1 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                  title="Switch to Customer Sign In"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Customer Sign In</span>
                </Link>
              </div>

              {/* Interactive Character Companion */}
              <div className="flex justify-center pb-2">
                <FormHumanCompanion state={getCompanionState()} />
              </div>

              {/* Dedicated Employee ID Sign In Form */}
              <div className="mt-4">
                <form onSubmit={handleWorkerSubmit} className="space-y-4">
                  {/* Error Notification Alert with Gentle Shake Animation */}
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: [0, -4, 4, -4, 4, 0] }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        role="alert"
                        className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 shadow-xs"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="flex-1 leading-relaxed">
                          <strong className="font-bold block text-rose-900">Authentication Failed:</strong>
                          <span>{errorMessage}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Field 1: Employee ID or Registered Email */}
                  <FormField
                    id="worker-employee-id"
                    label="Employee ID or Registered Email"
                    required
                    error={employeeIdError}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowForgotIdModal(true)}
                        className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        Forgot Employee ID?
                      </button>
                    }
                  >
                    <div className="relative">
                      <div className="absolute left-3.5 top-3 text-slate-400 font-mono text-xs font-bold">
                        ID:
                      </div>
                      <input
                        id="worker-employee-id"
                        type="text"
                        required
                        autoComplete="username"
                        placeholder="e.g. COOP-WRK-1234 or your email"
                        value={employeeId}
                        onChange={(e) => {
                          setEmployeeId(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                          const res = validateWorkerIdOrEmail(e.target.value);
                          setEmployeeIdError(res.isValid ? null : (res.error || null));
                        }}
                        onBlur={() => {
                          const res = validateWorkerIdOrEmail(employeeId);
                          setEmployeeIdError(res.isValid ? null : (res.error || null));
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 font-mono tracking-wider placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white transition shadow-xs"
                      />
                    </div>
                  </FormField>
                  <p className="text-[11px] text-slate-500 -mt-2">
                    Format: <span className="font-mono text-slate-700">COOP-EMP-0001</span>, <span className="font-mono text-slate-700">COOP-WRK-XXXX</span>, or your registered email.
                  </p>

                  {/* Field 2: Password */}
                  <FormField
                    id="worker-password"
                    label="Password"
                    required
                    error={passwordError}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    }
                  >
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        id="worker-password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••••••"
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
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white transition shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormField>

                  {/* Submit Button with Loading & Success States */}
                  <button
                    type="submit"
                    disabled={isLoading || isSuccess || !isFormValid}
                    className={`w-full font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white"
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2 text-xs">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>SIGNING IN AS WORKER...</span>
                      </span>
                    ) : isSuccess ? (
                      <span className="flex items-center gap-2 text-xs">
                        <Check className="w-4 h-4" />
                        <span>Authenticated! Loading Portal...</span>
                      </span>
                    ) : (
                      <>
                        <span>SIGN IN AS WORKER</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Dev-Only Demo Access Quick-Fill */}
                {import.meta.env.DEV && (
                  <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Demo Worker Access:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEmployeeId("COOP-EMP-0001");
                          setPassword("Coopnex@Worker2026!");
                        }}
                        className="px-2.5 py-1 text-[11px] font-black bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition shadow-xs cursor-pointer"
                      >
                        Auto-fill Demo Worker
                      </button>
                    </div>
                    <div className="mt-1.5 text-[11px] text-amber-800 font-mono flex items-center justify-between">
                      <span>ID: COOP-EMP-0001</span>
                      <span>Role: Arjun Kumar (Electrician)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Footer: Register Link & Help */}
            <div className="pt-6 border-t border-slate-100 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Don&apos;t have a worker ID?{" "}
                <Link to="/register?role=worker" className="text-[#2563EB] font-bold hover:underline">
                  Join as Cooperative Specialist
                </Link>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>State Labour Federation Network Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Forgot Password Recovery Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        defaultIdentifier={employeeId}
        portalRole="WORKER"
        onSuccess={(newPass, id) => {
          setPassword(newPass);
          if (id) setEmployeeId(id);
          setShowForgotModal(false);
        }}
      />

      {/* Forgot Employee ID Recovery Modal */}
      <ForgotEmployeeIdModal
        isOpen={showForgotIdModal}
        onClose={() => setShowForgotIdModal(false)}
        onSelectEmployeeId={(recoveredId) => {
          setEmployeeId(recoveredId);
          setShowForgotIdModal(false);
        }}
      />
    </AnimatedCoopBackground>
  );
};
