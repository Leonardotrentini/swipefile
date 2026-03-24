import json
from datetime import datetime
from sqlalchemy.orm import Session
from models.insight import Insight
from models.offer import Offer
from models.pattern import Pattern


PATTERN_FIELDS = {
    "framework": "copy_framework",
    "hook": "main_angle",
    "mechanism": "unique_mechanism",
}


def update_patterns(db: Session, offer_id: int):
    """
    Após uma análise do Claude, extrai padrões do insight
    e atualiza (ou cria) os registros na tabela patterns.
    """
    insight = db.query(Insight).filter(Insight.offer_id == offer_id).first()
    offer = db.query(Offer).filter(Offer.id == offer_id).first()

    if not insight or not offer:
        return

    patterns_to_check = [
        ("framework", insight.copy_framework, _normalize_framework(insight.copy_framework)),
        ("hook", insight.main_angle, _normalize_hook(insight.main_angle)),
    ]

    if insight.similarity_tags:
        try:
            tags = json.loads(insight.similarity_tags)
            for tag in tags:
                patterns_to_check.append(("tag", tag, tag))
        except Exception:
            pass

    for pattern_type, raw_value, normalized_name in patterns_to_check:
        if not normalized_name:
            continue

        existing = (
            db.query(Pattern)
            .filter(
                Pattern.pattern_type == pattern_type,
                Pattern.pattern_name == normalized_name,
                Pattern.niche == offer.niche,
            )
            .first()
        )

        if existing:
            ids = json.loads(existing.offer_ids or "[]")
            if offer_id not in ids:
                ids.append(offer_id)
            existing.offer_ids = json.dumps(ids)
            existing.frequency = len(ids)
            existing.avg_score = _calc_avg_score(db, ids)
            existing.last_seen_at = datetime.utcnow()
        else:
            new_pattern = Pattern(
                pattern_type=pattern_type,
                pattern_name=normalized_name,
                description=raw_value,
                frequency=1,
                avg_score=offer.offer_score or 0.0,
                offer_ids=json.dumps([offer_id]),
                niche=offer.niche,
                last_seen_at=datetime.utcnow(),
            )
            db.add(new_pattern)

    db.commit()


def _calc_avg_score(db: Session, offer_ids: list) -> float:
    if not offer_ids:
        return 0.0
    offers = db.query(Offer).filter(Offer.id.in_(offer_ids)).all()
    scores = [o.offer_score for o in offers if o.offer_score]
    return round(sum(scores) / len(scores), 1) if scores else 0.0


def _normalize_framework(raw: str) -> str:
    if not raw:
        return ""
    raw = raw.upper().strip()
    for known in ["PAS", "AIDA", "4PS", "STORY-SELL", "STORYSELL"]:
        if known in raw:
            return known
    return raw[:50]


def _normalize_hook(raw: str) -> str:
    if not raw:
        return ""
    return raw.strip()[:80]
