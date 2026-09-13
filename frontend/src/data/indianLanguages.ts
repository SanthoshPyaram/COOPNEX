export interface IndianLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  commonInAP_TG?: boolean;
}

export const ALL_INDIAN_LANGUAGES: IndianLanguageOption[] = [
  // Primary regional & widely spoken in AP & Telangana
  { code: "te", name: "Telugu", nativeName: "తెలుగు", commonInAP_TG: true },
  { code: "en", name: "English", nativeName: "English", commonInAP_TG: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", commonInAP_TG: true },
  { code: "ur", name: "Urdu", nativeName: "اردو", commonInAP_TG: true },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", commonInAP_TG: true },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", commonInAP_TG: true },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", commonInAP_TG: true },
  { code: "mr", name: "Marathi", nativeName: "मराठी", commonInAP_TG: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", commonInAP_TG: true },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली" },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "ks", name: "Kashmiri", nativeName: "कश्मीरी / كٲشُر" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी" },
  { code: "sd", name: "Sindhi", nativeName: "सिन्धी / سنڌي" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी" },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্" },
  { code: "brx", name: "Bodo", nativeName: "बड़ो" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" }
];

export const ALL_INDIAN_LANGUAGE_NAMES: string[] = ALL_INDIAN_LANGUAGES.map((l) => l.name);

// Format Aadhaar Number with hyphens: XXXX-XXXX-XXXX
export function formatAadhaarNumber(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 12);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join("-");
}

export function cleanAadhaarNumber(val: string): string {
  return val.replace(/\D/g, "").slice(0, 12);
}

