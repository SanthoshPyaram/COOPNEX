import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
  BadgeCheck,
  Clock,
  Lock,
  Sparkles,
  ExternalLink,
  Award,
  AlertOctagon,
  Download
} from "lucide-react";
import { AdminSecurityPinModal } from "../AdminSecurityPinModal";

interface KycDetailDrawerProps {
  worker: any | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (workerId: string, level: number) => void;
  onReject: (workerId: string, reason: string) => void;
  onRequestInfo?: (workerId: string) => void;
}

export const KycDetailDrawer: React.FC<KycDetailDrawerProps> = ({
  worker,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  if (!worker) return null;

  const handleActionWithPin = (actionFn: () => void) => {
    setPendingAction(() => actionFn);
    setPinModalOpen(true);
  };

  const police = worker.policeVerification;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#101828] h-full shadow-2xl border-l border-[#E4E9F0] dark:border-slate-800 flex flex-col z-10"
          >
            {/* 1. TOP DRAWER HEADER */}
            <div className="p-5 border-b border-[#E4E9F0] dark:border-slate-800 flex items-center justify-between bg-[#F7F9FC] dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#075E54] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Artisan KYC Dossier
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                      {worker._id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Statutory Verification &amp; Police Background Scrutiny
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. SCROLLABLE DOSSIER CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-[#F7F9FC] dark:bg-slate-900/40 border border-[#E4E9F0] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={worker.avatarUrl || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"}
                    alt={worker.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#075E54] shadow-sm shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {worker.name}
                    </h4>
                    <div className="text-slate-500 text-xs font-medium">
                      {worker.age} yrs • {worker.gender} • {worker.experienceYears || 5} yrs exp
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {worker.skills?.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[10px] font-bold text-blue-800 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Status</div>
                  <div className="text-xs font-black text-amber-600 dark:text-amber-400 mt-0.5">
                    {worker.verificationStatus || "UNDER_REVIEW"}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-2">Current Tier</div>
                  <div className="text-xs font-black text-[#075E54] dark:text-emerald-400">
                    Level {worker.verificationLevel || 1}
                  </div>
                </div>
              </div>

              {/* Contact & Society Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Contact Information
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{worker.phone}</div>
                  <div className="text-slate-500 text-[11px] truncate">{worker.email || "N/A"}</div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Assigned Primary Society
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {worker.societyName || "Vijayawada Central Co-op"}
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {worker.district || "NTR District"}
                  </div>
                </div>
              </div>

              {/* Police Clearance Certificate (PCC) Dossier */}
              {police ? (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900/60 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/40 pb-2">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        Police Clearance Certificate (PCC)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold">
                      {police.certificateNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <div className="text-slate-400 font-mono text-[10px]">Precinct &amp; Commissionerate:</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {police.policeStation}
                      </div>
                      <div className="text-slate-500 text-[10px]">{police.commissionerate}</div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-mono text-[10px]">Station House Officer (SHO):</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {police.shoName}
                      </div>
                      <div className="text-emerald-600 font-bold text-[10px]">
                        Seal: {police.sealText}
                      </div>
                    </div>
                  </div>

                  {/* Crime Record Status Badge */}
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-emerald-900 dark:text-emerald-200">
                          {police.crimeRecordStatus}
                        </div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                          CCTNS Database Check: {police.cctnsRecordCheck}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-500">
                      Valid: {police.issuedDate} &rarr; {police.validUntil}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400">
                  No Police Clearance Certificate attached to this submission.
                </div>
              )}

              {/* KYC Documents Checklist */}
              <div className="space-y-2">
                <div className="font-black uppercase tracking-wider text-[10px] text-slate-400">
                  Statutory Identity &amp; Financial Checks
                </div>
                <div className="space-y-2">
                  {worker.kycDocuments?.map((doc: any, i: number) => {
                    const isSystemOk = doc.verificationStatus === "SYSTEM_VERIFIED" || doc.verificationStatus === "VERIFIED";
                    return (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          {isSystemOk ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {doc.documentType}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {doc.documentNumber} • {doc.issuer || "Govt"}
                            </div>
                            {doc.systemCheckDetails && (
                              <div className="text-[10px] text-emerald-600 font-mono mt-0.5">
                                {doc.systemCheckDetails}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              isSystemOk
                                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                                : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            {doc.verificationStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. STICKY ACTION FOOTER */}
            <div className="p-5 border-t border-[#E4E9F0] dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900/60 space-y-3">
              {isRejecting ? (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Specify Grounds for Rejection:
                  </div>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Police verification document blurry or mismatched address"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        handleActionWithPin(() => {
                          onReject(worker._id, rejectReason || "Rejected by registrar");
                          onClose();
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition"
                    >
                      Confirm Rejection (PIN Required)
                    </button>
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Tier Level Selection */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      Award Tier:
                    </span>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(Number(e.target.value))}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden"
                    >
                      <option value={1}>Level 1: Apprentice</option>
                      <option value={2}>Level 2: Journeyman</option>
                      <option value={3}>Level 3: Expert</option>
                      <option value={4}>Level 4: Master Craftsman</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRejecting(true)}
                      className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => {
                        handleActionWithPin(() => {
                          onApprove(worker._id, selectedLevel);
                          onClose();
                        });
                      }}
                      className="px-5 py-2 rounded-xl bg-[#075E54] hover:bg-[#064e46] text-white text-xs font-black shadow-md hover:shadow-emerald-900/20 flex items-center gap-2 transition"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Approve &amp; Issue Badge</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 6-DIGIT ADMIN PIN MODAL */}
      <AdminSecurityPinModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={() => {
          setPinModalOpen(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
        title="Admin Security Verification"
        subtitle="High-authority action requires 6-digit cryptographic PIN"
        actionDescription="Authorize artisan KYC status change and certified skill tier assignment"
        requiredPin="892104"
      />
    </AnimatePresence>
  );
};

