package de.tum.cit.memo.controller;

import de.tum.cit.memo.dto.ContributorStatsResponse;
import de.tum.cit.memo.service.ContributorStatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Contributor Stats", description = "Endpoints for contributor statistics and gamification")
public class ContributorStatsController {

    private final ContributorStatsService contributorStatsService;

    @GetMapping("/{userId}/stats")
    @Operation(summary = "Get contributor statistics", description = "Returns contribution stats including total votes, streaks, daily counts for heatmap, "
            + "and earned badge IDs.")
    public ResponseEntity<ContributorStatsResponse> getContributorStats(@PathVariable String userId) {
        ContributorStatsResponse stats = contributorStatsService.getStats(userId);
        return ResponseEntity.ok(stats);
    }
}
