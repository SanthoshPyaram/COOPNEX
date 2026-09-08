import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable, getOptimalDevicePixelRatio } from "./WebGLDetector";
import { ShieldCheck, MapPin, CheckCircle2, User, Zap, Star, ArrowRight } from "lucide-react";

interface LocationMatchingProps {
  pincode?: string;
  locationName?: string;
  onMatchFound?: (worker: { name: string; trade: string; distance: string; rating: number }) => void;
  className?: string;
}

export const LocationMatching3D: React.FC<LocationMatchingProps> = ({
  pincode = "520001",
  locationName = "Vijayawada Central",
  onMatchFound,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [matchPhase, setMatchPhase] = useState<"pulsing" | "discovering" | "matched">("pulsing");
  const [matchedWorker, setMatchedWorker] = useState<{
    name: string;
    trade: string;
    distance: string;
    rating: number;
    imageUrl: string;
  }>({
    name: "Rajesh Kumar",
    trade: "Level-4 Certified Master Electrician",
    distance: "0.8 km away",
    rating: 4.98,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&q=80"
  });
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 55, 95);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(getOptimalDevicePixelRatio());
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x075e54, 2.0);
    dirLight.position.set(20, 60, 40);
    scene.add(dirLight);

    // Map Grid Plane (Light Slate & Teal)
    const mapGroup = new THREE.Group();
    scene.add(mapGroup);

    const gridHelper = new THREE.GridHelper(80, 24, 0x075e54, 0xcbd5e1);
    gridHelper.position.y = 0;
    mapGroup.add(gridHelper);

    // Center Customer Location Pin (Red)
    const pinGroup = new THREE.Group();
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xd92d20, roughness: 0.2, metalness: 0.4 });
    const pinHead = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 16), pinMat);
    pinHead.position.y = 4.5;
    pinGroup.add(pinHead);
    const pinCone = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5, 16), pinMat);
    pinCone.rotation.x = Math.PI;
    pinCone.position.y = 2;
    pinGroup.add(pinCone);
    mapGroup.add(pinGroup);

    // Radar Waves
    const ringGeo = new THREE.RingGeometry(0.5, 1.8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x075e54,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const pulseRing = new THREE.Mesh(ringGeo, ringMat);
    pulseRing.rotation.x = -Math.PI / 2;
    pulseRing.position.y = 0.1;
    mapGroup.add(pulseRing);

    // Surrounding Artisans
    const workerNodes: { mesh: THREE.Mesh; pos: THREE.Vector3 }[] = [];
    const workerGeo = new THREE.SphereGeometry(1.6, 16, 16);
    const workerMat = new THREE.MeshStandardMaterial({ color: 0x0b84f3, roughness: 0.3 });
    const matchMat = new THREE.MeshStandardMaterial({
      color: 0x075e54,
      emissive: 0x10b981,
      emissiveIntensity: 0.5
    });

    const positions = [
      new THREE.Vector3(12, 1.6, 8),
      new THREE.Vector3(-16, 1.6, 14),
      new THREE.Vector3(20, 1.6, -12),
      new THREE.Vector3(-14, 1.6, -18),
      new THREE.Vector3(26, 1.6, 18)
    ];

    positions.forEach((pos, idx) => {
      const mesh = new THREE.Mesh(workerGeo, idx === 0 ? matchMat : workerMat);
      mesh.position.copy(pos);
      mapGroup.add(mesh);
      workerNodes.push({ mesh, pos });
    });

    // Connecting Lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.35 });
    const nearestLineMat = new THREE.LineBasicMaterial({ color: 0x075e54, linewidth: 2, transparent: true, opacity: 0.8 });

    workerNodes.forEach((node, idx) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.2, 0),
        node.pos
      ]);
      const line = new THREE.Line(lineGeo, idx === 0 ? nearestLineMat : lineMat);
      mapGroup.add(line);
    });

    // Timed Phase Transition
    const t1 = setTimeout(() => setMatchPhase("discovering"), 1000);
    const t2 = setTimeout(() => {
      setMatchPhase("matched");
      onMatchFound?.({
        name: "Rajesh Kumar",
        trade: "Level-4 Certified Electrician",
        distance: "0.8 km away",
        rating: 4.98
      });
    }, 2400);

    // Animation Loop
    let animId = 0;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.02;

      // Radar pulse expansion
      const pulseScale = 1 + ((clock * 12) % 35);
      pulseRing.scale.set(pulseScale, pulseScale, 1);
      (pulseRing.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - pulseScale / 35);

      // Map slow gentle rotation
      mapGroup.rotation.y = Math.sin(clock * 0.4) * 0.12;

      // Nearest worker beacon glow
      const nearestNode = workerNodes[0].mesh;
      nearestNode.position.y = 1.8 + Math.sin(clock * 3) * 0.6;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      gridHelper.dispose();
      pinHead.geometry.dispose();
      pinCone.geometry.dispose();
      pinMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      workerNodes.forEach((n) => {
        n.mesh.geometry.dispose();
        (n.mesh.material as THREE.Material).dispose();
      });
      lineMat.dispose();
      nearestLineMat.dispose();
    };
  }, [pincode, locationName]);

  return (
    <div className={`relative w-full rounded-3xl bg-white border border-slate-200 shadow-xl p-4 sm:p-6 overflow-hidden select-none ${className}`}>
      {/* Dynamic Status Header */}
      <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider">
            {matchPhase === "pulsing" && `EXPANDING CO-OP DISPATCH RADAR (${pincode})`}
            {matchPhase === "discovering" && "IDENTIFYING ACTIVE LABOUR GUILD PROS..."}
            {matchPhase === "matched" && `OPTIMAL ARTISAN ALLOCATED: ${matchedWorker.name.toUpperCase()}`}
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#075E54] border border-emerald-200 font-mono text-[11px] font-bold">
          {locationName}
        </span>
      </div>

      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-[240px] sm:h-[280px] flex items-center justify-center relative rounded-2xl overflow-hidden border border-slate-100" />

      {/* Matched Pro Floating Confirmation Strip */}
      <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <img
            src={matchedWorker.imageUrl}
            alt={matchedWorker.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <span>{matchedWorker.name}</span>
              <span className="text-slate-500 font-normal">• {matchedWorker.trade}</span>
            </div>
            <div className="text-[11px] text-[#075E54] flex items-center gap-2 mt-0.5 font-semibold">
              <span>★ {matchedWorker.rating} Citizen Rating</span>
              <span>•</span>
              <span className="text-blue-600 font-mono font-bold">{matchedWorker.distance}</span>
            </div>
          </div>
        </div>

        <a
          href="#workers-directory"
          className="px-4 py-2 rounded-xl bg-[#075E54] hover:bg-[#064e46] text-white font-bold text-xs shadow-md shadow-[#075E54]/20 flex items-center gap-1.5 transition cursor-pointer shrink-0"
        >
          <span>View Worker Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
export default LocationMatching3D;
