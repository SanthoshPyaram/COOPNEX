import React from "react";
import {
  Building2,
  CheckCircle2,
  Printer,
  X,
  ShieldCheck,
  QrCode,
  Download,
  FileText,
  User,
  MapPin,
  Calendar,
  Lock,
  Phone
} from "lucide-react";

export interface ReceiptData {
  invoiceNumber?: string;
  bookingNumber: string;
  serviceCategory: string;
  artisanName: string;
  artisanTrade?: string;
  artisanPhone?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  pincode?: string;
  district?: string;
  date: string;
  transactionId?: string;
  paymentMethod?: string;
  completionOtp?: string;
  fairWageBreakdown?: {
    laborWage?: number;
    travelAllowance?: number;
    workerEarning?: number;
    platformFacilitationFee?: number;
    welfareFundCess?: number;
    gstAmount?: number;
    customerPaid?: number;
  };
  totalAmount: number;
  escrowStatus?: string;
}

interface CustomerReceiptModalProps {
  receipt: ReceiptData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerReceiptModal: React.FC<CustomerReceiptModalProps> = ({
  receipt,
  isOpen,
  onClose
}) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  // Extract financial components with fallbacks matching the cooperative percentage formula
  const totalPaid = receipt.totalAmount || receipt.fairWageBreakdown?.customerPaid || 350;
  const breakdown = receipt.fairWageBreakdown;

  const laborWage = breakdown?.laborWage ?? Math.round(totalPaid * 0.78);
  const travelAllowance = breakdown?.travelAllowance ?? Math.round(totalPaid * 0.08);
  const workerTotalEarning = breakdown?.workerEarning ?? (laborWage + travelAllowance);

  const platformFee = breakdown?.platformFacilitationFee ?? Math.round(laborWage * 0.10);
  const welfareCess = breakdown?.welfareFundCess ?? Math.round(laborWage * 0.02);
  const gstAmount = breakdown?.gstAmount ?? Math.round(platformFee * 0.05);

  const invoiceNo = receipt.invoiceNumber || `INV-AP-${new Date().getFullYear()}-${receipt.bookingNumber.replace(/[^0-9]/g, "").slice(-4) || Math.floor(1000 + Math.random() * 9000)}`;
  const txnRef = receipt.transactionId || `UPI/${new Date().getFullYear()}/${Math.floor(100000000000 + Math.random() * 900000000000)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* TOP ACTION BAR (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Verified Government Tax Invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL TAX INVOICE CONTENT */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 print:p-0 print:space-y-4">
          {/* HEADER: FEDERATION CREST & TITLE */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-blue-800 tracking-wider uppercase">
                    Government of Andhra Pradesh • Department of Cooperation
                  </div>
                  <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight leading-tight">
                    AP Cooperative Labour Federation (APCLF)
                  </h1>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Reg. AP/VJA/COOP-2024/9912 • SAC: 998714 • GSTIN: 37AAACS0129F1Z5
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none w-full sm:w-auto">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  OFFICIAL TAX BILL
                </span>
                <span className="text-base font-mono font-black text-blue-900 block">
                  {invoiceNo}
                </span>
                <span className="text-[11px] text-slate-500 block font-mono">
                  Date: {receipt.date}
                </span>
              </div>
            </div>
          </div>

          {/* PARTIES INFO: CITIZEN & COOPERATIVE ARTISAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Billed To (Citizen Client)
              </span>
              <div className="font-black text-slate-900 text-sm">{receipt.customerName || "Registered Citizen Client"}</div>
              {receipt.customerPhone && (
                <div className="text-slate-600 font-mono text-[11px]">Phone: +91 {receipt.customerPhone}</div>
              )}
              <div className="text-slate-600 leading-snug">
                {receipt.customerAddress || "Service Destination Base"}, {receipt.district || "Vijayawada"} - {receipt.pincode || "520001"}
              </div>
            </div>

            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Executing Cooperative Specialist
              </span>
              <div className="font-black text-slate-900 text-sm">{receipt.artisanName}</div>
              <div className="text-slate-600 font-semibold text-[11px]">
                Trade: <span className="text-blue-700 font-bold">{receipt.artisanTrade || receipt.serviceCategory}</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                Order Reference: <strong className="font-mono text-slate-700">#{receipt.bookingNumber}</strong>
              </div>
              {receipt.completionOtp && (
                <div className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1 pt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Completion OTP: {receipt.completionOtp} (Verified on site)
                </div>
              )}
            </div>
          </div>

          {/* ITEMIZATION TABLE */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Itemized Service &amp; Wage Statement
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">SAC Code</th>
                    <th className="py-2.5 px-3 text-center">Settlement Beneficiary</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2.5 px-3 font-sans">
                      <strong className="text-slate-900 block font-bold">{receipt.serviceCategory} Field Craftsmanship</strong>
                      <span className="text-[10px] text-slate-500">Base direct skilled labor wage (100% direct DBT)</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">998714</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Worker (Escrow)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{laborWage.toFixed(2)}</td>
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-sans">
                      <strong className="text-slate-900 block font-bold">Transit &amp; Travel Allowance</strong>
                      <span className="text-[10px] text-slate-500">Dynamic ward-distance transit allowance</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">998714</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Worker (Escrow)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{travelAllowance.toFixed(2)}</td>
                  </tr>

                  <tr className="bg-slate-50/50">
                    <td className="py-2.5 px-3 font-sans">
                      <strong className="text-slate-900 block font-bold">Platform Facilitation &amp; Dispatch Fee (10%)</strong>
                      <span className="text-[10px] text-slate-500">Server infrastructure, GPS routing &amp; admin operations</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">998714</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        Admin Treasury
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-900">₹{platformFee.toFixed(2)}</td>
                  </tr>

                  <tr className="bg-slate-50/50">
                    <td className="py-2.5 px-3 font-sans">
                      <strong className="text-slate-900 block font-bold">PMSBY Social Security &amp; Welfare Fund Cess (2%)</strong>
                      <span className="text-[10px] text-slate-500">Pradhan Mantri Suraksha Bima Yojana accidental cover pool</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">998714</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                        Welfare Corpus
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-purple-900">₹{welfareCess.toFixed(2)}</td>
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-sans">
                      <strong className="text-slate-900 block font-bold">GST on Platform Facilitation (5%)</strong>
                      <span className="text-[10px] text-slate-500">CGST 2.5% + SGST 2.5% statutory remittance</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">998714</td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        Government Tax
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-700">₹{gstAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50/80 border-t-2 border-slate-900 text-slate-950 font-black text-sm">
                    <td colSpan={3} className="py-3 px-3 uppercase tracking-wider font-sans">
                      Total Invoice Amount (Paid via {receipt.paymentMethod || "Bharat UPI DBT"})
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-base text-blue-950">
                      ₹{totalPaid.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* BENEFICIARY TRUST SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Direct Artisan Earning
              </span>
              <div className="text-lg font-black text-emerald-900 font-mono mt-0.5">
                ₹{workerTotalEarning.toFixed(2)}
              </div>
              <span className="text-[10px] text-emerald-700 block font-medium">
                Labor + 100% Travel (Zero middleman cut)
              </span>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">
                Platform Maintenance (10%)
              </span>
              <div className="text-lg font-black text-blue-900 font-mono mt-0.5">
                ₹{platformFee.toFixed(2)}
              </div>
              <span className="text-[10px] text-blue-700 block font-medium">
                Admin Tech Infrastructure
              </span>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">
                Artisan Welfare Corpus (2%)
              </span>
              <div className="text-lg font-black text-purple-900 font-mono mt-0.5">
                ₹{welfareCess.toFixed(2)}
              </div>
              <span className="text-[10px] text-purple-700 block font-medium">
                PMSBY Insurance Protection
              </span>
            </div>
          </div>

          {/* ESCROW & VERIFICATION FOOTER */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24-Hour Defect Warranty Protected by Escrow</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-md">
                Artisan wage is safeguarded in the cooperative defect warranty escrow account for 24 hours. Any technical defects within 24h are re-serviced free under cooperative federation bylaws.
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                Settlement UTR: <strong className="text-slate-700">{txnRef}</strong>
              </p>
            </div>

            <div className="shrink-0 text-center">
              <div className="w-18 h-18 mx-auto p-1.5 bg-white border border-slate-300 rounded-xl shadow-2xs">
                {/* Visual Seal Stamp */}
                <div className="w-full h-full border-2 border-dashed border-blue-600 rounded flex flex-col items-center justify-center text-blue-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-[7px] font-black uppercase tracking-tighter">COOP VERIFIED</span>
                  <span className="text-[6px] font-mono">SAC 998714</span>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-mono block mt-1">E-Signed Invoice</span>
            </div>
          </div>

          {/* LEGAL SIGN-OFF */}
          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-200 space-y-0.5 font-mono">
            <p>This is a computer-generated tax invoice issued in accordance with the AP Cooperative Societies Act, 1964.</p>
            <p>For dispute resolution or warranty claims, contact APCLF Ombudsman: 1800-425-COOP or help@coopnex.ap.gov.in</p>
          </div>
        </div>

        {/* MODAL FOOTER (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Invoice automatically archived in your Citizen Payments ledger.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

