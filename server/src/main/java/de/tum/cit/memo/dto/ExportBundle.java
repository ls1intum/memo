package de.tum.cit.memo.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.entity.CompetencyRelationshipVote;
import de.tum.cit.memo.entity.CompetencyResourceLink;
import de.tum.cit.memo.entity.LearningResource;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ExportBundle(
    List<Competency> competencies,
    List<CompetencyRelationship> relationships,
    List<LearningResource> resources,
    List<CompetencyResourceLink> links,
    List<CompetencyRelationshipVote> votes
) { }
