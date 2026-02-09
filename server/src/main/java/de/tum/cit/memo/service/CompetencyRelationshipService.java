package de.tum.cit.memo.service;

import de.tum.cit.memo.entity.Competency;
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
 * Service for basic CRUD operations on competency relationships.
 * For voting and scheduling, use {@link SchedulingService} instead.
 */
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CompetencyRelationshipService {

    private final CompetencyRelationshipRepository relationshipRepository;
    private final CompetencyRepository competencyRepository;

    /**
     * Create a new empty relationship (used for administrative purposes).
     * Also updates the degree counter for both competencies.
     * For normal user voting flow, use SchedulingService.
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

        // Update the denormalized degree counter for both competencies
        List<Competency> competencies = competencyRepository.findAllById(List.of(originId, destinationId));
        competencies.forEach(c -> c.setDegree(c.getDegree() + 1));
        competencyRepository.saveAll(competencies);

        return relationshipRepository.save(relationship);
    }

    /**
     * Find existing relationship or create a new one.
     * When creating a new relationship, also updates the degree counter for both
     * competencies.
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

                    // Update the denormalized degree counter for both competencies
                    List<Competency> competencies = competencyRepository.findAllById(List.of(originId, destinationId));
                    competencies.forEach(c -> c.setDegree(c.getDegree() + 1));
                    competencyRepository.saveAll(competencies);

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

        // Decrement the denormalized degree counter for both competencies
        List<Competency> competencies = competencyRepository
                .findAllById(List.of(relationship.getOriginId(), relationship.getDestinationId()));
        competencies.forEach(c -> c.setDegree(Math.max(0, c.getDegree() - 1)));
        competencyRepository.saveAll(competencies);

        relationshipRepository.deleteById(id);
    }
}
