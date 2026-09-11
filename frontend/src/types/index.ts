export type UserRole = "CUSTOMER" | "WORKER" | "SOCIETY_ADMIN" | "FEDERATION_ADMIN" | "SUPER_ADMIN";

export type BookingStatus =
  | "REQUESTED"
  | "MATCHING"
  | "ASSIGNED"
  | "ACCEPTED"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface FairWageBreakdown {
  customerPaid: number;
  baseWorkerWage: number;
  skillPremium: number;
  experiencePremium: number;
  travelAllowance: number;
  emergencyAllowance: number;
  workerEarning: number;
  cooperativeContribution: number;
  taxGst: number;
}

export interface WorkerProfile {
  _id: string;
  id?: string;
  workerIdNumber: string;
  name: string;
  gender?: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  avatarUrl: string;
  kycDocuments?: any[];
  societyId: string | any;
  societyName: string;
  district: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
  serviceRadiusKm: number;
  skills: string[];
  experienceYears: number;
  languages: string[];
  verificationLevel: number;
  verificationStatus: "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  verificationTimeline?: {
    level: number;
    title: string;
    verified: boolean;
    verifiedAt?: string;
    notes?: string;
  }[];
  certificates?: {
    title: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
  }[];
  rating: number;
  reviewCount: number;
  jobsCompletedCount: number;
  isAvailable: boolean;
  emergencyReady: boolean;
  activeJobsToday: number;
  baseHourlyRate: number;
  walletBalance: number;
  totalEarnings: number;
  insuranceInfo?: {
    policyNumber: string;
    provider: string;
    planType: string;
    coverageAmount: number;
    isActive: boolean;
    validUntil: string;
  };
  welfareBenefits?: {
    title: string;
    status: string;
    renewalDate: string;
  }[];
}

export interface Booking {
  _id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId?: string | WorkerProfile;
  workerName?: string;
  workerPhone?: string;
  societyId?: string | any;
  serviceCategory: string;
  requirementDescription: string;
  serviceLocation: {
    address: string;
    coordinates: [number, number];
  };
  bookingType: "STANDARD" | "EMERGENCY";
  status: BookingStatus;
  statusTimeline: {
    status: BookingStatus;
    timestamp: string;
    note: string;
  }[];
  scheduledAt: string;
  aiMatchScore: number;
  aiMatchReasons: string[];
  fairWageBreakdown: FairWageBreakdown;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  paymentId?: string;
  rating?: number;
  reviewComment?: string;
  pricing?: {
    customerTotalINR?: number;
    workerWageINR?: number;
    platformFeeINR?: number;
    welfareFundINR?: number;
  };
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  district?: string;
}

export interface WorkforceExchangeProposal {
  _id?: string;
  exchangeCode: string;
  trade: string;
  sourceSocietyName: string;
  targetSocietyName: string;
  recommendedWorkersCount: number;
  distanceKm: number;
  dailyTravelAllowanceINR: number;
  estimatedSurplusCount: number;
  estimatedShortageCount: number;
  unmetDemandPreventionPct: number;
  aiRationale: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
}

export interface HeatmapZone {
  zoneId: string;
  zoneName: string;
  district: string;
  coordinates: [number, number];
  demandLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  demandVolume: number;
  availableWorkers: number;
  shortage: number;
  topService: string;
  forecastTrend: string;
  aiRecommendation: string;
}

