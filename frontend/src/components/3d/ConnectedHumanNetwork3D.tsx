import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Wrench,
  Hammer,
  Sparkles,
  ShieldCheck,
  Paintbrush,
  Star,
  CheckCircle2,
  Users,
  Building2,
  ArrowUpRight
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface TradeNode {
  id: string;
  name: string;
  trade: string;
  specialist: string;
  society: string;
  rating: number;
  experience: string;
  rate: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  pos: [number, number, number];
}

const TRADE_NODES: TradeNode[] = [
  {
    id: "electrician",
    name: "Electrician",
    trade: "Electrical & Solar",
    specialist: "Rajesh Kumar",
    society: "Vijayawada Central Labour Co-op",
    rating: 4.96,
    experience: "9 Yrs Exp",
    rate: "₹380/hr",
    icon: Zap,
    color: "#3B82F6", // Electric Blue
    pos: [2.6, 1.2, 0.4]
  },
  {
    id: "plumber",
    name: "Plumber",
    trade: "Plumbing & Hydraulics",
    specialist: "Suresh Varma",
    society: "Guntur Urban Artisan Co-op",
    rating: 4.92,
    experience: "7 Yrs Exp",
    rate: "₹350/hr",
    icon: Wrench,
    color: "#06B6D4", // Neon Cyan
    pos: [-2.4, 1.4, -0.2]
  },
  {
    id: "carpenter",
    name: "Carpenter",
    trade: "Carpentry & Joinery",
    specialist: "K. Mohan Rao",
    society: "Krishna District Woodcraft Co-op",
    rating: 4.95,
    experience: "12 Yrs Exp",
    rate: "₹420/hr",
    icon: Hammer,
    color: "#F59E0B", // Amber Gold
    pos: [-2.6, -1.2, 0.6]
  },
  {
    id: "ac_repair",
    name: "AC Specialist",
    trade: "HVAC & Thermal",
    specialist: "V. Ravi Teja",
    society: "Visakha Refrigeration Co-op",
    rating: 4.98,
    experience: "8 Yrs Exp",
    rate: "₹450/hr",
    icon: Sparkles,
    color: "#60A5FA", // Sky Blue
    pos: [2.4, -1.3, -0.4]
  },
  {
    id: "mason",
    name: "Mason",
    trade: "Civil & Masonry",
    specialist: "B. Venkatesh",
    society: "AP State Construction Co-op",
    rating: 4.89,
    experience: "14 Yrs Exp",
    rate: "₹400/hr",
    icon: ShieldCheck,
    color: "#10B981", // Emerald
    pos: [0, 2.3, 0.5]
  },
  {
    id: "painter",
    name: "Painter",
    trade: "Surface Coating",
    specialist: "D. Srinivas",
    society: "Amaravati Artisans Guild",
    rating: 4.91,
    experience: "6 Yrs Exp",
    rate: "₹320/hr",
    icon: Paintbrush,
    color: "#8B5CF6", // Violet
    pos: [0, -2.4, 0.3]
  }
];

interface ConnectedHumanNetwork3DProps {
  onTradeSelect?: (tradeId: string) => void;
  className?: string;
}

export const ConnectedHumanNetwork3D: React.FC<ConnectedHumanNetwork3DProps> = ({
  onTradeSelect,
  className = ""
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeNode, setActiveNode] = useState<TradeNode>(TRADE_NODES[0]);
  const [isHovering, setIsHovering] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Mouse interaction coordinates
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 560;
    const height = mountRef.current.clientHeight || 460;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.5;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // 3. Central Cooperative Federation Core (Icosahedron + Wireframe cage)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeo = new THREE.IcosahedronGeometry(1.05, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x2563eb : 0x1d4ed8,
      roughness: 0.25,
      metalness: 0.8,
      wireframe: false,
      transparent: true,
      opacity: 0.92
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Outer crystalline wireframe shell
    const wireGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // Orbital Ring 1
    const ringGeo1 = new THREE.TorusGeometry(1.7, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: isDark ? 0x60a5fa : 0x2563eb,
      transparent: true,
      opacity: 0.4
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh1);

    // Orbital Ring 2 (Perpendicular)
    const ringGeo2 = new THREE.TorusGeometry(1.85, 0.018, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: isDark ? 0x8b5cf6 : 0x4f46e5,
      transparent: true,
      opacity: 0.35
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.z = Math.PI / 6;
    coreGroup.add(ringMesh2);

    // 4. Trade Nodes and Dynamic Connection Curves
    const nodeMeshes: { mesh: THREE.Mesh; node: TradeNode }[] = [];
    const curveLines: THREE.Line[] = [];
    const energyBeads: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; t: number; speed: number }[] = [];

    const beadGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const beadMat = new THREE.MeshBasicMaterial({ color: isDark ? 0x38bdf8 : 0x2563eb });

    TRADE_NODES.forEach((node) => {
      const nodeGeo = new THREE.SphereGeometry(0.28, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        roughness: 0.2,
        metalness: 0.7,
        emissive: new THREE.Color(node.color),
        emissiveIntensity: isDark ? 0.35 : 0.15
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(...node.pos);
      scene.add(nodeMesh);
      nodeMeshes.push({ mesh: nodeMesh, node });

      // Halo ring around each node
      const haloGeo = new THREE.RingGeometry(0.35, 0.42, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isDark ? 0.45 : 0.3
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.copy(nodeMesh.position);
      haloMesh.lookAt(camera.position);
      scene.add(haloMesh);

      // Connection Curve from Core [0,0,0] to Node
      const start = new THREE.Vector3(0, 0, 0);
      const end = new THREE.Vector3(...node.pos);
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(node.pos[1] * 0.2, -node.pos[0] * 0.2, 0.4));

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: isDark ? 0x38bdf8 : 0x60a5fa,
        transparent: true,
        opacity: isDark ? 0.35 : 0.25
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      curveLines.push(line);

      // Flowing Energy Bead along connection
      const bead = new THREE.Mesh(beadGeo, beadMat);
      scene.add(bead);
      energyBeads.push({
        mesh: bead,
        curve,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.002
      });
    });

    // 5. Floating Ambient Sparkle Dust
    const particleCount = 70;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 8;
      pPos[i + 1] = (Math.random() - 0.5) * 6;
      pPos[i + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: isDark ? 0x38bdf8 : 0x2563eb,
      size: 0.05,
      transparent: true,
      opacity: isDark ? 0.6 : 0.35
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(isDark ? 0xffffff : 0xf8fafc, isDark ? 1.0 : 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.8 : 2.0);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, isDark ? 2.5 : 1.5, 12);
    cyanRimLight.position.set(-4, -2, 3);
    scene.add(cyanRimLight);

    const amberFillLight = new THREE.PointLight(0xf59e0b, isDark ? 2.0 : 1.2, 10);
    amberFillLight.position.set(3, -3, 2);
    scene.add(amberFillLight);

    // 7. Raycaster for Interactive Node Click / Hover
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.targetX = x * 0.4;
      mouseRef.current.targetY = y * 0.3;

      mouseVector.x = x;
      mouseVector.y = y;
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) {
          setActiveNode(hit.node);
          setIsHovering(true);
        }
      }
    };

    const handlePointerClick = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map((n) => n.mesh));
      if (intersects.length > 0) {
        const hit = nodeMeshes.find((n) => n.mesh === intersects[0].object);
        if (hit) {
          setActiveNode(hit.node);
          onTradeSelect?.(hit.node.id);
        }
      }
    };

    const domEl = mountRef.current;
    domEl.addEventListener("mousemove", handlePointerMove);
    domEl.addEventListener("click", handlePointerClick);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x * 2.2;
      camera.position.y = mouseRef.current.y * 1.8;
      camera.lookAt(0, 0, 0);

      // Core rotations
      coreGroup.rotation.y = elapsedTime * 0.25;
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15;
      wireMesh.rotation.y = -elapsedTime * 0.35;
      ringMesh1.rotation.z = elapsedTime * 0.4;
      ringMesh2.rotation.z = -elapsedTime * 0.3;

      // Pulse floating dust
      particles.rotation.y = elapsedTime * 0.05;

      // Move energy beads along curves
      energyBeads.forEach((bead) => {
        bead.t += bead.speed;
        if (bead.t > 1) bead.t = 0;
        const pos = bead.curve.getPoint(bead.t);
        bead.mesh.position.copy(pos);
      });

      // Subtle breathing for nodes
      nodeMeshes.forEach(({ mesh, node }, i) => {
        const bob = Math.sin(elapsedTime * 1.8 + i) * 0.05;
        mesh.position.y = node.pos[1] + bob;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (domEl) {
        domEl.removeEventListener("mousemove", handlePointerMove);
        domEl.removeEventListener("click", handlePointerClick);
        domEl.innerHTML = "";
      }
      renderer.dispose();
    };
  }, [isDark, onTradeSelect]);

  // Automated gentle rotation of active specialist every 5s if user is not hovering
  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setActiveNode((prev) => {
        const nextIdx = (TRADE_NODES.findIndex((t) => t.id === prev.id) + 1) % TRADE_NODES.length;
        return TRADE_NODES[nextIdx];
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovering]);

  return (
    <div
      className={`relative w-full max-w-xl mx-auto flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic Background Atmospheric Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-indigo-600/20 blur-3xl animate-pulse" />
      </div>

      {/* 3D WebGL Canvas Viewport */}
      {webglSupported ? (
        <div
          ref={mountRef}
          className="w-full h-[360px] sm:h-[420px] cursor-grab active:cursor-grabbing relative"
          title="Interact with COOPNEX Connected Human Network"
        />
      ) : (
        /* Graceful SVG Fallback for low-powered devices */
        <div className="w-full h-[360px] sm:h-[420px] flex items-center justify-center relative">
          <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Users className="w-12 h-12" />
          </div>
        </div>
      )}

      {/* Active Artisan Trade Spotlight Card */}
      <motion.div
        key={activeNode.id}
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.96 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md -mt-4 z-10 p-4 rounded-2xl bg-white/95 dark:bg-[#0A1128]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ backgroundColor: activeNode.color }}
            >
              <activeNode.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {activeNode.specialist}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  NSQF-4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {activeNode.trade} • {activeNode.experience}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{activeNode.rating}</span>
            </div>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 block mt-0.5">
              {activeNode.rate}
            </span>
          </div>
        </div>

        {/* Cooperative Society Badge */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{activeNode.society}</span>
          </div>
          <button
            type="button"
            onClick={() => onTradeSelect?.(activeNode.id)}
            className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-0.5 shrink-0 ml-2 cursor-pointer"
          >
            <span>Book Artisan</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>

      {/* Trade Selector Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-lg">
        {TRADE_NODES.map((node) => {
          const isSelected = activeNode.id === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                setActiveNode(node);
                onTradeSelect?.(node.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <node.icon className="w-3.5 h-3.5" />
              <span>{node.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

