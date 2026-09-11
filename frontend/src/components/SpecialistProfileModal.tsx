import React from "react";
import { WorkerProfile } from "../types";
import { VerificationBadge } from "./VerificationBadge";
import { resolveWorkerAvatar } from "../utils/workerAvatar";
import {
  X,
  ArrowLeft,
  Star,
  ShieldCheck,
  Award,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Zap,
  Info
} from "lucide-react";

interface SpecialistProfileModalProps {
  worker: WorkerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (worker: WorkerProfile) => void;
}

export const SpecialistProfileModal: React.FC<SpecialistProfileModalProps> = ({
  worker,
  isOpen,
  onClose,
  onBookNow
}) => {
  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden text-slate-900 font-sans">
        {/* Top Header Bar with Standard Prominent Back Button */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#312E81] text-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Specialists</span>
          </button>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#F59E0B] bg-black/20 px-2.5 py-1 rounded-full border border-white/10">
            Cooperative Member ID: {worker.workerIdNumber || "AP-VJA-402"}
          </span>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Hero Card */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-5 border-b border-slate-100">
            <img
              src={resolveWorkerAvatar(worker)}
              alt={worker.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-200/80 shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{worker.name}</h2>
                <VerificationBadge level={worker.verificationLevel || 4} size="md" />
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                  {worker.gender === "Female" ? "👩 Female Specialist" : "👨 Male Specialist"}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-semibold mt-1">
                Primary Trade: <strong className="text-slate-900">{worker.skills?.[0] || "Technician"}</strong> • {worker.experienceYears || 5} Years Certified Experience
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2 font-medium">
                <span className="flex items-center gap-1 font-bold text-[#F59E0B]">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{worker.rating || 4.9}</span>
                  <span className="text-slate-400 font-normal">({worker.reviewCount || 94} verified ratings)</span>
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{worker.jobsCompletedCount || 240} orders completed</span>
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Affiliated: <strong>{worker.societyName || "Vijayawada Central Cooperative Society"}</strong> ({worker.district || "Vijayawada"})</span>
              </div>
            </div>
          </div>

          {/* Pricing & Fair Wage Standards Card */}
          <div className="bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>Statutory Fair Wage Schedule</span>
              </span>
              <span className="text-[10px] font-bold bg-[#2563EB] text-white px-2.5 py-0.5 rounded-full">
                0% Middleman Cut
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-sans text-slate-500 block font-semibold">Standard Floor Wage</span>
                <span className="text-lg font-black text-slate-900">₹{worker.baseHourlyRate || 350}</span>
                <span className="text-[10px] font-sans text-slate-400 block">/ hour</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-sans text-slate-500 block font-semibold">Emergency 7m Rate</span>
                <span className="text-lg font-black text-rose-700">₹{Math.round((worker.baseHourlyRate || 350) * 1.35)}</span>
                <span className="text-[10px] font-sans text-rose-500 block font-sans">immediate dispatch</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[10px] font-sans text-slate-500 block font-semibold">Service Coverage</span>
                <span className="text-lg font-black text-blue-900">{worker.serviceRadiusKm || 12} km</span>
                <span className="text-[10px] font-sans text-slate-400 block">within Vijayawada</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              ⚖️ Under State Cooperative Bye-Laws, 100% of the customer's hourly payment is transferred directly to {worker.name}'s verified cooperative account upon completion OTP entry.
            </p>
          </div>

          {/* Skills & Specializations */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Skills &amp; Certified Proficiencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {(worker.skills || ["Electrician", "Technician"]).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                >
                  ✓ {skill}
                </span>
              ))}
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Safety Diagnostics
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Quality Tool Inspected
              </span>
            </div>
          </div>

          {/* Verification & Social Security Credentials */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Verification &amp; Social Protection Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="block text-slate-900">Police Background Verification</strong>
                  <span className="text-[11px] text-slate-500">Gunadala Police Station • Clear Record</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Award className="w-5 h-5 text-[#2563EB] shrink-0" />
                <div>
                  <strong className="block text-slate-900">NSDC Trade Certificate Level 4</strong>
                  <span className="text-[11px] text-slate-500">National Skill Development Council</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <strong className="block text-slate-900">PMSBY Accidental Insurance</strong>
                  <span className="text-[11px] text-slate-500">₹5,00,000 active state policy coverage</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <Phone className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <strong className="block text-slate-900">Identity &amp; Phone Verified</strong>
                  <span className="text-[11px] text-slate-500">Aadhaar &amp; Real-time OTP Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Recent Citizen Reviews
              </h3>
              <span className="text-xs text-slate-500 font-medium">98.4% satisfaction score</span>
            </div>

            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">S. Venkat Rao (Benz Circle)</span>
                  <div className="flex text-amber-500">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-slate-600 text-[11px]">
                  "Punctual arrival, wore official cooperative badge, and completed wiring diagnosis cleanly. Fair wage receipt generated instantly on my phone."
                </p>
                <span className="text-[9px] text-slate-400 block">Verified Booking • 2 days ago</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">P. Lakshmi (Patamata)</span>
                  <div className="flex text-amber-500">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-slate-600 text-[11px]">
                  "Very respectful and skilled. Having women specialists in the cooperative network gives my family complete peace of mind."
                </p>
                <span className="text-[9px] text-slate-400 block">Verified Booking • 5 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Specialists</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onBookNow(worker);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white text-xs font-black transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Book {worker.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

