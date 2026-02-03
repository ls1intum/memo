package de.tum.cit.memo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "competency_relationships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetencyRelationship {

    @Id
    @Column(length = 30)
    private String id;

    @NotBlank
    @Column(name = "origin_id", nullable = false, length = 30)
    private String originId;

    @NotBlank
    @Column(name = "destination_id", nullable = false, length = 30)
    private String destinationId;

    // Aggregated vote counters
    @Column(name = "vote_assumes", nullable = false)
    @Builder.Default
    private Integer voteAssumes = 0;

    @Column(name = "vote_extends", nullable = false)
    @Builder.Default
    private Integer voteExtends = 0;

    @Column(name = "vote_matches", nullable = false)
    @Builder.Default
    private Integer voteMatches = 0;

    @Column(name = "vote_unrelated", nullable = false)
    @Builder.Default
    private Integer voteUnrelated = 0;

    // Precomputed entropy for consensus scheduling
    @Column(name = "entropy", nullable = false)
    @Builder.Default
    private Double entropy = 0.0;

    // Total votes (denormalized for convenience)
    @Column(name = "total_votes", nullable = false)
    @Builder.Default
    private Integer totalVotes = 0;

    // Relationships (ignored in JSON to avoid proxy serialization issues)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Competency origin;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Competency destination;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    /**
     * Recalculates entropy based on current vote distribution.
     * Entropy ranges from 0 (unanimous) to ~2.0 (max disagreement with 4 types).
     */
    public void recalculateEntropy() {
        int total = voteAssumes + voteExtends + voteMatches + voteUnrelated;
        this.totalVotes = total;

        if (total == 0) {
            this.entropy = 0.0;
            return;
        }

        double ent = 0.0;
        int[] counts = new int[4];
        counts[0] = voteAssumes;
        counts[1] = voteExtends;
        counts[2] = voteMatches;
        counts[3] = voteUnrelated;
        for (int count : counts) {
            if (count > 0) {
                double p = (double) count / total;
                ent -= p * (Math.log(p) / Math.log(2));
            }
        }
        this.entropy = ent;
    }
}
