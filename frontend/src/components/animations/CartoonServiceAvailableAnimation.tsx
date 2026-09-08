import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Sparkles, Building2, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface ServiceAvailableAnimationProps {
  pincode: string;
  city: string;
  state: string;
  district?: string;
  cooperativeName?: string;
  slaMinutes?: number;
  servicesAvailable?: string[];
  onBookNow?: () => void;
  className?: string;
}

export const CartoonServiceAvailableAnimation: React.FC<ServiceAvailableAnimationProps> = ({
  pincode,
  city,
  state,
  district,
  cooperativeName,
  slaMinutes = 18,
  servicesAvailable = [],
  onBookNow,
  className = ""
}) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-white dark:to-slate-900 border-2 border-emerald-500/40 p-5 sm:p-7 shadow-xl shadow-emerald-600/10 ${className}`}
    >
      {/* Background Animated Radar Signal Waves */}
      <motion.div
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-emerald-500/30 pointer-events-none -z-10"
      />
      <motion.div
        animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-blue-500/20 pointer-events-none -z-10"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Cartoon Worker Thumbs-Up Mascot */}
        <div className="md:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center select-none">
            {/* Confetti Particles */}
            <motion.span
              animate={{ y: [-10, -22, -10], rotate: [0, 45, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute -top-1 left-2 text-lg"
            >
              ✨
            </motion.span>
            <motion.span
              animate={{ y: [-8, -20, -8], rotate: [0, -30, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: 0.4 }}
              className="absolute -top-2 right-4 text-xl"
            >
              🎉
            </motion.span>
            <motion.span
              animate={{ y: [6, 18, 6], rotate: [0, 40, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 0.8 }}
              className="absolute bottom-2 left-0 text-base"
            >
              ⭐
            </motion.span>

            {/* Happy Worker SVG Mascot with Thumbs Up */}
            <motion.svg
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xl"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Soft ground shadow */}
              <ellipse cx="80" cy="148" rx="46" ry="7" fill="#10B981" fillOpacity="0.18" />

              {/* Body / Technician Uniform in Royal Blue */}
              <path
                d="M48 136 C48 108, 60 98, 80 98 C100 98, 112 108, 112 136 Z"
                fill="#2563EB"
              />
              {/* White collar */}
              <path d="M72 98 L80 110 L88 98 Z" fill="#FFFFFF" />

              {/* Worker Toolbelt in Sunset Orange */}
              <rect x="52" y="124" width="56" height="8" rx="3" fill="#FF6B00" />
              <rect x="74" y="122" width="12" height="12" rx="2" fill="#F59E0B" />

              {/* Worker Head */}
              <circle cx="80" cy="74" r="24" fill="#F8B179" />

              {/* Friendly Cartoon Eyes */}
              <circle cx="73" cy="72" r="3.2" fill="#0F172A" />
              <circle cx="87" cy="72" r="3.2" fill="#0F172A" />
              <circle cx="74" cy="70.5" r="1" fill="#FFFFFF" />
              <circle cx="88" cy="70.5" r="1" fill="#FFFFFF" />

              {/* Big Cheerful Smile */}
              <path
                d="M72 82 Q80 90 88 82"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Rosy Cheeks */}
              <circle cx="68" cy="77" r="3" fill="#FB7185" fillOpacity="0.5" />
              <circle cx="92" cy="77" r="3" fill="#FB7185" fillOpacity="0.5" />

              {/* Safety Hardhat (Yellow / Gold) */}
              <path
                d="M56 60 C56 42, 104 42, 104 60 Z"
                fill="#FBBF24"
              />
              <path d="M48 54 C48 51, 112 51, 112 54 L108 58 L52 58 Z" fill="#F59E0B" />
              {/* Helmet Flashlight / Badge */}
              <circle cx="80" cy="45" r="4.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />

              {/* Left Hand: Giving enthusiastic Thumbs Up */}
              <motion.g
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "42px 110px" }}
              >
                {/* Arm */}
                <path d="M50 108 C40 106, 32 100, 30 92" stroke="#2563EB" strokeWidth="9" strokeLinecap="round" />
                {/* Hand & Thumb */}
                <circle cx="30" cy="90" r="7" fill="#F8B179" />
                <path d="M30 90 L30 78 C30 76, 34 76, 34 78 L34 90" stroke="#F8B179" strokeWidth="5" strokeLinecap="round" />
              </motion.g>

              {/* Right Hand: Holding Certified Wrench / Tool */}
              <motion.g
                animate={{ rotate: [6, -6, 6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "118px 110px" }}
              >
                {/* Arm */}
                <path d="M110 108 C120 106, 128 100, 130 92" stroke="#2563EB" strokeWidth="9" strokeLinecap="round" />
                {/* Hand */}
                <circle cx="130" cy="90" r="7" fill="#F8B179" />
                {/* Silver Wrench */}
                <path d="M130 90 L138 72" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
                <circle cx="140" cy="68" r="4.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
              </motion.g>
            </motion.svg>
          </div>
          <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 px-3 py-0.5 rounded-full mt-1">
            ✓ 100% Certified Dispatch
          </span>
        </div>

        {/* Right: Coverage & Details Card */}
        <div className="md:col-span-8 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{t("pincode.serviceAvailableTitle") || "Service Available in Your Location!"}</span>
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              PIN: <strong className="font-mono text-slate-900 dark:text-white">{pincode}</strong>
            </span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{city}, {state}</span>
            </h3>
            {district && district !== city && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {district} • Active Cooperative Cluster
              </p>
            )}
          </div>

          {/* Key Trust Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t("pincode.activeCoop") || "Cooperative Branch"}</div>
                <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] truncate max-w-[200px]">
                  {cooperativeName || `${city} Central Primary Labour Society`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Dispatch</div>
                <div className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px]">
                  ⚡ Arrival in ~{slaMinutes} mins
                </div>
              </div>
            </div>
          </div>

          {/* Available Trades */}
          {servicesAvailable.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>{t("pincode.availableTrades") || "Available Certified Trades in this Hub:"}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {servicesAvailable.slice(0, 7).map((service) => (
                  <span
                    key={service}
                    className="text-[11px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs"
                  >
                    {service}
                  </span>
                ))}
                {servicesAvailable.length > 7 && (
                  <span className="text-[11px] text-slate-500 font-bold px-1.5 py-0.5">
                    +{servicesAvailable.length - 7} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={onBookNow}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{t("pincode.bookNow") || "Book Verified Worker Now"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

