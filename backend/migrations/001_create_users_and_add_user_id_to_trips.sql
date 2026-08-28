-- Migration 001: Create users table and add users_id/user_id relationship to trips table
-- Relationship: One User -> Many Trips

-- 1. Create users table if it does not exist
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create index on email and id
CREATE INDEX IF NOT EXISTS ix_users_id ON users (id);
CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

-- 2. Insert a default seed user for existing trips
INSERT INTO users (id, name, email, password_hash, created_at)
VALUES (1, 'Default Traveler', 'traveler@kelana.ai', 'default_password_hash', NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to ensure future inserts get id >= 2
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));

-- 3. Add users_id foreign key column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS users_id INTEGER;

-- Also add user_id alias column for compatibility
ALTER TABLE trips ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- 4. Update existing trips to belong to the default user (id = 1)
UPDATE trips SET users_id = 1 WHERE users_id IS NULL;
UPDATE trips SET user_id = 1 WHERE user_id IS NULL;

-- 5. Enforce NOT NULL on users_id
ALTER TABLE trips ALTER COLUMN users_id SET NOT NULL;

-- 6. Add foreign key constraint from trips(users_id) to users(id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_trips_users'
    ) THEN
        ALTER TABLE trips 
        ADD CONSTRAINT fk_trips_users 
        FOREIGN KEY (users_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Add index on users_id in trips for fast querying
CREATE INDEX IF NOT EXISTS ix_trips_users_id ON trips (users_id);
