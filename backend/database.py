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

# FastAPI DB Session Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# create all tables & run safe schema updates
def init_db() -> None:
    """Create all SQLAlchemy tables for the configured database and run safe schema migrations"""
    # Import models so metadata is registered
    import models.users # noqa
    import models.trips # noqa
    import models.conversations # noqa

    Base.metadata.create_all(bind=engine)
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS trip_theme VARCHAR;"))
            conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS users_id INTEGER;"))
            conn.execute(text("ALTER TABLE trips ADD COLUMN IF NOT EXISTS user_id INTEGER;"))
            conn.commit()
    except Exception as e:
        print("[init_db] Non-fatal migration notice:", e)

    # Seed superadmin
    try:
        from services.auth_service import seed_superadmin
        db = SessionLocal()
        seed_superadmin(db)
        db.close()
    except Exception as e:
        print("[init_db] Superadmin seed notice:", e)