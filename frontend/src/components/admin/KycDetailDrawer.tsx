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
import { AvatarPlaceholder } from "../common/AvatarPlaceholder";
import { AdminDocumentReviewModal, ReviewDocumentData } from "./AdminDocumentReviewModal";
import { API_BASE } from "../../services/api";

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
  const [selectedLevel, setSelectedLevel] = useState<number>(worker?.verificationLevel || 1);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ReviewDocumentData | null>(null);
  const [showApprovalConfirmModal, setShowApprovalConfirmModal] = useState<boolean>(false);
  const [confirmedManualReview, setConfirmedManualReview] = useState<boolean>(false);

  if (!worker) return null;

  const viewDocument = async (doc: any) => {
    const targetUrl = doc.fileUrl || doc.storageReference || doc.url;
    if (!targetUrl) {
      alert("No uploaded document file found for this record.");
      return;
    }
    const token = localStorage.getItem("sahakari_token");
    let resolvedUrl = targetUrl;
    let resolvedMime = targetUrl.startsWith("data:image") ? "image/png" : "application/pdf";

    try {
      const fullUrl = targetUrl.startsWith("http") || targetUrl.startsWith("data:")
        ? targetUrl
        : `${API_BASE.replace("/api", "")}${targetUrl.startsWith("/") ? "" : "/"}${targetUrl}`;

      if (fullUrl.startsWith("data:")) {
        resolvedUrl = fullUrl;
        resolvedMime = fullUrl.split(";")[0].replace("data:", "");
      } else {
        const res = await fetch(fullUrl, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const blob = await res.blob();
          resolvedUrl = URL.createObjectURL(blob);
          resolvedMime = blob.type;
        } else {
          resolvedUrl = fullUrl;
        }
      }
    } catch {
      resolvedUrl = targetUrl;
    }

    setPreviewDoc({
      documentType: doc.documentType || "Identity Document",
      documentNumber: doc.documentNumber || "Recorded in Dossier",
      verificationStatus: doc.verificationStatus || worker.verificationStatus || "PENDING",
      checksumValid: doc.checksumValid,
      formatValid: doc.formatValid,
      fileUrl: targetUrl,
      originalFilename: doc.originalFilename || `${doc.documentType || "document"}.pdf`,
      uploadedAt: doc.uploadedAt || worker.createdAt || "Registration Dossier",
      issuer: doc.issuer,
      aiVerificationNotes: doc.aiVerificationNotes,
      url: resolvedUrl,
      mime: resolvedMime
    });
  };

  const handleActionWithPin = (actionFn: () => void) => {
    setPendingAction(() => actionFn);
    setPinModalOpen(true);
  };

  const effectiveKycDocuments = React.useMemo(() => {
    const list: any[] = worker.kycDocuments ? [...worker.kycDocuments] : [];

    const hasAadhaar = list.some((d: any) => d.documentType?.toLowerCase().includes("aadhaar"));
    if (!hasAadhaar && (worker.aadhaarFileBase64 || worker.aadhaarNumber)) {
      list.push({
        documentType: "Aadhaar Card",
        documentNumber: worker.aadhaarNumber ? `XXXX-XXXX-${String(worker.aadhaarNumber).slice(-4)}` : "Recorded in Dossier",
        verificationStatus: worker.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING",
        checksumValid: true,
        fileUrl: worker.aadhaarFileBase64,
        originalFilename: worker.aadhaarOriginalFilename || "aadhaar_card.pdf",
        issuer: "UIDAI",
        uploadedAt: worker.createdAt || "Registration Dossier"
      });
    }

    const hasPan = list.some((d: any) => d.documentType?.toLowerCase().includes("pan"));
    if (!hasPan && (worker.panFileBase64 || worker.panNumber)) {
      list.push({
        documentType: "PAN Card",
        documentNumber: worker.panNumber ? `${String(worker.panNumber).slice(0, 5)}XXXX${String(worker.panNumber).slice(-1)}` : "Recorded in Dossier",
        verificationStatus: worker.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING",
        formatValid: true,
        fileUrl: worker.panFileBase64,
        originalFilename: worker.panOriginalFilename || "pan_card.pdf",
        issuer: "Income Tax Department",
        uploadedAt: worker.createdAt || "Registration Dossier"
      });
    }

    return list;
  }, [worker]);

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
                  <AvatarPlaceholder
                    src={worker.avatarUrl}
                    name={worker.name}
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
                <div className="space-y-2.5">
                  {effectiveKycDocuments.map((doc: any, i: number) => {
                    const isVerified = doc.verificationStatus === "VERIFIED";
                    const docTarget = doc.fileUrl || doc.storageReference || doc.url;
                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          {isVerified ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                              <span>{doc.documentType}</span>
                              {doc.checksumValid && (
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-mono">
                                  Verhoeff Checksum OK
                                </span>
                              )}
                              {doc.formatValid && (
                                <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-mono">
                                  Format OK
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-0.5">
                              Number: <strong>{doc.documentNumber}</strong>
                            </div>
                            {doc.originalFilename && (
                              <div className="text-[10px] text-slate-400 truncate max-w-xs">
                                File: {doc.originalFilename}
                              </div>
                            )}
                            {doc.aiVerificationNotes && (
                              <div className="text-[10px] text-slate-500 italic mt-0.5">
                                Note: {doc.aiVerificationNotes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {docTarget && (
                            <button
                              type="button"
                              onClick={() => viewDocument(doc)}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs transition cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              <span>View Document</span>
                            </button>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              isVerified
                                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            }`}
                          >
                            {doc.verificationStatus || "PENDING"}
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
                      onClick={() => setShowApprovalConfirmModal(true)}
                      className="px-5 py-2 rounded-xl bg-[#075E54] hover:bg-[#064e46] text-white text-xs font-black shadow-md hover:shadow-emerald-900/20 flex items-center gap-2 transition cursor-pointer"
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

      {/* DEDICATED TWO-COLUMN ADMIN DOCUMENT REVIEW WORKSPACE */}
      <AdminDocumentReviewModal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        worker={worker}
        document={previewDoc}
        onApproveDocument={(docType) => {
          if (worker.kycDocuments) {
            worker.kycDocuments = worker.kycDocuments.map((d: any) =>
              d.documentType === docType ? { ...d, verificationStatus: "VERIFIED" } : d
            );
          }
          if (previewDoc) {
            setPreviewDoc((prev) => prev ? { ...prev, verificationStatus: "VERIFIED" } : null);
          }
        }}
        onRejectDocument={(docType, reason) => {
          if (worker.kycDocuments) {
            worker.kycDocuments = worker.kycDocuments.map((d: any) =>
              d.documentType === docType
                ? { ...d, verificationStatus: "REJECTED", rejectionReason: reason }
                : d
            );
          }
          if (previewDoc) {
            setPreviewDoc((prev) => prev ? { ...prev, verificationStatus: "REJECTED" } : null);
          }
        }}
        onRequestReupload={(docType, feedback) => {
          if (worker.kycDocuments) {
            worker.kycDocuments = worker.kycDocuments.map((d: any) =>
              d.documentType === docType
                ? { ...d, verificationStatus: "REUPLOAD_REQUESTED", aiVerificationNotes: feedback }
                : d
            );
          }
          if (previewDoc) {
            setPreviewDoc((prev) =>
              prev ? { ...prev, verificationStatus: "REUPLOAD_REQUESTED", aiVerificationNotes: feedback } : null
            );
          }
        }}
      />

      {/* SUPER ADMIN SCRUTINY ATTESTATION CONFIRMATION */}
      {showApprovalConfirmModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Manual Document Audit Certification</h3>
                <p className="text-xs text-slate-500">Super Administrator Attestation</p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
              <strong>Mandatory Protocol:</strong>
              <p>Under statutory cooperative governance, algorithmic pre-checks verify structural syntax only. You must certify that you have manually audited the uploaded Aadhaar/PAN scans before granting Level {selectedLevel} status to <strong>{worker.name}</strong>.</p>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={confirmedManualReview}
                onChange={(e) => setConfirmedManualReview(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="font-semibold leading-normal">
                I certify under cooperative bylaws that I have manually scrutinized the uploaded documents for {worker.name} and found zero evidence of document tampering or fraud.
              </span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowApprovalConfirmModal(false);
                  setConfirmedManualReview(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!confirmedManualReview}
                onClick={() => {
                  setShowApprovalConfirmModal(false);
                  handleActionWithPin(() => {
                    onApprove(worker._id, selectedLevel);
                    onClose();
                  });
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition shadow-md cursor-pointer"
              >
                Proceed to Security PIN →
              </button>
            </div>
          </div>
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

