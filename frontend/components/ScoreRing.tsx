"use client";

import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number; // 0-100
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const sizeConfig = {
  sm: { radius: 30, strokeWidth: 3, fontSize: "text-lg" },
  md: { radius: 45, strokeWidth: 4, fontSize: "text-2xl" },
  lg: { radius: 60, strokeWidth: 5, fontSize: "text-4xl" },
};

export default function ScoreRing({
  score,
  size = "md",
  animated = true,
}: ScoreRingProps) {
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const offset = circumference - (score / 100) * circumference;

  // Cor baseada no score
  const getColor = (s: number) => {
    if (s >= 80) return "#10b981"; // Emerald
    if (s >= 60) return "#6366f1"; // Indigo
    if (s >= 40) return "#f59e0b"; // Amber
    return "#ef4444"; // Red
  };

  const color = getColor(score);

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <svg
          width={config.radius * 2 + config.strokeWidth * 2 + 10}
          height={config.radius * 2 + config.strokeWidth * 2 + 10}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.radius + config.strokeWidth + 5}
            cy={config.radius + config.strokeWidth + 5}
            r={config.radius}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth={config.strokeWidth}
          />

          {/* Animated progress circle */}
          <motion.circle
            cx={config.radius + config.strokeWidth + 5}
            cy={config.radius + config.strokeWidth + 5}
            r={config.radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animated ? offset : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            opacity={0.9}
          />

          {/* Glow effect */}
          <motion.circle
            cx={config.radius + config.strokeWidth + 5}
            cy={config.radius + config.strokeWidth + 5}
            r={config.radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animated ? offset : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            opacity={0.3}
            filter="blur(2px)"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className={`font-bold ${config.fontSize} text-white`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Math.round(score)}
            </motion.div>
            <div className="text-xs text-[#6b7280]">/100</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
