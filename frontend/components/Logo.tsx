"use client";

import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export default function Logo({ size = "md", animated = true }: LogoProps) {
  const sizeConfig = {
    sm: { width: 32, height: 32, strokeWidth: 1.5 },
    md: { width: 48, height: 48, strokeWidth: 2 },
    lg: { width: 64, height: 64, strokeWidth: 2.5 },
  };

  const config = sizeConfig[size];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={config.width}
      height={config.height}
      className="relative"
      animate={
        animated
          ? {
              filter: [
                "drop-shadow(0 0 4px rgba(99, 102, 241, 0.5))",
                "drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))",
                "drop-shadow(0 0 4px rgba(99, 102, 241, 0.5))",
              ],
            }
          : {}
      }
      transition={animated ? { duration: 2, repeat: Infinity } : {}}
    >
      {/* Outer eye shape - left */}
      <motion.path
        d="M 30 50 Q 20 30 35 20 L 50 15 Q 35 25 30 50 Q 20 75 35 85 L 50 90 Q 35 80 30 50"
        fill="none"
        stroke="url(#gradientPurple)"
        strokeWidth={config.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={animated ? { duration: 2, delay: 0 } : {}}
      />

      {/* Outer eye shape - right */}
      <motion.path
        d="M 70 50 Q 80 30 65 20 L 50 15 Q 65 25 70 50 Q 80 75 65 85 L 50 90 Q 65 80 70 50"
        fill="none"
        stroke="url(#gradientCyan)"
        strokeWidth={config.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
        transition={animated ? { duration: 2, delay: 0.2 } : {}}
      />

      {/* Middle ring 1 */}
      <motion.circle
        cx="50"
        cy="50"
        r="28"
        fill="none"
        stroke="url(#gradientPurpleCyan)"
        strokeWidth={config.strokeWidth * 0.8}
        initial={{ opacity: 0 }}
        animate={animated ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.7 }}
        transition={animated ? { duration: 2.5, repeat: Infinity } : {}}
      />

      {/* Middle ring 2 */}
      <motion.circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="url(#gradientCyanPurple)"
        strokeWidth={config.strokeWidth * 0.6}
        initial={{ opacity: 0 }}
        animate={
          animated ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.8 }
        }
        transition={
          animated ? { duration: 2.5, repeat: Infinity, delay: 0.3 } : {}
        }
      />

      {/* Center dot */}
      <motion.circle
        cx="50"
        cy="50"
        r="4"
        fill="url(#gradientCyan)"
        animate={animated ? { r: [3, 5, 3] } : { r: 4 }}
        transition={animated ? { duration: 1.5, repeat: Infinity } : {}}
      />

      {/* Grid lines for tech feel */}
      <g opacity="0.4" stroke="url(#gradientCyan)" strokeWidth={config.strokeWidth * 0.4}>
        <line x1="50" y1="22" x2="50" y2="78" />
        <line x1="30" y1="50" x2="70" y2="50" />
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="gradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="gradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="gradientPurpleCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="gradientCyanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
          <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
