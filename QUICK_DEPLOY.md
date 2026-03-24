# 🚀 DEPLOY RÁPIDO EM PRODUÇÃO

## ⚡ Opção 1: Render.com (MAIS FÁCIL - 2 minutos)

### Passo 1: Criar conta Render
1. Acesse https://render.com
2. Sign up com GitHub
3. Autorizar Render no GitHub

### Passo 2: Deploy Backend
1. Clique em "New +"
2. Selecione "Web Service"
3. Conecte repo: `Leonardotrentini/swipefile`
4. Configure:
   - **Name**: `swipefile-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable:
   - `ANTHROPIC_API_KEY`: (sua chave)
   - `CORS_ORIGINS`: `http://localhost:3000,https://swipefile-ruddy.vercel.app,https://swipefile-api.onrender.com`
6. Clique em "Deploy"

### Passo 3: Atualizar Frontend
1. Acesse https://vercel.com/dashboard
2. Selecione projeto `swipefile`
3. Settings → Environment Variables
4. Altere `NEXT_PUBLIC_API_URL` para:
   ```
   https://swipefile-api.onrender.com
   ```
5. Salve e aguarde redeploy automático

### Resultado:
- **Backend**: `https://swipefile-api.onrender.com` ✅
- **Frontend**: `https://swipefile-ruddy.vercel.app` ✅

---

## ⚡ Opção 2: Railway (Manual)

```bash
npm i -g @railway/cli
railway login
cd backend
railway up
```

---

## 🐳 Opção 3: Docker Local

```bash
docker-compose up --build
# Frontend: http://localhost:3000
# Backend: http://localhost:8001
```

---

## 📊 Status Atual

| Serviço | URL | Status |
|---------|-----|--------|
| Frontend | https://swipefile-ruddy.vercel.app | ✅ Online |
| Backend (Render) | https://swipefile-api.onrender.com | ⏳ Deploy |
| Backend (Railway) | https://swipefile-production.up.railway.app | ❌ Offline |
| Local | http://localhost:3000 | ✅ Online |

---

## 💡 Qual escolher?

- **Render.com**: Mais confiável, free tier bom, deploy automático
- **Railway**: Mais barato, mas webhook pode falhar
- **Local**: Perfeito para development

