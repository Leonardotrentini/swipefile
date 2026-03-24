"use client";

import { useEffect, useState, useMemo } from "react";
import { api, Offer } from "@/lib/api";
import OfferCard from "@/components/OfferCard";
import FilterBar from "@/components/FilterBar";

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
      if (filters.minScore && o.offer_score < parseFloat(filters.minScore)) return false;
      if (filters.analyzed === "true" && !o.has_insight) return false;
      if (filters.analyzed === "false" && o.has_insight) return false;
      return true;
    });
  }, [offers, filters]);

  async function handleDelete(id: number) {
    if (!confirm("Remover esta oferta?")) return;
    await api.offers.delete(id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Biblioteca</h1>
          <p className="text-[#6b7280] text-sm mt-1">
            {filtered.length} de {offers.length} ofertas
          </p>
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} niches={niches} />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#4b5563] text-lg mb-2">Nenhuma oferta encontrada</p>
          <p className="text-[#374151] text-sm">Tente ajustar os filtros ou adicione uma nova oferta</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
