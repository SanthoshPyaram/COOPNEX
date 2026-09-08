import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  QrCode,
  RotateCw,
  Download,
  Printer,
  CheckCircle2,
  Droplet,
  Globe,
  Briefcase,
  Calendar,
  X,
  Sparkles,
  Phone,
  FileCheck,
  Building2,
  Lock
} from "lucide-react";

export interface WorkerIdCardData {
  employeeId: string;
  name: string;
  age: number | string;
  gender?: string;
  skills: string[];
  bloodGroup: string;
  languagesKnown: string[];
  district: string;
  societyName: string;
  photoUrl?: string;
  signatureText?: string;
  signatureDataUrl?: string;
  issueDate?: string;
  validUntil?: string;
  nsqfLevel?: string;
  emergencyContact?: string;
  policeVerificationStatus?: string;
  aadhaarVerhoeffStatus?: string;
}

interface WorkerSmartIdCardProps {
  data: WorkerIdCardData;
  className?: string;
  onDownload?: () => void;
}

export const WorkerSmartIdCard: React.FC<WorkerSmartIdCardProps> = ({
  data,
  className = "",
  onDownload
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const fallbackPhoto =
    data.gender === "Female"
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
      : "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80";

  const photo = data.photoUrl || fallbackPhoto;
  const issueDate = data.issueDate || "07/09/2026";
  const validUntil = data.validUntil || "06/09/2029";
  const nsqfLevel = data.nsqfLevel || "NSQF Level-4 Master";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 max-w-md mx-auto select-none ${className}`}>
      {/* Top Action Bar */}
      <div className="w-full flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>OFFICIAL COOPERATIVE SMART ID</span>
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold transition shadow-xs cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? "Show Front Side" : "Flip to Back (QR)"}</span>
        </button>
      </div>

      {/* 3D FLIPPABLE ID CARD CONTAINER */}
      <div className="w-full [perspective:1000px]">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 25 }}
          className="w-full relative [transform-style:preserve-3d] min-h-[440px]"
        >
          {/* ============================================================= */}
          {/* FRONT FACE OF SMART ID CARD                                   */}
          {/* ============================================================= */}
          <div
            className={`w-full rounded-3xl p-5 sm:p-6 text-slate-900 border-2 border-emerald-600/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#FCFBF7] via-[#F3F9F5] to-[#E5F3EC] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:text-white [backface-visibility:hidden] ${
              isFlipped ? "pointer-events-none" : ""
            }`}
          >
            {/* Holographic Security Overlay Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
            <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-500/15 via-indigo-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

            {/* Card Header: National Cooperative Registry Seal */}
            <div className="flex items-center justify-between border-b-2 border-blue-500/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white flex items-center justify-center font-black shadow-md shadow-blue-500/25">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-widest font-black text-blue-800 dark:text-blue-300">
                    Govt. Registered Labour Society
                  </div>
                  <h3 className="font-display font-black text-base leading-tight tracking-tight text-slate-900 dark:text-white">
                    COOPNEX <span className="text-[#2563EB] dark:text-blue-400">SMART ID</span>
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-500/40 text-[10px] font-mono font-black text-blue-800 dark:text-blue-300">
                  {data.employeeId}
                </span>
                <span className="block text-[8px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  UIDAI VERIFIED
                </span>
              </div>
            </div>

            {/* Photo, Name & Core Attributes Section */}
            <div className="flex items-start gap-4">
              {/* Photo with Verified Seal */}
              <div className="relative shrink-0">
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-emerald-600 shadow-md bg-slate-200 dark:bg-slate-800">
                  <img src={photo} alt={data.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Core Details */}
              <div className="flex-1 text-left space-y-1.5 min-w-0">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                    {data.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      Age: <strong className="text-slate-900 dark:text-white">{data.age} Yrs</strong>
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {data.gender || "Male"}
                    </span>
                  </div>
                </div>

                {/* Blood Group Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800/60 text-[10px] font-black text-rose-700 dark:text-rose-300 shadow-2xs">
                  <Droplet className="w-3 h-3 text-rose-600 fill-rose-600" />
                  <span>BLOOD: {data.bloodGroup}</span>
                </div>

                {/* NSQF Level */}
                <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-500" />
                  <span className="truncate">{nsqfLevel}</span>
                </div>

                {/* District Society */}
                <div className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-1">
                  <span className="font-semibold">Society:</span> {data.societyName}
                </div>
              </div>
            </div>

            {/* Skills Strip */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-left space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 font-mono block">
                Certified Trade &amp; Skills:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {data.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800/50"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Known Strip */}
            {data.languagesKnown && data.languagesKnown.length > 0 && (
              <div className="mt-2 text-left space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 font-mono block">
                  Languages Known:
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {data.languagesKnown.map((lang, lIdx) => (
                    <span
                      key={lIdx}
                      className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Card Footer: Signature & Registrar Hologram */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex items-end justify-between">
              {/* Worker Digital Signature */}
              <div className="text-left">
                <span className="text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Worker Digital Signature
                </span>
                <div className="font-serif italic font-black text-sm text-blue-900 dark:text-blue-300 tracking-wider">
                  {data.signatureText || data.name}
                </div>
              </div>

              {/* Issue & Validity */}
              <div className="text-center font-mono text-[8px] text-slate-500 dark:text-slate-400">
                <span>Valid: {issueDate} - {validUntil}</span>
              </div>

              {/* Authorized Registrar Seal */}
              <div className="text-right">
                <span className="text-[8px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                  Registrar Co-op Seal
                </span>
                <span className="text-[10px] font-mono font-black text-emerald-700 dark:text-emerald-400">
                  [REGISTERED]
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* BACK FACE OF SMART ID CARD (HIGH RESOLUTION QR CODE)           */}
          {/* ============================================================= */}
          <div
            className={`w-full rounded-3xl p-5 sm:p-6 text-slate-900 border-2 border-emerald-600/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#101828] via-[#0F172A] to-[#020617] text-white [transform:rotateY(180deg)] [backface-visibility:hidden] absolute inset-0 flex flex-col justify-between ${
              !isFlipped ? "pointer-events-none" : ""
            }`}
          >
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  National Cooperative Registry
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                ID: {data.employeeId}
              </span>
            </div>

            {/* Big Interactive QR Code */}
            <div
              onClick={() => setShowScanModal(true)}
              className="my-auto bg-white rounded-2xl p-4 w-44 h-44 mx-auto flex flex-col items-center justify-center shadow-xl cursor-pointer hover:scale-105 transition-transform group relative"
              title="Click to simulate QR scan and audit verified credentials"
            >
              <div className="w-36 h-36 flex items-center justify-center">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer Frame */}
                  <rect x="0" y="0" width="30" height="30" fill="#0F172A" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
                  <rect x="10" y="10" width="10" height="10" fill="#0F172A" />

                  <rect x="70" y="0" width="30" height="30" fill="#0F172A" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" rx="2" />
                  <rect x="80" y="10" width="10" height="10" fill="#0F172A" />

                  <rect x="0" y="70" width="30" height="30" fill="#0F172A" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" rx="2" />
                  <rect x="10" y="80" width="10" height="10" fill="#0F172A" />

                  {/* QR Pattern Data Dots */}
                  <rect x="36" y="6" width="6" height="6" fill="#2563EB" />
                  <rect x="48" y="12" width="6" height="6" fill="#0F172A" />
                  <rect x="58" y="6" width="6" height="6" fill="#2563EB" />
                  <rect x="36" y="24" width="6" height="6" fill="#0F172A" />
                  <rect x="50" y="24" width="6" height="6" fill="#0F172A" />

                  <rect x="6" y="38" width="6" height="6" fill="#0F172A" />
                  <rect x="18" y="46" width="6" height="6" fill="#2563EB" />
                  <rect x="28" y="38" width="6" height="6" fill="#0F172A" />
                  <rect x="38" y="44" width="8" height="8" fill="#4F46E5" />
                  <rect x="54" y="38" width="6" height="6" fill="#0F172A" />
                  <rect x="68" y="44" width="6" height="6" fill="#2563EB" />
                  <rect x="82" y="38" width="6" height="6" fill="#0F172A" />
                  <rect x="88" y="48" width="6" height="6" fill="#2563EB" />

                  <rect x="38" y="62" width="6" height="6" fill="#0F172A" />
                  <rect x="50" y="62" width="6" height="6" fill="#2563EB" />
                  <rect x="64" y="68" width="6" height="6" fill="#0F172A" />
                  <rect x="80" y="74" width="6" height="6" fill="#0F172A" />
                  <rect x="88" y="84" width="6" height="6" fill="#2563EB" />

                  {/* Center Emblem */}
                  <rect x="42" y="42" width="16" height="16" fill="#FFFFFF" rx="3" />
                  <circle cx="50" cy="50" r="5" fill="#2563EB" />
                </svg>
              </div>

              {/* Hover scanner tooltip */}
              <div className="absolute inset-0 bg-emerald-900/90 rounded-2xl flex flex-col items-center justify-center text-white text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <QrCode className="w-8 h-8 text-emerald-300 animate-pulse mb-1" />
                <span className="text-[10px] font-black">CLICK TO SCAN &amp; AUDIT LIVE DOSSIER</span>
              </div>
            </div>

            {/* Back Instructions */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-300 block">
                ⚡ SCAN QR CODE TO VERIFY ACTIVE STATUS &amp; POLICE CLEARANCE
              </span>
              <p className="text-[9px] text-slate-400 max-w-xs mx-auto leading-tight">
                This cooperative identity card is statutory property of the registered District Federation. Any tampering is punishable under IPC Sec 468/471.
              </p>
            </div>

            {/* Emergency Helpline */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span>SOS Helpline: 1800-425-COOP</span>
              <span className="text-emerald-400">Insured: ₹2,00,000</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons: Print & Download */}
      <div className="w-full flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shadow-md cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Card</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onDownload) onDownload();
            else handlePrint();
          }}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition shadow-lg shadow-emerald-600/30 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Smart ID PDF</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* SCAN MODAL: AUDITING LIVE DOSSIER UPON QR SCAN                */}
      {/* ============================================================= */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-emerald-500/40 overflow-hidden relative text-slate-900 dark:text-white">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white relative">
              <button
                type="button"
                onClick={() => setShowScanModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>GOVERNMENT COOPERATIVE AUDIT DOSSIER</span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Verified Credentials
              </h3>
              <p className="text-xs text-emerald-100">
                Live cryptographic verification result for <strong>{data.employeeId}</strong>
              </p>
            </div>

            <div className="p-6 space-y-3.5 text-xs text-left">
              {/* Profile Bar */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <img src={photo} alt={data.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-500" />
                <div>
                  <h4 className="font-bold text-sm">{data.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Age: {data.age} • Blood Group: <strong className="text-rose-600">{data.bloodGroup}</strong>
                  </p>
                </div>
              </div>

              {/* 5-Point Security Audit Results */}
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                  <span className="font-semibold">UIDAI Aadhaar Verhoeff:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">✓ Cryptographically Valid</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                  <span className="font-semibold">Police Record Check (PCC):</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">✓ 100% Cleared (Zero Record)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                  <span className="font-semibold">Cooperative Accidental Shield:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">✓ Active (₹2,00,000 Cover)</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                  <span className="font-semibold">Direct Jan Dhan Bank Payout:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">✓ 0% Commission DBT Enabled</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-semibold">Spoken Languages:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {data.languagesKnown.join(", ") || "Telugu, Hindi, English"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowScanModal(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer shadow-md"
                >
                  Close Audit Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

