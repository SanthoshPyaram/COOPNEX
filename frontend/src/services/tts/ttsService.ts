import { Language } from "../../i18n/languages";
import {
  VOICE_CONFIGS,
  VoiceSpeedSetting,
  SPEED_MULTIPLIERS,
  getVoiceProfile
} from "./voiceConfig";
import { prepareTextForSpeech, buildSsml } from "./ssmlFormatter";
import { AudioCache, generateCacheKey } from "./audioCache";
import {
  initBrowserVoices,
  speakViaBrowserFallback,
  selectBestBrowserVoice
} from "./browserFallback";

export type TtsPlaybackStatus = "IDLE" | "LOADING" | "PLAYING" | "PAUSED" | "ERROR";

export interface TtsState {
  status: TtsPlaybackStatus;
  activeId: string | null;
  language: Language;
  speed: VoiceSpeedSetting;
  gender: "FEMALE" | "MALE";
  volume: number; // 0.0 to 1.0
  voiceUsed: string;
  provider: "google-cloud" | "cache" | "browser-native" | "browser-phonetic" | "idle";
  errorMessage?: string;
}

export interface SpeakOptions {
  id?: string;
  language?: Language;
  phoneticText?: string;
  speed?: VoiceSpeedSetting;
  gender?: "FEMALE" | "MALE";
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

type TtsListener = (state: TtsState) => void;

class TtsService {
  private state: TtsState = {
    status: "IDLE",
    activeId: null,
    language: "en",
    speed: "NORMAL",
    gender: "FEMALE",
    volume: 1.0,
    voiceUsed: "None",
    provider: "idle"
  };

  private listeners: Set<TtsListener> = new Set();
  private currentAudioElement: HTMLAudioElement | null = null;
  private cancelCurrentBrowserSpeech: (() => void) | null = null;
  private activeRequestId = 0;

  constructor() {
    // Load persisted preferences
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sahakari_voice_settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.speed) this.state.speed = parsed.speed;
          if (parsed.gender) this.state.gender = parsed.gender;
          if (typeof parsed.volume === "number") this.state.volume = parsed.volume;
        }
      } catch {
        // Ignore JSON error
      }
      // Warm up browser speech voices on idle
      setTimeout(() => initBrowserVoices(), 200);
    }
  }

  /**
   * Subscribe to TTS state changes
   */
  subscribe(listener: TtsListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (e) {
        console.warn("[TtsService] Listener notification error:", e);
      }
    });
  }

  getState(): TtsState {
    return { ...this.state };
  }

  /**
   * Updates currently selected language and halts any playing speech immediately
   */
  setLanguage(lang: Language) {
    if (this.state.language !== lang) {
      this.stop();
      this.state.language = lang;
      this.notify();
    }
  }

  setSpeed(speed: VoiceSpeedSetting) {
    this.state.speed = speed;
    this.savePreferences();
    this.notify();
  }

  setGender(gender: "FEMALE" | "MALE") {
    this.state.gender = gender;
    this.savePreferences();
    this.notify();
  }

  setVolume(vol: number) {
    this.state.volume = Math.max(0, Math.min(1, vol));
    if (this.currentAudioElement) {
      this.currentAudioElement.volume = this.state.volume;
    }
    this.savePreferences();
    this.notify();
  }

  private savePreferences() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "sahakari_voice_settings",
          JSON.stringify({
            speed: this.state.speed,
            gender: this.state.gender,
            volume: this.state.volume
          })
        );
      } catch {
        // Ignore localStorage error
      }
    }
  }

  /**
   * STOPS all ongoing audio and cancels speech synthesis.
   * Guaranteed single active audio stream.
   */
  stop() {
    this.activeRequestId++;

    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement.removeAttribute("src");
        this.currentAudioElement.load();
      } catch {
        // Ignore
      }
      this.currentAudioElement = null;
    }

    if (this.cancelCurrentBrowserSpeech) {
      try {
        this.cancelCurrentBrowserSpeech();
      } catch {
        // Ignore
      }
      this.cancelCurrentBrowserSpeech = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }

    this.state.status = "IDLE";
    this.state.activeId = null;
    this.notify();
  }

  /**
   * Pauses current playback
   */
  pause() {
    if (this.currentAudioElement && !this.currentAudioElement.paused) {
      this.currentAudioElement.pause();
      this.state.status = "PAUSED";
      this.notify();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.state.status = "PAUSED";
      this.notify();
    }
  }

  /**
   * Resumes paused playback
   */
  resume() {
    if (this.currentAudioElement && this.currentAudioElement.paused) {
      this.currentAudioElement.play().catch(() => {});
      this.state.status = "PLAYING";
      this.notify();
    } else if (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.state.status = "PLAYING";
      this.notify();
    }
  }

  /**
   * Main speech synthesis entry point
   */
  async speak(rawText: string, options: SpeakOptions = {}): Promise<void> {
    const textToProcess = (rawText || "").trim();
    if (!textToProcess) return;

    // 1. Immediately halt previous playback
    this.stop();

    const requestId = ++this.activeRequestId;
    const targetLang = options.language || this.state.language;
    const speedSetting = options.speed || this.state.speed;
    const genderSetting = options.gender || this.state.gender;
    const volumeSetting = options.volume !== undefined ? options.volume : this.state.volume;
    const profile = getVoiceProfile(targetLang);

    const speedMultiplier = SPEED_MULTIPLIERS[speedSetting] || 1.0;
    const effectiveRate = Number((profile.speakingRate * speedMultiplier).toFixed(2));
    const activeId = options.id || generateCacheKey(textToProcess, targetLang, profile.voiceName, effectiveRate);

    this.state.status = "LOADING";
    this.state.activeId = activeId;
    this.state.language = targetLang;
    this.notify();

    // 2. Pre-process text (Currencies, pincodes, phone numbers)
    const formattedText = prepareTextForSpeech(textToProcess, targetLang);
    const ssmlText = buildSsml(formattedText, targetLang);
    const cacheKey = generateCacheKey(formattedText, profile.languageCode, profile.voiceName, effectiveRate);

    // 3. Check client-side audio cache
    const cachedAudioUrl = AudioCache.get(cacheKey);
    if (cachedAudioUrl) {
      if (this.activeRequestId !== requestId) return;
      this.playHtmlAudio(cachedAudioUrl, activeId, profile.voiceName, "cache", options);
      return;
    }

    // 4. Attempt backend Google Cloud TTS synthesis
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500); // 6.5s timeout for complete audio streaming

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: ssmlText,
          language: profile.languageCode,
          speed: effectiveRate,
          gender: genderSetting
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (this.activeRequestId !== requestId) return; // Stale request

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioContent) {
          const audioDataUrl = `data:audio/mp3;base64,${data.audioContent}`;
          AudioCache.set(cacheKey, audioDataUrl);
          this.playHtmlAudio(audioDataUrl, activeId, data.voiceName || profile.voiceName, "google-cloud", options);
          return;
        }
      }
    } catch {
      // Backend offline, timed out, or Google key absent - proceed smoothly to browser fallback
    }

    if (this.activeRequestId !== requestId) return;

    // 5. Intelligent Client-Side Browser Fallback
    this.fallbackToBrowserSpeech(
      formattedText,
      options.phoneticText,
      targetLang,
      effectiveRate,
      volumeSetting,
      activeId,
      options,
      genderSetting
    );
  }

  private playHtmlAudio(
    audioSrc: string,
    activeId: string,
    voiceName: string,
    provider: "google-cloud" | "cache",
    options: SpeakOptions
  ) {
    const audio = new Audio(audioSrc);
    audio.volume = this.state.volume;
    this.currentAudioElement = audio;

    audio.onplay = () => {
      this.state.status = "PLAYING";
      this.state.activeId = activeId;
      this.state.voiceUsed = voiceName;
      this.state.provider = provider;
      this.notify();
      options.onStart?.();
    };

    audio.onended = () => {
      this.state.status = "IDLE";
      this.state.activeId = null;
      this.currentAudioElement = null;
      this.notify();
      options.onEnd?.();
    };

    audio.onerror = () => {
      this.state.status = "ERROR";
      this.notify();
      options.onError?.(new Error("Audio playback failed"));
    };

    audio.play().catch((err) => {
      console.warn("[TtsService] Audio play blocked or failed:", err);
      // If HTML5 audio is blocked by user interaction policy, fallback to browser synthesis
      this.fallbackToBrowserSpeech(
        audioSrc,
        options.phoneticText,
        this.state.language,
        1.0,
        this.state.volume,
        activeId,
        options,
        options.gender || this.state.gender
      );
    });
  }

  private fallbackToBrowserSpeech(
    text: string,
    phoneticText: string | undefined,
    lang: Language,
    rate: number,
    volume: number,
    activeId: string,
    options: SpeakOptions,
    gender: "FEMALE" | "MALE" = "FEMALE"
  ) {
    const { isNativeMatch, voiceName } = selectBestBrowserVoice(lang, gender);

    this.cancelCurrentBrowserSpeech = speakViaBrowserFallback(
      text,
      phoneticText,
      lang,
      rate,
      volume,
      () => {
        this.state.status = "PLAYING";
        this.state.activeId = activeId;
        this.state.voiceUsed = voiceName;
        this.state.provider = isNativeMatch ? "browser-native" : "browser-phonetic";
        this.notify();
        options.onStart?.();
      },
      () => {
        this.state.status = "IDLE";
        this.state.activeId = null;
        this.cancelCurrentBrowserSpeech = null;
        this.notify();
        options.onEnd?.();
      },
      (err) => {
        this.state.status = "ERROR";
        this.state.errorMessage = "Voice temporarily unavailable";
        this.notify();
        options.onError?.(err);
      },
      gender
    );
  }
}

// Export singleton instance
export const ttsService = new TtsService();

