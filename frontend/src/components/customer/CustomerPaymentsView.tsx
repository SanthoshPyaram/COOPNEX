import React, { useState } from "react";
import { Booking } from "../../types";
import { RazorpayCheckoutModal } from "../payment/RazorpayCheckoutModal";
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
  Zap
} from "lucide-react";

interface CustomerPaymentsViewProps {
  bookings: Booking[];
  onPaymentCompleted?: () => void;
}

export const CustomerPaymentsView: React.FC<CustomerPaymentsViewProps> = ({ bookings, onPaymentCompleted }) => {
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);

  // Escrow payment records computed according to user formula: Worker wage (e.g. ₹300) + Admin maintenance (₹50) = Total (₹350)
  const paymentRecords = React.useMemo(() => {
    if (bookings && bookings.length > 0) {
      return bookings.map((b, idx) => {
        const cost = b.fairWageBreakdown?.customerPaid || (b as any).pricing?.customerTotalINR || 350;
        const adminMaintenanceFee = b.fairWageBreakdown?.adminMaintenanceFee || 50;
        const workerWage = b.fairWageBreakdown?.workerEarning || (cost > adminMaintenanceFee ? cost - adminMaintenanceFee : 300);
        const isPaid = (b as any).paymentStatus === "PAID";
        const isCompleted = b.status === "COMPLETED";
        const isCancelled = b.status === "CANCELLED";

        let escrowStatus = "HELD_IN_ESCROW";
        if (isCancelled) escrowStatus = "REFUNDED";
        else if (isCompleted && isPaid) escrowStatus = "RELEASED";
        else if (isPaid) escrowStatus = "HELD_24H";
        else escrowStatus = "PAYMENT_PENDING";

        return {
          id: b._id,
          rawBooking: b,
          bookingNumber: b.bookingNumber || `BK-AP-2026-${100 + idx}`,
          serviceCategory: b.serviceCategory || "Cooperative Maintenance",
          artisanName: (b as any).workerName || (b as any).worker?.name || "Cooperative Specialist",
          date: b.createdAt
            ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            : "Today",
          totalAmount: cost,
          workerWage,
          adminMaintenanceFee,
          isPaid,
          escrowStatus,
          transactionId: (b as any).paymentDetails?.razorpayPaymentId || `TXN-COOP-${109200 + idx}`
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
    .reduce((acc, p) => acc + p.adminMaintenanceFee, 0);

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Escrow Guarantee Security Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Government Cooperative Escrow &amp; Razorpay Gateway</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Fair Wage Split • 24-Hour Defect Warranty Hold
          </h2>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Every invoice clearly separates the artisan's base fair wage (e.g. ₹300 held for 24h quality warranty) from the ₹50 platform maintenance and welfare fee.
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
          <span className="text-xs text-slate-500 font-bold block">Maintenance Fund (₹50/job)</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">₹{totalMaintenanceCorpus}</div>
          <span className="text-[10px] text-indigo-700 font-bold">Platform operations &amp; welfare</span>
        </div>
      </div>

      {/* Escrow Transactions Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">Invoices &amp; Escrow Settlement Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Itemized transparent breakdown: Artisan wage (₹300) + Platform maintenance fee (₹50).
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
                <th className="py-3 px-4 text-right">Worker Wage</th>
                <th className="py-3 px-4 text-right">Platform Fee</th>
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
                    <td className="py-3.5 px-4 text-right font-bold text-indigo-700">
                      ₹{record.adminMaintenanceFee}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {record.escrowStatus === "PAYMENT_PENDING" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Payment Due
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
                        {!record.isPaid && (
                          <button
                            type="button"
                            onClick={() => setSelectedBookingForPayment(record.rawBooking)}
                            className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[11px] hover:opacity-95 transition shadow-2xs flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Pay Razorpay</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReceipt(record)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] transition cursor-pointer"
                          title="View Official Receipt"
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

      {/* RAZORPAY CHECKOUT MODAL INTEGRATION */}
      {selectedBookingForPayment && (
        <RazorpayCheckoutModal
          booking={selectedBookingForPayment}
          isOpen={!!selectedBookingForPayment}
          onClose={() => setSelectedBookingForPayment(null)}
          onSuccess={() => {
            setSelectedBookingForPayment(null);
            onPaymentCompleted?.();
          }}
        />
      )}

      {/* OFFICIAL COOPERATIVE TAX RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Cooperative Tax Receipt</h4>
                  <p className="text-[10px] text-slate-500">Government of Andhra Pradesh Labour Portal</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 no-print cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Ref:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Number:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.bookingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.serviceCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Artisan:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.artisanName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service Date:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.date}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span>Artisan Fair Wage:</span>
                  <span className="font-bold text-emerald-700">₹{selectedReceipt.workerWage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Maintenance &amp; Welfare Fund:</span>
                  <span className="font-bold text-indigo-700">₹{selectedReceipt.adminMaintenanceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aggregator Middleman Cut:</span>
                  <span className="font-bold text-slate-500">₹0.00 (Zero Cut)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-300 text-sm font-black text-slate-900">
                  <span>Total Citizen Paid:</span>
                  <span className="text-[#2563EB]">₹{selectedReceipt.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 no-print">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
