import React from "react";
import { motion } from "framer-motion";
import { evaluatePassword } from "../../utils/validation";

interface PasswordRequirementsProps {
  password: string;
  showAlways?: boolean;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  showAlways = false
}) => {
  const breakdown = evaluatePassword(password);
  const hasTyped = Boolean(password && password.length > 0);

  if (!hasTyped && !showAlways) {
    return null;
  }

  const items = [
    { label: "At least 8 characters", met: breakdown.min8 },
    { label: "One uppercase letter (A-Z)", met: breakdown.upper },
    { label: "One lowercase letter (a-z)", met: breakdown.lower },
    { label: "One number (0-9)", met: breakdown.number },
    { label: "One special character (!@#$%...)", met: breakdown.special }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-left space-y-2 mt-1.5"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <span>🔐</span>
          <span>Password requirements</span>
        </span>
        {breakdown.isValid ? (
          <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            Strong & Secure
          </span>
        ) : (
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
            {items.filter((i) => i.met).length}/5 met
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
              item.met
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            <span className="shrink-0">{item.met ? "✅" : "❌"}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
