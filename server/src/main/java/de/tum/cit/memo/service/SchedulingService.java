package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.RelationshipTaskResponse;
import de.tum.cit.memo.dto.VoteCounts;
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
import de.tum.cit.memo.repository.UserRepository;
import de.tum.cit.memo.util.IdGenerator;
import de.tum.cit.memo.util.SchedulingConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

    private final CompetencyRelationshipRepository relationshipRepository;
    private final CompetencyRelationshipVoteRepository voteRepository;
    private final CompetencyRepository competencyRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    /** Returns the next pair for a user to vote on, or empty if none left. */
    @Transactional
    public Optional<RelationshipTaskResponse> getNextTask(String userId, List<String> skippedIds) {
        assertUserExists(userId);
        List<String> skipList = Objects.requireNonNullElse(skippedIds, List.of());

        if (random.nextDouble() < SchedulingConstants.COVERAGE_WEIGHT) {
            log.debug("Coverage pipeline for user {}", userId);
            return coveragePipeline(userId, skipList);
        }

        log.debug("Consensus pipeline for user {}", userId);
        RelationshipTaskResponse task = consensusPipeline(userId, skipList);
        if (task != null) {
            return Optional.of(task);
        }

        log.debug("No consensus candidates, falling back to coverage");
        return coveragePipeline(userId, skipList);
    }

    @Transactional
    public VoteResponse submitVote(String userId, VoteRequest request) {
        assertUserExists(userId);

        CompetencyRelationship rel;
        if (request.getRelationshipId() != null && !request.getRelationshipId().isBlank()) {
            rel = relationshipRepository.findById(request.getRelationshipId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Relationship not found: " + request.getRelationshipId()));
        } else {
            rel = findOrCreateRelationship(request.getOriginId(), request.getDestinationId());
        }
        if (!recordVoteIfAbsent(rel.getId(), userId, request.getRelationshipType())) {
            log.debug("Duplicate vote ignored for user {} on {}", userId, rel.getId());
            return toVoteResponse(rel);
        }

        applyVote(rel, request.getRelationshipType());

        // MATCHES and UNRELATED are symmetric, so mirror the vote to B→A
        RelationshipType type = request.getRelationshipType();
        if (type == RelationshipType.MATCHES || type == RelationshipType.UNRELATED) {
            mirrorSymmetricVote(rel, userId, type);
        }

        return toVoteResponse(rel);
    }

    @Transactional
    public void unvote(String userId, String relationshipId) {
        assertUserExists(userId);

        CompetencyRelationship rel = relationshipRepository.findById(relationshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Relationship not found: " + relationshipId));

        CompetencyRelationshipVote vote = voteRepository.findByRelationshipIdAndUserId(relationshipId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No vote found for user " + userId + " on relationship " + relationshipId));

        voteRepository.delete(vote);
        removeVote(rel, vote.getRelationshipType());

        // If symmetric, also remove the mirrored vote on the reverse relationship
        RelationshipType type = vote.getRelationshipType();
        if (type == RelationshipType.MATCHES || type == RelationshipType.UNRELATED) {
            relationshipRepository.findByOriginIdAndDestinationId(rel.getDestinationId(), rel.getOriginId())
                    .ifPresent(reverse -> {
                        voteRepository.findByRelationshipIdAndUserId(reverse.getId(), userId)
                                .ifPresent(mirrorVote -> {
                                    voteRepository.delete(mirrorVote);
                                    removeVote(reverse, mirrorVote.getRelationshipType());
                                });
                    });
        }
    }

    private void removeVote(CompetencyRelationship rel, RelationshipType type) {
        switch (type) {
            case ASSUMES -> rel.setVoteAssumes(Math.max(0, rel.getVoteAssumes() - 1));
            case EXTENDS -> rel.setVoteExtends(Math.max(0, rel.getVoteExtends() - 1));
            case MATCHES -> rel.setVoteMatches(Math.max(0, rel.getVoteMatches() - 1));
            case UNRELATED -> rel.setVoteUnrelated(Math.max(0, rel.getVoteUnrelated() - 1));
        }
        rel.recalculateEntropy();

        if (rel.getTotalVotes() == 0) {
            competencyRepository.decrementDegree(List.of(rel.getOriginId(), rel.getDestinationId()));
            relationshipRepository.delete(rel);
        } else {
            relationshipRepository.save(rel);
        }
    }

    private Optional<RelationshipTaskResponse> coveragePipeline(String userId, List<String> skippedIds) {
        List<String> poolIds = getLowDegreeCompetencyIds();
        if (poolIds.size() < 2) {
            log.debug("Not enough competencies to form pairs");
            return Optional.empty();
        }

        Set<String> existingPairs = relationshipRepository.findIntraPoolRelationships(poolIds).stream()
                .flatMap(r -> Stream.of(pairKey(r.getOriginId(), r.getDestinationId()),
                        pairKey(r.getDestinationId(), r.getOriginId())))
                .collect(Collectors.toSet());

        // Also exclude skipped pairs so we don't present them again
        if (skippedIds != null && !skippedIds.isEmpty()) {
            for (String skippedId : skippedIds) {
                String[] parts = skippedId.split(":");
                if (parts.length == 2) {
                    existingPairs.add(pairKey(parts[0], parts[1]));
                    existingPairs.add(pairKey(parts[1], parts[0]));
                }
            }
        }

        List<String> pool = new ArrayList<>(poolIds);
        Collections.shuffle(pool, random);

        for (int i = 0; i < pool.size(); i++) {
            for (int j = i + 1; j < pool.size(); j++) {
                if (!existingPairs.contains(pairKey(pool.get(i), pool.get(j)))) {
                    return Optional.of(toTaskResponseFromIds(pool.get(i), pool.get(j), "COVERAGE"));
                }
            }
        }

        log.debug("Pool fully connected, finding any unvoted relationship");
        return relationshipRepository
                .findUnvotedByUserAndNotSkipped(userId, skippedIds, PageRequest.of(0, 1))
                .stream().findFirst()
                .map(rel -> toTaskResponse(rel, "COVERAGE"));
    }

    private RelationshipTaskResponse consensusPipeline(String userId, List<String> skippedIds) {
        List<CompetencyRelationship> candidates = relationshipRepository
                .findHighEntropyRelationshipsExcludingUser(
                        userId, SchedulingConstants.CONSENSUS_MIN_VOTES, SchedulingConstants.CONSENSUS_MAX_VOTES,
                        SchedulingConstants.CONSENSUS_MIN_ENTROPY,
                        skippedIds, PageRequest.of(0, SchedulingConstants.CONSENSUS_CANDIDATE_LIMIT));

        if (candidates.isEmpty()) {
            return null;
        }

        return toTaskResponse(pickWeightedByEntropy(candidates), "CONSENSUS");
    }

    private List<String> getLowDegreeCompetencyIds() {
        List<String> ids = competencyRepository.findIdsByDegreeAsc(
                PageRequest.of(0, SchedulingConstants.LOW_DEGREE_POOL_SIZE));
        if (ids.isEmpty()) {
            return competencyRepository.findRandomCompetencyIds(SchedulingConstants.LOW_DEGREE_POOL_SIZE);
        }
        return ids;
    }

    private CompetencyRelationship createRelationship(String originId, String destId) {
        if (originId.equals(destId)) {
            throw new InvalidOperationException("Cannot create relationship to itself");
        }

        CompetencyRelationship rel = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(originId)
                .destinationId(destId)
                .build();

        CompetencyRelationship saved = relationshipRepository.save(rel);
        competencyRepository.incrementDegree(List.of(originId, destId));
        return saved;
    }

    private CompetencyRelationship findOrCreateRelationship(String originId, String destinationId) {
        return relationshipRepository
                .findByOriginIdAndDestinationId(originId, destinationId)
                .orElseGet(() -> {
                    try {
                        return createRelationship(originId, destinationId);
                    } catch (DataIntegrityViolationException ex) {
                        log.debug("Relationship already created by concurrent request ({} → {})", originId, destinationId);
                        return relationshipRepository
                                .findByOriginIdAndDestinationId(originId, destinationId)
                                .orElseThrow();
                    }
                });
    }

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

    private boolean recordVoteIfAbsent(String relationshipId, String userId, RelationshipType type) {
        if (voteRepository.existsByRelationshipIdAndUserId(relationshipId, userId)) {
            return false;
        }

        try {
            voteRepository.save(CompetencyRelationshipVote.builder()
                    .id(IdGenerator.generateCuid())
                    .relationshipId(relationshipId)
                    .userId(userId)
                    .relationshipType(type)
                    .build());
            return true;
        } catch (DataIntegrityViolationException ex) {
            log.debug("Vote already exists due to concurrent request for user {} on {}",
                    userId, relationshipId);
            return false;
        }
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

    /** For symmetric types, also records the vote on the reverse direction. */
    private void mirrorSymmetricVote(CompetencyRelationship originalRel, String userId, RelationshipType type) {
        CompetencyRelationship reverse = findOrCreateRelationship(
                originalRel.getDestinationId(), originalRel.getOriginId());
        if (recordVoteIfAbsent(reverse.getId(), userId, type)) {
            applyVote(reverse, type);
        }
    }

    // --- Response builders ---

    private void assertUserExists(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found: " + userId);
        }
    }

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
                .currentVotes(toVoteCounts(rel))
                .build();
    }

    /**
     * Builds a task response from two competency IDs without persisting a
     * relationship.
     * The relationship row is only created when the user actually votes.
     */
    private RelationshipTaskResponse toTaskResponseFromIds(String originId, String destinationId, String pipeline) {
        Map<String, Competency> byId = competencyRepository
                .findAllById(List.of(originId, destinationId))
                .stream().collect(Collectors.toMap(Competency::getId, Function.identity()));

        Competency origin = byId.get(originId);
        Competency destination = byId.get(destinationId);
        if (origin == null || destination == null) {
            throw new ResourceNotFoundException("Competency not found for IDs " + originId + ", " + destinationId);
        }

        return RelationshipTaskResponse.builder()
                .relationshipId(null)
                .origin(toCompetencyInfo(origin))
                .destination(toCompetencyInfo(destination))
                .pipeline(pipeline)
                .currentVotes(VoteCounts.builder().build())
                .build();
    }

    private VoteResponse toVoteResponse(CompetencyRelationship rel) {
        return VoteResponse.builder()
                .relationshipId(rel.getId())
                .success(true)
                .updatedVotes(toVoteCounts(rel))
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

    private static VoteCounts toVoteCounts(CompetencyRelationship rel) {
        return VoteCounts.builder()
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
