import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2,
  X,
  Volume2,
  Gauge,
  User,
  RotateCcw,
  Sparkles,
  Check
} from "lucide-react";
import {
  ttsService,
  TtsState,
  VoiceSpeedSetting,
  VOICE_CONFIGS,
  getVoiceProfile
} from "../services/tts";
import { useLanguage } from "../context/LanguageContext";

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language } = useLanguage();
  const [ttsState, setTtsState] = useState<TtsState>(ttsService.getState());
  const profile = getVoiceProfile(language);

  useEffect(() => {
    return ttsService.subscribe((state) => {
      setTtsState(state);
    });
  }, []);

  if (!isOpen) return null;

  const handleSpeedChange = (speed: VoiceSpeedSetting) => {
    ttsService.setSpeed(speed);
  };

  const handleGenderChange = (gender: "FEMALE" | "MALE") => {
    ttsService.setGender(gender);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ttsService.setVolume(parseFloat(e.target.value));
  };

  const handleTestVoice = () => {
    ttsService.speak(profile.sampleSentence, {
      id: "settings_test_preview",
      language,
      phoneticText: profile.phoneticSampleSentence
    });
  };

  const handleResetDefaults = () => {
    ttsService.setSpeed("NORMAL");
    ttsService.setGender("FEMALE");
    ttsService.setVolume(1.0);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 z-10 overflow-hidden"
        >
          {/* Decorative Top Ambient Orb */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Voice & Speech Settings</span>
                  <span className="text-[10px] uppercase font-black bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                    Multilingual
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calibrate playback cadence for {profile.nativeName} ({profile.languageName})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {/* 1. Speech Cadence / Speed */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-blue-600" />
                  <span>Speaking Speed (Cadence)</span>
                </span>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  {ttsState.speed === "NORMAL" ? "Standard (0.90x)" : ttsState.speed === "SLOW" ? "Gentle (0.80x)" : "Very Slow (0.68x)"}
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(["NORMAL", "SLOW", "VERY_SLOW"] as VoiceSpeedSetting[]).map((spd) => {
                  const isSelected = ttsState.speed === spd;
                  return (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => handleSpeedChange(spd)}
                      className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                          : "bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span>{spd === "NORMAL" ? "Normal" : spd === "SLOW" ? "Slow" : "Very Slow"}</span>
                      <span className={`text-[10px] ${isSelected ? "text-blue-200" : "text-slate-400"}`}>
                        {spd === "NORMAL" ? "Clear" : spd === "SLOW" ? "Relaxed" : "Guided"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Voice Persona / Gender */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Voice Persona</span>
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(["FEMALE", "MALE"] as const).map((gender) => {
                  const isSelected = ttsState.gender === gender;
                  return (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => handleGenderChange(gender)}
                      className={`py-2.5 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                          : "bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span>{gender === "FEMALE" ? "Female Voice" : "Male Voice"}</span>
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Output Volume */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Audio Volume</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {Math.round(ttsState.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={ttsState.volume}
                onChange={handleVolumeChange}
                className="w-full accent-emerald-600 dark:accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Active Voice Info Card */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs">
              <div className="flex items-center justify-between font-bold text-blue-900 dark:text-blue-200 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Current Speech Engine</span>
                </span>
                <span className="text-[10px] bg-blue-200/60 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-mono">
                  {profile.languageCode}
                </span>
              </div>
              <div className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
                Primary: <strong className="font-semibold">{profile.voiceName}</strong> • Engine: <span className="font-semibold capitalize">{ttsState.provider}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestVoice}
                className="px-4 py-2 rounded-full border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Voice</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

