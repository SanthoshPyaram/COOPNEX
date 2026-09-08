import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  identifier: string; // Normalized email or phone
  otpHash: string; // Cryptographic SHA-256 hash of the 6-digit OTP
  purpose: "LOGIN" | "REGISTER" | "FORGOT_PASSWORD" | "PHONE_VERIFY" | "VERIFY_ACCOUNT" | string;
  verified: boolean;
  attempts: number; // Maximum 5 attempts allowed
  lastSentAt: Date; // For 60-second resend cooldown
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    identifier: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    otpHash: {
      type: String,
      required: true,
      trim: true
    },
    purpose: {
      type: String,
      enum: ["LOGIN", "REGISTER", "FORGOT_PASSWORD", "PHONE_VERIFY", "VERIFY_ACCOUNT"],
      default: "VERIFY_ACCOUNT",
      index: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5
    },
    lastSentAt: {
      type: Date,
      default: Date.now
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300 // Auto-deleted by MongoDB TTL after 300 seconds (5 minutes)
    }
  },
  { timestamps: false }
);

// Compound index for fast lookup
OtpSchema.index({ identifier: 1, purpose: 1 });

export const Otp = mongoose.model<IOtp>("Otp", OtpSchema);
