export interface ServerVoiceProfile {
  languageCode: string;       // e.g. "te-IN"
  languageName: string;       // "Telugu"
  nativeName: string;         // "తెలుగు"
  defaultVoice: string;       // Primary Google Cloud Voice name
  gender: "FEMALE" | "MALE";  // Default gender
  alternateVoice?: string;    // Alternate gender voice
  speakingRate: number;       // Calibrated speech rate (clear > fast)
  pitch: number;              // Pitch offset (-20.0 to 20.0)
  volumeGainDb: number;       // Volume gain
  provider: "google-cloud";
  sampleText: string;
}

export const SERVER_VOICE_CONFIG: Record<string, ServerVoiceProfile> = {
  "en-IN": {
    languageCode: "en-IN",
    languageName: "English (India)",
    nativeName: "Indian English",
    defaultVoice: "en-IN-Neural2-A", // Premium Neural2 Indian English (Female)
    gender: "FEMALE",
    alternateVoice: "en-IN-Neural2-B", // Male
    speakingRate: 0.92,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "Welcome to Sahakari Seva. Connect directly with certified cooperative workers near you with zero commission."
  },
  "hi-IN": {
    languageCode: "hi-IN",
    languageName: "Hindi",
    nativeName: "हिन्दी",
    defaultVoice: "hi-IN-Neural2-A", // Premium Neural2 Hindi (Female)
    gender: "FEMALE",
    alternateVoice: "hi-IN-Neural2-B", // Male
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "सहकारी सेवा में आपका स्वागत है। अपने पास सत्यापित स्थानीय कामगारों से सीधे जुड़ें। शत प्रतिशत पारदर्शी मजदूरी।"
  },
  "te-IN": {
    languageCode: "te-IN",
    languageName: "Telugu",
    nativeName: "తెలుగు",
    defaultVoice: "te-IN-Standard-A", // Telugu Standard A (Female)
    gender: "FEMALE",
    alternateVoice: "te-IN-Standard-B", // Male
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "సహకారి సేవకు స్వాగతం. మీకు సమీపంలోని నైపుణ్యం కలిగిన సహకార కార్మికులను నేరుగా సంప్రదించండి. జీరో బ్రోకర్ కమిషన్."
  },
  "ta-IN": {
    languageCode: "ta-IN",
    languageName: "Tamil",
    nativeName: "தமிழ்",
    defaultVoice: "ta-IN-Standard-A", // Tamil Standard A (Female)
    gender: "FEMALE",
    alternateVoice: "ta-IN-Standard-B", // Male
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "சஹகாரி சேவைக்கு வரவேற்கிறோம். உங்களுக்கு அருகிலுள்ள சான்றளிக்கப்பட்ட கூட்டுறவு பணியாளர்களை உடனடியாகக் கண்டறியவும்."
  },
  "kn-IN": {
    languageCode: "kn-IN",
    languageName: "Kannada",
    nativeName: "ಕನ್ನಡ",
    defaultVoice: "kn-IN-Standard-A", // Kannada Standard A (Female)
    gender: "FEMALE",
    alternateVoice: "kn-IN-Standard-B", // Male
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "ಸಹಕಾರಿ ಸೇವೆಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ಹತ್ತಿರದ ಪ್ರಮಾಣೀಕೃತ ಸ್ಥಳೀಯ ಸಹಕಾರಿ ಕೆಲಸಗಾರರನ್ನು ಸುಲಭವಾಗಿ ಸಂಪರ್ಕಿಸಿ."
  },
  "ml-IN": {
    languageCode: "ml-IN",
    languageName: "Malayalam",
    nativeName: "മലയാളം",
    defaultVoice: "ml-IN-Standard-A", // Malayalam Standard A (Female)
    gender: "FEMALE",
    alternateVoice: "ml-IN-Standard-B", // Male
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "സഹകാരി സേവയിലേക്ക് സ്വാഗതം. നിങ്ങളുടെ പ്രദേശത്തെ സാക്ഷ്യപ്പെടുത്തിയ സഹകരണ തൊഴിലാളികളെ കണ്ടെത്തുക."
  },
  "bn-IN": {
    languageCode: "bn-IN",
    languageName: "Bengali",
    nativeName: "বাংলা",
    defaultVoice: "bn-IN-Standard-A", // Bengali Standard A (Female)
    gender: "FEMALE",
    alternateVoice: "bn-IN-Standard-B", // Male
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "সহকারি সেবায় আপনাকে স্বাগতম। আপনার এলাকার বিশ্বস্ত ও প্রত্যয়িত সমবায় কর্মীদের সাথে সরাসরি যোগাযোগ করুন।"
  },
  "mr-IN": {
    languageCode: "mr-IN",
    languageName: "Marathi",
    nativeName: "मराठी",
    defaultVoice: "mr-IN-Standard-A", // Marathi Standard A (Female)
    gender: "FEMALE",
    alternateVoice: "mr-IN-Standard-B", // Male
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "सहकारी सेवेमध्ये आपले स्वागत आहे. आपल्या परिसरातील प्रमाणित सहकारी कामगारांशी संपर्क साधा. शून्य कमिशन."
  },
  "gu-IN": {
    languageCode: "gu-IN",
    languageName: "Gujarati",
    nativeName: "ગુજરાતી",
    defaultVoice: "gu-IN-Standard-A", // Gujarati Standard A (Female)
    gender: "FEMALE",
    alternateVoice: "gu-IN-Standard-B", // Male
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "સહકારી સેવામાં આપનું સ્વાગત છે. તમારા નજીકના પ્રમાણિત સહકારી કારીગરો સાથે સીધો સંપર્ક કરો."
  },
  "pa-IN": {
    languageCode: "pa-IN",
    languageName: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    defaultVoice: "pa-IN-Standard-A", // Punjabi Standard A (Female)
    gender: "FEMALE",
    alternateVoice: "pa-IN-Standard-B", // Male
    speakingRate: 0.90,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "ਸਹਿਕਾਰੀ ਸੇਵਾ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਆਪਣੇ ਇਲਾਕੇ ਦੇ ਪ੍ਰਮਾਣਿਤ ਸਹਿਕਾਰੀ ਕਾਰੀਗਰਾਂ ਨਾਲ ਜੁੜੋ।"
  },
  "or-IN": {
    languageCode: "or-IN",
    languageName: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    defaultVoice: "or-IN-Standard-A",
    gender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "ସହକାରୀ ସେବାରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ। ନିଜ ଅଞ୍ଚଳର ପ୍ରମାଣିତ ଶ୍ରମିକଙ୍କ ସହିତ ସିଧାସଳଖ ଯୋଡି ହୁଅନ୍ତୁ।"
  },
  "as-IN": {
    languageCode: "as-IN",
    languageName: "Assamese",
    nativeName: "অসমীয়া",
    defaultVoice: "as-IN-Standard-A",
    gender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "সহকাৰী সেৱাত আপোনাক স্বাগতম। আপোনাৰ অঞ্চলৰ প্ৰশিক্ষিত কাৰিকৰৰ সৈতে পোনপটীয়া যোগাযোগ কৰক।"
  },
  "ur-IN": {
    languageCode: "ur-IN",
    languageName: "Urdu",
    nativeName: "اردو",
    defaultVoice: "ur-IN-Standard-A",
    gender: "FEMALE",
    speakingRate: 0.88,
    pitch: 0.0,
    volumeGainDb: 0.0,
    provider: "google-cloud",
    sampleText: "سہکاری سیوا میں آپ کا خیر مقدم ہے۔ اپنے قریب ترین تصدیق شدہ کاریگروں سے بلا واسطہ رابطہ کریں۔"
  }
};

/**
 * Normalizes short language codes (e.g. "te", "hi", "en") into full IETF Indian tags ("te-IN", "hi-IN", "en-IN")
 */
export function normalizeLanguageCode(code: string): string {
  if (!code) return "en-IN";
  const trimmed = code.trim();
  if (trimmed.includes("-")) {
    const [lang, region] = trimmed.split("-");
    return `${lang.toLowerCase()}-${region.toUpperCase()}`;
  }
  const map: Record<string, string> = {
    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    bn: "bn-IN",
    mr: "mr-IN",
    gu: "gu-IN",
    pa: "pa-IN",
    or: "or-IN",
    as: "as-IN",
    ur: "ur-IN"
  };
  return map[trimmed.toLowerCase()] || "en-IN";
}

