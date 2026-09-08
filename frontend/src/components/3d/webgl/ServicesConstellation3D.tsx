import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Wrench,
  Hammer,
  Paintbrush,
  Clock,
  Star,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export interface ServiceItem {
  id: string;
  category: "Electrical" | "Plumbing" | "Woodwork" | "Civil" | "Hygiene" | "Care" | "Logistics" | "Appliance";
  statutoryRate: string;
  verifiedPros: number;
  avgArrival: string;
  rating: number;
  imageUrl: string;
  society: string;
  icon: React.ComponentType<{ className?: string }>;
  translations: Record<
    string,
    {
      name: string;
      description: string;
      features: string[];
    }
  >;
}

const SERVICES: ServiceItem[] = [
  {
    id: "electrician",
    category: "Electrical",
    statutoryRate: "₹380/hr",
    verifiedPros: 420,
    avgArrival: "12 Mins",
    rating: 4.96,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    society: "State Labour Cooperative Federation",
    icon: Zap,
    translations: {
      en: {
        name: "Electrician & Solar Solutions",
        description: "MCB tripping, house rewiring, inverter setup, solar rooftop panels & earthing faults.",
        features: ["Biometric KYC Cleared", "100% Floor Wage Escrow", "Free 30-Day Guarantee"]
      },
      hi: {
        name: "इलेक्ट्रीशियन व सोलर समाधान",
        description: "एमसीबी ट्रिपिंग, घरेलू वायरिंग, इन्वर्टर इंस्टॉलेशन, सोलर रूफटॉप व अर्थिंग फॉल्ट्स।",
        features: ["बायोमेट्रिक केवाईसी सत्यापित", "100% न्यूनतम मजदूरी एस्क्रो", "निःशुल्क 30-दिन वारंटी"]
      },
      te: {
        name: "ఎలక్ట్రీషియన్ & సోలార్ సేవలు",
        description: "ఎంసీబీ ట్రిప్పింగ్, హౌస్ వైరింగ్, ఇన్వర్టర్ సెటప్, సోలార్ ప్యానెల్స్ & ఎర్తింగ్ సమస్యలు.",
        features: ["బయోమెట్రిక్ కేవైసీ ధృవీకరించబడింది", "100% చట్టబద్ధమైన వేతనం", "30 రోజుల ఉచిత గ్యారెంటీ"]
      },
      ta: {
        name: "மின்சார & சோலார் தீர்வுகள்",
        description: "எம்சிபி வயரிங், வீடு மின் இணைப்பு, இன்வெர்ட்டர் மற்றும் சோலார் அமைப்புகள்.",
        features: ["பயோமெட்ரிக் சரிபார்க்கப்பட்டது", "100% குறைந்தபட்ச ஊதியம்", "30 நாட்கள் உத்தரவாதம்"]
      },
      mr: {
        name: "इलेक्ट्रिशियन व सोलर सेवा",
        description: "एमसीबी फॉल्ट, घराचे वायरिंग, इन्व्हर्टर बसवणे व सोलर पॅनेल दुरुस्ती.",
        features: ["बायोमेट्रिक केवायसी पूर्ण", "१००% किमान वेतन सुरक्षित", "३० दिवस मोफत वॉरंटी"]
      },
      kn: {
        name: "ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ & ಸೌರ ಪರಿಹಾರಗಳು",
        description: "ಎಂಸಿಬಿ ಟ್ರಿಪ್ಪಿಂಗ್, ಮನೆ ವೈರಿಂಗ್, ಇನ್ವರ್ಟರ್ ಸ್ಥಾಪನೆ ಮತ್ತು ಸೌರ ಫಲಕ ದುರಸ್ತಿ.",
        features: ["ಬಯೋಮೆಟ್ರಿಕ್ ಕೆವೈಸಿ ಪೂರ್ಣ", "೧೦೦% ಕನಿಷ್ಠ ವೇತನ ಗ್ಯಾರಂಟಿ", "೩೦ ದಿನಗಳ ಉಚಿತ ಖಾತರಿ"]
      }
    }
  },
  {
    id: "plumber",
    category: "Plumbing",
    statutoryRate: "₹350/hr",
    verifiedPros: 380,
    avgArrival: "9 Mins",
    rating: 4.98,
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
    society: "Urban Water & Pipe Guild Co-op",
    icon: Wrench,
    translations: {
      en: {
        name: "Plumbing & Sanitary Engineering",
        description: "Concealed pipeline leaks, CPVC & PPR welding, sump motor repairs & water purifier lines.",
        features: ["Ultrasonic Leak Detection", "No Commission Deductions", "Fixed District Rates"]
      },
      hi: {
        name: "प्लंबिंग व सेनेटरी इंजीनियरिंग",
        description: "अदृश्य पाइपलाइन रिसाव, सीपीवीसी वेल्डिंग, मोटर रिपेयर व वाटर प्यूरीफायर लाइन फिटिंग।",
        features: ["सटीक लीकेज डिटेक्शन", "शून्य कमीशन कटौती", "सरकारी निर्धारित दर"]
      },
      te: {
        name: "ప్లంబింగ్ & శానిటరీ ఇంజనీరింగ్",
        description: "గోడల లోపలి పైప్ లీకేజీలు, సిపివిసి వెల్డింగ్, సంప్ మోటార్ రిపేర్లు మరియు ఆర్వో లైన్లు.",
        features: ["అల్ట్రాసోనిక్ లీక్ డిటెక్షన్", "కమీషన్ కోతలు లేవు", "స్థిరమైన జిల్లా రేట్లు"]
      },
      ta: {
        name: "குழாய் & சுகாதார பொறியியல்",
        description: "சுவர் கசிவு பழுது, சிபிவிசி வெல்டிங், மோட்டார் பழுது மற்றும் குடிநீர் குழாய் அமைப்புகள்.",
        features: ["துல்லியமான கசிவு கண்டறிதல்", "கமிஷன் பிடித்தம் இல்லை", "நிலையான மாவட்ட கட்டணம்"]
      },
      mr: {
        name: "प्लंबिंग व सॅनिटरी अभियांत्रिकी",
        description: "पाईप गळती, सीपीव्हीसी पाईप वेल्डिंग, पाणी पंप दुरुस्ती व वॉटर प्युरिफायर फिटिंग.",
        features: ["अचूक गळती तपासणी", "कोणतेही कमिशन कपात नाही", "निश्चित शासकीय दर"]
      },
      kn: {
        name: "ಪ್ಲಂಬಿಂಗ್ & ನೈರ್ಮಲ್ಯ ಎಂಜಿನಿಯರಿಂಗ್",
        description: "ನೀರಿನ ಪೈಪ್ ಸೋರಿಕೆ, ಸಿಪಿವಿಸಿ ವೆಲ್ಡಿಂಗ್, ಮೋಟರ್ ರಿಪೇರಿ ಮತ್ತು ವಾಟರ್ ಪ್ಯೂರಿಫೈಯರ್ ಫಿಟ್ಟಿಂಗ್.",
        features: ["ಅಲ್ಟ್ರಾಸಾನಿಕ್ ಸೋರಿಕೆ ಪತ್ತೆ", "ಶೂನ್ಯ ಕಮಿಷನ್ ಕಡಿತ", "ನಿಗದಿತ ಜಿಲ್ಲಾ ದರಗಳು"]
      }
    }
  },
  {
    id: "carpenter",
    category: "Woodwork",
    statutoryRate: "₹420/hr",
    verifiedPros: 290,
    avgArrival: "15 Mins",
    rating: 4.95,
    imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80",
    society: "Artisan Woodcraft Guild",
    icon: Hammer,
    translations: {
      en: {
        name: "Carpentry & Modular Woodcraft",
        description: "Modular kitchen fitting, custom cabinetry, smart door lock installs & furniture restoration.",
        features: ["Precision Laser Measurement", "Primary Society Tool Bank", "Zero Surcharge"]
      },
      hi: {
        name: "बढ़ईगीरी व मॉड्यूलर काष्ठकला",
        description: "मॉड्यूलर किचन, कस्टम अलमारी, स्मार्ट डोर लॉक फिटिंग व फर्नीचर नवीनीकरण।",
        features: ["लेजर माप परिशुद्धता", "प्राथमिक समिति टूल बैंक", "शून्य सरचार्ज"]
      },
      te: {
        name: "కార్పెంట్రీ & మాడ్యులర్ వుడ్‌క్రాఫ్ట్",
        description: "మాడ్యులర్ కిచెన్, కస్టమ్ కప్‌బోర్డులు, స్మార్ట్ డోర్ లాక్స్ మరియు ఫర్నిచర్ రిపేర్లు.",
        features: ["లేజర్ కొలత ఖచ్చితత్వం", "సొసైటీ టూల్ బ్యాంక్ సదుపాయం", "అదనపు ఛార్జీలు లేవు"]
      },
      ta: {
        name: "மரவேலை & மரச்சாமான்கள்",
        description: "சமையலறை மரவேலை, அலமாரி அமைத்தல், பூட்டு பொருத்துதல் மற்றும் புதுப்பித்தல்.",
        features: ["துல்லியமான லேசர் அளவீடு", "கூட்டுறவு கருவி வங்கி", "கூடுதல் கட்டணங்கள் இல்லை"]
      },
      mr: {
        name: "सुतारकाम व मॉड्यूलर लाकडी फर्निचर",
        description: "मॉड्यूलर किचन, कपाटे, स्मार्ट कुलूप बसवणे व फर्निचर दुरुस्ती.",
        features: ["अचूक लेझर मोजमाप", "सोसायटी टूल बँक सुविधा", "शून्य जादा अधिभार"]
      },
      kn: {
        name: "ಮರಗೆಲಸ & ಮಾಡ್ಯುಲರ್ ಫರ್ನಿಚರ್",
        description: "ಮಾಡ್ಯುಲರ್ ಕಿಚನ್, ಕಪಾಟುಗಳು, ಸ್ಮಾರ್ಟ್ ಡೋರ್ ಲಾಕ್ ಫಿಟ್ಟಿಂಗ್ ಮತ್ತು ನವೀಕರಣ.",
        features: ["ಲೇಸರ್ ಅಳತೆಯ ನಿಖರತೆ", "ಸಹಕಾರಿ ಟೂಲ್ ಬ್ಯಾಂಕ್ ಬೆಂಬಲ", "ಯಾವುದೇ ಸರ್ಚಾರ್ಜ್ ಇಲ್ಲ"]
      }
    }
  },
  {
    id: "painter",
    category: "Civil",
    statutoryRate: "₹500/day",
    verifiedPros: 310,
    avgArrival: "18 Mins",
    rating: 4.92,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    society: "Building Painters Cooperative",
    icon: Paintbrush,
    translations: {
      en: {
        name: "Painting & Damp Proof Sealing",
        description: "Exterior weatherproof coatings, luxury interior emulsions, moisture barriers & putty works.",
        features: ["Eco Zero-VOC Emulsions", "Moisture Meter Inspection", "Floor Protection Sheet"]
      },
      hi: {
        name: "पेंटिंग व सीलन रोधी सुरक्षा",
        description: "वेदरप्रूफ बाहरी कोटिंग, आंतरिक इमल्शन, नमी अवरोधक व पुट्टी कार्य।",
        features: ["इको जीरो-वीओसी इमल्शन", "नमी मीटर द्वारा जांच", "फ्लोर सुरक्षा कवर"]
      },
      te: {
        name: "పెయింటింగ్ & వాటర్‌ప్రూఫ్ సీలింగ్",
        description: "ఎక్స్‌టీరియర్ వెదర్‌కోట్, లగ్జరీ ఇంటీరియర్ ఎమల్షన్, తేమ నివారణ మరియు పుట్టీ వర్క్.",
        features: ["పర్యావరణ హిత ఎమల్షన్", "తేమ కొలత సాధనాలతో తనిఖీ", "ఫ్లోర్ ప్రొటెక్షన్ షీట్లు"]
      },
      ta: {
        name: "வண்ணப்பூச்சு & நீர்ப்புகா வேலை",
        description: "வெளிப்புற வானிலை பூச்சு, உட்புற வண்ணங்கள் மற்றும் சுவர்களின் ஈரப்பதம் நீக்கம்.",
        features: ["சுற்றுச்சூழல் நட்பு வண்ணங்கள்", "ஈரப்பதம் சரிபார்த்தல்", "தரை பாதுகாப்பு உறை"]
      },
      mr: {
        name: "रंगकाम व ओलावा प्रतिबंधक कोटिंग",
        description: "हवामानरोधक बाह्य रंगकाम, अंतर्गत इमल्शन, वॉटरप्रूफिंग व पुट्टी काम.",
        features: ["इको फ्रेंडली रंग", "ओलावा तपासणी मीटर", "फरशी संरक्षण कव्हर"]
      },
      kn: {
        name: "ಪೇಂಟಿಂಗ್ & ತೇವಾಂಶ ನಿರೋಧಕ ಕೆಲಸ",
        description: "ಹೊರಗಿನ ವೆದರ್‌ಕೋಟ್, ಒಳಾಂಗಣ ಬಣ್ಣ, ತೇವಾಂಶ ರಕ್ಷಣೆ ಮತ್ತು ಪುಟ್ಟಿ ಕೆಲಸ.",
        features: ["ಪರಿಸರ ಸ್ನೇಹಿ ಬಣ್ಣಗಳು", "ತೇವಾಂಶ ಪರೀಕ್ಷಾ ತಂತ್ರಜ್ಞಾನ", "ನೆಲದ ರಕ್ಷಣಾ ಶೀಟ್‌ಗಳು"]
      }
    }
  },
  {
    id: "cleaner",
    category: "Hygiene",
    statutoryRate: "₹450/visit",
    verifiedPros: 260,
    avgArrival: "14 Mins",
    rating: 4.94,
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    society: "Sanitation Guild Cooperative",
    icon: Sparkles,
    translations: {
      en: {
        name: "Deep Cleaning & Disinfection",
        description: "Kitchen degreasing, bathroom descaling, sofa steam cleaning & whole-home sterilization.",
        features: ["Hospital Grade Sanitizer", "High-Pressure Steamer", "Uniformed Team Staff"]
      },
      hi: {
        name: "डीप क्लीनिंग व कीटाणुशोधन",
        description: "किचन डीग्रीजिंग, बाथरूम कीटाणुनाशक सफाई, सोफा स्टीम वॉश व पूरे घर की स्वच्छता।",
        features: ["अस्पताल ग्रेड सैनिटाइजर", "हाई-प्रेशर स्टीम मशीन", "वर्दीधारी पेशेवर दल"]
      },
      te: {
        name: "డీప్ క్లీనింగ్ & శానిటైజేషన్",
        description: "కిచెన్ ఆయిల్ క్లీనింగ్, బాత్‌రూమ్ డీప్ క్లీన్, సోఫా స్టీమ్ క్లీనింగ్ మరియు ఇళ్ల క్రిమిసంహారక.",
        features: ["హాస్పిటల్ గ్రేడ్ రసాయనాలు", "హై-ప్రెజర్ స్టీమర్లు", "యూనిఫామ్ ధరించిన సిబ్బంది"]
      },
      ta: {
        name: "முழு தூய்மைப்பணி & கிருமி நீக்கம்",
        description: "சமையலறை எண்ணெய் நீக்கம், கழிவறை சுத்தம் மற்றும் சோபா நீராவியால் சுத்தம் செய்தல்.",
        features: ["மருத்துவமனை தர சுத்திகரிப்பு", "உயர் அழுத்த நீராவி சாதனம்", "சீருடை அணிந்த குழு"]
      },
      mr: {
        name: "डीप क्लीनिंग व निर्जंतुकीकरण",
        description: "किचन स्वच्छता, बाथरूम स्केलिंग काढणे, सोफा स्टीम वॉश व घर निर्जंतुकीकरण.",
        features: ["रुग्णालय दर्जा सॅनिटायझर", "उच्च दाबाचे स्टीम मशीन", "गणवेशधारी कुशल टीम"]
      },
      kn: {
        name: "ಡೀಪ್ ಕ್ಲೀನಿಂಗ್ & ಸೋಂಕುಗಳೆತ",
        description: "ಅಡುಗೆಮನೆ ಸ್ವಚ್ಛತೆ, ಸ್ನಾನಗೃಹ ಆಳವಾದ ನೈರ್ಮಲ್ಯ ಮತ್ತು ಇಡೀ ಮನೆಯ ಕ್ರಿಮಿಮುಕ್ತಗೊಳಿಸುವಿಕೆ.",
        features: ["ಆಸ್ಪತ್ರೆ-ದರ್ಜೆಯ ಸ್ಯಾನಿಟೈಸರ್", "ಸ್ಟೀಮ್ ಕ್ಲೀನಿಂಗ್ ಉಪಕರಣ", "ಸಮವಸ್ತ್ರಧಾರಿ ಪರಿಣತರು"]
      }
    }
  },
  {
    id: "technician",
    category: "Appliance",
    statutoryRate: "₹480/hr",
    verifiedPros: 340,
    avgArrival: "11 Mins",
    rating: 4.97,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    society: "Consumer Electronics Co-op",
    icon: Wrench,
    translations: {
      en: {
        name: "Appliance & HVAC Inverter Repair",
        description: "Inverter AC servicing, eco refrigerant refill, washing machine drums & microwave ovens.",
        features: ["OEM Certified Spares", "Digital Manifold Gauge", "90-Day Cooling Warranty"]
      },
      hi: {
        name: "घरेलू उपकरण व एसी इन्वर्टर मरम्मत",
        description: "इन्वर्टर एसी सर्विसिंग, इको गैस रीफिल, वाशिंग मशीन ड्रम व माइक्रोवेव मरम्मत।",
        features: ["ओईएम प्रमाणित पार्ट्स", "डिजिटल प्रेशर गेज", "90-दिन कूलिंग गारंटी"]
      },
      te: {
        name: "అప్లయెన్సెస్ & ఏసీ ఇన్వర్టర్ రిపేర్",
        description: "ఇన్వర్టర్ ఏసీ సర్వీసింగ్, ఎకో గ్యాస్ రీఫిల్, వాషింగ్ మెషీన్ మరియు మైక్రోవేవ్ మరమ్మతులు.",
        features: ["ఒరిజినల్ స్పేర్ పార్ట్స్", "డిజిటల్ ప్రెజర్ మీటర్", "90 రోజుల కూలింగ్ వారంటీ"]
      },
      ta: {
        name: "மின்சாதனங்கள் & ஏசி பழுதுநீக்குதல்",
        description: "இன்வெர்ட்டர் ஏசி சேவை, சுற்றுச்சூழல் நட்பு கேஸ் நிரப்புதல் மற்றும் வாஷிங் மெஷின் பழுது.",
        features: ["அசல் உதிரிபாகங்கள்", "டிஜிட்டல் அழுத்த அளவீடு", "90 நாட்கள் குளிர்ச்சி உத்தரவாதம்"]
      },
      mr: {
        name: "उपकरणे व एसी इन्व्हर्टर दुरुस्ती",
        description: "इन्व्हर्टर एसी सर्व्हिसिंग, गॅस रीफिल, वॉशिंग मशीन ड्रम व मायक्रोव्हेव्ह दुरुस्ती.",
        features: ["ओरिजिनल सुटे भाग", "डिजिटल प्रेशर मीटर", "९० दिवस कूलिंग वॉरंटी"]
      },
      kn: {
        name: "ಗೃಹೋಪಯೋಗಿ ವಸ್ತುಗಳು & ಎಸಿ ದುರಸ್ತಿ",
        description: "ಇನ್ವರ್ಟರ್ ಎಸಿ ಸರ್ವಿಸ್, ಗ್ಯಾಸ್ ರೀಫಿಲ್, ವಾಷಿಂಗ್ ಮೆಷಿನ್ ಮತ್ತು ಮೈಕ್ರೊವೇವ್ ದುರಸ್ತಿ.",
        features: ["ಅಸಲಿ ಬಿಡಿಭಾಗಗಳು", "ಡಿಜಿಟಲ್ ಒತ್ತಡ ಪರೀಕ್ಷೆ", "೯೦ ದಿನಗಳ ಕೂಲಿಂಗ್ ಖಾತರಿ"]
      }
    }
  }
];

const CATEGORIES_DATA: Record<string, Record<string, string>> = {
  All: { en: "All", hi: "सभी", te: "అన్ని", ta: "அனைத்தும்", mr: "सर्व", kn: "ಎಲ್ಲವೂ" },
  Electrical: { en: "Electrical", hi: "इलेक्ट्रिकल", te: "ఎలక్ట్రికల్", ta: "மின்சாரம்", mr: "इलेक्ट्रिकल", kn: "ಎಲೆಕ್ಟ್ರಿಕಲ್" },
  Plumbing: { en: "Plumbing", hi: "प्लंबिंग", te: "ప్లంబింగ్", ta: "பிளம்பிங்", mr: "प्लंबिंग", kn: "ಪ್ಲಂಬಿಂಗ್" },
  Woodwork: { en: "Woodwork", hi: "काष्ठकला", te: "కలప పని", ta: "மரவேலை", mr: "सुतारकाम", kn: "ಮರಗೆಲಸ" },
  Civil: { en: "Civil", hi: "पेंटिंग", te: "పెయింటింగ్", ta: "வர்ணம்", mr: "रंगकाम", kn: "ಬಣ್ಣದ ಕೆಲಸ" },
  Hygiene: { en: "Hygiene", hi: "स्वच्छता", te: "పరిశుభ్రత", ta: "தூய்மை", mr: "स्वच्छता", kn: "ನೈರ್ಮಲ್ಯ" },
  Appliance: { en: "Appliance", hi: "उपकरण", te: "ఉపకరణాలు", ta: "மின்சாதனங்கள்", mr: "उपकरणे", kn: "ಉಪಕರಣಗಳು" }
};

export const ServicesConstellation3D: React.FC<{
  onSelectService?: (trade: string) => void;
  className?: string;
}> = ({ onSelectService, className = "" }) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const langKey = ["en", "hi", "te", "ta", "mr", "kn"].includes(language) ? language : "en";

  const filteredServices = selectedCategory === "All"
    ? SERVICES
    : SERVICES.filter((s) => s.category === selectedCategory);

  useEffect(() => {
    if (!isPlaying || filteredServices.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % filteredServices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, filteredServices.length]);

  useEffect(() => {
    setActiveSlideIndex(0);
  }, [selectedCategory]);

  const activeService = filteredServices[activeSlideIndex] || filteredServices[0];
  const activeTrans = activeService.translations[langKey] || activeService.translations.en;

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev + 1) % filteredServices.length);
  };

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev - 1 + filteredServices.length) % filteredServices.length);
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {Object.keys(CATEGORIES_DATA).map((cat) => {
            const catLabel = CATEGORIES_DATA[cat][langKey] || cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#075E54] text-white shadow-md shadow-[#075E54]/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {catLabel}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-mono text-slate-600 shadow-2xs">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-slate-500 hover:text-[#075E54] transition cursor-pointer p-0.5"
              title={isPlaying ? "Pause auto-slide" : "Resume auto-slide"}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <span className="text-[11px] text-slate-400">Auto-Slide</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs transition cursor-pointer"
              aria-label="Next service"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Auto-Sliding Hero Service Showcase */}
      {activeService && (
        <div className="relative rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left: Real High-Res Photography */}
            <div className="lg:col-span-7 relative min-h-[200px] sm:min-h-[240px] bg-slate-100 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <img
                    src={activeService.imageUrl}
                    alt={activeTrans.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Badges on image */}
              <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#075E54] border border-emerald-300 text-xs font-bold shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Statutory Regulated Service</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-mono">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>ETA {activeService.avgArrival}</span>
                </span>
              </div>

              {/* Bottom Image Caption */}
              <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-300 font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg">
                    {activeService.society}
                  </span>
                  <div className="flex items-center gap-1 text-amber-300 text-xs font-mono font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{activeService.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Cooperative Details */}
            <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between space-y-3.5 bg-gradient-to-b from-white via-slate-50/50 to-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                    {activeService.category} Trade
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {activeService.verifiedPros} Active Artisans
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {activeTrans.name}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {activeTrans.description}
                </p>

                {/* Key Features */}
                <div className="space-y-2 pt-2">
                  {activeTrans.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Booking CTA */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                      Statutory Minimum Wage
                    </span>
                    <span className="text-2xl font-black text-[#075E54] font-mono">
                      {activeService.statutoryRate}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-emerald-600 font-bold">
                    0% Platform Commission
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSlideIndex((prev) => (prev - 1 + filteredServices.length) % filteredServices.length)}
                    className="py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
                    title="Previous Service (Back)"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-700" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectService?.(activeTrans.name.split(" ")[0])}
                    className="flex-1 py-3 px-5 rounded-xl bg-[#075E54] hover:bg-[#064e46] active:scale-98 text-white font-bold text-sm shadow-md shadow-[#075E54]/25 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Book {activeTrans.name.split(" ")[0]} Now</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of All Trade Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {filteredServices.map((service, idx) => {
          const isSelected = activeService && activeService.id === service.id;
          const cardTrans = service.translations[langKey] || service.translations.en;
          return (
            <div
              key={service.id}
              onClick={() => setActiveSlideIndex(idx)}
              className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-[#075E54] shadow-lg ring-2 ring-[#075E54]/20 scale-[1.01]"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {/* Photo header */}
              <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                <img
                  src={service.imageUrl}
                  alt={cardTrans.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2.5 text-xs font-mono font-bold text-white drop-shadow-sm">
                  {service.statutoryRate}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#075E54]">
                  {service.verifiedPros} Pros
                </span>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {cardTrans.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cardTrans.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span>{service.avgArrival}</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectService?.(cardTrans.name.split(" ")[0]);
                    }}
                    className="text-[#075E54] hover:text-[#05443d] font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Select</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
