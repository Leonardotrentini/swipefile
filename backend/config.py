import os
from pathlib import Path

# Carregar .env manualmente (load_dotenv não funciona bem em Windows)
env_file = Path(__file__).parent / ".env"
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and "=" in line and not line.startswith("#"):
                key, value = line.split("=", 1)
                os.environ[key.strip()] = value.strip()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dr_intel.db")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://swipefile-ruddy.vercel.app").split(",")

# Debug
if not ANTHROPIC_API_KEY:
    print(f"WARNING: ANTHROPIC_API_KEY vazio! Arquivo .env: {env_file}")
else:
    print(f"[OK] ANTHROPIC_API_KEY carregada ({len(ANTHROPIC_API_KEY)} chars)")

# Log configuration
print(f"[CONFIG] DATABASE_URL: {DATABASE_URL[:50]}..." if len(DATABASE_URL) > 50 else f"[CONFIG] DATABASE_URL: {DATABASE_URL}")
print(f"[CONFIG] CORS_ORIGINS: {CORS_ORIGINS}")
