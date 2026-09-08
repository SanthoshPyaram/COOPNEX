import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  FileCheck,
  QrCode,
  CheckCircle2,
  Phone,
  Droplet,
  Languages,
  Award
} from "lucide-react";
import { ttsService } from "../services/tts/ttsService";

interface VideoChapter {
  id: number;
  number: string;
  tag: string;
  title: string;
  subtitle: string;
  narration: string;
  bulletPoints: string[];
  imageUrl: string;
}

const TUTORIAL_CHAPTERS: VideoChapter[] = [
  {
    id: 1,
    number: "01",
    tag: "ONBOARDING & LANGUAGES",
    title: "1. Register Online & Select Spoken Languages",
    subtitle: "Choose all regional languages you speak for closer customer match",
    narration: "पंजीकरण के समय अपना नाम, आयु, और ब्लड ग्रुप दर्ज करें। आप जितने भी क्षेत्रीय भाषाएं जानते हैं—जैसे तेलुगु, हिंदी, अंग्रेजी—उन्हें चुनें ताकि ग्राहक आपसे अपनी मातृभाषा में बात कर सकें।",
    bulletPoints: [
      "Select multiple languages: Telugu, Hindi, English, Tamil, Kannada, etc.",
      "Enter Age, Gender, and Blood Group (e.g. O+, B+) for emergency medical shield",
      "Instant 6-box OTP verification on your mobile number"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
  },
  {
    id: 2,
    number: "02",
    tag: "KYC & SECURITY",
    title: "2. 5-Document KYC & Algorithmic Anti-Fraud Check",
    subtitle: "UIDAI Verhoeff biometric validation & police clearance check",
    narration: "अपनी स्थानीय प्राथमिक सहकारी संस्था के लिए आधार, पैन, पुलिस सत्यापन और आईटीआई कौशल प्रमाणपत्र अपलोड करें। वर्होफ़ एल्गोरिथ्म द्वारा सभी दस्तावेज़ जाँचे जाते हैं।",
    bulletPoints: [
      "UIDAI Verhoeff polynomial checksum prevents fake or modified ID numbers",
      "Local Police Clearance Certificate (PCC) confirms 100% crime-free record",
      "State Skill Council NSQF Level-4 trade qualification verification"
    ],
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&q=80"
  },
  {
    id: 3,
    number: "03",
    tag: "SMART ID & QR",
    title: "3. Generating Your Cooperative Smart ID Card",
    subtitle: "Official 2-sided identity card with photo, signature, blood group & QR",
    narration: "सत्यापन पूरा होते ही आपका डिजिटल स्मार्ट पहचान पत्र जारी होता है। इसमें आपकी फोटो, डिजिटल हस्ताक्षर, ब्लड ग्रुप और पीछे की तरफ़ आधिकारिक क्यूआर कोड होता है।",
    bulletPoints: [
      "Front side: Verified Photo, Employee ID, Age, Blood Group & Digital Signature",
      "Back side: Encrypted QR Code for customer to scan and verify live credentials",
      "1-Click PDF Download and print option for physical pocket wear"
    ],
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
  },
  {
    id: 4,
    number: "04",
    tag: "DOORSTEP & PAYOUT",
    title: "4. Doorstep 4-Digit OTP & 100% Bharat UPI Payout",
    subtitle: "Zero aggregator cut — 100% of fair floor wage directly to your bank",
    narration: "ग्राहक के घर पहुँचने पर अपना आधिकारिक फोटो पहचान पत्र दिखाएँ। ग्राहक से 4-अंकीय ओटीपी लेकर काम शुरू करें। काम पूरा होते ही भारत यूपीआई से पूरा पैसा तुरंत आपके खाते में जमा होगा।",
    bulletPoints: [
      "7-minute dispatch with live road GPS navigation and toolkit",
      "Customer shares 4-digit safety OTP after checking your co-op badge",
      "Instant soundbox payment release with 0% platform commission deduction"
    ],
    imageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80"
  }
];

export const WorkerTutorialVideo: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  const currentChapter = TUTORIAL_CHAPTERS[activeChapterIdx];

  // Auto advance loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveChapterIdx((prev) => (prev + 1) % TUTORIAL_CHAPTERS.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle voice narration
  useEffect(() => {
    if (audioActive) {
      ttsService.stop();
      ttsService.speak(currentChapter.narration, {
        id: `worker_video_${currentChapter.id}`,
        language: "hi",
        gender: "FEMALE"
      });
    }
  }, [activeChapterIdx, audioActive]);

  const toggleVoice = () => {
    if (audioActive) {
      setAudioActive(false);
      ttsService.stop();
    } else {
      setAudioActive(true);
      ttsService.stop();
      ttsService.speak(currentChapter.narration, {
        id: `worker_video_${currentChapter.id}`,
        language: "hi",
        gender: "FEMALE"
      });
    }
  };

  return (
    <div className={`w-full bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden ${className}`}>
      {/* Video Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Worker Onboarding &amp; Smart ID Video Guide
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Official Tutorial
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Complete step-by-step video walkthrough for verified cooperative workers
            </p>
          </div>
        </div>

        {/* Video Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Narration Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              audioActive
                ? "bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {audioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{audioActive ? "Voice On" : "Listen Voice"}</span>
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Tour</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Video Viewport Stage */}
      <div className="relative h-[340px] sm:h-[380px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
        
        {/* Background photo crossfade */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={currentChapter.imageUrl}
            alt={currentChapter.title}
            className="w-full h-full object-cover opacity-20 filter blur-[2px] transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        </div>

        {/* Top Progress & Chapter Tag */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white font-mono font-bold text-xs border border-blue-400/30 flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentChapter.tag}</span>
          </span>

          <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 text-xs font-mono text-slate-300">
            <span>CHAPTER {currentChapter.id} OF 4</span>
          </div>
        </div>

        {/* Center Card with Dual Presentation */}
        <div className="relative z-10 my-auto max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="bg-slate-900/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-700/80 shadow-2xl text-left space-y-3"
            >
              <div>
                <h4 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {currentChapter.title}
                </h4>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  {currentChapter.subtitle}
                </p>
              </div>

              {/* Checklist points */}
              <div className="space-y-1.5 pt-1 text-xs text-slate-200">
                {currentChapter.bulletPoints.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Manual Arrow Controls */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveChapterIdx((activeChapterIdx > 0 ? activeChapterIdx - 1 : TUTORIAL_CHAPTERS.length - 1))}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* 4 Story Dots */}
          <div className="flex items-center gap-1.5">
            {TUTORIAL_CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChapterIdx(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeChapterIdx === idx
                    ? "w-8 bg-blue-500 shadow-xs shadow-blue-500/80"
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
                title={`Go to chapter ${ch.id}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveChapterIdx((activeChapterIdx + 1) % TUTORIAL_CHAPTERS.length)}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Step Ribbon Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-800 bg-slate-900">
        {TUTORIAL_CHAPTERS.map((ch, idx) => {
          const isActive = idx === activeChapterIdx;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveChapterIdx(idx)}
              className={`p-3 sm:p-3.5 text-left border-b sm:border-b-0 sm:border-r last:border-r-0 border-slate-800 transition cursor-pointer relative ${
                isActive
                  ? "bg-slate-800/90 text-white font-bold"
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              )}
              <div className="text-[10px] font-mono text-blue-400 font-bold">CHAPTER 0{ch.id}</div>
              <div className="text-xs font-bold text-white truncate mt-0.5">{ch.title.replace(/^\d+\.\s*/, "")}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

