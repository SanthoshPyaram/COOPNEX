import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneCall,
  PhoneForwarded,
  MapPin,
  Navigation,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  UserCheck,
  Zap,
  ArrowRight,
  Radio,
  Check
} from "lucide-react";
import { ttsService } from "../../services/tts/ttsService";

interface StepData {
  id: number;
  title: string;
  badge: string;
  badgeColor: string;
  headline: string;
  description: string;
  speechText: string;
}

const STEPS: StepData[] = [
  {
    id: 0,
    title: "1. Phone Dialing",
    badge: "1-CLICK DIAL",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    headline: "Dialing Nearest Cooperative Dispatcher",
    description: "Citizen dials 1800-COOPNEX or clicks 1-tap call. Our smart IVR instantly connects you directly to the verified primary cooperative society in your municipal ward.",
    speechText: "Connecting your call to the nearest Vijayawada primary labour cooperative dispatch center."
  },
  {
    id: 1,
    title: "2. Dispatcher Match",
    badge: "ALGORITHMIC MATCH",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    headline: "Dispatcher Matches Certified Artisan",
    description: "The primary society secretary pairs you with the highest-rated, Level-4 certified artisan within 2.5 km. No algorithms surge-pricing your emergency.",
    speechText: "Artisan matched: Rajesh Kumar, certified Level 4 electrician with 4.9 rating, is accepting your job."
  },
  {
    id: 2,
    title: "3. Live GPS Transit",
    badge: "EN ROUTE • 0% SURGE",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    headline: "Artisan En Route on Electric Scooter",
    description: "Watch your artisan navigate in real-time with live GPS tracking. Tools, safety equipment, and UIDAI badge verified prior to departure.",
    speechText: "Artisan Rajesh is en route on his electric two-wheeler. Estimated arrival time: 8 minutes."
  },
  {
    id: 3,
    title: "4. Doorstep Handshake",
    badge: "SECURE 4-DIGIT OTP",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    headline: "Doorstep Arrival & Safe Handshake OTP",
    description: "Worker arrives at your door. You share a secure 4-digit handshake OTP to unlock the service. Escrow locks safely with 100% direct floor wage guarantee.",
    speechText: "Artisan has arrived at your doorstep. Please share the four digit security OTP to begin work."
  }
];

export const DoorstepDispatchSimulator: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [dialProgress] = useState("98490 23145");
  const [otpCode] = useState("4921");
  const [otpEntered, setOtpEntered] = useState(false);
  const [transitEta, setTransitEta] = useState(8);

  const stepTimerRef = useRef<any>(null);

  // Auto-advance loop when isPlaying
  useEffect(() => {
    if (!isPlaying) return;

    stepTimerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 6500);

    return () => clearInterval(stepTimerRef.current);
  }, [isPlaying]);

  // Voice narration when step changes and audio is enabled
  useEffect(() => {
    if (audioEnabled) {
      ttsService.speak(STEPS[activeStep].speechText, {
        id: `dispatch_step_${activeStep}`
      });
    }

    if (activeStep === 2) {
      setTransitEta(8);
      const countdown = setInterval(() => {
        setTransitEta((prev) => (prev > 1 ? prev - 1 : 1));
      }, 700);
      return () => clearInterval(countdown);
    }

    if (activeStep === 3) {
      setOtpEntered(false);
      const otpTimer = setTimeout(() => {
        setOtpEntered(true);
      }, 1800);
      return () => clearTimeout(otpTimer);
    }
  }, [activeStep, audioEnabled]);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    if (next) {
      ttsService.speak(STEPS[activeStep].speechText, {
        id: `dispatch_step_${activeStep}`
      });
    } else {
      ttsService.stop();
    }
  };

  return (
    <div className={`relative bg-gradient-to-br from-slate-900 via-[#0B1528] to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden ${className}`}>
      {/* Decorative ambient radial glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Controls */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/90 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>INTERACTIVE DISPATCH LIFECYCLE</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            How Our Worker Comes To Your Doorstep
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            From your first phone dial to instant doorstep arrival with 4-digit cryptographic handshake OTP.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title={isPlaying ? "Pause Auto-Slide" : "Resume Auto-Slide"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlaying ? "Auto-Playing" : "Paused"}</span>
          </button>

          <button
            type="button"
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              audioEnabled
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
            title={audioEnabled ? "Mute Voice Narration" : "Enable Voice Narration"}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{audioEnabled ? "Voice On" : "Voice Off"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(0)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Restart Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Step Progress Navigation Pills */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2.5 my-6">
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                isActive
                  ? "bg-slate-800/90 border-blue-500/80 shadow-lg shadow-blue-500/10 text-white"
                  : "bg-slate-900/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              {isActive && isPlaying && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 6.5, ease: "linear" }}
                  key={activeStep}
                />
              )}
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isActive ? "text-blue-400 font-mono" : "text-slate-500 font-mono"}>
                  0{step.id + 1}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div className="font-bold text-xs mt-1 truncate">{step.title.split(". ")[1]}</div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Stage Visual (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 sm:p-7 min-h-[380px] flex flex-col justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* STAGE 0: CALLER & DIALING ANIMATION */}
            {activeStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Cellular Dialing Active
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                    Toll-Free Helpline
                  </span>
                </div>

                {/* Animated Phone Dialing Card */}
                <div className="max-w-sm mx-auto bg-slate-900/90 rounded-2xl border border-slate-700 p-5 shadow-xl text-center space-y-4">
                  <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    {/* Animated Pulsing Sound Rings */}
                    <motion.div
                      animate={{ scale: [1, 1.4, 1.8], opacity: [0.8, 0.4, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.6, 2.2], opacity: [0.6, 0.3, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
                      className="absolute inset-0 rounded-full border-2 border-emerald-400"
                    />
                    <PhoneCall className="w-8 h-8 animate-bounce text-amber-300" />
                  </div>

                  <div>
                    <div className="text-lg font-mono font-black text-white tracking-widest">
                      +91 {dialProgress}
                    </div>
                    <div className="text-xs text-blue-400 font-semibold mt-0.5">
                      Calling: Vijayawada Central Labour Co-op
                    </div>
                  </div>

                  {/* Sound Wave Frequency Visualizer */}
                  <div className="flex items-center justify-center gap-1.5 h-8 pt-1">
                    {[16, 28, 12, 32, 20, 36, 14, 26, 18, 30].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, h, 8] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
                        className="w-1 bg-gradient-to-t from-blue-500 to-emerald-400 rounded-full"
                        style={{ height: h }}
                      />
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Free Govt Cooperative IVR Routing</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 1: DISPATCHER MATCH ANIMATION */}
            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Nearest Verified Match Found
                  </span>
                  <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    2.1 km Distance
                  </span>
                </div>

                {/* Worker Match Dossier Card */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-700 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
                        alt="Rajesh Kumar"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full text-[10px] font-bold">
                        <Check className="w-3 h-3" />
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-white">RAJESH KUMAR</h4>
                        <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                          ★ 4.9 (142 Jobs)
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Senior Electrician • Level 4 NSDC Certified
                      </div>
                      <div className="text-[11px] text-blue-400 font-mono mt-1">
                        Society: Vijayawada Central Co-op (PLCS-04)
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] text-center">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <span className="text-slate-400 block">UIDAI Biometric</span>
                      <strong className="text-emerald-400">Verhoeff PASS</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <span className="text-slate-400 block">Police Clearance</span>
                      <strong className="text-emerald-400">PCC Clean</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <span className="text-slate-400 block">Floor Wage</span>
                      <strong className="text-amber-400">₹450/hr Base</strong>
                    </div>
                  </div>

                  {/* Dispatcher Confirmation Banner */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
                    <span className="font-semibold">⚡ Worker Accepted Job &amp; Unlocking EV Scooter</span>
                    <span className="font-mono font-bold">ACK #9841</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: LIVE GPS ROUTE TRANSIT */}
            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Live Telemetry Stream
                    </span>
                  </div>
                  <span className="text-sm font-black text-amber-400 font-mono bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                    ETA: {transitEta} MINS
                  </span>
                </div>

                {/* Animated Map Route Canvas Simulation */}
                <div className="relative h-56 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden p-4 flex flex-col justify-between">
                  {/* Grid Lines resembling city layout */}
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Pulsing Destination (Citizen Doorstep) */}
                  <div className="absolute top-6 right-8 flex flex-col items-center z-10">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/50">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-2 border-blue-400"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded-md mt-1 border border-slate-700">
                      Your Doorstep
                    </span>
                  </div>

                  {/* Starting Node (Labour Society Dispatch) */}
                  <div className="absolute bottom-6 left-8 flex flex-col items-center z-10">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-amber-400 shadow-md">
                      🏢
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md mt-1 border border-slate-700">
                      Primary Co-op Hub
                    </span>
                  </div>

                  {/* Neon Route Line with Moving Worker Bike */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
                    <path
                      d="M 60 150 Q 180 160, 220 100 T 340 40"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="6"
                    />
                    <path
                      d="M 60 150 Q 180 160, 220 100 T 340 40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                    />
                  </svg>

                  {/* Animated Worker Scooter on the Route */}
                  <motion.div
                    animate={{
                      x: [40, 140, 200, 290],
                      y: [120, 100, 60, 20]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute z-20 flex items-center gap-1 bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-full font-bold text-xs shadow-lg shadow-emerald-500/40"
                  >
                    <span>🛵</span>
                    <span>Rajesh (Electrician)</span>
                  </motion.div>

                  {/* Bottom Telemetry HUD */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
                    <div>Speed: <strong className="text-white">28 km/h</strong> (EV)</div>
                    <div>Route: <strong className="text-blue-400">MG Road Bypass</strong></div>
                    <div>Distance: <strong className="text-emerald-400">1.2 km left</strong></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: DOORSTEP ARRIVAL & OTP HANDSHAKE */}
            {activeStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                    <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                      Doorstep Contact Reached
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-purple-500/10 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    Handshake Protocol
                  </span>
                </div>

                {/* Doorstep Verification Simulation */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-700 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-white">4-Digit Security Handshake</h4>
                      <p className="text-xs text-slate-400">Share this code with Rajesh to confirm safe arrival</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 4-Digit OTP Display Blocks */}
                  <div className="grid grid-cols-4 gap-2.5 max-w-xs mx-auto text-center">
                    {otpCode.split("").map((digit, idx) => (
                      <div
                        key={idx}
                        className="py-3 bg-slate-950 rounded-xl border-2 border-purple-500/60 font-mono text-2xl font-black text-white shadow-inner"
                      >
                        {digit}
                      </div>
                    ))}
                  </div>

                  {/* Worker Validation Status */}
                  <div className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    otpEntered
                      ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                      : "bg-slate-950/60 border-slate-800 text-slate-400"
                  }`}>
                    <div className="flex items-center gap-2">
                      {otpEntered ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      )}
                      <span>
                        {otpEntered
                          ? "OTP Verified by Worker Device! Work Started with Escrow Guard."
                          : "Waiting for artisan Rajesh to enter code on mobile..."}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">
                      {otpEntered ? "ACTIVE 00:00" : "WAITING"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Explainer Column (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black border ${STEPS[activeStep].badgeColor}`}>
              {STEPS[activeStep].badge}
            </span>
            <span className="text-slate-300 text-xs">Lifecycle Phase {activeStep + 1} of 4</span>
          </div>

          <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {STEPS[activeStep].headline}
          </h4>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {STEPS[activeStep].description}
          </p>

          {/* Value Guarantee Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">0% Aggregator Cut</span>
              <p className="text-slate-400 text-[11px]">Worker receives entire base payment without 30% private app fees.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">100% Escrow Guard</span>
              <p className="text-slate-400 text-[11px]">Money stays protected in cooperative vault until you are satisfied.</p>
            </div>
          </div>

          {/* Interactive Step Navigator Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : STEPS.length - 1))}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
            >
              ← Previous Phase
            </button>
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev + 1) % STEPS.length)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Next Phase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

