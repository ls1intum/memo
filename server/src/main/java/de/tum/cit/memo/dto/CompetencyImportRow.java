package de.tum.cit.memo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompetencyImportRow {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
}
