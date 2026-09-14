import React, { useState } from "react";
import { Booking } from "../../types";
import { RealisticPaymentModal } from "../RealisticPaymentModal";
import { CustomerReceiptModal, ReceiptData } from "../CustomerReceiptModal";
import { api } from "../../services/api";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Lock,
  ArrowUpRight,
  Printer,
  X,
  Building2,
  Sparkles,
  QrCode,
  Zap,
  Info
} from "lucide-react";

interface CustomerPaymentsViewProps {
  bookings: Booking[];
  onPaymentCompleted?: () => void;
}

export const CustomerPaymentsView: React.FC<CustomerPaymentsViewProps> = ({ bookings, onPaymentCompleted }) => {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);

  // Escrow payment records computed according to transparent percentage formula:
  // 88% labor wage + 100% travel to worker | 10% platform facilitation | 2% PMSBY cess | 5% GST
  const paymentRecords = React.useMemo(() => {
    if (bookings && bookings.length > 0) {
      return bookings.map((b, idx) => {
        const cost = b.pricing?.customerTotalINR || b.fairWageBreakdown?.customerPaid || 350;
        const breakdown = b.fairWageBreakdown;
        const workerWage = breakdown?.workerEarning || Math.round(cost * 0.86);
        const platformFee = breakdown?.platformFacilitationFee || Math.round(cost * 0.10);
        const welfareCess = breakdown?.welfareFundCess || Math.round(cost * 0.02);
        const isPaid = (b as any).paymentStatus === "PAID";
        const isCompleted = b.status === "COMPLETED";
        const isAwaitingPayment = b.status === "AWAITING_PAYMENT";
        const isCancelled = b.status === "CANCELLED";

        let escrowStatus = "HELD_IN_ESCROW";
        if (isCancelled) escrowStatus = "REFUNDED";
        else if (isCompleted && isPaid) escrowStatus = "RELEASED";
        else if (isPaid) escrowStatus = "HELD_24H";
        else if (isAwaitingPayment) escrowStatus = "AWAITING_PAYMENT";
        else escrowStatus = "PAYMENT_LOCKED";

        return {
          id: b._id,
          rawBooking: b,
          bookingNumber: b.bookingNumber || `BK-AP-2026-${100 + idx}`,
          serviceCategory: b.serviceCategory || "Cooperative Maintenance",
          artisanName: (b as any).workerName || (b as any).worker?.name || "Cooperative Specialist",
          artisanPhone: (b as any).workerPhone || (b as any).worker?.phone || "+91 98490 12345",
          date: b.createdAt
            ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "Today",
          totalAmount: cost,
          workerWage,
          platformFee,
          welfareCess,
          isPaid,
          isAwaitingPayment,
          escrowStatus,
          completionOtp: (b as any).completionOtp,
          fairWageBreakdown: breakdown,
          transactionId: (b as any).paymentDetails?.razorpayPaymentId || `UPI/${new Date().getFullYear()}/${109200 + idx}`
        };
      });
    }

    return [];
  }, [bookings]);

  const totalSpent = paymentRecords
    .filter((p) => p.isPaid)
    .reduce((acc, p) => acc + p.totalAmount, 0);

  const heldInEscrow = paymentRecords
    .filter((p) => p.escrowStatus === "HELD_24H" || p.escrowStatus === "HELD_IN_ESCROW")
    .reduce((acc, p) => acc + p.workerWage, 0);

  const released = paymentRecords
    .filter((p) => p.escrowStatus === "RELEASED")
    .reduce((acc, p) => acc + p.workerWage, 0);

  const totalMaintenanceCorpus = paymentRecords
    .filter((p) => p.isPaid)
    .reduce((acc, p) => acc + p.platformFee, 0);

  const handleOpenReceiptFromRecord = (record: any) => {
    const data: ReceiptData = {
      invoiceNumber: `INV-AP-2026-${record.bookingNumber?.replace(/[^0-9]/g, "").slice(-4) || record.id.slice(-4)}`,
      bookingNumber: record.bookingNumber,
      serviceCategory: record.serviceCategory,
      artisanName: record.artisanName,
      artisanTrade: record.serviceCategory,
      artisanPhone: record.artisanPhone,
      customerName: "Registered Citizen",
      date: record.date,
      transactionId: record.transactionId,
      completionOtp: record.completionOtp,
      fairWageBreakdown: record.fairWageBreakdown,
      totalAmount: record.totalAmount,
      escrowStatus: record.escrowStatus
    };
    setSelectedReceipt(data);
  };

  return (
    <div className="space-y-6">
      {/* Escrow Guarantee Security Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Government Cooperative Escrow &amp; Transparent Financial Model</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Rapido-Benchmarked Wage Architecture • 24-Hour Defect Warranty Hold
          </h2>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Direct skilled labor and 100% travel allowances are escrowed for your artisan. A transparent 10% platform facilitation fee and 2% statutory PMSBY social security fund sustain state cooperative infrastructure with zero aggregator commissions.
          </p>
        </div>

        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center shrink-0">
          <span className="text-[10px] font-bold text-blue-200 block uppercase tracking-wider">
            24h Warranty Protected
          </span>
          <span className="text-2xl font-black text-white block mt-0.5">₹{heldInEscrow}</span>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1 mt-1">
            <Lock className="w-3 h-3" />
            Held 24H for Quality Guarantee
          </span>
        </div>
      </div>

      {/* 4 TOP PAYMENT METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">Total Citizen Paid</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{totalSpent}</div>
          <span className="text-[10px] text-slate-400">All settled bookings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">In 24h Escrow Warranty</span>
          <div className="text-2xl font-black text-[#2563EB] mt-1">₹{heldInEscrow}</div>
          <span className="text-[10px] text-blue-600 font-bold">Defect protection hold</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">Artisans Settled</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹{released}</div>
          <span className="text-[10px] text-emerald-700 font-bold">Post 24h DBT Dispatched</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">Platform Fee (10%)</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">₹{totalMaintenanceCorpus}</div>
          <span className="text-[10px] text-indigo-700 font-bold">Admin treasury operations</span>
        </div>
      </div>

      {/* Escrow Transactions Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">Invoices &amp; Escrow Settlement Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Itemized transparent breakdown: Artisan Direct Earning + 10% Platform Facilitation Fee + 2% PMSBY Welfare Fund.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Booking &amp; Service</th>
                <th className="py-3 px-4">Artisan</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Total Invoice</th>
                <th className="py-3 px-4 text-right">Worker Earning</th>
                <th className="py-3 px-4 text-right">Platform Fee (10%)</th>
                <th className="py-3 px-4 text-center">Escrow Status</th>
                <th className="py-3 px-4 text-right">Action / Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentRecords.length > 0 ? (
                paymentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{record.serviceCategory}</div>
                      <span className="text-[10px] text-slate-400 font-mono font-normal">
                        #{record.bookingNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {record.artisanName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {record.date}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      ₹{record.totalAmount}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      ₹{record.workerWage}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-blue-700">
                      ₹{record.platformFee}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {record.escrowStatus === "AWAITING_PAYMENT" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Payment Enabled
                        </span>
                      ) : record.escrowStatus === "PAYMENT_LOCKED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          <Lock className="w-3 h-3 text-slate-400" />
                          Awaiting OTP
                        </span>
                      ) : record.escrowStatus === "HELD_24H" || record.escrowStatus === "HELD_IN_ESCROW" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <Lock className="w-3 h-3" />
                          In 24h Escrow
                        </span>
                      ) : record.escrowStatus === "RELEASED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Disbursed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Refunded
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {record.escrowStatus === "AWAITING_PAYMENT" && !record.isPaid && (
                          <button
                            type="button"
                            onClick={() => setSelectedBookingForPayment(record.rawBooking)}
                            className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-[11px] hover:opacity-95 transition shadow-2xs flex items-center gap-1 cursor-pointer animate-pulse"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Pay Now</span>
                          </button>
                        )}
                        {record.escrowStatus === "PAYMENT_LOCKED" && !record.isPaid && (
                          <span
                            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold flex items-center gap-1 cursor-not-allowed"
                            title="Worker must enter your 4-digit completion OTP first"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </span>
                        )}
                        <button
                          onClick={() => handleOpenReceiptFromRecord(record)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] transition cursor-pointer shadow-2xs"
                          title="View Official Cooperative Tax Receipt"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CreditCard className="w-8 h-8 text-slate-300" />
                      <p>No escrow transaction records found.</p>
                      <p className="text-[11px]">When you book a service, transparent ledger vouchers appear here.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REALISTIC PAYMENT MODAL INTEGRATION */}
      {selectedBookingForPayment && (
        <RealisticPaymentModal
          isOpen={!!selectedBookingForPayment}
          booking={{
            id: selectedBookingForPayment._id,
            _id: selectedBookingForPayment._id,
            bookingNumber: selectedBookingForPayment.bookingNumber,
            serviceType: selectedBookingForPayment.serviceCategory,
            serviceCategory: selectedBookingForPayment.serviceCategory,
            amount: selectedBookingForPayment.pricing?.customerTotalINR || (selectedBookingForPayment as any).fairWageBreakdown?.customerPaid || 350,
            workerName: (selectedBookingForPayment as any).worker?.name || selectedBookingForPayment.workerName || "Cooperative Specialist",
            workerPhone: (selectedBookingForPayment as any).worker?.phone || (selectedBookingForPayment as any).workerPhone,
            fairWageBreakdown: selectedBookingForPayment.fairWageBreakdown,
            completionOtp: (selectedBookingForPayment as any).completionOtp
          }}
          onClose={() => setSelectedBookingForPayment(null)}
          onPaymentSuccess={async (details) => {
            try {
              await api.verifyPayment({
                bookingId: selectedBookingForPayment._id,
                razorpayOrderId: `order_payview_${Date.now()}`,
                razorpayPaymentId: details.utrNumber,
                razorpaySignature: `sig_verified_${Date.now()}`
              });
            } catch (err) {
              console.warn("Payment verify error:", err);
            }
            setSelectedBookingForPayment(null);
            onPaymentCompleted?.();
          }}
          onViewReceipt={(details) => {
            const b = selectedBookingForPayment;
            setSelectedBookingForPayment(null);
            if (b) {
              handleOpenReceiptFromRecord({
                id: b._id,
                bookingNumber: b.bookingNumber || `#BK-${b._id.slice(-6).toUpperCase()}`,
                serviceCategory: b.serviceCategory,
                artisanName: (b as any).worker?.name || b.workerName || "Cooperative Specialist",
                artisanPhone: (b as any).worker?.phone || (b as any).workerPhone || "+91 98490 12345",
                date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                totalAmount: b.pricing?.customerTotalINR || (b as any).fairWageBreakdown?.customerPaid || 350,
                fairWageBreakdown: b.fairWageBreakdown,
                completionOtp: (b as any).completionOtp,
                transactionId: details.utrNumber
              });
            }
          }}
        />
      )}

      {/* OFFICIAL COOPERATIVE TAX RECEIPT MODAL */}
      <CustomerReceiptModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};
