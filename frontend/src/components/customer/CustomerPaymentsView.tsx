import React, { useState } from "react";
import { Booking } from "../../types";
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
  Sparkles
} from "lucide-react";

interface CustomerPaymentsViewProps {
  bookings: Booking[];
}

export const CustomerPaymentsView: React.FC<CustomerPaymentsViewProps> = ({ bookings }) => {
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Escrow payment records
  const paymentRecords = React.useMemo(() => {
    if (bookings && bookings.length > 0) {
      return bookings.map((b, idx) => {
        const cost = b.fairWageBreakdown?.customerPaid || 750;
        const workerWage = b.fairWageBreakdown?.workerEarning || Math.round(cost * 0.9);
        const welfare = b.fairWageBreakdown?.cooperativeContribution || Math.round(cost * 0.05);
        const isCompleted = b.status === "COMPLETED";
        const isCancelled = b.status === "CANCELLED";
        const status = isCompleted ? "RELEASED" : isCancelled ? "REFUNDED" : "HELD_IN_ESCROW";

        return {
          id: b._id,
          bookingNumber: b.bookingNumber || `BK-AP-2026-${100 + idx}`,
          serviceCategory: b.serviceCategory || "General Maintenance",
          artisanName: (b as any).workerName || "Cooperative Specialist",
          date: b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today",
          totalAmount: cost,
          workerWage,
          welfare,
          escrowStatus: status,
          transactionId: `TXN-ESC-${109200 + idx}`
        };
      });
    }

    // Default high-fidelity ledger
    return [
      {
        id: "p-1",
        bookingNumber: "BK-VJA-2026-801",
        serviceCategory: "Electrician (Emergency MCB Spark)",
        artisanName: "Arjun Kumar (COOP-EMP-0001)",
        date: "Today, 14:30",
        totalAmount: 800,
        workerWage: 720,
        welfare: 40,
        escrowStatus: "HELD_IN_ESCROW",
        transactionId: "TXN-ESC-904128"
      },
      {
        id: "p-2",
        bookingNumber: "BK-VJA-2026-794",
        serviceCategory: "Plumber (Main Pipe Repair)",
        artisanName: "Lakshmi Narayana (WRK-KYC-002)",
        date: "05 Sep 2026",
        totalAmount: 650,
        workerWage: 585,
        welfare: 32.5,
        escrowStatus: "RELEASED",
        transactionId: "TXN-ESC-892110"
      },
      {
        id: "p-3",
        bookingNumber: "BK-VJA-2026-712",
        serviceCategory: "Carpenter (Door Latch & Hinge Alignment)",
        artisanName: "S. Rama Rao",
        date: "28 Aug 2026",
        totalAmount: 450,
        workerWage: 405,
        welfare: 22.5,
        escrowStatus: "RELEASED",
        transactionId: "TXN-ESC-881204"
      }
    ];
  }, [bookings]);

  const totalSpent = paymentRecords.reduce((acc, p) => acc + (p.escrowStatus !== "REFUNDED" ? p.totalAmount : 0), 0);
  const heldInEscrow = paymentRecords.filter((p) => p.escrowStatus === "HELD_IN_ESCROW").reduce((acc, p) => acc + p.totalAmount, 0);
  const released = paymentRecords.filter((p) => p.escrowStatus === "RELEASED").reduce((acc, p) => acc + p.workerWage, 0);
  const totalWelfare = paymentRecords.reduce((acc, p) => acc + p.welfare, 0);

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
            <span>Government Cooperative Escrow Protection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            100% Direct Pay • 0% Middleman Cut
          </h2>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Every rupee you pay is held safely in the statutory escrow account. Funds are released directly to the artisan's Aadhaar-linked DBT bank account only when you give your 4-digit OTP upon completion.
          </p>
        </div>

        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center shrink-0">
          <span className="text-[10px] font-bold text-blue-200 block uppercase tracking-wider">
            Current Escrow Protection
          </span>
          <span className="text-2xl font-black text-white block mt-0.5">₹{heldInEscrow}</span>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1 mt-1">
            <Lock className="w-3 h-3" />
            Locked until your OTP
          </span>
        </div>
      </div>

      {/* 4 TOP PAYMENT METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">Total Citizen Spend</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{totalSpent}</div>
          <span className="text-[10px] text-slate-400">All authenticated bookings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">In Cooperative Escrow</span>
          <div className="text-2xl font-black text-[#2563EB] mt-1">₹{heldInEscrow}</div>
          <span className="text-[10px] text-blue-600 font-bold">Active in progress</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">Direct to Artisans</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹{released}</div>
          <span className="text-[10px] text-emerald-700 font-bold">Instant DBT Transfer</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold block">Welfare Fund Pool (5%)</span>
          <div className="text-2xl font-black text-amber-600 mt-1">₹{totalWelfare.toFixed(1)}</div>
          <span className="text-[10px] text-amber-700 font-bold">Worker healthcare & safety</span>
        </div>
      </div>

      {/* Escrow Transactions Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">Escrow & Payments Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Itemized transparent breakdown for every rupee paid across Andhra Pradesh Labour Cooperatives.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Booking & Service</th>
                <th className="py-3 px-4">Artisan</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-right">Artisan Share (90%)</th>
                <th className="py-3 px-4 text-right">Welfare (5%)</th>
                <th className="py-3 px-4 text-center">Escrow Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paymentRecords.map((record) => (
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
                  <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                    ₹{record.welfare}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {record.escrowStatus === "HELD_IN_ESCROW" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        <Lock className="w-3 h-3" />
                        In Escrow
                      </span>
                    ) : record.escrowStatus === "RELEASED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Released (DBT)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Refunded
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedReceipt(record)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#2563EB] transition cursor-pointer"
                      title="View Official Receipt"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-6 coopnex-receipt-print-zone printable-area">
            {/* Print Only Header Seal */}
            <div className="hidden print:block border-b-2 border-slate-800 pb-3 mb-4 text-center">
              <div className="text-xs font-black uppercase tracking-widest text-slate-800">
                Government of Andhra Pradesh • Ministry of Cooperation
              </div>
              <div className="text-base font-black text-slate-900">
                COOPNEX NATIONAL LABOUR COOPERATIVE FEDERATION
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                Statutory Escrow Clearance &amp; Official Citizen Tax Receipt
              </div>
            </div>

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
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 no-print"
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
                  <span>Base Artisan Wage (90%):</span>
                  <span className="font-bold text-slate-900">₹{selectedReceipt.workerWage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cooperative Welfare Contribution (10%):</span>
                  <span className="font-bold text-amber-700">₹{selectedReceipt.welfare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Commission:</span>
                  <span className="font-bold text-emerald-700">₹0.00 (Zero Commission)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-300 text-sm font-black text-slate-900">
                  <span>Total Citizen Paid:</span>
                  <span className="text-[#2563EB]">₹{selectedReceipt.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Print Only Official Watermark & Seal */}
            <div className="hidden print:flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-300 pt-3">
              <span>Verified NPCI/Bharat UPI Escrow</span>
              <span>Authentic Digital Sovereign Record</span>
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

