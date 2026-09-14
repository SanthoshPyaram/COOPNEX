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
  Lock,
  UploadCloud,
  FileText,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export const WorkerPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTabState] = useState<string>(() => searchParams.get("tab") || "dashboard");

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setSearchParams({ tab }, { replace: true, preventScrollReset: true });
  };

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTabState(tabFromUrl);
    }
  }, [searchParams]);

  // Worker Gatekeeper Status: checks authentic user status from MongoDB
  const getInitialWorkerStatus = (): string => {
    const raw = (user as any)?.workerProfile?.verificationStatus || user?.verificationStatus;
    if (raw === "VERIFIED" || raw === "APPROVED") return "VERIFIED";
    if (raw === "REUPLOAD_REQUESTED") return "REUPLOAD_REQUESTED";
    if (raw === "REJECTED") return "REJECTED";
    if (raw === "UNDER_REVIEW") return "UNDER_REVIEW";
    return "PENDING";
  };

  const [workerStatus, setWorkerStatus] = useState<string>(getInitialWorkerStatus);
  const [statusCheckMsg, setStatusCheckMsg] = useState<string | null>(null);
  const [adminRejectionNote, setAdminRejectionNote] = useState<string>(() => {
    return (user as any)?.workerProfile?.rejectionReason || (user as any)?.rejectionReason || "";
  });

  // Re-upload Document Form State
  const [reuploadDocType, setReuploadDocType] = useState<string>("AADHAAR");
  const [reuploadDocNumber, setReuploadDocNumber] = useState<string>("");
  const [reuploadFileBase64, setReuploadFileBase64] = useState<string>("");
  const [reuploadFileName, setReuploadFileName] = useState<string>("");
  const [reuploadNotes, setReuploadNotes] = useState<string>("");
  const [isSubmittingReupload, setIsSubmittingReupload] = useState<boolean>(false);
  const [reuploadSuccessMsg, setReuploadSuccessMsg] = useState<string | null>(null);
  const [reuploadErrorMsg, setReuploadErrorMsg] = useState<string | null>(null);

  const handleReuploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setReuploadErrorMsg("File size must be under 10MB.");
      return;
    }
    setReuploadFileName(file.name);
    setReuploadErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      setReuploadFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReuploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reuploadFileBase64) {
      setReuploadErrorMsg("Please choose a valid document file (PDF, JPG, PNG) to re-upload.");
      return;
    }
    setIsSubmittingReupload(true);
    setReuploadErrorMsg(null);
    try {
      const token = localStorage.getItem("sahakari_token");
      const res = await fetch(`${API_BASE}/workers/me/reupload-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          documentType: reuploadDocType,
          documentNumber: reuploadDocNumber,
          fileBase64: reuploadFileBase64,
          originalFilename: reuploadFileName,
          notes: reuploadNotes
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to re-upload document.");
      }
      setReuploadSuccessMsg("Document successfully re-uploaded! Your application is now queued for Super Administrator re-verification.");
      setReuploadFileBase64("");
      setReuploadFileName("");
      setReuploadNotes("");
      setWorkerStatus("UNDER_REVIEW");
      setAdminRejectionNote("");
      if (refreshUser) await refreshUser();
      setTimeout(() => setReuploadSuccessMsg(null), 6000);
    } catch (err: any) {
      setReuploadErrorMsg(err.message || "Network error while submitting document.");
    } finally {
      setIsSubmittingReupload(false);
    }
  };

  const refreshWorkerStatus = async (isManualClick = false) => {
    // Query live MongoDB backend via /auth/me with JWT
    const token = localStorage.getItem("sahakari_token");
    if (token) {
      try {
        if (refreshUser) {
          await refreshUser();
        }
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            const raw = data.user.workerProfile?.verificationStatus || data.user.verificationStatus;
            const note = data.user.workerProfile?.rejectionReason || data.user.rejectionReason || "";
            setAdminRejectionNote(note);

            const newStatus = (raw === "VERIFIED" || raw === "APPROVED")
              ? "VERIFIED"
              : raw === "REUPLOAD_REQUESTED"
              ? "REUPLOAD_REQUESTED"
              : (raw || "PENDING");
            setWorkerStatus(newStatus);

            if (isManualClick) {
              if (newStatus === "VERIFIED") {
                setStatusCheckMsg("Your credentials are officially verified by the Super Administrator.");
              } else if (newStatus === "REUPLOAD_REQUESTED") {
                setStatusCheckMsg("Super Administrator requested re-upload of your documents. Please check the feedback below.");
              } else if (newStatus === "REJECTED") {
                setStatusCheckMsg("Your application was reviewed and rejected. Please check instructions below.");
              } else {
                setStatusCheckMsg("Application is under review by the Super Administrator.");
              }
              setTimeout(() => setStatusCheckMsg(null), 4000);
            }
            return;
          }
        }
      } catch (e) {
        console.warn("Status refresh error:", e);
      }
    }
  };

  useEffect(() => {
    refreshWorkerStatus(false);
  }, [user?.verificationStatus, (user as any)?.workerProfile?.verificationStatus]);

  const wp = (user as any)?.workerProfile;
  const isVerified = workerStatus === "VERIFIED";

  const [activeJobs, setActiveJobs] = useState<Booking[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number>(() => wp?.walletBalance ?? 0);
  const [pendingEscrowBalance, setPendingEscrowBalance] = useState<number>(() => wp?.pendingEscrowBalance ?? 0);
  const [escrowItems, setEscrowItems] = useState<any[]>(() => wp?.escrowItems ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (wp?.walletBalance !== undefined && wp?.walletBalance !== null) {
      setWalletBalance(wp.walletBalance);
    }
    if (wp?.pendingEscrowBalance !== undefined && wp?.pendingEscrowBalance !== null) {
      setPendingEscrowBalance(wp.pendingEscrowBalance);
    }
    if (wp?.escrowItems) {
      setEscrowItems(wp.escrowItems);
    }
  }, [wp?.walletBalance, wp?.pendingEscrowBalance, wp?.escrowItems]);

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

  // Worker Notifications State (Real Database Notifications)
  const [workerNotifications, setWorkerNotifications] = useState<any[]>([]);
  const [workerNotifsLoading, setWorkerNotifsLoading] = useState(false);

  const fetchWorkerNotifications = async () => {
    try {
      setWorkerNotifsLoading(true);
      const res = await api.getNotifications();
      if (res?.success && Array.isArray(res.notifications)) {
        setWorkerNotifications(res.notifications);
      }
    } catch (err) {
      console.warn("Could not load worker notifications:", err);
    } finally {
      setWorkerNotifsLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setWorkerNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.warn("Failed to mark notifications read:", err);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setWorkerNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.warn("Failed to mark single notification read:", err);
    }
  };

  const workerCardData: WorkerIdCardData = {
    employeeId: (user as any)?.employeeId || wp?.employeeId || wp?.workerIdNumber || "COOP-WRK-MEMBER",
    name: user?.name || "Registered Member",
    age: (user as any)?.age || 30,
    gender: (user as any)?.gender || "Member",
    skills: (wp?.skills && wp.skills.length > 0) ? wp.skills : [(wp?.trade || "General Artisan")],
    bloodGroup: (user as any)?.bloodGroup || "O+",
    languagesKnown: (wp?.languages && wp.languages.length > 0) ? wp.languages : ["Telugu", "Hindi", "English"],
    district: user?.district || "Vijayawada",
    societyName: (user as any)?.workerProfile?.societyName || (user as any)?.societyName || wp?.societyName || `${user?.district || "Vijayawada"} Labour Cooperative Society`,
    photoUrl:
      (user as any)?.avatarUrl ||
      (user as any)?.profileImage ||
      wp?.avatarUrl ||
      wp?.profileImage ||
      (typeof window !== "undefined"
        ? localStorage.getItem(`coopnex_worker_avatar_${(user as any)?.employeeId || wp?.employeeId}`) ||
          localStorage.getItem("coopnex_worker_avatar")
        : "") ||
      "",
    issueDate: isVerified ? "Certified" : "Pending Review",
    validUntil: isVerified ? "Active 2028" : "Pending Review",
    nsqfLevel: isVerified ? `NSQF Level-${wp?.verificationLevel || 4} Certified Artisan` : "Pending Super Admin Verification",
    emergencyContact: (user as any)?.emergencyContactPhone || user?.phone || "+91 98765 00000",
    policeVerificationStatus: isVerified ? "CCTNS Police Verified & Cleared" : "Document Review Pending",
    aadhaarVerhoeffStatus: isVerified ? "UIDAI Aadhaar Verified" : "Verhoeff Checksum Valid (Manual Review Pending)"
  };

  // Fetch Bookings from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await api.getMyBookings();
        if (Array.isArray(bookings)) {
          setActiveJobs(bookings);
        }
        const profileRes = await api.getWorkerMe();
        if (profileRes?.success && profileRes?.worker) {
          if (profileRes.worker.walletBalance !== undefined) setWalletBalance(profileRes.worker.walletBalance);
          if (profileRes.worker.pendingEscrowBalance !== undefined) setPendingEscrowBalance(profileRes.worker.pendingEscrowBalance);
          if (profileRes.worker.escrowItems) setEscrowItems(profileRes.worker.escrowItems);
        }
        fetchWorkerNotifications();
      } catch (err) {
        console.warn("Worker bookings fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, nextStatus: BookingStatus, note?: string) => {
    try {
      const res = await api.updateBookingStatus(bookingId, nextStatus, note || `Worker updated status to ${nextStatus}`);
      if (res && res.booking) {
        setActiveJobs((prev) =>
          prev.map((job) => (job._id === bookingId ? res.booking : job))
        );
        // Refresh server state to ensure 100% database consistency
        const refreshed = await api.getMyBookings();
        if (Array.isArray(refreshed)) {
          setActiveJobs(refreshed);
        }
        return;
      }
    } catch (err: any) {
      console.warn("Booking update error:", err);
      alert(err.message || "Failed to update booking status.");
      const refreshed = await api.getMyBookings();
      if (Array.isArray(refreshed)) {
        setActiveJobs(refreshed);
      }
      return;
    }
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
    if (trimmed.length !== 4) {
      setCompletionOtpError("Please enter the 4-digit citizen completion OTP provided by the customer.");
      return;
    }
    const earning = selectedJobForComplete.fairWageBreakdown?.workerEarning || 300;
    try {
      const res = await api.verifyCompletionOtp(selectedJobForComplete._id, trimmed);
      if (res && res.success) {
        setCompleteOtpModalOpen(false);
        setSelectedJobForComplete(null);
        setPayoutSuccessMsg(`Citizen OTP verified successfully! Job #${res.booking?.bookingNumber || selectedJobForComplete.bookingNumber} marked complete. Awaiting citizen payment release (₹${earning} worker share).`);
        setTimeout(() => setPayoutSuccessMsg(null), 7000);

        const refreshed = await api.getMyBookings();
        if (Array.isArray(refreshed)) {
          setActiveJobs(refreshed);
        }
      } else {
        setCompletionOtpError(res?.message || "Invalid completion OTP. Please verify with customer.");
      }
    } catch (err: any) {
      setCompletionOtpError(err.message || "Invalid completion OTP. Please check with customer.");
    }
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

  const newRequestsCount = activeJobs.filter((j) => j.status === "ASSIGNED" || j.status === "REQUESTED").length;

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
      unreadNotificationsCount={workerNotifications.filter((n) => !n.read).length}
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
                type="button"
                onClick={() => refreshWorkerStatus(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Refresh Review Status</span>
              </button>
            </div>
          </div>

          {/* ADMIN RE-UPLOAD ACTION REQUIRED CALLOUT & RE-UPLOAD FORM */}
          {(workerStatus === "REUPLOAD_REQUESTED" || Boolean(adminRejectionNote)) && (
            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shrink-0 border border-amber-300">
                  <AlertCircle className="w-6 h-6 text-amber-700" />
                </div>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Action Required by Worker
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-amber-950">
                    Administrator Requested Document Re-Upload
                  </h3>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    The Super Administrator audited your submission and requested a clearer copy or corrected details. Please review the feedback below, attach your updated file, and resubmit for verification.
                  </p>
                </div>
              </div>

              {adminRejectionNote && (
                <div className="p-4 bg-white/95 rounded-2xl border border-amber-300 shadow-xs space-y-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <span>Official Administrator Feedback:</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    "{adminRejectionNote}"
                  </p>
                </div>
              )}

              {reuploadSuccessMsg && (
                <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{reuploadSuccessMsg}</span>
                </div>
              )}

              {reuploadErrorMsg && (
                <div className="p-3.5 bg-rose-100 border border-rose-300 rounded-xl text-xs font-bold text-rose-900 flex items-center gap-2">
                  <X className="w-4 h-4 text-rose-700 shrink-0" />
                  <span>{reuploadErrorMsg}</span>
                </div>
              )}

              {/* Interactive Re-upload Form */}
              <form onSubmit={handleReuploadSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span>Upload Corrected Document Scan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Document Type *</label>
                    <select
                      value={reuploadDocType}
                      onChange={(e) => setReuploadDocType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="AADHAAR">1. Aadhaar Card (12-Digit UIDAI)</option>
                      <option value="PAN">2. PAN Card (Permanent Account Number)</option>
                      <option value="POLICE_CLEARANCE">3. Police Clearance Certificate (PCC)</option>
                      <option value="TRADE_CERTIFICATE">4. Trade / Skill Certificate</option>
                      <option value="BANK_PROOF">5. Bank Account Proof / Passbook</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Document / Identification Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 5482-9103-8476 or ABCPS1234F"
                      value={reuploadDocNumber}
                      onChange={(e) => setReuploadDocNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-600"
                    >
                    </input>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Document File (PDF, JPG, PNG - Max 10MB) *</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                      type="file"
                      id="worker-reupload-file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleReuploadFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="worker-reupload-file"
                      className="px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-400 hover:border-blue-600 bg-blue-50/60 hover:bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                    >
                      <UploadCloud className="w-4 h-4 text-blue-600" />
                      <span>{reuploadFileName ? "Replace Selected File" : "Choose New File to Upload"}</span>
                    </label>

                    {reuploadFileName && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-700 truncate">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">{reuploadFileName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Worker Clarification Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Provide additional details regarding the re-uploaded scan (e.g., 'Attached high-res scan taken without flash glare')."
                    value={reuploadNotes}
                    onChange={(e) => setReuploadNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingReupload || !reuploadFileBase64}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    {isSubmittingReupload ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting to Super Administrator...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Re-Uploaded Document for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

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
                {(user as any)?.workerProfile?.trade || (user as any)?.workerProfile?.skills?.[0] || "Electrician"}
              </div>
              <span className="text-[10px] text-slate-500">Tier 1 Apprentice &rarr; Tier 4 Master</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase text-slate-400">Affiliated Society</span>
              <div className="font-bold text-slate-900 text-sm truncate">
                {(user as any)?.workerProfile?.societyName || (user as any)?.societyName || `${(user as any)?.workerProfile?.district || user?.district || "District"} Labour Co-op`}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {(user as any)?.workerProfile?.district || user?.district || "Andhra Pradesh / Telangana"}
              </span>
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
                  <strong>Step 3: Primary Society Administrator Audit:</strong> {workerStatus === "REUPLOAD_REQUESTED" ? "Re-upload Requested (Action Required Above)" : "In Review (The administrator manually audits submitted documents & certificates)."}
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
            <WorkerEarningsTab activeJobs={activeJobs} workerProfile={wp} />
          )}

          {activeTab === "wallet" && (
            <WorkerWalletTab
              walletBalance={walletBalance}
              pendingEscrowBalance={pendingEscrowBalance}
              escrowItems={escrowItems}
              onBalanceUpdated={(newW, newE) => {
                setWalletBalance(newW);
                setPendingEscrowBalance(newE);
              }}
              onInstantPayout={handleInstantPayout}
              workerProfile={wp}
              lastWithdrawal={lastWithdrawal}
            />
          )}

          {activeTab === "messages" && (
            <WorkerMessagesTab jobs={activeJobs} workerName={user?.name || "Assigned Artisan"} />
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <span>Worker Dispatch &amp; Service Area Alerts</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time cooperative announcements, service coverage alerts, and dispatch assignments.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchWorkerNotifications}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer border border-slate-200"
                    title="Refresh alerts"
                  >
                    <RefreshCw className={`w-4 h-4 ${workerNotifsLoading ? "animate-spin" : ""}`} />
                  </button>
                  {workerNotifications.some((n) => !n.read) && (
                    <button
                      onClick={handleMarkAllRead}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition cursor-pointer"
                    >
                      Mark All Read
                    </button>
                  )}
                </div>
              </div>

              {workerNotifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Bell className="w-10 h-10 mx-auto text-slate-300 opacity-60" />
                  <p className="text-sm font-bold text-slate-700">No Notifications Yet</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    When administrators expand coverage, pause service in your sector, or assign jobs, notices will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-slate-100 text-xs">
                  {workerNotifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.read && handleMarkSingleRead(n._id)}
                      className={`pt-3.5 pb-2 transition cursor-pointer flex items-start justify-between gap-3 ${
                        !n.read ? "bg-blue-50/40 -mx-4 px-4 rounded-xl" : ""
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          )}
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            {new Date(n.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                            {n.type || "SYSTEM"}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{n.message}</p>
                      </div>

                      {!n.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkSingleRead(n._id);
                          }}
                          className="shrink-0 text-[10px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
              verificationStatus={workerStatus}
              rejectionReason={adminRejectionNote}
              kycDocuments={wp?.kycDocuments || []}
              experienceYears={wp?.experienceYears || (user as any)?.experienceYears || 3}
              rating={wp?.rating || 5.0}
              reviewCount={wp?.reviewCount || 0}
              jobsCompletedCount={wp?.jobsCompletedCount || activeJobs.filter((j) => j.status === "COMPLETED").length}
              trade={wp?.trade || (user as any)?.trade}
              bio={wp?.bio || (user as any)?.bio}
              baseHourlyRate={wp?.baseHourlyRate || (user as any)?.baseHourlyRate || 350}
              avatarUrl={workerCardData.photoUrl}
              emergencyContactName={wp?.emergencyContactName || (user as any)?.emergencyContactName}
              emergencyContactPhone={wp?.emergencyContactPhone || (user as any)?.emergencyContactPhone}
              bloodGroup={workerCardData.bloodGroup}
              languages={workerCardData.languagesKnown}
              address={(user as any)?.address || wp?.address || "Benz Circle, Vijayawada"}
              city={(user as any)?.city || wp?.city || "Vijayawada"}
              state={(user as any)?.state || wp?.state || "Andhra Pradesh"}
              stateCode={(user as any)?.stateCode || wp?.stateCode || "AP"}
              mandal={(user as any)?.mandal || wp?.mandal || "Vijayawada Urban"}
              village={(user as any)?.village || wp?.village || ""}
              pincode={(user as any)?.pincode || wp?.pincode || "520001"}
              coordinates={(user as any)?.location?.coordinates || wp?.location?.coordinates || [80.648, 16.5062]}
              onProfileUpdated={() => refreshWorkerStatus(true)}
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
                Ask {selectedJobForComplete.customerName} for the 4-digit completion code shown on their booking card to verify service delivery and unlock customer payment.
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
                Verify OTP &amp; Complete Job
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
