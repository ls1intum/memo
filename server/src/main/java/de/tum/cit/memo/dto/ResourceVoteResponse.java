package de.tum.cit.memo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceVoteResponse {

    private String mappingId;
    private boolean success;
    private ResourceVoteCounts updatedVotes;
    private double newEntropy;
}
