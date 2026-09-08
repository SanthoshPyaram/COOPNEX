import React from "react";
import { CheckCircle2, Clock, MapPin, Wrench, ShieldCheck, Check } from "lucide-react";
import { BookingStatus } from "../types";

interface TimelineItem {
  status: BookingStatus;
  timestamp: string | Date;
  note?: string;
}

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  timeline: TimelineItem[];
}

const STEPS: { status: BookingStatus; label: string }[] = [
  { status: "REQUESTED", label: "Requested" },
  { status: "MATCHING", label: "AI Matching" },
  { status: "ASSIGNED", label: "Worker Assigned" },
  { status: "ACCEPTED", label: "Confirmed" },
  { status: "ON_THE_WAY", label: "On The Way" },
  { status: "ARRIVED", label: "Arrived" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "COMPLETED", label: "Completed" }
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, timeline }) => {
  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus);
  const effectiveIndex = currentIndex === -1 ? 2 : currentIndex;

  return (
    <div className="py-4">
      {/* Horizontal Progress Bar for Desktop */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between relative">
          {/* Background Track */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 z-0" />
          
          {/* Active Fill Track */}
          <div
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-teal-600 z-0 transition-all duration-500"
            style={{
              width: `${(effectiveIndex / (STEPS.length - 1)) * 92}%`
            }}
          />

          {STEPS.map((step, idx) => {
            const isDone = idx < effectiveIndex;
            const isCurrent = idx === effectiveIndex;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isDone
                      ? "bg-teal-700 text-white shadow-sm"
                      : isCurrent
                      ? "bg-amber-500 text-white ring-4 ring-amber-100 shadow-md scale-110 animate-pulse"
                      : "bg-white text-slate-400 border-2 border-slate-300"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`mt-2 text-[10px] font-semibold text-center max-w-[70px] leading-tight ${
                    isCurrent
                      ? "text-slate-900 font-bold"
                      : isDone
                      ? "text-teal-800"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical Timeline with timestamps & notes */}
      <div className="mt-6 space-y-3">
        {timeline.map((item, idx) => {
          const isLatest = idx === timeline.length - 1;
          const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl border transition ${
                isLatest
                  ? "bg-teal-50/60 border-teal-200 text-teal-950 shadow-xs"
                  : "bg-slate-50/70 border-slate-200 text-slate-700"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 ${
                  isLatest ? "bg-teal-600 text-white" : "bg-slate-300 text-slate-700"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {item.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeStr}
                  </span>
                </div>
                {item.note && (
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

