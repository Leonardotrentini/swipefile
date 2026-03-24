-- LT ARTS - Schema para Supabase PostgreSQL
-- Execute este script no console SQL do Supabase

-- Tabela: offers (ofertas principais)
CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  advertiser VARCHAR,
  product VARCHAR,
  niche VARCHAR,
  funnel_type VARCHAR,
  status VARCHAR DEFAULT 'Novo',
  ad_count INTEGER DEFAULT 0,
  ads_running_days INTEGER DEFAULT 0,
  front_end_price FLOAT DEFAULT 0.0,
  order_bump_price FLOAT DEFAULT 0.0,
  upsell_price FLOAT DEFAULT 0.0,
  headline TEXT,
  avatar TEXT,
  pain_point TEXT,
  mechanism TEXT,
  promise TEXT,
  ad_copy TEXT,
  destination_url VARCHAR,
  checkout_url VARCHAR,
  thank_you_url VARCHAR,
  domains_assigned JSONB,
  meta_library_url VARCHAR,
  offer_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: score_breakdowns (breakdown do score)
CREATE TABLE IF NOT EXISTS score_breakdowns (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
  financial_score FLOAT,
  longevity_score FLOAT,
  promise_score FLOAT,
  market_score FLOAT,
  risk_score FLOAT,
  breakdown_json JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: insights (análises Claude)
CREATE TABLE IF NOT EXISTS insights (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER REFERENCES offers(id) ON DELETE CASCADE,
  main_angle TEXT,
  broken_belief TEXT,
  copy_framework VARCHAR,
  big_promise TEXT,
  unique_mechanism TEXT,
  why_it_works_hypothesis TEXT,
  similarity_tags JSONB,
  raw_claude_response TEXT,
  analyzed_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: patterns (padrões identificados)
CREATE TABLE IF NOT EXISTS patterns (
  id SERIAL PRIMARY KEY,
  pattern_type VARCHAR,
  pattern_name VARCHAR,
  description TEXT,
  frequency INTEGER DEFAULT 0,
  avg_score FLOAT,
  offer_ids JSONB,
  niche VARCHAR,
  last_seen_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_offers_niche ON offers(niche);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
CREATE INDEX IF NOT EXISTS idx_offers_score ON offers(offer_score);
CREATE INDEX IF NOT EXISTS idx_score_breakdowns_offer_id ON score_breakdowns(offer_id);
CREATE INDEX IF NOT EXISTS idx_insights_offer_id ON insights(offer_id);
CREATE INDEX IF NOT EXISTS idx_patterns_type ON patterns(pattern_type);

-- Dados de exemplo (7 ofertas)
INSERT INTO offers (
  name, advertiser, product, niche, funnel_type, status,
  ad_count, ads_running_days, front_end_price, order_bump_price, upsell_price,
  headline, avatar, pain_point, mechanism, promise,
  ad_copy, destination_url, checkout_url, thank_you_url, domains_assigned, meta_library_url, offer_score
) VALUES
(
  'Código da Magreza', 'NutriPro Brasil', 'Curso digital de emagrecimento',
  'Saúde & Emagrecimento', 'Front-end + Order Bump + Upsell', 'Hot',
  87, 142, 47.0, 27.0, 97.0,
  'Descubra o código que faz mulheres acima de 40 perderem 8kg em 28 dias sem academia nem dieta restritiva',
  'Mulheres 35-55 anos, com metabolismo lento, que já tentaram várias dietas sem sucesso',
  'Não conseguem emagrecer mesmo fazendo dieta, sentem que o corpo traiu com a menopausa',
  'Protocolo de ativação hormonal em 3 fases que reprograma o metabolismo feminino a partir dos 40',
  'Perder até 8kg em 28 dias ativando os hormônios certos, sem academia',
  'Médicos não querem que você saiba isso... Essa nutricionista descobriu o CÓDIGO que faz seu corpo queimar gordura 24h por dia. Clique e garanta seu acesso antes que eles tirem do ar.',
  'https://hotmart.com/produto/codigo-magreza',
  'https://pay.hotmart.com/codigo-magreza',
  'https://hotmart.com/obrigado/codigo-magreza',
  '["codigomagreza.com.br","hotmart.com"]',
  'https://www.facebook.com/ads/library/?id=codigomagreza',
  95.0
),
(
  'Método Millionaire Mindset', 'FinanceUp Academy', 'Treinamento online de mentalidade financeira',
  'Finanças & Investimentos', 'Front-end + Upsell High-ticket', 'Hot',
  134, 210, 97.0, 0.0, 497.0,
  'Como um ex-endividado de R$78 mil descobriu o único sistema que faz o dinheiro trabalhar por você enquanto você dorme',
  'Homens 28-45 anos, classe média, insatisfeitos com salário, querem liberdade financeira',
  'Trabalham muito mas o dinheiro nunca sobra, sentem que são escravos do sistema',
  'Sistema de 4 pilares da mentalidade milionária baseado em neuroeconomia comportamental',
  'Reprogramar sua relação com dinheiro e criar as primeiras 3 fontes de renda passiva em 90 dias',
  'Eu estava R$78 mil no vermelho há 3 anos. Hoje tenho 6 fontes de renda. A diferença foi uma mudança de mentalidade que ninguém ensina. Acesse agora e descubra o método.',
  'https://hotmart.com/produto/millionaire-mindset',
  'https://pay.hotmart.com/millionaire-mindset',
  'https://hotmart.com/obrigado/millionaire-mindset',
  '["millionairemindset.com.br","hotmart.com"]',
  'https://www.facebook.com/ads/library/?id=millionairemindset',
  88.0
),
(
  'Inglês Fluente em 90 Dias', 'FluentBr', 'Método de aprendizado de inglês online',
  'Educação & Idiomas', 'Funil completo com bump + 2 upsells', 'Hot',
  203, 385, 67.0, 37.0, 197.0,
  'Como falar inglês fluente em 90 dias gastando apenas 15 minutos por dia — mesmo que você já tenha desistido 3 vezes',
  'Brasileiros 25-45 anos que precisam de inglês para trabalho ou promoção mas acham difícil aprender',
  'Tentaram vários cursos e aplicativos mas nunca evoluíram o suficiente para falar com confiança',
  'Método da imersão contextual passiva: seu cérebro aprende inglês enquanto você faz atividades do dia a dia',
  'Falar inglês com fluência e confiança em 90 dias dedicando 15 minutos por dia',
  'Eu tentei curso, Duolingo e YouTube por 5 anos. Nada funcionou. Até descobrir esse método que ativa a parte do cérebro responsável por absorver idiomas naturalmente. Garanta seu acesso hoje.',
  'https://kiwify.app/ingles-fluente-90',
  'https://pay.kiwify.app/ingles-fluente-90',
  'https://kiwify.app/obrigado/ingles-fluente-90',
  '["fluentbr.com.br","kiwify.app"]',
  'https://www.facebook.com/ads/library/?id=ingles90dias',
  85.0
),
(
  'Relacionamento Blindado', 'LoveCoach Pro', 'Curso de relacionamentos para mulheres',
  'Relacionamentos & Autoajuda', 'Front-end + Order Bump', 'Observar',
  41, 67, 37.0, 17.0, 0.0,
  'O segredo que homens nunca contam: como fazer ele pensar em você o tempo todo e nunca querer te perder',
  'Mulheres 25-45 anos em relacionamentos instáveis ou que querem reconquistar ex-parceiro',
  'Sentem que dão tudo no relacionamento mas não recebem o mesmo, medo de abandono',
  'Protocolo de conexão emocional profunda baseado em psicologia do apego',
  'Fazer seu parceiro se tornar mais atencioso, presente e apaixonado em até 21 dias',
  'Você faz tudo certo mas ele ainda parece distante? Psicóloga revela o segredo por trás dos relacionamentos que duram. Acesse o método completo com desconto de hoje.',
  'https://hotmart.com/produto/relacionamento-blindado',
  'https://pay.hotmart.com/relacionamento-blindado',
  'https://hotmart.com/obrigado/relacionamento-blindado',
  '["relacionamentoblindado.com.br","hotmart.com"]',
  '',
  72.0
),
(
  'Trader do Zero', 'TradeMaster BR', 'Curso de day trade para iniciantes',
  'Finanças & Investimentos', 'Front-end + Order Bump + 2 Upsells + High-ticket backend', 'Hot',
  312, 520, 197.0, 97.0, 997.0,
  'Aposentado de 58 anos opera day trade 2h por dia e fatura R$4.800 mensais — método completo revelado',
  'Homens e mulheres 35-60 anos que querem renda extra ou aposentadoria antecipada',
  'Não têm renda suficiente para se aposentar, medo de depender de outros na velhice',
  'Estratégia de scalping com gestão de risco proprietária: nunca perde mais do que ganha em uma semana',
  'Criar uma renda extra de R$3.000 a R$8.000 mensais operando 2 horas por dia com capital inicial de R$2.000',
  'Com 58 anos, sem experiência em investimentos, aprendi esse método em 30 dias. No segundo mês já cobri minha aposentadoria. Veja como funciona na prática — vagas limitadas para o grupo VIP.',
  'https://hotmart.com/produto/trader-do-zero',
  'https://pay.hotmart.com/trader-do-zero',
  'https://hotmart.com/obrigado/trader-do-zero',
  '["traderdozero.com.br","hotmart.com"]',
  'https://www.facebook.com/ads/library/?id=traderdozero',
  91.0
),
(
  'Cabelo dos Sonhos', 'BeautyFormula', 'Tratamento capilar digital + produto físico',
  'Beleza & Estética', 'Front-end + Order Bump + Upsell produto físico', 'Novo',
  28, 34, 27.0, 37.0, 127.0,
  'Trichologista revela a fórmula proibida que faz o cabelo crescer 3cm por mês e para a queda em 7 dias',
  'Mulheres 20-50 anos com queda de cabelo, cabelos finos ou que não crescem',
  'Cabelo não cresce, fica quebrando, e perdem fios excessivamente gerando insegurança',
  'Protocolo de nutrição capilar interna + externa com 7 ativos naturais que reativam os folículos dormentes',
  'Parar a queda de cabelo em 7 dias e estimular crescimento acelerado de 3cm por mês',
  'Dermatologistas receitam remédios caros que travam o crescimento do cabelo. Essa trichologista descobriu a combinação NATURAL que faz seus fios crescerem como nunca. Assista ao vídeo completo.',
  'https://monetizze.com.br/produto/cabelo-dos-sonhos',
  'https://pay.monetizze.com.br/cabelo-dos-sonhos',
  'https://monetizze.com.br/obrigado/cabelo-dos-sonhos',
  '["cabelodossonhos.com.br","monetizze.com.br"]',
  'https://www.facebook.com/ads/library/?id=cabelodossonhos',
  78.0
),
(
  'VSL Copy Blueprint', 'CopyMasters Pro', 'Curso de copywriting para VSL',
  'Marketing & Negócios Digitais', 'Front-end + Order Bump + Upsell + Mentoria high-ticket', 'Observar',
  56, 89, 297.0, 97.0, 997.0,
  'Como escrever VSLs que convertem a 8% ou mais: o blueprint dos 7 maiores faturadores do marketing digital brasileiro',
  'Copywriters e infoprodutores intermediários que querem escalar seus lançamentos e produtos',
  'Escrevem VSLs mas as conversões são baixas, não sabem o que está bloqueando as vendas',
  'Framework ROPE (Research, Open loop, Proof, Emotion) aplicado em VSLs de alta conversão',
  'Duplicar a taxa de conversão de qualquer VSL em até 30 dias aplicando o blueprint de 7 etapas',
  'Analisei as 50 VSLs de maior conversão do Brasil nos últimos 2 anos. Encontrei 7 padrões que todas têm em comum. Hoje vou revelar o blueprint completo para você. Garanta sua vaga.',
  'https://hotmart.com/produto/vsl-copy-blueprint',
  'https://pay.hotmart.com/vsl-copy-blueprint',
  'https://hotmart.com/obrigado/vsl-copy-blueprint',
  '["vslcopyblueprint.com.br","hotmart.com"]',
  'https://www.facebook.com/ads/library/?id=vslcopyblueprint',
  82.0
) ON CONFLICT DO NOTHING;

-- Confirmação
SELECT COUNT(*) as total_offers FROM offers;
