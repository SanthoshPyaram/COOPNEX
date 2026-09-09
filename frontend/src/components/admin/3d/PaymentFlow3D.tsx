import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable } from "../../3d/webgl/WebGLDetector";
import { CreditCard, Sparkles } from "lucide-react";

export const PaymentFlow3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 2.8, 7.2);
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

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    dirLight.position.set(4, 6, 4);
    scene.add(dirLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 5 Checkpoint Stages: Customer -> Payment -> Booking -> Cooperative -> Worker
    const stages = [
      { x: -3.4, label: "Customer", color: 0x0284c7 },
      { x: -1.7, label: "Payment", color: 0x075e54 },
      { x: 0.0, label: "Booking", color: 0x6366f1 },
      { x: 1.7, label: "Cooperative", color: 0xd97706 },
      { x: 3.4, label: "Worker", color: 0x10b981 }
    ];

    // Main Pipeline Guide Tube
    const pipeGeo = new THREE.CylinderGeometry(0.07, 0.07, 7.2, 24);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.7,
      roughness: 0.25
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.y = 0;
    rootGroup.add(pipe);

    // Checkpoint Pods and Pulsing Rings
    const ringMeshes: THREE.Mesh[] = [];

    stages.forEach((stage) => {
      const podGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.22, 24);
      const podMat = new THREE.MeshStandardMaterial({
        color: stage.color,
        roughness: 0.2,
        metalness: 0.4,
        emissive: stage.color,
        emissiveIntensity: 0.35
      });
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(stage.x, 0, 0);
      rootGroup.add(pod);

      const ringGeo = new THREE.RingGeometry(0.44, 0.52, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: stage.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(stage.x, 0, 0);
      rootGroup.add(ring);
      ringMeshes.push(ring);
    });

    // 2 Animated Golden Flow Tokens traveling in sequence
    const tokenGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 24);
    const tokenMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0xd97706,
      emissiveIntensity: 0.5
    });

    const token1 = new THREE.Mesh(tokenGeo, tokenMat);
    token1.rotation.x = Math.PI / 2;
    token1.position.y = 0.32;
    rootGroup.add(token1);

    const token2 = new THREE.Mesh(tokenGeo, tokenMat);
    token2.rotation.x = Math.PI / 2;
    token2.position.y = 0.32;
    rootGroup.add(token2);

    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      // Cycle token 1 across pipeline (-3.4 to 3.4) over 3.2 seconds
      const cycleDuration = 3.2;
      const t1 = (elapsed * 0.9) % cycleDuration;
      const norm1 = t1 / cycleDuration;
      token1.position.x = -3.4 + norm1 * 6.8;
      token1.rotation.z = elapsed * 3.5;

      // Token 2 offset by half cycle
      const t2 = ((elapsed * 0.9) + (cycleDuration / 2)) % cycleDuration;
      const norm2 = t2 / cycleDuration;
      token2.position.x = -3.4 + norm2 * 6.8;
      token2.rotation.z = elapsed * 3.5;

      // Gentle pulsing of the checkpoint rings
      ringMeshes.forEach((ring, idx) => {
        const pulse = 1 + Math.sin(elapsed * 3 + idx * 0.8) * 0.1;
        ring.scale.set(pulse, pulse, 1);
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
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* 3D Flow Canvas Container */}
      <div className="relative w-full h-[250px] sm:h-[270px] rounded-2xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shadow-xs">
        {hasWebGL ? (
          <div ref={mountRef} className="w-full h-full" />
        ) : (
          <div className="p-6 text-center space-y-2">
            <CreditCard className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="font-bold text-xs">Escrow Payout Flow Active</div>
            <div className="text-[11px] text-slate-500">
              Customer &rarr; Payment &rarr; Booking &rarr; Cooperative &rarr; Worker
            </div>
          </div>
        )}

        {/* Top Left Status Badge */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-medium flex items-center gap-2 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Real-Time Escrow &amp; Sovereign Payout Pipeline
          </span>
        </div>

        {/* Top Right Live Telemetry */}
        <div className="absolute top-3 right-3 hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold">
          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Zero Extraction • 0% Platform Commission</span>
        </div>

        {/* 5-Stage Sequence Strip at Bottom */}
        <div className="absolute bottom-3 inset-x-3 bg-slate-50/95 dark:bg-slate-900/90 backdrop-blur-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-5 text-center text-[10px] font-mono gap-1">
          <div className="text-blue-600 dark:text-blue-400 font-bold">1. Customer</div>
          <div className="text-teal-700 dark:text-teal-400 font-bold">2. Payment</div>
          <div className="text-indigo-600 dark:text-indigo-400 font-bold">3. Booking</div>
          <div className="text-amber-600 dark:text-amber-400 font-bold">4. Cooperative</div>
          <div className="text-emerald-600 dark:text-emerald-400 font-bold">5. Worker</div>
        </div>
      </div>

      {/* Transparent Financial Settlement Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gross Booking Value</div>
          <div className="text-base font-black font-mono text-blue-600 dark:text-blue-400">₹1,000.00</div>
          <div className="text-[10px] text-slate-500">Customer 100% Escrow</div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Platform Commission</div>
          <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">₹0.00 (0%)</div>
          <div className="text-[10px] text-slate-500">Public Good Infrastructure</div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cooperative Welfare Fund</div>
          <div className="text-base font-black font-mono text-amber-600 dark:text-amber-400">₹100.00 (10%)</div>
          <div className="text-[10px] text-slate-500">PMSBY + Distress Reserve</div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#101828] border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 shadow-2xs space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Worker Instant Net Payout</div>
          <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-300">₹900.00 (90%)</div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Direct DBT to Bank / UPI</div>
        </div>
      </div>
    </div>
  );
};

