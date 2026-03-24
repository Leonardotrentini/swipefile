from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from database import Base


class Pattern(Base):
    __tablename__ = "patterns"

    id = Column(Integer, primary_key=True, index=True)
    pattern_type = Column(String, nullable=False)  # hook | mechanism | framework | cta
    pattern_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    frequency = Column(Integer, default=1)
    avg_score = Column(Float, default=0.0)

    offer_ids = Column(Text, nullable=True)  # JSON array string
    niche = Column(String, nullable=True)

    last_seen_at = Column(DateTime, default=datetime.utcnow)
