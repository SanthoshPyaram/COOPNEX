import React, { useState } from "react";
import { HumanVisual } from "../HumanVisual";
import { WorkerBloodDonationHub } from "../animations/WorkerBloodDonationHub";
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  FileText,
  GraduationCap,
  Sparkles,
  Droplet,
  X
} from "lucide-react";

export const WorkerWelfareTab: React.FC = () => {
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimAmount, setClaimAmount] = useState(15000);
  const [claimReason, setClaimReason] = useState("Accidental multi-meter sensor failure during industrial panel diagnostic");
  const [claimSuccess, setClaimSuccess] = useState(false);

  const welfareBenefits = [
    {
      id: "b-1",
      title: "PMSBY Accidental Insurance",
      coverage: "₹5,00,000",
      desc: "Full coverage for workplace injury, disability, and emergency medical treatment.",
      badge: "Co-op Paid",
      badgeColor: "bg-emerald-100 text-emerald-800"
    },
    {
      id: "b-2",
      title: "Tool Replacement Buffer",
      coverage: "₹15,000 / year",
      desc: "Instant compensation for damaged or burnt out field instruments and safety gear.",
      badge: "Active",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      id: "b-3",
      title: "Family Health Cover",
      coverage: "₹3,00,000",
      desc: "Cashless hospitalization across 40+ empanelled cooperative hospital partners in Vijayawada.",
      badge: "Empanelled",
      badgeColor: "bg-purple-100 text-purple-800"
    },
    {
      id: "b-4",
      title: "Emergency Distress Fund",
      coverage: "₹25,000 Immediate",
      desc: "Instant zero-interest emergency relief for household distress or medical emergencies.",
      badge: "Available",
      badgeColor: "bg-amber-100 text-amber-800"
    },
    {
      id: "b-5",
      title: "NSDC Skill Upgradation",
      coverage: "100% Free",
      desc: "Level 5 Solar Inverter & EV Charging Master Technician training with stipends.",
      badge: "Free Training",
      badgeColor: "bg-teal-100 text-teal-800"
    },
    {
      id: "b-6",
      title: "Children Education Grant",
      coverage: "₹12,000 / child",
      desc: "Annual scholarship grant for children of active cooperative artisans in AP.",
      badge: "Annual",
      badgeColor: "bg-rose-100 text-rose-800"
    }
  ];

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setClaimModalOpen(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-rose-600" />
            <span>Artisan Welfare & Social Security Center</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every booking contributes 5% to your statutory welfare pool, fully managed under AP Labour Cooperative Act.
          </p>
        </div>

        <button
          onClick={() => setClaimModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-2xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>File Welfare Claim</span>
        </button>
      </div>

      {/* 6 COMPACT BENEFIT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {welfareBenefits.map((b) => (
          <div
            key={b.id}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.badgeColor}`}>
                  {b.badge}
                </span>
                <span className="text-sm font-black text-slate-900">{b.coverage}</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mt-2">{b.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{b.desc}</p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>AP Labour Federation</span>
              <span className="text-emerald-600 font-bold">100% Guaranteed</span>
            </div>
          </div>
        ))}
      </div>

      {/* COOPERATIVE BLOOD DONATION HUB */}
      <div className="pt-2">
        <WorkerBloodDonationHub />
      </div>

      {/* CLAIM SUBMISSION MODAL */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h4 className="text-base font-black text-slate-900">File Tool / Emergency Claim</h4>
              </div>
              <button
                onClick={() => setClaimModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {claimSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h5 className="text-sm font-black text-slate-900">Claim Docket Submitted</h5>
                <p className="text-xs text-slate-500">
                  Reference #CLM-VJA-2026-901 created. Welfare officer will inspect and release funds within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Claim Amount Requested (₹)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    max={15000}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-900"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Max available buffer: ₹15,000</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Incident Description & Location</label>
                  <textarea
                    rows={3}
                    value={claimReason}
                    onChange={(e) => setClaimReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
                  >
                    Submit Official Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

