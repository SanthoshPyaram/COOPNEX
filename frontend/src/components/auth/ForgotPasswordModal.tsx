import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles
} from "lucide-react";
import { SixDigitOtpInput } from "../SixDigitOtpInput";
import { useAuth } from "../../context/AuthContext";
import { FormField } from "../common/FormField";
import { PasswordRequirements } from "../common/PasswordRequirements";
import { validateEmailFormat, validatePassword, validateConfirmPassword } from "../../utils/validation";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIdentifier?: string;
  portalRole?: "CUSTOMER" | "WORKER";
  onSuccess?: (newPass: string, identifier: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultIdentifier = "",
  portalRole = "CUSTOMER",
  onSuccess
}) => {
  const { forgotPasswordSendOtp, forgotPasswordReset } = useAuth();

  const [step, setStep] = useState<"ENTER_IDENTIFIER" | "ENTER_OTP" | "RESET_PASSWORD" | "SUCCESS">("ENTER_IDENTIFIER");
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Sync default identifier
  useEffect(() => {
    if (defaultIdentifier) setIdentifier(defaultIdentifier);
  }, [defaultIdentifier]);

  // Handle countdown timer
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Reset modal state on close/open
  useEffect(() => {
    if (isOpen) {
      setStep("ENTER_IDENTIFIER");
      setOtpDigits(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage(null);
    }
  }, [isOpen]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Password strength calculation
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;

    let label = "Weak";
    let color = "bg-rose-500 text-rose-600";
    if (score === 2) {
      label = "Fair";
      color = "bg-amber-500 text-amber-600";
    } else if (score === 3) {
      label = "Good";
      color = "bg-blue-500 text-blue-600";
    } else if (score === 4) {
      label = "Strong";
      color = "bg-emerald-500 text-emerald-600";
    }
    return { score, label, color };
  };

  const strength = calculateStrength(newPassword);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = identifier.trim();
    if (!clean) {
      setEmailError("❌ Registered email address is required. 📧");
      return;
    }

    const emailCheck = validateEmailFormat(clean);
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error || "❌ Please enter a valid email address. 📧");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setEmailError(null);

    const res = await forgotPasswordSendOtp(clean);
    setIsLoading(false);

    if (res.success) {
      setStep("ENTER_OTP");
      setCountdown(60);
    } else {
      setEmailError(res.message || "❌ This email is not registered. Please use a registered email address. 📧");
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    setEmailError(null);

    const res = await forgotPasswordSendOtp(identifier.trim());
    setIsLoading(false);

    if (res.success) {
      setCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
    } else {
      setErrorMessage(res.message || "Failed to resend code. Please try again shortly.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (fullCode: string) => {
    if (fullCode.length === 6) {
      setErrorMessage(null);
      setStep("RESET_PASSWORD");
    }
  };

  // Step 3: Reset Password Submit
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const pCheck = validatePassword(newPassword);
    if (!pCheck.isValid) {
      setPasswordError(pCheck.error || null);
      return;
    }
    const cCheck = validateConfirmPassword(newPassword, confirmPassword);
    if (!cCheck.isValid) {
      setConfirmError(cCheck.error || null);
      return;
    }

    const code = otpDigits.join("");
    if (code.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await forgotPasswordReset(identifier.trim(), code, newPassword);
    setIsLoading(false);

    if (res.success) {
      setStep("SUCCESS");
      if (onSuccess) {
        onSuccess(newPassword, identifier.trim());
      }
    } else {
      setErrorMessage(res.message || "Failed to update password. Code may have expired.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#4F46E5] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close recovery dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold text-amber-300 border border-white/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Password Recovery Verification</span>
          </div>

          <h3 id="forgot-password-title" className="text-xl sm:text-2xl font-black tracking-tight">
            {step === "ENTER_IDENTIFIER" && "Reset Your Password"}
            {step === "ENTER_OTP" && "Enter Security Code"}
            {step === "RESET_PASSWORD" && "Create New Password"}
            {step === "SUCCESS" && "Password Updated"}
          </h3>

          <p className="text-xs text-blue-100/90 mt-1">
            {step === "ENTER_IDENTIFIER" && "Enter your registered email to receive a secure recovery code."}
            {step === "ENTER_OTP" && `We sent a 6-digit verification code to ${identifier}.`}
            {step === "RESET_PASSWORD" && "Choose a strong password to secure your COOPNEX account."}
            {step === "SUCCESS" && "Your credentials have been securely updated."}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-xs"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="flex-1">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1: ENTER REGISTERED EMAIL */}
          {step === "ENTER_IDENTIFIER" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <FormField
                id="recovery-email"
                label="Registered Email Address"
                required
                error={emailError}
              >
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="recovery-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={identifier}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIdentifier(val);
                      setErrorMessage(null);
                      if (!val.trim()) {
                        setEmailError("❌ Registered email address is required. 📧");
                      } else {
                        const check = validateEmailFormat(val);
                        setEmailError(check.error || null);
                      }
                    }}
                    onBlur={() => {
                      if (!identifier.trim()) {
                        setEmailError("❌ Registered email address is required. 📧");
                      } else {
                        const check = validateEmailFormat(identifier);
                        setEmailError(check.error || null);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white transition shadow-xs font-medium"
                  />
                </div>
              </FormField>
              <p className="text-[11px] text-slate-500">
                If an account matches your details, an encrypted OTP code will be sent.
              </p>

              <button
                type="submit"
                disabled={isLoading || !identifier.trim() || !!emailError}
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-black py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Checking Account & Sending...</span>
                  </span>
                ) : (
                  <>
                    <span>SEND VERIFICATION CODE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: ENTER 6-DIGIT OTP */}
          {step === "ENTER_OTP" && (
            <div className="space-y-5">
              <SixDigitOtpInput
                value={otpDigits}
                onChange={setOtpDigits}
                onComplete={handleVerifyOtp}
                isLoading={isLoading}
                errorMessage={errorMessage}
                countdown={countdown}
                onResend={handleResendOtp}
                isResending={isLoading}
                label="Enter 6-Digit Password Reset Code"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("ENTER_IDENTIFIER");
                    setErrorMessage(null);
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyOtp(otpDigits.join(""))}
                  disabled={otpDigits.join("").length !== 6 || isLoading}
                  className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white font-black py-3 rounded-xl shadow-md text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Verify Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CREATE NEW PASSWORD */}
          {step === "RESET_PASSWORD" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* Field: New Password */}
              <FormField
                id="recovery-new-password"
                label="New Password"
                required
                error={passwordError}
              >
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="recovery-new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewPassword(val);
                      setErrorMessage(null);
                      const pCheck = validatePassword(val);
                      setPasswordError(pCheck.error || null);
                      if (confirmPassword) {
                        const cCheck = validateConfirmPassword(val, confirmPassword);
                        setConfirmError(cCheck.error || null);
                      }
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white transition shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>

              {/* Dynamic 5-point Checklist */}
              {newPassword && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <PasswordRequirements password={newPassword} />
                </div>
              )}

              {/* Field: Confirm Password */}
              <FormField
                id="recovery-confirm-password"
                label="Confirm New Password"
                required
                error={confirmError}
              >
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="recovery-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConfirmPassword(val);
                      setErrorMessage(null);
                      const cCheck = validateConfirmPassword(newPassword, val);
                      setConfirmError(cCheck.error || null);
                    }}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white transition shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !newPassword ||
                  !confirmPassword ||
                  !validatePassword(newPassword).isValid ||
                  !validateConfirmPassword(newPassword, confirmPassword).isValid ||
                  !!passwordError ||
                  !!confirmError
                }
                className="w-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-black py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </span>
                ) : (
                  <>
                    <span>SAVE & CONTINUE TO SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === "SUCCESS" && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-slate-900">Password Updated Successfully!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your COOPNEX security credentials have been securely updated. You can now sign in.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-md text-xs sm:text-sm transition cursor-pointer"
              >
                CONTINUE TO SIGN IN
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

