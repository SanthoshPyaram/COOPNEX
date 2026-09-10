import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Users,
  Vote,
  Coins,
  Scale,
  GraduationCap,
  HeartHandshake,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Award,
  Globe,
  Check
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { Language } from "../../i18n";
import { ttsService } from "../../services/tts/ttsService";

export interface PrincipleData {
  id: number;
  number: string;
  title: string;
  summary: string;
  points: string[];
  maleDialogue: string;
  femaleDialogue: string;
  speechNarration: string;
  icon: React.ElementType;
  themeColor: string;
  badgeBg: string;
}

export interface LanguageCoopContent {
  code: string;
  name: string;
  nativeName: string;
  motto: string;
  mottoSub: string;
  manifestoBadge: string;
  principlesBadge: string;
  duoTitle: string;
  duoSub: string;
  enforceBadge: string;
  compliantBadge: string;
  principles: PrincipleData[];
}

export const COOPERATIVE_LANGUAGES_CONTENT: Record<string, LanguageCoopContent> = {
  // 1. ENGLISH
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    motto: "Prosperity Through Cooperation",
    mottoSub: "Zero Private Middlemen • 100% Direct Fair Floor Wage • Democratic Worker Ownership",
    manifestoBadge: "NATIONAL COOPERATIVE POLICY & LABOUR MANIFESTO",
    principlesBadge: "ICA 6 INTERNATIONAL COOPERATIVE PRINCIPLES",
    duoTitle: "Ramesh & Sujatha • National Cooperative Ambassadors",
    duoSub: "Certified Field Artisan & Federation Director",
    enforceBadge: "Enforced by District Cooperative Registrar",
    compliantBadge: "100% STATUTORY COMPLIANT",
    principles: [
      {
        id: 0,
        number: "01",
        title: "Voluntary & Open Membership",
        summary: "Cooperative membership is open to every skilled technician and domestic worker without social or gender barriers.",
        points: [
          "Zero arbitrary platform blocking or sudden deactivation penalties",
          "Equal access to local ward bookings and 24/7 emergency dispatch rosters",
          "Dignified legal membership recognized under State Cooperative Societies Acts"
        ],
        maleDialogue: "I joined freely without paying any registration fee. No private company can shut my livelihood overnight!",
        femaleDialogue: "Our cooperative doors welcome every honest artisan. We stand united with equal dignity for all.",
        speechNarration: "Principle One: Voluntary and Open Membership. Membership is open to all skilled artisans with zero discrimination or extortion fees.",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "Democratic Member Control",
        summary: "One Artisan = One Vote. Workers elect their primary society governing council and decide wage schedules democratically.",
        points: [
          "Annual general body meetings elect society secretaries transparently",
          "Statutory hourly floor rates voted by members, not algorithmic surge formulas",
          "Equal dividend redistribution from cooperative annual surplus"
        ],
        maleDialogue: "We vote on our minimum hourly rates ourselves. No corporate CEO decides what our sweat is worth!",
        femaleDialogue: "Democratic governance means workers are the true shareholders of the cooperative network.",
        speechNarration: "Principle Two: Democratic Member Control. One worker, one vote. Artisans collectively govern wage policies and board elections.",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "Direct Economic Participation",
        summary: "0% aggregator extraction. The full statutory base wage flows 100% directly into the worker's bank account via NPCI.",
        points: [
          "Direct DBT escrow transfer to Jan Dhan or bank passbook upon citizen confirmation",
          "Zero hidden platform commission, surge taxes, or booking deduction cuts",
          "Surplus funds returned to artisans annually as cooperative patronage bonuses"
        ],
        maleDialogue: "When a citizen pays ₹500, I receive the full ₹500 directly in my bank account. Zero middleman cut!",
        femaleDialogue: "Direct economic transparency brings financial independence to every artisan household.",
        speechNarration: "Principle Three: Direct Economic Participation. Zero percent aggregator fee. Every single rupee earned reaches the artisan directly.",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "Autonomy & Collective Independence",
        summary: "Primary societies operate as autonomous democratic bodies under constitutional law, protected from corporate capture.",
        points: [
          "Immune to unilateral algorithmic wage slashing or venture capital exploitation",
          "Statutory arbitration through the Registrar of Cooperative Societies",
          "Federation legal aid and institutional support provided to all members"
        ],
        maleDialogue: "We run our own society independently under the law. We are self-reliant artisans, not gig slaves.",
        femaleDialogue: "Cooperative autonomy safeguards our workers from corporate exploitation and unilateral policy changes.",
        speechNarration: "Principle Four: Autonomy and Independence. Societies maintain self-governing sovereignty under cooperative constitutional safeguards.",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "Education, Training & Skill Upgradation",
        summary: "Continuous NSQF Level-4 trade upskilling, solar transition courses, and modern diagnostic toolkit grants.",
        points: [
          "Government-accredited skill certifications provided at zero tuition expense",
          "Modern digital tool replacement micro-grants sponsored by State Federations",
          "Safety compliance, high-voltage handling, and polite household etiquette workshops"
        ],
        maleDialogue: "The cooperative trained me in solar inverter installation for free. My daily earnings doubled!",
        femaleDialogue: "Skill education empowers informal workers to become certified modern technology specialists.",
        speechNarration: "Principle Five: Education and Training. Continuous free skill certifications and tool grants elevate artisan dignity and earnings.",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "Concern for Community & Social Security",
        summary: "Universal health cover, accidental insurance, family education scholarships, and a dignified old-age retirement pool.",
        points: [
          "PM-JAY ₹5,00,000 cashless family hospitalization and accidental cover",
          "Cooperative child education grants and emergency medical aid fund",
          "Long-term artisan pension corpus established from collective 10% welfare reserves"
        ],
        maleDialogue: "When my daughter needed college admission, the cooperative scholarship grant supported our family.",
        femaleDialogue: "Social security guarantees that no artisan or their children are left behind in times of crisis.",
        speechNarration: "Principle Six: Concern for Community. Universal health coverage, accidental insurance, and pension safety nets for lifetime dignity.",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 2. HINDI (हिन्दी)
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    motto: "सहकार से समृद्धि",
    mottoSub: "शून्य निजी बिचौलिया • १००% सीधी न्यूनतम मजदूरी • लोकतांत्रिक श्रमिक स्वामित्व",
    manifestoBadge: "राष्ट्रीय सहकारी नीति एवं श्रमिक घोषणापत्र",
    principlesBadge: "आईसीए के ६ अंतर्राष्ट्रीय सहकारी सिद्धांत",
    duoTitle: "रमेश एवं सुजाता • राष्ट्रीय सहकारी राजदूत",
    duoSub: "प्रमाणित फील्ड कारीगर एवं महासंघ निदेशक",
    enforceBadge: "जिला सहकारी निबंधक द्वारा वैधानिक रूप से लागू",
    compliantBadge: "१००% वैधानिक अनुपालन",
    principles: [
      {
        id: 0,
        number: "01",
        title: "खुली एवं स्वैच्छिक सदस्यता",
        summary: "बिना किसी भेदभाव के प्रत्येक कुशल कारीगर एवं श्रमिक के लिए सहकारी सदस्यता पूरी तरह खुली है।",
        points: [
          "मनमाने ढंग से आईडी ब्लॉक या ब्लैकलिस्ट करने पर पूर्ण प्रतिबंध",
          "स्थानीय वार्ड बुकिंग और चौबीसों घंटे आपातकालीन रोस्टर में समान अवसर",
          "राज्य सहकारी समिति अधिनियम के तहत आधिकारिक पहचान एवं सम्मान"
        ],
        maleDialogue: "बिना किसी पंजीकरण शुल्क के मैं जुड़ा। कोई निजी कंपनी मेरी आजीविका बंद नहीं कर सकती!",
        femaleDialogue: "हमारे सहकारी के दरवाजे हर ईमानदार कारीगर के लिए खुले हैं। हम सब एक साथ खड़े हैं।",
        speechNarration: "सिद्धांत एक: खुली एवं स्वैच्छिक सदस्यता। बिना किसी भेदभाव या दलाली के प्रत्येक कुशल कारीगर का स्वागत है।",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "लोकतांत्रिक सदस्य नियंत्रण",
        summary: "एक श्रमिक = एक वोट। कारीगर अपनी प्राथमिक समिति के संचालक मंडल का चुनाव करते हैं और स्वयं दरें तय करते हैं।",
        points: [
          "वार्षिक आम बैठक में पारदर्शी रूप से समिति सचिव का निर्वाचन",
          "न्यूनतम मजदूरी दरें सदस्यों द्वारा मतदान से तय, न कि निजी एल्गोरिदम से",
          "सहकारी के वार्षिक लाभांश का सभी सदस्यों में समान पुनर्वितरण"
        ],
        maleDialogue: "हम खुद अपनी मजदूरी की न्यूनतम दर तय करते हैं। कोई कॉर्पोरेट मालिक हमारा हक नहीं छीन सकता!",
        femaleDialogue: "लोकतांत्रिक व्यवस्था का मतलब है कि श्रमिक ही सहकारी नेटवर्क के असली मालिक हैं।",
        speechNarration: "सिद्धांत दो: लोकतांत्रिक सदस्य नियंत्रण। एक कारीगर, एक वोट। कारीगर स्वयं अपनी मजदूरी और समिति का संचालन करते हैं।",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "सीधी आर्थिक भागीदारी",
        summary: "शून्य प्रतिशत बिचौलिया कमीशन। नागरिक द्वारा भुगतान की गई पूरी मजदूरी सीधे बैंक खाते में जमा होती है।",
        points: [
          "काम पूरा होने पर डीबीटी द्वारा जनधन या बैंक पासबुक में शत-प्रतिशत भुगतान",
          "कोई छुपा हुआ कमीशन, सर्च टैक्स या अनुचित कटौती नहीं",
          "वार्षिक अतिरिक्त लाभ से सभी कारीगरों को बोनस का वितरण"
        ],
        maleDialogue: "जब नागरिक ₹५०० देता है, मुझे पूरे ₹५०० मिलते हैं। एक रुपये की भी दलाली नहीं कटती!",
        femaleDialogue: "सीधी कमाई से हमारे कारीगर परिवारों को सच्ची आर्थिक स्वतंत्रता और आत्मसम्मान मिला है।",
        speechNarration: "सिद्धांत तीन: सीधी आर्थिक भागीदारी। शून्य प्रतिशत कमीशन। कमाई का हर एक रुपया सीधे कारीगर के खाते में जाता है।",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "स्वायत्तता एवं स्वतंत्रता",
        summary: "सहकारी समितियां संवैधानिक रूप से स्वतंत्र हैं, निजी कंपनियों के दबाव से पूरी तरह मुक्त।",
        points: [
          "निजी कंपनियों के मनमाने नियमों या मजदूरी कटौती से पूर्ण कानूनी सुरक्षा",
          "सहकारी निबंधक के माध्यम से वैधानिक विवाद निवारण और निष्पक्ष न्याय",
          "सभी सदस्यों के अधिकारों की रक्षा के लिए कानूनी सहायता उपलब्ध"
        ],
        maleDialogue: "हम कानून के तहत अपनी समिति खुद चलाते हैं। हम स्वाभिमानी कारीगर हैं, किसी के गुलाम नहीं।",
        femaleDialogue: "सहकारी स्वायत्तता हमारे कामगारों को कॉर्पोरेट शोषण से बचाती है।",
        speechNarration: "सिद्धांत चार: स्वायत्तता एवं स्वतंत्रता। सहकारी समितियां कानूनी स्वतंत्रता के साथ आत्मनिर्भरता से कार्य करती हैं।",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "शिक्षा, प्रशिक्षण एवं कौशल विकास",
        summary: "निःशुल्क एनएसक्यूएफ स्तर-४ प्रमाणन, सौर ऊर्जा प्रशिक्षण और आधुनिक टूल्स के लिए अनुदान।",
        points: [
          "सरकारी मान्यता प्राप्त कौशल प्रमाणन बिना किसी फीस के प्रदान किया जाता है",
          "राज्य महासंघ द्वारा आधुनिक डिजिटल उपकरणों के लिए विशेष अनुदान",
          "सुरक्षा मानकों और घरेलू शिष्टाचार पर नियमित कार्यशालाएं"
        ],
        maleDialogue: "सहकारी ने मुझे सोलर इंस्टॉलेशन सिखाया। मेरी दैनिक कमाई पहले से दोगुनी हो गई!",
        femaleDialogue: "कौशल प्रशिक्षण अनौपचारिक श्रमिकों को प्रमाणित आधुनिक तकनीशियन बनाता है।",
        speechNarration: "सिद्धांत पांच: शिक्षा, प्रशिक्षण एवं कौशल विकास। निःशुल्क प्रशिक्षण और आधुनिक उपकरण कारीगरों का मान बढ़ाते हैं।",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "समुदाय के प्रति सरोकार एवं सामाजिक सुरक्षा",
        summary: "आयुष्मान भारत ₹५ लाख स्वास्थ्य सुरक्षा, दुर्घटना बीमा, छात्रवृत्ति और पेंशन की व्यवस्था।",
        points: [
          "पीएम-जय योजना के तहत ₹५,००,००० का कैशलेस परिवार अस्पताल बीमा",
          "दुर्घटना सुरक्षा और बच्चों की उच्च शिक्षा के लिए सहकारी छात्रवृत्ति",
          "१०% कल्याण कोष से कारीगरों के लिए आजीवन पेंशन की सुरक्षित व्यवस्था"
        ],
        maleDialogue: "जब मेरी बेटी को कॉलेज जाना था, सहकारी समिति की छात्रवृत्ति ने पूरी मदद की।",
        femaleDialogue: "सामाजिक सुरक्षा से हर कारीगर परिवार कठिन समय में भी सुरक्षित और सम्मानित रहता है।",
        speechNarration: "सिद्धांत छह: समुदाय के प्रति सरोकार। स्वास्थ्य बीमा, दुर्घटना सुरक्षा और पेंशन से हर कारीगर को आजीवन सुरक्षा मिलती है।",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 3. TELUGU (తెలుగు)
  te: {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    motto: "సహకారం ద్వారా సమృద్ధి",
    mottoSub: "సున్నా శాతం దళారీ కమీషన్ • 100% నేరుగా కార్మికుల ఖాతాకే కనీస వేతనం • ప్రజాస్వామిక యాజమాన్యం",
    manifestoBadge: "జాతీయ సహకార విధానం & కార్మిక మేనిఫెస్టో",
    principlesBadge: "ఐసీఏ 6 అంతర్జాతీయ సహకార సూత్రాలు",
    duoTitle: "రమేష్ & సుజాత • జాతీయ సహకార రాయబారులు",
    duoSub: "సర్టిఫైడ్ ఫీల్డ్ టెక్నీషియన్ & ఫెడరేషన్ డైరెక్టర్",
    enforceBadge: "జిల్లా సహకార రిజిస్ట్రార్ ద్వారా చట్టబద్ధంగా అమలు",
    compliantBadge: "100% చట్టబద్ధమైన కార్మిక భద్రత",
    principles: [
      {
        id: 0,
        number: "01",
        title: "స్వచ్ఛంద & బహిరంగ సభ్యత్వం",
        summary: "కుల, మత, లింగ వివక్ష లేకుండా నైపుణ్యం కలిగిన ప్రతి కార్మికుడికి సహకార సంఘంలో సభ్యత్వం లభిస్తుంది.",
        points: [
          "కారణం లేకుండా ఐడీ బ్లాక్ చేయడం లేదా తొలగించే చర్యలకు పూర్తి స్వస్తి",
          "స్థానిక వార్డు బుకింగ్స్ మరియు 24/7 ఎమర్జెన్సీ సేవలలో సమాన అవకాశాలు",
          "రాష్ట్ర సహకార సంఘాల చట్టం కింద అధికారిక గుర్తింపు మరియు ఆత్మగౌరవం"
        ],
        maleDialogue: "ఎటువంటి దళారీ ఫీజు లేకుండా చేరాను. ఏ ప్రైవేట్ కంపెనీ కూడా నా ఉపాధిని అకస్మాత్తుగా ఆపలేదు!",
        femaleDialogue: "మా సహకార సంఘం తలుపులు ప్రతి నిజాయితీపరుడైన కార్మికుడికి ఎల్లవేళలా తెరిచి ఉంటాయి.",
        speechNarration: "మొదటి సూత్రం: స్వచ్ఛంద మరియు బహిరంగ సభ్యత్వం. ఎటువంటి వివక్ష లేకుండా నైపుణ్యం కలిగిన ప్రతి కార్మికుడికి సమాన హక్కులు ఉంటాయి.",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "ప్రజాస్వామిక సభ్యుల నియంత్రణ",
        summary: "ఒక కార్మికుడు = ఒక ఓటు. కార్మికులే తమ సంఘం పాలకవర్గాన్ని ఎన్నుకుంటారు మరియు కనీస వేతనాలను నిర్ణయిస్తారు.",
        points: [
          "వార్షిక సర్వసభ్య సమావేశంలో పారదర్శకంగా సంఘం కార్యదర్శి ఎన్నిక",
          "కార్మికుల ఆమోదంతోనే గంటల వారీ చట్టబద్ధమైన కనీస వేతనాల నిర్ణయం",
          "సంఘం ఆర్జించిన వార్షిక మిగులు నిధిని సభ్యులందరికీ సమానంగా పంపిణీ"
        ],
        maleDialogue: "మా వేతనాలను మేమే ఓటు వేసి నిర్ణయిస్తాం. కార్పొరేట్ కంపెనీల దోపిడీకి తావు లేదు!",
        femaleDialogue: "ప్రజాస్వామిక నియంత్రణ అంటే ఈ సహకార వేదికకు కార్మికులే నిజమైన యజమానులు.",
        speechNarration: "రెండవ సూత్రం: ప్రజాస్వామిక సభ్యుల నియంత్రణ. ఒక కార్మికుడికి ఒక ఓటు. కార్మికులే తమ వేతనాలు మరియు నాయకులను ఎన్నుకుంటారు.",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "ప్రత్యక్ష ఆర్థిక భాగస్వామ్యం",
        summary: "సున్నా శాతం యాప్ కమీషన్. పౌరులు చెల్లించే ప్రతి రూపాయి నేరుగా కార్మికుడి జన్ ధన్ బ్యాంక్ ఖాతాకే చేరుతుంది.",
        points: [
          "పని పూర్తయిన వెంటనే డీబీటీ ద్వారా నేరుగా బ్యాంక్ ఖాతాలో నగదు జమ",
          "ఎటువంటి దాగివున్న కమీషన్లు, సర్జ్ పన్నులు లేదా అన్యాయమైన కోతలు ఉండవు",
          "వార్షిక బోనస్ మరియు సహకార డివిడెండ్లను కార్మికులకే తిరిగి చెల్లింపు"
        ],
        maleDialogue: "కస్టమర్ ₹500 చెల్లిస్తే, పూర్తి ₹500 నా బ్యాంక్ ఖాతాలో పడుతుంది. ఒక్క రూపాయి కూడా దళారీలు కట్ చేయరు!",
        femaleDialogue: "నేరుగా బ్యాంకులో పడే పూర్తి వేతనంతో కార్మికుల కుటుంబాలలో ఆర్థిక భద్రత వెల్లివిరిసింది.",
        speechNarration: "మూడవ సూత్రం: ప్రత్యక్ష ఆర్థిక భాగస్వామ్యం. సున్నా శాతం కమీషన్. కార్మికుడు కష్టపడి సంపాదించిన ప్రతి పైసా నేరుగా అతనికే చెందుతుంది.",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "స్వయంప్రతిపత్తి & స్వాతంత్ర్యం",
        summary: "సహకార సంఘాలు చట్టబద్ధమైన స్వయంప్రతిపత్తితో పనిచేస్తాయి, ప్రైవేట్ కార్పొరేట్ల ఒత్తిళ్లకు తలొగ్గవు.",
        points: [
          "కార్పొరేట్ కంపెనీల ఏకపక్ష నిబంధనలు లేదా వేతన తగ్గింపుల నుండి పూర్తి రక్షణ",
          "సహకార రిజిస్ట్రార్ ద్వారా చట్టబద్ధమైన వివాదాల పరిష్కారం మరియు న్యాయం",
          "కార్మికుల హక్కుల పరిరక్షణ కోసం ఫెడరేషన్ ఉచిత న్యాయ సహాయం"
        ],
        maleDialogue: "మేము చట్టప్రకారం మా సంఘాన్ని మేమే స్వతంత్రంగా నడుపుకుంటాం. ఎవరికీ బానిసలం కాము.",
        femaleDialogue: "సహకార స్వాతంత్ర్యం మన కార్మికులను ప్రైవేట్ దోపిడీ నుండి పూర్తిగా కాపాడుతుంది.",
        speechNarration: "నాల్గవ సూత్రం: స్వయంప్రతిపత్తి మరియు స్వాతంత్ర్యం. సహకార సంఘాలు చట్టబద్ధమైన రక్షణలతో స్వతంత్రంగా పనిచేస్తాయి.",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "విద్య, శిక్షణ & నైపుణ్యాభివృద్ధి",
        summary: "ఉచిత ఎన్‌ఎస్‌క్యూఎఫ్ లెవల్-4 సర్టిఫికేషన్, సోలార్ ఎనర్జీ కోర్సులు మరియు ఆధునిక టూల్ కిట్ గ్రాంట్లు.",
        points: [
          "ప్రభుత్వ గుర్తింపు పొందిన నైపుణ్య శిక్షణను ఉచితంగా అందించడం",
          "రాష్ట్ర ఫెడరేషన్ ద్వారా ఆధునిక డిజిటల్ పరికరాల కొనుగోలుకు సబ్సిడీ",
          "విద్యుత్ భద్రతా ప్రమాణాలు మరియు గృహ సేవా మర్యాదలపై నిరంతర అవగాహన"
        ],
        maleDialogue: "సహకార సంఘం నాకు సోలార్ ఇన్వర్టర్ పనులలో ఉచిత శిక్షణ ఇచ్చింది. నా రోజువారీ సంపాదన రెట్టింపైంది!",
        femaleDialogue: "నైపుణ్య శిక్షణతో అసంఘటిత రంగ కార్మికులు సర్టిఫైడ్ నిపుణులుగా ఎదుగుతున్నారు.",
        speechNarration: "ఐదవ సూత్రం: విద్య, శిక్షణ మరియు నైపుణ్యాభివృద్ధి. ఉచిత శిక్షణ మరియు ఆధునిక పరికరాలు కార్మికుల గౌరవాన్ని పెంచుతాయి.",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "సమాజ హితం & సామాజిక భద్రత",
        summary: "ఆయుష్మాన్ భారత్ ₹5 లక్షల ఉచిత ఆరోగ్య రక్షణ, ప్రమాద బీమా, పిల్లల చదువుకు స్కాలర్‌షిప్ మరియు పెన్షన్.",
        points: [
          "పీఎం-జేఏవై కింద ₹5,00,000 వరకు నగదు రహిత కుటుంబ ఆసుపత్రి బీమా",
          "ప్రమాద బీమా మరియు కార్మికుల ఆడపిల్లల ఉన్నత చదువులకు సహకార ఆర్థిక సాయం",
          "10% సంక్షేమ నిధితో కార్మికుల వృద్ధాప్యానికి గౌరవప్రదమైన పెన్షన్ వ్యవస్థ"
        ],
        maleDialogue: "నా బిడ్డ కాలేజీ ఫీజు కట్టడానికి సహకార సంఘం ఇచ్చిన స్కాలర్‌షిప్ ఎంతో ఆదుకుంది.",
        femaleDialogue: "సామాజిక భద్రతతో ప్రతి కార్మికుడి కుటుంబం ఆపద సమయాల్లోనూ ధైర్యంగా నిలబడుతుంది.",
        speechNarration: "ఆరవ సూత్రం: సమాజ హితం మరియు సామాజిక భద్రత. ఉచిత ఆరోగ్య బీమా, ప్రమాద రక్షణ మరియు పెన్షన్ ద్వారా జీవితాంతం ఆత్మగౌరవం లభిస్తుంది.",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 4. TAMIL (தமிழ்)
  ta: {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    motto: "கூட்டுறவு மூலம் வளம்",
    mottoSub: "0% இடைத்தரகர் கமிஷன் • 100% நேரடி சட்டபூர்வ கூலி • தொழிலாளர்களின் ஜனநாயக உரிமை",
    manifestoBadge: "தேசிய கூட்டுறவுக் கொள்கை மற்றும் தொழிலாளர் அறிக்கை",
    principlesBadge: "சர்வதேச கூட்டுறவின் 6 முக்கிய கொள்கைகள்",
    duoTitle: "ரமேஷ் & சுஜாதா • தேசிய கூட்டுறவு தூதர்கள்",
    duoSub: "சான்றளிக்கப்பட்ட கள கைவினைஞர் & கூட்டமைப்பு இயக்குனர்",
    enforceBadge: "மாவட்ட கூட்டுறவு பதிவாளரால் சட்டபூர்வமாக அமல்படுத்தப்பட்டது",
    compliantBadge: "100% சட்டபூர்வமான தொழிலாளர் பாதுகாப்பு",
    principles: [
      {
        id: 0,
        number: "01",
        title: "தன்னார்வ மற்றும் திறந்த உறுப்பினர் உரிமை",
        summary: "எந்தவித பாகுபாடும் இன்றி அனைத்து திறமையான தொழிலாளர்களுக்கும் கூட்டுறவு அமைப்பில் சம உரிமை உண்டு.",
        points: [
          "காரணமின்றி கணக்குகளை முடக்குவது அல்லது நீக்குவது முற்றிலும் தடை செய்யப்பட்டுள்ளது",
          "உள்ளூர் வார்டு பணிகளில் 24/7 அவசர சேவைகளில் சம வாய்ப்பு",
          "மாநில கூட்டுறவுச் சட்டத்தின் கீழ் அதிகாரப்பூர்வ அங்கீகாரம் மற்றும் கவுரவம்"
        ],
        maleDialogue: "எந்த இடைத்தரகர் கட்டணமும் இன்றி இணைந்தேன். எந்த தனியார் நிறுவனமும் என் வாழ்வாதாரத்தை பறிக்க முடியாது!",
        femaleDialogue: "எங்கள் கூட்டுறவு கதவுகள் அனைத்து நேர்மையான கைவினைஞர்களுக்கும் திறந்தே உள்ளன.",
        speechNarration: "கொள்கை ஒன்று: தன்னார்வ மற்றும் திறந்த உறுப்பினர் உரிமை. எந்தவித பாகுபாடும் இன்றி அனைத்து தொழிலாளர்களுக்கும் சம உரிமை.",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "ஜனநாயக உறுப்பினர் கட்டுப்பாடு",
        summary: "ஒரு தொழிலாளி = ஒரு வாக்கு. தொழிலாளர்களே நிர்வாகக் குழுவை தேர்ந்தெடுத்து கூலியை முடிவு செய்கிறார்கள்.",
        points: [
          "ஆண்டு பொதுக்குழு கூட்டத்தில் ஜனநாயக முறையில் நிர்வாகிகளை தேர்வு செய்தல்",
          "தனியார் அல்காரிதத்திற்கு இடமின்றி தொழிலாளர்களே நிர்ணயிக்கும் குறைந்தபட்ச கூலி",
          "கூட்டுறவின் ஆண்டு உபரி லாபம் அனைத்து உறுப்பினர்களுக்கும் சமமாக பகிர்வு"
        ],
        maleDialogue: "நாங்களே வாக்கு செலுத்தி கூலியை முடிவு செய்கிறோம். கார்ப்பரேட் ஆதிக்கத்திற்கு இங்கு இடமில்லை!",
        femaleDialogue: "ஜனநாயக நிர்வாகம் தொழிலாளர்களை இந்த அமைப்பின் உண்மையான உரிமையாளர்களாக்குகிறது.",
        speechNarration: "கொள்கை இரண்டு: ஜனநாயக உறுப்பினர் கட்டுப்பாடு. ஒரு தொழிலாளிக்கு ஒரு வாக்கு. தொழிலாளர்களே கூலி மற்றும் கொள்கைகளை தீர்மானிக்கிறார்கள்.",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "நேரடி பொருளாதார பங்களிப்பு",
        summary: "0% கமிஷன் பிடித்தம். வாடிக்கையாளர் செலுத்தும் முழு பணமும் தொழிலாளியின் வங்கி கணக்கில் நேரடியாக சேரும்.",
        points: [
          "பணி முடிந்ததும் டிபிடி மூலம் வங்கி பாஸ்புக்கில் உடனுக்குடன் பணம் வரவு",
          "எந்த மறைமுக கமிஷனோ, கூடுதல் வரி பிடித்தமோ கிடையாது",
          "கூட்டுறவு உபரி நிதியிலிருந்து ஆண்டுதோறும் போனஸ் மற்றும் ஊக்கத்தொகை"
        ],
        maleDialogue: "வாடிக்கையாளர் ₹500 கொடுத்தால் முழு ₹500-ம் என் வங்கிக் கணக்கிற்கு வரும். ஒரு பைசா கூட கமிஷன் இல்லை!",
        femaleDialogue: "நேரடி வங்கி பரிவர்த்தனை தொழிலாளர் குடும்பங்களுக்கு உண்மையான பொருளாதார விடுதலையை தந்துள்ளது.",
        speechNarration: "கொள்கை மூன்று: நேரடி பொருளாதார பங்களிப்பு. 0% இடைத்தரகர் கமிஷன். உழைக்கும் ஒவ்வொரு ரூபாயும் நேரடியாக தொழிலாளிக்கே சேரும்.",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "சுயாட்சி மற்றும் சுதந்திரம்",
        summary: "கூட்டுறவு சங்கங்கள் சட்டரீதியாக தன்னாட்சியுடன் செயல்படுகின்றன, கார்ப்பரேட் அழுத்தங்களுக்கு அடிபணியாது.",
        points: [
          "தனியார் நிறுவனங்களின் தன்னிச்சையான கூலி குறைப்பிலிருந்து முழுமையான பாதுகாப்பு",
          "கூட்டுறவு பதிவாளர் மூலம் வெளிப்படையான பிரச்சனை தீர்வு மற்றும் நீதி",
          "உரிமைகளை பாதுகாக்க அனைத்து உறுப்பினர்களுக்கும் இலவச சட்ட உதவி"
        ],
        maleDialogue: "நாங்கள் சட்டப்படி எங்கள் சங்கத்தை சுயமாக நடத்துகிறோம். நாங்கள் எவருக்கும் அடிமைகள் அல்ல.",
        femaleDialogue: "கூட்டுறவு சுயாட்சி நம் தொழிலாளர்களை தனியார் நிறுவனங்களின் சுரண்டலில் இருந்து பாதுகாக்கிறது.",
        speechNarration: "கொள்கை நான்கு: சுயாட்சி மற்றும் சுதந்திரம். கூட்டுறவு அமைப்புகள் சட்டபூர்வ சுயாட்சியுடன் செயல்படுகின்றன.",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "கல்வி, பயிற்சி மற்றும் திறன் மேம்பாடு",
        summary: "இலவச என்.எஸ்.க்யூ.எஃப் நிலை-4 சான்றிதழ், சூரிய ஆற்றல் பயிற்சிகள் மற்றும் நவீன உபகரண மானியங்கள்.",
        points: [
          "அரசு அங்கீகாரம் பெற்ற நவீன திறன் பயிற்சி கட்டணமின்றி வழங்கப்படுகிறது",
          "மாநில கூட்டமைப்பு மூலம் அதிநவீன கருவிகள் வாங்க சிறப்பு மானியம்",
          "பாதுகாப்பு நெறிமுறைகள் மற்றும் நற்பண்புகள் குறித்த தொடர் பயிற்சிகள்"
        ],
        maleDialogue: "கூட்டுறவு எனக்கு சோலார் இன்வெர்ட்டர் பழுதுபார்க்க பயிற்சி அளித்தது. என் வருமானம் இருமடங்கானது!",
        femaleDialogue: "திறன் கல்வி அமைப்புசாரா தொழிலாளர்களை சான்றளிக்கப்பட்ட தொழில்நுட்ப வல்லுநர்களாக மாற்றுகிறது.",
        speechNarration: "கொள்கை ஐந்து: கல்வி மற்றும் திறன் மேம்பாடு. இலவச பயிற்சி மற்றும் உபகரண மானியங்கள் தொழிலாளர்களின் கவுரவத்தை உயர்த்துகின்றன.",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "சமூக அக்கறை மற்றும் சமூக பாதுகாப்பு",
        summary: "ஆயுஷ்மான் பாரத் ₹5 லட்சம் மருத்துவ காப்பீடு, விபத்து காப்பீடு மற்றும் ஓய்வூதிய பாதுகாப்பு திட்டம்.",
        points: [
          "பி.எம்-ஜே.ஏ.ஒய் மூலம் குடும்பத்திற்கு ₹5,00,000 ரொக்கமில்லா மருத்துவமனை சிகிச்சை",
          "விபத்து பாதுகாப்பு மற்றும் பெண் குழந்தைகளின் உயர்கல்விக்கு கல்வி உதவித்தொகை",
          "10% நல நிதியிலிருந்து தொழிலாளர்களுக்கு பாதுகாப்பான ஓய்வூதிய நிதி"
        ],
        maleDialogue: "என் மகளின் கல்லூரி கட்டணம் செலுத்த கூட்டுறவு கல்வி உதவித்தொகை பெரிதும் உதவியது.",
        femaleDialogue: "சமூக பாதுகாப்புடன் தொழிலாளர் குடும்பங்கள் எவ்வித இக்கட்டான சூழலையும் துணிவுடன் எதிர்கொள்கின்றன.",
        speechNarration: "கொள்கை ஆறு: சமூக பாதுகாப்பு. மருத்துவ காப்பீடு, விபத்து பாதுகாப்பு மற்றும் ஓய்வூதியம் வாழ்நாள் முழுவதும் கவுரவத்தை உறுதி செய்கிறது.",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 5. KANNADA (ಕನ್ನಡ)
  kn: {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    motto: "ಸಹಕಾರದಿಂದ ಸಮೃದ್ಧಿ",
    mottoSub: "ಶೂನ್ಯ ಮಧ್ಯವರ್ತಿ ಕಮಿಷನ್ • 100% ನೇರ ಶಾಸನಬದ್ಧ ಕನಿಷ್ಠ ವೇತನ • ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಕಾರ್ಮಿಕ ಒಡೆತನ",
    manifestoBadge: "ರಾಷ್ಟ್ರೀಯ ಸಹಕಾರ ನೀತಿ ಮತ್ತು ಕಾರ್ಮಿಕ ಪ್ರಣಾಳಿಕೆ",
    principlesBadge: "ಐಸಿಎ 6 ಅಂತರರಾಷ್ಟ್ರೀಯ ಸಹಕಾರ ತತ್ವಗಳು",
    duoTitle: "ರಮೇಶ್ & ಸುಜಾತಾ • ರಾಷ್ಟ್ರೀಯ ಸಹಕಾರ ರಾಯಭಾರಿಗಳು",
    duoSub: "ಪ್ರಮಾಣೀಕೃತ ಫೀಲ್ಡ್ ಕರಕುಶಲಕರ್ಮಿ & ಫೆಡರೇಶನ್ ನಿರ್ದೇಶಕರು",
    enforceBadge: "ಜಿಲ್ಲಾ ಸಹಕಾರ ನಿಬಂಧಕರಿಂದ ಶಾಸನಬದ್ಧವಾಗಿ ಜಾರಿ",
    compliantBadge: "100% ಶಾಸನಬದ್ಧ ಕಾರ್ಮಿಕ ಭದ್ರತೆ",
    principles: [
      {
        id: 0,
        number: "01",
        title: "ಸ್ವಯಂಪ್ರೇರಿತ ಮತ್ತು ಮುಕ್ತ ಸದಸ್ಯತ್ವ",
        summary: "ಯಾವುದೇ ಸಾಮಾಜಿಕ ಅಥವಾ ಲಿಂಗ ತಾರತಮ್ಯವಿಲ್ಲದೆ ನುರಿತ ಪ್ರತಿಯೊಬ್ಬ ಕಾರ್ಮಿಕನಿಗೂ ಸಹಕಾರ ಸಂಘದಲ್ಲಿ ಮುಕ್ತ ಪ್ರವೇಶವಿದೆ.",
        points: [
          "ಕಾರಣವಿಲ್ಲದೆ ಖಾತೆ ಅಮಾನತು ಅಥವಾ ಬ್ಲಾಕ್‌ಲಿಸ್ಟ್ ಮಾಡುವ ಪದ್ಧತಿಗೆ ಸಂಪೂರ್ಣ ನಿಷೇಧ",
          "ಸ್ಥಳೀಯ ವಾರ್ಡ್ ಬುಕಿಂಗ್ ಮತ್ತು ತುರ್ತು ರವಾನೆ ಸೇವೆಗಳಲ್ಲಿ ಸಮಾನ ಅವಕಾಶ",
          "ರಾಜ್ಯ ಸಹಕಾರ ಸಂಘಗಳ ಕಾಯ್ದೆಯಡಿ ಅಧಿಕೃತ ಸದಸ್ಯತ್ವ ಮತ್ತು ಗೌರವ"
        ],
        maleDialogue: "ಯಾವುದೇ ನೋಂದಣಿ ಶುಲ್ಕವಿಲ್ಲದೆ ನಾನು ಸೇರಿಕೊಂಡೆ. ಖಾಸಗಿ ಕಂಪನಿ ನನ್ನ ಅನ್ನದ ದಾರಿಯನ್ನು ಮುಚ್ಚಲು ಸಾಧ್ಯವಿಲ್ಲ!",
        femaleDialogue: "ನಮ್ಮ ಸಹಕಾರ ಸಂಘದ ಬಾಗಿಲು ಪ್ರತಿಯೊಬ್ಬ ಪ್ರಾಮಾಣಿಕ ಕರಕುಶಲಕರ್ಮಿಗೂ ಸದಾ ತೆರೆದಿರುತ್ತದೆ.",
        speechNarration: "ತತ್ವ ಒಂದು: ಸ್ವಯಂಪ್ರೇರಿತ ಮತ್ತು ಮುಕ್ತ ಸದಸ್ಯತ್ವ. ಯಾವುದೇ ತಾರತಮ್ಯವಿಲ್ಲದೆ ನುರಿತ ಪ್ರತಿಯೊಬ್ಬ ಕಾರ್ಮಿಕನಿಗೂ ಸಮಾನ ಹಕ್ಕುಗಳಿವೆ.",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಸದಸ್ಯರ ನಿಯಂತ್ರಣ",
        summary: "ಒಬ್ಬ ಕಾರ್ಮಿಕ = ಒಂದು ಮತ. ಕಾರ್ಮಿಕರೇ ಆಡಳಿತ ಮಂಡಳಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡುತ್ತಾರೆ ಮತ್ತು ವೇತನ ದರಗಳನ್ನು ನಿರ್ಧರಿಸುತ್ತಾರೆ.",
        points: [
          "ವಾರ್ಷಿಕ ಮಹಾಸಭೆಯಲ್ಲಿ ಪಾರದರ್ಶಕವಾಗಿ ಸಂಘದ ಕಾರ್ಯದರ್ಶಿ ಚುನಾವಣೆ",
          "ಖಾಸಗಿ ಅಲ್ಗಾರಿದಮ್‌ಗಳ ಬದಲಿಗೆ ಕಾರ್ಮಿಕರೇ ಮತ ಚಲಾಯಿಸಿ ನಿಗದಿಪಡಿಸುವ ಕನಿಷ್ಠ ಕೂಲಿ",
          "ಸಹಕಾರ ಸಂಘದ ವಾರ್ಷಿಕ ಲಾಭಾಂಶವನ್ನು ಎಲ್ಲಾ ಸದಸ್ಯರಿಗೆ ಸಮಾನವಾಗಿ ಹಂಚಿಕೆ"
        ],
        maleDialogue: "ನಮ್ಮ ಕನಿಷ್ಠ ಗಂಟೆಯ ಕೂಲಿಯನ್ನು ನಾವೇ ನಿರ್ಧರಿಸುತ್ತೇವೆ. ಕಾರ್ಪೊರೇಟ್ ಶೋಷಣೆಗೆ ಇಲ್ಲಿ ಜಾಗವಿಲ್ಲ!",
        femaleDialogue: "ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ನಿಯಂತ್ರಣ ಎಂದರೆ ಕಾರ್ಮಿಕರೇ ಈ ಜಾಲತಾಣದ ನಿಜವಾದ ಮಾಲೀಕರು.",
        speechNarration: "ತತ್ವ ಎರಡು: ಪ್ರಜಾಸತ್ತಾತ್ಮಕ ಸದಸ್ಯರ ನಿಯಂತ್ರಣ. ಒಬ್ಬ ಕಾರ್ಮಿಕನಿಗೆ ಒಂದು ಮತ. ಕಾರ್ಮಿಕರೇ ತಮ್ಮ ವೇತನ ಮತ್ತು ನಿಯಮಗಳನ್ನು ನಿರ್ಧರಿಸುತ್ತಾರೆ.",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "ನೇರ ಆರ್ಥಿಕ ಭಾಗವಹಿಸುವಿಕೆ",
        summary: "0% ಮಧ್ಯವರ್ತಿ ಕಮಿಷನ್. ನಾಗರಿಕರು ಪಾವತಿಸುವ ಪೂರ್ಣ ಹಣ ನೇರವಾಗಿ ಕಾರ್ಮಿಕರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.",
        points: [
          "ಕೆಲಸ ಮುಗಿದ ತಕ್ಷಣ ಡಿಬಿಟಿ ಮೂಲಕ ಜನ್ ಧನ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ ನೇರ ವರ್ಗಾವಣೆ",
          "ಯಾವುದೇ ಗುಪ್ತ ಕಮಿಷನ್, ಸರ್ಜ್ ತೆರಿಗೆ ಅಥವಾ ಅನ್ಯಾಯದ ಕಡಿತಗಳಿಲ್ಲ",
          "ವಾರ್ಷಿಕ ಹೆಚ್ಚುವರಿ ಲಾಭದಿಂದ ಎಲ್ಲಾ ಸದಸ್ಯರಿಗೆ ಬೋನಸ್ ವಿತರಣೆ"
        ],
        maleDialogue: "ಗ್ರಾಹಕರು ₹500 ಪಾವತಿಸಿದರೆ, ಪೂರ್ಣ ₹500 ನನ್ನ ಖಾತೆಗೆ ಬರುತ್ತದೆ. ಮಧ್ಯವರ್ತಿಗಳ ಕಮಿಷನ್ ಇಲ್ಲ!",
        femaleDialogue: "ನೇರ ವೇತನದಿಂದ ನಮ್ಮ ಕಾರ್ಮಿಕರ ಕುಟುಂಬಗಳಲ್ಲಿ ನಿಜವಾದ ಆರ್ಥಿಕ ಸ್ವಾತಂತ್ರ್ಯ ಮೂಡಿದೆ.",
        speechNarration: "ತತ್ವ ಮೂರು: ನೇರ ಆರ್ಥಿಕ ಭಾಗವಹಿಸುವಿಕೆ. ಶೂನ್ಯ ಶೇಕಡಾ ಕಮಿಷನ್. ದುಡಿದ ಪ್ರತಿ ರೂಪಾಯಿ ನೇರವಾಗಿ ಕಾರ್ಮಿಕರಿಗೆ ತಲುಪುತ್ತದೆ.",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "ಸ್ವಾಯತ್ತತೆ ಮತ್ತು ಸ್ವಾತಂತ್ರ್ಯ",
        summary: "ಸಹಕಾರ ಸಂಘಗಳು ಸಾಂವಿಧಾನಿಕ ಸ್ವಾಯತ್ತತೆಯೊಂದಿಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ, ಕಾರ್ಪೊರೇಟ್ ಹಿಡಿತದಿಂದ ಮುಕ್ತವಾಗಿವೆ.",
        points: [
          "ಖಾಸಗಿ ಕಂಪನಿಗಳ ಅನಿಯಂತ್ರಿತ ನೀತಿಗಳು ಅಥವಾ ವೇತನ ಕಡಿತದಿಂದ ಕಾನೂನು ರಕ್ಷಣೆ",
          "ಸಹಕಾರ ನಿಬಂಧಕರ ಮೂಲಕ ನ್ಯಾಯಯುತ ವಿವಾದ ಪರಿಹಾರ ಮತ್ತು ನ್ಯಾಯ",
          "ಎಲ್ಲಾ ಸದಸ್ಯರ ಹಕ್ಕುಗಳ ರಕ್ಷಣೆಗಾಗಿ ಉಚಿತ ಕಾನೂನು ನೆರವು"
        ],
        maleDialogue: "ನಾವು ಕಾನೂನಿನ ಅಡಿಯಲ್ಲಿ ನಮ್ಮ ಸಂಘವನ್ನು ನಾವೇ ನಡೆಸುತ್ತೇವೆ. ನಾವು ಯಾರಿಗೂ ಗುಲಾಮರಲ್ಲ.",
        femaleDialogue: "ಸಹಕಾರ ಸ್ವಾಯತ್ತತೆಯು ನಮ್ಮ ಕಾರ್ಮಿಕರನ್ನು ಖಾಸಗಿ ಕಂಪನಿಗಳ ಶೋಷಣೆಯಿಂದ ರಕ್ಷಿಸುತ್ತದೆ.",
        speechNarration: "ತತ್ವ ನಾಲ್ಕು: ಸ್ವಾಯತ್ತತೆ ಮತ್ತು ಸ್ವಾತಂತ್ರ್ಯ. ಸಹಕಾರ ಸಂಘಗಳು ಕಾನೂನುಬದ್ಧ ಸ್ವಾಯತ್ತತೆಯೊಂದಿಗೆ ಸ್ವತಂತ್ರವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "ಶಿಕ್ಷಣ, ತರಬೇತಿ ಮತ್ತು ಕೌಶಲ್ಯ ವಿಕಾಸ",
        summary: "ಉಚಿತ ಎನ್‌ಎಸ್‌ಕ್ಯೂಎಫ್ ಹಂತ-4 ಪ್ರಮಾಣೀಕರಣ, ಸೌರ ಶಕ್ತಿ ಕೋರ್ಸ್‌ಗಳು ಮತ್ತು ಆಧುನಿಕ ಉಪಕರಣ ಅನುದಾನ.",
        points: [
          "ಸರ್ಕಾರದ ಮಾನ್ಯತೆ ಪಡೆದ ಕೌಶಲ್ಯ ತರಬೇತಿಯನ್ನು ಉಚಿತವಾಗಿ ನೀಡುವುದು",
          "ರಾಜ್ಯ ಒಕ್ಕೂಟದಿಂದ ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನ ಉಪಕರಣಗಳ ಖರೀದಿಗೆ ವಿಶೇಷ ಸಬ್ಸಿಡಿ",
          "ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು ಮತ್ತು ಗ್ರಾಹಕರೊಂದಿಗೆ ಗೌರವಯುತ ನಡವಳಿಕೆಯ ತರಬೇತಿ"
        ],
        maleDialogue: "ಸಹಕಾರ ಸಂಘ ನನಗೆ ಸೋಲಾರ್ ಇನ್ವರ್ಟರ್ ತರಬೇತಿ ನೀಡಿತು. ನನ್ನ ದಿನದ ಗಳಿಕೆ ಎರಡರಷ್ಟಾಗಿದೆ!",
        femaleDialogue: "ಕೌಶಲ್ಯ ತರಬೇತಿಯು ಅಸಂಘಟಿತ ಕಾರ್ಮಿಕರನ್ನು ಪ್ರಮಾಣೀಕೃತ ತಂತ್ರಜ್ಞರನ್ನಾಗಿ ಮಾಡುತ್ತದೆ.",
        speechNarration: "ತತ್ವ ಐದು: ಶಿಕ್ಷಣ ಮತ್ತು ಕೌಶಲ್ಯ ವಿಕಾಸ. ಉಚಿತ ತರಬೇತಿ ಮತ್ತು ಉಪಕರಣ ಅನುದಾನಗಳು ಕಾರ್ಮಿಕರ ಗೌರವವನ್ನು ಹೆಚ್ಚಿಸುತ್ತವೆ.",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "ಸಮುದಾಯದ ಕಾಳಜಿ ಮತ್ತು ಸಾಮಾಜಿಕ ಭದ್ರತೆ",
        summary: "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ₹5 ಲಕ್ಷ ಉಚಿತ ಆರೋಗ್ಯ ರಕ್ಷಣೆ, ಅಪಘಾತ ವಿಮೆ, ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಪಿಂಚಣಿ.",
        points: [
          "ಪಿಎಂ-ಜೆಎವೈ ಅಡಿಯಲ್ಲಿ ಕುಟುಂಬಕ್ಕೆ ₹5,00,000 ನಗದು ರಹಿತ ಆಸ್ಪತ್ರೆ ವಿಮೆ",
          "ಅಪಘಾತ ವಿಮೆ ಮತ್ತು ಹೆಣ್ಣು ಮಕ್ಕಳ ಉನ್ನತ ಶಿಕ್ಷಣಕ್ಕೆ ಸಹಕಾರ ವಿದ್ಯಾರ್ಥಿವೇತನ",
          "10% ಕಲ್ಯಾಣ ನಿಧಿಯಿಂದ ಕಾರ್ಮಿಕರ ವೃದ್ಧಾಪ್ಯಕ್ಕೆ ಗೌರವಯುತ ಪಿಂಚಣಿ ವ್ಯವಸ್ಥೆ"
        ],
        maleDialogue: "ನನ್ನ ಮಗಳ ಕಾಲೇಜು ಶುಲ್ಕ ಪಾವತಿಸಲು ಸಹಕಾರ ಸಂಘದ ವಿದ್ಯಾರ್ಥಿವೇತನ ನೆರವಾಯಿತು.",
        femaleDialogue: "ಸಾಮಾಜಿಕ ಭದ್ರತೆಯೊಂದಿಗೆ ಪ್ರತಿಯೊಬ್ಬ ಕಾರ್ಮಿಕ ಕುಟುಂಬವು ಕಷ್ಟಕಾಲದಲ್ಲೂ ನೆಮ್ಮದಿಯಿಂದ ಇರಬಹುದು.",
        speechNarration: "ತತ್ವ ಆರು: ಸಾಮಾಜಿಕ ಭದ್ರತೆ. ಆರೋಗ್ಯ ವಿಮೆ, ಅಪಘಾತ ರಕ್ಷಣೆ ಮತ್ತು ಪಿಂಚಣಿ ಜೀವನದುದ್ದಕ್ಕೂ ಆತ್ಮಗೌರವವನ್ನು ನೀಡುತ್ತದೆ.",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 6. MALAYALAM (മലയാളം)
  ml: {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    motto: "സഹകരണത്തിലൂടെ സമൃദ്ധി",
    mottoSub: "0% ഇടനില കമ്മീഷൻ • 100% നേരിട്ട് ബാങ്കിലേക്ക് ന്യായവേതനം • ജനാധിപത്യ തൊഴിലാളി ഉടമസ്ഥത",
    manifestoBadge: "ദേശീയ സഹകരണ നയവും തൊഴിലാളി മാനിഫെസ്റ്റോയും",
    principlesBadge: "ഐസിഎ 6 അന്താരാഷ്ട്ര സഹകരണ തത്വങ്ങൾ",
    duoTitle: "രമേഷ് & സുജാത • ദേശീയ സഹകരണ അംബാസഡർമാർ",
    duoSub: "സർട്ടിഫൈഡ് ഫീൽഡ് ടെക്നീഷ്യൻ & ഫെഡറേഷൻ ഡയറക്ടർ",
    enforceBadge: "ജില്ലാ സഹകരണ രജിസ്ട്രാർ വഴി നിയമപരമായി നടപ്പിലാക്കുന്നു",
    compliantBadge: "100% നിയമപരമായ തൊഴിലാളി സുരക്ഷ",
    principles: [
      {
        id: 0,
        number: "01",
        title: "സ്വമേധയാ ഉള്ളതും തുറന്നതുമായ അംഗത്വം",
        summary: "വിവേചനമില്ലാതെ പ്രാവീണ്യമുള്ള ഏതൊരു തൊഴിലാളിക്കും സഹകരണ സംഘത്തിൽ അംഗമാകാം.",
        points: [
          "കാരണമില്ലാതെ ഐഡി ബ്ലോക്ക് ചെയ്യുന്ന രീതി പൂർണ്ണമായും നിരോധിച്ചു",
          "പ്രാദേശിക വാർഡ് ബുക്കിംഗുകളിലും അടിയന്തര സർവീസുകളിലും തുല്യാവസരം",
          "സംസ്ഥാന സഹകരണ നിയമപ്രകാരമുള്ള ഔദ്യോഗിക അംഗീകാരവും ആദരവും"
        ],
        maleDialogue: "രജിസ്ട്രേഷൻ ഫീസില്ലാതെ ഞാൻ അംഗമായി. ഒരു സ്വകാര്യ കമ്പനിക്കും എന്റെ ഉപജീവനം തടയാനാവില്ല!",
        femaleDialogue: "നമ്മുടെ സഹകരണ സംഘത്തിന്റെ വാതിലുകൾ എല്ലാ തൊഴിലാളികൾക്കുമായി തുറന്നിരിക്കുന്നു.",
        speechNarration: "തത്വം ഒന്ന്: തുറന്ന അംഗത്വം. വിവേചനമില്ലാതെ എല്ലാ തൊഴിലാളികൾക്കും തുല്യ അവകാശങ്ങൾ ഉറപ്പാക്കുന്നു.",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "ജനാധിപത്യപരമായ അംഗനിയന്ത്രണം",
        summary: "ഒരു തൊഴിലാളി = ഒരു വോട്ട്. തൊഴിലാളികൾ തന്നെ ഭരണസമിതിയെ തിരഞ്ഞെടുക്കുകയും വേതനം നിശ്ചയിക്കുകയും ചെയ്യുന്നു.",
        points: [
          "വാർഷിക ജനറൽ ബോഡി യോഗത്തിൽ ഭരണസമിതി അംഗങ്ങളുടെ തിരഞ്ഞെടുപ്പ്",
          "അൽഗോരിതങ്ങൾക്ക് പകരം തൊഴിലാളികൾ വോട്ട് ചെയ്ത് നിശ്ചയിക്കുന്ന മിനിമം വേതനം",
          "സഹകരണ സംഘത്തിന്റെ വാർഷിക ലാഭം എല്ലാ അംഗങ്ങൾക്കും തുല്യമായി വിതരണം"
        ],
        maleDialogue: "ഞങ്ങളുടെ മണിക്കൂർ വേതനം ഞങ്ങൾ തന്നെ നിശ്ചയിക്കുന്നു. കോർപ്പറേറ്റ് ചൂഷണത്തിന് ഇവിടെ സ്ഥാനമില്ല!",
        femaleDialogue: "ജനാധിപത്യ ഭരണത്തിലൂടെ തൊഴിലാളികൾ തന്നെയാണ് ഈ സഹകരണ സംഘത്തിന്റെ യഥാർത്ഥ ഉടമകൾ.",
        speechNarration: "തത്വം രണ്ട്: ജനാധിപത്യ നിയന്ത്രണം. ഒരു തൊഴിലാളിക്ക് ഒരു വോട്ട്. വേതനവും നയങ്ങളും തൊഴിലാളികൾ തീരുമാനിക്കുന്നു.",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "നേരിട്ടുള്ള സാമ്പത്തിക പങ്കാളിത്തം",
        summary: "0% ഇടനില കമ്മീഷൻ. ഉപഭോക്താവ് നൽകുന്ന മുഴുവൻ തുകയും തൊഴിലാളിയുടെ അക്കൗണ്ടിൽ നേരിട്ടെത്തുന്നു.",
        points: [
          "ജോലി കഴിഞ്ഞാലുടൻ ഡിബിടി വഴി ബാങ്ക് പാസ്ബുക്കിൽ തുക നേരിട്ടെത്തുന്നു",
          "മറഞ്ഞിരിക്കുന്ന കമ്മീഷനുകളോ അന്യായമായ കിഴിവുകളോ ഇല്ല",
          "വാർഷിക അധിക ലാഭത്തിൽ നിന്ന് തൊഴിലാളികൾക്ക് ബോണസ് വിതരണം"
        ],
        maleDialogue: "ഉപഭോക്താവ് ₹500 തരുമ്പോൾ മുഴുവൻ ₹500-ഉം എന്റെ ബാങ്ക് അക്കൗണ്ടിൽ വരും. ഒരു രൂപ പോലും കമ്മീഷനില്ല!",
        femaleDialogue: "നേരിട്ടുള്ള സമ്പാദ്യം തൊഴിലാളി കുടുംബങ്ങൾക്ക് യഥാർത്ഥ സാമ്പത്തിക സ്വാതന്ത്ര്യം നൽകുന്നു.",
        speechNarration: "തത്വം മൂന്ന്: നേരിട്ടുള്ള സാമ്പത്തിക പങ്കാളിത്തം. പൂജ്യം ശതമാനം കമ്മീഷൻ. അധ്വാനിക്കുന്ന ഓരോ രൂപയും തൊഴിലാളിക്ക് ലഭിക്കുന്നു.",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "സ്വയംഭരണവും സ്വാതന്ത്ര്യവും",
        summary: "സഹകരണ സംഘങ്ങൾ ഭരണഘടനാപരമായ സ്വയംഭരണത്തോടെ പ്രവർത്തിക്കുന്നു, കോർപ്പറേറ്റ് നിയന്ത്രണങ്ങളിൽ നിന്ന് മുക്തമാണ്.",
        points: [
          "സ്വകാര്യ കമ്പനികളുടെ അന്യായമായ വേതന വെട്ടിക്കുറക്കലുകളിൽ നിന്ന് നിയമപരമായ സുരക്ഷ",
          "സഹകരണ രജിസ്ട്രാർ വഴി സുതാര്യമായ പരാതി പരിഹാരവും നീതിയും",
          "തൊഴിലാളികളുടെ അവകാശ സംരക്ഷണത്തിന് ഫെഡറേഷൻ സൗജന്യ നിയമസഹായം"
        ],
        maleDialogue: "ഞങ്ങൾ നിയമപ്രകാരം ഞങ്ങളുടെ സംഘം സ്വതന്ത്രമായി നടത്തുന്നു. ഞങ്ങൾ ആരുടെയും അടിമകളല്ല.",
        femaleDialogue: "സഹകരണ സ്വയംഭരണം തൊഴിലാളികളെ ചൂഷണങ്ങളിൽ നിന്ന് സംരക്ഷിക്കുന്നു.",
        speechNarration: "തത്വം നാല്: സ്വയംഭരണവും സ്വാതന്ത്ര്യവും. സഹകരണ സംഘങ്ങൾ നിയമപരമായ സ്വയംഭരണത്തോടെ പ്രവർത്തിക്കുന്നു.",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "വിദ്യാഭ്യാസവും തൊഴിൽ പരിശീലനവും",
        summary: "സൗജന്യ എൻഎസ്ക്യുഎഫ് ലെവൽ-4 സർട്ടിഫിക്കേഷൻ, സൗരോർജ്ജ പരിശീലനം, ആധുനിക ഉപകരണ ഗ്രാന്റുകൾ.",
        points: [
          "സർക്കാർ അംഗീകൃത നൈപുണ്യ പരിശീലനം സൗജന്യമായി നൽകുന്നു",
          "ആധുനിക ഉപകരണങ്ങൾ വാങ്ങുന്നതിന് പ്രത്യേക സബ്‌സിഡി",
          "സുരക്ഷാ മാനദണ്ഡങ്ങളിലും പെരുമാറ്റത്തിലും തുടർച്ചയായ പരിശീലനം"
        ],
        maleDialogue: "സഹകരണ സംഘം എനിക്ക് സോളാർ ഇൻവെർട്ടർ പരിശീലനം നൽകി. എന്റെ പ്രതിദിന വരുമാനം ഇരട്ടിയായി!",
        femaleDialogue: "നൈപുണ്യ വിദ്യാഭ്യാസം തൊഴിലാളികളെ സാങ്കേതിക വിദഗ്ദ്ധരാക്കി മാറ്റുന്നു.",
        speechNarration: "തത്വം അഞ്ച്: വിദ്യാഭ്യാസം, പരിശീലനം. സൗജന്യ പരിശീലനവും ഉപകരണ ഗ്രാന്റുകളും തൊഴിലാളികളുടെ അന്തസ്സ് വർദ്ധിപ്പിക്കുന്നു.",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "സാമൂഹിക സുരക്ഷയും സമൂഹക്ഷേമവും",
        summary: "ആയുഷ്മാൻ ഭാരത് ₹5 ലക്ഷം ചികിത്സാ സുരക്ഷ, അപകട ഇൻഷുറൻസ്, സ്കോളർഷിപ്പ്, പെൻഷൻ.",
        points: [
          "പിഎം-ജെഎവൈ വഴി കുടുംബത്തിന് ₹5,00,000 രൂപയുടെ സൗജന്യ ആശുപത്രി ഇൻഷുറൻസ്",
          "അപകട ഇൻഷുറൻസും കുട്ടികളുടെ ഉന്നത വിദ്യാഭ്യാസത്തിന് സ്കോളർഷിപ്പും",
          "10% ക്ഷേമനിധിയിലൂടെ തൊഴിലാളികൾക്ക് മാന്യമായ പെൻഷൻ സംവിധാനം"
        ],
        maleDialogue: "എന്റെ മകളുടെ കോളേജ് ഫീസ് അടയ്ക്കാൻ സഹകരണ സ്കോളർഷിപ്പ് വലിയ സഹായമായി.",
        femaleDialogue: "സാമൂഹിക സുരക്ഷയിലൂടെ ഓരോ തൊഴിലാളി കുടുംബത്തിനും ആത്മവിശ്വാസത്തോടെ ജീവിക്കാം.",
        speechNarration: "തത്വം ആറ്: സാമൂഹിക സുരക്ഷ. സൗജന്യ ആരോഗ്യ ഇൻഷുറൻസും പെൻഷനും ജീവിതകാലം മുഴുവൻ അന്തസ്സ് നൽകുന്നു.",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 7. MARATHI (मराठी)
  mr: {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    motto: "सहकारातून समृद्धी",
    mottoSub: "शून्य टक्के दलाली • १००% थेट किमान मजुरी बँक खात्यात • कामगारांची लोकशाही मालकी",
    manifestoBadge: "राष्ट्रीय सहकार धोरण आणि कामगार जाहीरनामा",
    principlesBadge: "आयसीएची ६ आंतरराष्ट्रीय सहकार तत्त्वे",
    duoTitle: "रमेश आणि सुजाता • राष्ट्रीय सहकार दूत",
    duoSub: "प्रमाणित कुशल कारागीर आणि फेडरेशन संचालक",
    enforceBadge: "जिल्हा सहकारी निबंधकांद्वारे कायदेशीर अंमलबजावणी",
    compliantBadge: "१००% कायदेशीर कामगार संरक्षण",
    principles: [
      {
        id: 0,
        number: "01",
        title: "खुल्या आणि ऐच्छिक सदस्यत्व",
        summary: "कोणत्याही भेदभावाशिवाय प्रत्येक कुशल कारागीर आणि कामगारासाठी सहकारात खुली दारे आहेत.",
        points: [
          "विनाकारण आयडी ब्लॉक करणे किंवा कामावरून काढून टाकण्यावर बंदी",
          "स्थानिक वॉर्ड बुकिंग आणि २४/७ आणीबाणी सेवेत समान संधी",
          "सहकारी संस्था कायद्यांतर्गत अधिकृत ओळख आणि सन्मान"
        ],
        maleDialogue: "कोणत्याही दलाली फीशिवाय मी जोडलो गेलो. कोणतीही खाजगी कंपनी माझी उपजीविका हिरावून घेऊ शकत नाही!",
        femaleDialogue: "आमच्या सहकारी संस्थेचे दरवाजे प्रत्येक प्रामाणिक कामगारासाठी सदैव उघडे आहेत.",
        speechNarration: "तत्त्व एक: खुले सदस्यत्व. भेदभावाशिवाय प्रत्येक कुशल कारागिराला समान अधिकार मिळतात.",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "लोकशाही सदस्य नियंत्रण",
        summary: "एक कामगार = एक मत. कारागीर स्वतः संचालक मंडळ निवडतात आणि किमान मजुरीचे दर ठरवतात.",
        points: [
          "वार्षिक सर्वसाधारण सभेत पारदर्शक पद्धतीने संस्था सचिवांची निवड",
          "खाजगी अल्गोरिदम ऐवजी कामगारांच्या मतदानाने ठरलेले किमान मजुरी दर",
          "वार्षिक नफ्याचे सर्व सदस्यांमध्ये समान बोनस वितरण"
        ],
        maleDialogue: "आम्ही आमचे मजुरी दर स्वतः ठरवतो. खाजगी कंपन्यांची मनमानी येथे चालत नाही!",
        femaleDialogue: "लोकशाही कारभारामुळे कामगारच या व्यासपीठाचे खरे मालक बनले आहेत.",
        speechNarration: "तत्त्व दोन: लोकशाही नियंत्रण. एक कामगार, एक मत. कामगार स्वतः मजुरीचे दर ठरवतात.",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "थेट आर्थिक सहभाग",
        summary: "शून्य टक्के दलाली. ग्राहकाने भरलेली संपूर्ण रक्कम थेट कामगाराच्या बँक खात्यात जमा होते.",
        points: [
          "काम पूर्ण झाल्यावर डीबीटीद्वारे जनधन किंवा बँक खात्यात तत्काळ रक्कम जमा",
          "कोणतीही छुपी कपात किंवा अतिरिक्त कमिशन आकारले जात नाही",
          "वार्षिक लाभांशातून सर्व कारागिरांना नियमित बोनस"
        ],
        maleDialogue: "ग्राहकाने ₹५०० दिले तर पूर्ण ₹५०० माझ्या खात्यात जमा होतात. एक रुपयाही दलाली नाही!",
        femaleDialogue: "थेट बँक खात्यात मिळणाऱ्या मजुरीमुळे कामगार कुटुंबांना खरी आर्थिक स्थिरता मिळाली आहे.",
        speechNarration: "तत्त्व तीन: थेट आर्थिक सहभाग. शून्य टक्के कमिशन. श्रमाचा प्रत्येक रुपया थेट कामगाराला मिळतो.",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "स्वायत्तता आणि स्वातंत्र्य",
        summary: "सहकारी संस्था स्वायत्तपणे कार्य करतात, खाजगी कॉर्पोरेट दबावापासून पूर्णपणे मुक्त आहेत.",
        points: [
          "खाजगी कंपन्यांच्या अन्यायी अटी आणि मजुरी कपातीपासून कायदेशीर संरक्षण",
          "सहकार निबंधकांद्वारे पारदर्शक तक्रार निवारण आणि न्याय",
          "कामगार हक्कांच्या संरक्षणासाठी विनामूल्य कायदेशीर सल्ला"
        ],
        maleDialogue: "आम्ही आमची संस्था कायद्यानुसार स्वाभिमानाने चालवतो. आम्ही कोणाचे गुलाम नाही.",
        femaleDialogue: "सहकारी स्वायत्ततेमुळे आमचे कामगार खाजगी कंपन्यांच्या शोषणापासून सुरक्षित आहेत.",
        speechNarration: "तत्त्व चार: स्वायत्तता आणि स्वातंत्र्य. सहकारी संस्था कायदेशीर स्वातंत्र्याने कार्य करतात.",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "शिक्षण, प्रशिक्षण आणि कौशल्य विकास",
        summary: "मोफत एनएसक्यूएफ स्तर-४ प्रमाणपत्र, सौर ऊर्जा प्रशिक्षण आणि आधुनिक उपकरणांसाठी अनुदान.",
        points: [
          "शासकीय मान्यताप्राप्त कौशल्य प्रशिक्षण विनामूल्य दिले जाते",
          "आधुनिक डिजिटल अवजारे खरेदीसाठी राज्य फेडरेशनकडून विशेष अनुदान",
          "सुरक्षा मानके आणि ग्राहक सेवेवर नियमित कार्यशाळा"
        ],
        maleDialogue: "सहकारी संस्थेने मला सोलरचे काम शिकवले. माझी रोजची कमाई दुप्पट झाली!",
        femaleDialogue: "कौशल्य प्रशिक्षणामुळे असंघटित कामगार आधुनिक तंत्रज्ञ म्हणून पुढे येत आहेत.",
        speechNarration: "तत्त्व पाच: कौशल्य विकास. मोफत प्रशिक्षण आणि आधुनिक अवजारे कामगारांचा सन्मान वाढवतात.",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "सामाजिक सुरक्षा आणि समुदाय कल्याण",
        summary: "आयुष्मान भारत ₹५ लाख आरोग्य कवच, अपघात विमा, शिष्यवृत्ती आणि पेन्शनची सोय.",
        points: [
          "पीएम-जय योजनेअंतर्गत कुटुंबाला ₹५,००,००० पर्यंत कॅशलेस उपचार",
          "अपघात विमा आणि कामगारांच्या मुलांसाठी उच्च शिक्षणाची शिष्यवृत्ती",
          "१०% कल्याण निधीतून कामगारांसाठी सुरक्षित पेन्शनची तरतूद"
        ],
        maleDialogue: "माझ्या मुलीच्या शिक्षणासाठी सहकारी संस्थेच्या शिष्यवृत्तीने मोठा आधार दिला.",
        femaleDialogue: "सामाजिक सुरक्षेमुळे प्रत्येक कामगार कुटुंबाला संकटाच्या वेळी सन्मानाने जगता येते.",
        speechNarration: "तत्त्व सहा: सामाजिक सुरक्षा. मोफत आरोग्य विमा आणि पेन्शन कामगारांना आयुष्यभराचा आधार देते.",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 8. BENGALI (বাংলা)
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    motto: "সমবায়ে সমৃদ্ধি",
    mottoSub: "০% দালাল কমিশন • ১০০% সরাসরি ন্যূনতম মজুরি ব্যাংকে • গণতান্ত্রিক শ্রমজীবী মালিকানা",
    manifestoBadge: "জাতীয় সমবায় নীতি ও শ্রমিক সনদ",
    principlesBadge: "আইসিএ-র ৬টি আন্তর্জাতিক সমবায় নীতি",
    duoTitle: "রমেশ ও সুজাতা • জাতীয় সমবায় দূত",
    duoSub: "প্রত্যয়িত কারিগর ও ফেডারেশন ডিরেক্টর",
    enforceBadge: "জেলা সমবায় নিবন্ধক দ্বারা আইনত বলবৎ",
    compliantBadge: "১০০% বিধিবদ্ধ শ্রমিক সুরক্ষা",
    principles: [
      {
        id: 0,
        number: "01",
        title: "স্বেচ্ছাসেবী ও উন্মুক্ত সদস্যপদ",
        summary: "কোনো সামাজিক বা লিঙ্গ বৈষম্য ছাড়াই প্রতিটি দক্ষ শ্রমিকের জন্য সমবায়ের দরজা উন্মুক্ত।",
        points: [
          "বিনা কারণে আইডি ব্লক বা ছাঁটাই করা সম্পূর্ণ নিষিদ্ধ",
          "স্থানীয় বুকিং ও সার্বক্ষণিক জরুরি সেবায় সমান অধিকার",
          "রাষ্ট্রীয় সমবায় আইনের অধীনে পূর্ণ আইনি স্বীকৃতি ও আত্মমর্যাদা"
        ],
        maleDialogue: "কোনো কমিশন ফি ছাড়াই যুক্ত হয়েছি। কোনো বেসরকারি কোম্পানি আমার রুটি-রুজি কেড়ে নিতে পারবে না!",
        femaleDialogue: "আমাদের সমবায়ের দরজা প্রত্যেক সৎ শ্রমিকের জন্য উন্মুক্ত। আমরা ঐক্যবদ্ধ।",
        speechNarration: "নীতি এক: উন্মুক্ত সদস্যপদ। কোনো বৈষম্য ছাড়াই প্রতিটি দক্ষ কারিগরের সমান অধিকার নিশ্চিত।",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "গণতান্ত্রিক সদস্য নিয়ন্ত্রণ",
        summary: "এক শ্রমিক = এক ভোট। শ্রমিকরাই পরিচালনা পর্ষদ নির্বাচন করেন এবং মজুরির হার ঠিক করেন।",
        points: [
          "বার্ষিক সাধারণ সভায় গণতান্ত্রিকভাবে কর্মকর্তা নির্বাচন",
          "কর্পোরেট অ্যালগরিদমের বদলে শ্রমিকদের ভোটে ন্যূনতম মজুরির হার নির্ধারণ",
          "সমবায়ের বার্ষিক লাভ থেকে সব সদস্যের মধ্যে সমান বোনাস বিতরণ"
        ],
        maleDialogue: "আমরা নিজেরা ভোট দিয়ে মজুরির হার ঠিক করি। এখানে কোনো কর্পোরেট শোষণ নেই!",
        femaleDialogue: "গণতান্ত্রিক ব্যবস্থার মাধ্যমে শ্রমিকরাই এই সমবায় নেটওয়ার্কের প্রকৃত মালিক।",
        speechNarration: "নীতি দুই: গণতান্ত্রিক নিয়ন্ত্রণ। এক শ্রমিক, এক ভোট। শ্রমিকরাই তাদের মজুরি ও নীতিমালা নির্ধারণ করেন।",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "সরাসরি অর্থনৈতিক অংশগ্রহণ",
        summary: "০% দালাল কমিশন। গ্রাহকের দেওয়া সম্পূর্ণ পারিশ্রমিক সরাসরি শ্রমিকের ব্যাংক অ্যাকাউন্টে জমা হয়।",
        points: [
          "কাজ শেষ হওয়ার সাথে সাথে ডিবিটি মারফত জনধন বা ব্যাংকে সরাসরি টাকা",
          "কোনো গোপন কমিশন বা অযৌক্তিক কাটাছেঁড়া নেই",
          "বার্ষিক উদ্বৃত্ত অর্থ থেকে শ্রমিকদের নিয়মিত বোনাস প্রদান"
        ],
        maleDialogue: "গ্রাহক ₹৫০০ দিলে পুরো ₹৫০০ আমার ব্যাংকে ঢোকে। এক পয়সাও দালাল কেটে নেয় না!",
        femaleDialogue: "সরাসরি উপার্জনের টাকা প্রতিটি শ্রমিক পরিবারকে আর্থিক স্বাধীনতা ও মর্যাদা দিয়েছে।",
        speechNarration: "নীতি তিন: সরাসরি অর্থনৈতিক অংশগ্রহণ। শূন্য শতাংশ কমিশন। উপার্জনের প্রতিটি পয়সা সরাসরি শ্রমিকের কাছে পৌঁছায়।",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "স্বায়ত্তশাসন ও স্বাধীনতা",
        summary: "সমবায় সমিতিগুলি সম্পূর্ণ স্বাধীনভাবে কাজ করে, কর্পোরেট চাপের কাছে মাথা নত করে না।",
        points: [
          "বেসরকারি কোম্পানির একতরফা নীতি বা মজুরি হ্রাসের বিরুদ্ধে আইনি সুরক্ষা",
          "সমবায় নিবন্ধকের মাধ্যমে ন্যায্য বিচার ও বিরোধ নিষ্পত্তি",
          "শ্রমিকদের অধিকার রক্ষায় বিনামূল্যে আইনি সহায়তা প্রদান"
        ],
        maleDialogue: "আমরা আইন মেনে নিজেদের সমিতি নিজেরাই চালাই। আমরা কারও দাস নই।",
        femaleDialogue: "সমবায় স্বায়ত্তশাসন আমাদের শ্রমিকদের কর্পোরেট শোষণ থেকে রক্ষা করে।",
        speechNarration: "নীতি চার: স্বায়ত্তশাসন ও স্বাধীনতা। সমবায় সমিতিগুলি আইনি স্বাধীনতার সাথে পরিচালিত হয়।",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "শিক্ষা, প্রশিক্ষণ ও দক্ষতা উন্নয়ন",
        summary: "বিনামূল্যে এনএসকিউএফ লেভেল-৪ সার্টিফিকেট, সোলার টেকনোলজি কোর্স ও আধুনিক যন্ত্রপাতির অনুদান।",
        points: [
          "সরকারি স্বীকৃত দক্ষতা প্রশিক্ষণ কোনো ফি ছাড়াই প্রদান করা হয়",
          "আধুনিক ডিজিটাল যন্ত্রপাতি ক্রয়ের জন্য বিশেষ সরকারি অনুদান",
          "নিরাপত্তা বিধি ও গ্রাহক পরিষেবার উপর ধারাবাহিক কর্মশালা"
        ],
        maleDialogue: "সমবায় আমাকে সোলার প্যানেল ফিটিং শিখিয়েছে। আমার প্রতিদিনের আয় দ্বিগুণ হয়েছে!",
        femaleDialogue: "দক্ষতা শিক্ষা সাধারণ শ্রমিকদের প্রত্যয়িত প্রযুক্তি বিশেষজ্ঞ করে তোলে।",
        speechNarration: "নীতি পাঁচ: শিক্ষা ও প্রশিক্ষণ। বিনামূল্যে প্রশিক্ষণ এবং আধুনিক যন্ত্রপাতি শ্রমিকদের মর্যাদা বাড়ায়।",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "সামাজিক নিরাপত্তা ও জনকল্যাণ",
        summary: "আয়ুষ্মান ভারত ₹৫ লক্ষ টাকার স্বাস্থ্য বিমা, দুর্ঘটনা বিমা, স্কলারশিপ ও পেনশনের নিশ্চয়তা।",
        points: [
          "পিএম-জেএওয়াই আওতায় পরিবারের জন্য ₹৫,০০,০০০ টাকার ক্যাশলেস চিকিৎসা",
          "দুর্ঘটনা বিমা ও শ্রমিক সন্তানদের উচ্চশিক্ষার জন্য বিশেষ বৃত্তি",
          "১০% কল্যাণ তহবিল থেকে শ্রমিকদের আজীবন পেনশনের ব্যবস্থা"
        ],
        maleDialogue: "আমার মেয়ের কলেজের ফি দিতে সমবায়ের দেওয়া স্কলারশিপ বিরাট সাহায্য করেছে।",
        femaleDialogue: "সামাজিক নিরাপত্তা প্রতিটি শ্রমিক পরিবারকে কঠিন সময়েও সম্মানের সাথে বাঁচতে শেখায়।",
        speechNarration: "নীতি ছয়: সামাজিক নিরাপত্তা। বিনামূল্যে স্বাস্থ্য বিমা এবং পেনশন আজীবন আত্মমর্যাদা দেয়।",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 9. GUJARATI (ગુજરાતી)
  gu: {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    motto: "સહકારથી સમૃદ્ધિ",
    mottoSub: "૦% વચેટિયા કમિશન • ૧૦૦% સીધી લઘુત્તમ મજૂરી બેંકમાં • શ્રમિકોની લોકશાહી માલિકી",
    manifestoBadge: "રાષ્ટ્રીય સહકારી નીતિ અને શ્રમિક ઘોષણાપત્ર",
    principlesBadge: "આઈસીએના ૬ આંતરરાષ્ટ્રીય સહકારી સિદ્ધાંતો",
    duoTitle: "રમેશ અને સુજાતા • રાષ્ટ્રીય સહકારી રાજદૂત",
    duoSub: "પ્રમાણિત ક્ષેત્ર કારીગર અને ફેડરેશન ડિરેક્ટર",
    enforceBadge: "જિલ્લા સહકારી રજિસ્ટ્રાર દ્વારા કાયદેસર અમલ",
    compliantBadge: "૧૦૦% કાનૂની શ્રમિક સુરક્ષા",
    principles: [
      {
        id: 0,
        number: "01",
        title: "ખુલ્લું અને સ્વૈચ્છિક સભ્યપદ",
        summary: "કોઈપણ ભેદભાવ વિના દરેક કુશળ કારીગર અને શ્રમિક માટે સહકારી મંડળીના દ્વાર ખુલ્લા છે.",
        points: [
          "કારણ વગર આઈડી બ્લોક કે બરતરફ કરવા પર સંપૂર્ણ પ્રતિબંધ",
          "સ્થાનિક વોર્ડ બુકિંગ અને કટોકટી સેવામાં સમાન તક",
          "રાજ્ય સહકારી કાયદા હેઠળ અધિકૃત માન્યતા અને સન્માન"
        ],
        maleDialogue: "કોઈપણ કમિશન વિના હું જોડાયો. કોઈ ખાનગી કંપની મારી આજીવિકા છીનવી શકતી નથી!",
        femaleDialogue: "અમારી સહકારી સંસ્થાના દ્વાર દરેક પ્રામાણિક શ્રમિક માટે હંમેશા ખુલ્લા છે.",
        speechNarration: "સિદ્ધાંત એક: ખુલ્લું સભ્યપદ. ભેદભાવ વિના દરેક કારીગરને સમાન હક મળે છે.",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "લોકશાહી સભ્ય નિયંત્રણ",
        summary: "એક શ્રમિક = એક મત. કારીગરો પોતે સંચાલક મંડળ પસંદ કરે છે અને મજૂરી દર નક્કી કરે છે.",
        points: [
          "વાર્ષિક સામાન્ય સભામાં પારદર્શક રીતે સમિતિના હોદ્દેદારોની ચૂંટણી",
          "ખાનગી અલ્ગોરિધમ વગર શ્રમિકો દ્વારા મતદાનથી લઘુત્તમ મજૂરી દર નક્કી",
          "વાર્ષિક નફામાંથી તમામ સભ્યોને સમાન બોનસની વહેંચણી"
        ],
        maleDialogue: "અમે જાતે મતદાન કરીને અમારો મજૂરી દર નક્કી કરીએ છીએ. અહીં કોઈ શોષણ નથી!",
        femaleDialogue: "લોકશાહી વહીવટને કારણે શ્રમિકો જ આ પ્લેટફોર્મના સાચા માલિક છે.",
        speechNarration: "સિદ્ધાંત બે: લોકશાહી નિયંત્રણ. એક શ્રમિક, એક મત. શ્રમિકો પોતે જ મજૂરીના દર નક્કી કરે છે.",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "સીધી આર્થિક ભાગીદારી",
        summary: "૦% વચેટિયા કમિશન. ગ્રાહક દ્વારા ચૂકવવામાં આવતી પૂરી રકમ સીધી બેંક ખાતામાં જમા થાય છે.",
        points: [
          "કામ પૂર્ણ થતાં જ ડીબીટી દ્વારા જનધન અથવા બેંક ખાતામાં સીધા નાણાં",
          "કોઈ છુપી ફી કે અયોગ્ય કપાત કરવામાં આવતી નથી",
          "વાર્ષિક નફામાંથી તમામ શ્રમિકોને બોનસ આપવામાં આવે છે"
        ],
        maleDialogue: "ગ્રાહક ₹૫૦૦ આપે ત્યારે પૂરા ₹૫૦૦ મારા ખાતામાં જમા થાય છે. એક રૂપિયો પણ કમિશન કપાતો નથી!",
        femaleDialogue: "સીધી બેંક કમાણીથી શ્રમિક પરિવારોને સાચી આર્થિક સ્વતંત્રતા મળી છે.",
        speechNarration: "સિદ્ધાંત ત્રણ: સીધી આર્થિક ભાગીદારી. શૂન્ય ટકા કમિશન. કમાયેલો પૂરો રૂપિયો કારીગરના હાથમાં પહોંચે છે.",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "સ્વાયત્તતા અને સ્વતંત્રતા",
        summary: "સહકારી મંડળીઓ બંધારણીય સ્વાયત્તતાથી કાર્ય કરે છે, ખાનગી કંપનીઓના દબાણથી મુક્ત છે.",
        points: [
          "ખાનગી કંપનીઓની મનમાની અને મજૂરી કાપ સામે સંપૂર્ણ કાયદાકીય રક્ષણ",
          "સહકારી રજિસ્ટ્રાર દ્વારા પારદર્શક ન્યાય અને ફરિયાદ નિવારણ",
          "શ્રમિક અધિકારોના રક્ષણ માટે મફત કાનૂની સહાય ઉપલબ્ધ"
        ],
        maleDialogue: "અમે કાયદા મુજબ અમારી મંડળી પોતે ચલાવીએ છીએ. અમે કોઈના ગુલામ નથી.",
        femaleDialogue: "સહકારી સ્વાયત્તતા અમારા શ્રમિકોને ખાનગી શોષણથી બચાવે છે.",
        speechNarration: "સિદ્ધાંત ચાર: સ્વાયત્તતા અને સ્વતંત્રતા. સહકારી સંસ્થાઓ કાયદેસર સ્વતંત્રતાથી કામ કરે છે.",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "શિક્ષણ, તાલીમ અને કૌશલ્ય વિકાસ",
        summary: "મફત એનએસક્યુએફ સ્તર-૪ સર્ટિફિકેશન, સોલાર ટ્રેનિંગ અને આધુનિક ટૂલકિટ સહાય.",
        points: [
          "સરકારી માન્યતા પ્રાપ્ત તાલીમ વિનામૂલ્યે આપવામાં આવે છે",
          "રાજ્ય ફેડરેશન દ્વારા આધુનિક ડિજિટલ સાધનો ખરીદવા માટે ખાસ ગ્રાન્ટ",
          "સલામતી અને ગ્રાહક સેવા અંગે નિયમિત માર્ગદર્શન"
        ],
        maleDialogue: "સહકારી મંડળીએ મને સોલાર ઇન્વર્ટરનું કામ શીખવ્યું. મારી દૈનિક કમાણી બમણી થઈ ગઈ!",
        femaleDialogue: "કૌશલ્ય તાલીમ સામાન્ય શ્રમિકોને પ્રમાણિત આધુનિક ટેકનિશિયન બનાવે છે.",
        speechNarration: "સિદ્ધાંત પાંચ: શિક્ષણ અને કૌશલ્ય વિકાસ. મફત તાલીમ અને આધુનિક સાધનો કારીગરોનું માન વધારે છે.",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "સામાજિક સુરક્ષા અને સમુદાય કલ્યાણ",
        summary: "આયુષ્માન ભારત ₹૫ લાખ સ્વાસ્થ્ય કવચ, અકસ્માત વીમો, શિષ્યવૃત્તિ અને પેન્શન યોજના.",
        points: [
          "પીએમ-જેએવાય યોજના હેઠળ પરિવાર માટે ₹૫,૦૦,૦૦૦ સુધીની મફત હોસ્પિટલ સારવાર",
          "અકસ્માત વીમો અને કારીગરોના બાળકોના ઉચ્ચ શિક્ષણ માટે વિશેષ સહાય",
          "૧૦% કલ્યાણ ભંડોળમાંથી શ્રમિકો માટે સન્માનજનક પેન્શન વ્યવસ્થા"
        ],
        maleDialogue: "મારી દીકરીની કોલેજ ફી ભરવામાં સહકારી સ્કોલરશીપે ખૂબ મોટી મદદ કરી.",
        femaleDialogue: "સામાજિક સુરક્ષાથી દરેક શ્રમિક પરિવાર મુશ્કેલ સમયમાં પણ સ્વાભિમાનથી જીવે છે.",
        speechNarration: "સિદ્ધાંત છ: સામાજિક સુરક્ષા. મફત આરોગ્ય વીમો અને પેન્શનથી આજીવન સુરક્ષા મળે છે.",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  },

  // 10. PUNJABI (ਪੰਜਾਬੀ)
  pa: {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    motto: "ਸਹਿਕਾਰ ਤੋਂ ਖੁਸ਼ਹਾਲੀ",
    mottoSub: "੦% ਦਲਾਲ ਕਮਿਸ਼ਨ • ੧੦੦% ਸਿੱਧੀ ਘੱਟੋ-ਘੱਟ ਮਜ਼ਦੂਰੀ ਬੈਂਕ ਵਿੱਚ • ਮਜ਼ਦੂਰਾਂ ਦੀ ਲੋਕਤੰਤਰੀ ਮਾਲਕੀ",
    manifestoBadge: "ਰਾਸ਼ਟਰੀ ਸਹਿਕਾਰੀ ਨੀਤੀ ਅਤੇ ਮਜ਼ਦੂਰ ਐਲਾਨਨਾਮਾ",
    principlesBadge: "ਆਈਸੀਏ ਦੇ ੬ ਅੰਤਰਰਾਸ਼ਟਰੀ ਸਹਿਕਾਰੀ ਅਸੂਲ",
    duoTitle: "ਰਮੇਸ਼ ਅਤੇ ਸੁਜਾਤਾ • ਰਾਸ਼ਟਰੀ ਸਹਿਕਾਰੀ ਰਾਜਦੂਤ",
    duoSub: "ਪ੍ਰਮਾਣਿਤ ਕਾਰੀਗਰ ਅਤੇ ਫੈਡਰੇਸ਼ਨ ਡਾਇਰੈਕਟਰ",
    enforceBadge: "ਜ਼ਿਲ੍ਹਾ ਸਹਿਕਾਰੀ ਰਜਿਸਟਰਾਰ ਦੁਆਰਾ ਕਾਨੂੰਨੀ ਤੌਰ 'ਤੇ ਲਾਗੂ",
    compliantBadge: "੧੦੦% ਕਾਨੂੰਨੀ ਮਜ਼ਦੂਰ ਸੁਰੱਖਿਆ",
    principles: [
      {
        id: 0,
        number: "01",
        title: "ਖੁੱਲ੍ਹੀ ਅਤੇ ਸਵੈ-ਇੱਛੁਕ ਮੈਂਬਰਸ਼ਿਪ",
        summary: "ਬਿਨਾਂ ਕਿਸੇ ਭੇਦਭਾਵ ਦੇ ਹਰ ਹੁਨਰਮੰਦ ਮਜ਼ਦੂਰ ਲਈ ਸਹਿਕਾਰੀ ਸਭਾ ਦੇ ਦਰਵਾਜ਼ੇ ਖੁੱਲ੍ਹੇ ਹਨ।",
        points: [
          "ਬਿਨਾਂ ਵਜ੍ਹਾ ਆਈਡੀ ਬੰਦ ਕਰਨ ਜਾਂ ਹਟਾਉਣ 'ਤੇ ਪੂਰੀ ਪਾਬੰਦੀ",
          "ਸਥਾਨਕ ਵਾਰਡ ਬੁਕਿੰਗ ਅਤੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਵਿੱਚ ਬਰਾਬਰ ਮੌਕਾ",
          "ਸਹਿਕਾਰੀ ਕਾਨੂੰਨ ਤਹਿਤ ਸਰਕਾਰੀ ਮਾਨਤਾ ਅਤੇ ਪੂਰਾ ਮਾਣ-ਸਨਮਾਨ"
        ],
        maleDialogue: "ਕਿਸੇ ਦਲਾਲੀ ਫੀਸ ਤੋਂ ਬਿਨਾਂ ਮੈਂ ਜੁੜਿਆ। ਕੋਈ ਨਿੱਜੀ ਕੰਪਨੀ ਮੇਰੀ ਰੋਜ਼ੀ-ਰੋਟੀ ਨਹੀਂ ਖੋਹ ਸਕਦੀ!",
        femaleDialogue: "ਸਾਡੀ ਸਹਿਕਾਰੀ ਸਭਾ ਦੇ ਦਰਵਾਜ਼ੇ ਹਰ ਇਮਾਨਦਾਰ ਕਾਰੀਗਰ ਲਈ ਹਮੇਸ਼ਾ ਖੁੱਲ੍ਹੇ ਹਨ।",
        speechNarration: "ਅਸੂਲ ਇੱਕ: ਖੁੱਲ੍ਹੀ ਮੈਂਬਰਸ਼ਿਪ। ਬਿਨਾਂ ਕਿਸੇ ਭੇਦਭਾਵ ਦੇ ਹਰ ਹੁਨਰਮੰਦ ਕਾਰੀਗਰ ਨੂੰ ਬਰਾਬਰ ਹੱਕ ਮਿਲਦੇ ਹਨ।",
        icon: Users,
        themeColor: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
      },
      {
        id: 1,
        number: "02",
        title: "ਲੋਕਤੰਤਰੀ ਮੈਂਬਰ ਕੰਟਰੋਲ",
        summary: "ਇੱਕ ਮਜ਼ਦੂਰ = ਇੱਕ ਵੋਟ। ਕਾਰੀਗਰ ਖ਼ੁਦ ਪ੍ਰਬੰਧਕ ਚੁਣਦੇ ਹਨ ਅਤੇ ਮਜ਼ਦੂਰੀ ਤੈਅ ਕਰਦੇ ਹਨ।",
        points: [
          "ਸਾਲਾਨਾ ਆਮ ਇਜਲਾਸ ਵਿੱਚ ਲੋਕਤੰਤਰੀ ਤਰੀਕੇ ਨਾਲ ਅਹੁਦੇਦਾਰਾਂ ਦੀ ਚੋਣ",
          "ਨਿੱਜੀ ਅਲਗੋਰਿਦਮ ਦੀ ਥਾਂ ਮਜ਼ਦੂਰਾਂ ਦੀ ਵੋਟ ਨਾਲ ਘੱਟੋ-ਘੱਟ ਮਜ਼ਦੂਰੀ ਨਿਰਧਾਰਨ",
          "ਸਾਲਾਨਾ ਮੁਨਾਫ਼ੇ ਵਿੱਚੋਂ ਸਾਰੇ ਮੈਂਬਰਾਂ ਨੂੰ ਬਰਾਬਰ ਬੋਨਸ ਵੰਡ"
        ],
        maleDialogue: "ਅਸੀਂ ਖ਼ੁਦ ਵੋਟ ਪਾ ਕੇ ਆਪਣੀ ਮਜ਼ਦੂਰੀ ਤੈਅ ਕਰਦੇ ਹਾਂ। ਇੱਥੇ ਕੋਈ ਕਾਰਪੋਰੇਟ ਲੁੱਟ ਨਹੀਂ ਹੈ!",
        femaleDialogue: "ਲੋਕਤੰਤਰੀ ਪ੍ਰਬੰਧ ਸਦਕਾ ਮਜ਼ਦੂਰ ਹੀ ਇਸ ਪਲੇਟਫਾਰਮ ਦੇ ਅਸਲ ਮਾਲਕ ਹਨ।",
        speechNarration: "ਅਸੂਲ ਦੋ: ਲੋਕਤੰਤਰੀ ਕੰਟਰੋਲ। ਇੱਕ ਮਜ਼ਦੂਰ, ਇੱਕ ਵੋਟ। ਮਜ਼ਦੂਰ ਖ਼ੁਦ ਆਪਣੀ ਮਜ਼ਦੂਰੀ ਤੈਅ ਕਰਦੇ ਹਨ।",
        icon: Vote,
        themeColor: "from-amber-500 to-orange-600",
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30"
      },
      {
        id: 2,
        number: "03",
        title: "ਸਿੱਧੀ ਆਰਥਿਕ ਹਿੱਸੇਦਾਰੀ",
        summary: "੦% ਦਲਾਲ ਕਮਿਸ਼ਨ। ਗਾਹਕ ਵੱਲੋਂ ਦਿੱਤੀ ਪੂਰੀ ਮਜ਼ਦੂਰੀ ਸਿੱਧੀ ਮਜ਼ਦੂਰ ਦੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੁੰਦੀ ਹੈ।",
        points: [
          "ਕੰਮ ਪੂਰਾ ਹੁੰਦੇ ਹੀ ਡੀਬੀਟੀ ਰਾਹੀਂ ਜਨਧਨ ਜਾਂ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਸਿੱਧੇ ਪੈਸੇ",
          "ਕੋਈ ਗੁਪਤ ਕਟੌਤੀ ਜਾਂ ਵਾਧੂ ਕਮਿਸ਼ਨ ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ",
          "ਸਾਲਾਨਾ ਵਾਧੂ ਮੁਨਾਫ਼ੇ ਵਿੱਚੋਂ ਸਾਰੇ ਕਾਰੀਗਰਾਂ ਨੂੰ ਬੋਨਸ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ"
        ],
        maleDialogue: "ਜਦੋਂ ਗਾਹਕ ₹੫੦੦ ਦਿੰਦਾ ਹੈ ਤਾਂ ਪੂਰੇ ₹੫੦੦ ਮੇਰੇ ਖਾਤੇ ਵਿੱਚ ਆਉਂਦੇ ਹਨ। ਇੱਕ ਰੁਪਿਆ ਵੀ ਕਮਿਸ਼ਨ ਨਹੀਂ ਕੱਟਿਆ ਜਾਂਦਾ!",
        femaleDialogue: "ਸਿੱਧੀ ਬੈਂਕ ਕਮਾਈ ਨੇ ਮਜ਼ਦੂਰ ਪਰਿਵਾਰਾਂ ਨੂੰ ਅਸਲ ਆਰਥਿਕ ਆਜ਼ਾਦੀ ਦਿੱਤੀ ਹੈ।",
        speechNarration: "ਅਸੂਲ ਤਿੰਨ: ਸਿੱਧੀ ਆਰਥਿਕ ਹਿੱਸੇਦਾਰੀ। ਜ਼ੀਰੋ ਪ੍ਰਤੀਸ਼ਤ ਕਮਿਸ਼ਨ। ਕਮਾਇਆ ਪੂਰਾ ਪੈਸਾ ਸਿੱਧਾ ਕਾਰੀਗਰ ਦੇ ਖਾਤੇ ਵਿੱਚ ਜਾਂਦਾ ਹੈ।",
        icon: Coins,
        themeColor: "from-emerald-500 to-teal-600",
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      },
      {
        id: 3,
        number: "04",
        title: "ਖ਼ੁਦਮੁਖ਼ਤਿਆਰੀ ਅਤੇ ਆਜ਼ਾਦੀ",
        summary: "ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਕਾਨੂੰਨੀ ਆਜ਼ਾਦੀ ਨਾਲ ਕੰਮ ਕਰਦੀਆਂ ਹਨ, ਨਿੱਜੀ ਕੰਪਨੀਆਂ ਦੇ ਦਬਾਅ ਤੋਂ ਮੁਕਤ ਹਨ।",
        points: [
          "ਨਿੱਜੀ ਕੰਪਨੀਆਂ ਦੀ ਮਨਮਾਨੀ ਅਤੇ ਮਜ਼ਦੂਰੀ ਕਟੌਤੀ ਤੋਂ ਪੂਰੀ ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ",
          "ਸਹਿਕਾਰੀ ਰਜਿਸਟਰਾਰ ਰਾਹੀਂ ਪਾਰਦਰਸ਼ੀ ਨਿਆਂ ਅਤੇ ਸਮੱਸਿਆ ਹੱਲ",
          "ਮਜ਼ਦੂਰਾਂ ਦੇ ਹੱਕਾਂ ਦੀ ਰਾਖੀ ਲਈ ਮੁਫ਼ਤ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ ਉਪਲਬਧ"
        ],
        maleDialogue: "ਅਸੀਂ ਕਾਨੂੰਨ ਅਨੁਸਾਰ ਆਪਣੀ ਸਭਾ ਖ਼ੁਦ ਚਲਾਉਂਦੇ ਹਾਂ। ਅਸੀਂ ਕਿਸੇ ਦੇ ਗ਼ੁਲਾਮ ਨਹੀਂ ਹਾਂ।",
        femaleDialogue: "ਸਹਿਕਾਰੀ ਖ਼ੁਦਮੁਖ਼ਤਿਆਰੀ ਸਾਡੇ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਨਿੱਜੀ ਲੁੱਟ ਤੋਂ ਬਚਾਉਂਦੀ ਹੈ।",
        speechNarration: "ਅਸੂਲ ਚਾਰ: ਖ਼ੁਦਮੁਖ਼ਤਿਆਰੀ ਅਤੇ ਆਜ਼ਾਦੀ। ਸਹਿਕਾਰੀ ਸਭਾਵਾਂ ਕਾਨੂੰਨੀ ਆਜ਼ਾਦੀ ਨਾਲ ਕੰਮ ਕਰਦੀਆਂ ਹਨ।",
        icon: Scale,
        themeColor: "from-purple-600 to-indigo-600",
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
      },
      {
        id: 4,
        number: "05",
        title: "ਸਿੱਖਿਆ, ਸਿਖਲਾਈ ਅਤੇ ਹੁਨਰ ਵਿਕਾਸ",
        summary: "ਮੁਫ਼ਤ ਐੱਨਐੱਸਕਿਊਐੱਫ ਲੈਵਲ-੪ ਸਰਟੀਫਿਕੇਸ਼ਨ, ਸੋਲਰ ਟਰੇਨਿੰਗ ਅਤੇ ਆਧੁਨਿਕ ਟੂਲਕਿੱਟ ਗ੍ਰਾਂਟਾਂ।",
        points: [
          "ਸਰਕਾਰੀ ਮਾਨਤਾ ਪ੍ਰਾਪਤ ਹੁਨਰ ਸਿਖਲਾਈ ਬਿਨਾਂ ਕਿਸੇ ਫੀਸ ਦੇ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ",
          "ਆਧੁਨਿਕ ਡਿਜੀਟਲ ਔਜ਼ਾਰ ਖਰੀਦਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਸਰਕਾਰੀ ਸਬਸਿਡੀ",
          "ਸੁਰੱਖਿਆ ਨਿਯਮਾਂ ਅਤੇ ਗਾਹਕ ਸੇਵਾ 'ਤੇ ਲਗਾਤਾਰ ਵਰਕਸ਼ਾਪਾਂ"
        ],
        maleDialogue: "ਸਹਿਕਾਰੀ ਸਭਾ ਨੇ ਮੈਨੂੰ ਸੋਲਰ ਇਨਵਰਟਰ ਦਾ ਕੰਮ ਸਿਖਾਇਆ। ਮੇਰੀ ਦਿਹਾੜੀ ਦੁੱਗਣੀ ਹੋ ਗਈ!",
        femaleDialogue: "ਹੁਨਰ ਸਿੱਖਿਆ ਆਮ ਮਜ਼ਦੂਰਾਂ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਆਧੁਨਿਕ ਤਕਨੀਸ਼ੀਅਨ ਬਣਾਉਂਦੀ ਹੈ।",
        speechNarration: "ਅਸੂਲ ਪੰਜ: ਸਿੱਖਿਆ ਅਤੇ ਹੁਨਰ ਵਿਕਾਸ। ਮੁਫ਼ਤ ਸਿਖਲਾਈ ਅਤੇ ਆਧੁਨਿਕ ਔਜ਼ਾਰ ਕਾਰੀਗਰਾਂ ਦੀ ਇੱਜ਼ਤ ਵਧਾਉਂਦੇ ਹਨ।",
        icon: GraduationCap,
        themeColor: "from-cyan-500 to-blue-600",
        badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
      },
      {
        id: 5,
        number: "06",
        title: "ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਅਤੇ ਲੋਕ ਭਲਾਈ",
        summary: "ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ ₹੫ ਲੱਖ ਸਿਹਤ ਬੀਮਾ, ਹਾਦਸਾ ਬੀਮਾ, ਸਕਾਲਰਸ਼ਿਪ ਅਤੇ ਪੈਨਸ਼ਨ ਦੀ ਗਾਰੰਟੀ।",
        points: [
          "ਪੀਐੱਮ-ਜੇਏਵਾਈ ਤਹਿਤ ਪਰਿਵਾਰ ਲਈ ₹੫,੦੦,੦੦੦ ਤੱਕ ਮੁਫ਼ਤ ਹਸਪਤਾਲ ਇਲਾਜ",
          "ਹਾਦਸਾ ਬੀਮਾ ਅਤੇ ਕਾਰੀਗਰਾਂ ਦੇ ਬੱਚਿਆਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਵਜ਼ੀਫ਼ਾ",
          "੧੦% ਭਲਾਈ ਫੰਡ ਵਿੱਚੋਂ ਮਜ਼ਦੂਰਾਂ ਲਈ ਬੁਢਾਪਾ ਪੈਨਸ਼ਨ ਦਾ ਪ੍ਰਬੰਧ"
        ],
        maleDialogue: "ਮੇਰੀ ਧੀ ਦੀ ਕਾਲਜ ਫੀਸ ਭਰਨ ਲਈ ਸਹਿਕਾਰੀ ਸਕਾਲਰਸ਼ਿਪ ਨੇ ਬਹੁਤ ਵੱਡਾ ਸਹਾਰਾ ਦਿੱਤਾ।",
        femaleDialogue: "ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਨਾਲ ਹਰ ਮਜ਼ਦੂਰ ਪਰਿਵਾਰ ਔਖੇ ਵੇਲੇ ਵੀ ਸਵੈ-ਮਾਣ ਨਾਲ ਜਿਊਂਦਾ ਹੈ।",
        speechNarration: "ਅਸੂਲ ਛੇ: ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ। ਮੁਫ਼ਤ ਸਿਹਤ ਬੀਮਾ ਅਤੇ ਪੈਨਸ਼ਨ ਨਾਲ ਜ਼ਿੰਦਗੀ ਭਰ ਇੱਜ਼ਤ ਮਿਲਦੀ ਹੈ।",
        icon: HeartHandshake,
        themeColor: "from-rose-500 to-pink-600",
        badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30"
      }
    ]
  }
};

export const CooperativeMottoPrinciples: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { language: globalLang, setLanguage: setGlobalLanguage } = useLanguage();

  // Selected language state initialized from global language or fallback to 'en'
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    return COOPERATIVE_LANGUAGES_CONTENT[globalLang] ? globalLang : "en";
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [audioActive, setAudioActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [speakerVoice, setSpeakerVoice] = useState<"both" | "male" | "female">("both");

  const autoSlideTimerRef = useRef<any>(null);

  // Sync with global language context changes
  useEffect(() => {
    if (COOPERATIVE_LANGUAGES_CONTENT[globalLang]) {
      setSelectedLang(globalLang);
    }
  }, [globalLang]);

  // Content object for the selected language
  const content = COOPERATIVE_LANGUAGES_CONTENT[selectedLang] || COOPERATIVE_LANGUAGES_CONTENT.en;
  const activePrinciple = content.principles[activeIdx] || content.principles[0];
  const PrincipleIcon = activePrinciple.icon;

  // Auto-slide effect every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    autoSlideTimerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % content.principles.length);
    }, 6000);

    return () => clearInterval(autoSlideTimerRef.current);
  }, [isAutoPlaying, isHovered, content.principles.length]);

  // Voice narration trigger when activeIdx or selectedLang changes (if audioActive)
  useEffect(() => {
    if (audioActive) {
      const speechText =
        speakerVoice === "male"
          ? `${activePrinciple.title}. ${activePrinciple.maleDialogue}`
          : speakerVoice === "female"
          ? `${activePrinciple.title}. ${activePrinciple.femaleDialogue}`
          : activePrinciple.speechNarration;

      ttsService.stop();
      ttsService.speak(speechText, {
        id: `principle_voice_${selectedLang}_${activeIdx}`,
        language: selectedLang as Language,
        gender: speakerVoice === "male" ? "MALE" : "FEMALE"
      });
    }
  }, [activeIdx, selectedLang, audioActive, speakerVoice]);

  const toggleAudio = (voiceTarget?: "both" | "male" | "female") => {
    if (voiceTarget) setSpeakerVoice(voiceTarget);
    setAudioActive(true);

    const targetPrinciple = content.principles[activeIdx] || content.principles[0];
    const targetVoice = voiceTarget || speakerVoice;
    const speechText =
      targetVoice === "male"
        ? `${targetPrinciple.title}. ${targetPrinciple.maleDialogue}`
        : targetVoice === "female"
        ? `${targetPrinciple.title}. ${targetPrinciple.femaleDialogue}`
        : targetPrinciple.speechNarration;

    ttsService.stop();
    ttsService.speak(speechText, {
      id: `principle_voice_${selectedLang}_${activeIdx}`,
      language: selectedLang as Language,
      gender: targetVoice === "male" ? "MALE" : "FEMALE"
    });
  };

  const stopAudio = () => {
    setAudioActive(false);
    ttsService.stop();
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLang(code);
    setGlobalLanguage(code as Language);
    if (audioActive) {
      const targetContent = COOPERATIVE_LANGUAGES_CONTENT[code] || COOPERATIVE_LANGUAGES_CONTENT.en;
      const targetPrinciple = targetContent.principles[activeIdx] || targetContent.principles[0];
      const targetVoice = speakerVoice;
      const speechText =
        targetVoice === "male"
          ? `${targetPrinciple.title}. ${targetPrinciple.maleDialogue}`
          : targetVoice === "female"
          ? `${targetPrinciple.title}. ${targetPrinciple.femaleDialogue}`
          : targetPrinciple.speechNarration;

      ttsService.stop();
      ttsService.speak(speechText, {
        id: `principle_voice_${code}_${activeIdx}`,
        language: code as Language,
        gender: targetVoice === "male" ? "MALE" : "FEMALE"
      });
    }
  };

  const handleManualSelect = (idx: number) => {
    setActiveIdx(idx);
    if (audioActive) {
      const targetPrinciple = content.principles[idx] || content.principles[0];
      const targetVoice = speakerVoice;
      const speechText =
        targetVoice === "male"
          ? `${targetPrinciple.title}. ${targetPrinciple.maleDialogue}`
          : targetVoice === "female"
          ? `${targetPrinciple.title}. ${targetPrinciple.femaleDialogue}`
          : targetPrinciple.speechNarration;

      ttsService.stop();
      ttsService.speak(speechText, {
        id: `principle_voice_${selectedLang}_${idx}`,
        language: selectedLang as Language,
        gender: targetVoice === "male" ? "MALE" : "FEMALE"
      });
    }
  };

  return (
    <div
      className={`relative bg-gradient-to-b from-slate-900 via-[#0A1224] to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-2xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. 10-LANGUAGE SELECTOR STRIP (SINGLE-LANGUAGE ENFORCEMENT)               */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex items-center justify-between flex-wrap gap-2 pb-5 border-b border-slate-800/90 mb-8">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Display &amp; Speak Language:
          </span>
          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
            {content.nativeName} ({content.name})
          </span>
        </div>

        {/* 10 Language Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1">
          {Object.keys(COOPERATIVE_LANGUAGES_CONTENT).map((code) => {
            const item = COOPERATIVE_LANGUAGES_CONTENT[code];
            const isSelected = selectedLang === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageChange(code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/30 ring-1 ring-amber-300"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 hover:text-white"
                }`}
                title={`Switch display & voice to ${item.name}`}
              >
                <span>{item.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. NATIONAL MOTTO SECTION (RENDERED IN SELECTED LANGUAGE ONLY)            */}
      {/* ========================================================================= */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-wider uppercase shadow-lg shadow-amber-500/10">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{content.manifestoBadge}</span>
        </div>

        {/* Motto Headline in Selected Language ONLY */}
        <div className="space-y-2">
          <motion.h2
            key={`motto-${selectedLang}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
              {content.motto}
            </span>
          </motion.h2>

          <motion.p
            key={`mottosub-${selectedLang}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {content.mottoSub}
          </motion.p>
        </div>

        {/* 3 Pillar Metrics Strip */}
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto pt-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="font-mono text-amber-400 font-bold block text-sm">0%</span>
            <span className="text-slate-400 text-[11px]">Aggregator Cut</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="font-mono text-emerald-400 font-bold block text-sm">100%</span>
            <span className="text-slate-400 text-[11px]">Direct Floor Wage</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80">
            <span className="font-mono text-blue-400 font-bold block text-sm">1 Worker</span>
            <span className="text-slate-400 text-[11px]">1 Democratic Vote</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 6 PRINCIPLES AUTOSLIDER & MALE + FEMALE HUMAN AMBASSADOR DUO           */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Autoslide Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              {content.principlesBadge}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({activeIdx + 1} of {content.principles.length})
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Play/Pause */}
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              {isAutoPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isAutoPlaying ? "Autoslide (6s)" : "Paused"}</span>
            </button>

            {/* Voice Audio Trigger */}
            <button
              type="button"
              onClick={() => (audioActive ? stopAudio() : toggleAudio("both"))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                audioActive
                  ? "bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20 animate-pulse"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {audioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{audioActive ? `Speaking (${content.nativeName})` : `Listen (${content.nativeName})`}</span>
            </button>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleManualSelect((activeIdx > 0 ? activeIdx - 1 : content.principles.length - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                title="Previous Principle"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleManualSelect((activeIdx + 1) % content.principles.length)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                title="Next Principle"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 6 Selector Tabs with Timer Progress Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
          {content.principles.map((item) => {
            const isCurrent = activeIdx === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleManualSelect(item.id)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? "bg-slate-800/90 border-amber-400/80 shadow-lg shadow-amber-400/10 text-white"
                    : "bg-slate-900/50 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                {isCurrent && isAutoPlaying && !isHovered && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6, ease: "linear" }}
                    key={`${selectedLang}_${activeIdx}`}
                  />
                )}
                <div className="text-[10px] font-mono font-bold text-amber-400">P{item.number}</div>
                <div className="text-[11px] font-bold truncate mt-0.5">{item.title.split(" ")[0]}</div>
              </button>
            );
          })}
        </div>

        {/* Main Stage: Principle Card (Left) + Full Human Male & Female Ambassador Duo (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Active Principle Card (7 cols) - SINGLE LANGUAGE ONLY */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedLang}_${activePrinciple.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
                className="bg-slate-900/90 rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden"
              >
                {/* Background Watermark Glow */}
                <div className={`absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br ${activePrinciple.themeColor} opacity-15 rounded-full blur-2xl pointer-events-none`} />

                {/* Principle Number & Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${activePrinciple.badgeBg}`}>
                    PRINCIPLE #{activePrinciple.number} • {content.name.toUpperCase()}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center text-amber-400 shadow-md">
                    <PrincipleIcon className="w-6 h-6" />
                  </div>
                </div>

                {/* Single Language Title */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {activePrinciple.title}
                  </h3>
                </div>

                {/* Summary in Selected Language */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {activePrinciple.summary}
                </p>

                {/* Detailed Checklist in Selected Language */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                  {activePrinciple.points.map((point, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                {/* Statutory Guarantee Badge */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {content.enforceBadge}
                  </span>
                  <span className="font-mono text-amber-400">{content.compliantBadge}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Full Human Male & Female Cooperative Ambassador Duo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Dual Speech Bubble with Male and Female Dialogues in Selected Language */}
            <motion.div
              key={`speech_${selectedLang}_${activeIdx}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 text-white p-4 sm:p-5 rounded-2xl shadow-2xl space-y-3 mb-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="truncate">{content.duoTitle}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {content.nativeName}
                </span>
              </div>

              {/* Male Dialogue Pill */}
              <div
                onClick={() => toggleAudio("male")}
                className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/60 hover:border-blue-500 transition cursor-pointer group"
                title="Click to hear Ramesh speak"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-400 mb-1">
                  <span>👨‍🔧 Ramesh (Certified Field Artisan):</span>
                  <Volume2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xs italic text-slate-200 leading-relaxed">
                  "{activePrinciple.maleDialogue}"
                </p>
              </div>

              {/* Female Dialogue Pill */}
              <div
                onClick={() => toggleAudio("female")}
                className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/60 hover:border-purple-500 transition cursor-pointer group"
                title="Click to hear Sujatha speak"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-purple-400 mb-1">
                  <span>👩‍💼 Sujatha (Federation President):</span>
                  <Volume2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xs italic text-slate-200 leading-relaxed">
                  "{activePrinciple.femaleDialogue}"
                </p>
              </div>

              {/* Speech bubble pointer downward */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r border-b border-slate-700 rotate-45" />
            </motion.div>

            {/* FULL HUMAN MALE & FEMALE AMBASSADOR DUO ANIMATION */}
            <div className="relative w-full max-w-sm h-64 sm:h-72 flex items-center justify-center select-none">
              {/* Background ambient halo */}
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-4 bg-gradient-to-tr from-blue-500/20 via-amber-400/20 to-purple-500/20 rounded-full blur-2xl -z-10"
              />

              {/* DUAL SVG: Full Male & Female Indian Artisans/Leaders Standing Proudly */}
              <motion.svg
                viewBox="0 0 340 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-2xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Unified Soft Floor Shadow */}
                <ellipse cx="170" cy="230" rx="110" ry="10" fill="#020617" fillOpacity="0.5" />

                {/* ======================================================= */}
                {/* CHARACTER 1: MALE ARTISAN LEADER (RAMESH) - LEFT SIDE   */}
                {/* ======================================================= */}
                <g transform="translate(45, 15)">
                  {/* Torso: Electrician/Artisan Blue Work Uniform & Vest */}
                  <path d="M40 140 C40 115, 110 115, 110 140 L115 210 L35 210 Z" fill="#1D4ED8" />
                  
                  {/* Safety High-Vis Orange Collar Vest */}
                  <path d="M50 135 L75 165 L100 135 L75 125 Z" fill="#EA580C" />
                  <path d="M60 148 L75 168 L90 148" stroke="#FFFFFF" strokeWidth="2.5" />

                  {/* Certified UIDAI Chest Smart Badge */}
                  <rect x="52" y="172" width="22" height="15" rx="3" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
                  <rect x="55" y="176" width="7" height="7" fill="#2563EB" />
                  <line x1="65" y1="177" x2="71" y2="177" stroke="#0F172A" strokeWidth="1.5" />
                  <line x1="65" y1="181" x2="70" y2="181" stroke="#0F172A" strokeWidth="1.2" />

                  {/* Left Arm: Holding Insulated Safety Toolbox */}
                  <path d="M40 135 C25 145, 20 170, 32 188" stroke="#1D4ED8" strokeWidth="12" strokeLinecap="round" />
                  {/* Heavy Duty Yellow Toolbox */}
                  <rect x="16" y="180" width="22" height="16" rx="3" fill="#F59E0B" />
                  <path d="M22 180 L22 174 L32 174 L32 180" stroke="#1E293B" strokeWidth="2" fill="none" />
                  <line x1="16" y1="187" x2="38" y2="187" stroke="#1E293B" strokeWidth="1.5" />

                  {/* Right Arm: Welcoming Hand Gesture pointing towards center */}
                  <motion.g
                    animate={{ rotate: [0, -6, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformOrigin: "110px 135px" }}
                  >
                    <path
                      d="M110 135 C125 145, 138 140, 145 128"
                      stroke="#1D4ED8"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <circle cx="145" cy="125" r="6" fill="#FDBA74" />
                  </motion.g>

                  {/* Neck */}
                  <rect x="67" y="105" width="16" height="18" rx="3" fill="#FDBA74" />

                  {/* Head / Face */}
                  <circle cx="75" cy="85" r="26" fill="#FED7AA" />

                  {/* Smart Artisan Haircut with Mustache */}
                  <path d="M49 82 C49 56, 101 56, 101 82 C101 62, 88 52, 75 52 C62 52, 49 62, 49 82 Z" fill="#1C1917" />
                  {/* Trimmed Indian Mustache */}
                  <path d="M67 96 Q75 100, 83 96 Q75 97, 67 96 Z" fill="#292524" />

                  {/* Animated Blinking Eyes */}
                  <motion.ellipse
                    animate={{ scaleY: [1, 1, 0.1, 1] }}
                    transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.88, 0.94, 1] }}
                    cx="67"
                    cy="82"
                    rx="2.5"
                    ry="3"
                    fill="#0F172A"
                  />
                  <motion.ellipse
                    animate={{ scaleY: [1, 1, 0.1, 1] }}
                    transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.88, 0.94, 1] }}
                    cx="83"
                    cy="82"
                    rx="2.5"
                    ry="3"
                    fill="#0F172A"
                  />

                  {/* Talking Mouth Animation (MALE) */}
                  <motion.path
                    d="M69 101 Q75 104, 81 101"
                    animate={
                      audioActive && (speakerVoice === "both" || speakerVoice === "male")
                        ? { scaleY: [1, 2.2, 1] }
                        : { scaleY: 1 }
                    }
                    transition={
                      audioActive && (speakerVoice === "both" || speakerVoice === "male")
                        ? { duration: 0.25, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.2 }
                    }
                    style={{ transformOrigin: "75px 101px" }}
                    stroke="#9A3412"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill={audioActive && (speakerVoice === "both" || speakerVoice === "male") ? "#9A3412" : "none"}
                  />
                </g>

                {/* ======================================================= */}
                {/* CHARACTER 2: FEMALE COOPERATIVE PRESIDENT (SUJATHA) - RIGHT */}
                {/* ======================================================= */}
                <g transform="translate(165, 15)">
                  {/* Torso: Elegant Royal Navy/Teal Cooperative Saree/Blazer */}
                  <path d="M35 140 C35 118, 105 118, 105 140 L110 210 L30 210 Z" fill="#0F766E" />
                  
                  {/* Cooperative Golden Pallu / Sash across chest */}
                  <path d="M38 140 L98 210 L108 210 L48 135 Z" fill="#D97706" />
                  <circle cx="58" cy="148" r="4.5" fill="#FEF3C7" />

                  {/* Inner Crisp White Collar */}
                  <path d="M52 130 L70 150 L88 130 Z" fill="#F8FAFC" />

                  {/* Left Arm: Holding Digital Federation Tablet */}
                  <path d="M35 138 C22 148, 18 170, 30 188" stroke="#0F766E" strokeWidth="11" strokeLinecap="round" />
                  {/* Digital Tablet */}
                  <rect x="15" y="172" width="18" height="26" rx="3" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.2" transform="rotate(8 15 172)" />
                  <line x1="19" y1="180" x2="29" y2="182" stroke="#38BDF8" strokeWidth="1.5" />
                  <line x1="19" y1="186" x2="28" y2="188" stroke="#34D399" strokeWidth="1.5" />

                  {/* Right Arm: Inspiring Presenting Gesture toward the Principle Card */}
                  <motion.g
                    animate={{ rotate: [0, -7, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    style={{ transformOrigin: "105px 138px" }}
                  >
                    <path
                      d="M105 138 C120 148, 134 135, 142 120"
                      stroke="#0F766E"
                      strokeWidth="11"
                      strokeLinecap="round"
                    />
                    <circle cx="142" cy="116" r="6" fill="#FDBA74" />
                  </motion.g>

                  {/* Neck */}
                  <rect x="62" y="105" width="16" height="18" rx="3" fill="#FDBA74" />

                  {/* Head / Face */}
                  <circle cx="70" cy="85" r="26" fill="#FED7AA" />

                  {/* Elegant Hair Bun with Jasmine Garland */}
                  <path d="M44 85 C44 56, 96 56, 96 85 C96 60, 84 50, 70 50 C56 50, 44 60, 44 85 Z" fill="#1C1917" />
                  <circle cx="98" cy="72" r="10" fill="#1C1917" />
                  <circle cx="102" cy="68" r="3" fill="#FEF3C7" />
                  <circle cx="105" cy="73" r="3" fill="#FEF3C7" />

                  {/* Professional Gold Glasses */}
                  <circle cx="62" cy="82" r="6.5" stroke="#D97706" strokeWidth="1.6" fill="none" />
                  <circle cx="78" cy="82" r="6.5" stroke="#D97706" strokeWidth="1.6" fill="none" />
                  <line x1="68.5" y1="82" x2="71.5" y2="82" stroke="#D97706" strokeWidth="1.6" />

                  {/* Red Traditional Bindi */}
                  <circle cx="70" cy="73" r="2" fill="#DC2626" />

                  {/* Animated Blinking Eyes */}
                  <motion.ellipse
                    animate={{ scaleY: [1, 1, 0.1, 1] }}
                    transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.9, 0.95, 1], delay: 0.4 }}
                    cx="62"
                    cy="82"
                    rx="2.5"
                    ry="3"
                    fill="#0F172A"
                  />
                  <motion.ellipse
                    animate={{ scaleY: [1, 1, 0.1, 1] }}
                    transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.9, 0.95, 1], delay: 0.4 }}
                    cx="78"
                    cy="82"
                    rx="2.5"
                    ry="3"
                    fill="#0F172A"
                  />

                  {/* Talking Mouth Animation (FEMALE) */}
                  <motion.path
                    d="M65 98 Q70 103, 75 98"
                    animate={
                      audioActive && (speakerVoice === "both" || speakerVoice === "female")
                        ? { scaleY: [1, 2.2, 1] }
                        : { scaleY: 1 }
                    }
                    transition={
                      audioActive && (speakerVoice === "both" || speakerVoice === "female")
                        ? { duration: 0.25, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.2 }
                    }
                    style={{ transformOrigin: "70px 98px" }}
                    stroke="#9A3412"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill={audioActive && (speakerVoice === "both" || speakerVoice === "female") ? "#9A3412" : "none"}
                  />
                </g>
              </motion.svg>
            </div>

            {/* Dual Ambassador Title Labels */}
            <div className="text-center mt-2 flex items-center justify-center gap-3 text-xs font-bold">
              <span className="text-blue-400 flex items-center gap-1">
                <span>👨‍🔧 Ramesh Kumar</span>
                <span className="text-[10px] text-slate-400 font-mono">(Field Tech)</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-400 flex items-center gap-1">
                <span>👩‍💼 Sujatha Devi</span>
                <span className="text-[10px] text-slate-400 font-mono">(Federation Dir.)</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {content.duoSub}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
