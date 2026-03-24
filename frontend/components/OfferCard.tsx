"use client";

import Link from "next/link";
import { Offer } from "@/lib/api";

interface Props {
  offer: Offer;
  onDelete?: (id: number) => void;
}

const statusConfig = {
  Hot: { bg: "bg-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-400" },
  Novo: { bg: "bg-indigo-500/20", text: "text-indigo-400", dot: "bg-indigo-400" },
  Observar: { bg: "bg-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" },
};

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 70 ? "#10b981" : score >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, #1e1e2e 0deg)`,
        }}
      >
        <div className="w-10 h-10 rounded-full bg-[#12121a] flex items-center justify-center">
          <span className="text-white font-bold text-xs">{Math.round(score)}</span>
        </div>
      </div>
      <span className="text-[#6b7280] text-xs mt-1">score</span>
    </div>
  );
}

export default function OfferCard({ offer, onDelete }: Props) {
  const status = statusConfig[offer.status] || statusConfig.Novo;

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:border-indigo-500/50 transition-all group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {offer.status}
            </span>
            {offer.has_insight && (
              <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                Analisada
              </span>
            )}
          </div>
          <h3 className="text-white font-semibold text-sm truncate">{offer.name}</h3>
          <p className="text-[#6b7280] text-xs mt-0.5">{offer.advertiser}</p>
        </div>
        <ScoreRing score={offer.offer_score} />
      </div>

      <p className="text-[#9ca3af] text-xs line-clamp-2 mb-4 min-h-[2.5rem]">
        {offer.headline || offer.promise || "—"}
      </p>

      <div className="flex items-center gap-3 text-xs text-[#6b7280] mb-4">
        <span className="bg-[#1e1e2e] px-2 py-1 rounded">{offer.niche}</span>
        <span>{offer.ad_count} criativos</span>
        <span>{offer.ads_running_days}d rodando</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/offers/${offer.id}`}
          className="flex-1 text-center py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-xs font-medium transition-colors"
        >
          Ver detalhes
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(offer.id)}
            className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
