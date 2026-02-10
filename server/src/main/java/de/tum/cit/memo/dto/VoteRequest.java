package de.tum.cit.memo.dto;

import de.tum.cit.memo.enums.RelationshipType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest {

    @NotBlank(message = "Relationship ID is required")
    private String relationshipId;

    @NotNull(message = "Relationship type is required")
    private RelationshipType relationshipType;
}
