import React, { createContext, useContext, useState, useEffect } from "react";
import i18n, { Language, translations } from "../i18n";
import { ttsService } from "../services/tts";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultT = (key: string): string => {
  if (translations && translations.en && translations.en[key]) {
    return translations.en[key];
  }
  const parts = key.split(".");
  const last = parts[parts.length - 1];
  return last.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: defaultT
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("sahakari_lang");
      if (saved && (saved in translations)) {
        return saved as Language;
      }
      if (saved) {
        const prefix = saved.split("-")[0].toLowerCase() as Language;
        if (prefix in translations) return prefix;
      }
    } catch {
      // Ignore localStorage error
    }
    return "en";
  });

  // Sync document language tag and voice engine on change or mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
    ttsService.setLanguage(language);
    i18n.changeLanguage(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    // 1. Immediately halt any running speech and reset audio state
    ttsService.stop();
    ttsService.setLanguage(lang);
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
    try {
      localStorage.setItem("sahakari_lang", lang);
    } catch {
      // Ignore localStorage error
    }
  };

  const t = (key: string): string => {
    const safeLang = (translations && (language in translations)) ? language : "en";
    const dict = (translations && translations[safeLang]) || (translations && translations.en) || {};
    const resolved = dict[key] || key.split('.').reduce((o: any, i) => o?.[i], dict);
    if (resolved && typeof resolved === "string") return resolved;

    const enDict = translations?.en || {};
    const enResolved = enDict[key] || key.split('.').reduce((o: any, i) => o?.[i], enDict);
    if (enResolved && typeof enResolved === "string") return enResolved;

    return defaultT(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
