import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  Lock,
  Smartphone,
  ArrowRight,
  Loader2,
  RefreshCw,
  Clock,
  Sparkles,
  Info
} from "lucide-react";
import { api } from "../../services/api";

export interface RazorpayCheckoutModalProps {
  booking?: any;
  bookingId?: string;
  bookingNumber?: string;
  customerName?: string;
  serviceCategory?: string;
  workerWage?: number; // e.g. 300
  maintenanceFee?: number; // e.g. 50
  totalAmount?: number; // e.g. 350
  isOpen?: boolean;
  onClose: () => void;
  onPaymentSuccess?: (paymentData: any) => void;
  onSuccess?: (paymentData?: any) => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  booking,
  bookingId: propBookingId,
  bookingNumber: propBookingNumber,
  customerName: propCustomerName,
  serviceCategory: propServiceCategory,
  workerWage: propWorkerWage,
  maintenanceFee: propMaintenanceFee = 50,
  totalAmount: propTotalAmount,
  isOpen = true,
  onClose,
  onPaymentSuccess,
  onSuccess
}) => {
  if (isOpen === false) return null;

  const bookingId = propBookingId || booking?._id || "";
  const bookingNumber = propBookingNumber || booking?.bookingNumber || `#BK-${String(bookingId).slice(-6).toUpperCase()}`;
  const customerName = propCustomerName || (booking as any)?.customerName || (booking as any)?.customer?.name || "Citizen Customer";
  const serviceCategory = propServiceCategory || booking?.serviceCategory || "Cooperative Field Service";
  const totalAmount = propTotalAmount || booking?.pricing?.customerTotalINR || booking?.fairWageBreakdown?.customerPaid || 350;
  const maintenanceFee = propMaintenanceFee || booking?.fairWageBreakdown?.adminMaintenanceFee || 50;
  const workerWage = propWorkerWage || booking?.fairWageBreakdown?.workerEarning || (totalAmount > maintenanceFee ? totalAmount - maintenanceFee : 300);

  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // UPI Countdown timer (10 mins)
  const [timerSeconds, setTimerSeconds] = useState(599);

  // Card form state
  const [cardNumber, setCardNumber] = useState("4532 8912 3456 7890");
  const [cardExpiry, setCardExpiry] = useState("09/29");
  const [cardCvv, setCardCvv] = useState("452");
  const [cardName, setCardName] = useState(customerName || "Citizen Customer");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("4829");

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Free sandbox Razorpay Key ID
  const RAZORPAY_TEST_KEY = "rzp_test_coopnex2026_live";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Execute payment completion via backend verify
  const executePayment = async (methodUsed: string) => {
    setIsProcessing(true);
    setErrorMsg(null);

    const randomHex = Math.random().toString(16).substring(2, 10);
    const mockPaymentId = `pay_${Date.now()}_${randomHex}`;
    const mockOrderId = `order_${randomHex}`;

    try {
      const res = await api.verifyPayment({
        bookingId,
        razorpayPaymentId: mockPaymentId,
        razorpayOrderId: mockOrderId,
        method: methodUsed
      });

      if (res.success) {
        setIsProcessing(false);
        setIsSuccess(true);
        setSuccessData(res);
        setTimeout(() => {
          onPaymentSuccess?.(res);
          onSuccess?.(res);
        }, 2200);
      } else {
        setIsProcessing(false);
        setErrorMsg(res.message || "Payment verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setIsProcessing(false);
      setErrorMsg(err.message || "Network error while completing payment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* RAZORPAY BRANDED HEADER */}
        <div className="bg-[#0c2340] text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Razorpay Logo mark */}
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-md">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight">Razorpay Trusted Checkout</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950 uppercase">
                    Test Mode
                  </span>
                </div>
                <p className="text-xs text-blue-200 font-medium">COOPNEX AP Labour Cooperative Federation</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount and Wage Breakdown Display */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-blue-200 block">Total Amount to Pay</span>
              <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1">
                <span>₹{totalAmount}.00</span>
                <span className="text-xs font-normal text-blue-200 font-mono">INR</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-right text-xs">
              <div className="flex items-center gap-2 justify-end text-[11px] text-blue-100">
                <span>Worker Wage:</span>
                <strong className="text-white">₹{workerWage}</strong>
                <span className="text-blue-300">•</span>
                <span>Maintenance &amp; Welfare:</span>
                <strong className="text-emerald-300">₹{maintenanceFee}</strong>
              </div>
              <span className="text-[10px] text-blue-200 block mt-0.5 font-mono">
                Ref: {bookingNumber} • 24h Quality Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT BODY */}
        {!isSuccess ? (
          <div className="flex flex-col sm:flex-row flex-1 min-h-[360px]">
            {/* Payment Method Selector (Sidebar) */}
            <div className="w-full sm:w-56 bg-slate-50 border-r border-slate-200 p-3 sm:p-4 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block px-2">
                Payment Options
              </span>

              <button
                type="button"
                onClick={() => setSelectedMethod("UPI")}
                className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition cursor-pointer ${
                  selectedMethod === "UPI"
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "hover:bg-slate-100 text-slate-700 font-medium"
                }`}
              >
                <QrCode className="w-4 h-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs block">UPI &amp; QR Code</span>
                  <span className={`text-[10px] block ${selectedMethod === "UPI" ? "text-blue-100" : "text-slate-400"}`}>
                    GPay, PhonePe, Paytm
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("CARD")}
                className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition cursor-pointer ${
                  selectedMethod === "CARD"
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "hover:bg-slate-100 text-slate-700 font-medium"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs block">Cards</span>
                  <span className={`text-[10px] block ${selectedMethod === "CARD" ? "text-blue-100" : "text-slate-400"}`}>
                    Credit / Debit Card
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("NETBANKING")}
                className={`w-full p-3 rounded-2xl text-left flex items-center gap-3 transition cursor-pointer ${
                  selectedMethod === "NETBANKING"
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "hover:bg-slate-100 text-slate-700 font-medium"
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs block">NetBanking</span>
                  <span className={`text-[10px] block ${selectedMethod === "NETBANKING" ? "text-blue-100" : "text-slate-400"}`}>
                    SBI, HDFC, ICICI, Axis
                  </span>
                </div>
              </button>

              <div className="pt-4 border-t border-slate-200 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>
            </div>

            {/* Payment Content View */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold mb-4">
                  {errorMsg}
                </div>
              )}

              {/* METHOD 1: UPI & QR CODE */}
              {selectedMethod === "UPI" && (
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">Scan UPI QR Code</span>
                    <span className="flex items-center gap-1 font-mono text-blue-600 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Valid for {formatTimer(timerSeconds)}</span>
                    </span>
                  </div>

                  {/* Real-looking UPI QR Canvas */}
                  <div className="relative inline-block mx-auto p-4 bg-white rounded-3xl border-2 border-slate-200 shadow-md">
                    <svg
                      viewBox="0 0 160 160"
                      className="w-44 h-44 mx-auto"
                      style={{ shapeRendering: "crispEdges" }}
                    >
                      <rect width="160" height="160" fill="white" />
                      {/* Standard Position Detection Patterns */}
                      <rect x="10" y="10" width="40" height="40" fill="#0c2340" />
                      <rect x="16" y="16" width="28" height="28" fill="white" />
                      <rect x="22" y="22" width="16" height="16" fill="#0c2340" />

                      <rect x="110" y="10" width="40" height="40" fill="#0c2340" />
                      <rect x="116" y="16" width="28" height="28" fill="white" />
                      <rect x="122" y="22" width="16" height="16" fill="#0c2340" />

                      <rect x="10" y="110" width="40" height="40" fill="#0c2340" />
                      <rect x="16" y="116" width="28" height="28" fill="white" />
                      <rect x="22" y="122" width="16" height="16" fill="#0c2340" />

                      {/* Dense QR Pattern elements simulating actual payment data */}
                      <rect x="60" y="20" width="8" height="16" fill="#0c2340" />
                      <rect x="75" y="15" width="12" height="8" fill="#0c2340" />
                      <rect x="60" y="45" width="20" height="8" fill="#0c2340" />
                      <rect x="90" y="30" width="8" height="25" fill="#0c2340" />
                      <rect x="20" y="60" width="25" height="8" fill="#0c2340" />
                      <rect x="20" y="80" width="12" height="16" fill="#0c2340" />
                      <rect x="60" y="60" width="40" height="40" rx="6" fill="#2563EB" />
                      <text x="80" y="84" fill="white" fontSize="13" fontWeight="900" textAnchor="middle">
                        UPI
                      </text>
                      <rect x="110" y="60" width="16" height="12" fill="#0c2340" />
                      <rect x="135" y="80" width="15" height="18" fill="#0c2340" />
                      <rect x="60" y="110" width="16" height="18" fill="#0c2340" />
                      <rect x="85" y="110" width="15" height="10" fill="#0c2340" />
                      <rect x="80" y="130" width="25" height="15" fill="#0c2340" />
                      <rect x="115" y="125" width="20" height="20" fill="#0c2340" />
                    </svg>

                    <div className="mt-2 text-center">
                      <span className="text-[11px] font-mono font-bold text-slate-800 block">
                        coopnex.labour@icici
                      </span>
                      <span className="text-[10px] text-slate-500">Scan with any UPI App</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-600">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">GPay</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">PhonePe</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">Paytm</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">BHIM</span>
                  </div>

                  {/* Simulator Trigger */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => executePayment("UPI_QR")}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Authorizing UPI Payment...</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4" />
                          <span>Simulate Phone Scan &amp; Approve ₹{totalAmount}</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Free Razorpay Sandbox Key: {RAZORPAY_TEST_KEY}
                    </span>
                  </div>
                </div>
              )}

              {/* METHOD 2: CARDS */}
              {selectedMethod === "CARD" && (
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Card Details</span>
                    <div className="flex gap-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">VISA</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">MasterCard</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">RuPay</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setShowOtpModal(true)}
                    className="w-full mt-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Proceed to Card Authentication (₹{totalAmount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* METHOD 3: NETBANKING */}
              {selectedMethod === "NETBANKING" && (
                <div className="space-y-4 text-left">
                  <span className="text-xs font-bold text-slate-800 block">Select Your Bank</span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                          selectedBank === bank
                            ? "bg-blue-50 border-blue-600 text-blue-800"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => executePayment(`NETBANKING_${selectedBank}`)}
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting to {selectedBank}...</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Pay ₹{totalAmount} via {selectedBank}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* PAYMENT SUCCESS SCREEN */
          <div className="p-8 text-center space-y-4 bg-emerald-50/50">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 animate-in zoom-in">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Payment of ₹{totalAmount}.00 Successful</h3>
              <p className="text-xs text-slate-500 mt-0.5">Razorpay Reference: {successData?.payment?.gatewayPaymentId || "pay_mock_success"}</p>
            </div>

            <div className="max-w-md mx-auto bg-white rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2 shadow-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Platform Maintenance &amp; Welfare:</span>
                <strong className="text-blue-700 font-black">₹{maintenanceFee}.00</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Worker Quality Escrow (24h Hold):</span>
                <strong className="text-emerald-700 font-black">₹{workerWage}.00</strong>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Escrow Status:</span>
                <span className="font-mono text-amber-700 font-bold">HELD_24H (Defect Warranty)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">Redirecting to your booking orders...</p>
          </div>
        )}

        {/* OTP SIMULATION MODAL */}
        {showOtpModal && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center border border-slate-200 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Bank 3D Secure OTP</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 4-digit code sent to your registered mobile ending in <strong>•••• 4920</strong>
                </p>
              </div>

              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-36 mx-auto text-center font-mono text-2xl font-black tracking-widest bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-600"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    executePayment("CARD_3DS");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
                >
                  Confirm OTP
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
