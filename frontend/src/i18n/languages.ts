export interface IndianLanguage {
  code: Language;
  name: string;
  englishName: string;
  region: string;
  flag?: string;
}

export type Language =
  | "en"
  | "hi"
  | "te"
  | "ta"
  | "kn"
  | "ml"
  | "mr"
  | "bn"
  | "gu"
  | "pa"
  | "or"
  | "as"
  | "ur";

export const INDIAN_LANGUAGES: IndianLanguage[] = [
  {
    code: "en",
    name: "English",
    englishName: "English",
    region: "Pan-India / Official",
    flag: "🇮🇳"
  },
  {
    code: "hi",
    name: "हिन्दी",
    englishName: "Hindi",
    region: "North & Central India",
    flag: "🇮🇳"
  },
  {
    code: "te",
    name: "తెలుగు",
    englishName: "Telugu",
    region: "Andhra Pradesh & Telangana",
    flag: "🇮🇳"
  },
  {
    code: "ta",
    name: "தமிழ்",
    englishName: "Tamil",
    region: "Tamil Nadu & Puducherry",
    flag: "🇮🇳"
  },
  {
    code: "kn",
    name: "ಕನ್ನಡ",
    englishName: "Kannada",
    region: "Karnataka",
    flag: "🇮🇳"
  },
  {
    code: "ml",
    name: "മലയാളം",
    englishName: "Malayalam",
    region: "Kerala & Lakshadweep",
    flag: "🇮🇳"
  },
  {
    code: "mr",
    name: "मराठी",
    englishName: "Marathi",
    region: "Maharashtra & Goa",
    flag: "🇮🇳"
  },
  {
    code: "bn",
    name: "বাংলা",
    englishName: "Bengali",
    region: "West Bengal & Tripura",
    flag: "🇮🇳"
  },
  {
    code: "gu",
    name: "ગુજરાતી",
    englishName: "Gujarati",
    region: "Gujarat",
    flag: "🇮🇳"
  },
  {
    code: "pa",
    name: "ਪੰਜਾਬੀ",
    englishName: "Punjabi",
    region: "Punjab & Chandigarh",
    flag: "🇮🇳"
  },
  {
    code: "or",
    name: "ଓଡ଼ିଆ",
    englishName: "Odia",
    region: "Odisha",
    flag: "🇮🇳"
  },
  {
    code: "as",
    name: "অসমীয়া",
    englishName: "Assamese",
    region: "Assam & North East",
    flag: "🇮🇳"
  },
  {
    code: "ur",
    name: "اردو",
    englishName: "Urdu",
    region: "Pan-India",
    flag: "🇮🇳"
  }
];

