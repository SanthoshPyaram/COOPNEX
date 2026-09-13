import mongoose, { Schema, Document } from "mongoose";

export interface IServiceArea extends Document {
  state: string;
  stateCode: string; // e.g., "AP", "TG"
  district: string;
  city: string;
  pincodePrefixes: string[]; // 3-digit prefixes e.g. ["520", "521"]
  pincodes?: string[]; // Specific 6-digit pincodes e.g. ["520001", "520010"]
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  isActive: boolean;
  launchPhase: "PHASE_1_LAUNCH" | "PLANNED_PHASE_2" | "FUTURE_EXPANSION";
  supportedServices: string[];
  cooperativeName?: string;
  cooperativeSocietyId?: mongoose.Types.ObjectId;
  nearestHub?: string;
  nearestHubCoordinates?: [number, number]; // [longitude, latitude]
  slaMinutes: number;
  activeWorkersCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceAreaSchema = new Schema<IServiceArea>(
  {
    state: { type: String, required: true, trim: true, index: true },
    stateCode: { type: String, required: true, uppercase: true, trim: true, index: true },
    district: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    pincodePrefixes: { type: [String], required: true, index: true },
    pincodes: { type: [String], default: [], index: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lon, lat]
        required: true
      }
    },
    isActive: { type: Boolean, required: true, default: false, index: true },
    launchPhase: {
      type: String,
      enum: ["PHASE_1_LAUNCH", "PLANNED_PHASE_2", "FUTURE_EXPANSION"],
      default: "FUTURE_EXPANSION",
      index: true
    },
    supportedServices: {
      type: [String],
      default: [
        "Electrician",
        "Plumber",
        "Carpenter",
        "Painter",
        "Cleaner",
        "Caregiver",
        "Driver",
        "Gardener",
        "Technician",
        "Domestic Helper"
      ]
    },
    cooperativeName: { type: String, trim: true },
    cooperativeSocietyId: { type: Schema.Types.ObjectId, ref: "Society" },
    nearestHub: { type: String, trim: true },
    nearestHubCoordinates: {
      type: [Number],
      default: [80.6480, 16.5062] // Default Vijayawada Central Hub [lon, lat]
    },
    slaMinutes: { type: Number, default: 15 },
    activeWorkersCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries
ServiceAreaSchema.index({ location: "2dsphere" });
ServiceAreaSchema.index({ state: 1, district: 1, city: 1 });
ServiceAreaSchema.index({ isActive: 1, state: 1 });

export const ServiceArea = mongoose.model<IServiceArea>("ServiceArea", ServiceAreaSchema);

