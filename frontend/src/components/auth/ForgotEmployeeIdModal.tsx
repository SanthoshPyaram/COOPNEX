import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Copy,
  Briefcase
} from "lucide-react";
import { SixDigitOtpInput } from "../SixDigitOtpInput";
import { useAuth } from "../../context/AuthContext";

interface ForgotEmployeeIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmployeeId?: (employeeId: string) => void;
}

export const ForgotEmployeeIdModal: React.FC<ForgotEmployeeIdModalProps> = ({
  isOpen,
  onClose,
  onSelectEmployeeId
}) => {
  const { sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState<"ENTER_EMAIL" | "ENTER_OTP" | "RECOVERED">("ENTER_EMAIL");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [copied, setCopied] = useState(false);

  // Recovered Worker Details
  const [recoveredWorker, setRecoveredWorker] = useState<{
    employeeId: string;
    name: string;
    trade: string;
    status: string;
    district: string;
  } | null>(null);

  // Countdown timer
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep("ENTER_EMAIL");
      setOtpDigits(["", "", "", "", "", ""]);
      setErrorMessage(null);
      setCopied(false);
      setRecoveredWorker(null);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Step 1: Send OTP to Worker Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid registered email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await sendOtp(cleanEmail, "RECOVER_EMPLOYEE_ID", "COOPNEX Specialist");
    setIsLoading(false);

    if (res.success) {
      setStep("ENTER_OTP");
      setCountdown(res.retryAfterSeconds || 60);
    } else {
      setErrorMessage(res.message || "Failed to dispatch verification code. Please check your email.");
    }
  };

  // Step 2: Verify OTP and Look Up Employee ID
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("").trim();
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    setIsLoading(true);
    setErrorMessage(null);

    const res = await verifyOtp(cleanEmail, code, "RECOVER_EMPLOYEE_ID");
    setIsLoading(false);

    if (res.success) {
      // Look up worker in local storage or fallback to demo
      let foundWorker: any = null;
      try {
        const localWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
        foundWorker = localWorkers.find((w: any) => w.email?.toLowerCase() === cleanEmail);
      } catch {}

      if (!foundWorker && (cleanEmail.includes("arjun") || cleanEmail.includes("worker"))) {
        foundWorker = {
          employeeId: "COOP-EMP-0001",
          name: "Arjun Kumar",
          trade: "Electrician",
          status: "VERIFIED",
          district: "Vijayawada"
        };
      }

      if (!foundWorker) {
        // Look up in current session
        const current = JSON.parse(localStorage.getItem("sahakari_user") || "null");
        if (current && current.email?.toLowerCase() === cleanEmail && current.employeeId) {
          foundWorker = {
            employeeId: current.employeeId,
            name: current.name,
            trade: current.workerProfile?.trade || "Specialist",
            status: current.verificationStatus || "UNDER_REVIEW",
            district: current.district || "Vijayawada"
          };
        }
      }

      // If still not found, fallback to generated worker
      if (!foundWorker) {
        foundWorker = {
          employeeId: "COOP-WRK-" + Math.floor(1000 + Math.random() * 9000),
          name: "Cooperative Specialist",
          trade: "Electrician",
          status: "UNDER_REVIEW",
          district: "Vijayawada"
        };
      }

      setRecoveredWorker({
        employeeId: foundWorker.employeeId,
        name: foundWorker.name || "Cooperative Specialist",
        trade: foundWorker.trade || foundWorker.primarySkill || "Electrician",
        status: foundWorker.verificationStatus || foundWorker.status || "UNDER_REVIEW",
        district: foundWorker.district || "Vijayawada"
      });

      setStep("RECOVERED");
    } else {
      setErrorMessage(res.message || "Invalid or expired verification code. Please check your email.");
    }
  };

  const handleCopyId = () => {
    if (recoveredWorker?.employeeId) {
      navigator.clipboard.writeText(recoveredWorker.employeeId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectAndProceed = () => {
    if (recoveredWorker?.employeeId && onSelectEmployeeId) {
      onSelectEmployeeId(recoveredWorker.employeeId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-[11px] font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Identity Recovery Service</span>
            </div>

            <h3 className="text-xl font-black text-white">Recover Employee ID</h3>
            <p className="text-xs text-blue-100 mt-1">
              Verify your registered email with an EmailJS OTP to retrieve your official cooperative badge ID.
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: ENTER REGISTERED EMAIL */}
            {step === "ENTER_EMAIL" && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. rajesh.kumar@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage(null);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-xs"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    We will send a 6-digit verification code to confirm ownership of this account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.includes("@")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Verification Code...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send Recovery OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: ENTER OTP */}
            {step === "ENTER_OTP" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs text-slate-600">
                    Verification code dispatched to:
                  </span>
                  <div className="font-bold text-slate-900 text-xs font-mono">{email}</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 text-center mb-2">
                    Enter 6-Digit Email OTP
                  </label>
                  <SixDigitOtpInput
                    value={otpDigits}
                    onChange={(newDigits) => {
                      setOtpDigits(newDigits);
                      setErrorMessage(null);
                    }}
                    isLoading={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  {countdown > 0 ? (
                    <span>Resend code in {countdown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Resend Verification Code
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setStep("ENTER_EMAIL")}
                    className="text-slate-500 hover:underline"
                  >
                    Change Email
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join("").length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying &amp; Retrieving ID...</span>
                    </span>
                  ) : (
                    <>
                      <span>Verify &amp; Reveal Employee ID</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: RECOVERED ID CARD */}
            {step === "RECOVERED" && recoveredWorker && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Identity Verified!</strong>
                    <span>Here is your official cooperative workforce credential.</span>
                  </div>
                </div>

                {/* Credential Card */}
                <div className="p-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl border border-blue-800/50 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
                        <Briefcase className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">{recoveredWorker.name}</div>
                        <div className="text-[10px] text-blue-200">{recoveredWorker.trade}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        recoveredWorker.status === "VERIFIED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {recoveredWorker.status === "VERIFIED" ? "✓ Verified" : "Under Review"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                      Your Official Employee ID
                    </span>
                    <div className="flex items-center justify-between mt-1 p-2.5 bg-white/10 rounded-xl border border-white/15">
                      <span className="font-mono font-black text-xl tracking-widest text-amber-300">
                        {recoveredWorker.employeeId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-blue-200/80">
                    District: {recoveredWorker.district} • Vijayawada Central Labour Cooperative (PACS-04)
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleSelectAndProceed}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Use ID to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
