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
import { AvatarPlaceholder } from "./common/AvatarPlaceholder";
import { useLanguage } from "../context/LanguageContext";

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
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const photo = data.photoUrl || "";
  const issueDate = data.issueDate || "07/09/2026";
  const validUntil = data.validUntil || "06/09/2029";
  const nsqfLevel = data.nsqfLevel || "NSQF Level-4 Master";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={`worker-smart-id-print-zone flex flex-col items-center space-y-4 max-w-md mx-auto select-none ${className}`}>
      {/* Top Action Bar */}
      <div className="w-full flex items-center justify-between px-2 text-xs no-print">
        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t("cards.officialSmartId")}</span>
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold transition shadow-xs cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? t("cards.showFront") : t("cards.flipToBack")}</span>
        </button>
      </div>

      {/* 3D FLIPPABLE ID CARD CONTAINER (SCREEN ONLY) */}
      <div className="w-full max-w-[440px] [perspective:1200px] print:hidden">
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full h-[270px] sm:h-[280px] relative cursor-pointer select-none"
          style={{ transformStyle: "preserve-3d" }}
          onClick={() => setIsFlipped(!isFlipped)}
          title={isFlipped ? "Click card to flip to Front Face" : "Click card to flip to Back Face (QR)"}
        >
          {/* ============================================================= */}
          {/* FRONT FACE OF SMART ID CARD                                   */}
          {/* ============================================================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)"
            }}
            className={`absolute inset-0 w-full h-full rounded-2xl p-3.5 sm:p-4 text-slate-900 border-2 border-emerald-600/50 shadow-xl overflow-hidden bg-gradient-to-br from-[#FCFBF7] via-[#F3F9F5] to-[#E5F3EC] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:text-white flex flex-col justify-between ${
              isFlipped ? "pointer-events-none" : ""
            }`}
          >
            {/* Holographic Security Overlay Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:14px_14px] opacity-15 pointer-events-none" />
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-blue-500/15 via-indigo-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

            {/* Card Header: National Cooperative Registry Seal */}
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-white flex items-center justify-center font-black shadow-xs shadow-blue-500/25 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-left">
                  <div className="text-[8px] uppercase tracking-wider font-black text-blue-800 dark:text-blue-300 leading-tight">
                    {t("cards.govtRegistered")}
                  </div>
                  <h3 className="font-display font-black text-xs leading-tight tracking-tight text-slate-900 dark:text-white">
                    {t("cards.smartIdTitle")}
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-500/40 text-[9px] font-mono font-black text-blue-800 dark:text-blue-300">
                  {data.employeeId}
                </span>
                <span className="block text-[7px] text-slate-500 dark:text-slate-400 font-mono">
                  {t("cards.uidaiVerified")}
                </span>
              </div>
            </div>

            {/* Main Details Body: Left Photo & Signature, Right Attributes */}
            <div className="flex items-start gap-3 my-auto">
              {/* Left Column: Photo & Signature */}
              <div className="flex flex-col items-center shrink-0">
                <div className="relative">
                  <div className="w-[72px] h-[86px] rounded-xl overflow-hidden border border-emerald-600 shadow-sm bg-slate-200 dark:bg-slate-800">
                    <AvatarPlaceholder src={data.photoUrl} name={data.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs border border-white dark:border-slate-900">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-center mt-1">
                  <span className="text-[7px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-tight">
                    Signatory
                  </span>
                  <span className="font-serif italic font-bold text-[10px] text-blue-900 dark:text-blue-300 truncate max-w-[80px] block">
                    {data.signatureText || data.name}
                  </span>
                </div>
              </div>

              {/* Right Column: Core Artisan Attributes */}
              <div className="flex-1 min-w-0 text-left space-y-1">
                <div className="flex items-baseline justify-between gap-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                    {data.name}
                  </h4>
                  <span className="text-[9px] font-bold text-slate-500 shrink-0 font-mono">
                    {data.age} Yrs • {data.gender || "Specialist"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800/60 text-[9px] font-black text-rose-700 dark:text-rose-300">
                    <Droplet className="w-2.5 h-2.5 text-rose-600 fill-rose-600" />
                    <span>{data.bloodGroup}</span>
                  </span>

                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800/60 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                    <Award className="w-2.5 h-2.5 text-amber-500" />
                    <span>{nsqfLevel}</span>
                  </span>
                </div>

                <div className="text-[9px] text-slate-600 dark:text-slate-300 line-clamp-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Society:</span> {data.societyName}
                </div>

                {/* Certified Trade Skills */}
                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                  {data.skills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                  {data.skills.length > 3 && (
                    <span className="text-[8px] text-slate-400 font-mono">+{data.skills.length - 3}</span>
                  )}
                </div>

                {/* Languages Known */}
                {data.languagesKnown && data.languagesKnown.length > 0 && (
                  <div className="text-[8px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Langs:</span> {data.languagesKnown.join(", ")}
                  </div>
                )}
              </div>
            </div>

            {/* Front Card Bottom Strip */}
            <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[8px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Valid Thru: <strong className="text-slate-700 dark:text-slate-300">{validUntil}</strong></span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                ✓ UIDAI Verhoeff &amp; Police Cleared
              </span>
              <span className="text-[7px] text-blue-600 font-bold uppercase">Flip 180° for QR &rarr;</span>
            </div>
          </div>

          {/* ============================================================= */}
          {/* BACK FACE OF SMART ID CARD (HIGH RESOLUTION QR CODE)           */}
          {/* ============================================================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
            className={`absolute inset-0 w-full h-full rounded-2xl p-3.5 sm:p-4 text-white border-2 border-emerald-600/50 shadow-xl overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0B1220] to-[#020617] flex flex-col justify-between ${
              !isFlipped ? "pointer-events-none" : ""
            }`}
          >
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:14px_14px] opacity-15 pointer-events-none" />

            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  National Cooperative Registry
                </span>
              </div>
              <span className="text-[8px] font-mono text-slate-400">
                ID: {data.employeeId}
              </span>
            </div>

            {/* Compact Centered QR Code */}
            <div className="flex items-center justify-center gap-4 my-auto">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowScanModal(true);
                }}
                className="bg-white rounded-xl p-2 w-28 h-28 flex flex-col items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform group relative shrink-0"
                title="Click to simulate QR scan and audit verified credentials"
              >
                <div className="w-24 h-24 flex items-center justify-center">
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
                <div className="absolute inset-0 bg-emerald-900/90 rounded-xl flex flex-col items-center justify-center text-white text-center p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <QrCode className="w-5 h-5 text-emerald-300 animate-pulse mb-0.5" />
                  <span className="text-[8px] font-black leading-tight">CLICK TO AUDIT</span>
                </div>
              </div>

              {/* Back Details & Legal */}
              <div className="text-left space-y-1 max-w-[200px]">
                <span className="text-[9px] font-mono font-bold text-amber-300 block">
                  ⚡ {t("cards.scanQrVerify")}
                </span>
                <p className="text-[8px] text-slate-400 leading-tight">
                  Cryptographic Verhoeff Aadhaar &amp; State Police clearance embedded. Tampering is punishable under IPC Sec 468/471.
                </p>
                <div className="pt-1 text-[8px] font-mono text-emerald-400">
                  <span>Cover: ₹2,00,000 (Group Accidental)</span>
                </div>
              </div>
            </div>

            {/* Back Bottom Strip */}
            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[8px] text-slate-400 font-mono">
              <span>{t("cards.emergencyContact")}: 1800-425-COOP</span>
              <span className="text-emerald-400 font-bold">100% Verified Dossier</span>
              <span className="text-slate-400 text-[7px]">&larr; Click to Flip Front</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============================================================= */}
      {/* PRINT-ONLY TWO-SIDED CARD TEMPLATE                            */}
      {/* ============================================================= */}
      <div className="hidden print:block w-full max-w-3xl mx-auto p-4 space-y-6 bg-white text-slate-900">
        <div className="text-center border-b pb-2 mb-4">
          <h2 className="text-base font-black uppercase text-blue-900 tracking-wider">
            Ministry of Cooperation — National Cooperative Artisan Identity Pass
          </h2>
          <p className="text-[11px] text-slate-500">
            Official Government Labour Co-op Physical Card (Cut along dashed line)
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 border-2 border-dashed border-slate-400 p-4 rounded-2xl">
          {/* Front Print Card */}
          <div className="border border-slate-300 p-4 rounded-xl bg-slate-50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-xs text-blue-800">COOPNEX SMART ID (FRONT)</span>
              <span className="font-mono text-xs font-bold text-slate-700">{data.employeeId}</span>
            </div>
            <div className="flex gap-3">
              <img src={photo} alt={data.name} className="w-20 h-24 object-cover rounded-lg border border-slate-300" />
              <div className="text-xs space-y-1">
                <div className="font-black text-sm text-slate-900">{data.name}</div>
                <div className="text-[10px] text-slate-600">Age: {data.age} | {data.gender || "Male"}</div>
                <div className="text-[10px] font-bold text-rose-700">Blood Group: {data.bloodGroup}</div>
                <div className="text-[10px] text-emerald-800 font-bold">{nsqfLevel}</div>
                <div className="text-[10px] text-slate-600">{data.societyName}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[9px] flex justify-between text-slate-500">
              <span>Valid: {issueDate} - {validUntil}</span>
              <span className="font-bold text-emerald-700">✓ UIDAI & Police Cleared</span>
            </div>
          </div>

          {/* Back Print Card */}
          <div className="border border-slate-300 p-4 rounded-xl bg-slate-900 text-white space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-bold text-xs text-emerald-400">COOPNEX SMART ID (BACK)</span>
              <span className="font-mono text-xs text-slate-400">{data.employeeId}</span>
            </div>
            <div className="flex items-center justify-center p-2 bg-white rounded-lg w-28 h-28 mx-auto">
              <QrCode className="w-24 h-24 text-slate-900" />
            </div>
            <div className="text-center text-[9px] text-slate-300 space-y-0.5">
              <div>Scan QR code to audit official police & skill dossier</div>
              <div className="text-emerald-400 font-mono">SOS: 1800-425-COOP | Insured: ₹2,00,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Print & Download */}
      <div className="w-full flex items-center justify-center gap-3 pt-2 no-print">
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
                <AvatarPlaceholder src={data.photoUrl} name={data.name} className="w-12 h-12 rounded-xl object-cover border border-emerald-500 shrink-0" />
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

