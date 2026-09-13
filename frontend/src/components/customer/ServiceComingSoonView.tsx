import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { LeafletMap } from "../LeafletMap";
import {
  MapPin,
  Compass,
  Clock,
  Bell,
  CheckCircle2,
  Building2,
  Shield,
  Sparkles,
  ArrowRight,
  Send,
  HelpCircle,
  FileText,
  UserCheck
} from "lucide-react";

interface ServiceComingSoonViewProps {
  locality: {
    city: string;
    district: string;
    state: string;
    pincode: string;
    address?: string;
  };
  nearestHub?: string;
  nearestHubCoordinates?: [number, number]; // [lat, lon]
  userCoordinates?: [number, number]; // [lat, lon]
  onOpenLocationModal: () => void;
  onSwitchTab?: (tab: string) => void;
}

export const ServiceComingSoonView: React.FC<ServiceComingSoonViewProps> = ({
  locality,
  nearestHub = "Vijayawada Central Cooperative Hub",
  nearestHubCoordinates = [16.5062, 80.6480],
  userCoordinates = [16.5062, 80.6480],
  onOpenLocationModal,
  onSwitchTab
}) => {
  const { t } = useLanguage();
  const [isNotified, setIsNotified] = useState<boolean>(() => {
    return localStorage.getItem(`coopnex_launch_notified_${locality.pincode}`) === "true";
  });
  const [notifyInput, setNotifyInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleNotifySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsNotified(true);
      setIsSubmitting(false);
      localStorage.setItem(`coopnex_launch_notified_${locality.pincode}`, "true");
    }, 400);
  };

  const displayName = locality.city || locality.district || `Pincode ${locality.pincode}`;
  const displayDistrict = locality.district || locality.city || "District";
  const displayState = locality.state || "Andhra Pradesh / Telangana";

  return (
    <div className="space-y-6">
      {/* 1. Hero Emotional Notice Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-6 sm:p-8 shadow-xs"
      >
        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-orange-200/20 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/70 text-amber-900 text-xs font-semibold tracking-wide">
                <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
                <span>{t("coverage.expansionRouteTitle")}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t("coverage.comingSoonTitle")}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t("coverage.comingSoonSubtitle")}
              </p>
            </div>

            {/* Change Location Action Card */}
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs shrink-0 md:min-w-[280px]">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{t("coverage.detectedLocality")}</span>
              </div>

              <div className="text-base font-bold text-slate-900">
                {displayName}, {displayDistrict}
              </div>
              <div className="text-xs text-slate-500 mb-3">
                {displayState} • PIN: <span className="font-semibold text-slate-700">{locality.pincode}</span>
              </div>

              <button
                type="button"
                onClick={onOpenLocationModal}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{t("coverage.changeLocation")}</span>
              </button>
            </div>
          </div>

          {/* Emotional Operational Note & Launch Notification */}
          <div className="mt-6 pt-6 border-t border-amber-200/60 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t("coverage.operationalNote")}
              </p>
            </div>

            {/* Notification Subscription CTA */}
            <div className="lg:col-span-1">
              {isNotified ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t("coverage.notifyMeSuccess")}</span>
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={notifyInput}
                    onChange={(e) => setNotifyInput(e.target.value)}
                    placeholder="Phone or email (optional)"
                    className="flex-1 min-w-0 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "..." : t("coverage.notifyMe")}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Interactive Expansion Map & Operational Corridor */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>{t("coverage.expansionRouteTitle")}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualizing active cooperative corridors connecting your district with our operational regional hubs
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              {displayName} ({locality.pincode})
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-xs bg-teal-700 inline-block" />
              {nearestHub}
            </span>
          </div>
        </div>

        {/* Dynamic Leaflet Map focused on user locality with expansion polyline */}
        <LeafletMap
          center={userCoordinates}
          zoom={11}
          customerLocation={userCoordinates}
          customerLocationLabel={`${displayName} (${locality.pincode})`}
          status="COMING_SOON"
          nearestHubCoordinates={nearestHubCoordinates}
          nearestHubName={nearestHub}
          height="340px"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>0% Private Aggregator Cut • 100% Floor Wage Guaranteed to Artisans</span>
          </div>
          <span className="font-medium text-amber-700">
            Connecting through: {nearestHub}
          </span>
        </div>
      </div>

      {/* 3. Phased Rollout Roadmap & Transparent Cooperative Governance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">Phase 1 • Active</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Capital & Metropolitan Hubs</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fully active in Vijayawada, Hyderabad, Visakhapatnam, Guntur, Tirupati, Kurnool, Warangal, and Karimnagar with instant dispatch.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 tracking-wider uppercase">Phase 2 • In Progress</span>
            <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">District Cooperative Societies</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Registering local trade societies, conducting UIDAI biometric verification, and standardizing floor wages in {displayDistrict}.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Phase 3 • Upcoming</span>
            <Sparkles className="w-4 h-4 text-slate-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Live Citizen Dispatch</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instant booking, cashless escrow settlement, and statutory accidental welfare coverage go live across all municipal wards.
          </p>
        </div>
      </div>

      {/* 4. Functional Fallback Quick Links (Keep Dashboard Useful) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Need to inspect your citizen account?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Your bookings, profile preferences, messages, and cooperative tokens remain completely accessible.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onSwitchTab && (
            <>
              <button
                type="button"
                onClick={() => onSwitchTab("BOOKINGS")}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Bookings</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchTab("PROFILE")}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Citizen Profile</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Test Supported Pincode</span>
          </button>
        </div>
      </div>
    </div>
  );
};

