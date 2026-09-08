import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable } from "../../3d/webgl/WebGLDetector";
import { AlertTriangle, ShieldAlert, Smartphone, CreditCard, UserX } from "lucide-react";

interface GraphEntity {
  id: string;
  name: string;
  type: "worker" | "device" | "bank" | "pan";
  pos: [number, number, number];
  isFraudNode?: boolean;
  notes: string;
}

const FRAUD_ENTITIES: GraphEntity[] = [
  { id: "w1", name: "Worker: Ramesh K. (Flagged)", type: "worker", pos: [-1.8, 0.8, 0], isFraudNode: true, notes: "Applicant submitted duplicate biometric checksum" },
  { id: "w2", name: "Worker: Suresh V. (Under Review)", type: "worker", pos: [1.8, 0.8, 0], isFraudNode: true, notes: "Linked to same hardware device IMEI" },
  { id: "dev", name: "Hardware Device #DEV-9021", type: "device", pos: [0, 1.6, 0.5], isFraudNode: true, notes: "Single smartphone registering 2 distinct identities" },
  { id: "bank", name: "Bank Acct: **8921 (SBIN)", type: "bank", pos: [0, -0.8, 0], isFraudNode: true, notes: "Shared beneficiary account collision across profiles" },
  { id: "pan", name: "PAN: ABCDE1234F (Collision)", type: "pan", pos: [0, -1.8, 0.8], isFraudNode: true, notes: "Duplicate PAN record collision in NSDL gateway" }
];

export const FraudNetwork3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredEntity, setHoveredEntity] = useState<GraphEntity | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.6);
    dirLight.position.set(4, 6, 6);
    scene.add(dirLight);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Add Nodes
    const nodeMeshes: THREE.Mesh[] = [];

    FRAUD_ENTITIES.forEach((entity) => {
      const geo =
        entity.type === "worker"
          ? new THREE.SphereGeometry(0.36, 24, 24)
          : entity.type === "device"
          ? new THREE.BoxGeometry(0.5, 0.6, 0.2)
          : new THREE.CylinderGeometry(0.35, 0.35, 0.25, 24);

      const color = entity.type === "worker" ? 0xef4444 : entity.type === "device" ? 0xf59e0b : 0xd97706;

      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.3
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...entity.pos);
      mesh.userData = { entityData: entity };
      graphGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Orbiting pulse ring for fraud node
      const pulseGeo = new THREE.RingGeometry(0.48, 0.55, 24);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.position.set(...entity.pos);
      pulse.name = "pulse";
      graphGroup.add(pulse);
    });

    // Connecting Red Lines (Collision lattice)
    const connections = [
      [0, 2], // w1 -> dev
      [1, 2], // w2 -> dev
      [0, 3], // w1 -> bank
      [1, 3], // w2 -> bank
      [3, 4]  // bank -> pan
    ];

    connections.forEach(([fromIdx, toIdx]) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...FRAUD_ENTITIES[fromIdx].pos),
        new THREE.Vector3(...FRAUD_ENTITIES[toIdx].pos)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xef4444,
        linewidth: 2,
        transparent: true,
        opacity: 0.7
      });
      const line = new THREE.Line(lineGeo, lineMat);
      graphGroup.add(line);
    });

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        setHoveredEntity(intersects[0].object.userData.entityData);
      } else {
        setHoveredEntity(null);
      }
    };

    container.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow drift
      graphGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.15;
      graphGroup.rotation.x = Math.cos(elapsed * 0.3) * 0.08;

      // Pulse rings
      graphGroup.children.forEach((child) => {
        if (child.name === "pulse") {
          child.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.15);
        }
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
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[340px] rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 overflow-hidden flex items-center justify-center shadow-xs">
      {hasWebGL ? (
        <div ref={mountRef} className="w-full h-full cursor-pointer" />
      ) : (
        <div className="p-6 text-center space-y-2">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <div className="font-bold text-xs">Risk Collision Sentinel Graph Active</div>
          <div className="text-[11px] text-slate-500">
            Hardware device &amp; bank account cross-referencing anomaly flagged.
          </div>
        </div>
      )}

      {/* Top Left Title */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-medium flex items-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <span className="font-bold text-slate-800 dark:text-slate-200">
          Risk Anomaly Graph
        </span>
      </div>

      {/* Top Right Demo Tag */}
      <div className="absolute top-3 right-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
        DEMO FRAUD CASE
      </div>

      {/* Hover Info Card */}
      {hoveredEntity && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-slate-900/95 text-white p-3.5 rounded-xl border border-rose-800/80 shadow-xl text-xs space-y-1 z-20 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="font-black text-rose-400 text-xs">
            {hoveredEntity.name}
          </div>
          <div className="text-[11px] text-slate-300">
            {hoveredEntity.notes}
          </div>
        </div>
      )}
    </div>
  );
};

