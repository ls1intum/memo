package de.tum.cit.memo.controller;

import de.tum.cit.memo.dto.CreateCompetencyRelationshipRequest;
import de.tum.cit.memo.dto.VoteRequest;
import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.service.CompetencyRelationshipService;
import de.tum.cit.memo.service.SchedulingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for competency relationship management.
 * The POST endpoint creates a relationship and records a vote.
 */
@RestController
@RequestMapping("/api/competency-relationships")
@RequiredArgsConstructor
@Tag(name = "Competency Relationships", description = "Competency relationship management endpoints")
public class CompetencyRelationshipController {

    private final CompetencyRelationshipService relationshipService;
    private final SchedulingService schedulingService;

    @PostMapping
    @Operation(summary = "Create a competency relationship and record a vote")
    public ResponseEntity<CompetencyRelationship> createRelationship(
            @Valid @RequestBody CreateCompetencyRelationshipRequest request) {
        // Create the relationship if it doesn't exist
        CompetencyRelationship relationship = relationshipService.findOrCreateRelationship(
                request.getOriginId(), request.getDestinationId());

        // Record the vote via scheduling service
        VoteRequest voteRequest = VoteRequest.builder()
                .relationshipId(relationship.getId())
                .relationshipType(request.getRelationshipType())
                .build();
        schedulingService.submitVote(request.getUserId(), voteRequest);

        // Refresh to get updated counters
        relationship = relationshipService.getRelationshipById(relationship.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(relationship);
    }

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
