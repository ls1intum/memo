package de.tum.cit.memo.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.tum.cit.memo.enums.ResourceMatchType;
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
public class ResourceVoteRequest {

    @Schema(description = "Existing mapping ID (alternative to competencyId+resourceId)")
    private String mappingId;

    @Schema(description = "Competency ID (required if mappingId is absent)")
    private String competencyId;

    @Schema(description = "Resource ID (required if mappingId is absent)")
    private String resourceId;

    @NotNull(message = "Match type is required")
    private ResourceMatchType matchType;

    @JsonIgnore
    @AssertTrue(message = "Either mappingId or both competencyId and resourceId must be provided")
    private boolean isIdentifiable() {
        boolean hasMappingId = mappingId != null && !mappingId.isBlank();
        boolean hasCompetencyAndResource = competencyId != null && !competencyId.isBlank()
                && resourceId != null && !resourceId.isBlank();
        return hasMappingId || hasCompetencyAndResource;
    }
}
