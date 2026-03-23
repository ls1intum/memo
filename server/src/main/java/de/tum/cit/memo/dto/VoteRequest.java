package de.tum.cit.memo.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.tum.cit.memo.enums.RelationshipType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
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

    @Schema(description = "Existing relationship ID (alternative to originId+destinationId)")
    private String relationshipId;

    @Schema(description = "Origin competency ID (required if relationshipId is absent)")
    private String originId;

    @Schema(description = "Destination competency ID (required if relationshipId is absent)")
    private String destinationId;

    @NotNull(message = "Relationship type is required")
    private RelationshipType relationshipType;

    @JsonIgnore
    @AssertTrue(message = "Either relationshipId or both originId and destinationId must be provided")
    private boolean isIdentifiable() {
        boolean hasRelationshipId = relationshipId != null && !relationshipId.isBlank();
        boolean hasOriginAndDestination = originId != null && !originId.isBlank()
                && destinationId != null && !destinationId.isBlank();
        return hasRelationshipId || hasOriginAndDestination;
    }
}
