package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.ConfidenceRatingDTO;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.enums.ConfidenceTier;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyRelationshipRepository;
import de.tum.cit.memo.repository.CompetencyRepository;
import de.tum.cit.memo.repository.CompetencyResourceLinkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConfidenceService {

    private static final double WEIGHT_VOTE      = 0.35;
    private static final double WEIGHT_CONSENSUS = 0.30;
    private static final double WEIGHT_RESOURCE  = 0.20;
    private static final double WEIGHT_METADATA  = 0.15;

    private final CompetencyRepository competencyRepository;
    private final CompetencyRelationshipRepository relationshipRepository;
    private final CompetencyResourceLinkRepository resourceLinkRepository;

    @Transactional
    public void recomputeAll() {
        List<Competency> all = competencyRepository.findAll();
        log.info("Recomputing confidence for {} competencies", all.size());
        for (Competency c : all) {
            persist(c, compute(c));
        }
    }

    @Transactional
    public ConfidenceRatingDTO recomputeForCompetency(String id) {
        Competency c = competencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Competency not found: " + id));
        ConfidenceRatingDTO dto = compute(c);
        persist(c, dto);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<ConfidenceRatingDTO> getAll() {
        return competencyRepository.findAll().stream()
                .map(this::compute)
                .toList();
    }

    @Transactional(readOnly = true)
    public ConfidenceRatingDTO getForCompetency(String id) {
        Competency c = competencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Competency not found: " + id));
        return compute(c);
    }

    private ConfidenceRatingDTO compute(Competency c) {
        long totalVotes = relationshipRepository.sumTotalVotesByCompetencyId(c.getId());

        double voteSignal      = computeVoteSignal(totalVotes);
        double consensusSignal = computeConsensusSignal(c.getId());
        double resourceSignal  = computeResourceSignal(c.getId());
        double metadataSignal  = computeMetadataSignal(c);

        double score = voteSignal * WEIGHT_VOTE
                + consensusSignal * WEIGHT_CONSENSUS
                + resourceSignal * WEIGHT_RESOURCE
                + metadataSignal * WEIGHT_METADATA;

        score = Math.min(100.0, Math.max(0.0, score));
        ConfidenceTier tier;
        if (score >= 80) {
            tier = ConfidenceTier.HIGH;
        } else {
            tier = score >= 50 ? ConfidenceTier.MEDIUM : ConfidenceTier.LOW;
        }


    
        return new ConfidenceRatingDTO(
                c.getId(), c.getTitle(),
                BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP),
                tier, totalVotes,
                voteSignal, consensusSignal, resourceSignal, metadataSignal,
                c.getConfidenceComputedAt());
    }

    private void persist(Competency c, ConfidenceRatingDTO dto) {
        Instant now = Instant.now();
        c.setConfidenceScore(dto.getConfidenceScore());
        c.setConfidenceTier(dto.getConfidenceTier());
        c.setConfidenceComputedAt(now);
        dto.setComputedAt(now);
    }

    private double computeVoteSignal(long votes) {
        if (votes == 0) return 0.0;
        return Math.min(100.0, Math.log(votes + 1) / Math.log(51) * 100.0);
    }

    private double computeConsensusSignal(String id) {
        List<Double> fractions = relationshipRepository.findDominantVoteFractionsByCompetencyId(id);
        if (fractions.isEmpty()) return 0.0;
        double avg = fractions.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        return avg * 100.0;
    }

    private double computeResourceSignal(String id) {
        long count = resourceLinkRepository.countByCompetencyId(id);
        if (count == 0) return 0.0;
        double avgQuality = resourceLinkRepository.averageMatchQualityByCompetencyId(id);
        return Math.min(100.0, (count / 5.0) * avgQuality * 100.0);
    }

    private double computeMetadataSignal(Competency c) {
        double score = 0.0;
        if (c.getDescription() != null && !c.getDescription().isBlank()) score += 60.0;
        if (c.getTitle() != null && c.getTitle().length() >= 5) score += 40.0;
        return score;
    }
}
