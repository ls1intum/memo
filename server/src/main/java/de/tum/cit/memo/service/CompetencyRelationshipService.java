package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.ImportResult;
import de.tum.cit.memo.dto.RelationshipImportRow;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.enums.RelationshipType;
import de.tum.cit.memo.exception.InvalidOperationException;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyRelationshipRepository;
import de.tum.cit.memo.repository.CompetencyRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * CRUD for competency relationships (voting logic lives in SchedulingService).
 */
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CompetencyRelationshipService {

    private final CompetencyRelationshipRepository relationshipRepository;
    private final CompetencyRepository competencyRepository;

    @Transactional
    public CompetencyRelationship createRelationship(String originId, String destinationId) {
        validateDistinctIds(originId, destinationId);

        if (relationshipRepository.existsByOriginIdAndDestinationId(originId, destinationId)) {
            throw new InvalidOperationException("Relationship already exists");
        }

        return buildAndSave(originId, destinationId);
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

    @Transactional
    public ImportResult bulkImportRelationships(List<RelationshipImportRow> rows) {
        List<String> errors = new ArrayList<>();
        int skipped = 0;
        int imported = 0;

        for (int i = 1; i <= rows.size(); i++) {
            RelationshipImportRow row = rows.get(i - 1);
            String label = "Row " + i;

            String originId = resolveCompetencyId(
                row.getOriginId(), row.getOriginTitle(),
                label + ": originId or originTitle is required", label, errors);
            if (originId == null) continue;

            String destinationId = resolveCompetencyId(
                row.getDestinationId(), row.getDestinationTitle(),
                label + ": destinationId or destinationTitle is required", label, errors);
            if (destinationId == null) continue;

            if (originId.equals(destinationId)) {
                errors.add(label + ": origin and destination must be different");
                continue;
            }

            RelationshipType type = null;
            if (row.getRelationshipType() != null && !row.getRelationshipType().isBlank()) {
                type = parseRelationshipType(row.getRelationshipType());
                if (type == null) {
                    errors.add(label + ": unknown relationshipType '" + row.getRelationshipType() + "'");
                    continue;
                }
            }

            if (relationshipRepository.existsByOriginIdAndDestinationId(originId, destinationId)) {
                skipped++;
                continue;
            }

            CompetencyRelationship relationship = buildAndSave(originId, destinationId);

            if (type != null) {
                seedVote(relationship, type);
                relationshipRepository.save(relationship);
            }

            imported++;
        }

        return new ImportResult(imported, skipped, errors);
    }

    private String resolveCompetencyId(String id, String title, String missingMessage, String label, List<String> errors) {
        boolean idBlank = (id == null || id.isBlank());
        boolean titleBlank = (title == null || title.isBlank());

        if (idBlank && titleBlank) {
            errors.add(missingMessage);
            return null;
        }

        if (!idBlank) {
            Optional<Competency> found = competencyRepository.findById(id);
            if (found.isEmpty()) {
                errors.add(label + ": competency not found for id '" + id + "'");
                return null;
            }
            return id;
        }

        Optional<Competency> found = competencyRepository.findByTitle(title);
        if (found.isEmpty()) {
            errors.add(label + ": competency not found for title '" + title + "'");
            return null;
        }
        return found.get().getId();
    }

    private RelationshipType parseRelationshipType(String raw) {
        try {
            return RelationshipType.valueOf(raw.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private void seedVote(CompetencyRelationship rel, RelationshipType type) {
        switch (type) {
            case ASSUMES -> rel.setVoteAssumes(rel.getVoteAssumes() + 1);
            case EXTENDS -> rel.setVoteExtends(rel.getVoteExtends() + 1);
            case MATCHES -> rel.setVoteMatches(rel.getVoteMatches() + 1);
            case UNRELATED -> rel.setVoteUnrelated(rel.getVoteUnrelated() + 1);
        }
        rel.recalculateEntropy();
    }

    private CompetencyRelationship buildAndSave(String originId, String destinationId) {
        CompetencyRelationship relationship = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(originId)
                .destinationId(destinationId)
                .build();

        CompetencyRelationship saved = relationshipRepository.save(relationship);
        competencyRepository.incrementDegree(List.of(originId, destinationId));
        return saved;
    }

    private static void validateDistinctIds(String originId, String destinationId) {
        if (originId.equals(destinationId)) {
            throw new InvalidOperationException("Cannot create relationship to itself");
        }
    }
}
