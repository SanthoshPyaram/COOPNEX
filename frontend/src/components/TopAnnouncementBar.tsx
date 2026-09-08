import React from "react";
import { PhoneCall, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { LanguageDropdown } from "./LanguageDropdown";

export const TopAnnouncementBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#0B1220] text-[#FCFBF7] text-xs py-1.5 px-4 border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[11px]">
        {/* Left Endorsement */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[#F4B740] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F4B740]" />
            <span>Ministry of Cooperation Endorsed</span>
          </span>
          <span className="hidden md:inline text-slate-400">•</span>
          <span className="hidden md:inline text-slate-300">
            {t("app.tagline") || "India's National Cooperative Labour Digital Marketplace"}
          </span>
        </div>

        {/* Right actions: 24/7 Helpline & Language Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <a
            href="tel:18004252667"
            className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition font-medium"
            title="Toll-free Citizen & Worker Helpline"
          >
            <PhoneCall className="w-3 h-3 text-[#F4B740]" />
            <span>Helpline: <strong className="text-white">1800-425-COOP</strong></span>
          </a>

          {/* All 13 Indian Languages Dropdown */}
          <LanguageDropdown variant="pill" />
        </div>
      </div>
    </div>
  );
};
