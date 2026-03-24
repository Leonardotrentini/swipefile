"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, DashboardStats, Offer } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import StatsCard from "@/components/StatsCard";
import ScoreRing from "@/components/ScoreRing";
import GlassCard from "@/components/GlassCard";
import { TrendingUp, Award, Zap, Target } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topOffers, setTopOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    Promise.all([api.dashboard.stats(), api.offers.list()])
      .then(([s, offers]) => {
        setStats(s);
        setTopOffers(offers.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSeed() {
    setSeeding(true);
    try {
      await api.seed();
      const s = await api.dashboard.stats();
      const offers = await api.offers.list();
      setStats(s);
      setTopOffers(offers.slice(0, 3));
    } finally {
      setSeeding(false);
    }
  }

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center space-y-4">
          <motion.div
            className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#9ca3af]">Carregando seu swipe file...</p>
        </div>
      </motion.div>
    );
  }

  if (!stats) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard
          label="Total de Ofertas"
          value={stats.total_offers}
          icon="📚"
          color="indigo"
          delay={0}
        />
        <StatsCard
          label="Ofertas Hot"
          value={stats.hot_offers}
          icon="🔥"
          color="pink"
          delay={0.1}
        />
        <StatsCard
          label="Analisadas"
          value={stats.analyzed_offers}
          icon="✨"
          color="emerald"
          delay={0.2}
        />
        <StatsCard
          label="Score Médio"
          value={stats.avg_score.toFixed(1)}
          icon="🎯"
          color="amber"
          delay={0.3}
        />
      </div>

      {/* Average Score Ring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl p-8 text-center"
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <div>
            <p className="text-[#6b7280] text-sm uppercase tracking-widest font-medium mb-4">
              Performance do Portfólio
            </p>
            <ScoreRing score={stats.avg_score} size="lg" />
          </div>
          <div className="max-w-2xl">
            <p className="text-lg text-white mb-2">
              {stats.avg_score >= 80
                ? "🚀 Portfólio extraordinário! Suas ofertas têm altíssimo potencial de conversão."
                : stats.avg_score >= 60
                ? "⚡ Bom portfolio. Há oportunidades de otimização em algumas ofertas."
                : "📈 Há espaço para melhorias. Analise as ofertas com score baixo."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Insights Row */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Padrões Identificados</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-400 mb-2">
            {stats.total_patterns}
          </p>
          <p className="text-sm text-[#9ca3af]">
            Padrões recorrentes de sucesso encontrados
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold text-white">Top Performer</h3>
          </div>
          {topOffers[0] && (
            <>
              <p className="text-sm font-semibold text-white mb-1 truncate">
                {topOffers[0].name}
              </p>
              <p className="text-2xl font-bold text-pink-400">
                {topOffers[0].offer_score}/100
              </p>
            </>
          )}
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white">Análises Claude</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-400 mb-2">
            {stats.analyzed_offers}
          </p>
          <p className="text-sm text-[#9ca3af]">
            Ofertas dissecadas e analisadas
          </p>
        </motion.div>
      </motion.div>

      {/* Top Offers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="w-8 h-8 text-indigo-400" />
              Top Ofertas
            </h2>
            <p className="text-[#6b7280] mt-2">
              Suas ofertas com melhor score e potencial
            </p>
          </div>
          <Link
            href="/library"
            className="px-6 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl font-semibold transition-colors border border-indigo-500/30"
          >
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topOffers.map((offer) => (
            <GlassCard key={offer.id} offer={offer} />
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl p-12 text-center mb-12"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Pronto para expandir seu swipe file?
        </h3>
        <p className="text-[#9ca3af] mb-8 max-w-xl mx-auto">
          Adicione novas ofertas ou explore padrões de sucesso já identificados.
        </p>
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stats.total_offers === 0 ? handleSeed : undefined}
            disabled={seeding || stats.total_offers > 0}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            {stats.total_offers === 0
              ? seeding
                ? "Carregando dados..."
                : "🌱 Carregar Dados de Exemplo"
              : "✓ Dados Carregados"}
          </motion.button>
          <Link href="/offers/new">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-indigo-500/30 text-indigo-400 rounded-xl font-semibold hover:bg-indigo-500/10 transition-all"
            >
              + Nova Oferta
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
