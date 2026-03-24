from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    advertiser = Column(String, nullable=False)
    product = Column(String, nullable=False)

    niche = Column(String, nullable=False)
    funnel_type = Column(String, nullable=False)
    status = Column(String, default="Novo")  # Hot | Novo | Observar

    ad_count = Column(Integer, default=0)
    ads_running_days = Column(Integer, default=0)

    front_end_price = Column(Float, default=0.0)
    order_bump_price = Column(Float, default=0.0)
    upsell_price = Column(Float, default=0.0)

    headline = Column(Text, nullable=True)
    avatar = Column(Text, nullable=True)
    pain_point = Column(Text, nullable=True)
    mechanism = Column(Text, nullable=True)
    promise = Column(Text, nullable=True)

    ad_copy = Column(Text, nullable=True)
    destination_url = Column(String, nullable=True)
    checkout_url = Column(String, nullable=True)
    thank_you_url = Column(String, nullable=True)
    meta_library_url = Column(String, nullable=True)

    domains_assigned = Column(Text, nullable=True)  # JSON array de domínios

    offer_score = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    score_breakdown = relationship("ScoreBreakdown", back_populates="offer", uselist=False, cascade="all, delete-orphan")
    insight = relationship("Insight", back_populates="offer", uselist=False, cascade="all, delete-orphan")
