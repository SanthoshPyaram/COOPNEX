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
import { API_BASE } from "../services/api";

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

const DETAILED_PAYMENT_TRANSACTIONS: AdminPaymentTransaction[] = [
  {
    txId: "TXN-2026-9021",
    bookingId: "BK-9021",
    timestamp: "10 Sep 2026, 02:30 PM",
    customer: "Dr. K. Rao",
    customerPhone: "+91 98480 11223",
    worker: "Rajesh Kumar",
    employeeId: "COOP-EMP-0001",
    service: "Emergency MCB Rewiring",
    grossAmount: 850,
    workerEarning: 765,
    coopFee: 85,
    platformFee: 0,
    paymentMethod: "Bharat UPI QR",
    paymentStatus: "COMPLETED",
    settlementStatus: "SETTLED",
    utrRef: "NPCI/UPI/2026/89410291",
    society: "Vijayawada Central Labour Co-op (PLCS-04)",
    bankAccount: "Andhra Pragathi Grameena Bank ••••9821"
  },
  {
    txId: "TXN-2026-9020",
    bookingId: "BK-9020",
    timestamp: "10 Sep 2026, 11:15 AM",
    customer: "Ananya Sharma",
    customerPhone: "+91 98492 44556",
    worker: "Lakshmi Narayana",
    employeeId: "COOP-EMP-0002",
    service: "Conduit Leakage Repair",
    grossAmount: 650,
    workerEarning: 585,
    coopFee: 65,
    platformFee: 0,
    paymentMethod: "RuPay Card",
    paymentStatus: "COMPLETED",
    settlementStatus: "SETTLED",
    utrRef: "NPCI/RUPAY/2026/78219011",
    society: "Guntur East Labour Co-op (PLCS-02)",
    bankAccount: "State Bank of India ••••4412"
  },
  {
    txId: "TXN-2026-9019",
    bookingId: "BK-9019",
    timestamp: "09 Sep 2026, 04:15 PM",
    customer: "Pooja Hegde",
    customerPhone: "+91 94401 77889",
    worker: "Anita Rao",
    employeeId: "COOP-EMP-0005",
    service: "Traditional Andhra Catering",
    grossAmount: 1800,
    workerEarning: 1620,
    coopFee: 180,
    platformFee: 0,
    paymentMethod: "Direct Bank DBT",
    paymentStatus: "COMPLETED",
    settlementStatus: "SETTLED",
    utrRef: "NPCI/DBT/2026/55672109",
    society: "Bengaluru South Services Guild (KA-09)",
    bankAccount: "Canara Bank ••••7812"
  },
  {
    txId: "TXN-2026-9018",
    bookingId: "BK-9018",
    timestamp: "08 Sep 2026, 01:20 PM",
    customer: "V. Srinivas",
    customerPhone: "+91 98660 33221",
    worker: "Suresh Babu",
    employeeId: "COOP-EMP-0006",
    service: "Solar Inverter Synchronization",
    grossAmount: 1250,
    workerEarning: 1125,
    coopFee: 125,
    platformFee: 0,
    paymentMethod: "Bharat UPI QR",
    paymentStatus: "COMPLETED",
    settlementStatus: "SETTLED",
    utrRef: "NPCI/UPI/2026/44321908",
    society: "Visakhapatnam Port Artisan Society (AP-12)",
    bankAccount: "Union Bank of India ••••1190"
  },
  {
    txId: "TXN-2026-9017",
    bookingId: "BK-9017",
    timestamp: "08 Sep 2026, 10:00 AM",
    customer: "K. Madhuri",
    customerPhone: "+91 99881 22334",
    worker: "Rajesh Kumar",
    employeeId: "COOP-EMP-0001",
    service: "Ceiling Fan & Switchboard Fix",
    grossAmount: 550,
    workerEarning: 495,
    coopFee: 55,
    platformFee: 0,
    paymentMethod: "Escrow Locked",
    paymentStatus: "PENDING",
    settlementStatus: "IN_ESCROW",
    utrRef: "ESC/HOLD/2026/99120481",
    society: "Vijayawada Central Labour Co-op (PLCS-04)",
    bankAccount: "Andhra Pragathi Grameena Bank ••••9821"
  },
  {
    txId: "TXN-2026-9016",
    bookingId: "BK-9016",
    timestamp: "07 Sep 2026, 06:45 PM",
    customer: "R. Venkatesh",
    customerPhone: "+91 97000 66778",
    worker: "Lakshmi Narayana",
    employeeId: "COOP-EMP-0002",
    service: "Water Tank Float Valve Repair",
    grossAmount: 450,
    workerEarning: 405,
    coopFee: 45,
    platformFee: 0,
    paymentMethod: "Cash on Service (Audited)",
    paymentStatus: "COMPLETED",
    settlementStatus: "SETTLED",
    utrRef: "CASH/REC/2026/11293844",
    society: "Guntur East Labour Co-op (PLCS-02)",
    bankAccount: "State Bank of India ••••4412"
  },
  {
    txId: "TXN-2026-9015",
    bookingId: "BK-9015",
    timestamp: "06 Sep 2026, 03:10 PM",
    customer: "T. Swathi",
    customerPhone: "+91 99123 45678",
    worker: "Sunita Devi",
    employeeId: "COOP-EMP-0003",
    service: "Elder Care & Patient Assistance",
    grossAmount: 900,
    workerEarning: 810,
    coopFee: 90,
    platformFee: 0,
    paymentMethod: "Bharat UPI QR",
    paymentStatus: "COMPLETED",
    settlementStatus: "SETTLED",
    utrRef: "NPCI/UPI/2026/33214567",
    society: "Auto Nagar Industrial & Domestic Society",
    bankAccount: "HDFC Bank ••••3199"
  },
  {
    txId: "TXN-2026-9014",
    bookingId: "BK-9014",
    timestamp: "05 Sep 2026, 09:30 AM",
    customer: "M. Harish",
    customerPhone: "+91 96543 21098",
    worker: "Suresh Babu",
    employeeId: "COOP-EMP-0006",
    service: "Heavy Load Circuit Breaker Fix",
    grossAmount: 1100,
    workerEarning: 0,
    coopFee: 0,
    platformFee: 0,
    paymentMethod: "Refund to Source",
    paymentStatus: "REFUNDED",
    settlementStatus: "SETTLED",
    utrRef: "REFUND/REV/2026/88910234",
    society: "Visakhapatnam Port Artisan Society (AP-12)",
    bankAccount: "Union Bank of India ••••1190"
  }
];

// Helper to combine static and newly registered employees from localStorage
const loadCombinedWorkforce = () => {
  try {
    const localWorkers = JSON.parse(localStorage.getItem("coopnex_registered_workers") || "[]");
    const mappedLocal = localWorkers.map((w: any) => ({
      _id: w._id || w.id || `WRK-${w.employeeId}`,
      name: w.name,
      phone: w.phone || "+91 98765 43210",
      email: w.email,
      avatarUrl: w.avatarUrl || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
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
      kycDocuments: [
        { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-PRE-CHECK", verificationStatus: w.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING_AUDIT", issuer: "Local Police" },
        { documentType: "Aadhaar Card", documentNumber: w.aadhaarNumber || "XXXX-XXXX-8921", verificationStatus: "SYSTEM_VERIFIED", issuer: "UIDAI", systemCheckDetails: "UIDAI Verhoeff D5 Checksum Valid" },
        { documentType: "PAN Card", documentNumber: w.panNumber || "ABCDE1234F", verificationStatus: "SYSTEM_VERIFIED", issuer: "NSDL", systemCheckDetails: "NSDL Active Match 100%" }
      ]
    }));

    const existingEmails = new Set(mappedLocal.map((w: any) => w.email?.toLowerCase()));
    const filteredInitial = INITIAL_WORKFORCE_REGISTRY.filter((w: any) => !existingEmails.has(w.email?.toLowerCase()));
    return [...mappedLocal, ...filteredInitial];
  } catch {
    return INITIAL_WORKFORCE_REGISTRY;
  }
};

export const SuperAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("command");

  // Data states: load registered workers dynamically so newly registered employees show immediately
  const [workforceData, setWorkforceData] = useState<any[]>(loadCombinedWorkforce);
  const [selectedWorkerForDrawer, setSelectedWorkerForDrawer] = useState<any | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>("vja");
  const [isWelfareFlipped, setIsWelfareFlipped] = useState<boolean>(false);

  // Sync workforce with MongoDB backend & localStorage
  const fetchBackendAndLocalWorkforce = async () => {
    try {
      let dbWorkersMapped: any[] = [];
      try {
        const res = await fetch(`${API_BASE}/admin/kyc-submissions`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.submissions)) {
            dbWorkersMapped = json.submissions.map((sub: any) => ({
              _id: sub._id,
              name: sub.name,
              phone: sub.phone || "+91 98765 43210",
              email: sub.email,
              avatarUrl: sub.avatarUrl || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
              gender: sub.gender || "Male",
              age: sub.age || 32,
              skills: Array.isArray(sub.skills) && sub.skills.length > 0 ? sub.skills : ["Specialist"],
              trade: (sub.skills && sub.skills[0]) || "Specialist",
              societyName: sub.societyName || "Vijayawada Central Labour Co-op (PLCS-04)",
              district: sub.district || "Vijayawada",
              verificationLevel: sub.verificationLevel || 1,
              verificationStatus: sub.verificationStatus || "UNDER_REVIEW",
              riskScore: "LOW",
              riskNum: 1,
              experienceYears: sub.experienceYears || 3,
              totalJobs: sub.jobsCompletedCount || 0,
              rating: sub.rating || 5.0,
              lifetimeEarnings: "₹0",
              welfareContribution: "₹0",
              createdAt: sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "Just now",
              employeeId: sub.employeeId || sub.workerIdNumber || "COOP-WRK-MEMBER",
              kycDocuments: sub.kycDocuments && sub.kycDocuments.length > 0 ? sub.kycDocuments : [
                { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-PRE-CHECK", verificationStatus: sub.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING_AUDIT", issuer: "Local Police" },
                { documentType: "Aadhaar Card", documentNumber: "XXXX-XXXX-8921", verificationStatus: "SYSTEM_VERIFIED", issuer: "UIDAI", systemCheckDetails: "UIDAI Verhoeff Checksum Valid" },
                { documentType: "PAN Card", documentNumber: "ABCDE1234F", verificationStatus: "SYSTEM_VERIFIED", issuer: "NSDL", systemCheckDetails: "NSDL Active Match 100%" }
              ],
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
        avatarUrl: w.avatarUrl || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
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
        kycDocuments: [
          { documentType: "Police Clearance Certificate (PCC)", documentNumber: "PCC-PRE-CHECK", verificationStatus: w.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING_AUDIT", issuer: "Local Police" },
          { documentType: "Aadhaar Card", documentNumber: w.aadhaarNumber || "XXXX-XXXX-8921", verificationStatus: "SYSTEM_VERIFIED", issuer: "UIDAI", systemCheckDetails: "UIDAI Verhoeff D5 Checksum Valid" },
          { documentType: "PAN Card", documentNumber: w.panNumber || "ABCDE1234F", verificationStatus: "SYSTEM_VERIFIED", issuer: "NSDL", systemCheckDetails: "NSDL Active Match 100%" }
        ]
      }));

      // Merge: DB workers first, then local workers not yet in DB, then static registry
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

      for (const w of INITIAL_WORKFORCE_REGISTRY) {
        const empUpper = String((w as any).employeeId || "").toUpperCase();
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

  // Payments & Revenue Center state
  const [paymentTransactions] = useState<AdminPaymentTransaction[]>(DETAILED_PAYMENT_TRANSACTIONS);
  const [selectedPaymentTx, setSelectedPaymentTx] = useState<AdminPaymentTransaction | null>(null);
  const [paymentSearch, setPaymentSearch] = useState<string>("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("ALL");
  const [paymentSettlementFilter, setPaymentSettlementFilter] = useState<string>("ALL");

  // Security Center state
  const [securityEvents, setSecurityEvents] = useState<any[]>([
    { eventId: "SEC-902", eventType: "LOGIN_SUCCESS", riskLevel: "LOW", ipAddress: "127.0.0.1", actionTaken: "MFA TOTP verified successfully (Session authorized)", time: "Today, 02:45 PM" },
    { eventId: "SEC-901", eventType: "MFA_FAILED", riskLevel: "MEDIUM", ipAddress: "192.168.1.45", actionTaken: "Invalid 6-digit TOTP code entered (Attempt 1 of 5)", time: "Today, 01:20 PM" },
    { eventId: "SEC-900", eventType: "CRITICAL_ACTION", riskLevel: "HIGH", ipAddress: "127.0.0.1", actionTaken: "Worker WRK-KYC-004 blacklisted for forged precinct stamp", time: "Today, 10:15 AM" }
  ]);

  const handleApproveWorkerKyc = (workerId: string, level: number) => {
    // 1. Update React state immediately
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

    // 4. Actively notify MongoDB backend if online
    const token = localStorage.getItem("sahakari_token");
    if (token && workerId && !workerId.startsWith("WRK-COOP")) {
      fetch(`${API_BASE}/admin/kyc/${workerId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "APPROVE", newLevel: level })
      }).catch((err) => console.warn("Backend KYC review approval notice:", err));
    }
  };

  const handleRejectWorkerKyc = (workerId: string, reason: string) => {
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
    if (token && workerId && !workerId.startsWith("WRK-COOP")) {
      fetch(`${API_BASE}/admin/kyc/${workerId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action: "BLACKLIST", rejectionReason: reason })
      }).catch((err) => console.warn("Backend KYC review rejection notice:", err));
    }
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
                {/* 1. Total Revenue */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Revenue</div>
                  <div className="text-xl font-black font-mono text-slate-900 dark:text-white">₹24,85,600</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">1,248 Bookings</div>
                </div>

                {/* 2. Worker Earnings */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-emerald-200/90 dark:border-emerald-900 shadow-xs space-y-1 bg-emerald-50/30">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Worker Earnings</div>
                  <div className="text-xl font-black font-mono text-emerald-700">₹22,37,040</div>
                  <div className="text-[10px] text-emerald-600 font-bold">90% Direct Pay</div>
                </div>

                {/* 3. Cooperative Share */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-blue-200/90 dark:border-blue-900 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-blue-700">Co-op Share</div>
                  <div className="text-xl font-black font-mono text-blue-700">₹2,48,560</div>
                  <div className="text-[10px] text-slate-500">10% Welfare Fund</div>
                </div>

                {/* 4. Platform Revenue */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Platform Revenue</div>
                  <div className="text-xl font-black font-mono text-slate-700 dark:text-slate-300">₹0</div>
                  <div className="text-[10px] text-emerald-600 font-bold">0% Cut (Public Grid)</div>
                </div>

                {/* 5. Pending Payments */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-amber-200/90 dark:border-amber-900 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-amber-700">Pending Payments</div>
                  <div className="text-xl font-black font-mono text-amber-600">₹48,200</div>
                  <div className="text-[10px] text-amber-700 font-medium">In Escrow Lock</div>
                </div>

                {/* 6. Completed Payments */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Completed Payouts</div>
                  <div className="text-xl font-black font-mono text-slate-900 dark:text-white">₹24,37,400</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">99.8% Success</div>
                </div>

                {/* 7. Refunds Issued */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#101828] border border-rose-200/90 dark:border-rose-900 shadow-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-rose-700">Refunds Issued</div>
                  <div className="text-xl font-black font-mono text-rose-600">₹12,400</div>
                  <div className="text-[10px] text-slate-500">0.5% Dispute Rate</div>
                </div>
              </div>

              {/* 3D Payment Flow Telemetry */}
              <PaymentFlow3D />

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
                          className="hover:bg-blue-50/40 dark:hover:bg-slate-900/40 transition cursor-pointer"
                        >
                          {/* 1. Tx ID */}
                          <td className="py-3 px-3 font-mono font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                            {tx.txId}
                          </td>
                          {/* 2. Booking ID */}
                          <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {tx.bookingId}
                          </td>
                          {/* 3. Date & Time */}
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                            {tx.timestamp}
                          </td>
                          {/* 4. Customer */}
                          <td className="py-3 px-3 text-slate-900 dark:text-white font-bold whitespace-nowrap">
                            {tx.customer}
                          </td>
                          {/* 5. Worker */}
                          <td className="py-3 px-3 text-slate-900 dark:text-white font-semibold whitespace-nowrap">
                            {tx.worker}
                          </td>
                          {/* 6. Employee ID */}
                          <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                            {tx.employeeId}
                          </td>
                          {/* 7. Service */}
                          <td className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
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
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition"
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
