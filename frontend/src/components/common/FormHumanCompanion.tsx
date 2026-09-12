import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HumanVisual } from "../HumanVisual";

export type FormCompanionEmotion =
  | "IDLE"
  | "TYPING"
  | "VALID_FORM"
  | "INVALID_NAME"
  | "INVALID_EMAIL"
  | "EMAIL_NOT_REGISTERED"
  | "OTP_SENT"
  | "WRONG_OTP"
  | "STRONG_PASSWORD"
  | "WEAK_PASSWORD"
  | "SUCCESS";

interface FormHumanCompanionProps {
  state: FormCompanionEmotion;
  customMessage?: string;
  className?: string;
  role?: string;
}

const EMOTION_MAP: Record<FormCompanionEmotion, { emoji: string; text: string; role: string }> = {
  IDLE: {
    emoji: "👋",
    text: "Welcome! Please enter your details below.",
    role: "welcoming"
  },
  TYPING: {
    emoji: "✍️",
    text: "Great progress, keep going!",
    role: "welcoming"
  },
  VALID_FORM: {
    emoji: "😊",
    text: "Looks good!",
    role: "welcoming"
  },
  INVALID_NAME: {
    emoji: "😕",
    text: "Hmm... that doesn't look like a valid name.",
    role: "customer-rep"
  },
  INVALID_EMAIL: {
    emoji: "🤔",
    text: "Please check that email address.",
    role: "customer-rep"
  },
  EMAIL_NOT_REGISTERED: {
    emoji: "❌",
    text: "This email is not registered in COOPNEX.",
    role: "customer-rep"
  },
  OTP_SENT: {
    emoji: "📩",
    text: "Your OTP is on its way!",
    role: "electrician"
  },
  WRONG_OTP: {
    emoji: "😟",
    text: "That code doesn't match. Please try again.",
    role: "customer-rep"
  },
  STRONG_PASSWORD: {
    emoji: "😎",
    text: "Nice! That's a strong password.",
    role: "technician"
  },
  WEAK_PASSWORD: {
    emoji: "🔐",
    text: "Let's make this password a bit stronger.",
    role: "technician"
  },
  SUCCESS: {
    emoji: "🎉",
    text: "You're all set!",
    role: "welcoming"
  }
};

export const FormHumanCompanion: React.FC<FormHumanCompanionProps> = ({
  state,
  customMessage,
  className = "",
  role
}) => {
  const current = EMOTION_MAP[state] || EMOTION_MAP.IDLE;
  const message = customMessage || current.text;
  const activeRole = role || current.role;

  return (
    <div className={`flex items-center gap-3 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs backdrop-blur-xs ${className}`}>
      <HumanVisual
        role={activeRole}
        size="xs"
        animation="subtle"
        background="none"
        className="shrink-0"
      />

      <div className="flex-1 min-w-0 text-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={state + message}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5"
          >
            <span className="text-sm shrink-0">{current.emoji}</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
              "{message}"
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
