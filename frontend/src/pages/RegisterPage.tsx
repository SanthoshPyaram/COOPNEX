import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";
import { useAuth } from "../context/AuthContext";
import { checkLocalPincode } from "../data/indiaLocations";
import { AnimatedCoopBackground } from "../components/animations/AnimatedCoopBackground";
import { LanguageDropdown } from "../components/LanguageDropdown";
import { useTranslation } from "react-i18next";
import { API_BASE } from "../services/api";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  Info,
  Sparkles,
  Shield
} from "lucide-react";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect worker inquiries directly to dedicated artisan onboarding
  useEffect(() => {
    if (searchParams.get("role") === "worker") {
      navigate("/join-worker", { replace: true });
    }
  }, [searchParams, navigate]);

  const { t } = useTranslation();
  const { registerCustomer, sendOtp, verifyOtp } = useAuth();

  // Personal Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState<string>("");

  // Phone Field & Pre-Check State
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailDuplicateError, setEmailDuplicateError] = useState<string | null>(null);
  const [phoneDuplicateError, setPhoneDuplicateError] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);

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

  const checkPhoneAvailability = async (rawDigits: string) => {
    const cleanDigits = rawDigits.replace(/\D/g, "");
    if (!cleanDigits) return;
    if (cleanDigits.length < 10) {
      setPhoneError(t("auth.phoneInvalid", "Please provide a valid 10-digit mobile number."));
      setPhoneChecked(false);
      return;
    }
    setPhoneError(null);
    try {
      setIsCheckingPhone(true);
      const res = await fetch(`${API_BASE}/auth/check-phone?phone=${encodeURIComponent(cleanDigits.slice(-10))}`);
      const data = await res.json();
      setIsCheckingPhone(false);
      setPhoneChecked(true);
      if (data.exists) {
        setPhoneDuplicateError(t("auth.phoneAlreadyRegistered", "Phone number already registered. Please use another number."));
      } else {
        setPhoneDuplicateError(null);
      }
    } catch {
      setIsCheckingPhone(false);
      setPhoneChecked(true);
    }
  };

  const handlePhoneBlur = () => {
    const cleanDigits = phone.replace(/\D/g, "");
    if (cleanDigits.length === 10) {
      checkPhoneAvailability(cleanDigits);
    }
  };

  // Password & Location
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pincode, setPincode] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");

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
    setEmailDuplicateError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setEmailErrorMsg("Please enter a valid email address.");
      return;
    }

    setIsSendingEmailOtp(true);

    try {
      setIsCheckingEmail(true);
      const chk = await fetch(`${API_BASE}/auth/check-email?email=${encodeURIComponent(cleanEmail)}`);
      const chkData = await chk.json();
      setIsCheckingEmail(false);
      if (chkData.exists) {
        setIsSendingEmailOtp(false);
        setEmailDuplicateError(t("auth.emailAlreadyExists", "Email already exists. Please use another email."));
        return;
      }
    } catch {
      setIsCheckingEmail(false);
    }

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

    const cleanPhoneDigits = phone.replace(/\D/g, "");
    if (!cleanPhoneDigits || cleanPhoneDigits.length < 10) {
      setFormError(t("auth.phoneRequired", "Phone number is required. Please provide a valid 10-digit mobile number."));
      return;
    }

    if (phoneDuplicateError) {
      setFormError(phoneDuplicateError);
      return;
    }

    if (emailDuplicateError) {
      setFormError(emailDuplicateError);
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

    const payload = {
      name: `${firstName.trim()} ${lastName.trim()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      age: numAge,
      phone: cleanPhoneDigits.slice(-10),
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
    phone.replace(/\D/g, "").length >= 10 &&
    !phoneDuplicateError &&
    !emailDuplicateError &&
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

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto w-full space-y-6 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <CoopnexLogo variant="full" size="lg" />
          </Link>
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>National Cooperative Workforce Network</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create your Customer Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Direct access to verified cooperative artisans with authentic Email &amp; Phone OTP protection
          </p>
        </div>

        {/* Form Container with Ambient Glow and Glassmorphism */}
        <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-blue-950/10 p-6 sm:p-8 overflow-hidden">
          {/* Ambient soft glow background decorations */}
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
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
                onClick={() => navigate("/app")}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3 px-5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO CUSTOMER DASHBOARD</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          ) : (
            /* MAIN REGISTRATION FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Customer Account Header Card (Worker switch removed) */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-blue-50/90 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 rounded-2xl shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Customer Registration</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Direct Citizen Access</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Book verified local artisans with transparent cooperative pricing</span>
                  </div>
                </div>
                <Link
                  to="/join-worker"
                  className="group inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-xl border border-blue-200/60 dark:border-blue-700/60 shadow-xs hover:shadow-sm transition-all self-start sm:self-auto shrink-0"
                >
                  <span>Are you an artisan?</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>

              {/* Cooperative Trust Guarantees Strip */}
              <div className="grid grid-cols-3 gap-2 py-1 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-0.5" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Police &amp; Trade Verified</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
                  <Sparkles className="w-4 h-4 text-amber-500 mb-0.5" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Fair Standard Wages</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-0.5" />
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Zero Commission</span>
                </div>
              </div>

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
                    <option value="">Select Gender</option>
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
                    placeholder="Enter age (e.g. 28)"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
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
                {emailDuplicateError && (
                  <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailDuplicateError}</span>
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
                            Resend code
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

                      {/* 6 Individual Digit Boxes */}
                      <div className="flex items-center justify-between gap-1 sm:gap-2">
                        {emailOtp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => {
                              emailOtpInputs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleEmailOtpDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleEmailOtpKeyDown(index, e)}
                            onPaste={handleEmailOtpPaste}
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

              {/* Phone Number Input with 10-Digit Requirement & Duplicate Pre-Check */}
              <div className="space-y-1 p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number (10 Digits) *
                  </label>
                  <div className="flex items-center gap-2">
                    {isCheckingPhone ? (
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold animate-pulse">
                        Checking availability...
                      </span>
                    ) : phoneDuplicateError ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        <span>Already Registered</span>
                      </span>
                    ) : phoneChecked && phone.length === 10 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Available</span>
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(clean);
                      setPhoneError(null);
                      setPhoneDuplicateError(null);
                      setPhoneChecked(false);
                      if (clean.length === 10) {
                        checkPhoneAvailability(clean);
                      }
                    }}
                    onBlur={handlePhoneBlur}
                    className={`w-full bg-white dark:bg-slate-800 border ${
                      phoneDuplicateError || phoneError
                        ? "border-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200"
                        : phone.length === 10 && !phoneDuplicateError
                        ? "border-emerald-500 bg-emerald-50/30 text-emerald-900 dark:text-emerald-200"
                        : "border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    } rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition`}
                  />
                </div>
                {phoneError && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{phoneError}</span>
                  </p>
                )}
                {phoneDuplicateError && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{phoneDuplicateError}</span>
                  </p>
                )}
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
                      placeholder="Enter 6-digit PIN (e.g. 520001)"
                      value={pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detected Coverage Region
                  </label>
                  <div className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300 truncate">
                    {detectedLocation || <span className="text-slate-400 italic">Auto-detected upon entering PIN code</span>}
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* FINAL REGISTRATION SUBMISSION BUTTON */}
              {/* ======================================================== */}
              <div className="pt-3">
                <motion.button
                  type="submit"
                  whileHover={isFormValid && !isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={isFormValid && !isSubmitting ? { scale: 0.99 } : {}}
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-3.5 px-5 rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isFormValid
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 ring-2 ring-blue-500/20"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300/40 dark:border-slate-700/40"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Customer Account...</span>
                    </span>
                  ) : (
                    <>
                      <span>CREATE CUSTOMER ACCOUNT</span>
                      <ArrowRight className={`w-4 h-4 ${isFormValid ? "text-amber-300" : "text-slate-400"}`} />
                    </>
                  )}
                </motion.button>

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
      </motion.div>
    </AnimatedCoopBackground>
  );
};
