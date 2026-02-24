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

    @NotNull
    private String originId;

    @NotNull
    private String destinationId;

    @NotNull
    private RelationshipType relationshipType;
}
