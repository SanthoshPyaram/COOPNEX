import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { HeatmapZone, WorkforceExchangeProposal } from "../types";
import { LeafletMap } from "../components/LeafletMap";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend
} from "recharts";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Users,
  MapPin,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shield,
  Activity,
  Check,
  LogOut,
  HandHeart
} from "lucide-react";

export const FederationPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [intelData, setIntelData] = useState<any | null>(null);
  const [zones, setZones] = useState<HeatmapZone[]>([]);
  const [exchanges, setExchanges] = useState<WorkforceExchangeProposal[]>([]);
  const [forecastData, setForecastData] = useState<any | null>(null);
  const [skillGapData, setSkillGapData] = useState<any | null>(null);
  const [selectedZone, setSelectedZone] = useState<HeatmapZone | null>(null);
  const [exchangeApproved, setExchangeApproved] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const intel = await api.getFederationIntelligence();
        if (intel.success) setIntelData(intel.data);

        const hm = await api.getDemandHeatmap();
        if (hm.success) setZones(hm.zones);

        const exc = await api.getWorkforceExchanges();
        if (exc.success) setExchanges(exc.exchanges);

        const fc = await api.getAiForecast("Electrician", "Vijayawada", 7);
        if (fc.success) setForecastData(fc.data);

        const sg = await api.getSkillGap("Vijayawada");
        if (sg.success) setSkillGapData(sg.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleApproveExchange = async (exchangeCode: string) => {
    try {
      const res = await api.approveWorkforceExchange(exchangeCode);
      if (res.success) {
        setExchangeApproved(`✓ Exchange ${exchangeCode} Approved! 6 Plumbers reallocated to Vijayawada Central.`);
        const updated = await api.getWorkforceExchanges();
        if (updated.success) setExchanges(updated.exchanges);
        setTimeout(() => setExchangeApproved(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Recharts formatted forecast series
  const forecastChartSeries =
    forecastData?.daily_forecasts?.map((d: any) => ({
      name: d.day_name.slice(0, 3),
      demand: d.predicted_demand,
      capacity: d.available_capacity,
      shortage: d.shortage
    })) || [
      { name: "Mon", demand: 28, capacity: 25, shortage: 3 },
      { name: "Tue", demand: 29, capacity: 25, shortage: 4 },
      { name: "Wed", demand: 31, capacity: 25, shortage: 6 },
      { name: "Thu", demand: 32, capacity: 25, shortage: 7 },
      { name: "Fri", demand: 36, capacity: 25, shortage: 11 },
      { name: "Sat", demand: 44, capacity: 25, shortage: 19 },
      { name: "Sun", demand: 42, capacity: 25, shortage: 17 }
    ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Federation Portal Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/federation" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-slate-950 flex items-center justify-center font-bold">
                  <HandHeart className="w-4 h-4" />
                </div>
                <span className="font-display font-black text-base text-white">
                  COOPNEX <span className="text-teal-400">FEDERATION COMMAND</span>
                </span>
              </Link>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800 hidden sm:inline">
                AP State Federation • Vijayawada Central
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-300 font-bold hidden sm:inline">
                {user?.name || "P. Venkat Rao"} (Director)
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/admin-portal");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-red-400 hover:bg-slate-800 font-semibold transition"
              >

                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Header Strip */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-3xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                State Federation Command Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              COOPERATIVE INTELLIGENCE CENTER
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              AP State Labour Cooperative Federation (APSLCF) • Real-time Workforce Demand & GIS Analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-teal-950 text-teal-300 border border-teal-600/40 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Scikit-Learn ML Engine Active
            </span>
          </div>
        </div>

        {/* Demand Surge Alert Banner (Section 31) */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border border-red-700/60 p-4 sm:p-5 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 text-amber-300 border border-red-500 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-300 bg-red-900/60 px-2 py-0.5 rounded border border-red-600">
                  ⚠️ DEMAND SURGE DETECTED
                </span>
                <span className="text-xs text-red-200 font-mono font-bold">+144% above normal baseline</span>
              </div>
              <p className="text-xs text-white mt-1 font-medium">
                Electrician requests in Vijayawada Sector 4 surged to 61/day (Baseline: 25/day).
                Recommendation: Trigger Workforce Exchange & activate 5 standby reserve electricians.
              </p>
            </div>
          </div>

          <button
            onClick={() => alert("Urgent mobile notification dispatched to 14 off-duty electricians in 5km radius.")}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-sm"
          >
            Activate Standby Workers
          </button>
        </div>

        {/* Approval Success Banner */}
        {exchangeApproved && (
          <div className="p-4 bg-emerald-800 text-emerald-100 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg border border-emerald-500 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>{exchangeApproved}</span>
          </div>
        )}

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Federated Workers</span>
            <div className="text-2xl font-black text-white mt-1">3,840</div>
            <span className="text-[10px] text-teal-400 font-semibold">14 Affiliated Societies</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Worker Take-Home Paid</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">₹34.82 Lakh</div>
            <span className="text-[10px] text-emerald-300 font-semibold">84.2% Take-home Ratio</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Customer Rating</span>
            <div className="text-2xl font-black text-amber-400 mt-1">4.88 / 5.0</div>
            <span className="text-[10px] text-slate-400">98.4% Positive Feedback</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Emergency Avg Dispatch</span>
            <div className="text-2xl font-black text-blue-400 mt-1">6.8 Minutes</div>
            <span className="text-[10px] text-blue-300 font-semibold">24/7 SLA Met: 99.1%</span>
          </div>
        </div>

        {/* Section: GIS Demand Heatmap & Zone Drilldown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map (8 cols) */}
          <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  GIS Demand Heatmap & Shortage Zones
                </h3>
                <p className="text-xs text-slate-400">
                  Click any zone circle to view real-time trade deficit and AI reallocation proposal.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Med
                </span>
                <span className="flex items-center gap-1 text-orange-400">
                  <span className="w-2 h-2 rounded-full bg-orange-500" /> High
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Critical
                </span>
              </div>
            </div>

            <LeafletMap
              center={[16.5062, 80.6480]}
              zoom={12}
              zones={zones}
              onZoneSelect={(z) => setSelectedZone(z)}
              height="380px"
            />
          </div>

          {/* Selected Zone Inspector Panel (4 cols) */}
          <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Zone Diagnostic Panel
            </h3>

            {selectedZone ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700">
                  <span className="text-[10px] text-teal-400 font-bold uppercase block">Selected Territory</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{selectedZone.zoneName}</h4>
                  <p className="text-slate-400 text-[11px]">{selectedZone.district} District</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Demand Volume:</span>
                    <strong className="text-white text-base">{selectedZone.demandVolume} req</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">Available Workers:</span>
                    <strong className="text-white text-base">{selectedZone.availableWorkers}</strong>
                  </div>
                </div>

                <div className="p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-200">
                  <span className="font-bold block">Labor Deficit / Shortage:</span>
                  <strong className="text-lg font-black text-red-400">
                    {selectedZone.shortage > 0 ? `-${selectedZone.shortage} Workers` : "Balanced"}
                  </strong>
                  <div className="text-[10px] text-slate-400 mt-1">Top Trade: {selectedZone.topService}</div>
                </div>

                <div className="p-3 bg-teal-950/60 border border-teal-700/50 rounded-xl text-teal-200 text-[11px]">
                  <strong className="text-amber-300 block mb-1">AI Recommendation:</strong>
                  {selectedZone.aiRecommendation}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Click any zone circle on the heatmap to view live workforce deficit diagnostics.
              </div>
            )}
          </div>
        </div>

        {/* Section: Cooperative Workforce Exchange (Section 27 Innovation) */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  COOPERATIVE WORKFORCE EXCHANGE (CROSS-SOCIETY BALANCING)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                When one society experiences surplus while a neighbor has a deficit, AI formulates temporary deployment vectors. Admin approval required.
              </p>
            </div>
            <span className="text-xs bg-teal-900 text-teal-300 px-3 py-1 rounded-full border border-teal-700 font-bold">
              Bipartite Optimization Solver
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {exchanges.map((exc) => (
              <div
                key={exc.exchangeCode}
                className="bg-slate-900 p-5 rounded-2xl border border-slate-700 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-amber-400 font-bold">{exc.exchangeCode}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      exc.status === "APPROVED"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                        : "bg-amber-950 text-amber-300 border border-amber-700"
                    }`}
                  >
                    {exc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Surplus Source:</span>
                    <strong className="text-white text-xs">{exc.sourceSocietyName}</strong>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      +{exc.estimatedSurplusCount || 8} Idle {exc.trade}s
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-teal-400 flex-shrink-0" />

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Deficit Target:</span>
                    <strong className="text-white text-xs">{exc.targetSocietyName}</strong>
                    <div className="text-[10px] text-red-400 font-semibold">
                      -{exc.estimatedShortageCount || 10} Deficit
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">{exc.aiRationale}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400">
                    Transit: {exc.distanceKm} km • Fuel Allowance: ₹{exc.dailyTravelAllowanceINR}/day
                  </div>

                  {exc.status !== "APPROVED" ? (
                    <button
                      onClick={() => handleApproveExchange(exc.exchangeCode)}
                      className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Allocation</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Deployed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: AI Demand Forecasting & Skill-Gap Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Demand Forecasting Chart (7 cols) */}
          <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-400" />
                  AI 7-Day Demand Forecasting (Scikit-Learn)
                </h3>
                <p className="text-xs text-slate-400">
                  GradientBoosting time-series regressor with weather and weekend weighting.
                </p>
              </div>
              <span className="text-xs text-amber-300 font-bold">88.5% Confidence</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastChartSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorShortage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    name="Predicted Demand"
                    stroke="#14b8a6"
                    fillOpacity={1}
                    fill="url(#colorDemand)"
                  />
                  <Area
                    type="monotone"
                    dataKey="shortage"
                    name="Projected Shortage"
                    stroke="#f43f5e"
                    fillOpacity={1}
                    fill="url(#colorShortage)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-300 flex items-center justify-between border border-slate-700">
              <span>{forecastData?.summary?.recommended_action || "Electrician demand expected to surge 29% this weekend."}</span>
              <span className="text-amber-400 font-bold">+29% Growth</span>
            </div>
          </div>

          {/* Future Skill-Gap Table (5 cols) */}
          <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Future Skill Deficit Projection (7 Days)
              </h3>
              <p className="text-xs text-slate-400">
                Identifies trades needing immediate training or cooperative recruitment.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              {skillGapData?.trades?.slice(0, 4).map((t: any) => (
                <div
                  key={t.trade}
                  className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <strong className="text-white text-xs block">{t.trade}</strong>
                    <span className="text-[10px] text-slate-400">
                      Roster: {t.current_workers} • Projected Need: {t.projected_daily_demand}/day
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        t.deficit > 0 ? "bg-red-950 text-red-400" : "bg-emerald-950 text-emerald-400"
                      }`}
                    >
                      {t.deficit > 0 ? `Deficit: -${t.deficit}` : "Adequate"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-teal-950 border border-teal-800 rounded-xl text-[11px] text-teal-200">
              <strong className="text-amber-300 block mb-1">State Skill Council Directive:</strong>
              Conduct 3-day certified fast-track training camp for 12 Caregivers and 14 Plumbers in Krishna/Guntur districts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

