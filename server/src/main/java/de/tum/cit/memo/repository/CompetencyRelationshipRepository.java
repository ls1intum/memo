package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetencyRelationshipRepository extends JpaRepository<CompetencyRelationship, String> {

    Optional<CompetencyRelationship> findByOriginIdAndDestinationId(String originId, String destinationId);

    boolean existsByOriginIdAndDestinationId(String originId, String destinationId);

    /**
     * Find high-entropy relationships that the user has not yet voted on.
     */
    @Query("""
            SELECT r FROM CompetencyRelationship r
            WHERE r.totalVotes BETWEEN :minVotes AND :maxVotes
              AND r.entropy > :minEntropy
              AND NOT EXISTS (
                  SELECT 1 FROM CompetencyRelationshipVote v
                  WHERE v.relationshipId = r.id AND v.userId = :userId
              )
            ORDER BY r.entropy DESC
            """)
    List<CompetencyRelationship> findHighEntropyRelationshipsExcludingUser(
            @Param("userId") String userId,
            @Param("minVotes") int minVotes,
            @Param("maxVotes") int maxVotes,
            @Param("minEntropy") double minEntropy);

    /**
     * Get competency degrees (number of relationships each competency appears in).
     * Returns pairs of [competencyId, degree].
     */
    @Query(value = """
            SELECT cid, SUM(cnt) as degree FROM (
                SELECT origin_id AS cid, COUNT(*) AS cnt FROM competency_relationships GROUP BY origin_id
                UNION ALL
                SELECT destination_id AS cid, COUNT(*) AS cnt FROM competency_relationships GROUP BY destination_id
            ) sub
            GROUP BY cid
            ORDER BY degree ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<Object[]> findLowDegreeCompetencyIds(@Param("limit") int limit);

    /**
     * Find all relationships where user has NOT voted, for filtering.
     */
    /**
     * Find all relationships involving any of the given competency IDs.
     * Used for batch processing in Coverage Pipeline to avoid N+1 queries.
     */
    @Query("SELECT r FROM CompetencyRelationship r WHERE r.originId IN :ids OR r.destinationId IN :ids")
    List<CompetencyRelationship> findAllByCompetencyIds(@Param("ids") List<String> ids);

    /**
     * Find a single relationship the user has NOT voted on.
     * Uses LIMIT 1 to avoid loading the entire table.
     */
    @Query("""
            SELECT r FROM CompetencyRelationship r
            WHERE NOT EXISTS (
                SELECT 1 FROM CompetencyRelationshipVote v
                WHERE v.relationshipId = r.id AND v.userId = :userId
            )
            """)
    Optional<CompetencyRelationship> findFirstUnvotedByUser(@Param("userId") String userId,
            org.springframework.data.domain.Pageable pageable);
}
