package de.tum.cit.memo.controller;

import de.tum.cit.memo.dto.ConfidenceRatingDTO;
import de.tum.cit.memo.service.ConfidenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/confidence")
@RequiredArgsConstructor
@Tag(name = "Confidence", description = "Confidence rating operations")
@SecurityRequirement(name = "bearer-jwt")
public class ConfidenceController {

    private final ConfidenceService confidenceService;

    @GetMapping
    @Operation(summary = "Get confidence ratings for all competencies")
    public ResponseEntity<List<ConfidenceRatingDTO>> getAll() {
        return ResponseEntity.ok(confidenceService.getAll());
    }

    @GetMapping("/{competencyId}")
    @Operation(summary = "Get confidence rating for a single competency (computed live)")
    public ResponseEntity<ConfidenceRatingDTO> getOne(@PathVariable String competencyId) {
        return ResponseEntity.ok(confidenceService.getForCompetency(competencyId));
    }

    @PostMapping("/recompute")
    @Operation(summary = "Trigger full confidence recomputation for all competencies")
    public ResponseEntity<Map<String, Object>> recomputeAll() {
        confidenceService.recomputeAll();
        return ResponseEntity.ok(Map.of("status", "ok", "message", "Recomputation complete"));
    }

    @PostMapping("/recompute/{competencyId}")
    @Operation(summary = "Trigger confidence recomputation for a single competency")
    public ResponseEntity<ConfidenceRatingDTO> recomputeOne(@PathVariable String competencyId) {
        return ResponseEntity.ok(confidenceService.recomputeForCompetency(competencyId));
    }
}
