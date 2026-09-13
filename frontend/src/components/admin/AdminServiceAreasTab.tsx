import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Clock,
  Users,
  ShieldCheck,
  Globe,
  Radio,
  Trash2,
  X,
  Sparkles,
  RefreshCw,
  BellRing
} from "lucide-react";

export interface ServiceAreaRecord {
  _id: string;
  state: string;
  stateCode: string;
  district: string;
  city: string;
  pincodePrefixes: string[];
  pincodes: string[];
  location?: {
    type: string;
    coordinates: [number, number];
  };
  isActive: boolean;
  launchPhase: string;
  supportedServices?: string[];
  cooperativeName?: string;
  nearestHub?: string;
  slaMinutes: number;
  activeWorkersCount?: number;
}

export const AdminServiceAreasTab: React.FC = () => {
  const [areas, setAreas] = useState<ServiceAreaRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Summary Metrics
  const [metrics, setMetrics] = useState({
    total: 0,
    activeCount: 0,
    comingSoonCount: 0,
    totalPincodes: 0,
    totalCoveredUsers: 0
  });

  // Expand Pincode Modal State
  const [selectedAreaForExpand, setSelectedAreaForExpand] = useState<ServiceAreaRecord | null>(null);
  const [expandPincodesInput, setExpandPincodesInput] = useState<string>("");
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const [expandError, setExpandError] = useState<string | null>(null);
  const [expandSuccessMsg, setExpandSuccessMsg] = useState<string | null>(null);

  // Remove Pincode Confirmation State
  const [pincodeToRemove, setPincodeToRemove] = useState<{ areaId: string; pincode: string; cityName: string } | null>(null);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  // New Area Modal State
  const [isNewAreaModalOpen, setIsNewAreaModalOpen] = useState<boolean>(false);
  const [newAreaForm, setNewAreaForm] = useState({
    state: "Andhra Pradesh",
    stateCode: "AP",
    district: "",
    city: "",
    pincodePrefixes: "",
    pincodes: "",
    cooperativeName: "",
    nearestHub: "",
    slaMinutes: 15,
    lat: "16.5062",
    lon: "80.6480",
    isActive: true
  });
  const [isCreatingArea, setIsCreatingArea] = useState<boolean>(false);
  const [createAreaError, setCreateAreaError] = useState<string | null>(null);

  // Notification Banner
  const [actionNotice, setActionNotice] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchServiceAreas = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminServiceAreas();
      if (res && res.success && res.data) {
        setAreas(res.data.areas || []);
        setMetrics({
          total: res.data.total || 0,
          activeCount: res.data.activeCount || 0,
          comingSoonCount: res.data.comingSoonCount || 0,
          totalPincodes: res.data.totalPincodes || 0,
          totalCoveredUsers: res.data.totalCoveredUsers || 0
        });
      }
    } catch (err: any) {
      console.error("Failed to load service areas:", err);
      setActionNotice({ text: "Failed to load service areas from database.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  const handleToggleStatus = async (area: ServiceAreaRecord) => {
    try {
      const nextActive = !area.isActive;
      const res = await api.toggleServiceArea(area._id, nextActive);
      if (res && res.success) {
        setActionNotice({
          text: `Area ${area.city} is now ${nextActive ? "ACTIVE" : "SUSPENDED"}. ${res.notifiedCount || 0} registered user(s) notified.`,
          type: "success"
        });
        await fetchServiceAreas();
      } else {
        setActionNotice({ text: res?.message || "Failed to toggle service area.", type: "error" });
      }
    } catch (err: any) {
      setActionNotice({ text: err.message || "Failed to toggle status.", type: "error" });
    }
  };

  const handleOpenExpand = (area: ServiceAreaRecord) => {
    setSelectedAreaForExpand(area);
    setExpandPincodesInput("");
    setExpandError(null);
    setExpandSuccessMsg(null);
  };

  const handleConfirmExpand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAreaForExpand) return;

    const raw = expandPincodesInput.trim();
    if (!raw) {
      setExpandError("Please enter one or more 6-digit Indian PIN codes.");
      return;
    }

    const pins = raw
      .split(/[\s,]+/)
      .map((p) => p.replace(/\D/g, ""))
      .filter((p) => p.length === 6 && /^[1-9][0-9]{5}$/.test(p));

    if (pins.length === 0) {
      setExpandError("Please provide valid 6-digit Indian PIN code(s) (e.g. 520015, 520018).");
      return;
    }

    setIsExpanding(true);
    setExpandError(null);
    try {
      const res = await api.expandServiceArea(selectedAreaForExpand._id, pins);
      if (res && res.success) {
        setExpandSuccessMsg(res.message || `Successfully expanded with ${pins.join(", ")}.`);
        setActionNotice({ text: res.message, type: "success" });
        await fetchServiceAreas();
        setTimeout(() => {
          setSelectedAreaForExpand(null);
          setExpandSuccessMsg(null);
        }, 1200);
      } else {
        setExpandError(res?.message || "Failed to expand service area.");
      }
    } catch (err: any) {
      setExpandError(err.message || "Failed to expand service area.");
    } finally {
      setIsExpanding(false);
    }
  };

  const handleConfirmRemovePincode = async () => {
    if (!pincodeToRemove) return;
    setIsRemoving(true);
    try {
      const res = await api.removeServiceAreaPincode(pincodeToRemove.areaId, pincodeToRemove.pincode);
      if (res && res.success) {
        setActionNotice({
          text: `PIN ${pincodeToRemove.pincode} removed from ${pincodeToRemove.cityName}. ${res.data?.notifiedUsersCount || 0} user(s) notified of suspension.`,
          type: "success"
        });
        await fetchServiceAreas();
        setPincodeToRemove(null);
      } else {
        setActionNotice({ text: res?.message || "Failed to remove pincode.", type: "error" });
      }
    } catch (err: any) {
      setActionNotice({ text: err.message || "Failed to remove pincode.", type: "error" });
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCreateAreaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaForm.district.trim() || !newAreaForm.city.trim()) {
      setCreateAreaError("District and City are required.");
      return;
    }

    const prefixes = newAreaForm.pincodePrefixes
      .split(/[\s,]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (prefixes.length === 0) {
      setCreateAreaError("At least one 3-digit pincode prefix (e.g. 520) is required.");
      return;
    }

    const specificPins = newAreaForm.pincodes
      .split(/[\s,]+/)
      .map((p) => p.replace(/\D/g, ""))
      .filter((p) => p.length === 6);

    setIsCreatingArea(true);
    setCreateAreaError(null);

    try {
      const payload = {
        state: newAreaForm.state,
        stateCode: newAreaForm.stateCode,
        district: newAreaForm.district.trim(),
        city: newAreaForm.city.trim(),
        pincodePrefixes: prefixes,
        pincodes: specificPins,
        location: {
          type: "Point",
          coordinates: [parseFloat(newAreaForm.lon) || 80.648, parseFloat(newAreaForm.lat) || 16.5062]
        },
        cooperativeName: newAreaForm.cooperativeName.trim() || `${newAreaForm.city} Central Labour Cooperative Society`,
        nearestHub: newAreaForm.nearestHub.trim() || `${newAreaForm.city} Cooperative Kendra`,
        slaMinutes: Number(newAreaForm.slaMinutes) || 15,
        isActive: newAreaForm.isActive
      };

      const res = await api.createServiceArea(payload);
      if (res && res.success) {
        setActionNotice({ text: `Created service area for ${newAreaForm.city} successfully.`, type: "success" });
        setIsNewAreaModalOpen(false);
        setNewAreaForm({
          state: "Andhra Pradesh",
          stateCode: "AP",
          district: "",
          city: "",
          pincodePrefixes: "",
          pincodes: "",
          cooperativeName: "",
          nearestHub: "",
          slaMinutes: 15,
          lat: "16.5062",
          lon: "80.6480",
          isActive: true
        });
        await fetchServiceAreas();
      } else {
        setCreateAreaError(res?.message || "Failed to create service area.");
      }
    } catch (err: any) {
      setCreateAreaError(err.message || "Failed to create service area.");
    } finally {
      setIsCreatingArea(false);
    }
  };

  // Filter and search logic
  const filteredAreas = areas.filter((area) => {
    if (stateFilter !== "ALL" && area.stateCode !== stateFilter) return false;
    if (statusFilter === "ACTIVE" && !area.isActive) return false;
    if (statusFilter === "INACTIVE" && area.isActive) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesCity = area.city?.toLowerCase().includes(q);
    const matchesDistrict = area.district?.toLowerCase().includes(q);
    const matchesState = area.state?.toLowerCase().includes(q);
    const matchesPrefix = area.pincodePrefixes?.some((p) => p.includes(q));
    const matchesPin = area.pincodes?.some((p) => p.includes(q));

    return matchesCity || matchesDistrict || matchesState || matchesPrefix || matchesPin;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionNotice && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold animate-fadeIn shadow-sm ${
            actionNotice.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
              : "bg-rose-50 text-rose-900 border border-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{actionNotice.text}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & New Area Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Service Areas &amp; Pincode Command Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authoritative geographical dispatch boundaries. Expand coverage to new pincodes or suspend areas with instant automated user notices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchServiceAreas}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh from MongoDB"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsNewAreaModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Service Area</span>
          </button>
        </div>
      </div>

      {/* 5 KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Total Clusters</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{metrics.total}</div>
          <span className="text-[10px] text-blue-600 font-bold">Statewide Network</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Active Live Hubs</span>
          <div className="text-xl font-black text-emerald-600 mt-1">{metrics.activeCount}</div>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
            Dispatch Active
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Live Covered PINs</span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{metrics.totalPincodes}</div>
          <span className="text-[10px] text-indigo-600 font-bold">Authoritative PINs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Impacted Users in DB</span>
          <div className="text-xl font-black text-blue-600 mt-1">{metrics.totalCoveredUsers}</div>
          <span className="text-[10px] text-slate-500">In live covered zones</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Expanding Pipeline</span>
          <div className="text-xl font-black text-amber-600 mt-1">{metrics.comingSoonCount}</div>
          <span className="text-[10px] text-amber-700 font-bold">Phase 2 / Planned</span>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, district, state, or 6-digit pincode..."
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All States</option>
            <option value="AP">Andhra Pradesh (AP)</option>
            <option value="TG">Telangana (TG)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active (Live)</option>
            <option value="INACTIVE">Suspended / Planned</option>
          </select>
        </div>
      </div>

      {/* SERVICE AREAS GRID */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span>Synchronizing live coverage zones with MongoDB Atlas...</span>
        </div>
      ) : filteredAreas.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-2">
          <MapPin className="w-8 h-8 mx-auto text-slate-300" />
          <p className="font-bold text-slate-600 dark:text-slate-300">No service areas match your criteria.</p>
          <p>Try refining your search or add a new service area using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAreas.map((area) => {
            const hasPincodes = Array.isArray(area.pincodes) && area.pincodes.length > 0;
            return (
              <div
                key={area._id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border p-5 transition shadow-xs space-y-4 ${
                  area.isActive
                    ? "border-slate-200 dark:border-slate-800 hover:border-blue-300"
                    : "border-amber-200 dark:border-amber-900/50 bg-amber-50/20"
                }`}
              >
                {/* Header Row: City, State Badge, Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{area.city}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold">
                        {area.stateCode}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">({area.district})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{area.cooperativeName || "Regional Labour Cooperative Society"}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        area.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${area.isActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                      {area.isActive ? "Active" : "Suspended"}
                    </span>
                  </div>
                </div>

                {/* Metrics Badges: SLA & Prefixes */}
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{area.slaMinutes || 15}m Dispatch SLA</span>
                  </div>

                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Prefix: {area.pincodePrefixes?.join(", ") || "—"}</span>
                  </div>

                  {area.activeWorkersCount !== undefined && area.activeWorkersCount > 0 && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{area.activeWorkersCount} Active Artisans</span>
                    </div>
                  )}
                </div>

                {/* Live Pincodes Section */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>Covered 6-Digit PIN Codes</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">
                        {area.pincodes?.length || 0}
                      </span>
                    </span>

                    <button
                      onClick={() => handleOpenExpand(area)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Expand / Add PIN</span>
                    </button>
                  </div>

                  {/* Pincodes Tags */}
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {hasPincodes ? (
                      area.pincodes.map((pin) => (
                        <span
                          key={pin}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 group transition hover:border-rose-300"
                        >
                          <span>{pin}</span>
                          <button
                            type="button"
                            onClick={() => setPincodeToRemove({ areaId: area._id, pincode: pin, cityName: area.city })}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition cursor-pointer"
                            title={`Remove PIN ${pin} (will suspend service in this PIN)`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-amber-700 dark:text-amber-400 italic">
                        No specific pincodes configured. Click "+ Expand / Add PIN" to activate dispatch for specific locations.
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStatus(area)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                      area.isActive
                        ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}
                  >
                    {area.isActive ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Suspend Area</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Activate Area</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenExpand(area)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Expand Pincodes</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: EXPAND SERVICE AREA WITH NEW PINCODES
      ========================================================================== */}
      {selectedAreaForExpand && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Expand Coverage: {selectedAreaForExpand.city}
                  </h3>
                  <span className="text-xs text-slate-500">{selectedAreaForExpand.district}, {selectedAreaForExpand.state}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAreaForExpand(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5" />
                <span>Automatic User Notification &amp; Database Consistency</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                When you expand coverage with new 6-digit PIN codes, all existing and newly registered citizens and workers with those PINs will automatically receive a notification that COOPNEX cooperative dispatch is live in their area.
              </p>
            </div>

            <form onSubmit={handleConfirmExpand} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New 6-Digit PIN Codes (Comma or space separated) *
                </label>
                <input
                  type="text"
                  value={expandPincodesInput}
                  onChange={(e) => setExpandPincodesInput(e.target.value)}
                  placeholder="e.g. 520015, 520018, 520020"
                  className="w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  autoFocus
                />
                <span className="text-[10px] text-slate-400">Enter full 6-digit postal codes to add to this district hub.</span>
              </div>

              {expandError && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{expandError}</span>
                </div>
              )}

              {expandSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{expandSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAreaForExpand(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExpanding}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isExpanding && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isExpanding ? "Expanding & Notifying..." : "Confirm & Expand Coverage"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: REMOVE PINCODE CONFIRMATION
      ========================================================================== */}
      {pincodeToRemove && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Remove PIN {pincodeToRemove.pincode} from {pincodeToRemove.cityName}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Removing this PIN code will mark COOPNEX services as <strong>unavailable / suspended</strong> in this location. All customers and workers in the database located in PIN {pincodeToRemove.pincode} will be sent an automated notification informing them that local dispatch is paused.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPincodeToRemove(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemovePincode}
                disabled={isRemoving}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isRemoving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isRemoving ? "Removing & Notifying..." : "Remove PIN & Notify Users"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD NEW SERVICE AREA
      ========================================================================== */}
      {isNewAreaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Add New Service Area / District Hub
                </h3>
              </div>
              <button
                onClick={() => setIsNewAreaModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAreaSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">State *</label>
                  <select
                    value={newAreaForm.state}
                    onChange={(e) => {
                      const st = e.target.value;
                      setNewAreaForm((prev) => ({
                        ...prev,
                        state: st,
                        stateCode: st.includes("Telangana") ? "TG" : "AP"
                      }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">District *</label>
                  <input
                    type="text"
                    value={newAreaForm.district}
                    onChange={(e) => setNewAreaForm({ ...newAreaForm, district: e.target.value })}
                    placeholder="e.g. Krishna District"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">City / Cluster Name *</label>
                  <input
                    type="text"
                    value={newAreaForm.city}
                    onChange={(e) => setNewAreaForm({ ...newAreaForm, city: e.target.value })}
                    placeholder="e.g. Machilipatnam"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Pincode Prefixes (3-digit) *</label>
                  <input
                    type="text"
                    value={newAreaForm.pincodePrefixes}
                    onChange={(e) => setNewAreaForm({ ...newAreaForm, pincodePrefixes: e.target.value })}
                    placeholder="e.g. 521"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Initial Covered 6-Digit PIN Codes</label>
                <input
                  type="text"
                  value={newAreaForm.pincodes}
                  onChange={(e) => setNewAreaForm({ ...newAreaForm, pincodes: e.target.value })}
                  placeholder="e.g. 521001, 521002"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Affiliated Cooperative Society</label>
                <input
                  type="text"
                  value={newAreaForm.cooperativeName}
                  onChange={(e) => setNewAreaForm({ ...newAreaForm, cooperativeName: e.target.value })}
                  placeholder="e.g. Machilipatnam Port Labour Cooperative Society"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">SLA Minutes</label>
                  <input
                    type="number"
                    value={newAreaForm.slaMinutes}
                    onChange={(e) => setNewAreaForm({ ...newAreaForm, slaMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Latitude</label>
                  <input
                    type="text"
                    value={newAreaForm.lat}
                    onChange={(e) => setNewAreaForm({ ...newAreaForm, lat: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Longitude</label>
                  <input
                    type="text"
                    value={newAreaForm.lon}
                    onChange={(e) => setNewAreaForm({ ...newAreaForm, lon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              {createAreaError && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{createAreaError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAreaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingArea}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isCreatingArea && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isCreatingArea ? "Saving..." : "Create Service Area"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

