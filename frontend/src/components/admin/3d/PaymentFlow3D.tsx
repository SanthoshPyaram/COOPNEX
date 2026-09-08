import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { isWebGLAvailable } from "../../3d/webgl/WebGLDetector";
import { CreditCard, Wallet, ShieldCheck, ArrowRight } from "lucide-react";

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

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.5);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    dirLight.position.set(4, 6, 4);
    scene.add(dirLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 4 Checkpoint Stages
    const stages = [
      { x: -3.0, label: "Customer Payment", color: 0x0284c7 },
      { x: -1.0, label: "Bank Escrow", color: 0x075e54 },
      { x: 1.0, label: "100% Worker UPI", color: 0x16865c },
      { x: 3.0, label: "2% Welfare Fund", color: 0xf59e0b }
    ];

    // Pipeline Tube
    const pipeGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.2, 16);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.6,
      roughness: 0.3
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.y = 0;
    rootGroup.add(pipe);

    // Checkpoint Pods
    stages.forEach((stage) => {
      const podGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.25, 24);
      const podMat = new THREE.MeshStandardMaterial({
        color: stage.color,
        roughness: 0.2,
        metalness: 0.3,
        emissive: stage.color,
        emissiveIntensity: 0.3
      });
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(stage.x, 0, 0);
      rootGroup.add(pod);

      const ringGeo = new THREE.RingGeometry(0.48, 0.54, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: stage.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(stage.x, 0, 0);
      rootGroup.add(ring);
    });

    // Animated Golden Token
    const tokenGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 24);
    const tokenMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.8,
      roughness: 0.15,
      emissive: 0xd97706,
      emissiveIntensity: 0.6
    });
    const token = new THREE.Mesh(tokenGeo, tokenMat);
    token.rotation.x = Math.PI / 2;
    token.position.y = 0.35;
    rootGroup.add(token);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Cycle token across pipeline (-3 to 3)
      const t = (elapsed * 0.8) % 3; // 0 to 3s cycle
      const norm = t / 3;
      token.position.x = -3.0 + norm * 6.0;
      token.rotation.z = elapsed * 3;

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
    <div className="relative w-full h-[260px] sm:h-[280px] rounded-2xl bg-white dark:bg-[#101828] border border-[#E4E9F0] dark:border-slate-800 overflow-hidden flex items-center justify-center shadow-xs">
      {hasWebGL ? (
        <div ref={mountRef} className="w-full h-full" />
      ) : (
        <div className="p-6 text-center space-y-2">
          <CreditCard className="w-10 h-10 text-emerald-600 mx-auto" />
          <div className="font-bold text-xs">Escrow Payout Flow Active</div>
          <div className="text-[11px] text-slate-500">
            Customer &rarr; Bank Escrow &rarr; 100% Worker UPI + 2% Welfare
          </div>
        </div>
      )}

      {/* Top Left Title */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-medium flex items-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="font-bold text-slate-800 dark:text-slate-200">
          Statutory Payment &amp; Escrow Pipeline
        </span>
      </div>

      {/* Stage Labels Bar at bottom */}
      <div className="absolute bottom-3 inset-x-3 bg-slate-50 dark:bg-slate-900/80 backdrop-blur-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-4 text-center text-[10px] font-mono">
        <div className="text-blue-600 dark:text-blue-400 font-bold">1. Customer Pmt</div>
        <div className="text-teal-700 dark:text-teal-400 font-bold">2. Escrow Lock</div>
        <div className="text-emerald-700 dark:text-emerald-400 font-bold">3. 100% Worker UPI</div>
        <div className="text-amber-600 dark:text-amber-400 font-bold">4. 2% Welfare Fund</div>
      </div>
    </div>
  );
};

