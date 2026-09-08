/**
 * Client-Side Audio Cache
 * Caches synthesized base64 audio URLs in-memory and sessionStorage
 * to ensure instant, zero-latency re-play and zero redundant network calls.
 */

const memoryCache = new Map<string, string>();
const MAX_MEMORY_ITEMS = 60;

/**
 * Fast deterministic string hash for cache indexing
 */
export function generateCacheKey(text: string, lang: string, voice: string, rate: number): string {
  const str = `${text.trim()}__${lang}__${voice}__${rate.toFixed(2)}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `tts_v1_${Math.abs(hash).toString(16)}`;
}

export class AudioCache {
  static get(key: string): string | null {
    // 1. Check in-memory map
    if (memoryCache.has(key)) {
      return memoryCache.get(key)!;
    }

    // 2. Check sessionStorage
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const stored = sessionStorage.getItem(`sahakari_audio_${key}`);
        if (stored) {
          memoryCache.set(key, stored);
          return stored;
        }
      }
    } catch {
      // sessionStorage restricted or quota exceeded
    }

    return null;
  }

  static set(key: string, dataUrl: string): void {
    if (memoryCache.size >= MAX_MEMORY_ITEMS) {
      const oldest = memoryCache.keys().next().value;
      if (oldest) memoryCache.delete(oldest);
    }
    memoryCache.set(key, dataUrl);

    try {
      if (typeof window !== "undefined" && window.sessionStorage && dataUrl.length < 500000) {
        sessionStorage.setItem(`sahakari_audio_${key}`, dataUrl);
      }
    } catch {
      // Session storage full or disabled
    }
  }

  static clear(): void {
    memoryCache.clear();
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const k = sessionStorage.key(i);
          if (k && k.startsWith("sahakari_audio_")) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => sessionStorage.removeItem(k));
      }
    } catch {
      // Ignore
    }
  }
}

