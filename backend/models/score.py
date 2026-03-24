from sqlalchemy import Column, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base


class ScoreBreakdown(Base):
    __tablename__ = "score_breakdowns"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, ForeignKey("offers.id"), unique=True, nullable=False)

    financial_score = Column(Float, default=0.0)   # /35
    longevity_score = Column(Float, default=0.0)   # /25
    promise_score = Column(Float, default=0.0)     # /20
    market_score = Column(Float, default=0.0)      # /10
    risk_score = Column(Float, default=0.0)        # /10

    breakdown_json = Column(Text, nullable=True)

    offer = relationship("Offer", back_populates="score_breakdown")
