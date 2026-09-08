import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable, getOptimalDevicePixelRatio } from "./WebGLDetector";
import {
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  Radio,
  Clock,
  CheckCircle2,
  Navigation,
  Sparkles,
  MapPin,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

interface Responder {
  id: string;
  name: string;
  society: string;
  distanceKm: number;
  etaMins: number;
  x: number;
  z: number;
  phone: string;
  rating: number;
  imageUrl: string;
  translations: Record<string, { trade: string }>;
}

const RESPONDERS: Responder[] = [
  {
    id: "r1",
    name: "Ramesh Sharma",
    society: "Urban Electricians Cooperative #42",
    distanceKm: 1.2,
    etaMins: 7,
    x: -1.8,
    z: 1.2,
    phone: "+91 98490 12345",
    rating: 4.96,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
    translations: {
      en: { trade: "Emergency High-Voltage Electrician" },
      hi: { trade: "आपातकालीन उच्च-वोल्टेज इलेक्ट्रीशियन" },
      te: { trade: "ఎమర్జెన్సీ హై-వోల్టేజ్ ఎలక్ట్రీషియన్" },
      ta: { trade: "அவசர உயர் மின்னழுத்த மின் பணியாளர்" },
      mr: { trade: "तातडीचा उच्च-दाब इलेक्ट्रिशियन" },
      kn: { trade: "ತುರ್ತು ಹೈ-ವೋಲ್ಟೇಜ್ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್" }
    }
  },
  {
    id: "r2",
    name: "Mohammed Irfan",
    society: "Telangana Shramik Society",
    distanceKm: 2.1,
    etaMins: 11,
    x: 2.4,
    z: -1.5,
    phone: "+91 94401 67890",
    rating: 4.98,
    imageUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    translations: {
      en: { trade: "Master Pipe & Valve Specialist" },
      hi: { trade: "मास्टर पाइप व वाल्व विशेषज्ञ" },
      te: { trade: "మాస్టర్ పైప్ & వాల్వ్ స్పెషలిస్ట్" },
      ta: { trade: "குழாய் & வால்வு முதன்மை நிபுணர்" },
      mr: { trade: "पाईप व व्हॉल्व्ह मुख्य तज्ञ" },
      kn: { trade: "ಪೈಪ್ ಮತ್ತು ವಾಲ್ವ್ ಪರಿಣತ" }
    }
  },
  {
    id: "r3",
    name: "Suresh Babu",
    society: "Deccan Artisan Federation",
    distanceKm: 3.4,
    etaMins: 14,
    x: -2.9,
    z: -2.1,
    phone: "+91 98850 54321",
    rating: 4.94,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    translations: {
      en: { trade: "Gas & Pipeline Safety Tech" },
      hi: { trade: "गैस व पाइपलाइन सुरक्षा तकनीशियन" },
      te: { trade: "గ్యాస్ & పైప్‌లైన్ సేఫ్టీ టెక్నీషియన్" },
      ta: { trade: "எரிவாயு & குழாய் பாதுகாப்பு நிபுணர்" },
      mr: { trade: "गॅस व पाईपलाईन सुरक्षा तंत्रज्ञ" },
      kn: { trade: "ಅನಿಲ ಮತ್ತು ಪೈಪ್‌ಲೈನ್ ಭದ್ರತಾ ತಂತ್ರಜ್ಞ" }
    }
  }
];

const RADAR_LABELS: Record<string, {
  title: string;
  subtitle: string;
  respondersTitle: string;
  simulateBtn: string;
  dispatchedTitle: string;
  dispatchedMsg: string;
  guaranteeText: string;
}> = {
  en: {
    title: "24/7 Rapid Cooperative Emergency Radar",
    subtitle: "Instant geo-dispatch for burst pipelines, electrical hazards, gas leaks, and urgent crises.",
    respondersTitle: "Nearest Certified Responders",
    simulateBtn: "Simulate SOS Dispatch",
    dispatchedTitle: "DISPATCH ORDER TRANSMITTED",
    dispatchedMsg: "is en route with statutory safety kit.",
    guaranteeText: "Zero surge penalty. Fixed cooperative emergency rate."
  },
  hi: {
    title: "24/7 त्वरित सहकारी आपातकालीन रडार",
    subtitle: "पाइप फटने, बिजली के खतरे, गैस रिसाव और आपातकालीन संकट के लिए त्वरित प्रेषण।",
    respondersTitle: "निकटतम प्रमाणित आपातकालीन तकनीशियन",
    simulateBtn: "एसओएस प्रेषण अनुकरण करें",
    dispatchedTitle: "प्रेषण आदेश प्रेषित किया गया",
    dispatchedMsg: "सुरक्षा किट के साथ रवाना हो चुके हैं।",
    guaranteeText: "शून्य सर्ज पेनल्टी। निश्चित सहकारी आपातकालीन दर।"
  },
  te: {
    title: "24/7 వేగవంతమైన సహకార ఎమర్జెన్సీ రాడార్",
    subtitle: "పైప్ లీకేజీలు, విద్యుత్ సమస్యలు, గ్యాస్ లీక్‌లకు తక్షణ సహాయం.",
    respondersTitle: "సమీప ధృవీకరించబడిన నిపుణులు",
    simulateBtn: "ఎస్ఓఎస్ డిస్పాచ్ సిమ్యులేట్ చేయండి",
    dispatchedTitle: "డిస్పాచ్ ఆర్డర్ జారీ చేయబడింది",
    dispatchedMsg: "భద్రతా కిట్‌తో ఇంటికి బయలుదేరారు.",
    guaranteeText: "అదనపు ఛార్జీలు లేవు. స్థిరమైన సహకార అత్యవసర ధర."
  },
  ta: {
    title: "24/7 விரைவு கூட்டுறவு அவசர ரேடார்",
    subtitle: "குழாய் வெடிப்பு, மின் விபத்து, எரிவாயு கசிவுக்கான உடனடி அவசர உதவி.",
    respondersTitle: "அருகிலுள்ள சான்றளிக்கப்பட்ட பணியாளர்கள்",
    simulateBtn: "அவசர உதவி சிமுலேஷன்",
    dispatchedTitle: "அவசர ஆணை அனுப்பப்பட்டது",
    dispatchedMsg: "பாதுகாப்பு உபகரணங்களுடன் புறப்பட்டுவிட்டார்.",
    guaranteeText: "சர்ஜ் கட்டணம் இல்லை. நிலையான கூட்டுறவு அவசர விலை."
  },
  mr: {
    title: "२४/७ जलद सहकारी आपत्कालीन रडार",
    subtitle: "पाईप गळती, विजेचे धोके, गॅस गळती यासाठी तात्काळ मदत.",
    respondersTitle: "जवळचे प्रमाणित आपत्कालीन तंत्रज्ञ",
    simulateBtn: "एसओएस डिस्पॅच सिम्युलेट करा",
    dispatchedTitle: "डिस्पॅच आदेश पाठवला गेला आहे",
    dispatchedMsg: "सुरक्षा किटसह घराकडे निघाले आहेत.",
    guaranteeText: "कोणतीही दरवाढ नाही. निश्चित सहकारी आपत्कालीन दर."
  },
  kn: {
    title: "೨೪/೭ ಕ್ಷಿಪ್ರ ಸಹಕಾರಿ ತುರ್ತು ರೇಡಾರ್",
    subtitle: "ಪೈಪ್ ಸೋರಿಕೆ, ವಿದ್ಯುತ್ ಅಪಾಯ, ಅನಿಲ ಸೋರಿಕೆಗೆ ತಕ್ಷಣದ ನೆರವು.",
    respondersTitle: "ಸಮೀಪದ ಪ್ರಮಾಣಿತ ತುರ್ತು ತಂತ್ರಜ್ಞರು",
    simulateBtn: "ಎಸ್ಒಎಸ್ ರವಾನೆ ಸಿಮ್ಯುಲೇಶನ್",
    dispatchedTitle: "ರವಾನೆ ಆದೇಶ ನೀಡಲಾಗಿದೆ",
    dispatchedMsg: "ಸುರಕ್ಷತಾ ಕಿಟ್‌ನೊಂದಿಗೆ ಹೊರಟಿದ್ದಾರೆ.",
    guaranteeText: "ಯಾವುದೇ ಸರ್ಜ್ ದಂಡವಿಲ್ಲ. ನಿಗದಿತ ತುರ್ತು ದರ."
  }
};

export const EmergencyRadar3D: React.FC = () => {
  const { language } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);
  const [selectedResponder, setSelectedResponder] = useState<Responder>(RESPONDERS[0]);
  const [etaCounter, setEtaCounter] = useState<number>(7);

  const langKey = RADAR_LABELS[language] ? language : "en";
  const labels = RADAR_LABELS[langKey] || RADAR_LABELS.en;

  useEffect(() => {
    if (!isWebGLAvailable()) return;

    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 9.5, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(getOptimalDevicePixelRatio());
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);

    const mainLight = new THREE.DirectionalLight(0x075e54, 2.0);
    mainLight.position.set(5, 12, 6);
    scene.add(mainLight);

    const ringMat = new THREE.LineBasicMaterial({
      color: 0x075e54,
      transparent: true,
      opacity: 0.35,
      linewidth: 1
    });

    [2, 4, 6].forEach((r) => {
      const geo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
      }
      geo.setFromPoints(points);
      const ring = new THREE.Line(geo, ringMat);
      scene.add(ring);
    });

    const crosshairMat = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.25
    });
    const chGeo1 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-6.5, 0, 0),
      new THREE.Vector3(6.5, 0, 0)
    ]);
    const chGeo2 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -6.5),
      new THREE.Vector3(0, 0, 6.5)
    ]);
    scene.add(new THREE.Line(chGeo1, crosshairMat));
    scene.add(new THREE.Line(chGeo2, crosshairMat));

    const sweepGroup = new THREE.Group();
    scene.add(sweepGroup);

    const sweepGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.05, 0),
      new THREE.Vector3(6.5, 0.05, 0)
    ]);
    const sweepMat = new THREE.LineBasicMaterial({
      color: 0x059669,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });
    const sweepLine = new THREE.Line(sweepGeo, sweepMat);
    sweepGroup.add(sweepLine);

    const centerPinGeo = new THREE.CylinderGeometry(0.3, 0.05, 0.8, 16);
    const centerPinMat = new THREE.MeshStandardMaterial({
      color: 0xd92d20,
      emissive: 0xd92d20,
      emissiveIntensity: 0.3
    });
    const centerPin = new THREE.Mesh(centerPinGeo, centerPinMat);
    centerPin.position.set(0, 0.4, 0);
    scene.add(centerPin);

    const responderMeshes: { group: THREE.Group; responder: Responder }[] = [];
    RESPONDERS.forEach((resp) => {
      const g = new THREE.Group();
      g.position.set(resp.x, 0.3, resp.z);

      const markerGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const markerMat = new THREE.MeshStandardMaterial({
        color: 0x075e54,
        emissive: 0x10b981,
        emissiveIntensity: 0.4
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      g.add(marker);

      const ringG = new THREE.RingGeometry(0.35, 0.5, 24);
      const ringM = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringG, ringM);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = -0.2;
      g.add(ringMesh);

      scene.add(g);
      responderMeshes.push({ group: g, responder: resp });
    });

    let angle = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      angle += 0.025;
      sweepGroup.rotation.y = -angle;

      responderMeshes.forEach(({ group }, i) => {
        group.position.y = 0.3 + Math.sin(angle * 2 + i) * 0.08;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  const handleSimulateSOS = () => {
    setSosTriggered(true);
    setEtaCounter(selectedResponder.etaMins);
    const interval = setInterval(() => {
      setEtaCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev - 1;
      });
    }, 1200);
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-red-50/70 via-white to-emerald-50/50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {labels.title}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Live Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {labels.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            Zero Surge Pricing • 7-Min Target SLA
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-8 relative min-h-[340px] sm:min-h-[420px] bg-slate-100 overflow-hidden flex items-center justify-center">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Compass / Range Markers */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 shadow-sm pointer-events-none space-y-0.5">
            <div className="text-[#075E54] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>RADAR SWEEP: 1.5 Hz ACTIVE</span>
            </div>
            <div>COOPERATIVE RANGE: 5.0 KM</div>
            <div>STATUS: STANDBY & DISPATCH READY</div>
          </div>

          <div className="absolute bottom-4 left-4 bg-red-50/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-200 text-[11px] text-red-700 font-bold shadow-sm pointer-events-none flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency Anchor Point: Verified Customer Location</span>
          </div>
        </div>

        {/* Right Responders Roster */}
        <div className="lg:col-span-4 p-5 bg-gradient-to-b from-white via-slate-50/60 to-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>{labels.respondersTitle}</span>
              <span className="text-[11px] text-[#075E54] font-bold font-mono">3 On Standby</span>
            </div>

            <div className="space-y-2.5">
              {RESPONDERS.map((resp) => {
                const isSel = resp.id === selectedResponder.id;
                const respTrans = resp.translations[langKey] || resp.translations.en;
                return (
                  <button
                    key={resp.id}
                    type="button"
                    onClick={() => {
                      setSelectedResponder(resp);
                      setSosTriggered(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSel
                        ? "bg-white border-[#075E54] shadow-md ring-2 ring-[#075E54]/20"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <img
                      src={resp.imageUrl}
                      alt={resp.name}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {resp.name}
                        </h4>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                          {resp.etaMins}m ETA
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">
                        {respTrans.trade}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between font-mono">
                        <span className="truncate max-w-[140px]">{resp.society}</span>
                        <span className="text-blue-600 font-bold">{resp.distanceKm} km</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            {sosTriggered ? (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-center animate-pulse space-y-1">
                <div className="text-xs font-black uppercase text-red-700 tracking-wider">
                  {labels.dispatchedTitle}
                </div>
                <div className="text-2xl font-black text-red-600 font-mono">
                  Arrival in ~{etaCounter} Mins
                </div>
                <div className="text-xs text-slate-600">
                  {selectedResponder.name} {labels.dispatchedMsg}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulateSOS}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>{labels.simulateBtn} ({selectedResponder.etaMins}m ETA)</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#075E54]" />
              <span>{labels.guaranteeText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmergencyRadar3D;
