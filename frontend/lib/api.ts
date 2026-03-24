const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Erro na requisição");
  }

  return res.json();
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface ScoreBreakdownItem {
  label: string;
  points: number;
  earned: boolean;
}

export interface ScoreBreakdownDetail {
  score: number;
  max: number;
  items: ScoreBreakdownItem[];
}

export interface ScoreBreakdown {
  financial_score: number;
  longevity_score: number;
  promise_score: number;
  market_score: number;
  risk_score: number;
  breakdown_json: {
    financial: ScoreBreakdownDetail;
    longevity: ScoreBreakdownDetail;
    promise: ScoreBreakdownDetail;
    market: ScoreBreakdownDetail;
    risk: ScoreBreakdownDetail;
  } | null;
}

export interface Insight {
  main_angle: string;
  broken_belief: string;
  copy_framework: string;
  big_promise: string;
  unique_mechanism: string;
  why_it_works_hypothesis: string;
  similarity_tags: string[];
  analyzed_at: string | null;
}

export interface Offer {
  id: number;
  name: string;
  advertiser: string;
  product: string;
  niche: string;
  funnel_type: string;
  status: "Hot" | "Novo" | "Observar";
  ad_count: number;
  ads_running_days: number;
  front_end_price: number;
  order_bump_price: number;
  upsell_price: number;
  headline: string | null;
  avatar: string | null;
  pain_point: string | null;
  mechanism: string | null;
  promise: string | null;
  ad_copy: string | null;
  destination_url: string | null;
  checkout_url: string | null;
  meta_library_url: string | null;
  offer_score: number;
  created_at: string | null;
  updated_at: string | null;
  has_insight: boolean;
  score_breakdown?: ScoreBreakdown;
  insight?: Insight;
}

export interface OfferCreate {
  name: string;
  advertiser: string;
  product: string;
  niche: string;
  funnel_type: string;
  status?: string;
  ad_count?: number;
  ads_running_days?: number;
  front_end_price?: number;
  order_bump_price?: number;
  upsell_price?: number;
  headline?: string;
  avatar?: string;
  pain_point?: string;
  mechanism?: string;
  promise?: string;
  ad_copy?: string;
  destination_url?: string;
  checkout_url?: string;
  meta_library_url?: string;
}

export interface DashboardStats {
  total_offers: number;
  analyzed_offers: number;
  hot_offers: number;
  total_patterns: number;
  avg_score: number;
  top_offers: { id: number; name: string; advertiser: string; niche: string; offer_score: number; status: string }[];
  recent_offers: { id: number; name: string; advertiser: string; niche: string; offer_score: number; status: string; created_at: string }[];
  niche_distribution: { niche: string; count: number }[];
  status_distribution: { status: string; count: number }[];
  score_ranges: Record<string, number>;
  alerts: string[];
}

export interface Pattern {
  id: number;
  pattern_type: string;
  pattern_name: string;
  description: string;
  frequency: number;
  avg_score: number;
  offer_ids: number[];
  niche: string;
  last_seen_at: string;
}

export interface AnalysisResult {
  offer_id: number;
  main_angle: string;
  broken_belief: string;
  copy_framework: string;
  big_promise: string;
  unique_mechanism: string;
  why_it_works_hypothesis: string;
  similarity_tags: string[];
  hook_type: string;
  cta_type: string;
  target_awareness: string;
  strengths: string[];
  weaknesses: string[];
  analyzed_at: string;
}

// ── API Calls ────────────────────────────────────────────────────────────────

export const api = {
  offers: {
    list: (params?: Record<string, string | number | boolean>) => {
      const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
      return request<Offer[]>(`/offers${qs}`);
    },
    get: (id: number) => request<Offer>(`/offers/${id}`),
    create: (data: OfferCreate) =>
      request<Offer>("/offers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<OfferCreate>) =>
      request<Offer>(`/offers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) =>
      request<void>(`/offers/${id}`, { method: "DELETE" }),
    analyze: (id: number) =>
      request<AnalysisResult>(`/offers/${id}/analyze`, { method: "POST" }),
    score: (id: number) => request(`/offers/${id}/score`),
  },
  dashboard: {
    stats: () => request<DashboardStats>("/dashboard/stats"),
  },
  patterns: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<Pattern[]>(`/patterns${qs}`);
    },
  },
  seed: () => request<{ message: string }>("/seed", { method: "POST" }),
};
