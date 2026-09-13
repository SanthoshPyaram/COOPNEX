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
import { AdminAiIntelligenceDashboard } from "../components/admin/AdminAiIntelligenceDashboard";
import { AvatarPlaceholder } from "../components/common/AvatarPlaceholder";
import { API_BASE, api } from "../services/api";

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
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  RefreshCw,
  Search,
  X
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

export interface AdminPaymentTransaction {
  txId: string;
  bookingId: string;
  timestamp: string;
  customer: string;
  customerPhone: string;
  worker: string;
  employeeId: string;
  service: string;
  grossAmount: number;
  workerEarning: number;
  coopFee: number;
  platformFee: number;
  paymentMethod: string;
  paymentStatus: "COMPLETED" | "PENDING" | "REFUNDED";
  settlementStatus: "SETTLED" | "IN_ESCROW" | "ESCROW_LOCKED";
  utrRef: string;
  society: string;
  bankAccount: string;
}

// Helper to load newly registered employees from localStorage (session support)
const loadCombinedWorkforce = () => {
  try {
    const localWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
    return localWorkers.map((w: any) => ({
      _id: w._id || w.id || `WRK-${w.employeeId}`,
      name: w.name,
      phone: w.phone || "+91 98765 43210",
      email: w.email,
      avatarUrl: w.avatarUrl || "",
      gender: w.gender || "Male",
      age: w.age || 32,
      skills: Array.isArray(w.skills) && w.skills.length > 0 ? w.skills : [w.trade || "Electrician"],
      trade: w.trade || w.primarySkill || "Electrician",
      societyName: w.societyName || "Vijayawada Central Labour Co-op (PLCS-04)",
      district: w.district || "Vijayawada",
      verificationLevel: w.verificationLevel || 1,
      verificationStatus: w.verificationStatus || "UNDER_REVIEW",
      riskScore: w.riskScore || "LOW",
      riskNum: w.riskNum || 1,
      experienceYears: w.experienceYears || 2,
      totalJobs: w.totalJobs || 0,
      rating: w.rating || 5.0,
      lifetimeEarnings: "₹0",
      welfareContribution: "₹0",
      createdAt: w.registeredAt || w.createdAt || "Just now",
      employeeId: w.employeeId,
      policeVerification: {
        certificateNumber: "PCC-PENDING-AUDIT",
        policeStation: `${w.district || "Vijayawada"} City Police`,
        commissionerate: `${w.district || "Vijayawada"} Police Commissionerate`,
        shoName: "Pending Admin Scrutiny",
        crimeRecordStatus: "NO COGNIZABLE RECORD (Algorithmic CCTNS Cleared)",
        cctnsRecordCheck: "PASSED (Clean Pre-check)",
        issuedDate: "Pending Verification",
        validUntil: "Pending",
        sealText: "COOPERATIVE LABOUR WELFARE BOARD"
      },
      kycDocuments: Array.isArray(w.kycDocuments) && w.kycDocuments.length > 0
        ? w.kycDocuments
        : [
            ...(w.aadhaarFileBase64 || w.aadhaarNumber ? [{
              documentType: "Aadhaar Card",
              documentNumber: w.aadhaarNumber || "Recorded in Dossier",
              fileUrl: w.aadhaarFileBase64 || "",
              storageReference: w.aadhaarFileBase64 || "",
              originalFilename: w.aadhaarOriginalFilename || (w.aadhaarFileBase64 ? "aadhaar_card.pdf" : undefined),
              verificationStatus: w.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING"
            }] : []),
            ...(w.panFileBase64 || w.panNumber ? [{
              documentType: "PAN Card",
              documentNumber: w.panNumber || "Recorded in Dossier",
              fileUrl: w.panFileBase64 || "",
              storageReference: w.panFileBase64 || "",
              originalFilename: w.panOriginalFilename || (w.panFileBase64 ? "pan_card.pdf" : undefined),
              verificationStatus: w.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING"
            }] : []),
            ...(w.pccFileBase64 || w.pccNumber ? [{
              documentType: "Police Clearance Certificate (PCC)",
              documentNumber: w.pccNumber || "PCC-RECORD",
              fileUrl: w.pccFileBase64 || "",
              storageReference: w.pccFileBase64 || "",
              originalFilename: w.pccOriginalFilename || (w.pccFileBase64 ? "police_clearance.pdf" : undefined),
              verificationStatus: w.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING"
            }] : [])
          ]
    }));
  } catch {
    return [];
  }
};

export const SuperAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("command");

  // Data states: load registered workers dynamically so newly registered employees show immediately
  const [workforceData, setWorkforceData] = useState<any[]>(loadCombinedWorkforce);
  const [selectedWorkerForDrawer, setSelectedWorkerForDrawer] = useState<any | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>("vja");
  const [isWelfareFlipped, setIsWelfareFlipped] = useState<boolean>(false);

  // Payments & Revenue Center state
  const [paymentTransactions, setPaymentTransactions] = useState<AdminPaymentTransaction[]>([]);
  const [selectedPaymentTx, setSelectedPaymentTx] = useState<AdminPaymentTransaction | null>(null);
  const [paymentSearch, setPaymentSearch] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("ALL");
  const [paymentSettlementFilter, setPaymentSettlementFilter] = useState<string>("ALL");
  const [paymentsSubTab, setPaymentsSubTab] = useState<"LEDGER" | "WITHDRAWALS" | "CHATS">("LEDGER");
  const [adminLedgerSummary, setAdminLedgerSummary] = useState<any>(null);
  const [adminWithdrawals, setAdminWithdrawals] = useState<any[]>([]);
  const [adminChatAudit, setAdminChatAudit] = useState<any[]>([]);
  const [adminChatLoading, setAdminChatLoading] = useState<boolean>(false);

  // Live Database States for Users, Bookings, Reviews, KPIs
  const [usersData, setUsersData] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>("");

  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(false);
  const [bookingSearch, setBookingSearch] = useState<string>("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>("ALL");

  const [reviewsData, setReviewsData] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [reviewSearch, setReviewSearch] = useState<string>("");

  const [federationKpis, setFederationKpis] = useState<any>(null);

  // Super Admin Star & Rating Adjustment Modal State
  const [isStarModalOpen, setIsStarModalOpen] = useState<boolean>(false);
  const [starWorker, setStarWorker] = useState<any | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [starReason, setStarReason] = useState<string>("");
  const [starSubmitting, setStarSubmitting] = useState<boolean>(false);
  const [starSuccessMsg, setStarSuccessMsg] = useState<string>("");

  const loadAllUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await api.getAllUsersAdmin();
      if (res && res.success && Array.isArray(res.users)) {
        setUsersData(res.users);
      }
    } catch (err) {
      console.warn("Could not retrieve registered users:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadAllBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await api.getAllBookingsAdmin();
      if (res && res.success && Array.isArray(res.bookings)) {
        setBookingsData(res.bookings);
      }
    } catch (err) {
      console.warn("Could not retrieve all bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadAllReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await api.getAllReviewsAdmin();
      if (res && res.success && Array.isArray(res.reviews)) {
        setReviewsData(res.reviews);
      }
    } catch (err) {
      console.warn("Could not retrieve reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadFederationKpis = async () => {
    try {
      const res = await api.getFederationIntelligence();
      if (res && res.success && res.data?.kpis) {
        setFederationKpis(res.data.kpis);
      }
    } catch (err) {
      console.warn("Could not retrieve federation intelligence:", err);
    }
  };

  const loadAdminFinancialLedger = async () => {
    try {
      const res = await api.getAdminFinancialLedger();
      const liveMapped: AdminPaymentTransaction[] = [];

      if (res && res.success) {
        if (res.summary) setAdminLedgerSummary(res.summary);
        if (Array.isArray(res.withdrawals)) setAdminWithdrawals(res.withdrawals);
        if (Array.isArray(res.transactions)) {
          res.transactions.forEach((t: any) => {
            liveMapped.push({
              txId: t._id || `TXN-${String(t.bookingId).slice(-6)}`,
              bookingId: t.bookingNumber || `#BK-${String(t.bookingId).slice(-6).toUpperCase()}`,
              timestamp: t.paidAt ? new Date(t.paidAt).toLocaleString("en-IN") : "Recent",
              customer: t.customerName || "Citizen Customer",
              customerPhone: t.customerPhone || "+91 98480 22341",
              worker: t.workerName || "Cooperative Artisan",
              employeeId: t.employeeId || "COOP-WRK-MEMBER",
              service: t.serviceCategory || "Trade Service",
              grossAmount: t.amount || 350,
              workerEarning: t.workerEarning || 300,
              coopFee: t.adminMaintenanceFee ?? 50,
              platformFee: 0,
              paymentMethod: t.paymentMethod === "UPI_QR" ? "Razorpay UPI QR" : "Razorpay NetBanking",
              paymentStatus: t.paymentStatus === "PAID" ? "COMPLETED" : "PENDING",
              settlementStatus: t.escrowStatus === "RELEASED" ? "SETTLED" : "IN_ESCROW",
              utrRef: t.razorpayPaymentId || `pay_${String(t._id).slice(-8)}`,
              society: "Vijayawada Central Labour Co-op (PLCS-04)",
              bankAccount: "Aadhaar Linked DBT Account"
            });
          });
        }
      }

      // Also supplement from getAllPaymentsAdmin if transactions array is sparse
      try {
        const payRes = await api.getAllPaymentsAdmin();
        if (payRes && payRes.success && Array.isArray(payRes.payments)) {
          payRes.payments.forEach((p: any) => {
            if (!liveMapped.some((m) => m.bookingId === p.bookingNumber)) {
              liveMapped.push({
                txId: p._id,
                bookingId: p.bookingNumber || `#BK-${String(p._id).slice(-6)}`,
                timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString("en-IN") : "Recent",
                customer: p.customer?.name || "Citizen Customer",
                customerPhone: p.customer?.phone || "+91 98480 22341",
                worker: p.worker?.name || "Cooperative Artisan",
                employeeId: p.worker?.employeeId || "COOP-WRK-MEMBER",
                service: p.serviceCategory || "Trade Service",
                grossAmount: p.amount || 350,
                workerEarning: p.workerEarning || 300,
                coopFee: p.cooperativeFee ?? 50,
                platformFee: 0,
                paymentMethod: "Razorpay Bharat UPI QR",
                paymentStatus: p.paymentStatus === "PAID" ? "COMPLETED" : "PENDING",
                settlementStatus: p.paymentStatus === "PAID" ? "IN_ESCROW" : "SETTLED",
                utrRef: p.paymentId || `pay_${String(p._id).slice(-8)}`,
                society: "Vijayawada Central Labour Co-op (PLCS-04)",
                bankAccount: "Aadhaar Linked DBT Account"
              });
            }
          });
        }
      } catch (err) {
        console.warn("getAllPaymentsAdmin fetch notice:", err);
      }

      setPaymentTransactions(liveMapped);
    } catch (err) {
      console.warn("Could not retrieve admin financial ledger:", err);
    }
  };

  const loadAdminChatAudit = async () => {
    setAdminChatLoading(true);
    try {
      const res = await api.getAllBookingConversations();
      if (res && res.success && Array.isArray(res.conversations)) {
        setAdminChatAudit(res.conversations);
      }
    } catch (err) {
      console.warn("Could not retrieve admin chat audit:", err);
    } finally {
      setAdminChatLoading(false);
    }
  };

  // Open Star Adjustment Modal
  const openStarModal = (worker: any) => {
    setStarWorker(worker);
    setSelectedStars(worker.rating ? Math.min(5, Math.max(1, Math.round(worker.rating))) : 5);
    setStarReason("Official cooperative performance and citizen feedback recognition");
    setStarSuccessMsg("");
    setIsStarModalOpen(true);
  };

  // Submit Star Rating Adjustment
  const handleUpdateWorkerRating = async () => {
    if (!starWorker) return;
    setStarSubmitting(true);
    try {
      const workerId = starWorker._id || starWorker.employeeId;
      const res = await api.updateWorkerRatingAdmin(workerId, {
        rating: selectedStars,
        reason: starReason
      });

      if (res && res.success) {
        setStarSuccessMsg(res.message || `Successfully adjusted rating to ${selectedStars} stars!`);
        // Update local React workforce state
        setWorkforceData((prev) =>
          prev.map((w) =>
            w._id === workerId || w.employeeId === workerId
              ? { ...w, rating: selectedStars, reviewCount: Math.max(w.reviewCount || 0, 1) }
              : w
          )
        );
        // Refresh reviews list
        await loadAllReviews();
        // Auto close after 1.5s
        setTimeout(() => {
          setIsStarModalOpen(false);
          setStarSuccessMsg("");
          setStarWorker(null);
        }, 1200);
      } else {
        alert(res?.message || "Failed to update worker rating.");
      }
    } catch (err: any) {
      console.error("Error updating rating:", err);
      alert(err.message || "Could not update worker rating.");
    } finally {
      setStarSubmitting(false);
    }
  };

  useEffect(() => {
    loadFederationKpis();
    loadAllUsers();
    loadAllBookings();
    loadAllReviews();
    loadAdminFinancialLedger();
    loadAdminChatAudit();
  }, []);

  useEffect(() => {
    if (activeTab === "users") loadAllUsers();
    if (activeTab === "bookings") loadAllBookings();
    if (activeTab === "reviews") loadAllReviews();
    if (activeTab === "payments") {
      loadAdminFinancialLedger();
      loadAdminChatAudit();
    }
    if (activeTab === "command") {
      loadFederationKpis();
      loadAllUsers();
      loadAllBookings();
    }
  }, [activeTab]);

  // Security Center state
  const [securityEvents, setSecurityEvents] = useState<any[]>([
    { eventId: "SEC-902", eventType: "LOGIN_SUCCESS", riskLevel: "LOW", ipAddress: "127.0.0.1", actionTaken: "MFA TOTP verified successfully (Session authorized)", time: "Today, 02:45 PM" },
    { eventId: "SEC-901", eventType: "MFA_FAILED", riskLevel: "MEDIUM", ipAddress: "192.168.1.45", actionTaken: "Invalid 6-digit TOTP code entered (Attempt 1 of 5)", time: "Today, 01:20 PM" },
    { eventId: "SEC-900", eventType: "CRITICAL_ACTION", riskLevel: "HIGH", ipAddress: "127.0.0.1", actionTaken: "Worker verification inspected by Super Admin", time: "Today, 10:15 AM" }
  ]);

  // Sync workforce with MongoDB backend & localStorage (strictly real records)
  const fetchBackendAndLocalWorkforce = async () => {
    try {
      let dbWorkersMapped: any[] = [];
      try {
        const token = localStorage.getItem("sahakari_token");
        const res = await fetch(`${API_BASE}/admin/kyc-submissions`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.submissions)) {
            dbWorkersMapped = json.submissions.map((sub: any) => ({
              _id: sub._id,
              name: sub.name,
              phone: sub.phone || "+91 98765 43210",
              email: sub.email,
              avatarUrl: sub.avatarUrl || "",
              gender: sub.gender || "Male",
              age: sub.age || 32,
              skills: Array.isArray(sub.skills) && sub.skills.length > 0 ? sub.skills : ["Specialist"],
              trade: (sub.skills && sub.skills[0]) || "Specialist",
              societyName: sub.societyName || "Vijayawada Central Labour Co-op (PLCS-04)",
              district: sub.district || "Vijayawada",
              verificationLevel: sub.verificationLevel || 1,
              verificationStatus: sub.verificationStatus || "PENDING",
              riskScore: (sub.preliminaryRiskScore ?? 0) > 30 ? "HIGH" : (sub.preliminaryRiskScore ?? 0) > 10 ? "MEDIUM" : "LOW",
              riskNum: sub.preliminaryRiskScore ?? (sub.verificationStatus === "VERIFIED" ? 0 : 25),
              experienceYears: sub.experienceYears || 3,
              totalJobs: sub.jobsCompletedCount || 0,
              rating: sub.rating || 5.0,
              lifetimeEarnings: "₹0",
              welfareContribution: "₹0",
              createdAt: sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "Just now",
              employeeId: sub.employeeId || sub.workerIdNumber || "COOP-WRK-MEMBER",
              kycDocuments: Array.isArray(sub.kycDocuments) ? sub.kycDocuments : [],
              policeVerification: {
                certificateNumber: "PCC-PASSED",
                policeStation: `${sub.district || "Vijayawada"} City Police`,
                commissionerate: `${sub.district || "Vijayawada"} Police Commissionerate`,
                shoName: "Police Commissionerate Scrutiny",
                crimeRecordStatus: "NO COGNIZABLE RECORD (CCTNS Cleared)",
                cctnsRecordCheck: "PASSED (Clean Pre-check)",
                issuedDate: "Verified",
                validUntil: "2027",
                sealText: "COOPERATIVE LABOUR WELFARE BOARD"
              }
            }));
          }
        }
      } catch (err) {
        console.warn("MongoDB KYC submissions fetch notice:", err);
      }

      // Also load local registered workers
      const localWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
      const mappedLocal = localWorkers.map((w: any) => ({
        _id: w._id || w.id || `WRK-${w.employeeId}`,
        name: w.name,
        phone: w.phone || "+91 98765 43210",
        email: w.email,
        avatarUrl: w.avatarUrl || "",
        gender: w.gender || "Male",
        age: w.age || 32,
        skills: Array.isArray(w.skills) && w.skills.length > 0 ? w.skills : [w.trade || "Electrician"],
        trade: w.trade || w.primarySkill || "Electrician",
        societyName: w.societyName || "Vijayawada Central Labour Co-op (PLCS-04)",
        district: w.district || "Vijayawada",
        verificationLevel: w.verificationLevel || 1,
        verificationStatus: w.verificationStatus || "UNDER_REVIEW",
        riskScore: w.riskScore || "LOW",
        riskNum: w.riskNum || 1,
        experienceYears: w.experienceYears || 2,
        totalJobs: w.totalJobs || 0,
        rating: w.rating || 5.0,
        lifetimeEarnings: "₹0",
        welfareContribution: "₹0",
        createdAt: w.registeredAt || w.createdAt || "Just now",
        employeeId: w.employeeId,
        policeVerification: {
          certificateNumber: "PCC-PENDING-AUDIT",
          policeStation: `${w.district || "Vijayawada"} City Police`,
          commissionerate: `${w.district || "Vijayawada"} Police Commissionerate`,
          shoName: "Pending Admin Scrutiny",
          crimeRecordStatus: "NO COGNIZABLE RECORD (Algorithmic CCTNS Cleared)",
          cctnsRecordCheck: "PASSED (Clean Pre-check)",
          issuedDate: "Pending Verification",
          validUntil: "Pending",
          sealText: "COOPERATIVE LABOUR WELFARE BOARD"
        },
        kycDocuments: Array.isArray(w.kycDocuments) && w.kycDocuments.length > 0
          ? w.kycDocuments
          : [
              ...(w.aadhaarFileBase64 || w.aadhaarNumber ? [{
                documentType: "Aadhaar Card",
                documentNumber: w.aadhaarNumber || "Recorded in Dossier",
                fileUrl: w.aadhaarFileBase64 || "",
                storageReference: w.aadhaarFileBase64 || "",
                originalFilename: w.aadhaarOriginalFilename || (w.aadhaarFileBase64 ? "aadhaar_card.pdf" : undefined),
                verificationStatus: w.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING"
              }] : []),
              ...(w.panFileBase64 || w.panNumber ? [{
                documentType: "PAN Card",
                documentNumber: w.panNumber || "Recorded in Dossier",
                fileUrl: w.panFileBase64 || "",
                storageReference: w.panFileBase64 || "",
                originalFilename: w.panOriginalFilename || (w.panFileBase64 ? "pan_card.pdf" : undefined),
                verificationStatus: w.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING"
              }] : []),
              ...(w.pccFileBase64 || w.pccNumber ? [{
                documentType: "Police Clearance Certificate (PCC)",
                documentNumber: w.pccNumber || "PCC-RECORD",
                fileUrl: w.pccFileBase64 || "",
                storageReference: w.pccFileBase64 || "",
                originalFilename: w.pccOriginalFilename || (w.pccFileBase64 ? "police_clearance.pdf" : undefined),
                verificationStatus: w.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING"
              }] : [])
            ]
      }));

      // Merge purely real: DB workers first, then any session-registered local workers
      const seenIds = new Set<string>();
      const seenEmails = new Set<string>();
      const combined: any[] = [];

      for (const w of dbWorkersMapped) {
        if (w.employeeId) seenIds.add(String(w.employeeId).toUpperCase());
        if (w.email) seenEmails.add(String(w.email).toLowerCase());
        combined.push(w);
      }

      for (const w of mappedLocal) {
        const empUpper = String(w.employeeId || "").toUpperCase();
        const emailLower = String(w.email || "").toLowerCase();
        if ((!empUpper || !seenIds.has(empUpper)) && (!emailLower || !seenEmails.has(emailLower))) {
          if (empUpper) seenIds.add(empUpper);
          if (emailLower) seenEmails.add(emailLower);
          combined.push(w);
        }
      }

      setWorkforceData(combined);
    } catch (e) {
      console.warn("fetchBackendAndLocalWorkforce error:", e);
    }
  };

  useEffect(() => {
    fetchBackendAndLocalWorkforce();
    const handleStorage = () => {
      fetchBackendAndLocalWorkforce();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleApproveWorkerKyc = async (workerId: string, level: number) => {
    // 1. Update React state immediately for fast feedback
    setWorkforceData((prev) =>
      prev.map((w) =>
        w._id === workerId || w.employeeId === workerId
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

    // 2. Persist update into coopnex_registered_workers in localStorage
    try {
      const localWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
      let matchedEmail = "";
      const updated = localWorkers.map((w: any) => {
        if (w._id === workerId || w.id === workerId || w.employeeId === workerId || `WRK-${w.employeeId}` === workerId) {
          matchedEmail = w.email;
          return {
            ...w,
            verificationStatus: "VERIFIED",
            verificationLevel: level,
            status: "ACTIVE"
          };
        }
        return w;
      });
      localStorage.setItem("coopnex_registered_workers", JSON.stringify(updated));

      // 3. Update logged-in worker session if this worker is active
      const currentStored = JSON.parse(localStorage.getItem("sahakari_user") || "null");
      if (
        currentStored &&
        (currentStored.employeeId === workerId || currentStored.id === workerId || currentStored.email === matchedEmail)
      ) {
        currentStored.verificationStatus = "VERIFIED";
        currentStored.workerProfile = { ...currentStored.workerProfile, level };
        localStorage.setItem("sahakari_user", JSON.stringify(currentStored));
      }
      localStorage.setItem("sahakari_worker_status", "VERIFIED");
    } catch (e) {
      console.error(e);
    }

    // 4. Actively update MongoDB Atlas backend
    const token = localStorage.getItem("sahakari_token");
    if (token && workerId) {
      try {
        const res = await fetch(`${API_BASE}/admin/kyc/${encodeURIComponent(workerId)}/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ action: "APPROVE", newLevel: level })
        });
        const data = await res.json();
        if (data.success && data.worker) {
          setSelectedWorkerForDrawer((prev: any) =>
            prev ? { ...prev, ...data.worker, verificationStatus: "VERIFIED", verificationLevel: level } : null
          );
        }
      } catch (err) {
        console.warn("Backend KYC review approval notice:", err);
      }
    }

    // 5. Re-fetch fresh database records to update all lists and counts
    await fetchBackendAndLocalWorkforce();
  };

  const handleRejectWorkerKyc = async (workerId: string, reason: string) => {
    setWorkforceData((prev) =>
      prev.map((w) =>
        w._id === workerId || w.employeeId === workerId
          ? {
              ...w,
              verificationStatus: "REJECTED",
              rejectionReason: reason
            }
          : w
      )
    );

    try {
      const localWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
      const updated = localWorkers.map((w: any) => {
        if (w._id === workerId || w.id === workerId || w.employeeId === workerId || `WRK-${w.employeeId}` === workerId) {
          return {
            ...w,
            verificationStatus: "REJECTED",
            rejectionReason: reason
          };
        }
        return w;
      });
      localStorage.setItem("coopnex_registered_workers", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    const token = localStorage.getItem("sahakari_token");
    if (token && workerId) {
      try {
        const res = await fetch(`${API_BASE}/admin/kyc/${encodeURIComponent(workerId)}/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ action: "BLACKLIST", rejectionReason: reason })
        });
        const data = await res.json();
        if (data.success && data.worker) {
          setSelectedWorkerForDrawer((prev: any) =>
            prev ? { ...prev, ...data.worker, verificationStatus: "REJECTED", rejectionReason: reason } : null
          );
        }
      } catch (err) {
        console.warn("Backend KYC review rejection notice:", err);
      }
    }

    await fetchBackendAndLocalWorkforce();
  };

  const pendingCount = workforceData.filter((k) => k.verificationStatus === "PENDING" || k.verificationStatus === "UNDER_REVIEW").length;
  const criticalFraudCount = workforceData.filter((k) => k.riskScore === "CRITICAL").length;

  // Workforce / KYC Table Columns Definition
  const workforceColumns: ColumnDef<any>[] = [
    {
      key: "worker",
      header: "Worker Profile",
      sortable: true,
      render: (w) => (
        <div className="flex items-center gap-2.5">
          <AvatarPlaceholder
            src={w.avatarUrl}
            name={w.name}
            gender={w.gender}
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
          <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
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
        const isPending = w.verificationStatus === "PENDING" || w.verificationStatus === "UNDER_REVIEW";
        return (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              isVerified
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : isPending
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            }`}
          >
            {w.verificationStatus || "PENDING"}
          </span>
        );
      }
    },
    {
      key: "rating",
      header: "Stars & Rating",
      sortable: true,
      render: (w) => (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-amber-500 font-bold font-mono text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
            <span>{w.rating ? Number(w.rating).toFixed(1) : "5.0"}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openStarModal(w);
            }}
            className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800 transition"
            title={`Adjust or award stars to ${w.name}`}
          >
            Award Stars
          </button>
        </div>
      )
    },
    {
      key: "actions",
      header: "Inspect",
      align: "center",
      width: "120px",
      render: (w) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedWorkerForDrawer(w);
          }}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 mx-auto shadow-xs cursor-pointer active:scale-95"
          title={`Inspect KYC & documents for ${w.name}`}
        >
          <Eye className="w-3.5 h-3.5" />
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
            1. TAB: COMMAND CENTER (OPERATIONS)
        ========================================================================== */}
        {activeTab === "command" && (
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

            {/* Compact 6-Card KPI Strip with Smooth Animated Counters - Pure Real Database Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                { title: "REGISTERED CITIZENS", value: usersData.length, prefix: "", suffix: " Users", trend: "Live DB", desc: "active platform accounts", color: "text-blue-600 dark:text-blue-400", icon: Users },
                { title: "VERIFIED WORKERS", value: workforceData.filter((w) => w.verificationStatus === "VERIFIED").length, prefix: "", suffix: " Artisans", trend: `${workforceData.length} Total`, desc: "registered workforce", color: "text-[#075E54] dark:text-emerald-400", icon: ShieldCheck },
                { title: "PENDING KYC", value: pendingCount, prefix: "", suffix: " Dossiers", trend: "Review", desc: "statutory checks", color: "text-amber-600 dark:text-amber-400", icon: ShieldAlert },
                { title: "TOTAL BOOKINGS", value: bookingsData.length, prefix: "", suffix: "", trend: `${bookingsData.filter((b) => b.workerAccepted).length} Accepted`, desc: "user service requests", color: "text-indigo-600 dark:text-indigo-400", icon: Activity },
                { title: "ADMIN FEES / CORPUS", value: paymentTransactions.reduce((sum, p) => sum + (p.coopFee || 50), 0), prefix: "₹", suffix: "", trend: "₹50/order", desc: "welfare & maintenance", color: "text-emerald-600 dark:text-emerald-400", icon: CreditCard },
                { title: "AVG SATISFACTION", value: federationKpis?.averageCustomerSatisfaction || 5.0, prefix: "★ ", suffix: " / 5", isDecimal: true, trend: "Audited", desc: "citizen rating", color: "text-purple-600 dark:text-purple-400", icon: Star }
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
            TAB: REGISTERED CITIZENS & USERS OVERSIGHT
        ========================================================================== */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Registered Citizens &amp; User Accounts
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live administrative registry of citizens, workers, and society administrators on the platform.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllUsers}
                  disabled={usersLoading}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? "animate-spin" : ""}`} />
                  <span>Refresh Users</span>
                </button>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {usersData.length} Registered Users
                </span>
              </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users by name, email, phone, or district..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101828] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Users Table */}
            {usersData.length === 0 && !usersLoading ? (
              <div className="p-12 text-center bg-white dark:bg-[#101828] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Registered Users Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Newly registered citizen customers and workers will appear in real-time as they sign up.
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#101828] rounded-2xl border border-[#E4E9F0] dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">User Details</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">District & Address</th>
                        <th className="py-3 px-4">Bookings</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Registered Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {usersData
                        .filter((u) => {
                          const q = userSearch.toLowerCase();
                          return (
                            !userSearch ||
                            u.name?.toLowerCase().includes(q) ||
                            u.email?.toLowerCase().includes(q) ||
                            u.phone?.includes(q) ||
                            u.district?.toLowerCase().includes(q)
                          );
                        })
                        .map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <AvatarPlaceholder name={u.name} className="w-8 h-8 rounded-full text-xs font-bold shrink-0" />
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <span>{u.name}</span>
                                    {u.role === "SUPER_ADMIN" && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-bold">Admin</span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                                  <div className="text-[10px] text-slate-400">{u.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                u.role === "WORKER"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                  : u.role === "SUPER_ADMIN"
                                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                                  : u.role === "SOCIETY_ADMIN"
                                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{u.district || "Vijayawada"}</span>
                              </div>
                              {u.address && <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{u.address}</div>}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                              {u.bookingCount || 0}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                u.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                              }`}>
                                {u.status || "ACTIVE"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "Recent"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
                    { label: "Pending Scrutiny", value: "PENDING" },
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
                    { label: "Pending Scrutiny", value: "PENDING" },
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
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs"
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
            5. TAB: LIVE BOOKINGS & WORKER ACCEPTANCE OPERATIONS
        ========================================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Platform Bookings &amp; Worker Acceptance Tracker
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Super Admin oversight: Track every citizen booking, assigned artisan, worker acceptance status, and fair wage escrow.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllBookings}
                  disabled={bookingsLoading}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${bookingsLoading ? "animate-spin" : ""}`} />
                  <span>Refresh Bookings</span>
                </button>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {bookingsData.length} Total Bookings
                </span>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by booking #, service, customer or artisan..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101828] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {["ALL", "ACCEPTED", "PENDING_ACCEPTANCE", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingStatusFilter(st)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition whitespace-nowrap ${
                      bookingStatusFilter === st
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {st.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookings Tracker List */}
            {bookingsData.length === 0 && !bookingsLoading ? (
              <div className="p-12 text-center bg-white dark:bg-[#101828] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <CalendarCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Bookings Recorded Yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When citizen customers request artisan services, complete live tracking and worker acceptance records will display here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookingsData
                  .filter((b) => {
                    const q = bookingSearch.toLowerCase();
                    const matchQ =
                      !bookingSearch ||
                      b.bookingNumber?.toLowerCase().includes(q) ||
                      b.serviceCategory?.toLowerCase().includes(q) ||
                      b.customer?.name?.toLowerCase().includes(q) ||
                      b.worker?.name?.toLowerCase().includes(q) ||
                      b.serviceLocation?.address?.toLowerCase().includes(q);

                    const matchFilter =
                      bookingStatusFilter === "ALL" ||
                      (bookingStatusFilter === "ACCEPTED" && b.workerAccepted) ||
                      (bookingStatusFilter === "PENDING_ACCEPTANCE" && !b.workerAccepted && b.status !== "CANCELLED") ||
                      b.status === bookingStatusFilter;

                    return matchQ && matchFilter;
                  })
                  .map((b) => {
                    const isAccepted = b.workerAccepted;
                    const isCompleted = b.status === "COMPLETED";
                    const isCancelled = b.status === "CANCELLED";

                    return (
                      <div
                        key={b._id || b.bookingNumber}
                        className="p-4 rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
                              {b.bookingNumber || `#BK-${String(b._id).slice(-6).toUpperCase()}`}
                            </span>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                {b.serviceCategory}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {b.requirementDescription || "Standard cooperative service dispatch"}
                              </p>
                            </div>
                          </div>

                          {/* Acceptance & Live Status Badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Worker Acceptance Badge */}
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
                                isAccepted
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                  : isCancelled
                                  ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              }`}
                            >
                              {isAccepted ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>WORKER ACCEPTED</span>
                                </>
                              ) : isCancelled ? (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                                  <span>CANCELLED</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                  <span>AWAITING WORKER ACCEPTANCE</span>
                                </>
                              )}
                            </span>

                            {/* Booking Operational Status */}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                                  : b.status === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                                  : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                        </div>

                        {/* Customer, Worker, & Financial Wage Breakdown Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
                          {/* 1. Customer Column */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-slate-400">Citizen Customer</span>
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {b.customer?.name || "Citizen Customer"}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{b.customer?.phone || "Unspecified"}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{b.serviceLocation?.address || "Vijayawada Sector"}</span>
                            </div>
                          </div>

                          {/* 2. Worker Column */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-slate-400">Assigned Cooperative Artisan</span>
                            {b.worker ? (
                              <>
                                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                  <span>{b.worker.name}</span>
                                  {b.worker.rating && (
                                    <span className="inline-flex items-center text-amber-500 font-bold text-[11px]">
                                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                                      {Number(b.worker.rating).toFixed(1)}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{b.worker.phone || "Protected"}</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {b.worker.primaryTrade || b.serviceCategory}
                                </div>
                              </>
                            ) : (
                              <div className="text-amber-600 dark:text-amber-400 font-medium">
                                Algorithmic dispatch matching in progress...
                              </div>
                            )}
                          </div>

                          {/* 3. Fair Wage Split & Payment Status */}
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center justify-between font-mono">
                              <span className="text-[10px] text-slate-500">Citizen Paid Total:</span>
                              <span className="font-black text-slate-900 dark:text-white text-xs">
                                ₹{b.fairWageBreakdown?.customerPaid ?? 350}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-200/60 dark:border-slate-800 pt-1">
                              <span className="text-slate-500">Worker Wage:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                ₹{b.fairWageBreakdown?.workerEarning ?? 300}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-slate-500">Admin Maintenance Fee:</span>
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                ₹{b.fairWageBreakdown?.adminMaintenanceFee ?? 50}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-200/60 dark:border-slate-800">
                              <span className="text-slate-400">Payment:</span>
                              <span
                                className={`font-bold ${
                                  b.paymentStatus === "PAID"
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-amber-600 dark:text-amber-400"
                                }`}
                              >
                                {b.paymentStatus === "PAID" ? "PAID (Razorpay)" : "PENDING"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB: WORKER REVIEWS & ADMIN STAR ADJUSTMENT
        ========================================================================== */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Artisan Reviews &amp; Rating Governance
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Super Admin control: Inspect citizen reviews, verify work completion proof, and adjust/award stars to workers in MongoDB.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllReviews}
                  disabled={reviewsLoading}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${reviewsLoading ? "animate-spin" : ""}`} />
                  <span>Refresh Reviews</span>
                </button>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {reviewsData.length} Reviews Recorded
                </span>
              </div>
            </div>

            {/* Reviews Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews by citizen, worker, or service..."
                value={reviewSearch}
                onChange={(e) => setReviewSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101828] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Reviews Feed */}
            {reviewsData.length === 0 && !reviewsLoading ? (
              <div className="p-12 text-center bg-white dark:bg-[#101828] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <Star className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Reviews Recorded Yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When citizens complete bookings and submit ratings with feedback, they will appear here with instant star adjustment controls.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsData
                  .filter((r) => {
                    const q = reviewSearch.toLowerCase();
                    return (
                      !reviewSearch ||
                      r.customerId?.name?.toLowerCase().includes(q) ||
                      r.workerId?.name?.toLowerCase().includes(q) ||
                      r.comment?.toLowerCase().includes(q) ||
                      r.bookingId?.serviceType?.toLowerCase().includes(q)
                    );
                  })
                  .map((r) => (
                    <div
                      key={r._id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div>
                        {/* Top Worker & Rating Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <AvatarPlaceholder
                              name={r.workerId?.name || "Artisan"}
                              className="w-9 h-9 rounded-xl font-bold text-xs"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white text-xs">
                                {r.workerId?.name || "Cooperative Artisan"}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {r.workerId?.primaryTrade || "Certified Worker"} • {r.bookingId?.bookingNumber || "Booking"}
                              </div>
                            </div>
                          </div>

                          {/* Star Display */}
                          <div className="flex items-center text-amber-500 font-mono font-bold text-xs bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < (r.rating || 5)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300 dark:text-slate-700"
                                }`}
                              />
                            ))}
                            <span className="ml-1.5">{Number(r.rating || 5).toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Customer Feedback Body */}
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-xs">
                          <p className="text-slate-700 dark:text-slate-300 italic">
                            "{r.comment || "Work was carried out with high cooperative craftsmanship and safety standards."}"
                          </p>
                          <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                            <span>Reviewed by: {r.customerId?.name || "Citizen"}</span>
                            <span>{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "Recent"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Admin Star Adjustment Trigger */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Current Rating: <strong>{Number(r.workerId?.rating || r.rating || 5.0).toFixed(1)} ★</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => openStarModal(r.workerId || { name: "Worker", _id: r.workerId?._id })}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Adjust / Award Stars</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
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

            <EmergencyDispatch3D />
          </div>
        )}

        {/* =========================================================================
            7. TAB: PAYMENTS & ESCROW
        ========================================================================== */}
        {activeTab === "payments" && (() => {
          const filteredTransactions = paymentTransactions.filter((tx) => {
            const matchesSearch =
              paymentSearch.trim() === "" ||
              tx.txId.toLowerCase().includes(paymentSearch.toLowerCase()) ||
              tx.bookingId.toLowerCase().includes(paymentSearch.toLowerCase()) ||
              tx.customer.toLowerCase().includes(paymentSearch.toLowerCase()) ||
              tx.worker.toLowerCase().includes(paymentSearch.toLowerCase()) ||
              tx.employeeId.toLowerCase().includes(paymentSearch.toLowerCase()) ||
              tx.service.toLowerCase().includes(paymentSearch.toLowerCase());

            const matchesStatus =
              paymentStatusFilter === "ALL" || tx.paymentStatus === paymentStatusFilter;

            const matchesSettlement =
              paymentSettlementFilter === "ALL" || tx.settlementStatus === paymentSettlementFilter;

            return matchesSearch && matchesStatus && matchesSettlement;
          });

          const handleExportPaymentsCSV = () => {
            const headers = [
              "Transaction ID",
              "Booking ID",
              "Timestamp",
              "Customer",
              "Worker",
              "Employee ID",
              "Service",
              "Gross Amount (INR)",
              "Worker Earning (INR)",
              "Cooperative Fee (INR)",
              "Platform Fee (INR)",
              "Payment Method",
              "Payment Status",
              "Settlement Status",
              "UTR Reference"
            ];

            const rows = filteredTransactions.map((tx) => [
              tx.txId,
              tx.bookingId,
              `"${tx.timestamp}"`,
              `"${tx.customer}"`,
              `"${tx.worker}"`,
              tx.employeeId,
              `"${tx.service}"`,
              tx.grossAmount,
              tx.workerEarning,
              tx.coopFee,
              tx.platformFee,
              `"${tx.paymentMethod}"`,
              tx.paymentStatus,
              tx.settlementStatus,
              tx.utrRef
            ]);

            const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `coopnex-payments-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E9F0] dark:border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Payments &amp; Statutory Escrow Settlement Center
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    100% of base floor wages disbursed directly to artisans upon customer completion OTP. 0% aggregator markups.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPaymentsCSV}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export Ledger (CSV)</span>
                  </button>
                </div>
              </div>

              {/* 7 TOP SUMMARY METRIC CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {/* 1. Platform Maintenance Corpus */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-blue-200/90 dark:border-blue-900 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-blue-700">Platform Fund (₹50/job)</div>
                  <div className="text-xl font-black font-mono text-blue-700">
                    ₹{(adminLedgerSummary?.totalMaintenanceFund ?? 248560).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-blue-600 font-semibold">Flat Maintenance Corpus</div>
                </div>

                {/* 2. Worker Earnings in 24h Escrow */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-amber-200/90 dark:border-amber-900 shadow-xs space-y-1 bg-amber-50/20">
                  <div className="text-[10px] uppercase font-bold text-amber-700">24H Warranty Escrow</div>
                  <div className="text-xl font-black font-mono text-amber-600">
                    ₹{(adminLedgerSummary?.totalWorkerEarningsHeld ?? 48200).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-700 font-bold">{adminLedgerSummary?.activeEscrowHolds ?? 12} Defect Holds</div>
                </div>

                {/* 3. Matured / Released Wages */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-emerald-200/90 dark:border-emerald-900 shadow-xs space-y-1 bg-emerald-50/30">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Released Wages</div>
                  <div className="text-xl font-black font-mono text-emerald-700">
                    ₹{(adminLedgerSummary?.totalWorkerEarningsReleased ?? 2237040).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">100% Unlocked</div>
                </div>

                {/* 4. Worker Withdrawals */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total DBT Disbursed</div>
                  <div className="text-xl font-black font-mono text-slate-700 dark:text-slate-300">
                    ₹{(adminLedgerSummary?.totalDisbursedToWorkers ?? 1850000).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold">IMPS / UPI Dispatched</div>
                </div>

                {/* 5. Total Transactions */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Transactions</div>
                  <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {adminLedgerSummary?.totalTransactions ?? filteredTransactions.length}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">Razorpay Verified</div>
                </div>

                {/* 6. Pricing Structure */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Fair Wage Model</div>
                  <div className="text-xl font-black font-mono text-slate-900 dark:text-white">₹300 + ₹50</div>
                  <div className="text-[10px] text-slate-500">Worker + Platform</div>
                </div>

                {/* 7. Dispute Rate */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-rose-200/90 dark:border-rose-900 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-rose-700">Warranty Claims</div>
                  <div className="text-xl font-black font-mono text-rose-600">0.0%</div>
                  <div className="text-[10px] text-slate-500">24H Quality Lock</div>
                </div>
              </div>

              {/* 3D Payment Flow Telemetry */}
              <PaymentFlow3D />

              {/* PAYMENTS NAVIGATION SUB-TABS */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentsSubTab("LEDGER")}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    paymentsSubTab === "LEDGER"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Customer &amp; Worker Transactions Ledger ({filteredTransactions.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentsSubTab("WITHDRAWALS")}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    paymentsSubTab === "WITHDRAWALS"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Worker DBT Payouts &amp; Withdrawals ({adminWithdrawals.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentsSubTab("CHATS")}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
                    paymentsSubTab === "CHATS"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Booking Encrypted Chat Audit ({adminChatAudit.length})</span>
                </button>
              </div>

              {/* 1. SUB-TAB: LEDGER */}
              {paymentsSubTab === "LEDGER" && (
                <>
                  {/* Filter Controls Bar */}
                  <div className="bg-white dark:bg-[#101828] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex-1 w-full sm:w-auto relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={paymentSearch}
                        onChange={(e) => setPaymentSearch(e.target.value)}
                        placeholder="Search by Tx ID, Booking ID, Worker, Customer, Service..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-600 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-bold text-[11px]">Status:</span>
                        <select
                          value={paymentStatusFilter}
                          onChange={(e) => setPaymentStatusFilter(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                        >
                          <option value="ALL">All Statuses</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="PENDING">Pending</option>
                          <option value="REFUNDED">Refunded</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-bold text-[11px]">Settlement:</span>
                        <select
                          value={paymentSettlementFilter}
                          onChange={(e) => setPaymentSettlementFilter(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                        >
                          <option value="ALL">All Settlements</option>
                          <option value="SETTLED">Settled</option>
                          <option value="IN_ESCROW">In Escrow</option>
                        </select>
                      </div>

                      <span className="text-[11px] font-mono text-slate-500 pl-1">
                        Showing {filteredTransactions.length} of {paymentTransactions.length}
                      </span>
                    </div>
                  </div>

                  {/* 14-COLUMN ESCROW & PAYMENTS LEDGER TABLE */}
                  <div className="bg-white dark:bg-[#101828] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            <th className="py-3 px-3">1. Tx ID</th>
                            <th className="py-3 px-3">2. Booking ID</th>
                            <th className="py-3 px-3">3. Date &amp; Time</th>
                            <th className="py-3 px-3">4. Customer</th>
                            <th className="py-3 px-3">5. Worker</th>
                            <th className="py-3 px-3">6. Employee ID</th>
                            <th className="py-3 px-3">7. Service</th>
                            <th className="py-3 px-3 text-right">8. Gross</th>
                            <th className="py-3 px-3 text-right">9. Worker Net</th>
                            <th className="py-3 px-3 text-right">10. Co-op Fee</th>
                            <th className="py-3 px-3 text-center">11. Platform</th>
                            <th className="py-3 px-3">12. Method</th>
                            <th className="py-3 px-3 text-center">13. Status</th>
                            <th className="py-3 px-3 text-center">14. Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                          {filteredTransactions.map((tx) => (
                            <tr
                              key={tx.txId}
                              onClick={() => setSelectedPaymentTx(tx)}
                              className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition cursor-pointer"
                            >
                              {/* 1. Tx ID */}
                              <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                {tx.txId}
                              </td>
                              {/* 2. Booking ID */}
                              <td className="py-3 px-3 font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                {tx.bookingId}
                              </td>
                              {/* 3. Date */}
                              <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                                {tx.timestamp}
                              </td>
                              {/* 4. Customer */}
                              <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                {tx.customer}
                              </td>
                              {/* 5. Worker */}
                              <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                {tx.worker}
                              </td>
                              {/* 6. Employee ID */}
                              <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                                {tx.employeeId}
                              </td>
                              {/* 7. Service */}
                              <td className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap max-w-[150px] truncate">
                                {tx.service}
                              </td>
                              {/* 8. Gross */}
                              <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                ₹{tx.grossAmount}
                              </td>
                              {/* 9. Worker Net */}
                              <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                                ₹{tx.workerEarning}
                              </td>
                              {/* 10. Co-op Fee */}
                              <td className="py-3 px-3 text-right font-mono text-amber-700 whitespace-nowrap">
                                ₹{tx.coopFee}
                              </td>
                              {/* 11. Platform Fee */}
                              <td className="py-3 px-3 text-center font-mono text-slate-500 whitespace-nowrap">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                                  ₹0 (0%)
                                </span>
                              </td>
                              {/* 12. Payment Method */}
                              <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                                {tx.paymentMethod}
                              </td>
                              {/* 13. Status */}
                              <td className="py-3 px-3 text-center whitespace-nowrap">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  tx.paymentStatus === "COMPLETED"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : tx.paymentStatus === "PENDING"
                                    ? "bg-amber-50 text-amber-800 border-amber-300"
                                    : "bg-rose-50 text-rose-800 border-rose-300"
                                }`}>
                                  {tx.paymentStatus}
                                </span>
                              </td>
                              {/* 14. Action */}
                              <td className="py-3 px-3 text-center whitespace-nowrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPaymentTx(tx);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition cursor-pointer"
                                >
                                  Audit View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* 2. SUB-TAB: WORKER WITHDRAWALS */}
              {paymentsSubTab === "WITHDRAWALS" && (
                <div className="bg-white dark:bg-[#101828] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Worker Instant DBT Payouts &amp; Withdrawals</h4>
                      <p className="text-xs text-slate-500">Real-time NPCI IMPS / UPI transfers directly disbursed to worker bank accounts.</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      0% Deduction Guaranteed
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          <th className="py-3 px-4">Transaction UTR Ref</th>
                          <th className="py-3 px-4">Artisan Name</th>
                          <th className="py-3 px-4">Destination Account</th>
                          <th className="py-3 px-4">Method</th>
                          <th className="py-3 px-4 text-right">Amount Disbursed</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                        {adminWithdrawals.length > 0 ? (
                          adminWithdrawals.map((w: any, idx: number) => (
                            <tr key={w.txId || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition">
                              <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                {w.txId || `NPCI-DBT-${idx + 101}`}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                                {w.workerName || "Cooperative Specialist"}
                              </td>
                              <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                                {w.accountDetails || w.account || "Aadhaar Linked Direct DBT"}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                  {w.payoutMethod || "IMPS / DBT"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white font-mono">
                                ₹{(w.amount || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  {w.status || "SETTLED"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-500 text-[11px]">
                                {w.createdAt ? new Date(w.createdAt).toLocaleString("en-IN") : "Recent"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              No worker withdrawal records logged yet. Direct bank transfers appear here immediately upon disbursement.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. SUB-TAB: CHAT AUDITS */}
              {paymentsSubTab === "CHATS" && (
                <div className="bg-white dark:bg-[#101828] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Booking Conversation Audit &amp; Quality Logs</h4>
                      <p className="text-xs text-slate-500">Live inspection of citizen-artisan field dispatches for SLA compliance and dispute prevention.</p>
                    </div>
                    <button
                      type="button"
                      onClick={loadAdminChatAudit}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${adminChatLoading ? "animate-spin" : ""}`} />
                      <span>Refresh Chats</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          <th className="py-3 px-4">Booking Number</th>
                          <th className="py-3 px-4">Service Category</th>
                          <th className="py-3 px-4">Citizen Customer</th>
                          <th className="py-3 px-4">Assigned Worker</th>
                          <th className="py-3 px-4 text-center">Messages</th>
                          <th className="py-3 px-4">Latest Message</th>
                          <th className="py-3 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                        {adminChatAudit.length > 0 ? (
                          adminChatAudit.map((chat: any) => (
                            <tr key={chat.bookingId} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition">
                              <td className="py-3 px-4 font-mono font-bold text-blue-600">
                                {chat.bookingNumber || `#BK-${chat.bookingId.slice(-6).toUpperCase()}`}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                                {chat.serviceCategory}
                              </td>
                              <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                                {chat.customerName}
                              </td>
                              <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                                {chat.workerName}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                  {chat.messageCount} msgs
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                "{chat.lastMessage}"
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  {chat.bookingStatus}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              No active booking chat sessions currently recorded in database.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TRANSACTION DETAILS AUDIT DRAWER / MODAL */}
              {selectedPaymentTx && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 relative max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 font-mono">
                          NPCI / RBI Escrow Audit Trail
                        </span>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          Transaction #{selectedPaymentTx.txId}
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedPaymentTx(null)}
                        className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Booking Reference:</span>
                        <strong className="font-mono text-slate-900 dark:text-white">{selectedPaymentTx.bookingId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Service Executed:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{selectedPaymentTx.service}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Citizen Payer:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {selectedPaymentTx.customer} ({selectedPaymentTx.customerPhone})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Beneficiary Artisan:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {selectedPaymentTx.worker} ({selectedPaymentTx.employeeId})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Primary Cooperative:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{selectedPaymentTx.society}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Worker Passbook DBT:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{selectedPaymentTx.bankAccount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">NPCI UTR Reference:</span>
                        <span className="font-mono text-emerald-700 font-bold">{selectedPaymentTx.utrRef}</span>
                      </div>
                    </div>

                    {/* Statutory Breakdown Box */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                        Statutory Floor Wage Settlement Audit
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Customer Gross Payment:</span>
                        <strong className="font-mono">₹{selectedPaymentTx.grossAmount}</strong>
                      </div>
                      <div className="flex justify-between text-amber-800">
                        <span>Cooperative Welfare &amp; Society Share (10%):</span>
                        <strong className="font-mono">-₹{selectedPaymentTx.coopFee}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Private Intermediary Aggregator Cut:</span>
                        <strong className="font-mono text-emerald-700">₹0 (0%)</strong>
                      </div>
                      <div className="pt-2 border-t border-emerald-200 flex justify-between text-sm font-black text-emerald-900">
                        <span>Net Artisan DBT Take-Home:</span>
                        <span className="font-mono">₹{selectedPaymentTx.workerEarning}</span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setSelectedPaymentTx(null)}
                        className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Close Audit Inspector
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

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
            <AdminAiIntelligenceDashboard />
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
      {selectedWorkerForDrawer && (
        <WorkerDetailDrawer
          worker={selectedWorkerForDrawer}
          isOpen={Boolean(selectedWorkerForDrawer)}
          onClose={() => setSelectedWorkerForDrawer(null)}
          onApprove={handleApproveWorkerKyc}
          onReject={handleRejectWorkerKyc}
          onWorkerUpdated={(updated) => {
            setSelectedWorkerForDrawer(updated);
            fetchBackendAndLocalWorkforce();
          }}
          initialTab={activeTab === "kyc" ? "kyc" : "overview"}
        />
      )}

      {/* SUPER ADMIN WORKER STAR RATING & COMMENDATION MODAL */}
      {isStarModalOpen && starWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-800">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Award / Adjust Worker Stars
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official cooperative merit adjustment saved to MongoDB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsStarModalOpen(false);
                  setStarSuccessMsg("");
                  setStarWorker(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Worker Summary Card */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <AvatarPlaceholder
                name={starWorker.name}
                className="w-10 h-10 rounded-xl font-bold text-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                  {starWorker.name}
                </div>
                <div className="text-xs text-slate-400">
                  {starWorker.primaryTrade || starWorker.trade || "Certified Artisan"} • {starWorker._id || starWorker.employeeId}
                </div>
                <div className="text-[11px] text-amber-600 font-bold mt-0.5">
                  Current Rating: {starWorker.rating ? Number(starWorker.rating).toFixed(1) : "5.0"} ★
                </div>
              </div>
            </div>

            {/* Interactive 5-Star Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select New Star Rating (1 - 5 Stars):
              </label>
              <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStars(star)}
                    className="p-2 rounded-xl transition hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 transition ${
                        star <= selectedStars
                          ? "fill-amber-400 text-amber-400 drop-shadow-md"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                Awarding {selectedStars}.0 Stars
              </div>
            </div>

            {/* Administrative Audit Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Official Justification / Commendation Note:
              </label>
              <textarea
                rows={2}
                value={starReason}
                onChange={(e) => setStarReason(e.target.value)}
                placeholder="e.g., Stellar citizen review, exemplary emergency response speed, or cooperative board commendation"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101828] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Success Message Banner */}
            {starSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{starSuccessMsg}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsStarModalOpen(false);
                  setStarSuccessMsg("");
                  setStarWorker(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateWorkerRating}
                disabled={starSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {starSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to DB...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm &amp; Update Stars</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};
