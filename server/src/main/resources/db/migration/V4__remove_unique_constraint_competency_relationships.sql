-- Remove unique constraint on competency_relationships to allow multiple entries
-- for the same origin/destination/type combination (intentional by design)

DROP INDEX IF EXISTS "uk_competency_relationships_origin_dest_type";
