from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from database import get_db
from models.offer import Offer
from models.score import ScoreBreakdown
from services.score_engine import calculate_score
import json

router = APIRouter(prefix="/offers", tags=["offers"])


class OfferCreate(BaseModel):
    name: str
    advertiser: str
    product: str
    niche: str
    funnel_type: str
    status: Optional[str] = "Novo"
    ad_count: Optional[int] = 0
    ads_running_days: Optional[int] = 0
    front_end_price: Optional[float] = 0.0
    order_bump_price: Optional[float] = 0.0
    upsell_price: Optional[float] = 0.0
    headline: Optional[str] = None
    avatar: Optional[str] = None
    pain_point: Optional[str] = None
    mechanism: Optional[str] = None
    promise: Optional[str] = None
    ad_copy: Optional[str] = None
    destination_url: Optional[str] = None
    checkout_url: Optional[str] = None
    thank_you_url: Optional[str] = None
    meta_library_url: Optional[str] = None
    domains_assigned: Optional[str] = None


class OfferUpdate(OfferCreate):
    name: Optional[str] = None
    advertiser: Optional[str] = None
    product: Optional[str] = None
    niche: Optional[str] = None
    funnel_type: Optional[str] = None


def offer_to_dict(offer: Offer) -> dict:
    result = {
        "id": offer.id,
        "name": offer.name,
        "advertiser": offer.advertiser,
        "product": offer.product,
        "niche": offer.niche,
        "funnel_type": offer.funnel_type,
        "status": offer.status,
        "ad_count": offer.ad_count,
        "ads_running_days": offer.ads_running_days,
        "front_end_price": offer.front_end_price,
        "order_bump_price": offer.order_bump_price,
        "upsell_price": offer.upsell_price,
        "headline": offer.headline,
        "avatar": offer.avatar,
        "pain_point": offer.pain_point,
        "mechanism": offer.mechanism,
        "promise": offer.promise,
        "ad_copy": offer.ad_copy,
        "destination_url": offer.destination_url,
        "checkout_url": offer.checkout_url,
        "thank_you_url": offer.thank_you_url,
        "meta_library_url": offer.meta_library_url,
        "domains_assigned": json.loads(offer.domains_assigned) if offer.domains_assigned else [],
        "offer_score": offer.offer_score,
        "created_at": offer.created_at.isoformat() if offer.created_at else None,
        "updated_at": offer.updated_at.isoformat() if offer.updated_at else None,
        "has_insight": offer.insight is not None,
    }

    if offer.score_breakdown:
        sb = offer.score_breakdown
        result["score_breakdown"] = {
            "financial_score": sb.financial_score,
            "longevity_score": sb.longevity_score,
            "promise_score": sb.promise_score,
            "market_score": sb.market_score,
            "risk_score": sb.risk_score,
            "breakdown_json": json.loads(sb.breakdown_json) if sb.breakdown_json else None,
        }

    if offer.insight:
        ins = offer.insight
        result["insight"] = {
            "main_angle": ins.main_angle,
            "broken_belief": ins.broken_belief,
            "copy_framework": ins.copy_framework,
            "big_promise": ins.big_promise,
            "unique_mechanism": ins.unique_mechanism,
            "why_it_works_hypothesis": ins.why_it_works_hypothesis,
            "similarity_tags": json.loads(ins.similarity_tags) if ins.similarity_tags else [],
            "analyzed_at": ins.analyzed_at.isoformat() if ins.analyzed_at else None,
        }

    return result


@router.get("")
def list_offers(
    niche: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None),
    max_score: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    analyzed: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Offer)

    if niche:
        query = query.filter(Offer.niche.ilike(f"%{niche}%"))
    if status:
        query = query.filter(Offer.status == status)
    if min_score is not None:
        query = query.filter(Offer.offer_score >= min_score)
    if max_score is not None:
        query = query.filter(Offer.offer_score <= max_score)
    if search:
        query = query.filter(
            Offer.name.ilike(f"%{search}%")
            | Offer.advertiser.ilike(f"%{search}%")
            | Offer.headline.ilike(f"%{search}%")
        )

    offers = query.order_by(Offer.offer_score.desc()).all()

    if analyzed is not None:
        offers = [o for o in offers if (o.insight is not None) == analyzed]

    return [offer_to_dict(o) for o in offers]


@router.get("/{offer_id}")
def get_offer(offer_id: int, db: Session = Depends(get_db)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta não encontrada")
    return offer_to_dict(offer)


@router.post("", status_code=201)
def create_offer(data: OfferCreate, db: Session = Depends(get_db)):
    offer = Offer(**data.model_dump())
    db.add(offer)
    db.flush()

    score_data = calculate_score(data.model_dump())
    offer.offer_score = score_data["total_score"]

    sb = ScoreBreakdown(
        offer_id=offer.id,
        financial_score=score_data["financial_score"],
        longevity_score=score_data["longevity_score"],
        promise_score=score_data["promise_score"],
        market_score=score_data["market_score"],
        risk_score=score_data["risk_score"],
        breakdown_json=score_data["breakdown_json"],
    )
    db.add(sb)
    db.commit()
    db.refresh(offer)
    return offer_to_dict(offer)


@router.put("/{offer_id}")
def update_offer(offer_id: int, data: OfferUpdate, db: Session = Depends(get_db)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta não encontrada")

    update_data = data.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(offer, key, value)

    score_data = calculate_score({
        "front_end_price": offer.front_end_price,
        "order_bump_price": offer.order_bump_price,
        "upsell_price": offer.upsell_price,
        "ad_count": offer.ad_count,
        "ads_running_days": offer.ads_running_days,
        "funnel_type": offer.funnel_type,
        "mechanism": offer.mechanism,
        "promise": offer.promise,
        "ad_copy": offer.ad_copy,
        "destination_url": offer.destination_url,
        "meta_library_url": offer.meta_library_url,
        "headline": offer.headline,
        "product": offer.product,
    })
    offer.offer_score = score_data["total_score"]

    if offer.score_breakdown:
        sb = offer.score_breakdown
        sb.financial_score = score_data["financial_score"]
        sb.longevity_score = score_data["longevity_score"]
        sb.promise_score = score_data["promise_score"]
        sb.market_score = score_data["market_score"]
        sb.risk_score = score_data["risk_score"]
        sb.breakdown_json = score_data["breakdown_json"]
    else:
        sb = ScoreBreakdown(offer_id=offer.id, **{k: v for k, v in score_data.items() if k != "total_score"})
        db.add(sb)

    db.commit()
    db.refresh(offer)
    return offer_to_dict(offer)


@router.delete("/{offer_id}", status_code=204)
def delete_offer(offer_id: int, db: Session = Depends(get_db)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta não encontrada")
    db.delete(offer)
    db.commit()
    return None


@router.get("/{offer_id}/score")
def get_score(offer_id: int, db: Session = Depends(get_db)):
    offer = db.query(Offer).filter(Offer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Oferta não encontrada")

    sb = offer.score_breakdown
    if not sb:
        raise HTTPException(status_code=404, detail="Score não calculado ainda")

    return {
        "offer_id": offer_id,
        "offer_score": offer.offer_score,
        "financial_score": sb.financial_score,
        "longevity_score": sb.longevity_score,
        "promise_score": sb.promise_score,
        "market_score": sb.market_score,
        "risk_score": sb.risk_score,
        "breakdown": json.loads(sb.breakdown_json) if sb.breakdown_json else {},
    }
