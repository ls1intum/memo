-- Make name and email nullable (Keycloak/Shibboleth users have no personal data stored)
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Extend id column to hold Keycloak UUID (36 chars)
ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(36);

-- Replace the email unique constraint with a deferrable one
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
DROP INDEX IF EXISTS users_email_key;
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email) DEFERRABLE INITIALLY DEFERRED;

-- Extend user_id FK columns in related tables to also hold 36-char Keycloak UUIDs
ALTER TABLE competency_relationships_votes ALTER COLUMN user_id TYPE VARCHAR(36);
