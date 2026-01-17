package de.tum.cit.memo.entity;

import de.tum.cit.memo.enums.ResourceMatchType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Entity
@Table(
    name = "competency_resource_links",
    indexes = {
        @Index(name = "idx_competency_id", columnList = "competency_id"),
        @Index(name = "idx_resource_id", columnList = "resource_id"),
        @Index(name = "idx_user_id", columnList = "user_id")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetencyResourceLink {

    @Id
    @Column(length = 30)
    private String id;

    @NotBlank
    @Column(name = "competency_id", nullable = false, length = 30)
    private String competencyId;

    @NotBlank
    @Column(name = "resource_id", nullable = false, length = 30)
    private String resourceId;

    @NotBlank
    @Column(name = "user_id", nullable = false, length = 30)
    private String userId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "match_type", nullable = false, length = 20)
    private ResourceMatchType matchType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competency_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Competency competency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private LearningResource resource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
