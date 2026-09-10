import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, API_BASE } from "../services/api";
import { WorkerProfile, Booking } from "../types";
import { VerificationBadge } from "../components/VerificationBadge";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Search,
  Check,
  X,
  LogOut,
  HandHeart
} from "lucide-react";

export const SocietyAdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [bookings, setMyBookings] = useState<Booking[]>([]);
  const [selectedTab, setSelectedTab] = useState<"verification" | "workers" | "bookings">("verification");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const w = await api.getWorkers();
      setWorkers(w);
      const b = await api.getMyBookings();
      setMyBookings(b);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveVerification = async (workerId: string, targetLevel: number) => {
    try {
      const res = await fetch(`${API_BASE}/workers/${workerId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
        },
        body: JSON.stringify({
          level: targetLevel,
          status: "VERIFIED",
          notes: `Verified by Society Secretary on ${new Date().toLocaleDateString()}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Worker level elevated to Level ${targetLevel} successfully!`);
        setTimeout(() => setActionSuccess(null), 2500);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Society Portal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/society" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-amber-300 flex items-center justify-center font-bold">
                  <HandHeart className="w-4 h-4" />
                </div>
                <span className="font-display font-black text-base text-slate-900">
                  COOPNEX <span className="text-blue-600">SOCIETY CONSOLE</span>
                </span>
              </Link>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 hidden sm:inline">
                PACS-04 • Vijayawada
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-600 font-bold hidden sm:inline">
                {user?.name || "K. Satyanarayana"} (Secretary)
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/admin-portal");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 font-semibold transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
              Primary Labour Cooperative Administration
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">
              Vijayawada Central Labour Cooperative Society
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registration: <span className="font-mono font-semibold">VJA-LAB-COOP-104</span> • Affiliated with AP State Labour Co-op Federation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Society Active & Audited
            </span>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionSuccess && (
          <div className="p-3.5 bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Society KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Registered Members</span>
            <div className="text-2xl font-black text-slate-900 mt-1">186 Workers</div>
            <span className="text-[10px] text-blue-600 font-semibold">+14 this quarter</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Active On-Duty Today</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">142 Online</div>
            <span className="text-[10px] text-emerald-600 font-semibold">76.3% Availability Rate</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Verified (Level 3+)</span>
            <div className="text-2xl font-black text-blue-800 mt-1">158 Certified</div>
            <span className="text-[10px] text-blue-600 font-semibold">84.9% Trade Assessed</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400">Welfare Reserve Fund</span>
            <div className="text-2xl font-black text-amber-600 mt-1">₹4,20,000</div>
            <span className="text-[10px] text-amber-700 font-semibold">Liquid Health Corpus</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setSelectedTab("verification")}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition ${
              selectedTab === "verification"
                ? "bg-white text-blue-700 border-t-2 border-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Verification Queue (State & Trade Certifications)
          </button>
          <button
            onClick={() => setSelectedTab("workers")}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition ${
              selectedTab === "workers"
                ? "bg-white text-blue-700 border-t-2 border-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Society Worker Roster ({workers.length})
          </button>
        </div>

        {/* TAB: VERIFICATION QUEUE */}
        {selectedTab === "verification" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Pending Skill & State Council Verifications
                </h3>
                <p className="text-xs text-slate-500">
                  Admins inspect practical trade credentials and approve Tier 1 to 5 promotions.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {workers.slice(0, 6).map((w) => (
                <div
                  key={w._id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        w.avatarUrl ||
                        "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                      }
                      alt={w.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 text-sm">{w.name}</strong>
                        <VerificationBadge level={w.verificationLevel} size="sm" />
                      </div>
                      <p className="text-slate-500 text-[11px]">
                        ID: {w.workerIdNumber} • {w.skills.join(", ")} • {w.experienceYears} yrs on-field
                      </p>
                    </div>
                  </div>

                  {/* Actions to Elevate Verification */}
                  <div className="flex items-center gap-2">
                    {w.verificationLevel < 4 && (
                      <button
                        onClick={() => handleApproveVerification(w._id, 4)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Level 4 (NSDC Cert)</span>
                      </button>
                    )}
                    {w.verificationLevel === 4 && (
                      <button
                        onClick={() => handleApproveVerification(w._id, 5)}
                        className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Approve Level 5 (Master Craftsman)</span>
                      </button>
                    )}
                    {w.verificationLevel === 5 && (
                      <span className="text-purple-800 font-bold bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                        ✓ Master Level 5 Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: WORKER ROSTER */}
        {selectedTab === "workers" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-bold text-slate-900 uppercase">Affiliated Worker Roster</h3>
              <input
                type="text"
                placeholder="Filter by name or trade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl w-60 text-xs"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Worker</th>
                    <th className="p-3">Trade</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Jobs Done</th>
                    <th className="p-3">Lifetime Pay</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workers
                    .filter((w) => (searchTerm ? w.name.toLowerCase().includes(searchTerm.toLowerCase()) : true))
                    .map((w) => (
                      <tr key={w._id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{w.name}</td>
                        <td className="p-3 text-slate-600">{w.skills.join(", ")}</td>
                        <td className="p-3">
                          <VerificationBadge level={w.verificationLevel} size="sm" />
                        </td>
                        <td className="p-3 text-amber-600 font-bold">⭐ {w.rating}</td>
                        <td className="p-3">{w.jobsCompletedCount}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">
                          ₹{w.totalEarnings?.toLocaleString("en-IN") || "58,900"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              w.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {w.isAvailable ? "Online" : "Off-Duty"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

