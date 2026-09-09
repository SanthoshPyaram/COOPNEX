import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, RotateCcw } from "lucide-react";

interface SixDigitOtpInputProps {
  value: string[];
  onChange: (digits: string[]) => void;
  onComplete?: (fullCode: string) => void;
  isLoading?: boolean;
  isVerified?: boolean;
  errorMessage?: string | null;
  countdown?: number;
  onResend?: () => void;
  isResending?: boolean;
  label?: string;
  ariaLabelPrefix?: string;
}

export const SixDigitOtpInput: React.FC<SixDigitOtpInputProps> = ({
  value,
  onChange,
  onComplete,
  isLoading = false,
  isVerified = false,
  errorMessage = null,
  countdown = 0,
  onResend,
  isResending = false,
  label = "Enter 6-Digit Verification Code",
  ariaLabelPrefix = "Digit"
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  // Trigger error shake animation when errorMessage appears
  useEffect(() => {
    if (errorMessage) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 400);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Handle single digit changes
  const handleDigitChange = (index: number, rawVal: string) => {
    const clean = rawVal.replace(/\D/g, "").slice(-1);
    const newDigits = [...value];
    newDigits[index] = clean;
    onChange(newDigits);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join("");
    if (fullCode.length === 6 && onComplete) {
      onComplete(fullCode);
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste of 6-digit code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    onChange(newDigits);

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === 6 && onComplete) {
      onComplete(pasted);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
      )}

      {/* 6 Digit Input Boxes */}
      <motion.div
        animate={isShaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-center gap-2 sm:gap-3"
      >
        {value.map((digit, idx) => (
          <div key={idx} className="relative">
            <input
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              disabled={isLoading || isVerified}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              aria-label={`${ariaLabelPrefix} ${idx + 1} of 6`}
              className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-lg sm:text-xl font-mono font-black rounded-2xl border transition-all duration-200 outline-none select-all ${
                isVerified
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20"
                  : errorMessage
                  ? "bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-500/20"
                  : digit
                  ? "bg-white border-[#2563EB] text-[#2563EB] ring-2 ring-blue-500/20 shadow-xs"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20"
              } disabled:opacity-60`}
            />
            {isVerified && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] shadow-xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>
        ))}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-semibold"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verified Success State */}
      {isVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold"
        >
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Code Verified Successfully!</span>
        </motion.div>
      )}

      {/* Countdown & Resend Option */}
      {!isVerified && onResend && (
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          {countdown > 0 ? (
            <span className="text-slate-500 font-medium">
              Resend available in <strong className="font-mono text-slate-800">{countdown}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={isResending}
              className="text-[#2563EB] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
              <span>{isResending ? "Sending New Code..." : "Resend Verification Code"}</span>
            </button>
          )}
          <span className="text-[11px] text-slate-400">Valid for 5 minutes</span>
        </div>
      )}
    </div>
  );
};

