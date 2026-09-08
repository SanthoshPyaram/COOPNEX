import mongoose, { Schema, Document } from "mongoose";

export interface IWorkforceExchange extends Document {
  exchangeCode: string; // e.g. "EXC-2026-AP-01"
  federationId: mongoose.Types.ObjectId;
  trade: string;
  sourceSocietyId: mongoose.Types.ObjectId;
  sourceSocietyName: string;
  targetSocietyId: mongoose.Types.ObjectId;
  targetSocietyName: string;
  recommendedWorkersCount: number;
  deployedWorkerIds: mongoose.Types.ObjectId[];
  distanceKm: number;
  dailyTravelAllowanceINR: number;
  estimatedSurplusCount: number;
  estimatedShortageCount: number;
  unmetDemandPreventionPct: number;
  aiRationale: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkforceExchangeSchema = new Schema<IWorkforceExchange>(
  {
    exchangeCode: { type: String, required: true, unique: true, index: true },
    federationId: { type: Schema.Types.ObjectId, ref: "Federation", required: true, index: true },
    trade: { type: String, required: true, index: true },
    sourceSocietyId: { type: Schema.Types.ObjectId, ref: "Society", required: true },
    sourceSocietyName: { type: String, required: true },
    targetSocietyId: { type: Schema.Types.ObjectId, ref: "Society", required: true },
    targetSocietyName: { type: String, required: true },
    recommendedWorkersCount: { type: Number, required: true },
    deployedWorkerIds: [{ type: Schema.Types.ObjectId, ref: "Worker" }],
    distanceKm: { type: Number, required: true },
    dailyTravelAllowanceINR: { type: Number, default: 150 },
    estimatedSurplusCount: { type: Number, default: 0 },
    estimatedShortageCount: { type: Number, default: 0 },
    unmetDemandPreventionPct: { type: Number, default: 85 },
    aiRationale: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING_APPROVAL", "APPROVED", "REJECTED", "ACTIVE", "COMPLETED"],
      default: "PENDING_APPROVAL",
      index: true
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true }
  },
  { timestamps: true }
);

export const WorkforceExchange = mongoose.model<IWorkforceExchange>("WorkforceExchange", WorkforceExchangeSchema);

