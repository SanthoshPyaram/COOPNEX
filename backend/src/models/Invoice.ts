import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string; // e.g., "INV-2026-AP-8841"
  bookingId: mongoose.Types.ObjectId;
  paymentId: mongoose.Types.ObjectId;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
  workerDetails: {
    workerIdNumber: string;
    name: string;
    phone: string;
    verificationLevel: number;
    societyName: string;
  };
  serviceCategory: string;
  itemizedBreakdown: {
    baseWorkerWage: number;
    skillPremium: number;
    experiencePremium: number;
    travelAllowance: number;
    emergencyAllowance: number;
    totalWorkerWage: number;
    cooperativeWelfareFund: number;
    platformConvenienceCharge: number;
    taxGstAmount: number;
    totalAmountPaid: number;
  };
  issuedAt: Date;
  downloadUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    },
    workerDetails: {
      workerIdNumber: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      verificationLevel: { type: Number, default: 3 },
      societyName: { type: String, required: true }
    },
    serviceCategory: { type: String, required: true },
    itemizedBreakdown: {
      baseWorkerWage: { type: Number, required: true },
      skillPremium: { type: Number, default: 0 },
      experiencePremium: { type: Number, default: 0 },
      travelAllowance: { type: Number, default: 0 },
      emergencyAllowance: { type: Number, default: 0 },
      totalWorkerWage: { type: Number, required: true },
      cooperativeWelfareFund: { type: Number, required: true },
      platformConvenienceCharge: { type: Number, default: 0 },
      taxGstAmount: { type: Number, default: 0 },
      totalAmountPaid: { type: Number, required: true }
    },
    issuedAt: { type: Date, default: Date.now },
    downloadUrl: { type: String }
  },
  { timestamps: true }
);

export const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);

