import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { INDIAN_LANGUAGES, IndianLanguage } from "../i18n/languages";

interface LanguageDropdownProps {
  variant?: "pill" | "minimal";
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  variant = "pill",
  className = ""
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = INDIAN_LANGUAGES.find((l) => l.code === language) || INDIAN_LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      {variant === "pill" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 transition shadow-xs cursor-pointer"
          title="Select Language / भाषा चुनें"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold">{currentLang.name}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-600" : ""
            }`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentLang.name}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      )}

      {/* Floating Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Select Indian Language ({INDIAN_LANGUAGES.length})</span>
              </div>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                భారతీయ భాషలు
              </span>
            </div>

            {/* Language Scrollable List */}
            <div className="max-h-80 overflow-y-auto py-1 space-y-1 divide-y divide-slate-50">
              {INDIAN_LANGUAGES.map((lang: IndianLanguage) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag || "🇮🇳"}</span>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{lang.name}</span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            ({lang.englishName})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">{lang.region}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

