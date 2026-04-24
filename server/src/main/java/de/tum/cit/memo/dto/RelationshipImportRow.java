package de.tum.cit.memo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RelationshipImportRow {

    private String originId;
    private String originTitle;
    private String destinationId;
    private String destinationTitle;

    /** One of: ASSUMES / EXTENDS / MATCHES / UNRELATED */
    private String relationshipType;
}
