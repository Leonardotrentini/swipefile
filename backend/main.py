from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from config import CORS_ORIGINS
from routers import offers, analyze, dashboard, patterns
from seed.offers_seed import run_seed
from sqlalchemy.orm import Session
from database import SessionLocal

app = FastAPI(
    title="DR Intel — Swipe File",
    description="Mineração e dissecação de ofertas vencedoras com Claude AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(offers.router)
app.include_router(analyze.router)
app.include_router(dashboard.router)
app.include_router(patterns.router)


@app.on_event("startup")
def startup():
    init_db()


@app.post("/seed", tags=["seed"])
def seed_offers():
    db: Session = SessionLocal()
    try:
        inserted = run_seed(db)
        return {"message": f"{inserted} ofertas inseridas com sucesso."}
    finally:
        db.close()


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "app": "DR Intel Swipe File", "docs": "/docs"}


@app.get("/debug/key", tags=["debug"])
def debug_key():
    """Teste se a chave está sendo carregada."""
    from config import ANTHROPIC_API_KEY
    if ANTHROPIC_API_KEY:
        return {"status": "OK", "key_length": len(ANTHROPIC_API_KEY)}
    return {"status": "ERROR", "message": "ANTHROPIC_API_KEY vazio"}
