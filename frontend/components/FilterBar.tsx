"use client";

interface Filters {
  search: string;
  niche: string;
  status: string;
  minScore: string;
  analyzed: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  niches: string[];
}

const statusOptions = ["", "Hot", "Novo", "Observar"];

export default function FilterBar({ filters, onChange, niches }: Props) {
  const update = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <input
        type="text"
        placeholder="Buscar oferta, anunciante..."
        value={filters.search}
        onChange={(e) => update("search", e.target.value)}
        className="flex-1 min-w-48 bg-[#12121a] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-indigo-500 transition-colors"
      />

      <select
        value={filters.niche}
        onChange={(e) => update("niche", e.target.value)}
        className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
      >
        <option value="">Todos os nichos</option>
        {niches.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => update("status", e.target.value)}
        className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s || "Todos os status"}</option>
        ))}
      </select>

      <select
        value={filters.minScore}
        onChange={(e) => update("minScore", e.target.value)}
        className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
      >
        <option value="">Score mínimo</option>
        <option value="25">25+</option>
        <option value="50">50+</option>
        <option value="70">70+</option>
        <option value="85">85+</option>
      </select>

      <select
        value={filters.analyzed}
        onChange={(e) => update("analyzed", e.target.value)}
        className="bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
      >
        <option value="">Todas</option>
        <option value="true">Analisadas</option>
        <option value="false">Sem análise</option>
      </select>

      {(filters.search || filters.niche || filters.status || filters.minScore || filters.analyzed) && (
        <button
          onClick={() => onChange({ search: "", niche: "", status: "", minScore: "", analyzed: "" })}
          className="text-xs text-[#6b7280] hover:text-white transition-colors px-3 py-2.5"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
