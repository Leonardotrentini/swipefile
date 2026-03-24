"use client";

import { motion } from "framer-motion";
import { Offer } from "@/lib/api";
import ScoreRing from "./ScoreRing";
import Link from "next/link";
import { Badge } from "lucide-react";

interface GlassCardProps {
  offer: Offer;
}

const statusConfig = {
  Hot: { bg: "from-emerald-500/20 to-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  Novo: { bg: "from-indigo-500/20 to-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400" },
  Observar: { bg: "from-amber-500/20 to-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
};

export default function GlassCard({ offer }: GlassCardProps) {
  const status = statusConfig[offer.status as keyof typeof statusConfig] || statusConfig.Novo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/offers/${offer.id}`}>
        <motion.div
          className={`
            relative overflow-hidden rounded-2xl border ${status.border}
            bg-gradient-to-br ${status.bg} backdrop-blur-xl
            p-6 cursor-pointer group h-full
            hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300
          `}
          whileHover={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
        >
          {/* Animated gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            style={{
              background: `linear-gradient(135deg, transparent, rgba(99, 102, 241, 0.1), transparent)`,
              backgroundSize: "200% 200%",
            }}
          />

          <div className="relative z-10 space-y-4">
            {/* Header with status and score */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-2 mb-2">
                  <motion.span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text} border ${status.border}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {offer.status}
                  </motion.span>
                  {offer.has_insight && (
                    <motion.span
                      className="px-2 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      ✓ Analisada
                    </motion.span>
                  )}
                </div>
                <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">
                  {offer.name}
                </h3>
                <p className="text-sm text-[#9ca3af] mt-1">{offer.advertiser}</p>
              </div>

              {/* Score Ring */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ScoreRing score={offer.offer_score} size="sm" />
              </motion.div>
            </div>

            {/* Product info */}
            <div className="space-y-2">
              <p className="text-xs text-[#6b7280] uppercase tracking-widest font-medium">
                {offer.niche}
              </p>
              <p className="text-sm text-[#e8e8f0]">{offer.product}</p>
            </div>

            {/* Funnel type */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {offer.funnel_type.split("+").map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {item.trim()}
                </span>
              ))}
            </motion.div>

            {/* Footer with metrics */}
            <motion.div
              className="flex gap-4 text-xs text-[#9ca3af] pt-4 border-t border-white/5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <p className="text-[#6b7280]">Ads ativos</p>
                <p className="font-semibold text-white">{offer.ad_count}</p>
              </div>
              <div>
                <p className="text-[#6b7280]">Dias rodando</p>
                <p className="font-semibold text-white">{offer.ads_running_days}</p>
              </div>
              <div>
                <p className="text-[#6b7280]">AOV</p>
                <p className="font-semibold text-white">
                  {(offer.order_bump_price + offer.upsell_price + offer.front_end_price).toFixed(0)} R$
                </p>
              </div>
            </motion.div>
          </div>

          {/* Corner accent */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-2xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
