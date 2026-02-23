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
public class CreateCompetencyRelationshipRequest {

    @NotNull(message = "Relationship type is required")
    private RelationshipType relationshipType;

    @NotBlank(message = "Origin ID is required")
    private String originId;

    @NotBlank(message = "Destination ID is required")
    private String destinationId;

    @NotBlank(message = "User ID is required")
    private String userId;
}
