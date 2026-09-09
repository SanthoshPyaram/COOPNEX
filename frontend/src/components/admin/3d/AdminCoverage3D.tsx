import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable } from "../../3d/webgl/WebGLDetector";
import { MapPin, Building2, Users, Clock, ShieldCheck } from "lucide-react";

export interface CoverageCity {
  id: string;
  name: string;
  state: string;
  district: string;
  artisans: number;
  societies: number;
  status: "Active" | "Dispatching" | "Limited";
  sla: string;
  welfareCorpus: string;
  x: number;
  z: number;
}

export const CITIES_9_COVERAGE: CoverageCity[] = [
  { id: "vja", name: "Vijayawada Central", state: "Andhra Pradesh", district: "NTR District", artisans: 1420, societies: 18, status: "Dispatching", sla: "6.8 min", welfareCorpus: "₹4,20,000", x: 0.8, z: 0.4 },
  { id: "hyd", name: "Hyderabad Cyber Hub", state: "Telangana", district: "Hyderabad Central", artisans: 2150, societies: 26, status: "Active", sla: "7.1 min", welfareCorpus: "₹6,80,000", x: 0.2, z: 0.1 },
  { id: "blr", name: "Bengaluru South", state: "Karnataka", district: "Bengaluru Urban", artisans: 1890, societies: 22, status: "Active", sla: "7.4 min", welfareCorpus: "₹5,90,000", x: -0.4, z: 1.2 },
  { id: "vzg", name: "Visakhapatnam Port", state: "Andhra Pradesh", district: "Visakhapatnam", artisans: 980, societies: 14, status: "Active", sla: "8.0 min", welfareCorpus: "₹3,40,000", x: 1.6, z: 0.1 },
  { id: "chn", name: "Chennai Central", state: "Tamil Nadu", district: "Chennai Urban", artisans: 1340, societies: 17, status: "Active", sla: "7.2 min", welfareCorpus: "₹4,50,000", x: 0.5, z: 1.6 },
  { id: "mum", name: "Mumbai Labour Guild", state: "Maharashtra", district: "Mumbai Suburban", artisans: 3200, societies: 38, status: "Dispatching", sla: "6.5 min", welfareCorpus: "₹9,40,000", x: -1.5, z: -0.2 },
  { id: "del", name: "Delhi NCR Federation", state: "Delhi", district: "National Capital", artisans: 2800, societies: 32, status: "Active", sla: "6.9 min", welfareCorpus: "₹8,10,000", x: -0.5, z: -1.8 },
  { id: "kol", name: "Kolkata East Co-op", state: "West Bengal", district: "Kolkata Metropolitan", artisans: 1120, societies: 15, status: "Active", sla: "8.2 min", welfareCorpus: "₹3,80,000", x: 1.8, z: -0.9 },
  { id: "koc", name: "Kochi Marine Guild", state: "Kerala", district: "Ernakulam", artisans: 890, societies: 12, status: "Active", sla: "7.8 min", welfareCorpus: "₹2,90,000", x: -0.8, z: 2.1 }
];

interface AdminCoverage3DProps {
  selectedCityId?: string;
  onSelectCity?: (cityId: string) => void;
}

export const AdminCoverage3D: React.FC<AdminCoverage3DProps> = ({
  selectedCityId = "vja",
  onSelectCity
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCity, setHoveredCity] = useState<CoverageCity | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 6, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Base Circular Landform Platform
    const landGroup = new THREE.Group();
    scene.add(landGroup);

    const baseGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.25, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.85,
      metalness: 0.1
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.15;
    landGroup.add(base);

    // Subtle Outline Rings
    const ringGeo = new THREE.RingGeometry(3.4, 3.5, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x075e54,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    landGroup.add(ring);

    // Generate 9 3D City Beacons
    const pinMeshes: THREE.Mesh[] = [];

    CITIES_9_COVERAGE.forEach((city) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(city.x, 0, city.z);

      // Status color: Emerald for active, Amber for dispatching
      const pinColor = city.status === "Dispatching" ? 0x16865c : 0x0284c7;

      // Base footprint ring
      const fGeo = new THREE.RingGeometry(0.18, 0.28, 24);
      const fMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const foot = new THREE.Mesh(fGeo, fMat);
      foot.rotation.x = -Math.PI / 2;
      foot.position.y = 0.02;
      pinGroup.add(foot);

      // Stalk
      const sGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
      const sMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        metalness: 0.5,
        roughness: 0.3
      });
      const stalk = new THREE.Mesh(sGeo, sMat);
      stalk.position.y = 0.3;
      pinGroup.add(stalk);

      // Pin Head (Octahedron)
      const isCurrentSelected = city.id === selectedCityId;
      const headGeo = new THREE.OctahedronGeometry(isCurrentSelected ? 0.26 : 0.2, 0);
      const headMat = new THREE.MeshStandardMaterial({
        color: isCurrentSelected ? 0xf59e0b : pinColor,
        emissive: isCurrentSelected ? 0xd97706 : pinColor,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.4
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.65;
      head.userData = { cityData: city };
      pinGroup.add(head);
      pinMeshes.push(head);

      landGroup.add(pinGroup);
    });

    // Raycaster for hover/click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinMeshes);

      if (intersects.length > 0) {
        setHoveredCity(intersects[0].object.userData.cityData);
      } else {
        setHoveredCity(null);
      }
    };

    const handleClick = () => {
      if (hoveredCity && onSelectCity) {
        onSelectCity(hoveredCity.id);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);

    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      // Gentle rotation
      landGroup.rotation.y = elapsed * 0.08;

      // Bob pins
      pinMeshes.forEach((mesh, idx) => {
        mesh.position.y = 0.65 + Math.sin(elapsed * 2 + idx) * 0.04;
        mesh.rotation.y = elapsed * 0.8;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, [selectedCityId]);

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 overflow-hidden flex items-center justify-center shadow-xs">
      {hasWebGL ? (
        <div ref={mountRef} className="w-full h-full cursor-pointer" />
      ) : (
        <div className="p-6 text-center space-y-2">
          <MapPin className="w-10 h-10 text-[#075E54] mx-auto" />
          <div className="font-bold text-xs">9 Cooperative Districts Operational</div>
          <div className="text-[11px] text-slate-500">
            Vijayawada, Hyderabad, Bengaluru, Visakhapatnam, Chennai, Mumbai, Delhi, Kolkata, Kochi
          </div>
        </div>
      )}

      {/* Top Left Title Badge */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-medium flex items-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="font-bold text-slate-800 dark:text-slate-200">
          9-District Federation Grid
        </span>
      </div>

      {/* Hover Info Card */}
      {hoveredCity && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-slate-900/95 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1 z-20 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="font-black text-amber-400 text-xs">
            {hoveredCity.name}
          </div>
          <div className="text-[11px] text-slate-400">
            {hoveredCity.district} • {hoveredCity.state}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400">Artisans:</span>{" "}
              <strong className="font-mono">{hoveredCity.artisans}</strong>
            </div>
            <div>
              <span className="text-slate-400">Societies:</span>{" "}
              <strong className="font-mono">{hoveredCity.societies}</strong>
            </div>
            <div>
              <span className="text-slate-400">Avg SLA:</span>{" "}
              <strong className="font-mono text-emerald-300">{hoveredCity.sla}</strong>
            </div>
            <div>
              <span className="text-slate-400">Welfare:</span>{" "}
              <strong className="font-mono text-amber-300">
                {hoveredCity.welfareCorpus}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right Tag */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
        Click to focus district
      </div>
    </div>
  );
};

