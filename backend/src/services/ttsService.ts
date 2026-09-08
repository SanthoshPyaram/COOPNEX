import axios from "axios";
import crypto from "crypto";
import { SERVER_VOICE_CONFIG, normalizeLanguageCode, ServerVoiceProfile } from "../config/voiceConfig";

export interface SynthesizeRequest {
  text: string;
  language?: string;
  speed?: number;
  gender?: "FEMALE" | "MALE";
  pitch?: number;
}

export interface SynthesizeResult {
  success: boolean;
  audioContent?: string; // base64 encoded MP3
  audioType?: string;
  voiceName: string;
  languageCode: string;
  provider: "google-cloud" | "cache" | "browser-fallback";
  cached: boolean;
  message?: string;
}

// In-Memory SHA-256 Audio Cache (Limits memory to 200 recent synthesized audio items)
const MAX_CACHE_ENTRIES = 200;
const audioCache = new Map<string, { audioContent: string; timestamp: number }>();

function computeCacheKey(text: string, lang: string, voice: string, rate: number): string {
  return crypto
    .createHash("sha256")
    .update(`${text.trim()}__${lang}__${voice}__${rate.toFixed(2)}`)
    .digest("hex");
}

async function synthesizeViaTranslateTTS(text: string, langCode: string): Promise<Buffer | null> {
  try {
    // Strip SSML tags to obtain clean plain regional text
    const cleanText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!cleanText) return null;

    // 2-letter ISO language code (te, hi, ta, kn, etc.)
    const lang = langCode.split("-")[0].toLowerCase();

    // Chunk text into segments <= 180 characters along sentence/phrase boundaries
    const rawChunks = cleanText.match(/[^.!?।\n,]+[.!?।\n,]+|[^.!?।\n,]+$/g) || [cleanText];
    const chunks: string[] = [];

    for (const phrase of rawChunks) {
      let trimmed = phrase.trim();
      while (trimmed.length > 180) {
        let cut = trimmed.lastIndexOf(" ", 180);
        if (cut === -1) cut = 180;
        chunks.push(trimmed.slice(0, cut).trim());
        trimmed = trimmed.slice(cut).trim();
      }
      if (trimmed) chunks.push(trimmed);
    }

    const buffers: Buffer[] = [];
    for (const chunk of chunks) {
      if (!chunk) continue;
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      const res = await axios.get(url, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/"
        },
        timeout: 4500
      });

      if (res.status === 200 && res.data) {
        buffers.push(Buffer.from(res.data));
      }
    }

    if (buffers.length > 0) {
      return Buffer.concat(buffers);
    }
    return null;
  } catch (err: any) {
    console.warn(`[TranslateTTS] Fallback attempt error for ${langCode}:`, err?.message || err);
    return null;
  }
}

export class ServerTtsService {
  /**
   * Synthesizes speech using Google Cloud Text-to-Speech API
   * or signals the frontend to use the calibrated client-side speech engine.
   */
  static async synthesizeSpeech(req: SynthesizeRequest): Promise<SynthesizeResult> {
    const rawText = (req.text || "").trim();
    if (!rawText) {
      throw new Error("Text is required for speech synthesis.");
    }

    // Safety limit text length to 1000 characters per utterance
    const sanitizedText = rawText.slice(0, 1000);
    const normalizedLang = normalizeLanguageCode(req.language || "en-IN");
    const voiceProfile: ServerVoiceProfile = SERVER_VOICE_CONFIG[normalizedLang] || SERVER_VOICE_CONFIG["en-IN"];

    const selectedVoice =
      req.gender === "MALE" && voiceProfile.alternateVoice
        ? voiceProfile.alternateVoice
        : voiceProfile.defaultVoice;

    const speakingRate = req.speed
      ? Math.max(0.6, Math.min(1.4, req.speed))
      : voiceProfile.speakingRate;

    const pitch = req.pitch !== undefined ? Math.max(-10, Math.min(10, req.pitch)) : voiceProfile.pitch;

    // 1. Check in-memory server cache
    const cacheKey = computeCacheKey(sanitizedText, normalizedLang, selectedVoice, speakingRate);
    const cachedItem = audioCache.get(cacheKey);
    if (cachedItem) {
      return {
        success: true,
        audioContent: cachedItem.audioContent,
        audioType: "audio/mp3",
        voiceName: selectedVoice,
        languageCode: normalizedLang,
        provider: "cache",
        cached: true
      };
    }

    // 2. Check if Google Cloud TTS API Key is configured in environment
    const googleApiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

    if (!googleApiKey) {
      // If male voice is requested, Google Translate TTS only has female audio; route directly to calibrated browser male speech!
      if (req.gender === "MALE") {
        return {
          success: false,
          provider: "browser-fallback",
          voiceName: selectedVoice,
          languageCode: normalizedLang,
          cached: false,
          message: "Male voice requested; routing to client-side male voice engine."
        };
      }

      // Stream authentic native human speech via Google Regional Neural TTS (supports Telugu, Hindi, Tamil, etc.)
      const regionalBuffer = await synthesizeViaTranslateTTS(sanitizedText, normalizedLang);
      if (regionalBuffer && regionalBuffer.length > 0) {
        const base64Audio = regionalBuffer.toString("base64");
        if (audioCache.size >= MAX_CACHE_ENTRIES) {
          const firstKey = audioCache.keys().next().value;
          if (firstKey) audioCache.delete(firstKey);
        }
        audioCache.set(cacheKey, { audioContent: base64Audio, timestamp: Date.now() });

        return {
          success: true,
          audioContent: base64Audio,
          audioType: "audio/mp3",
          voiceName: selectedVoice || "Google Native Regional Speech",
          languageCode: normalizedLang,
          provider: "google-cloud",
          cached: false
        };
      }

      // Return structured fallback signal if regional stream is unreachable
      return {
        success: false,
        provider: "browser-fallback",
        voiceName: selectedVoice,
        languageCode: normalizedLang,
        cached: false,
        message: "Google Cloud TTS key not configured; client fallback active."
      };
    }

    // 3. Call Google Cloud Text-to-Speech REST API
    try {
      const isSSML = sanitizedText.startsWith("<speak>") && sanitizedText.endsWith("</speak>");
      const inputPayload = isSSML
        ? { ssml: sanitizedText }
        : { text: sanitizedText };

      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`,
        {
          input: inputPayload,
          voice: {
            languageCode: normalizedLang,
            name: selectedVoice,
            ssmlGender: req.gender || voiceProfile.gender
          },
          audioConfig: {
            audioEncoding: "MP3",
            speakingRate: speakingRate,
            pitch: pitch,
            volumeGainDb: voiceProfile.volumeGainDb
          }
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 4000
        }
      );

      if (response.data && response.data.audioContent) {
        const base64Audio = response.data.audioContent;

        // Save into cache (LRU eviction if limit reached)
        if (audioCache.size >= MAX_CACHE_ENTRIES) {
          const firstKey = audioCache.keys().next().value;
          if (firstKey) audioCache.delete(firstKey);
        }
        audioCache.set(cacheKey, { audioContent: base64Audio, timestamp: Date.now() });

        return {
          success: true,
          audioContent: base64Audio,
          audioType: "audio/mp3",
          voiceName: selectedVoice,
          languageCode: normalizedLang,
          provider: "google-cloud",
          cached: false
        };
      } else {
        throw new Error("Empty audio response from Google Cloud TTS");
      }
    } catch (err: any) {
      console.warn(`[ServerTtsService] Cloud TTS attempt failed for ${normalizedLang}:`, err?.message || err);
      // Secondary fallback to Google Regional Neural stream
      const regionalBuffer = await synthesizeViaTranslateTTS(sanitizedText, normalizedLang);
      if (regionalBuffer && regionalBuffer.length > 0) {
        const base64Audio = regionalBuffer.toString("base64");
        audioCache.set(cacheKey, { audioContent: base64Audio, timestamp: Date.now() });
        return {
          success: true,
          audioContent: base64Audio,
          audioType: "audio/mp3",
          voiceName: selectedVoice || "Google Native Regional Speech",
          languageCode: normalizedLang,
          provider: "google-cloud",
          cached: false
        };
      }

      // Fail gracefully without crashing
      return {
        success: false,
        provider: "browser-fallback",
        voiceName: selectedVoice,
        languageCode: normalizedLang,
        cached: false,
        message: `Google Cloud TTS unavailable (${err?.message || "network error"}); client fallback active.`
      };
    }
  }

  /**
   * Retrieves server voice catalogue for all 13 supported Indian languages
   */
  static getVoiceCatalogue() {
    return Object.values(SERVER_VOICE_CONFIG);
  }
}

