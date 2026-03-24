"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  color?: "indigo" | "pink" | "emerald" | "amber";
  delay?: number;
}

const colorConfig = {
  indigo: {
    bg: "from-indigo-500/10 to-indigo-500/5",
    border: "border-indigo-500/20",
    icon: "text-indigo-400",
    ring: "bg-indigo-500/20",
  },
  pink: {
    bg: "from-pink-500/10 to-pink-500/5",
    border: "border-pink-500/20",
    icon: "text-pink-400",
    ring: "bg-pink-500/20",
  },
  emerald: {
    bg: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    ring: "bg-emerald-500/20",
  },
  amber: {
    bg: "from-amber-500/10 to-amber-500/5",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    ring: "bg-amber-500/20",
  },
};

export default function StatsCard({
  label,
  value,
  icon,
  color = "indigo",
  delay = 0,
}: StatsCardProps) {
  const config = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative overflow-hidden rounded-2xl border ${config.border}
        bg-gradient-to-br ${config.bg} backdrop-blur-xl
        p-6 hover:border-opacity-50 transition-all duration-300
        group hover:shadow-lg hover:shadow-indigo-500/10
      `}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        style={{
          background: `linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.1), transparent)`,
          backgroundSize: "200% 200%",
        }}
      />

      <div className="relative z-10">
        {icon && (
          <motion.div
            className={`text-3xl mb-3 ${config.icon}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {icon}
          </motion.div>
        )}

        <p className="text-sm text-[#9ca3af] uppercase tracking-widest font-medium mb-2">
          {label}
        </p>

        <motion.p
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <CountUp value={typeof value === "number" ? value : 0} />
          {typeof value === "string" && value}
        </motion.p>
      </div>
    </motion.div>
  );
}

function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const duration = 800;
    const startTime = Date.now();

    const updateValue = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.floor(value * progress));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    updateValue();
  }, [value]);

  return <>{displayValue}</>;
}

import React from "react";
