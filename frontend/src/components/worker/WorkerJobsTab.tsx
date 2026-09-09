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
  Calendar
} from "lucide-react";

interface WorkerJobsTabProps {
  jobs: Booking[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
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

  const filteredJobs = jobs.filter((job) => {
    if (activeFilterTab === "ASSIGNED") {
      if (job.status !== "ASSIGNED") return false;
    } else if (activeFilterTab === "ACCEPTED") {
      if (job.status !== "ACCEPTED") return false;
    } else if (activeFilterTab === "SCHEDULED") {
      if (job.status !== "ACCEPTED" && job.status !== "ASSIGNED") return false;
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
      if (job.status !== "CANCELLED") return false;
    } else if (activeFilterTab === "HISTORY") {
      if (job.status !== "COMPLETED" && job.status !== "CANCELLED") return false;
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
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  const renderActionButtons = (job: Booking, isMobile = false) => {
    if (job.status === "ASSIGNED") {
      return (
        <div className={`flex items-center ${isMobile ? "gap-2 w-full" : "justify-end gap-1.5"}`}>
          <button
            type="button"
            onClick={() => onUpdateStatus(job._id, "ACCEPTED")}
            className={`${
              isMobile ? "flex-1 justify-center" : ""
            } px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t("jobs.action_accept", "Accept")}</span>
          </button>
          <button
            type="button"
            onClick={() => onUpdateStatus(job._id, "CANCELLED")}
            className={`${
              isMobile ? "flex-1 justify-center" : ""
            } px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs transition cursor-pointer`}
          >
            {t("jobs.action_reject", "Reject")}
          </button>
        </div>
      );
    }

    if (job.status === "ACCEPTED") {
      return (
        <button
          type="button"
          onClick={() => onUpdateStatus(job._id, "IN_PROGRESS")}
          className={`${
            isMobile ? "w-full justify-center" : ""
          } px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{t("jobs.action_start", "Start Job")}</span>
        </button>
      );
    }

    if (job.status === "IN_PROGRESS" || job.status === "ARRIVED" || job.status === "ON_THE_WAY") {
      return (
        <button
          type="button"
          onClick={() => onOpenCompleteModal(job)}
          className={`${
            isMobile ? "w-full justify-center" : ""
          } px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>{t("jobs.action_complete_otp", "Complete (OTP)")}</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onSelectJobDetails(job)}
        className={`${
          isMobile ? "w-full justify-center" : ""
        } px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer`}
      >
        {t("jobs.action_inspect", "Inspect")}
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
    { id: "CANCELLED", labelKey: "jobs.cancelled", fallback: "Cancelled" },
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
              {t(tab.labelKey, tab.fallback)}
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
          <div className="hidden xl:block w-full min-w-0 overflow-hidden">
            <table className="table-fixed w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 w-[140px] truncate">{t("jobs.col_booking_id", "Booking ID")}</th>
                  <th className="py-3 px-3 w-[180px] truncate">{t("jobs.col_customer", "Customer")}</th>
                  <th className="py-3 px-3 w-[260px] truncate">{t("jobs.col_service", "Service & Requirement")}</th>
                  <th className="py-3 px-3 w-[220px] truncate">{t("jobs.col_location", "Location & Distance")}</th>
                  <th className="py-3 px-3 w-[110px] text-right truncate">{t("jobs.col_net_wage", "Net Wage")}</th>
                  <th className="py-3 px-3 w-[120px] text-center truncate">{t("jobs.col_status", "Status")}</th>
                  <th className="py-3 px-3 w-[150px] text-right truncate">{t("jobs.col_actions", "Actions")}</th>
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
                      <span className="block text-[10px] text-slate-400 font-normal truncate">
                        {job.customerPhone || "+91 98480 22341"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 truncate">
                      <span className="font-extrabold text-slate-800 block truncate">
                        {job.serviceCategory || "Electrical"}
                      </span>
                      <p className="text-[11px] text-slate-500 truncate">
                        {job.requirementDescription || "Standard maintenance"}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 truncate">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{job.serviceLocation?.address || "Benz Circle, Vijayawada"}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold ml-4">
                        2.4 km {t("jobs.away", "away")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-slate-900 text-sm truncate">
                      ₹{job.fairWageBreakdown?.workerEarning || 650}
                      <span className="block text-[9px] text-slate-400 font-normal truncate">
                        {t("jobs.direct_dbt", "Direct DBT")}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center truncate">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
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
                      #{job.bookingNumber || "BK-VJA-2026"}
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
                    {job.serviceCategory || "Electrical Repair"}
                  </h4>
                  <p className="text-slate-500 line-clamp-2 text-[11px]">
                    {job.requirementDescription || "General maintenance and inspection"}
                  </p>

                  <div className="pt-1 text-[11px] space-y-0.5 text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-slate-800">
                        {job.customerName || "Citizen Customer"}
                      </span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-500">{job.customerPhone || "+91 98480 22341"}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{job.serviceLocation?.address || "Benz Circle, Vijayawada"}</span>
                      <span className="font-bold text-emerald-700 shrink-0 ml-1">
                        (2.4 km)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Net Wage & Actions */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3 min-w-0">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {t("jobs.col_net_wage", "Net Wage")}
                    </span>
                    <span className="font-black text-slate-900 text-base">
                      ₹{job.fairWageBreakdown?.workerEarning || 650}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {renderActionButtons(job, true)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
