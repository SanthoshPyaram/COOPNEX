import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Bell, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface ServiceSoonAnimationProps {
  pincode: string;
  city: string;
  state: string;
  district?: string;
  className?: string;
}

export const CartoonServiceSoonAnimation: React.FC<ServiceSoonAnimationProps> = ({
  pincode,
  city,
  state,
  district,
  className = ""
}) => {
  const { t } = useLanguage();
  const [contactInput, setContactInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white dark:to-slate-900 border-2 border-amber-400/50 p-5 sm:p-7 shadow-xl shadow-amber-600/10 ${className}`}
    >
      {/* Background Animated Amber Radar Waves */}
      <motion.div
        animate={{ scale: [1, 1.8, 1], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-2 border-amber-500/30 pointer-events-none -z-10"
      />
      <motion.div
        animate={{ scale: [1, 2.3, 1], opacity: [0.25, 0, 0.25] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-2 border-orange-500/20 pointer-events-none -z-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Cartoon Surveyor Mascot with Blueprint & Flag */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center select-none">
            {/* Expansion Flag waving */}
            <motion.div
              animate={{ rotate: [-4, 6, -4], y: [-2, 2, -2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 right-3 z-20 bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 border border-amber-600"
            >
              <span>🚩</span>
              <span>EXPANDING</span>
            </motion.div>

            {/* Cartoon Surveyor SVG */}
            <motion.svg
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xl"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Soft ground shadow */}
              <ellipse cx="80" cy="148" rx="46" ry="7" fill="#D97706" fillOpacity="0.16" />

              {/* Uniform in Warm Tangerine */}
              <path
                d="M48 136 C48 108, 60 98, 80 98 C100 98, 112 108, 112 136 Z"
                fill="#FF6B00"
              />
              <path d="M72 98 L80 110 L88 98 Z" fill="#FFFFFF" />

              {/* High-visibility reflective vest stripes */}
              <path d="M58 114 L68 136" stroke="#FEF08A" strokeWidth="4" />
              <path d="M102 114 L92 136" stroke="#FEF08A" strokeWidth="4" />

              {/* Head / Face */}
              <circle cx="80" cy="66" r="24" fill="#F8B179" />

              {/* Rosy Cheeks */}
              <ellipse cx="68" cy="72" rx="4" ry="2.5" fill="#F472B6" fillOpacity="0.4" />
              <ellipse cx="92" cy="72" rx="4" ry="2.5" fill="#F472B6" fillOpacity="0.4" />

              {/* Eyes with blinking */}
              <motion.g
                animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.5, 0.55, 0.6, 1] }}
              >
                <circle cx="72" cy="65" r="3.2" fill="#0F172A" />
                <circle cx="71" cy="64" r="1" fill="#FFFFFF" />
                <circle cx="88" cy="65" r="3.2" fill="#0F172A" />
                <circle cx="87" cy="64" r="1" fill="#FFFFFF" />
              </motion.g>

              {/* Optimistic Focused Smile */}
              <path d="M74 76 C77 81, 83 81, 86 76" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

              {/* White Safety Helmet */}
              <path
                d="M52 56 C52 38, 64 32, 80 32 C96 32, 108 38, 108 56 Z"
                fill="#FFFFFF"
                stroke="#E2E8F0"
                strokeWidth="2"
              />
              <path d="M48 54 C48 51, 112 51, 112 54 L108 58 L52 58 Z" fill="#F1F5F9" />
              {/* Emblem on hardhat */}
              <rect x="76" y="44" width="8" height="8" rx="2" fill="#FF6B00" />

              {/* Blueprint Roll in Hand */}
              <motion.g
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "115px 110px" }}
              >
                <path d="M110 108 C118 106, 126 102, 128 94" stroke="#FF6B00" strokeWidth="9" strokeLinecap="round" />
                <circle cx="128" cy="92" r="7" fill="#F8B179" />
                {/* Rolled Blueprint */}
                <rect x="122" y="70" width="10" height="34" rx="3" fill="#38BDF8" transform="rotate(20 122 70)" />
                <rect x="125" y="72" width="4" height="30" rx="1" fill="#0284C7" transform="rotate(20 122 70)" />
              </motion.g>

              {/* Left Hand: Waving Greetings */}
              <motion.g
                animate={{ rotate: [12, -12, 12] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "42px 108px" }}
              >
                <path d="M50 108 C40 104, 34 96, 32 86" stroke="#FF6B00" strokeWidth="9" strokeLinecap="round" />
                <circle cx="32" cy="84" r="7" fill="#F8B179" />
                <path d="M28 82 L24 74" stroke="#F8B179" strokeWidth="4" strokeLinecap="round" />
                <path d="M32 80 L32 70" stroke="#F8B179" strokeWidth="4" strokeLinecap="round" />
                <path d="M36 82 L38 72" stroke="#F8B179" strokeWidth="4" strokeLinecap="round" />
              </motion.g>
            </motion.svg>
          </div>
          <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 px-3 py-0.5 rounded-full mt-1">
            🚀 Federation Expansion Live
          </span>
        </div>

        {/* Right: Notification & Survey Status Card */}
        <div className="md:col-span-8 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-xs">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>{t("pincode.serviceSoonTitle") || "Coming Soon to Your Neighbourhood!"}</span>
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              PIN: <strong className="font-mono text-slate-900 dark:text-white">{pincode}</strong>
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{city}, {state}</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Our cooperative federation is actively registering Primary Labour Societies and conducting multi-tier artisan verifications in <strong>{district || city}</strong> under the Ministry of Cooperation mandate.
            </p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-900/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
              <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Society Formation & Police Clearance Phase</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              <span>Society Charter: Completed</span>
              <span className="text-amber-700 dark:text-amber-300 font-bold">Artisan Onboarding: 68%</span>
            </div>
          </div>

          {/* Interactive Launch Notification Form */}
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("pincode.notifyPrompt") || "Enter your mobile or email to get notified when services go live:"}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Bell className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9876543210 or citizen@gmail.com"
                      value={contactInput}
                      onChange={(e) => setContactInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition shadow-2xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !contactInput.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>{t("pincode.notifyMe") || "Notify Me"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">
                    {t("pincode.notifySuccess") || "You're on the priority launch list!"}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    We will notify <strong>{contactInput}</strong> and credit ₹100 inaugural service credits to your account as soon as dispatch begins in {city}.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

