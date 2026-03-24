"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, OfferCreate } from "@/lib/api";

const NICHES = [
  "Saúde & Emagrecimento",
  "Finanças & Investimentos",
  "Educação & Idiomas",
  "Relacionamentos & Autoajuda",
  "Beleza & Estética",
  "Marketing & Negócios Digitais",
  "Fitness & Esportes",
  "Espiritualidade",
  "Pet",
  "Outro",
];

const FUNNEL_TYPES = [
  "Front-end apenas",
  "Front-end + Order Bump",
  "Front-end + Upsell",
  "Front-end + Order Bump + Upsell",
  "Funil completo com bump + 2 upsells",
  "Funil completo com bump + Upsell + High-ticket backend",
];

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#9ca3af] mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#4b5563] mt-1">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-indigo-500 transition-colors";

const textareaCls = inputCls + " resize-none";

export default function NewOfferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<OfferCreate>({
    name: "",
    advertiser: "",
    product: "",
    niche: "",
    funnel_type: "",
    status: "Novo",
    ad_count: 0,
    ads_running_days: 0,
    front_end_price: 0,
    order_bump_price: 0,
    upsell_price: 0,
    headline: "",
    avatar: "",
    pain_point: "",
    mechanism: "",
    promise: "",
    ad_copy: "",
    destination_url: "",
    checkout_url: "",
    meta_library_url: "",
  });

  const set = (key: keyof OfferCreate, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const created = await api.offers.create(form);
      router.push(`/offers/${created.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar oferta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Nova Oferta</h1>
        <p className="text-[#6b7280] text-sm mt-1">Preencha os dados da oferta para calcular o score automaticamente</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Informações Básicas</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome da Oferta" required>
              <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Código da Magreza" required />
            </Field>
            <Field label="Anunciante" required>
              <input className={inputCls} value={form.advertiser} onChange={(e) => set("advertiser", e.target.value)} placeholder="Ex: NutriPro Brasil" required />
            </Field>
          </div>

          <Field label="Produto" required>
            <input className={inputCls} value={form.product} onChange={(e) => set("product", e.target.value)} placeholder="Ex: Curso digital de emagrecimento" required />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nicho" required>
              <select className={inputCls} value={form.niche} onChange={(e) => set("niche", e.target.value)} required>
                <option value="">Selecione...</option>
                {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="Novo">Novo</option>
                <option value="Hot">Hot 🔥</option>
                <option value="Observar">Observar</option>
              </select>
            </Field>
          </div>

          <Field label="Tipo de Funil" required>
            <select className={inputCls} value={form.funnel_type} onChange={(e) => set("funnel_type", e.target.value)} required>
              <option value="">Selecione...</option>
              {FUNNEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
        </section>

        <section className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Dados de Tráfego</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Qtd. de Criativos">
              <input type="number" className={inputCls} value={form.ad_count} onChange={(e) => set("ad_count", parseInt(e.target.value) || 0)} min={0} />
            </Field>
            <Field label="Dias Rodando">
              <input type="number" className={inputCls} value={form.ads_running_days} onChange={(e) => set("ads_running_days", parseInt(e.target.value) || 0)} min={0} />
            </Field>
          </div>
        </section>

        <section className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Arquitetura Financeira</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Preço Front-end (R$)">
              <input type="number" className={inputCls} value={form.front_end_price} onChange={(e) => set("front_end_price", parseFloat(e.target.value) || 0)} step={0.01} min={0} />
            </Field>
            <Field label="Order Bump (R$)" hint="0 se não tiver">
              <input type="number" className={inputCls} value={form.order_bump_price} onChange={(e) => set("order_bump_price", parseFloat(e.target.value) || 0)} step={0.01} min={0} />
            </Field>
            <Field label="Upsell (R$)" hint="0 se não tiver">
              <input type="number" className={inputCls} value={form.upsell_price} onChange={(e) => set("upsell_price", parseFloat(e.target.value) || 0)} step={0.01} min={0} />
            </Field>
          </div>
        </section>

        <section className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Copy & Posicionamento</h2>
          <Field label="Headline">
            <input className={inputCls} value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Título principal do VSL ou landing page" />
          </Field>
          <Field label="Promessa">
            <input className={inputCls} value={form.promise} onChange={(e) => set("promise", e.target.value)} placeholder="A grande promessa da oferta" />
          </Field>
          <Field label="Avatar / Público-alvo">
            <input className={inputCls} value={form.avatar} onChange={(e) => set("avatar", e.target.value)} placeholder="Quem é o cliente ideal?" />
          </Field>
          <Field label="Dor Principal">
            <textarea className={textareaCls} rows={2} value={form.pain_point} onChange={(e) => set("pain_point", e.target.value)} placeholder="Qual é a dor ou frustração central do avatar?" />
          </Field>
          <Field label="Mecanismo Único">
            <textarea className={textareaCls} rows={2} value={form.mechanism} onChange={(e) => set("mechanism", e.target.value)} placeholder="O que diferencia esta solução de todas as outras?" />
          </Field>
          <Field label="Copy do Anúncio">
            <textarea className={textareaCls} rows={4} value={form.ad_copy} onChange={(e) => set("ad_copy", e.target.value)} placeholder="Cole o texto do anúncio principal aqui..." />
          </Field>
        </section>

        <section className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">URLs</h2>
          <Field label="URL de Destino (VSL/Landing)">
            <input className={inputCls} value={form.destination_url} onChange={(e) => set("destination_url", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="URL do Checkout">
            <input className={inputCls} value={form.checkout_url} onChange={(e) => set("checkout_url", e.target.value)} placeholder="https://pay.hotmart.com/..." />
          </Field>
          <Field label="URL Biblioteca Meta Ads" hint="Link para ver os criativos desta oferta na biblioteca do Meta">
            <input className={inputCls} value={form.meta_library_url} onChange={(e) => set("meta_library_url", e.target.value)} placeholder="https://www.facebook.com/ads/library/..." />
          </Field>
        </section>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-[#9ca3af] rounded-lg text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? "Salvando e calculando score..." : "Salvar Oferta"}
          </button>
        </div>
      </form>
    </div>
  );
}
