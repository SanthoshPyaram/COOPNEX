import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AdminShell } from "../components/admin/AdminShell";
import { AdminDataTable, ColumnDef } from "../components/admin/AdminDataTable";
import { WorkerDetailDrawer } from "../components/admin/WorkerDetailDrawer";
import { AdminSecurityPinModal } from "../components/AdminSecurityPinModal";

// 3D Operational Visualizations
import { CooperativeNetwork3D } from "../components/admin/3d/CooperativeNetwork3D";
import { AdminCoverage3D, CITIES_9_COVERAGE } from "../components/admin/3d/AdminCoverage3D";
import { FraudNetwork3D } from "../components/admin/3d/FraudNetwork3D";
import { PaymentFlow3D } from "../components/admin/3d/PaymentFlow3D";
import { AiDemand3D } from "../components/admin/3d/AiDemand3D";
import { EmergencyDispatch3D } from "../components/admin/3d/EmergencyDispatch3D";
import { AdminResponsibilitiesShowcase } from "../components/admin/AdminResponsibilitiesShowcase";

import {
  Users,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Zap,
  Activity,
  AlertTriangle,
  TrendingUp,
  FileText,
  Building2,
  Lock,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Filter,
  Check,
  Phone,
  Server,
  Scale,
  Award,
  CalendarCheck,
  HeartHandshake,
  KeyRound,
  Shield,
  Smartphone,
  RotateCcw,
  Star,
  ExternalLink,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

// Animated Numeric Counter for Linear/Fintech feel
const AnimatedNumber: React.FC<{ value: number; prefix?: string; suffix?: string; duration?: number }> = ({
  value,
  prefix = "",
  suffix = "",
  duration = 750
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const steps = 25;
    const stepDuration = duration / steps;
    const increment = value / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

// Comprehensive Authenticated Worker Registry
const INITIAL_WORKFORCE_REGISTRY = [
  {
    _id: "WRK-KYC-001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@coopnex.worker.in",
    avatarUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    gender: "Male",
    age: 34,
    skills: ["Senior Electrician (Level 4)", "Solar Inverters", "Safety Earthing"],
    trade: "Electrical",
    societyName: "Vijayawada Central Labour Co-op (PLCS-04)",
    district: "Vijayawada (NTR)",
    verificationLevel: 4,
    verificationStatus: "VERIFIED",
    riskScore: "LOW",
    riskNum: 4,
    experienceYears: 8,
    totalJobs: 184,
    rating: 4.95,
    lifetimeEarnings: "₹2,14,500",
    welfareContribution: "₹4,290",
    createdAt: "2026-08-12 14:30",
    policeVerification: {
      certificateNumber: "PCC-AP-VJA-2026-8941",
      policeStation: "Gunadala Precinct, Vijayawada City Police",
      commissionerate: "Vijayawada Police Commissionerate",
      shoName: "Inspector K. Satyanarayana",
      crimeRecordStatus: "NO COGNIZABLE CRIMINAL RECORD FOUND",
      cctnsRecordCheck: "PASSED (Clean background)",
      issuedDate: "20 Aug 2026",
      validUntil: "19 Aug 2027",
      sealText: "COMMISSIONERATE OF POLICE • VIJAYAWADA"
    },
    kycDocuments: [
      { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-AP-VJA-2026-8941", verificationStatus: "VERIFIED", issuer: "Vijayawada Police" },
      { documentType: "Aadhaar Card", documentNumber: "XXXX-XXXX-8921", verificationStatus: "SYSTEM_VERIFIED", issuer: "UIDAI", systemCheckDetails: "UIDAI Verhoeff D5 Checksum Valid" },
      { documentType: "PAN Card", documentNumber: "ABCDE1234F", verificationStatus: "SYSTEM_VERIFIED", issuer: "NSDL", systemCheckDetails: "NSDL Active Match 100%" }
    ]
  },
  {
    _id: "WRK-KYC-002",
    name: "Lakshmi Narayana",
    phone: "+91 98765 43211",
    email: "lakshmi.plumber@coopnex.worker.in",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    gender: "Male",
    age: 38,
    skills: ["Master Plumber", "Conduit Repair", "Pipeline Diagnostics"],
    trade: "Plumbing",
    societyName: "Guntur East Labour Co-op",
    district: "Guntur Urban",
    verificationLevel: 4,
    verificationStatus: "VERIFIED",
    riskScore: "LOW",
    riskNum: 5,
    experienceYears: 11,
    totalJobs: 142,
    rating: 4.88,
    lifetimeEarnings: "₹1,68,400",
    welfareContribution: "₹3,368",
    createdAt: "2026-08-20 09:15",
    policeVerification: {
      certificateNumber: "PCC-AP-GNT-2026-4412",
      policeStation: "Arundelpet Precinct, Guntur Urban Police",
      commissionerate: "Guntur Urban Commissionerate",
      shoName: "Inspector M. Venkateswarlu",
      crimeRecordStatus: "NO COGNIZABLE CRIMINAL RECORD FOUND",
      cctnsRecordCheck: "PASSED (Clean)",
      issuedDate: "15 Aug 2026",
      validUntil: "14 Aug 2027",
      sealText: "GUNTUR URBAN POLICE • CCTNS VERIFIED"
    },
    kycDocuments: [
      { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-AP-GNT-2026-4412", verificationStatus: "VERIFIED", issuer: "Arundelpet Precinct" },
      { documentType: "Aadhaar Card", documentNumber: "XXXX-XXXX-4412", verificationStatus: "SYSTEM_VERIFIED", issuer: "UIDAI", systemCheckDetails: "UIDAI Verhoeff Checksum Valid" },
      { documentType: "PAN Card", documentNumber: "XYZPL9021K", verificationStatus: "SYSTEM_VERIFIED", issuer: "NSDL" }
    ]
  },
  {
    _id: "WRK-KYC-003",
    name: "Sunita Devi",
    phone: "+91 98490 88712",
    email: "sunita.devi@coopnex.worker.in",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    gender: "Female",
    age: 29,
    skills: ["Certified Caregiver", "Elder Care Specialist", "First Aid Pro"],
    trade: "Caregiving",
    societyName: "Auto Nagar Industrial & Domestic Society",
    district: "Vijayawada",
    verificationLevel: 1,
    verificationStatus: "UNDER_REVIEW",
    riskScore: "LOW",
    riskNum: 8,
    experienceYears: 5,
    totalJobs: 38,
    rating: 4.96,
    lifetimeEarnings: "₹52,000",
    welfareContribution: "₹1,040",
    createdAt: "2026-09-07 11:20",
    policeVerification: {
      certificateNumber: "PCC-AP-VJA-2026-3199",
      policeStation: "Machavaram Precinct, Vijayawada Police",
      commissionerate: "Vijayawada Police Commissionerate",
      shoName: "Inspector S. Kalyani",
      crimeRecordStatus: "NO COGNIZABLE CRIMINAL RECORD FOUND",
      cctnsRecordCheck: "PASSED (Clean background)",
      issuedDate: "28 Aug 2026",
      validUntil: "27 Aug 2027",
      sealText: "COMMISSIONERATE OF POLICE • VIJAYAWADA"
    },
    kycDocuments: [
      { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-AP-VJA-2026-3199", verificationStatus: "UNDER_REVIEW", issuer: "Machavaram Precinct" },
      { documentType: "Aadhaar Card", documentNumber: "XXXX-XXXX-3199", verificationStatus: "SYSTEM_VERIFIED", issuer: "UIDAI" }
    ]
  },
  {
    _id: "WRK-KYC-004",
    name: "Vikram R. (Tampered Submission)",
    phone: "+91 99001 00990",
    email: "suspect.applicant@tempmail.in",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    gender: "Male",
    age: 26,
    skills: ["General Appliance Maintenance"],
    trade: "Appliance",
    societyName: "Unregistered Hub",
    district: "Hyderabad Central",
    verificationLevel: 1,
    verificationStatus: "SUSPECTED_FAKE",
    riskScore: "CRITICAL",
    riskNum: 92,
    experienceYears: 2,
    totalJobs: 0,
    rating: 0,
    lifetimeEarnings: "₹0",
    welfareContribution: "₹0",
    createdAt: "2026-09-07 08:45",
    policeVerification: {
      certificateNumber: "PCC-SUSPECT-009",
      policeStation: "Unknown Precinct",
      commissionerate: "Unverified",
      shoName: "Forged Signature Detected",
      crimeRecordStatus: "FLAGGED: TAMPERED PRECINCT SEAL",
      cctnsRecordCheck: "FAILED (Serial Not Found)",
      issuedDate: "N/A",
      validUntil: "N/A",
      sealText: "UNVERIFIED STAMP"
    },
    kycDocuments: [
      { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-SUSPECT-009", verificationStatus: "SUSPECTED_FAKE", issuer: "Unverified" },
      { documentType: "Aadhaar Card", documentNumber: "XXXX-XXXX-0099", verificationStatus: "SYSTEM_FLAGGED", issuer: "UIDAI", systemCheckDetails: "Verhoeff Checksum FAILED" }
    ]
  },
  {
    _id: "WRK-KYC-005",
    name: "Anita Rao",
    phone: "+91 98450 12890",
    email: "anita.rao@coopnex.worker.in",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    gender: "Female",
    age: 33,
    skills: ["Guild Certified Chef", "Food Safety Pro", "Traditional Catering"],
    trade: "Culinary & Domestic",
    societyName: "Bengaluru South Services Guild",
    district: "Bengaluru Urban",
    verificationLevel: 3,
    verificationStatus: "VERIFIED",
    riskScore: "LOW",
    riskNum: 3,
    experienceYears: 7,
    totalJobs: 112,
    rating: 4.92,
    lifetimeEarnings: "₹1,44,000",
    welfareContribution: "₹2,880",
    createdAt: "2026-08-15 10:00",
    policeVerification: {
      certificateNumber: "PCC-KA-BLR-2026-7812",
      policeStation: "Jayanagar Precinct, Bengaluru City Police",
      commissionerate: "Bengaluru City Police",
      shoName: "Inspector R. Ramachandra",
      crimeRecordStatus: "NO COGNIZABLE CRIMINAL RECORD FOUND",
      cctnsRecordCheck: "PASSED (Clean)",
      issuedDate: "10 Aug 2026",
      validUntil: "09 Aug 2027",
      sealText: "BENGALURU CITY POLICE • CCTNS VERIFIED"
    },
    kycDocuments: [
      { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-KA-BLR-2026-7812", verificationStatus: "VERIFIED", issuer: "Bengaluru Police" },
      { documentType: "Aadhaar Card", documentNumber: "XXXX-XXXX-7812", verificationStatus: "SYSTEM_VERIFIED", issuer: "UIDAI" }
    ]
  },
  {
    _id: "WRK-KYC-006",
    name: "Suresh Babu",
    phone: "+91 98660 44321",
    email: "suresh.solar@coopnex.worker.in",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    gender: "Male",
    age: 36,
    skills: ["Rooftop Solar Master", "High Voltage Earthing", "Battery Inverter Pro"],
    trade: "Solar & Electrical",
    societyName: "Visakhapatnam Port Artisan Society",
    district: "Visakhapatnam",
    verificationLevel: 3,
    verificationStatus: "VERIFIED",
    riskScore: "LOW",
    riskNum: 6,
    experienceYears: 9,
    totalJobs: 98,
    rating: 4.91,
    lifetimeEarnings: "₹1,26,000",
    welfareContribution: "₹2,520",
    createdAt: "2026-08-25 15:45",
    policeVerification: {
      certificateNumber: "PCC-AP-VZG-2026-1190",
      policeStation: "MVP Colony Precinct, Visakhapatnam City",
      commissionerate: "Visakhapatnam Police Commissionerate",
      shoName: "Inspector P. Madhav",
      crimeRecordStatus: "NO COGNIZABLE CRIMINAL RECORD FOUND",
      cctnsRecordCheck: "PASSED (Clean background)",
      issuedDate: "18 Aug 2026",
      validUntil: "17 Aug 2027",
      sealText: "VISAKHAPATNAM CITY POLICE • CCTNS VERIFIED"
    },
    kycDocuments: [
      { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-AP-VZG-2026-1190", verificationStatus: "VERIFIED", issuer: "Visakhapatnam Police" },
      { documentType: "Aadhaar Card", documentNumber: "XXXX-XXXX-1190", verificationStatus: "SYSTEM_VERIFIED", issuer: "UIDAI" }
    ]
  }
];

// Sample Bookings Data
const SAMPLE_BOOKINGS = [
  { id: "BK-9021", customer: "Dr. K. Rao", worker: "Rajesh Kumar", service: "Emergency MCB Rewiring", amount: 850, date: "Today, 02:30 PM", status: "IN_PROGRESS" },
  { id: "BK-9020", customer: "Ananya Sharma", worker: "Lakshmi Narayana", service: "Conduit Leakage Repair", amount: 650, date: "Today, 11:15 AM", status: "COMPLETED" },
  { id: "BK-9019", customer: "Pooja Hegde", worker: "Anita Rao", service: "Traditional Andhra Catering", amount: 1800, date: "Yesterday", status: "COMPLETED" },
  { id: "BK-9018", customer: "V. Srinivas", worker: "Suresh Babu", service: "Solar Inverter Synchronization", amount: 1250, date: "05 Sep 2026", status: "COMPLETED" }
];

// Sample Escrow Transactions Ledger
const SAMPLE_ESCROW_TRANSACTIONS = [
  { ref: "ESC-89410-AP", bookingId: "BK-9021", customer: "Dr. K. Rao", artisan: "Rajesh Kumar", total: 850, artisanPayout: 850, welfareFund: 17, status: "ESCROW_LOCKED", time: "Today, 02:30 PM" },
  { ref: "ESC-89211-AP", bookingId: "BK-9020", customer: "Ananya Sharma", artisan: "Lakshmi Narayana", total: 650, artisanPayout: 650, welfareFund: 13, status: "DISBURSED (NPCI)", time: "Today, 11:42 AM" },
  { ref: "ESC-88902-AP", bookingId: "BK-9019", customer: "Pooja Hegde", artisan: "Anita Rao", total: 1800, artisanPayout: 1800, welfareFund: 36, status: "DISBURSED (NPCI)", time: "Yesterday, 04:15 PM" },
  { ref: "ESC-88710-AP", bookingId: "BK-9018", customer: "V. Srinivas", artisan: "Suresh Babu", total: 1250, artisanPayout: 1250, welfareFund: 25, status: "DISBURSED (NPCI)", time: "05 Sep 2026" }
];

export const SuperAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Data states
  const [workforceData, setWorkforceData] = useState<any[]>(INITIAL_WORKFORCE_REGISTRY);
  const [selectedWorkerForDrawer, setSelectedWorkerForDrawer] = useState<any | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>("vja");
  const [isWelfareFlipped, setIsWelfareFlipped] = useState<boolean>(false);

  // Security Center state
  const [securityEvents, setSecurityEvents] = useState<any[]>([
    { eventId: "SEC-902", eventType: "LOGIN_SUCCESS", riskLevel: "LOW", ipAddress: "127.0.0.1", actionTaken: "MFA TOTP verified successfully (Session authorized)", time: "Today, 02:45 PM" },
    { eventId: "SEC-901", eventType: "MFA_FAILED", riskLevel: "MEDIUM", ipAddress: "192.168.1.45", actionTaken: "Invalid 6-digit TOTP code entered (Attempt 1 of 5)", time: "Today, 01:20 PM" },
    { eventId: "SEC-900", eventType: "CRITICAL_ACTION", riskLevel: "HIGH", ipAddress: "127.0.0.1", actionTaken: "Worker WRK-KYC-004 blacklisted for forged precinct stamp", time: "Today, 10:15 AM" }
  ]);

  const handleApproveWorkerKyc = (workerId: string, level: number) => {
    setWorkforceData((prev) =>
      prev.map((w) =>
        w._id === workerId
          ? {
              ...w,
              verificationStatus: "VERIFIED",
              verificationLevel: level,
              riskScore: "LOW",
              riskNum: 0
            }
          : w
      )
    );
  };

  const handleRejectWorkerKyc = (workerId: string, reason: string) => {
    setWorkforceData((prev) =>
      prev.map((w) =>
        w._id === workerId
          ? {
              ...w,
              verificationStatus: "REJECTED",
              rejectionReason: reason
            }
          : w
      )
    );
  };

  const pendingCount = workforceData.filter((k) => k.verificationStatus === "UNDER_REVIEW").length;
  const criticalFraudCount = workforceData.filter((k) => k.riskScore === "CRITICAL").length;

  // Workforce / KYC Table Columns Definition
  const workforceColumns: ColumnDef<any>[] = [
    {
      key: "worker",
      header: "Worker Profile",
      sortable: true,
      render: (w) => (
        <div className="flex items-center gap-2.5">
          <img
            src={w.avatarUrl}
            alt={w.name}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
          />
          <div className="min-w-0">
            <div className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
              <span>{w.name}</span>
              {w.verificationStatus === "VERIFIED" && (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              )}
            </div>
            <div className="text-[11px] font-mono text-slate-400 truncate">{w._id}</div>
          </div>
        </div>
      )
    },
    {
      key: "trade",
      header: "Trade & Skills",
      sortable: true,
      render: (w) => (
        <div>
          <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-[#075E54] dark:text-emerald-400 font-bold text-[11px]">
            {w.trade}
          </span>
          <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[140px]">
            {w.skills?.[0] || "Standard"}
          </div>
        </div>
      )
    },
    {
      key: "societyName",
      header: "Cooperative & District",
      sortable: true,
      render: (w) => (
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
            {w.societyName}
          </div>
          <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />
            <span>{w.district}</span>
          </div>
        </div>
      )
    },
    {
      key: "police",
      header: "Police Clearance (PCC)",
      render: (w) => {
        const p = w.policeVerification;
        const isClean = p?.cctnsRecordCheck?.includes("PASSED");
        return (
          <div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                isClean
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
              }`}
            >
              {isClean ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
              <span>{isClean ? "CCTNS Clean" : "Flagged / Forged"}</span>
            </span>
            <div className="text-[9px] font-mono text-slate-400 mt-0.5 truncate max-w-[120px]">
              {p?.certificateNumber}
            </div>
          </div>
        );
      }
    },
    {
      key: "tier",
      header: "Tier Level",
      sortable: true,
      align: "center",
      render: (w) => (
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[10px] font-bold">
          Tier {w.verificationLevel || 1}
        </span>
      )
    },
    {
      key: "verificationStatus",
      header: "Status",
      sortable: true,
      render: (w) => {
        const isVerified = w.verificationStatus === "VERIFIED";
        const isUnder = w.verificationStatus === "UNDER_REVIEW";
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              isVerified
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : isUnder
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            {w.verificationStatus}
          </span>
        );
      }
    },
    {
      key: "actions",
      header: "Audit View",
      align: "right",
      render: (w) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedWorkerForDrawer(w);
          }}
          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 ml-auto"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span>Inspect</span>
        </button>
      )
    }
  ];

  return (
    <AdminShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      pendingKycCount={pendingCount}
      criticalFraudCount={criticalFraudCount}
      activeEmergencyCount={2}
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* =========================================================================
            1. TAB: OVERVIEW
        ========================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Operational Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  National Operations Command Center
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Platform oversight under authorized SUPER_ADMIN governance. Real-time telemetry.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                  Role: SUPER_ADMIN
                </span>
              </div>
            </div>

            {/* Compact 6-Card KPI Strip with Smooth Animated Counters */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                { title: "ACTIVE WORKERS", value: 12480, prefix: "", suffix: "", trend: "↑ 8.4%", desc: "vs 7d", color: "text-[#075E54] dark:text-emerald-400", icon: Users },
                { title: "PENDING KYC", value: pendingCount, prefix: "", suffix: " Dossiers", trend: "Urgent", desc: "review", color: "text-amber-600 dark:text-amber-400", icon: ShieldCheck },
                { title: "TODAY'S BOOKINGS", value: 342, prefix: "", suffix: "", trend: "↑ 12%", desc: "vs yesterday", color: "text-blue-600 dark:text-blue-400", icon: Activity },
                { title: "ESCROW BALANCE", value: 1485000, prefix: "₹", suffix: "", trend: "100%", desc: "held in trust", color: "text-emerald-600 dark:text-emerald-400", icon: CreditCard },
                { title: "EMERGENCY SLA", value: 6.4, prefix: "", suffix: "m", isDecimal: true, trend: "Target < 7m", desc: "rapid dispatch", color: "text-purple-600 dark:text-purple-400", icon: Zap },
                { title: "SECURITY FLAGS", value: criticalFraudCount, prefix: "", suffix: " Alert", trend: "Active", desc: "risk", color: "text-rose-600 dark:text-rose-400", icon: AlertTriangle }
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <span>{kpi.title}</span>
                      <Icon className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <div className={`text-xl font-black font-mono tracking-tight mt-1.5 ${kpi.color}`}>
                      {kpi.isDecimal ? (
                        `${kpi.prefix}${kpi.value}${kpi.suffix}`
                      ) : (
                        <AnimatedNumber value={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{kpi.trend}</span>
                      <span>{kpi.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 6 Core Administrative Responsibilities Showcase */}
            <AdminResponsibilitiesShowcase onNavigateTab={(tab) => setActiveTab(tab)} />

            {/* Signature 3D Cooperative Network + Operational Alerts Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8">
                <CooperativeNetwork3D />
              </div>

              <div className="lg:col-span-4 bg-white dark:bg-[#101828] p-4 rounded-2xl border border-[#E4E9F0] dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Live Operational Signals
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Active
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div
                    onClick={() => setActiveTab("kyc")}
                    className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 cursor-pointer hover:bg-amber-50 transition"
                  >
                    <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                      <span>{pendingCount} KYC Applications Awaiting Review</span>
                      <span className="text-[10px] font-mono">Inspect &rarr;</span>
                    </div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                      Police verification certificate inspection pending.
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("emergency")}
                    className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 cursor-pointer hover:bg-purple-50 transition"
                  >
                    <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-200">
                      <span>Live SOS: Proximity Electrician En Route</span>
                      <span className="text-[10px] font-mono">View 3D &rarr;</span>
                    </div>
                    <div className="text-[11px] text-purple-700 dark:text-purple-400 mt-0.5">
                      Rajesh Kumar 1.2 km away. ETA 5.8 mins.
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("security")}
                    className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 cursor-pointer hover:bg-rose-50 transition"
                  >
                    <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200">
                      <span>Hardware Collision Flagged</span>
                      <span className="text-[10px] font-mono">View &rarr;</span>
                    </div>
                    <div className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">
                      Forged precinct seal detected on suspect account WRK-KYC-004.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Priority KYC Submissions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Priority Workforce Submissions
                </h3>
                <button
                  onClick={() => setActiveTab("workers")}
                  className="text-xs font-bold text-[#075E54] dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>View Full Registry ({workforceData.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <AdminDataTable
                data={workforceData.slice(0, 3)}
                columns={workforceColumns}
                keyExtractor={(item) => item._id}
                onRowClick={(item) => setSelectedWorkerForDrawer(item)}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            1.1 TAB: ADMIN MANDATE (WHAT ADMIN DOES EXPANDED VIEW)
        ========================================================================== */}
        {activeTab === "mandate" && (
          <div className="space-y-6">
            <AdminResponsibilitiesShowcase onNavigateTab={(tab) => setActiveTab(tab)} />
          </div>
        )}

        {/* =========================================================================
            2. TAB: WORKFORCE REGISTRY
        ========================================================================== */}
        {activeTab === "workers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Verified Cooperative Workforce Registry
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Platform-wide directory of certified artisans, skill tiers, ratings, and Police Clearance statuses.
                </p>
              </div>
            </div>

            {/* Informative Admin Mandate Banner - Light Style */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-blue-50/40 border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=80"
                  alt="Verified Artisan"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-300 shadow-xs shrink-0"
                />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#075E54]">
                    Super Admin Mandate • Workforce Oversight
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Tier Verification &amp; Police Background Audit
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Every artisan in this registry is audited by the Super Admin for Police Clearance, Aadhaar checksums, and trade skill qualifications.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
                  12,480 Active
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-[#075E54] font-bold">
                  100% Cleared
                </span>
              </div>
            </div>

            <AdminDataTable
              data={workforceData}
              columns={workforceColumns}
              keyExtractor={(item) => item._id}
              searchPlaceholder="Search workers by name, trade, or ID..."
              filterOptions={[
                {
                  key: "trade",
                  label: "Trade",
                  options: [
                    { label: "Electrical", value: "Electrical" },
                    { label: "Plumbing", value: "Plumbing" },
                    { label: "Caregiving", value: "Caregiving" },
                    { label: "Culinary & Domestic", value: "Culinary & Domestic" },
                    { label: "Solar & Electrical", value: "Solar & Electrical" }
                  ]
                },
                {
                  key: "verificationStatus",
                  label: "Status",
                  options: [
                    { label: "Verified", value: "VERIFIED" },
                    { label: "Under Review", value: "UNDER_REVIEW" },
                    { label: "Suspected Fake", value: "SUSPECTED_FAKE" }
                  ]
                }
              ]}
              onRowClick={(item) => setSelectedWorkerForDrawer(item)}
            />
          </div>
        )}

        {/* =========================================================================
            3. TAB: VERIFICATION (KYC)
        ========================================================================== */}
        {activeTab === "kyc" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Artisan KYC &amp; Police Verification Dossiers
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Inspect Police Clearance Certificates (PCC), Aadhaar Verhoeff checks, and award certified skill tiers.
                </p>
              </div>
            </div>

            {/* Informative Admin Mandate Banner - Light Style */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/40 border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=300&q=80"
                  alt="Official PCC Verification"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-blue-300 shadow-xs shrink-0"
                />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-blue-700">
                    Super Admin Mandate • Statutory Document Verification
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Police Clearance Certificates (PCC) &amp; UIDAI Verhoeff Checksums
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    The Super Administrator personally examines Station House Officer (SHO) precinct seals, CCTNS crime records, and Aadhaar biometrics before issuing Tier credentials.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
                  {pendingCount} Pending
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800 font-bold">
                  PCC Strict Audit
                </span>
              </div>
            </div>

            <AdminDataTable
              data={workforceData}
              columns={workforceColumns}
              keyExtractor={(item) => item._id}
              searchPlaceholder="Search by artisan name, trade, or ID..."
              filterOptions={[
                {
                  key: "verificationStatus",
                  label: "Status",
                  options: [
                    { label: "Under Review", value: "UNDER_REVIEW" },
                    { label: "Verified", value: "VERIFIED" },
                    { label: "Suspected Fake", value: "SUSPECTED_FAKE" },
                    { label: "Rejected", value: "REJECTED" }
                  ]
                }
              ]}
              onRowClick={(item) => setSelectedWorkerForDrawer(item)}
            />
          </div>
        )}

        {/* =========================================================================
            4. TAB: COOPERATIVES (9 DISTRICTS)
        ========================================================================== */}
        {activeTab === "societies" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Cooperative Societies &amp; 9-District Oversight
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Regional federation coverage, emergency response SLAs, and welfare fund corpus.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <AdminCoverage3D
                  selectedCityId={selectedCityId}
                  onSelectCity={(id) => setSelectedCityId(id)}
                />
              </div>

              <div className="lg:col-span-5 bg-white dark:bg-[#101828] p-5 rounded-2xl border border-[#E4E9F0] dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  9 Operating Districts Overview
                </h3>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 text-xs">
                  {CITIES_9_COVERAGE.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => setSelectedCityId(city.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        selectedCityId === city.id
                          ? "bg-teal-50 dark:bg-teal-950/40 border-[#075E54] dark:border-emerald-600 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {city.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {city.district} • {city.societies} Societies
                        </div>
                      </div>

                      <div className="text-right font-mono text-[11px]">
                        <div className="font-bold text-[#075E54] dark:text-emerald-400">
                          {city.artisans} artisans
                        </div>
                        <div className="text-slate-400">{city.sla} avg SLA</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. TAB: BOOKINGS
        ========================================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Platform Bookings &amp; Service Operations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live monitoring of customer requests, assigned artisans, and completion statuses.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#101828] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 p-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {SAMPLE_BOOKINGS.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="font-mono text-emerald-600 font-bold">{b.id}</span>
                      <span>{b.service}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Customer: {b.customer} • Artisan: {b.worker} • {b.date}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="font-bold text-slate-900 dark:text-white">₹{b.amount}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            6. TAB: EMERGENCY OPERATIONS
        ========================================================================== */}
        {activeTab === "emergency" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Emergency Dispatch Operations Command
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  7-minute rapid response coordination with automated proximity worker beacons and customer SOS tracking.
                </p>
              </div>
            </div>

            {/* Informative Admin Mandate Banner - Light Style */}
            <div className="rounded-2xl bg-gradient-to-r from-rose-50/80 via-white to-purple-50/40 border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&q=80"
                  alt="Emergency Responder"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-rose-300 shadow-xs shrink-0"
                />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-rose-700">
                    Super Admin Mandate • Rapid Emergency Dispatch
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    Sub-7-Minute Proximity Vectoring &amp; Safety Overrides
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Monitors live GPS tracking connecting distressed residents to nearest tier-4 verified technicians for gas leaks, electrical flashovers, and water bursts.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
                  Target &lt; 7.0m
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 font-bold">
                  Avg 6.4m SLA
                </span>
              </div>
            </div>

            <EmergencyDispatch3D />
          </div>
        )}

        {/* =========================================================================
            7. TAB: PAYMENTS & ESCROW
        ========================================================================== */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Payments &amp; Statutory Escrow Settlement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  100% of base labor disbursed directly to artisans upon customer completion OTP. 0% middlemen deduction.
                </p>
              </div>
            </div>

            {/* Informative Admin Mandate Banner - Light Style */}
            <div className="rounded-2xl bg-gradient-to-r from-teal-50/80 via-white to-emerald-50/40 border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=300&q=80"
                  alt="Instant Payout"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-teal-300 shadow-xs shrink-0"
                />
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[#075E54]">
                    Super Admin Mandate • Escrow &amp; Worker Welfare
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    100% Direct Payouts (0% Exploitation) &amp; 2% Welfare Pooling
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Releases 100% base labor funds via NPCI directly to workers on OTP completion, while directing 2% into the cooperative emergency healthcare fund.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 shadow-2xs">
                  0% Commission
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-teal-100 text-[#075E54] font-bold">
                  ₹14.85L Daily Settled
                </span>
              </div>
            </div>

            <PaymentFlow3D />

            {/* Escrow Transactions Ledger */}
            <div className="bg-white dark:bg-[#101828] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Statutory Escrow Settlement Ledger
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">
                  NPCI Direct Link Active
                </span>
              </div>

              <div className="space-y-2">
                {SAMPLE_ESCROW_TRANSACTIONS.map((tx, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-600 font-bold">{tx.ref}</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">
                          Booking: {tx.bookingId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Payer: {tx.customer} &rarr; Artisan: <strong>{tx.artisan}</strong>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">
                        ₹{tx.artisanPayout} <span className="text-[10px] text-emerald-600">(100% Labor)</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Welfare (2%): ₹{tx.welfareFund} • {tx.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            8. TAB: WORKER WELFARE (WITH 3D FLIP CARD)
        ========================================================================== */}
        {activeTab === "welfare" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Cooperative Welfare Fund &amp; Accidental Insurance
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Statutory 2% contributions pooled into healthcare, disability, and education stipends.
                </p>
              </div>

              <button
                onClick={() => setIsWelfareFlipped(!isWelfareFlipped)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isWelfareFlipped ? "Flip to Overview" : "Flip to Beneficiary Ledger"}</span>
              </button>
            </div>

            {/* Interactive 3D Flip Card Container */}
            <div className="relative min-h-[300px]" style={{ perspective: "1000px" }}>
              <div
                className="w-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isWelfareFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                {/* FRONT FACE: Overview & KPIs */}
                <div
                  className={`space-y-4 ${isWelfareFlipped ? "hidden" : "block"}`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Active Welfare Corpus</div>
                      <div className="text-2xl font-black text-[#075E54] dark:text-emerald-400 font-mono">₹48,50,000</div>
                      <div className="text-xs text-slate-500">Held in District Cooperative Bank escrow</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Insured Artisans</div>
                      <div className="text-2xl font-black text-blue-600 font-mono">12,480</div>
                      <div className="text-xs text-slate-500">₹2,00,000 group accidental cover active</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Claims Disbursed</div>
                      <div className="text-2xl font-black text-amber-600 font-mono">14</div>
                      <div className="text-xs text-slate-500">100% emergency grant settlement SLA</div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Cooperative Welfare Governance Protocol</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">100% Transparent</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed">
                      Every completed transaction contributes 2% to the District Cooperative Welfare Corpus. Artisans receive zero-deduction accidental insurance, hospitalization support, tool upgrade microloans at 0% interest, and children’s educational scholarships directly overseen by the SUPER_ADMIN.
                    </p>
                  </div>
                </div>

                {/* BACK FACE: Beneficiary Ledger */}
                <div
                  className={`space-y-4 ${!isWelfareFlipped ? "hidden" : "block"}`}
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden"
                  }}
                >
                  <div className="bg-white dark:bg-[#101828] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        Recent Welfare Grants &amp; Scholarships Disbursed
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Audited</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { id: "WLF-CLM-089", beneficiary: "Rajesh Kumar (Electrician)", benefit: "Accidental Hospitalization Reimbursement", amount: "₹45,000", hospital: "Apollo Vijayawada", status: "DISBURSED", date: "02 Sep 2026" },
                        { id: "WLF-EDU-104", beneficiary: "Sunita Devi (Caregiver)", benefit: "Children School Education Aid", amount: "₹12,000", school: "Govt High School NTR", status: "DISBURSED", date: "28 Aug 2026" },
                        { id: "WLF-LOAN-012", beneficiary: "Lakshmi Narayana (Plumber)", benefit: "Tool Equipment Upgrade Microloan (0% Int.)", amount: "₹25,000", supplier: "Bosch Tools Guild", status: "ACTIVE", date: "15 Aug 2026" }
                      ].map((grant, i) => (
                        <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="font-mono text-emerald-600">{grant.id}</span>
                              <span>{grant.beneficiary}</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {grant.benefit} • {grant.date}
                            </div>
                          </div>
                          <div className="text-right font-mono">
                            <div className="font-bold text-slate-900 dark:text-white">{grant.amount}</div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                              {grant.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            9. TAB: SERVICE AREAS
        ========================================================================== */}
        {activeTab === "areas" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Service Availability &amp; Pincode Coverage
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Manage geographical operational zones and cooperative cluster boundaries.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#101828] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 text-xs">
              <div className="font-bold text-slate-900 dark:text-white">Active Service Pincodes (AP &amp; Metro Hubs)</div>
              <div className="flex flex-wrap gap-2">
                {[
                  "520001 (Vijayawada Central)",
                  "520002 (Benz Circle)",
                  "520007 (Auto Nagar)",
                  "522001 (Guntur Urban)",
                  "500081 (Cyber Hub, Hyderabad)",
                  "560001 (Bengaluru Urban)",
                  "530001 (Visakhapatnam Port)"
                ].map((pin, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
                    {pin}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            10. TAB: AI INTELLIGENCE
        ========================================================================== */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  AI Demand Forecast &amp; Capacity Optimization
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  3D predictive models forecasting peak service hours and suggested artisan buffer allocations.
                </p>
              </div>
            </div>

            <AiDemand3D />
          </div>
        )}

        {/* =========================================================================
            11. TAB: SECURITY CENTER
        ========================================================================== */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Administrator Security Center
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Account protection, multi-factor authentication (MFA), active sessions, and security events.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                  MFA: Active (TOTP)
                </span>
              </div>
            </div>

            {/* 3D Fraud Collision Visualization */}
            <FraudNetwork3D />

            {/* Security Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Authentication Mode</div>
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Two-Factor (TOTP)</span>
                </div>
                <div className="text-[11px] text-slate-500">Hardware token verified</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Session Timeout</div>
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>12 Hours (Auto Invalidate)</span>
                </div>
                <div className="text-[11px] text-slate-500">Idle timeout after 30m</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Lockout Protection</div>
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>5 Attempts &rarr; 15m Lock</span>
                </div>
                <div className="text-[11px] text-slate-500">Rate-limiting enforced</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Critical Operations</div>
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-purple-500" />
                  <span>Re-Authentication Required</span>
                </div>
                <div className="text-[11px] text-slate-500">6-Digit PIN on status change</div>
              </div>
            </div>

            {/* Security Events Feed */}
            <div className="bg-white dark:bg-[#101828] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Recent Security Events Log</span>
                <span className="text-[10px] font-mono text-slate-400">Server Audited</span>
              </div>

              <div className="space-y-2">
                {securityEvents.map((evt, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-slate-500 text-[10px]">{evt.eventId}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{evt.actionTaken}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
                      <span>IP: {evt.ipAddress}</span>
                      <span>{evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            12. TAB: AUDIT LOGS
        ========================================================================== */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Cryptographic Audit Trail
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Immutable administrative action log with PIN validation timestamps and session metadata.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#101828] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 p-5 space-y-4">
              {[
                { admin: "SUPER ADMIN", action: "Approved Worker KYC & Assigned Tier 4", target: "WRK-KYC-002 (Lakshmi Narayana)", time: "Today 02:40 PM", status: "SUCCESS", ip: "127.0.0.1" },
                { admin: "SUPER ADMIN", action: "Flagged Suspicious Document & Blacklisted", target: "WRK-KYC-004 (Vikram R.)", time: "Today 01:15 PM", status: "FLAGGED", ip: "127.0.0.1" },
                { admin: "SUPER ADMIN", action: "Dispatched Emergency Electrician", target: "Booking #SS-AP-2026-8941", time: "Today 11:22 AM", status: "DISPATCHED", ip: "127.0.0.1" }
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px]">
                        {log.admin}
                      </span>
                      <span>{log.action}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Target: {log.target}
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px] text-slate-400 shrink-0">
                    <div>{log.time}</div>
                    <div className="text-emerald-600 font-bold">{log.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            13. TAB: SYSTEM SETTINGS
        ========================================================================== */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Platform Configuration &amp; Health
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Core parameters, statutory floor wage rules, and third-party gateway statuses.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Core Express API", status: "OPERATIONAL", latency: "12ms" },
                { name: "Primary MongoDB", status: "OPERATIONAL", latency: "4ms" },
                { name: "WebSocket Dispatches", status: "OPERATIONAL", latency: "16ms" },
                { name: "NPCI / Bank Escrow", status: "OPERATIONAL", latency: "110ms" }
              ].map((svc, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 space-y-2 shadow-xs text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{svc.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Latency: {svc.latency}</span>
                    <span className="font-bold text-emerald-600">{svc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* COMPREHENSIVE WORKER PROFILE & AUDIT SLIDE-IN DRAWER */}
      <WorkerDetailDrawer
        worker={selectedWorkerForDrawer}
        isOpen={Boolean(selectedWorkerForDrawer)}
        onClose={() => setSelectedWorkerForDrawer(null)}
        onApprove={handleApproveWorkerKyc}
        onReject={handleRejectWorkerKyc}
        initialTab={activeTab === "kyc" ? "kyc" : "overview"}
      />
    </AdminShell>
  );
};
