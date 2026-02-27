-- Make name and email nullable (Keycloak/Shibboleth users have no personal data stored)
ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Extend id column to hold Keycloak UUID (36 chars)
ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(36);

-- Make the unique constraint on email deferrable to allow null values
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email) DEFERRABLE INITIALLY DEFERRED;
