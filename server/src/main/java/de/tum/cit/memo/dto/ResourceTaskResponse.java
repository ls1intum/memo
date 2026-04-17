package de.tum.cit.memo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceTaskResponse {

    private String mappingId;
    private CompetencyInfo competency;
    private ResourceInfo resource;
    private String pipeline;
    private ResourceVoteCounts currentVotes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompetencyInfo {
        private String id;
        private String title;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResourceInfo {
        private String id;
        private String title;
        private String url;
    }
}
