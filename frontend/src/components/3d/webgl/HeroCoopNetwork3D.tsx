import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  Sparkles,
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  CheckCircle2,
  Award,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { ttsService } from "../../../services/tts";
import { Language } from "../../../i18n/languages";

interface TradeArtisan {
  id: string;
  workerName: string;
  society: string;
  location: string;
  rating: number;
  completedJobs: number;
  experience: string;
  hourlyRate: string;
  eta: string;
  photoUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  translations: Record<
    string,
    {
      name: string;
      trade: string;
      badge: string;
      skills: string[];
    }
  >;
}

const ARTISANS: TradeArtisan[] = [
  {
    id: "electrician",
    workerName: "Rajesh Kumar",
    society: "Vijayawada Central Primary Labour Society",
    location: "Vijayawada (520001)",
    rating: 4.96,
    completedJobs: 412,
    experience: "9 Yrs Exp",
    hourlyRate: "₹380/hr",
    eta: "12 Mins",
    photoUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&q=85",
    icon: Zap,
    translations: {
      en: {
        name: "Electrician",
        trade: "Master Electrical Specialist",
        badge: "NSQF Level-4 Certified",
        skills: ["MCB Wiring", "Solar Inverters", "Short-Circuit Fix"]
      },
      hi: {
        name: "इलेक्ट्रीशियन",
        trade: "मास्टर इलेक्ट्रिकल विशेषज्ञ",
        badge: "एनएसक्यूएफ लेवल-4 प्रमाणित",
        skills: ["एमसीबी वायरिंग", "सोलर इन्वर्टर", "शॉर्ट सर्किट मरम्मत"]
      },
      te: {
        name: "ఎలక్ట్రీషియన్",
        trade: "మాస్టర్ ఎలక్ట్రికల్ నిపుణుడు",
        badge: "ఎన్‌ఎస్‌క్యూఎఫ్ లెవల్-4 సర్టిఫైడ్",
        skills: ["ఎంసీబీ వైరింగ్", "సోలార్ ఇన్వర్టర్లు", "షార్ట్ సర్క్యూట్ మరమ్మతు"]
      },
      ta: {
        name: "மின்சார பணியாளர்",
        trade: "தலைமை மின் நிபுணர்",
        badge: "என்.எஸ்.க்யூ.எஃப் நிலை-4 சான்றிதழ்",
        skills: ["எம்சிபி வயரிங்", "சோலார் இன்வெர்ட்டர்", "மின் கசிவு சரிசெய்தல்"]
      },
      mr: {
        name: "इलेक्ट्रिशियन",
        trade: "मास्टर इलेक्ट्रिकल तज्ञ",
        badge: "एनएसक्यूएफ लेव्हल-४ प्रमाणित",
        skills: ["एमसीबी वायरिंग", "सोलर इन्व्हर्टर", "शॉर्ट सर्किट दुरुस्ती"]
      },
      kn: {
        name: "ಎಲೆಕ್ಟ್ರಿಷಿಯನ್",
        trade: "ಮಾಸ್ಟರ್ ಎಲೆಕ್ಟ್ರಿಕಲ್ ತಜ್ಞ",
        badge: "ಎನ್‌ಎಸ್‌ಕ್ಯೂಎಫ್ ಹಂತ-೪ ಪ್ರಮಾಣಿತ",
        skills: ["ಎಂಸಿಬಿ ವೈರಿಂಗ್", "ಸೋಲಾರ್ ಇನ್ವರ್ಟರ್", "ಶಾರ್ಟ್ ಸರ್ಕ್ಯೂಟ್ ದುರಸ್ತಿ"]
      }
    }
  },
  {
    id: "plumber",
    workerName: "Ramesh Kumar",
    society: "Guntur Urban Labour Cooperative Guild",
    location: "Guntur (522002)",
    rating: 4.98,
    completedJobs: 520,
    experience: "11 Yrs Exp",
    hourlyRate: "₹350/hr",
    eta: "9 Mins",
    photoUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1000&q=85",
    icon: Wrench,
    translations: {
      en: {
        name: "Plumber",
        trade: "Senior Hydraulic & Pipe Technician",
        badge: "CPVC & Drainage Master",
        skills: ["Concealed Leaks", "PPR Pipe Welding", "Water Motors"]
      },
      hi: {
        name: "प्लंबर",
        trade: "वरिष्ठ हाइड्रोलिक व पाइप तकनीशियन",
        badge: "सीपीवीसी व ड्रेनेज विशेषज्ञ",
        skills: ["अदृश्य लीकेज जांच", "पीपीआर पाइप वेल्डिंग", "पानी मोटर मरम्मत"]
      },
      te: {
        name: "ప్లంబర్",
        trade: "సీనియర్ హైడ్రాలిక్ & పైప్ టెక్నీషియన్",
        badge: "సిపివిసి & డ్రైనేజీ నిపుణుడు",
        skills: ["లీకేజీ డిటెక్షన్", "పైప్ వెల్డింగ్", "మోటార్ రిపేర్"]
      },
      ta: {
        name: "குழாய் பணியாளர்",
        trade: "முதன்மை பிளம்பிங் நிபுணர்",
        badge: "சிபிவிசி & வடிகால் சான்றிதழ்",
        skills: ["கசிவு கண்டறிதல்", "குழாய் வெல்டிங்", "மோட்டார் பழுது"]
      },
      mr: {
        name: "प्लंबर",
        trade: "वरिष्ठ हायड्रॉलिक आणि पाईप तंत्रज्ञ",
        badge: "ड्रेनेज व पाईप तज्ञ",
        skills: ["गळती तपासणी", "पाईप वेल्डिंग", "मोटर दुरुस्ती"]
      },
      kn: {
        name: "ಪ್ಲಂಬರ್",
        trade: "ಹಿರಿಯ ಪೈಪ್ ಮತ್ತು ವಾಟರ್ ತಂತ್ರಜ್ಞ",
        badge: "ಡ್ರೈನೇಜ್ ಮಾಸ್ಟರ್",
        skills: ["ನೀರಿನ ಸೋರಿಕೆ ಪತ್ತೆ", "ಪೈಪ್ ವೆಲ್ಡಿಂಗ್", "ಮೋಟರ್ ದುರಸ್ತಿ"]
      }
    }
  },
  {
    id: "painter",
    workerName: "Suresh Varma",
    society: "Visakhapatnam Guild Society",
    location: "Visakhapatnam (530016)",
    rating: 4.92,
    completedJobs: 310,
    experience: "7 Yrs Exp",
    hourlyRate: "₹500/day",
    eta: "18 Mins",
    photoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&q=85",
    icon: Paintbrush,
    translations: {
      en: {
        name: "Painter",
        trade: "Cooperative Surface Finisher",
        badge: "Weather-Coat Specialist",
        skills: ["Interior Emulsion", "Damp Waterproofing", "Texture Wall"]
      },
      hi: {
        name: "पेंटर",
        trade: "सहकारी वॉल फिनिशर",
        badge: "वेदर-कोट पेंटिंग विशेषज्ञ",
        skills: ["आंतरिक इमल्शन", "नमी वॉटरप्रूफिंग", "टेक्सचर डिजाइन"]
      },
      te: {
        name: "పెయింటర్",
        trade: "కోఆపరేటివ్ సర్ఫేస్ ఫినిషర్",
        badge: "వెదర్-కోట్ నిపుణుడు",
        skills: ["ఇంటీరియర్ ఎమల్షన్", "వాటర్‌ప్రూఫింగ్", "టెక్స్చర్ పెయింట్"]
      },
      ta: {
        name: "வர்ணம் பூசுபவர்",
        trade: "வண்ணப்பூச்சு நிபுணர்",
        badge: "நீர்ப்புகா பூச்சு சான்றிதழ்",
        skills: ["உள்துறை வர்ணம்", "நீர்ப்புகா பூச்சு", "சுவர் வடிவமைப்பு"]
      },
      mr: {
        name: "पेंटर",
        trade: "भिंत रंगकाम तज्ञ",
        badge: "वॉटरप्रूफिंग विशेषज्ञ",
        skills: ["इमल्शन पेंट", "वॉटरप्रूफिंग", "टेक्सचर डिझाइन"]
      },
      kn: {
        name: "ಪೇಂಟರ್",
        trade: "ಬಣ್ಣ ಬಳಿಯುವ ಕುಶಲಕರ್ಮಿ",
        badge: "ವೆದರ್-ಕೋಟ್ ತಜ್ಞ",
        skills: ["ಆಂತರಿಕ ಬಣ್ಣ", "ವಾಟರ್‌ಪ್ರೂಫಿಂಗ್", "ಟೆಕ್ಸ್ಚರ್ ಗೋಡೆ"]
      }
    }
  },
  {
    id: "carpenter",
    workerName: "Mohan Lal",
    society: "Hyderabad Cyber Labour Federation",
    location: "Kukatpally, Hyderabad (500072)",
    rating: 4.97,
    completedJobs: 388,
    experience: "14 Yrs Exp",
    hourlyRate: "₹420/hr",
    eta: "15 Mins",
    photoUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1000&q=85",
    icon: Hammer,
    translations: {
      en: {
        name: "Carpenter",
        trade: "Architectural Woodwork Craftsman",
        badge: "Modular Furniture Expert",
        skills: ["Modular Kitchen", "Door Lock Replacement", "Custom Wood"]
      },
      hi: {
        name: "बढ़ई",
        trade: "वास्तुशिल्प काष्ठ कारीगर",
        badge: "मॉड्यूलर फर्नीचर विशेषज्ञ",
        skills: ["मॉड्यूलर किचन", "डोर लॉक फिटिंग", "कस्टम फर्नीचर"]
      },
      te: {
        name: "కార్పెంటర్",
        trade: "కలప శిల్ప నిపుణుడు",
        badge: "మాడ్యులర్ ఫర్నిచర్ స్పెషలిస్ట్",
        skills: ["కిచెన్ క్యాబినెట్", "డోర్ లాక్ మార్పు", "కస్టమ్ వుడ్ వర్క్"]
      },
      ta: {
        name: "தச்சர்",
        trade: "மரவேலை கைவினைஞர்",
        badge: "மரச்சாமான்கள் நிபுணர்",
        skills: ["சமையலறை மரவேலை", "பூட்டு பொருத்துதல்", "தனிப்பயன் மரவேலை"]
      },
      mr: {
        name: "सुतार",
        trade: "सुतारकाम कारागीर",
        badge: "फर्निचर तज्ञ",
        skills: ["मॉड्यूलर किचन", "कुलूप दुरुस्ती", "लाकडी फर्निचर"]
      },
      kn: {
        name: "ಬಡಗಿ",
        trade: "ಮರಗೆಲಸದ ಕುಶಲಕರ್ಮಿ",
        badge: "ಮಾಡ್ಯುಲರ್ ಫರ್ನಿಚರ್ ತಜ್ಞ",
        skills: ["ಮಾಡ್ಯುಲರ್ ಅಡುಗೆಮನೆ", "ಬಾಗಿಲು ಬೀಗ ದುರಸ್ತಿ", "ಕಸ್ಟಮ್ ಮರಗೆಲಸ"]
      }
    }
  },
  {
    id: "cleaner",
    workerName: "Sunita Devi",
    society: "Bengaluru South Workers Society",
    location: "Bengaluru South (560004)",
    rating: 4.95,
    completedJobs: 290,
    experience: "6 Yrs Exp",
    hourlyRate: "₹450/visit",
    eta: "14 Mins",
    photoUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1000&q=85",
    icon: Sparkles,
    translations: {
      en: {
        name: "Cleaning",
        trade: "Certified Deep Sanitation Lead",
        badge: "Hospital-Grade Hygiene",
        skills: ["Kitchen Degreasing", "Bathroom Disinfection", "Floor Polish"]
      },
      hi: {
        name: "सफाई कर्मी",
        trade: "प्रमाणित डीप सैनिटेशन लीड",
        badge: "अस्पताल-ग्रेड स्वच्छता",
        skills: ["किचन डीग्रीजिंग", "बाथरूम कीटाणुशोधन", "फ्लोर पॉलिश"]
      },
      te: {
        name: "క్లీనింగ్",
        trade: "సర్టిఫైడ్ శానిటేషన్ నిపుణురాలు",
        badge: "హాస్పిటల్-గ్రేడ్ పరిశుభ్రత",
        skills: ["కిచెన్ క్లీనింగ్", "బాత్‌రూమ్ శానిటైజేషన్", "ఫ్లోర్ పాలిష్"]
      },
      ta: {
        name: "தூய்மை பணியாளர்",
        trade: "சான்றளிக்கப்பட்ட துப்புரவு நிபுணர்",
        badge: "மருத்துவமனை தர சுகாதாரம்",
        skills: ["சமையலறை சுத்தம்", "கழிவறை கிருமி நீக்கம்", "தரை பாலிஷ்"]
      },
      mr: {
        name: "स्वच्छता तज्ञ",
        trade: "प्रमाणित डीप सॅनिटायझर",
        badge: "रुग्णालय दर्जा स्वच्छता",
        skills: ["किचन स्वच्छता", "बाथरूम निर्जंतुकीकरण", "फरशी पॉलिश"]
      },
      kn: {
        name: "ಸ್ವಚ್ಛತಾ ತಜ್ಞೆ",
        trade: "ಪ್ರಮಾಣಿತ ಆಳವಾದ ನೈರ್ಮಲ್ಯ ತಜ್ಞೆ",
        badge: "ಆಸ್ಪತ್ರೆ-ದರ್ಜೆಯ ನೈರ್ಮಲ್ಯ",
        skills: ["ಅಡುಗೆಮನೆ ಸ್ವಚ್ಛತೆ", "ಸ್ನಾನಗೃಹ ಶುಚೀಕರಣ", "ನೆಲದ ಪಾಲಿಷ್"]
      }
    }
  },
  {
    id: "technician",
    workerName: "Anita Rao",
    society: "Chennai Central Trade Cooperative",
    location: "Chennai Central (600001)",
    rating: 4.94,
    completedJobs: 345,
    experience: "8 Yrs Exp",
    hourlyRate: "₹480/hr",
    eta: "11 Mins",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1000&q=85",
    icon: Wrench,
    translations: {
      en: {
        name: "AC Repair",
        trade: "Smart Appliance & Inverter Technician",
        badge: "HVAC Inverter Certified",
        skills: ["Gas Refrigerant Charge", "PCB Diagnostics", "Compressor Overhaul"]
      },
      hi: {
        name: "एसी मरम्मत",
        trade: "स्मार्ट उपकरण व इन्वर्टर तकनीशियन",
        badge: "एचवीएसी इन्वर्टर प्रमाणित",
        skills: ["गैस रीफिलिंग", "पीसीबी जांच", "कंप्रेसर सर्विस"]
      },
      te: {
        name: "ఏసీ రిపేర్",
        trade: "స్మార్ట్ ఉపకరణాల టెక్నీషియన్",
        badge: "ఇన్వర్టర్ ఏసీ సర్టిఫైడ్",
        skills: ["గ్యాస్ రీఫిల్", "పీసీబీ డయాగ్నోస్టిక్స్", "కంప్రెసర్ సర్వీస్"]
      },
      ta: {
        name: "ஏசி பழுதுநீக்குதல்",
        trade: "ஏசி & இன்வெர்ட்டர் தொழில்நுட்ப வல்லுநர்",
        badge: "சான்றளிக்கப்பட்ட ஏசி நிபுணர்",
        skills: ["கேஸ் நிரப்புதல்", "பிசிபி பரிசோதனை", "கம்ப்ரசர் சேவை"]
      },
      mr: {
        name: "एसी दुरुस्ती",
        trade: "स्मार्ट उपकरण व इन्व्हर्टर तंत्रज्ञ",
        badge: "प्रमाणित एसी तंत्रज्ञ",
        skills: ["गॅस रिफिल", "पीसीबी तपासणी", "कंप्रेसर सर्व्हिस"]
      },
      kn: {
        name: "ಎಸಿ ದುರಸ್ತಿ",
        trade: "ಸ್ಮಾರ್ಟ್ ಅಪ್ಲೈಯನ್ಸ್ ತಂತ್ರಜ್ಞೆ",
        badge: "ಎಚ್‌ವಿಎಸಿ ಇನ್ವರ್ಟರ್ ಪ್ರಮಾಣಿತ",
        skills: ["ಗ್ಯಾಸ್ ರೀಫಿಲ್ಲಿಂಗ್", "ಪಿಸಿಬಿ ಪರಿಶೀಲನೆ", "ಕಂಪ್ರೆಸರ್ ಸರ್ವೀಸ್"]
      }
    }
  }
];

// Multilingual UI Labels for Hero Card
const HERO_CARD_LABELS: Record<string, {
  aadhaarBadge: string;
  floorWageGuarantee: string;
  statutoryRate: string;
  bookBtn: string;
}> = {
  en: {
    aadhaarBadge: "Aadhaar Biometric Cleared",
    floorWageGuarantee: "100% Floor Wage Guarantee",
    statutoryRate: "Statutory Rate",
    bookBtn: "Book Now"
  },
  hi: {
    aadhaarBadge: "आधार बायोमेट्रिक सत्यापित",
    floorWageGuarantee: "100% न्यूनतम मजदूरी गारंटी",
    statutoryRate: "वैधानिक दर",
    bookBtn: "बुक करें"
  },
  te: {
    aadhaarBadge: "ఆధార్ బయోమెట్రిక్ ధృవీకరించబడింది",
    floorWageGuarantee: "100% చట్టబద్ధమైన వేతన హామీ",
    statutoryRate: "ప్రభుత్వ రేటు",
    bookBtn: "ఇప్పుడే బుక్ చేయండి"
  },
  ta: {
    aadhaarBadge: "ஆதார் பயோமெட்ரிக் சரிபார்க்கப்பட்டது",
    floorWageGuarantee: "100% குறைந்தபட்ச ஊதிய உத்தரவாதம்",
    statutoryRate: "அரசு நிர்ணயித்த கட்டணம்",
    bookBtn: "இப்போதே பதிவுசெய்க"
  },
  mr: {
    aadhaarBadge: "आधार बायोमेट्रिक पडताळणी पूर्ण",
    floorWageGuarantee: "१००% किमान वेतन हमी",
    statutoryRate: "वैधानिक दर",
    bookBtn: "आता बुक करा"
  },
  kn: {
    aadhaarBadge: "ಆಧಾರ್ ಬಯೋಮೆಟ್ರಿಕ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    floorWageGuarantee: "೧೦೦% ಕನಿಷ್ಠ ವೇತನ ಗ್ಯಾರಂಟಿ",
    statutoryRate: "ಸರ್ಕಾರಿ ದರ",
    bookBtn: "ಈಗಲೇ ಬುಕ್ ಮಾಡಿ"
  }
};

interface HeroCoopNetwork3DProps {
  className?: string;
  onTradeSelect?: (trade: string) => void;
}

export const HeroCoopNetwork3D: React.FC<HeroCoopNetwork3DProps> = ({
  className = "",
  onTradeSelect
}) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const langKey = HERO_CARD_LABELS[language] ? language : "en";
  const labels = HERO_CARD_LABELS[langKey] || HERO_CARD_LABELS.en;

  // 3D Tilt interactive motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 280,
    damping: 24
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 280,
    damping: 24
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Stop audio on slide change or unmount
  useEffect(() => {
    setIsSpeaking(false);
    ttsService.stop();
  }, [currentIndex, langKey]);

  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  // Auto-sliding timer (every 4.5 seconds)
  useEffect(() => {
    if (!isPlaying || isSpeaking) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ARTISANS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, isSpeaking]);

  const activeArtisan = ARTISANS[currentIndex];
  const activeArtisanTrans =
    activeArtisan.translations[langKey] || activeArtisan.translations.en;

  const handleSelectTrade = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ARTISANS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ARTISANS.length) % ARTISANS.length);
  };

  const toggleSpeakArtisan = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (isSpeaking) {
      setIsSpeaking(false);
      ttsService.stop();
      return;
    }

    const isMale =
      !activeArtisan.workerName.includes("Sunita") &&
      !activeArtisan.workerName.includes("Anita");
    const introText = `Namaste! I am ${activeArtisan.workerName}, verified cooperative artisan with ${activeArtisan.society}. Certified ${activeArtisanTrans.trade} with ${activeArtisan.experience}. Statutory floor wage of ${activeArtisan.hourlyRate} with 100 percent direct payout.`;

    setIsSpeaking(true);
    ttsService.stop();
    ttsService.speak(introText, {
      id: `hero_artisan_${activeArtisan.id}_${langKey}`,
      language: langKey as Language,
      gender: isMale ? "MALE" : "FEMALE",
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  return (
    <div className={`relative w-full select-none ${className}`}>
      {/* Glow background halo */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/15 via-blue-500/15 to-teal-500/10 rounded-3xl blur-2xl pointer-events-none" />

      {/* Top Header: Badge & Controls */}
      <div className="relative z-10 mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#075E54] border border-emerald-200 text-xs font-black shadow-2xs">
            <Sparkles className="w-3 h-3 text-emerald-600 animate-spin [animation-duration:5s]" />
            <span>TOP COOPERATIVE PROFESSIONS</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-slate-500 hover:text-[#075E54] transition cursor-pointer"
            title={isPlaying ? "Pause auto-slide" : "Play auto-slide"}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <span className="font-bold text-[#075E54]">{currentIndex + 1}</span>
          <span className="text-slate-400">/</span>
          <span>{ARTISANS.length}</span>
        </div>
      </div>

      {/* Trade Selector Segmented Grid (All 6 visible & responsive) */}
      <div className="relative z-10 mb-3 grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm">
        {ARTISANS.map((artisan, idx) => {
          const Icon = artisan.icon;
          const isSel = idx === currentIndex;
          const trans = artisan.translations[langKey] || artisan.translations.en;
          return (
            <button
              key={artisan.id}
              type="button"
              onClick={() => handleSelectTrade(idx)}
              className={`flex items-center justify-center gap-1 py-1.5 px-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                isSel
                  ? "bg-[#075E54] text-white shadow-sm shadow-[#075E54]/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isSel ? "text-amber-300" : "text-slate-400"}`} />
              <span className="truncate">{trans.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Interactive Stage Card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing transition-shadow duration-300 hover:shadow-emerald-500/10"
      >
        {/* Real Artisan Photo Showcase with clean visibility */}
        <div className="relative h-[190px] sm:h-[220px] w-full overflow-hidden bg-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeArtisan.id}
              initial={{ opacity: 0, scale: 1.03, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={activeArtisan.photoUrl}
                alt={`${activeArtisan.workerName} - ${activeArtisanTrans.trade}`}
                className="w-full h-full object-cover object-top"
              />
              {/* Soft gradient vignette that preserves face clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
            </motion.div>
          </AnimatePresence>

          {/* Top Left: Verification Badge */}
          <div className="absolute top-3 left-3 z-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-emerald-300 text-[#075E54] text-xs font-bold shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{labels.aadhaarBadge}</span>
            </div>
          </div>

          {/* Top Right: Live ETA Badge */}
          <div className="absolute top-3 right-3 z-20">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-mono font-bold shadow-md">
              <Clock className="w-3 h-3" />
              <span>ETA {activeArtisan.eta}</span>
            </div>
          </div>

          {/* Slide Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition cursor-pointer"
            aria-label="Previous artisan"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition cursor-pointer"
            aria-label="Next artisan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Over-Image Bottom Subtle Bar */}
          <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between text-white">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-300 font-bold bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              <span>{activeArtisanTrans.badge}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#075E54]/90 text-white text-[11px] font-bold backdrop-blur-md">
              <Award className="w-3 h-3 text-amber-300" />
              <span>{labels.floorWageGuarantee}</span>
            </span>
          </div>
        </div>

        {/* Card Body: Unobstructed Details, Rate, Skills & Interactive Controls */}
        <div className="p-3.5 sm:p-4 bg-white space-y-2.5">
          {/* Artisan Title & Rate Row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                {activeArtisan.workerName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                <span>{activeArtisanTrans.trade}</span>
                <span>•</span>
                <span className="text-[#075E54] font-bold">{activeArtisan.experience}</span>
              </p>
            </div>

            {/* Statutory Rate Callout */}
            <div className="text-right shrink-0 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-xl">
              <span className="block text-[9px] uppercase font-mono tracking-wider text-emerald-800 font-bold">
                {labels.statutoryRate}
              </span>
              <span className="text-base sm:text-lg font-black text-[#075E54] font-mono">
                {activeArtisan.hourlyRate}
              </span>
            </div>
          </div>

          {/* Society & Rating Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1 text-slate-500 text-[11px] truncate max-w-[250px]">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{activeArtisan.society}</span>
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{activeArtisan.rating}</span>
              <span className="text-slate-400 text-[11px] font-normal">({activeArtisan.completedJobs} jobs)</span>
            </div>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {activeArtisanTrans.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>

          {/* Actions Row: Back Button, Voice Button & Booking Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            {/* Back Arrow Mark Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs flex items-center justify-center transition cursor-pointer shrink-0"
              title="Previous Artisan (Back)"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </button>

            <button
              type="button"
              onClick={toggleSpeakArtisan}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                isSpeaking
                  ? "bg-amber-400 text-slate-950 border-amber-500 animate-pulse font-black"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title={`Listen to ${activeArtisan.workerName.split(" ")[0]} introduce himself`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-950" />
                  <span>Stop Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#075E54]" />
                  <span>Hear {activeArtisan.workerName.split(" ")[0]}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onTradeSelect?.(activeArtisanTrans.name)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#075E54] hover:bg-[#064e46] active:scale-98 text-white font-bold text-xs shadow-md shadow-[#075E54]/25 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>{labels.bookBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Slide Progress Bar */}
        <div className="h-1 bg-slate-100 w-full overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4.5, ease: "linear" }}
            className="h-full bg-gradient-to-r from-[#075E54] to-emerald-400"
          />
        </div>
      </motion.div>
    </div>
  );
};
