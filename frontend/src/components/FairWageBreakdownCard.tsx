import React, { useState } from "react";
import { FairWageBreakdown } from "../types";
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface FairWageProps {
  breakdown: FairWageBreakdown;
  compact?: boolean;
}

export const FairWageBreakdownCard: React.FC<FairWageProps> = ({ breakdown, compact = false }) => {
  const { t } = useLanguage();
  const [showExplanation, setShowExplanation] = useState(false);

  const takeHomePct = Math.round((breakdown.workerEarning / (breakdown.customerPaid || 1)) * 100);
  const coopPct = Math.round((breakdown.cooperativeContribution / (breakdown.customerPaid || 1)) * 100);

  return (
    <div className="bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/40 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-sm text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-amber-300 flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              {t("cards.fairWageTitle")}
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                {t("cards.transparent100")}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {t("cards.zeroAggregator")}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-blue-200 transition cursor-pointer"
        >
          <span>{t("cards.fairWageInsight")}</span>
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-3 gap-2 my-3.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="text-center border-r border-slate-100 pr-1">
          <div className="text-[10px] uppercase font-bold text-slate-500">{t("cards.customerPaid")}</div>
          <div className="text-base sm:text-lg font-black text-slate-900">
            ₹{breakdown.customerPaid}
          </div>
          <div className="text-[9px] text-slate-400">{t("cards.totalInvoice")}</div>
        </div>

        <div className="text-center border-r border-slate-100 px-1 bg-emerald-50/50 rounded-lg py-0.5">
          <div className="text-[10px] uppercase font-bold text-emerald-800">{t("cards.workerEarnings")}</div>
          <div className="text-base sm:text-lg font-black text-emerald-700">
            ₹{breakdown.workerEarning}
          </div>
          <div className="text-[9px] text-emerald-600 font-semibold">{takeHomePct}% {t("cards.directPayout")}</div>
        </div>

        <div className="text-center pl-1">
          <div className="text-[10px] uppercase font-bold text-blue-800">{t("cards.coopWelfareFund")}</div>
          <div className="text-base sm:text-lg font-black text-blue-700">
            ₹{breakdown.cooperativeContribution}
          </div>
          <div className="text-[9px] text-blue-600 font-semibold">{coopPct}% {t("cards.memberSafety")}</div>
        </div>
      </div>

      {/* Itemized Calculation Breakdown */}
      {!compact && (
        <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
          <div className="flex justify-between text-slate-600 py-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {t("cards.baseWorkerWage")}
            </span>
            <span className="font-semibold text-slate-800">₹{breakdown.baseWorkerWage}</span>
          </div>

          {breakdown.skillPremium > 0 && (
            <div className="flex justify-between text-slate-600 py-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {t("cards.skillPremium")}
              </span>
              <span className="font-semibold text-amber-700">+₹{breakdown.skillPremium}</span>
            </div>
          )}

          {breakdown.experiencePremium > 0 && (
            <div className="flex justify-between text-slate-600 py-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {t("cards.experiencePremium")}
              </span>
              <span className="font-semibold text-blue-700">+₹{breakdown.experiencePremium}</span>
            </div>
          )}

          {breakdown.travelAllowance > 0 && (
            <div className="flex justify-between text-slate-600 py-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Transit & Travel Allowance (Fuel Reimbursement)
              </span>
              <span className="font-semibold text-purple-700">+₹{breakdown.travelAllowance}</span>
            </div>
          )}

          {breakdown.emergencyAllowance > 0 && (
            <div className="flex justify-between text-slate-600 py-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                🚨 Emergency Priority Dispatch Premium
              </span>
              <span className="font-semibold text-red-700">+₹{breakdown.emergencyAllowance}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600 py-0.5 border-t border-dashed border-slate-200 pt-1">
            <span className="flex items-center gap-1.5 text-blue-800 font-medium">
              <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
              Cooperative Welfare Fund (Health, Tools & Pension)
            </span>
            <span className="font-semibold text-blue-800">+₹{breakdown.cooperativeContribution}</span>
          </div>

          {breakdown.taxGst > 0 && (
            <div className="flex justify-between text-slate-500 text-[11px] py-0.5">
              <span>Statutory Goods & Services Tax (GST 5%)</span>
              <span>+₹{breakdown.taxGst}</span>
            </div>
          )}
        </div>
      )}

      {/* Expandable Explanation Panel */}
      {showExplanation && (
        <div className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-xl text-xs space-y-2 border border-blue-800 animate-fadeIn">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            Why is the wage structured this way?
          </div>
          <p className="leading-relaxed text-slate-200">
            Private gig apps deduct 25% to 35% commission directly from workers' pockets.
            Under <strong>COOPNEX</strong>, 100% of the worker's base wage, skill tier bonus,
            and travel allowance goes directly to the worker's wallet without platform deductions.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
              <span className="font-bold text-amber-300 block">Private App Aggregator:</span>
              Worker gets: ~₹420 out of ₹700 (55-60%)
            </div>
            <div className="bg-emerald-900/90 p-2 rounded border border-emerald-500/50">
              <span className="font-bold text-emerald-300 block">COOPNEX (Co-op):</span>
              Worker gets: ₹{breakdown.workerEarning} out of ₹{breakdown.customerPaid} ({takeHomePct}%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

