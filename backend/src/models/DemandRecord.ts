import mongoose, { Schema, Document } from "mongoose";

export interface IDemandRecord extends Document {
  serviceCategory: string;
  district: string;
  zoneName: string;
  zoneCoordinates: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
  date: string; // YYYY-MM-DD
  bookingCount: number;
  availableWorkersCount: number;
  averageRating: number;
  isSurgeEvent: boolean;
  surgeRatio?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DemandRecordSchema = new Schema<IDemandRecord>(
  {
    serviceCategory: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    zoneName: { type: String, required: true, index: true },
    zoneCoordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }
    },
    date: { type: String, required: true, index: true },
    bookingCount: { type: Number, required: true },
    availableWorkersCount: { type: Number, required: true },
    averageRating: { type: Number, default: 4.8 },
    isSurgeEvent: { type: Boolean, default: false },
    surgeRatio: { type: Number, default: 1.0 }
  },
  { timestamps: true }
);

DemandRecordSchema.index({ zoneCoordinates: "2dsphere" });
DemandRecordSchema.index({ serviceCategory: 1, district: 1, date: 1 });

export const DemandRecord = mongoose.model<IDemandRecord>("DemandRecord", DemandRecordSchema);

