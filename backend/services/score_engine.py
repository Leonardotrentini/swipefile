import json
from typing import Optional


def calculate_score(offer_data: dict) -> dict:
    """
    Calcula o Offer Score (0-100) com base nos 5 blocos:
    - Arquitetura Financeira /35
    - Longevidade de Tráfego /25
    - Engenharia da Promessa /20
    - Sinais de Mercado /10
    - Gestão de Risco /10
    """
    breakdown = {
        "financial": {"score": 0, "max": 35, "items": []},
        "longevity": {"score": 0, "max": 25, "items": []},
        "promise": {"score": 0, "max": 20, "items": []},
        "market": {"score": 0, "max": 10, "items": []},
        "risk": {"score": 0, "max": 10, "items": []},
    }

    front_price = offer_data.get("front_end_price", 0) or 0
    bump_price = offer_data.get("order_bump_price", 0) or 0
    upsell_price = offer_data.get("upsell_price", 0) or 0
    ad_count = offer_data.get("ad_count", 0) or 0
    running_days = offer_data.get("ads_running_days", 0) or 0
    funnel_type = offer_data.get("funnel_type", "") or ""
    mechanism = offer_data.get("mechanism", "") or ""
    promise = offer_data.get("promise", "") or ""
    destination_url = offer_data.get("destination_url", "") or ""
    meta_library_url = offer_data.get("meta_library_url", "") or ""

    # ── Arquitetura Financeira /35 ──────────────────────────────────────
    if bump_price > 0:
        breakdown["financial"]["score"] += 10
        breakdown["financial"]["items"].append({"label": "Tem order bump", "points": 10, "earned": True})
    else:
        breakdown["financial"]["items"].append({"label": "Tem order bump", "points": 10, "earned": False})

    if upsell_price > 0:
        breakdown["financial"]["score"] += 10
        breakdown["financial"]["items"].append({"label": "Tem upsell", "points": 10, "earned": True})
    else:
        breakdown["financial"]["items"].append({"label": "Tem upsell", "points": 10, "earned": False})

    aov = front_price + (bump_price * 0.4) + (upsell_price * 0.2)
    if front_price > 0 and aov >= front_price * 1.5:
        breakdown["financial"]["score"] += 10
        breakdown["financial"]["items"].append({"label": "AOV 1.5x-2.5x do front-end", "points": 10, "earned": True})
    else:
        breakdown["financial"]["items"].append({"label": "AOV 1.5x-2.5x do front-end", "points": 10, "earned": False})

    funnel_stages = _count_funnel_stages(funnel_type)
    if funnel_stages >= 3:
        breakdown["financial"]["score"] += 5
        breakdown["financial"]["items"].append({"label": "Funil completo (3+ etapas)", "points": 5, "earned": True})
    else:
        breakdown["financial"]["items"].append({"label": "Funil completo (3+ etapas)", "points": 5, "earned": False})

    # ── Longevidade de Tráfego /25 ─────────────────────────────────────
    if running_days >= 90:
        breakdown["longevity"]["score"] += 15
        breakdown["longevity"]["items"].append({"label": "+90 dias rodando", "points": 15, "earned": True})
    else:
        breakdown["longevity"]["items"].append({"label": "+90 dias rodando", "points": 15, "earned": False})

    if ad_count >= 50:
        breakdown["longevity"]["score"] += 7
        breakdown["longevity"]["items"].append({"label": "50+ variações de criativo", "points": 7, "earned": True})
    else:
        breakdown["longevity"]["items"].append({"label": "50+ variações de criativo", "points": 7, "earned": False})

    if running_days >= 30 and ad_count >= 10:
        breakdown["longevity"]["score"] += 3
        breakdown["longevity"]["items"].append({"label": "Volume crescente (estimado)", "points": 3, "earned": True})
    else:
        breakdown["longevity"]["items"].append({"label": "Volume crescente (estimado)", "points": 3, "earned": False})

    # ── Engenharia da Promessa /20 ──────────────────────────────────────
    quick_win_keywords = ["horas", "dias", "semanas", "rápido", "rapido", "imediato", "agora", "hoje", "24h", "48h", "7 dias", "30 dias"]
    promise_lower = promise.lower()
    if any(kw in promise_lower for kw in quick_win_keywords):
        breakdown["promise"]["score"] += 10
        breakdown["promise"]["items"].append({"label": "Quick win (horas/dias)", "points": 10, "earned": True})
    else:
        breakdown["promise"]["items"].append({"label": "Quick win (horas/dias)", "points": 10, "earned": False})

    cta_keywords = ["compre", "adquira", "garanta", "acesse", "clique", "assine", "inscreva"]
    ad_copy = (offer_data.get("ad_copy", "") or "").lower()
    if any(kw in ad_copy for kw in cta_keywords):
        breakdown["promise"]["score"] += 5
        breakdown["promise"]["items"].append({"label": "CTA de fundo de funil", "points": 5, "earned": True})
    else:
        breakdown["promise"]["items"].append({"label": "CTA de fundo de funil", "points": 5, "earned": False})

    if mechanism and len(mechanism) > 20:
        breakdown["promise"]["score"] += 5
        breakdown["promise"]["items"].append({"label": "Mecanismo único claro", "points": 5, "earned": True})
    else:
        breakdown["promise"]["items"].append({"label": "Mecanismo único claro", "points": 5, "earned": False})

    # ── Sinais de Mercado /10 ──────────────────────────────────────────
    validation_keywords = ["clickbank", "hotmart", "kiwify", "monetizze", "eduzz"]
    dest_lower = destination_url.lower()
    if any(kw in dest_lower for kw in validation_keywords):
        breakdown["market"]["score"] += 5
        breakdown["market"]["items"].append({"label": "Validação plataforma (HotM/CB)", "points": 5, "earned": True})
    else:
        breakdown["market"]["items"].append({"label": "Validação plataforma (HotM/CB)", "points": 5, "earned": False})

    if meta_library_url and len(meta_library_url) > 10:
        breakdown["market"]["score"] += 5
        breakdown["market"]["items"].append({"label": "Presença na biblioteca Meta", "points": 5, "earned": True})
    else:
        breakdown["market"]["items"].append({"label": "Presença na biblioteca Meta", "points": 5, "earned": False})

    # ── Gestão de Risco /10 ────────────────────────────────────────────
    high_ticket_keywords = ["mentoria", "consultoria", "vip", "premium", "elite", "grupo", "comunidade"]
    all_text = (promise_lower + " " + (offer_data.get("headline", "") or "").lower())
    if any(kw in all_text for kw in high_ticket_keywords):
        breakdown["risk"]["score"] += 5
        breakdown["risk"]["items"].append({"label": "Ponte para high-ticket", "points": 5, "earned": True})
    else:
        breakdown["risk"]["items"].append({"label": "Ponte para high-ticket", "points": 5, "earned": False})

    low_risk_types = ["info", "digital", "ebook", "curso", "treinamento", "livro"]
    product_lower = (offer_data.get("product", "") or "").lower()
    if any(kw in product_lower for kw in low_risk_types):
        breakdown["risk"]["score"] += 5
        breakdown["risk"]["items"].append({"label": "Baixo risco chargeback (digital)", "points": 5, "earned": True})
    else:
        breakdown["risk"]["items"].append({"label": "Baixo risco chargeback (digital)", "points": 5, "earned": False})

    total = (
        breakdown["financial"]["score"]
        + breakdown["longevity"]["score"]
        + breakdown["promise"]["score"]
        + breakdown["market"]["score"]
        + breakdown["risk"]["score"]
    )

    return {
        "total_score": total,
        "financial_score": breakdown["financial"]["score"],
        "longevity_score": breakdown["longevity"]["score"],
        "promise_score": breakdown["promise"]["score"],
        "market_score": breakdown["market"]["score"],
        "risk_score": breakdown["risk"]["score"],
        "breakdown_json": json.dumps(breakdown, ensure_ascii=False),
    }


def _count_funnel_stages(funnel_type: str) -> int:
    funnel_type = funnel_type.lower()
    stages = 1
    if "bump" in funnel_type or "order bump" in funnel_type:
        stages += 1
    if "upsell" in funnel_type or "oto" in funnel_type:
        stages += 1
    if "downsell" in funnel_type:
        stages += 1
    if "completo" in funnel_type or "full" in funnel_type:
        stages = max(stages, 3)
    return stages
