import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Booking } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  Phone,
  User,
  ArrowRight
} from "lucide-react";

interface WorkerScheduleTabProps {
  jobs: Booking[];
}

export const WorkerScheduleTab: React.FC<WorkerScheduleTabProps> = ({ jobs }) => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState<"today" | "tomorrow" | "week">("today");

  const todaySchedule = [
    {
      id: "s-1",
      time: "09:30 AM - 11:00 AM",
      customer: "Smt. Priya Sharma",
      phone: "+91 98480 22341",
      service: "MCB Breaker Replacement & Inspection",
      location: "Flat 402, Sri Sai Residency, Benz Circle",
      distance: "2.4 km",
      status: "COMPLETED",
      earning: 650
    },
    {
      id: "s-2",
      time: "01:30 PM - 03:00 PM",
      customer: "Sri K. Venkata Rao",
      phone: "+91 98480 33452",
      service: "Air Conditioner 16A Power Point Installation",
      location: "Plot 89, Gunadala Ring Road",
      distance: "1.8 km",
      status: "IN_PROGRESS",
      earning: 720
    },
    {
      id: "s-3",
      time: "04:30 PM - 05:30 PM",
      customer: "Sri T. Nageswara Rao",
      phone: "+91 97000 44563",
      service: "Ceiling Fan Regulator & Wiring Check",
      location: "Near Siddhartha Medical College, Gunadala",
      distance: "3.1 km",
      status: "SCHEDULED",
      earning: 450
    }
  ];

  const tomorrowSchedule = [
    {
      id: "s-4",
      time: "10:00 AM - 11:30 AM",
      customer: "Sri P. Suresh Kumar",
      phone: "+91 98480 55674",
      service: "Submersible Pump Starter Relay Repair",
      location: "Bhavanipuram Main Road",
      distance: "4.2 km",
      status: "SCHEDULED",
      earning: 850
    },
    {
      id: "s-5",
      time: "02:00 PM - 03:30 PM",
      customer: "Smt. L. Madhavi",
      phone: "+91 97000 12345",
      service: "Main Distribution Board Health Check",
      location: "Patamata High School Road",
      distance: "2.0 km",
      status: "SCHEDULED",
      earning: 600
    }
  ];

  const weekSchedule = [...todaySchedule, ...tomorrowSchedule];

  const activeList = selectedDay === "today" ? todaySchedule : selectedDay === "tomorrow" ? tomorrowSchedule : weekSchedule;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span>{t("worker_nav.schedule", "Schedule")}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Planned appointments and time slots coordinated through Andhra Pradesh Labour Cooperative.
          </p>
        </div>

        {/* Day Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedDay("today")}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              selectedDay === "today" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("common.today", "Today")}
          </button>
          <button
            type="button"
            onClick={() => setSelectedDay("tomorrow")}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              selectedDay === "tomorrow" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("common.tomorrow", "Tomorrow")}
          </button>
          <button
            type="button"
            onClick={() => setSelectedDay("week")}
            className={`px-4 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              selectedDay === "week" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("common.viewAll", "This Week")}
          </button>
        </div>
      </div>

      {/* Schedule Timeline with Framer Motion Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {activeList.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 text-center shrink-0">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span className="text-[11px] font-black block whitespace-nowrap">{item.time}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">{item.service}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-700">
                    Customer: {item.customer} &bull; <span className="font-mono text-slate-500">{item.phone}</span>
                  </p>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{item.location} ({item.distance})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Net Earning</span>
                  <span className="text-lg font-black text-emerald-600">₹{item.earning}</span>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${item.phone}`}
                    className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

