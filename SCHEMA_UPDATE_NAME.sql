-- Update User Table: Make Name UNIQUE and NOT NULL
-- Run this if you already created tables with the old schema

-- Step 1: If you have existing data without names, you need to update them first
-- This is only needed if you have test data already
UPDATE users SET name = 'User_' || SUBSTRING(phone FROM 8) WHERE name IS NULL OR name = '';

-- Step 2: Make name NOT NULL
ALTER TABLE users ALTER COLUMN name SET NOT NULL;

-- Step 3: Add UNIQUE constraint on name
ALTER TABLE users ADD CONSTRAINT users_name_unique UNIQUE (name);

-- Step 4: Add index for name lookups (if not already exists)
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- Verify the changes
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'name';

-- Show unique constraints
SELECT
  con.conname as constraint_name,
  pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'users' AND con.contype = 'u';
