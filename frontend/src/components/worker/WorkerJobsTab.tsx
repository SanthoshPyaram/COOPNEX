import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Booking, BookingStatus } from "../../types";
import { HumanVisual } from "../HumanVisual";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Navigation,
  KeyRound,
  Filter,
  Search,
  Eye,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Phone,
  Calendar,
  Loader2
} from "lucide-react";

interface WorkerJobsTabProps {
  jobs: Booking[];
  onUpdateStatus: (bookingId: string, status: BookingStatus, note?: string) => Promise<void> | void;
  onOpenCompleteModal: (job: Booking) => void;
  onSelectJobDetails: (job: Booking) => void;
}

type JobFilterTab =
  | "ALL"
  | "ASSIGNED"
  | "ACCEPTED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "HISTORY";

export const WorkerJobsTab: React.FC<WorkerJobsTabProps> = ({
  jobs,
  onUpdateStatus,
  onOpenCompleteModal,
  onSelectJobDetails
}) => {
  const { t } = useTranslation();
  const [activeFilterTab, setActiveFilterTab] = useState<JobFilterTab>("ALL");
  const [filterQuery, setFilterQuery] = useState("");
  const [rejectingJob, setRejectingJob] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

  const handleStatusUpdate = async (bookingId: string, status: BookingStatus, note?: string) => {
    setProcessingBookingId(bookingId);
    try {
      await onUpdateStatus(bookingId, status, note);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeFilterTab === "ASSIGNED") {
      if (job.status !== "ASSIGNED" && job.status !== "REQUESTED" && job.status !== "MATCHING") return false;
    } else if (activeFilterTab === "ACCEPTED") {
      if (job.status !== "ACCEPTED") return false;
    } else if (activeFilterTab === "SCHEDULED") {
      if (job.status !== "ACCEPTED" && job.status !== "ASSIGNED" && job.status !== "REQUESTED" && job.status !== "MATCHING") return false;
    } else if (activeFilterTab === "IN_PROGRESS") {
      if (
        job.status !== "IN_PROGRESS" &&
        job.status !== "ON_THE_WAY" &&
        job.status !== "ARRIVED"
      )
        return false;
    } else if (activeFilterTab === "COMPLETED") {
      if (job.status !== "COMPLETED") return false;
    } else if (activeFilterTab === "CANCELLED") {
      if (job.status !== "CANCELLED" && job.status !== "REJECTED") return false;
    } else if (activeFilterTab === "HISTORY") {
      if (job.status !== "COMPLETED" && job.status !== "CANCELLED" && job.status !== "REJECTED") return false;
    }

    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return (
        job.bookingNumber?.toLowerCase().includes(q) ||
        job.customerName?.toLowerCase().includes(q) ||
        job.serviceCategory?.toLowerCase().includes(q) ||
        job.requirementDescription?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ASSIGNED":
      case "REQUESTED":
      case "MATCHING":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse whitespace-nowrap">
            {t("jobs.new_requests", "New Request")}
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap">
            {t("jobs.accepted", "Accepted")}
          </span>
        );
      case "IN_PROGRESS":
      case "ON_THE_WAY":
      case "ARRIVED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 whitespace-nowrap">
            {t("jobs.in_progress", "In Progress")}
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
            {t("jobs.completed", "Completed")}
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 whitespace-nowrap">
            {t("jobs.cancelled", "Cancelled")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 whitespace-nowrap">
            {t("jobs.rejected", "Declined")}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  const renderActionButtons = (job: Booking, isMobile = false) => {
    const isNew = job.status === "ASSIGNED" || job.status === "REQUESTED" || job.status === "MATCHING";

    if (isNew) {
      return (
        <div className={`flex items-center ${isMobile ? "flex-wrap gap-2 w-full pt-1" : "justify-end gap-1.5"}`}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSelectJobDetails(job);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
            title="View full booking requirements & customer dossier"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{t("jobs.action_view_details", "View Details")}</span>
          </button>
          <button
            type="button"
            disabled={processingBookingId === job._id}
            onClick={(e) => {
              e.preventDefault();
              setRejectingJob(job);
              setRejectReason("");
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition cursor-pointer flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{t("jobs.action_reject", "Reject")}</span>
          </button>
          <button
            type="button"
            disabled={processingBookingId === job._id}
            onClick={async (e) => {
              e.preventDefault();
              await handleStatusUpdate(job._id, "ACCEPTED");
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            {processingBookingId === job._id ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Accepting...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t("jobs.action_accept", "Accept")}</span>
              </>
            )}
          </button>
        </div>
      );
    }

    if (job.status === "ACCEPTED") {
      return (
        <div className={`flex items-center ${isMobile ? "flex-wrap gap-2 w-full pt-1" : "justify-end gap-1.5"}`}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSelectJobDetails(job);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{t("jobs.action_view_details", "View Details")}</span>
          </button>
          <button
            type="button"
            disabled={processingBookingId === job._id}
            onClick={async (e) => {
              e.preventDefault();
              await handleStatusUpdate(job._id, "IN_PROGRESS");
            }}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t("jobs.action_start", "Start Job")}</span>
          </button>
        </div>
      );
    }

    if (job.status === "IN_PROGRESS" || job.status === "ARRIVED" || job.status === "ON_THE_WAY") {
      return (
        <div className={`flex items-center ${isMobile ? "flex-wrap gap-2 w-full pt-1" : "justify-end gap-1.5"}`}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSelectJobDetails(job);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{t("jobs.action_view_details", "View Details")}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpenCompleteModal(job);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{t("jobs.action_complete_otp", "Complete (OTP)")}</span>
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onSelectJobDetails(job);
        }}
        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer flex items-center gap-1"
      >
        <Eye className="w-3.5 h-3.5 text-slate-500" />
        <span>{t("jobs.action_inspect", "Inspect")}</span>
      </button>
    );
  };

  const tabs: { id: JobFilterTab; labelKey: string; fallback: string }[] = [
    { id: "ALL", labelKey: "jobs.all_jobs", fallback: "All Jobs" },
    { id: "ASSIGNED", labelKey: "jobs.new_requests", fallback: "New Requests" },
    { id: "ACCEPTED", labelKey: "jobs.accepted", fallback: "Accepted" },
    { id: "SCHEDULED", labelKey: "jobs.scheduled", fallback: "Scheduled" },
    { id: "IN_PROGRESS", labelKey: "jobs.in_progress", fallback: "In Progress" },
    { id: "COMPLETED", labelKey: "jobs.completed", fallback: "Completed" },
    { id: "CANCELLED", labelKey: "jobs.cancelled", fallback: "Cancelled / Declined" },
    { id: "HISTORY", labelKey: "jobs.history", fallback: "History" }
  ];

  return (
    <div className="w-full max-w-full min-w-0 bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6 overflow-hidden">
      {/* Header with Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 min-w-0">
        <div className="space-y-0.5 min-w-0 flex-1">
          <h3 className="text-xl font-black text-slate-900 truncate">
            {t("jobs.management_center", "Job Management Center")}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            {t("jobs.subtitle", "Accept dispatches, navigate to field locations, and close with citizen completion OTP.")}
          </p>
        </div>

        <div className="w-full sm:w-72 relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={t("jobs.search_placeholder", "Search active jobs...")}
            className="w-full bg-slate-50 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Horizontally Contained Filter Tabs */}
      <div className="w-full min-w-0 overflow-x-auto pb-1.5">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer whitespace-nowrap ${
                activeFilterTab === tab.id
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{t(tab.labelKey, tab.fallback)}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeFilterTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.id === "ALL"
                  ? jobs.length
                  : tab.id === "ASSIGNED"
                  ? jobs.filter((j) => j.status === "ASSIGNED" || j.status === "REQUESTED" || j.status === "MATCHING").length
                  : tab.id === "ACCEPTED"
                  ? jobs.filter((j) => j.status === "ACCEPTED").length
                  : tab.id === "SCHEDULED"
                  ? jobs.filter((j) => j.status === "ACCEPTED" || j.status === "ASSIGNED" || j.status === "REQUESTED" || j.status === "MATCHING").length
                  : tab.id === "IN_PROGRESS"
                  ? jobs.filter((j) => j.status === "IN_PROGRESS" || j.status === "ON_THE_WAY" || j.status === "ARRIVED").length
                  : tab.id === "COMPLETED"
                  ? jobs.filter((j) => j.status === "COMPLETED").length
                  : tab.id === "CANCELLED"
                  ? jobs.filter((j) => j.status === "CANCELLED" || j.status === "REJECTED").length
                  : jobs.filter((j) => j.status === "COMPLETED" || j.status === "CANCELLED" || j.status === "REJECTED").length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 ? (
        <div className="py-14 text-center space-y-4">
          <HumanVisual
            role="electrician"
            size="md"
            animation="subtle"
            background="glow"
            className="mx-auto"
          />
          <div>
            <h4 className="text-base font-black text-slate-800">
              {t("jobs.no_jobs_title", "No Jobs in this Category")}
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {t(
                "jobs.no_jobs_desc",
                "Your field dispatch radio is online and active. Keep your status Online to receive immediate priority dispatches."
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full min-w-0">
          {/* DESKTOP TABLE VIEW (Screens >= 1200px / xl) */}
          <div className="hidden xl:block w-full min-w-0 overflow-x-auto">
            <table className="table-fixed min-w-[1020px] w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 w-[140px] truncate">{t("jobs.col_booking_id", "Booking ID")}</th>
                  <th className="py-3 px-3 w-[160px] truncate">{t("jobs.col_customer", "Customer")}</th>
                  <th className="py-3 px-3 w-[240px] truncate">{t("jobs.col_service", "Service & Requirement")}</th>
                  <th className="py-3 px-3 w-[200px] truncate">{t("jobs.col_location", "Location & Distance")}</th>
                  <th className="py-3 px-3 w-[100px] text-right truncate">{t("jobs.col_net_wage", "Net Wage")}</th>
                  <th className="py-3 px-3 w-[110px] text-center truncate">{t("jobs.col_status", "Status")}</th>
                  <th className="py-3 px-3 w-[280px] min-w-[280px] text-right truncate">{t("jobs.col_actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800 truncate">
                      {job.bookingNumber || "BK-VJA-2026"}
                      <span className="block text-[10px] text-slate-400 font-normal truncate">
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : t("common.today", "Today")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 truncate">
                      <span className="truncate block">{job.customerName || "Citizen Customer"}</span>
                      {job.customerPhone && (
                        <span className="block text-[10px] text-slate-400 font-normal truncate">
                          {job.customerPhone}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 truncate">
                      <span className="font-extrabold text-slate-800 block truncate">
                        {job.serviceCategory || "Trade Service"}
                      </span>
                      <p className="text-[11px] text-slate-500 truncate">
                        {job.requirementDescription || "Service dispatch"}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 truncate">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{job.serviceLocation?.address || "—"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-slate-900 text-sm truncate">
                      ₹{job.fairWageBreakdown?.workerEarning ?? 0}
                      <span className="block text-[9px] text-slate-400 font-normal truncate">
                        {t("jobs.direct_dbt", "Direct DBT")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center truncate">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap min-w-[280px]">
                      {renderActionButtons(job)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RESPONSIVE JOB CARDS (Screens < 1200px / xl:hidden) */}
          <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-3.5 min-w-0">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 min-w-0 transition shadow-2xs"
              >
                {/* Card Top Row: ID, Time, Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 min-w-0 gap-2">
                  <div className="min-w-0">
                    <span className="font-mono font-bold text-xs text-slate-800 block truncate">
                      #{job.bookingNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : t("common.today", "Today")}
                      </span>
                    </span>
                  </div>
                  {getStatusBadge(job.status)}
                </div>

                {/* Service & Customer Details */}
                <div className="space-y-1.5 min-w-0 text-xs">
                  <h4 className="font-black text-slate-900 text-sm truncate">
                    {job.serviceCategory || "Trade Service"}
                  </h4>
                  <p className="text-slate-500 line-clamp-2 text-[11px]">
                    {job.requirementDescription || "Standard service request"}
                  </p>

                  <div className="pt-1 text-[11px] space-y-0.5 text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-slate-800">
                        {job.customerName || "Citizen Customer"}
                      </span>
                      {job.customerPhone && (
                        <>
                          <span className="text-slate-400">&bull;</span>
                          <span className="text-slate-500">{job.customerPhone}</span>
                        </>
                      )}
                    </div>

                    {job.serviceLocation?.address && (
                      <div className="flex items-center gap-1 text-slate-500 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{job.serviceLocation.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Net Wage, Status & Actions */}
                <div className="pt-2 border-t border-slate-200/60 space-y-2.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        {t("jobs.col_net_wage", "Net Wage")}
                      </span>
                      <span className="font-black text-slate-900 text-base">
                        ₹{job.fairWageBreakdown?.workerEarning ?? 0}
                      </span>
                    </div>
                  </div>

                  <div className="w-full">
                    {renderActionButtons(job, true)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REJECTION CONFIRMATION MODAL */}
      {rejectingJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Decline Booking #{rejectingJob.bookingNumber}</h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectingJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to decline this job request for <strong>{rejectingJob.serviceCategory}</strong> from <strong>{rejectingJob.customerName}</strong>? This dispatch will be released back to the cooperative network.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Reason for declining (optional):
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                {["Workload conflict", "Out of service zone", "Special tools required", "Emergency personal issue"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRejectReason(r)}
                    className={`p-2 rounded-xl border text-left font-medium transition cursor-pointer ${
                      rejectReason === r
                        ? "bg-rose-50 border-rose-300 text-rose-800 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Or specify another reason..."
                className="w-full mt-2 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processingBookingId === rejectingJob._id}
                onClick={async () => {
                  const targetJob = rejectingJob;
                  const reason = rejectReason.trim() || "Declined by worker";
                  setRejectingJob(null);
                  await handleStatusUpdate(targetJob._id, "REJECTED", reason);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {processingBookingId === rejectingJob._id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Declining...</span>
                  </>
                ) : (
                  <span>Confirm Decline</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
