package de.tum.cit.memo.controller;

import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.service.CompetencyRelationshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for competency relationship CRUD.
 * For creating relationships and voting, use {@link SchedulingController}.
 */
@RestController
@RequestMapping("/api/competency-relationships")
@RequiredArgsConstructor
@Tag(name = "Competency Relationships", description = "Competency relationship management endpoints")
public class CompetencyRelationshipController {

    private final CompetencyRelationshipService relationshipService;

    @GetMapping("/{id}")
    @Operation(summary = "Get competency relationship by ID")
    public ResponseEntity<CompetencyRelationship> getRelationshipById(@PathVariable String id) {
        CompetencyRelationship relationship = relationshipService.getRelationshipById(id);
        return ResponseEntity.ok(relationship);
    }

    @GetMapping
    @Operation(summary = "Get all competency relationships")
    public ResponseEntity<List<CompetencyRelationship>> getAllRelationships() {
        List<CompetencyRelationship> relationships = relationshipService.getAllRelationships();
        return ResponseEntity.ok(relationships);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete competency relationship")
    public ResponseEntity<Void> deleteRelationship(@PathVariable String id) {
        relationshipService.deleteRelationship(id);
        return ResponseEntity.noContent().build();
    }
}
