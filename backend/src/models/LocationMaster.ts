import mongoose, { Document, Schema } from "mongoose";

export interface ILocationMaster extends Document {
  pincode: string;
  stateCode?: string;
  stateNameEnglish: string;
  stateNameLocal?: string;
  districtCode?: string;
  districtNameEnglish: string;
  districtNameLocal?: string;
  subdistrictCode?: string;
  subdistrictNameEnglish?: string;
  subdistrictNameLocal?: string;
  subdistrictType?: string;
  villageCode?: string;
  villageNameEnglish?: string;
  villageNameLocal?: string;
  postOfficeName: string;
  officeType?: string;
  deliveryStatus?: string;
  circle?: string;
  region?: string;
  city?: string;
  town?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  precision: "PINCODE" | "POST_OFFICE" | "CITY" | "VILLAGE" | "ADDRESS" | "GPS";
  source: string;
  sourceUpdatedAt?: Date;
  importedAt: Date;
}

const LocationMasterSchema = new Schema<ILocationMaster>(
  {
    pincode: {
      type: String,
      required: true,
      trim: true,
      index: true,
      match: /^[1-9][0-9]{5}$/
    },
    stateCode: {
      type: String,
      trim: true
    },
    stateNameEnglish: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    stateNameLocal: {
      type: String,
      trim: true
    },
    districtCode: {
      type: String,
      trim: true
    },
    districtNameEnglish: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    districtNameLocal: {
      type: String,
      trim: true
    },
    subdistrictCode: {
      type: String,
      trim: true
    },
    subdistrictNameEnglish: {
      type: String,
      trim: true,
      index: true
    },
    subdistrictNameLocal: {
      type: String,
      trim: true
    },
    subdistrictType: {
      type: String,
      enum: ["Mandal", "Taluk", "Tehsil", "Block", "Circle", "Sub-Division", "Other"],
      default: "Mandal"
    },
    villageCode: {
      type: String,
      trim: true
    },
    villageNameEnglish: {
      type: String,
      trim: true
    },
    villageNameLocal: {
      type: String,
      trim: true
    },
    postOfficeName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    officeType: {
      type: String,
      trim: true
    },
    deliveryStatus: {
      type: String,
      trim: true
    },
    circle: {
      type: String,
      trim: true
    },
    region: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    town: {
      type: String,
      trim: true
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lon, lat]
        required: false
      }
    },
    precision: {
      type: String,
      enum: ["PINCODE", "POST_OFFICE", "CITY", "VILLAGE", "ADDRESS", "GPS"],
      default: "POST_OFFICE"
    },
    source: {
      type: String,
      default: "India Post Official Directory & GoI LGD"
    },
    sourceUpdatedAt: {
      type: Date
    },
    importedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index to prevent duplicate records during idempotent imports
LocationMasterSchema.index(
  {
    pincode: 1,
    postOfficeName: 1,
    districtNameEnglish: 1
  },
  { unique: true }
);

// Compound index for administrative searches
LocationMasterSchema.index({ stateNameEnglish: 1, districtNameEnglish: 1 });
LocationMasterSchema.index({ districtNameEnglish: 1, subdistrictNameEnglish: 1 });

// Geospatial 2dsphere index for spatial distance queries
LocationMasterSchema.index({ location: "2dsphere" });

export const LocationMaster = mongoose.model<ILocationMaster>("LocationMaster", LocationMasterSchema);
