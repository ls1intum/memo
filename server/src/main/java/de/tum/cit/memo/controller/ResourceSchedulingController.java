package de.tum.cit.memo.controller;

import de.tum.cit.memo.dto.ResourceTaskResponse;
import de.tum.cit.memo.dto.ResourceVoteRequest;
import de.tum.cit.memo.dto.ResourceVoteResponse;
import de.tum.cit.memo.service.ResourceSchedulingService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/scheduling/resource")
@RequiredArgsConstructor
@Tag(name = "Resource Scheduling", description = "Endpoints for competency↔resource mapping scheduling")
public class ResourceSchedulingController {

    private final ResourceSchedulingService resourceSchedulingService;

    @GetMapping("/next-task")
    @Operation(summary = "Get next resource task to vote on", description = "Returns a competency↔resource pair for the user to rate. Uses coverage (70%) and consensus (30%) pipelines. Returns 204 if no tasks remain.")
    public ResponseEntity<ResourceTaskResponse> getNextTask(
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) List<String> skippedIds) {
        return resourceSchedulingService.getNextTask(userId, skippedIds)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/vote")
    @Operation(summary = "Submit a vote on a competency↔resource mapping", description = "Records the user's match-quality vote. Accepts either a mappingId or competencyId+resourceId for new pairs.")
    public ResponseEntity<ResourceVoteResponse> submitVote(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody ResourceVoteRequest request) {
        ResourceVoteResponse response = resourceSchedulingService.submitVote(userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/vote/{mappingId}")
    @Operation(summary = "Undo a vote on a competency↔resource mapping", description = "Removes the current user's vote. Decrements vote counters and deletes the mapping row if no votes remain.")
    public ResponseEntity<Void> unvote(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String mappingId) {
        resourceSchedulingService.unvote(userId, mappingId);
        return ResponseEntity.noContent().build();
    }
}
