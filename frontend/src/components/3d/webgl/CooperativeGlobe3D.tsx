import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Radio,
  Sparkles,
  MapPin,
  Building2,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Clock,
  Award
} from "lucide-react";

interface DistrictHub {
  id: string;
  name: string;
  state: string;
  society: string;
  registrationNumber: string;
  artisans: number;
  completedJobs: string;
  onTimeSla: string;
  status: "Active Dispatch" | "High Demand";
  imageUrl: string;
  leadSteward: string;
  leadStewardPhoto: string;
  tradesAvailable: string[];
}

const HUBS: DistrictHub[] = [
  {
    id: "vijayawada",
    name: "Vijayawada Central Hub",
    state: "Andhra Pradesh",
    society: "Krishna District Labour Cooperative Society Ltd.",
    registrationNumber: "AP/KRI/LCS-2023/881",
    artisans: 1420,
    completedJobs: "38,400+",
    onTimeSla: "98.4%",
    status: "Active Dispatch",
    imageUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80",
    leadSteward: "Chandra Shekhar Rao",
    leadStewardPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    tradesAvailable: ["Electricians", "Plumbers", "Masons", "Carpenters"]
  },
  {
    id: "hyderabad",
    name: "Hyderabad Cyber Guild",
    state: "Telangana",
    society: "Telangana State Shramik Federation (Kukatpally)",
    registrationNumber: "TS/HYD/COOP-412",
    artisans: 2150,
    completedJobs: "62,100+",
    onTimeSla: "99.1%",
    status: "Active Dispatch",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
    leadSteward: "K. Venkat Reddy",
    leadStewardPhoto: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&q=80",
    tradesAvailable: ["Appliance Techs", "Electricians", "Cleaners", "Painters"]
  },
  {
    id: "bengaluru",
    name: "Bengaluru South Union",
    state: "Karnataka",
    society: "Karnataka Labour Welfare Society (Jayanagar)",
    registrationNumber: "KA/BNG/SOC-904",
    artisans: 1890,
    completedJobs: "45,800+",
    onTimeSla: "98.8%",
    status: "High Demand",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
    leadSteward: "Manjunath Gowda",
    leadStewardPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    tradesAvailable: ["EV Drivers", "Carpenters", "Solar Techs", "Plumbers"]
  },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam Port Guild",
    state: "Andhra Pradesh",
    society: "Coastal Andhra Industrial Artisans Guild",
    registrationNumber: "AP/VSP/IND-102",
    artisans: 980,
    completedJobs: "24,300+",
    onTimeSla: "97.9%",
    status: "Active Dispatch",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    leadSteward: "P. Satyanarayana",
    leadStewardPhoto: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&q=80",
    tradesAvailable: ["Welders", "Heavy Plumbers", "Electricians", "Painters"]
  },
  {
    id: "chennai",
    name: "Chennai Central Guild",
    state: "Tamil Nadu",
    society: "Tamil Nadu Shramik Progressive Union (Anna Nagar)",
    registrationNumber: "TN/CHN/GUILD-552",
    artisans: 1340,
    completedJobs: "39,000+",
    onTimeSla: "98.6%",
    status: "Active Dispatch",
    imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80",
    leadSteward: "S. Balasubramanian",
    leadStewardPhoto: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=200&q=80",
    tradesAvailable: ["AC Inverter Techs", "Carpenters", "Caregivers", "Plumbers"]
  },
  {
    id: "mumbai",
    name: "Mumbai Labour Guild",
    state: "Maharashtra",
    society: "Greater Mumbai Shramik Cooperative Federation",
    registrationNumber: "MH/BOM/FED-1120",
    artisans: 3200,
    completedJobs: "91,200+",
    onTimeSla: "99.3%",
    status: "High Demand",
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80",
    leadSteward: "Sanjay Deshmukh",
    leadStewardPhoto: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&q=80",
    tradesAvailable: ["Electricians", "Deep Cleaning", "Painters", "Drivers"]
  }
];

export const CooperativeGlobe3D: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto-sliding every 5 seconds
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HUBS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeHub = HUBS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HUBS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HUBS.length) % HUBS.length);
  };

  return (
    <div className={`w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden ${className}`}>
      {/* Header Bar */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50/60 via-white to-emerald-50/50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                National Cooperative Labour Grid
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#075E54] border border-emerald-200 text-[11px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{HUBS.length} District Federations</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Decentralized Primary Labour Societies (PLCS) with democratic 1-Worker 1-Vote governance.
            </p>
          </div>
        </div>

        {/* Play/Pause & Counter */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-mono text-slate-600">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-slate-500 hover:text-[#075E54] transition cursor-pointer p-0.5"
              title={isPlaying ? "Pause auto-slide" : "Resume auto-slide"}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <span className="font-bold text-[#075E54]">{currentIndex + 1}</span>
            <span className="text-slate-400">/</span>
            <span>{HUBS.length}</span>
          </div>

          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
            aria-label="Previous hub"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
            aria-label="Next hub"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hub Quick Selection Strip */}
      <div className="flex items-center gap-2 p-2 bg-slate-50/70 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {HUBS.map((hub, idx) => {
          const isSel = idx === currentIndex;
          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSel
                  ? "bg-[#075E54] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <MapPin className={`w-3 h-3 ${isSel ? "text-amber-300" : "text-slate-400"}`} />
              <span>{hub.name.split(" ")[0]}</span>
              <span className={`text-[10px] font-mono ${isSel ? "text-emerald-200" : "text-slate-400"}`}>
                ({hub.artisans})
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Hub Showcase Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left: Real Photo of District Society Office & Assembled Artisans */}
        <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] bg-slate-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHub.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <img
                src={activeHub.imageUrl}
                alt={activeHub.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Top Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#075E54] border border-emerald-300 text-xs font-bold shadow-md">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeHub.society}</span>
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-mono font-bold shadow-md">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{activeHub.status}</span>
            </span>
          </div>

          {/* Bottom Overlay on Image */}
          <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1">
            <span className="text-xs font-mono text-amber-300 font-bold">
              REG: {activeHub.registrationNumber}
            </span>
            <h3 className="text-2xl font-black drop-shadow-sm text-white">
              {activeHub.name}
            </h3>
            <p className="text-xs text-slate-200">
              State Jurisdiction: {activeHub.state} • Dedicated Tool Bank & Common Facility Center
            </p>
          </div>
        </div>

        {/* Right: Operational Telemetry & Lead Steward */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white via-slate-50/50 to-white">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                Federation Telemetry
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 mt-2">
                Cooperative Operating Metrics
              </h4>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Artisans</span>
                <span className="text-lg sm:text-xl font-black text-[#075E54] font-mono">
                  {activeHub.artisans}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Fulfilled</span>
                <span className="text-lg sm:text-xl font-black text-blue-600 font-mono">
                  {activeHub.completedJobs}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">SLA Rate</span>
                <span className="text-lg sm:text-xl font-black text-emerald-600 font-mono">
                  {activeHub.onTimeSla}
                </span>
              </div>
            </div>

            {/* Lead Steward Card with Photo */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 shadow-2xs">
              <img
                src={activeHub.leadStewardPhoto}
                alt={activeHub.leadSteward}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {activeHub.leadSteward}
                  </h5>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Elected District Steward & Dispute Mediator
                </p>
                <span className="text-[10px] font-mono text-blue-600">
                  Certified Ombudsman • 1 Worker = 1 Vote
                </span>
              </div>
            </div>

            {/* Trades Available */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Active Society Rosters:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeHub.tradesAvailable.map((trade) => (
                  <span
                    key={trade}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs font-medium text-emerald-800"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{trade}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500">
              State Labour Dept Affiliated
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[#075E54] hover:bg-[#064e46] text-white font-bold text-xs shadow-md shadow-[#075E54]/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Next Society Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CooperativeGlobe3D;
