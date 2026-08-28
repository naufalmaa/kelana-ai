from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# load .env
load_dotenv()

# connection string from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# engine = connection pool
engine = create_engine(DATABASE_URL)

# SessionLocal = factory for DB Sessions
SessionLocal = sessionmaker(bind=engine, autoflush=False)

# Base = all ORM models inherit from this
Base = declarative_base()

# create all tables
def init_db() -> None:
    """Create all SQLAlchemy tables for the configured database and run safe schema migration"""
    Base.metadata.create_all(bind=engine)
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS trip_theme VARCHAR;"))
            conn.commit()
    except Exception:
        pass