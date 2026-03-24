# 🚀 Setup Supabase para LT ARTS

## ⚠️ SEGURANÇA CRÍTICA

**Suas credenciais foram expostas!** Você DEVE regenerar imediatamente:

1. Vá para: https://app.supabase.com → Seu Projeto
2. Clique em "Settings" → "API"
3. Regenere as chaves (Anon Key, Service Role Key, etc)
4. NUNCA commite credenciais no git

---

## 🔑 Configuração Correta

### Backend Setup

#### 1. Instalar dependências PostgreSQL
```bash
cd backend
pip install psycopg2-binary sqlalchemy
```

#### 2. Configurar `.env` (NÃO COMMITE ISTO!)
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.ckpbxtdvpsnayuoojrwe.supabase.co:5432/postgres
SUPABASE_URL=https://ckpbxtdvpsnayuoojrwe.supabase.co
SUPABASE_ANON_KEY=sb_anon_xxxxxxxxxxxxxxxxxxxxx
```

#### 3. Rodar migrations
```bash
# Usar Alembic (já configurado)
alembic upgrade head
```

#### 4. Reiniciar backend
```bash
py -m uvicorn main:app --reload
```

---

### Frontend Setup

#### 1. Configurar `.env.local` (NÃO COMMITE ISTO!)
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_SUPABASE_URL=https://ckpbxtdvpsnayuoojrwe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_anon_xxxxxxxxxxxxxxxxxxxxx
```

#### 2. Dependências já instaladas
```bash
# Framer Motion, Recharts, Sonner, Lucide já estão no package.json
npm list framer-motion recharts sonner lucide-react
```

#### 3. Reiniciar frontend
```bash
npm run dev
```

---

## 📊 Arquitetura do Banco

### Tabelas Supabase

```sql
-- Ofertas
CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  advertiser VARCHAR,
  product VARCHAR,
  niche VARCHAR,
  funnel_type VARCHAR,
  status VARCHAR DEFAULT 'Novo',
  ad_count INTEGER DEFAULT 0,
  ads_running_days INTEGER DEFAULT 0,
  front_end_price FLOAT DEFAULT 0,
  order_bump_price FLOAT DEFAULT 0,
  upsell_price FLOAT DEFAULT 0,
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
  offer_score FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scores
CREATE TABLE score_breakdowns (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER REFERENCES offers(id),
  financial_score FLOAT,
  longevity_score FLOAT,
  promise_score FLOAT,
  market_score FLOAT,
  risk_score FLOAT,
  breakdown_json JSONB
);

-- Insights (análise Claude)
CREATE TABLE insights (
  id SERIAL PRIMARY KEY,
  offer_id INTEGER REFERENCES offers(id),
  main_angle TEXT,
  broken_belief TEXT,
  copy_framework VARCHAR,
  big_promise TEXT,
  unique_mechanism TEXT,
  why_it_works_hypothesis TEXT,
  similarity_tags JSONB,
  analyzed_at TIMESTAMP
);

-- Padrões
CREATE TABLE patterns (
  id SERIAL PRIMARY KEY,
  pattern_type VARCHAR,
  pattern_name VARCHAR,
  description TEXT,
  frequency INTEGER,
  avg_score FLOAT,
  offer_ids JSONB,
  niche VARCHAR,
  last_seen_at TIMESTAMP
);
```

---

## 🔐 Variáveis de Ambiente (Checklist)

### Backend `.env`
- [ ] `ANTHROPIC_API_KEY` - Chave da API Claude
- [ ] `DATABASE_URL` - URL PostgreSQL do Supabase
- [ ] `SUPABASE_URL` - URL do projeto Supabase
- [ ] `SUPABASE_ANON_KEY` - Chave pública (seguro exposer)
- [ ] `CORS_ORIGINS` - Domínios permitidos

### Frontend `.env.local`
- [ ] `NEXT_PUBLIC_API_URL` - URL do backend
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - URL Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave pública

---

## 🚀 Deploy (Supabase + Vercel + Railway)

### Vercel (Frontend)
```bash
# No Vercel Dashboard
1. Conecte seu repo GitHub
2. Adicione variáveis de environment:
   - NEXT_PUBLIC_API_URL = URL do backend
   - NEXT_PUBLIC_SUPABASE_URL = URL Supabase
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = Anon Key
3. Deploy automático em cada push para main
```

### Railway (Backend)
```bash
# No Railway Dashboard
1. Crie novo projeto
2. Conecte repo GitHub (branch: main)
3. Adicione variáveis:
   - ANTHROPIC_API_KEY
   - DATABASE_URL (Supabase)
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - CORS_ORIGINS = https://seu-vercel-domain.com
4. Deploy automático
```

---

## ✅ Checklist Final

- [ ] Regenerou credenciais Supabase (por segurança)
- [ ] `.env` configurado localmente (NÃO COMMITADO)
- [ ] `.env.local` configurado localmente (NÃO COMMITADO)
- [ ] `.gitignore` contém `.env` e `.env.local`
- [ ] Backend conecta ao Supabase
- [ ] Frontend chama backend corretamente
- [ ] Migrations rodaram com sucesso
- [ ] Seed data inserido (ofertas iniciais)

---

## 🆘 Troubleshooting

### "Connection refused" no DATABASE_URL
```bash
# Verificar credenciais
# Supabase Dashboard → Settings → Database
# Copiar full connection string (com senha)
```

### "CORS error" no frontend
```bash
# Backend main.py → CORS_ORIGINS
# Adicionar domínio do frontend
```

### "ANON_KEY not valid"
```bash
# Supabase Dashboard → Settings → API
# Copiar anon key novamente (pode ter regenerado)
```

---

## 📚 Recursos

- Supabase Docs: https://supabase.com/docs
- FastAPI + SQLAlchemy: https://fastapi.tiangolo.com/
- Vercel Deploy: https://vercel.com/docs
- Railway Deploy: https://docs.railway.app

---

**Creado:** 2026-03-24
**Status:** ✅ Pronto para produção
