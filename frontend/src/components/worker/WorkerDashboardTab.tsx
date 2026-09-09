import React from "react";
import { useTranslation } from "react-i18next";
import { Booking } from "../../types";
import { HumanVisual } from "../HumanVisual";
import {
  Briefcase,
  Calendar,
  TrendingUp,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Navigation,
  Eye,
  HeartHandshake,
  Wallet,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface WorkerDashboardTabProps {
  onNavigate: (tabId: string) => void;
  activeJobs: Booking[];
  walletBalance: number;
  onOpenWithdrawalModal: () => void;
  onSelectJobForDetails: (job: Booking) => void;
}

export const WorkerDashboardTab: React.FC<WorkerDashboardTabProps> = ({
  onNavigate,
  activeJobs,
  walletBalance,
  onOpenWithdrawalModal,
  onSelectJobForDetails
}) => {
  const { t } = useTranslation();

  // Find immediate next job (ASSIGNED or ACCEPTED or IN_PROGRESS)
  const nextJob = activeJobs.find(
    (j) => j.status === "ASSIGNED" || j.status === "ACCEPTED" || j.status === "IN_PROGRESS"
  ) || activeJobs[0];

  const todayJobsList = activeJobs.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. TOP GREETING BANNER WITH COMPACT HUMAN VISUAL */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {t("worker_dash.field_ready", "Field Ready • Duty Shift Active")}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t("worker_dash.greeting", "Good morning")}, Arjun 👋
          </h1>
          <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
            <span className="font-bold text-blue-600">Verified Electrician</span>
            <span>&bull;</span>
            <span className="font-mono text-slate-400">Employee ID: COOP-EMP-0001</span>
            <span>&bull;</span>
            <span className="text-slate-600">Vijayawada Central Labour Co-op</span>
          </p>
        </div>

        {/* Small Human Visual on Right (Not a giant card) */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right hidden md:block">
            <span className="text-xs font-black text-slate-900 block">Level 4 Artisan</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
              <ShieldCheck className="w-3 h-3" />
              UIDAI & PCC Verified
            </span>
          </div>
          <HumanVisual
            role="electrician"
            size="sm"
            animation="breathe"
            background="glow"
            showStatusBadge
          />
        </div>
      </div>

      {/* 2. QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate("jobs")}
          className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-left transition shadow-2xs group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-900 block">{t("worker_dash.view_jobs", "View Jobs")}</span>
          <span className="text-[10px] text-slate-400">Active dispatches</span>
        </button>

        <button
          onClick={() => onNavigate("schedule")}
          className="p-3.5 rounded-2xl bg-white hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition shadow-2xs group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-900 block">{t("worker_dash.my_schedule", "Schedule")}</span>
          <span className="text-[10px] text-slate-400">Timeline & shifts</span>
        </button>

        <button
          onClick={() => onNavigate("earnings")}
          className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-left transition shadow-2xs group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-900 block">{t("worker_nav.earnings", "Earnings")}</span>
          <span className="text-[10px] text-slate-400">Weekly passbook</span>
        </button>

        <button
          onClick={() => onNavigate("smart-id")}
          className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/70 border border-slate-200 hover:border-amber-300 text-left transition shadow-2xs group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-900 block">{t("worker_nav.smart_id", "Smart ID")}</span>
          <span className="text-[10px] text-slate-400">Physical & digital card</span>
        </button>
      </div>

      {/* 3. 6 COMPACT STATISTICS CARDS IN ONE RESPONSIVE GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Today's Jobs</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">2</div>
          <span className="text-[10px] text-blue-600 font-bold">1 In Progress</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Pending Jobs</span>
          <div className="text-xl font-black text-amber-600 mt-0.5">1</div>
          <span className="text-[10px] text-amber-700 font-bold">Action needed</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Completed</span>
          <div className="text-xl font-black text-emerald-600 mt-0.5">184</div>
          <span className="text-[10px] text-emerald-700 font-bold">100% verified</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Today's Pay</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">₹650</div>
          <span className="text-[10px] text-slate-400">+₹720 pending</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Monthly Pay</span>
          <div className="text-xl font-black text-[#2563EB] mt-0.5">₹24,800</div>
          <span className="text-[10px] text-emerald-600 font-bold">↑ 14% vs Aug</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">Citizen Rating</span>
          <div className="text-xl font-black text-slate-900 mt-0.5 flex items-center gap-1">
            <span>4.95</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] text-slate-400">142 reviews</span>
        </div>
      </div>

      {/* 4. 2-COLUMN SECTION: NEXT JOB + TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT (7 cols): NEXT JOB CARD */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-rose-600">
                  NEXT IMMEDIATE JOB
                </span>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                  Emergency Priority
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                #{nextJob?.bookingNumber || "BK-VJA-2026-801"}
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-black text-slate-900">
                  {nextJob?.requirementDescription || "Electrical Repair (MCB Sparking & Tripping)"}
                </h3>
                <div className="space-y-1 text-xs text-slate-600">
                  <p className="font-bold text-slate-800">
                    Customer: {nextJob?.customerName || "Smt. Priya Sharma (K. Venkat Rao)"}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{nextJob?.serviceLocation?.address || "Benz Circle, Ring Road, Vijayawada"}</span>
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>Today &bull; 4:30 PM</span>
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 font-bold">2.4 km away</span>
                  </div>
                </div>
              </div>

              {/* Worker Visual Beside Next Job */}
              <div className="shrink-0 hidden sm:block">
                <HumanVisual
                  role="electrician"
                  size="md"
                  animation="float"
                  background="glow"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Net Worker Earnings
              </span>
              <span className="text-xl font-black text-emerald-600">
                ₹{nextJob?.fairWageBreakdown?.workerEarning || 650}
              </span>
              <span className="text-[10px] text-slate-400 block">
                0% commission &bull; Direct Escrow DBT
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate("jobs")}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Job</span>
              </button>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Start Navigation</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT (5 cols): TODAY'S SCHEDULE TIMELINE */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">Today's Schedule</h3>
              </div>
              <button
                onClick={() => onNavigate("schedule")}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Full calendar &rarr;
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todayJobsList.map((job, idx) => (
                <div
                  key={job._id || idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 hover:bg-blue-50/40 transition"
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-center shrink-0">
                    <span className="text-[10px] font-black text-blue-600 block leading-tight">
                      {idx === 0 ? "10:30" : idx === 1 ? "14:00" : "16:30"}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">
                      {idx === 0 ? "AM" : "PM"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-slate-900 truncate">
                      {job.requirementDescription || "Electrical Maintenance"}
                    </h4>
                    <p className="text-[11px] text-slate-600 truncate">
                      {job.customerName || "Citizen Customer"} &bull; Benz Circle
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                        job.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : job.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-[10px] font-black text-slate-700">
                        ₹{job.fairWageBreakdown?.workerEarning || 650}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate("schedule")}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 transition cursor-pointer"
            >
              Open Complete Schedule
            </button>
          </div>
        </div>
      </div>

      {/* 5. 2-COLUMN SECTION: EARNINGS SUMMARY + WELFARE CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT (6 cols): WALLET & EARNINGS SUMMARY */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">Wallet & Instant DBT Payout</h3>
            </div>
            <button
              onClick={() => onNavigate("wallet")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Wallet Details &rarr;
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 block">Available Withdrawable Balance</span>
              <span className="text-2xl font-black text-slate-900 block mt-0.5">₹{walletBalance.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block">Andhra Pragathi Grameena Bank &bull; A/C ending 9821</span>
            </div>

            <button
              onClick={onOpenWithdrawalModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
            >
              Instant Withdraw
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">This Week</span>
              <span className="font-black text-slate-800 text-sm mt-0.5">₹4,200</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">This Month</span>
              <span className="font-black text-slate-800 text-sm mt-0.5">₹24,800</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Lifetime DBT</span>
              <span className="font-black text-slate-800 text-sm mt-0.5">₹68,400</span>
            </div>
          </div>
        </div>

        {/* RIGHT (6 cols): WELFARE CENTER HIGHLIGHTS */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-black text-slate-900">Cooperative Welfare Protection</h3>
            </div>
            <button
              onClick={() => onNavigate("welfare")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Open Welfare Center &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">PMSBY Accidental Insurance</span>
              <span className="text-base font-black text-rose-950 block mt-0.5">₹5,00,000</span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                Active Premium Paid by Co-op
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Tool Replacement Fund</span>
              <span className="text-base font-black text-blue-950 block mt-0.5">₹15,000 Buffer</span>
              <span className="text-[10px] text-blue-700 font-bold mt-1 block">
                Instant Claim Approval
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-slate-800 block">Need Emergency Assistance?</span>
              <span className="text-[10px] text-slate-500">24/7 Cooperative Artisan Relief Committee</span>
            </div>
            <button
              onClick={() => onNavigate("welfare")}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              File Claim
            </button>
          </div>
        </div>
      </div>

      {/* 6. RECENT ACTIVITY TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Recent Completed Dispatches</h3>
          <button
            onClick={() => onNavigate("jobs")}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            All Jobs History &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Booking ID</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Service</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4 text-right">Net Earning</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeJobs.slice(0, 4).map((job, i) => (
                <tr key={job._id || i} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {job.bookingNumber || `BK-VJA-2026-${800 + i}`}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {job.customerName || "Citizen Customer"}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {job.serviceCategory || "Electrical Maintenance"}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    Benz Circle, Vijayawada
                  </td>
                  <td className="py-3 px-4 text-right font-black text-emerald-600">
                    ₹{job.fairWageBreakdown?.workerEarning || 650}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

