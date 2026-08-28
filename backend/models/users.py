from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from database import Base
import datetime

class Users(Base):
    __tablename__   = "users"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String, nullable=False)
    email           = Column(String, nullable=False, unique=True)
    password_hash   = Column(String, nullable=False)
    created_at      = Column(DateTime, default=datetime.datetime.now)

# Alias for singular naming convention
User = Users