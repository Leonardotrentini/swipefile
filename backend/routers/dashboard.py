from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.offer import Offer
from models.insight import Insight
from models.pattern import Pattern

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_offers = db.query(Offer).count()
    analyzed_offers = db.query(Insight).count()
    hot_offers = db.query(Offer).filter(Offer.status == "Hot").count()
    total_patterns = db.query(Pattern).count()

    avg_score_row = db.query(func.avg(Offer.offer_score)).scalar()
    avg_score = round(float(avg_score_row or 0), 1)

    top_offers = (
        db.query(Offer)
        .order_by(Offer.offer_score.desc())
        .limit(5)
        .all()
    )

    top_offers_data = [
        {
            "id": o.id,
            "name": o.name,
            "advertiser": o.advertiser,
            "niche": o.niche,
            "offer_score": o.offer_score,
            "status": o.status,
        }
        for o in top_offers
    ]

    niches = db.query(Offer.niche, func.count(Offer.id)).group_by(Offer.niche).all()
    niche_distribution = [{"niche": n, "count": c} for n, c in niches]

    statuses = db.query(Offer.status, func.count(Offer.id)).group_by(Offer.status).all()
    status_distribution = [{"status": s, "count": c} for s, c in statuses]

    score_ranges = {
        "0-25": db.query(Offer).filter(Offer.offer_score < 25).count(),
        "25-50": db.query(Offer).filter(Offer.offer_score >= 25, Offer.offer_score < 50).count(),
        "50-75": db.query(Offer).filter(Offer.offer_score >= 50, Offer.offer_score < 75).count(),
        "75-100": db.query(Offer).filter(Offer.offer_score >= 75).count(),
    }

    recent_offers = (
        db.query(Offer)
        .order_by(Offer.created_at.desc())
        .limit(5)
        .all()
    )
    recent_data = [
        {
            "id": o.id,
            "name": o.name,
            "advertiser": o.advertiser,
            "niche": o.niche,
            "offer_score": o.offer_score,
            "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
        }
        for o in recent_offers
    ]

    alerts = []
    if hot_offers == 0 and total_offers > 3:
        alerts.append("Nenhuma oferta com status 'Hot' ainda — analise suas melhores ofertas.")
    if analyzed_offers < total_offers and total_offers > 0:
        alerts.append(f"{total_offers - analyzed_offers} oferta(s) ainda sem análise do Claude.")
    if total_patterns == 0 and analyzed_offers > 0:
        alerts.append("Padrões ainda não identificados — refaça a análise de algumas ofertas.")

    return {
        "total_offers": total_offers,
        "analyzed_offers": analyzed_offers,
        "hot_offers": hot_offers,
        "total_patterns": total_patterns,
        "avg_score": avg_score,
        "top_offers": top_offers_data,
        "recent_offers": recent_data,
        "niche_distribution": niche_distribution,
        "status_distribution": status_distribution,
        "score_ranges": score_ranges,
        "alerts": alerts,
    }
