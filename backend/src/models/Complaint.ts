import mongoose, { Schema, Document } from "mongoose";

export interface IComplaint extends Document {
  ticketNumber: string; // e.g. "CMP-2026-0941"
  bookingId?: mongoose.Types.ObjectId;
  filedByUserId: mongoose.Types.ObjectId;
  filedByRole: "CUSTOMER" | "WORKER";
  againstId?: mongoose.Types.ObjectId;
  societyId: mongoose.Types.ObjectId;
  category: string;
  description: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
  resolutionNotes?: string;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  auditTrail: {
    action: string;
    actor: string;
    timestamp: Date;
    note: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    filedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    filedByRole: { type: String, enum: ["CUSTOMER", "WORKER"], required: true },
    againstId: { type: Schema.Types.ObjectId },
    societyId: { type: Schema.Types.ObjectId, ref: "Society", required: true, index: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"], default: "OPEN", index: true },
    resolutionNotes: { type: String },
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
    auditTrail: [
      {
        action: { type: String },
        actor: { type: String },
        timestamp: { type: Date, default: Date.now },
        note: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const Complaint = mongoose.model<IComplaint>("Complaint", ComplaintSchema);

