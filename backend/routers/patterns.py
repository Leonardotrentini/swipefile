from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models.pattern import Pattern
import json

router = APIRouter(prefix="/patterns", tags=["patterns"])


@router.get("")
def list_patterns(
    pattern_type: Optional[str] = Query(None),
    niche: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Pattern)

    if pattern_type:
        query = query.filter(Pattern.pattern_type == pattern_type)
    if niche:
        query = query.filter(Pattern.niche.ilike(f"%{niche}%"))

    patterns = query.order_by(Pattern.frequency.desc(), Pattern.avg_score.desc()).all()

    return [
        {
            "id": p.id,
            "pattern_type": p.pattern_type,
            "pattern_name": p.pattern_name,
            "description": p.description,
            "frequency": p.frequency,
            "avg_score": p.avg_score,
            "offer_ids": json.loads(p.offer_ids) if p.offer_ids else [],
            "niche": p.niche,
            "last_seen_at": p.last_seen_at.isoformat() if p.last_seen_at else None,
        }
        for p in patterns
    ]
