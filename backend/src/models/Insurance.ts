import mongoose, { Schema, Document } from "mongoose";

export interface IInsurancePolicy extends Document {
  workerId: mongoose.Types.ObjectId;
  policyNumber: string;
  policyType: "ACCIDENTAL_DISABILITY" | "HEALTH_HOSPITALIZATION" | "LIFE_SURAKSHA" | "TOOL_EQUIPMENT_THEFT";
  providerName: string;
  coverageAmount: number;
  premiumBorneByCoop: number;
  premiumBorneByWorker: number;
  startDate: string;
  expiryDate: string;
  status: "ACTIVE" | "RENEWAL_DUE" | "EXPIRED" | "CLAIMED";
  claims: {
    claimId: string;
    incidentDate: string;
    claimAmount: number;
    approvedAmount?: number;
    status: "SUBMITTED" | "UNDER_INVESTIGATION" | "APPROVED" | "REJECTED";
    submittedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const InsurancePolicySchema = new Schema<IInsurancePolicy>(
  {
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true, index: true },
    policyNumber: { type: String, required: true, unique: true, index: true },
    policyType: { type: String, required: true },
    providerName: { type: String, default: "National Cooperative Insurance Federation" },
    coverageAmount: { type: Number, default: 500000 },
    premiumBorneByCoop: { type: Number, default: 450 }, // 100% or heavily subsidized by cooperative
    premiumBorneByWorker: { type: Number, default: 50 },
    startDate: { type: String, required: true },
    expiryDate: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "RENEWAL_DUE", "EXPIRED", "CLAIMED"], default: "ACTIVE" },
    claims: [
      {
        claimId: { type: String },
        incidentDate: { type: String },
        claimAmount: { type: Number },
        approvedAmount: { type: Number },
        status: { type: String, enum: ["SUBMITTED", "UNDER_INVESTIGATION", "APPROVED", "REJECTED"] },
        submittedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export const InsurancePolicy = mongoose.model<IInsurancePolicy>("InsurancePolicy", InsurancePolicySchema);

