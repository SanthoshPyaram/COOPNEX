import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Check,
  Sparkles,
  MapPin,
  Wrench,
  Home,
  Building2,
  UserCheck,
  CreditCard,
  User
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface StepBanner {
  id: number;
  number: string;
  roadDistance: string;
  eta: string;
  photoUrl: string;
  carPosition?: { xPct: number; yPct: number; angleDeg: number };
  translations: Record<
    string,
    {
      badge: string;
      title: string;
      headline: string;
      description: string;
      bullets: string[];
    }
  >;
}

const STEP_BANNERS: StepBanner[] = [
  {
    id: 0,
    number: "01",
    roadDistance: "KM 0.0",
    eta: "00:00 (Instant)",
    photoUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80",
    carPosition: { xPct: 14, yPct: 8, angleDeg: 35 },
    translations: {
      en: {
        badge: "STEP 1 • CITIZEN DISPATCH REQUEST",
        title: "1-Tap Booking & Nearest Society Matching",
        headline: "Instant Geofenced Allocation within 1.5 KM",
        description:
          "Citizen books service via voice or app. Automated allocation engine locks the closest registered Primary Labour Cooperative Society without algorithmic surge pricing.",
        bullets: [
          "Zero booking markup or surge fee for citizens",
          "Decentralized ward allocation within 1.5 km radius",
          "Voice search supported in 13 Indian regional languages"
        ]
      },
      hi: {
        badge: "चरण 1 • नागरिक सेवा अनुरोध",
        title: "1-टैप बुकिंग और निकटतम समिति मिलान",
        headline: "1.5 किमी के भीतर त्वरित आवंटन",
        description:
          "नागरिक आवाज या ऐप द्वारा सेवा बुक करते हैं। स्वचालित आवंटन प्रणाली बिना किसी सर्ज प्राइसिंग के निकटतम प्राथमिक श्रम सहकारी समिति को काम सौंपती है।",
        bullets: [
          "नागरिकों के लिए शून्य कमीशन या सर्ज शुल्क",
          "1.5 किमी के दायरे में स्थानीय प्राथमिक समिति आवंटन",
          "13 भारतीय क्षेत्रीय भाषाओं में वॉइस बुकिंग उपलब्ध"
        ]
      },
      te: {
        badge: "దశ 1 • పౌరుల సేవా అభ్యర్థన",
        title: "1-ట్యాప్ బుకింగ్ & సమీప సొసైటీ మ్యాచింగ్",
        headline: "1.5 కిమీ పరిధిలో తక్షణ కేటాయింపు",
        description:
          "పౌరులు వాయిస్ లేదా యాప్ ద్వారా సేవను బుక్ చేస్తారు. సర్జ్ ధరలు లేకుండా సమీప ప్రాథమిక కార్మిక సహకార సంఘానికి పని కేటాయించబడుతుంది.",
        bullets: [
          "పౌరులకు సున్నా సర్జ్ ఛార్జీలు లేదా అదనపు రుసుము",
          "స్థానిక ప్రాథమిక సహకార సంఘం నుండి వేగవంతమైన కేటాయింపు",
          "13 భారతీయ భాషలలో వాయిస్ ఆధారిత సదుపాయం"
        ]
      },
      ta: {
        badge: "படி 1 • குடிமக்கள் கோரிக்கை",
        title: "1-தட்டல் முன்பதிவு & சங்க ஒதுக்கீடு",
        headline: "1.5 கி.மீ எல்லைக்குள் உடனடி ஒதுக்கீடு",
        description:
          "குடிமக்கள் குரல் அல்லது செயலி மூலம் பதிவு செய்கிறார்கள். எந்தவித சர்ஜ் கட்டணமும் இன்றி அருகிலுள்ள முதன்மை தொழிலாளர் கூட்டுறவு சங்கத்திற்கு ஒதுக்கப்படுகிறது.",
        bullets: [
          "குடிமக்களுக்கு மறைமுக கட்டணங்கள் இல்லை",
          "1.5 கிமீ சுற்றளவில் உடனடி கூட்டுறவு ஒதுக்கீடு",
          "13 பிராந்திய மொழிகளில் குரல் முன்பதிவு வசதி"
        ]
      },
      mr: {
        badge: "टप्पा १ • नागरिक सेवा मागणी",
        title: "१-टॅप बुकिंग आणि जवळच्या संस्थेशी जोडणी",
        headline: "१.५ किमी अंतरावर त्वरित वाटप",
        description:
          "नागरिक व्हॉईस किंवा अ‍ॅपद्वारे सेवा बुक करतात. कोणतीही दरवाढ न करता स्थानिक प्राथमिक कामगार सहकारी संस्थेला त्वरित ऑर्डर दिली जाते.",
        bullets: [
          "नागरिकांसाठी शून्य जादा शुल्क किंवा सर्ज",
          "१.५ किमी परिघात थेट प्राथमिक सोसायटी वाटप",
          "१३ भारतीय भाषांमध्ये व्हॉइस शोध उपलब्ध"
        ]
      },
      kn: {
        badge: "ಹಂತ ೧ • ನಾಗರಿಕ ಸೇವಾ ವಿನಂತಿ",
        title: "೧-ಟ್ಯಾಪ್ ಬುಕಿಂಗ್ & ಸಮೀಪದ ಸಹಕಾರಿ ನಿಯೋಜನೆ",
        headline: "೧.೫ ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ತ್ವರಿತ ನಿಯೋಜನೆ",
        description:
          "ನಾಗರಿಕರು ಧ್ವನಿ ಅಥವಾ ಆ್ಯಪ್ ಮೂಲಕ ಬುಕ್ ಮಾಡುತ್ತಾರೆ. ಯಾವುದೇ ಸರ್ಜ್ ಶುಲ್ಕವಿಲ್ಲದೆ ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಕಾರ್ಮಿಕ ಸಹಕಾರ ಸಂಘಕ್ಕೆ ನೇರವಾಗಿ ತಲುಪುತ್ತದೆ.",
        bullets: [
          "ಗ್ರಾಹಕರಿಗೆ ಶೂನ್ಯ ಸರ್ಜ್ ಅಥವಾ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕ",
          "ಸ್ಥಳೀಯ ಪ್ರಾಥಮಿಕ ಕಾರ್ಮಿಕ ಸಂಘದಿಂದ ನೇರ ಹಂಚಿಕೆ",
          "೧೩ ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳಲ್ಲಿ ಧ್ವನಿ ಬುಕಿಂಗ್ ಲಭ್ಯ"
        ]
      }
    }
  },
  {
    id: 1,
    number: "02",
    roadDistance: "KM 1.5",
    eta: "+02:00 Mins",
    photoUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&q=80",
    carPosition: { xPct: 76, yPct: 24, angleDeg: 120 },
    translations: {
      en: {
        badge: "STEP 2 • SOCIETY BIOMETRIC & TOOL AUDIT",
        title: "Aadhaar Verhoeff KYC & Tool Bank Checkout",
        headline: "100% Vetted Artisan with NSQF Certified Toolkit",
        description:
          "Local Primary Society steward verifies technician's UIDAI biometric clearance, police verification certificate, and equips standard cooperative diagnostic instruments.",
        bullets: [
          "UIDAI Verhoeff algorithm biometric credentials verified",
          "Government NSQF Level-4 trade skill certified",
          "Active ₹5,00,000 accidental welfare cover activated"
        ]
      },
      hi: {
        badge: "चरण 2 • समिति बायोमेट्रिक और उपकरण जांच",
        title: "आधार वेरहोफ केवाईसी और टूल बैंक चेकआउट",
        headline: "100% सत्यापित कारीगर व प्रमाणित टूलकिट",
        description:
          "स्थानीय प्राथमिक समिति सचिव तकनीशियन के आधार बायोमेट्रिक, पुलिस सत्यापन की पुष्टि करते हैं और सहकारी टूल बैंक से सुरक्षा उपकरण प्रदान करते हैं।",
        bullets: [
          "यूआईडीएआई वेरहोफ एल्गोरिदम से बायोमेट्रिक सत्यापन",
          "सरकारी एनएसक्यूएफ लेवल-4 कौशल प्रमाण पत्र",
          "₹5,00,000 का दुर्घटना बीमा कवर स्वतः सक्रिय"
        ]
      },
      te: {
        badge: "దశ 2 • సొసైటీ బయోమెట్రిక్ & టూల్ ఆడిట్",
        title: "ఆధార్ వెర్హోఫ్ కేవైసీ & టూల్ బ్యాంక్ చెక్",
        headline: "100% ధృవీకరించబడిన కళాకారుడు",
        description:
          "స్థానిక ప్రాథమిక సహకార సంఘ కార్యదర్శి టెక్నీషియన్ ఆధార్ బయోమెట్రిక్, పోలీస్ క్లియరెన్స్ తనిఖీ చేసి ప్రామాణిక టూల్స్ అందజేస్తారు.",
        bullets: [
          "యూఐడీఏఐ ఆధార్ బయోమెట్రిక్ ధృవీకరణ పూర్తి",
          "ప్రభుత్వ ఎన్‌ఎస్‌క్యూఎఫ్ లెవల్-4 స్కిల్ సర్టిఫికేట్",
          "రూ. 5 లక్షల ఉచిత ప్రమాద బీమా రక్షణ"
        ]
      },
      ta: {
        badge: "படி 2 • சங்க பயோமெட்ரிக் & கருவி சரிபார்ப்பு",
        title: "ஆதார் வெர்ஹோஃப் கேஒய்சி & கருவி சோதனை",
        headline: "100% சரிபார்க்கப்பட்ட தொழிலாளி",
        description:
          "தொழிலாளியின் ஆதார் பயோமெட்ரிக், காவல் துறை சான்றிதழ் மற்றும் கூட்டுறவு கருவி வங்கியின் பாதுகாப்பு உபகரணங்கள் சரிபார்க்கப்படுகின்றன.",
        bullets: [
          "ஆதார் பயோமெட்ரிக் முழுமையாக சரிபார்க்கப்பட்டது",
          "அரசு என்.எஸ்.க்யூ.எஃப் நிலை-4 சான்றிதழ்",
          "ரூ. 5 லட்சம் விபத்து காப்பீடு நடைமுறை"
        ]
      },
      mr: {
        badge: "टप्पा २ • सोसायटी बायोमेट्रिक आणि टूल तपासणी",
        title: "आधार व्हेरहॉफ केवायसी आणि टूल बँक तपासणी",
        headline: "१००% पडताळणीकृत कारागीर व प्रमाणित साधने",
        description:
          "स्थानिक सोसायटी सचिव कारागिराचे आधार बायोमेट्रिक आणि पोलीस पडताळणी तपासून सहकारी टूल बँकेतून सुरक्षित उपकरणे उपलब्ध करून देतात.",
        bullets: [
          "बायोमेट्रिक आधार पडताळणी पूर्ण",
          "सरकारी एनएसक्यूएफ लेव्हल-४ कौशल्य प्रमाणपत्र",
          "₹५,००,००० चा अपघाती विमा तात्काळ लागू"
        ]
      },
      kn: {
        badge: "ಹಂತ ೨ • ಸೊಸೈಟಿ ಬಯೋಮೆಟ್ರಿಕ್ ಮತ್ತು ಉಪಕರಣ ಪರಿಶೀಲನೆ",
        title: "ಆಧಾರ್ ಪರಿಶೀಲನೆ & ಟೂಲ್ ಬ್ಯಾಂಕ್ ಹಂಚಿಕೆ",
        headline: "೧೦೦% ಪರಿಶೀಲಿಸಿದ ಪ್ರಮಾಣಿತ ಕುಶಲಕರ್ಮಿ",
        description:
          "ಸ್ಥಳೀಯ ಸಹಕಾರ ಸಂಘದ ಕಾರ್ಯದರ್ಶಿಗಳು ಕುಶಲಕರ್ಮಿಯ ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ಹಾಗೂ ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ ಖಚಿತಪಡಿಸಿ ಉಪಕರಣಗಳನ್ನು ನೀಡುತ್ತಾರೆ.",
        bullets: [
          "ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ದೃಢೀಕರಣ ಪೂರ್ಣ",
          "ಸರ್ಕಾರದ ಎನ್‌ಎಸ್‌ಕ್ಯೂಎಫ್ ಹಂತ-೪ ಪ್ರಮಾಣಪತ್ರ",
          "ರೂ. ೫ ಲಕ್ಷ ಉಚಿತ ಅಪಘಾತ ವಿಮಾ ರಕ್ಷಣೆ"
        ]
      }
    }
  },
  {
    id: 2,
    number: "03",
    roadDistance: "KM 3.8",
    eta: "+05:00 Mins",
    photoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
    carPosition: { xPct: 22, yPct: 48, angleDeg: 215 },
    translations: {
      en: {
        badge: "STEP 3 • RAPID THAR 4X4 HIGHWAY DISPATCH",
        title: "Thar Express Transit with Live GPS Telemetry",
        headline: "Average 7-Minute Doorstep SLA Across Urban Corridors",
        description:
          "Artisan departs immediately in the rugged Mahindra Thar 4x4 emergency dispatch unit. Household tracks live GPS road navigation with real-time ETA updates.",
        bullets: [
          "Heavy-duty all-weather emergency dispatch capability",
          "Live GPS coordinates securely shared with household",
          "Direct dispatch communication without middleman call centers"
        ]
      },
      hi: {
        badge: "चरण 3 • तीव्र थार 4x4 राजमार्ग प्रेषण",
        title: "थार एक्सप्रेस ट्रांजिट व लाइव जीपीएस टेलीमेट्री",
        headline: "शहरी गलियारों में 7-मिनट का औसत समय",
        description:
          "कारीगर तुरंत महिंद्रा थार 4x4 आपातकालीन सेवा वाहन से रवाना होते हैं। परिवार वास्तविक समय में जीपीएस द्वारा वाहन की गति और आगमन समय देख सकते हैं।",
        bullets: [
          "हर मौसम में सुरक्षित और त्वरित प्रेषण क्षमता",
          "परिवार के साथ सुरक्षित लाइव जीपीएस ट्रैकिंग लिंक",
          "बिचौलियों के बिना सीधे तकनीशियन से फोन संपर्क"
        ]
      },
      te: {
        badge: "దశ 3 • వేగవంతమైన థార్ 4x4 ఎక్స్‌ప్రెస్ ప్రయాణం",
        title: "లైవ్ జీపీఎస్ ట్రాకింగ్‌తో థార్ ఎక్స్‌ప్రెస్ రవాణా",
        headline: "సగటున 7 నిమిషాల్లో ఇంటి ముంగిటకు",
        description:
          "కళాకారుడు తక్షణమే మహీంద్రా థార్ 4x4 ఎమర్జెన్సీ వాహనంలో బయలుదేరుతారు. వినియోగదారులు రోడ్డుపై కారు కదలికను లైవ్ మ్యాప్‌లో వీక్షించవచ్చు.",
        bullets: [
          "అన్ని వాతావరణాలలో సురక్షితమైన వేగవంతమైన రవాణా",
          "కుటుంబ భద్రత కోసం లైవ్ లొకేషన్ పర్యవేక్షణ",
          "కాల్ సెంటర్ల ప్రమేయం లేకుండా నేరుగా టెక్నీషియన్ సంభాషణ"
        ]
      },
      ta: {
        badge: "படி 3 • தார் 4x4 விரைவுப் போக்குவரத்து",
        title: "நேரலை ஜிபிஎஸ் டிராக்கிங்குடன் தார் பயணம்",
        headline: "சராசரியாக 7 நிமிடங்களில் வீட்டு வாசல் வருகை",
        description:
          "தொழிலாளி உடனடியாக மஹிந்திரா தார் 4x4 அவசர வாகனத்தில் புறப்படுகிறார். வீட்டு உரிமையாளர் வரைபடத்தில் வாகன வருகையைக் கண்காணிக்கலாம்.",
        bullets: [
          "அனைத்து தட்பவெப்ப நிலைகளிலும் பாதுகாப்பான போக்குவரத்து",
          "நேரலை ஜிபிஎஸ் தகவல்கள் குடும்பத்தினருடன் பகிர்வு",
          "இடைத்தரகர் இல்லாமல் நேரடியாக தொழிலாளியுடன் தொடர்பு"
        ]
      },
      mr: {
        badge: "टप्पा ३ • जलद थार ४x४ महामार्ग प्रवास",
        title: "थार एक्सप्रेस प्रवास आणि थेट जीपीएस ट्रॅकिंग",
        headline: "शहरात सरासरी ७ मिनिटांत घरपोच सेवा",
        description:
          "महिंद्रा थार ४x४ द्वारे कारागीर तात्काळ निघतात. ग्राहक थेट नकाशावर वाहनाची हालचाल आणि अचूक आगमन वेळ पाहू शकतात.",
        bullets: [
          "कोणत्याही हवामानात वेगवान व सुरक्षित पोहोच",
          "कुटुंबाच्या सुरक्षेसाठी थेट जीपीएस ट्रॅकिंग सुविधा",
          "मध्यस्थांशिवाय थेट कारागिराशी संपर्क"
        ]
      },
      kn: {
        badge: "ಹಂತ ೩ • ಕ್ಷಿಪ್ರ ಥಾರ್ ೪x೪ ಹೈವೇ ಪ್ರಯಾಣ",
        title: "ಥಾರ್ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಪ್ರಯಾಣ & ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್",
        headline: "ನಗರ ಪ್ರದೇಶಗಳಲ್ಲಿ ಕೇವಲ ೭ ನಿಮಿಷಗಳ ಸರಾಸರಿ ಸಮಯ",
        description:
          "ಕುಶಲಕರ್ಮಿ ಮಹೀಂದ್ರಾ ಥಾರ್ ೪x೪ ವಾಹನದ ಮೂಲಕ ಹೊರಡುತ್ತಾರೆ. ಕುಟುಂಬಸ್ಥರು ಲೈವ್ ಜಿಪಿಎಸ್ ಮೂಲಕ ವಾಹನದ ಚಲನೆಯನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ಗಮನಿಸಬಹುದು.",
        bullets: [
          "ಎಲ್ಲಾ ಹವಾಮಾನದಲ್ಲೂ ವಿಶ್ವಾಸಾರ್ಹ ಕ್ಷಿಪ್ರ ಸೇವೆ",
          "ಲೈವ್ ಜಿಪಿಎಸ್ ಮೂಲಕ ನಿಖರ ಆಗಮನ ಸಮಯ",
          "ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರ ಸಂವಹನ ವ್ಯವಸ್ಥೆ"
        ]
      }
    }
  },
  {
    id: 3,
    number: "04",
    roadDistance: "KM 6.2",
    eta: "+07:00 Mins",
    photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    carPosition: { xPct: 78, yPct: 72, angleDeg: 300 },
    translations: {
      en: {
        badge: "STEP 4 • DOORSTEP ARRIVAL & OTP HANDSHAKE",
        title: "Photo Credential & 4-Digit Encrypted OTP",
        headline: "Strict Zero-Proxy Double Authentication",
        description:
          "Technician arrives at doorstep in cooperative uniform wearing official QR smart card. Job starts strictly after citizen verifies identity and provides the encrypted 4-digit OTP.",
        bullets: [
          "Physical photo ID badge with verifiable UIDAI QR code",
          "Pre-agreed statutory minimum rate card without hidden addons",
          "Encrypted 4-digit safety OTP protects both citizen and artisan"
        ]
      },
      hi: {
        badge: "चरण 4 • द्वार पर आगमन और ओटीपी हैंडशेक",
        title: "फोटो आईडी और 4-अंकीय सुरक्षित ओटीपी",
        headline: "सख्त पहचान व शून्य-प्रॉक्सी सुरक्षा प्रोटोकॉल",
        description:
          "तकनीशियन सहकारी वर्दी और क्यूआर स्मार्ट कार्ड के साथ द्वार पर पहुंचते हैं। नागरिक द्वारा पहचान जांचने व 4-अंकीय ओटीपी दर्ज करने के बाद ही कार्य शुरू होता है।",
        bullets: [
          "सत्यापन योग्य क्यूआर कोड युक्त आधिकारिक फोटो पहचान पत्र",
          "पूर्व-निर्धारित वैधानिक न्यूनतम मजदूरी दर कार्ड",
          "सुरक्षित 4-अंकीय ओटीपी नागरिक और कारीगर दोनों की रक्षा करता है"
        ]
      },
      te: {
        badge: "దశ 4 • గుమ్మం వద్దకు రాక & ఓటీపీ ధృవీకరణ",
        title: "ఫోటో గుర్తింపు కార్డు & 4-అంకెల ఓటీపీ",
        headline: "సురక్షితమైన డబుల్ ప్రామాణీకరణ",
        description:
          "టెక్నీషియన్ సహకార యూనిఫామ్ మరియు అధికారిక క్యూఆర్ స్మార్ట్ కార్డుతో ఇంటికి చేరుకుంటారు. పౌరుడు 4-అంకెల ఓటీపీ ఎంటర్ చేసిన తర్వాతే పని ప్రారంభమవుతుంది.",
        bullets: [
          "క్యూఆర్ కోడ్‌తో కూడిన అధికారిక ఫోటో గుర్తింపు కార్డు",
          "ముందుగా నిర్ణయించిన ప్రభుత్వ చట్టబద్ధమైన కనీస రేటు కార్డ్",
          "ఎన్‌క్రిప్టెడ్ 4-అంకెల ఓటీపీతో పూర్తి భద్రత"
        ]
      },
      ta: {
        badge: "படி 4 • வீட்டு வாசல் வருகை & ஓடிபி சரிபார்ப்பு",
        title: "புகைப்பட அடையாள அட்டை & 4-இலக்க ஓடிபி",
        headline: "பாதுகாப்பான இரட்டை அங்கீகாரம்",
        description:
          "தொழிலாளி கூட்டுறவு சீருடை மற்றும் அதிகாரப்பூர்வ கியூஆர் ஸ்மார்ட் அட்டையுடன் வருகிறார். 4-இலக்க ஓடிபி சரிபார்த்த பின்னரே பணி தொடங்குகிறது.",
        bullets: [
          "கியூஆர் குறியீட்டுடன் கூடிய புகைப்பட அடையாள அட்டை",
          "மறைமுக கட்டணங்கள் இல்லாத வெளிப்படையான விலைப்பட்டியல்",
          "இரு தரப்பினருக்கும் பாதுகாப்பு அளிக்கும் 4-இலக்க ஓடிபி"
        ]
      },
      mr: {
        badge: "टप्पा ४ • दारात आगमन आणि ओटीपी पडताळणी",
        title: "फोटो ओळखपत्र आणि ४-अंकी सुरक्षित ओटीपी",
        headline: "अचूक ओळख व शून्य-बनावट कामगार सुरक्षा",
        description:
          "तंत्रज्ञ सहकारी गणवेश आणि क्यूआर स्मार्ट कार्डसह दारात पोहोचतात. नागरिकांनी ओळख तपासून ४-अंकी ओटीपी दिल्यावरच काम सुरू होते.",
        bullets: [
          "स्कॅन करता येणारे अधिकृत फोटो ओळखपत्र",
          "शासकीय किमान वेतनावर आधारित पारदर्शक दर",
          "४-अंकी सुरक्षित ओटीपी दोन्ही बाजूंचे संरक्षण करतो"
        ]
      },
      kn: {
        badge: "ಹಂತ ೪ • ಮನೆ ಬಾಗಿಲಿಗೆ ಆಗಮನ & ಒಟಿಪಿ ದೃಢೀಕರಣ",
        title: "ಫೋಟೋ ಗುರುತಿನ ಚೀಟಿ & ೪-ಅಂಕಿಯ ಒಟಿಪಿ",
        headline: "ಸುರಕ್ಷಿತ ದ್ವಿಮುಖ ದೃಢೀಕರಣ ಪ್ರಕ್ರಿಯೆ",
        description:
          "ತಂತ್ರಜ್ಞರು ಸಹಕಾರಿ ಸಮವಸ್ತ್ರ ಮತ್ತು ಕ್ಯೂಆರ್ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್‌ನೊಂದಿಗೆ ಮನೆ ಬಾಗಿಲಿಗೆ ಬರುತ್ತಾರೆ. ೪-ಅಂಕಿಯ ಒಟಿಪಿ ನಮೂದಿಸಿದ ನಂತರವೇ ಕೆಲಸ ಆರಂಭವಾಗುತ್ತದೆ.",
        bullets: [
          "ಕ್ಯೂಆರ್ ಕೋಡ್ ಸಹಿತ ಅಧಿಕೃತ ಫೋಟೋ ಗುರುತಿನ ಚೀಟಿ",
          "ಪಾರದರ್ಶಕ ಪೂರ್ವ-ನಿರ್ಧರಿತ ದರಪಟ್ಟಿ",
          "೪-ಅಂಕಿಯ ಸುರಕ್ಷಿತ ಒಟಿಪಿ ಮೂಲಕ ಸಂಪೂರ್ಣ ಭದ್ರತೆ"
        ]
      }
    }
  },
  {
    id: 4,
    number: "05",
    roadDistance: "KM 7.0",
    eta: "+15:00 Mins",
    photoUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80",
    carPosition: { xPct: 48, yPct: 92, angleDeg: 0 },
    translations: {
      en: {
        badge: "STEP 5 • 0% COMMISSION ESCROW DISBURSAL",
        title: "Direct Bharat UPI & Jan Dhan Instant Payout",
        headline: "100% of Wage Released with Audio Soundbox Confirmation",
        description:
          "Repair inspected and completed with before/after proof. 100% of fair floor wage dispatches instantly into worker's cooperative Jan Dhan account without 28% aggregator deductions.",
        bullets: [
          "0% platform commission cut from artisan's earnings",
          "Instant Bharat UPI Soundbox audio confirmation in local tongue",
          "Citizen receives official GST-compliant cooperative digital invoice"
        ]
      },
      hi: {
        badge: "चरण 5 • 0% कमीशन एस्क्रो भुगतान",
        title: "डायरेक्ट भारत यूपीआई और जन धन त्वरित भुगतान",
        headline: "साउंडबॉक्स ऑडियो पुष्टि के साथ 100% मजदूरी जारी",
        description:
          "कार्य का निरीक्षण और फोटो सत्यापन पूर्ण होने पर, 100% न्यूनतम मजदूरी सीधे कारीगर के जन धन बैंक खाते में बिना किसी 28% कमीशन कटौती के तुरंत स्थानांतरित हो जाती है।",
        bullets: [
          "कारीगर की कमाई में से 0% प्लेटफॉर्म कमीशन",
          "स्थानीय भाषा में भारत यूपीआई साउंडबॉक्स द्वारा त्वरित पुष्टि",
          "नागरिक को आधिकारिक जीएसटी युक्त डिजिटल रसीद"
        ]
      },
      te: {
        badge: "దశ 5 • 0% కమీషన్ ఎస్క్రో విడుదల",
        title: "డైరెక్ట్ భారత్ యూపీఐ & జన్ ధన్ ఖాతా చెల్లింపు",
        headline: "సౌండ్‌బాక్స్ వాయిస్ నిర్ధారణతో 100% వేతనం విడుదల",
        description:
          "పని పూర్తయిన తర్వాత, మధ్యవర్తుల 28% కోతలు లేకుండా 100% కనీస వేతనం నేరుగా కార్మికుడి సహకార జన్ ధన్ బ్యాంక్ ఖాతాకు జమ అవుతుంది.",
        bullets: [
          "కార్మికుడి వేతనం నుండి 0% ప్లాట్‌ఫామ్ కమీషన్",
          "స్థానిక భాషలో భారత్ యూపీఐ సౌండ్‌బాక్స్ వాయిస్ నిర్ధారణ",
          "పౌరులకు అధికారిక డిజిటల్ జీఎస్టీ ఇన్వాయిస్ రసీదు"
        ]
      },
      ta: {
        badge: "படி 5 • 0% கமிஷன் எஸ்க்ரோ விடுவிப்பு",
        title: "நேரடி பாரத் யுபிஐ & ஜன் தன் உடனடி பட்டுவாடா",
        headline: "ஒலிப்பெருக்கி உறுதிப்படுத்தலுடன் 100% ஊதியம்",
        description:
          "பணி நிறைவடைந்தவுடன், தனியார் செயலிகளின் 28% கமிஷன் பிடித்தம் இல்லாமல் 100% நியாயமான ஊதியம் நேரடியாக தொழிலாளியின் வங்கிக் கணக்கிற்கு செல்கிறது.",
        bullets: [
          "தொழிலாளியின் உழைப்பிலிருந்து 0% கமிஷன் பிடித்தம்",
          "தமிழ் மொழியில் பாரத் யுபிஐ சவுண்ட்பாக்ஸ் குரல் உறுதிப்படுத்தல்",
          "குடிமக்களுக்கு அதிகாரப்பூர்వ டிஜிட்டல் ரசீது"
        ]
      },
      mr: {
        badge: "टप्पा ५ • ०% कमिशन एस्क्रो वाटप",
        title: "थेट भारत यूपीआय आणि जन धन बँक खात्यात जमा",
        headline: "साउंडबॉक्स आवाजी पुष्टीसह १००% मजुरी हस्तांतरित",
        description:
          "काम पूर्ण झाल्यावर कोणतेही २८% मध्यस्थ कमिशन न कापता १००% हक्काची मजुरी थेट कामगाराच्या जन धन खात्यात जमा होते.",
        bullets: [
          "कामगाराच्या कमाईतून ०% प्लॅटफॉर्म कमिशन",
          "स्थानिक भाषेत भारत यूपीआय साउंडबॉक्स आवाजी पावती",
          "नागरिकाला अधिकृत जीएसटी डिजिटल पावती"
        ]
      },
      kn: {
        badge: "ಹಂತ ೫ • ೦% ಕಮಿಷನ್ ಎಸ್ಕ್ರೋ ಬಿಡುಗಡೆ",
        title: "ನೇರ ಭಾರತ ಯುಪಿಐ & ಜನ ಧನ್ ಖಾತೆಗೆ ಜಮೆ",
        headline: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಧ್ವನಿ ದೃಢೀಕರಣದೊಂದಿಗೆ ೧೦೦% ವೇತನ ಬಿಡುಗಡೆ",
        description:
          "ಕೆಲಸ ಮುಗಿದ ತಕ್ಷಣ, ಯಾವುದೇ ೨೮% ಮಧ್ಯವರ್ತಿ ಕಡಿತವಿಲ್ಲದೆ ೧೦೦% ಸಂಪೂರ್ಣ ನ್ಯಾಯಯುತ ವೇತನವು ಕಾರ್ಮಿಕರ ಜನ ಧನ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ಜಮೆಯಾಗುತ್ತದೆ.",
        bullets: [
          "ಕುಶಲಕರ್ಮಿಗಳ ಆದಾಯದಿಂದ ೦% ಕಮಿಷನ್",
          "ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ಭಾರತ ಯುಪಿಐ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಧ್ವನಿ ದೃಢೀಕರಣ",
          "ಗ್ರಾಹಕರಿಗೆ ಅಧಿಕೃತ ಜಿಎಸ್‌ಟಿ ಡಿಜಿಟಲ್ ರಶೀದಿ"
        ]
      }
    }
  }
];

// =========================================================================
// DYNAMIC COLOR THEMES ACROSS 5 JOURNEY STAGES
// Smooth theme transitions synchronize with artisan journey progress
// =========================================================================
export interface StageTheme {
  primary: string;
  secondary: string;
  glow: string;
  kerbStart: string;
  kerbEnd: string;
  accentBg: string;
  textBadge: string;
  name: string;
}

const STAGE_THEMES: StageTheme[] = [
  {
    primary: "#0A66C2", // COOP BLUE (Stage 1: Citizen Booking)
    secondary: "#60A5FA",
    glow: "rgba(10, 102, 194, 0.45)",
    kerbStart: "#004182",
    kerbEnd: "#38BDF8",
    accentBg: "bg-blue-50 text-blue-800 border-blue-200",
    textBadge: "text-blue-400",
    name: "Coop Blue • Citizen Request"
  },
  {
    primary: "#D97706", // Warm Gold Accent (Stage 2: Verification & Tool Check)
    secondary: "#FBBF24",
    glow: "rgba(217, 119, 6, 0.45)",
    kerbStart: "#B45309",
    kerbEnd: "#FDE68A",
    accentBg: "bg-amber-50 text-amber-800 border-amber-200",
    textBadge: "text-amber-400",
    name: "Warm Gold • Society Audit"
  },
  {
    primary: "#1D4ED8", // Deep Royal Blue (Stage 3: Transit Dispatch)
    secondary: "#93C5FD",
    glow: "rgba(29, 78, 216, 0.45)",
    kerbStart: "#1E3A8A",
    kerbEnd: "#60A5FA",
    accentBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
    textBadge: "text-indigo-400",
    name: "Royal Blue • Doorstep Transit"
  },
  {
    primary: "#059669", // COOP GREEN (Stage 4: Certified Service)
    secondary: "#34D399",
    glow: "rgba(5, 150, 105, 0.45)",
    kerbStart: "#047857",
    kerbEnd: "#A7F3D0",
    accentBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    textBadge: "text-emerald-400",
    name: "Coop Green • Certified Service"
  },
  {
    primary: "#10B981", // Emerald Nexus (Stage 5: Direct Payout)
    secondary: "#A7F3D0",
    glow: "rgba(16, 185, 129, 0.45)",
    kerbStart: "#059669",
    kerbEnd: "#6EE7B7",
    accentBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    textBadge: "text-emerald-400",
    name: "Emerald Nexus • 0% Direct Escrow"
  }
];

// =========================================================================
// MATHEMATICALLY CONTINUOUS SERPENTINE ROUTE CONFIGURATION
// ViewBox: 0 0 1000 320
// Single Centerline Path is the SOURCE OF TRUTH for:
// - Road base, outer kerb, asphalt surface, and dashed lane markings
// - Exact checkpoint coordinates on the centerline
// - Walking artisan position & tangent orientation
// =========================================================================
const ROUTE_PATH_D = "M 70,100 C 190,100 230,165 340,165 C 470,165 540,110 670,115 C 790,120 840,205 930,205";

// Normalized checkpoint target fractions along route (0.0 to 1.0)
const CHECKPOINT_FRACTIONS = [0.05, 0.26, 0.50, 0.74, 0.95];

// Instant fallback coordinates (calculated analytically from ROUTE_PATH_D)
const PRECALCULATED_CHECKPOINTS = [
  { stage: 1, frac: 0.05, x: 114.6, y: 103.2, angle: 8.5, labelSide: "above", labelY: 38 },
  { stage: 2, frac: 0.26, x: 293.0, y: 160.7, angle: 10.6, labelSide: "below", labelY: 242 },
  { stage: 3, frac: 0.50, x: 504.5, y: 138.2, angle: -14.7, labelSide: "above", labelY: 56 },
  { stage: 4, frac: 0.74, x: 716.0, y: 121.2, angle: 13.1, labelSide: "below", labelY: 228 },
  { stage: 5, frac: 0.95, x: 886.7, y: 198.4, angle: 17.0, labelSide: "above", labelY: 120 }
];

export const TharDoorstepRoadAnimation: React.FC = () => {
  const { language } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  

  const pathRef = useRef<SVGPathElement | null>(null);

  // Walking Artisan live coordinates & tangent angle
  const [artisanPos, setArtisanPos] = useState({
    x: PRECALCULATED_CHECKPOINTS[0].x,
    y: PRECALCULATED_CHECKPOINTS[0].y,
    angle: PRECALCULATED_CHECKPOINTS[0].angle
  });

  // State to drive the leg and arm walking cycle
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkPhase, setWalkPhase] = useState<number>(0);
  const walkPhaseRef = useRef<number>(0);

  // Current continuous progress along path (0.0 to 1.0)
  const currentProgressRef = useRef<number>(CHECKPOINT_FRACTIONS[0]);
  const animationFrameRef = useRef<number | null>(null);

  

  // Helper to query path coordinates and tangent angle directly from SVG path
  const getPointAndAngleOnPath = useCallback((frac: number) => {
    if (!pathRef.current) {
      const idx = CHECKPOINT_FRACTIONS.findIndex(f => f >= frac);
      const safeIdx = idx === -1 ? PRECALCULATED_CHECKPOINTS.length - 1 : idx;
      return PRECALCULATED_CHECKPOINTS[safeIdx];
    }
    const totalLength = pathRef.current.getTotalLength();
    const targetLength = Math.max(0, Math.min(totalLength, frac * totalLength));
    const pt = pathRef.current.getPointAtLength(targetLength);
    const delta = 2.0;
    const pPrev = pathRef.current.getPointAtLength(Math.max(0, targetLength - delta));
    const pNext = pathRef.current.getPointAtLength(Math.min(totalLength, targetLength + delta));
    const angle = Math.atan2(pNext.y - pPrev.y, pNext.x - pPrev.x) * (180 / Math.PI);
    return { x: pt.x, y: pt.y, angle };
  }, []);

  // Smooth cubic ease-in-out interpolation
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Animate walking artisan smoothly to target checkpoint
  const animateToTargetFraction = useCallback((targetFrac: number, durationMs = 1800) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const startFrac = currentProgressRef.current;
    const startTime = performance.now();
    setIsWalking(true);

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = easeInOutCubic(progress);
      const currentFrac = startFrac + (targetFrac - startFrac) * eased;
      currentProgressRef.current = currentFrac;

      // Update walk cycle phase (steady legs oscillating smoothly at constant slow pace)
      walkPhaseRef.current += 0.16;
      setWalkPhase(walkPhaseRef.current);

      const pos = getPointAndAngleOnPath(currentFrac);
      setArtisanPos(pos);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(frame);
      } else {
        currentProgressRef.current = targetFrac;
        setArtisanPos(getPointAndAngleOnPath(targetFrac));
        setIsWalking(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(frame);
  }, [getPointAndAngleOnPath]);

  // Navigate to specific stage
  const goToStage = useCallback((index: number) => {
    const targetIndex = (index + STEP_BANNERS.length) % STEP_BANNERS.length;
    setActiveStepIndex(targetIndex);
    const targetFrac = CHECKPOINT_FRACTIONS[targetIndex];
    animateToTargetFraction(targetFrac);
  }, [animateToTargetFraction]);

  const handlePrev = useCallback(() => {
    goToStage(activeStepIndex - 1);
  }, [activeStepIndex, goToStage]);

  const handleNext = useCallback(() => {
    goToStage(activeStepIndex + 1);
  }, [activeStepIndex, goToStage]);

  // Auto-drive interval loop: Constant gentle slow movement
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      goToStage(activeStepIndex + 1);
    }, 5400); // Constant gentle slow moving pace
    return () => clearInterval(timer);
  }, [isPlaying, activeStepIndex, goToStage]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const activeStep = STEP_BANNERS[activeStepIndex];
  const langKey = activeStep.translations[language] ? language : "en";
  const activeContent = activeStep.translations[langKey] || activeStep.translations.en;
  const currentTheme = STAGE_THEMES[activeStepIndex];

  // Walking limb angles calculated from walkPhase
  const legSwing1 = isWalking ? Math.sin(walkPhase) * 22 : 0;
  const legSwing2 = isWalking ? -Math.sin(walkPhase) * 22 : 0;
  const armSwing1 = isWalking ? -Math.sin(walkPhase) * 20 : 0;
  const armSwing2 = isWalking ? Math.sin(walkPhase) * 20 : 0;
  const bodyBob = isWalking ? Math.abs(Math.sin(walkPhase * 2)) * 1.5 : 0;

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden transition-colors duration-500">
      {/* Top Header & Fleet Dispatch HUD Controls */}
      <div className="p-3.5 sm:p-5 bg-gradient-to-r from-pink-50/50 via-white to-pink-50/50 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs transition-colors duration-500"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-colors duration-500"
                style={{
                  backgroundColor: `${currentTheme.primary}18`,
                  color: currentTheme.primary
                }}
              >
                {currentTheme.name}
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-bold hidden md:inline">
                • VERIFIED ARTISAN ON FOOT
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
              COOPNEX Doorstep Dispatch: 5-Stage Journey
            </h3>
          </div>
        </div>

        {/* Navigation Controls: Back, Auto-Walk, Next (Constant Slow Pace) */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Back Arrow Mark Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
            title="Previous Stage (Back)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Auto-Walk Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white font-bold text-xs shadow-md transition cursor-pointer"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Walk</span>
              </>
            )}
          </button>

          {/* Forward Arrow Mark Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
            title="Next Stage"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.5D GPS ROUTE VISUALIZATION WITH ANIMATED WALKING MAN                     */}
      {/* 100% Mathematically Derived from Single Centerline Path                   */}
      {/* Dynamic Theme Colors Adapt Smoothly at Every Stage                        */}
      {/* ========================================================================= */}
      <div className="relative w-full h-[260px] sm:h-[300px] md:h-[320px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden border-b border-slate-800 select-none">
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        {/* Live GPS Telemetry Floating Pill */}
        <div className="absolute top-3 left-4 z-20 flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-2xl border border-white/15 text-xs font-mono text-white shadow-lg">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: currentTheme.secondary }}
          />
          <span className="font-bold text-[11px]" style={{ color: currentTheme.secondary }}>
            ● LIVE ON FOOT
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300 font-bold text-[11px]">{activeStep.roadDistance}</span>
          <span className="text-slate-500">•</span>
          <span className="text-sky-300 text-[11px]">{activeStep.eta}</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline font-sans text-[11px]">
            Artisan: Ramesh Kumar (Equipped &amp; En Route)
          </span>
        </div>

        {/* Single SVG Source-of-Truth Road Visualizer */}
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 320"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Dynamic Road Ambient Edge Glow matching Stage Theme */}
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor={currentTheme.primary} floodOpacity="0.45" />
            </filter>
            {/* Character Drop Shadow */}
            <filter id="walkerShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            {/* Dynamic Road Kerb Accent Gradient */}
            <linearGradient id="kerbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentTheme.kerbStart} stopOpacity="0.35" />
              <stop offset="50%" stopColor={currentTheme.kerbEnd} stopOpacity="0.55" />
              <stop offset="100%" stopColor={currentTheme.kerbStart} stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* 1. ROAD KERB / OUTER MARGIN (Theme-responsive accent) */}
          <path
            d={ROUTE_PATH_D}
            fill="none"
            stroke="url(#kerbGrad)"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700"
          />

          {/* 2. ROAD BASE GLOW (Theme-responsive ambient glow) */}
          <path
            d={ROUTE_PATH_D}
            fill="none"
            stroke={currentTheme.primary}
            strokeWidth="42"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.30"
            filter="url(#routeGlow)"
            className="transition-all duration-700"
          />

          {/* 3. ASPHALT ROAD SURFACE (Dark navy / charcoal) */}
          <path
            d={ROUTE_PATH_D}
            fill="none"
            stroke="#0f172a"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={ROUTE_PATH_D}
            fill="none"
            stroke="#1e293b"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4. CENTER LANE MARKING (White dashed dividing line) */}
          <path
            d={ROUTE_PATH_D}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="8 10"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* 5. ACTIVE ROUTE FLOW HIGHLIGHT (Traveling dash matching Stage Theme) */}
          <path
            ref={pathRef}
            d={ROUTE_PATH_D}
            fill="none"
            stroke={currentTheme.secondary}
            strokeWidth="3"
            strokeDasharray="18 36"
            strokeLinecap="round"
            opacity="0.85"
            style={{
              animation: "routeFlowDash 2.2s linear infinite"
            }}
            className="transition-colors duration-500"
          />

          {/* CSS Animation Keyframes for Route Flow */}
          <style>{`
            @keyframes routeFlowDash {
              from { stroke-dashoffset: 54; }
              to { stroke-dashoffset: 0; }
            }
          `}</style>

          {/* ===================================================================== */}
          {/* HUMAN / SERVICE CONTEXTUAL MARKERS                                    */}
          {/* ===================================================================== */}
          {/* 1. Citizen Home Node */}
          <g transform="translate(48, 52)" className="cursor-pointer" onClick={() => goToStage(0)}>
            <rect x="-8" y="-8" width="125" height="24" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1" opacity="0.85" />
            <circle cx="4" cy="4" r="6" fill="#0284c7" />
            <text x="15" y="8" fill="#93c5fd" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              🏠 Citizen Booking
            </text>
          </g>

          {/* 2. Primary Labour Cooperative Society Hub */}
          <g transform="translate(375, 48)" className="cursor-pointer" onClick={() => goToStage(1)}>
            <rect x="-8" y="-8" width="145" height="24" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1" opacity="0.85" />
            <circle cx="4" cy="4" r="6" fill="#d97706" />
            <text x="15" y="8" fill="#fcd34d" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              🤝 Society Tool Bank
            </text>
          </g>

          {/* 3. Verified Field Artisan */}
          <g transform="translate(630, 266)" className="cursor-pointer" onClick={() => goToStage(3)}>
            <rect x="-8" y="-8" width="140" height="24" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1" opacity="0.85" />
            <circle cx="4" cy="4" r="6" fill="#059669" />
            <text x="15" y="8" fill="#6ee7b7" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              👷 Verified Service
            </text>
          </g>

          {/* 4. Bharat UPI Jan Dhan Settlement */}
          <g transform="translate(820, 268)" className="cursor-pointer" onClick={() => goToStage(4)}>
            <rect x="-8" y="-8" width="145" height="24" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1" opacity="0.85" />
            <circle cx="4" cy="4" r="6" fill="#6366f1" />
            <text x="15" y="8" fill="#c7d2fe" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
              🏦 0% Direct Escrow
            </text>
          </g>

          {/* ===================================================================== */}
          {/* 5 CHECKPOINTS WITH GROUNDED DISCS & ALTERNATING LABELS                */}
          {/* ===================================================================== */}
          {PRECALCULATED_CHECKPOINTS.map((pt, idx) => {
            const isCurrent = idx === activeStepIndex;
            const isPassed = idx < activeStepIndex;
            const stepTheme = STAGE_THEMES[idx];
            const isAbove = pt.labelSide === "above";

            const connY1 = isAbove ? pt.y - 14 : pt.y + 14;
            const connY2 = isAbove ? pt.labelY + 15 : pt.labelY - 15;

            return (
              <g
                key={pt.stage}
                onClick={() => goToStage(idx)}
                className="cursor-pointer group"
                aria-label={`Checkpoint 0${pt.stage}`}
              >
                {/* Connector Line to Label Platform */}
                <line
                  x1={pt.x}
                  y1={connY1}
                  x2={pt.x}
                  y2={connY2}
                  stroke={isCurrent ? currentTheme.secondary : isPassed ? "#059669" : "#475569"}
                  strokeWidth={isCurrent ? "2" : "1.5"}
                  strokeDasharray="3 3"
                  opacity={isCurrent ? "1" : "0.75"}
                />

                {/* Ground Platform Disc on Road Centerline */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="15"
                  fill="#0f172a"
                  stroke={isCurrent ? currentTheme.secondary : isPassed ? "#059669" : "#334155"}
                  strokeWidth="2"
                  filter="url(#routeGlow)"
                />

                {/* Pulsing Active Radar Ring */}
                {isCurrent && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="22"
                    fill="none"
                    stroke={currentTheme.secondary}
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Primary Marker Disc */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isCurrent ? "12" : "9.5"}
                  fill={isCurrent ? currentTheme.primary : isPassed ? "#059669" : "#334155"}
                  stroke={isCurrent ? currentTheme.secondary : isPassed ? "#34D399" : "#64748b"}
                  strokeWidth={isCurrent ? "2" : "1.5"}
                  className="transition-all duration-300"
                />

                {/* Status Icon / Number */}
                <text
                  x={pt.x}
                  y={pt.y + 3.5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isCurrent ? "9.5" : "7.5"}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {isPassed ? "✓" : `0${pt.stage}`}
                </text>

                {/* Alternating Label Platform Pill */}
                <g transform={`translate(${pt.x}, ${pt.labelY})`}>
                  <rect
                    x="-60"
                    y="-13"
                    width="120"
                    height="26"
                    rx="13"
                    fill={isCurrent ? currentTheme.primary : isPassed ? "#047857" : "#0f172a"}
                    stroke={isCurrent ? currentTheme.secondary : isPassed ? "#059669" : "#334155"}
                    strokeWidth={isCurrent ? "1.5" : "1"}
                    className="transition-all duration-300 shadow-md"
                    opacity={isCurrent ? "0.95" : isPassed ? "0.90" : "0.80"}
                  />

                  {/* Number disc */}
                  <circle
                    cx="-46"
                    cy="0"
                    r="6.5"
                    fill={isCurrent ? currentTheme.secondary : isPassed ? "#34D399" : "#475569"}
                  />
                  <text
                    x="-46"
                    y="2.5"
                    textAnchor="middle"
                    fill={isCurrent ? "#0f172a" : "#ffffff"}
                    fontSize="6.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {isPassed ? "✓" : `0${pt.stage}`}
                  </text>

                  {/* Title */}
                  <text
                    x="-34"
                    y="-1"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {idx === 0
                      ? "01 Booking"
                      : idx === 1
                      ? "02 Verification"
                      : idx === 2
                      ? "03 Dispatch"
                      : idx === 3
                      ? "04 Service"
                      : "05 Direct Pay"}
                  </text>

                  {/* Subtitle */}
                  <text
                    x="-34"
                    y="7.5"
                    fill={isCurrent ? "#fef08a" : isPassed ? "#34D399" : "#94a3b8"}
                    fontSize="6"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {isCurrent ? "● ACTIVE" : isPassed ? "✓ DONE" : "○ UPCOMING"}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ===================================================================== */}
          {/* ANIMATED COOPERATIVE ARTISAN / MAN WALKING ON THE ROAD                */}
          {/* Replaces car with human technician walking smoothly along lane         */}
          {/* Features alternating leg swing, arm swing, safety cap & toolkit       */}
          {/* ===================================================================== */}
          <g
            transform={`translate(${artisanPos.x}, ${artisanPos.y}) rotate(${artisanPos.angle})`}
            className="pointer-events-none select-none"
          >
            {/* Soft Elliptical Ground Foot Shadow */}
            <ellipse
              cx="0"
              cy="10"
              rx="9"
              ry="4"
              fill="#000000"
              opacity="0.45"
              filter="url(#walkerShadow)"
            />

            {/* Dynamic Step Wave Ripple behind feet when walking */}
            {isWalking && (
              <circle
                cx="-8"
                cy="9"
                r="3.5"
                fill="none"
                stroke={currentTheme.secondary}
                strokeWidth="1"
                opacity="0.5"
                className="animate-ping"
              />
            )}

            {/* Walking Character Group (with subtle vertical bobbing motion) */}
            <g transform={`translate(0, ${-bodyBob})`}>
              {/* Back Leg (swings opposite to front leg) */}
              <g transform={`rotate(${legSwing2}, 0, 1)`}>
                <line x1="0" y1="1" x2="-2" y2="10" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                {/* Boot */}
                <rect x="-4" y="9" width="4" height="2.5" rx="1" fill="#78350f" />
              </g>

              {/* Front Leg (swings naturally) */}
              <g transform={`rotate(${legSwing1}, 0, 1)`}>
                <line x1="0" y1="1" x2="2" y2="10" stroke="#0f172a" strokeWidth="3.2" strokeLinecap="round" />
                {/* Boot */}
                <rect x="0" y="9" width="4.5" height="2.5" rx="1" fill="#78350f" />
              </g>

              {/* Torso: Cooperative Uniform with Theme Color & Reflective Strip */}
              <rect
                x="-4.5"
                y="-9"
                width="9"
                height="11"
                rx="2"
                fill={currentTheme.primary}
                stroke="#0f172a"
                strokeWidth="0.8"
                className="transition-colors duration-500"
              />
              {/* High-visibility Reflective Safety Stripe */}
              <line x1="-4.5" y1="-4" x2="4.5" y2="-4" stroke="#fef08a" strokeWidth="1.2" />

              {/* Left Arm (swings opposite) */}
              <g transform={`rotate(${armSwing2}, -3.5, -7)`}>
                <line x1="-3.5" y1="-7" x2="-4" y2="-1" stroke={currentTheme.primary} strokeWidth="2.2" strokeLinecap="round" />
              </g>

              {/* Right Arm holding NSQF Certified Diagnostic Tool Bag */}
              <g transform={`rotate(${armSwing1}, 3.5, -7)`}>
                <line x1="3.5" y1="-7" x2="4" y2="-1" stroke={currentTheme.primary} strokeWidth="2.2" strokeLinecap="round" />
                {/* Toolkit / Bag */}
                <rect x="2" y="-1" width="6" height="4.5" rx="1" fill="#b45309" stroke="#fef08a" strokeWidth="0.6" />
                <line x1="3" y1="-1" x2="7" y2="-1" stroke="#451a03" strokeWidth="0.6" />
              </g>

              {/* Artisan Head */}
              <circle cx="0" cy="-12.5" r="3.8" fill="#fed7aa" stroke="#ea580c" strokeWidth="0.5" />

              {/* Yellow Cooperative Safety Hard Hat pointing forward */}
              <path
                d="M -4,-12.5 Q 0,-17 4,-12.5 L 5.5,-12.5 L 4,-11 L -4,-11 Z"
                fill="#eab308"
                stroke="#ca8a04"
                strokeWidth="0.6"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 5 COMPACT MILESTONE SELECTOR TILES (REDUCED TO FIT SCREEN CLEANLY)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-200 bg-slate-50/75 p-2.5 sm:p-3">
        {STEP_BANNERS.map((step, idx) => {
          const isCurrent = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;
          const currentContent = step.translations[langKey] || step.translations.en;
          const stepTheme = STAGE_THEMES[idx];
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStage(idx)}
              className={`p-2.5 text-left rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[68px] cursor-pointer ${
                isCurrent
                  ? "bg-white shadow-sm -translate-y-0.5 ring-2 ring-blue-500/20"
                  : isPassed
                  ? "bg-white/95 border-slate-200 dark:border-slate-700 hover:border-pink-300 text-slate-700 hover:bg-white"
                  : "bg-white/60 border-slate-200 hover:border-slate-300 text-slate-500 hover:bg-white"
              }`}
              style={isCurrent ? { borderColor: stepTheme.primary } : {}}
            >
              {isCurrent && (
                <div
                  className="absolute top-0 inset-x-0 h-1 transition-colors duration-500"
                  style={{ backgroundColor: stepTheme.primary }}
                />
              )}
              <div className="flex items-center justify-between w-full">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                    isPassed ? "bg-blue-100 text-blue-700" : isCurrent ? "text-white" : "bg-slate-200 text-slate-600"
                  }`}
                  style={isCurrent ? { backgroundColor: stepTheme.primary } : {}}
                >
                  {isPassed ? "✓" : step.number}
                </span>
                <span className="text-[9px] font-mono text-slate-400 font-medium">
                  {step.roadDistance}
                </span>
              </div>
              <div className="mt-0.5">
                <span className="text-[11px] font-bold block leading-tight text-slate-900 truncate">
                  {currentContent.title.split("&")[0]}
                </span>
                <span
                  className="text-[9px] font-mono block truncate font-semibold"
                  style={{ color: isCurrent ? stepTheme.primary : isPassed ? "#059669" : "#64748b" }}
                >
                  {isCurrent ? "● Active Step" : isPassed ? "✓ Done" : step.eta.split(" ")[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* COMPACT ACTIVE STAGE SPOTLIGHT CARD (SCREEN-FITTING PROPORTIONS)          */}
      {/* Features Photo Thumbnail, Concise Bullets, and Back/Forward Buttons       */}
      {/* ========================================================================= */}
      <div className="p-3.5 sm:p-5 bg-gradient-to-b from-slate-50/40 to-white">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left: Compact Photo Thumbnail with Badge */}
            <div className="md:col-span-4 relative h-[140px] sm:h-[160px] rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={activeStep.photoUrl}
                alt={activeContent.title}
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Checkpoint Pill */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-xs"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>STEP {activeStep.number}</span>
                </span>
              </div>

              {/* ETA Pill */}
              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-300 text-[10px] font-mono font-bold">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{activeStep.eta}</span>
                </span>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-[10px] font-mono text-white">
                <span className="bg-black/50 px-1.5 py-0.5 rounded text-emerald-300 font-bold">
                  {activeStep.roadDistance}
                </span>
                <span
                  className="px-1.5 py-0.5 rounded font-black text-[9px] text-white"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  ARTISAN HERE
                </span>
              </div>
            </div>

            {/* Right: Compact Details, Bullets & Dual Navigation Buttons */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-2.5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-colors duration-500"
                    style={{
                      backgroundColor: `${currentTheme.primary}12`,
                      borderColor: `${currentTheme.primary}30`,
                      color: currentTheme.primary
                    }}
                  >
                    {activeContent.headline}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    Stage {activeStep.number} of 05
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-1 leading-snug">
                  {activeContent.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {activeContent.description}
                </p>

                {/* 2 Concise Bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
                  {activeContent.bullets.slice(0, 2).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: currentTheme.primary }}
                      />
                      <span className="line-clamp-1">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[10px] truncate max-w-[200px]">
                  {activeContent.badge}
                </span>

                <div className="flex items-center gap-2">
                  {/* Back Arrow Button */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs text-xs"
                    title="Previous Stage (Back)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                    <span>Back</span>
                  </button>

                  {/* Forward Button */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 text-white cursor-pointer shadow-xs text-xs"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* COMPACT ALL-5-MILESTONES OVERVIEW GRID (FIT COMPLETELY ON SCREEN)    */}
        {/* ===================================================================== */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-2">
          {STEP_BANNERS.map((step, idx) => {
            const isCurrent = idx === activeStepIndex;
            const isPassed = idx < activeStepIndex;
            const content = step.translations[langKey] || step.translations.en;
            const stepTheme = STAGE_THEMES[idx];
            return (
              <div
                key={step.id}
                onClick={() => goToStage(idx)}
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isCurrent
                    ? "bg-white shadow-xs"
                    : isPassed
                    ? "bg-slate-50/80 border-slate-200 hover:bg-white"
                    : "bg-white/60 border-slate-200 hover:bg-white"
                }`}
                style={isCurrent ? { borderColor: stepTheme.primary, borderWidth: "1.5px" } : {}}
              >
                <img
                  src={step.photoUrl}
                  alt={content.title}
                  className="w-9 h-9 rounded-lg object-cover shrink-0"
                />
                <div className="truncate flex-1">
                  <div className="flex items-center gap-1">
                    <span
                      className="text-[9px] font-mono font-bold"
                      style={{ color: isCurrent ? stepTheme.primary : isPassed ? "#059669" : "#64748b" }}
                    >
                      {step.number}.
                    </span>
                    <span className="text-[10px] font-bold text-slate-800 truncate block">
                      {content.title.split("&")[0]}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block">
                    {isCurrent ? "● Active" : isPassed ? "✓ Done" : step.roadDistance}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TharDoorstepRoadAnimation;
