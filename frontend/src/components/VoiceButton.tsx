import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Loader2, Play, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ttsService, TtsState } from "../services/tts";
import { Language } from "../i18n/languages";
import { useLanguage } from "../context/LanguageContext";

export interface VoiceButtonProps {
  text: string;
  phoneticText?: string;
  id?: string;
  language?: Language;
  variant?: "button" | "icon" | "pill" | "minimal";
  size?: "sm" | "md" | "lg";
  label?: string;
  title?: string;
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  text,
  phoneticText,
  id,
  language: langProp,
  variant = "button",
  size = "md",
  label,
  title = "Listen to audio narration in selected Indian language",
  className = ""
}) => {
  const { language: currentAppLang } = useLanguage();
  const effectiveLang = langProp || currentAppLang;
  const buttonId = id || `vb_${text.slice(0, 24).replace(/[^a-zA-Z0-9]/g, "_")}`;

  const [ttsState, setTtsState] = useState<TtsState>(ttsService.getState());

  useEffect(() => {
    const unsubscribe = ttsService.subscribe((state) => {
      setTtsState(state);
    });
    return unsubscribe;
  }, []);

  const isThisActive = ttsState.activeId === buttonId;
  const isPlaying = isThisActive && ttsState.status === "PLAYING";
  const isLoading = isThisActive && ttsState.status === "LOADING";
  const isPaused = isThisActive && ttsState.status === "PAUSED";
  const isError = isThisActive && ttsState.status === "ERROR";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      ttsService.stop();
    } else if (isPaused) {
      ttsService.resume();
    } else {
      ttsService.speak(text, {
        id: buttonId,
        language: effectiveLang,
        phoneticText
      });
    }
  };

  // Size mappings
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-xs sm:text-sm px-3.5 py-1.5 gap-2",
    lg: "text-sm sm:text-base px-4 py-2 gap-2.5"
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  // Soundwave visualizer animation bars
  const Soundwave = () => (
    <div className="flex items-center gap-0.5 h-3.5 px-0.5">
      <motion.span
        animate={{ height: ["4px", "14px", "6px", "12px", "4px"] }}
        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
      />
      <motion.span
        animate={{ height: ["8px", "4px", "14px", "6px", "8px"] }}
        transition={{ repeat: Infinity, duration: 0.5, delay: 0.1, ease: "easeInOut" }}
        className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
      />
      <motion.span
        animate={{ height: ["4px", "12px", "4px", "14px", "4px"] }}
        transition={{ repeat: Infinity, duration: 0.7, delay: 0.2, ease: "easeInOut" }}
        className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
      />
      <motion.span
        animate={{ height: ["10px", "5px", "12px", "4px", "10px"] }}
        transition={{ repeat: Infinity, duration: 0.55, delay: 0.15, ease: "easeInOut" }}
        className="w-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
      />
    </div>
  );

  // 1. ICON VARIANT (Compact circle)
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={title}
        aria-label={title}
        className={`relative inline-flex items-center justify-center p-2 rounded-full border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
          isPlaying
            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 ring-2 ring-blue-400/40"
            : isLoading
            ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 border-blue-300 dark:border-blue-700"
            : isError
            ? "bg-red-50 dark:bg-red-950/40 text-red-600 border-red-300 hover:bg-red-100"
            : "bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 hover:border-blue-300"
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin text-blue-600 dark:text-blue-400`} />
        ) : isPlaying ? (
          <Soundwave />
        ) : isPaused ? (
          <Play className={`${iconSizes[size]} fill-current`} />
        ) : isError ? (
          <AlertCircle className={`${iconSizes[size]} text-red-500`} />
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
      </button>
    );
  }

  // 2. PILL / BUTTON VARIANT
  return (
    <button
      type="button"
      onClick={handleClick}
      title={title}
      aria-label={title}
      className={`inline-flex items-center rounded-full font-bold transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${sizeClasses[size]} ${
        isPlaying
          ? "bg-blue-600 text-white border border-blue-500 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/30"
          : isLoading
          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
          : isPaused
          ? "bg-amber-500 text-white border border-amber-600 shadow-xs"
          : isError
          ? "bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 hover:bg-red-100"
          : variant === "pill"
          ? "bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700"
          : "bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs hover:border-blue-400"
      } ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
          <span>Generating...</span>
        </>
      ) : isPlaying ? (
        <>
          <Soundwave />
          <span>{label || "Playing..."}</span>
          <VolumeX className="w-3.5 h-3.5 ml-0.5 opacity-80 hover:opacity-100" />
        </>
      ) : isPaused ? (
        <>
          <Play className={`${iconSizes[size]} fill-current`} />
          <span>Resume</span>
        </>
      ) : isError ? (
        <>
          <AlertCircle className={`${iconSizes[size]} text-red-500`} />
          <span>Try Again</span>
        </>
      ) : (
        <>
          <Volume2 className={iconSizes[size]} />
          <span>{label || "Listen"}</span>
        </>
      )}
    </button>
  );
};
