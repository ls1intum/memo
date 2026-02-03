package de.tum.cit.memo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponse {

    private boolean success;
    private VoteCounts updatedVotes;
    private double newEntropy;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoteCounts {
        private int assumes;
        private int extendsRelation; // 'extends' is a Java reserved keyword
        private int matches;
        private int unrelated;
    }
}
