import os
from pathlib import Path

# Carregar variáveis de ambiente (dar prioridade ao sistema/Railway)
# Primeiro tenta as variáveis de ambiente do sistema (Railway injeta aqui)
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "")
CORS_ORIGINS_STR = os.getenv("CORS_ORIGINS", "")

# Se não encontrou no sistema, tenta carregar do arquivo .env local (desenvolvimento)
if not ANTHROPIC_API_KEY or not DATABASE_URL:
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and "=" in line and not line.startswith("#"):
                    key, value = line.split("=", 1)
                    key = key.strip()
                    value = value.strip()
                    # Só seta se ainda não foi setado (variáveis de ambiente têm prioridade)
                    if key == "ANTHROPIC_API_KEY" and not ANTHROPIC_API_KEY:
                        ANTHROPIC_API_KEY = value
                        os.environ[key] = value
                    elif key == "DATABASE_URL" and not DATABASE_URL:
                        DATABASE_URL = value
                        os.environ[key] = value
                    elif key == "CORS_ORIGINS" and not CORS_ORIGINS_STR:
                        CORS_ORIGINS_STR = value
                        os.environ[key] = value

# Valores padrão se nada foi encontrado
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./dr_intel.db"
if not CORS_ORIGINS_STR:
    CORS_ORIGINS_STR = "http://localhost:3000,https://swipefile-ruddy.vercel.app"

CORS_ORIGINS = CORS_ORIGINS_STR.split(",")

# Debug
if not ANTHROPIC_API_KEY:
    print(f"WARNING: ANTHROPIC_API_KEY vazio! Arquivo .env: {env_file}")
else:
    print(f"[OK] ANTHROPIC_API_KEY carregada ({len(ANTHROPIC_API_KEY)} chars)")

# Log configuration
print(f"[CONFIG] DATABASE_URL: {DATABASE_URL[:50]}..." if len(DATABASE_URL) > 50 else f"[CONFIG] DATABASE_URL: {DATABASE_URL}")
print(f"[CONFIG] CORS_ORIGINS: {CORS_ORIGINS}")
