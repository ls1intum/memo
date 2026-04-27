ALTER TABLE competencies
    ADD COLUMN confidence_score       NUMERIC(5,2) NOT NULL DEFAULT 0,
    ADD COLUMN confidence_tier        VARCHAR(10)  NOT NULL DEFAULT 'LOW',
    ADD COLUMN confidence_computed_at TIMESTAMP;

CREATE INDEX idx_competencies_confidence_score ON competencies(confidence_score DESC);
CREATE INDEX idx_competencies_confidence_tier  ON competencies(confidence_tier);
