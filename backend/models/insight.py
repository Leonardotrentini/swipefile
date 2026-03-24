from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    offer_id = Column(Integer, ForeignKey("offers.id"), unique=True, nullable=False)

    main_angle = Column(String, nullable=True)
    broken_belief = Column(Text, nullable=True)
    copy_framework = Column(String, nullable=True)  # PAS | AIDA | etc.

    big_promise = Column(Text, nullable=True)
    unique_mechanism = Column(Text, nullable=True)
    why_it_works_hypothesis = Column(Text, nullable=True)

    similarity_tags = Column(Text, nullable=True)  # JSON array string
    raw_claude_response = Column(Text, nullable=True)
    analyzed_at = Column(DateTime, default=datetime.utcnow)

    offer = relationship("Offer", back_populates="insight")
