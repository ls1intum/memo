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
@Table(name = "competency_resource_mappings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetencyResourceMapping {

    @Id
    @Column(length = 30)
    private String id;

    @NotBlank
    @Column(name = "competency_id", nullable = false, length = 30)
    private String competencyId;

    @NotBlank
    @Column(name = "resource_id", nullable = false, length = 30)
    private String resourceId;

    // Aggregated vote counters (4-way ordinal scale matching ResourceMatchType)
    @Column(name = "vote_unrelated", nullable = false)
    private int voteUnrelated;

    @Column(name = "vote_weak", nullable = false)
    private int voteWeak;

    @Column(name = "vote_good_fit", nullable = false)
    private int voteGoodFit;

    @Column(name = "vote_perfect_match", nullable = false)
    private int votePerfectMatch;

    @Column(name = "entropy", nullable = false)
    private double entropy;

    @Column(name = "total_votes", nullable = false)
    private int totalVotes;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competency_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Competency competency;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private LearningResource resource;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    /**
     * Recomputes Shannon entropy from the current vote counts.
     * Entropy ranges from 0 (unanimous) to ~2.0 (max disagreement with 4 categories).
     */
    public void recalculateEntropy() {
        int total = voteUnrelated + voteWeak + voteGoodFit + votePerfectMatch;
        this.totalVotes = total;

        if (total == 0) {
            this.entropy = 0.0;
            return;
        }

        double ent = 0.0;
        int[] counts = {voteUnrelated, voteWeak, voteGoodFit, votePerfectMatch};
        for (int count : counts) {
            if (count > 0) {
                double p = (double) count / total;
                ent -= p * (Math.log(p) / Math.log(2));
            }
        }
        this.entropy = ent;
    }
}
