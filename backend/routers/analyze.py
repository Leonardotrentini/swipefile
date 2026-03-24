from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models.offer import Offer
from models.insight import Insight
from services.claude_service import analyze_offer
from services.pattern_engine import update_patterns
import json

router = APIRouter(prefix="/offers", tags=["analyze"])


@router.post("/{offer_id}/analyze")
async def analyze(offer_id: int, db: Session = Depends(get_db)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta não encontrada")

    offer_data = {
        "name": offer.name,
        "product": offer.product,
        "niche": offer.niche,
        "headline": offer.headline,
        "promise": offer.promise,
        "mechanism": offer.mechanism,
        "avatar": offer.avatar,
        "pain_point": offer.pain_point,
        "ad_copy": offer.ad_copy,
    }

    try:
        result = await analyze_offer(offer_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao chamar Claude: {str(e)}")

    if offer.insight:
        ins = offer.insight
        ins.main_angle = result["main_angle"]
        ins.broken_belief = result["broken_belief"]
        ins.copy_framework = result["copy_framework"]
        ins.big_promise = result["big_promise"]
        ins.unique_mechanism = result["unique_mechanism"]
        ins.why_it_works_hypothesis = result["why_it_works_hypothesis"]
        ins.similarity_tags = result["similarity_tags"]
        ins.raw_claude_response = result["raw_claude_response"]
        ins.analyzed_at = datetime.utcnow()
    else:
        ins = Insight(
            offer_id=offer_id,
            main_angle=result["main_angle"],
            broken_belief=result["broken_belief"],
            copy_framework=result["copy_framework"],
            big_promise=result["big_promise"],
            unique_mechanism=result["unique_mechanism"],
            why_it_works_hypothesis=result["why_it_works_hypothesis"],
            similarity_tags=result["similarity_tags"],
            raw_claude_response=result["raw_claude_response"],
            analyzed_at=datetime.utcnow(),
        )
        db.add(ins)

    db.commit()

    update_patterns(db, offer_id)

    extra = result.get("extra", {})

    return {
        "offer_id": offer_id,
        "main_angle": result["main_angle"],
        "broken_belief": result["broken_belief"],
        "copy_framework": result["copy_framework"],
        "big_promise": result["big_promise"],
        "unique_mechanism": result["unique_mechanism"],
        "why_it_works_hypothesis": result["why_it_works_hypothesis"],
        "similarity_tags": json.loads(result["similarity_tags"]) if result["similarity_tags"] else [],
        "hook_type": extra.get("hook_type", ""),
        "cta_type": extra.get("cta_type", ""),
        "target_awareness": extra.get("target_awareness", ""),
        "strengths": extra.get("strengths", []),
        "weaknesses": extra.get("weaknesses", []),
        "analyzed_at": datetime.utcnow().isoformat(),
    }
