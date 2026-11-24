"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
}

/**
 * Interactive 3D tilt container with cursor-tracked specular amber glare.
 * Respects OS prefers-reduced-motion settings.
 */
export default function Tilt3DCard({
  children,
  className = "",
  maxTilt = 8,
  glareOpacity = 0.16,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);

  const glareBackground = useMotionTemplate`radial-gradient(280px circle at ${mouseX}% ${mouseY}%, rgba(245, 158, 11, ${glareOpacity}), transparent 75%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || e.pointerType === "touch") return;
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const clampedX = Math.max(0, Math.min(1, px));
    const clampedY = Math.max(0, Math.min(1, py));

    rawRotateY.set((clampedX - 0.5) * 2 * maxTilt);
    rawRotateX.set((0.5 - clampedY) * 2 * maxTilt);
    mouseX.set(clampedX * 100);
    mouseY.set(clampedY * 100);
  };

  const handlePointerLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    mouseX.set(50);
    mouseY.set(50);
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div style={{ perspective: "1000px" }} className="h-full">
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ z: 10 }}
        className={`group/tilt relative h-full will-change-transform ${className}`}
      >
        {children}
        <motion.div
          aria-hidden="true"
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300 z-30"
        />
      </motion.div>
    </div>
  );
}
