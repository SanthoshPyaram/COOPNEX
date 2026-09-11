import React from "react";
import { HumanVisual } from "../HumanVisual";
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  ShieldCheck,
  Calendar,
  ArrowUpRight,
  Download,
  Building2
} from "lucide-react";

import { Booking } from "../../types";

interface WorkerEarningsTabProps {
  activeJobs?: Booking[];
  workerProfile?: any;
}

export const WorkerEarningsTab: React.FC<WorkerEarningsTabProps> = ({
  activeJobs = [],
  workerProfile
}) => {
  const completedJobs = activeJobs.filter((j) => j.status === "COMPLETED");

  const isToday = (dateStr?: Date | string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const todaysEarnings = completedJobs
    .filter((j) => isToday(j.completedAt) || isToday(j.updatedAt))
    .reduce((sum, j) => sum + (j.fairWageBreakdown?.workerEarning || 0), 0);

  const totalEarnings = workerProfile?.totalEarnings ?? completedJobs.reduce((sum, j) => sum + (j.fairWageBreakdown?.workerEarning || 0), 0);
  const totalJobsCount = workerProfile?.jobsCompletedCount ?? completedJobs.length;

  const earningsLedger = completedJobs.map((job) => ({
    id: job._id,
    bookingId: job.bookingNumber,
    customer: job.customerName || "Citizen Customer",
    service: job.requirementDescription || job.serviceCategory,
    date: job.completedAt ? new Date(job.completedAt).toLocaleDateString("en-IN") : "Recent",
    grossPaid: job.fairWageBreakdown?.customerPaid || 0,
    coopDeduction: job.fairWageBreakdown?.cooperativeContribution || 0,
    platformCut: 0,
    netEarning: job.fairWageBreakdown?.workerEarning || 0,
    status: "CREDITED_VIA_DBT"
  }));

  const primarySkill = (workerProfile?.skills && workerProfile.skills[0]) || workerProfile?.trade || "Artisan";
  const primaryTrade = primarySkill.toLowerCase().includes("plumb")
    ? "plumber"
    : primarySkill.toLowerCase().includes("carpent")
    ? "carpenter"
    : primarySkill.toLowerCase().includes("paint")
    ? "painter"
    : "electrician";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Banner with Human Visual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Fair Wage &amp; Earnings Ledger</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown: 100% direct to artisan DBT escrow, 0% platform commission deductions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>0% Commission Cooperative Guarantee</span>
          </span>
          <HumanVisual role={primaryTrade} size="xs" animation="subtle" background="none" />
        </div>
      </div>

      {/* 4 TOP EARNINGS METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">Today's Earnings</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{todaysEarnings.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Direct DBT Pay</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">Completed Dispatches</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{completedJobs.length}</div>
          <span className="text-[10px] text-blue-600 font-bold">Active in current period</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">Total Lifetime Earnings</span>
          <div className="text-2xl font-black text-[#2563EB] mt-1">₹{(totalEarnings || 0).toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Direct to Bank Escrow</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-500 font-bold block">All-Time Platform Jobs</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalJobsCount}</div>
          <span className="text-[10px] text-slate-400">Total verified deliveries</span>
        </div>
      </div>

      {/* DETAILED EARNINGS LEDGER TABLE */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-900">Recent Service Payout Ledger</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Customer & Service</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Customer Paid</th>
                <th className="py-3 px-3 text-right">Co-op Fund (10%)</th>
                <th className="py-3 px-3 text-right">Net Worker Pay</th>
                <th className="py-3 px-3 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {earningsLedger.length > 0 ? (
                earningsLedger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                      {item.bookingId}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-900 block">{item.customer}</span>
                      <span className="text-[10px] text-slate-500">{item.service}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-slate-900">
                      ₹{item.grossPaid}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-amber-700">
                      -₹{item.coopDeduction}
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-emerald-600 text-sm">
                      ₹{item.netEarning}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <ShieldCheck className="w-3 h-3" />
                        Direct DBT
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No completed service payouts yet. Payouts for completed jobs with citizen OTP will be credited via direct DBT and displayed here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

