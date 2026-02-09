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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

/**
 * Service for intelligent scheduling of competency mapping tasks.
 * Uses a dual-pipeline approach: coverage (70%) and consensus (30%).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SchedulingService {

    private static final double COVERAGE_WEIGHT = 0.7;
    private static final int LOW_DEGREE_POOL_SIZE = 20;
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
        if (task == null) {
            log.debug("Falling back to coverage");
            return coveragePipeline(userId);
        }
        return task;
    }

    @Transactional
    public VoteResponse submitVote(String userId, VoteRequest request) {
        CompetencyRelationship rel = relationshipRepository.findById(request.getRelationshipId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Relationship not found: " + request.getRelationshipId()));

        // Idempotent: if user already voted, return current state
        if (voteRepository.existsByRelationshipIdAndUserId(request.getRelationshipId(), userId)) {
            log.debug("User {} already voted on relationship {}", userId, request.getRelationshipId());
            return buildVoteResponse(rel);
        }

        // Record the vote
        voteRepository.save(CompetencyRelationshipVote.builder()
                .id(IdGenerator.generateCuid())
                .relationshipId(request.getRelationshipId())
                .userId(userId)
                .relationshipType(request.getRelationshipType())
                .build());

        // Update counters and entropy
        incrementVoteCounter(rel, request.getRelationshipType());
        rel.recalculateEntropy();
        relationshipRepository.save(rel);

        // Handle MATCHES bidirectionality
        if (request.getRelationshipType() == RelationshipType.MATCHES) {
            handleBidirectionalMatches(rel, userId);
        }

        return buildVoteResponse(rel);
    }

    private RelationshipTaskResponse coveragePipeline(String userId) {
        List<String> poolIds = getLowDegreeCompetencyIds();

        if (poolIds.size() < 2) {
            throw new InvalidOperationException("Not enough competencies to form pairs");
        }

        // Optimization: Batch fetch existing relationships to avoid N+1 queries in the
        // loop
        // We fetch ALL relationships involving ANY of the nodes in the low-degree pool
        // in one go.
        List<CompetencyRelationship> existingRels = relationshipRepository.findAllByCompetencyIds(poolIds);

        // Build a fast lookup set "A:B" and "B:A"
        Set<String> existingPairs = existingRels.stream()
                .flatMap(r -> java.util.stream.Stream.of(
                        r.getOriginId() + ":" + r.getDestinationId(),
                        r.getDestinationId() + ":" + r.getOriginId()))
                .collect(java.util.stream.Collectors.toSet());

        // Try to find a new pair that doesn't exist yet (in-memory check)
        List<String> shuffledPool = new ArrayList<>(poolIds);
        Collections.shuffle(shuffledPool, random);

        for (int i = 0; i < shuffledPool.size(); i++) {
            for (int j = i + 1; j < shuffledPool.size(); j++) {
                String originId = shuffledPool.get(i);
                String destId = shuffledPool.get(j);

                // O(1) in-memory check instead of O(N) DB call
                if (!existingPairs.contains(originId + ":" + destId)) {
                    CompetencyRelationship rel = createRelationship(originId, destId);
                    return buildTaskResponse(rel, "COVERAGE");
                }
            }
        }

        // All pairs exist, find one user hasn't voted on
        log.debug("All candidate pairs exist, finding unvoted relationship");
        return findUnvotedRelationship(userId);
    }

    private RelationshipTaskResponse consensusPipeline(String userId) {
        List<CompetencyRelationship> candidates = relationshipRepository
                .findHighEntropyRelationshipsExcludingUser(
                        userId, CONSENSUS_MIN_VOTES, CONSENSUS_MAX_VOTES, CONSENSUS_MIN_ENTROPY);

        if (candidates.isEmpty()) {
            return null;
        }

        // Weighted random selection by entropy (higher entropy = more weight)
        CompetencyRelationship selected = selectByEntropyWeight(candidates);
        return buildTaskResponse(selected, "CONSENSUS");
    }

    // Helper Methods

    private List<String> getLowDegreeCompetencyIds() {
        // Optimized: Uses denormalized degree index (single simple query) O(1)
        List<Competency> nodes = competencyRepository.findTop20ByOrderByDegreeAsc();

        if (nodes.isEmpty()) {
            return competencyRepository.findRandomCompetencies(LOW_DEGREE_POOL_SIZE)
                    .stream().map(Competency::getId).toList();
        }
        return nodes.stream().map(Competency::getId).toList();
    }

    private CompetencyRelationship createRelationship(String originId, String destId) {
        CompetencyRelationship rel = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(originId)
                .destinationId(destId)
                .build();

        List<Competency> competencies = competencyRepository.findAllById(List.of(originId, destId));
        competencies.forEach(c -> c.setDegree(c.getDegree() + 1));
        competencyRepository.saveAll(competencies);

        return relationshipRepository.save(rel);
    }

    private RelationshipTaskResponse findUnvotedRelationship(String userId) {
        return relationshipRepository
                .findFirstUnvotedByUser(userId, org.springframework.data.domain.PageRequest.of(0, 1))
                .map(rel -> buildTaskResponse(rel, "COVERAGE"))
                .orElseThrow(() -> new InvalidOperationException("No available relationships for voting"));
    }

    private CompetencyRelationship selectByEntropyWeight(List<CompetencyRelationship> candidates) {
        double totalWeight = candidates.stream()
                .mapToDouble(r -> r.getEntropy() / (r.getTotalVotes() + 1.0))
                .sum();
        double roll = random.nextDouble() * totalWeight;
        double cumulative = 0;

        for (CompetencyRelationship rel : candidates) {
            cumulative += rel.getEntropy() / (rel.getTotalVotes() + 1.0);
            if (roll <= cumulative) {
                return rel;
            }
        }
        return candidates.get(0);
    }

    private void handleBidirectionalMatches(CompetencyRelationship originalRel, String userId) {
        Optional<CompetencyRelationship> reverseOpt = relationshipRepository
                .findByOriginIdAndDestinationId(originalRel.getDestinationId(), originalRel.getOriginId());

        CompetencyRelationship reverse = reverseOpt.orElseGet(() -> createRelationship(
                originalRel.getDestinationId(), originalRel.getOriginId()));

        if (!voteRepository.existsByRelationshipIdAndUserId(reverse.getId(), userId)) {
            reverse.setVoteMatches(reverse.getVoteMatches() + 1);
            reverse.recalculateEntropy();
            relationshipRepository.save(reverse);

            voteRepository.save(CompetencyRelationshipVote.builder()
                    .id(IdGenerator.generateCuid())
                    .relationshipId(reverse.getId())
                    .userId(userId)
                    .relationshipType(RelationshipType.MATCHES)
                    .build());
        }
    }

    private void incrementVoteCounter(CompetencyRelationship rel, RelationshipType type) {
        switch (type) {
            case ASSUMES -> rel.setVoteAssumes(rel.getVoteAssumes() + 1);
            case EXTENDS -> rel.setVoteExtends(rel.getVoteExtends() + 1);
            case MATCHES -> rel.setVoteMatches(rel.getVoteMatches() + 1);
            case UNRELATED -> rel.setVoteUnrelated(rel.getVoteUnrelated() + 1);
        }
    }

    // Response Builders
    private VoteResponse buildVoteResponse(CompetencyRelationship rel) {
        return VoteResponse.builder()
                .success(true)
                .updatedVotes(buildVoteResponseCounts(rel))
                .newEntropy(rel.getEntropy())
                .build();
    }

    private VoteResponse.VoteCounts buildVoteResponseCounts(CompetencyRelationship rel) {
        return VoteResponse.VoteCounts.builder()
                .assumes(rel.getVoteAssumes())
                .extendsRelation(rel.getVoteExtends())
                .matches(rel.getVoteMatches())
                .unrelated(rel.getVoteUnrelated())
                .build();
    }

    private RelationshipTaskResponse buildTaskResponse(CompetencyRelationship rel, String pipeline) {
        Competency origin = competencyRepository.findById(rel.getOriginId())
                .orElseThrow(() -> new ResourceNotFoundException("Origin competency not found"));
        Competency destination = competencyRepository.findById(rel.getDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination competency not found"));

        return RelationshipTaskResponse.builder()
                .relationshipId(rel.getId())
                .origin(buildCompetencyInfo(origin))
                .destination(buildCompetencyInfo(destination))
                .pipeline(pipeline)
                .currentVotes(buildTaskResponseCounts(rel))
                .build();
    }

    private RelationshipTaskResponse.CompetencyInfo buildCompetencyInfo(Competency c) {
        return RelationshipTaskResponse.CompetencyInfo.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .build();
    }

    private RelationshipTaskResponse.VoteCounts buildTaskResponseCounts(CompetencyRelationship rel) {
        return RelationshipTaskResponse.VoteCounts.builder()
                .assumes(rel.getVoteAssumes())
                .extendsRelation(rel.getVoteExtends())
                .matches(rel.getVoteMatches())
                .unrelated(rel.getVoteUnrelated())
                .build();
    }
}
