package de.tum.cit.memo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelationshipTaskResponse {

    private String relationshipId;
    private CompetencyInfo origin;
    private CompetencyInfo destination;
    private String pipeline;
    private VoteCounts currentVotes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompetencyInfo {
        private String id;
        private String title;
        private String description;
    }
}
