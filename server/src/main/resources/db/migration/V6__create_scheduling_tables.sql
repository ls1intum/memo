-- Create scheduling tables for competency mapping

-- competency_relationships: One row per unique (origin, destination) pair
-- Stores aggregated vote counters and precomputed entropy for scheduling
CREATE TABLE "competency_relationships" (
    "id" VARCHAR(30) NOT NULL,
    "origin_id" VARCHAR(30) NOT NULL,
    "destination_id" VARCHAR(30) NOT NULL,
    
    -- Aggregated vote counters (denormalized for fast reads)
    "vote_assumes" INT NOT NULL DEFAULT 0,
    "vote_extends" INT NOT NULL DEFAULT 0,
    "vote_matches" INT NOT NULL DEFAULT 0,
    "vote_unrelated" INT NOT NULL DEFAULT 0,
    
    -- Precomputed entropy for consensus priority (0.0 = unanimous, ~2.0 = max disagreement)
    "entropy" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    
    -- Total votes = vote_assumes + vote_extends + vote_matches + vote_unrelated
    "total_votes" INT NOT NULL DEFAULT 0,
    
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_relationships_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "uk_relationship_pair" UNIQUE ("origin_id", "destination_id"),
    CONSTRAINT "chk_origin_ne_dest" CHECK ("origin_id" <> "destination_id")
);

-- competency_relationships_votes: Raw vote log (one vote per user per relationship)
CREATE TABLE "competency_relationships_votes" (
    "id" VARCHAR(30) NOT NULL,
    "relationship_id" VARCHAR(30) NOT NULL,
    "user_id" VARCHAR(30) NOT NULL,
    "relationship_type" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_relationships_votes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "uk_relationship_user" UNIQUE ("relationship_id", "user_id")
);

-- Indexes for efficient scheduling queries
CREATE INDEX "idx_rel_entropy" ON "competency_relationships"("entropy" DESC) WHERE "total_votes" > 0;
CREATE INDEX "idx_rel_total_votes" ON "competency_relationships"("total_votes");
CREATE INDEX "idx_rel_origin" ON "competency_relationships"("origin_id");
CREATE INDEX "idx_rel_dest" ON "competency_relationships"("destination_id");

CREATE INDEX "idx_votes_rel" ON "competency_relationships_votes"("relationship_id");
CREATE INDEX "idx_votes_user" ON "competency_relationships_votes"("user_id");

-- Foreign keys
ALTER TABLE "competency_relationships" ADD CONSTRAINT "fk_rel_origin" 
    FOREIGN KEY ("origin_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "competency_relationships" ADD CONSTRAINT "fk_rel_dest" 
    FOREIGN KEY ("destination_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "competency_relationships_votes" ADD CONSTRAINT "fk_vote_relationship" 
    FOREIGN KEY ("relationship_id") REFERENCES "competency_relationships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "competency_relationships_votes" ADD CONSTRAINT "fk_vote_user" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
