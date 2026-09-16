import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ShieldCheck, Sparkles, Languages } from "lucide-react";
import { ContinuousPortalVideo } from "../ContinuousPortalVideo";
import { Language } from "../../i18n";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange
}) => {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop blur with click-outside dismissal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Cinematic Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#0A1128] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    How COOPNEX Works
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                    <Languages className="w-3 h-3" />
                    10 Indian Languages
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Interactive voice explainer of India's first democratic cooperative digital labor platform.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer shrink-0"
              title="Close (Esc)"
              aria-label="Close video tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Video Player Body (Scrollable if needed) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/50 dark:bg-slate-950/40">
            <ContinuousPortalVideo
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              onClose={onClose}
            />
          </div>

          {/* Footer Escrow Seal */}
          <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1128] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Govt. Certified:</strong> 100% Statutory Floor Wages • 24H Defect Warranty Hold • 0% Aggregator Commission
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
            >
              Close Explainer (Esc)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

