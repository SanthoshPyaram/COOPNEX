import React, { useState } from "react";
import { WorkerSmartIdCard, WorkerIdCardData } from "../WorkerSmartIdCard";
import {
  CreditCard,
  RotateCw,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  Download
} from "lucide-react";

interface WorkerSmartIdTabProps {
  cardData: WorkerIdCardData;
}

export const WorkerSmartIdTab: React.FC<WorkerSmartIdTabProps> = ({ cardData }) => {
  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-black text-slate-900">Official Smart ID Card</h3>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Level 4 Accredited
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Government of Andhra Pradesh Labour Department Cooperative Identity Card with Verhoeff QR checksum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintCard}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-2xs cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Physical ID Card</span>
          </button>
        </div>
      </div>

      {/* Instructions Pill */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-medium">
          <QrCode className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Click the card to flip between Official Front Face and Encrypted QR Hologram Back Face.</span>
        </span>
        <span className="text-[11px] font-mono text-blue-700 bg-white/80 px-2 py-0.5 rounded-md border border-blue-200">
          ISO/IEC 7810 ID-1 Standard (85.60 × 53.98 mm)
        </span>
      </div>

      {/* Main Interactive 3D Card Display */}
      <div className="py-6 flex justify-center">
        <WorkerSmartIdCard data={cardData} />
      </div>

      {/* Card Trust & Verification Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Police Clearance</span>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Gunadala Precinct (PCC Cleared)
          </span>
          <p className="text-[10px] text-slate-500">Certificate #PCC-AP-VJA-2026-8941</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">UIDAI Aadhaar Checksum</span>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Verhoeff D5 Valid Match
          </span>
          <p className="text-[10px] text-slate-500">Biometric verification passed</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Skill Accreditation</span>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            NSQF Level-4 Master
          </span>
          <p className="text-[10px] text-slate-500">NSDC State Mission Registry</p>
        </div>
      </div>
    </div>
  );
};

