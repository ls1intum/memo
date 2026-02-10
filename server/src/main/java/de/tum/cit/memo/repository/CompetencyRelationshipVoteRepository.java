package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyRelationshipVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetencyRelationshipVoteRepository extends JpaRepository<CompetencyRelationshipVote, String> {

    boolean existsByRelationshipIdAndUserId(String relationshipId, String userId);
}
