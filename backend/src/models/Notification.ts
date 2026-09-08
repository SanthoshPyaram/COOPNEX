import mongoose, { Schema, Document } from "mongoose";

export type NotificationType = "BOOKING" | "PAYMENT" | "WORKER" | "EMERGENCY" | "SYSTEM";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["BOOKING", "PAYMENT", "WORKER", "EMERGENCY", "SYSTEM"],
      default: "SYSTEM",
      index: true
    },
    read: { type: Boolean, default: false, index: true },
    actionUrl: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

