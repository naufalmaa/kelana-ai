from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Users(Base):
    __tablename__   = "users"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String, nullable=False)
    email           = Column(String, nullable=False, unique=True)
    password_hash   = Column(String, nullable=False)
    created_at      = Column(DateTime, default=datetime.datetime.now)

    trips = relationship("Trip", back_populates="user")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

# Alias for singular naming convention
User = Users