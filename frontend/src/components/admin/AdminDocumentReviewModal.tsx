import React, { useEffect, useState, useRef } from "react";
import {
  X,
  FileText,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  User,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Lock,
  Eye,
  Check,
  Ban
} from "lucide-react";
import { AvatarPlaceholder } from "../common/AvatarPlaceholder";

export interface ReviewDocumentData {
  documentType: string;
  documentNumber: string;
  verificationStatus?: string;
  checksumValid?: boolean;
  formatValid?: boolean;
  fileUrl?: string;
  storageReference?: string;
  originalFilename?: string;
  uploadedAt?: string;
  issuer?: string;
  aiVerificationNotes?: string;
  url?: string;
  mime?: string;
}

export interface AdminDocumentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: {
    _id?: string;
    id?: string;
    employeeId?: string;
    name: string;
    phone?: string;
    trade?: string;
    societyName?: string;
    district?: string;
    verificationStatus?: string;
    verificationLevel?: number;
    avatarUrl?: string;
    policeVerification?: {
      certificateNumber?: string;
      cctnsRecordCheck?: string;
      crimeRecordStatus?: string;
    };
  } | null;
  document: ReviewDocumentData | null;
  onApproveDocument?: (documentType: string) => void;
  onRejectDocument?: (documentType: string, reason: string) => void;
  onRequestReupload?: (documentType: string, feedback: string) => void;
}

export const AdminDocumentReviewModal: React.FC<AdminDocumentReviewModalProps> = ({
  isOpen,
  onClose,
  worker,
  document: doc,
  onApproveDocument,
  onRejectDocument,
  onRequestReupload
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rejectPromptOpen, setRejectPromptOpen] = useState(false);
  const [reuploadPromptOpen, setReuploadPromptOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // 1. ESCAPE KEY LISTENER & BODY SCROLL LOCK
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (rejectPromptOpen) {
          setRejectPromptOpen(false);
        } else if (reuploadPromptOpen) {
          setReuploadPromptOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, rejectPromptOpen, reuploadPromptOpen, onClose]);

  // Reset zoom and prompts on doc change
  useEffect(() => {
    setZoomLevel(1);
    setRejectPromptOpen(false);
    setReuploadPromptOpen(false);
    setActionReason("");
    setActionSuccessMessage(null);
  }, [doc]);

  if (!isOpen || !doc || !worker) return null;

  const docUrl = doc.url || doc.fileUrl || doc.storageReference || "";
  const isImage =
    doc.mime?.includes("image") ||
    docUrl.startsWith("data:image") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.originalFilename || docUrl);

  const isPdf =
    doc.mime?.includes("pdf") ||
    docUrl.startsWith("data:application/pdf") ||
    /\.pdf$/i.test(doc.originalFilename || docUrl) ||
    (!isImage && docUrl.length > 0);

  const docStatus = doc.verificationStatus || worker.verificationStatus || "PENDING";
  const isApproved = docStatus === "VERIFIED";
  const isRejected = docStatus === "REJECTED" || docStatus === "SUSPECTED_FAKE";

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  const handleApprove = () => {
    if (onApproveDocument) {
      onApproveDocument(doc.documentType);
    }
    setActionSuccessMessage("Document officially marked verified in the audit record.");
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 2500);
  };

  const handleConfirmReject = () => {
    const reason = actionReason.trim() || "Document scan is unclear or does not match identity details.";
    if (onRejectDocument) {
      onRejectDocument(doc.documentType, reason);
    }
    setRejectPromptOpen(false);
    setActionReason("");
    setActionSuccessMessage("Document rejected with statutory explanation.");
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 2500);
  };

  const handleConfirmReupload = () => {
    const feedback = actionReason.trim() || "Uploaded scan has glare or low resolution. Please upload a high-clarity original scan.";
    if (onRequestReupload) {
      onRequestReupload(doc.documentType, feedback);
    }
    setReuploadPromptOpen(false);
    setActionReason("");
    setActionSuccessMessage("Re-upload request dispatched to artisan mobile terminal.");
    setTimeout(() => {
      setActionSuccessMessage(null);
    }, 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-review-title"
      className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* MODAL WRAPPER - CONSTRAINED MAX WIDTH & HEIGHT */}
      <div
        ref={modalContainerRef}
        className="relative bg-white dark:bg-[#101828] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-[95vw] sm:max-w-6xl max-h-[92vh] flex flex-col overflow-hidden transition-all"
        style={{ width: "100%" }}
      >
        {/* =========================================================================
            1. TOP GLOBAL WORKSPACE BAR
        ========================================================================== */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#075E54] text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="doc-review-title"
                  className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate"
                >
                  Document Scrutiny: {doc.documentType}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Worker ID: {worker._id || worker.id || worker.employeeId}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate hidden xs:block">
                Super Admin Statutory Verification Review Workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-1 rounded">
              <kbd className="font-bold">ESC</kbd> to close
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close document preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* FEEDBACK BANNER (IF ACTION TRIGGERED) */}
        {actionSuccessMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/70 border-b border-emerald-200 dark:border-emerald-800 px-4 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-fadeIn shrink-0">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {actionSuccessMessage}
            </span>
            <button
              onClick={() => setActionSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* =========================================================================
            2. TWO-COLUMN REVIEW WORKSPACE
            Left: Worker Details + Doc Header
            Right: Document Preview + Actions
        ========================================================================== */}
        <div
          className="flex-1 overflow-hidden min-h-0"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))"
          }}
        >
          {/* -------------------------------------------------------------------
              LEFT COLUMN: Worker Details & Document Metadata
          -------------------------------------------------------------------- */}
          <div className="border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs max-h-[35vh] lg:max-h-full">
            {/* Artisan Profile Snapshot */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <AvatarPlaceholder
                  src={worker.avatarUrl}
                  name={worker.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                />
                <div className="min-w-0">
                  <div className="font-black text-sm text-slate-900 dark:text-white truncate">
                    {worker.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium truncate">
                    {worker.trade || "Certified Artisan"}
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 truncate">
                    {worker._id || worker.id || worker.employeeId}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Cooperative</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {worker.societyName || "District Labour Federation"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">District</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{worker.district || "Andhra Pradesh"}</span>
                  </div>
                </div>
                {worker.phone && (
                  <div className="col-span-2">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Phone</div>
                    <div className="font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{worker.phone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Document Scrutiny Details Header */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Statutory Metadata
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    isApproved
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : isRejected
                      ? "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      : "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                  }`}
                >
                  {docStatus}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Document Type</div>
                  <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                    <span>{doc.documentType}</span>
                    {doc.issuer && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({doc.issuer})
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Document Number</div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 px-2 py-1 rounded border border-slate-200 dark:border-slate-700/60 mt-0.5 break-all">
                    {doc.documentNumber || "Recorded in Dossier"}
                  </div>
                </div>

                {/* Mathematical Checksum / ITD Status */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Algorithmic Integrity
                  </div>
                  {doc.checksumValid !== undefined && (
                    <div
                      className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 ${
                        doc.checksumValid
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {doc.checksumValid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>
                        {doc.checksumValid
                          ? "UIDAI Verhoeff Dihedral Checksum: VALID"
                          : "UIDAI Verhoeff Checksum: FAILED"}
                      </span>
                    </div>
                  )}

                  {doc.formatValid !== undefined && (
                    <div
                      className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 ${
                        doc.formatValid
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {doc.formatValid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>
                        {doc.formatValid
                          ? "ITD PAN Format Syntax: VALID"
                          : "ITD PAN Format Syntax: INVALID"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Uploaded File Name */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Uploaded File</div>
                  <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate mt-0.5">
                    {doc.originalFilename || "identity_document_scan.pdf"}
                  </div>
                </div>

                {/* Upload Timestamp */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Submission Date</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{doc.uploadedAt || "Statutory Registration Stream"}</span>
                  </div>
                </div>

                {/* Scrutiny Notes */}
                {doc.aiVerificationNotes && (
                  <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-900 dark:text-amber-200">
                    <strong>Pre-Check Scrutiny:</strong> {doc.aiVerificationNotes}
                  </div>
                )}
              </div>
            </div>

            {/* Statutory Attestation Note */}
            <div className="p-3 rounded-xl bg-[#075E54]/5 dark:bg-emerald-950/20 border border-[#075E54]/20 space-y-1 text-[11px] text-[#075E54] dark:text-emerald-400">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Super Admin Audit Mandate</span>
              </div>
              <p className="text-[10px] leading-relaxed opacity-90">
                Visual inspection must confirm that the photographic portrait, citizen name, and unique ID match platform records before clearance.
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              RIGHT COLUMN: Document Review Workspace & Actions
          -------------------------------------------------------------------- */}
          <div
            className="flex flex-col min-w-0 h-full overflow-hidden bg-white dark:bg-[#101828]"
            style={{ minWidth: 0 }}
          >
            {/* Document Review Header Toolbar */}
            <div className="p-2.5 sm:px-4 sm:py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 flex items-center justify-between gap-2 shrink-0 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-md">
                  {doc.originalFilename || doc.documentType}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  ({Math.round(zoomLevel * 100)}%)
                </span>
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomReset}
                  title="Reset Zoom"
                  className="px-2 py-1 rounded-lg text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {docUrl && (
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in new tab"
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer ml-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {docUrl && (
                  <a
                    href={docUrl}
                    download={doc.originalFilename || `${doc.documentType}.pdf`}
                    title="Download document"
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Document Preview Area */}
            <div
              className="flex-1 w-full max-w-full overflow-auto p-3 sm:p-6 flex items-center justify-center bg-slate-900/5 dark:bg-slate-950/80 min-h-[320px] relative"
              style={{ minWidth: 0 }}
            >
              {docUrl ? (
                isImage ? (
                  <div
                    className="transition-transform duration-150 flex items-center justify-center max-w-full max-h-full"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <img
                      src={docUrl}
                      alt={doc.documentType}
                      className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md border border-slate-200/80 dark:border-slate-800"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full h-full min-h-[360px] sm:min-h-[460px] flex items-center justify-center transition-transform duration-150"
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
                  >
                    <iframe
                      src={docUrl}
                      title={doc.documentType}
                      className="w-full h-full min-h-[360px] sm:min-h-[480px] rounded-xl border border-slate-300 dark:border-slate-700 bg-white shadow-sm"
                    />
                  </div>
                )
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="font-bold">No Preview File Attached</p>
                  <p className="text-xs">Document record exists without an embedded scan binary.</p>
                </div>
              )}
            </div>

            {/* REJECTION REASON PROMPT OVERLAY */}
            {rejectPromptOpen && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-800 space-y-2.5 animate-fadeIn shrink-0">
                <div className="flex items-center justify-between text-xs font-bold text-rose-900 dark:text-rose-200">
                  <span className="flex items-center gap-1.5">
                    <Ban className="w-4 h-4 text-rose-600" />
                    Reject Document &amp; Flag Defect
                  </span>
                  <button
                    onClick={() => setRejectPromptOpen(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="State reason: e.g. Name mismatch, blurry scan, expired document..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectPromptOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReject}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm cursor-pointer"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            )}

            {/* REQUEST RE-UPLOAD PROMPT OVERLAY */}
            {reuploadPromptOpen && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border-t border-amber-200 dark:border-amber-800 space-y-2.5 animate-fadeIn shrink-0">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    Request Artisan Re-upload
                  </span>
                  <button
                    onClick={() => setReuploadPromptOpen(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Feedback for artisan: e.g. Corner clipped, please re-scan front & back clearly..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReuploadPromptOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReupload}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm cursor-pointer"
                  >
                    Dispatch Request
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                3. DOCUMENT ACTION BAR (Approve, Reject, Request Re-upload)
                Equal height, responsive wrapping, stacked on mobile
            ========================================================================== */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                {/* 1. APPROVE DOCUMENT BUTTON */}
                <button
                  type="button"
                  onClick={handleApprove}
                  className="h-10 sm:h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Approve Document</span>
                </button>

                {/* 2. REJECT DOCUMENT BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setReuploadPromptOpen(false);
                    setRejectPromptOpen(true);
                  }}
                  className="h-10 sm:h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Reject Document</span>
                </button>

                {/* 3. REQUEST RE-UPLOAD BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setRejectPromptOpen(false);
                    setReuploadPromptOpen(true);
                  }}
                  className="h-10 sm:h-11 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>Request Re-upload</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

