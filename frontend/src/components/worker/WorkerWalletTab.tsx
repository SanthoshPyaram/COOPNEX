import React, { useState } from "react";
import {
  Wallet,
  CreditCard,
  Building2,
  CheckCircle2,
  Lock,
  ArrowDownRight,
  ShieldCheck,
  Clock,
  Printer,
  X,
  Sparkles
} from "lucide-react";

interface WorkerWalletTabProps {
  walletBalance: number;
  onInstantPayout: () => void;
  lastWithdrawal: {
    amount: number;
    txId: string;
    timestamp: string;
    bank: string;
    ifsc: string;
    account: string;
  } | null;
}

export const WorkerWalletTab: React.FC<WorkerWalletTabProps> = ({
  walletBalance,
  onInstantPayout,
  lastWithdrawal
}) => {
  const [withdrawalProcessing, setWithdrawalProcessing] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [currentWithdrawalRecord, setCurrentWithdrawalRecord] = useState<any | null>(null);

  const pastWithdrawals = [
    {
      id: "w-1",
      txId: "COOP-DBT-942801-4192",
      amount: 4500,
      date: "05 Sep 2026, 18:20",
      bank: "Andhra Pragathi Grameena Bank",
      account: "APGB-0021-99821",
      ifsc: "APGB0001042",
      status: "SETTLED"
    },
    {
      id: "w-2",
      txId: "COOP-DBT-881204-1920",
      amount: 3200,
      date: "28 Aug 2026, 17:45",
      bank: "Andhra Pragathi Grameena Bank",
      account: "APGB-0021-99821",
      ifsc: "APGB0001042",
      status: "SETTLED"
    },
    {
      id: "w-3",
      txId: "COOP-DBT-772910-8201",
      amount: 5800,
      date: "20 Aug 2026, 19:10",
      bank: "Andhra Pragathi Grameena Bank",
      account: "APGB-0021-99821",
      ifsc: "APGB0001042",
      status: "SETTLED"
    }
  ];

  const handleWithdrawClick = () => {
    if (walletBalance <= 0) return;
    setWithdrawalProcessing(true);

    // Completely silent withdrawal flow: Click -> processing animation -> success check -> transaction details
    setTimeout(() => {
      const record = {
        amount: walletBalance,
        txId: `COOP-DBT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        bank: "Andhra Pragathi Grameena Bank",
        ifsc: "APGB0001042",
        account: "APGB-0021-99821"
      };
      setCurrentWithdrawalRecord(record);
      setWithdrawalProcessing(false);
      setSuccessModalOpen(true);
      onInstantPayout();
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <span>Worker Escrow Wallet & Instant DBT</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            100% direct-to-bank settlement. Zero holding fee, zero payout deduction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Aadhaar DBT Enabled</span>
          </span>
        </div>
      </div>

      {/* Available Balance Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
            Withdrawable Wallet Balance
          </span>
          <div className="text-3xl sm:text-4xl font-black tracking-tight">
            ₹{walletBalance.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-100/80">
            Escrow funds auto-released upon customer OTP verification.
          </p>
        </div>

        <button
          onClick={handleWithdrawClick}
          disabled={walletBalance <= 0 || withdrawalProcessing}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-800 disabled:opacity-50 font-black text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
        >
          {withdrawalProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              <span>Processing IMPS DBT...</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              <span>Withdraw to Bank Account</span>
            </>
          )}
        </button>
      </div>

      {/* Linked Passbook Details */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-extrabold text-slate-900">
              Verified DBT Bank Account
            </h4>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Active for Instant Pay
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 font-mono text-slate-700">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans">Bank Name</span>
            <span className="font-bold text-slate-900 block mt-0.5">Andhra Pragathi Grameena Bank</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans">Account Number</span>
            <span className="font-bold text-slate-900 block mt-0.5">APGB-0021-99821</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans">IFSC Code</span>
            <span className="font-bold text-slate-900 block mt-0.5">APGB0001042</span>
          </div>
        </div>
      </div>

      {/* Past Withdrawals Ledger */}
      <div className="space-y-3">
        <h4 className="text-sm font-black text-slate-900">Withdrawal Passbook History</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Transaction UTR Ref</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Bank & Account</th>
                <th className="py-3 px-3 text-right">Amount Withdrawn</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pastWithdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                    {w.txId}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 font-medium">
                    {w.date}
                  </td>
                  <td className="py-3.5 px-3 text-slate-800">
                    {w.bank}
                    <span className="block text-[10px] text-slate-400 font-mono">{w.account}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-black text-slate-900 text-sm">
                    ₹{w.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 100% SILENT WITHDRAWAL SUCCESS MODAL (NO SOUND) */}
      {successModalOpen && currentWithdrawalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Instant DBT Payout Dispatched</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Funds have been transferred directly to your bank account with zero fee.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-slate-900 text-sm">₹{currentWithdrawalRecord.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>UTR Reference:</span>
                <span className="font-bold text-slate-900">{currentWithdrawalRecord.txId}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination Bank:</span>
                <span className="font-bold text-slate-900">{currentWithdrawalRecord.bank}</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span>{currentWithdrawalRecord.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Done & Return to Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

