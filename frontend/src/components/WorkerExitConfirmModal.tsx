import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut, ShieldAlert, X } from "lucide-react";

interface WorkerExitConfirmModalProps {
  isOpen: boolean;
  onStay: () => void;
  onConfirmExit: () => void;
  mode?: "EXIT_PORTAL" | "LOGOUT";
}

export const WorkerExitConfirmModal: React.FC<WorkerExitConfirmModalProps> = ({
  isOpen,
  onStay,
  onConfirmExit,
  mode = "EXIT_PORTAL"
}) => {
  if (!isOpen) return null;

  const isLogout = mode === "LOGOUT";

  const title = isLogout
    ? "Sign out of COOPNEX?"
    : "Are you sure you want to leave?";

  const message = isLogout
    ? "Your current session will be securely ended."
    : "Your current worker session will be signed out if you leave this portal.";

  const stayButtonText = isLogout ? "Cancel" : "Stay";
  const confirmButtonText = isLogout ? "Sign Out" : "Leave & Sign Out";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onStay}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
          className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 z-10"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              {isLogout ? <LogOut className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <button
              onClick={onStay}
              aria-label="Close dialog"
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <h3 id="exit-modal-title" className="text-lg font-black text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Active emergency dispatch and job availability signals will be paused upon sign out.</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onStay}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              {stayButtonText}
            </button>
            <button
              type="button"
              onClick={onConfirmExit}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{confirmButtonText}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

