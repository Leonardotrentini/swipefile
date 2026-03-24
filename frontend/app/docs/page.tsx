"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, BookOpen, Zap, Code, Sparkles } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      id: "intro",
      title: "Introdução",
      icon: BookOpen,
      content: `LT ARTS é uma plataforma de mineração, análise e biblioteca de ofertas low-ticket para Direct Response Marketing. Com integração de Claude AI, a ferramenta disseça automaticamente cada oferta e identifica padrões de sucesso.`,
    },
    {
      id: "features",
      title: "Features Principais",
      icon: Sparkles,
      items: [
        "📚 Biblioteca inteligente de ofertas",
        "🤖 Análise automática com Claude AI",
        "📊 Offer Score automático (0-100)",
        "🔍 Identificação de padrões recorrentes",
        "📈 Dashboard com estatísticas",
        "🎯 Filtros avançados",
        "💾 Banco de dados PostgreSQL",
      ],
    },
    {
      id: "offer-score",
      title: "Sistema de Score",
      icon: Zap,
      content: `Cada oferta recebe um score de 0-100 baseado em 5 pilares:

✓ Arquitetura Financeira (35pts): order bump, upsell, AOV
✓ Longevidade de Tráfego (25pts): dias rodando, volume de criativos
✓ Engenharia da Promessa (20pts): quick win, CTA, mecanismo
✓ Sinais de Mercado (10pts): validação, presença orgânica
✓ Gestão de Risco (10pts): ponte high-ticket, chargeback`,
    },
    {
      id: "dissecacao",
      title: "Dissecação com Claude AI",
      icon: Code,
      content: `Quando você analisa uma oferta, a IA retorna:

• Ângulo principal da oferta
• Crença quebrada no copy
• Framework de copy (PAS, AIDA, etc)
• Big Promise (promessa principal)
• Mecanismo único
• Hipótese de por que funciona
• Tags de similaridade com outras ofertas`,
    },
  ];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 transition-colors"
        >
          ← Voltar
        </Link>

        <h1 className="text-5xl font-bold text-white mb-4">Documentação</h1>
        <p className="text-xl text-[#9ca3af]">
          Tudo que você precisa saber sobre LT ARTS
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl p-8 mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-4">🚀 Quick Start</h2>
        <div className="space-y-4 text-[#e8e8f0]">
          <div className="flex gap-4">
            <div className="text-indigo-400 font-bold min-w-fit">1.</div>
            <p>Acesse o <Link href="/library" className="text-indigo-400 hover:text-indigo-300">Dashboard</Link> para ver todas as ofertas</p>
          </div>
          <div className="flex gap-4">
            <div className="text-indigo-400 font-bold min-w-fit">2.</div>
            <p>Clique em uma oferta para ver detalhes e score</p>
          </div>
          <div className="flex gap-4">
            <div className="text-indigo-400 font-bold min-w-fit">3.</div>
            <p>Clique em "⚡ Analisar com Claude" para dissecação automática</p>
          </div>
          <div className="flex gap-4">
            <div className="text-indigo-400 font-bold min-w-fit">4.</div>
            <p>Explore <Link href="/patterns" className="text-indigo-400 hover:text-indigo-300">Padrões</Link> para insights comparativos</p>
          </div>
        </div>
      </motion.div>

      {/* Main Sections */}
      <motion.div
        className="space-y-8 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              variants={itemVariants}
              className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#12121a] to-[#0a0a0f] backdrop-blur-xl p-8 hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>

              {section.content && (
                <p className="text-[#9ca3af] whitespace-pre-line mb-4">
                  {section.content}
                </p>
              )}

              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-[#e8e8f0]"
                    >
                      <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* API Docs */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-xl p-8 mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>

        <div className="space-y-4">
          {[
            {
              method: "GET",
              path: "/offers",
              desc: "Listar todas as ofertas com filtros",
            },
            {
              method: "POST",
              path: "/offers",
              desc: "Criar nova oferta",
            },
            {
              method: "GET",
              path: "/offers/:id",
              desc: "Detalhes de uma oferta específica",
            },
            {
              method: "POST",
              path: "/offers/:id/analyze",
              desc: "Analisar oferta com Claude AI",
            },
            {
              method: "GET",
              path: "/dashboard/stats",
              desc: "Estatísticas do dashboard",
            },
            {
              method: "GET",
              path: "/patterns",
              desc: "Padrões identificados",
            },
          ].map((endpoint, idx) => (
            <div key={idx} className="border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400">
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-[#e8e8f0]">
                  {endpoint.path}
                </code>
              </div>
              <p className="text-sm text-[#9ca3af]">{endpoint.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-[#6b7280] mt-6">
          Docs completas disponíveis em{" "}
          <a
            href="http://localhost:8001/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300"
          >
            http://localhost:8001/docs
          </a>
        </p>
      </motion.div>

      {/* FAQ */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-xl p-8 mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-6">❓ Perguntas Frequentes</h2>

        <div className="space-y-6">
          {[
            {
              q: "Como funciona o Score?",
              a: "O score é calculado automaticamente baseado em 5 pilares: arquitetura financeira, longevidade, promessa, mercado e risco. Cada um contribui com uma porcentagem diferente para o total de 0-100.",
            },
            {
              q: "A análise Claude funciona offline?",
              a: "Não, a análise com Claude AI requer conexão com a API da Anthropic. Certifique-se de que sua chave de API está configurada corretamente no backend.",
            },
            {
              q: "Posso exportar as ofertas?",
              a: "Atualmente não há função de exportação. Mas você pode copiar os dados manualmente ou esperar pela integração de export em futuras versões.",
            },
            {
              q: "Quantas ofertas posso armazenar?",
              a: "Ilimitado! O banco de dados PostgreSQL pode armazenar milhões de ofertas sem problemas.",
            },
            {
              q: "Como adicionar uma oferta manualmente?",
              a: "Clique em '+ Nova Oferta' no Dashboard ou no Sidebar. Preencha os campos e salve. Opcionalmente, clique em 'Analisar com Claude' para dissecar automaticamente.",
            },
          ].map((faq, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-[#9ca3af]">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-xl p-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">⚙️ Tech Stack</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { category: "Frontend", items: ["Next.js 14", "React 18", "Framer Motion", "Tailwind CSS"] },
            { category: "Backend", items: ["FastAPI", "Python 3.10+", "SQLAlchemy", "Anthropic SDK"] },
            { category: "Banco de Dados", items: ["PostgreSQL", "SQLite (dev)", "Supabase (produção)"] },
          ].map((stack, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-amber-400 mb-3">{stack.category}</h3>
              <ul className="space-y-2">
                {stack.items.map((item, i) => (
                  <li key={i} className="text-[#9ca3af] text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={itemVariants}
        className="mt-12 pt-8 border-t border-indigo-500/20 text-center"
      >
        <p className="text-[#6b7280] mb-4">
          Dúvidas? Entre em contato ou abra uma issue no{" "}
          <a
            href="https://github.com/Leonardotrentini/swipefile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            GitHub
          </a>
        </p>
        <p className="text-[#4b5563] text-sm">
          LT ARTS v1.0.0 • Powered by Claude AI ✨
        </p>
      </motion.div>
    </motion.div>
  );
}
