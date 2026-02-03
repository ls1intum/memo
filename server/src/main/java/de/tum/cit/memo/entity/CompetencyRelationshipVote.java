package de.tum.cit.memo.entity;

import de.tum.cit.memo.enums.RelationshipType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
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
@Table(name = "competency_relationships_votes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetencyRelationshipVote {

    @Id
    @Column(length = 30)
    private String id;

    @NotBlank
    @Column(name = "relationship_id", nullable = false, length = 30)
    private String relationshipId;

    @NotBlank
    @Column(name = "user_id", nullable = false, length = 30)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type", nullable = false)
    @NotNull
    private RelationshipType relationshipType;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "relationship_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private CompetencyRelationship relationship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
