# 🚀 Guia de Deployment - LT ARTS Swipe File

## ✅ Status Atual

- **Frontend (Vercel)**: https://swipefile-ruddy.vercel.app ✓ ONLINE
- **Backend (Railway)**: https://swipefile-production.up.railway.app ⚠️ OFFLINE
- **Local**: http://localhost:3000 ✓ FUNCIONANDO 100%

## 🎯 Problema

O backend no Railway não está respondendo (erro 404 "Application not found"). Possíveis causas:
1. Railway project deletado ou parado
2. Webhook de auto-deploy não configurado
3. Erro fatal na inicialização

## 🔧 Soluções

### Opção 1: Deploy Manual no Railway (Recomendado)

```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Fazer login
railway login

# 3. Criar novo projeto (ou selecionar existente)
railway init

# 4. Configurar variáveis de ambiente
railway variables add ANTHROPIC_API_KEY="sk-ant-..."
railway variables add DATABASE_URL="postgresql://..."
railway variables add CORS_ORIGINS="http://localhost:3000,https://swipefile-ruddy.vercel.app"

# 5. Deploy
railway up
```

### Opção 2: Deploy via Docker no Render.com

```bash
# 1. Fazer push (já feito)
# 2. Criar account em https://render.com
# 3. Criar novo "Web Service"
# 4. Conectar GitHub repo
# 5. Configurar:
#    - Build command: pip install -r requirements.txt
#    - Start command: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Opção 3: Executar Localmente com Docker

```bash
# Build e rodar com docker-compose
docker-compose up --build

# Acessa em:
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
```

## 📋 Checklist de Testes Locais

- [x] Backend funciona em localhost:8001
- [x] Frontend funciona em localhost:3000
- [x] Dashboard exibe 7 ofertas
- [x] Biblioteca funciona com todas as ofertas
- [x] API endpoints retornam dados corretos
- [x] Database seeding automático funciona
- [x] CORS configurado corretamente

## 🔑 Environment Variables Necessárias

```env
# Backend
ANTHROPIC_API_KEY=sk-ant-... (Claude API key)
DATABASE_URL=postgresql://... (Supabase PostgreSQL ou SQLite)
CORS_ORIGINS=http://localhost:3000,https://swipefile-ruddy.vercel.app

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://swipefile-production.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://ckpbxtdvpsnayuoojrwe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

## 📊 Dados de Seed

A aplicação vem com 7 ofertas pré-carregadas:
1. Código da Magreza (95/100)
2. Método Millionaire Mindset (80/100)
3. Inglês Fluente em 90 Dias (90/100)
4. Relacionamento Blindado (43/100)
5. Trader do Zero (90/100)
6. Cabelo dos Sonhos (68/100)
7. VSL Copy Blueprint (80/100)

## 🛠️ Troubleshooting

### Backend não responde no Railway
1. Verificar Railway dashboard se app está "Online"
2. Verificar logs no Railway para erros
3. Confirmar que todas as env vars estão configuradas
4. Fazer redeploy forçado

### Frontend não consegue chamar backend
1. Verificar CORS_ORIGINS no backend/config.py
2. Verificar NEXT_PUBLIC_API_URL no frontend/.env.local
3. Verificar erro na network tab do DevTools
4. Confirmar que backend está online

### Erro de database
1. Confirmar DATABASE_URL está correto
2. Se usar Supabase, verificar conexão PostgreSQL
3. Limpar database se necessário e reseeder

## 📞 Contato & Suporte

Para questões de deployment, verifique:
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com/deployment/
- Next.js Docs: https://nextjs.org/docs/deployment
