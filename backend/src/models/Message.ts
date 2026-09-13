import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  bookingId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderRole: "CUSTOMER" | "WORKER" | "ADMIN";
  senderName: string;
  recipientId?: mongoose.Types.ObjectId;
  recipientRole?: string;
  text: string;
  readStatus: boolean;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderRole: { type: String, enum: ["CUSTOMER", "WORKER", "ADMIN"], required: true },
    senderName: { type: String, required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: "User" },
    recipientRole: { type: String },
    text: { type: String, required: true, trim: true },
    readStatus: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

// Compound index for fast chat thread retrieval
MessageSchema.index({ bookingId: 1, timestamp: 1 });

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
