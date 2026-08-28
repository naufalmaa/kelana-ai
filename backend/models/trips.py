from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from database import Base
import datetime

class Trip(Base):
    __tablename__   = "trips"

    id              = Column(Integer, primary_key=True, index=True)
    destination     = Column(String, nullable=False)
    country         = Column(String, nullable=False)
    days            = Column(Integer, nullable=False)
    budget          = Column(Float, nullable=False)
    currency        = Column(String, nullable=False)
    category        = Column(String, nullable=False)
    daily_budget    = Column(Float, nullable=False)
    travel_style    = Column(String, nullable=False)
    trip_theme      = Column(String, nullable=True, default="Cultural & Culinary")
    travel_month    = Column(String, nullable=False)
    ai_recommendation = Column(Text, nullable=False)
    created_at      = Column(DateTime, default=datetime.datetime.now)