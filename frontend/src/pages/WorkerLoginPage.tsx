import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
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
  Briefcase,
  Wrench,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  UserCheck
} from "lucide-react";
import { AnimatedCoopBackground } from "../components/animations/AnimatedCoopBackground";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";
import { CartoonWorkerMascot } from "../components/animations/CartoonWorkerMascot";

export const WorkerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/worker";

  const { login, sendOtp, verifyOtp, forgotPasswordSendOtp, forgotPasswordReset } = useAuth();

  // Mode: "PASSWORD" or "EMAIL_OTP"
  const [loginMode, setLoginMode] = useState<"PASSWORD" | "EMAIL_OTP">("PASSWORD");

  // Standard Password Credentials
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCustomerMismatch, setIsCustomerMismatch] = useState(false);

  // Email OTP Sign-In State
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<"ENTER_ID" | "ENTER_CODE_AND_PASS" | "SUCCESS">("ENTER_ID");
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [forgotOtpCode, setForgotOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Email OTP countdown timer
  useEffect(() => {
    let timer: any;
    if (loginMode === "EMAIL_OTP" && otpSent && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loginMode, otpSent, otpCountdown]);

  // Worker Trade Categories for Visual Highlights
  const tradeBadges = [
    { label: "Electrician", icon: "⚡" },
    { label: "Plumber", icon: "🔧" },
    { label: "Carpenter", icon: "🪚" },
    { label: "Technician", icon: "🛠️" },
    { label: "Painter", icon: "🎨" },
    { label: "Driver", icon: "🚗" },
    { label: "Caregiver", icon: "🤝" }
  ];

  // Submit Password Login with explicit WORKER role enforcement
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId || !password) {
      setErrorMessage("Please enter your registered mobile number or email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsCustomerMismatch(false);

    // Explicitly pass "WORKER" to enforce backend role verification
    const res = await login(cleanId, password, "WORKER");
    setIsLoading(false);

    if (res.success) {
      navigate(redirectUrl);
    } else {
      if (res.message?.includes("Customer")) {
        setIsCustomerMismatch(true);
      }
      setErrorMessage(res.message || "Invalid credentials. Please verify your details.");
    }
  };

  // Dispatch Email OTP
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = otpEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid worker email address.");
      return;
    }

    setErrorMessage(null);
    setOtpMessage(null);
    setIsSendingOtp(true);

    const res = await sendOtp(cleanEmail, "LOGIN", "Worker");
    setIsSendingOtp(false);

    if (res.success) {
      setOtpSent(true);
      setOtpCountdown(60);
      setOtpMessage(res.message || "Verification code dispatched to your email.");
      setTimeout(() => otpInputs.current[0]?.focus(), 100);
    } else {
      setErrorMessage(res.message || "Failed to dispatch verification code.");
    }
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = clean;
    setOtpDigits(newDigits);

    if (clean && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join("");
    if (fullCode.length === 6) {
      executeVerifyAndLogin(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      const focusIdx = Math.min(pasted.length, 5);
      otpInputs.current[focusIdx]?.focus();
      if (pasted.length === 6) {
        executeVerifyAndLogin(pasted);
      }
    }
  };

  // Verify OTP and sign in as Worker
  const executeVerifyAndLogin = async (code: string) => {
    if (code.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage(null);

    const res = await verifyOtp(otpEmail.trim().toLowerCase(), code, "LOGIN");
    setIsVerifyingOtp(false);

    if (res.success && res.role === "WORKER") {
      navigate(redirectUrl);
    } else if (res.success && res.role !== "WORKER") {
      setIsCustomerMismatch(true);
      setErrorMessage("Access Denied: This account is registered as a Customer. Please sign in via Customer Sign-In.");
    } else {
      setErrorMessage(res.message || "Invalid or expired verification code.");
    }
  };

  // Forgot Password handlers
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setForgotError("Please enter your registered email address.");
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    const res = await forgotPasswordSendOtp(forgotIdentifier.trim());
    setForgotLoading(false);

    if (res.success) {
      setForgotStep("ENTER_CODE_AND_PASS");
    } else {
      setForgotError(res.message || "Could not find a worker account with that email address.");
    }
  };

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtpCode.trim() || forgotOtpCode.trim().length !== 6) {
      setForgotError("Please enter the 6-digit verification code received in your email.");
      return;
    }
    if (newPassword.length < 8) {
      setForgotError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match. Please re-enter.");
      return;
    }

    setForgotLoading(true);
    setForgotError(null);

    const res = await forgotPasswordReset(forgotIdentifier.trim(), forgotOtpCode.trim(), newPassword);
    setForgotLoading(false);

    if (res.success) {
      setForgotStep("SUCCESS");
      setTimeout(() => {
        setShowForgotModal(false);
        navigate("/worker");
      }, 1500);
    } else {
      setForgotError(res.message || "Failed to reset password. The code might be incorrect or expired.");
    }
  };

  return (
    <AnimatedCoopBackground className="min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-colors"
        >
          {/* ========================================================== */}
          {/* LEFT COLUMN: HUMAN-CENTERED SKILLED INDIAN WORKER SHOWCASE */}
          {/* ========================================================== */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F2A4A] via-[#0A4580] to-[#0A66C2] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand & Worker Badge */}
            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-3 group" title="COOPNEX Home">
                <CoopnexLogo variant="full" size="md" theme="dark" showTagline />
              </Link>

              <div className="mt-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-amber-300 text-xs font-black">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Official Worker Gateway</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                  Work With Dignity.<br />
                  <span className="text-amber-300">Earn With Confidence.</span>
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Join verified trade cooperatives across India. Receive fair daily wages, government-recognized insurance, and continuous job dispatch.
                </p>
              </div>

              {/* Skilled Trades Pills */}
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

            {/* Mascot Illustration & Trust Indicators */}
            <div className="relative z-10 mt-6 pt-6 border-t border-white/15">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <CartoonWorkerMascot size="sm" mood="happy" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Daily Direct Bank Payouts</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>₹5,00,000 Accident Coverage</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Zap className="w-3.5 h-3.5" />
                    <span>No Middleman Broker Commissions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT COLUMN: WORKER SIGN-IN FORM */}
          {/* ========================================================== */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white dark:bg-slate-900 transition-colors">
            <div>
              {/* Header with Switcher to Customer */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0A66C2] dark:text-blue-400 mb-1">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Worker Portal</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    Worker Sign In
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Welcome back. Find your next opportunity.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#0A66C2] dark:hover:text-blue-400 flex items-center gap-1 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                  title="Switch to Customer Sign In"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Customer Sign In</span>
                </Link>
              </div>

              {/* Mode Toggle: Password vs Email OTP */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl my-6">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("PASSWORD");
                    setErrorMessage(null);
                  }}
                  className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    loginMode === "PASSWORD"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Password Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("EMAIL_OTP");
                    setErrorMessage(null);
                  }}
                  className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                    loginMode === "EMAIL_OTP"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Email OTP Code
                </button>
              </div>

              {/* Error Banner with Role Mismatch Switcher */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <div className="flex-1">
                    <p className="font-semibold">{errorMessage}</p>
                    {isCustomerMismatch && (
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-black text-[#0A66C2] dark:text-blue-400 hover:underline"
                      >
                        <span>Switch to Customer Sign In Portal &rarr;</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1: PASSWORD LOGIN */}
              {loginMode === "PASSWORD" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Registered Mobile Number or Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        autoComplete="username"
                        placeholder="e.g. 9876543210 or worker@coopnex.org"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0A66C2] focus:bg-white dark:focus:bg-slate-800 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs font-bold text-[#0A66C2] dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0A66C2] focus:bg-white dark:focus:bg-slate-800 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#0A66C2] to-blue-700 hover:from-[#004182] hover:to-blue-800 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2 text-xs">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Worker Credentials...</span>
                      </span>
                    ) : (
                      <>
                        <span>SIGN IN AS WORKER</span>
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: EMAIL OTP LOGIN */}
              {loginMode === "EMAIL_OTP" && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <form onSubmit={handleSendEmailOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Registered Worker Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="email"
                            required
                            placeholder="e.g. worker@coopnex.org"
                            value={otpEmail}
                            onChange={(e) => setOtpEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0A66C2] transition"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="w-full bg-gradient-to-r from-[#0A66C2] to-blue-700 hover:from-[#004182] hover:to-blue-800 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSendingOtp ? (
                          <span className="flex items-center gap-2 text-xs">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Dispatching Email OTP...</span>
                          </span>
                        ) : (
                          <>
                            <span>SEND WORKER VERIFICATION OTP</span>
                            <ArrowRight className="w-4 h-4 text-amber-300" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4 text-center">
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Enter the 6-digit verification code sent to: <br />
                        <strong className="text-slate-900 dark:text-white font-mono">{otpEmail}</strong>
                      </div>

                      {/* 6 Digit Input Boxes */}
                      <div className="flex justify-center gap-2 py-1">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (otpInputs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            onPaste={idx === 0 ? handleOtpPaste : undefined}
                            className="w-11 h-13 text-center text-xl font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A66C2] transition"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer font-bold"
                        >
                          Change Email
                        </button>

                        {otpCountdown > 0 ? (
                          <span className="text-slate-400">
                            Resend in <strong className="text-slate-700 dark:text-slate-300">{otpCountdown}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleSendEmailOtp(e)}
                            className="inline-flex items-center gap-1 text-[#0A66C2] dark:text-blue-400 font-bold hover:underline cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Resend Code</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => executeVerifyAndLogin(otpDigits.join(""))}
                        disabled={isVerifyingOtp || otpDigits.join("").length !== 6}
                        className="w-full bg-gradient-to-r from-[#0A66C2] to-blue-700 hover:from-[#004182] hover:to-blue-800 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingOtp ? (
                          <span className="flex items-center gap-2 text-xs">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Verifying code...</span>
                          </span>
                        ) : (
                          <>
                            <span>VERIFY &amp; SIGN IN</span>
                            <ArrowRight className="w-4 h-4 text-amber-300" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Worker Registration Link */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-2 text-xs text-slate-600 dark:text-slate-400 mt-6">
              <div>
                New to COOPNEX?{" "}
                <Link
                  to="/join-worker"
                  className="text-[#0A66C2] dark:text-blue-400 font-bold hover:underline"
                >
                  Register as a Skilled Worker
                </Link>
              </div>
              <div>
                Looking for home services instead?{" "}
                <Link
                  to="/login"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline"
                >
                  Customer Sign In
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#0A66C2]">
                  <Wrench className="w-5 h-5" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Worker Password Reset
                  </h3>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {forgotStep === "ENTER_ID" && (
                <form onSubmit={handleForgotSendOtp} className="space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Enter your registered worker email address to receive a secure 6-digit password reset code.
                  </p>
                  {forgotError && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">{forgotError}</div>
                  )}
                  <input
                    type="email"
                    required
                    placeholder="worker@coopnex.org"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white font-bold py-2.5 rounded-xl text-xs"
                  >
                    {forgotLoading ? "Sending Code..." : "Send Reset Code"}
                  </button>
                </form>
              )}

              {forgotStep === "ENTER_CODE_AND_PASS" && (
                <form onSubmit={handleForgotReset} className="space-y-3">
                  {forgotError && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl">{forgotError}</div>
                  )}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 123456"
                      value={forgotOtpCode}
                      onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      New Password (Min. 8 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white font-bold py-2.5 rounded-xl text-xs mt-2"
                  >
                    {forgotLoading ? "Resetting Password..." : "Update Password & Sign In"}
                  </button>
                </form>
              )}

              {forgotStep === "SUCCESS" && (
                <div className="text-center py-4 space-y-2">
                  <Check className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h4 className="font-black text-slate-900 dark:text-white">Password Updated!</h4>
                  <p className="text-xs text-slate-500">Signing you into your Worker Dashboard...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedCoopBackground>
  );
};
