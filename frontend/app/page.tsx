"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, DashboardStats } from "@/lib/api";

function StatCard({
  label,
  value,
  sub,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
      <p className="text-[#6b7280] text-xs font-medium uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[#4b5563] text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    api.dashboard
      .stats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await api.seed();
      setSeedMsg(res.message);
      const s = await api.dashboard.stats();
      setStats(s);
    } catch (e: unknown) {
      setSeedMsg(e instanceof Error ? e.message : "Erro ao inserir seed");
    } finally {
      setSeeding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const scoreColor =
    stats.avg_score >= 70
      ? "text-emerald-400"
      : stats.avg_score >= 45
      ? "text-amber-400"
      : "text-red-400";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-[#6b7280] text-sm mt-1">Visão geral do seu swipe file</p>
        </div>
        <div className="flex items-center gap-3">
          {stats.total_offers === 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {seeding ? "Inserindo..." : "🌱 Carregar dados de exemplo"}
            </button>
          )}
          <Link
            href="/offers/new"
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Nova Oferta
          </Link>
        </div>
      </div>

      {seedMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
          {seedMsg}
        </div>
      )}

      {stats.alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {stats.alerts.map((alert, i) => (
            <div key={i} className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm flex items-center gap-2">
              <span>⚠</span> {alert}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total de Ofertas" value={stats.total_offers} />
        <StatCard
          label="Analisadas com Claude"
          value={stats.analyzed_offers}
          sub={`de ${stats.total_offers} total`}
          color="text-purple-400"
        />
        <StatCard label="Ofertas Hot 🔥" value={stats.hot_offers} color="text-emerald-400" />
        <StatCard label="Score Médio" value={stats.avg_score} color={scoreColor} sub="/100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Top Ofertas por Score</h2>
          {stats.top_offers.length === 0 ? (
            <p className="text-[#6b7280] text-sm">Nenhuma oferta ainda.</p>
          ) : (
            <div className="space-y-3">
              {stats.top_offers.map((o, i) => (
                <Link key={o.id} href={`/offers/${o.id}`} className="flex items-center gap-3 hover:bg-[#1e1e2e] p-2 rounded-lg transition-colors">
                  <span className="text-[#4b5563] text-sm font-mono w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{o.name}</p>
                    <p className="text-xs text-[#6b7280]">{o.niche}</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">{Math.round(o.offer_score)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Distribuição por Score</h2>
          <div className="space-y-3">
            {Object.entries(stats.score_ranges).map(([range, count]) => {
              const total = stats.total_offers || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={range}>
                  <div className="flex justify-between text-xs text-[#6b7280] mb-1">
                    <span>{range} pts</span>
                    <span>{count} ofertas ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Distribuição por Nicho</h2>
          <div className="space-y-2">
            {stats.niche_distribution.map((n) => (
              <div key={n.niche} className="flex items-center justify-between p-2 bg-[#1e1e2e] rounded-lg">
                <span className="text-sm text-[#9ca3af]">{n.niche}</span>
                <span className="text-sm font-medium text-white">{n.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Adicionadas Recentemente</h2>
          {stats.recent_offers.length === 0 ? (
            <p className="text-[#6b7280] text-sm">Nenhuma oferta ainda.</p>
          ) : (
            <div className="space-y-2">
              {stats.recent_offers.map((o) => (
                <Link key={o.id} href={`/offers/${o.id}`} className="flex items-center justify-between p-2 hover:bg-[#1e1e2e] rounded-lg transition-colors">
                  <div>
                    <p className="text-sm text-white">{o.name}</p>
                    <p className="text-xs text-[#6b7280]">{o.advertiser}</p>
                  </div>
                  <span className="text-xs text-[#6b7280]">
                    {o.created_at ? new Date(o.created_at).toLocaleDateString("pt-BR") : ""}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
