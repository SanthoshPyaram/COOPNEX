import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
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
  Sparkles,
  AlertCircle,
  RefreshCw,
  Smartphone,
  ChevronRight,
  Info,
  Check
} from "lucide-react";

interface EscrowItem {
  bookingId: string;
  amount: number;
  heldAt: string | number;
  maturesAt: string | number;
  status: "HELD_24H" | "RELEASED" | "REFUNDED";
  serviceCategory?: string;
  bookingNumber?: string;
}

interface WorkerWalletTabProps {
  walletBalance: number;
  pendingEscrowBalance?: number;
  escrowItems?: EscrowItem[];
  onInstantPayout?: () => void;
  onBalanceUpdated?: (newWallet: number, newEscrow: number) => void;
  workerProfile?: any;
  lastWithdrawal?: {
    amount: number;
    txId: string;
    timestamp: string;
    bank: string;
    ifsc: string;
    account: string;
  } | null;
}

export const WorkerWalletTab: React.FC<WorkerWalletTabProps> = ({
  walletBalance: initialWalletBalance,
  pendingEscrowBalance: initialPendingEscrow = 0,
  escrowItems: initialEscrowItems = [],
  onInstantPayout,
  onBalanceUpdated,
  workerProfile,
  lastWithdrawal
}) => {
  const [walletBalance, setWalletBalance] = useState<number>(initialWalletBalance);
  const [pendingEscrowBalance, setPendingEscrowBalance] = useState<number>(
    initialPendingEscrow || workerProfile?.pendingEscrowBalance || 0
  );
  const [escrowItems, setEscrowItems] = useState<EscrowItem[]>(
    initialEscrowItems.length > 0 ? initialEscrowItems : workerProfile?.escrowItems || []
  );

  // Sync balances if prop changes
  useEffect(() => {
    setWalletBalance(initialWalletBalance);
  }, [initialWalletBalance]);

  useEffect(() => {
    if (workerProfile?.pendingEscrowBalance !== undefined) {
      setPendingEscrowBalance(workerProfile.pendingEscrowBalance);
    }
    if (workerProfile?.escrowItems) {
      setEscrowItems(workerProfile.escrowItems);
    }
  }, [workerProfile]);

  // Withdrawal Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [payoutMethod, setPayoutMethod] = useState<"BANK" | "UPI">("BANK");
  const [bankName, setBankName] = useState(workerProfile?.bankName || "Andhra Pragathi Grameena Bank");
  const [accountNumber, setAccountNumber] = useState(workerProfile?.accountNumber || "982144001928");
  const [ifsc, setIfsc] = useState(workerProfile?.ifsc || "APGB0002148");
  const [accountHolder, setAccountHolder] = useState(workerProfile?.name || "Registered Worker");
  const [upiId, setUpiId] = useState("artisan@okhdfcbank");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // Success Receipt State
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>(() => {
    if (workerProfile?.withdrawals && Array.isArray(workerProfile.withdrawals)) {
      return workerProfile.withdrawals;
    }
    return lastWithdrawal ? [lastWithdrawal] : [];
  });

  // Matured Escrow Release State
  const [checkingMatured, setCheckingMatured] = useState(false);
  const [maturedToast, setMaturedToast] = useState<string | null>(null);

  // Countdown timer updater (re-renders every second for live tickers)
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown string
  const getRemainingTimeStr = (maturesAt: string | number) => {
    const target = new Date(maturesAt).getTime();
    const diff = target - now;
    if (diff <= 0) return "Ready to Unlock";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Check & release matured escrows
  const handleCheckMaturedEscrows = async () => {
    setCheckingMatured(true);
    setMaturedToast(null);
    try {
      const res = await api.releaseMatureEscrows();
      if (res.success) {
        if (res.releasedCount > 0) {
          setWalletBalance(res.walletBalance);
          setPendingEscrowBalance(res.pendingEscrowBalance);
          setMaturedToast(`Success! ₹${res.releasedAmount} from ${res.releasedCount} completed job(s) matured and moved to your Withdrawable Balance.`);
          onBalanceUpdated?.(res.walletBalance, res.pendingEscrowBalance);
        } else {
          setMaturedToast("All active escrow items are currently within their 24-hour defect warranty window.");
        }
      }
    } catch (e: any) {
      setMaturedToast("Unable to refresh escrow holds at this moment.");
    } finally {
      setCheckingMatured(false);
      setTimeout(() => setMaturedToast(null), 6000);
    }
  };

  // Open withdrawal modal
  const handleOpenWithdrawModal = () => {
    setWithdrawAmount(walletBalance);
    setWithdrawError(null);
    setIsWithdrawModalOpen(true);
  };

  // Submit withdrawal
  const handleConfirmWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      setWithdrawError("Please enter an amount greater than ₹0.");
      return;
    }
    if (withdrawAmount > walletBalance) {
      setWithdrawError(`Amount cannot exceed available withdrawable balance of ₹${walletBalance}.`);
      return;
    }
    if (payoutMethod === "UPI" && (!upiId.trim() || !upiId.includes("@"))) {
      setWithdrawError("Please enter a valid UPI VPA handle (e.g., yourname@okhdfcbank).");
      return;
    }
    if (payoutMethod === "BANK" && (!accountNumber.trim() || !ifsc.trim())) {
      setWithdrawError("Please verify your bank account number and 11-character IFSC code.");
      return;
    }

    setWithdrawLoading(true);
    setWithdrawError(null);

    try {
      const payload = {
        amount: withdrawAmount,
        payoutMethod,
        accountDetails: payoutMethod === "BANK" ? `${bankName} A/C ${accountNumber}` : `UPI ID: ${upiId}`,
        bankName: payoutMethod === "BANK" ? bankName : undefined,
        ifsc: payoutMethod === "BANK" ? ifsc.toUpperCase() : undefined,
        upiId: payoutMethod === "UPI" ? upiId : undefined
      };

      const res = await api.requestWorkerWithdrawal(payload);
      if (res.success) {
        const newBalance = res.walletBalance ?? (walletBalance - withdrawAmount);
        setWalletBalance(newBalance);
        onBalanceUpdated?.(newBalance, pendingEscrowBalance);
        if (onInstantPayout) onInstantPayout();

        const record = {
          amount: withdrawAmount,
          txId: res.withdrawal?.txId || `NPCI-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
          bank: payoutMethod === "BANK" ? bankName : "Bharat UPI Instant",
          ifsc: payoutMethod === "BANK" ? ifsc.toUpperCase() : "UPI-DIRECT",
          account: payoutMethod === "BANK" ? `••••${accountNumber.slice(-4)}` : upiId
        };

        setWithdrawals((prev) => [record, ...prev]);
        setSuccessReceipt(record);
        setIsWithdrawModalOpen(false);
      } else {
        setWithdrawError(res.message || "Withdrawal failed. Please check your bank details.");
      }
    } catch (err: any) {
      setWithdrawError(err.message || "Network error processing IMPS transfer.");
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <span>Worker Escrow Wallet &amp; Instant DBT</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Fair wage platform with zero commission deductions and 24-hour statutory defect protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NPCI / IMPS DBT Certified</span>
          </span>
        </div>
      </div>

      {/* TWO MAJOR BALANCE CARDS: AVAILABLE WITHDRAWABLE VS 24-HOUR ESCROW HOLD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: AVAILABLE WITHDRAWABLE BALANCE */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-md flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Withdrawable Wallet Balance
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400/20 text-emerald-100 border border-emerald-300/30">
                Instant Transfer Ready
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight">
              ₹{walletBalance.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-100/80">
              100% withdrawable to your Bank Account or UPI ID with ₹0 transfer charges.
            </p>
          </div>

          <button
            onClick={handleOpenWithdrawModal}
            disabled={walletBalance <= 0}
            className="w-full py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 disabled:opacity-40 font-black text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
            <span>Withdraw Funds (Bank / UPI)</span>
          </button>
        </div>

        {/* CARD 2: 24-HOUR ESCROW HOLD */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-50 to-blue-50/20 border border-amber-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>24-Hour Warranty Escrow Hold</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                Statutory Protection
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              ₹{pendingEscrowBalance.toLocaleString()}
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Held for 24h against customer rework claims. Auto-releases to withdrawable balance once the warranty matures.
            </p>
          </div>

          <button
            onClick={handleCheckMaturedEscrows}
            disabled={checkingMatured}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingMatured ? "animate-spin" : ""}`} />
            <span>{checkingMatured ? "Checking Warranty Timers..." : "Check & Release Matured Escrows"}</span>
          </button>
        </div>
      </div>

      {/* Matured Notice Toast */}
      {maturedToast && (
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{maturedToast}</span>
        </div>
      )}

      {/* STATUTORY 24-HOUR ESCROW REWORK EXPLANATION BANNER */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900">Cooperative 24-Hour Quality Escrow Policy:</strong>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            When you complete a service and the citizen submits the 4-digit completion OTP, your wage (e.g. ₹300) is placed in 24-Hour Escrow. If the customer reports the same defect within 24 hours, cooperative mediation reviews the complaint. Once 24 hours elapse with zero complaints, the full wage automatically unlocks to your Withdrawable Balance.
          </p>
        </div>
      </div>

      {/* ACTIVE ESCROW HOLDS TABLE */}
      {escrowItems && escrowItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Active 24-Hour Escrow Items ({escrowItems.length})</span>
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Booking Reference</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Held At</th>
                  <th className="py-2.5 px-3">Warranty Time Remaining</th>
                  <th className="py-2.5 px-3 text-right">Escrow Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {escrowItems.map((item, idx) => {
                  const remaining = getRemainingTimeStr(item.maturesAt);
                  const isReady = remaining === "Ready to Unlock";

                  return (
                    <tr key={item.bookingId || idx} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {item.bookingNumber || `#BK-${String(item.bookingId).slice(-6).toUpperCase()}`}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        {item.serviceCategory || "Cooperative Trade Service"}
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {new Date(item.heldAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short"
                        })}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            isReady
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800 animate-pulse"
                          }`}
                        >
                          {remaining}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">
                        ₹{item.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "RELEASED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.status === "HELD_24H" ? "24H Escrow Hold" : item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verified DBT Bank Account Box */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-extrabold text-slate-900">Verified Aadhaar DBT Direct Bank Link</h4>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
            Active for Instant Pay
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 font-mono text-slate-700">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans">Bank Name</span>
            <span className="font-bold text-slate-900 block mt-0.5">{bankName}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans">Account Number</span>
            <span className="font-bold text-slate-900 block mt-0.5">{accountNumber}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans">IFSC Code</span>
            <span className="font-bold text-slate-900 block mt-0.5">{ifsc}</span>
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
                <th className="py-3 px-3">Date &amp; Time</th>
                <th className="py-3 px-3">Payout Destination</th>
                <th className="py-3 px-3 text-right">Amount Dispatched</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdrawals.length > 0 ? (
                withdrawals.map((w, i) => (
                  <tr key={w.id || w.txId || i} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                      {w.txId}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {w.timestamp || w.date}
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No previous withdrawals on record. When you transfer funds, your IMPS / UPI payout vouchers will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REALISTIC WITHDRAWAL MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Withdraw Available Wages</h3>
                  <span className="text-[11px] text-slate-500">Available: ₹{walletBalance.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmWithdrawal} className="space-y-4">
              {/* Amount input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Withdrawal Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    max={walletBalance}
                    value={withdrawAmount || ""}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-300 font-mono font-black text-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="0"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  {[300, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(Math.min(amt, walletBalance))}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      ₹{amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(walletBalance)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                  >
                    Full (₹{walletBalance})
                  </button>
                </div>
              </div>

              {/* Payout Method Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Transfer Destination</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("BANK")}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      payoutMethod === "BANK"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="text-xs font-bold text-slate-900">Bank Account</div>
                    <div className="text-[10px] text-slate-500">IMPS / NEFT Direct DBT</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod("UPI")}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                      payoutMethod === "UPI"
                        ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="text-xs font-bold text-slate-900">Bharat UPI</div>
                    <div className="text-[10px] text-slate-500">Instant VPA Transfer</div>
                  </button>
                </div>
              </div>

              {/* Destination inputs */}
              {payoutMethod === "BANK" ? (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 font-bold text-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-slate-200 font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block">IFSC Code</label>
                      <input
                        type="text"
                        value={ifsc}
                        onChange={(e) => setIfsc(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-slate-200 font-mono font-bold text-slate-900 uppercase"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <label className="text-[10px] font-bold text-slate-500 block">Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank"
                    className="w-full p-2.5 bg-white rounded-lg border border-slate-200 font-mono font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-500 block">Supported: GPay, PhonePe, Paytm, BHIM UPI</span>
                </div>
              )}

              {/* Fee Breakdown */}
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Transfer Amount</span>
                  <span className="font-mono font-bold text-slate-900">₹{withdrawAmount || 0}</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Platform Fee &amp; Commission</span>
                  <span className="font-bold">₹0 (Zero Cut)</span>
                </div>
                <div className="border-t border-emerald-200 pt-1 flex justify-between font-black text-slate-900">
                  <span>Net Credited to You</span>
                  <span className="font-mono text-sm text-emerald-700">₹{withdrawAmount || 0}</span>
                </div>
              </div>

              {withdrawError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{withdrawError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawLoading || withdrawAmount <= 0}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {withdrawLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transacting IMPS...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4" />
                      <span>Confirm &amp; Dispatched</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAWAL SUCCESS RECEIPT MODAL */}
      {successReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Instant DBT Transfer Successful</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Funds have been directly disbursed to your verified destination with zero fee.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span>Dispatched Amount:</span>
                <span className="font-bold text-slate-900 text-sm">₹{successReceipt.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>UTR Reference:</span>
                <span className="font-bold text-slate-900">{successReceipt.txId}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-bold text-slate-900">{successReceipt.bank} ({successReceipt.account})</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span>{successReceipt.timestamp}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold font-sans pt-1 border-t border-slate-200">
                <span>Transfer Type:</span>
                <span>NPCI Direct IMPS / UPI 2.0</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessReceipt(null)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Done &amp; Return to Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
