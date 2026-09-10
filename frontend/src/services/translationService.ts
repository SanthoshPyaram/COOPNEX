import { useState, useEffect } from "react";
import { API_BASE } from "./api";

/**
 * AI4BHARAT DYNAMIC TRANSLATION SERVICE
 * 
 * Interacts with backend `/api/translate` powered by AI4Bharat IndicTrans2.
 * Includes local in-memory and persistent localStorage caching to eliminate
 * redundant network roundtrips.
 */

// In-memory cache for ultra-fast instant lookups during component lifecycle
const memoryCache = new Map<string, string>();

const STORAGE_PREFIX = "sahakari_ai4b_";

function getCacheKey(text: string, sourceLang: string, targetLang: string): string {
  return `${sourceLang}:${targetLang}:${text.trim()}`;
}

function getFromCache(text: string, sourceLang: string, targetLang: string): string | null {
  const key = getCacheKey(text, sourceLang, targetLang);
  // 1. In-memory
  if (memoryCache.has(key)) {
    return memoryCache.get(key)!;
  }
  // 2. LocalStorage
  try {
    const val = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (val) {
      memoryCache.set(key, val);
      return val;
    }
  } catch {
    // Ignore localStorage errors
  }
  return null;
}

function setToCache(text: string, sourceLang: string, targetLang: string, translated: string) {
  const key = getCacheKey(text, sourceLang, targetLang);
  memoryCache.set(key, translated);
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, translated);
  } catch {
    // Ignore localStorage quota errors
  }
}

/**
 * Translates a dynamic string via backend AI4Bharat service with multi-level caching
 */
export async function translateDynamicText(
  text: string,
  targetLang: string,
  sourceLang: string = "en"
): Promise<string> {
  if (!text || text.trim() === "" || targetLang === sourceLang) {
    return text;
  }

  const cleanText = text.trim();
  const cached = getFromCache(cleanText, sourceLang, targetLang);
  if (cached) {
    return cached;
  }

  try {
    const res = await fetch(`${API_BASE}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: cleanText,
        sourceLang,
        targetLang
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.translatedText) {
        setToCache(cleanText, sourceLang, targetLang, data.translatedText);
        return data.translatedText;
      }
    }
  } catch (error) {
    console.warn("[TranslationService] AI4Bharat dynamic translation request failed, using original text:", error);
  }

  return text;
}

/**
 * Translates multiple texts concurrently
 */
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = "en"
): Promise<string[]> {
  return Promise.all(texts.map((t) => translateDynamicText(t, targetLang, sourceLang)));
}

/**
 * React Hook for seamless dynamic text translation inside components
 */
export function useDynamicTranslation(text: string, targetLang?: string) {
  const [translated, setTranslated] = useState<string>(text);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Determine active language from argument or localStorage
    const activeLang =
      targetLang ||
      (typeof localStorage !== "undefined"
        ? localStorage.getItem("sahakari_lang") || "en"
        : "en");

    if (activeLang === "en" || !text) {
      setTranslated(text);
      setLoading(false);
      return;
    }

    const cached = getFromCache(text, "en", activeLang);
    if (cached) {
      setTranslated(cached);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    translateDynamicText(text, activeLang, "en").then((res) => {
      if (isMounted) {
        setTranslated(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [text, targetLang]);

  return { translated, loading };
}

