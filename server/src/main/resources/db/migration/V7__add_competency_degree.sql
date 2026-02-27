-- Add degree column
ALTER TABLE competencies ADD COLUMN degree INTEGER DEFAULT 0 NOT NULL;

-- Create index for fast retrieval of low-degree nodes
CREATE INDEX idx_competencies_degree ON competencies(degree);

-- Backfill existing degrees
WITH calculated_degrees AS (
    SELECT cid, SUM(cnt) as total_degree FROM (
        SELECT origin_id AS cid, COUNT(*) AS cnt FROM competency_relationships GROUP BY origin_id
        UNION ALL
        SELECT destination_id AS cid, COUNT(*) AS cnt FROM competency_relationships GROUP BY destination_id
    ) sub
    GROUP BY cid
)
UPDATE competencies c
SET degree = cd.total_degree
FROM calculated_degrees cd
WHERE c.id = cd.cid;
