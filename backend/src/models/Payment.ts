import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  transactionId: string;
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  workerId: mongoose.Types.ObjectId;
  societyId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentGateway: "RAZORPAY_TEST" | "CASH_COOP_ESCROW" | "UPI_MOCK";
  status: "INITIATED" | "SUCCESS" | "FAILED" | "REFUNDED";
  paymentMethod: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  workerWageDisbursed: boolean;
  workerEarningAmount: number;
  coopFundAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", required: true },
    societyId: { type: Schema.Types.ObjectId, ref: "Society", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentGateway: { type: String, default: "RAZORPAY_TEST" },
    status: { type: String, enum: ["INITIATED", "SUCCESS", "FAILED", "REFUNDED"], default: "INITIATED" },
    paymentMethod: { type: String, default: "UPI / NetBanking" },
    gatewayOrderId: { type: String },
    gatewayPaymentId: { type: String },
    workerWageDisbursed: { type: Boolean, default: false },
    workerEarningAmount: { type: Number, required: true },
    coopFundAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

