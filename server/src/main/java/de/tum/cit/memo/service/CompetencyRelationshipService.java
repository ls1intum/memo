package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.CreateCompetencyRelationshipRequest;
import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.exception.InvalidOperationException;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyRelationshipRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CompetencyRelationshipService {

    private final CompetencyRelationshipRepository relationshipRepository;

    @Transactional
    public CompetencyRelationship createRelationship(CreateCompetencyRelationshipRequest request) {
        if (request.getOriginId().equals(request.getDestinationId())) {
            throw new InvalidOperationException("Cannot create relationship to itself");
        }

        // Check if relationship already exists
        if (relationshipRepository.existsByOriginIdAndDestinationIdAndRelationshipType(
                request.getOriginId(),
                request.getDestinationId(),
                request.getRelationshipType())) {
            throw new InvalidOperationException(
                "Relationship already exists between these competencies with this type");
        }

        CompetencyRelationship relationship = CompetencyRelationship.builder()
            .id(IdGenerator.generateCuid())
            .relationshipType(request.getRelationshipType())
            .originId(request.getOriginId())
            .destinationId(request.getDestinationId())
            .userId(request.getUserId())
            .build();

        return relationshipRepository.save(relationship);
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
        if (!relationshipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Relationship not found");
        }
        relationshipRepository.deleteById(id);
    }
}
