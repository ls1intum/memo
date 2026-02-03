package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyRelationshipVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetencyRelationshipVoteRepository extends JpaRepository<CompetencyRelationshipVote, String> {

    Optional<CompetencyRelationshipVote> findByRelationshipIdAndUserId(String relationshipId, String userId);

    boolean existsByRelationshipIdAndUserId(String relationshipId, String userId);

    List<CompetencyRelationshipVote> findByRelationshipId(String relationshipId);

    List<CompetencyRelationshipVote> findByUserId(String userId);
}
