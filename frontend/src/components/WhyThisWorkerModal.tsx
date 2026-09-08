import React from "react";
import { X, Sparkles, CheckCircle2, ShieldCheck, MapPin, Star, Clock, Activity } from "lucide-react";

interface WhyThisWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerName: string;
  matchScore: number;
  trade: string;
  distanceKm: number;
  etaMinutes: number;
  rating: number;
  verificationLevel: number;
  reasons: string[];
  breakdown?: {
    skill_fit?: number;
    distance_proximity?: number;
    verification_level?: number;
    reputation_experience?: number;
    workload_equity?: number;
  };
}

export const WhyThisWorkerModal: React.FC<WhyThisWorkerModalProps> = ({
  isOpen,
  onClose,
  workerName,
  matchScore,
  trade,
  distanceKm,
  etaMinutes,
  rating,
  verificationLevel,
  reasons,
  breakdown
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#312E81] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
              AI Intelligent Worker Match Score
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <h3 className="text-xl font-bold text-white">{workerName}</h3>
              <p className="text-xs text-blue-200">{trade} • Level {verificationLevel} Cooperative Verified</p>
            </div>
            <div className="text-right bg-white/15 px-3 py-1.5 rounded-xl border border-white/20">
              <div className="text-2xl font-black text-[#F59E0B]">{matchScore}%</div>
              <div className="text-[10px] text-blue-100 font-semibold uppercase">Match Score</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Why this worker explanation tags */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Explainability &amp; Verification Tags
            </h4>
            <div className="space-y-2">
              {reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithmic Multi-Objective Breakdown */}
          {breakdown && (
            <div className="border-t border-slate-200 pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Transparent Multi-Factor Scoring (0 - 100)
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" /> Skill Competency Match (30% weight)
                    </span>
                    <span className="font-bold text-slate-800">{breakdown.skill_fit || 95}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: `${breakdown.skill_fit || 95}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> Distance &amp; Response ETA (25% weight)
                    </span>
                    <span className="font-bold text-slate-800">{breakdown.distance_proximity || 90}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${breakdown.distance_proximity || 90}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500" /> Customer Rating &amp; Track Record (15% weight)
                    </span>
                    <span className="font-bold text-slate-800">{breakdown.reputation_experience || 98}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${breakdown.reputation_experience || 98}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-purple-600" /> Workload Equity &amp; Anti-Fatigue (15% weight)
                    </span>
                    <span className="font-bold text-slate-800">{breakdown.workload_equity || 95}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${breakdown.workload_equity || 95}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cooperative Anti-Monopoly Principle Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold">Cooperative Workload Distribution:</span> The algorithm penalizes assigning multiple back-to-back jobs to the same worker to prevent fatigue, protect safety, and ensure all qualified cooperative members receive equitable income opportunities.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

