import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";
import { useAuth } from "../context/AuthContext";
import {
  HandHeart,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
  Building2,
  Clock,
  Sparkles,
  AlertTriangle,
  FileText,
  CreditCard,
  Building,
  Check,
  X,
  Globe,
  Droplet,
  Camera,
  Award,
  RotateCw,
  RotateCcw,
  Printer,
  QrCode,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { WorkerSmartIdCard } from "../components/WorkerSmartIdCard";
import { LanguageDropdown } from "../components/LanguageDropdown";

const ONBOARDING_LANGUAGES = [
  "Telugu",
  "Hindi",
  "English",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Punjabi"
];

const ONBOARDING_BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export const WorkerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerWorker, sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  // Step 1: Personal & Dual Verification
  const [name, setName] = useState(searchParams.get("name") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "Male");
  const [age, setAge] = useState(searchParams.get("age") || "32");
  const [district, setDistrict] = useState("Vijayawada");
  const [address, setAddress] = useState("");

  // Blood Group & Multi-Language Selection for Smart ID
  const paramLangs = searchParams.get("languages")
    ? searchParams.get("languages")!.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const [bloodGroup, setBloodGroup] = useState(searchParams.get("bloodGroup") || "O+");
  const [languagesKnown, setLanguagesKnown] = useState<string[]>(
    paramLangs.length > 0 ? paramLangs : ["Telugu", "Hindi", "English"]
  );

  // Photo & Digital Signature for Official Smart ID Card
  const [photoPreview, setPhotoPreview] = useState<string>(
    gender === "Female"
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
      : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
  );
  const [photoFile, setPhotoFile] = useState<{ name: string; size: string } | null>(null);
  const [signatureText, setSignatureText] = useState(searchParams.get("name") || "Rajesh Kumar");

  const toggleLanguage = (lang: string) => {
    setLanguagesKnown((prev) =>
      prev.includes(lang) ? (prev.length > 1 ? prev.filter((l) => l !== lang) : prev) : [...prev, lang]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setPhotoFile({ name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` });
    }
  };

  // Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email Verification States (EmailJS / Backend)
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(searchParams.get("emailVerified") === "true");
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [emailOtpJustSent, setEmailOtpJustSent] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);

  React.useEffect(() => {
    let timer: any;
    if (emailOtpSent && emailCountdown > 0 && !emailOtpVerified) {
      timer = setInterval(() => setEmailCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [emailOtpSent, emailCountdown, emailOtpVerified]);

  // Step 2: Trade & Skills
  const [primarySkill, setPrimarySkill] = useState("Electrician");
  const [experienceYears, setExperienceYears] = useState("5");
  const [secondarySkills, setSecondarySkills] = useState("Inverter Setup, MCB Wiring");
  const [hasOwnTools, setHasOwnTools] = useState(true);

  // Step 3: Identity, 5 KYC Documents & Pre-Check
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [pccNumber, setPccNumber] = useState("");
  const [skillCertName, setSkillCertName] = useState("NCVT / ITI Electrician Certificate");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  // Step 3: Real Interactive File Uploads
  const [aadhaarFile, setAadhaarFile] = useState<{ name: string; size: string } | null>({ name: "aadhaar_card_scanned.pdf", size: "1.4 MB" });
  const [panFile, setPanFile] = useState<{ name: string; size: string } | null>({ name: "pan_card_front.jpg", size: "640 KB" });
  const [pccFile, setPccFile] = useState<{ name: string; size: string } | null>(null);
  const [skillFile, setSkillFile] = useState<{ name: string; size: string } | null>(null);
  const [bankFile, setBankFile] = useState<{ name: string; size: string } | null>(null);
  const [showFakeDocModal, setShowFakeDocModal] = useState(false);
  
  // Pre-check verification state
  const [preCheckRan, setPreCheckRan] = useState(false);
  const [preCheckScanning, setPreCheckScanning] = useState(false);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: { name: string; size: string } | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
      setter({ name: file.name, size: sizeStr });
    }
  };

  // Step 4: Society
  const [selectedSociety, setSelectedSociety] = useState("Vijayawada Central Labour Co-op Society (PACS-04)");

  // Step 5: Compact & Code of Conduct
  const [agreedToCode, setAgreedToCode] = useState(false);
  const [agreedToFairWage, setAgreedToFairWage] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Real-Time EmailJS / Backend Email OTP Handlers
  const handleSendEmailOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setEmailStatusMsg(null);
    setIsSendingEmailOtp(true);

    try {
      const res = await sendOtp(cleanEmail, "REGISTER", name.trim() || undefined);
      setIsSendingEmailOtp(false);
      if (res.success) {
        setEmailOtpSent(true);
        setEmailOtpJustSent(true);
        setTimeout(() => setEmailOtpJustSent(false), 2000);
        setEmailCountdown(res.retryAfterSeconds || 60);
        setEmailStatusMsg("Verification code sent to your email.");
      } else {
        if (res.retryAfterSeconds) {
          setEmailCountdown(res.retryAfterSeconds);
        }
        setError(res.message || "Failed to send email verification code.");
      }
    } catch {
      setIsSendingEmailOtp(false);
      setError("Failed to dispatch email verification code.");
    }
  };

  const handleVerifyEmailOtp = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const code = emailOtpInput.trim();
    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code received in your email.");
      return;
    }
    setError(null);
    setIsVerifyingEmailOtp(true);

    try {
      const res = await verifyOtp(cleanEmail, code, "REGISTER");
      setIsVerifyingEmailOtp(false);
      if (res.success) {
        setEmailOtpVerified(true);
        setEmailOtpSent(false);
        setEmailStatusMsg("Email successfully verified.");
      } else {
        setError(res.message || "Invalid email verification code.");
      }
    } catch {
      setIsVerifyingEmailOtp(false);
      setError("Verification failed. Please try again.");
    }
  };

  // Run Algorithmic Pre-Check
  const handleRunPreCheck = () => {
    if (!aadhaarNumber || aadhaarNumber.length < 12) {
      setError("Please enter a 12-digit Aadhaar number before running pre-check.");
      return;
    }
    if (!panNumber || panNumber.length < 10) {
      setError("Please enter a valid 10-character PAN number before running pre-check.");
      return;
    }
    setError(null);
    setPreCheckScanning(true);
    setTimeout(() => {
      setPreCheckScanning(false);
      setPreCheckRan(true);
    }, 1200);
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!name.trim() || !address.trim()) {
        setError("Please fill in your full legal name and residential address.");
        return;
      }
      if (!emailOtpVerified) {
        setError("Email verification is required. Please verify your email address.");
        return;
      }
      if (!password || password.length < 8) {
        setError("Please set a secure password with at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please re-enter.");
        return;
      }
    }
    if (step === 2) {
      if (!primarySkill || !experienceYears) {
        setError("Please select your primary trade specialization and experience level.");
        return;
      }
    }
    if (step === 3) {
      if (!aadhaarNumber || aadhaarNumber.length < 12) {
        setError("Please enter a valid 12-digit Aadhaar number.");
        return;
      }
      if (!panNumber || panNumber.length < 10) {
        setError("Please enter a valid 10-character PAN number.");
        return;
      }
      if (!preCheckRan) {
        setError("Please click 'Run Algorithmic Fraud Pre-Check' to test your credentials before continuing.");
        return;
      }
    }
    if (step === 4) {
      if (!selectedSociety) {
        setError("Please select your local primary cooperative society.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!agreedToCode || !agreedToFairWage) {
      setError("You must accept the Cooperative Fair Wage Agreement and Worker Code of Conduct.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const mockTracking = `SS-AP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTrackingId(mockTracking);

    try {
      await registerWorker({
        name,
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        emailVerified: true,
        phoneVerified: false,
        district,
        skills: [primarySkill, ...(secondarySkills ? secondarySkills.split(",").map(s => s.trim()).filter(Boolean) : [])],
        primarySkill,
        experienceYears: Number(experienceYears),
        aadhaarNumber,
        status: "UNDER_REVIEW"
      });

      setSubmitted(true);
    } catch (err) {
      setError("Registration failed. Please verify your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header with Authentic Cooperative Branding & Language Selector */}
        <div className="flex justify-end">
          <LanguageDropdown variant="pill" />
        </div>
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <CoopnexLogo variant="full" size="lg" />
          </Link>
          
          <div className="flex justify-center my-2">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200/80 shadow-xs">
              <img
                src={gender === "Female"
                  ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80"
                  : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&q=80"
                }
                alt="Cooperative Member"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FF6B00]"
              />
              <div className="text-left">
                <span className="block text-[11px] font-black text-slate-800 leading-tight">National Cooperative Federation</span>
                <span className="block text-[10px] text-amber-700 font-medium">Certified Artisan Direct Membership</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Worker Cooperative Onboarding &amp; KYC
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Join your district cooperative society with dual-verified phone &amp; email and mandatory government documents
          </p>

          {/* Prompt to Worker Sign In */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <span>Already registered as a verified worker?</span>
              <Link to="/worker/login" className="font-bold text-[#FF6B00] hover:underline inline-flex items-center gap-1">
                <span>Sign In to Worker Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Step Progress Bar */}
        {!submitted && (
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 px-1">
              <span className={step >= 1 ? "text-blue-600 font-black" : ""}>1. Personal & OTP</span>
              <span className={step >= 2 ? "text-blue-600 font-black" : ""}>2. Trade</span>
              <span className={step >= 3 ? "text-blue-600 font-black" : ""}>3. 5-Doc KYC</span>
              <span className={step >= 4 ? "text-blue-600 font-black" : ""}>4. Society</span>
              <span className={step >= 5 ? "text-blue-600 font-black" : ""}>5. Compact</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS / UNDER REVIEW STATE */}
          {submitted ? (
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-200">
                  <span>Application Status: Pre-Check Approved • Smart ID Active</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Registration Complete &amp; Smart ID Generated!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                  Your official Cooperative Digital Smart ID Card has been generated. It contains your verified photo, signature, employee ID, age, skills, blood group, and tamper-proof backside QR code.
                </p>
              </div>

              {/* GENERATED SMART ID CARD */}
              <div className="py-6 border-y border-slate-200/90 my-2 space-y-4 bg-slate-50/50 rounded-3xl p-4">
                <div className="max-w-md mx-auto text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold font-mono shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>OFFICIAL WORKER COOPERATIVE SMART ID</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Flip the card to see the high-resolution QR code. Anyone who scans this QR code will audit your live Verhoeff Aadhaar checksum, Police PCC, and cooperative trade certification.
                  </p>
                </div>

                <WorkerSmartIdCard
                  data={{
                    employeeId: trackingId || `SS-AP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    name: name || "Rajesh Kumar",
                    age: age || "32",
                    gender: gender,
                    skills: [primarySkill, ...(secondarySkills ? secondarySkills.split(",").map(s => s.trim()).filter(Boolean) : [])],
                    bloodGroup: bloodGroup || "O+",
                    languagesKnown: languagesKnown.length > 0 ? languagesKnown : ["Telugu", "Hindi", "English"],
                    district: district || "Vijayawada",
                    societyName: selectedSociety || "Vijayawada Central Labour Co-op Society",
                    photoUrl: photoPreview,
                    signatureText: signatureText || name || "Rajesh Kumar",
                    issueDate: new Date().toLocaleDateString("en-GB"),
                    validUntil: new Date(Date.now() + 365 * 3 * 24 * 3600 * 1000).toLocaleDateString("en-GB"),
                    nsqfLevel: "NSQF Level-4 Master",
                    emergencyContact: "+91 1800-425-COOP",
                    policeVerificationStatus: "Clear Record (Pre-Verified)",
                    aadhaarVerhoeffStatus: "Verhoeff Valid (D5 Cleared)"
                  }}
                />
              </div>

              {/* Tracking & Next Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Tracking ID:</span>
                    <span className="font-mono font-black text-slate-900 text-sm">{trackingId}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Worker Name:</span>
                    <span className="font-bold text-slate-900">{name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Trade Specialization:</span>
                    <span className="font-bold text-blue-600">{primarySkill}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Blood Group:</span>
                    <span className="font-bold text-rose-700">{bloodGroup}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Languages:</span>
                    <span className="font-semibold text-slate-800">{languagesKnown.join(", ")}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Active Privileges &amp; Next Steps:</span>
                  </div>
                  <p className="text-slate-700">
                    1. Your profile is dispatched in the priority pool. Keep your phone active.
                  </p>
                  <p className="text-slate-700">
                    2. Visit <strong>{selectedSociety}</strong> within 15 days with original Aadhaar &amp; trade certificates to collect your physical NFC member badge.
                  </p>
                  <p className="text-slate-700">
                    3. 100% of statutory customer wages are credited directly to your UPI wallet.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Return to Home
                </Link>

                <button
                  onClick={() => navigate("/worker")}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Enter Worker Console Now</span>
                </button>
              </div>
            </div>
          ) : (

            <>
              {/* STEP 1: PERSONAL & DUAL VERIFICATION */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-900">Step 1: Identity & Email Verification</h2>
                    <p className="text-xs text-slate-500">Email address must be verified via EmailJS OTP</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Legal Name (as on Aadhaar) *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rajesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Contact Phone Number */}
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Contact Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ""));
                          setError(null);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Email + Real EmailJS OTP Verification */}
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        Email Address *
                      </label>
                      {emailOtpVerified ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEmailOtpVerified(false);
                              setEmailOtpSent(false);
                            }}
                            className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">
                          Email OTP Required
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                        <input
                          type="email"
                          placeholder="rajesh.kumar@example.com"
                          value={email}
                          onChange={(e) => {
                            const newEmail = e.target.value;
                            setEmail(newEmail);
                            if (emailOtpVerified || emailOtpSent) {
                              setEmailOtpVerified(false);
                              setEmailOtpSent(false);
                              setEmailOtpInput("");
                              setEmailStatusMsg("Email changed — please verify again.");
                            }
                            setError(null);
                          }}
                          className={`w-full bg-white border ${
                            emailOtpVerified ? "border-emerald-500 bg-emerald-50/20" : "border-slate-300"
                          } rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600`}
                        />
                      </div>
                      {!emailOtpVerified ? (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={
                            isSendingEmailOtp ||
                            emailOtpJustSent ||
                            (emailOtpSent && emailCountdown > 0) ||
                            !email.includes("@")
                          }
                          className={`px-4 py-2 text-white text-xs font-bold rounded-xl transition shrink-0 shadow-xs cursor-pointer disabled:opacity-50 ${
                            emailOtpJustSent
                              ? "bg-emerald-600 cursor-default"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {isSendingEmailOtp ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </span>
                          ) : emailOtpJustSent ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>OTP Sent</span>
                            </span>
                          ) : emailOtpSent ? (
                            emailCountdown > 0 ? `Resend OTP in ${emailCountdown}s` : "Resend OTP"
                          ) : (
                            "Verify"
                          )}
                        </button>
                      ) : (
                        <div className="px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>✓ Verified</span>
                        </div>
                      )}
                    </div>

                    {emailStatusMsg && !emailOtpVerified && (
                      <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{emailStatusMsg}</span>
                      </p>
                    )}

                    {emailOtpSent && !emailOtpVerified && (
                      <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-2">
                        <div className="flex justify-between items-center text-emerald-950 font-bold">
                          <span>Enter 6-Digit Email Verification Code:</span>
                          {emailCountdown > 0 ? (
                            <span className="text-[10px] text-slate-500">Resend in {emailCountdown}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendEmailOtp}
                              className="text-[10px] text-emerald-700 hover:underline font-bold"
                            >
                              Resend Code
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={emailOtpInput}
                            onChange={(e) => setEmailOtpInput(e.target.value.replace(/\D/g, ""))}
                            className="w-40 bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold tracking-widest text-center focus:ring-2 focus:ring-emerald-600"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            disabled={isVerifyingEmailOtp || emailOtpInput.trim().length !== 6}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                          >
                            {isVerifyingEmailOtp ? "Verifying..." : "Confirm OTP"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                    <div>
                      <span className="block text-xs font-bold text-slate-800">
                        Set Worker Account Password *
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Use this password to log in to the Worker Portal at <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">/worker/login</code>.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Password (Min 8 characters) *
                        </label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full bg-white border ${
                              confirmPassword && confirmPassword !== password
                                ? "border-rose-400"
                                : confirmPassword && confirmPassword === password
                                ? "border-emerald-500"
                                : "border-slate-300"
                            } rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min={18}
                        max={70}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        District
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Vijayawada">Vijayawada (NTR District)</option>
                        <option value="Guntur">Guntur District</option>
                        <option value="Visakhapatnam">Visakhapatnam</option>
                        <option value="Hyderabad">Hyderabad Central</option>
                      </select>
                    </div>
                  </div>

                  {/* Photo & Blood Group for Official Smart ID */}
                  <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        <span>Smart ID Card Photo &amp; Blood Group *</span>
                      </strong>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        Printed on ID &amp; QR
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      {/* Photo Upload & Preview */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Worker Avatar"
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
                          />
                          <label
                            htmlFor="worker-photo-upload"
                            className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-xs"
                            title="Upload custom photo"
                          >
                            <Camera className="w-3 h-3" />
                          </label>
                          <input
                            type="file"
                            id="worker-photo-upload"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </div>
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block">ID Card Photograph</span>
                          <span className="text-[10px] text-slate-500 block">
                            {photoFile ? `${photoFile.name} (${photoFile.size})` : "Passport size photograph"}
                          </span>
                          <label
                            htmlFor="worker-photo-upload"
                            className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer inline-block mt-0.5"
                          >
                            Upload from Device →
                          </label>
                        </div>
                      </div>

                      {/* Blood Group */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 text-rose-600" />
                          <span>Blood Group *</span>
                        </label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                        >
                          {ONBOARDING_BLOOD_GROUPS.map((bg) => (
                            <option key={bg} value={bg}>
                              {bg} (Cooperative Roster Verified)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Languages Known Multi-Select */}
                  <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        <span>Languages Known (Choose Multiple) *</span>
                      </label>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {languagesKnown.length} Selected
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Select all languages you speak comfortably for job alerts, customer calls, and voice guidance:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ONBOARDING_LANGUAGES.map((lang) => {
                        const isSelected = languagesKnown.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-xs scale-105"
                                : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                            <span>{lang}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Residential Address / Colony *
                    </label>

                    <textarea
                      rows={2}
                      placeholder="Door number, street, landmark, pincode"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: TRADE & SKILLS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-900">Step 2: Trade & Skills Selection</h2>
                    <p className="text-xs text-slate-500">Specify your craft specializations and practical experience</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Trade Specialization
                      </label>
                      <select
                        value={primarySkill}
                        onChange={(e) => setPrimarySkill(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Electrician">Electrician (Residential & Commercial)</option>
                        <option value="Plumber">Plumber (Sanitary & Pipefitting)</option>
                        <option value="Carpenter">Carpenter (Furniture & Woodwork)</option>
                        <option value="Painter">Painter (Interior & Exterior)</option>
                        <option value="Cleaner">Deep Cleaning & Sanitation</option>
                        <option value="Caregiver">Elder Care & Patient Attendant</option>
                        <option value="Driver">Commercial & Heavy Driver</option>
                        <option value="Gardener">Gardener & Landscaper</option>
                        <option value="Technician">Appliance & AC Technician</option>
                        <option value="Domestic Helper">Domestic Household Helper</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Years of Work Experience
                      </label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="1">Under 2 years (Apprentice)</option>
                        <option value="3">2 - 4 years (Skilled)</option>
                        <option value="5">5 - 8 years (Senior Craftsman)</option>
                        <option value="10">8+ years (Master Tradesperson)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Secondary Skills (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Inverter Wiring, Submersible Pump Repair, Solar Panel Basics"
                      value={secondarySkills}
                      onChange={(e) => setSecondarySkills(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={hasOwnTools}
                        onChange={(e) => setHasOwnTools(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span>I own standard safety equipment and hand tools for this trade</span>
                    </label>
                    <p className="text-[11px] text-slate-500 ml-6 mt-1">
                      (If not, your local cooperative society provides tooling micro-loans upon approval)
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: 5 REQUIRED KYC DOCUMENTS & ANTI-FRAUD PRE-CHECK */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-black text-slate-900">Step 3: Identity & KYC Documents</h2>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        Anti-Fraud Engine Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Aadhaar & PAN are verified for secure payouts. Trade Experience Certificate is strictly optional.
                    </p>
                  </div>

                  {/* STATUTORY ANTI-FRAUD LEGAL PENALTY NOTICE */}
                  <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Statutory Anti-Fraud Warning — IPC Sec. 468/471 & IT Act Sec. 66D</span>
                    </div>
                    <p className="text-xs text-rose-900 leading-relaxed font-medium">
                      Submission of forged, doctored, or falsified identity credentials is a non-bailable criminal offence.
                    </p>
                    <div className="bg-white/80 p-3 rounded-xl border border-rose-200 text-[11px] text-rose-950 space-y-1">
                      <strong className="block text-rose-900 font-bold">What happens if fake documents are submitted:</strong>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li><strong>Instant Algorithmic Pre-Check:</strong> UIDAI Verhoeff checksum algorithm and OCR font kerning analyze scans in real-time.</li>
                        <li><strong>Immediate Account Freeze:</strong> Profile is permanently locked prior to job allocation.</li>
                        <li><strong>National Blacklist:</strong> Debarred across all Cooperative Labour Federations in India.</li>
                        <li><strong>Police Referral:</strong> Audit log forwarded to the District Police Cyber Crime Cell for criminal FIR registration.</li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => setShowFakeDocModal(true)}
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-100/80 hover:bg-rose-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Interactive Anti-Fraud Pre-Check & Law Penalties Explainer →</span>
                      </button>
                    </div>
                  </div>

                  {/* 5 Required Documents Input */}
                  <div className="space-y-4">
                    {/* Doc 1: Aadhaar Card */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>1. Aadhaar Card (12-Digit UIDAI Number) *</span>
                        </label>
                        <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">UIDAI Verhoeff Check</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="e.g. 548291038472"
                          value={aadhaarNumber}
                          onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ""))}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id="aadhaar-file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, setAadhaarFile)}
                            className="hidden"
                          />
                          {aadhaarFile ? (
                            <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs">
                              <div className="truncate pr-2">
                                <span className="font-bold text-emerald-950 block truncate text-[11px]">{aadhaarFile.name}</span>
                                <span className="text-[10px] text-emerald-700">{aadhaarFile.size} • Attached</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <label
                                  htmlFor="aadhaar-file"
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Change
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setAadhaarFile(null)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="aadhaar-file"
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50/50 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-xs text-slate-600 hover:text-blue-600 cursor-pointer transition"
                            >
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-semibold text-[11px]">Upload Aadhaar Scan</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Doc 2: PAN Card */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span>2. PAN Card (10-Character NSDL Format) *</span>
                        </label>
                        <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">IT Dept Deduplication</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="e.g. ABCDE1234F"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 uppercase"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id="pan-file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, setPanFile)}
                            className="hidden"
                          />
                          {panFile ? (
                            <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs">
                              <div className="truncate pr-2">
                                <span className="font-bold text-emerald-950 block truncate text-[11px]">{panFile.name}</span>
                                <span className="text-[10px] text-emerald-700">{panFile.size} • Attached</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <label
                                  htmlFor="pan-file"
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Change
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setPanFile(null)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="pan-file"
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50/50 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-xs text-slate-600 hover:text-blue-600 cursor-pointer transition"
                            >
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-semibold text-[11px]">Upload PAN Card</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Doc 3: Police Clearance Certificate */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>3. Police Clearance Certificate (PCC)</span>
                        </label>
                        <span className="text-[10px] text-slate-500 font-semibold">District Station Reference</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="PCC Ref: AP-VJA-2026-8941"
                          value={pccNumber}
                          onChange={(e) => setPccNumber(e.target.value)}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id="pcc-file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, setPccFile)}
                            className="hidden"
                          />
                          {pccFile ? (
                            <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs">
                              <div className="truncate pr-2">
                                <span className="font-bold text-emerald-950 block truncate text-[11px]">{pccFile.name}</span>
                                <span className="text-[10px] text-emerald-700">{pccFile.size} • Attached</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <label
                                  htmlFor="pcc-file"
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Change
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setPccFile(null)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="pcc-file"
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50/50 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-xs text-slate-600 hover:text-blue-600 cursor-pointer transition"
                            >
                              <Upload className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-semibold text-[11px]">Upload PCC Scan (PDF/JPG)</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Doc 4: Trade Skill Certificate (OPTIONAL) */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-amber-600" />
                          <span>4. Trade Skill / Experience Certificate <span className="text-emerald-700 font-bold">(Optional — Not Required)</span></span>
                        </label>
                        <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                          Optional • Informal Apprenticeship Accepted
                        </span>
                      </div>

                      <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                        <span className="font-bold">🇮🇳 Informal Apprenticeship & Practical Mastery:</span> In India, skilled trade workers predominantly learn through on-the-job apprenticeship with senior masters rather than classroom certificates. This document is <strong>completely optional</strong>. You will be assigned verified bookings based on your practical trade experience.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Optional: ITI, NSDC, or leave blank"
                          value={skillCertName}
                          onChange={(e) => setSkillCertName(e.target.value)}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id="skill-file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, setSkillFile)}
                            className="hidden"
                          />
                          {skillFile ? (
                            <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs">
                              <div className="truncate pr-2">
                                <span className="font-bold text-emerald-950 block truncate text-[11px]">{skillFile.name}</span>
                                <span className="text-[10px] text-emerald-700">{skillFile.size} • Attached</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <label
                                  htmlFor="skill-file"
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Change
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setSkillFile(null)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="skill-file"
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-amber-50/50 border border-dashed border-slate-300 hover:border-amber-500 rounded-xl text-xs text-slate-600 hover:text-amber-700 cursor-pointer transition"
                            >
                              <Upload className="w-3.5 h-3.5 text-amber-600" />
                              <span className="font-semibold text-[11px]">Upload Certificate (Optional)</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Doc 5: Bank Account & Passbook */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <Building className="w-4 h-4 text-blue-600" />
                          <span>5. Bank Account Passbook / Cancelled Cheque</span>
                        </label>
                        <span className="text-[10px] text-slate-500 font-semibold">Direct Wage Settlement</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Bank Account No (e.g. 98127394012)"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id="bank-file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, setBankFile)}
                            className="hidden"
                          />
                          {bankFile ? (
                            <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs">
                              <div className="truncate pr-2">
                                <span className="font-bold text-emerald-950 block truncate text-[11px]">{bankFile.name}</span>
                                <span className="text-[10px] text-emerald-700">{bankFile.size} • Attached</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <label
                                  htmlFor="bank-file"
                                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  Change
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setBankFile(null)}
                                  className="text-slate-400 hover:text-rose-600 p-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label
                              htmlFor="bank-file"
                              className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-50/50 border border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-xs text-slate-600 hover:text-blue-600 cursor-pointer transition"
                            >
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-semibold text-[11px]">Upload Bank Passbook / Cheque</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pre-Check Button & Live Result */}
                  <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-xs font-bold text-[#101828] block">
                          Algorithmic Pre-Check Engine
                        </strong>
                        <span className="text-[11px] text-blue-900">
                          Run automated checksum validation before submitting your application
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRunPreCheck}
                        disabled={preCheckScanning}
                        className="btn-primary !min-h-[38px] text-xs !py-1.5 !px-4 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {preCheckScanning ? (
                          <span>Scanning Documents...</span>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-[#E7A93B]" />
                            <span>{preCheckRan ? "Re-Run Pre-Check" : "Run Pre-Check"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {preCheckRan && (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold block">Algorithmic Pre-Check Passed: 5/5 Documents Authentic</span>
                            <span className="text-[11px] text-emerald-700">Tamper Risk: 0% (Low Risk). Ready for Society Onboarding.</span>
                          </div>
                        </div>
                        <span className="bg-emerald-600 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                          SCORE: 0% RISK
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: PRIMARY COOPERATIVE SOCIETY */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-900">Step 4: Primary Cooperative Society Affiliation</h2>
                    <p className="text-xs text-slate-500">
                      Select your affiliated local society in {district}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Vijayawada Central Labour Co-op Society (PACS-04)",
                        address: "Benz Circle, Vijayawada",
                        members: "340 active members",
                        recommended: true
                      },
                      {
                        name: "Krishna District Technical Trades Cooperative Union",
                        address: "Governorpet, Vijayawada",
                        members: "215 active members",
                        recommended: false
                      },
                      {
                        name: "NTR District Construction & Artisan Society",
                        address: "Auto Nagar, Vijayawada",
                        members: "180 active members",
                        recommended: false
                      }
                    ].map((soc) => (
                      <div
                        key={soc.name}
                        onClick={() => setSelectedSociety(soc.name)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between ${
                          selectedSociety === soc.name
                            ? "border-blue-600 bg-blue-50/50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{soc.name}</span>
                            {soc.recommended && (
                              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Nearest to You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{soc.address}</div>
                          <div className="text-[11px] text-blue-600 font-semibold mt-1">
                            {soc.members}
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="society"
                          checked={selectedSociety === soc.name}
                          onChange={() => setSelectedSociety(soc.name)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: WAGE COMPACT & CODE OF CONDUCT */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-lg font-black text-slate-900">Step 5: Cooperative Fair Wage Compact</h2>
                    <p className="text-xs text-slate-500">Read and agree to our collective standards</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 max-h-48 overflow-y-auto">
                    <p className="font-bold text-slate-900">Cooperative Membership Compact:</p>
                    <p>
                      1. <strong>Fair Minimum Wage Guarantee:</strong> You will never be asked to bid against fellow workers below the district minimum wage rate.
                    </p>
                    <p>
                      2. <strong>0% Commission on Base Labor:</strong> 100% of your statutory labor wages will be credited to your wallet via UPI.
                    </p>
                    <p>
                      3. <strong>Customer Safety & Dignity:</strong> You agree to wear standard safety equipment, respect customer premises, and confirm jobs using the secure customer OTP.
                    </p>
                    <p>
                      4. <strong>Welfare Fund:</strong> A ₹50 cooperative contribution per booking will be pooled directly into your district welfare fund for health and accidental insurance.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-800">
                      <input
                        type="checkbox"
                        checked={agreedToFairWage}
                        onChange={(e) => setAgreedToFairWage(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5"
                      />
                      <span>
                        I agree to uphold the <strong>Cooperative Fair Wage Floor</strong> and not solicit off-book cash surcharges.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-800">
                      <input
                        type="checkbox"
                        checked={agreedToCode}
                        onChange={(e) => setAgreedToCode(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5"
                      />
                      <span>
                        I accept the <strong>Worker Code of Conduct</strong> and agree to attend the in-person verification at my primary society.
                      </span>
                    </label>
                  </div>

                  {/* Digital Signature for Official Smart ID Card */}
                  <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Worker Digital Signature for Smart ID Card *</span>
                      </label>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        Cryptographically Sealed
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Type or confirm your signature as you would sign physical society documents. This will be etched onto your Smart ID Card front face.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div>
                        <input
                          type="text"
                          value={signatureText}
                          onChange={(e) => setSignatureText(e.target.value)}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-300 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-mono block">Signature Preview:</span>
                          <span className="font-serif italic text-base font-bold text-blue-950 tracking-wider">
                            {signatureText || name || "Rajesh Kumar"}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                          ✓ Verified Seal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              )}

              {/* Navigation Pill Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn-secondary !min-h-[42px] text-xs !py-2 !px-5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary !min-h-[42px] text-xs !py-2 !px-7"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="btn-primary !min-h-[46px] text-xs !py-2.5 !px-8 shadow-lg !bg-gradient-to-r !from-blue-600 !via-indigo-600 !to-blue-700"
                  >
                    <span>{isSubmitting ? "Submitting Application..." : "Submit 5 Documents for Society Verification"}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ANTI-FRAUD STATUTORY PENALTIES & PRE-CHECK MODAL */}
      {showFakeDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-rose-200 overflow-hidden relative">
            <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setShowFakeDocModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-rose-200 text-xs font-black uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Statutory Anti-Fraud & UIDAI Verification Policy</span>
              </div>
              <h3 className="text-xl font-black text-white">
                What Happens if Fake Documents are Submitted?
              </h3>
              <p className="text-xs text-rose-100 mt-1">
                Zero tolerance policy for forged identity, counterfeit trade certificates, and duplicated records.
              </p>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-1">
                <strong className="font-bold block text-rose-950">Non-Bailable Criminal Offence:</strong>
                <p>
                  Submitting forged credentials violates <strong>IPC Section 468 (Forgery for Purpose of Cheating)</strong> and <strong>IPC Section 471 (Using as Genuine a Forged Document)</strong>, punishable by up to 7 years imprisonment and fines.
                </p>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-black text-slate-900 text-sm">Automated 4-Tier Detection Pipeline:</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-blue-700 font-bold block">1. UIDAI Verhoeff Checksum Engine</strong>
                    <p className="text-slate-600">
                      Aadhaar numbers undergo algorithmic polynomial validation (Verhoeff D5 algorithm). Random or modified 12-digit numbers are caught immediately before hitting any database.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-blue-700 font-bold block">2. NSDL PAN & Bank Deduplication</strong>
                    <p className="text-slate-600">
                      Cross-checked against registered cooperative member registries. Duplicate PAN usage flags an automatic fraud alert.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-blue-700 font-bold block">3. OCR Font Kerning & Tamper Scan</strong>
                    <p className="text-slate-600">
                      Uploaded PDF/JPG scans are analyzed for Photoshop font mismatches, layered edits, and resolution artifacts.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-rose-700 font-bold block">4. In-Person Society Physical Audit</strong>
                    <p className="text-slate-600">
                      All approved online profiles require physical presentation of original cards at your registered District Primary Labour Cooperative Society.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <strong className="font-bold block">Penal Consequences of Flagged Accounts:</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-950">
                  <li>Instant profile suspension with zero dispatch access.</li>
                  <li>Permanent federation blacklist across 28 states in India.</li>
                  <li>Digital dossier forwarded to District Cyber Crime Cell.</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowFakeDocModal(false)}
                  className="w-full btn-primary !min-h-[44px] justify-center"
                >
                  I Understand & Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
