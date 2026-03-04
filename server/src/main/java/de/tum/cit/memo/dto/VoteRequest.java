package de.tum.cit.memo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
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

    /**
     * Origin competency ID.
     */
    @NotBlank(message = "originId is required")
    @Schema(description = "Origin competency ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String originId;

    /**
     * Destination competency ID.
     */
    @NotBlank(message = "destinationId is required")
    @Schema(description = "Destination competency ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String destinationId;

    @NotNull(message = "Relationship type is required")
    private RelationshipType relationshipType;
}
