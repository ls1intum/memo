package de.tum.cit.memo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.tum.cit.memo.dto.ExportBundle;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.entity.CompetencyRelationshipVote;
import de.tum.cit.memo.entity.CompetencyResourceLink;
import de.tum.cit.memo.entity.LearningResource;
import de.tum.cit.memo.repository.CompetencyRelationshipRepository;
import de.tum.cit.memo.repository.CompetencyRelationshipVoteRepository;
import de.tum.cit.memo.repository.CompetencyRepository;
import de.tum.cit.memo.repository.CompetencyResourceLinkRepository;
import de.tum.cit.memo.repository.LearningResourceRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final CompetencyRepository competencyRepository;
    private final CompetencyRelationshipRepository competencyRelationshipRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final CompetencyResourceLinkRepository competencyResourceLinkRepository;
    private final CompetencyRelationshipVoteRepository competencyRelationshipVoteRepository;
    private final ObjectMapper objectMapper;

    public byte[] export(Set<String> include, String format) throws Exception {
    List<Competency> competencies;
    if (include.contains("competencies")) {
        competencies = competencyRepository.findAll();
    } else {
        competencies = null;
    }
    List<CompetencyRelationship> relationships;
    if (include.contains("relationships")) {
        relationships = competencyRelationshipRepository.findAll();
    } else {
        relationships = null;
    }
    List<LearningResource> resources;
    if (include.contains("resources")) {
        resources = learningResourceRepository.findAll();
    } else {
        resources = null;
    }
    List<CompetencyResourceLink> links;
    if (include.contains("links")) {
        links = competencyResourceLinkRepository.findAll();
    } else {
        links = null;
    }
    List<CompetencyRelationshipVote> votes;
    if (include.contains("votes")) {
        votes = competencyRelationshipVoteRepository.findAll();
    } else {
        votes = null;
    }

        ExportBundle bundle = new ExportBundle(competencies, relationships, resources, links, votes);

        if ("csv".equals(format)) {
            return exportCsv(bundle, include);
        }
        return objectMapper.writeValueAsBytes(bundle);
    }

    private byte[] exportCsv(ExportBundle bundle, Set<String> include) throws Exception {
        StringWriter writer = new StringWriter();

        if (include.contains("competencies") && bundle.competencies() != null) {
            writer.write("# competencies\n");
            try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
                printer.printRecord("id", "title", "description", "degree", "createdAt");
                for (Competency c : bundle.competencies()) {
                    printer.printRecord(c.getId(), c.getTitle(), c.getDescription(), c.getDegree(), c.getCreatedAt());
                }
            }
        }

        if (include.contains("relationships") && bundle.relationships() != null) {
            writer.write("# relationships\n");
            try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
                printer.printRecord("id", "originId", "destinationId", "voteAssumes", "voteExtends",
                    "voteMatches", "voteUnrelated", "entropy", "totalVotes", "createdAt", "updatedAt");
                for (CompetencyRelationship r : bundle.relationships()) {
                    printer.printRecord(r.getId(), r.getOriginId(), r.getDestinationId(),
                        r.getVoteAssumes(), r.getVoteExtends(), r.getVoteMatches(), r.getVoteUnrelated(),
                        r.getEntropy(), r.getTotalVotes(), r.getCreatedAt(), r.getUpdatedAt());
                }
            }
        }

        if (include.contains("resources") && bundle.resources() != null) {
            writer.write("# resources\n");
            try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
                printer.printRecord("id", "title", "url", "createdAt");
                for (LearningResource r : bundle.resources()) {
                    printer.printRecord(r.getId(), r.getTitle(), r.getUrl(), r.getCreatedAt());
                }
            }
        }

        if (include.contains("links") && bundle.links() != null) {
            writer.write("# links\n");
            try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
                printer.printRecord("id", "competencyId", "resourceId", "userId", "matchType", "createdAt");
                for (CompetencyResourceLink l : bundle.links()) {
                    printer.printRecord(l.getId(), l.getCompetencyId(), l.getResourceId(),
                        l.getUserId(), l.getMatchType(), l.getCreatedAt());
                }
            }
        }

        if (include.contains("votes") && bundle.votes() != null) {
            writer.write("# votes\n");
            try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT)) {
                printer.printRecord("id", "relationshipId", "userId", "relationshipType", "createdAt");
                for (CompetencyRelationshipVote v : bundle.votes()) {
                    printer.printRecord(v.getId(), v.getRelationshipId(), v.getUserId(),
                        v.getRelationshipType(), v.getCreatedAt());
                }
            }
        }

        return writer.toString().getBytes(StandardCharsets.UTF_8);
    }
}
