"use client";

import { ScoreBreakdown as ScoreBreakdownType } from "@/lib/api";

interface Props {
  breakdown: ScoreBreakdownType;
  totalScore: number;
}

const blocks = [
  { key: "financial", label: "Arq. Financeira", max: 35, color: "#6366f1" },
  { key: "longevity", label: "Longevidade", max: 25, color: "#10b981" },
  { key: "promise", label: "Eng. Promessa", max: 20, color: "#f59e0b" },
  { key: "market", label: "Mercado", max: 10, color: "#3b82f6" },
  { key: "risk", label: "Risco", max: 10, color: "#ec4899" },
] as const;

const scoreKeys = {
  financial: "financial_score",
  longevity: "longevity_score",
  promise: "promise_score",
  market: "market_score",
  risk: "risk_score",
} as const;

export default function ScoreBreakdown({ breakdown, totalScore }: Props) {
  const scoreColor =
    totalScore >= 70 ? "text-emerald-400" : totalScore >= 45 ? "text-amber-400" : "text-red-400";

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold">Offer Score Breakdown</h3>
        <span className={`text-3xl font-bold ${scoreColor}`}>{Math.round(totalScore)}</span>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => {
          const scoreKey = scoreKeys[block.key];
          const score = breakdown[scoreKey] ?? 0;
          const pct = (score / block.max) * 100;
          const detail = breakdown.breakdown_json?.[block.key];

          return (
            <div key={block.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#9ca3af]">{block.label}</span>
                <span className="text-sm font-medium text-white">
                  {score}/{block.max}
                </span>
              </div>
              <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: block.color }}
                />
              </div>

              {detail?.items && (
                <div className="mt-2 space-y-1">
                  {detail.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={item.earned ? "text-emerald-400" : "text-[#374151]"}>
                        {item.earned ? "✓" : "✗"}
                      </span>
                      <span className={`text-xs ${item.earned ? "text-[#9ca3af]" : "text-[#4b5563]"}`}>
                        {item.label}
                        <span className="ml-1 text-[#6b7280]">+{item.points}pts</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
