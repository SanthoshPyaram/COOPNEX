import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  overallRating: number; // 1 to 5
  qualityScore: number;
  punctualityScore: number;
  professionalismScore: number;
  behaviourRating: number; // 1 to 5
  valueScore: number;
  comment: string;
  experienceComment?: string;
  workImages?: string[];
  workVideo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true, index: true },
    overallRating: { type: Number, required: true, min: 1, max: 5 },
    qualityScore: { type: Number, required: true, min: 1, max: 5, default: 5 },
    punctualityScore: { type: Number, required: true, min: 1, max: 5, default: 5 },
    professionalismScore: { type: Number, required: true, min: 1, max: 5, default: 5 },
    behaviourRating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    valueScore: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, trim: true, default: "" },
    experienceComment: { type: String, trim: true, default: "" },
    workImages: [{ type: String }],
    workVideo: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", ReviewSchema);

