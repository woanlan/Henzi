"use client";

import React from "react";

interface PandaMascotProps {
  mood?: "happy" | "thinking" | "cheering" | "neutral";
  size?: "sm" | "md" | "lg";
}

export function PandaMascot({ mood = "happy", size = "md" }: PandaMascotProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32 sm:w-36 sm:h-36",
    lg: "w-44 h-44 sm:w-52 sm:h-52",
  };

  return (
    <div className={`relative ${sizeClasses[size]} shrink-0 transition-transform duration-300 hover:scale-105 select-none`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Scholar Hat */}
        <path
          d="M45 42 L80 20 L115 42 L80 48 Z"
          fill="#DC2626"
          stroke="#991B1B"
          strokeWidth="2"
        />
        <rect x="74" y="15" width="12" height="7" rx="3" fill="#F59E0B" />
        <path d="M110 38 Q130 50 125 70" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

        {/* Panda Left Ear */}
        <circle cx="42" cy="46" r="20" fill="#1E293B" />
        <circle cx="42" cy="46" r="12" fill="#334155" />

        {/* Panda Right Ear */}
        <circle cx="118" cy="46" r="20" fill="#1E293B" />
        <circle cx="118" cy="46" r="12" fill="#334155" />

        {/* Panda Head (White with soft shading) */}
        <circle cx="80" cy="80" r="48" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />

        {/* Cheeks blush */}
        <ellipse cx="50" cy="94" rx="9" ry="5" fill="#FDA4AF" opacity="0.6" />
        <ellipse cx="110" cy="94" rx="9" ry="5" fill="#FDA4AF" opacity="0.6" />

        {/* Left Eye Patch */}
        <ellipse cx="58" cy="74" rx="14" ry="17" transform="rotate(-15 58 74)" fill="#1E293B" />
        {/* Right Eye Patch */}
        <ellipse cx="102" cy="74" rx="14" ry="17" transform="rotate(15 102 74)" fill="#1E293B" />

        {/* Eyes (Expression based on mood) */}
        {mood === "cheering" ? (
          <>
            {/* Happy curved eyes ^^ */}
            <path d="M52 74 Q58 66 64 74" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M96 74 Q102 66 108 74" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : mood === "thinking" ? (
          <>
            <circle cx="58" cy="70" r="5" fill="#FFFFFF" />
            <circle cx="58" cy="68" r="2.5" fill="#0F172A" />
            <circle cx="102" cy="70" r="5" fill="#FFFFFF" />
            <circle cx="102" cy="68" r="2.5" fill="#0F172A" />
          </>
        ) : (
          <>
            {/* Big friendly round eyes with sparkle */}
            <circle cx="58" cy="73" r="6" fill="#FFFFFF" />
            <circle cx="59" cy="73" r="4" fill="#0F172A" />
            <circle cx="57" cy="71" r="2" fill="#FFFFFF" />

            <circle cx="102" cy="73" r="6" fill="#FFFFFF" />
            <circle cx="101" cy="73" r="4" fill="#0F172A" />
            <circle cx="103" cy="71" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="80" cy="88" rx="7" ry="5" fill="#0F172A" />

        {/* Mouth */}
        {mood === "cheering" ? (
          <path d="M72 96 Q80 108 88 96 Z" fill="#F43F5E" stroke="#0F172A" strokeWidth="2" />
        ) : mood === "thinking" ? (
          <ellipse cx="80" cy="98" rx="4" ry="5" fill="#0F172A" />
        ) : (
          <path d="M73 95 Q80 102 87 95" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Body & Arms holding book */}
        <path d="M40 125 Q80 115 120 125 L125 160 L35 160 Z" fill="#1E293B" />
        <ellipse cx="80" cy="145" rx="28" ry="20" fill="#FFFFFF" />

        {/* Notebook / Scroll in hands */}
        <rect
          x="54"
          y="114"
          width="52"
          height="38"
          rx="5"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="2"
          transform="rotate(-4 80 133)"
        />
        <rect
          x="58"
          y="118"
          width="44"
          height="30"
          rx="3"
          fill="#FFFBEB"
          transform="rotate(-4 80 133)"
        />
        {/* Character on notebook */}
        <text
          x="75"
          y="138"
          fontSize="14"
          fontFamily="Noto Serif SC, serif"
          fontWeight="bold"
          fill="#B45309"
          textAnchor="middle"
          transform="rotate(-4 80 133)"
        >
          汉
        </text>

        {/* Yellow Pencil in hand */}
        <path
          d="M106 108 L122 124 L116 130 L100 114 Z"
          fill="#FBBF24"
          stroke="#B45309"
          strokeWidth="1.5"
        />
        {/* Pencil tip */}
        <path d="M122 124 L127 129 L125 122 Z" fill="#F43F5E" />

        {/* Left Arm paw */}
        <ellipse cx="52" cy="128" rx="10" ry="8" fill="#1E293B" transform="rotate(15 52 128)" />
        {/* Right Arm paw */}
        <ellipse cx="108" cy="128" rx="10" ry="8" fill="#1E293B" transform="rotate(-15 108 128)" />
      </svg>
    </div>
  );
}
