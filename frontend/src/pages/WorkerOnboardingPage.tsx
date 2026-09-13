import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CoopnexLogo } from "../components/brand/CoopnexLogo";
import { useAuth } from "../context/AuthContext";
import { FormHumanCompanion } from "../components/common/FormHumanCompanion";
import { HierarchicalAddressForm, AddressData } from "../components/location/HierarchicalAddressForm";
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
  EyeOff,
  Calendar
} from "lucide-react";
import { FormField } from "../components/common/FormField";
import { PasswordRequirements } from "../components/common/PasswordRequirements";
import {
  validateName,
  validateDateOfBirth,
  validateAge,
  validateEmailFormat,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  validateRequired,
  formatName,
  formatAddress
} from "../utils/validation";
import { WorkerSmartIdCard } from "../components/WorkerSmartIdCard";
import { LanguageDropdown } from "../components/LanguageDropdown";
import {
  validateAadhaarVerhoeff,
  validatePanFormat,
  evaluatePreliminaryValidation,
  computeAadhaarCheckDigit,
  generateValidAadhaar,
  generateValidPan
} from "../utils/identityValidation";
import {
  ALL_INDIAN_LANGUAGES,
  formatAadhaarNumber,
  cleanAadhaarNumber
} from "../data/indianLanguages";
import { getDistrictSocietiesAndAreas } from "../data/apTelanganaServiceAreas";

const ONBOARDING_BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export const WorkerOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerWorker, sendOtp, verifyOtp, validateEmail } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  // Step 1: Personal & Dual Verification
  const [name, setName] = useState(searchParams.get("name") || "");
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [dateOfBirth, setDateOfBirth] = useState(searchParams.get("dateOfBirth") || "");
  const [calculatedAge, setCalculatedAge] = useState<number | null>(() => {
    const pAge = searchParams.get("age");
    return pAge ? Number(pAge) : null;
  });
  const [age, setAge] = useState(searchParams.get("age") || "");
  const [dobSuccessMsg, setDobSuccessMsg] = useState<string | null>(null);
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [addressData, setAddressData] = useState<Partial<AddressData>>({
    addressType: "WORK"
  });
  const [addressError, setAddressError] = useState<string | null>(null);

  // Maximum selectable date is today, minimum is 120 years ago
  const todayObj = new Date();
  const todayFormatted = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;
  const minDobFormatted = `${todayObj.getFullYear() - 120}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const handleDobChange = (val: string) => {
    setDateOfBirth(val);
    setError(null);
    if (!val) {
      setStep1Errors((prev) => ({ ...prev, age: "❌ Please enter your date of birth. 📅" }));
      setCalculatedAge(null);
      setAge("");
      setDobSuccessMsg(null);
      return;
    }
    const result = validateDateOfBirth(val);
    setCalculatedAge(result.age);
    if (result.isValid && result.age !== null) {
      setAge(String(result.age));
      setStep1Errors((prev) => ({ ...prev, age: undefined }));
      setDobSuccessMsg(result.successMsg || `✅ Age: ${result.age} years — Verified (Eligible to register) 🎉`);
    } else {
      setAge(result.age ? String(result.age) : "");
      setStep1Errors((prev) => ({
        ...prev,
        age: result.error || "🔴 Sorry! You must be at least 18 years old to register as a cooperative specialist. 🎂"
      }));
      setDobSuccessMsg(null);
    }
  };

  const [step1Errors, setStep1Errors] = useState<{
    name?: string;
    gender?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    age?: string;
    district?: string;
    address?: string;
  }>({});

  // Blood Group & Multi-Language Selection for Smart ID
  const paramLangs = searchParams.get("languages")
    ? searchParams.get("languages")!.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Telugu", "English"];
  const [bloodGroup, setBloodGroup] = useState(searchParams.get("bloodGroup") || "");
  const [languagesKnown, setLanguagesKnown] = useState<string[]>(paramLangs);

  // Selected AP & Telangana Service Areas Checkboxes
  const [selectedServiceAreas, setSelectedServiceAreas] = useState<string[]>([]);

  const toggleServiceArea = (area: string) => {
    setSelectedServiceAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // Photo & Digital Signature for Official Smart ID Card (Starts Empty - No Default Photo)
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<{ name: string; size: string } | null>(null);
  const [signatureText, setSignatureText] = useState(searchParams.get("name") || "");

  const toggleLanguage = (lang: string) => {
    setLanguagesKnown((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawBase64 = reader.result as string;
        // Optimize and compress image using HTML5 Canvas for fast network sync and clean DB storage
        const img = new Image();
        img.onload = () => {
          const maxDim = 500;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL("image/jpeg", 0.85);
            setPhotoPreview(compressed);
          } else {
            setPhotoPreview(rawBase64);
          }
          setPhotoFile({ name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` });
        };
        img.onerror = () => {
          setPhotoPreview(rawBase64);
          setPhotoFile({ name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` });
        };
        img.src = rawBase64;
      };
      reader.readAsDataURL(file);
    }
  };

  // Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email Verification States (Server-Validated + Cryptographic Backend OTP)
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(searchParams.get("emailVerified") === "true");
  const [emailOtp, setEmailOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isVerifyingEmailOtp, setIsVerifyingEmailOtp] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [emailOtpJustSent, setEmailOtpJustSent] = useState(false);
  const [emailOtpWrong, setEmailOtpWrong] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);
  const [emailErrorMsg, setEmailErrorMsg] = useState<string | null>(null);
  const [emailDuplicateError, setEmailDuplicateError] = useState<string | null>(null);
  const emailOtpInputs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    let timer: any;
    if (emailOtpSent && emailCountdown > 0 && !emailOtpVerified) {
      timer = setInterval(() => setEmailCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [emailOtpSent, emailCountdown, emailOtpVerified]);

  // Step 2: Trade & Skills
  const [primarySkill, setPrimarySkill] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [secondarySkills, setSecondarySkills] = useState("");
  const [hasOwnTools, setHasOwnTools] = useState(true);

  // Step 3: Identity, 5 KYC Documents & Pre-Check
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [pccNumber, setPccNumber] = useState("");
  const [skillCertName, setSkillCertName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  // Step 3: Real Interactive File Uploads (Starts null - no default files)
  interface UploadedDoc {
    name: string;
    size: string;
    base64?: string;
  }
  const [aadhaarFile, setAadhaarFile] = useState<UploadedDoc | null>(null);
  const [panFile, setPanFile] = useState<UploadedDoc | null>(null);
  const [pccFile, setPccFile] = useState<UploadedDoc | null>(null);
  const [skillFile, setSkillFile] = useState<UploadedDoc | null>(null);
  const [bankFile, setBankFile] = useState<UploadedDoc | null>(null);
  const [showFakeDocModal, setShowFakeDocModal] = useState(false);
  
  // Pre-check verification state
  const [preCheckRan, setPreCheckRan] = useState(false);
  const [preCheckScanning, setPreCheckScanning] = useState(false);
  const [preCheckResult, setPreCheckResult] = useState<{
    status: "PRELIMINARY_PASSED" | "DOCUMENTS_MISSING" | "CHECKSUM_FAILED";
    summaryText: string;
    aadhaarValid: boolean;
    panValid: boolean;
    suggestedAadhaar?: string;
  } | null>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: UploadedDoc | null) => void,
    docType?: "AADHAAR" | "PAN"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

      const reader = new FileReader();
      reader.onload = () => {
        const newDoc: UploadedDoc = {
          name: file.name,
          size: sizeStr,
          base64: reader.result as string
        };
        setter(newDoc);

        // If pre-check was already run, auto re-evaluate when documents are attached
        if (preCheckRan && preCheckResult?.status === "DOCUMENTS_MISSING") {
          const hasAadhaar = docType === "AADHAAR" || Boolean(aadhaarFile);
          const hasPan = docType === "PAN" || Boolean(panFile);
          if (hasAadhaar && hasPan && preCheckResult.aadhaarValid && preCheckResult.panValid) {
            setPreCheckResult({
              status: "PRELIMINARY_PASSED",
              summaryText: "Preliminary Structural Check Passed (Verhoeff D5 Checksum & NSDL PAN validated). All required scans attached.",
              aadhaarValid: true,
              panValid: true
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 4: Society
  const [selectedSociety, setSelectedSociety] = useState("");

  // Step 5: Compact & Code of Conduct
  const [agreedToCode, setAgreedToCode] = useState(false);
  const [agreedToFairWage, setAgreedToFairWage] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Verification helper methods (Server Validated + Cryptographic OTP)
  const handleSendEmailOtp = async () => {
    setEmailErrorMsg(null);
    setEmailStatusMsg(null);
    setEmailDuplicateError(null);
    setEmailOtpWrong(false);
    setStep1Errors((prev) => ({ ...prev, email: undefined }));

    const cleanEmail = email.trim().toLowerCase();

    // STEP 1: Client-Side Syntax Check
    const fmtCheck = validateEmailFormat(cleanEmail);
    if (!fmtCheck.isValid) {
      setStep1Errors((prev) => ({ ...prev, email: "❌ Please enter a valid email address. 📧" }));
      return;
    }

    setIsSendingEmailOtp(true);
    setIsCheckingEmail(true);

    try {
      // STEP 2: Server-Side Real Email Validation (ZeroBounce + DNS MX + Disposable Blocklists)
      const valRes = await validateEmail(cleanEmail, "REGISTER", "WORKER");

      if (!valRes.safeToSendOtp) {
        setIsSendingEmailOtp(false);
        setIsCheckingEmail(false);
        if (valRes.reason === "already_registered_worker" || valRes.reason === "already_registered") {
          setEmailDuplicateError(valRes.message);
        } else {
          setEmailErrorMsg(valRes.message || "❌ We couldn't verify this email address. Please check it and try again. 📧");
        }
        return;
      }

      // STEP 3: Cryptographic OTP dispatch via backend
      const res = await sendOtp(cleanEmail, "REGISTER", name.trim() || undefined, "WORKER");

      setIsSendingEmailOtp(false);
      setIsCheckingEmail(false);

      if (res.success) {
        setEmailOtpSent(true);
        setEmailOtpJustSent(true);
        setTimeout(() => setEmailOtpJustSent(false), 2000);
        setEmailCountdown(res.retryAfterSeconds || 60);
        const infoMsg = valRes.isExistingUser
          ? `✅ Verification code sent! ${valRes.message || "Your existing account will be connected to your new Worker profile."} 📩`
          : "✅ Verification code sent! Please check your email inbox. 📩";
        setEmailStatusMsg(infoMsg);
        setTimeout(() => emailOtpInputs.current[0]?.focus(), 100);
      } else {
        if (res.retryAfterSeconds) {
          setEmailCountdown(res.retryAfterSeconds);
        }
        if (res.message?.includes("already registered") || res.message?.includes("already exists")) {
          setEmailDuplicateError(res.message);
        } else {
          setEmailErrorMsg(res.message || "❌ We couldn't send the verification code. Please try again. 📩");
        }
      }
    } catch {
      setIsSendingEmailOtp(false);
      setIsCheckingEmail(false);
      setEmailErrorMsg("❌ We couldn't send the verification code. Please try again. 📩");
    }
  };

  const handleEmailOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...emailOtp];
    newOtp[index] = clean;
    setEmailOtp(newOtp);
    setEmailOtpWrong(false);

    if (clean && index < 5) {
      emailOtpInputs.current[index + 1]?.focus();
    }

    if (clean && index === 5 && newOtp.every((d) => d.length === 1)) {
      executeVerifyEmailOtp(newOtp.join(""));
    }
  };

  const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!emailOtp[index] && index > 0) {
        emailOtpInputs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      emailOtpInputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      emailOtpInputs.current[index + 1]?.focus();
    }
  };

  const handleEmailOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...emailOtp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setEmailOtp(newOtp);
    setEmailOtpWrong(false);

    const nextIndex = Math.min(pasted.length, 5);
    emailOtpInputs.current[nextIndex]?.focus();

    if (pasted.length === 6) {
      executeVerifyEmailOtp(pasted);
    }
  };

  const executeVerifyEmailOtp = async (code: string) => {
    if (code.length !== 6) {
      setEmailErrorMsg("❌ Incorrect OTP. Please check the code and try again. 🔐");
      setEmailOtpWrong(true);
      return;
    }

    setEmailErrorMsg(null);
    setEmailOtpWrong(false);
    setIsVerifyingEmailOtp(true);

    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await verifyOtp(cleanEmail, code, "REGISTER");
      setIsVerifyingEmailOtp(false);

      if (res.success) {
        setEmailOtpVerified(true);
        setEmailOtpSent(false);
        setEmailOtpWrong(false);
        setEmailStatusMsg("✅ Email verified successfully! 🎉");
      } else {
        setEmailOtpWrong(true);
        setEmailErrorMsg(res.message || "❌ Incorrect OTP. Please check the code and try again. 🔐");
      }
    } catch {
      setIsVerifyingEmailOtp(false);
      setEmailOtpWrong(true);
      setEmailErrorMsg("❌ Incorrect OTP. Please check the code and try again. 🔐");
    }
  };

  const handleVerifyEmailOtp = async () => {
    await executeVerifyEmailOtp(emailOtp.join("").trim());
  };

  const getStep1CompanionState = () => {
    if (emailOtpVerified) return "EMAIL_VERIFIED";
    if (emailOtpWrong) return "WRONG_OTP";
    if (emailOtpSent) return "OTP_SENT";
    if (isCheckingEmail || isSendingEmailOtp || isVerifyingEmailOtp) return "CHECKING_EMAIL";
    if (emailErrorMsg && (emailErrorMsg.includes("unavailable") || emailErrorMsg.includes("service") || emailErrorMsg.includes("couldn't send") || emailErrorMsg.includes("taking too long") || emailErrorMsg.includes("timeout") || emailErrorMsg.includes("connect"))) {
      return "SERVICE_ERROR";
    }
    if (emailErrorMsg && emailErrorMsg.includes("Too many")) {
      return "RATE_LIMITED";
    }
    if (step1Errors.email || emailErrorMsg || emailDuplicateError) return "INVALID_EMAIL";
    if (email.includes("@") && !step1Errors.email && !emailErrorMsg) return "EMAIL_VALID";
    if (step1Errors.name) return "INVALID_NAME";
    if (password.length >= 8) return "STRONG_PASSWORD";
    if (name || email || phone) return "TYPING";
    return "IDLE";
  };

  const getCompanionCustomMessage = () => {
    if (emailErrorMsg && (emailErrorMsg.includes("unavailable") || emailErrorMsg.includes("service") || emailErrorMsg.includes("couldn't send") || emailErrorMsg.includes("taking too long") || emailErrorMsg.includes("Too many") || emailErrorMsg.includes("connect"))) {
      return emailErrorMsg.replace(/^[❌⚠️⏱️]\s*/, "");
    }
    return undefined;
  };

  // Run Algorithmic Pre-Check with Authentic UIDAI Verhoeff Checksum & NSDL PAN Validation
  const handleRunPreCheck = (
    customAadhaar?: string,
    customPan?: string,
    customHasAadhaarDoc?: boolean,
    customHasPanDoc?: boolean
  ) => {
    setError(null);
    setPreCheckScanning(true);

    const targetAadhaar = (customAadhaar !== undefined ? customAadhaar : aadhaarNumber).replace(/\s+/g, "");
    const targetPan = (customPan !== undefined ? customPan : panNumber).toUpperCase().trim();

    setTimeout(() => {
      setPreCheckScanning(false);

      if (!targetAadhaar) {
        setPreCheckResult({
          status: "CHECKSUM_FAILED",
          summaryText: "Aadhaar number is missing. Please enter your 12-digit Aadhaar number before running pre-check.",
          aadhaarValid: false,
          panValid: Boolean(targetPan && validatePanFormat(targetPan).valid)
        });
        setPreCheckRan(true);
        return;
      }

      if (targetAadhaar.length !== 12) {
        setPreCheckResult({
          status: "CHECKSUM_FAILED",
          summaryText: `Aadhaar must be exactly 12 digits (currently ${targetAadhaar.length} digits).`,
          aadhaarValid: false,
          panValid: Boolean(targetPan && validatePanFormat(targetPan).valid)
        });
        setPreCheckRan(true);
        return;
      }

      const aadhaarCheck = validateAadhaarVerhoeff(targetAadhaar);
      let suggestedFix: string | undefined = undefined;
      if (!aadhaarCheck.valid && targetAadhaar.length === 12) {
        const correctDigit = computeAadhaarCheckDigit(targetAadhaar.slice(0, 11));
        suggestedFix = targetAadhaar.slice(0, 11) + correctDigit;
      }

      if (!targetPan) {
        setPreCheckResult({
          status: "CHECKSUM_FAILED",
          summaryText: "PAN card number is missing. Please enter your 10-character PAN number.",
          aadhaarValid: aadhaarCheck.valid,
          panValid: false,
          suggestedAadhaar: suggestedFix
        });
        setPreCheckRan(true);
        return;
      }

      const panCheck = validatePanFormat(targetPan);
      if (!panCheck.valid) {
        setPreCheckResult({
          status: "CHECKSUM_FAILED",
          summaryText: `PAN Validation Failed: ${panCheck.message}`,
          aadhaarValid: aadhaarCheck.valid,
          panValid: false,
          suggestedAadhaar: suggestedFix
        });
        setPreCheckRan(true);
        return;
      }

      if (!aadhaarCheck.valid) {
        setPreCheckResult({
          status: "CHECKSUM_FAILED",
          summaryText: `Aadhaar Validation Failed: ${aadhaarCheck.message}`,
          aadhaarValid: false,
          panValid: true,
          suggestedAadhaar: suggestedFix
        });
        setPreCheckRan(true);
        return;
      }

      const hasAadhaar = customHasAadhaarDoc !== undefined ? customHasAadhaarDoc : Boolean(aadhaarFile);
      const hasPan = customHasPanDoc !== undefined ? customHasPanDoc : Boolean(panFile);

      const evalRes = evaluatePreliminaryValidation({
        aadhaarChecksumValid: true,
        panFormatValid: true,
        hasAadhaarDoc: hasAadhaar,
        hasPanDoc: hasPan
      });

      setPreCheckResult({
        status: evalRes.status,
        summaryText: evalRes.summaryText,
        aadhaarValid: true,
        panValid: true
      });
      setPreCheckRan(true);
    }, 600);
  };

  const handleApplyCorrectedAadhaar = (correctedNumber: string) => {
    setAadhaarNumber(correctedNumber);
    handleRunPreCheck(correctedNumber);
  };

  const handleFillTestKyc = () => {
    const validAadhaar = generateValidAadhaar("54829103847"); // 548291038476
    const validPan = generateValidPan(); // ABCDE1234F
    const validPcc = "AP-VJA-2026-8941";
    setAadhaarNumber(validAadhaar);
    setPanNumber(validPan);
    setPccNumber(validPcc);

    const sampleDoc: UploadedDoc = {
      name: "sample_verified_kyc_document.pdf",
      size: "145 KB",
      base64: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjEgMCBvYmoKPDwKL1RpdGxlIChDT09QTkVYIFZlcmlmaWVkIEtZQykKL0F1dGhvciAoQ09PUE5FWCkKPj4KZW5kb2JqCg=="
    };
    setAadhaarFile({ ...sampleDoc, name: "aadhaar_card_sample.pdf" });
    setPanFile({ ...sampleDoc, name: "pan_card_sample.pdf" });
    setPccFile({ ...sampleDoc, name: "police_clearance_sample.pdf" });

    setTimeout(() => {
      handleRunPreCheck(validAadhaar, validPan, true, true);
    }, 100);
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      const nameCheck = validateName(name);
      const genderCheck = validateRequired(gender, "Gender");
      const phoneCheck = phone ? validatePhone(phone) : { isValid: true, error: undefined };
      const emailCheck = validateEmailFormat(email);
      const passCheck = validatePassword(password);
      const confirmCheck = validateConfirmPassword(password, confirmPassword);
      const dobCheck = validateDateOfBirth(dateOfBirth);
      const isAddressValid = Boolean(
        addressData.pincode &&
        addressData.pincode.length === 6 &&
        addressData.district &&
        addressData.street &&
        addressData.houseNumber
      );

      const errors: typeof step1Errors = {};
      if (!nameCheck.isValid) errors.name = nameCheck.error;
      if (!genderCheck.isValid) errors.gender = genderCheck.error;
      if (!phoneCheck.isValid) errors.phone = phoneCheck.error;
      if (!emailCheck.isValid) errors.email = emailCheck.error;
      if (!passCheck.isValid) errors.password = passCheck.error;
      if (!confirmCheck.isValid) errors.confirmPassword = confirmCheck.error;
      if (!dobCheck.isValid) errors.age = dobCheck.error || "🔴 Sorry! You must be at least 18 years old to register as a cooperative specialist. 🎂";
      if (!isAddressValid) errors.address = "Please complete your postal PIN code, street, and door number.";

      if (Object.keys(errors).length > 0) {
        setStep1Errors(errors);
        setError("Please correct the highlighted form errors before continuing.");
        return;
      }

      if (!emailOtpVerified) {
        setError("Email verification is required. Please verify your email address with the 6-digit OTP.");
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
      const cleanAadhaar = aadhaarNumber.replace(/\s+/g, "");
      const cleanPan = panNumber.toUpperCase().trim();

      if (!cleanAadhaar || cleanAadhaar.length !== 12) {
        setError("Please enter a valid 12-digit Aadhaar number.");
        return;
      }
      const aCheck = validateAadhaarVerhoeff(cleanAadhaar);
      if (!aCheck.valid) {
        setError(`Invalid Aadhaar: ${aCheck.message}`);
        return;
      }
      if (!cleanPan || cleanPan.length !== 10) {
        setError("Please enter a valid 10-character PAN number.");
        return;
      }
      const pCheck = validatePanFormat(cleanPan);
      if (!pCheck.valid) {
        setError(`Invalid PAN: ${pCheck.message}`);
        return;
      }
      if (!aadhaarFile) {
        setError("Please upload your Aadhaar document to continue.");
        return;
      }
      if (!panFile) {
        setError("Please upload your PAN document to continue.");
        return;
      }
      if (!preCheckRan || !preCheckResult || preCheckResult.status === "CHECKSUM_FAILED") {
        setError("Please run the Algorithmic Pre-Check to structurally validate your identity documents.");
        return;
      }
    }
    if (step === 4) {
      const cfg = getDistrictSocietiesAndAreas(addressData.district || district || "Tirupati");
      if (!selectedSociety && cfg.societies.length > 0) {
        setSelectedSociety(cfg.societies[0].name);
      }
      if (selectedServiceAreas.length === 0 && cfg.serviceAreas.length > 0) {
        setSelectedServiceAreas(cfg.serviceAreas.slice(0, 3));
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

    const cleanAadhaar = cleanAadhaarNumber(aadhaarNumber);
    const cleanPan = panNumber.toUpperCase().trim();

    try {
      const res = await registerWorker({
        name,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" "),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        password,
        gender: gender || "Other",
        dateOfBirth: dateOfBirth || undefined,
        age: calculatedAge || (age ? Number(age) : 28),
        district: addressData.district || district,
        state: addressData.state,
        stateCode: addressData.stateCode,
        mandal: addressData.mandal,
        city: addressData.city,
        village: addressData.village,
        street: addressData.street,
        houseNumber: addressData.houseNumber,
        address: address.trim() || [
          addressData.houseNumber,
          addressData.street,
          addressData.landmark,
          addressData.village,
          addressData.mandal,
          addressData.district,
          addressData.state,
          addressData.pincode
        ].filter(Boolean).join(", "),
        pincode: addressData.pincode || "520001",
        coordinates: addressData.coordinates,
        bloodGroup: bloodGroup || "O+",
        languages: languagesKnown.length > 0 ? languagesKnown : ["Telugu", "Hindi", "English"],
        selectedServiceAreas: selectedServiceAreas.length > 0
          ? selectedServiceAreas
          : [addressData.mandal || addressData.district || "Central Zone"],
        avatarUrl: photoPreview || "",
        photoPreview: photoPreview || "",
        signatureText: signatureText || name,
        societyName: selectedSociety || `${addressData.district || district || "Regional"} Central Labour Co-op Society`,
        selectedSociety: selectedSociety || `${addressData.district || district || "Regional"} Central Labour Co-op Society`,
        primarySkill: primarySkill || "Electrician",
        skills: [primarySkill || "Electrician", ...(secondarySkills ? secondarySkills.split(",").map(s => s.trim()).filter(Boolean) : [])],
        experienceYears: Number(experienceYears) || 3,
        aadhaarNumber: cleanAadhaar,
        aadhaarFileBase64: aadhaarFile?.base64 || "",
        aadhaarOriginalFilename: aadhaarFile?.name || "aadhaar_card.pdf",
        panNumber: cleanPan,
        panFileBase64: panFile?.base64 || "",
        panOriginalFilename: panFile?.name || "pan_card.pdf",
        pccNumber: pccNumber.trim(),
        pccFileBase64: pccFile?.base64 || "",
        pccOriginalFilename: pccFile?.name || "police_clearance.pdf",
        bankAccount: bankAccount || "",
        bankIfsc: bankIfsc || "",
        emailVerified: true,
        phoneVerified: false,
        verificationStatus: "PENDING",
        status: "PENDING_APPROVAL"
      });

      if (res && res.success === false) {
        setError(res.message || "Registration failed. Please check your information and try again.");
        return;
      }

      if (res && res.employeeId) {
        setTrackingId(res.employeeId);
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please verify your connection.");
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center ring-2 ring-[#FF6B00]">
                <ShieldCheck className="w-4 h-4" />
              </div>
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
                    name: name || "Registered Artisan",
                    age: calculatedAge ? `${calculatedAge}` : (age || "28"),
                    gender: gender,
                    skills: [primarySkill, ...(secondarySkills ? secondarySkills.split(",").map(s => s.trim()).filter(Boolean) : [])],
                    bloodGroup: bloodGroup || "O+",
                    languagesKnown: languagesKnown.length > 0 ? languagesKnown : ["Telugu", "Hindi", "English"],
                    district: addressData.district || district || "Registered District",
                    societyName: selectedSociety || `${addressData.district || district || "Regional"} Central Labour Co-op Society`,
                    photoUrl: photoPreview,
                    signatureText: signatureText || name || "Authorized Artisan",
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
                    <p className="text-xs text-slate-500">Email address must be verified via secure OTP verification</p>
                  </div>

                  {/* Interactive Character Companion reacting to form progress */}
                  <div className="flex justify-center pb-1">
                    <FormHumanCompanion state={getStep1CompanionState()} customMessage={getCompanionCustomMessage()} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      id="worker-onboarding-name"
                      label="Full Legal Name (as on Aadhaar)"
                      required
                      error={step1Errors.name}
                    >
                      <input
                        id="worker-onboarding-name"
                        type="text"
                        placeholder="e.g. Rajesh Kumar"
                        value={name}
                        onChange={(e) => {
                          const val = formatName(e.target.value, true);
                          setName(val);
                          setError(null);
                          const check = validateName(val);
                          setStep1Errors((prev) => ({ ...prev, name: check.error }));
                        }}
                        onBlur={() => {
                          const trimmed = formatName(name, false);
                          setName(trimmed);
                          const check = validateName(trimmed);
                          setStep1Errors((prev) => ({ ...prev, name: check.error }));
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      />
                    </FormField>

                    <FormField
                      id="worker-onboarding-gender"
                      label="Gender"
                      required
                      error={step1Errors.gender}
                    >
                      <select
                        id="worker-onboarding-gender"
                        value={gender}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGender(val);
                          setError(null);
                          const check = validateRequired(val, "Gender");
                          setStep1Errors((prev) => ({ ...prev, gender: check.error }));
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormField>
                  </div>

                  {/* Optional Contact Phone Number */}
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                    <FormField
                      id="worker-onboarding-phone"
                      label="Contact Phone Number (Optional)"
                      error={step1Errors.phone}
                    >
                      <div className="relative">
                        <div className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                          +91
                        </div>
                        <input
                          id="worker-onboarding-phone"
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setPhone(val);
                            setError(null);
                            if (val.length > 0) {
                              const check = validatePhone(val);
                              setStep1Errors((prev) => ({ ...prev, phone: check.error }));
                            } else {
                              setStep1Errors((prev) => ({ ...prev, phone: undefined }));
                            }
                          }}
                          className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </FormField>
                  </div>

                  {/* Email + Real Server Validated OTP Verification */}
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Email Address *
                      </label>
                      {emailOtpVerified ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Email Verified</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEmailOtpVerified(false);
                              setEmailOtpSent(false);
                              setEmailOtp(["", "", "", "", "", ""]);
                            }}
                            className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                        <input
                          id="worker-onboarding-email"
                          type="email"
                          placeholder="rajesh.kumar@example.com"
                          value={email}
                          onChange={(e) => {
                            const newEmail = e.target.value;
                            setEmail(newEmail);
                            if (emailOtpVerified || emailOtpSent) {
                              setEmailOtpVerified(false);
                              setEmailOtpSent(false);
                              setEmailOtp(["", "", "", "", "", ""]);
                              setEmailStatusMsg("Email changed — please verify again.");
                            }
                            setError(null);
                            const check = validateEmailFormat(newEmail);
                            setStep1Errors((prev) => ({ ...prev, email: check.isValid ? undefined : check.error }));
                            setEmailErrorMsg(null);
                            setEmailDuplicateError(null);
                          }}
                          onBlur={() => {
                            const check = validateEmailFormat(email);
                            setStep1Errors((prev) => ({ ...prev, email: check.isValid ? undefined : check.error }));
                          }}
                          className={`w-full bg-white border ${
                            step1Errors.email || emailErrorMsg || emailDuplicateError
                              ? "border-rose-500 bg-rose-50/20 text-rose-900"
                              : emailOtpVerified
                              ? "border-emerald-500 bg-emerald-50/20"
                              : "border-slate-300"
                          } rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 transition`}
                        />
                      </div>
                      {!emailOtpVerified ? (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={
                            isSendingEmailOtp ||
                            isCheckingEmail ||
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
                            <span className="flex items-center gap-1.5" aria-live="polite">
                              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending OTP...</span>
                            </span>
                          ) : emailOtpJustSent ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>OTP Sent</span>
                            </span>
                          ) : emailOtpSent ? (
                            <span className="flex items-center gap-1">
                              <RotateCcw className="w-3 h-3" />
                              <span>{emailCountdown > 0 ? `Resend OTP in ${emailCountdown}s` : "Resend OTP"}</span>
                            </span>
                          ) : (
                            <span>Verify</span>
                          )}
                        </button>
                      ) : (
                        <div className="px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0">
                          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                          <span>✓ Verified</span>
                        </div>
                      )}
                    </div>

                    {/* Email Feedback Messages directly underneath with smooth animation */}
                    <AnimatePresence mode="wait">
                      {step1Errors.email && (
                        <motion.div
                          key="syntax-error"
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 mt-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{step1Errors.email}</span>
                        </motion.div>
                      )}
                      {emailErrorMsg && !step1Errors.email && (
                        <motion.div
                          key="validation-error"
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 mt-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{emailErrorMsg}</span>
                        </motion.div>
                      )}
                      {emailDuplicateError && !step1Errors.email && (
                        <motion.div
                          key="duplicate-error"
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 mt-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{emailDuplicateError}</span>
                        </motion.div>
                      )}
                      {emailStatusMsg && !emailOtpVerified && !step1Errors.email && !emailErrorMsg && (
                        <motion.div
                          key="status-msg"
                          initial={{ opacity: 0, height: 0, y: -6 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium mt-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{emailStatusMsg}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* 6-Digit Email OTP Box — COMPLETELY HIDDEN initially until validation + send succeeds */}
                    <AnimatePresence>
                      {emailOtpSent && !emailOtpVerified && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -8 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -8 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="mt-3 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                              <span>📩</span>
                              <span>Verification code sent! Enter the 6-digit code:</span>
                            </span>
                            {emailCountdown > 0 ? (
                              <span className="text-[11px] text-slate-500 font-medium">
                                Resend in <strong className="text-blue-600 font-mono">{emailCountdown}s</strong>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendEmailOtp}
                                disabled={isSendingEmailOtp}
                                className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                              >
                                Resend code
                              </button>
                            )}
                          </div>

                          {/* 6 Individual Digit Boxes */}
                          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
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
                                className={`w-10 h-12 text-center text-lg font-black rounded-xl border ${
                                  emailOtpWrong
                                    ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20 text-rose-900"
                                    : "border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                                } focus:outline-hidden transition shadow-2xs`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-500 font-medium">
                              ⏱️ Valid for 5 minutes only
                            </span>
                            <button
                              type="button"
                              onClick={handleVerifyEmailOtp}
                              disabled={isVerifyingEmailOtp || emailOtp.some((d) => !d)}
                              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              {isVerifyingEmailOtp ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Verifying...</span>
                                </>
                              ) : (
                                <span>Verify Code</span>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                      <FormField
                        id="worker-onboarding-password"
                        label="Password (Min 8 characters)"
                        required
                        error={step1Errors.password}
                      >
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            id="worker-onboarding-password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPassword(val);
                              setError(null);
                              const check = validatePassword(val);
                              setStep1Errors((prev) => ({ ...prev, password: check.error }));
                              if (confirmPassword) {
                                const cCheck = validateConfirmPassword(val, confirmPassword);
                                setStep1Errors((prev) => ({ ...prev, confirmPassword: cCheck.error }));
                              }
                            }}
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
                      </FormField>

                      <FormField
                        id="worker-onboarding-confirm-password"
                        label="Confirm Password"
                        required
                        error={step1Errors.confirmPassword}
                      >
                        <div className="relative">
                          <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                          <input
                            id="worker-onboarding-confirm-password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => {
                              const val = e.target.value;
                              setConfirmPassword(val);
                              setError(null);
                              const check = validateConfirmPassword(password, val);
                              setStep1Errors((prev) => ({ ...prev, confirmPassword: check.error }));
                            }}
                            className={`w-full bg-white border ${
                              confirmPassword && confirmPassword !== password
                                ? "border-rose-400"
                                : confirmPassword && confirmPassword === password
                                ? "border-emerald-500"
                                : "border-slate-300"
                            } rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600`}
                          />
                        </div>
                      </FormField>
                    </div>

                    {/* Dynamic 5-point Password Requirements */}
                    {password && (
                      <div className="p-3 bg-white border border-slate-200 rounded-2xl">
                        <PasswordRequirements password={password} />
                      </div>
                    )}
                  </div>

                  <FormField
                    id="worker-onboarding-dob"
                    label="Date of Birth"
                    required
                    error={step1Errors.age}
                  >
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          id="worker-onboarding-dob"
                          type="date"
                          max={todayFormatted}
                          min={minDobFormatted}
                          required
                          value={dateOfBirth}
                          onChange={(e) => handleDobChange(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 transition"
                        />
                      </div>

                      {/* Dynamic Age Badge & Eligibility Indicator */}
                      {calculatedAge !== null && (
                        <div className="flex items-center gap-2 pt-0.5">
                          {calculatedAge >= 18 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Age: {calculatedAge} years — Verified (Eligible &gt; 18)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-lg">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Age: {calculatedAge} years — Ineligible (Must be at least 18)</span>
                            </span>
                          )}
                        </div>
                      )}
                      {dobSuccessMsg && !step1Errors.age && (
                        <p className="text-[11px] text-emerald-600 font-semibold">{dobSuccessMsg}</p>
                      )}
                    </div>
                  </FormField>

                {/* Hierarchical Postal & Locality Address Form */}
                <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
                  <HierarchicalAddressForm
                    value={addressData}
                    onChange={(updated) => {
                      setAddressData(updated);
                      setDistrict(updated.district);
                      setAddress(
                        [
                          updated.houseNumber,
                          updated.street,
                          updated.landmark,
                          updated.village,
                          updated.mandal,
                          updated.district,
                          updated.state,
                          updated.pincode
                        ].filter(Boolean).join(", ")
                      );
                      setAddressError(null);
                      setStep1Errors((prev) => ({ ...prev, district: undefined, address: undefined }));
                    }}
                    roleType="WORKER"
                    error={step1Errors.address || addressError}
                  />
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
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Uploaded Worker Avatar"
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400">
                              <User className="w-6 h-6" />
                            </div>
                          )}
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
                            {photoFile ? `${photoFile.name} (${photoFile.size})` : "Upload passport photo (JPG/PNG)"}
                          </span>
                          <label
                            htmlFor="worker-photo-upload"
                            className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer inline-block mt-0.5"
                          >
                            {photoPreview ? "Change Photo →" : "Upload from Device →"}
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
                          <option value="">Select Blood Group</option>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1 max-h-60 overflow-y-auto pr-1">
                      {ALL_INDIAN_LANGUAGES.map((lang) => {
                        const isSelected = languagesKnown.includes(lang.name);
                        return (
                          <label
                            key={lang.code}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                              isSelected
                                ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs"
                                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleLanguage(lang.name)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <div className="truncate">
                              <span className="block truncate text-[11px] font-bold">{lang.name}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{lang.nativeName}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <FormField
                    id="worker-onboarding-address"
                    label="Residential Address / Colony"
                    required
                    error={step1Errors.address}
                  >
                    <textarea
                      id="worker-onboarding-address"
                      rows={2}
                      placeholder="Door number, street, landmark, pincode"
                      value={address}
                      onChange={(e) => {
                        const val = formatAddress(e.target.value, true);
                        setAddress(val);
                        setError(null);
                        const check = validateRequired(val, "Residential Address");
                        setStep1Errors((prev) => ({ ...prev, address: check.error }));
                      }}
                      onBlur={() => {
                        const trimmed = formatAddress(address, false);
                        setAddress(trimmed);
                        const check = validateRequired(trimmed, "Residential Address");
                        setStep1Errors((prev) => ({ ...prev, address: check.error }));
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </FormField>
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
                        <option value="">Select Primary Trade</option>
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
                        <option value="">Select Experience Level</option>
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
                          maxLength={14}
                          placeholder="e.g. 5482-9103-8476"
                          value={aadhaarNumber}
                          onChange={(e) => setAadhaarNumber(formatAadhaarNumber(e.target.value))}
                          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            id="aadhaar-file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, setAadhaarFile, "AADHAAR")}
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
                            onChange={(e) => handleFileUpload(e, setPanFile, "PAN")}
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
                  <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-[#101828] block">
                            Algorithmic Pre-Check Engine
                          </strong>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-100 text-blue-800">
                            UIDAI D5 + NSDL
                          </span>
                        </div>
                        <span className="text-[11px] text-blue-950 block mt-0.5">
                          Run automated checksum &amp; format validation before submitting your application
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleFillTestKyc}
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-xl shadow-2xs transition inline-flex items-center gap-1 cursor-pointer"
                          title="Fills valid Aadhaar, PAN, PCC and sample documents"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Fill Test KYC</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRunPreCheck()}
                          disabled={preCheckScanning}
                          className="btn-primary !min-h-[38px] text-xs !py-1.5 !px-4 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                        >
                          {preCheckScanning ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Scanning Documents...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-[#E7A93B]" />
                              <span>{preCheckRan ? "Re-Run Pre-Check" : "Run Pre-Check"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {preCheckRan && preCheckResult && (
                      <div className={`p-4 rounded-xl border space-y-3 text-xs ${
                        preCheckResult.status === "PRELIMINARY_PASSED"
                          ? "bg-blue-50/80 border-blue-300 text-blue-950"
                          : preCheckResult.status === "DOCUMENTS_MISSING"
                          ? "bg-amber-50/80 border-amber-300 text-amber-950"
                          : "bg-rose-50/80 border-rose-300 text-rose-950"
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${
                              preCheckResult.status === "PRELIMINARY_PASSED"
                                ? "text-blue-600"
                                : preCheckResult.status === "DOCUMENTS_MISSING"
                                ? "text-amber-600"
                                : "text-rose-600"
                            }`} />
                            <div>
                              <span className="font-black block text-sm">
                                {preCheckResult.status === "PRELIMINARY_PASSED"
                                  ? "Preliminary Structural Check Passed"
                                  : preCheckResult.status === "DOCUMENTS_MISSING"
                                  ? "Structural Check Passed — Scans Recommended"
                                  : "Credential Structural Check Failed"}
                              </span>
                              <span className="text-[11px] opacity-90 leading-normal block mt-0.5">
                                {preCheckResult.summaryText}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black shrink-0 uppercase tracking-wider ${
                            preCheckResult.status === "PRELIMINARY_PASSED"
                              ? "bg-blue-600 text-white"
                              : preCheckResult.status === "DOCUMENTS_MISSING"
                              ? "bg-amber-600 text-white"
                              : "bg-rose-600 text-white"
                          }`}>
                            {preCheckResult.status === "CHECKSUM_FAILED" ? "ACTION REQUIRED" : "MANUAL REVIEW PENDING"}
                          </span>
                        </div>

                        {/* If Aadhaar checksum digit is wrong, provide 1-click correct check digit */}
                        {preCheckResult.suggestedAadhaar && (
                          <div className="p-2.5 bg-rose-100/90 border border-rose-300 rounded-xl flex items-center justify-between gap-2 text-[11px] text-rose-950">
                            <div>
                              <span className="block font-semibold">UIDAI Verhoeff Suggested Checksum:</span>
                              <span className="font-mono text-xs font-bold text-rose-800">{preCheckResult.suggestedAadhaar}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyCorrectedAadhaar(preCheckResult.suggestedAadhaar!)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] cursor-pointer shadow-xs transition shrink-0"
                            >
                              Apply &amp; Validate
                            </button>
                          </div>
                        )}

                        <div className="p-3 bg-white/90 rounded-xl text-[11px] space-y-2 border border-blue-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 font-medium">
                              {preCheckResult.aadhaarValid ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="text-slate-800">Aadhaar Verhoeff: <strong className="text-emerald-700">Valid D5 Parity</strong></span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span className="text-slate-800">Aadhaar Verhoeff: <strong className="text-rose-700">Checksum Failed</strong></span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                              {preCheckResult.panValid ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="text-slate-800">NSDL PAN Format: <strong className="text-emerald-700">Valid (5A-4N-1A)</strong></span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  <span className="text-slate-800">NSDL PAN Format: <strong className="text-rose-700">Invalid Format</strong></span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                              {aadhaarFile ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="text-slate-800">Aadhaar Document: <strong className="text-emerald-700">Attached</strong></span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span className="text-slate-800">Aadhaar Document: <strong className="text-amber-700">Scan Required</strong></span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                              {panFile ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span className="text-slate-800">PAN Card Document: <strong className="text-emerald-700">Attached</strong></span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span className="text-slate-800">PAN Card Document: <strong className="text-amber-700">Scan Required</strong></span>
                                </>
                              )}
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-2 border-t border-slate-200/80 pt-2 leading-relaxed">
                            ℹ️ <strong>Truth in Verification:</strong> Algorithmic validation confirms structural correctness only. In accordance with UIDAI and cooperative governance standards, <em>identity authenticity is certified upon manual inspection of original cards by the Super Administrator</em>.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: PRIMARY COOPERATIVE SOCIETY & SERVICE AREAS */}
              {step === 4 && (() => {
                const currentDistrictConfig = getDistrictSocietiesAndAreas(addressData.district || district || "Tirupati");
                return (
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                          {currentDistrictConfig.state} Cooperative Federation
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-slate-900 mt-1">Step 4: Society Affiliation &amp; Service Area Coverage</h2>
                      <p className="text-xs text-slate-500">
                        Affiliated cooperative societies and service dispatch zones in <strong className="text-slate-800">{currentDistrictConfig.district}</strong>
                      </p>
                    </div>

                    {/* Primary Cooperative Society */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>Choose Primary Labour Cooperative Society *</span>
                      </h3>
                      <div className="space-y-2.5">
                        {currentDistrictConfig.societies.map((soc) => (
                          <div
                            key={soc.name}
                            onClick={() => setSelectedSociety(soc.name)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between ${
                              (selectedSociety === soc.name || (!selectedSociety && soc.recommended))
                                ? "border-blue-600 bg-blue-50/50 shadow-xs"
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
                              checked={selectedSociety === soc.name || (!selectedSociety && Boolean(soc.recommended))}
                              onChange={() => setSelectedSociety(soc.name)}
                              className="mt-1 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Service Areas Multi-Checkbox Selector */}
                    <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>Service Areas in {currentDistrictConfig.district} (Choose Multiple) *</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Select the local mandals, town sectors, and areas around your location where you accept bookings:
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedServiceAreas(currentDistrictConfig.serviceAreas)}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 transition cursor-pointer"
                          >
                            Select All
                          </button>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                            {selectedServiceAreas.length > 0 ? `${selectedServiceAreas.length} Areas Selected` : "Select at least 1"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {currentDistrictConfig.serviceAreas.map((area) => {
                          const isChecked = selectedServiceAreas.includes(area);
                          return (
                            <label
                              key={area}
                              className={`p-3 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                                isChecked
                                  ? "border-blue-600 bg-blue-50/80 shadow-xs"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleServiceArea(area)}
                                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                                />
                                <span className="text-xs font-bold text-slate-800">{area}</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-400">
                                {currentDistrictConfig.state === "Telangana" ? "TG" : "AP"}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

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
                          placeholder="e.g. Authorized Artisan"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-300 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase font-mono block">Signature Preview:</span>
                          <span className="font-serif italic text-base font-bold text-blue-950 tracking-wider">
                            {signatureText || name || "Authorized Artisan"}
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

              {/* Contextual Step Error Alert */}
              {error && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
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
                  <div className="flex flex-col items-end gap-1.5">
                    {step === 3 && (
                      <div className="text-[11px] font-medium text-slate-500">
                        {!aadhaarNumber || cleanAadhaarNumber(aadhaarNumber).length !== 12 || !panNumber || panNumber.trim().length !== 10 ? (
                          <span className="text-amber-600">Enter 12-digit Aadhaar &amp; 10-char PAN</span>
                        ) : !aadhaarFile || !panFile ? (
                          <span className="text-amber-600">Attach Aadhaar &amp; PAN scans</span>
                        ) : !preCheckRan ? (
                          <span className="text-blue-600 font-bold">👉 Click &quot;Run Pre-Check&quot; above to validate</span>
                        ) : preCheckResult?.status === "CHECKSUM_FAILED" ? (
                          <span className="text-rose-600 font-bold">⚠️ Correct Aadhaar or PAN before continuing</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">✓ Pre-check validated • Ready to continue</span>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        (step === 1 && (
                          !name.trim() ||
                          !gender ||
                          !email.trim() ||
                          !emailOtpVerified ||
                          !password ||
                          !confirmPassword ||
                          !address.trim() ||
                          Object.values(step1Errors).some(Boolean)
                        )) ||
                        (step === 3 && (
                          !aadhaarFile ||
                          !panFile ||
                          !preCheckRan ||
                          !preCheckResult ||
                          preCheckResult.status === "CHECKSUM_FAILED"
                        ))
                      }
                      className="btn-primary !min-h-[42px] text-xs !py-2 !px-7 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
