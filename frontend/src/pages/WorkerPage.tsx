import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Booking } from "../types";
import { VerificationBadge } from "../components/VerificationBadge";
import {
  Wallet,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Heart,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Phone,
  ArrowUpRight,
  HelpCircle,
  FileCheck,
  LogOut,
  HandHeart,
  Radio,
  FileText,
  CreditCard,
  Building2,
  Check,
  Mail,
  QrCode,
  Video,
  Award,
  RotateCw,
  Printer,
  X,
  Droplet,
  Activity,
  Bell,
  Flame,
  Lock,
  Unlock,
  ShieldAlert,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { CartoonWorkerMascot } from "../components/animations/CartoonWorkerMascot";
import { HolographicArtisanCard3D } from "../components/3d/webgl/HolographicArtisanCard3D";
import { Soundbox3DViewer } from "../components/3d/webgl/Soundbox3DViewer";
import { WorkerSmartIdCard, WorkerIdCardData } from "../components/WorkerSmartIdCard";
import { WorkerTutorialVideo } from "../components/WorkerTutorialVideo";
import { WorkerBloodDonationHub } from "../components/animations/WorkerBloodDonationHub";


export const WorkerPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Worker Gatekeeper Accreditation Status (Under Review vs Verified)
  // Workers can only open and access the platform after approval
  const [workerStatus, setWorkerStatus] = useState<string>(() => {
    return localStorage.getItem("sahakari_worker_status") || "UNDER_REVIEW";
  });

  // Keep state synced with localStorage across tabs & window focus
  useEffect(() => {
    const syncStatus = () => {
      const saved = localStorage.getItem("sahakari_worker_status");
      if (saved && saved !== workerStatus) {
        setWorkerStatus(saved);
      }
    };
    window.addEventListener("storage", syncStatus);
    window.addEventListener("focus", syncStatus);
    return () => {
      window.removeEventListener("storage", syncStatus);
      window.removeEventListener("focus", syncStatus);
    };
  }, [workerStatus]);

  const handleSimulateApproval = () => {
    localStorage.setItem("sahakari_worker_status", "VERIFIED");
    localStorage.setItem("sahakari_worker_level", "4");
    localStorage.setItem("sahakari_worker_badge", "Cooperative Verified Level 4");
    setWorkerStatus("VERIFIED");
    setPayoutSuccessMsg("Official Level 4 Verified Worker Badge Awarded! Platform Access & Dispatches Unlocked.");
    setTimeout(() => setPayoutSuccessMsg(null), 5000);
  };

  const handleSimulateUnderReview = () => {
    localStorage.setItem("sahakari_worker_status", "UNDER_REVIEW");
    setWorkerStatus("UNDER_REVIEW");
  };

  const [activeJobs, setActiveJobs] = useState<Booking[]>([]);
  const [welfareData, setWelfareData] = useState<any | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [emergencyReady, setEmergencyReady] = useState(true);

  // Wallet & Payout State
  const [walletBalance, setWalletBalance] = useState(5500);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Claim Modal State
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimAmount, setClaimAmount] = useState(15000);
  const [claimIncident, setClaimIncident] = useState("Minor equipment accidental short during field maintenance");
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Metrics for Worker
  const todayEarnings = 650;
  const weeklyEarnings = 4200;
  const totalLifetimeEarnings = 68400;

  // Smart ID Card Modal State
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  const workerCardData: WorkerIdCardData = {
    employeeId: "SS-AP-2026-104",
    name: user?.name || "Raj Kumar",
    age: 32,
    gender: "Male",
    skills: ["Electrician (Level 4)", "Solar Pro", "Appliance Repair"],
    bloodGroup: "O+",
    languagesKnown: ["Telugu", "Hindi", "English"],
    district: "Vijayawada",
    societyName: "Vijayawada Central Labour Co-op Society (PLCS-04)",
    photoUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    signatureText: user?.name || "Raj Kumar",
    issueDate: "10/04/2023",
    validUntil: "09/04/2028",
    nsqfLevel: "NSQF Level-4 Master Electrician",
    emergencyContact: "+91 98765 43210",
    policeVerificationStatus: "Clear Record (Gunadala Precinct)",
    aadhaarVerhoeffStatus: "Verhoeff Valid (D5 Polynomial Match)"
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await api.getMyBookings();
        setActiveJobs(bookings);
        const wel = await api.getWelfareOverview();
        if (wel.success) setWelfareData(wel);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, nextStatus: string) => {
    try {
      await api.updateBookingStatus(bookingId, nextStatus, `Worker updated status to ${nextStatus}`);
      const updated = await api.getMyBookings();
      setActiveJobs(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInstantPayout = () => {
    if (walletBalance <= 0) return;
    const amount = walletBalance;
    setWalletBalance(0);
    setPayoutSuccessMsg(`₹${amount.toLocaleString("en-IN")} transferred instantly to your Andhra Pragathi Grameena Bank Account via IMPS/DBT.`);
    setTimeout(() => {
      setPayoutSuccessMsg(null);
    }, 4500);
  };

  const handleClaimSubmit = async () => {
    try {
      const res = await fetch("/api/welfare/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("sahakari_token") || ""}`
        },
        body: JSON.stringify({
          incidentDate: new Date().toISOString().split("T")[0],
          claimAmount,
          description: claimIncident
        })
      });
      const data = await res.json();
      if (data.success) {
        setClaimSuccess(true);
        setTimeout(() => {
          setClaimModalOpen(false);
          setClaimSuccess(false);
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const kycDocumentsList = [
    {
      type: "Aadhaar Card",
      id: "XXXX-XXXX-9021",
      issuer: "UIDAI e-KYC Biometric",
      status: "Verified",
      fraudScore: "0% Tamper Risk",
      date: "10 Apr 2023"
    },
    {
      type: "PAN Card",
      id: "ABCDE1234F",
      issuer: "Income Tax Department (NSDL)",
      status: "Verified",
      fraudScore: "0% Tamper Risk",
      date: "10 Apr 2023"
    },
    {
      type: "Police Clearance (PCC)",
      id: "PCC-VJA-2023-0881",
      issuer: "Gunadala Police Precinct",
      status: "Verified",
      fraudScore: "Clean Record",
      date: "12 Apr 2023"
    },
    {
      type: "Trade Certification",
      id: "NSDC-AP-EL-9082",
      issuer: "State Skill Development Mission (NSDC)",
      status: "Level 4 Certified",
      fraudScore: "Accredited",
      date: "20 Aug 2023"
    },
    {
      type: "Bank Passbook",
      id: "APGB-0021-99821",
      issuer: "Andhra Pragathi Grameena Bank",
      status: "DBT Escrow Ready",
      fraudScore: "Active Account",
      date: "15 Apr 2023"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-8 font-sans">
      {/* Worker Portal Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/worker" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] text-[#F59E0B] flex items-center justify-center font-bold shadow-sm">
                  <HandHeart className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-display font-black text-base text-[#101828] leading-none block">
                    COOPNEX <span className="text-[#2563EB]">WORKER CONSOLE</span>
                  </span>
                  <span className="text-[9px] font-bold text-[#2563EB] uppercase tracking-widest">
                    Vijayawada Central Co-op (PLCS-04)
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-slate-600 font-bold">
                  {user?.name || "Raj Kumar"}
                </span>
                {workerStatus === "VERIFIED" ? (
                  <button
                    onClick={handleSimulateUnderReview}
                    title="Click to test locked 'Under Review' gatekeeper screen"
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Level 4 Verified</span>
                    <span className="text-[9px] text-slate-500 font-normal ml-0.5">(Demo: Lock)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSimulateApproval}
                    title="Click to simulate instant Admin approval"
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-bold hover:bg-amber-100 transition cursor-pointer flex items-center gap-1 shadow-2xs animate-pulse"
                  >
                    <Clock className="w-3 h-3 text-amber-700" />
                    <span>Under Statutory Review</span>
                    <span className="text-[9px] text-emerald-700 font-black ml-0.5">(Click: Approve)</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/login?role=worker");
                }}
                className="btn-pill-outline text-xs py-1 px-3 text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        {/* Payout Notification Toast */}
        {payoutSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-3 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{payoutSuccessMsg}</span>
          </div>
        )}

        {/* WORKER ACCESS GATEKEEPER (LOCKED UNTIL ADMIN POLICE PCC APPROVAL) */}
        {workerStatus !== "VERIFIED" ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Statutory Gatekeeper Alert Card */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-6 sm:p-7 rounded-3xl border-2 border-amber-300/80 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full border border-amber-300">
                        Statutory Gatekeeper Active
                      </span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      Application Under Police &amp; Registrar Review
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
                    <span>Scrutiny Stage 3 of 4</span>
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
                As per the Andhra Pradesh Cooperative Societies Act and National DPI safety guidelines, informal artisans cannot open or access public booking dispatches, customer in-home orders, or DBT Jan Dhan payouts until the <strong>District Registrar</strong> and <strong>Station House Officer</strong> inspect your police verification document and grant your official <strong>Verified Worker Level 4 Badge</strong>.
              </p>
            </div>

            {/* 4-Stage Accreditation Stepper */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Accreditation &amp; Platform Access Progress</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">Step 1</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Worker Registration</div>
                  <div className="text-[11px] text-slate-600">Level 4 Electrician trade profile &amp; phone OTP verified.</div>
                  <div className="text-[10px] font-bold text-emerald-700 pt-1">✓ Completed</div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">Step 2</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-bold text-slate-900 text-xs">Automated Aadhaar &amp; PAN</div>
                  <div className="text-[11px] text-slate-600">UIDAI Verhoeff checksum &amp; NSDL tax match auto-approved by system.</div>
                  <div className="text-[10px] font-bold text-emerald-700 pt-1">✓ System Verified</div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">Step 3</span>
                    <Clock className="w-4 h-4 text-amber-600 animate-spin-slow" />
                  </div>
                  <div className="font-bold text-amber-950 text-xs">Police Verification Review</div>
                  <div className="text-[11px] text-amber-900">Gunadala Precinct PCC #PCC-AP-VJA-2026-8941 being scrutinized by Admin.</div>
                  <div className="text-[10px] font-bold text-amber-800 pt-1 animate-pulse">⏳ In Progress</div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Step 4</span>
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="font-bold text-slate-700 text-xs">Verified Worker Badge</div>
                  <div className="text-[11px] text-slate-500">Unlocks job dispatches, emergency radar, and wallet access.</div>
                  <div className="text-[10px] font-bold text-slate-400 pt-1">🔒 Locked Until Approval</div>
                </div>
              </div>
            </div>

            {/* Submitted Police Clearance Document & ID Photo Verification Dossier Preview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Your Submitted Police Clearance Dossier on File</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    This official physical credential is being inspected by the National Registrar right now.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                  Doc Ref: PCC-AP-VJA-2026-8941
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 items-center">
                {/* Photo & Precinct Seal */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <img
                    src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                    alt="Raj Kumar Photo"
                    className="w-24 h-28 object-cover rounded-xl border-2 border-slate-800 shadow-md"
                  />
                  <span className="text-[10px] font-bold text-slate-700">Official ID Photo on Police Record</span>
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-rose-600 p-1 flex flex-col items-center justify-center text-center text-rose-700 bg-rose-50/50">
                    <span className="text-[6px] font-black uppercase font-mono">VIJAYAWADA POLICE</span>
                    <span className="text-[7px] font-black text-rose-800">★ SEAL ★</span>
                    <span className="text-[6px] font-bold font-mono">GUNADALA</span>
                  </div>
                </div>

                {/* Details */}
                <div className="sm:col-span-8 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Applicant</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">Raj Kumar (32 Yrs, Male)</div>
                      <div className="text-[11px] text-slate-600">Plot 14-B, Gunadala Ring Road, Vijayawada</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Police Precinct</div>
                      <div className="font-extrabold text-slate-900 mt-0.5">Gunadala Police Precinct</div>
                      <div className="text-[11px] text-slate-600">Inspector K. Prabhakar Rao (SHO)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong>CCTNS Crime Check:</strong> NO COGNIZABLE CRIMINAL RECORD FOUND. Background verified clean.
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                    <strong>Pending Action:</strong> Admin inspection of police verification document. Once verified, you will receive the Level 4 Badge and full portal access.
                  </div>
                </div>
              </div>
            </div>

            {/* SIH EVALUATOR SIMULATION & FAST-TRACK APPROVAL CONTROLS */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base sm:text-lg font-black text-white">
                      SIH Evaluator Simulation Controls
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Test the platform either by approving directly right here or by examining the dossier in the National Admin Portal:
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold self-start sm:self-auto">
                  Instant Demo Tools
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleSimulateApproval}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>⚡ Simulate Admin Approval (Award Badge &amp; Unlock Console)</span>
                </button>

                <Link
                  to="/admin"
                  className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-blue-300" />
                  <span>Inspect Dossier in Admin Portal</span>
                </Link>
              </div>
            </div>

            {/* Video Tutorial Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <WorkerTutorialVideo />
            </div>
          </div>
        ) : (
          /* WORKER APPROVED: FULL DASHBOARD CONSOLE */
          <>
            {/* Worker Hero Profile Strip */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
              alt="Raj Kumar"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#0B5D5A] shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-[#101828]">RAJ KUMAR</h1>
                <VerificationBadge level={4} size="md" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Worker ID: <span className="font-mono font-bold text-slate-700">SS-AP-2026-104</span> • Trade: <strong className="text-[#0B5D5A]">Electrician & Appliances</strong>
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 font-medium">
                <span className="text-[#E7A93B] font-bold">⭐ 4.9 (48 citizen reviews)</span>
                <span>•</span>
                <span>142 Jobs Completed</span>
                <span>•</span>
                <span className="text-[#166534] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> 85% Direct Wage Share
                </span>
              </div>

              {/* Verified Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#166534] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <Phone className="w-2.5 h-2.5 text-[#166534]" /> Phone Verified (OTP)
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0B5D5A] bg-[#EAF7F1] border border-[#0B5D5A]/20 px-2.5 py-0.5 rounded-full">
                  <Mail className="w-2.5 h-2.5 text-[#0B5D5A]" /> Email Verified
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#166534] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[#166534]" /> Police PCC Cleared
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <CartoonWorkerMascot gender="duo" size="sm" />
            </div>

            {/* Animated Radar Duty Toggles */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => setIsAvailable(!isAvailable)}
                className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                  isAvailable
                    ? "bg-[#166534] text-white shadow-sm"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {isAvailable ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                )}
                <span>{isAvailable ? "⚡ ON DUTY (Receiving Calls)" : "Off Duty (Paused)"}</span>
              </button>

              <button
                onClick={() => setEmergencyReady(!emergencyReady)}
                className={`px-3.5 py-2 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                  emergencyReady
                    ? "bg-[#D92D20] text-white shadow-xs"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                <span>🚨 24/7 Emergency Priority Pool</span>
              </button>

              <button
                onClick={() => setShowIdCardModal(true)}
                className="px-4 py-2 rounded-full font-black text-xs bg-gradient-to-r from-[#084644] via-[#0B5D5A] to-[#166534] text-white flex items-center gap-1.5 shadow-sm hover:opacity-95 transition cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                <span>My Smart ID Card (QR)</span>
              </button>
            </div>
          </div>
        </div>

        {/* WORKER ONBOARDING, SMART ID & SAFETY VIDEO GUIDE */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#0B5D5A]" />
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Worker Video Handbook &amp; Smart ID Instructions
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Interactive video curriculum: 5-Document KYC verification, Smart ID Card QR backside scanning, customer OTP handshake, and 0% cut UPI payouts.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#166534] font-mono text-xs font-bold border border-emerald-200 shrink-0">
              Mandatory Cooperative Orientation Video
            </span>
          </div>

          <WorkerTutorialVideo />
        </div>

        {/* 5-DOCUMENT KYC & ANTI-FRAUD STATUS CARD WITH CONSEQUENCES WARNING */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#166534]" />
                <h3 className="text-sm font-bold text-[#101828] uppercase tracking-wider">
                  Verified KYC Credentials & Legal Pre-Check
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                All 5 official documents cleared by District Cooperative Registrar & Cyber Anti-Fraud Engine
              </p>
            </div>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />
              <span>Anti-Fraud Score: 0% Tamper Risk (Cleared)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
            {kycDocumentsList.map((doc, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs truncate">{doc.type}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                </div>
                <div className="font-mono text-[11px] text-slate-700 font-semibold">{doc.id}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{doc.issuer}</div>
                <div className="pt-1.5 border-t border-emerald-100 text-[10px] text-[#166534] font-bold">
                  {doc.status} • {doc.date}
                </div>
              </div>
            ))}
          </div>

          {/* Statutory Notice: What happens if fake documents are submitted */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/90 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Mandatory Legal Compliance & Anti-Fraud Architecture:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              <strong>Before approval:</strong> All scans undergo real-time cryptographic checksum audits (UIDAI QR code verification, Income Tax PAN active verification, and CCTNS State Police Clearance lookup).
            </p>
            <p className="text-[11px] leading-relaxed text-rose-800">
              <strong>If fake or forged documents are submitted:</strong> Immediate permanent profile blacklisting across all 28 State Federations, non-bailable criminal prosecution under Section 468/471 IPC & Section 66D IT Act, and automated referral to District Cyber Police.
            </p>
          </div>
        </div>

        {/* Worker Wallet & Welfare Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Wallet & Today's Jobs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-[#084644] via-[#0B5D5A] to-[#166534] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#E7A93B]" />
                  <span className="text-xs uppercase font-bold text-[#EAF7F1] tracking-wider">
                    Direct Escrow Worker Wallet
                  </span>
                </div>
                <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-[#EAF7F1] font-bold">
                  0% Intermediary Deductions
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-[#E7A93B] tracking-tight">
                    ₹{walletBalance.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-[#EAF7F1]/80 mt-1">Available for Instant Payout</div>
                </div>

                <button
                  onClick={handleInstantPayout}
                  disabled={walletBalance <= 0}
                  className="btn-secondary !min-h-[42px] text-xs py-2 px-5 shrink-0"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Withdraw to Bank Account</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/20 text-xs">
                <div>
                  <span className="text-[10px] text-[#EAF7F1]/80 block">Today's Pay:</span>
                  <strong className="text-white text-sm">₹{todayEarnings}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#EAF7F1]/80 block">This Week:</span>
                  <strong className="text-white text-sm">₹{weeklyEarnings.toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#EAF7F1]/80 block">Lifetime Earnings:</span>
                  <strong className="text-[#E7A93B] text-sm">₹{totalLifetimeEarnings.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            {/* Active Dispatched Jobs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span>Today's Dispatched Calls</span>
                <span className="text-xs font-normal text-slate-500">Live Status Stepper</span>
              </h3>

              {activeJobs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No active jobs right now. Keep your duty toggle on to receive instant citizen bookings!
                </div>
              ) : (
                activeJobs.slice(0, 3).map((job) => (
                  <div
                    key={job._id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{job.serviceCategory}</span>
                          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                            {job.bookingNumber}
                          </span>
                          {job.bookingType === "EMERGENCY" && (
                            <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                              🚨 EMERGENCY 7M SLA
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{job.requirementDescription}</p>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-indigo-700" />
                          <span>{job.serviceLocation?.address}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-emerald-700">
                          ₹{job.fairWageBreakdown?.workerEarning || 380}
                        </span>
                        <div className="text-[9px] text-slate-400">Direct Worker Take-Home</div>
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        Status: <span className="text-indigo-700 font-mono">{job.status}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {job.status === "ASSIGNED" && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, "ACCEPTED")}
                            className="btn-pill-primary text-xs py-1.5 px-4"
                          >
                            Accept Call
                          </button>
                        )}
                        {job.status === "ACCEPTED" && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, "ON_THE_WAY")}
                            className="btn-pill-primary text-xs py-1.5 px-4"
                          >
                            Start Navigation
                          </button>
                        )}
                        {job.status === "ON_THE_WAY" && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, "ARRIVED")}
                            className="btn-pill-accent text-xs py-1.5 px-4"
                          >
                            Mark Arrived at Door
                          </button>
                        )}
                        {job.status === "ARRIVED" && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, "IN_PROGRESS")}
                            className="btn-pill-primary text-xs py-1.5 px-4"
                          >
                            Verify Citizen OTP & Start Work
                          </button>
                        )}
                        {job.status === "IN_PROGRESS" && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, "COMPLETED")}
                            className="btn-pill-emerald text-xs py-1.5 px-4"
                          >
                            Complete & Credit Wallet
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Worker Welfare Center & Insurance (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Worker Welfare Center</span>
                </h3>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                  3 Active Schemes
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900">PM-JAY + Co-op Medical Shield</strong>
                    <span className="text-emerald-700 font-bold">✓ Active</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    ₹5,00,000 cashless secondary and tertiary hospitalisation for you and 4 family members.
                  </p>
                  <div className="text-[10px] text-slate-400 mt-2">Valid Until: 31 March 2027</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900">Toolkit Replacement Grant</strong>
                    <span className="text-emerald-700 font-bold">₹10,000 Available</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Subsidized modern toolkits provided by State Cooperative Federation.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setClaimModalOpen(true)}
                className="w-full btn-pill-outline text-xs"
              >
                File Emergency Welfare / Insurance Claim
              </button>
            </div>
          </div>
        </div>

        {/* WORKER BLOOD DONATION & ON-FIELD EMERGENCY LIFELINE (UNIQUE LIQUID WAVE VIAL ANIMATION) */}
        <WorkerBloodDonationHub
          initialBloodGroup={workerCardData.bloodGroup}
          workerName={workerCardData.name}
        />

        {/* OFFICIAL WORKER SMART ID CARD SECTION */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Official Cooperative Digital &amp; NFC Smart ID Card
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory cooperative identity with your photo, digital signature, employee ID, blood group, and tamper-proof backside QR code. Flip to view QR code or click scan to test credential audit.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#166534] font-mono text-xs font-bold shrink-0">
                0% Fraud • Verhoeff Cleared
              </span>
            </div>
          </div>

          <div className="py-2 flex justify-center">
            <WorkerSmartIdCard data={workerCardData} />
          </div>
        </div>

        {/* 3D DIGITAL ARTISAN WORKSPACE & HARDWARE TELEMETRY */}

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  3D Digital Artisan Equipment &amp; Biometric Credential
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Interactive WebGL 3D hardware: inspect your encrypted biometric ID card and test the cooperative voice soundbox.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold shrink-0">
              Hardware Linked • 0% Cut Escrow
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Model 1: Holographic Artisan ID Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Interactive 3D Holographic Identity Card
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  UIDAI Tamper-Proof
                </span>
              </div>
              <div className="h-[340px] rounded-xl overflow-hidden bg-slate-950/5">
                <HolographicArtisanCard3D
                  name={user?.name || "Rajesh Kumar"}
                  trade="Certified Electrician & Solar Pro"
                  society="Vijayawada Central Labour Co-op (AP-LCS-492)"
                  rating={4.9}
                />
              </div>
            </div>

            {/* 3D Model 2: Smart Cooperative Soundbox */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3D Smart Cooperative Soundbox
                </span>
                <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                  Direct Escrow Speaker
                </span>
              </div>
              <div className="h-[340px] rounded-xl overflow-hidden bg-slate-950/5">
                <Soundbox3DViewer
                  amount={walletBalance || 5500}
                  workerName={user?.name || "Rajesh Kumar"}
                  society="Vijayawada Central Labour Co-op"
                />
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Welfare Claim Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-black text-slate-900">File Cooperative Welfare Claim</h3>
            <p className="text-xs text-slate-500">Fast-tracked settlement directly to your cooperative passbook</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Claim Amount (INR)</label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Description</label>
                <textarea
                  rows={3}
                  value={claimIncident}
                  onChange={(e) => setClaimIncident(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              {claimSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center">
                  Claim registered! Case worker assigned within 24 hours.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setClaimModalOpen(false)}
                  className="flex-1 btn-pill-outline text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClaimSubmit}
                  className="flex-1 btn-pill-primary text-xs"
                >
                  Submit Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart ID Card Modal */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">Official Smart ID Card</h3>
              </div>
              <button
                onClick={() => setShowIdCardModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <WorkerSmartIdCard data={workerCardData} />

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowIdCardModal(false)}
                className="btn-secondary !min-h-[38px] text-xs py-1.5 px-6 cursor-pointer"
              >
                Close ID Card
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

