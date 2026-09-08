import { Language } from "../../i18n/languages";

export interface VoiceProfile {
  languageCode: string;       // e.g. "te-IN"
  languageName: string;       // "Telugu"
  nativeName: string;         // "తెలుగు"
  voiceName: string;          // Google Cloud voice (e.g. "te-IN-Standard-A")
  voiceGender: "FEMALE" | "MALE";
  speakingRate: number;       // Calibrated baseline speech rate (0.85 - 0.95)
  pitch: number;              // Pitch offset
  volumeGain: number;         // Gain offset
  fallbackBrowserVoiceHints: string[]; // Strings to match in window.speechSynthesis.getVoices()
  sampleSentence: string;
  phoneticSampleSentence: string;
}

export type VoiceSpeedSetting = "NORMAL" | "SLOW" | "VERY_SLOW";

export const SPEED_MULTIPLIERS: Record<VoiceSpeedSetting, number> = {
  NORMAL: 1.0,
  SLOW: 0.85,
  VERY_SLOW: 0.72
};

export const VOICE_CONFIGS: Record<Language, VoiceProfile> = {
  en: {
    languageCode: "en-IN",
    languageName: "English (India)",
    nativeName: "Indian English",
    voiceName: "en-IN-Neural2-A",
    voiceGender: "FEMALE",
    speakingRate: 0.92,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["en-IN", "Indian", "India", "en_IN", "en-GB", "en-US"],
    sampleSentence: "Welcome to COOPNEX. Find trusted, skill-certified cooperative workers near you with zero broker commission.",
    phoneticSampleSentence: "Welcome to COOPNEX. Find trusted, skill-certified cooperative workers near you with zero broker commission."
  },
  hi: {
    languageCode: "hi-IN",
    languageName: "Hindi",
    nativeName: "हिन्दी",
    voiceName: "hi-IN-Neural2-A",
    voiceGender: "FEMALE",
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["hi-IN", "hi_IN", "Hindi", "Google हिन्दी"],
    sampleSentence: "सहकारी सेवा में आपका स्वागत है। अपने निकटतम प्रमाणित और पुलिस सत्यापित सहकारी कामगारों से सीधे जुड़ें। शत प्रतिशत पारदर्शी मजदूरी।",
    phoneticSampleSentence: "Namaste! COOPNEX mein aapka swagat hai. Apne pass pramanit cooperative kamgaron se seedhe judein. Zero percent commission."
  },
  te: {
    languageCode: "te-IN",
    languageName: "Telugu",
    nativeName: "తెలుగు",
    voiceName: "te-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["te-IN", "te_IN", "Telugu", "Google తెలుగు"],
    sampleSentence: "సహకారి సేవకు స్వాగతం. మీకు సమీపంలోని నైపుణ్యం కలిగిన సహకార కార్మికులను నేరుగా సంప్రదించండి. దళారీల కమీషన్ లేకుండా వంద శాతం న్యాయమైన వేతనం.",
    phoneticSampleSentence: "Namaskaram! COOPNEX ku swagatham. Meeku sameepamlo unna cooperative karmikulanu neruga sampardhinchandi. Zero commission, direct fair wage."
  },
  ta: {
    languageCode: "ta-IN",
    languageName: "Tamil",
    nativeName: "தமிழ்",
    voiceName: "ta-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["ta-IN", "ta_IN", "Tamil", "Google தமிழ்"],
    sampleSentence: "சஹகாரி சேவைக்கு வரவேற்கிறோம். உங்கள் பகுதிக்கு அருகிலுள்ள சான்றளிக்கப்பட்ட கூட்டுறவு பணியாளர்களை இடைத்தரகர் இன்றி நேரடியாக தொடர்பு கொள்ளுங்கள்.",
    phoneticSampleSentence: "Vanakkam! COOPNEX-virku varaverkirom. Ungal arugil ulla kootturavu paniyalargalai thodarpu kollungal. Zero commission."
  },
  kn: {
    languageCode: "kn-IN",
    languageName: "Kannada",
    nativeName: "ಕನ್ನಡ",
    voiceName: "kn-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["kn-IN", "kn_IN", "Kannada", "Google ಕನ್ನಡ"],
    sampleSentence: "ಸಹಕಾರಿ ಸೇವೆಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಹತ್ತಿರದ ಪ್ರಮಾಣೀಕೃತ ಸ್ಥಳೀಯ ಸಹಕಾರಿ ಕೆಲಸಗಾರರನ್ನು ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ. ಶೇಕಡಾ ನೂರು ನ್ಯಾಯಯುತ ವೇತನ.",
    phoneticSampleSentence: "Namaskara! COOPNEX-ge swagatha. Nimma hathirada sahakari karmikarannu neravagi samparkisi. No middleman commission."
  },
  ml: {
    languageCode: "ml-IN",
    languageName: "Malayalam",
    nativeName: "മലയാളം",
    voiceName: "ml-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["ml-IN", "ml_IN", "Malayalam", "Google മലയാളം"],
    sampleSentence: "സഹകാരി സേവയിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ അടുത്തുള്ള സർട്ടിഫൈഡ് സഹകരണ തൊഴിലാളികളെ ഇടനിലക്കാരില്ലാതെ കണ്ടെത്തുക.",
    phoneticSampleSentence: "Namaskaram! COOPNEX-yilekku swagatham. Ningalude aduthulla certified cooperative thozhilalikaley kandethuka. Zero commission."
  },
  mr: {
    languageCode: "mr-IN",
    languageName: "Marathi",
    nativeName: "मराठी",
    voiceName: "mr-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["mr-IN", "mr_IN", "Marathi", "Google मराठी"],
    sampleSentence: "सहकारी सेवेमध्ये आपले स्वागत आहे. आपल्या परिसरातील कुशल सहकारी कारागिरांशी थेट संपर्क साधा. शून्य कमिशन, थेट बँक खात्यात मोबदला.",
    phoneticSampleSentence: "Namaskar! COOPNEX madhe aple swagat aahe. Aplya parisaratil pramanit kamgaranshi samparka sadha. Zero percent dalal commission."
  },
  bn: {
    languageCode: "bn-IN",
    languageName: "Bengali",
    nativeName: "বাংলা",
    voiceName: "bn-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["bn-IN", "bn_IN", "Bengali", "Google বাংলা"],
    sampleSentence: "সহকারি সেবায় আপনাকে স্বাগতম। আপনার এলাকার বিশ্বস্ত ও প্রত্যয়িত সমবায় কর্মীদের সাথে কোনো মধ্যস্থতাকারী ছাড়াই যোগাযোগ করুন।",
    phoneticSampleSentence: "Nomoshkar! COOPNEX e swagotom. Apnar elakar certified somobay kormider sathe jogajog korun. Zero broker commission."
  },
  gu: {
    languageCode: "gu-IN",
    languageName: "Gujarati",
    nativeName: "ગુજરાતી",
    voiceName: "gu-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["gu-IN", "gu_IN", "Gujarati", "Google ગુજરાતી"],
    sampleSentence: "સહકારી સેવામાં આપનું સ્વાગત છે. તમારી નજીકના પ્રમાણિત સહકારી કારીગરો સાથે સીધો સંપર્ક કરો. શૂન્ય કમિશન સાથે પારદર્શક સેવા.",
    phoneticSampleSentence: "Namaste! COOPNEX ma tamaru swagat chhe. Tamara najik na pramanit cooperative karigaro sathe sidho sampark karo."
  },
  pa: {
    languageCode: "pa-IN",
    languageName: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    voiceName: "pa-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["pa-IN", "pa_IN", "Punjabi", "Google ਪੰਜਾਬੀ"],
    sampleSentence: "ਸਹਿਕਾਰੀ ਸੇਵਾ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਆਪਣੇ ਨੇੜਲੇ ਪ੍ਰਮਾਣਿਤ ਸਹਿਕਾਰੀ ਕਾਰੀਗਰਾਂ ਨਾਲ ਬਿਨਾਂ ਕਿਸੇ ਵਿਚੋਲੇ ਦੇ ਸਿੱਧਾ ਸੰਪਰਕ ਕਰੋ।",
    phoneticSampleSentence: "Sat Sri Akal! COOPNEX vich twada swagat hai. Apne nere de certified sahakari kamgaran naal seedha rabta karo. Zero commission."
  },
  or: {
    languageCode: "or-IN",
    languageName: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    voiceName: "or-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["or-IN", "or_IN", "Odia", "Oriya"],
    sampleSentence: "ସହକାରୀ ସେବାରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ନିଜ ଅଞ୍ଚଳର ପ୍ରମାଣିତ ଶ୍ରମିକଙ୍କ ସହିତ ସିଧାସଳଖ ଯୋଡି ହୁଅନ୍ତୁ।",
    phoneticSampleSentence: "Namaskar! COOPNEX re apananku swagat. Nija anchala ra certified karmika nka sahita sidhasalakha jodantu."
  },
  as: {
    languageCode: "as-IN",
    languageName: "Assamese",
    nativeName: "অসমীয়া",
    voiceName: "as-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["as-IN", "as_IN", "Assamese"],
    sampleSentence: "সহকাৰী সেৱাত আপোনাক স্বাগতম। আপোনাৰ অঞ্চলৰ প্ৰশিক্ষিত কাৰিকৰৰ সৈতে পোনপটীয়া যোগাযোগ কৰক।",
    phoneticSampleSentence: "Nomoskar! COOPNEXt apunak swagotom. Aponar anchalar certified karikoror hoite sidha jogajog korok."
  },
  ur: {
    languageCode: "ur-IN",
    languageName: "Urdu",
    nativeName: "اردو",
    voiceName: "ur-IN-Standard-A",
    voiceGender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGain: 0.0,
    fallbackBrowserVoiceHints: ["ur-IN", "ur_IN", "ur-PK", "Urdu"],
    sampleSentence: "سہکاری سیوا میں آپ کا خیر مقدم ہے۔ اپنے قریب ترین تصدیق شدہ کاریگروں سے بلا واسطہ رابطہ کریں۔",
    phoneticSampleSentence: "Adaab! COOPNEX mein aapka khair maqdam hai. Apne qareebi certified cooperative artisans se seedhe rabta karein."
  }
};

/**
 * Gets VoiceProfile safely by Language code, defaulting to en-IN
 */
export function getVoiceProfile(lang: Language | string): VoiceProfile {
  const key = (lang as Language) in VOICE_CONFIGS ? (lang as Language) : "en";
  return VOICE_CONFIGS[key] || VOICE_CONFIGS.en;
}

