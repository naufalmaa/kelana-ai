"""
KelanaAI - Database Migration Runner
Applies migrations to PostgreSQL database and verifies schema integrity.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
backend_dir = Path(__file__).resolve().parent.parent
load_dotenv(backend_dir / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL is not set in backend/.env")
    sys.exit(1)

def run_migration():
    print(f"Connecting to database: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
    engine = create_engine(DATABASE_URL)
    
    sql_file = Path(__file__).resolve().parent / "001_create_users_and_add_user_id_to_trips.sql"
    if not sql_file.exists():
        print(f"ERROR: Migration file not found at {sql_file}")
        sys.exit(1)
        
    print(f"Reading migration file: {sql_file.name}")
    with open(sql_file, "r", encoding="utf-8") as f:
        sql_content = f.read()

    print("Applying migration...")
    with engine.connect() as conn:
        conn.execute(text(sql_content))
        conn.commit()
        print("Migration SQL executed successfully.")

        # Verification step
        print("\n--- SCHEMA VERIFICATION ---")
        
        # Check users table
        users_count = conn.execute(text("SELECT COUNT(*) FROM users;")).scalar()
        print(f"Users table exists. Total users: {users_count}")
        
        # Check users columns
        user_cols = conn.execute(text(
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users';"
        )).fetchall()
        print("Columns in 'users':", [f"{c[0]} ({c[1]}, nullable={c[2]})" for c in user_cols])
        
        # Check trips columns
        trip_cols = conn.execute(text(
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'trips';"
        )).fetchall()
        print("Columns in 'trips':", [f"{c[0]} ({c[1]}, nullable={c[2]})" for c in trip_cols])
        
        # Check foreign key constraints on trips
        fks = conn.execute(text("""
            SELECT conname, pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE c.conrelid = 'trips'::regclass AND c.contype = 'f';
        """)).fetchall()
        print("Foreign keys on 'trips':", [f"{fk[0]}: {fk[1]}" for fk in fks])
        
        # Check trips sample
        trips_count = conn.execute(text("SELECT COUNT(*) FROM trips;")).scalar()
        print(f"Total trips in database: {trips_count}")
        print("---------------------------\n")

    print("Migration completed successfully!")

if __name__ == "__main__":
    run_migration()
