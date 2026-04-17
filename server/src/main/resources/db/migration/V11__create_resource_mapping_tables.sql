-- Scheduling tables for competency↔resource mapping (mirrors the competency-relationship pipeline)

-- competency_resource_mappings: One aggregate row per unique (competency, resource) pair
CREATE TABLE "competency_resource_mappings" (
    "id" VARCHAR(30) NOT NULL,
    "competency_id" VARCHAR(30) NOT NULL,
    "resource_id" VARCHAR(30) NOT NULL,

    -- Aggregated vote counters (denormalized for fast reads)
    "vote_unrelated"     INT NOT NULL DEFAULT 0,
    "vote_weak"          INT NOT NULL DEFAULT 0,
    "vote_good_fit"      INT NOT NULL DEFAULT 0,
    "vote_perfect_match" INT NOT NULL DEFAULT 0,

    -- Precomputed entropy for consensus priority (0.0 = unanimous, ~2.0 = max disagreement)
    "entropy" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    -- Total votes = sum of all four counters
    "total_votes" INT NOT NULL DEFAULT 0,

    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_resource_mappings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "uk_resource_mapping_pair" UNIQUE ("competency_id", "resource_id")
);

-- competency_resource_mapping_votes: Raw vote log (one vote per user per mapping)
CREATE TABLE "competency_resource_mapping_votes" (
    "id" VARCHAR(30) NOT NULL,
    "mapping_id" VARCHAR(30) NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "match_type" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_resource_mapping_votes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "uk_resource_mapping_user" UNIQUE ("mapping_id", "user_id")
);

-- Indexes mirroring V6 for efficient scheduling queries
CREATE INDEX "idx_rmap_entropy"     ON "competency_resource_mappings"("entropy" DESC) WHERE "total_votes" > 0;
CREATE INDEX "idx_rmap_total_votes" ON "competency_resource_mappings"("total_votes");
CREATE INDEX "idx_rmap_competency"  ON "competency_resource_mappings"("competency_id");
CREATE INDEX "idx_rmap_resource"    ON "competency_resource_mappings"("resource_id");

CREATE INDEX "idx_rmvote_mapping" ON "competency_resource_mapping_votes"("mapping_id");
CREATE INDEX "idx_rmvote_user"    ON "competency_resource_mapping_votes"("user_id");

-- Foreign keys
ALTER TABLE "competency_resource_mappings"
    ADD CONSTRAINT "fk_rmap_competency"
    FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "competency_resource_mappings"
    ADD CONSTRAINT "fk_rmap_resource"
    FOREIGN KEY ("resource_id") REFERENCES "learning_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "competency_resource_mapping_votes"
    ADD CONSTRAINT "fk_rmvote_mapping"
    FOREIGN KEY ("mapping_id") REFERENCES "competency_resource_mappings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "competency_resource_mapping_votes"
    ADD CONSTRAINT "fk_rmvote_user"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Separate degree columns (independent of the competency-relationship degree)
ALTER TABLE "competencies"       ADD COLUMN "resource_link_degree" INT NOT NULL DEFAULT 0;
ALTER TABLE "learning_resources" ADD COLUMN "resource_link_degree" INT NOT NULL DEFAULT 0;

CREATE INDEX "idx_competencies_resource_link_degree"       ON "competencies"("resource_link_degree");
CREATE INDEX "idx_learning_resources_resource_link_degree" ON "learning_resources"("resource_link_degree");

DROP TABLE "competency_resource_links";
