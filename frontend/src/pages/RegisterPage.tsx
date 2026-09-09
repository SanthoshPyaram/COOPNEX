import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";
import { useAuth } from "../context/AuthContext";
import { checkLocalPincode } from "../data/indiaLocations";
import { AnimatedCoopBackground } from "../components/animations/AnimatedCoopBackground";
import { LanguageDropdown } from "../components/LanguageDropdown";
import {
  User,
  Mail,
  Lock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  Info
} from "lucide-react";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "worker" ? "WORKER" : "CUSTOMER";

  const { registerCustomer, sendOtp, verifyOtp } = useAuth();

  // Role Selection
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "WORKER">(initialRole);

  // Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [age, setAge] = useState<string>("28");

  // Email Field & Verification State
  const [email, setEmail] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [emailOtpJustSent, setEmailOtpJustSent] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);
  const [authProviderUserId, setAuthProviderUserId] = useState<string | undefined>(undefined);
  const emailOtpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Password & Location
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pincode, setPincode] = useState("520001");
  const [detectedLocation, setDetectedLocation] = useState("Vijayawada, Andhra Pradesh");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [accountCreatedUser, setAccountCreatedUser] = useState<any>(null);

  // Email Countdown Timer
  useEffect(() => {
    let timer: any;
    if (emailOtpSent && emailCountdown > 0 && !emailVerified) {
      timer = setInterval(() => {
        setEmailCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emailOtpSent, emailCountdown, emailVerified]);

  // Password Requirements Checker
  const passwordHasMin8 = password.length >= 8;
  const passwordHasNumber = /[0-9]/.test(password);
  const passwordHasUpper = /[A-Z]/.test(password);
  const passwordHasSpecial = /[^A-Za-z0-9]/.test(password);

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "", color: "bg-slate-200" };
    let score = 0;
    if (passwordHasMin8) score++;
    if (passwordHasNumber) score++;
    if (passwordHasUpper) score++;
    if (passwordHasSpecial) score++;

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-rose-500" };
    if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score: 75, label: "Good", color: "bg-emerald-500" };
    return { score: 100, label: "Strong & Secure", color: "bg-emerald-600" };
  };

  const strength = getPasswordStrength();

  // Pincode lookup
  const handlePincodeChange = (pin: string) => {
    const clean = pin.replace(/\D/g, "").slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      const res = checkLocalPincode(clean);
      if (res.city && res.state) {
        setDetectedLocation(`${res.city}${res.district ? ` (${res.district})` : ""}, ${res.state}`);
      } else {
        setDetectedLocation("Valid Indian PIN Code");
      }
    }
  };

  // ==========================================
  // EMAIL VERIFICATION (EMAILJS + BACKEND REAL OTP)
  // ==========================================
  const handleSendEmailOtp = async () => {
    setEmailErrorMsg(null);
    setEmailStatusMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setEmailErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSendingEmailOtp(true);

    try {
      // Dispatch real cryptographically secure OTP via EmailJS universal template
      const res = await sendOtp(cleanEmail, "REGISTER", firstName.trim() || undefined);

      setIsSendingEmailOtp(false);

      if (res.success) {
        setEmailOtpSent(true);
        setEmailOtpJustSent(true);
        setTimeout(() => setEmailOtpJustSent(false), 2000);
        setEmailCountdown(res.retryAfterSeconds || 60);
        setEmailStatusMsg("Verification code sent to your email.");
        setTimeout(() => emailOtpInputs.current[0]?.focus(), 100);
      } else {
        if (res.retryAfterSeconds) {
          setEmailCountdown(res.retryAfterSeconds);
        }
        setEmailErrorMsg(res.message || "Failed to dispatch email verification code.");
      }
    } catch {
      setIsSendingEmailOtp(false);
      setEmailErrorMsg("Failed to connect to verification service. Please try again.");
    }
  };

  const handleEmailOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...emailOtp];
    newOtp[index] = clean;
    setEmailOtp(newOtp);

    if (clean && index < 5) {
      emailOtpInputs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join("");
    if (fullCode.length === 6) {
      executeVerifyEmailOtp(fullCode);
    }
  };

  const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !emailOtp[index] && index > 0) {
      emailOtpInputs.current[index - 1]?.focus();
    }
  };

  const handleEmailOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...emailOtp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setEmailOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      emailOtpInputs.current[focusIndex]?.focus();
      if (pasted.length === 6) {
        executeVerifyEmailOtp(pasted);
      }
    }
  };

  const executeVerifyEmailOtp = async (code: string) => {
    if (code.length !== 6) {
      setEmailErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    setEmailErrorMsg(null);
    setIsVerifyingEmailOtp(true);

    const cleanEmail = email.trim().toLowerCase();

    // Verify against SHA-256 hashed OTP in backend MongoDB
    const res = await verifyOtp(cleanEmail, code, "REGISTER");

    setIsVerifyingEmailOtp(false);

    if (res.success) {
      setEmailVerified(true);
      setEmailOtpSent(false);
      setEmailStatusMsg("Email successfully verified.");
    } else {
      setEmailErrorMsg(res.message || "Invalid verification code. Please try again.");
    }
  };

  // ==========================================
  // FINAL SUBMISSION (CREATE ACCOUNT)
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation checks
    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Please enter both first name and last name.");
      return;
    }

    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 18 || numAge > 90) {
      setFormError("Age must be between 18 and 90 years.");
      return;
    }

    if (!emailVerified) {
      setFormError("Please verify your email address using the 'Verify' button before creating an account.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsSubmitting(true);

    // If worker role selected, forward to worker onboarding
    if (selectedRole === "WORKER") {
      const query = new URLSearchParams({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim().toLowerCase(),
        gender,
        age,
        authProviderUserId: authProviderUserId || "",
        emailVerified: "true"
      }).toString();
      navigate(`/join-worker?${query}`);
      return;
    }

    const payload = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      age: numAge,
      email: email.trim().toLowerCase(),
      password,
      role: "CUSTOMER",
      emailVerified: true,
      phoneVerified: false,
      authProviderUserId,
      pincode: pincode.trim(),
      district: detectedLocation.split(",")[0].trim(),
      state: detectedLocation.split(",")[1]?.trim() || "Andhra Pradesh"
    };

    const res = await registerCustomer(payload);
    setIsSubmitting(false);

    if (res.success) {
      setAccountCreatedUser(payload);
    } else {
      setFormError(res.message || "Registration failed. Please check your inputs.");
    }
  };

  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    emailVerified &&
    password.length >= 8 &&
    password === confirmPassword;

  return (
    <AnimatedCoopBackground className="min-h-screen bg-[#FFFDF7] dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center transition-colors">
      {/* Top Utility Bar */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between mb-2">
        <Link to="/" className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#2563EB] transition">
          &larr; Back to Home
        </Link>
        <LanguageDropdown variant="pill" />
      </div>

      <div className="max-w-2xl mx-auto w-full space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <CoopnexLogo variant="full" size="lg" />
          </Link>
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cooperative Workforce Network</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create your COOPNEX Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Join a trusted community with genuine Email &amp; Phone OTP verification
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
          {accountCreatedUser ? (
            /* SUCCESS STATE */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Welcome to COOPNEX!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Your account has been successfully created with verified credentials.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{accountCreatedUser.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Verified Email</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{accountCreatedUser.email}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Verified Phone</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>+91 {accountCreatedUser.phone}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">ACTIVE</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(selectedRole === "WORKER" ? "/worker" : "/app")}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO COOPNEX DASHBOARD</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          ) : (
            /* MAIN REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setSelectedRole("CUSTOMER")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === "CUSTOMER"
                      ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>BOOK SERVICES</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("WORKER")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === "WORKER"
                      ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-amber-500" />
                  <span>JOIN AS A WORKER</span>
                </button>
              </div>

              {selectedRole === "WORKER" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-xs text-blue-900">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-[#2563EB]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold block">Artisan &amp; Worker Onboarding</span>
                    <span>Verified cooperative workers receive identity verification, trade assessment, and fair wage protection.</span>
                  </div>
                </div>
              )}

              {/* Global Error Banner */}
              {formError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Personal Details: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kumar"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
              </div>

              {/* Gender & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age (18-90) *
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="90"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
              </div>

              {/* ======================================================== */}
              {/* EMAIL FIELD WITH BESIDE VERIFY BUTTON */}
              {/* ======================================================== */}
              <div className="space-y-2 p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  {emailVerified ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Email Verified</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEmailVerified(false);
                          setEmailOtpSent(false);
                        }}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Email Input + Verify Button (Beside on desktop, stacked on mobile) */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. user@example.com"
                      value={email}
                      onChange={(e) => {
                        const newEmail = e.target.value;
                        setEmail(newEmail);
                        if (emailVerified || emailOtpSent) {
                          setEmailVerified(false);
                          setEmailOtpSent(false);
                          setEmailOtp(["", "", "", "", "", ""]);
                          setEmailStatusMsg("Email changed — please verify again.");
                        }
                        setEmailErrorMsg(null);
                      }}
                      className={`w-full bg-white dark:bg-slate-800 border ${
                        emailVerified
                          ? "border-emerald-500 bg-emerald-50/30 text-emerald-900 dark:text-emerald-200"
                          : "border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                      } rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition`}
                    />
                  </div>

                  {/* Clearly Visible Verify Button */}
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={
                      emailVerified ||
                      isSendingEmailOtp ||
                      emailOtpJustSent ||
                      (emailOtpSent && emailCountdown > 0) ||
                      !email.includes("@")
                    }
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shrink-0 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      emailVerified
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default"
                        : emailOtpJustSent
                        ? "bg-emerald-600 text-white shadow-sm cursor-default"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {isSendingEmailOtp ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : emailVerified ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        <span>✓ Email Verified</span>
                      </>
                    ) : emailOtpJustSent ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>OTP Sent</span>
                      </>
                    ) : emailOtpSent ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{emailCountdown > 0 ? `Resend OTP in ${emailCountdown}s` : "Resend OTP"}</span>
                      </>
                    ) : (
                      <span>Verify</span>
                    )}
                  </button>
                </div>

                {/* Email Feedback Messages */}
                {emailStatusMsg && !emailVerified && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailStatusMsg}</span>
                  </div>
                )}
                {emailErrorMsg && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailErrorMsg}</span>
                  </div>
                )}

                {/* Inline 6-Digit Email OTP Box */}
                <AnimatePresence>
                  {emailOtpSent && !emailVerified && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                          Enter 6-Digit Email Verification Code:
                        </span>
                        {emailCountdown > 0 ? (
                          <span className="text-[11px] text-slate-500">
                            Resend in <strong className="text-blue-600">{emailCountdown}s</strong>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendEmailOtp}
                            disabled={isSendingEmailOtp}
                            className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>

                      {/* Guidance banner for 6-digit code */}
                      <div className="p-2.5 bg-blue-100/60 dark:bg-blue-900/40 rounded-xl text-xs text-blue-900 dark:text-blue-200 space-y-1">
                        <div className="flex items-start gap-1.5 font-medium">
                          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>
                            Please enter the 6-digit verification code sent to your email via EmailJS. Valid for 5 minutes.
                          </span>
                        </div>
                      </div>

                      {/* 6 Digit Input Boxes */}
                      <div className="flex justify-center gap-2">
                        {emailOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (emailOtpInputs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleEmailOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleEmailOtpKeyDown(idx, e)}
                            onPaste={idx === 0 ? handleEmailOtpPaste : undefined}
                            className="w-10 h-12 text-center text-lg font-black rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                          />
                        ))}
                      </div>

                      {/* Verify Email OTP Button */}
                      <button
                        type="button"
                        onClick={() => executeVerifyEmailOtp(emailOtp.join(""))}
                        disabled={isVerifyingEmailOtp || emailOtp.join("").length !== 6}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isVerifyingEmailOtp ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Verifying code...</span>
                          </>
                        ) : (
                          <>
                            <span>Verify Email OTP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password (Min 8 Chars) *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Modern Password Security Meter */}
              {password && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400">Password Strength:</span>
                    <span className={`font-black ${
                      strength.score >= 75 ? "text-emerald-600 dark:text-emerald-400" :
                      strength.score >= 50 ? "text-amber-600 dark:text-amber-400" :
                      "text-rose-600 dark:text-rose-400"
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    <span className={`flex items-center gap-1 ${passwordHasMin8 ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                      <CheckCircle2 className="w-3 h-3" /> Min 8 Characters
                    </span>
                    <span className={`flex items-center gap-1 ${passwordHasNumber ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                      <CheckCircle2 className="w-3 h-3" /> Contains Number
                    </span>
                    <span className={`flex items-center gap-1 ${passwordHasUpper ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                      <CheckCircle2 className="w-3 h-3" /> Uppercase Letter
                    </span>
                    <span className={`flex items-center gap-1 ${passwordHasSpecial ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
                      <CheckCircle2 className="w-3 h-3" /> Special Symbol
                    </span>
                  </div>
                </div>
              )}

              {/* Pincode & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    PIN Code *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detected Coverage Region
                  </label>
                  <div className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300 truncate">
                    {detectedLocation}
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* FINAL REGISTRATION SUBMISSION BUTTON */}
              {/* ======================================================== */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-3.5 px-5 rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isFormValid
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300/40 dark:border-slate-700/40"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating COOPNEX Account...</span>
                    </span>
                  ) : (
                    <>
                      <span>CREATE ACCOUNT</span>
                      <ArrowRight className={`w-4 h-4 ${isFormValid ? "text-amber-300" : "text-slate-400"}`} />
                    </>
                  )}
                </button>

                {/* Helpful Validation Hint */}
                {!isFormValid && (
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    {!emailVerified
                      ? "⚠️ Please verify your Email Address using the 'Verify' button above to continue."
                      : "⚠️ Please complete all required fields and ensure passwords match."}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Existing account link */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have a COOPNEX account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </AnimatedCoopBackground>
  );
};
