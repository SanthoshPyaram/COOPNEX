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
  Info,
  KeyRound,
  RotateCcw,
  Sparkles
} from "lucide-react";
import { CartoonSecurityMascot } from "../components/animations/CartoonSecurityMascot";
import { AnimatedCoopBackground } from "../components/animations/AnimatedCoopBackground";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";
import { isEmailJsConfigured } from "../config/emailjs";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const { login, sendOtp, verifyOtp, forgotPasswordSendOtp, forgotPasswordReset } = useAuth();

  // Mode: "PASSWORD" or "EMAIL_OTP"
  const [loginMode, setLoginMode] = useState<"PASSWORD" | "EMAIL_OTP">("PASSWORD");

  // Standard Password State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isWorkerAccountDetected, setIsWorkerAccountDetected] = useState(false);

  // Email OTP Sign-In State (EmailJS)
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
      case "SOCIETY_ADMIN":
        navigate("/society");
        break;
      case "FEDERATION_ADMIN":
        navigate("/federation");
        break;
      case "SUPER_ADMIN":
        navigate("/admin");
        break;
      default:
        navigate("/app");
    }
  };

  // Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage("Please enter both your registered email/phone and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsWorkerAccountDetected(false);

    const res = await login(identifier.trim(), password, "CUSTOMER");
    setIsLoading(false);

    if (res.success && res.role) {
      handleRoleNavigation(res.role);
    } else {
      if (res.message?.includes("Worker") || res.message?.includes("worker") || (res as any).isWorkerAccount) {
        setIsWorkerAccountDetected(true);
      }
    }
  };

  // Email OTP: Send Code via COOPNEX Backend & EmailJS
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = otpEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage(null);
    setOtpMessage(null);
    setIsSendingOtp(true);

    const res = await sendOtp(cleanEmail, "LOGIN");
    setIsSendingOtp(false);

    if (res.success) {
      setOtpSent(true);
      setOtpCountdown(res.retryAfterSeconds || 60);
      setOtpMessage(res.message || `A 6-digit verification code has been dispatched to ${cleanEmail}.`);
      setTimeout(() => otpInputs.current[0]?.focus(), 100);
    } else {
      setErrorMessage(res.message || "Failed to dispatch email verification code.");
    }
  };

  // Handle OTP digit input
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
      const focusIndex = Math.min(pasted.length, 5);
      otpInputs.current[focusIndex]?.focus();
      if (pasted.length === 6) {
        executeVerifyAndLogin(pasted);
      }
    }
  };

  // Verify Email OTP and login to COOPNEX
  const executeVerifyAndLogin = async (code: string) => {
    if (code.length !== 6) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMessage(null);

    const res = await verifyOtp(otpEmail.trim().toLowerCase(), code, "LOGIN");
    setIsVerifyingOtp(false);

    if (res.success && res.role) {
      handleRoleNavigation(res.role);
    } else {
      setErrorMessage(res.message || "Invalid or expired verification code. Please request a new code.");
    }
  };

  // Forgot Password Handlers
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
      setForgotError(res.message || "Could not find an account with that email address.");
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

    if (res.success && res.role) {
      setForgotStep("SUCCESS");
      setTimeout(() => {
        setShowForgotModal(false);
        handleRoleNavigation(res.role!);
      }, 1500);
    } else {
      setForgotError(res.message || "Failed to reset password. The OTP might be incorrect or expired.");
    }
  };

  return (
    <AnimatedCoopBackground className="min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-colors"
        >
          {/* Left Visual Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <CoopnexLogo variant="full" size="lg" theme="dark" showTagline />
              </Link>

              <div className="mt-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-amber-300 text-xs font-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cooperative Workforce Network</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                  Welcome to COOPNEX
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  Sign in with your verified password or instant Email OTP to access your bookings, worker tools, and cooperative network.
                </p>
              </div>

              {/* Dynamic Cartoon Security Mascot */}
              <div className="my-6 flex justify-center">
                <CartoonSecurityMascot size="md" />
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified Artisan Skills &amp; Cooperative Membership</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Direct Take-Home with Zero Intermediary Commission</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Decentralized Health &amp; Social Welfare Network</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/15 text-[11px] text-blue-200/80 flex items-center justify-between">
              <span>COOPNEX Network</span>
              <span>v3.0 Production Auth</span>
            </div>
          </div>

          {/* Right Login Panel */}
          <div className="lg:col-span-7 p-7 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 transition-colors">
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Secure COOPNEX Authentication</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Sign In to COOPNEX
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Choose your preferred authentication method:
                </p>
              </div>

              {/* DUAL MODE SELECTOR: PASSWORD vs EMAIL OTP */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("PASSWORD");
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    loginMode === "PASSWORD"
                      ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
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
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    loginMode === "EMAIL_OTP"
                      ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  Sign in with Email OTP
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Worker Account Detected Banner */}
              {isWorkerAccountDetected && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-amber-900 dark:text-amber-100 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#FF6B00]" />
                      <span>Skilled Worker Account Detected</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                      This email/phone is registered as a Worker. Please use the Worker Sign In portal.
                    </p>
                  </div>
                  <Link
                    to="/worker/login"
                    className="px-3.5 py-1.5 bg-[#FF6B00] hover:bg-[#E05300] text-white font-bold rounded-xl shadow-xs transition shrink-0 inline-flex items-center gap-1 text-xs"
                  >
                    <span>Worker Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Status Alert */}
              {otpMessage && loginMode === "EMAIL_OTP" && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{otpMessage}</span>
                </div>
              )}

              {/* TAB 1: PASSWORD LOGIN */}
              {loginMode === "PASSWORD" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Registered Email Address or Phone
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. customer@coopnex.org or 9876543210"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotIdentifier(identifier || "");
                          setForgotStep("ENTER_ID");
                          setForgotError(null);
                          setShowForgotModal(true);
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition"
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
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2 text-xs">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating securely...</span>
                      </span>
                    ) : (
                      <>
                        <span>SIGN IN WITH PASSWORD</span>
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: EMAIL OTP LOGIN (EMAILJS) */}
              {loginMode === "EMAIL_OTP" && (
                <div className="space-y-4">
                  {!isEmailJsConfigured() && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <span className="font-bold block">EmailJS Configuration Required:</span>
                        <span>Please set <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">VITE_EMAILJS_SERVICE_ID</code>, <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">VITE_EMAILJS_VERIFICATION_TEMPLATE_ID</code>, and <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">VITE_EMAILJS_PUBLIC_KEY</code> in frontend <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">.env</code>.</span>
                      </div>
                    </div>
                  )}

                  {!otpSent ? (
                    <form onSubmit={handleSendEmailOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Enter Registered Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="email"
                            required
                            placeholder="e.g. customer@coopnex.org"
                            value={otpEmail}
                            onChange={(e) => setOtpEmail(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingOtp}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSendingOtp ? (
                          <span className="flex items-center gap-2 text-xs">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Sending Email OTP...</span>
                          </span>
                        ) : (
                          <>
                            <span>SEND EMAIL OTP CODE</span>
                            <ArrowRight className="w-4 h-4 text-amber-300" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4 text-center">
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Enter the 6-digit code sent to <strong className="text-slate-900 dark:text-white">{otpEmail}</strong>:
                      </div>

                      {/* 6 Digit OTP Box */}
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
                            className="w-11 h-13 text-center text-xl font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
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
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
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
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

                      {/* Helpful Hint on Email OTP */}
                      <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 rounded-xl text-[11px] text-blue-800 dark:text-blue-300 text-left space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-blue-900 dark:text-blue-200">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>Secure Email OTP Authentication:</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          A cryptographically secure 6-digit verification code has been dispatched to your email address via EmailJS. Enter it above to access your COOPNEX account.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Worker Portal Prompt Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border border-amber-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                    <span>Are you a Skilled Worker?</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Access your assigned jobs, daily earnings & worker tools
                  </p>
                </div>
                <Link
                  to="/worker/login"
                  className="px-3.5 py-1.5 text-xs font-black text-white bg-[#FF6B00] hover:bg-[#E05300] rounded-xl shadow-xs transition flex items-center gap-1 shrink-0"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Registration Links */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    Create Citizen Account
                  </Link>
                </div>
                <div>
                  Are you a skilled technician or artisan?{" "}
                  <Link to="/join-worker" className="text-[#FF6B00] font-bold hover:underline">
                    Join as a Verified Worker
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">Reset Your Password</h3>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {forgotError && (
                <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}

              {/* STEP 1: Enter Email */}
              {forgotStep === "ENTER_ID" && (
                <form onSubmit={handleForgotSendOtp} className="mt-4 space-y-4">
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs text-blue-900 dark:text-blue-200 leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>
                      Enter your registered email address to receive a secure 6-digit password reset code.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. customer@coopnex.org"
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow transition cursor-pointer"
                  >
                    {forgotLoading ? "Sending Reset Code..." : "SEND RESET CODE"}
                  </button>
                </form>
              )}

              {/* STEP 2: Enter Code & New Password */}
              {forgotStep === "ENTER_CODE_AND_PASS" && (
                <form onSubmit={handleForgotReset} className="mt-4 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 849201"
                      value={forgotOtpCode}
                      onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      New Password (Min 8 Chars)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow transition cursor-pointer"
                  >
                    {forgotLoading ? "Resetting Password..." : "RESET PASSWORD & SIGN IN"}
                  </button>
                </form>
              )}

              {/* SUCCESS */}
              {forgotStep === "SUCCESS" && (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-base">Password Reset Successfully!</h4>
                  <p className="text-xs text-slate-500">Signing you in securely to your COOPNEX dashboard...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatedCoopBackground>
  );
};
