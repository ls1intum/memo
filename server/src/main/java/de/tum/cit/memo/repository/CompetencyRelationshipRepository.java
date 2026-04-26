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

  /** High-entropy relationships this user hasn't voted on yet. */
  @Query("""
      SELECT r FROM CompetencyRelationship r
      WHERE r.totalVotes BETWEEN :minVotes AND :maxVotes
        AND r.entropy > :minEntropy
        AND NOT EXISTS (
            SELECT 1 FROM CompetencyRelationshipVote v
            WHERE v.relationshipId = r.id AND v.userId = :userId
        )
        AND (:skippedIds IS NULL OR r.id NOT IN :skippedIds)
      ORDER BY r.entropy DESC
      """)
  List<CompetencyRelationship> findHighEntropyRelationshipsExcludingUser(
      @Param("userId") String userId,
      @Param("minVotes") int minVotes,
      @Param("maxVotes") int maxVotes,
      @Param("minEntropy") double minEntropy,
      @Param("skippedIds") List<String> skippedIds,
      org.springframework.data.domain.Pageable pageable);

  /** All relationships where both endpoints are within the given ID pool. */
  @Query("SELECT r FROM CompetencyRelationship r WHERE r.originId IN :ids AND r.destinationId IN :ids")
  List<CompetencyRelationship> findIntraPoolRelationships(@Param("ids") List<String> ids);

  /** Relationships the user hasn't voted on yet. */
  @Query("""
      SELECT r FROM CompetencyRelationship r
      WHERE NOT EXISTS (
          SELECT 1 FROM CompetencyRelationshipVote v
          WHERE v.relationshipId = r.id AND v.userId = :userId
      )
      AND (:skippedIds IS NULL OR r.id NOT IN :skippedIds)
      """)
  List<CompetencyRelationship> findUnvotedByUserAndNotSkipped(@Param("userId") String userId,
      @Param("skippedIds") List<String> skippedIds,
      org.springframework.data.domain.Pageable pageable);

  /** Total votes across all relationships involving this competency. */
  @Query(value = "SELECT COALESCE(SUM(total_votes), 0) FROM competency_relationships WHERE origin_id = :id OR destination_id = :id", nativeQuery = true)
  long sumTotalVotesByCompetencyId(@Param("id") String competencyId);

  /** Dominant vote fractions for relationships with at least 1 vote. */
  @Query(value = """
      SELECT GREATEST(vote_assumes, vote_extends, vote_matches, vote_unrelated) * 1.0 / total_votes
      FROM competency_relationships
      WHERE (origin_id = :id OR destination_id = :id) AND total_votes > 0
      """, nativeQuery = true)
  List<Double> findDominantVoteFractionsByCompetencyId(@Param("id") String competencyId);
}
