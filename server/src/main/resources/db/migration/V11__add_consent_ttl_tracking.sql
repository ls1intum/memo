-- Add consent acceptance tracking to users table
-- consent_accepted: boolean flag indicating if the user has accepted the consent agreement
-- consent_accepted_at: timestamp when the user accepted the consent agreement (nullable)

ALTER TABLE "users"
    ADD COLUMN "consent_accepted" BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN "consent_accepted_at" TIMESTAMP;

-- Backfill: pre-existing users predate the consent flow, so mark them as accepted
-- to prevent the cleanup scheduler from deleting them on the next run.
UPDATE "users"
SET "consent_accepted" = TRUE,
    "consent_accepted_at" = "created_at"
WHERE "consent_accepted" = FALSE;
