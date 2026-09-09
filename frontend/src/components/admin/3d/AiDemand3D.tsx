import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable } from "../../3d/webgl/WebGLDetector";
import { TrendingUp, Users, Cpu, ArrowUpRight } from "lucide-react";

interface DemandCity {
  id: string;
  name: string;
  trade: string;
  demandScore: number; // 1 to 10
  expectedBookings: number;
  availableArtisans: number;
  gap: number;
  recommendation: string;
  x: number;
  z: number;
}

const DEMAND_DATA: DemandCity[] = [
  { id: "c1", name: "Vijayawada", trade: "Electrician", demandScore: 8.5, expectedBookings: 64, availableArtisans: 48, gap: -16, recommendation: "Deploy 12 apprentice electricians from Guntur buffer", x: -2.4, z: 0.8 },
  { id: "c2", name: "Hyderabad", trade: "Plumbing", demandScore: 9.2, expectedBookings: 110, availableArtisans: 85, gap: -25, recommendation: "Activate regional emergency overtime bonus (+15%)", x: -0.8, z: -1.2 },
  { id: "c3", name: "Bengaluru", trade: "HVAC & AC", demandScore: 9.6, expectedBookings: 145, availableArtisans: 110, gap: -35, recommendation: "Reallocate 20 master technicians to South cluster", x: 1.2, z: 0.6 },
  { id: "c4", name: "Chennai", trade: "Carpentry", demandScore: 6.4, expectedBookings: 42, availableArtisans: 50, gap: 8, recommendation: "Capacity optimal; no reallocation needed", x: 2.5, z: -0.5 }
];

export const AiDemand3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredCity, setHoveredCity] = useState<DemandCity | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5, 6);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const chartGroup = new THREE.Group();
    scene.add(chartGroup);

    // Base Grid Plane
    const gridGeo = new THREE.PlaneGeometry(7, 4.5);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x075e54,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    chartGroup.add(grid);

    // Generate Vertical 3D Demand Columns
    const columnMeshes: THREE.Mesh[] = [];

    DEMAND_DATA.forEach((city) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(city.x, 0, city.z);

      const colHeight = (city.demandScore / 10) * 2.2;
      const colGeo = new THREE.BoxGeometry(0.6, colHeight, 0.6);
      const isCriticalGap = city.gap < -20;
      const colColor = isCriticalGap ? 0xef4444 : city.gap < 0 ? 0xf59e0b : 0x16865c;

      const colMat = new THREE.MeshStandardMaterial({
        color: colColor,
        roughness: 0.2,
        metalness: 0.2,
        emissive: colColor,
        emissiveIntensity: 0.3
      });

      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.y = colHeight / 2;
      colMesh.userData = { cityData: city };
      colGroup.add(colMesh);
      columnMeshes.push(colMesh);

      // Available Artisans marker (small sphere beside column)
      const workerGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const workerMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5
      });
      const workerMarker = new THREE.Mesh(workerGeo, workerMat);
      workerMarker.position.set(0.45, 0.2, 0);
      colGroup.add(workerMarker);

      chartGroup.add(colGroup);
    });

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(columnMeshes);

      if (intersects.length > 0) {
        setHoveredCity(intersects[0].object.userData.cityData);
      } else {
        setHoveredCity(null);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      chartGroup.rotation.y = Math.sin(elapsed * 0.3) * 0.12;

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
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[320px] rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 overflow-hidden flex items-center justify-center shadow-xs">
      {hasWebGL ? (
        <div ref={mountRef} className="w-full h-full cursor-pointer" />
      ) : (
        <div className="p-6 text-center space-y-2">
          <TrendingUp className="w-10 h-10 text-blue-600 mx-auto" />
          <div className="font-bold text-xs">AI Predictive Allocation Engine Active</div>
          <div className="text-[11px] text-slate-500">
            Real-time demand surges monitored across 4 regional clusters.
          </div>
        </div>
      )}

      {/* Top Left Title */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-medium flex items-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        <span className="font-bold text-slate-800 dark:text-slate-200">
          3D Predictive Demand &amp; Workforce Gap
        </span>
      </div>

      {/* Hover Info Card */}
      {hoveredCity && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-slate-900/95 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1 z-20 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-black text-amber-400 text-xs">
              {hoveredCity.name} • {hoveredCity.trade}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-300 font-mono text-[10px]">
              Demand: {hoveredCity.demandScore}/10
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400">Est Bookings:</span>{" "}
              <strong className="font-mono">{hoveredCity.expectedBookings}</strong>
            </div>
            <div>
              <span className="text-slate-400">Available Artisans:</span>{" "}
              <strong className="font-mono">{hoveredCity.availableArtisans}</strong>
            </div>
          </div>

          <div className="text-[11px] text-emerald-400 pt-1 border-t border-slate-800 flex items-start gap-1">
            <Cpu className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{hoveredCity.recommendation}</span>
          </div>
        </div>
      )}
    </div>
  );
};

