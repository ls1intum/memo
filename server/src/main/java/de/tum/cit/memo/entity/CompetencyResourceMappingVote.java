package de.tum.cit.memo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.tum.cit.memo.enums.ResourceMatchType;
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
@Table(name = "competency_resource_mapping_votes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetencyResourceMappingVote {

    @Id
    @Column(length = 30)
    private String id;

    @NotBlank
    @Column(name = "mapping_id", nullable = false, length = 30)
    private String mappingId;

    @NotBlank
    @Column(name = "user_id", nullable = false, length = 30)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "match_type", nullable = false)
    @NotNull
    private ResourceMatchType matchType;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mapping_id", insertable = false, updatable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private CompetencyResourceMapping mapping;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
