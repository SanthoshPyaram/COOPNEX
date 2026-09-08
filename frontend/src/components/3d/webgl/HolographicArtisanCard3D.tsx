import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable, getOptimalDevicePixelRatio } from "./WebGLDetector";
import { ShieldCheck, RotateCw, CheckCircle2, QrCode, Sparkles, Volume2 } from "lucide-react";
import { ttsService } from "../../../services/tts/ttsService";

interface ArtisanCardProps {
  name?: string;
  trade?: string;
  society?: string;
  rating?: number;
  className?: string;
}

export const HolographicArtisanCard3D: React.FC<ArtisanCardProps> = ({
  name = "Rajesh Sharma",
  trade = "Certified Electrician & Solar Pro",
  society = "Vijayawada Central Labour Co-op (AP-LCS-492)",
  rating = 4.98,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // References for Three.js control
  const cardGroupRef = useRef<THREE.Group | null>(null);
  const targetRotationYRef = useRef(0);

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
    targetRotationYRef.current = !isFlipped ? Math.PI : 0;
  };

  const handleSpeakVerification = async () => {
    try {
      setIsSpeaking(true);
      await ttsService.speak(
        `${name} is a UIDAI 5-tier verified artisan with NSQF Level 4 certification and clean police record from ${society}.`,
        { id: "artisan_card_3d_voice" }
      );
    } catch {
      // safe fallback
    } finally {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 180;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(getOptimalDevicePixelRatio());
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x60a5fa, 1.6);
    dirLight.position.set(50, 80, 100);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x34d399, 1.2, 200);
    pointLight.position.set(-60, -40, 80);
    scene.add(pointLight);

    // 4. Card Group
    const cardGroup = new THREE.Group();
    scene.add(cardGroup);
    cardGroupRef.current = cardGroup;

    // 5. Card Dimensions (Ratio ~ 1.58 like credit card)
    const cardW = 92;
    const cardH = 58;
    const cardDepth = 1.4;

    // 6. Dynamic Canvas Texture Generation for Front & Back
    const createFrontTexture = () => {
      const cvs = document.createElement("canvas");
      cvs.width = 1024;
      cvs.height = 640;
      const ctx = cvs.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(cvs);

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 1024, 640);
      grad.addColorStop(0, "#091e42");
      grad.addColorStop(0.5, "#0b2a5b");
      grad.addColorStop(1, "#04142d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 640);

      // Gold Security Border
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 984, 600);

      // Header Banner
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 32px monospace";
      ctx.fillText("GOVERNMENT OF INDIA • LABOUR CO-OP FEDERATION", 50, 80);

      // UIDAI Verhoeff Chip
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.roundRect(50, 120, 110, 80, 12);
      ctx.fill();
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Worker details
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText(name, 190, 160);

      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(trade, 190, 205);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "24px monospace";
      ctx.fillText(society, 50, 280);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 26px monospace";
      ctx.fillText("UIDAI CHECKSUM: VERHOEFF VALIDATED ✓", 50, 340);
      ctx.fillText("NSQF LEVEL 4 CERTIFIED ARTISAN", 50, 385);

      // Footer Smart Badge
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(50, 440, 924, 130);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 28px monospace";
      ctx.fillText("ID: AP-WKR-2026-98124  •  POLICE CLEARANCE: VERIFIED", 80, 500);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`RATING: ★ ${rating} / 5.0  •  0% PLATFORM CUT`, 80, 540);

      return new THREE.CanvasTexture(cvs);
    };

    const createBackTexture = () => {
      const cvs = document.createElement("canvas");
      cvs.width = 1024;
      cvs.height = 640;
      const ctx = cvs.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(cvs);

      // Dark Back Gradient
      const grad = ctx.createLinearGradient(0, 0, 1024, 640);
      grad.addColorStop(0, "#050d1a");
      grad.addColorStop(1, "#020710");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 640);

      // Border
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 984, 600);

      // Magnetic Stripe
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(20, 80, 984, 100);

      // Signature & Stamp Strip
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(50, 220, 600, 80);
      ctx.fillStyle = "#0f172a";
      ctx.font = "italic 32px cursive";
      ctx.fillText("Chief Registrar of Co-operative Societies", 70, 270);

      // QR Code Simulation Placeholder
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(720, 220, 240, 240);
      ctx.fillStyle = "#000000";
      // Draw QR grid pattern
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(740 + c * 34, 240 + r * 34, 24, 24);
          }
        }
      }

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 28px monospace";
      ctx.fillText("ENCRYPTED GOVT QR AUDIT", 50, 360);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "22px monospace";
      ctx.fillText("Valid across all Indian Union Territories under", 50, 420);
      ctx.fillText("Multi-State Co-operative Societies Act, 2002.", 50, 455);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("Emergency Citizen Helpline: 1800-COOPNEX (Toll-Free)", 50, 520);

      return new THREE.CanvasTexture(cvs);
    };

    const frontTexture = createFrontTexture();
    const backTexture = createBackTexture();

    // 7. Multi-Material Box Mesh
    const cardGeo = new THREE.BoxGeometry(cardW, cardH, cardDepth);
    const sideMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.25
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTexture,
      metalness: 0.35,
      roughness: 0.35
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTexture,
      metalness: 0.35,
      roughness: 0.35
    });

    // Box face order: +X, -X, +Y, -Y, +Z (Front), -Z (Back)
    const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
    const cardMesh = new THREE.Mesh(cardGeo, materials);
    cardGroup.add(cardMesh);

    // 8. Holographic Iridescent Shimmer Plane
    const holoGeo = new THREE.PlaneGeometry(cardW * 0.98, cardH * 0.98);
    const holoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const holoPlane = new THREE.Mesh(holoGeo, holoMat);
    holoPlane.position.z = cardDepth / 2 + 0.05;
    cardGroup.add(holoPlane);

    // 9. Interactive Drag & Mouse Tilt (Scroll-Safe)
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        cardGroup.rotation.y += deltaX * 0.01;
        cardGroup.rotation.x += deltaY * 0.01;
      } else {
        // Gentle tilt tracking
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        cardGroup.rotation.x = normY * 0.4;
        cardGroup.rotation.y = targetRotationYRef.current + normX * 0.6;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width: newW, height: newH } = entries[0].contentRect;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animId = 0;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.02;

      // Smooth flip interpolation towards targetRotationYRef
      if (!isDragging) {
        cardGroup.rotation.y += (targetRotationYRef.current - cardGroup.rotation.y) * 0.08;
      }

      // Shimmering light animation
      pointLight.position.x = Math.sin(clock) * 70;
      pointLight.position.y = Math.cos(clock * 0.8) * 50;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      resizeObserver.disconnect();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
      cardGeo.dispose();
      sideMat.dispose();
      frontMat.dispose();
      backMat.dispose();
      frontTexture.dispose();
      backTexture.dispose();
      holoGeo.dispose();
      holoMat.dispose();
    };
  }, [name, trade, society, rating]);

  if (!webglSupported) {
    return (
      <div className={`p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 ${className}`}>
        <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
          <ShieldCheck className="w-5 h-5" />
          <span>UIDAI Verified Smart Credential</span>
        </div>
        <p className="text-sm font-semibold">{name} • {trade}</p>
        <p className="text-xs text-slate-400 mt-1">{society}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl p-5 select-none ${className}`}>
      {/* 3D Smart Card Controls Header */}
      <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            3D HOLOGRAPHIC CREDENTIAL
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFlip}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/15"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? "View Front" : "Flip 180° Back"}</span>
          </button>

          <button
            type="button"
            onClick={handleSpeakVerification}
            disabled={isSpeaking}
            className="p-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white transition cursor-pointer"
            title="Listen to verification details"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-pulse text-amber-300" : ""}`} />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[260px] sm:h-[300px] cursor-grab active:cursor-grabbing flex items-center justify-center relative"
      />

      {/* Card Inspection Footer */}
      <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Biometric Verhoeff & State Police Endorsed</span>
        </span>
        <span className="opacity-70">Interactive 3D • Drag to Tilt</span>
      </div>
    </div>
  );
};
