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
         * High-entropy relationships the user hasn't voted on yet (for consensus
         * pipeline).
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
                        @Param("minEntropy") double minEntropy,
                        org.springframework.data.domain.Pageable pageable);

        /**
         * Relationships where both origin AND destination are in the given pool of IDs.
         */
        @Query("SELECT r FROM CompetencyRelationship r WHERE r.originId IN :ids AND r.destinationId IN :ids")
        List<CompetencyRelationship> findIntraPoolRelationships(@Param("ids") List<String> ids);

        /**
         * Relationships the user hasn't voted on (use with PageRequest.of(0, 1) for a
         * single result).
         */
        @Query("""
                        SELECT r FROM CompetencyRelationship r
                        WHERE NOT EXISTS (
                            SELECT 1 FROM CompetencyRelationshipVote v
                            WHERE v.relationshipId = r.id AND v.userId = :userId
                        )
                        """)
        List<CompetencyRelationship> findUnvotedByUser(@Param("userId") String userId,
                        org.springframework.data.domain.Pageable pageable);
}
