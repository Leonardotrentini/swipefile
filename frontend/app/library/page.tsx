"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { api, Offer } from "@/lib/api";
import GlassCard from "@/components/GlassCard";
import FilterBar from "@/components/FilterBar";
import { Search, Filter, Grid3x3 } from "lucide-react";

interface Filters {
  search: string;
  niche: string;
  status: string;
  minScore: string;
  analyzed: string;
}

export default function LibraryPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    niche: "",
    status: "",
    minScore: "",
    analyzed: "",
  });

  useEffect(() => {
    api.offers
      .list()
      .then(setOffers)
      .finally(() => setLoading(false));
  }, []);

  const niches = useMemo(
    () => [...new Set(offers.map((o) => o.niche))].sort(),
    [offers]
  );

  const filtered = useMemo(() => {
    return offers.filter((o) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          o.name.toLowerCase().includes(q) ||
          o.advertiser.toLowerCase().includes(q) ||
          (o.headline || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filters.niche && o.niche !== filters.niche) return false;
      if (filters.status && o.status !== filters.status) return false;
      if (filters.minScore && o.offer_score < parseFloat(filters.minScore))
        return false;
      if (filters.analyzed === "true" && !o.has_insight) return false;
      if (filters.analyzed === "false" && o.has_insight) return false;
      return true;
    });
  }, [offers, filters]);

  async function handleDelete(id: number) {
    if (!confirm("Remover esta oferta?")) return;
    await api.offers.delete(id);
    setOffers(offers.filter((o) => o.id !== id));
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
          <p className="text-[#9ca3af]">Carregando biblioteca...</p>
        </div>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Grid3x3 className="w-8 h-8 text-indigo-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white">Sua Biblioteca</h1>
        </div>
        <p className="text-[#9ca3af] text-lg">
          {filtered.length} oferta{filtered.length !== 1 ? "s" : ""} encontrada
          {filtered.length !== 1 ? "s" : ""} • Score médio:{" "}
          <span className="font-semibold text-indigo-400">
            {filtered.length > 0
              ? (
                  filtered.reduce((sum, o) => sum + o.offer_score, 0) /
                  filtered.length
                ).toFixed(1)
              : 0}
            /100
          </span>
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-8">
        <FilterBar
          filters={filters}
          niches={niches}
          onChange={setFilters}
        />
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-dashed border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-12 text-center"
        >
          <p className="text-[#6b7280] text-lg mb-4">
            Nenhuma oferta encontrada com esses filtros.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setFilters({
                search: "",
                niche: "",
                status: "",
                minScore: "",
                analyzed: "",
              })
            }
            className="px-6 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl font-semibold transition-colors border border-indigo-500/30"
          >
            Limpar filtros
          </motion.button>
        </motion.div>
      )}

      {/* Grid of Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filtered.map((offer) => (
          <motion.div key={offer.id} variants={itemVariants}>
            <GlassCard offer={offer} />
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Footer */}
      {filtered.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-16 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-[#6b7280] text-sm uppercase tracking-widest font-medium mb-2">
                Total
              </p>
              <p className="text-3xl font-bold text-white">{filtered.length}</p>
            </div>
            <div>
              <p className="text-[#6b7280] text-sm uppercase tracking-widest font-medium mb-2">
                Hot
              </p>
              <p className="text-3xl font-bold text-emerald-400">
                {filtered.filter((o) => o.status === "Hot").length}
              </p>
            </div>
            <div>
              <p className="text-[#6b7280] text-sm uppercase tracking-widest font-medium mb-2">
                Analisadas
              </p>
              <p className="text-3xl font-bold text-purple-400">
                {filtered.filter((o) => o.has_insight).length}
              </p>
            </div>
            <div>
              <p className="text-[#6b7280] text-sm uppercase tracking-widest font-medium mb-2">
                AOV Médio
              </p>
              <p className="text-3xl font-bold text-pink-400">
                R${(
                  filtered.reduce(
                    (sum, o) =>
                      sum +
                      o.front_end_price +
                      o.order_bump_price +
                      o.upsell_price,
                    0
                  ) / filtered.length
                ).toFixed(0)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
