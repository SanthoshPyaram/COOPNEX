import mongoose, { Schema, Document } from "mongoose";

export interface IKYCDocument {
  documentType: "AADHAAR" | "PAN" | "POLICE_CLEARANCE" | "TRADE_CERTIFICATE" | "BANK_PROOF";
  documentNumber: string;
  fileUrl: string;
  verificationStatus: "PENDING" | "VERIFIED" | "SUSPECTED_FAKE" | "REJECTED";
  fraudRiskScore: number; // 0 - 100
  fraudFlags: string[];
  aiVerificationNotes: string;
  submittedAt: Date;
  verifiedAt?: Date;
}

export interface IWorker extends Document {
  userId: mongoose.Types.ObjectId;
  workerIdNumber: string; // e.g., "SS-AP-2026-104"
  employeeId?: string; // Standard Employee ID (e.g. "COOP-EMP-0001" or "SS-AP-2026-104")
  name: string;
  gender: "Male" | "Female" | "Other";
  phone?: string;
  email: string;
  avatarUrl: string;
  societyId: mongoose.Types.ObjectId;
  societyName: string;
  federationId: mongoose.Types.ObjectId;
  district: string;
  location: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
  serviceRadiusKm: number;
  skills: string[];
  experienceYears: number;
  languages: string[];
  verificationLevel: number; // 1 to 5
  verificationStatus: "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  kycDocuments: IKYCDocument[];
  verificationTimeline: {
    level: number;
    title: string;
    verified: boolean;
    verifiedAt?: Date;
    notes?: string;
  }[];
  certificates: {
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
  insuranceInfo: {
    policyNumber: string;
    provider: string;
    planType: string;
    coverageAmount: number;
    isActive: boolean;
    validUntil: string;
  };
  welfareBenefits: {
    title: string;
    status: string;
    renewalDate: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkerSchema = new Schema<IWorker>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    workerIdNumber: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, sparse: true, uppercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male", index: true },
    phone: { type: String, required: false, default: "" },
    email: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    societyId: { type: Schema.Types.ObjectId, ref: "Society", required: true, index: true },
    societyName: { type: String, required: true },
    federationId: { type: Schema.Types.ObjectId, ref: "Federation", required: true },
    district: { type: String, required: true, index: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true } // [lon, lat]
    },
    serviceRadiusKm: { type: Number, default: 15 },
    skills: { type: [String], required: true, index: true },
    experienceYears: { type: Number, default: 3 },
    languages: { type: [String], default: ["Telugu", "Hindi", "English"] },
    verificationLevel: { type: Number, default: 1, min: 1, max: 5, index: true },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "VERIFIED", "REJECTED"],
      default: "VERIFIED",
      index: true
    },
    kycDocuments: [
      {
        documentType: { type: String, enum: ["AADHAAR", "PAN", "POLICE_CLEARANCE", "TRADE_CERTIFICATE", "BANK_PROOF"] },
        documentNumber: { type: String },
        fileUrl: { type: String },
        verificationStatus: { type: String, enum: ["PENDING", "VERIFIED", "SUSPECTED_FAKE", "REJECTED"], default: "PENDING" },
        fraudRiskScore: { type: Number, default: 0 },
        fraudFlags: { type: [String], default: [] },
        aiVerificationNotes: { type: String, default: "" },
        submittedAt: { type: Date, default: Date.now },
        verifiedAt: { type: Date }
      }
    ],
    verificationTimeline: [
      {
        level: { type: Number },
        title: { type: String },
        verified: { type: Boolean, default: false },
        verifiedAt: { type: Date },
        notes: { type: String }
      }
    ],
    certificates: [
      {
        title: { type: String },
        issuer: { type: String },
        issueDate: { type: String },
        expiryDate: { type: String },
        credentialId: { type: String }
      }
    ],
    rating: { type: Number, default: 4.8, min: 1, max: 5 },
    reviewCount: { type: Number, default: 35 },
    jobsCompletedCount: { type: Number, default: 120 },
    isAvailable: { type: Boolean, default: true, index: true },
    emergencyReady: { type: Boolean, default: true, index: true },
    activeJobsToday: { type: Number, default: 0 },
    baseHourlyRate: { type: Number, default: 350 },
    walletBalance: { type: Number, default: 4850 },
    totalEarnings: { type: Number, default: 58900 },
    insuranceInfo: {
      policyNumber: { type: String, default: "AIC-COOP-882193" },
      provider: { type: String, default: "Cooperative General Insurance Federation" },
      planType: { type: String, default: "Pradhan Mantri Suraksha Bima Yojana (PMSBY) + Co-op Group Accidental" },
      coverageAmount: { type: Number, default: 500000 },
      isActive: { type: Boolean, default: true },
      validUntil: { type: String, default: "2027-03-24" }
    },
    welfareBenefits: [
      {
        title: { type: String },
        status: { type: String },
        renewalDate: { type: String }
      }
    ]
  },
  { timestamps: true }
);

// 2dsphere index for MongoDB geospatial queries
WorkerSchema.index({ location: "2dsphere" });
WorkerSchema.index({ skills: 1, isAvailable: 1, verificationStatus: 1 });

export const Worker = mongoose.model<IWorker>("Worker", WorkerSchema);

