-- Drop old competency_relationships table and related constraints
-- Platform is in development; existing votes can be discarded

-- First drop the foreign key constraints
ALTER TABLE IF EXISTS "competency_relationships" DROP CONSTRAINT IF EXISTS "competency_relationships_originId_fkey";
ALTER TABLE IF EXISTS "competency_relationships" DROP CONSTRAINT IF EXISTS "competency_relationships_destinationId_fkey";
ALTER TABLE IF EXISTS "competency_relationships" DROP CONSTRAINT IF EXISTS "competency_relationships_userId_fkey";

-- Drop the table
DROP TABLE IF EXISTS "competency_relationships";
