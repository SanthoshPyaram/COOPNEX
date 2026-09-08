import mongoose, { Schema, Document } from "mongoose";

export interface ISociety extends Document {
  federationId: mongoose.Types.ObjectId;
  name: string;
  registrationNumber: string;
  district: string;
  subDistrict: string;
  address: string;
  officeLocation: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
  serviceRadiusKm: number;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  activeWorkersCount: number;
  totalBookingsCompleted: number;
  welfareReserveAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SocietySchema = new Schema<ISociety>(
  {
    federationId: { type: Schema.Types.ObjectId, ref: "Federation", required: true, index: true },
    name: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true },
    district: { type: String, required: true, index: true },
    subDistrict: { type: String, required: true },
    address: { type: String, required: true },
    officeLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    serviceRadiusKm: { type: Number, default: 25 },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    activeWorkersCount: { type: Number, default: 0 },
    totalBookingsCompleted: { type: Number, default: 0 },
    welfareReserveAmount: { type: Number, default: 185000 }
  },
  { timestamps: true }
);

SocietySchema.index({ officeLocation: "2dsphere" });

export const Society = mongoose.model<ISociety>("Society", SocietySchema);

