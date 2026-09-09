import React, { useState, useEffect } from "react";
import { X, MapPin, Search, RotateCcw, ArrowLeft, Building2, CheckCircle2, ChevronRight } from "lucide-react";
import { checkLocalPincode, PincodeCheckResult, ALL_SERVICES, getPanIndiaWorkers, INDIA_STATES_DATA } from "../data/indiaLocations";
import { apiService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { CartoonServiceAvailableAnimation } from "./animations/CartoonServiceAvailableAnimation";
import { CartoonServiceSoonAnimation } from "./animations/CartoonServiceSoonAnimation";

interface PincodeCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPincode?: string;
  initialService?: string;
  onSelectPincode?: (pin: string) => void;
}

export const PincodeCheckerModal: React.FC<PincodeCheckerModalProps> = ({
  isOpen,
  onClose,
  initialPincode = "",
  initialService = "",
  onSelectPincode
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"pincode" | "states">("pincode");
  const [pincode, setPincode] = useState(initialPincode);
  const [selectedService, setSelectedService] = useState(initialService);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PincodeCheckResult | null>(null);
  const [selectedStateIdx, setSelectedStateIdx] = useState<number>(0);
  const navigate = useNavigate();

  // If initialPincode changes and is 6 digits, auto-check
  useEffect(() => {
    if (initialPincode && initialPincode.length === 6) {
      setPincode(initialPincode);
      const res = checkLocalPincode(initialPincode, selectedService || undefined);
      setResult(res);
    }
  }, [initialPincode]);

  // Keyboard accessibility: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = pincode.replace(/\D/g, "").trim();
    if (!clean || clean.length !== 6) {
      const fallbackPin = clean.length >= 2 ? clean.padEnd(6, "0") : "520001";
      const localRes = checkLocalPincode(fallbackPin, selectedService || undefined);
      setResult(localRes);
      return;
    }

    setLoading(true);
    // Use high-precision local pincode match first
    const localRes = checkLocalPincode(clean, selectedService || undefined);

    try {
      const response = await apiService.checkPincodeAvailability(clean, selectedService || undefined);
      if (response && response.success && response.data) {
        const d = response.data;
        // If local database has specific city name (e.g. Kurnool / Karimnagar / Anantapur), preserve accuracy
        const city = (localRes.city && localRes.city !== "Local City" && !localRes.city.includes("Circle"))
          ? localRes.city
          : (d.city || localRes.city || "Local City");
        const district = localRes.district || d.district || `${city} District`;
        const state = localRes.state || d.state || "India";

        setResult({
          pincode: clean,
          isValidFormat: true,
          isCovered: true,
          activeCooperative: true,
          city,
          state,
          district,
          cooperativeName: `${city} Primary Labour Cooperative`,
          servicesAvailable: d.servicesAvailable || localRes.servicesAvailable || [
            "Electrician",
            "Plumber",
            "Carpenter",
            "Appliance Repair",
            "Painter",
            "House Cleaning"
          ],
          slaMinutes: d.slaMinutes || 16,
          nearestHub: `${city} Cooperative Seva Kendra`,
          message: `Cooperative Service Available in ${city}, ${state}! Verified cooperative artisans ready for immediate dispatch.`
        });
      } else {
        setResult(localRes);
      }
    } catch {
      setResult(localRes);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPin = (pin: string) => {
    setPincode(pin);
    const localRes = checkLocalPincode(pin, selectedService || undefined);
    setResult(localRes);
  };

  const handleBackToSearch = () => {
    setResult(null);
  };

  const handleBookNow = (serviceName?: string) => {
    onClose();
    if (onSelectPincode) {
      onSelectPincode(pincode || result?.pincode || "520001");
    }
    const s = serviceName || selectedService || "Electrician";
    const dirEl = document.getElementById("workers-directory");
    if (dirEl) {
      dirEl.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/app?pincode=${pincode || result?.pincode || "520001"}&service=${encodeURIComponent(s)}`);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pincode-modal-title"
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative my-6 text-slate-900 dark:text-slate-100 transition-colors"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-5 sm:p-7 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 text-blue-200 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>National Coverage Detection Engine</span>
          </div>
          <h3 id="pincode-modal-title" className="text-xl sm:text-2xl font-black font-display text-white">
            {t("pincode.modalTitle") || "Check Cooperative Service Availability"}
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 leading-relaxed">
            {t("pincode.modalSubtitle") || "Verify active primary labour societies and certified worker dispatch in your pincode across India."}
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("pincode");
                setResult(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "pincode"
                  ? "bg-white text-blue-900 shadow-sm"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Check by Pincode</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("states");
                setResult(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === "states"
                  ? "bg-white text-blue-900 shadow-sm"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Browse 28 States &amp; UTs</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-5">
          {/* WHEN RESULT IS ACTIVE: PROMINENT BACK ACTION AT THE TOP */}
          {result && (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-slate-800/90 p-3.5 rounded-2xl border border-blue-200 dark:border-slate-700 animate-fadeIn">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <div className="min-w-0 truncate">
                  <span className="text-xs font-bold text-slate-800 dark:text-white block truncate">
                    Area Detected: <span className="text-blue-600 dark:text-blue-400 font-black">{result.city}</span>, {result.state} ({result.pincode})
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    District: {result.district}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBackToSearch}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold border border-blue-200 dark:border-slate-600 transition flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Search Another PIN</span>
              </button>
            </div>
          )}

          {/* TAB 1: PINCODE INPUT SEARCH */}
          {activeTab === "pincode" && !result && (
            <div className="space-y-4">
              <form onSubmit={handleCheck} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Enter 6-Digit Indian PIN Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 518001 (Kurnool), 505001 (Karimnagar), 520001, 560001"
                      className="w-full pl-4 pr-28 py-3 text-sm font-semibold tracking-wider text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 transition placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={loading || pincode.length < 6}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{loading ? "Checking..." : "Detect Area"}</span>
                    </button>
                  </div>
                </div>

                {/* Optional Service Filter */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Filter by Skill Trade (Optional)
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-800"
                  >
                    <option value="">All Cooperative Services (10 Trades)</option>
                    {ALL_SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </form>

              {/* Quick Click Sample Pincodes */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                  Popular Certified Hubs (Click to test):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Kurnool", pin: "518001" },
                    { label: "Karimnagar", pin: "505001" },
                    { label: "Anantapur", pin: "515001" },
                    { label: "Vijayawada", pin: "520001" },
                    { label: "Hyderabad", pin: "500001" },
                    { label: "Warangal", pin: "506001" },
                    { label: "Bengaluru", pin: "560001" },
                    { label: "Chennai", pin: "600001" },
                    { label: "Mumbai", pin: "400001" },
                    { label: "New Delhi", pin: "110001" },
                    { label: "Kolkata", pin: "700001" },
                    { label: "Patna", pin: "800001" }
                  ].map((item) => (
                    <button
                      key={item.pin}
                      type="button"
                      onClick={() => handleQuickPin(item.pin)}
                      className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg transition font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      {item.label} ({item.pin})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BROWSE BY 28 STATES & DISTRICTS */}
          {activeTab === "states" && !result && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
                Select a State or Union Territory:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {INDIA_STATES_DATA.map((state, idx) => (
                  <button
                    key={state.code}
                    type="button"
                    onClick={() => setSelectedStateIdx(idx)}
                    className={`text-left p-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-between ${
                      selectedStateIdx === idx
                        ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate">{state.name}</span>
                    <span className="text-[10px] opacity-60 font-mono">{state.code}</span>
                  </button>
                ))}
              </div>

              {/* Districts & Hubs for Selected State */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-white block mb-2">
                  Active Cooperative Districts in {INDIA_STATES_DATA[selectedStateIdx]?.name}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                  {INDIA_STATES_DATA[selectedStateIdx]?.districts.map((dist) => {
                    const samplePin = (dist.pincodePrefixes[0] || "520") + "001";
                    return (
                      <button
                        key={dist.name}
                        type="button"
                        onClick={() => handleQuickPin(samplePin)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-700/80 text-left transition flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {dist.headquarters}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            PIN Prefix: {dist.pincodePrefixes.join(", ")}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                          100% Active
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC RESULTS DISPLAY & LIVE WORKERS */}
          {result && (
            <div className="animate-fadeIn space-y-4">
              <CartoonServiceAvailableAnimation
                pincode={result.pincode}
                city={result.city || "Your City"}
                state={result.state || "Your State"}
                district={result.district}
                cooperativeName={result.cooperativeName}
                slaMinutes={result.slaMinutes || 16}
                servicesAvailable={result.servicesAvailable}
                onBookNow={() => handleBookNow()}
              />

              {/* Live Verified Cooperative Workers Available for this Pincode */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Verified Cooperative Workers on Duty in {result.city}:</span>
                  </span>
                  <span className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold">
                    ⚡ ETA ~{result.slaMinutes || 16} mins
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {getPanIndiaWorkers(
                    result.city || "Local City",
                    result.district || `${result.city} District`,
                    result.state || "India",
                    result.pincode,
                    selectedService || "ALL"
                  )
                    .slice(0, 3)
                    .map((worker) => (
                      <div
                        key={worker._id}
                        className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between shadow-2xs hover:shadow-xs transition"
                      >
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <img
                              src={worker.avatarUrl}
                              alt={worker.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {worker.name}
                              </h5>
                              <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold truncate">
                                {worker.skills[0]}
                              </p>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                                {worker.societyName}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px]">
                            <span className="font-black text-slate-900 dark:text-white">
                              ₹{worker.baseHourlyRate}/hr
                            </span>
                            <span className="text-amber-500 font-bold">
                              ★ {worker.rating}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBookNow(worker.skills[0])}
                          className="mt-2.5 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Book Worker</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* BOTTOM ACTIONS: CHECK ANOTHER PINCODE & BOOK BUTTON */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBackToSearch}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Check Another PIN Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBookNow()}
                  className="w-full sm:w-auto btn-primary !py-2.5 !px-6 text-xs font-bold shadow-md cursor-pointer"
                >
                  <span>Explore All Workers in {result.city} →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
