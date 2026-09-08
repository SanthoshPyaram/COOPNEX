import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Droplet, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Activity, 
  Radio, 
  Users, 
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { ttsService } from "../../services/tts";
import { Language } from "../../i18n/languages";

interface LanguageInfo {
  code: string;
  name: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  narration: string;
  statDonors: string;
  statRadius: string;
  statFree: string;
}

const BLOOD_LANGUAGES: LanguageInfo[] = [
  {
    code: "en",
    name: "English",
    badge: "COOPNEX Rakta Setu • Social Service Lifeline",
    title: "Community Emergency Blood Network: Saving Lives Through Cooperative Solidarity",
    subtitle: "Protecting every citizen and artisan in their critical hour of medical emergency",
    description: "COOPNEX goes beyond skilled home trades to protect human life itself. If any registered citizen, artisan, or their family requires emergency blood during critical trauma or surgery, our cooperative lifeline instantly alerts verified compatible donors within a 5 km radius.",
    narration: "Welcome to COOPNEX Rakta Setu, our community emergency blood lifeline. In moments of critical medical urgency, when any citizen or artisan needs blood, our decentralized cooperative network instantly alerts all matching donors within five kilometers. Together, cooperative solidarity saves lives.",
    statDonors: "9,420+ Verified Donors",
    statRadius: "< 7 Min Dispatch",
    statFree: "100% Free Social Service"
  },
  {
    code: "hi",
    name: "हिंदी",
    badge: "सहकारी रक्त सेतु • सामाजिक सेवा जीवन रेखा",
    title: "सामुदायिक आपातकालीन रक्त नेटवर्क: सहकारी एकजुटता से जीवन की रक्षा",
    subtitle: "चिकित्सा आपातकाल के समय हर नागरिक और कामगार की तुरंत सुरक्षा",
    description: "सहकारी सेवा केवल दैनिक घरेलू सेवाओं तक सीमित नहीं है — यह जीवन की रक्षा भी करती है। यदि किसी नागरिक, कामगार या उनके परिवार को आपातकालीन सर्जरी या दुर्घटना में रक्त की तत्काल आवश्यकता होती है, तो 5 किमी के दायरे में मौजूद सभी सुसंगत दाताओं को तुरंत प्राथमिकता सूचना भेजी जाती है।",
    narration: "सहकारी रक्त सेतु में आपका स्वागत है। गंभीर चिकित्सा आपातकाल के समय, जब किसी नागरिक या कामगार को रक्त की तत्काल आवश्यकता होती है, तो हमारा सहकारी नेटवर्क पांच किलोमीटर के दायरे में सभी सुसंगत रक्तदाताओं को तुरंत सूचित करता है।",
    statDonors: "९,४२०+ सत्यापित रक्तदाता",
    statRadius: "७ मिनट में सहायता",
    statFree: "१००% निःशुल्क सेवा"
  },
  {
    code: "te",
    name: "తెలుగు",
    badge: "సహకార రక్త సేతు • సామాజిక సేవా జీవన రేఖ",
    title: "సహకార అత్యవసర రక్త నిధి: సంఘటిత ఐక్యతతో ప్రాణ రక్షణ",
    subtitle: "వైద్య అత్యవసర సమయాల్లో ప్రతి పౌరుడికి మరియు శ్రామికుడికి అండగా",
    description: "సహకార సేవ కేవలం వృత్తిపరమైన సేవలకే పరిమితం కాదు, ప్రాణాలను కాపాడటంలోనూ ముందుంటుంది. ఏదైనా అత్యవసర శస్త్రచికిత్స లేదా ప్రమాదం జరిగినప్పుడు, సమీపంలోని 5 కిలోమీటర్ల పరిధిలోని అనుకూల రక్త వర్గాల సహకార సభ్యులకు తక్షణమే హెచ్చరిక సందేశం అందుతుంది.",
    narration: "సహకార రక్త సేతుకు స్వాగతం. అనుకోని ప్రమాదాలు లేదా అత్యవసర శస్త్రచికిత్సల సమయంలో రక్తం అవసరమైనప్పుడు, మా సహకార వ్యవస్థ ఐదు కిలోమీటర్ల పరిధిలోని రక్తదాతలను తక్షణమే అప్రమత్తం చేసి ప్రాణాలను కాపాడుతుంది.",
    statDonors: "9,420+ నమోదైన దాతలు",
    statRadius: "7 నిమిషాల్లో స్పందన",
    statFree: "100% ఉచిత సామాజిక సేవ"
  },
  {
    code: "ta",
    name: "தமிழ்",
    badge: "கூட்டுறவு இரத்த சேது • சமூக சேவை உயிர் காக்கும் அரண்",
    title: "சமூக அவசர இரத்த உதவி வலையமைப்பு: கூட்டுறவு ஒற்றுமையால் உயிர்களைக் காப்போம்",
    subtitle: "மருத்துவ அவசர காலங்களில் ஒவ்வொரு குடிமகனுக்கும் தொழிலாளிக்கும் உடனடி உதவி",
    description: "கூட்டுறவு சேவை என்பது பணிகளோடு மட்டுமல்லாமல், மனித உயிர்களையும் காக்கிறது. ஏதேனும் அவசர அறுவை சிகிச்சை அல்லது விபத்து ஏற்பட்டால், 5 கி.மீ சுற்றளவில் உள்ள பொருத்தமான இரத்த வகை கொடையாளர்களுக்கு உடனடியாக அவசர அறிவிப்பு அனுப்பப்படுகிறது.",
    narration: "கூட்டுறவு இரத்த சேது திட்டத்திற்கு உங்களை வரவேற்கிறோம். அவசர இரத்தத் தேவை ஏற்படும் போது, எங்கள் கூட்டுறவு தளம் ஐந்து கிலோமீட்டர் சுற்றளவில் உள்ள இரத்தக் கொடையாளர்களை உடனடியாக எச்சரித்து உயிர்களைக் காப்பாற்ற உதவுகிறது.",
    statDonors: "9,420+ பதிவு செய்த கொடையாளர்கள்",
    statRadius: "7 நிமிடங்களில் உதவி",
    statFree: "100% இலவச சமூக சேவை"
  },
  {
    code: "kn",
    name: "ಕನ್ನಡ",
    badge: "ಸಹಕಾರಿ ರಕ್ತ ಸೇತು • ಸಾಮಾಜಿಕ ಸೇವಾ ಜೀವ ರಕ್ಷೆ",
    title: "ಸಹಕಾರಿ ತುರ್ತು ರಕ್ತ ಜಾಲ: ಒಗ್ಗಟ್ಟಿನಿಂದ ಅಮೂಲ್ಯ ಜೀವಗಳ ರಕ್ಷಣೆ",
    subtitle: "ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಂದರ್ಭದಲ್ಲಿ ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕ ಮತ್ತು ಶ್ರಮಿಕನಿಗೆ ಬೆಂಬಲ",
    description: "ಸಹಕಾರಿ ಸೇವೆಯು ಸೇವಾ ವೃತ್ತಿಗಳಷ್ಟೇ ಅಲ್ಲದೆ, ಮಾನವ ಜೀವಗಳನ್ನು ಉಳಿಸುವ ಸಾಮಾಜಿಕ ಕರ್ತವ್ಯವನ್ನೂ ಪಾಲಿಸುತ್ತದೆ. ತುರ್ತು ಚಿಕಿತ್ಸೆಗೆ ರಕ್ತದ ಅಗತ್ಯವಿದ್ದಾಗ, 5 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಹೊಂದಾಣಿಕೆಯಾಗುವ ರಕ್ತದ ಗುಂಪಿನ ದಾನಿಗಳಿಗೆ ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಮಾಹಿತಿ ಮುಟ್ಟಿಸಲಾಗುತ್ತದೆ.",
    narration: "ಸಹಕಾರಿ ರಕ್ತ ಸೇತು ಯೋಜನೆಗೆ ಸುಸ್ವಾಗತ. ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ರಕ್ತದ ಅವಶ್ಯಕತೆ ಎದುರಾದಾಗ, ನಮ್ಮ ಜಾಲವು ಐದು ಕಿಲೋಮೀಟರ್ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ದಾನಿಗಳನ್ನು ಕೂಡಲೇ ಸಂಪರ್ಕಿಸಿ ನೆರವು ಒದಗಿಸುತ್ತದೆ.",
    statDonors: "9,420+ ನೋಂದಾಯಿತ ದಾನಿಗಳು",
    statRadius: "7 ನಿಮಿಷಗಳಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯೆ",
    statFree: "100% ಉಚಿತ ಸೇವೆ"
  },
  {
    code: "ml",
    name: "മലയാളം",
    badge: "സഹകാരി രക്ത സേതു • സാമൂഹിക സേവന ജീവൻ രേഖ",
    title: "സഹകരണ അടിയന്തര രക്ത ശൃംഖല: കൂട്ടായ്മയിലൂടെ ജീവൻ രക്ഷിക്കാം",
    subtitle: "ആരോഗ്യ അടിയന്തിരാവസ്ഥയിൽ ഓരോ പൗരനും തൊഴിലാളിക്കും കരുതൽ",
    description: "സഹകാരി സേവ തൊഴിൽ മേഖലയിൽ മാത്രമല്ല, ജീവൻ രക്ഷിക്കുന്നതിലും പ്രതിജ്ഞാബദ്ധമാണ്. അടിയന്തര ശസ്ത്രക്രിയക്കോ അപകടങ്ങളിലോ രക്തം ആവശ്യമുള്ളപ്പോൾ, 5 കിലോമീറ്റർ ചുറ്റളവിലുള്ള രക്തദാതാക്കൾക്ക് ഉടനടി സന്ദേശം ലഭിക്കുന്നു.",
    narration: "സഹകാരി രക്ത സേതുവിലേക്ക് സ്വാഗതം. അടിയന്തര ഘട്ടങ്ങളിൽ രക്തം ആവശ്യമുള്ളപ്പോൾ അഞ്ച് കിലോമീറ്റർ പരിധിയിലുള്ള രക്തദാതാക്കളെ ഉടനടി കണ്ടെത്തി ബന്ധപ്പെടുത്തുന്ന ജീവൻരക്ഷാ പദ്ധതിയാണിത്.",
    statDonors: "9,420+ രജിസ്റ്റർ ചെയ്ത ദാതാക്കൾ",
    statRadius: "7 മിനിറ്റിൽ സഹായം",
    statFree: "100% സൗജന്യ സേവനം"
  },
  {
    code: "bn",
    name: "বাংলা",
    badge: "সমবায় রক্ত সেতু • সমাজসেবা জীবনরেখা",
    title: "জরুরি রক্তদান সামাজিক নেটওয়ার্ক: সমবায় ঐক্যের মাধ্যমে জীবন রক্ষা",
    subtitle: "চিকিৎসা সংক্রান্ত জরুরি অবস্থায় প্রতিটি নাগরিক ও শ্রমিকের পাশে",
    description: "সমবায় সেবা কেবল দৈনন্দিন কাজের সেবাই দেয় না, এটি মানুষের অমূল্য জীবনও রক্ষা করে। যেকোনো জরুরি অস্ত্রোপচার বা দুর্ঘটনার সময় ৫ কিমি ব্যাসার্ধের মধ্যে রক্তদাতার সাথে তৎক্ষণাৎ যোগাযোগ স্থাপন করা হয়।",
    narration: "সমবায় রক্ত সেতুতে আপনাকে স্বাগতম। জরুরি চিকিৎসার সময় যখনই কোনো নাগরিক বা শ্রমিকের রক্তের প্রয়োজন হয়, আমাদের সমবায় নেটওয়ার্ক পাঁচ কিলোমিটার এলাকার মধ্যে উপযুক্ত রক্তদাতাদের অবিলম্বে অবহিত করে।",
    statDonors: "৯,৪২০+ নিবন্ধিত রক্তদাতা",
    statRadius: "৭ মিনিটে পরিষেবা",
    statFree: "১০০% বিনামূল্যে সেবা"
  },
  {
    code: "mr",
    name: "मराठी",
    badge: "सहकारी रक्त सेतू • सामाजिक सेवा जीवनरेखा",
    title: "सामुदायिक आपत्कालीन रक्त नेटवर्क: सहकारी एकजुटीतून अमूल्य जीवनरक्षण",
    subtitle: "वैद्यकीय आणीबाणीच्या काळात प्रत्येक नागरिक आणि कामगाराला तत्काळ आधार",
    description: "सहकारी सेवा केवळ गृहसेवांपुरती मर्यादित नसून मानवी जीवनाचे रक्षण करणारी चळवळ आहे. आपत्कालीन शस्त्रक्रियेसाठी रक्ताची आवश्यकता असल्यास ५ किमीच्या परिघात जुळणाऱ्या रक्तदात्यांना तात्काळ अलर्ट पाठवला जातो.",
    narration: "सहकारी रक्त सेतूमध्ये आपले स्वागत आहे. आपत्कालीन प्रसंगी जेव्हा एखाद्या बांधवाला रक्ताची निकड असते, तेव्हा आमचे नेटवर्क पाच किलोमीटर अंतरावरील रक्तदात्यांना तत्काळ सक्रिय करते.",
    statDonors: "९,४२०+ नोंदणीकृत रक्तदाते",
    statRadius: "७ मिनिटांत प्रतिसाद",
    statFree: "१००% मोफत सामाजिक सेवा"
  },
  {
    code: "gu",
    name: "ગુજરાતી",
    badge: "સહકારી રક્ત સેતુ • સામાજિક સેવા જીવનરેખા",
    title: "સહકારી આપાતકાલીન રક્ત નેટવર્ક: પરસ્પર સહયોગ દ્વારા જીવનની રક્ષા",
    subtitle: "તબીબી કટોકટીમાં દરેક નાગરિક અને શ્રમિક સાથે અડગ ટેકો",
    description: "સહકારી સેવા માત્ર રોજિંદા કામ પૂરતી સીમિત નથી પરંતુ જીવન બચાવવાની પ્રવૃત્તિ છે. કટોકટીમાં 5 કિમી વિસ્તારના સુસંગત બ્લડ ડોનર્સને તાત્કાલિક મેસેજ મોકલીને લોહીની વ્યવસ્થા કરવામાં આવે છે.",
    narration: "સહકારી રક્ત સેતુમાં આપનું સ્વાગત છે. ઈમરજન્સી વખતે જ્યારે લોહીની તાતી જરૂરિયાત ઊભી થાય છે ત્યારે અમારું નેટવર્ક પાંચ કિલોમીટરના દાયરામાં રહેલા તમામ દાતાઓને તુરંત જ સચેત કરે છે.",
    statDonors: "૯,૪૨૦+ નોંધાયેલા રક્તદાતાઓ",
    statRadius: "૭ મિનિટમાં મદદ",
    statFree: "૧૦૦% નિઃશુલ્ક સેવા"
  },
  {
    code: "pa",
    name: "ਪੰਜਾਬੀ",
    badge: "ਸਹਿਕਾਰੀ ਰਕਤ ਸੇਤੂ • ਸਮਾਜ ਸੇਵਾ ਜੀਵਨ ਰੇਖਾ",
    title: "ਸਹਿਕਾਰੀ ਸੰਕਟਕਾਲੀਨ ਖੂਨ ਨੈੱਟਵਰਕ: ਸਾਂਝੀ ਏਕਤਾ ਨਾਲ ਅਨਮੋਲ ਜਾਨਾਂ ਦੀ ਰਾਖੀ",
    subtitle: "ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਹਰ ਨਾਗਰਿਕ ਅਤੇ ਕਿਰਤੀ ਦੇ ਨਾਲ ਖੜ੍ਹਨਾ",
    description: "ਸਹਿਕਾਰੀ ਸੇਵਾ ਸਿਰਫ਼ ਕੰਮਾਂ ਤੱਕ ਸੀਮਤ ਨਹੀਂ, ਸਗੋਂ ਜ਼ਿੰਦਗੀਆਂ ਬਚਾਉਣ ਦਾ ਫ਼ਰਜ਼ ਵੀ ਨਿਭਾਉਂਦੀ ਹੈ। ਕਿਸੇ ਐਮਰਜੈਂਸੀ ਵੇਲੇ 5 ਕਿਲੋਮੀਟਰ ਦੇ ਘੇਰੇ ਅੰਦਰਲੇ ਖ਼ੂਨਦਾਨੀਆਂ ਨੂੰ ਤੁਰੰਤ ਸੁਚੇਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
    narration: "ਸਹਿਕਾਰੀ ਰਕਤ ਸੇਤੂ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਸੰਕਟਕਾਲੀਨ ਸਥਿਤੀ ਵਿੱਚ ਜਦੋਂ ਕਿਸੇ ਮਰੀਜ਼ ਨੂੰ ਖੂਨ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ, ਸਾਡਾ ਨੈੱਟਵਰਕ ਪੰਜ ਕਿਲੋਮੀਟਰ ਦੇ ਦਾਇਰੇ ਵਿੱਚ ਮੌਜੂਦ ਖ਼ੂਨਦਾਨੀਆਂ ਨੂੰ ਫ਼ੌਰੀ ਸੂਚਿਤ ਕਰਦਾ ਹੈ।",
    statDonors: "੯,੪੨੦+ ਰਜਿਸਟਰਡ ਖ਼ੂਨਦਾਨੀ",
    statRadius: "੭ ਮਿੰਟਾਂ ਵਿੱਚ ਮਦਦ",
    statFree: "੧੦੦% ਮੁਫ਼ਤ ਸੇਵਾ"
  }
];

const BLOOD_GROUPS_MATRIX = [
  { group: "O-", canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], canReceiveFrom: ["O-"], isUniversalDonor: true },
  { group: "O+", canDonateTo: ["O+", "A+", "B+", "AB+"], canReceiveFrom: ["O+", "O-"], isEmergencyReserve: true },
  { group: "A-", canDonateTo: ["A-", "A+", "AB-", "AB+"], canReceiveFrom: ["A-", "O-"] },
  { group: "A+", canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
  { group: "B-", canDonateTo: ["B-", "B+", "AB-", "AB+"], canReceiveFrom: ["B-", "O-"] },
  { group: "B+", canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
  { group: "AB-", canDonateTo: ["AB-", "AB+"], canReceiveFrom: ["AB-", "A-", "B-", "O-"] },
  { group: "AB+", canDonateTo: ["AB+"], canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], isUniversalRecipient: true }
];

export const EmergencyBloodCoopBanner: React.FC = () => {
  const [selectedLangCode, setSelectedLangCode] = useState<string>("en");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("O+");
  const [testDistressTriggered, setTestDistressTriggered] = useState<boolean>(false);

  const currentLang = BLOOD_LANGUAGES.find((l) => l.code === selectedLangCode) || BLOOD_LANGUAGES[0];
  const currentMatrix = BLOOD_GROUPS_MATRIX.find((b) => b.group === selectedBloodGroup) || BLOOD_GROUPS_MATRIX[1];

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
    } else {
      ttsService.stop();
      setIsSpeaking(true);
      ttsService.speak(currentLang.narration, {
        language: currentLang.code as Language,
        gender: "FEMALE",
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  // When language switches, stop any audio
  const handleSelectLanguage = (code: string) => {
    ttsService.stop();
    setIsSpeaking(false);
    setSelectedLangCode(code);
  };

  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-slate-950 to-red-950 text-white border border-rose-800/50 shadow-2xl p-6 sm:p-10 my-8">
      {/* Background Animated EKG Waveform */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
        <svg
          className="w-full h-48 animate-pulse text-rose-500"
          viewBox="0 0 1000 150"
          preserveAspectRatio="none"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M0,75 L200,75 L220,20 L240,130 L260,75 L300,75 L320,10 L340,140 L360,75 L600,75 L620,20 L640,130 L660,75 L700,75 L720,10 L740,140 L760,75 L1000,75" />
        </svg>
      </div>

      {/* Radiant Glow Behind Lifeline */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-8">
        {/* Top Bar: 10-Language Selector Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-900/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/40">
                <Heart className="w-6 h-6 fill-white animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-rose-300">
                {currentLang.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                COOPNEX Rakta Setu
              </h3>
            </div>
          </div>

          {/* 10 Languages Horizontal Scroll Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            {BLOOD_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelectLanguage(l.code)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedLangCode === l.code
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105"
                    : "bg-white/10 hover:bg-white/20 text-rose-100"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Narrative Block + Narration Button */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>5 km Geo-Distributed Cooperative Emergency Lifeline</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {currentLang.title}
            </h2>

            <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-3xl">
              {currentLang.description}
            </p>

            {/* Listen Narration Voice Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleToggleSpeak}
                className={`py-2.5 px-5 rounded-full font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                  isSpeaking
                    ? "bg-rose-500 text-white ring-4 ring-rose-500/30 animate-pulse"
                    : "bg-white hover:bg-rose-50 text-rose-950"
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Speech Narration ({currentLang.name})</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-rose-600" />
                    <span>Listen Voice Explanation ({currentLang.name})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTestDistressTriggered(true)}
                className="py-2.5 px-5 rounded-full bg-rose-900/60 hover:bg-rose-900 border border-rose-600/60 text-rose-200 font-bold text-xs transition cursor-pointer flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Simulate 5 km Emergency Broadcast</span>
              </button>
            </div>
          </div>

          {/* Right Statistics Highlight Column */}
          <div className="lg:col-span-4 bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-rose-800/40 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-900/50 pb-3">
              <span className="text-xs font-mono font-bold text-rose-300 uppercase">
                Cooperative Relay Health
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                STANDBY ACTIVE
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-950/40 border border-rose-900/30">
                <span className="text-xs text-rose-200">{currentLang.statDonors}</span>
                <span className="text-base font-black text-rose-300">9,420+</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-950/40 border border-rose-900/30">
                <span className="text-xs text-rose-200">{currentLang.statRadius}</span>
                <span className="text-base font-black text-emerald-400">&lt; 7 Mins</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-950/40 border border-rose-900/30">
                <span className="text-xs text-rose-200">{currentLang.statFree}</span>
                <span className="text-base font-black text-amber-400">₹0 Cost</span>
              </div>
            </div>

            <div className="text-[11px] text-rose-200/80 leading-relaxed pt-1">
              • Direct integration with 108 Emergency Ambulance Dispatches &amp; District Blood Banks.
            </div>
          </div>
        </div>

        {/* Interactive Blood Compatibility Matrix */}
        <div className="bg-slate-950/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-rose-900/40 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-rose-300 flex items-center gap-2">
                <Droplet className="w-4 h-4 fill-rose-400 text-rose-400" />
                <span>Interactive Cooperative Blood Matching Matrix</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Select any blood group below to visualize exact donor and recipient compatibility across our network:
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Back Arrow Mark Button to navigate to previous blood group */}
              <button
                type="button"
                onClick={() => {
                  const currentIdx = BLOOD_GROUPS_MATRIX.findIndex(b => b.group === selectedBloodGroup);
                  const prevIdx = (currentIdx - 1 + BLOOD_GROUPS_MATRIX.length) % BLOOD_GROUPS_MATRIX.length;
                  setSelectedBloodGroup(BLOOD_GROUPS_MATRIX[prevIdx].group);
                }}
                className="p-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 transition cursor-pointer"
                title="Previous Blood Group (Back)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono text-rose-400 font-bold bg-rose-950 px-3 py-1 rounded-full border border-rose-800/60">
                Selected: {currentMatrix.group}
              </span>

              {/* Forward Arrow Mark Button */}
              <button
                type="button"
                onClick={() => {
                  const currentIdx = BLOOD_GROUPS_MATRIX.findIndex(b => b.group === selectedBloodGroup);
                  const nextIdx = (currentIdx + 1) % BLOOD_GROUPS_MATRIX.length;
                  setSelectedBloodGroup(BLOOD_GROUPS_MATRIX[nextIdx].group);
                }}
                className="p-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 transition cursor-pointer"
                title="Next Blood Group"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Blood Groups Selection Pills */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS_MATRIX.map((bg) => {
              const isSelected = selectedBloodGroup === bg.group;
              return (
                <button
                  key={bg.group}
                  type="button"
                  onClick={() => setSelectedBloodGroup(bg.group)}
                  className={`py-3 px-2 rounded-2xl text-center font-mono font-black transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/40 scale-105"
                      : "bg-slate-900/90 text-rose-200 border-rose-950 hover:bg-rose-950/50 hover:border-rose-800"
                  }`}
                >
                  <div className="text-lg">{bg.group}</div>
                  <div className="text-[9px] font-sans font-normal opacity-80 mt-0.5">
                    {bg.isUniversalDonor
                      ? "Univ. Donor"
                      : bg.isUniversalRecipient
                      ? "Univ. Recipient"
                      : "Standard"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Group Dynamic Compatibility Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                {currentMatrix.group} Can Safely DONATE Blood To:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentMatrix.canDonateTo.map((target) => (
                  <span
                    key={target}
                    className="px-3 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-mono font-bold text-xs"
                  >
                    {target}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                {currentMatrix.isUniversalDonor
                  ? "⭐ Universal Red Cell Donor: Critical life-saver for emergency accident cases before blood cross-matching."
                  : `Any patient with ${currentMatrix.canDonateTo.join(", ")} can safely receive this blood.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                {currentMatrix.group} Can Safely RECEIVE Blood From:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentMatrix.canReceiveFrom.map((source) => (
                  <span
                    key={source}
                    className="px-3 py-1 rounded-xl bg-blue-950/80 text-blue-300 border border-blue-700/60 font-mono font-bold text-xs"
                  >
                    {source}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                {currentMatrix.isUniversalRecipient
                  ? "⭐ Universal Recipient: Can receive red blood cells from any blood group during trauma surgeries."
                  : `In trauma emergencies, COOPNEX alerts matching donors of type: ${currentMatrix.canReceiveFrom.join(", ")}.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Distress Simulation Popup */}
      {testDistressTriggered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-950 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-600 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-rose-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                <h4 className="text-base font-black text-rose-400 uppercase tracking-wider">
                  Live Emergency Distress Broadcast Test
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setTestDistressTriggered(false)}
                className="text-slate-400 hover:text-white text-base font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              In a real situation, when an emergency beacon is activated for <strong className="text-white">{selectedBloodGroup}</strong> blood, our cooperative server instantly executes an algorithm notifying 15-20 verified donors located within 5 km of the hospital.
            </p>

            <div className="p-3 bg-rose-950/80 rounded-2xl border border-rose-800 text-[11px] space-y-1 font-mono text-rose-200">
              <div>• Geo-Filter Radius: 5.0 KM</div>
              <div>• Matching Blood Groups: {currentMatrix.canReceiveFrom.join(", ")}</div>
              <div>• Active Responders in Zone: 24 Artisans &amp; Citizens</div>
              <div>• Ambulance Dispatch SLA: 6.8 Minutes</div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setTestDistressTriggered(false)}
                className="py-2 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition"
              >
                Close Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
