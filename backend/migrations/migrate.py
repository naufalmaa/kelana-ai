"""
KelanaAI - Database Migration Runner
Applies migrations to PostgreSQL database and verifies schema integrity.

Usage:
    python migrations/migrate.py                               # Run all migrations
    python migrations/migrate.py 002_create_conversations_and_messages.sql  # Run specific migration
    python migrations/migrate.py 002                           # Run matching migration
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

def get_migration_files(target_name: str | None = None) -> list[Path]:
    migrations_dir = Path(__file__).resolve().parent
    sql_files = sorted(migrations_dir.glob("*.sql"))
    
    if not target_name or target_name.lower() in ["all", "*"]:
        return sql_files
    
    # Match by exact name or prefix (e.g. '002' or '002_create_conversations_and_messages.sql')
    matched = [
        f for f in sql_files 
        if f.name == target_name or f.stem == target_name or f.name.startswith(target_name)
    ]
    
    if not matched:
        print(f"ERROR: No migration file matching '{target_name}' found in {migrations_dir}")
        print("Available files:", [f.name for f in sql_files])
        sys.exit(1)
        
    return matched

def verify_schema(conn):
    print("\n--- SCHEMA VERIFICATION ---")
    # List all public tables
    tables = conn.execute(text(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    )).fetchall()
    table_names = [t[0] for t in tables]
    print(f"Tables in database: {table_names}")

    # Inspect each table
    for table in ["users", "trips", "conversations", "messages"]:
        if table in table_names:
            cols = conn.execute(text(
                "SELECT column_name, data_type, is_nullable FROM information_schema.columns "
                f"WHERE table_name = '{table}' ORDER BY ordinal_position;"
            )).fetchall()
            print(f"\nColumns in '{table}':")
            for col in cols:
                print(f"  - {col[0]}: {col[1]} (nullable={col[2]})")
            
            # Constraints & foreign keys
            fks = conn.execute(text(f"""
                SELECT conname, pg_get_constraintdef(c.oid)
                FROM pg_constraint c
                JOIN pg_namespace n ON n.oid = c.connamespace
                WHERE c.conrelid = '{table}'::regclass;
            """)).fetchall()
            if fks:
                print(f"  Constraints on '{table}':")
                for fk in fks:
                    print(f"    * {fk[0]}: {fk[1]}")
    print("\n---------------------------\n")

def run_migration(target_name: str | None = None):
    db_display = DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL
    print(f"Connecting to database: {db_display}")
    engine = create_engine(DATABASE_URL)
    
    files_to_run = get_migration_files(target_name)
    print(f"Found {len(files_to_run)} migration file(s) to run:")
    for f in files_to_run:
        print(f"  -> {f.name}")
    
    with engine.connect() as conn:
        for sql_file in files_to_run:
            print(f"\n[Executing] {sql_file.name}...")
            with open(sql_file, "r", encoding="utf-8") as f:
                sql_content = f.read()
            
            # Execute migration SQL
            conn.execute(text(sql_content))
            conn.commit()
            print(f"[Success] {sql_file.name} applied successfully.")
        
        # Verify schema after migration
        verify_schema(conn)

    print("All requested migrations completed successfully!")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    run_migration(target)
