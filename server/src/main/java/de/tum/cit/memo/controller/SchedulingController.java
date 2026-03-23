package de.tum.cit.memo.controller;

import de.tum.cit.memo.dto.RelationshipTaskResponse;
import de.tum.cit.memo.dto.VoteRequest;
import de.tum.cit.memo.dto.VoteResponse;
import de.tum.cit.memo.service.SchedulingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scheduling")
@RequiredArgsConstructor
@Tag(name = "Scheduling", description = "Endpoints for competency mapping scheduling")
public class SchedulingController {

    private final SchedulingService schedulingService;

    @GetMapping("/next-relationship")
    @Operation(summary = "Get next relationship to vote on", description = "Returns a competency pair for the user to map. Uses coverage (70%) and consensus (30%) pipelines. Returns 204 if no tasks remain.")
    public ResponseEntity<RelationshipTaskResponse> getNextRelationship(
            @RequestHeader("X-User-Id") String userId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) java.util.List<String> skippedIds) {
        return schedulingService.getNextTask(userId, skippedIds)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/vote")
    @Operation(summary = "Submit a vote on a relationship", description = "Records the user's vote on a competency relationship. Accepts either a relationshipId or originId+destinationId pair (for swapped direction). MATCHES and UNRELATED votes are bidirectional.")
    public ResponseEntity<VoteResponse> submitVote(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody VoteRequest request) {
        VoteResponse response = schedulingService.submitVote(userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/vote/{relationshipId}")
    @Operation(summary = "Undo a vote on a relationship", description = "Removes the current user's vote from a relationship. Decrements vote counters and deletes the relationship if no votes remain.")
    public ResponseEntity<Void> unvote(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String relationshipId) {
        schedulingService.unvote(userId, relationshipId);
        return ResponseEntity.noContent().build();
    }
}
