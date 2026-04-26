package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyResourceMappingVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompetencyResourceMappingVoteRepository extends JpaRepository<CompetencyResourceMappingVote, String> {

    boolean existsByMappingIdAndUserId(String mappingId, String userId);

    Optional<CompetencyResourceMappingVote> findByMappingIdAndUserId(String mappingId, String userId);
}
