import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import {
  Settings,
  Globe,
  BellRing,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Mail,
  Zap,
  Save
} from "lucide-react";

export const CustomerSettingsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, setTheme } = useTheme();

  const [savedMsg, setSavedMsg] = useState(false);

  // Notification Preferences State
  const [notifPreferences, setNotifPreferences] = useState(() => {
    try {
      const s = localStorage.getItem("sahakari_customer_notif_prefs");
      if (s) return JSON.parse(s);
    } catch {
      // safe
    }
    return {
      smsUpdates: true,
      whatsappEta: true,
      emailInvoices: true,
      emergencyBloodAlerts: true
    };
  });

  const handleTogglePref = (key: keyof typeof notifPreferences) => {
    const updated = { ...notifPreferences, [key]: !notifPreferences[key] };
    setNotifPreferences(updated);
    try {
      localStorage.setItem("sahakari_customer_notif_prefs", JSON.stringify(updated));
    } catch {
      // safe
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("sahakari_lang", langCode);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#2563EB]" />
            <span>Citizen Portal Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your notification channels, language, theme, and security settings.
          </p>
        </div>

        {savedMsg && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Preferences Saved
          </span>
        )}
      </div>

      {/* SECTION 1: LANGUAGE PREFERENCE */}
      <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#2563EB]" />
          <h4 className="text-sm font-extrabold text-slate-900">Regional Language (భాష / भाषा)</h4>
        </div>
        <p className="text-xs text-slate-500">
          Select your preferred language across the entire platform. Changes take effect immediately.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { code: "en", name: "English", native: "English", tag: "Default" },
            { code: "te", name: "Telugu", native: "తెలుగు", tag: "ఆంధ్రప్రదేశ్" },
            { code: "hi", name: "Hindi", native: "हिन्दी", tag: "राष्ट्रीय" }
          ].map((lang) => {
            const isSelected = (i18n.language || "en").startsWith(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">{lang.native}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{lang.name}</span>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                    {lang.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: NOTIFICATION CHANNELS */}
      <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-extrabold text-slate-900">Communication & Alert Channels</h4>
        </div>
        <p className="text-xs text-slate-500">
          Control how cooperative dispatch updates and service alerts are delivered to you.
        </p>

        <div className="space-y-3 pt-1">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">SMS Booking & OTP Alerts</span>
                <span className="text-[10px] text-slate-400">Receive 4-digit completion OTPs and artisan dispatch SMS</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifPreferences.smsUpdates}
              onChange={() => handleTogglePref("smsUpdates")}
              className="w-5 h-5 accent-blue-600 cursor-pointer rounded"
            />
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">💬</span>
              <div>
                <span className="text-xs font-bold text-slate-800 block">WhatsApp Live ETA & Live Tracking</span>
                <span className="text-[10px] text-slate-400">Real-time arrival notification with artisan live location pin</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifPreferences.whatsappEta}
              onChange={() => handleTogglePref("whatsappEta")}
              className="w-5 h-5 accent-emerald-600 cursor-pointer rounded"
            />
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Email Tax Receipts & Invoices</span>
                <span className="text-[10px] text-slate-400">Automated official Government cooperative invoice PDF delivery</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifPreferences.emailInvoices}
              onChange={() => handleTogglePref("emailInvoices")}
              className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
            />
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-rose-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Community Emergency Blood Relay</span>
                <span className="text-[10px] text-slate-400">Receive urgent hospital donor alerts matching your registered blood group</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifPreferences.emergencyBloodAlerts}
              onChange={() => handleTogglePref("emergencyBloodAlerts")}
              className="w-5 h-5 accent-rose-600 cursor-pointer rounded"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: PRIVACY & STATUTORY GUARANTEES */}
      <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-extrabold text-slate-900">Cooperative Trust & Identity</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">UIDAI Aadhaar e-KYC</span>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verhoeff D5 Checksum Verified
            </span>
            <p className="text-[10px] text-slate-400 mt-1">Biometric authentication active via UIDAI standard.</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">Statutory Escrow Guarantee</span>
            <span className="text-[11px] text-blue-700 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              RBI & AP Cooperative Audit Ready
            </span>
            <p className="text-[10px] text-slate-400 mt-1">100% direct citizen-to-artisan payment guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

