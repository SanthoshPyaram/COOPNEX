import mongoose, { Schema, Document } from "mongoose";

export interface IWelfareBenefit extends Document {
  workerId: mongoose.Types.ObjectId;
  benefitType: "HEALTH_INSURANCE" | "TOOL_KIT_SUBSIDY" | "CHILD_SCHOLARSHIP" | "ACCIDENT_RELIEF" | "SAFETY_KIT" | "PENSION_SCHEME";
  title: string;
  description: string;
  monetaryValue: number;
  status: "ACTIVE" | "PENDING_DISBURSEMENT" | "EXPIRED" | "COMPLETED";
  validFrom: string;
  validUntil: string;
  schemeSource: string; // e.g. "Labour Cooperative Federation Welfare Corpus"
  createdAt: Date;
  updatedAt: Date;
}

const WelfareBenefitSchema = new Schema<IWelfareBenefit>(
  {
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true, index: true },
    benefitType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    monetaryValue: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "PENDING_DISBURSEMENT", "EXPIRED", "COMPLETED"], default: "ACTIVE" },
    validFrom: { type: String, required: true },
    validUntil: { type: String, required: true },
    schemeSource: { type: String, default: "Cooperative Welfare Trust Fund" }
  },
  { timestamps: true }
);

export const WelfareBenefit = mongoose.model<IWelfareBenefit>("WelfareBenefit", WelfareBenefitSchema);

