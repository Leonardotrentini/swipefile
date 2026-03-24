"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, Offer, AnalysisResult } from "@/lib/api";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import DissectionPanel from "@/components/DissectionPanel";
import InsightReport from "@/components/InsightReport";

const statusConfig = {
  Hot: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  Novo: { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  Observar: { bg: "bg-amber-500/20", text: "text-amber-400" },
};

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    Promise.all([
      api.offers.get(parseInt(id)),
      api.offers.list(),
    ])
      .then(([offer, all]) => {
        setOffer(offer);
        setAllOffers(all);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAnalyze() {
    if (!offer) return;
    setAnalyzing(true);
    setAnalysisError("");
    try {
      const result = await api.offers.analyze(offer.id);
      setAnalysisResult(result);
      const updated = await api.offers.get(offer.id);
      setOffer(updated);
    } catch (e: unknown) {
      setAnalysisError(e instanceof Error ? e.message : "Erro ao analisar com Claude");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleDelete() {
    if (!offer || !confirm(`Remover "${offer.name}"?`)) return;
    await api.offers.delete(offer.id);
    router.push("/library");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!offer) return <p className="text-[#6b7280]">Oferta não encontrada.</p>;

  const status = statusConfig[offer.status] || statusConfig.Novo;
  const displayInsight = analysisResult || offer.insight;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="text-[#6b7280] hover:text-white text-sm transition-colors"
            >
              ← Voltar
            </button>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {offer.status}
            </span>
            {offer.has_insight && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                Analisada
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">{offer.name}</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            {offer.advertiser} · {offer.niche} · {offer.funnel_type}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                Analisando...
              </>
            ) : (
              "⚡ Analisar com Claude"
            )}
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors"
          >
            Remover
          </button>
        </div>
      </div>

      {analysisError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {analysisError}
        </div>
      )}

      {analyzing && (
        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 text-sm flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          Claude está dissecando a oferta... Isso pode levar 15-30 segundos.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Dados da Oferta</h2>
            <div className="space-y-4">
              {offer.headline && (
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Headline</p>
                  <p className="text-[#e8e8f0] text-sm">{offer.headline}</p>
                </div>
              )}
              {offer.promise && (
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Promessa</p>
                  <p className="text-[#e8e8f0] text-sm">{offer.promise}</p>
                </div>
              )}
              {offer.avatar && (
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Avatar</p>
                  <p className="text-[#e8e8f0] text-sm">{offer.avatar}</p>
                </div>
              )}
              {offer.pain_point && (
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Dor Principal</p>
                  <p className="text-[#e8e8f0] text-sm">{offer.pain_point}</p>
                </div>
              )}
              {offer.mechanism && (
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Mecanismo</p>
                  <p className="text-[#e8e8f0] text-sm">{offer.mechanism}</p>
                </div>
              )}
              {offer.ad_copy && (
                <div>
                  <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Copy do Anúncio</p>
                  <p className="text-[#9ca3af] text-sm leading-relaxed bg-[#0a0a0f] p-3 rounded-lg border border-[#1e1e2e]">
                    {offer.ad_copy}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-[#1e1e2e]">
              <div className="text-center">
                <p className="text-lg font-bold text-white">R$ {offer.front_end_price?.toFixed(0)}</p>
                <p className="text-xs text-[#6b7280]">Front-end</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">
                  {offer.order_bump_price ? `R$ ${offer.order_bump_price.toFixed(0)}` : "—"}
                </p>
                <p className="text-xs text-[#6b7280]">Order Bump</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">
                  {offer.upsell_price ? `R$ ${offer.upsell_price.toFixed(0)}` : "—"}
                </p>
                <p className="text-xs text-[#6b7280]">Upsell</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center bg-[#0a0a0f] rounded-lg p-3">
                <p className="text-lg font-bold text-white">{offer.ad_count}</p>
                <p className="text-xs text-[#6b7280]">Criativos</p>
              </div>
              <div className="text-center bg-[#0a0a0f] rounded-lg p-3">
                <p className="text-lg font-bold text-white">{offer.ads_running_days}d</p>
                <p className="text-xs text-[#6b7280]">Rodando</p>
              </div>
            </div>

            {(offer.destination_url || offer.meta_library_url) && (
              <div className="flex gap-3 mt-4">
                {offer.destination_url && (
                  <a
                    href={offer.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Abrir oferta ↗
                  </a>
                )}
                {offer.meta_library_url && (
                  <a
                    href={offer.meta_library_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Biblioteca Meta ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {(offer.thank_you_url || (offer.domains_assigned && offer.domains_assigned.length > 0)) && (
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
              <h2 className="text-white font-semibold mb-4">🎯 Funil & Domínios</h2>
              <div className="space-y-4">
                {offer.thank_you_url && (
                  <div>
                    <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-1">Página de Obrigado</p>
                    <a
                      href={offer.thank_you_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-sm break-all underline"
                    >
                      {offer.thank_you_url}
                    </a>
                  </div>
                )}
                {offer.domains_assigned && offer.domains_assigned.length > 0 && (
                  <div>
                    <p className="text-xs text-[#6b7280] uppercase tracking-wider mb-2">Domínios Atribuídos</p>
                    <div className="flex flex-wrap gap-2">
                      {offer.domains_assigned.map((domain: string) => (
                        <span key={domain} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg border border-emerald-500/30">
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {displayInsight && (
            <DissectionPanel data={displayInsight} />
          )}

          {!displayInsight && !analyzing && (
            <div className="bg-[#12121a] border border-[#1e1e2e] border-dashed rounded-xl p-8 text-center">
              <p className="text-[#4b5563] mb-3">Esta oferta ainda não foi analisada pelo Claude</p>
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-sm font-medium transition-colors"
              >
                ⚡ Analisar agora
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {offer.score_breakdown && (
            <ScoreBreakdown breakdown={offer.score_breakdown} totalScore={offer.offer_score} />
          )}

          {offer.insight && (
            <InsightReport offer={offer} allOffers={allOffers} />
          )}
        </div>
      </div>
    </div>
  );
}
