# 🗄️ **SETUP MANUAL DO BANCO SUPABASE**

## ⚠️ Você está usando SQLite localmente!

O backend **ainda está usando `dr_intel.db` (SQLite)** e não o Supabase.

Para **migrar para Supabase PostgreSQL**, siga os passos:

---

## 📋 **Passo 1: Ir para Console SQL do Supabase**

1. Acesse: https://app.supabase.com
2. Selecione seu projeto: **LT ARTS**
3. Clique em: **"SQL Editor"** (ou icone SQL)
4. Clique em: **"+ New Query"**

---

## 🔧 **Passo 2: Copiar e Executar o Script**

1. Abra o arquivo: `/database/init_supabase.sql`
2. Copie TODO o conteúdo
3. Cole no editor SQL do Supabase
4. Clique em: **"Run"** (ou Ctrl+Enter)

**Resultado esperado:**
```
✓ Tables created successfully
✓ Indexes created
✓ 7 offers inserted
✓ total_offers: 7
```

---

## 🔄 **Passo 3: Atualizar Backend para usar Supabase**

### 3.1 Obter a senha do banco Supabase

1. Supabase Dashboard → **Settings**
2. Clique em **"Database"**
3. Procure por: **"Password"** (ou "Database Password")
4. Clique em **"Reset password"** (ou veja a senha existente)
5. Copie a senha

### 3.2 Atualizar `.env` do backend

```bash
# Backend: /backend/.env
```

Substitua `[YOUR-PASSWORD]` pela senha real:

**Antes:**
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.ckpbxtdvpsnayuoojrwe.supabase.co:5432/postgres
```

**Depois (exemplo):**
```
DATABASE_URL=postgresql://postgres:MinhaSenhaSegura123!@db.ckpbxtdvpsnayuoojrwe.supabase.co:5432/postgres
```

---

## 🚀 **Passo 4: Reiniciar Backend com Supabase**

### Parar servidor atual
```bash
# Pressione Ctrl+C no terminal do backend
```

### Mudar DATABASE_URL dinamicamente
```bash
# Opção 1: Editar .env e reiniciar
# Opção 2: Via variável de ambiente (produção)
set DATABASE_URL=postgresql://postgres:SENHA@db.ckpbxtdvpsnayuoojrwe.supabase.co:5432/postgres
```

### Reiniciar backend
```bash
cd backend
py -m uvicorn main:app --reload
```

---

## ✅ **Passo 5: Validar Conexão**

### Teste 1: Verificar conexão
```bash
curl http://localhost:8001/
# Resposta esperada: {"status":"ok",...}
```

### Teste 2: Listar ofertas (do Supabase)
```bash
curl http://localhost:8001/offers
# Resposta esperada: 7 ofertas do Supabase
```

### Teste 3: Analytics Claude
```bash
curl -X POST http://localhost:8001/offers/1/analyze
# Resposta esperada: {"offer_id":1,"main_angle":"...",...}
```

### Teste 4: Verificar no Supabase
1. Supabase Dashboard → **SQL Editor**
2. Execute:
```sql
SELECT COUNT(*) as total_offers FROM offers;
```
3. Resultado esperado: **7**

---

## 🔍 **Troubleshooting**

### ❌ "Connection refused"
```
Causa: Senha incorreta ou banco não acessível
Solução:
1. Verificar senha no Supabase Dashboard
2. Certificar que está online
3. Testar conexão: psql postgresql://postgres:SENHA@db.xxx
```

### ❌ "Relation 'offers' does not exist"
```
Causa: Tabelas não foram criadas
Solução:
1. Executar o script init_supabase.sql novamente
2. Verificar se rodou sem erros
3. Confirmar no SQL Editor: SELECT * FROM offers LIMIT 1;
```

### ❌ "SSL connection error"
```
Causa: SSL não está configurado
Solução:
Adicionar ao DATABASE_URL: ?sslmode=require
postgresql://postgres:SENHA@db.xxx:5432/postgres?sslmode=require
```

### ❌ Frontend ainda mostra dados antigos
```
Causa: Cache do SQLite anterior
Solução:
1. Limpar cache do navegador (Ctrl+Shift+Delete)
2. Reiniciar frontend (npm run dev)
3. Verificar endpoint /offers no navegador
```

---

## 📊 **Script init_supabase.sql faz:**

```
✅ Cria tabela: offers (7 ofertas de exemplo)
✅ Cria tabela: score_breakdowns
✅ Cria tabela: insights (análises Claude)
✅ Cria tabela: patterns (padrões)
✅ Cria índices para performance
✅ Insere 7 ofertas completas com dados reais
```

---

## ⏱️ **Tempo estimado:**

- SQL Console: **2 minutos**
- Obter senha: **1 minuto**
- Atualizar `.env`: **1 minuto**
- Reiniciar backend: **1 minuto**
- Validação: **2 minutos**

**Total: ~7 minutos** ⚡

---

## 🎯 **Checklist Final**

- [ ] Script SQL executado no Supabase
- [ ] Senha do banco obtida
- [ ] `.env` atualizado com senha real
- [ ] Backend reiniciado
- [ ] Teste: `curl localhost:8001/offers` retorna 7 ofertas
- [ ] Frontend mostra dados do Supabase
- [ ] Análise Claude funcionando
- [ ] ✅ Tudo pronto para produção!

---

**Arquivo do script:** `/database/init_supabase.sql`
**Documentação:** Este arquivo
**Suporte:** https://supabase.com/docs
