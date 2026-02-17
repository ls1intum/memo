package de.tum.cit.memo.dto;

import de.tum.cit.memo.enums.RelationshipType;
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
     * Relationship ID (used directly when direction is not swapped).
     * Optional if originId + destinationId are provided instead.
     */
    private String relationshipId;

    /**
     * Origin competency ID (used when direction is swapped).
     * Must be provided together with destinationId.
     */
    private String originId;

    /**
     * Destination competency ID (used when direction is swapped).
     * Must be provided together with originId.
     */
    private String destinationId;

    @NotNull(message = "Relationship type is required")
    private RelationshipType relationshipType;
}
