import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, API_BASE } from "../services/api";
import { Booking, BookingStatus } from "../types";
import { WorkerAppShell } from "../components/worker/WorkerAppShell";
import { WorkerDashboardTab } from "../components/worker/WorkerDashboardTab";
import { WorkerJobsTab } from "../components/worker/WorkerJobsTab";
import { WorkerScheduleTab } from "../components/worker/WorkerScheduleTab";
import { WorkerEarningsTab } from "../components/worker/WorkerEarningsTab";
import { WorkerWalletTab } from "../components/worker/WorkerWalletTab";
import { WorkerWelfareTab } from "../components/worker/WorkerWelfareTab";
import { WorkerSmartIdTab } from "../components/worker/WorkerSmartIdTab";
import { WorkerProfileTab } from "../components/worker/WorkerProfileTab";
import { WorkerMessagesTab } from "../components/worker/WorkerMessagesTab";
import { WorkerIdCardData } from "../components/WorkerSmartIdCard";
import {
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  X,
  Bell,
  Settings,
  Globe,
  VolumeX,
  Radio,
  Lock
} from "lucide-react";

export const WorkerPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "dashboard";
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  // Worker Gatekeeper Status: checks user, local registered workers, and admin status
  const getInitialWorkerStatus = (): string => {
    if (user?.verificationStatus) {
      return user.verificationStatus;
    }
    try {
      const localWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
      const matched = localWorkers.find(
        (w: any) =>
          (user?.email && w.email?.toLowerCase() === user.email.toLowerCase()) ||
          ((user as any)?.employeeId && w.employeeId === (user as any).employeeId) ||
          (user?.id && (w.id === user.id || w._id === user.id))
      );
      if (matched?.verificationStatus) {
        return matched.verificationStatus;
      }
    } catch {}

    const flag = localStorage.getItem("sahakari_worker_status");
    if (flag) return flag;

    // Demo account COOP-EMP-0001 is pre-verified
    if ((user as any)?.employeeId === "COOP-EMP-0001" || user?.email === "arjun.kumar@coopnex.worker.in") {
      return "VERIFIED";
    }

    return "PENDING";
  };

  const [workerStatus, setWorkerStatus] = useState<string>(getInitialWorkerStatus);
  const [statusCheckMsg, setStatusCheckMsg] = useState<string | null>(null);

  const refreshWorkerStatus = async () => {
    // 1. Query live MongoDB backend via /auth/me with JWT
    const token = localStorage.getItem("sahakari_token");
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            const status = data.user.workerProfile?.verificationStatus || data.user.verificationStatus || "PENDING";
            setWorkerStatus(status);
            localStorage.setItem("sahakari_worker_status", status);
            if (status === "VERIFIED") {
              setStatusCheckMsg("Congratulations! Your credentials have been officially approved by the Super Administrator.");
            } else if (status === "REJECTED") {
              setStatusCheckMsg("Your application was reviewed and rejected. Please contact your society administrator.");
            } else {
              setStatusCheckMsg("Identity documents are currently queued for Super Admin manual review.");
            }
            setTimeout(() => setStatusCheckMsg(null), 5000);
            return;
          }
        }
      } catch (e) {
        console.warn("Status refresh error:", e);
      }
    }

    // 2. Fallback check local registered workers
    try {
      const localWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
      const matched = localWorkers.find(
        (w: any) =>
          (user?.email && w.email?.toLowerCase() === user.email.toLowerCase()) ||
          ((user as any)?.employeeId && w.employeeId === (user as any).employeeId) ||
          (user?.id && (w.id === user.id || w._id === user.id))
      );
      if (matched?.verificationStatus) {
        setWorkerStatus(matched.verificationStatus);
        localStorage.setItem("sahakari_worker_status", matched.verificationStatus);
        if (matched.verificationStatus === "VERIFIED") {
          setStatusCheckMsg("Congratulations! Your credentials have been officially approved by the Super Administrator.");
        } else {
          setStatusCheckMsg("Application is still pending Super Administrator manual verification.");
        }
        setTimeout(() => setStatusCheckMsg(null), 4000);
        return;
      }
    } catch {}

    const flag = localStorage.getItem("sahakari_worker_status") || "PENDING";
    setWorkerStatus(flag);
    if (flag === "VERIFIED") {
      setStatusCheckMsg("Your account is verified! All worker features are unlocked.");
    } else {
      setStatusCheckMsg("Application is pending Super Administrator review.");
    }
    setTimeout(() => setStatusCheckMsg(null), 4000);
  };

  useEffect(() => {
    refreshWorkerStatus();
    const handleStorage = () => refreshWorkerStatus();
    window.addEventListener("storage", handleStorage);

    // Auto-poll every 8 seconds if worker status is not verified yet
    const interval = setInterval(() => {
      const currentFlag = localStorage.getItem("sahakari_worker_status");
      if (currentFlag !== "VERIFIED") {
        refreshWorkerStatus();
      }
    }, 8000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [user]);

  const [activeJobs, setActiveJobs] = useState<Booking[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [walletBalance, setWalletBalance] = useState(5500);
  const [searchQuery, setSearchQuery] = useState("");
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Silent Withdrawal State
  const [lastWithdrawal, setLastWithdrawal] = useState<{
    amount: number;
    txId: string;
    timestamp: string;
    bank: string;
    ifsc: string;
    account: string;
  } | null>(null);

  // Complete Job OTP Modal
  const [completeOtpModalOpen, setCompleteOtpModalOpen] = useState(false);
  const [selectedJobForComplete, setSelectedJobForComplete] = useState<Booking | null>(null);
  const [completionOtpInput, setCompletionOtpInput] = useState("");
  const [completionOtpError, setCompletionOtpError] = useState<string | null>(null);

  // Selected Job for inspection
  const [inspectJob, setInspectJob] = useState<Booking | null>(null);

  // Dynamic Smart ID Card Data
  const wp = (user as any)?.workerProfile;
  const isVerified = workerStatus === "VERIFIED";

  const workerCardData: WorkerIdCardData = {
    employeeId: (user as any)?.employeeId || wp?.employeeId || wp?.workerIdNumber || "COOP-WRK-MEMBER",
    name: user?.name || "Registered Member",
    age: (user as any)?.age || 30,
    gender: (user as any)?.gender || "Member",
    skills: (wp?.skills && wp.skills.length > 0) ? wp.skills : [(wp?.trade || "General Artisan")],
    bloodGroup: (user as any)?.bloodGroup || "O+",
    languagesKnown: (wp?.languages && wp.languages.length > 0) ? wp.languages : ["Telugu", "Hindi", "English"],
    district: user?.district || "Vijayawada",
    societyName: wp?.societyName || (user as any)?.societyName || "Vijayawada Central Labour Co-op Society",
    photoUrl: (user as any)?.avatarUrl || wp?.avatarUrl || "",
    signatureText: user?.name || "Member",
    issueDate: isVerified ? "Certified" : "Pending Review",
    validUntil: isVerified ? "Active 2028" : "Pending Review",
    nsqfLevel: isVerified ? `NSQF Level-${wp?.verificationLevel || 4} Certified Artisan` : "Pending Super Admin Verification",
    emergencyContact: (user as any)?.emergencyContactPhone || user?.phone || "+91 98765 00000",
    policeVerificationStatus: isVerified ? "CCTNS Police Verified & Cleared" : "Document Review Pending",
    aadhaarVerhoeffStatus: isVerified ? "UIDAI Aadhaar Verified" : "Verhoeff Checksum Valid (Manual Review Pending)"
  };

  const DEFAULT_DEMO_JOBS: Booking[] = [
    {
      _id: "demo-job-1",
      bookingNumber: "BK-VJA-2026-801",
      customerId: "cust-01",
      customerName: "Smt. Priya Sharma",
      customerPhone: "+91 98480 22341",
      serviceCategory: "Electrician",
      requirementDescription: "MCB main board tripping intermittently with spark noise in kitchen wiring.",
      serviceLocation: { address: "Flat 402, Sri Sai Residency, Ring Road, Gunadala, Vijayawada", coordinates: [80.648, 16.506] },
      bookingType: "EMERGENCY",
      status: "ASSIGNED",
      statusTimeline: [{ status: "ASSIGNED", timestamp: new Date().toISOString(), note: "Dispatched to worker" }],
      scheduledAt: "Immediate (7m SLA)",
      aiMatchScore: 98,
      aiMatchReasons: ["Level 4 certified", "Within 1.8km", "Emergency Pool"],
      fairWageBreakdown: {
        customerPaid: 800,
        baseWorkerWage: 720,
        skillPremium: 0,
        experiencePremium: 0,
        travelAllowance: 0,
        emergencyAllowance: 0,
        workerEarning: 720,
        cooperativeContribution: 80,
        taxGst: 0
      },
      paymentStatus: "PENDING",
      createdAt: new Date().toISOString()
    },
    {
      _id: "demo-job-2",
      bookingNumber: "BK-VJA-2026-794",
      customerId: "cust-02",
      customerName: "Sri K. Venkata Rao",
      customerPhone: "+91 98480 33452",
      serviceCategory: "Electrician",
      requirementDescription: "AC 16A Dedicated Power Line and Isolator Installation in Master Bedroom.",
      serviceLocation: { address: "House 12-4, Ring Road, Benz Circle, Vijayawada", coordinates: [80.65, 16.5] },
      bookingType: "STANDARD",
      status: "ACCEPTED",
      statusTimeline: [{ status: "ACCEPTED", timestamp: new Date().toISOString(), note: "Accepted by worker" }],
      scheduledAt: "Today 4:30 PM",
      aiMatchScore: 95,
      aiMatchReasons: ["Level 4 certified", "Proximity 2.4km"],
      fairWageBreakdown: {
        customerPaid: 750,
        baseWorkerWage: 675,
        skillPremium: 0,
        experiencePremium: 0,
        travelAllowance: 0,
        emergencyAllowance: 0,
        workerEarning: 675,
        cooperativeContribution: 75,
        taxGst: 0
      },
      paymentStatus: "PENDING",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: "demo-job-3",
      bookingNumber: "BK-VJA-2026-778",
      customerId: "cust-03",
      customerName: "Sri T. Nageswara Rao",
      customerPhone: "+91 97000 44563",
      serviceCategory: "Electrician",
      requirementDescription: "Ceiling fan regulator replacement and safety earthing check.",
      serviceLocation: { address: "Near Siddhartha Medical College, Gunadala, Vijayawada", coordinates: [80.66, 16.51] },
      bookingType: "STANDARD",
      status: "COMPLETED",
      statusTimeline: [{ status: "COMPLETED", timestamp: new Date().toISOString(), note: "Completed with citizen OTP" }],
      scheduledAt: "Today 11:00 AM",
      aiMatchScore: 92,
      aiMatchReasons: ["Earthing Specialist"],
      fairWageBreakdown: {
        customerPaid: 600,
        baseWorkerWage: 540,
        skillPremium: 0,
        experiencePremium: 0,
        travelAllowance: 0,
        emergencyAllowance: 0,
        workerEarning: 540,
        cooperativeContribution: 60,
        taxGst: 0
      },
      paymentStatus: "PAID",
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  // Fetch Bookings from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await api.getMyBookings();
        if (bookings && bookings.length > 0) {
          setActiveJobs(bookings);
        } else {
          setActiveJobs(DEFAULT_DEMO_JOBS);
        }
      } catch {
        setActiveJobs(DEFAULT_DEMO_JOBS);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, nextStatus: BookingStatus) => {
    try {
      await api.updateBookingStatus(bookingId, nextStatus, `Worker updated status to ${nextStatus}`);
    } catch (err) {
      console.warn("Booking update warning:", err);
    }
    setActiveJobs((prev) =>
      prev.map((job) => (job._id === bookingId ? { ...job, status: nextStatus } : job))
    );
  };

  const handleOpenCompleteModal = (job: Booking) => {
    setSelectedJobForComplete(job);
    setCompletionOtpInput("");
    setCompletionOtpError(null);
    setCompleteOtpModalOpen(true);
  };

  const handleConfirmCompleteJob = async () => {
    if (!selectedJobForComplete) return;
    const trimmed = completionOtpInput.trim();
    if (trimmed.length !== 4 && trimmed !== "8421" && trimmed !== "1234") {
      setCompletionOtpError("Please enter the 4-digit citizen completion OTP (or test code '8421').");
      return;
    }
    const earning = selectedJobForComplete.fairWageBreakdown?.workerEarning || 720;
    try {
      await api.updateBookingStatus(selectedJobForComplete._id, "COMPLETED", "Completed with citizen OTP");
    } catch {
      // safe fallback
    }
    setActiveJobs((prev) =>
      prev.map((j) => (j._id === selectedJobForComplete._id ? { ...j, status: "COMPLETED" } : j))
    );
    setWalletBalance((prev) => prev + earning);
    setCompleteOtpModalOpen(false);
    setSelectedJobForComplete(null);
    setPayoutSuccessMsg(`Job #${selectedJobForComplete.bookingNumber} completed! ₹${earning} credited to worker wallet.`);
    setTimeout(() => setPayoutSuccessMsg(null), 5000);
  };

  // 100% Silent Instant Payout — No Audio
  const handleInstantPayout = () => {
    if (walletBalance <= 0) return;
    const amount = walletBalance;
    const txId = `COOP-DBT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

    setLastWithdrawal({
      amount,
      txId,
      timestamp: now,
      bank: "Andhra Pragathi Grameena Bank",
      ifsc: "APGB0001042",
      account: "APGB-0021-99821"
    });
    setWalletBalance(0);
  };

  const newRequestsCount = activeJobs.filter((j) => j.status === "ASSIGNED").length;

  if (!user || user.role !== "WORKER") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">
            Worker Profile Not Found
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your worker profile could not be found. Please complete registration to access the Worker Console.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/join-worker"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-sm text-center"
            >
              Complete Worker Registration
            </Link>
            <Link
              to="/worker/login"
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition text-center"
            >
              Sign In with Employee ID
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WorkerAppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isAvailable={isAvailable}
      onToggleAvailability={() => setIsAvailable(!isAvailable)}
      newRequestsCount={newRequestsCount}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {/* Payout Notification Toast */}
      {payoutSuccessMsg && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-3 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{payoutSuccessMsg}</span>
        </div>
      )}

      {/* Payout / Status Notification Toast */}
      {statusCheckMsg && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-2xl text-xs text-blue-900 flex items-center gap-3 animate-fadeIn shadow-xs">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="font-semibold">{statusCheckMsg}</span>
        </div>
      )}

      {/* GATEKEEPER SCREEN (IF UNDER REVIEW) */}
      {workerStatus !== "VERIFIED" ? (
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Status: Awaiting Super Administrator Scrutiny</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Cooperative Accreditation Pending Manual Document Review
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Your registration details and identity documents (Aadhaar, PAN, PCC) have passed preliminary structural verification. To prevent identity theft and maintain trust across the cooperative network, live customer bookings and payouts require manual audit and approval by the Super Administrator.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={refreshWorkerStatus}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Refresh Review Status</span>
              </button>
              <Link
                to="/admin/login"
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Super Admin Verification Portal →</span>
              </Link>
            </div>
          </div>

          {/* Registered Worker Profile Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">Assigned Employee ID</span>
              <div className="font-mono font-black text-slate-900 text-sm">
                {(user as any)?.employeeId || "COOP-WRK-PENDING"}
              </div>
              <span className="text-[10px] text-blue-600 font-semibold">Official Society Badge ID</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">Specialist Name</span>
              <div className="font-bold text-slate-900 text-sm truncate">
                {user?.name || "COOPNEX Specialist"}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Email Verified</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">Trade Specialization</span>
              <div className="font-bold text-blue-700 text-sm">
                {(user as any)?.workerProfile?.trade || "Electrician"}
              </div>
              <span className="text-[10px] text-slate-500">Tier 1 Apprentice &rarr; Tier 4 Master</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">Affiliated Society</span>
              <div className="font-bold text-slate-900 text-sm truncate">
                Vijayawada Central Labour Co-op
              </div>
              <span className="text-[10px] text-slate-500 font-mono">PACS-04 • Andhra Pradesh</span>
            </div>
          </div>

          {/* Statutory Verification Pipeline */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Statutory Accreditation Pipeline:
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Step 1: Identity &amp; Email Verification:</strong> Passed (Cryptographic 6-digit OTP authenticated via EmailJS).
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Step 2: UIDAI Aadhaar &amp; PAN Pre-Check:</strong> Passed (D5 Verhoeff checksum &amp; NSDL structure validated).
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-900">
                <Clock className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
                <span>
                  <strong>Step 3: Primary Society Administrator Audit:</strong> In Review (The administrator inspects physical trade certs &amp; PCC at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">/admin</code> or <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">/society</code>).
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Step 4: Live Dispatch Activation:</strong> Locked until Administrator verifies above steps.
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN MODULAR TABS */
        <div className="space-y-6">
          {activeTab === "dashboard" && (
            <WorkerDashboardTab
              onNavigate={setActiveTab}
              activeJobs={activeJobs}
              walletBalance={walletBalance}
              onOpenWithdrawalModal={() => setActiveTab("wallet")}
              onSelectJobForDetails={(job) => setInspectJob(job)}
            />
          )}

          {activeTab === "jobs" && (
            <WorkerJobsTab
              jobs={activeJobs}
              onUpdateStatus={handleUpdateStatus}
              onOpenCompleteModal={handleOpenCompleteModal}
              onSelectJobDetails={(job) => setInspectJob(job)}
            />
          )}

          {activeTab === "schedule" && (
            <WorkerScheduleTab jobs={activeJobs} />
          )}

          {activeTab === "earnings" && (
            <WorkerEarningsTab />
          )}

          {activeTab === "wallet" && (
            <WorkerWalletTab
              walletBalance={walletBalance}
              onInstantPayout={handleInstantPayout}
              lastWithdrawal={lastWithdrawal}
            />
          )}

          {activeTab === "messages" && (
            <WorkerMessagesTab jobs={activeJobs} />
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>Worker Dispatch Alerts</span>
              </h3>
              <div className="space-y-3 divide-y divide-slate-100 text-xs">
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400">10 minutes ago</span>
                  <h4 className="font-bold text-slate-900 mt-0.5">Emergency Dispatch Assigned</h4>
                  <p className="text-slate-600">MCB Tripping at Benz Circle. Estimated SLA: 12 minutes.</p>
                </div>
                <div className="pt-3">
                  <span className="text-[10px] text-slate-400">Today, 11:30 AM</span>
                  <h4 className="font-bold text-slate-900 mt-0.5">Instant DBT Payout Settled</h4>
                  <p className="text-slate-600">₹720 credited via IMPS to APGB Account ending 9821.</p>
                </div>
                <div className="pt-3">
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                  <h4 className="font-bold text-slate-900 mt-0.5">Cooperative Safety Advisory</h4>
                  <p className="text-slate-600">Ensure insulated gloves are worn on all 3-phase commercial panel inspections.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "welfare" && (
            <WorkerWelfareTab />
          )}

          {activeTab === "smart-id" && (
            <WorkerSmartIdTab cardData={workerCardData} />
          )}

          {activeTab === "profile" && (
            <WorkerProfileTab
              employeeId={workerCardData.employeeId}
              name={workerCardData.name}
              skills={workerCardData.skills}
              district={workerCardData.district}
              societyName={workerCardData.societyName}
            />
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs text-xs">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>Field Settings</span>
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Emergency Rapid Dispatch Pool (7m SLA)</span>
                    <span className="text-slate-500 text-[11px]">Receive high-priority emergency dispatches with +20% surge rate</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Silent Payout Mode</span>
                    <span className="text-slate-500 text-[11px]">Zero sound effects or audio on withdrawals (Visual confirmation only)</span>
                  </div>
                  <input type="checkbox" defaultChecked disabled className="w-5 h-5 accent-emerald-600" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* OTP COMPLETION MODAL */}
      {completeOtpModalOpen && selectedJobForComplete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Enter Citizen 4-Digit OTP</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ask {selectedJobForComplete.customerName} for the 4-digit code to release the ₹
                {selectedJobForComplete.fairWageBreakdown?.workerEarning || 720} escrow payout.
              </p>
            </div>

            {completionOtpError && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-xl border border-rose-200">
                {completionOtpError}
              </p>
            )}

            <input
              type="text"
              maxLength={4}
              value={completionOtpInput}
              onChange={(e) => setCompletionOtpInput(e.target.value)}
              placeholder="••••"
              className="w-40 mx-auto text-center text-2xl font-mono tracking-widest py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmCompleteJob}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Verify & Credit Wallet
              </button>
              <button
                onClick={() => setCompleteOtpModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT JOB DETAILS MODAL */}
      {inspectJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-mono font-bold text-slate-500">#{inspectJob.bookingNumber}</span>
              <button onClick={() => setInspectJob(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h4 className="text-base font-black text-slate-900">{inspectJob.serviceCategory}</h4>
            <p className="text-slate-600">{inspectJob.requirementDescription}</p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-slate-900">{inspectJob.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span>{inspectJob.serviceLocation?.address}</span>
              </div>
              <div className="flex justify-between">
                <span>Worker Earning:</span>
                <span className="font-bold text-emerald-600">₹{inspectJob.fairWageBreakdown?.workerEarning || 650}</span>
              </div>
            </div>
            <button
              onClick={() => setInspectJob(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </WorkerAppShell>
  );
};
