import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  glare?: boolean;
  glareOpacity?: number;
  scaleOnHover?: number;
  onClick?: () => void;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = "",
  maxTilt = 12,
  perspective = 1000,
  glare = true,
  glareOpacity = 0.22,
  scaleOnHover = 1.02,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Normalized mouse coordinates: -0.5 (left/top) to +0.5 (right/bottom)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery-smooth responsiveness without jitter
  const springConfig = { damping: 24, stiffness: 320, mass: 0.5 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  // 3D rotation angles
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Dynamic light glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["10%", "90%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["10%", "90%"]);
  const currentGlareOpacity = useTransform(
    mouseX,
    [-0.5, 0, 0.5],
    [glareOpacity, glareOpacity * 0.4, glareOpacity]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse position relative to center of the card
    const mousePosX = e.clientX - rect.left;
    const mousePosY = e.clientY - rect.top;

    const xPct = mousePosX / width - 0.5;
    const yPct = mousePosY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="inline-block w-full"
      onClick={onClick}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: scaleOnHover }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className={`relative transition-shadow duration-300 ${className}`}
      >
        {/* Child content with preserve-3d context */}
        <div style={{ transformStyle: "preserve-3d" }} className="w-full h-full">
          {children}
        </div>

        {/* Dynamic Specular Holographic Glare Sheen */}
        {glare && (
          <motion.div
            style={{
              opacity: currentGlareOpacity,
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle 320px at ${gx} ${gy}, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1) 40%, transparent 80%)`
              )
            }}
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-30 transition-opacity duration-300"
          />
        )}
      </motion.div>
    </div>
  );
};

