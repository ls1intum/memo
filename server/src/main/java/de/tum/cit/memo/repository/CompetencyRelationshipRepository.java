package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.enums.RelationshipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompetencyRelationshipRepository extends JpaRepository<CompetencyRelationship, String> {

    Optional<CompetencyRelationship> findByOriginIdAndDestinationIdAndRelationshipType(
        String originId,
        String destinationId,
        RelationshipType relationshipType
    );

    boolean existsByOriginIdAndDestinationIdAndRelationshipType(
        String originId,
        String destinationId,
        RelationshipType relationshipType
    );
}
