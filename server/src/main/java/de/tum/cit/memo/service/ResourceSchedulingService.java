package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.ResourceTaskResponse;
import de.tum.cit.memo.dto.ResourceVoteCounts;
import de.tum.cit.memo.dto.ResourceVoteRequest;
import de.tum.cit.memo.dto.ResourceVoteResponse;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.entity.CompetencyResourceMapping;
import de.tum.cit.memo.entity.CompetencyResourceMappingVote;
import de.tum.cit.memo.entity.LearningResource;
import de.tum.cit.memo.enums.ResourceMatchType;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyRepository;
import de.tum.cit.memo.repository.CompetencyResourceMappingRepository;
import de.tum.cit.memo.repository.CompetencyResourceMappingVoteRepository;
import de.tum.cit.memo.repository.LearningResourceRepository;
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
import java.util.Objects;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Dual-pipeline scheduling for competency↔resource mapping tasks.
 * Coverage (70%): bipartite cross-product of low-degree competencies × low-degree resources.
 * Consensus (30%): resurfaces high-entropy mappings for more votes.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ResourceSchedulingService {

    private final CompetencyResourceMappingRepository mappingRepository;
    private final CompetencyResourceMappingVoteRepository voteRepository;
    private final CompetencyRepository competencyRepository;
    private final LearningResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    /** Returns the next competency↔resource pair for a user to vote on, or empty if none left. */
    @Transactional
    public Optional<ResourceTaskResponse> getNextTask(String userId, List<String> skippedIds) {
        assertUserExists(userId);
        List<String> skipList = Objects.requireNonNullElse(skippedIds, List.of());

        if (random.nextDouble() < SchedulingConstants.COVERAGE_WEIGHT) {
            log.debug("Resource coverage pipeline for user {}", userId);
            return coveragePipeline(userId, skipList);
        }

        log.debug("Resource consensus pipeline for user {}", userId);
        ResourceTaskResponse task = consensusPipeline(userId, skipList);
        if (task != null) {
            return Optional.of(task);
        }

        log.debug("No resource consensus candidates, falling back to coverage");
        return coveragePipeline(userId, skipList);
    }

    @Transactional
    public ResourceVoteResponse submitVote(String userId, ResourceVoteRequest request) {
        assertUserExists(userId);

        CompetencyResourceMapping mapping;
        if (request.getMappingId() != null && !request.getMappingId().isBlank()) {
            mapping = mappingRepository.findById(request.getMappingId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Mapping not found: " + request.getMappingId()));
        } else {
            mapping = findOrCreateMapping(request.getCompetencyId(), request.getResourceId());
        }

        if (!recordVoteIfAbsent(mapping.getId(), userId, request.getMatchType())) {
            log.debug("Duplicate resource vote ignored for user {} on {}", userId, mapping.getId());
            return toVoteResponse(mapping);
        }

        applyVote(mapping, request.getMatchType());
        return toVoteResponse(mapping);
    }

    @Transactional
    public void unvote(String userId, String mappingId) {
        assertUserExists(userId);

        CompetencyResourceMapping mapping = mappingRepository.findById(mappingId)
                .orElseThrow(() -> new ResourceNotFoundException("Mapping not found: " + mappingId));

        CompetencyResourceMappingVote vote = voteRepository.findByMappingIdAndUserId(mappingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No vote found for user " + userId + " on mapping " + mappingId));

        voteRepository.delete(vote);
        removeVote(mapping, vote.getMatchType());
    }

    // --- Coverage pipeline ---

    private Optional<ResourceTaskResponse> coveragePipeline(String userId, List<String> skippedIds) {
        List<String> competencyIds = getLowDegreeCompetencyIds();
        List<String> resourceIds = getLowDegreeResourceIds();

        if (competencyIds.isEmpty() || resourceIds.isEmpty()) {
            log.debug("Not enough competencies or resources to form bipartite pairs");
            return Optional.empty();
        }

        Set<String> existingPairs = mappingRepository
                .findBipartitePoolMappings(competencyIds, resourceIds).stream()
                .map(m -> pairKey(m.getCompetencyId(), m.getResourceId()))
                .collect(Collectors.toSet());

        if (skippedIds != null && !skippedIds.isEmpty()) {
            for (String skipped : skippedIds) {
                existingPairs.add(skipped);
            }
        }

        List<String> shuffledCompetencies = new ArrayList<>(competencyIds);
        List<String> shuffledResources = new ArrayList<>(resourceIds);
        Collections.shuffle(shuffledCompetencies, random);
        Collections.shuffle(shuffledResources, random);

        for (String cId : shuffledCompetencies) {
            for (String rId : shuffledResources) {
                if (!existingPairs.contains(pairKey(cId, rId))) {
                    return Optional.of(toTaskResponseFromIds(cId, rId, "COVERAGE"));
                }
            }
        }

        log.debug("Bipartite pool fully connected, finding any unvoted mapping");
        return mappingRepository
                .findUnvotedByUserAndNotSkipped(userId, skippedIds, PageRequest.of(0, 1))
                .stream().findFirst()
                .map(m -> toTaskResponse(m, "COVERAGE"));
    }

    // --- Consensus pipeline ---

    private ResourceTaskResponse consensusPipeline(String userId, List<String> skippedIds) {
        List<CompetencyResourceMapping> candidates = mappingRepository
                .findHighEntropyMappingsExcludingUser(
                        userId, SchedulingConstants.CONSENSUS_MIN_VOTES, SchedulingConstants.CONSENSUS_MAX_VOTES,
                        SchedulingConstants.CONSENSUS_MIN_ENTROPY,
                        skippedIds, PageRequest.of(0, SchedulingConstants.CONSENSUS_CANDIDATE_LIMIT));

        if (candidates.isEmpty()) {
            return null;
        }

        return toTaskResponse(pickWeightedByEntropy(candidates), "CONSENSUS");
    }

    // --- Helpers ---

    private List<String> getLowDegreeCompetencyIds() {
        List<String> ids = competencyRepository.findIdsByResourceLinkDegreeAsc(
                PageRequest.of(0, SchedulingConstants.LOW_DEGREE_POOL_SIZE));
        if (ids.isEmpty()) {
            return competencyRepository.findRandomCompetencyIds(SchedulingConstants.LOW_DEGREE_POOL_SIZE);
        }
        return ids;
    }

    private List<String> getLowDegreeResourceIds() {
        List<String> ids = resourceRepository.findIdsByResourceLinkDegreeAsc(
                PageRequest.of(0, SchedulingConstants.LOW_DEGREE_POOL_SIZE));
        if (ids.isEmpty()) {
            return resourceRepository.findRandomLearningResourceIds(SchedulingConstants.LOW_DEGREE_POOL_SIZE);
        }
        return ids;
    }

    private CompetencyResourceMapping createMapping(String competencyId, String resourceId) {
        CompetencyResourceMapping mapping = CompetencyResourceMapping.builder()
                .id(IdGenerator.generateCuid())
                .competencyId(competencyId)
                .resourceId(resourceId)
                .build();

        CompetencyResourceMapping saved = mappingRepository.save(mapping);
        competencyRepository.incrementResourceLinkDegree(List.of(competencyId));
        resourceRepository.incrementResourceLinkDegree(List.of(resourceId));
        return saved;
    }

    private CompetencyResourceMapping findOrCreateMapping(String competencyId, String resourceId) {
        return mappingRepository
                .findByCompetencyIdAndResourceId(competencyId, resourceId)
                .orElseGet(() -> {
                    try {
                        return createMapping(competencyId, resourceId);
                    } catch (DataIntegrityViolationException ex) {
                        log.debug("Mapping already created by concurrent request ({} ↔ {})", competencyId, resourceId);
                        return mappingRepository
                                .findByCompetencyIdAndResourceId(competencyId, resourceId)
                                .orElseThrow();
                    }
                });
    }

    private CompetencyResourceMapping pickWeightedByEntropy(List<CompetencyResourceMapping> candidates) {
        double totalWeight = candidates.stream().mapToDouble(this::entropyWeight).sum();
        double roll = random.nextDouble() * totalWeight;
        double cumulative = 0;

        for (CompetencyResourceMapping m : candidates) {
            cumulative += entropyWeight(m);
            if (roll <= cumulative) {
                return m;
            }
        }
        return candidates.get(0);
    }

    private double entropyWeight(CompetencyResourceMapping m) {
        return m.getEntropy() / (m.getTotalVotes() + 1.0);
    }

    private boolean recordVoteIfAbsent(String mappingId, String userId, ResourceMatchType matchType) {
        if (voteRepository.existsByMappingIdAndUserId(mappingId, userId)) {
            return false;
        }

        try {
            voteRepository.save(CompetencyResourceMappingVote.builder()
                    .id(IdGenerator.generateCuid())
                    .mappingId(mappingId)
                    .userId(userId)
                    .matchType(matchType)
                    .build());
            return true;
        } catch (DataIntegrityViolationException ex) {
            log.debug("Resource vote already exists due to concurrent request for user {} on {}",
                    userId, mappingId);
            return false;
        }
    }

    private void applyVote(CompetencyResourceMapping mapping, ResourceMatchType type) {
        switch (type) {
            case UNRELATED     -> mapping.setVoteUnrelated(mapping.getVoteUnrelated() + 1);
            case WEAK          -> mapping.setVoteWeak(mapping.getVoteWeak() + 1);
            case GOOD_FIT      -> mapping.setVoteGoodFit(mapping.getVoteGoodFit() + 1);
            case PERFECT_MATCH -> mapping.setVotePerfectMatch(mapping.getVotePerfectMatch() + 1);
        }
        mapping.recalculateEntropy();
        mappingRepository.save(mapping);
    }

    private void removeVote(CompetencyResourceMapping mapping, ResourceMatchType type) {
        switch (type) {
            case UNRELATED     -> mapping.setVoteUnrelated(Math.max(0, mapping.getVoteUnrelated() - 1));
            case WEAK          -> mapping.setVoteWeak(Math.max(0, mapping.getVoteWeak() - 1));
            case GOOD_FIT      -> mapping.setVoteGoodFit(Math.max(0, mapping.getVoteGoodFit() - 1));
            case PERFECT_MATCH -> mapping.setVotePerfectMatch(Math.max(0, mapping.getVotePerfectMatch() - 1));
        }
        mapping.recalculateEntropy();

        if (mapping.getTotalVotes() == 0) {
            competencyRepository.decrementResourceLinkDegree(List.of(mapping.getCompetencyId()));
            resourceRepository.decrementResourceLinkDegree(List.of(mapping.getResourceId()));
            mappingRepository.delete(mapping);
        } else {
            mappingRepository.save(mapping);
        }
    }

    // --- Response builders ---

    private void assertUserExists(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found: " + userId);
        }
    }

    private ResourceTaskResponse toTaskResponse(CompetencyResourceMapping mapping, String pipeline) {
        return buildTaskResponse(mapping.getCompetencyId(), mapping.getResourceId(),
                mapping.getId(), pipeline, toVoteCounts(mapping));
    }

    /**
     * Builds a task response from IDs without persisting a mapping row.
     * The mapping is only created when the user actually votes.
     */
    private ResourceTaskResponse toTaskResponseFromIds(String competencyId, String resourceId, String pipeline) {
        return buildTaskResponse(competencyId, resourceId, null, pipeline, ResourceVoteCounts.builder().build());
    }

    private ResourceTaskResponse buildTaskResponse(
            String competencyId, String resourceId, String mappingId,
            String pipeline, ResourceVoteCounts votes) {
        Competency competency = competencyRepository.findById(competencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Competency not found: " + competencyId));
        LearningResource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + resourceId));

        return ResourceTaskResponse.builder()
                .mappingId(mappingId)
                .competency(toCompetencyInfo(competency))
                .resource(toResourceInfo(resource))
                .pipeline(pipeline)
                .currentVotes(votes)
                .build();
    }

    private ResourceVoteResponse toVoteResponse(CompetencyResourceMapping mapping) {
        return ResourceVoteResponse.builder()
                .mappingId(mapping.getId())
                .success(true)
                .updatedVotes(toVoteCounts(mapping))
                .newEntropy(mapping.getEntropy())
                .build();
    }

    private static ResourceTaskResponse.CompetencyInfo toCompetencyInfo(Competency c) {
        return ResourceTaskResponse.CompetencyInfo.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .build();
    }

    private static ResourceTaskResponse.ResourceInfo toResourceInfo(LearningResource r) {
        return ResourceTaskResponse.ResourceInfo.builder()
                .id(r.getId())
                .title(r.getTitle())
                .url(r.getUrl())
                .build();
    }

    private static ResourceVoteCounts toVoteCounts(CompetencyResourceMapping m) {
        return ResourceVoteCounts.builder()
                .unrelated(m.getVoteUnrelated())
                .weak(m.getVoteWeak())
                .goodFit(m.getVoteGoodFit())
                .perfectMatch(m.getVotePerfectMatch())
                .build();
    }

    private static String pairKey(String competencyId, String resourceId) {
        return competencyId + ':' + resourceId;
    }
}
