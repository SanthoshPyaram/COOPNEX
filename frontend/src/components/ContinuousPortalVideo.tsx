import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  Maximize2,
  RotateCcw,
  CheckCircle2,
  Radio,
  Headphones,
  ShieldCheck,
  Zap,
  MapPin,
  CreditCard,
  Camera,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { Language } from "../i18n";
import { ttsService } from "../services/tts";

interface ContinuousPortalVideoProps {
  currentLanguage?: Language;
  onOpenModal?: () => void;
  onClose?: () => void;
}

export interface SceneVisual {
  url: string;
  tag: string;
  caption: string;
  subcaption: string;
}

export const CHAPTER_GALLERY_IMAGES: Record<number, SceneVisual[]> = {
  0: [
    {
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=85",
      tag: "01/05 • SOLAR & ELECTRICAL",
      caption: "High-Voltage Solar & Electrical Grid Installation",
      subcaption: "NSQF Level-4 certified technicians installing rooftop clean energy systems"
    },
    {
      url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=85",
      tag: "02/05 • DOMESTIC CIRCUIT REPAIR",
      caption: "Certified Electricians with Testing Multimeters",
      subcaption: "Precision household MCB wiring and grounding diagnostics"
    },
    {
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=85",
      tag: "03/05 • SANITARY PIPELINE REPAIR",
      caption: "Master Sanitary & Water Infrastructure Specialists",
      subcaption: "Leak-free copper and PVC pipe manifold maintenance"
    },
    {
      url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=85",
      tag: "04/05 • ESSENTIAL WOODWORK",
      caption: "Certified Domestic Maintenance & Carpentry Masters",
      subcaption: "Dedicated cooperative guild artisans serving neighborhood homes"
    },
    {
      url: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&q=85",
      tag: "05/05 • 0% COMMISSION PAYOUT",
      caption: "100% Floor Wage Direct to Artisan Bank Account",
      subcaption: "Zero aggregator cuts — every rupee billed reaches the worker's family directly"
    }
  ],
  1: [
    {
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=85",
      tag: "01/05 • BIOMETRIC VERHOEFF CHECK",
      caption: "UIDAI Verhoeff Aadhaar Cryptographic Validation",
      subcaption: "Tamper-proof biometric checks eliminating ghost or proxy identities"
    },
    {
      url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&q=85",
      tag: "02/05 • POLICE CLEARANCE CERTIFICATE",
      caption: "Local Police Record Clearance & Background Check",
      subcaption: "100% crime-free police verification logged on the cooperative ledger"
    },
    {
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=85",
      tag: "03/05 • STATE SKILL COUNCIL",
      caption: "State Skill Council Trade Competency Testing",
      subcaption: "Rigorous hands-on qualification benchmarks for high-voltage and pipeline trades"
    },
    {
      url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=85",
      tag: "04/05 • ENCRYPTED SMART QR BADGE",
      caption: "Tamper-Proof Photo Smart Badge & Uniform",
      subcaption: "Artisan wears official cooperative uniform with encrypted QR credentials"
    },
    {
      url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=85",
      tag: "05/05 • HOUSEHOLD SAFETY PROTOCOL",
      caption: "Household Etiquette & Senior Citizen Safety Vetting",
      subcaption: "Guaranteed peace of mind for families, senior citizens, and women at home"
    }
  ],
  2: [
    {
      url: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=85",
      tag: "01/05 • LIVE DISPATCH RADAR",
      caption: "Real-Time GPS Route Navigation with Live ETA",
      subcaption: "Track your technician's exact arrival on live map with 7-minute SLA"
    },
    {
      url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&q=85",
      tag: "02/05 • ELECTRIC FLEET TRANSIT",
      caption: "Electric Fleet Dispatch with Diagnostic Toolkits",
      subcaption: "Certified neighborhood professionals dispatched within minutes of your request"
    },
    {
      url: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=1200&q=85",
      tag: "03/05 • DOORSTEP ARRIVAL",
      caption: "Doorstep Arrival & Photo ID Badge Verification",
      subcaption: "Inspect physical photo badge and verify cooperative society registration seal"
    },
    {
      url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=85",
      tag: "04/05 • 4-DIGIT HANDSHAKE OTP",
      caption: "Encrypted 4-Digit Handshake Security OTP Verification",
      subcaption: "Share your secret PIN only after checking the worker's badge"
    },
    {
      url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=85",
      tag: "05/05 • SECURE IN-HOME REPAIR",
      caption: "Transparent Statutory Floor Wage Execution",
      subcaption: "No bargaining, no hidden charges — standardized cooperative pricing"
    }
  ],
  3: [
    {
      url: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=1200&q=85",
      tag: "01/05 • POST-REPAIR AUDIT",
      caption: "Thorough Post-Repair Quality & Safety Inspection",
      subcaption: "Full diagnostic check ensuring electrical load safety and zero plumbing leaks"
    },
    {
      url: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=1200&q=85",
      tag: "02/05 • TIME-STAMPED PROOF",
      caption: "Time-Stamped Geo-Tagged Work Evidence Upload",
      subcaption: "Before and after photos and video proof logged on cooperative chain"
    },
    {
      url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=85",
      tag: "03/05 • BHARAT UPI SOUNDBOX",
      caption: "Instant Bharat UPI Escrow Audio Confirmation",
      subcaption: "Soundbox audio announces payment: 100% credited to artisan with zero cut"
    },
    {
      url: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=85",
      tag: "04/05 • DIGITAL GST INVOICE",
      caption: "Audited Cooperative Warranty & Insurance Receipt",
      subcaption: "Instant digital receipt delivered to citizen's WhatsApp and SMS"
    },
    {
      url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=85",
      tag: "05/05 • ARTISAN FAMILY PROSPERITY",
      caption: "Honest Community Ratings Empowering Artisans",
      subcaption: "Building dignified, self-reliant cooperative livelihoods across India"
    }
  ]
};

export interface VideoChapter {
  id: number;
  timestamp: string;
  regionBadge: string;
  artisanHero: {
    name: string;
    trade: string;
    region: string;
    guild: string;
    experience: string;
    rating: string;
    avatarUrl: string;
  };
  bgImageUrl: string;
  galleryImages?: SceneVisual[];
  title: string;
  subtitle: string;
  narration: string;
  phoneticNarration: string;
  englishSub: string;
}

export interface VideoNarrationContent {
  code: string;
  langName: string;
  nativeName: string;
  speechLang: string;
  title: string;
  chapters: VideoChapter[];
}

export const VIDEO_NARRATIONS: Record<string, VideoNarrationContent> = {
  en: {
    code: "en",
    langName: "English",
    nativeName: "English",
    speechLang: "en-IN",
    title: "National Cooperative Labour Platform Walkthrough",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ NORTH & CENTRAL INDIA • DELHI, PUNJAB, UP & RAJASTHAN",
        artisanHero: {
          name: "Harpreet Singh & Rajesh Sharma",
          trade: "Certified Solar & High-Voltage Electricians",
          region: "Punjab & Delhi NCR Guild",
          guild: "Northern Power & Energy Workers Cooperative",
          experience: "12+ Yrs Experience",
          rating: "4.98 ★ (412 Jobs)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. The Cooperative Difference (0% Commission)",
        subtitle: "Eliminating the 25% to 35% aggregator commission tax so 100% of fair floor wages reach certified artisans directly.",
        narration: "Welcome to COOPNEX, India's national cooperative labour platform. We eliminate private middleman commissions, ensuring 100% of statutory floor wages reach certified technicians directly without deductions.",
        phoneticNarration: "Welcome to COOPNEX, India's national cooperative labour platform. We eliminate private middleman commissions, ensuring 100% of statutory floor wages reach certified technicians directly.",
        englishSub: "Zero intermediary fee. ₹800 billed = ₹800 directly transferred to worker's Jan Dhan or cooperative account."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 SOUTH INDIA • TELANGANA, KARNATAKA, TN & KERALA",
        artisanHero: {
          name: "Ramesh Babu & K. Selvam",
          trade: "NSQF Level-4 Master Plumbers & Smart Infrastructure",
          region: "Hyderabad & Bengaluru Guild",
          guild: "Southern Technicians & Sanitation Cooperative",
          experience: "14+ Yrs Experience",
          rating: "4.99 ★ (580 Jobs)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. 5-Tier Verification & Police Clearance",
        subtitle: "Every pro is verified via UIDAI Verhoeff Aadhaar checksums, State Skill Councils, and police clearance for 100% household trust.",
        narration: "Every pro undergoes multi-tier screening: biometric Aadhaar validation, State Skill Council certifications, and local police verification for absolute household safety.",
        phoneticNarration: "Every pro undergoes multi-tier screening: biometric Aadhaar validation, State Skill Council certifications, and local police verification for absolute household safety.",
        englishSub: "Multi-tier screening: UIDAI Verhoeff algorithm, State Skill Council NSQF Level-4, and verified police records."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 WEST INDIA • MAHARASHTRA, GUJARAT & GOA",
        artisanHero: {
          name: "Sachin Gaikwad & Neha Patel",
          trade: "Precision Carpenters & Appliance Specialists",
          region: "Mumbai & Pune Guild",
          guild: "Western Artisans Cooperative Federation",
          experience: "9+ Yrs Experience",
          rating: "4.96 ★ (340 Jobs)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. Doorstep Safety & Encrypted 4-Digit OTP",
        subtitle: "Track live GPS arrival and authorize work only after inspecting official digital cooperative ID badges.",
        narration: "Track arrival via real-time GPS. Share your encrypted 4-digit safety OTP only when the technician arrives with an official cooperative photo badge.",
        phoneticNarration: "Track arrival via real-time GPS. Share your encrypted 4-digit safety OTP only when the technician arrives with an official cooperative photo badge.",
        englishSub: "Live dispatch radar with ETA. Encrypted 4-digit OTP is shared only upon verifying technician's photo ID badge."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 EAST & NORTH-EAST INDIA • BENGAL, ASSAM, ODISHA & BIHAR",
        artisanHero: {
          name: "Debanjan Das & Priya Barman",
          trade: "Green Energy & Clean Tech Sanitation Specialists",
          region: "Kolkata & Guwahati Guild",
          guild: "Eastern Allied Workers Cooperative Union",
          experience: "11+ Yrs Experience",
          rating: "4.97 ★ (495 Jobs)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "04. Instant Bharat UPI Escrow & Work Media Proof",
        subtitle: "Inspect the repair, release payment directly to worker DBT wallets, and submit reviews with photo/video proof.",
        narration: "Upon inspection, release payment instantly via Bharat UPI QR. Upload photo and video proof of completed work to build verified credentials for informal artisans.",
        phoneticNarration: "Upon inspection, release payment instantly via Bharat UPI QR. Upload photo and video proof of completed work to build verified credentials for informal artisans.",
        englishSub: "NPCI UPI escrow release directly to technician's DBT wallet. Tamper-proof geo-tagged photo and video proof."
      }
    ]
  },
  hi: {
    code: "hi",
    langName: "Hindi",
    nativeName: "हिन्दी",
    speechLang: "hi-IN",
    title: "राष्ट्रीय सहकारी श्रम मंच वॉकथ्रू",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ उत्तर एवं मध्य भारत • दिल्ली, पंजाब, यूपी, राजस्थान",
        artisanHero: {
          name: "हरप्रीत सिंह एवं राजेश शर्मा",
          trade: "प्रमाणित सोलर एवं उच्च-वोल्टेज इलेक्ट्रीशियन",
          region: "पंजाब एवं दिल्ली एनसीआर संघ",
          guild: "उत्तरी ऊर्जा श्रमिक सहकारी समिति",
          experience: "12+ वर्ष अनुभव",
          rating: "4.98 ★ (412 कार्य)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. सहकारी क्रांति (0% बिचौलिया कमीशन)",
        subtitle: "निजी कंपनियों का 25% से 35% कमीशन समाप्त। 100% आधार मजदूरी सीधे प्रमाणित कारीगरों को।",
        narration: "सहकारी सेवा में आपका स्वागत है, भारत का राष्ट्रीय सहकारी श्रम डिजिटल मंच। हम बिचौलियों का कमीशन समाप्त कर 100% न्यूनतम मजदूरी सीधे प्रमाणित कारीगरों तक पहुंचाते हैं।",
        phoneticNarration: "Namaste! COOPNEX mein aapka swagat hai, Bharat ka rashtriya cooperative digital platform. Bichauliyon ka commission samapt kar 100% poori majdoori sidhe certified karigaron ke bank account me pahunchate hain.",
        englishSub: "Zero intermediary commission. 100% of fair floor wages go straight to the worker's account."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 दक्षिण भारत • तेलंगाना, कर्नाटक, तमिलनाडु, केरल",
        artisanHero: {
          name: "रमेश बाबू एवं के. सेल्वम",
          trade: "एनएसक्यूएफ लेवल-4 मास्टर प्लंबर",
          region: "हैदराबाद एवं बेंगलुरु संघ",
          guild: "दक्षिणी तकनीशियन सहकारी महासंघ",
          experience: "14+ वर्ष अनुभव",
          rating: "4.99 ★ (580 कार्य)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. 5-स्तरीय पुलिस एवं कौशल सत्यापन",
        subtitle: "प्रत्येक कारीगर का यूआईडीएआई आधार सत्यापन, राज्य कौशल परिषद प्रमाणन और पुलिस क्लीयरेंस।",
        narration: "प्रत्येक कारीगर बायोमेट्रिक आधार सत्यापन, राज्य कौशल परिषद प्रमाणन और पुलिस क्लीयरेंस के बाद ही आपके घर भेजा जाता है।",
        phoneticNarration: "Har technician ka multi-tier screening hota hai: UIDAI Verhoeff Aadhaar, State Skill Council certification aur local police clearance ke sath absolute household safety.",
        englishSub: "5-Tier screening: UIDAI Verhoeff algorithm, State Skill Council Level-4, and police verification."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 पश्चिम भारत • महाराष्ट्र, गुजरात, गोवा",
        artisanHero: {
          name: "सचिन गायकवाड एवं नेहा पटेल",
          trade: "कुशल बढ़ई एवं घरेलू उपकरण विशेषज्ञ",
          region: "मुंबई एवं पुणे संघ",
          guild: "पश्चिमी कारीगर सहकारी संस्था",
          experience: "9+ वर्ष अनुभव",
          rating: "4.96 ★ (340 कार्य)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. सुरक्षित आगमन एवं 4-अंकीय ओटीपी",
        subtitle: "लाइव जीपीएस ट्रैकिंग और आधिकारिक सहकारी पहचान पत्र देखने के बाद ही ओटीपी साझा करें।",
        narration: "लाइव जीपीएस से कारीगर के आगमन को ट्रैक करें। कारीगर का आधिकारिक फोटो पहचान पत्र देखकर ही अपना 4-अंकीय सुरक्षा ओटीपी साझा करें।",
        phoneticNarration: "Live GPS se technician ka aana track karein. Official cooperative photo badge dekhne ke baad hi apna encrypted 4-digit safety OTP share karein.",
        englishSub: "Track technician live on GPS. Only share your 4-digit OTP after inspecting their official photo ID badge."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 पूर्व एवं पूर्वोत्तर भारत • बंगाल, असम, ओडिशा, बिहार",
        artisanHero: {
          name: "देबांजन दास एवं प्रिया बर्मन",
          trade: "स्वच्छता एवं हरित ऊर्जा तकनीशियन",
          region: "कोलकाता एवं गुवाहाटी संघ",
          guild: "पूर्वी संबद्ध श्रमिक सहकारी यूनियन",
          experience: "11+ वर्ष अनुभव",
          rating: "4.97 ★ (495 कार्य)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "04. भारत यूपीआई एस्क्रो भुगतान एवं कार्य प्रमाण",
        subtitle: "काम की जांच के बाद सीधे यूपीआई से भुगतान करें और फोटो/वीडियो प्रमाण के साथ समीक्षा दर्ज करें।",
        narration: "काम पूरा होने पर भारत यूपीआई क्यूआर द्वारा सीधे भुगतान करें। फोटो और वीडियो प्रमाण जोड़कर कारीगर को 5-स्टार रेटिंग दें।",
        phoneticNarration: "Kaam inspect karke Bharat UPI QR se direct worker account me payment release karein, aur verified photo video proof upload karein.",
        englishSub: "Instant release via Bharat UPI QR to worker's DBT wallet with tamper-proof photo and video proof."
      }
    ]
  },
  te: {
    code: "te",
    langName: "Telugu",
    nativeName: "తెలుగు",
    speechLang: "te-IN",
    title: "జాతీయ సహకార కార్మిక వేదిక ప్రత్యక్ష ప్రదర్శన",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:15",
        regionBadge: "🏛️ ఉత్తర & మధ్య భారత్ • ఢిల్లీ, పంజాబ్, రాజస్థాన్",
        artisanHero: {
          name: "హర్‌ప్రీత్ సింగ్ & రాజేష్ శర్మ",
          trade: "సర్టిఫైడ్ సోలార్ & హై-వోల్టేజ్ ఎలక్ట్రీషియన్లు",
          region: "పంజాబ్ & ఢిల్లీ యూనిట్",
          guild: "ఉత్తర పవర్ & ఎనర్జీ కోఆపరేటివ్ సొసైటీ",
          experience: "12+ సం.ల అనుభవం",
          rating: "4.98 ★ (412 పనులు)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. సహకార వ్యత్యాసం (0% కమీషన్ దోపిడీ)",
        subtitle: "నమస్కారమండీ! ప్రైవేట్ యాప్‌ల కమీషన్ దోపిడీ లేదు — మీరు ఇచ్చే పూర్తి మొత్తం నేరుగా మన ఊరి శ్రామికుల చేతికే!",
        narration: "నమస్కారమండీ! ఇది మన సొంత సహకారి సేవ. ప్రైవేట్ యాప్‌లలో ముప్పై శాతం వరకు కమీషన్ కట్ చేస్తారు కదా, ఇక్కడ అస్సలు కమీషన్ ఉండదండి. మీరు చెల్లించే పూర్తి మొత్తం నేరుగా మన ఊరి శ్రామికుల చేతికే అందుతుంది. సున్నా శాతం కమీషన్... నూరు శాతం గౌరవం!",
        phoneticNarration: "Namaskaramandi! Idi mana sontha COOPNEX. Private app-la lo 30 percent varaku commission cut chestaaru kadaa, ikkada assalu commission undadandi. Meeru chellinche poorti mottham direct gaa mana oori sramikula chethike andutundi. Sunna shaatham commission... nooru shaatham gouravam!",
        englishSub: "Eliminating middleman cuts: 100% of fair floor wages reach certified technicians directly without deductions."
      },
      {
        id: 2,
        timestamp: "00:15 - 00:30",
        regionBadge: "🌊 దక్షిణ భారత్ • తెలంగాణ, ఆంధ్రప్రదేశ్, కర్ణాటక, తమిళనాడు",
        artisanHero: {
          name: "రమేష్ బాబు & కె. సెల్వం",
          trade: "NSQF లెవల్-4 మాస్టర్ ప్లంబర్లు & పైప్‌లైన్ ఇంజనీరింగ్",
          region: "హైదరాబాద్ & బెంగళూరు గిల్డ్",
          guild: "సదరన్ టెక్నీషియన్స్ కోఆపరేటివ్ ఫెడరేషన్",
          experience: "14+ సం.ల అనుభవం",
          rating: "4.99 ★ (580 పనులు)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. ఆధార్ & పోలీస్ వెరిఫికేషన్",
        subtitle: "పోలీస్ రికార్డుల తనిఖీ మరియు ప్రభుత్వ సర్టిఫికేషన్ ఉన్న నమ్మకమైన నిపుణులు మాత్రమే మీ ఇంటికి వస్తారు.",
        narration: "మన ప్లాట్‌ఫారంలో ప్రతి ఎలక్ట్రీషియన్, ప్లంబర్, కార్పెంటర్... ఆధార్ బయోమెట్రిక్ వెరిఫికేషన్, పోలీస్ రికార్డుల తనిఖీ పూర్తయ్యాకే మన ఇంటికి వస్తారు. నైపుణ్యం ఉన్న సర్టిఫైడ్ వర్కర్లే కాబట్టి కుటుంబ సభ్యులందరికీ నూటికి నూరు శాతం భద్రత!",
        phoneticNarration: "Mana platform lo prati electrician, plumber, carpenter... Aadhaar biometric verification, police record clearance poorthayyaake mana intiki vastaaru. Naipunyam unna certified workerle kaabatti kutumba sabhyulandarikii nootiki nooru shaatham bhadratha!",
        englishSub: "Biometric Aadhaar validation, State Skill Council Level-4 certification, and local police clearance."
      },
      {
        id: 3,
        timestamp: "00:30 - 00:45",
        regionBadge: "🌇 పశ్చిమ భారత్ • మహారాష్ట్ర, గుజరాత్, గోవా",
        artisanHero: {
          name: "సచిన్ గైక్వాడ్ & నేహా పటేల్",
          trade: "కార్పెంటర్లు & హోమ్ అప్లయన్స్ స్పెషలిస్టులు",
          region: "ముంబై & పూణే గిల్డ్",
          guild: "వెస్ట్రన్ ఆర్టిసాన్స్ కోఆపరేటివ్",
          experience: "9+ సం.ల అనుభవం",
          rating: "4.96 ★ (340 పనులు)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. డోర్‌స్టెప్ సేఫ్టీ & 4-అంకెల OTP",
        subtitle: "లైవ్ జీపీఎస్ చూసుకోండి. మెడలోని అధికారిక ఫోటో ఐడీ కార్డు చూశాకే మీ 4-అంకెల సీక్రెట్ ఓటీపీ చెప్పండి.",
        narration: "వర్కర్ ఎక్కడిదాకా వచ్చారో మీ ఫోన్‌లోనే లైవ్ జీపీఎస్ ద్వారా చూసుకోవచ్చు. వాళ్లు మీ ఇంటికి వచ్చాక, మెడలోని సహకారి అధికారిక ఫోటో ఐడీ కార్డు చూశాకే మీ నాలుగు అంకెల సీక్రెట్ ఓటీపీ చెప్పండి.",
        phoneticNarration: "Worker ekkadidaaka vacchaaro mee phone lone live GPS dwaaraa choosukovacchu. Vaallu mee intiki vacchaaka, medaloni official photo ID card choosaake mee naalugu ankela secret OTP cheppandi.",
        englishSub: "Track technician live on GPS. Share your 4-digit safety OTP only after inspecting their official photo badge."
      },
      {
        id: 4,
        timestamp: "00:45 - 01:00",
        regionBadge: "🌿 తూర్పు & ఈశాన్య భారత్ • బెంగాల్, అస్సాం, ఒడిశా, బీహార్",
        artisanHero: {
          name: "దేబాంజన్ దాస్ & ప్రియా బర్మన్",
          trade: "క్లీన్ టెక్నాలజీ & గ్రీన్ శానిటేషన్ నిపుణులు",
          region: "కోల్‌కతా & గౌహతి యూనిట్",
          guild: "ఈస్టర్న్ అలైడ్ లేబర్ కోఆపరేటివ్",
          experience: "11+ సం.ల అనుభవం",
          rating: "4.97 ★ (495 పనులు)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1200&q=80",
        title: "04. భారత్ యూపీఐ & వర్క్ మీడియా ప్రూఫ్",
        subtitle: "పని మొత్తం చూసుకున్నాకే యూపీఐ ద్వారా సులభంగా చెల్లించండి. ఫోటో సాక్ష్యాలు చూసి నిజమైన రేటింగ్ ఇవ్వండి.",
        narration: "పని మొత్తం నీట్‌గా పూర్తయ్యాక చూసుకుని, భారత్ యూపీఐ క్యూఆర్ కోడ్ స్కాన్ చేసి సులభంగా పేమెంట్ చేయండి. చేసిన పని ఫోటోలు చూసి మీ నమ్మకమైన రేటింగ్ ఇవ్వండి. డబ్బు నేరుగా శ్రామికుడి డీబీటీ ఖాతాకే!",
        phoneticNarration: "Pani mottham neat gaa poorthayyaaka choosukuni, Bharat UPI QR code scan chesi sulabhamgaa payment cheyandi. Chesina pani photos choosi mee genuine rating ivvandi. Dabbu direct gaa sramikudi DBT account ke!",
        englishSub: "Instant settlement via Bharat UPI QR code directly into technician DBT bank account with photo/video proof."
      }
    ]
  },
  ta: {
    code: "ta",
    langName: "Tamil",
    nativeName: "தமிழ்",
    speechLang: "ta-IN",
    title: "தேசிய கூட்டுறவு தொழிலாளர் தளம் செயல்முறை",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ வடக்கு & மத்திய இந்தியா • டெல்லி, பஞ்சாப், ராஜஸ்தான்",
        artisanHero: {
          name: "ஹர்ப்ரீத் சிங் & ராஜேஷ் சர்மா",
          trade: "சோலார் & உயர் மின்னழுத்த எலக்ட்ரீசியன்கள்",
          region: "பஞ்சாப் & டெல்லி தொழிற்சங்கம்",
          guild: "வடக்கு மின் தொழிலாளர் கூட்டுறவு சங்கம்",
          experience: "12+ ஆண்டுகள் அனுபவம்",
          rating: "4.98 ★ (412 பணிகள்)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. கூட்டுறவு புரட்சி (0% கமிஷன் பிடித்தம்)",
        subtitle: "தனியார் செயலிகளின் 25-35% கமிஷன் நீக்கப்பட்டு, 100% அடிப்படை ஊதியம் தொழிலாளருக்கு நேரடியாக வழங்கப்படுகிறது.",
        narration: "சககாரி சேவாவிற்கு வரவேற்கிறோம். தனியார் கமிஷன் இன்றி, 100% அடிப்படை ஊதியம் நேரடியாக தொழிலாளரின் வங்கிக் கணக்கில் சேருகிறது.",
        phoneticNarration: "Vanakkam! COOPNEX-virku varaverkirom. Makkalin thesiya kootturavu thalathil zero percent commission. 100% statutory floor wages thozhilaalar bank account-il direct-aaga serugirathu.",
        englishSub: "100% direct fair wages to certified technicians without any aggregator commission deduction."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 தென்னிந்தியா • தமிழ்நாடு, கேரளா, கர்நாடகா, தெலங்கானா",
        artisanHero: {
          name: "ரமேஷ் பாபு & கே. செல்வம்",
          trade: "NSQF நிலை-4 முதன்மை பிளம்பர்கள்",
          region: "சென்னை & பெங்களூரு சங்கம்",
          guild: "தென்னிந்திய தொழிலாளர் கூட்டுறவு கூட்டமைப்பு",
          experience: "14+ ஆண்டுகள் அனுபவம்",
          rating: "4.99 ★ (580 பணிகள்)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. ஆதார் மற்றும் காவல் துறை சரிபார்ப்பு",
        subtitle: "பயோமெட்ரிக் ஆதார் மற்றும் மாவட்ட காவல் துறை நன்னடத்தை சான்றிதழ் கட்டாயம்.",
        narration: "ஒவ்வொரு தொழிலாளியும் ஆதார் பயோமெட்ரிக் சோதனை மற்றும் காவல் துறை சரிபார்ப்பிற்கு பின்னரே நியமிக்கப்படுகிறார்கள்.",
        phoneticNarration: "Ovvoru thozhilaaliyum biometric Aadhaar, State Skill Council certification matrum local police verification mudindha pinbare veettirku anuppapadugirar.",
        englishSub: "Biometric Aadhaar check, State Skill Council certifications, and local police verification."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 மேற்கு இந்தியா • மகாராஷ்டிரா, குஜராத், கோவா",
        artisanHero: {
          name: "சச்சின் கெய்க்வாட் & நேகா படேல்",
          trade: "மரவேலை மற்றும் வீட்டு உபகரண வல்லுநர்கள்",
          region: "மும்பை & புனே சங்கம்",
          guild: "மேற்கு இந்திய கைவினைஞர் கூட்டுறவு",
          experience: "9+ ஆண்டுகள் அனுபவம்",
          rating: "4.96 ★ (340 பணிகள்)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. 4-இலக்க பாதுகாப்பு OTP",
        subtitle: "நேரலை ஜிபிஎஸ் கண்காணிப்பு மற்றும் கூட்டுறவு அடையாள அட்டையை சரிபார்த்த பின்னரே OTP வழங்கவும்.",
        narration: "தொழிலாளியின் வருகையை ஜிபிஎஸ் மூலம் கண்காணிக்கவும். அடையாள அட்டை பார்த்த பின்னரே உங்களது OTP-யை பகிரவும்.",
        phoneticNarration: "Neralaai GPS vazhiyaaga varugaiyai track seyyungal. Official cooperative photo ID card paarthavudan mattume ungal 4-digit safety OTP-ai share seyyungal.",
        englishSub: "Track live on GPS. Share 4-digit OTP only after checking official photo ID card."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 கிழக்கு & வடகிழக்கு இந்தியா • வங்கம், அசாம், ஒடிசா",
        artisanHero: {
          name: "தேபாஞ்சன் தாஸ் & பிரியா பர்மன்",
          trade: "சுற்றுச்சூழல் மற்றும் மின்னணு பழுதுபார்ப்பு",
          region: "கொல்கத்தா & குவஹாத்தி சங்கம்",
          guild: "கிழக்கு தொழிலாளர் கூட்டுறவு ஒன்றியம்",
          experience: "11+ ஆண்டுகள் அனுபவம்",
          rating: "4.97 ★ (495 பணிகள்)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "04. பாரத் யுபிஐ உடனடி பணப்பரிவர்த்தனை",
        subtitle: "பணி முடிந்ததும் யுபிஐ மூலம் நேரடியாக பணம் செலுத்தி, பணி புகைப்படத்துடன் மதிப்பீடு வழங்கவும்.",
        narration: "பணியை ஆய்வு செய்த பின் யுபிஐ மூலம் கட்டணம் செலுத்தவும். வேலை சான்று புகைப்படத்துடன் 5-நட்சத்திர மதிப்பீடு வழங்கவும்.",
        phoneticNarration: "Pani mudinthadhum Bharat UPI QR moolamaaga direct DBT payout seyyungal, matrum photo video proof upload seyyungal.",
        englishSub: "Release payment instantly via Bharat UPI to worker DBT wallet with photo/video proof."
      }
    ]
  },
  kn: {
    code: "kn",
    langName: "Kannada",
    nativeName: "ಕನ್ನಡ",
    speechLang: "kn-IN",
    title: "ರಾಷ್ಟ್ರೀಯ ಸಹಕಾರಿ ಕಾರ್ಮಿಕ ವೇದಿಕೆ ಮಾರ್ಗದರ್ಶಿ",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ ಉತ್ತರ & ಮಧ್ಯ ಭಾರತ • ದೆಹಲಿ, ಪಂಜಾಬ್, ರಾಜಸ್ಥಾನ",
        artisanHero: {
          name: "ಹರ್‌ಪ್ರೀತ್ ಸಿಂಗ್ & ರಾಜೇಶ್ ಶರ್ಮಾ",
          trade: "ಸೋಲಾರ್ & ಹೈ-ವೋಲ್ಟೇಜ್ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್‌ಗಳು",
          region: "ಪಂಜಾಬ್ & ದೆಹಲಿ ಘಟಕ",
          guild: "ಉತ್ತರ ಇಂಧನ ಕಾರ್ಮಿಕರ ಸಹಕಾರಿ ಸಂಘ",
          experience: "12+ ವರ್ಷಗಳ ಅನುಭವ",
          rating: "4.98 ★ (412 ಕೆಲಸಗಳು)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. ಸಹಕಾರಿ ಕ್ರಾಂತಿ (0% ಕಮಿಷನ್)",
        subtitle: "ಖಾಸಗಿ ಕಂಪನಿಗಳ 25-35% ಕಮಿಷನ್ ರದ್ದು, 100% ನ್ಯಾಯಯುತ ವೇತನ ನೇರವಾಗಿ ಕಾರ್ಮಿಕರ ಖಾತೆಗೆ.",
        narration: "COOPNEX ಗೆ ಸ್ವಾಗತ. ಖಾಸಗಿ ಮಧ್ಯವರ್ತಿಗಳ ಕಮಿಷನ್ ರದ್ದುಪಡಿಸಿ 100% ನ್ಯಾಯಯುತ ವೇತನವನ್ನು ನೇರವಾಗಿ ನುರಿತ ಕಾರ್ಮಿಕರಿಗೆ ತಲುಪಿಸುತ್ತೇವೆ.",
        phoneticNarration: "Namaskara! COOPNEX-ge swagatha, Bharathada rashtriya sahakari karmika vedike. Madhyavarthigala commission raddu maadi 100% nyayayutha vethanavannu certified karmikarige direct talupisutthadhe.",
        englishSub: "Zero intermediary fee. 100% of fair floor wage goes directly to certified technicians."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 ದಕ್ಷಿಣ ಭಾರತ • ಕರ್ನಾಟಕ, ತೆಲಂಗಾಣ, ಆಂಧ್ರ, ತಮಿಳುನಾಡು",
        artisanHero: {
          name: "ರಮೇಶ್ ಬಾಬು & ಕೆ. ಸೆಲ್ವಂ",
          trade: "NSQF ಲೆವೆಲ್-4 ಮಾಸ್ಟರ್ ಪ್ಲಂಬರ್ & ಪೈಪ್‌ಲೈನ್",
          region: "ಬೆಂಗಳೂರು & ಹೈದರಾಬಾದ್ ಸಂಘ",
          guild: "ದಕ್ಷಿಣ ತಂತ್ರಜ್ಞರ ಸಹಕಾರಿ ಒಕ್ಕೂಟ",
          experience: "14+ ವರ್ಷಗಳ ಅನುಭವ",
          rating: "4.99 ★ (580 ಕೆಲಸಗಳು)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. 5-ಹಂತದ ಆಧಾರ್ & ಪೊಲೀಸ್ ಪರಿಶೀಲನೆ",
        subtitle: "ಪ್ರತಿಯೊಬ್ಬ ತಂತ್ರಜ್ಞರ ಯುಐಡಿಎಐ ಆಧಾರ್ ಮತ್ತು ರಾಜ್ಯ ಕೌಶಲ್ಯ ಮಂಡಳಿ ಪ್ರಮಾಣೀಕರಣ.",
        narration: "ಪ್ರತಿ ಕಾರ್ಮಿಕರ ಬಯೋಮೆಟ್ರಿಕ್ ಆಧಾರ್ ಪರಿಶೀಲನೆ ಮತ್ತು ಪೊಲೀಸ್ ಕ್ಲಿಯರೆನ್ಸ್ ಮುಗಿದ ನಂತರವೇ ನಿಮ್ಮ ಮನೆಗೆ ನಿಯೋಜಿಸಲಾಗುತ್ತದೆ.",
        phoneticNarration: "Prathi karmikara UIDAI Aadhaar, State Skill Council pramanikarana mathu local police clearance mugida nantharave nimma manege kanoonubaddha seve sigutthadhe.",
        englishSub: "Every worker passes UIDAI Verhoeff checksums, State Skill Council & police vetting."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 ಪಶ್ಚಿಮ ಭಾರತ • ಮಹಾರಾಷ್ಟ್ರ, ಗುಜರಾತ್, ಗೋವಾ",
        artisanHero: {
          name: "ಸಚಿನ್ ಗಾಯಕ್‌ವಾಡ್ & ನೇಹಾ ಪಟೇಲ್",
          trade: "ನುರಿತ ಬಡಗಿ ಮತ್ತು ಗೃಹೋಪಯೋಗಿ ವಸ್ತು ತಜ್ಞರು",
          region: "ಮುಂಬೈ & ಪುಣೆ ಸಂಘ",
          guild: "ಪಶ್ಚಿಮ ಕುಶಲಕರ್ಮಿಗಳ ಸಹಕಾರಿ ಸಂಸ್ಥೆ",
          experience: "9+ ವರ್ಷಗಳ ಅನುಭವ",
          rating: "4.96 ★ (340 ಕೆಲಸಗಳು)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. ಸುರಕ್ಷಿತ ಆಗಮನ ಮತ್ತು 4-ಅಂಕಿಯ OTP",
        subtitle: "ಲೈವ್ ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ಅಧಿಕೃತ ಐಡಿ ಕಾರ್ಡ್ ನೋಡಿದ ನಂತರವೇ OTP ಹಂಚಿಕೊಳ್ಳಿ.",
        narration: "ಲೈವ್ ಜಿಪಿಎಸ್ ಮೂಲಕ ಕಾರ್ಮಿಕರ ಆಗಮನ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಗುರುತಿನ ಚೀಟಿ ಪರಿಶೀಲಿಸಿದ ನಂತರವಷ್ಟೇ ನಿಮ್ಮ 4-ಅಂಕಿಯ OTP ನೀಡಿ.",
        phoneticNarration: "Live GPS moolaka technician arrival track maadi. Official cooperative photo ID card nodidamelaste nimma encrypted 4-digit safety OTP share maadi.",
        englishSub: "Track technician live on GPS. Share 4-digit safety OTP only after checking ID badge."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 ಪೂರ್ವ & ಈಶಾನ್ಯ ಭಾರತ • ಬಂಗಾಳ, ಅಸ್ಸಾಂ, ಒಡಿಶಾ",
        artisanHero: {
          name: "ದೇಬಾಂಜನ್ ದಾಸ್ & ಪ್ರಿಯಾ ಬರ್ಮನ್",
          trade: "ಪರಿಸರ ಸ್ನೇಹಿ ನೈರ್ಮಲ್ಯ ಮತ್ತು ಗ್ರೀನ್ ಎನರ್ಜಿ",
          region: "ಕೋಲ್ಕತಾ & ಗುವಾಹಟಿ ಘಟಕ",
          guild: "ಪೂರ್ವ ಕಾರ್ಮಿಕರ ಸಹಕಾರಿ ಸಂಘಟನೆ",
          experience: "11+ ವರ್ಷಗಳ ಅನುಭವ",
          rating: "4.97 ★ (495 ಕೆಲಸಗಳು)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "04. ಭಾರತ್ ಯುಪಿಐ ಎಸ್ಕ್ರೋ & ಕೆಲಸದ ಪುರಾವೆ",
        subtitle: "ಕೆಲಸ ಪರಿಶೀಲಿಸಿದ ನಂತರ ಯುಪಿಐ ಮೂಲಕ ಪಾವತಿಸಿ ಮತ್ತು ಫೋಟೋ ಪುರಾವೆಯೊಂದಿಗೆ ರೇಟಿಂಗ್ ನೀಡಿ.",
        narration: "ಕೆಲಸ ಪರಿಶೀಲಿಸಿದ ನಂತರ ಭಾರತ್ ಯುಪಿಐ ಮೂಲಕ ಪಾವತಿಸಿ. ಕೆಲಸದ ಫೋಟೋಗಳೊಂದಿಗೆ 5-ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ದಾಖಲಿಸಿ.",
        phoneticNarration: "Kelasa nodi Bharat UPI QR moolaka direct worker account-ge instant payment maadi, mathu photo video puraveyondige 5-star rating kodi.",
        englishSub: "Instant Bharat UPI release to technician DBT wallet with GPS photo & video proof."
      }
    ]
  },
  mr: {
    code: "mr",
    langName: "Marathi",
    nativeName: "मराठी",
    speechLang: "mr-IN",
    title: "राष्ट्रीय सहकारी कामगार मंच सादरीकरण",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ उत्तर व मध्य भारत • दिल्ली, पंजाब, राजस्थान",
        artisanHero: {
          name: "हरप्रीत सिंग व राजेश शर्मा",
          trade: "प्रमाणित सोलर व वीज तंत्रज्ञ",
          region: "पंजाब व दिल्ली युनिट",
          guild: "नॉर्दर्न पॉवर वर्कर्स को-ऑपरेटिव्ह",
          experience: "12+ वर्षे अनुभव",
          rating: "4.98 ★ (412 कामे)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. सहकारी क्रांती (0% दलाली कमिशन)",
        subtitle: "खाजगी ॲप्सचे 25-35% कमिशन रद्द, 100% किमान वेतन थेट कामगाराच्या बँक खात्यात.",
        narration: "COOPNEX मध्ये आपले स्वागत आहे. मध्यस्थांचे कमिशन दूर करून 100% हक्काचे मानधन थेट तंत्रज्ञांच्या खात्यात पोहोचवले जाते.",
        phoneticNarration: "Namaskar! COOPNEX madhe aple swagat aahe. Bharatacha rashtriya sahakari kamgar digital manch. Madhyasthanche commission sampvoon 100% manadhan thêt pramanit tantragyanchya bank khatyat jamate.",
        englishSub: "Zero intermediary fee. 100% of fair floor wage goes directly to certified artisans."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 दक्षिण भारत • कर्नाटक, तेलंगणा, तामिळनाडू, केरळ",
        artisanHero: {
          name: "रमेश बाबू व के. सेल्वम",
          trade: "एनएसक्यूएफ लेव्हल-4 मास्टर प्लंबर",
          region: "हैदराबाद व बंगळुरू युनिट",
          guild: "सदर्न टेक्निशियन्स को-ऑपरेटिव्ह फेडरेशन",
          experience: "14+ वर्षे अनुभव",
          rating: "4.99 ★ (580 कामे)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. आधार आणि पोलीस पडताळणी",
        subtitle: "प्रत्येक तंत्रज्ञाची बायोमेट्रिक आधार आणि पोलीस पडताळणी केली जाते.",
        narration: "प्रत्येक कारागिराची आधार पडताळणी, कौशल्य चाचणी आणि पोलीस क्लिअरन्स पूर्ण असते.",
        phoneticNarration: "Pratyek karagirachi UIDAI biometric Aadhaar, State Skill Council pramanikaran aani police clearance poorna aslyavarch kaam dile jaate.",
        englishSub: "Every technician verified via UIDAI Verhoeff, Skill Council Level-4 & police clearance."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 पश्चिम भारत • महाराष्ट्र, गुजरात, गोवा",
        artisanHero: {
          name: "सचिन गायकवाड व नेहा पटेल",
          trade: "कुशल सुतार व गृहोपयोगी उपकरण तज्ज्ञ",
          region: "मुंबई व पुणे युनिट",
          guild: "वेस्टर्न आर्टिसन्स को-ऑपरेटिव्ह",
          experience: "9+ वर्षे अनुभव",
          rating: "4.96 ★ (340 कामे)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. सुरक्षितता ४-अंकी ओटीपी",
        subtitle: "लाईव्ह जीपीएस ट्रॅकिंग आणि ओळखपत्र पाहिल्यावरच ४-अंकी सुरक्षा ओटीपी सामायिक करा.",
        narration: "लाईव्ह जीपीएसने आगमन तपासा आणि ओळखपत्र पाहिल्यावरच आपला 4-अंकी सुरक्षा ओटीपी द्या.",
        phoneticNarration: "Live GPS ne karagirache aagman track kara. COOPNEX official photo ID card pahilyavarach apla 4-digit safety OTP share kara.",
        englishSub: "Track live on GPS. Share 4-digit safety OTP only after verifying official photo badge."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 पूर्व व ईशान्य भारत • बंगाल, आसाम, ओडिशा, बिहार",
        artisanHero: {
          name: "देबांजन दास व प्रिया बर्मन",
          trade: "स्वच्छता व ग्रीन एनर्जी तंत्रज्ञ",
          region: "कोलकाता व गुवाहाटी युनिट",
          guild: "ईस्टर्न अलाईड वर्कर्स को-ऑपरेटिव्ह",
          experience: "11+ वर्षे अनुभव",
          rating: "4.97 ★ (495 कामे)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "04. भारत यूपीआई एस्क्रो आणि कामाचा पुरावा",
        subtitle: "काम तपासल्यानंतर यूपीआयने पैसे द्या आणि फोटो पुराव्यांसह पुनरावलोकन करा.",
        narration: "काम पूर्ण झाल्यावर भारत यूपीआयने थेट पैसे द्या आणि कामाच्या फोटोंसह रेटिंग नोंदवा.",
        phoneticNarration: "Kaam purn jhalya-nanter Bharat UPI QR dwara direct worker account me paise release kara aani photo video proof sah 5-star rating dya.",
        englishSub: "Instant Bharat UPI release to technician DBT wallet with geo-tagged photo/video proof."
      }
    ]
  },
  bn: {
    code: "bn",
    langName: "Bengali",
    nativeName: "বাংলা",
    speechLang: "bn-IN",
    title: "জাতীয় সমবায় শ্রমিক প্ল্যাটফর্ম ডেমো",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ উত্তর ও মধ্য ভারত • দিল্লি, পাঞ্জাব, রাজস্থান",
        artisanHero: {
          name: "হরপ্রীত সিং ও রাজেশ শর্মা",
          trade: "সার্টিফাইড সোলার ও ইলেকট্রিশিয়ান",
          region: "পাঞ্জাব ও দিল্লি ইউনিট",
          guild: "নর্দার্ন পাওয়ার ওয়ার্কার্স সমবায়",
          experience: "১২+ বছর অভিজ্ঞতা",
          rating: "৪.৯৮ ★ (৪১২ কাজ)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "০১. সমবায় পার্থক্য (০% কমিশন কর্তন)",
        subtitle: "বেসরকারি অ্যাপের ২৫-৩৫% কমিশন বাতিল, ১০০% ন্যায্য মজুরি সরাসরি শ্রমিকের অ্যাকাউন্টে।",
        narration: "COOPNEX-এ স্বাগতম। মধ্যস্থতাকারীদের কমিশন দূর করে ১০০% মজুরি সরাসরি কারিগরদের কাছে পৌঁছে দেওয়া হয়।",
        phoneticNarration: "Nomoshkar! COOPNEX-e swagotom. Bharoter jaateeyo somobay shromik platform. Moddhosthokari commission bondho kore 100% nyajjo mojoori shorashori certified karigor-der bank account-e pouchhe deoa hoy.",
        englishSub: "Zero intermediary commission. 100% of fair floor wages go straight to certified technicians."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 দক্ষিণ ভারত • কর্ণাটক, তেলেঙ্গানা, তামিলনাড়ু, কেরালা",
        artisanHero: {
          name: "রমেশ বাবু ও কে. সেলভম",
          trade: "NSQF লেভেল-৪ মাস্টার প্লাম্বার",
          region: "হায়দ্রাবাদ ও বেঙ্গালুরু ইউনিট",
          guild: "সাউদার্ন টেকনিশিয়ান্স সমবায় ফেডারেশন",
          experience: "১৪+ বছর অভিজ্ঞতা",
          rating: "৪.৯৯ ★ (৫৮০ কাজ)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "০২. পুলিশ ও দক্ষতা যাচাইকরণ",
        subtitle: "বায়োমেট্রিক আধার যাচাই এবং রাজ্য দক্ষতা পর্ষদ কর্তৃক প্রত্যয়িত টেকনিশিয়ান।",
        narration: "প্রতিটি টেকনিশিয়ান আধার যাচাইকরণ এবং পুলিশ ক্লিয়ারেন্সের পর নিযুক্ত হন।",
        phoneticNarration: "Protiti technician-er UIDAI Verhoeff Aadhaar, State Skill Council shonod ebong local police clearance thakar por-i niyog kora hoy.",
        englishSub: "Biometric Aadhaar check, State Skill Council Level-4 certification, and police verification."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 পশ্চিম ভারত • মহারাষ্ট্র, গুজরাট, গোয়া",
        artisanHero: {
          name: "শচীন গায়কোয়াড় ও নেহা প্যাটেল",
          trade: "ছুতোর ও গৃহস্থালি যন্ত্রপাতি বিশেষজ্ঞ",
          region: "মুম্বাই ও পুনে ইউনিট",
          guild: "ওয়েস্টার্ন কারিগর সমবায়",
          experience: "৯+ বছর অভিজ্ঞতা",
          rating: "৪.৯৬ ★ (৩৪০ কাজ)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "০৩. দরজায় নিরাপত্তা এবং ৪-সংখ্যার ওটিপি",
        subtitle: "লাইভ জিপিএস পর্যবেক্ষণ এবং অফিসিয়াল আইডি কার্ড দেখেই ওটিপি শেয়ার করুন।",
        narration: "লাইভ জিপিএস দিয়ে ট্র্যাক করুন এবং আইডি কার্ড দেখেই আপনার ৪-সংখ্যার নিরাপত্তা ওটিপি দিন।",
        phoneticNarration: "Live GPS diye worker-er aashar shomoy track korun. Official cooperative photo ID card dekhe-i apnar 4-digit safety OTP share korun.",
        englishSub: "Track live on GPS. Share 4-digit safety OTP only after verifying technician's photo ID."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 পূর্ব ও উত্তর-পূর্ব ভারত • বাংলা, আসাম, ওড়িশা, বিহার",
        artisanHero: {
          name: "দেবাঞ্জন দাস ও প্রিয়া বর্মন",
          trade: "পরিবেশবান্ধব পরিচ্ছন্নতা ও গ্রিন এনার্জি",
          region: "কলকাতা ও গুয়াহাটি ইউনিট",
          guild: "ইস্টার্ন সমবায় শ্রমিক ইউনিয়ন",
          experience: "১১+ বছর অভিজ্ঞতা",
          rating: "৪.৯৭ ★ (৪৯৫ কাজ)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "০৪. ভারত ইউপিআই এস্ক্রো এবং কাজের প্রমাণ",
        subtitle: "কাজ পরিদর্শনের পর ইউপিআই মাধ্যমে প্রদান করুন এবং কাজের ছবি দিয়ে রেটিং দিন।",
        narration: "কাজ শেষ হলে ভারত ইউপিআই দ্বারা অর্থ প্রদান করুন এবং কাজের প্রমাণের সাথে রেটিং দিন।",
        phoneticNarration: "Kaaj poriksha kore Bharat UPI QR diye direct worker account-e taka pathan, ebong photo video proof shoh 5-star rating din.",
        englishSub: "Direct settlement via Bharat UPI to worker's DBT wallet with photo/video proof."
      }
    ]
  },
  ml: {
    code: "ml",
    langName: "Malayalam",
    nativeName: "മലയാളം",
    speechLang: "ml-IN",
    title: "ദേശീയ സഹകരണ തൊഴിലാളി പ്ലാറ്റ്ഫോം",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ വടക്കേ & മധ്യ ഭാരതം • ഡൽഹി, പഞ്ചാബ്, രാജസ്ഥാൻ",
        artisanHero: {
          name: "ഹർപ്രീത് സിംഗ് & രാജേഷ് ശർമ്മ",
          trade: "സോളാർ & ഇലക്ട്രീഷ്യൻമാർ",
          region: "പഞ്ചാബ് & ഡൽഹി യൂണിയൻ",
          guild: "നോർത്തേൺ പവർ കോഓപ്പറേറ്റീവ്",
          experience: "12+ വർഷത്തെ പരിചയം",
          rating: "4.98 ★ (412 ജോലികൾ)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. സഹകരണ വിപ്ലവം (0% കമ്മീഷൻ)",
        subtitle: "സ്വകാര്യ ഏജൻസികളുടെ 25-35% കമ്മീഷൻ ഇല്ലാതെ 100% വേതനം നേരിട്ട് തൊഴിലാളികൾക്ക്.",
        narration: "സഹകാരി സേവയിലേക്ക് സ്വാഗതം. സ്വകാര്യ ഇടനിലക്കാരുടെ കമ്മീഷൻ ഇല്ലാതെ 100% വേതനം നേരിട്ട് തൊഴിലാളികൾക്ക് ലഭിക്കുന്നു.",
        phoneticNarration: "Namaskaram! COOPNEXyilekk swagatham. Bharathathinte deshiya sahakari thozhilali digital platform. Zero percent commission-il 100% statutory floor wages direct aayi certified workers-nu labhikkunnu.",
        englishSub: "Zero commission cut. 100% fair floor wages reach certified technicians directly."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 ദക്ഷിണ ഭാരതം • കേരളം, കർണാടക, തമിഴ്നാട്, തെലങ്കാന",
        artisanHero: {
          name: "രമേഷ് ബാബു & കെ. സെൽവം",
          trade: "NSQF ലെവൽ-4 മാസ്റ്റർ പ്ലംബർ",
          region: "ഹൈദരാബാദ് & ബംഗളൂരു യൂണിറ്റ്",
          guild: "സതേൺ ടെക്നീഷ്യൻസ് കോഓപ്പറേറ്റീവ്",
          experience: "14+ വർഷത്തെ പരിചയം",
          rating: "4.99 ★ (580 ജോലികൾ)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. ആധാർ & പോലീസ് വെരിഫിക്കേഷൻ",
        subtitle: "ബയോമെട്രിക് ആധാർ പരിശോധനയും പോലീസ് ക്ലിയറൻസും കഴിഞ്ഞ നൈപുണ്യമുള്ള തൊഴിലാളികൾ.",
        narration: "ബയോമെട്രിക് ആധാർ പരിശോധനയും പോലീസ് ക്ലിയറൻസും കഴിഞ്ഞ നൈപുണ്യമുള്ള തൊഴിലാളികൾ മാത്രം.",
        phoneticNarration: "Oro thozhilalikkum biometric Aadhaar, State Skill Council certification matrum local police clearance kazhinju maathrame sevanam labhyamaaku.",
        englishSub: "Every artisan undergoes UIDAI biometric, Skill Council Level-4 & police clearance."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 പടിഞ്ഞാറൻ ഭാരതം • മഹാരാഷ്ട്ര, ഗുജറാത്ത്, ഗോവ",
        artisanHero: {
          name: "സച്ചിൻ ഗെയ്ക്‌വാദ് & നേഹ പട്ടേൽ",
          trade: "ആശാരി & ഉപകരണ വിദഗ്ദ്ധർ",
          region: "മുംബൈ & പൂനെ യൂണിറ്റ്",
          guild: "വെസ്റ്റേൺ ആർട്ടിസാൻസ് കോഓപ്പറേറ്റീവ്",
          experience: "9+ വർഷത്തെ പരിചയം",
          rating: "4.96 ★ (340 ജോലികൾ)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. 4-അക്ക സുരക്ഷാ OTP",
        subtitle: "ലൈവ് ജിപിഎസ് വഴി ട്രാക്ക് ചെയ്യുക. ഔദ്യോഗിക ഐഡി കാർഡ് കണ്ട ശേഷം മാത്രം 4-അക്ക ഒടിപി നൽകുക.",
        narration: "ലൈവ് ജിപിഎസ് വഴി ട്രാക്ക് ചെയ്യുക. ഔദ്യോഗിക ഐഡി കാർഡ് കണ്ട ശേഷം മാത്രം 4-അക്ക ഒടിപി നൽകുക.",
        phoneticNarration: "Live GPS vazhi thozhilaliyude varav track cheyyuka. Official cooperative photo identity card kandathinu shesham maathram 4-digit safety OTP nalkuka.",
        englishSub: "Track live on GPS. Share 4-digit safety OTP only after checking photo identity badge."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 കിഴക്കൻ & വടക്കുകിഴക്കൻ ഭാരതം • ബംഗാൾ, അസം, ഒഡീഷ",
        artisanHero: {
          name: "ദേബഞ്ചൻ ദാസ് & പ്രിയ ബർമൻ",
          trade: "ക്ലീൻ ടെക് & ഹരിത ഊർജ്ജ വിദഗ്ദ്ധർ",
          region: "കൊൽക്കത്ത & ഗുവാഹത്തി യൂണിറ്റ്",
          guild: "ഈസ്റ്റേൺ വർക്കേഴ്സ് കോഓപ്പറേറ്റീവ്",
          experience: "11+ വർഷത്തെ പരിചയം",
          rating: "4.97 ★ (495 ജോലികൾ)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "04. ഭാരത് യുപിഐ തൽക്ഷണ എസ്ക്രോ",
        subtitle: "ജോലി കഴിഞ്ഞാൽ ഭാരത് യുപിഐ വഴി നേരിട്ട് പണം നൽകുക. ഫോട്ടോ പ്രൂഫ് സഹിതം റേറ്റിംഗ് രേഖപ്പെടുത്തുക.",
        narration: "ജോലി കഴിഞ്ഞാൽ ഭാരത് യുപിഐ വഴി നേരിട്ട് പണം നൽകുക. ഫോട്ടോ പ്രൂഫ് സഹിതം റേറ്റിംഗ് രേഖപ്പെടുത്തുക.",
        phoneticNarration: "Joli parishodhichathinu shesham Bharat UPI QR vazhi direct bank account-ilekk payment cheyyuka, work proof upload cheyyuka.",
        englishSub: "Direct settlement via Bharat UPI to technician DBT wallet with geo-tagged proof."
      }
    ]
  },
  gu: {
    code: "gu",
    langName: "Gujarati",
    nativeName: "ગુજરાતી",
    speechLang: "gu-IN",
    title: "રાષ્ટ્રીય સહકારી શ્રમ મંચ વૉકથ્રુ",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ ઉત્તર & મધ્ય ભારત • દિલ્હી, પંજાબ, રાજસ્થાન",
        artisanHero: {
          name: "હરપ્રીત સિંહ અને રાજેશ શર્મા",
          trade: "પ્રમાણિત સોલાર અને ઇલેક્ટ્રિશિયન",
          region: "પંજાબ અને દિલ્હી યુનિટ",
          guild: "નોર્ધન પાવર વર્કર્સ સહકારી મંડળી",
          experience: "12+ વર્ષ અનુભવ",
          rating: "4.98 ★ (412 કામ)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. સહકારી ક્રાંતિ (0% કમિશન)",
        subtitle: "ખાનગી દલાલી કમિશન શૂન્ય કરીને 100% મહેનતાણું સીધું કારીગરોને મળે છે.",
        narration: "સહકારી સેવામાં આપનું સ્વાગત છે. ખાનગી દલાલી કમિશન શૂન્ય કરીને 100% મહેનતાણું સીધું કારીગરોને મળે છે.",
        phoneticNarration: "Namaste! COOPNEX ma aapnu swagat chhe. Bharat nu rashtriya sahakari platform. Private dalali commission shunya kari 100% poori majoori sidhi certified karigaro na bank account ma pohanche chhe.",
        englishSub: "Zero middleman fee. 100% of fair floor wage goes directly to certified technicians."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 દક્ષિણ ભારત • કર્ણાટક, તેલંગાણા, તમિલનાડુ, કેરળ",
        artisanHero: {
          name: "રમેશ બાબુ અને કે. સેલ્વમ",
          trade: "NSQF લેવલ-4 માસ્ટર પ્લમ્બર",
          region: "હૈદરાબાદ અને બેંગલુરુ યુનિટ",
          guild: "સધર્ન ટેકનિશિયન સહકારી ફેડરેશન",
          experience: "14+ વર્ષ અનુભવ",
          rating: "4.99 ★ (580 કામ)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. આધાર અને પોલીસ ચકાસણી",
        subtitle: "દરેક કારીગરનું બાયોમેટ્રિક આધાર, કૌશલ્ય પ્રમાણીકરણ અને પોલીસ વેરિફિકેશન કરવામાં આવે છે.",
        narration: "દરેક કારીગરનું બાયોમેટ્રિક આધાર, કૌશલ્ય પ્રમાણીકરણ અને પોલીસ વેરિફિકેશન કરવામાં આવે છે.",
        phoneticNarration: "Darek artisan nu UIDAI Aadhaar, State Skill Council pramanikaran ane police clearance baad j permission male chhe.",
        englishSub: "Biometric Aadhaar check, State Skill Council Level-4 certification, and police verification."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 પશ્ચિમ ભારત • ગુજરાત, મહારાષ્ટ્ર, ગોવા",
        artisanHero: {
          name: "સચિન ગાયકવાડ અને નેહા પટેલ",
          trade: "કુશળ સુથાર અને હોમ એપ્લાયન્સ નિષ્ણાત",
          region: "અમદાવાદ અને સુરત યુનિટ",
          guild: "વેસ્ટર્ન આર્ટિસન્સ સહકારી મંડળી",
          experience: "9+ વર્ષ અનુભવ",
          rating: "4.96 ★ (340 કામ)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. 4-અંકનો સુરક્ષા OTP",
        subtitle: "લાઇવ જીપીએસથી આગમન ટ્રૅક કરો અને ઓળખપત્ર જોયા પછી જ તમારો 4-અંકનો સુરક્ષા ઓટીપી આપો.",
        narration: "લાઇવ જીપીએસથી આગમન ટ્રૅક કરો અને ઓળખપત્ર જોયા પછી જ તમારો 4-અંકનો સુરક્ષા ઓટીપી આપો.",
        phoneticNarration: "Live GPS thi karigar nu aavanu track karo. Official cooperative photo ID card joya pachhi j tamaro 4-digit safety OTP share karo.",
        englishSub: "Track live on GPS. Share 4-digit safety OTP only after inspecting photo badge."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 પૂર્વ અને ઉત્તર-પૂર્વ ભારત • બંગાળ, અસમ, ઓડિશા",
        artisanHero: {
          name: "દેબંજન દાસ અને પ્રિયા બર્મન",
          trade: "ગ્રીન એનર્જી અને ક્લીન ટેક નિષ્ણાત",
          region: "કોલકાતા અને ગુવાહાટી યુનિટ",
          guild: "ઇસ્ટર્ન વર્કર્સ સહકારી યુનિયન",
          experience: "11+ વર્ષ અનુભવ",
          rating: "4.97 ★ (495 કામ)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "04. ભારત યુપીઆઈ તાત્કાલિક એસ્ક્રો",
        subtitle: "કામ પૂર્ણ થયા પછી ભારત યુપીઆઈ દ્વારા સીધું ચુકવણું કરો અને કામના પુરાવા સાથે રેટિંગ આપો.",
        narration: "કામ પૂર્ણ થયા પછી ભારત યુપીઆઈ દ્વારા સીધું ચુકવણું કરો અને કામના પુરાવા સાથે રેટિંગ આપો.",
        phoneticNarration: "Kaam joi ne Bharat UPI QR thi direct worker account ma payment transfer karo ane photo video proof sathe 5-star rating aapo.",
        englishSub: "Instant release via Bharat UPI directly to worker's DBT wallet with photo/video proof."
      }
    ]
  },
  pa: {
    code: "pa",
    langName: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    speechLang: "pa-IN",
    title: "ਰਾਸ਼ਟਰੀ ਸਹਿਕਾਰੀ ਮਜ਼ਦੂਰ ਮੰਚ ਵਾਕਥਰੂ",
    chapters: [
      {
        id: 1,
        timestamp: "00:00 - 00:08",
        regionBadge: "🏛️ ਉੱਤਰੀ & ਕੇਂਦਰੀ ਭਾਰਤ • ਪੰਜਾਬ, ਹਰਿਆਣਾ, ਦਿੱਲੀ, ਯੂਪੀ",
        artisanHero: {
          name: "ਹਰਪ੍ਰੀਤ ਸਿੰਘ ਅਤੇ ਰਾਜੇਸ਼ ਸ਼ਰਮਾ",
          trade: "ਸਰਟੀਫਾਈਡ ਸੋਲਰ ਅਤੇ ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ",
          region: "ਪੰਜਾਬ ਅਤੇ ਦਿੱਲੀ ਯੂਨਿਟ",
          guild: "ਉੱਤਰੀ ਊਰਜਾ ਕਾਮੇ ਸਹਿਕਾਰੀ ਸਭਾ",
          experience: "12+ ਸਾਲ ਦਾ ਤਜਰਬਾ",
          rating: "4.98 ★ (412 ਕੰਮ)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&q=80",
        title: "01. ਸਹਿਕਾਰੀ ਇਨਕਲਾਬ (0% ਕਮਿਸ਼ਨ)",
        subtitle: "ਵਿਚੋਲਿਆਂ ਦਾ ਕਮਿਸ਼ਨ ਖ਼ਤਮ ਕਰਕੇ 100% ਮਜ਼ਦੂਰੀ ਸਿੱਧੀ ਕਾਰੀਗਰਾਂ ਦੇ ਖਾਤੇ ਵਿੱਚ।",
        narration: "ਸਹਿਕਾਰੀ ਸੇਵਾ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਵਿਚੋਲਿਆਂ ਦਾ ਕਮਿਸ਼ਨ ਖ਼ਤਮ ਕਰਕੇ 100% ਮਜ਼ਦੂਰੀ ਸਿੱਧੀ ਕਾਰੀਗਰਾਂ ਦੇ ਖਾਤੇ ਵਿੱਚ।",
        phoneticNarration: "Sat Sri Akal! COOPNEX vich tuhada swagat hai, Bharat da rashtriya cooperative mazdoor platform. Vicholeya di commission khatam karke 100% poori mazdoori sidhe certified karigaran de bank khate vich pahunchdi hai.",
        englishSub: "Zero intermediary fee. 100% of fair floor wage goes directly to certified artisans."
      },
      {
        id: 2,
        timestamp: "00:08 - 00:16",
        regionBadge: "🌊 ਦੱਖਣੀ ਭਾਰਤ • ਕਰਨਾਟਕ, ਤੇਲੰਗਾਨਾ, ਤਾਮਿਲਨਾਡੂ, ਕੇਰਲ",
        artisanHero: {
          name: "ਰਮੇਸ਼ ਬਾਬੂ ਅਤੇ ਕੇ. ਸੇਲਵਮ",
          trade: "NSQF ਲੈਵਲ-4 ਮਾਸਟਰ ਪਲੰਬਰ",
          region: "ਹੈਦਰਾਬਾਦ ਅਤੇ ਬੰਗਲੌਰ ਯੂਨਿਟ",
          guild: "ਸਾਊਦਰਨ ਟੈਕਨੀਸ਼ੀਅਨਜ਼ ਸਹਿਕਾਰੀ ਫੈਡਰੇਸ਼ਨ",
          experience: "14+ ਸਾਲ ਦਾ ਤਜਰਬਾ",
          rating: "4.99 ★ (580 ਕੰਮ)",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
        title: "02. ਆਧਾਰ ਅਤੇ ਪੁਲਿਸ ਪੜਤਾਲ",
        subtitle: "ਹਰ ਕਾਰੀਗਰ ਦੀ ਬਾਇਓਮੈਟ੍ਰਿਕ ਆਧਾਰ ਜਾਂਚ, ਹੁਨਰ ਪ੍ਰਮਾਣੀਕਰਨ ਅਤੇ ਪੁਲਿਸ ਵੈਰੀਫਿਕੇਸ਼ਨ ਹੁੰਦੀ ਹੈ।",
        narration: "ਹਰ ਕਾਰੀਗਰ ਦੀ ਬਾਇਓਮੈਟ੍ਰਿਕ ਆਧਾਰ ਜਾਂਚ, ਹੁਨਰ ਪ੍ਰਮਾਣੀਕਰਨ ਅਤੇ ਪੁਲਿਸ ਵੈਰੀਫਿਕੇਸ਼ਨ ਹੁੰਦੀ ਹੈ।",
        phoneticNarration: "Har artisan di UIDAI Aadhaar, State Skill Council certification te local police clearance to baad hi kam te bhejea janda hai.",
        englishSub: "Biometric Aadhaar check, State Skill Council Level-4 certification, and police verification."
      },
      {
        id: 3,
        timestamp: "00:16 - 00:24",
        regionBadge: "🌇 ਪੱਛਮੀ ਭਾਰਤ • ਮਹਾਰਾਸ਼ਟਰ, ਗੁਜਰਾਤ, ਗੋਆ",
        artisanHero: {
          name: "ਸਚਿਨ ਗਾਇਕਵਾੜ ਅਤੇ ਨੇਹਾ ਪਟੇਲ",
          trade: "ਹੁਨਰਮੰਦ ਤਰਖਾਣ ਅਤੇ ਘਰੇਲੂ ਉਪਕਰਣ ਮਾਹਿਰ",
          region: "ਮੁੰਬਈ ਅਤੇ ਪੁਣੇ ਯੂਨਿਟ",
          guild: "ਵੈਸਟਰਨ ਆਰਟੀਸਨਜ਼ ਸਹਿਕਾਰੀ",
          experience: "9+ ਸਾਲ ਦਾ ਤਜਰਬਾ",
          rating: "4.96 ★ (340 ਕੰਮ)",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80",
        title: "03. 4-ਅੰਕਾਂ ਦਾ ਸੁਰੱਖਿਆ OTP",
        subtitle: "ਲਾਈਵ ਜੀਪੀਐਸ ਨਾਲ ਟ੍ਰੈਕ ਕਰੋ ਅਤੇ ਸ਼ਨਾਖਤੀ ਕਾਰਡ ਵੇਖ ਕੇ ਹੀ ਆਪਣਾ 4-ਅੰਕਾਂ ਦਾ ਸੁਰੱਖਿਆ ਓਟੀਪੀ ਦਿਓ।",
        narration: "ਲਾਈਵ ਜੀਪੀਐਸ ਨਾਲ ਟ੍ਰੈਕ ਕਰੋ ਅਤੇ ਸ਼ਨਾਖਤੀ ਕਾਰਡ ਵੇਖ ਕੇ ਹੀ ਆਪਣਾ 4-ਅੰਕਾਂ ਦਾ ਸੁਰੱਖਿਆ ਓਟੀਪੀ ਦਿਓ।",
        phoneticNarration: "Live GPS naal worker da auna track karo. Cooperative da official photo badge dekh ke hi apna 4-digit safety OTP dso.",
        englishSub: "Track live on GPS. Share 4-digit safety OTP only after checking official photo badge."
      },
      {
        id: 4,
        timestamp: "00:24 - 00:32",
        regionBadge: "🌿 ਪੂਰਬੀ ਅਤੇ ਉੱਤਰ-ਪੂਰਬੀ ਭਾਰਤ • ਬੰਗਾਲ, ਅਸਾਮ, ਉੜੀਸਾ",
        artisanHero: {
          name: "ਦੇਬਾਂਜਨ ਦਾਸ ਅਤੇ ਪ੍ਰਿਆ ਬਰਮਨ",
          trade: "ਗ੍ਰੀਨ ਐਨਰਜੀ ਅਤੇ ਸੈਨੀਟੇਸ਼ਨ ਮਾਹਿਰ",
          region: "ਕੋਲਕਾਤਾ ਅਤੇ ਗੁਵਾਹਾਟੀ ਯੂਨਿਟ",
          guild: "ਈਸਟਰਨ ਵਰਕਰਜ਼ ਸਹਿਕਾਰੀ ਯੂਨੀਅਨ",
          experience: "11+ ਸਾਲ ਦਾ ਤਜਰਬਾ",
          rating: "4.97 ★ (495 ਕੰਮ)",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
        },
        bgImageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&q=80",
        title: "04. ਭਾਰਤ ਯੂਪੀਆਈ ਤੁਰੰਤ ਐਸਕਰੋ",
        subtitle: "ਕੰਮ ਦੀ ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਭਾਰਤ ਯੂਪੀਆਈ ਨਾਲ ਸਿੱਧਾ ਭੁਗਤਾਨ ਕਰੋ ਅਤੇ ਫੋਟੋ ਸਬੂਤਾਂ ਨਾਲ ਰੇਟਿੰਗ ਦਿਓ।",
        narration: "ਕੰਮ ਦੀ ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਭਾਰਤ ਯੂਪੀਆਈ ਨਾਲ ਸਿੱਧਾ ਭੁਗਤਾਨ ਕਰੋ ਅਤੇ ਫੋਟੋ ਸਬੂਤਾਂ ਨਾਲ ਰੇਟਿੰਗ ਦਿਓ।",
        phoneticNarration: "Kam check karke Bharat UPI QR raahi direct worker account vich payment transfer karo te photo video saboot naal 5-star rating devo.",
        englishSub: "Instant release via Bharat UPI directly to worker's DBT wallet with photo/video proof."
      }
    ]
  }
};

export const getSceneDurationMs = (lang: string): number => {
  switch (lang) {
    case "te":
      return 18000; // Conversational Telugu narration requires ~17-18s
    case "ta":
    case "kn":
    case "ml":
    case "mr":
    case "bn":
    case "gu":
    case "pa":
      return 16000;
    case "hi":
      return 15000;
    case "en":
    default:
      return 14000;
  }
};

export const ContinuousPortalVideo: React.FC<ContinuousPortalVideoProps> = ({
  currentLanguage = "en",
  onOpenModal,
  onClose
}) => {
  const [selectedLang, setSelectedLang] = useState<string>(() => {
    return VIDEO_NARRATIONS[currentLanguage] ? currentLanguage : "en";
  });
  const [displayMode, setDisplayMode] = useState<"simulation" | "camera">("simulation");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceoverActive, setIsVoiceoverActive] = useState(true);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [elapsedInSceneMs, setElapsedInSceneMs] = useState(0);
  const [manualImageIdx, setManualImageIdx] = useState<number | null>(null);

  const isAudioSpeakingRef = useRef(false);

  const [voiceEngineStatus, setVoiceEngineStatus] = useState<{
    speaking: boolean;
    isNative: boolean;
    voiceName: string;
  }>({
    speaking: false,
    isNative: false,
    voiceName: ""
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentNarration = VIDEO_NARRATIONS[selectedLang] || VIDEO_NARRATIONS.en;
  const currentChapter = currentNarration.chapters[activeChapterIdx] || currentNarration.chapters[0];

  const sceneDurationMs = getSceneDurationMs(selectedLang);
  const activeGallery = CHAPTER_GALLERY_IMAGES[activeChapterIdx] || [];
  const autoImageIdx = Math.min(4, Math.floor((elapsedInSceneMs / sceneDurationMs) * 5));
  const currentVisualIdx = manualImageIdx !== null ? manualImageIdx : autoImageIdx;
  const currentVisual = activeGallery[currentVisualIdx] || {
    url: currentChapter.bgImageUrl,
    tag: `0${currentVisualIdx + 1}/05 • STORY PHASE`,
    caption: currentChapter.title,
    subcaption: currentChapter.subtitle
  };

  const getKenBurnsEffect = (idx: number) => {
    switch (idx % 5) {
      case 0:
        return "scale-105 transition-transform duration-1000 ease-out";
      case 1:
        return "scale-110 -translate-x-1.5 transition-transform duration-1000 ease-out";
      case 2:
        return "scale-105 translate-y-1.5 transition-transform duration-1000 ease-out";
      case 3:
        return "scale-110 translate-x-1.5 transition-transform duration-1000 ease-out";
      case 4:
      default:
        return "scale-105 -translate-y-1.5 transition-transform duration-1000 ease-out";
    }
  };

  // Reset manual image selection when chapter changes
  useEffect(() => {
    setManualImageIdx(null);
  }, [activeChapterIdx]);

  // Pleasant Web Audio chime for transitions and button interactions
  const playAudioChime = (toneFreq = 587.33) => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(toneFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(toneFreq * 1.5, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // AudioContext blocked or unsupported
    }
  };

  // Sync selected video language when page language changes
  useEffect(() => {
    if (VIDEO_NARRATIONS[currentLanguage]) {
      setSelectedLang(currentLanguage);
    }
  }, [currentLanguage]);

  // Decoupled, rock-solid autoplay timer engine:
  // Runs strictly every 100ms when playing, advancing scenes smoothly based on language duration.
  // Speech-safety guard: Never cuts off speech! If TTS is speaking, holds at near-completion until done.
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 100;
    const intervalId = window.setInterval(() => {
      setElapsedInSceneMs((prev) => {
        const next = prev + intervalMs;
        if (next >= sceneDurationMs) {
          const ttsState = ttsService.getState();
          const isBusySpeaking = isAudioSpeakingRef.current || ttsState.status === "PLAYING" || ttsState.status === "LOADING";
          if (isVoiceoverActive && isBusySpeaking) {
            // Voice is still speaking! Hold smoothly without cutting off
            return sceneDurationMs - 150;
          }
          setActiveChapterIdx((curr) => (curr + 1) % 4);
          setManualImageIdx(null);
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPlaying, sceneDurationMs, isVoiceoverActive]);

  // Pre-load available SpeechSynthesis voices on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Stop audio playback when component unmounts or is closed
  useEffect(() => {
    return () => {
      isAudioSpeakingRef.current = false;
      ttsService.stop();
    };
  }, []);

  // Centralized Multilingual Speech Engine:
  // Leverages backend Google Cloud TTS (Neural/Standard Indian voices) with intelligent client fallback
  const speakNarration = (nativeText: string, phoneticText: string, speechLang: string) => {
    const langKey = (speechLang.split("-")[0].toLowerCase()) as Language;
    isAudioSpeakingRef.current = true;
    ttsService.speak(nativeText, {
      id: `video_chapter_${activeChapterIdx}`,
      language: langKey,
      phoneticText,
      onStart: () => {
        isAudioSpeakingRef.current = true;
        const state = ttsService.getState();
        setVoiceEngineStatus({
          speaking: true,
          isNative: state.provider !== "browser-phonetic",
          voiceName: state.voiceUsed || "Speech Engine"
        });
      },
      onEnd: () => {
        isAudioSpeakingRef.current = false;
        setVoiceEngineStatus((prev) => ({ ...prev, speaking: false }));
      },
      onError: () => {
        isAudioSpeakingRef.current = false;
        setVoiceEngineStatus((prev) => ({ ...prev, speaking: false }));
      }
    });
  };

  // Trigger speech when chapter or language changes (if voiceover enabled and actively playing)
  useEffect(() => {
    if (isVoiceoverActive && isPlaying) {
      const chapter = currentNarration.chapters[activeChapterIdx];
      if (chapter) {
        speakNarration(chapter.narration, chapter.phoneticNarration, currentNarration.speechLang);
      }
    }
  }, [activeChapterIdx, isVoiceoverActive, selectedLang, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  const handleLanguageSelect = (code: string) => {
    setSelectedLang(code);
    setIsVoiceoverActive(true);
    setIsMuted(false);
    setElapsedInSceneMs(0);
    setManualImageIdx(null);
    playAudioChime(659.25);
    const narration = VIDEO_NARRATIONS[code] || VIDEO_NARRATIONS.en;
    const chapter = narration.chapters[activeChapterIdx] || narration.chapters[0];
    if (chapter) {
      speakNarration(chapter.narration, chapter.phoneticNarration, narration.speechLang);
    }
  };

  const jumpToChapter = (idx: number) => {
    setActiveChapterIdx(idx);
    setElapsedInSceneMs(0);
    setManualImageIdx(null);
    playAudioChime();
    if (isVoiceoverActive) {
      const chapter = currentNarration.chapters[idx];
      if (chapter) {
        speakNarration(chapter.narration, chapter.phoneticNarration, currentNarration.speechLang);
      }
    }
  };

  const handleNextScene = () => {
    jumpToChapter((activeChapterIdx + 1) % 4);
  };

  const handlePrevScene = () => {
    jumpToChapter((activeChapterIdx - 1 + 4) % 4);
  };

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (isVoiceoverActive) {
      if (!nextPlaying) {
        ttsService.pause();
      } else {
        ttsService.resume();
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      setIsVoiceoverActive(false);
      ttsService.stop();
      setVoiceEngineStatus((prev) => ({ ...prev, speaking: false }));
    } else {
      setIsVoiceoverActive(true);
      playAudioChime(523.25);
      if (currentChapter) {
        speakNarration(currentChapter.narration, currentChapter.phoneticNarration, currentNarration.speechLang);
      }
    }
  };

  const toggleVoiceover = () => {
    const next = !isVoiceoverActive;
    setIsVoiceoverActive(next);
    if (next) {
      setIsMuted(false);
      playAudioChime(587.33);
      if (currentChapter) {
        speakNarration(currentChapter.narration, currentChapter.phoneticNarration, currentNarration.speechLang);
      }
    } else {
      ttsService.stop();
      setVoiceEngineStatus((prev) => ({ ...prev, speaking: false }));
    }
  };

  const replayCurrentSpeech = () => {
    setIsVoiceoverActive(true);
    setIsMuted(false);
    playAudioChime();
    if (currentChapter) {
      speakNarration(currentChapter.narration, currentChapter.phoneticNarration, currentNarration.speechLang);
    }
  };

  // Overall timeline calculation:
  const totalShowcaseDurationMs = 4 * sceneDurationMs;
  const currentTotalElapsedMs = activeChapterIdx * sceneDurationMs + elapsedInSceneMs;
  const overallTimelineProgress = Math.min(100, (currentTotalElapsedMs / totalShowcaseDurationMs) * 100);
  const remainingSecondsInScene = Math.max(1, Math.ceil((sceneDurationMs - elapsedInSceneMs) / 1000));

  const handleClose = () => {
    playAudioChime(440);
    ttsService.stop();
    setIsVoiceoverActive(false);
    if (onClose) onClose();
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-blue-950/40 overflow-hidden relative text-white my-6 max-w-6xl mx-auto ring-1 ring-blue-500/20">
      {/* Top Bar: Live Beacon, Multilingual Audio Selector & Close Button */}
      <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-950/95 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2.5 relative z-20">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>24/7 PAN-INDIA SHOWCASE</span>
          </span>
          <span className="text-[9px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 hidden sm:inline font-mono">
            LIVE 1080P
          </span>
        </div>

        {/* View Mode Switcher + Multilingual Audio Switcher + Close Button */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setDisplayMode("simulation")}
              className={`px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 cursor-pointer text-[11px] ${
                displayMode === "simulation"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Pan-India Tour</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode("camera")}
              className={`px-2 py-0.5 rounded-md font-bold transition flex items-center gap-1 cursor-pointer text-[11px] ${
                displayMode === "camera"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Camera className="w-3 h-3 text-blue-300" />
              <span>Live Feed</span>
            </button>
          </div>

          {/* Multilingual Audio Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 overflow-x-auto max-w-full">
            {Object.keys(VIDEO_NARRATIONS).map((code) => {
              const item = VIDEO_NARRATIONS[code];
              const isSelected = selectedLang === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLanguageSelect(code)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs ring-1 ring-blue-400/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                  title={`${item.langName} (${item.nativeName}) - Click to speak in this language`}
                >
                  <span>{item.nativeName}</span>
                </button>
              );
            })}
          </div>

          {/* Voice Narration Audio Synthesizer Button */}
          <button
            type="button"
            onClick={toggleVoiceover}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isVoiceoverActive
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20 font-black animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
            title="Listen to real-time speech narration in the selected Indian language"
          >
            <Headphones className="w-3 h-3" />
            <span>{isVoiceoverActive ? `Voice ON (${currentNarration.nativeName})` : "Listen"}</span>
          </button>

          {/* Close Button in Top Bar */}
          {onClose && (
            <button
              type="button"
              onClick={handleClose}
              className="px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer bg-slate-800 hover:bg-rose-600/90 text-slate-300 hover:text-white border border-slate-700 hover:border-rose-500"
              title="Close Video Showcase"
              aria-label="Close Video Showcase"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Viewport Stage: Constrained to fit screen comfortably (420px-480px max-h 64vh) */}
      <div className="relative h-[420px] sm:h-[450px] md:h-[480px] max-h-[64vh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden group select-none">
        {/* Cultural Background Photography Multi-Image Gallery with smooth crossfade */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {activeGallery.map((visual, vIdx) => {
            const isVisible = vIdx === currentVisualIdx;
            return (
              <img
                key={`bg_${activeChapterIdx}_${vIdx}`}
                src={visual.url}
                alt={visual.caption}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                  isVisible ? "opacity-25 scale-105 filter blur-[3px]" : "opacity-0 scale-100"
                }`}
              />
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />
        </div>

        {/* Floating Manual Slide Navigation Controls */}
        <button
          type="button"
          onClick={handlePrevScene}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-blue-600 text-white border border-white/20 shadow-xl transition-all hover:scale-105 cursor-pointer backdrop-blur-md group"
          title="Previous Regional Scene (←)"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={handleNextScene}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-blue-600 text-white border border-white/20 shadow-xl transition-all hover:scale-105 cursor-pointer backdrop-blur-md group"
          title="Next Regional Scene (→)"
        >
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Floating Quick Close Button on top-right of the video stage */}
        {onClose && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-black/70 hover:bg-rose-600 text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-lg"
            title="Close Video"
            aria-label="Close Video"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {/* CLICK TO PLAY OVERLAY (When paused on initial load or manual pause) */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-35 bg-slate-950/75 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group transition-all"
            title="Click anywhere to play video tour"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-transform ring-4 ring-white/30">
              <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current ml-1.5 text-white" />
            </div>
            <div className="mt-4 text-center px-4 space-y-1.5">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg border border-blue-400/50">
                ▶ Click to Start Interactive Video Tour
              </span>
              <p className="text-xs text-slate-300 font-medium max-w-sm mx-auto">
                Narrated in 10 Indian Languages • 0% Commission Cooperative Walkthrough
              </p>
            </div>
          </div>
        )}

        {/* MODE 1: PAN-INDIA MULTI-REGION INTERACTIVE SHOWCASE STAGE */}
        {displayMode === "simulation" && (
          <div className="absolute inset-0 p-2 sm:p-3.5 flex flex-col justify-between z-10">
            {/* Top Region Badge & Story-style Segmented Progress */}
            <div>
              {/* Story-style segmented chapter progress indicators */}
              <div className="grid grid-cols-4 gap-1.5 mb-1.5 max-w-lg mx-auto">
                {[0, 1, 2, 3].map((idx) => {
                  let fillPct = 0;
                  if (idx < activeChapterIdx) fillPct = 100;
                  else if (idx === activeChapterIdx) fillPct = (elapsedInSceneMs / sceneDurationMs) * 100;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => jumpToChapter(idx)}
                      className="h-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                      title={`Jump to Scene ${idx + 1}`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-100 ease-linear"
                        style={{ width: `${fillPct}%` }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Header Badges */}
              <div className="flex items-center justify-between flex-wrap gap-1 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="bg-blue-600/90 backdrop-blur-md text-white font-mono font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full border border-blue-400/40 shadow-md flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{currentChapter.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full hidden md:inline">
                    {currentChapter.regionBadge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950/70 border border-amber-700/80 px-2.5 py-0.5 rounded-full shadow-xs">
                    SCENE {activeChapterIdx + 1} OF 4 • NEXT IN {remainingSecondsInScene}S
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Center Stage Graphics Screen: Split Multi-Image Video Storyboard & Proof Card */}
            <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center gap-2.5 my-1 sm:my-1.5 max-w-5xl mx-auto w-full px-1 overflow-hidden">
              
              {/* LEFT COLUMN: LIVE MULTI-IMAGE CINEMATIC STORYBOARD WITH DYNAMIC KEN BURNS EFFECT */}
              <div className="w-full md:w-1/2 h-[195px] sm:h-[220px] md:h-[235px] rounded-2xl overflow-hidden relative border border-white/20 shadow-xl bg-black/70 group flex flex-col justify-between p-2.5 shrink-0">
                {/* Visuals Crossfade Layer with 5-photo Ken Burns pan/zoom */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {activeGallery.map((visual, vIdx) => {
                    const isVisible = vIdx === currentVisualIdx;
                    return (
                      <div
                        key={`stage_visual_${activeChapterIdx}_${vIdx}`}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <img
                          src={visual.url}
                          alt={visual.caption}
                          className={`w-full h-full object-cover transform ${
                            isVisible ? getKenBurnsEffect(vIdx) : "scale-100"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60" />
                      </div>
                    );
                  })}
                </div>

                {/* Top Overlay: Story Step Tag & 5-Step Visual Thumbnail Pill Navigator */}
                <div className="relative z-10 flex items-center justify-between gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-amber-300 border border-amber-400/50 text-[9px] sm:text-[10px] font-mono font-bold shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{currentVisual.tag}</span>
                  </span>

                  {/* 5 Step Indicator Pills with photo tooltip */}
                  <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    {activeGallery.map((v, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setManualImageIdx(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          currentVisualIdx === idx
                            ? "w-5 sm:w-6 bg-emerald-400 shadow-xs shadow-emerald-400/80"
                            : "w-1.5 bg-white/40 hover:bg-white/80"
                        }`}
                        title={`Photo ${idx + 1}/5: ${v.caption}`}
                      />
                    ))}
                    <span className="text-[9px] font-mono text-slate-300 ml-0.5">
                      {currentVisualIdx + 1}/5
                    </span>
                  </div>
                </div>

                {/* Soundwave Visualizer if speaking */}
                {isVoiceoverActive && voiceEngineStatus.speaking && (
                  <div className="relative z-10 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/85 border border-emerald-500/50 rounded-full w-fit backdrop-blur-xs shadow-md">
                    <div className="flex items-center gap-0.5 h-2.5">
                      <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-2" />
                      <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2.5" />
                      <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.45s] h-1.5" />
                      <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s] h-2" />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-300">Live Voice Synced</span>
                  </div>
                )}

                {/* Bottom Overlay: Caption & Trade Context */}
                <div className="relative z-10 p-2 sm:p-2.5 bg-slate-950/90 backdrop-blur-md rounded-xl border border-white/15 text-left space-y-0.5 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50">
                      Verified Trade Photo
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 truncate">
                      {currentNarration.nativeName}
                    </span>
                  </div>
                  <h4 className="text-white text-xs font-bold leading-tight drop-shadow-xs line-clamp-1">
                    {currentVisual.caption}
                  </h4>
                  <p className="text-slate-300 text-[10px] leading-tight line-clamp-2">
                    {currentVisual.subcaption}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE PROOF & TRUST CARD (Fits cleanly within 235px) */}
              <div className="w-full md:w-1/2 h-[195px] sm:h-[220px] md:h-[235px] flex items-center justify-center shrink-0">
                {/* SCENE 0: NORTH & CENTRAL INDIA (0% COMMISSION REVOLUTION) */}
                {activeChapterIdx === 0 && (
                  <div className="w-full h-full bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-3 shadow-xl animate-fadeIn flex flex-col justify-between overflow-hidden">
                    {/* Dual Male & Female Cooperative Lead Team Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center -space-x-2 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&q=80"
                            alt="Ramesh Kumar (Certified Pro)"
                            className="w-8 h-8 rounded-full ring-2 ring-blue-500 object-cover z-10"
                            title="Ramesh Kumar (Field Artisan)"
                          />
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
                            alt="Sujatha Devi (Cooperative Director)"
                            className="w-8 h-8 rounded-full ring-2 ring-purple-500 object-cover"
                            title="Sujatha Devi (Federation Leader)"
                          />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-bold text-white leading-none">
                              Ramesh &amp; Sujatha
                            </h4>
                            <span className="text-[9px] bg-blue-600/30 text-blue-300 px-1 py-0.2 rounded border border-blue-500/30 font-bold">
                              Verified Duo
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Cooperative Artisan &amp; Federation Leader
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/50 border border-amber-800/60 px-2 py-0.5 rounded-full">
                        ★ 4.98 (Govt Vetted)
                      </span>
                    </div>

                    {/* Comparison Grid: Private Aggregator Cut vs COOPNEX Direct Wages */}
                    <div className="grid grid-cols-2 gap-2 my-auto">
                      <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-2 space-y-1 text-left">
                        <div className="flex items-center justify-between text-[9px] font-bold text-red-400 uppercase">
                          <span>Aggregator Apps</span>
                          <span className="text-red-500">❌ Cut</span>
                        </div>
                        <div className="text-xs font-bold text-white">₹800 Job Bill</div>
                        <div className="space-y-0.5 text-[10px] text-slate-300">
                          <div className="flex justify-between">
                            <span>Comm (28%):</span>
                            <span className="text-red-400 font-bold">-₹224</span>
                          </div>
                          <div className="flex justify-between font-bold text-red-200 border-t border-red-800/30 pt-0.5">
                            <span>Take Home:</span>
                            <span className="text-red-400">₹527</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-950/30 border border-emerald-500/50 rounded-xl p-2 space-y-1 text-left relative overflow-hidden shadow-xs">
                        <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400 uppercase">
                          <span>COOPNEX</span>
                          <span className="text-emerald-400">✓ 100%</span>
                        </div>
                        <div className="text-xs font-bold text-white">₹800 Job Bill</div>
                        <div className="space-y-0.5 text-[10px] text-slate-300">
                          <div className="flex justify-between">
                            <span>Commission:</span>
                            <span className="text-emerald-400 font-bold">₹0 (ZERO)</span>
                          </div>
                          <div className="flex justify-between font-bold text-emerald-200 border-t border-emerald-800/40 pt-0.5">
                            <span>Artisan Gets:</span>
                            <span className="text-emerald-300 font-black">₹800 Direct</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 rounded-lg px-2 py-1 text-center font-semibold">
                      ⚡ 100% Statutory Fair Wage Deposited Directly via Direct Benefit Transfer
                    </div>
                  </div>
                )}

                {/* SCENE 1: SOUTH INDIA (5-TIER UIDAI & POLICE VERIFICATION) */}
                {activeChapterIdx === 1 && (
                  <div className="w-full h-full bg-slate-900/95 backdrop-blur-md border border-blue-500/40 rounded-2xl p-3 shadow-xl space-y-2 relative overflow-hidden animate-fadeIn flex flex-col justify-between">
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center -space-x-2 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&q=80"
                            alt="Ramesh Kumar (Certified Artisan)"
                            className="w-8 h-8 rounded-full ring-2 ring-emerald-500 object-cover z-10"
                            title="Ramesh Kumar (Level 4 Certified)"
                          />
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
                            alt="Sujatha Devi (Cooperative Director)"
                            className="w-8 h-8 rounded-full ring-2 ring-blue-500 object-cover"
                            title="Sujatha Devi (UIDAI Vetted Director)"
                          />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1">
                            <h4 className="text-xs font-bold text-white leading-none">
                              Ramesh &amp; Sujatha
                            </h4>
                            <span className="text-[9px] bg-emerald-600/30 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/30 font-bold">
                              UIDAI Verified
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Biometric Aadhaar &amp; Police PCC Cleared
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/40">
                        ✓ 100% VERIFIED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5 text-left">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">UIDAI Verhoeff: VALID</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5 text-left">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Police Clearance: VERIFIED</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5 text-left">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Skill Council: LEVEL 4</span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1.5 text-left">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Biometric KYC: MATCHED</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-blue-300 bg-blue-950/60 border border-blue-800/50 rounded-lg px-2 py-1 text-center font-semibold">
                      🛡️ Complete Household Safety • Zero Unverified Artisans Permitted
                    </div>
                  </div>
                )}

                {/* SCENE 2: WEST INDIA (DOORSTEP SAFETY & 4-DIGIT OTP WITH ANIMATED RADAR) */}
                {activeChapterIdx === 2 && (
                  <div className="w-full h-full bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-xl animate-fadeIn flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
                        <span>Live Doorstep Radar • ETA: 8 Mins</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
                        26 km/h • Electric
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                      {/* Animated GPS Radar Sweep Icon */}
                      <div className="relative w-11 h-11 rounded-full border border-emerald-500/40 bg-emerald-950/30 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping [animation-duration:2s]" />
                        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-spin [animation-duration:3s]" />
                        <MapPin className="w-4 h-4 text-orange-400 z-10 animate-pulse" />
                      </div>

                      <div className="text-left flex-1">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Doorstep Safety OTP</span>
                        <div className="text-xl font-black font-mono tracking-widest text-amber-300">
                          7 4 9 2
                        </div>
                        <span className="text-[9px] text-emerald-400 block">
                          🔒 Share after checking photo badge
                        </span>
                      </div>

                      <div className="text-right flex items-center gap-1.5 justify-end">
                        <div className="flex items-center -space-x-2 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&q=80"
                            alt="Ramesh Kumar (Electric Transit)"
                            className="w-7 h-7 rounded-full ring-2 ring-amber-400 object-cover z-10"
                            title="Ramesh Kumar (Lead Technician)"
                          />
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
                            alt="Sujatha Devi (Cooperative Dispatch)"
                            className="w-7 h-7 rounded-full ring-2 ring-purple-400 object-cover"
                            title="Sujatha Devi (Dispatch Supervisor)"
                          />
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-white block leading-tight">Ramesh &amp; Sujatha</span>
                          <span className="text-[9px] text-emerald-400 block font-medium">En Route • Live ID</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-800/50 rounded-lg px-2 py-1 text-center font-semibold">
                      📍 Real-time GPS Location Verified via Electric Fleet Dispatch Network
                    </div>
                  </div>
                )}

                {/* SCENE 3: EAST & NORTH-EAST INDIA (INSTANT BHARAT UPI ESCROW DBT WITH SOUNDBOX ANIMATION) */}
                {activeChapterIdx === 3 && (
                  <div className="w-full h-full bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 shadow-xl animate-fadeIn flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <div className="flex items-center gap-2">
                        {/* Dual Male & Female Beneficiary Badge */}
                        <div className="flex items-center -space-x-2 shrink-0">
                          <img
                            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&q=80"
                            alt="Ramesh Kumar"
                            className="w-7 h-7 rounded-full ring-2 ring-emerald-400 object-cover z-10"
                            title="Ramesh Kumar"
                          />
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80"
                            alt="Sujatha Devi"
                            className="w-7 h-7 rounded-full ring-2 ring-teal-400 object-cover"
                            title="Sujatha Devi"
                          />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white leading-none">Bharat UPI Instant Escrow</h4>
                            <span className="text-[8px] bg-emerald-600/30 text-emerald-300 px-1 py-0.2 rounded border border-emerald-500/30 font-bold">
                              Direct DBT
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Ramesh &amp; Sujatha DBT Wallet: +₹800.00 (Zero Fee)</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                        ✓ Instant Released
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5 text-left">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Work Media Proof</span>
                        <span className="text-white font-bold block">2 Photos + 1 Video</span>
                        <span className="text-[9px] text-blue-400 block">✓ Tamper-proof Geotag</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5 text-left">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Citizen Review</span>
                        <span className="text-amber-400 font-bold block">★ ★ ★ ★ ★ (5.0)</span>
                        <span className="text-[9px] text-slate-400 block">Household Feedback</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 rounded-lg px-2 py-1 text-center font-semibold">
                      💳 Auto-Released from Escrow directly into Artisan's Cooperative Jan Dhan Bank
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dual-Script Subtitle Bar + Voice Status Indicator */}
            <div className="text-center space-y-1">
              <div className="inline-block max-w-2xl bg-black/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl shadow-md">
                {/* Native Script Subtitle */}
                <p className="text-xs sm:text-sm font-bold text-amber-200 leading-tight">
                  {currentChapter.subtitle}
                </p>
                {/* Romanized Phonetic / English Guide */}
                <p className="text-[10px] text-slate-300 mt-0.5 font-sans leading-tight">
                  {currentChapter.englishSub}
                </p>
              </div>

              {/* Spoken Voice Engine Status Badge */}
              <div className="flex items-center justify-center gap-2">
                {voiceEngineStatus.speaking && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-[9px] font-mono text-emerald-300">
                    <div className="flex items-center gap-0.5 h-2.5">
                      <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-2" />
                      <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2.5" />
                      <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.45s] h-1.5" />
                      <span className="w-0.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.2s] h-2" />
                    </div>
                    <span>
                      {voiceEngineStatus.isNative
                        ? `🎙️ Speaking: ${currentNarration.nativeName} (Native Voice)`
                        : `🎙️ Assist: ${currentNarration.langName} Phonetic Guide`}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={replayCurrentSpeech}
                  className="text-[9px] font-mono text-blue-300 hover:text-white bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700 transition cursor-pointer flex items-center gap-1"
                  title="Replay narration"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Replay Audio</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: CAMERA VIDEO STREAM VIEWPORT */}
        {displayMode === "camera" && (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              poster={currentChapter.bgImageUrl}
              className="w-full h-full object-cover"
            >
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                type="video/mp4"
              />
              Your browser does not support HTML5 video.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

            <div className="absolute bottom-14 left-4 right-4 text-center pointer-events-none z-10">
              <div className="inline-block max-w-xl bg-black/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl shadow-xl">
                <p className="text-xs sm:text-sm font-semibold text-amber-200 leading-snug">
                  {currentChapter.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Floating Play / Unmute Prompt Pill when voiceover is off */}
        {!isVoiceoverActive && (
          <button
            type="button"
            onClick={toggleVoiceover}
            className="absolute top-3 right-12 z-20 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 transition cursor-pointer border border-emerald-400/50"
          >
            <Headphones className="w-3 h-3" />
            <span>Listen in {currentNarration.nativeName}</span>
          </button>
        )}

        {/* Bottom Unified Control Bar */}
        <div className="absolute bottom-0 inset-x-0 p-2 sm:p-2.5 bg-gradient-to-t from-black/95 to-transparent flex items-center justify-between gap-2 z-20">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePlay}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <span className="text-[10px] font-mono text-slate-300 ml-1 hidden sm:inline">
              Narration: <strong className="text-white">{currentNarration.nativeName}</strong>
            </span>
          </div>

          {/* Interactive Scene Navigation Dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => jumpToChapter(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeChapterIdx === idx
                    ? "w-7 bg-emerald-400 shadow-xs shadow-emerald-400/60"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
                title={`Scene ${idx + 1}`}
              />
            ))}
          </div>

          {/* Smooth Overall Progress Bar */}
          <div className="flex-1 max-w-xs mx-2 h-1 bg-white/20 rounded-full overflow-hidden hidden md:block">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-100 ease-linear"
              style={{ width: `${overallTimelineProgress}%` }}
            />
          </div>

          {/* Right Action: Fullscreen Modal Button */}
          {onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
              title="Open full walkthrough modal"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Expanded</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive 4-Chapter Navigator Below Video */}
      <div className="p-2 sm:p-2.5 bg-slate-950 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {currentNarration.chapters.map((ch, idx) => (
          <button
            key={ch.id}
            type="button"
            onClick={() => jumpToChapter(idx)}
            className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
              activeChapterIdx === idx
                ? "bg-blue-900/40 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-400/30"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-0.5">
              <span>{ch.timestamp}</span>
              {activeChapterIdx === idx && (
                <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>ACTIVE</span>
                </span>
              )}
            </div>
            <h4 className="text-[11px] font-bold text-white truncate">{ch.title}</h4>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{ch.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
