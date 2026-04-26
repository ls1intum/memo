package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyResourceMapping;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetencyResourceMappingRepository extends JpaRepository<CompetencyResourceMapping, String> {

    Optional<CompetencyResourceMapping> findByCompetencyIdAndResourceId(String competencyId, String resourceId);

    /** All mappings within the bipartite pool (competencyId ∈ competencyIds AND resourceId ∈ resourceIds). */
    @Query("SELECT m FROM CompetencyResourceMapping m WHERE m.competencyId IN :competencyIds AND m.resourceId IN :resourceIds")
    List<CompetencyResourceMapping> findBipartitePoolMappings(
            @Param("competencyIds") List<String> competencyIds,
            @Param("resourceIds") List<String> resourceIds);

    /** High-entropy mappings this user hasn't voted on yet (consensus pipeline). */
    @Query("""
            SELECT m FROM CompetencyResourceMapping m
            WHERE m.totalVotes BETWEEN :minVotes AND :maxVotes
              AND m.entropy > :minEntropy
              AND NOT EXISTS (
                  SELECT 1 FROM CompetencyResourceMappingVote v
                  WHERE v.mappingId = m.id AND v.userId = :userId
              )
              AND (:skippedIds IS NULL OR m.id NOT IN :skippedIds)
            ORDER BY m.entropy DESC
            """)
    List<CompetencyResourceMapping> findHighEntropyMappingsExcludingUser(
            @Param("userId") String userId,
            @Param("minVotes") int minVotes,
            @Param("maxVotes") int maxVotes,
            @Param("minEntropy") double minEntropy,
            @Param("skippedIds") List<String> skippedIds,
            Pageable pageable);

    /** Mappings the user hasn't voted on yet (coverage fallback). */
    @Query("""
            SELECT m FROM CompetencyResourceMapping m
            WHERE NOT EXISTS (
                SELECT 1 FROM CompetencyResourceMappingVote v
                WHERE v.mappingId = m.id AND v.userId = :userId
            )
            AND (:skippedIds IS NULL OR m.id NOT IN :skippedIds)
            """)
    List<CompetencyResourceMapping> findUnvotedByUserAndNotSkipped(
            @Param("userId") String userId,
            @Param("skippedIds") List<String> skippedIds,
            Pageable pageable);
}
