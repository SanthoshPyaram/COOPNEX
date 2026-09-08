import mongoose, { Schema, Document } from "mongoose";

export interface IFederation extends Document {
  name: string;
  code: string;
  state: string;
  registrationNumber: string;
  headquarters: string;
  contactEmail: string;
  contactPhone: string;
  totalSocietiesCount: number;
  totalWorkersCount: number;
  welfareFundBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const FederationSchema = new Schema<IFederation>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    state: { type: String, required: true, default: "Andhra Pradesh" },
    registrationNumber: { type: String, required: true, unique: true },
    headquarters: { type: String, required: true, default: "Amaravati" },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    totalSocietiesCount: { type: Number, default: 0 },
    totalWorkersCount: { type: Number, default: 0 },
    welfareFundBalance: { type: Number, default: 2450000 }
  },
  { timestamps: true }
);

export const Federation = mongoose.model<IFederation>("Federation", FederationSchema);

