import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Play,
  Settings2,
  Sparkles,
  Gauge,
  User,
  RotateCcw,
  CheckCircle2,
  Activity,
  Zap,
  Globe,
  Radio,
  FileText
} from "lucide-react";
import {
  ttsService,
  TtsState,
  VoiceSpeedSetting,
  VOICE_CONFIGS,
  getVoiceProfile
} from "../services/tts";
import { INDIAN_LANGUAGES, IndianLanguage, Language } from "../i18n/languages";
import { VoiceButton } from "../components/VoiceButton";
import { VoiceSettingsModal } from "../components/VoiceSettingsModal";

export const VoiceQualityTestPage: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<Language>("te");
  const [ttsState, setTtsState] = useState<TtsState>(ttsService.getState());
  const [customText, setCustomText] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [testCategory, setTestCategory] = useState<"greeting" | "numbers" | "pincode" | "names" | "mixed">("greeting");

  const profile = getVoiceProfile(selectedLang);
  const currentLangObj = INDIAN_LANGUAGES.find((l) => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  useEffect(() => {
    return ttsService.subscribe((state) => {
      setTtsState(state);
    });
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    ttsService.setLanguage(lang);
  };

  // Test Suites for each category
  const testSuites: Record<string, { title: string; text: string; phonetic?: string; note: string }[]> = {
    greeting: [
      {
        title: "Standard Platform Welcome",
        text: profile.sampleSentence,
        phonetic: profile.phoneticSampleSentence,
        note: "Official welcome text with cooperative values and zero-commission guarantee."
      },
      {
        title: "Booking Confirmation & Technician Dispatch",
        text: selectedLang === "te"
          ? "మీ బుకింగ్ విజయవంతంగా నమోదైంది. సాంకేతిక నిపుణుడు రమేష్ బాబు మరో పది నిమిషాల్లో మీ వద్దకు చేరుకుంటారు."
          : selectedLang === "hi"
          ? "आपकी बुकिंग सफलतापूर्वक दर्ज हो गई है। तकनीशियन रमेश बाबू अगले दस मिनट में आपके पास पहुंचेंगे।"
          : "Your booking has been successfully confirmed. Technician Ramesh Babu will arrive at your doorstep in ten minutes.",
        note: "Tests dynamic booking notification with artisan name and time."
      }
    ],
    numbers: [
      {
        title: "Fair Wage Lock & Transparent Rates",
        text: selectedLang === "te"
          ? "సహకార నియమావళి ప్రకారం సర్వీస్ చార్జ్ ₹450 మాత్రమే. మెటీరియల్ ఖర్చు ₹1,200. ఎటువంటి అదనపు కమిషన్ లేదు."
          : selectedLang === "hi"
          ? "सहकारी नियमों के अनुसार सर्विस चार्ज मात्र ₹450 है। सामग्री खर्च ₹1,200 है। कोई छुपा हुआ कमीशन नहीं।"
          : "Under cooperative guidelines, the labor wage is ₹450. Material cost is ₹1,200. Zero hidden aggregator commissions.",
        note: "Tests currency formatting (₹450 -> 'నాలుగు వందల యాభై రూపాయలు' / 'four hundred and fifty rupees')."
      },
      {
        title: "National Milestone Stats",
        text: selectedLang === "te"
          ? "దేశవ్యాప్తంగా 148,290 మంది కార్మికులు రిజిస్టర్ అయ్యారు. ₹42.8 కోట్లు నేరుగా డీబీటీ ద్వారా చెల్లించబడింది."
          : selectedLang === "hi"
          ? "देशभर में 148,290 कामगार पंजीकृत हैं। ₹42.8 करोड़ सीधे बैंक खातों में अंतरित किए गए हैं।"
          : "Over 148,290 verified cooperative workers enrolled. ₹42.8 crore disbursed via Direct Benefit Transfer.",
        note: "Tests large numbers, decimals, and crore pronunciation."
      }
    ],
    pincode: [
      {
        title: "Postal Code 500001 & Helpline",
        text: selectedLang === "te"
          ? "హైదరాబాద్ పిన్‌కోడ్ 500001 లో 24 గంటల సేవలు అందుబాటులో ఉన్నాయి. సహాయం కోసం 1800-425-2667 కి కాల్ చేయండి."
          : selectedLang === "hi"
          ? "हैदराबाद पिनकोड 500001 में 24 घंटे सेवा उपलब्ध है। सहायता के लिए 1800-425-2667 पर संपर्क करें।"
          : "Services active in Hyderabad postal code 500001. For instant assistance, call toll-free helpline 1800-425-2667.",
        note: "PIN code spoken digit-by-digit ('5 0 0 0 0 1') and helpline spaced."
      },
      {
        title: "Vijayawada Hub & Worker Mobile",
        text: selectedLang === "te"
          ? "విజయవాడ పిన్‌కోడ్ 520001 సర్వీస్ హబ్. వర్కర్ ఫోన్ నంబర్ 9876543210 కు ఓటీపీ ద్వారా ధృవీకరించబడింది."
          : selectedLang === "hi"
          ? "विजयवाड़ा पिनकोड 520001 सर्विस हब। कामगार फोन नंबर 9876543210 ओटीपी द्वारा सत्यापित है।"
          : "Vijayawada PIN 520001 hub. Worker contact number 9876543210 verified by secure OTP.",
        note: "Tests 10-digit Indian phone number cadence ('9 8 7 6 5, 4 3 2 1 0')."
      }
    ],
    names: [
      {
        title: "Artisan Verification & Locations",
        text: selectedLang === "te"
          ? "శ్రీనివాస్, లక్ష్మి మరియు వెంకటేష్ విజయవాడ, విశాఖపట్నం, తిరుపతి మరియు గుంటూరులో అత్యుత్తమ రేటింగ్ పొందిన ఎలక్ట్రీషియన్లు."
          : selectedLang === "hi"
          ? "श्रीनिवास, लक्ष्मी और वेंकटेश विजयवाड़ा, विशाखापट्टनम, तिरुपति और गुंटूर में शीर्ष रेटेड इलेक्ट्रिशियन हैं।"
          : "Srinivas, Lakshmi, and Venkatesh are top-rated artisans across Vijayawada, Visakhapatnam, Tirupati, and Guntur.",
        note: "Preserves native pronunciation of authentic South & North Indian artisan names and cities."
      }
    ],
    mixed: [
      {
        title: "Bilingual Operational Content (Indian Context)",
        text: selectedLang === "te"
          ? "మీ booking successfully confirmed అయింది. Technician 10 minutes లో arrive అవుతారు. Customer rating 4.9 out of 5 stars."
          : selectedLang === "hi"
          ? "आपकी booking successfully confirm हो गई है। Technician 10 minutes में arrive होंगे। Worker rating 4.9 stars."
          : "Your booking is successfully confirmed. Technician will arrive in 10 minutes. Verified rating 4.9 out of 5 stars.",
        note: "Seamless handling of mixed English tech jargon with regional phrasing."
      }
    ]
  };

  const handleCustomSpeak = () => {
    if (!customText.trim()) return;
    ttsService.speak(customText, {
      id: "custom_workbench_test",
      language: selectedLang
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-3">
                <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>National Telephony & TTS Diagnostics Console</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Multilingual Speech Engine Test Bench
              </h1>
              <p className="mt-2 text-sm text-blue-100/90 max-w-2xl leading-relaxed">
                Comprehensive evaluation suite for Google Cloud Neural TTS, native browser voice synthesis, localized currency, digit-by-digit pincodes, and dialect phonetic fallbacks across all 13 Indian languages.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <Settings2 className="w-4 h-4" />
                <span>Voice Settings</span>
              </button>

              <button
                type="button"
                onClick={() => ttsService.stop()}
                className="px-4 py-2.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/40"
              >
                <VolumeX className="w-4 h-4" />
                <span>Stop Audio</span>
              </button>
            </div>
          </div>

          {/* Live Engine Telemetry HUD */}
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-blue-300 block text-[11px]">Active Language</span>
              <strong className="text-sm font-bold block mt-0.5 text-white">
                {profile.nativeName} ({profile.languageCode})
              </strong>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-blue-300 block text-[11px]">Assigned Voice</span>
              <strong className="text-sm font-bold block mt-0.5 text-white truncate" title={profile.voiceName}>
                {profile.voiceName}
              </strong>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-blue-300 block text-[11px]">Engine Provider</span>
              <strong className="text-sm font-bold block mt-0.5 text-emerald-400 capitalize">
                {ttsState.provider}
              </strong>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-blue-300 block text-[11px]">Cadence & State</span>
              <strong className="text-sm font-bold block mt-0.5 text-amber-300">
                {profile.speakingRate}x • {ttsState.status}
              </strong>
            </div>
          </div>
        </div>

        {/* Language Selection Grid (All 13 Indian Languages) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Select Indian Language ({INDIAN_LANGUAGES.length})</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Instant voice engine synchronization
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {INDIAN_LANGUAGES.map((lang: IndianLanguage) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-102"
                      : "bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{lang.flag || "🇮🇳"}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="mt-1.5">
                    <div className="text-xs font-black truncate">{lang.name}</div>
                    <div className={`text-[10px] truncate ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {lang.englishName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Test Suites Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
            {[
              { id: "greeting", label: "Welcome & Bookings" },
              { id: "numbers", label: "Currency & Numbers (₹450)" },
              { id: "pincode", label: "PIN & Phones (500001)" },
              { id: "names", label: "Indian Names & Cities" },
              { id: "mixed", label: "Bilingual Phrasing" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTestCategory(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  testCategory === tab.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Test Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testSuites[testCategory]?.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono">
                      {profile.languageCode}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                    "{item.text}"
                  </p>

                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>{item.note}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <VoiceButton
                    text={item.text}
                    phoneticText={item.phonetic}
                    language={selectedLang}
                    id={`test_${testCategory}_${idx}`}
                    label={`Speak in ${currentLangObj.name}`}
                    size="sm"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(item.text);
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    Copy Text
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Text Synthesizer Sandbox */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Live Custom Text Synthesis Sandbox</span>
            </h2>
            <span className="text-xs text-slate-500">
              Type or paste any Indian phrase, address, or fare
            </span>
          </div>

          <textarea
            rows={3}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder={`Enter custom text in ${currentLangObj.name} or English (e.g. ₹600 for AC servicing in Hyderabad 500001)...`}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCustomText("సహకారి సేవ ద్వారా ₹450 చెల్లించి విజయవాడ 520001 లో ప్లంబర్ సేవలను సులభంగా పొందండి.")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Telugu Fare Sample
              </button>

              <button
                type="button"
                onClick={() => setCustomText("सहकारी सेवा से ₹450 में 500001 पिनकोड पर प्रमाणित इलेक्ट्रीशियन बुक करें।")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Hindi Fare Sample
              </button>
            </div>

            <button
              type="button"
              onClick={handleCustomSpeak}
              disabled={!customText.trim()}
              className="px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Synthesize Custom Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Settings Drawer / Modal */}
      <VoiceSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

