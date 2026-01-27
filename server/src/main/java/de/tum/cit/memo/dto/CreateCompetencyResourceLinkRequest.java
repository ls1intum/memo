package de.tum.cit.memo.dto;

import de.tum.cit.memo.enums.ResourceMatchType;
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
public class CreateCompetencyResourceLinkRequest {

    @NotBlank(message = "Competency ID is required")
    private String competencyId;

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotNull(message = "Match type is required")
    private ResourceMatchType matchType;
}
