import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable, getOptimalDevicePixelRatio } from "./WebGLDetector";
import { Volume2, Sparkles, CheckCircle2, RotateCw, Play } from "lucide-react";
import { ttsService } from "../../../services/tts/ttsService";

interface SoundboxViewerProps {
  amount?: number;
  workerName?: string;
  society?: string;
  className?: string;
}

export const Soundbox3DViewer: React.FC<SoundboxViewerProps> = ({
  amount = 800,
  workerName = "Rajesh Sharma",
  society = "Vijayawada Central Labour Co-op",
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayingAlert, setIsPlayingAlert] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Trigger sound waves animation ref
  const soundWaveTriggerRef = useRef(false);

  const handleTestAlert = async () => {
    try {
      setIsPlayingAlert(true);
      soundWaveTriggerRef.current = true;
      await ttsService.speak(
        `₹${amount} successfully credited to ${workerName} via direct cooperative escrow. 0% aggregator deduction.`,
        { id: "soundbox_3d_alert_voice" }
      );
    } catch {
      // safe fallback
    } finally {
      setIsPlayingAlert(false);
      setTimeout(() => {
        soundWaveTriggerRef.current = false;
      }, 1200);
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
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 20, 160);
    camera.lookAt(0, 0, 0);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    keyLight.position.set(60, 80, 80);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x10b981, 1.2);
    fillLight.position.set(-60, -40, 60);
    scene.add(fillLight);

    // 4. Soundbox Group
    const soundboxGroup = new THREE.Group();
    // Default pleasant isometric presentation angle
    soundboxGroup.rotation.x = 0.22;
    soundboxGroup.rotation.y = -0.35;
    scene.add(soundboxGroup);

    // 5. Main Soundbox Chassis Body
    const bodyW = 54;
    const bodyH = 74;
    const bodyD = 38;

    const bodyGeo = new THREE.BoxGeometry(bodyW, bodyH, bodyD);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.5,
      roughness: 0.35
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    soundboxGroup.add(bodyMesh);

    // 6. Colored Trim Accent (Co-op Royal Blue)
    const trimGeo = new THREE.BoxGeometry(bodyW + 0.8, 4, bodyD + 0.8);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.7,
      roughness: 0.2
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = -12;
    soundboxGroup.add(trimMesh);

    // 7. Front Speaker Grille
    const grilleGeo = new THREE.CylinderGeometry(16, 16, 2, 32);
    const grilleMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.4
    });
    const grilleMesh = new THREE.Mesh(grilleGeo, grilleMat);
    grilleMesh.rotation.x = Math.PI / 2;
    grilleMesh.position.set(0, 10, bodyD / 2 + 1);
    soundboxGroup.add(grilleMesh);

    // 8. Glowing LED Ring around Speaker
    const ledRingGeo = new THREE.RingGeometry(16.5, 18.5, 32);
    const ledRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide
    });
    const ledRing = new THREE.Mesh(ledRingGeo, ledRingMat);
    ledRing.position.set(0, 10, bodyD / 2 + 1.5);
    soundboxGroup.add(ledRing);

    // 9. Digital LCD Display Screen
    const createScreenTexture = () => {
      const cvs = document.createElement("canvas");
      cvs.width = 512;
      cvs.height = 192;
      const ctx = cvs.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(cvs);

      ctx.fillStyle = "#022c22";
      ctx.fillRect(0, 0, 512, 192);

      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 180);

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 26px monospace";
      ctx.fillText("BHARAT UPI ESCROW • INSTANT DBT", 24, 45);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 58px sans-serif";
      ctx.fillText(`+ ₹${amount}.00`, 24, 115);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 24px monospace";
      ctx.fillText("SETTLED DIRECT TO ARTISAN", 24, 155);

      return new THREE.CanvasTexture(cvs);
    };

    const screenTexture = createScreenTexture();
    const screenGeo = new THREE.PlaneGeometry(42, 16);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, -22, bodyD / 2 + 0.6);
    soundboxGroup.add(screenMesh);

    // 10. Tactile Buttons on Top (+, -, Power)
    const buttonGeo = new THREE.CylinderGeometry(3, 3, 3, 16);
    const buttonMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6, roughness: 0.3 });

    [-12, 0, 12].forEach((xPos) => {
      const btn = new THREE.Mesh(buttonGeo, buttonMat);
      btn.position.set(xPos, bodyH / 2 + 1, 0);
      soundboxGroup.add(btn);
    });

    // 11. Biometric Fingerprint Sensor (Right side)
    const sensorGeo = new THREE.BoxGeometry(1.5, 14, 14);
    const sensorMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1
    });
    const sensorMesh = new THREE.Mesh(sensorGeo, sensorMat);
    sensorMesh.position.set(bodyW / 2 + 0.5, 0, 0);
    soundboxGroup.add(sensorMesh);

    // 12. 3D Expanding Acoustic Sound Waves
    const waveCount = 3;
    const waveRings: THREE.Mesh[] = [];
    const waveGeo = new THREE.TorusGeometry(18, 0.9, 12, 48);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0
    });

    for (let i = 0; i < waveCount; i++) {
      const ring = new THREE.Mesh(waveGeo, waveMat.clone());
      ring.position.set(0, 10, bodyD / 2 + 3);
      soundboxGroup.add(ring);
      waveRings.push(ring);
    }

    // 13. Drag & Mouse Orbit Tracking (Scroll-Safe)
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
        soundboxGroup.rotation.y += deltaX * 0.01;
        soundboxGroup.rotation.x += deltaY * 0.01;
      } else {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        soundboxGroup.rotation.y = -0.35 + normX * 0.5;
        soundboxGroup.rotation.x = 0.22 + normY * 0.4;
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

      // Subtle breathing float
      if (!isDragging) {
        soundboxGroup.position.y = Math.sin(clock * 1.5) * 2;
      }

      // LED Ring pulsating glow
      if (ledRing.material instanceof THREE.MeshBasicMaterial) {
        if (soundWaveTriggerRef.current) {
          ledRing.material.color.setHex(0x38bdf8);
        } else {
          ledRing.material.color.setHex(0x10b981);
        }
      }

      // Animate expanding 3D sound waves when active
      waveRings.forEach((ring, idx) => {
        const mat = ring.material as THREE.MeshBasicMaterial;
        if (soundWaveTriggerRef.current) {
          const progress = ((clock * 2 + idx * 0.5) % 1.5) / 1.5;
          const scale = 1 + progress * 2.2;
          ring.scale.set(scale, scale, scale);
          mat.opacity = (1 - progress) * 0.75;
        } else {
          mat.opacity = 0;
        }
      });

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
      bodyGeo.dispose();
      bodyMat.dispose();
      trimGeo.dispose();
      trimMat.dispose();
      grilleGeo.dispose();
      grilleMat.dispose();
      ledRingGeo.dispose();
      ledRingMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTexture.dispose();
      buttonGeo.dispose();
      buttonMat.dispose();
      sensorGeo.dispose();
      sensorMat.dispose();
      waveGeo.dispose();
      waveRings.forEach((r) => (r.material as THREE.Material).dispose());
    };
  }, [amount]);

  if (!webglSupported) {
    return (
      <div className={`p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 ${className}`}>
        <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
          <Volume2 className="w-5 h-5" />
          <span>Biometric UPI Escrow Soundbox</span>
        </div>
        <p className="text-xl font-bold font-mono">₹{amount}.00 Released</p>
        <p className="text-xs text-slate-400 mt-1">{society}</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl p-5 select-none ${className}`}>
      {/* 3D Soundbox Header */}
      <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            3D IOT SOUNDBOX SIMULATOR
          </span>
        </div>

        <button
          type="button"
          onClick={handleTestAlert}
          disabled={isPlayingAlert}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs flex items-center gap-2 transition shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAlert ? "animate-pulse text-amber-300" : ""}`} />
          <span>{isPlayingAlert ? "Broadcasting..." : "Test 3D Audio Alert"}</span>
        </button>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[260px] sm:h-[300px] cursor-grab active:cursor-grabbing flex items-center justify-center relative"
      />

      {/* Footer Info */}
      <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Biometric & NPCI Verified Terminal</span>
        </span>
        <span className="opacity-70">Interactive 3D • 360° Drag</span>
      </div>
    </div>
  );
};
