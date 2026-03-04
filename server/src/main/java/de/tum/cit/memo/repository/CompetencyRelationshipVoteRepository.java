package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyRelationshipVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface CompetencyRelationshipVoteRepository extends JpaRepository<CompetencyRelationshipVote, String> {

    boolean existsByRelationshipIdAndUserId(String relationshipId, String userId);

    @Query(value = """
            SELECT CAST(v.created_at AS DATE) AS vote_date,
                   COUNT(*) AS vote_count
            FROM competency_relationships_votes v
            WHERE v.user_id = :userId
              AND v.created_at >= :since
            GROUP BY CAST(v.created_at AS DATE)
            UNION ALL
            SELECT NULL AS vote_date,
                   COUNT(*) FILTER (WHERE v.created_at < :since) AS vote_count
            FROM competency_relationships_votes v
            WHERE v.user_id = :userId
            ORDER BY vote_date
            """, nativeQuery = true)
    List<DailyVoteCount> findDailyVoteCountsWithPreWindowTotal(@Param("userId") String userId,
            @Param("since") Instant since);
}
