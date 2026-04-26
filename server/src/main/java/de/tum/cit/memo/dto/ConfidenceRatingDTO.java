package de.tum.cit.memo.dto;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConfidenceRatingDTO {

    private String competencyId;
    private String competencyTitle;
    private BigDecimal confidenceScore;
    private String confidenceTier;
    private long totalVotes;
    private double voteSignal;
    private double consensusSignal;
    private double resourceSignal;
    private double metadataSignal;
    private Instant computedAt;
}
