"use client";

import { Offer } from "@/lib/api";

interface Props {
  offer: Offer;
  allOffers: Offer[];
}

export default function InsightReport({ offer, allOffers }: Props) {
  if (!offer.insight) return null;

  const tags = offer.insight.similarity_tags || [];
  const similar = allOffers.filter(
    (o) =>
      o.id !== offer.id &&
      o.insight &&
      o.insight.similarity_tags?.some((t) => tags.includes(t))
  ).slice(0, 3);

  const avgScore =
    allOffers.length > 0
      ? allOffers.reduce((s, o) => s + o.offer_score, 0) / allOffers.length
      : 0;

  const percentile = allOffers.filter((o) => o.offer_score < offer.offer_score).length;
  const percentilePct = allOffers.length > 0 ? Math.round((percentile / allOffers.length) * 100) : 0;

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Relatório Comparativo</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1e1e2e] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-white">{Math.round(offer.offer_score)}</p>
          <p className="text-xs text-[#6b7280] mt-1">Score desta oferta</p>
        </div>
        <div className="bg-[#1e1e2e] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{Math.round(avgScore)}</p>
          <p className="text-xs text-[#6b7280] mt-1">Média da biblioteca</p>
        </div>
        <div className="bg-[#1e1e2e] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-indigo-400">Top {100 - percentilePct}%</p>
          <p className="text-xs text-[#6b7280] mt-1">Posição no ranking</p>
        </div>
      </div>

      {similar.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">
            Ofertas similares ({similar.length})
          </p>
          <div className="space-y-2">
            {similar.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-[#1e1e2e] rounded-lg"
              >
                <div>
                  <p className="text-sm text-white">{s.name}</p>
                  <p className="text-xs text-[#6b7280]">{s.advertiser}</p>
                </div>
                <span className="text-sm font-bold text-indigo-400">{Math.round(s.offer_score)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
