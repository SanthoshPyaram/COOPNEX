import mongoose, { Schema, Document } from "mongoose";

export interface IAdminWalletTransaction {
  transactionId: string;
  bookingId?: mongoose.Types.ObjectId;
  bookingNumber?: string;
  customerName?: string;
  workerName?: string;
  totalServiceAmount: number;
  platformFee: number;       // 10% Platform Facilitation Fee
  welfareCess: number;       // 2% Statutory Worker Welfare Cess
  netAdminEarning: number;    // platformFee + welfareCess
  type: "CREDIT_COMMISSION" | "WELFARE_DISBURSEMENT" | "PLATFORM_WITHDRAWAL";
  description: string;
  timestamp: Date;
}

export interface IAdminWallet extends Document {
  totalBalance: number;                  // Current liquid treasury balance (₹)
  totalCommissionCollected: number;      // Lifetime platform maintenance revenue (₹)
  totalWelfareFundCollected: number;     // Lifetime 2% statutory social security corpus (₹)
  totalTransactions: number;
  transactions: IAdminWalletTransaction[];
  updatedAt: Date;
  createdAt: Date;
}

const AdminWalletTransactionSchema = new Schema<IAdminWalletTransaction>({
  transactionId: { type: String, required: true },
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  bookingNumber: { type: String },
  customerName: { type: String },
  workerName: { type: String },
  totalServiceAmount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  welfareCess: { type: Number, required: true },
  netAdminEarning: { type: Number, required: true },
  type: {
    type: String,
    enum: ["CREDIT_COMMISSION", "WELFARE_DISBURSEMENT", "PLATFORM_WITHDRAWAL"],
    default: "CREDIT_COMMISSION"
  },
  description: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now }
});

const AdminWalletSchema = new Schema<IAdminWallet>(
  {
    totalBalance: { type: Number, default: 0 },
    totalCommissionCollected: { type: Number, default: 0 },
    totalWelfareFundCollected: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    transactions: [AdminWalletTransactionSchema]
  },
  { timestamps: true }
);

export const AdminWallet = mongoose.model<IAdminWallet>("AdminWallet", AdminWalletSchema);
