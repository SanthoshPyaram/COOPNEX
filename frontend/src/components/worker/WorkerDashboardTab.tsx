import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
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
  const { user } = useAuth();
  const wp = (user as any)?.workerProfile;

  // Find immediate next job (ASSIGNED or ACCEPTED or IN_PROGRESS)
  const nextJob = activeJobs.find(
    (j) => j.status === "ASSIGNED" || j.status === "ACCEPTED" || j.status === "IN_PROGRESS"
  );

  const isToday = (dateStr?: Date | string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const todayJobsList = activeJobs.filter((j) => isToday(j.createdAt) || isToday(j.scheduledAt));
  const todayJobsCount = todayJobsList.length;
  const inProgressCount = activeJobs.filter(
    (j) => j.status === "IN_PROGRESS" || j.status === "ON_THE_WAY" || j.status === "ARRIVED"
  ).length;
  const pendingJobsCount = activeJobs.filter((j) => j.status === "ASSIGNED" || j.status === "REQUESTED").length;
  const completedJobsCount = activeJobs.filter((j) => j.status === "COMPLETED").length || (wp?.jobsCompletedCount ?? 0);

  const todaysEarnings = activeJobs
    .filter((j) => j.status === "COMPLETED" && (isToday(j.completedAt) || isToday(j.updatedAt)))
    .reduce((sum, j) => sum + (j.fairWageBreakdown?.workerEarning || 0), 0);

  const totalEarnings = wp?.totalEarnings ?? (wp?.walletBalance ?? walletBalance);
  const ratingValue = (typeof wp?.rating === "number" && wp.rating > 0) ? wp.rating.toFixed(1) : "5.0";
  const reviewCountValue = wp?.reviewCount ?? 0;

  const primarySkill = (wp?.skills && wp.skills[0]) || wp?.trade || (user as any)?.skills?.[0] || "Artisan";
  const primaryTrade = primarySkill.toLowerCase().includes("plumb")
    ? "plumber"
    : primarySkill.toLowerCase().includes("carpent")
    ? "carpenter"
    : primarySkill.toLowerCase().includes("paint")
    ? "painter"
    : "electrician";

  const verificationLevel = wp?.verificationLevel || (user as any)?.verificationLevel || 1;
  const societyName = wp?.societyName || (user as any)?.societyName || `${user?.district || "District"} Cooperative Labour Society`;

  return (
    <div className="space-y-6">
      {/* 1. TOP GREETING BANNER WITH DYNAMIC HUMAN VISUAL */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {t("worker_dash.field_ready", "Field Ready • Duty Shift Active")}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t("worker_dash.greeting", "Good morning")}, {user?.name || "Specialist"} 👋
          </h1>
          <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
            <span className="font-bold text-blue-600">{primarySkill}</span>
            <span>&bull;</span>
            <span className="font-mono text-slate-400">Employee ID: {user?.employeeId || wp?.employeeId || "COOP-WRK"}</span>
            <span>&bull;</span>
            <span className="text-slate-600">{societyName}</span>
          </p>
        </div>

        {/* Dynamic Human Visual on Right */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right hidden md:block">
            <span className="text-xs font-black text-slate-900 block">Level {verificationLevel} Artisan</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
              <ShieldCheck className="w-3 h-3" />
              UIDAI &amp; PCC Verified
            </span>
          </div>
          <HumanVisual
            role={primaryTrade}
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

      {/* 3. 6 STATISTICS CARDS COMPUTED FROM REAL WORKER DATA */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">{t("cards.todaysJobs")}</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{todayJobsCount}</div>
          <span className="text-[10px] text-blue-600 font-bold">{inProgressCount} {t("status.in_progress")}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">{t("cards.pendingJobs")}</span>
          <div className="text-xl font-black text-amber-600 mt-0.5">{pendingJobsCount}</div>
          <span className="text-[10px] text-amber-700 font-bold">
            {pendingJobsCount > 0 ? t("cards.actionNeeded") : "All clear"}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">{t("status.completed")}</span>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{completedJobsCount}</div>
          <span className="text-[10px] text-emerald-700 font-bold">{t("cards.verified100")}</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">{t("cards.todaysPay")}</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">₹{todaysEarnings.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">Direct DBT Escrow</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">{t("cards.monthlyPay", "Total Earnings")}</span>
          <div className="text-xl font-black text-[#2563EB] mt-0.5">₹{(totalEarnings || 0).toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-emerald-600 font-bold">100% Direct Pay</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 block">{t("cards.citizenRating")}</span>
          <div className="text-xl font-black text-slate-900 mt-0.5 flex items-center gap-1">
            <span>{ratingValue}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] text-slate-400">{reviewCountValue} {t("cards.reviews")}</span>
        </div>
      </div>

      {/* 4. 2-COLUMN SECTION: NEXT JOB + TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT (7 cols): NEXT JOB CARD */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          {nextJob ? (
            <>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-rose-600">
                      {t("cards.nextJob")}
                    </span>
                    {nextJob.bookingType === "EMERGENCY" && (
                      <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                        {t("cards.emergencyPriority")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{nextJob.bookingNumber}
                  </span>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-lg font-black text-slate-900">
                      {nextJob.requirementDescription || nextJob.serviceCategory}
                    </h3>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p className="font-bold text-slate-800">
                        {t("cards.customerLabel")} {nextJob.customerName}
                      </p>
                      {nextJob.serviceLocation?.address && (
                        <p className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{nextJob.serviceLocation.address}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>
                            {nextJob.scheduledAt
                              ? new Date(nextJob.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : t("common.today")}
                          </span>
                        </span>
                        <span>&bull;</span>
                        <span className="text-blue-700 font-bold uppercase text-[10px]">{nextJob.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 hidden sm:block">
                    <HumanVisual
                      role={primaryTrade}
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
                    {t("cards.netWorkerEarnings")}
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    ₹{nextJob.fairWageBreakdown?.workerEarning ?? 0}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {t("cards.zeroCommEscrow")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectJobForDetails(nextJob)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t("worker_dash.view_details", "View Details")}</span>
                  </button>
                  <button
                    onClick={() => onNavigate("jobs")}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{t("worker_dash.open_jobs", "Open Jobs")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-800">
                  {t("worker_dash.no_active_job", "No Upcoming Jobs Scheduled")}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  {t("worker_dash.no_active_job_desc", "When citizens in your cooperative jurisdiction book your trade, dispatch alerts will appear immediately here.")}
                </p>
              </div>
              <button
                onClick={() => onNavigate("jobs")}
                className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                {t("worker_dash.check_jobs_hub", "Browse Jobs Hub")}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT (5 cols): TODAY'S SCHEDULE TIMELINE */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900">{t("worker_dash.todays_schedule", "Today's Schedule")}</h3>
              </div>
              <button
                onClick={() => onNavigate("schedule")}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                {t("worker_dash.full_calendar", "Full calendar &rarr;")}
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todayJobsList.length > 0 ? (
                todayJobsList.slice(0, 3).map((job) => (
                  <div
                    key={job._id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 hover:bg-blue-50/40 transition"
                  >
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-center shrink-0">
                      <span className="text-[10px] font-black text-blue-600 block leading-tight">
                        {job.scheduledAt
                          ? new Date(job.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "Scheduled"}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {job.requirementDescription || job.serviceCategory}
                      </h4>
                      <p className="text-[11px] text-slate-600 truncate">
                        {job.customerName || "Citizen Customer"} {job.serviceLocation?.address ? `• ${job.serviceLocation.address}` : ""}
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
                          ₹{job.fairWageBreakdown?.workerEarning ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  {t("worker_dash.no_jobs_today", "No jobs scheduled for today yet.")}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => onNavigate("schedule")}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 transition cursor-pointer"
            >
              {t("worker_dash.open_schedule", "Open Complete Schedule")}
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
              <span className="text-2xl font-black text-slate-900 block mt-0.5">₹{walletBalance.toLocaleString("en-IN")}</span>
              <span className="text-[10px] text-slate-500 block">Direct Bank DBT Escrow</span>
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
              <span className="text-[10px] text-slate-400 block">Today's Pay</span>
              <span className="font-black text-slate-800 text-sm mt-0.5">₹{todaysEarnings.toLocaleString("en-IN")}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Completed Jobs</span>
              <span className="font-black text-slate-800 text-sm mt-0.5">{completedJobsCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Total Lifetime</span>
              <span className="font-black text-slate-800 text-sm mt-0.5">₹{(totalEarnings || 0).toLocaleString("en-IN")}</span>
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
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
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
                Cooperative Welfare Reserve
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
          <h3 className="text-sm font-black text-slate-900">Recent Dispatches</h3>
          <button
            onClick={() => onNavigate("jobs")}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
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
              {activeJobs.length > 0 ? (
                activeJobs.slice(0, 4).map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {job.bookingNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {job.customerName || "Citizen Customer"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {job.serviceCategory || "Artisan Service"}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {job.serviceLocation?.address || job.district || "—"}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-600">
                      ₹{job.fairWageBreakdown?.workerEarning ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No dispatches on record yet. Completed jobs will appear here automatically.
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

