import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable, getOptimalDevicePixelRatio } from "./WebGLDetector";
import { 
  Activity, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from "lucide-react";

interface ZoneData {
  id: string;
  name: string;
  gridX: number;
  gridZ: number;
  demandMorning: number;
  demandAfternoon: number;
  demandEvening: number;
  demandNight: number;
  activeArtisans: number;
  avgArrival: string;
}

const ZONES: ZoneData[] = [
  { id: "z1", name: "Hitec City / Madhapur", gridX: -3.5, gridZ: -2.5, demandMorning: 82, demandAfternoon: 65, demandEvening: 94, demandNight: 40, activeArtisans: 148, avgArrival: "11 min" },
  { id: "z2", name: "Secunderabad Cantonment", gridX: 2.5, gridZ: -2.5, demandMorning: 60, demandAfternoon: 50, demandEvening: 72, demandNight: 28, activeArtisans: 95, avgArrival: "14 min" },
  { id: "z3", name: "Banjara & Jubilee Hills", gridX: -1.2, gridZ: 0, demandMorning: 75, demandAfternoon: 58, demandEvening: 88, demandNight: 35, activeArtisans: 112, avgArrival: "9 min" },
  { id: "z4", name: "Kukatpally & Miyapur", gridX: -4.0, gridZ: 2.5, demandMorning: 70, demandAfternoon: 45, demandEvening: 85, demandNight: 30, activeArtisans: 130, avgArrival: "12 min" },
  { id: "z5", name: "Charminar & Old City", gridX: 1.5, gridZ: 2.5, demandMorning: 88, demandAfternoon: 70, demandEvening: 92, demandNight: 45, activeArtisans: 160, avgArrival: "10 min" },
  { id: "z6", name: "LB Nagar & Dilsukhnagar", gridX: 4.2, gridZ: 0.5, demandMorning: 55, demandAfternoon: 40, demandEvening: 68, demandNight: 22, activeArtisans: 85, avgArrival: "15 min" },
];

type TimeSlot = "morning" | "afternoon" | "evening" | "night";

export const AIDemandForecast3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>("evening");
  const [selectedZone, setSelectedZone] = useState<ZoneData>(ZONES[0]);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const barsRef = useRef<{ mesh: THREE.Mesh; targetHeight: number; currentHeight: number; zone: ZoneData }[]>([]);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfcfbf7, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 7.5, 10.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(getOptimalDevicePixelRatio());
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfff7e6, 1.2);
    dirLight.position.set(6, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const coopLight = new THREE.PointLight(0x075e54, 1.4, 25);
    coopLight.position.set(-6, 5, 2);
    scene.add(coopLight);

    // Base Grid with soft cooperative forest line
    const grid = new THREE.GridHelper(16, 16, 0x146b4a, 0xe2e8f0);
    grid.position.y = -0.01;
    if (!Array.isArray(grid.material)) {
      grid.material.transparent = true;
      grid.material.opacity = 0.4;
    }
    scene.add(grid);

    // Create 3D Zone Pillars
    const bars: { mesh: THREE.Mesh; targetHeight: number; currentHeight: number; zone: ZoneData }[] = [];
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    ZONES.forEach((zone) => {
      const barGeo = new THREE.BoxGeometry(1.2, 1, 1.2);
      geometriesToDispose.push(barGeo);

      const barMat = new THREE.MeshStandardMaterial({
        color: 0x146b4a,
        emissive: 0x075e54,
        emissiveIntensity: 0.35,
        roughness: 0.3,
        metalness: 0.4,
      });
      materialsToDispose.push(barMat);

      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(zone.gridX, 0.5, zone.gridZ);
      barMesh.castShadow = true;
      barMesh.receiveShadow = true;
      scene.add(barMesh);

      // Base footprint ring
      const ringGeo = new THREE.RingGeometry(0.7, 0.85, 24);
      geometriesToDispose.push(ringGeo);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x28a66a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      materialsToDispose.push(ringMat);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(zone.gridX, 0.02, zone.gridZ);
      scene.add(ring);

      bars.push({
        mesh: barMesh,
        targetHeight: 1,
        currentHeight: 1,
        zone,
      });
    });

    barsRef.current = bars;

    // Pulse rings around selected zone
    const beaconGeo = new THREE.TorusGeometry(1.0, 0.04, 12, 32);
    geometriesToDispose.push(beaconGeo);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xf4b740,
      transparent: true,
      opacity: 0.8,
    });
    materialsToDispose.push(beaconMat);
    const beaconRing = new THREE.Mesh(beaconGeo, beaconMat);
    beaconRing.rotation.x = Math.PI / 2;
    scene.add(beaconRing);

    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smoothly scale height of bars
      bars.forEach((b) => {
        b.currentHeight += (b.targetHeight - b.currentHeight) * 0.08;
        b.mesh.scale.y = b.currentHeight;
        b.mesh.position.y = b.currentHeight / 2;

        // Color modulation based on load
        const mat = b.mesh.material as THREE.MeshStandardMaterial;
        if (b.targetHeight > 2.8) {
          mat.color.setHex(0xf4b740); // gold peak
          mat.emissive.setHex(0xd97706);
        } else {
          mat.color.setHex(0x146b4a); // forest balanced
          mat.emissive.setHex(0x075e54);
        }
      });

      // Position beacon on selected zone
      if (selectedZone) {
        beaconRing.position.x = selectedZone.gridX;
        beaconRing.position.z = selectedZone.gridZ;
        beaconRing.position.y = 0.05;
        const s = 1 + Math.sin(time * 4) * 0.15;
        beaconRing.scale.set(s, s, s);
      }

      // Gentle camera orbit
      camera.position.x = Math.sin(time * 0.15) * 1.5;
      camera.lookAt(0, 0.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update target heights whenever time slot changes
  useEffect(() => {
    barsRef.current.forEach((b) => {
      let val = 50;
      if (selectedSlot === "morning") val = b.zone.demandMorning;
      else if (selectedSlot === "afternoon") val = b.zone.demandAfternoon;
      else if (selectedSlot === "evening") val = b.zone.demandEvening;
      else if (selectedSlot === "night") val = b.zone.demandNight;

      // Map 20..100 to height 0.8..3.5
      b.targetHeight = 0.6 + (val / 100) * 3.2;
    });
  }, [selectedSlot]);

  return (
    <div className="w-full bg-white dark:bg-coop-navy/90 rounded-2xl border border-coop-forest/15 dark:border-white/10 shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-coop-forest/10 dark:border-white/10 bg-coop-mint/30 dark:bg-white/5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-coop-forest dark:text-coop-emerald" />
            <span className="text-xs font-bold uppercase tracking-wider text-coop-forest dark:text-coop-gold">
              3D AI Demand & Cooperative Dispatch Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Predictive cluster rebalancing across urban cooperative circles — zero surge pricing guaranteed
          </p>
        </div>

        {/* Time Slot Picker */}
        <div className="inline-flex rounded-lg border border-coop-forest/20 p-1 bg-white dark:bg-white/10 text-xs font-semibold">
          {(["morning", "afternoon", "evening", "night"] as TimeSlot[]).map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`px-3 py-1.5 rounded-md capitalize transition ${
                selectedSlot === slot
                  ? "bg-coop-forest text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Simulation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left 3D Canvas */}
        <div className="lg:col-span-8 relative h-[320px] sm:h-[380px] bg-gradient-to-b from-[#FAFBF8] to-[#EEF5F1] dark:from-[#0B141C] dark:to-[#081017] overflow-hidden">
          {webglSupported ? (
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
              3D Simulation active
            </div>
          )}

          {/* Floating Metric Badge */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-coop-navy/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-coop-forest/15 shadow-sm pointer-events-none text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800 dark:text-white">Statutory Floor Rates Active</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Algorithm routes closest idle artisan without price escalation
            </div>
          </div>
        </div>

        {/* Right Zone Selector & Live Metrics */}
        <div className="lg:col-span-4 p-5 bg-white dark:bg-coop-navy/95 border-t lg:border-t-0 lg:border-l border-coop-forest/10 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Inspect Cluster Nodes
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {ZONES.map((zone) => {
                const isSel = zone.id === selectedZone.id;
                let currentVal = zone.demandEvening;
                if (selectedSlot === "morning") currentVal = zone.demandMorning;
                if (selectedSlot === "afternoon") currentVal = zone.demandAfternoon;
                if (selectedSlot === "night") currentVal = zone.demandNight;

                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                      isSel
                        ? "bg-coop-mint/60 dark:bg-white/10 border-coop-forest dark:border-coop-emerald font-bold"
                        : "border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        {zone.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>{zone.activeArtisans} Artisans</span>
                        <span>•</span>
                        <span>ETA: {zone.avgArrival}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-extrabold ${currentVal > 80 ? "text-amber-600 dark:text-coop-gold" : "text-coop-forest dark:text-coop-emerald"}`}>
                        {currentVal}%
                      </span>
                      <div className="text-[10px] text-slate-400">load</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Card for Selected Zone */}
          <div className="mt-4 p-3.5 rounded-xl bg-coop-mint/30 dark:bg-white/5 border border-coop-forest/15">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-extrabold text-coop-forest dark:text-coop-gold">
                {selectedZone.name}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                Surge Locked
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Cooperative society automatically deploys reserve shifts during peak hours to preserve standardized hourly rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIDemandForecast3D;

