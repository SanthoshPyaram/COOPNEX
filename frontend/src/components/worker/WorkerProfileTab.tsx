import React, { useState } from "react";
import { HumanVisual } from "../HumanVisual";
import {
  User,
  ShieldCheck,
  Star,
  CheckCircle2,
  FileCheck,
  Building2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Lock,
  ExternalLink
} from "lucide-react";

interface WorkerProfileTabProps {
  employeeId: string;
  name: string;
  skills: string[];
  district: string;
  societyName: string;
}

export const WorkerProfileTab: React.FC<WorkerProfileTabProps> = ({
  employeeId,
  name,
  skills,
  district,
  societyName
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "about" | "skills" | "experience" | "reviews" | "documents" | "cooperative"
  >("documents");

  const kycDocumentsList = [
    {
      type: "Aadhaar Card",
      id: "XXXX-XXXX-9021",
      issuer: "UIDAI e-KYC Biometric",
      status: "Verified",
      fraudScore: "0% Tamper Risk",
      date: "10 Apr 2023"
    },
    {
      type: "PAN Card",
      id: "ABCDE1234F",
      issuer: "Income Tax Department (NSDL)",
      status: "Verified",
      fraudScore: "0% Tamper Risk",
      date: "10 Apr 2023"
    },
    {
      type: "Police Clearance Certificate (PCC)",
      id: "PCC-VJA-2023-0881",
      issuer: "Gunadala Police Precinct, Vijayawada Police",
      status: "Verified",
      fraudScore: "Clean Record (Zero FIRs)",
      date: "12 Apr 2023"
    },
    {
      type: "Trade Skill Certification",
      id: "NSDC-AP-EL-9082",
      issuer: "State Skill Development Mission (NSDC)",
      status: "Level 4 Certified",
      fraudScore: "Accredited",
      date: "20 Aug 2023"
    },
    {
      type: "DBT Bank Passbook",
      id: "APGB-0021-99821",
      issuer: "Andhra Pragathi Grameena Bank",
      status: "DBT Escrow Ready",
      fraudScore: "Active Account",
      date: "15 Apr 2023"
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
      {/* 2-COLUMN PROFILE HEADER */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-slate-200">
        {/* Left: Large Professional Human Visual */}
        <div className="shrink-0">
          <HumanVisual
            role="electrician"
            size="xl"
            animation="breathe"
            background="glow"
            showStatusBadge
            badgeText="Level 4 Master Electrician"
          />
        </div>

        {/* Right: Worker Identity & Metrics */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900">{name}</h2>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Government Verified</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-mono font-bold text-blue-600">ID: {employeeId}</span>
            <span>&bull;</span>
            <span className="font-bold text-slate-800">{skills[0] || "Electrician (Level 4)"}</span>
            <span>&bull;</span>
            <span>{district}</span>
          </p>

          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Registered master artisan affiliated with <strong className="text-slate-800">{societyName}</strong>. Specializing in high-voltage industrial circuits, residential MCB diagnostic repairs, and solar inverter installations.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.95 Rating (142 reviews)</span>
            </div>
            <span>&bull;</span>
            <span className="text-slate-600"><strong>8+ Years</strong> Experience</span>
            <span>&bull;</span>
            <span className="text-emerald-600 font-bold">184 Completed Jobs</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 pb-2">
        {[
          { id: "documents", label: "Verification & Documents (KYC)" },
          { id: "about", label: "About" },
          { id: "skills", label: "Skills & Badges" },
          { id: "experience", label: "Experience History" },
          { id: "reviews", label: "Citizen Reviews" },
          { id: "cooperative", label: "Cooperative Society" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: VERIFICATION & DOCUMENTS */}
      {activeSubTab === "documents" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
            <span className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Accreditation Status: Official Cooperative Verified Level 4</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-800 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-300">
              UIDAI & AP Police Cleared
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {kycDocumentsList.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <h4 className="text-xs font-black text-slate-900">{doc.type}</h4>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-slate-600">{doc.id}</p>
                  <p className="text-[10px] text-slate-400">Issuer: {doc.issuer}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {doc.status}
                  </span>
                  <span className="block text-[9px] text-slate-400 mt-1">{doc.fraudScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ABOUT */}
      {activeSubTab === "about" && (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed max-w-2xl">
          <h4 className="text-sm font-black text-slate-900">Professional Bio</h4>
          <p>
            Arjun Kumar is a certified Level-4 Master Electrician with over 8 years of dedicated hands-on experience in residential, commercial, and solar electrical installations across Vijayawada.
          </p>
          <p>
            Affiliated with the Vijayawada Central Labour Co-operative Society (Registration #PLCS-04) since April 2023. Fully covered under Government of Andhra Pradesh cooperative welfare insurance and verified clean police background records.
          </p>
        </div>
      )}

      {/* TAB CONTENT: SKILLS */}
      {activeSubTab === "skills" && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900">Verified Technical Competencies</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Industrial 3-Phase Wiring",
              "Domestic MCB & Distribution Board",
              "Solar Inverter Grid-Tie",
              "Surge Earthing & Spike Installation",
              "Heavy Appliance AC 16A Power Lines",
              "Emergency Rapid Circuit Tripping Diagnostic"
            ].map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: EXPERIENCE */}
      {activeSubTab === "experience" && (
        <div className="space-y-3 text-xs text-slate-700">
          <h4 className="text-sm font-black text-slate-900">Service Milestone Records</h4>
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Lead Field Electrician &bull; Vijayawada Co-op (2023 - Present)</span>
              <p className="text-slate-500 mt-0.5">184 completed citizen dispatches with 99.2% on-time SLA adherence.</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Senior Electrical Technician &bull; AP Industrial Hub (2018 - 2023)</span>
              <p className="text-slate-500 mt-0.5">Apprentice to Master Electrician NSQF Level 4 accreditation.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REVIEWS */}
      {activeSubTab === "reviews" && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900">Recent Citizen Feedback</h4>
          <div className="space-y-2.5">
            {[
              {
                customer: "K. Venkata Rao",
                date: "05 Sep 2026",
                rating: 5,
                comment: "Prompt arrival within 15 minutes for the main breaker sparking. Very neat work and explained the fuse issue clearly."
              },
              {
                customer: "Smt. L. Madhavi",
                date: "28 Aug 2026",
                rating: 5,
                comment: "Excellent service for AC wiring. Fair cooperative pricing without any hidden charges."
              }
            ].map((rev, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.customer}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-slate-600">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: COOPERATIVE */}
      {activeSubTab === "cooperative" && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-black text-slate-900">{societyName}</h4>
          </div>
          <p className="text-slate-500">
            Society Registration Code: <strong>AP/VJA/PLCS-04/2019</strong> &bull; Empanelled under Andhra Pradesh State Labour Co-operative Federation.
          </p>
          <p className="text-slate-500">
            Registered Office: Door 24-8/1, Near Benz Circle, Vijayawada &bull; Helpline: 1800-425-COOP
          </p>
        </div>
      )}
    </div>
  );
};

