import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Copy,
  Check,
  Download,
  Star,
  Info
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { ttsService } from "../services/tts";

export interface RealisticPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id?: string;
    bookingNumber?: string;
    serviceType: string;
    amount: number;
    workerName: string;
    workerPhone?: string;
  };
  onPaymentSuccess?: (paymentDetails: any) => void;
  onOpenReview?: () => void;
}

export const RealisticPaymentModal: React.FC<RealisticPaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
  onOpenReview
}) => {
  const [method, setMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [upiApp, setUpiApp] = useState<string>("GPAY");
  const [countdown, setCountdown] = useState(299); // 4m 59s
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState("4532 8912 4589 1042");
  const [cardHolder, setCardHolder] = useState("SANTHOSH PYARAM");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("382");

  // Netbanking
  const [selectedBank, setSelectedBank] = useState("SBI");

  const { language } = useLanguage();
  // Transaction State: "IDLE" | "PROCESSING" | "SUCCESS"
  const [txState, setTxState] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE");
  const [processingStep, setProcessingStep] = useState(0);
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Authentic Multilingual Bharat UPI Soundbox Alert (Audio Chime + Speech)
  const playSoundboxAlert = (amount: number) => {
    // 1. Synthesize iconic dual-tone Soundbox audio chime
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // AudioContext blocked
    }

    // 2. Announce via Bharat Soundbox Multilingual Voice
    setTimeout(() => {
      let soundboxText = `COOPNEX. Payment of ₹${amount} received successfully in worker account.`;
      if (language === "te") {
        soundboxText = `సహకారి సేవ. వర్కర్ ఖాతాలో ₹${amount} రూపాయలు విజయవంతంగా జమ అయ్యాయి.`;
      } else if (language === "hi") {
        soundboxText = `सहकारी सेवा. कामगार खाते में ₹${amount} रुपये सफलतापूर्वक प्राप्त हुए।`;
      } else if (language === "ta") {
        soundboxText = `சஹகாரி சேவை. பணியாளர் கணக்கில் ₹${amount} ரூபாய் வரவு வைக்கப்பட்டது.`;
      } else if (language === "kn") {
        soundboxText = `ಸಹಕಾರಿ ಸೇವೆ. ಕೆಲಸಗಾರರ ಖಾತೆಗೆ ₹${amount} ಯಶಸ್ವಿಯಾಗಿ ಜಮೆಯಾಗಿದೆ.`;
      } else if (language === "bn") {
        soundboxText = `সহকারি সেবা. শ্রমিক অ্যাকাউন্টে ₹${amount} টাকা সফলভাবে জমা হয়েছে।`;
      } else if (language === "mr") {
        soundboxText = `सहकारी सेवा. कामगाराच्या खात्यात ₹${amount} रुपये यशस्वीरीत्या जमा झाले.`;
      }

      ttsService.speak(soundboxText, {
        id: `soundbox_payment_${amount}`,
        language
      });
    }, 350);
  };

  useEffect(() => {
    let timer: any;
    if (isOpen && countdown > 0 && txState === "IDLE") {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown, txState]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText("sahakari.escrow@npci");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePayNow = () => {
    setTxState("PROCESSING");
    setProcessingStep(0);
    const generatedUtr = `UPI/${new Date().getFullYear()}/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    setUtrNumber(generatedUtr);

    // Dynamic Step Timeline Progression
    setTimeout(() => setProcessingStep(1), 600);
    setTimeout(() => setProcessingStep(2), 1300);
    setTimeout(() => setProcessingStep(3), 2000);

    setTimeout(() => {
      setTxState("SUCCESS");
      playSoundboxAlert(booking.amount || 520);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          utrNumber: generatedUtr,
          amount: booking.amount,
          method,
          timestamp: new Date().toISOString()
        });
      }
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden my-6 transition-colors"
      >
        {/* Payment Gateway Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-black border border-white/20">
              <span className="text-xl">🇮🇳</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm tracking-wide">NPCI Bharat Seva Gateway</h3>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RBI Tokenized
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Cooperative Escrow & Direct Worker Payout System
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="px-6 py-4 bg-blue-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block">Total Payable (100% Escrow Secured)</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{booking.amount || 520}
              <span className="text-xs text-slate-400 font-normal ml-1">(Inclusive of GST)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">BOOKING ID</span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {booking.bookingNumber || "SS-AP-2026-8941"}
            </span>
          </div>
        </div>

        {/* Gateway Body */}
        <div className="p-6">
          {txState === "IDLE" && (
            <div className="space-y-5">
              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setMethod("UPI")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    method === "UPI"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("CARD")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    method === "CARD"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>RuPay / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("NETBANKING")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    method === "NETBANKING"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Netbanking</span>
                </button>
              </div>

              {/* TAB 1: UPI / QR CODE */}
              {method === "UPI" && (
                <div className="space-y-4">
                  {/* Dynamic QR Display */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-2">
                      <span>Scan with any UPI App</span>
                      <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">
                        ⏱️ QR expires in {formatTimer(countdown)}
                      </span>
                    </div>

                    <div className="relative inline-block p-3 bg-white rounded-2xl shadow-md border-2 border-slate-200 overflow-hidden group">
                      {/* Animated Glowing Laser Scanner Line */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-laser-scan z-20 pointer-events-none" />

                      {/* Corner Target Markers */}
                      <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-blue-600 pointer-events-none" />
                      <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-blue-600 pointer-events-none" />
                      <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-blue-600 pointer-events-none" />
                      <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-blue-600 pointer-events-none" />
                      {/* Realistic SVG UPI QR Pattern */}
                      <svg className="w-44 h-44" viewBox="0 0 160 160" fill="none">
                        <rect width="160" height="160" fill="white" />
                        {/* Corner Targets */}
                        <rect x="10" y="10" width="40" height="40" rx="6" fill="#1E3A8A" />
                        <rect x="18" y="18" width="24" height="24" rx="4" fill="white" />
                        <rect x="24" y="24" width="12" height="12" rx="2" fill="#1E3A8A" />

                        <rect x="110" y="10" width="40" height="40" rx="6" fill="#1E3A8A" />
                        <rect x="118" y="18" width="24" height="24" rx="4" fill="white" />
                        <rect x="124" y="24" width="12" height="12" rx="2" fill="#1E3A8A" />

                        <rect x="10" y="110" width="40" height="40" rx="6" fill="#1E3A8A" />
                        <rect x="18" y="118" width="24" height="24" rx="4" fill="white" />
                        <rect x="24" y="124" width="12" height="12" rx="2" fill="#1E3A8A" />

                        {/* Center Emblem */}
                        <circle cx="80" cy="80" r="16" fill="#FF6B00" />
                        <text x="80" y="85" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">₹</text>

                        {/* QR Matrix Dots */}
                        <rect x="60" y="15" width="8" height="8" fill="#334155" />
                        <rect x="75" y="15" width="8" height="8" fill="#334155" />
                        <rect x="90" y="15" width="8" height="8" fill="#334155" />
                        <rect x="60" y="35" width="8" height="8" fill="#334155" />
                        <rect x="85" y="35" width="8" height="8" fill="#334155" />

                        <rect x="15" y="65" width="8" height="8" fill="#334155" />
                        <rect x="35" y="65" width="8" height="8" fill="#334155" />
                        <rect x="115" y="65" width="8" height="8" fill="#334155" />
                        <rect x="135" y="65" width="8" height="8" fill="#334155" />

                        <rect x="60" y="105" width="8" height="8" fill="#334155" />
                        <rect x="80" y="115" width="8" height="8" fill="#334155" />
                        <rect x="95" y="105" width="8" height="8" fill="#334155" />
                        <rect x="115" y="115" width="8" height="8" fill="#334155" />
                        <rect x="135" y="130" width="8" height="8" fill="#334155" />
                      </svg>
                    </div>

                    {/* Copy UPI VPA */}
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">VPA:</span>
                      <code className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                        sahakari.escrow@npci
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="p-1 text-blue-600 hover:text-blue-700 cursor-pointer"
                        title="Copy UPI VPA"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Popular UPI Apps Quick Select */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Or select your UPI App:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "GPAY", label: "GPay", color: "text-blue-600", bg: "hover:border-blue-400" },
                        { id: "PHONEPE", label: "PhonePe", color: "text-purple-600", bg: "hover:border-purple-400" },
                        { id: "PAYTM", label: "Paytm", color: "text-cyan-600", bg: "hover:border-cyan-400" },
                        { id: "BHIM", label: "BHIM", color: "text-amber-600", bg: "hover:border-amber-400" }
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setUpiApp(app.id)}
                          className={`p-2.5 rounded-xl border text-center font-black text-xs transition cursor-pointer ${
                            upiApp === app.id
                              ? "border-blue-600 bg-blue-50/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className={`text-sm ${app.color}`}>●</div>
                          <div>{app.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RUPAY / DEBIT / CREDIT CARD */}
              {method === "CARD" && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Card Details</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">RuPay</span>
                      <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Visa</span>
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Mastercard</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Card Number (RBI Tokenized)
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        CVV / Security Code
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NETBANKING */}
              {method === "NETBANKING" && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Select Your Bank:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: "SBI", name: "State Bank of India" },
                      { code: "HDFC", name: "HDFC Bank" },
                      { code: "ICICI", name: "ICICI Bank" },
                      { code: "AXIS", name: "Axis Bank" },
                      { code: "PNB", name: "Punjab National Bank" },
                      { code: "CANARA", name: "Canara Bank" }
                    ].map((bank) => (
                      <button
                        key={bank.code}
                        type="button"
                        onClick={() => setSelectedBank(bank.code)}
                        className={`p-2 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                          selectedBank === bank.code
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-[11px] font-black">{bank.code}</div>
                        <div className="text-[9px] text-slate-400 truncate">{bank.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Assurance Badge */}
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Escrow Guarantee:</strong> Payment is held safely in cooperative escrow until you approve job completion.
                </span>
              </div>

              {/* Authorize & Pay Button */}
              <button
                type="button"
                onClick={handlePayNow}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black py-3.5 px-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>AUTHORIZE & PAY ₹{booking.amount || 520}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* NPCI Real-Time Processing Animation & Escrow Timeline */}
          {txState === "PROCESSING" && (
            <div className="py-6 px-2 space-y-6">
              <div className="text-center space-y-2">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-blue-600 dark:text-blue-400">
                    ₹
                  </div>
                </div>
                <h4 className="font-black text-slate-900 dark:text-white text-base">
                  NPCI Bharat UPI Escrow Processing...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Routing payment through Unified Labour Cooperative Clearing House
                </p>
              </div>

              {/* 4-Step Animated Timeline */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                {[
                  { title: "1. Connecting to NPCI Unified Payment Interface (UPI 2.0)", desc: "RBI tokenized gateway verification" },
                  { title: "2. Validating Cooperative Wage Escrow Smart Contract", desc: "Locking statutory floor wage in tripartite account" },
                  { title: "3. Securing 0% Intermediary Zero-Commission Policy", desc: "No middleman cuts (100% base preserved)" },
                  { title: "4. Authorizing Direct DBT Settlement to Worker Account", desc: `Direct credit destined for ${booking.workerName}` }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-all ${
                      processingStep > idx
                        ? "bg-emerald-500 text-white shadow-xs"
                        : processingStep === idx
                        ? "bg-blue-600 text-white animate-pulse"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                    }`}>
                      {processingStep > idx ? "✓" : idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold ${processingStep >= idx ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                        {step.title}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center text-[11px] font-mono text-slate-400 animate-pulse">
                🔒 256-Bit SSL Encrypted Escrow • Do not refresh or close
              </div>
            </div>
          )}

          {/* Payment Success Phase */}
          {txState === "SUCCESS" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="py-4 space-y-4"
            >
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Payment Successful!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ₹{booking.amount || 520} deposited into Cooperative Escrow for {booking.workerName}.
                </p>
              </div>

              {/* Realistic Bharat UPI Soundbox Alert Audio Badge */}
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-850 rounded-2xl border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    🔊
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                      Bharat UPI Soundbox Alert
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      ₹{booking.amount || 520} received in Worker DBT Wallet
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => playSoundboxAlert(booking.amount || 520)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
                  title="Replay audio announcement"
                >
                  Replay ❯
                </button>
              </div>

              {/* Tax Invoice & UTR Receipt */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-mono text-[11px] text-slate-400">TRANSACTION REF / UTR</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{utrNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Worker Take-Home (Zero Commission):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{Math.round((booking.amount || 520) * 0.85)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Cooperative Welfare & Health Fund (10%):</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    ₹{Math.round((booking.amount || 520) * 0.10)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">GSTIN Tax (37AAACS0129F1Z5) (5%):</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    ₹{Math.round((booking.amount || 520) * 0.05)}
                  </span>
                </div>
              </div>

              {/* Next Actions */}
              <div className="space-y-2 pt-2">
                {onOpenReview && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenReview();
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black py-3 px-5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-current" />
                    <span>RATE WORKER & UPLOAD WORK PROOF</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(!showInvoiceModal)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{showInvoiceModal ? "Hide Tax Invoice" : "View & Download Official Tax Invoice (PDF)"}</span>
                </button>

                {showInvoiceModal && (
                  <div className="p-4 bg-white dark:bg-slate-950 border-2 border-blue-500/40 rounded-2xl text-[11px] space-y-2 font-mono text-slate-800 dark:text-slate-200">
                    <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-800">
                      <strong className="block text-xs font-sans">COOPNEX NATIONAL COOPERATIVE TAX INVOICE</strong>
                      <span className="text-[10px] text-slate-400">Ministry of Cooperation • GoI Public Digital Goods</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Invoice No:</span>
                      <span className="font-bold">INV-AP-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer PIN:</span>
                      <span>520001 (Vijayawada)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assigned Artisan:</span>
                      <span className="font-bold">{booking.workerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Settlement Mode:</span>
                      <span className="text-emerald-600 font-bold">Bharat UPI Instant DBT</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-bold">
                      ✓ Electronically verified &amp; sealed by Reserve Bank of India Tokenization
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

