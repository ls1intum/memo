package de.tum.cit.memo.service;

import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.exception.InvalidOperationException;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyRelationshipRepository;
import de.tum.cit.memo.repository.CompetencyRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * CRUD operations on competency relationships.
 * For voting and scheduling, see {@link SchedulingService}.
 */
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CompetencyRelationshipService {

    private final CompetencyRelationshipRepository relationshipRepository;
    private final CompetencyRepository competencyRepository;

    /**
     * Creates a new empty relationship (admin use).
     * For the normal user voting flow, use SchedulingService.
     */
    @Transactional
    public CompetencyRelationship createRelationship(String originId, String destinationId) {
        if (originId.equals(destinationId)) {
            throw new InvalidOperationException("Cannot create relationship to itself");
        }

        if (relationshipRepository.existsByOriginIdAndDestinationId(originId, destinationId)) {
            throw new InvalidOperationException("Relationship already exists");
        }

        CompetencyRelationship relationship = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(originId)
                .destinationId(destinationId)
                .build();

        competencyRepository.incrementDegree(List.of(originId, destinationId));
        return relationshipRepository.save(relationship);
    }

    /**
     * Finds an existing relationship or creates a new one.
     */
    @Transactional
    public CompetencyRelationship findOrCreateRelationship(String originId, String destinationId) {
        if (originId.equals(destinationId)) {
            throw new InvalidOperationException("Cannot create relationship to itself");
        }

        return relationshipRepository.findByOriginIdAndDestinationId(originId, destinationId)
                .orElseGet(() -> {
                    CompetencyRelationship relationship = CompetencyRelationship.builder()
                            .id(IdGenerator.generateCuid())
                            .originId(originId)
                            .destinationId(destinationId)
                            .build();

                    competencyRepository.incrementDegree(List.of(originId, destinationId));
                    return relationshipRepository.save(relationship);
                });
    }

    @Transactional(readOnly = true)
    public CompetencyRelationship getRelationshipById(String id) {
        return relationshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));
    }

    @Transactional(readOnly = true)
    public List<CompetencyRelationship> getAllRelationships() {
        return relationshipRepository.findAll();
    }

    @Transactional
    public void deleteRelationship(String id) {
        CompetencyRelationship relationship = relationshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found"));

        competencyRepository.decrementDegree(List.of(relationship.getOriginId(), relationship.getDestinationId()));
        relationshipRepository.deleteById(id);
    }
}
