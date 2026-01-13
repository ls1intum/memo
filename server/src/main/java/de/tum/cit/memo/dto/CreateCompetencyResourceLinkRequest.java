package de.tum.cit.memo.dto;

import jakarta.validation.constraints.NotBlank;
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
}
