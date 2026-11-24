"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Scroll-triggered 3D depth reveal wrapper for homepage & catalog sections.
 */
export default function MotionSection({
  children,
  className = "",
  delay = 0,
}: MotionSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, rotateX: 4 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
