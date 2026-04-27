package de.tum.cit.memo.entity;

import de.tum.cit.memo.enums.ConfidenceTier;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "competencies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Competency {

    @Id
    @Column(length = 30)
    private String id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private int degree;

    @Builder.Default
    @Column(name = "confidence_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal confidenceScore = BigDecimal.ZERO;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "confidence_tier", nullable = false, length = 10)
    private ConfidenceTier confidenceTier = ConfidenceTier.LOW;

    @Column(name = "confidence_computed_at")
    private Instant confidenceComputedAt;
}
