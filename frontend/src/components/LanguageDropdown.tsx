import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown, Search, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Language, INDIAN_LANGUAGES } from "../i18n/languages";

interface LanguageDropdownProps {
  variant?: "pill" | "minimal" | "compact";
  className?: string;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  variant = "pill",
  className = ""
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentLang =
    INDIAN_LANGUAGES.find((l) => l.code === language) || INDIAN_LANGUAGES[0];

  const filteredLanguages = INDIAN_LANGUAGES.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.englishName.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q)
    );
  });

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block text-left ${isOpen ? "z-[100]" : "z-30"} ${className}`}
    >
      {/* Trigger Button */}
      {variant === "pill" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-600 transition shadow-2xs cursor-pointer"
          title="Select Language / भाषा चुनें / భాషను ఎంచుకోండి"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-bold text-slate-900">{currentLang.name}</span>
          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
            ({currentLang.englishName})
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-600" : ""
            }`}
          />
        </button>
      ) : variant === "compact" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentLang.name}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
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
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-1.5 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-700">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>13 Official Indian Languages</span>
              </div>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">
                భారత్ • 13
              </span>
            </div>

            {/* Quick Search Input */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language / भाषा खोजें..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Scrollable Language List */}
            <div className="max-h-72 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
              {filteredLanguages.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matching language found
                </div>
              ) : (
                filteredLanguages.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelect(lang.code)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 text-blue-700 font-bold border border-blue-200 shadow-2xs"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm leading-none shrink-0">{lang.flag || "🇮🇳"}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="truncate">{lang.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal shrink-0">
                              ({lang.englishName})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {lang.region}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LanguageSwitcher = LanguageDropdown;
export default LanguageDropdown;
