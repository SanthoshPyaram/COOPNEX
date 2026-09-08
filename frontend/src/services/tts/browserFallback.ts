import { Language } from "../../i18n/languages";
import { VOICE_CONFIGS, getVoiceProfile } from "./voiceConfig";

let voicesLoaded = false;
let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Initializes and caches available browser SpeechSynthesis voices
 */
export function initBrowserVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        cachedVoices = v;
        voicesLoaded = true;
        resolve(v);
      }
    };

    loadVoices();

    if (!voicesLoaded) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
      };
      // Fallback timeout in case onvoiceschanged does not fire
      setTimeout(() => {
        loadVoices();
        resolve(cachedVoices);
      }, 500);
    }
  });
}

/**
 * Selects the optimal browser voice for an Indian language with gender matching
 */
export function selectBestBrowserVoice(
  lang: Language,
  gender: "FEMALE" | "MALE" = "FEMALE"
): {
  voice: SpeechSynthesisVoice | null;
  isNativeMatch: boolean;
  voiceName: string;
} {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return { voice: null, isNativeMatch: false, voiceName: "None" };
  }

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  const profile = getVoiceProfile(lang);
  const targetCode = profile.languageCode.toLowerCase(); // e.g. "te-in"
  const prefix = targetCode.split("-")[0]; // e.g. "te"

  const isFemale = gender === "FEMALE";
  const femaleKeywords = [
    "female", "woman", "zira", "heera", "kalpana", "priya", "neerja",
    "swara", "geeta", "sangeeta", "veena", "shreya", "ananya"
  ];
  const maleKeywords = [
    "male", "man", "david", "george", "mark", "ravi", "madhav", "hemant",
    "guy", "james", "richard", "pradeep", "suresh", "ramesh", "mohan", "vikram", "raj"
  ];

  const matchesGender = (v: SpeechSynthesisVoice): boolean => {
    const n = v.name.toLowerCase();
    if (isFemale) {
      if (maleKeywords.some((k) => n.includes(k))) return false;
      return true;
    } else {
      // For male, explicitly reject female keyword voices
      if (femaleKeywords.some((k) => n.includes(k))) return false;
      return maleKeywords.some((k) => n.includes(k));
    }
  };

  // 1. Check exact language tag match (e.g. "te-IN" or "te_IN") with preferred gender
  const exactGenderMatch = voices.find((v) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    return l === targetCode && matchesGender(v);
  });
  if (exactGenderMatch) {
    return { voice: exactGenderMatch, isNativeMatch: true, voiceName: exactGenderMatch.name };
  }

  const exactMatch = voices.find((v) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    return l === targetCode;
  });
  if (exactMatch) {
    return { voice: exactMatch, isNativeMatch: true, voiceName: exactMatch.name };
  }

  // 2. Check language prefix match (e.g. starts with "te") with preferred gender
  const prefixGenderMatch = voices.find((v) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    return l.startsWith(prefix) && matchesGender(v);
  });
  if (prefixGenderMatch) {
    return { voice: prefixGenderMatch, isNativeMatch: true, voiceName: prefixGenderMatch.name };
  }

  const prefixMatch = voices.find((v) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    return l.startsWith(prefix);
  });
  if (prefixMatch) {
    return { voice: prefixMatch, isNativeMatch: true, voiceName: prefixMatch.name };
  }

  // 3. Check voice name hints with preferred gender
  for (const hint of profile.fallbackBrowserVoiceHints) {
    const hintMatch = voices.find(
      (v) => v.name.toLowerCase().includes(hint.toLowerCase()) && matchesGender(v)
    );
    if (hintMatch) {
      return { voice: hintMatch, isNativeMatch: true, voiceName: hintMatch.name };
    }
  }

  // 4. Indian English voice fallback matching requested gender
  const indianEnglish = voices.find((v) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    return (
      (l === "en-in" || v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("indian")) &&
      matchesGender(v)
    );
  });
  if (indianEnglish) {
    return { voice: indianEnglish, isNativeMatch: false, voiceName: `${indianEnglish.name} (Indian Accent)` };
  }

  // 5. Any voice in system matching requested gender (e.g. Microsoft Zira on Windows)
  if (isFemale) {
    const anyFemale = voices.find((v) =>
      femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (anyFemale) {
      return { voice: anyFemale, isNativeMatch: false, voiceName: anyFemale.name };
    }
  } else {
    const anyMale = voices.find((v) =>
      maleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (anyMale) {
      return { voice: anyMale, isNativeMatch: false, voiceName: anyMale.name };
    }
  }

  // 6. Default system voice
  const defaultVoice = voices.find((v) => v.default) || voices[0] || null;
  return {
    voice: defaultVoice,
    isNativeMatch: false,
    voiceName: defaultVoice ? defaultVoice.name : "System Speech Engine"
  };
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let keepAliveTimer: any = null;

function clearKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

/**
 * Speaks an utterance using window.speechSynthesis with gender-calibrated pitch
 */
export function speakViaBrowserFallback(
  text: string,
  phoneticText: string | undefined,
  lang: Language,
  effectiveRate: number,
  volume: number,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void,
  gender: "FEMALE" | "MALE" = "FEMALE"
): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onError?.(new Error("SpeechSynthesis is not supported in this browser environment."));
    return () => {};
  }

  // Clear any active keep-alive heartbeat
  clearKeepAlive();

  // Cancel any existing queued utterances immediately
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore
  }

  // Resume paused synthesis (Chrome on Windows quirk)
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const { voice, isNativeMatch } = selectBestBrowserVoice(lang, gender);

  // If we have a native regional voice, speak native script (e.g. Telugu script to Telugu voice).
  // If no native voice exists and we are falling back to an English voice, speak the phonetic transliteration
  // so the user hears authentic regional words rather than silent failures!
  const textToSpeak = isNativeMatch || !phoneticText ? text : phoneticText;

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  activeUtterance = utterance; // Prevent GC cleanup during long sentences!

  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = isNativeMatch ? VOICE_CONFIGS[lang].languageCode : "en-IN";
  utterance.rate = Math.max(0.6, Math.min(1.3, effectiveRate));
  // Gender-calibrated pitch: 1.15 for feminine voice, 0.80 for deep masculine tone
  utterance.pitch = gender === "FEMALE" ? 1.15 : 0.80;
  utterance.volume = Math.max(0, Math.min(1, volume));

  utterance.onstart = () => {
    // Chrome keepalive heartbeat: prevent silence/pause after 14s
    clearKeepAlive();
    keepAliveTimer = setInterval(() => {
      if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearKeepAlive();
      }
    }, 4500);

    onStart?.();
  };

  utterance.onend = () => {
    clearKeepAlive();
    activeUtterance = null;
    onEnd?.();
  };

  utterance.onerror = (e) => {
    clearKeepAlive();
    activeUtterance = null;
    if (e.error !== "canceled" && e.error !== "interrupted") {
      console.warn("[BrowserTTS] SpeechSynthesis error:", e.error);
      onError?.(e);
    } else {
      onEnd?.();
    }
  };

  try {
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    clearKeepAlive();
    activeUtterance = null;
    onError?.(err);
  }

  // Return cancel function
  return () => {
    clearKeepAlive();
    activeUtterance = null;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore cancel errors
    }
  };
}

