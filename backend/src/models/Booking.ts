import mongoose, { Schema, Document } from "mongoose";
import { BOOKING_STATUS, BookingStatus } from "../config/constants";

export interface IFairWageBreakdown {
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

export interface IBooking extends Document {
  bookingNumber: string;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone?: string;
  workerId?: mongoose.Types.ObjectId;
  workerName?: string;
  workerPhone?: string;
  societyId?: mongoose.Types.ObjectId;
  serviceCategory: string;
  requirementDescription: string;
  mediaUrls: string[];
  serviceLocation: {
    address: string;
    coordinates: [number, number]; // [lon, lat]
  };
  bookingType: "STANDARD" | "EMERGENCY";
  status: BookingStatus;
  statusTimeline: {
    status: BookingStatus;
    timestamp: Date;
    note: string;
  }[];
  scheduledAt: Date;
  aiMatchScore: number;
  aiMatchReasons: string[];
  fairWageBreakdown: IFairWageBreakdown;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  paymentId?: string;
  rating?: number;
  reviewComment?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingNumber: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: false, default: "" },
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", index: true },
    workerName: { type: String },
    workerPhone: { type: String },
    societyId: { type: Schema.Types.ObjectId, ref: "Society", index: true },
    serviceCategory: { type: String, required: true, index: true },
    requirementDescription: { type: String, required: true },
    mediaUrls: { type: [String], default: [] },
    serviceLocation: {
      address: { type: String, required: true },
      coordinates: { type: [Number], required: true } // [lon, lat]
    },
    bookingType: { type: String, enum: ["STANDARD", "EMERGENCY"], default: "STANDARD", index: true },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.REQUESTED,
      index: true
    },
    statusTimeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
      }
    ],
    scheduledAt: { type: Date, default: Date.now, index: true },
    aiMatchScore: { type: Number, default: 95 },
    aiMatchReasons: { type: [String], default: [] },
    fairWageBreakdown: {
      customerPaid: { type: Number, required: true },
      baseWorkerWage: { type: Number, required: true },
      skillPremium: { type: Number, default: 0 },
      experiencePremium: { type: Number, default: 0 },
      travelAllowance: { type: Number, default: 0 },
      emergencyAllowance: { type: Number, default: 0 },
      workerEarning: { type: Number, required: true },
      cooperativeContribution: { type: Number, required: true },
      taxGst: { type: Number, default: 0 }
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "REFUNDED"],
      default: "PENDING",
      index: true
    },
    paymentId: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    reviewComment: { type: String },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

BookingSchema.index({ "serviceLocation.coordinates": "2dsphere" });

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);

