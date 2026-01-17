-- Add match_type column to competency_resource_links table
ALTER TABLE "competency_resource_links"
ADD COLUMN "match_type" VARCHAR(20) NOT NULL DEFAULT 'UNRELATED';