import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio,
  MapPin,
  CheckCircle2,
  Clock,
  Navigation,
  ShieldCheck,
  Zap,
  Power,
  Info,
  DollarSign,
  AlertCircle,
  Sparkles,
  ArrowRight,
  PhoneCall,
  UserCheck
} from "lucide-react";

interface JobPin {
  id: string;
  trade: string;
  title: string;
  customerName: string;
  address: string;
  distanceKm: number;
  guaranteedPay: number;
  timeEst: string;
  isEmergency?: boolean;
  avatarUrl: string;
  xPercent: number; // Position on stylized map canvas (0 - 100)
  yPercent: number;
}

const SAMPLE_JOBS: JobPin[] = [
  {
    id: "job-1",
    trade: "Plumbing",
    title: "Kitchen Sink Pipe Burst Repair",
    customerName: "Mrs. Sharma Residence",
    address: "Block B-4, Anand Vihar",
    distanceKm: 1.2,
    guaranteedPay: 650,
    timeEst: "45 mins",
    isEmergency: true,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    xPercent: 28,
    yPercent: 32
  },
  {
    id: "job-2",
    trade: "Electrical",
    title: "Main DB MCB Tripping & Rewiring",
    customerName: "Green Valley Apartments",
    address: "Tower 3, Sector 14",
    distanceKm: 2.8,
    guaranteedPay: 950,
    timeEst: "1.5 hours",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    xPercent: 78,
    yPercent: 26
  },
  {
    id: "job-3",
    trade: "Appliance",
    title: "Split AC Compressor Inspection",
    customerName: "Dr. K. Rao Clinic",
    address: "Main Market Road, Sector 8",
    distanceKm: 0.9,
    guaranteedPay: 800,
    timeEst: "1 hour",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    xPercent: 70,
    yPercent: 74
  },
  {
    id: "job-4",
    trade: "Carpentry",
    title: "Teak Door Hinge & Lock Fitting",
    customerName: "Pooja Hegde",
    address: "Villa 12, Sunrise Enclave",
    distanceKm: 3.6,
    guaranteedPay: 700,
    timeEst: "1 hour",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    xPercent: 22,
    yPercent: 80
  }
];

export const WorkerJobRadar3D: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<JobPin>(SAMPLE_JOBS[0]);
  const [acceptedJobId, setAcceptedJobId] = useState<string | null>(null);

  // Worker Coordinates on stylized map
  const workerX = 48;
  const workerY = 52;

  const handleAccept = (jobId: string) => {
    setAcceptedJobId(jobId);
    setTimeout(() => {
      setAcceptedJobId(null);
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider shadow-2xs">
          <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Local Proximity Job Radar</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Work in Your Neighborhood. <br className="hidden sm:inline" />
          Transparent Direct Dispatches.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Zero forced algorithm assignments. Set yourself online whenever you want work. Transparent prices, upfront distances, and verified neighbor profiles within 5 kilometers.
        </p>
      </div>

      {/* Main Grid: Map on Left (7 cols), Job Feed on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stylized Neighborhood Service Map (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[440px] sm:min-h-[500px] rounded-3xl bg-slate-50 border border-slate-200 shadow-xl overflow-hidden p-6 flex flex-col justify-between">
          {/* Subtle Map Grid / District Road Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-60" />

          {/* Radar Scanning Rings centered at worker */}
          <div
            className="absolute rounded-full border border-emerald-300/40 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping opacity-30"
            style={{
              left: `${workerX}%`,
              top: `${workerY}%`,
              width: "280px",
              height: "280px",
              animationDuration: "4s"
            }}
          />
          <div
            className="absolute rounded-full border border-dashed border-emerald-400/40 pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${workerX}%`,
              top: `${workerY}%`,
              width: "360px",
              height: "360px"
            }}
          />
          <div
            className="absolute rounded-full border border-emerald-200/40 pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${workerX}%`,
              top: `${workerY}%`,
              width: "180px",
              height: "180px"
            }}
          />

          {/* SVG Animated Route Line Connecting Worker to Selected Job */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#075E54" />
                <stop offset="100%" stopColor="#0b84f3" />
              </linearGradient>
            </defs>

            {/* Travel Path */}
            <line
              x1={`${workerX}%`}
              y1={`${workerY}%`}
              x2={`${selectedJob.xPercent}%`}
              y2={`${selectedJob.yPercent}%`}
              stroke="url(#routeGradient)"
              strokeWidth="3.5"
              strokeDasharray="6,4"
              className="transition-all duration-500"
            />

            {/* Animated Traveling Worker Pulse */}
            <circle r="5" fill="#0b84f3">
              <animateMotion
                path={`M${workerX * 5.2},${workerY * 4.6} L${selectedJob.xPercent * 5.2},${selectedJob.yPercent * 4.6}`}
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {/* Top Bar on Map: Worker Status & Distance Filter */}
          <div className="relative z-20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span className="text-xs font-bold text-slate-800">
                {isOnline ? "Online • Radar Active (5 km)" : "Offline"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition shadow-xs flex items-center gap-1.5 ${
                isOnline
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 border-slate-300"
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOnline ? "Go Offline" : "Go Online"}</span>
            </button>
          </div>

          {/* Center: Real Worker Marker (You) */}
          <div
            className="absolute z-20 flex flex-col items-center"
            style={{
              left: `${workerX}%`,
              top: `${workerY}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            <div className="relative group">
              <div className="w-12 h-12 rounded-full overflow-hidden border-3 border-[#075E54] shadow-xl bg-white">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80"
                  alt="You"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#075E54] text-white font-black text-[9px] uppercase tracking-wider shadow-md whitespace-nowrap">
                You • Sector 4
              </div>
            </div>
          </div>

          {/* 4 Neighborhood Customer Job Pins */}
          {SAMPLE_JOBS.map((job) => {
            const isSelected = selectedJob.id === job.id;

            return (
              <motion.div
                key={job.id}
                className="absolute z-20 cursor-pointer"
                style={{
                  left: `${job.xPercent}%`,
                  top: `${job.yPercent}%`,
                  transform: "translate(-50%, -50%)"
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedJob(job)}
              >
                <div className="relative flex flex-col items-center">
                  {/* Avatar Marker */}
                  <div
                    className={`relative w-11 h-11 rounded-2xl overflow-hidden p-0.5 transition-all duration-300 ${
                      isSelected
                        ? "ring-3 ring-blue-600 shadow-2xl scale-110"
                        : "border-2 border-white shadow-md opacity-90 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={job.avatarUrl}
                      alt={job.customerName}
                      className="w-full h-full object-cover rounded-xl"
                    />

                    {/* Small Emergency or Trade Badge */}
                    {job.isEmergency && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[9px] shadow-xs animate-bounce">
                        !
                      </div>
                    )}
                  </div>

                  {/* Guaranteed Wage Tag */}
                  <div
                    className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-black shadow-xs transition-all ${
                      isSelected
                        ? "bg-[#0b84f3] text-white"
                        : "bg-white text-slate-800 border border-slate-200"
                    }`}
                  >
                    ₹{job.guaranteedPay}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Map Bottom Bar: Selected Job Preview */}
          <div className="relative z-20 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0b84f3]">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{selectedJob.customerName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-blue-700 font-mono">{selectedJob.distanceKm} km away</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[240px] sm:max-w-xs">
                    {selectedJob.title} ({selectedJob.address})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAccept(selectedJob.id)}
                className="px-4 py-2 rounded-xl bg-[#0b84f3] hover:bg-[#0651a8] text-white text-xs font-black transition shadow-sm whitespace-nowrap cursor-pointer"
              >
                {acceptedJobId === selectedJob.id ? "Route Dispatched!" : "Accept Dispatch"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Job Dispatches Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live Neighborhood Dispatches (4 nearby)
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              0% Commission
            </span>
          </div>

          {/* Staggered Job Cards */}
          <div className="space-y-3">
            {SAMPLE_JOBS.map((job) => {
              const isSelected = selectedJob.id === job.id;
              const isAccepted = acceptedJobId === job.id;

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white border-blue-500 shadow-lg ring-2 ring-blue-400/20"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                        <img
                          src={job.avatarUrl}
                          alt={job.customerName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">
                            {job.title}
                          </h4>
                          {job.isEmergency && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                              SOS
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{job.customerName}</span>
                          <span>•</span>
                          <span>{job.distanceKm} km</span>
                          <span>•</span>
                          <span>{job.timeEst}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-slate-900 font-mono">
                        ₹{job.guaranteedPay}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600">
                        100% Take-Home
                      </div>
                    </div>
                  </div>

                  {/* Accept Action row */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="text-[11px] text-slate-500">
                        Address: <span className="font-semibold text-slate-700">{job.address}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(job.id);
                        }}
                        className={`px-4 py-1.5 rounded-xl font-black transition cursor-pointer ${
                          isAccepted
                            ? "bg-emerald-600 text-white"
                            : "bg-[#0b84f3] hover:bg-[#0651a8] text-white shadow-xs"
                        }`}
                      >
                        {isAccepted ? "✓ Dispatch Confirmed" : "Accept Dispatch"}
                      </button>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              All customer households are pre-verified through Aadhaar/Society. Full dispute mediation guaranteed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
