"use client";

import { useEffect, useState } from "react";
import { api, Pattern } from "@/lib/api";

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  framework: { label: "Framework", color: "text-indigo-400", bg: "bg-indigo-500/20" },
  hook: { label: "Hook", color: "text-emerald-400", bg: "bg-emerald-500/20" },
  mechanism: { label: "Mecanismo", color: "text-amber-400", bg: "bg-amber-500/20" },
  tag: { label: "Tag", color: "text-purple-400", bg: "bg-purple-500/20" },
  cta: { label: "CTA", color: "text-pink-400", bg: "bg-pink-500/20" },
};

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.patterns
      .list()
      .then(setPatterns)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? patterns.filter((p) => p.pattern_type === filter)
    : patterns;

  const types = [...new Set(patterns.map((p) => p.pattern_type))];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Padrões Identificados</h1>
        <p className="text-[#6b7280] text-sm mt-1">
          Padrões recorrentes aprendidos a partir das análises do Claude
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : patterns.length === 0 ? (
        <div className="text-center py-20 bg-[#12121a] border border-[#1e1e2e] border-dashed rounded-xl">
          <p className="text-[#4b5563] mb-2">Nenhum padrão encontrado ainda</p>
          <p className="text-xs text-[#374151]">
            Analise ofertas com o Claude para começar a identificar padrões automaticamente
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === "" ? "bg-white text-black" : "bg-[#12121a] text-[#6b7280] hover:text-white border border-[#1e1e2e]"
              }`}
            >
              Todos ({patterns.length})
            </button>
            {types.map((t) => {
              const cfg = typeConfig[t] || { label: t, color: "text-white", bg: "bg-[#1e1e2e]" };
              const count = patterns.filter((p) => p.pattern_type === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === t
                      ? `${cfg.bg} ${cfg.color}`
                      : "bg-[#12121a] text-[#6b7280] hover:text-white border border-[#1e1e2e]"
                  }`}
                >
                  {cfg.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filtered.map((p) => {
              const cfg = typeConfig[p.pattern_type] || {
                label: p.pattern_type,
                color: "text-white",
                bg: "bg-[#1e1e2e]",
              };

              return (
                <div
                  key={p.id}
                  className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5 hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        {p.niche && (
                          <span className="text-xs text-[#6b7280] bg-[#1e1e2e] px-2 py-0.5 rounded-full">
                            {p.niche}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-medium">{p.pattern_name}</h3>
                      {p.description && p.description !== p.pattern_name && (
                        <p className="text-[#6b7280] text-sm mt-1 line-clamp-2">{p.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-center shrink-0">
                      <div>
                        <p className="text-lg font-bold text-white">{p.frequency}</p>
                        <p className="text-xs text-[#6b7280]">Ofertas</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-indigo-400">{p.avg_score}</p>
                        <p className="text-xs text-[#6b7280]">Score médio</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
