package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.RelationshipTaskResponse;
import de.tum.cit.memo.dto.VoteRequest;
import de.tum.cit.memo.dto.VoteResponse;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.entity.CompetencyRelationshipVote;
import de.tum.cit.memo.enums.RelationshipType;
import de.tum.cit.memo.exception.InvalidOperationException;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyRelationshipRepository;
import de.tum.cit.memo.repository.CompetencyRelationshipVoteRepository;
import de.tum.cit.memo.repository.CompetencyRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Dual-pipeline scheduling for competency mapping tasks.
 * Coverage (70%): connects low-degree nodes to grow the graph evenly.
 * Consensus (30%): resurfaces ambiguous relationships for more votes.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SchedulingService {

    private static final double COVERAGE_WEIGHT = 0.7;
    private static final int LOW_DEGREE_POOL_SIZE = 20;
    private static final int CONSENSUS_CANDIDATE_LIMIT = 20;
    private static final int CONSENSUS_MIN_VOTES = 5;
    private static final int CONSENSUS_MAX_VOTES = 20;
    private static final double CONSENSUS_MIN_ENTROPY = 0.5;

    private final CompetencyRelationshipRepository relationshipRepository;
    private final CompetencyRelationshipVoteRepository voteRepository;
    private final CompetencyRepository competencyRepository;
    private final Random random = new Random();

    /**
     * Get the next relationship task for a user.
     * Uses 70% coverage pipeline (new pairs) and 30% consensus pipeline
     * (high-entropy).
     */
    @Transactional
    public RelationshipTaskResponse getNextTask(String userId) {
        if (random.nextDouble() < COVERAGE_WEIGHT) {
            log.debug("Coverage pipeline for user {}", userId);
            return coveragePipeline(userId);
        }

        log.debug("Consensus pipeline for user {}", userId);
        RelationshipTaskResponse task = consensusPipeline(userId);
        if (task != null) {
            return task;
        }

        log.debug("No consensus candidates, falling back to coverage");
        return coveragePipeline(userId);
    }

    @Transactional
    public VoteResponse submitVote(String userId, VoteRequest request) {
        CompetencyRelationship rel = findRelationshipOrThrow(request.getRelationshipId());

        // Already voted? Return current state (idempotent)
        if (voteRepository.existsByRelationshipIdAndUserId(rel.getId(), userId)) {
            log.debug("User {} already voted on {}", userId, rel.getId());
            return toVoteResponse(rel);
        }

        saveVote(rel.getId(), userId, request.getRelationshipType());
        applyVote(rel, request.getRelationshipType());

        if (request.getRelationshipType() == RelationshipType.MATCHES) {
            mirrorMatchesVote(rel, userId);
        }

        return toVoteResponse(rel);
    }

    // --- Pipelines ---

    private RelationshipTaskResponse coveragePipeline(String userId) {
        List<String> poolIds = getLowDegreeCompetencyIds();
        if (poolIds.size() < 2) {
            throw new InvalidOperationException("Not enough competencies to form pairs");
        }

        // Fetch only intra-pool relationships (both nodes in pool)
        Set<String> existingPairs = relationshipRepository.findIntraPoolRelationships(poolIds).stream()
                .flatMap(r -> Stream.of(pairKey(r.getOriginId(), r.getDestinationId()),
                        pairKey(r.getDestinationId(), r.getOriginId())))
                .collect(Collectors.toSet());

        // Shuffle and find the first pair that doesn't exist yet
        List<String> pool = new ArrayList<>(poolIds);
        Collections.shuffle(pool, random);

        for (int i = 0; i < pool.size(); i++) {
            for (int j = i + 1; j < pool.size(); j++) {
                if (!existingPairs.contains(pairKey(pool.get(i), pool.get(j)))) {
                    return toTaskResponse(createRelationship(pool.get(i), pool.get(j)), "COVERAGE");
                }
            }
        }

        // All pool pairs already exist — fall back to any unvoted relationship
        log.debug("Pool fully connected, finding any unvoted relationship");
        return relationshipRepository
                .findFirstUnvotedByUser(userId, PageRequest.of(0, 1))
                .map(rel -> toTaskResponse(rel, "COVERAGE"))
                .orElseThrow(() -> new InvalidOperationException("No available relationships for voting"));
    }

    private RelationshipTaskResponse consensusPipeline(String userId) {
        List<CompetencyRelationship> candidates = relationshipRepository
                .findHighEntropyRelationshipsExcludingUser(
                        userId, CONSENSUS_MIN_VOTES, CONSENSUS_MAX_VOTES, CONSENSUS_MIN_ENTROPY,
                        PageRequest.of(0, CONSENSUS_CANDIDATE_LIMIT));

        if (candidates.isEmpty()) {
            return null;
        }

        return toTaskResponse(pickWeightedByEntropy(candidates), "CONSENSUS");
    }

    // --- Core helpers ---

    private List<String> getLowDegreeCompetencyIds() {
        List<String> ids = competencyRepository.findTop20IdsByDegreeAsc(PageRequest.of(0, LOW_DEGREE_POOL_SIZE));
        if (ids.isEmpty()) {
            // No degree data yet — pick random competencies
            return competencyRepository.findRandomCompetencies(LOW_DEGREE_POOL_SIZE)
                    .stream().map(Competency::getId).toList();
        }
        return ids;
    }

    private CompetencyRelationship createRelationship(String originId, String destId) {
        CompetencyRelationship rel = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(originId)
                .destinationId(destId)
                .build();

        competencyRepository.incrementDegree(List.of(originId, destId));
        return relationshipRepository.save(rel);
    }

    /**
     * Entropy-weighted roulette selection, biased toward low-vote high-entropy
     * items.
     */
    private CompetencyRelationship pickWeightedByEntropy(List<CompetencyRelationship> candidates) {
        double totalWeight = candidates.stream()
                .mapToDouble(this::entropyWeight)
                .sum();
        double roll = random.nextDouble() * totalWeight;
        double cumulative = 0;

        for (CompetencyRelationship rel : candidates) {
            cumulative += entropyWeight(rel);
            if (roll <= cumulative) {
                return rel;
            }
        }
        return candidates.get(0);
    }

    private double entropyWeight(CompetencyRelationship rel) {
        return rel.getEntropy() / (rel.getTotalVotes() + 1.0);
    }

    // --- Vote logic ---

    private void saveVote(String relationshipId, String userId, RelationshipType type) {
        voteRepository.save(CompetencyRelationshipVote.builder()
                .id(IdGenerator.generateCuid())
                .relationshipId(relationshipId)
                .userId(userId)
                .relationshipType(type)
                .build());
    }

    private void applyVote(CompetencyRelationship rel, RelationshipType type) {
        switch (type) {
            case ASSUMES -> rel.setVoteAssumes(rel.getVoteAssumes() + 1);
            case EXTENDS -> rel.setVoteExtends(rel.getVoteExtends() + 1);
            case MATCHES -> rel.setVoteMatches(rel.getVoteMatches() + 1);
            case UNRELATED -> rel.setVoteUnrelated(rel.getVoteUnrelated() + 1);
        }
        rel.recalculateEntropy();
        relationshipRepository.save(rel);
    }

    /** MATCHES is symmetric: if A matches B, then B matches A. */
    private void mirrorMatchesVote(CompetencyRelationship originalRel, String userId) {
        Optional<CompetencyRelationship> reverseOpt = relationshipRepository
                .findByOriginIdAndDestinationId(originalRel.getDestinationId(), originalRel.getOriginId());

        CompetencyRelationship reverse = reverseOpt.orElseGet(
                () -> createRelationship(originalRel.getDestinationId(), originalRel.getOriginId()));

        if (!voteRepository.existsByRelationshipIdAndUserId(reverse.getId(), userId)) {
            applyVote(reverse, RelationshipType.MATCHES);
            saveVote(reverse.getId(), userId, RelationshipType.MATCHES);
        }
    }

    // --- Lookups & response builders ---

    private CompetencyRelationship findRelationshipOrThrow(String id) {
        return relationshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found: " + id));
    }

    /**
     * Fetches both competencies in one query instead of two separate findById
     * calls.
     */
    private RelationshipTaskResponse toTaskResponse(CompetencyRelationship rel, String pipeline) {
        Map<String, Competency> byId = competencyRepository
                .findAllById(List.of(rel.getOriginId(), rel.getDestinationId()))
                .stream().collect(Collectors.toMap(Competency::getId, Function.identity()));

        Competency origin = byId.get(rel.getOriginId());
        Competency destination = byId.get(rel.getDestinationId());
        if (origin == null || destination == null) {
            throw new ResourceNotFoundException("Competency not found for relationship " + rel.getId());
        }

        return RelationshipTaskResponse.builder()
                .relationshipId(rel.getId())
                .origin(toCompetencyInfo(origin))
                .destination(toCompetencyInfo(destination))
                .pipeline(pipeline)
                .currentVotes(toTaskVoteCounts(rel))
                .build();
    }

    private VoteResponse toVoteResponse(CompetencyRelationship rel) {
        return VoteResponse.builder()
                .success(true)
                .updatedVotes(toResponseVoteCounts(rel))
                .newEntropy(rel.getEntropy())
                .build();
    }

    private static RelationshipTaskResponse.CompetencyInfo toCompetencyInfo(Competency c) {
        return RelationshipTaskResponse.CompetencyInfo.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .build();
    }

    private static RelationshipTaskResponse.VoteCounts toTaskVoteCounts(CompetencyRelationship rel) {
        return RelationshipTaskResponse.VoteCounts.builder()
                .assumes(rel.getVoteAssumes())
                .extendsRelation(rel.getVoteExtends())
                .matches(rel.getVoteMatches())
                .unrelated(rel.getVoteUnrelated())
                .build();
    }

    private static VoteResponse.VoteCounts toResponseVoteCounts(CompetencyRelationship rel) {
        return VoteResponse.VoteCounts.builder()
                .assumes(rel.getVoteAssumes())
                .extendsRelation(rel.getVoteExtends())
                .matches(rel.getVoteMatches())
                .unrelated(rel.getVoteUnrelated())
                .build();
    }

    private static String pairKey(String a, String b) {
        return a + ':' + b;
    }
}
