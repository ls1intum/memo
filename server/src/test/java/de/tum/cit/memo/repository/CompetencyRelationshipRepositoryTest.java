package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.entity.CompetencyRelationshipVote;
import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.enums.RelationshipType;
import de.tum.cit.memo.enums.UserRole;
import de.tum.cit.memo.util.IdGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Sql(statements = {
    "DELETE FROM competency_relationships_votes",
    "DELETE FROM competency_resource_links",
    "DELETE FROM competency_relationships",
    "DELETE FROM competencies",
    "DELETE FROM users"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@SuppressWarnings("null")
class CompetencyRelationshipRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private CompetencyRelationshipRepository relationshipRepository;

    @Autowired
    private CompetencyRelationshipVoteRepository voteRepository;

    @Autowired
    private CompetencyRepository competencyRepository;

    @Autowired
    private UserRepository userRepository;

    private Competency c1;
    private Competency c2;
    private Competency c3;
    private String userId;

    @BeforeEach
    void setUp() {
        c1 = competencyRepository.save(Competency.builder()
            .id(IdGenerator.generateCuid())
            .title("Competency 1")
            .build());
        c2 = competencyRepository.save(Competency.builder()
            .id(IdGenerator.generateCuid())
            .title("Competency 2")
            .build());
        c3 = competencyRepository.save(Competency.builder()
            .id(IdGenerator.generateCuid())
            .title("Competency 3")
            .build());
        userId = userRepository.save(User.builder()
            .id(IdGenerator.generateCuid())
            .name("Test User")
            .email("test@example.com")
            .role(UserRole.USER)
            .build()).getId();
    }

    private CompetencyRelationship createRelationship(String originId, String destinationId) {
        return CompetencyRelationship.builder()
            .id(IdGenerator.generateCuid())
            .originId(originId)
            .destinationId(destinationId)
            .voteAssumes(0)
            .voteExtends(0)
            .voteMatches(0)
            .voteUnrelated(0)
            .entropy(0.0)
            .totalVotes(0)
            .build();
    }

    private CompetencyRelationshipVote createVote(String relationshipId, String votingUserId, RelationshipType type) {
        return CompetencyRelationshipVote.builder()
            .id(IdGenerator.generateCuid())
            .relationshipId(relationshipId)
            .userId(votingUserId)
            .relationshipType(type)
            .build();
    }

    @Nested
    @DisplayName("save")
    class Save {

        @Test
        @DisplayName("should persist relationship with all vote count fields")
        void shouldPersistRelationshipWithVoteCounts() {
            CompetencyRelationship relationship = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(c1.getId())
                .destinationId(c2.getId())
                .voteAssumes(3)
                .voteExtends(1)
                .voteMatches(0)
                .voteUnrelated(2)
                .entropy(1.5)
                .totalVotes(6)
                .build();

            CompetencyRelationship saved = relationshipRepository.saveAndFlush(relationship);
            entityManager.refresh(saved);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getOriginId()).isEqualTo(c1.getId());
            assertThat(saved.getDestinationId()).isEqualTo(c2.getId());
            assertThat(saved.getVoteAssumes()).isEqualTo(3);
            assertThat(saved.getVoteExtends()).isEqualTo(1);
            assertThat(saved.getVoteMatches()).isEqualTo(0);
            assertThat(saved.getVoteUnrelated()).isEqualTo(2);
            assertThat(saved.getTotalVotes()).isEqualTo(6);
            assertThat(saved.getEntropy()).isEqualTo(1.5);
        }

        @Test
        @DisplayName("should generate createdAt and updatedAt timestamps automatically")
        void shouldGenerateTimestamps() {
            CompetencyRelationship relationship = createRelationship(c1.getId(), c2.getId());

            CompetencyRelationship saved = relationshipRepository.saveAndFlush(relationship);
            entityManager.refresh(saved);

            assertThat(saved.getCreatedAt()).isNotNull();
            assertThat(saved.getUpdatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should enforce unique constraint on origin and destination")
        void shouldEnforceUniqueOriginDestination() {
            relationshipRepository.saveAndFlush(createRelationship(c1.getId(), c2.getId()));

            CompetencyRelationship duplicate = createRelationship(c1.getId(), c2.getId());

            assertThatThrownBy(() -> relationshipRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
        }

        @Test
        @DisplayName("should allow same competencies in reversed direction")
        void shouldAllowReversedDirection() {
            relationshipRepository.saveAndFlush(createRelationship(c1.getId(), c2.getId()));
            CompetencyRelationship reversed = createRelationship(c2.getId(), c1.getId());

            CompetencyRelationship saved = relationshipRepository.saveAndFlush(reversed);

            assertThat(saved.getId()).isNotNull();
        }

        @Test
        @DisplayName("should correctly compute entropy via recalculateEntropy")
        void shouldComputeEntropyViaRecalculateEntropy() {
            CompetencyRelationship relationship = createRelationship(c1.getId(), c2.getId());
            relationship.setVoteAssumes(1);
            relationship.setVoteExtends(1);
            relationship.setVoteMatches(1);
            relationship.setVoteUnrelated(1);
            relationship.recalculateEntropy();

            CompetencyRelationship saved = relationshipRepository.saveAndFlush(relationship);
            entityManager.refresh(saved);

            assertThat(saved.getTotalVotes()).isEqualTo(4);
            assertThat(saved.getEntropy()).isGreaterThan(1.9);
        }
    }

    @Nested
    @DisplayName("findById")
    class FindById {

        @Test
        @DisplayName("should find existing relationship by id")
        void shouldFindExistingRelationship() {
            CompetencyRelationship saved = relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));

            Optional<CompetencyRelationship> found = relationshipRepository.findById(saved.getId());

            assertThat(found).isPresent();
            assertThat(found.get().getOriginId()).isEqualTo(c1.getId());
            assertThat(found.get().getDestinationId()).isEqualTo(c2.getId());
        }

        @Test
        @DisplayName("should return empty for non-existent id")
        void shouldReturnEmptyForNonExistentId() {
            Optional<CompetencyRelationship> found = relationshipRepository.findById("non-existent-id");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("findByOriginIdAndDestinationId")
    class FindByOriginIdAndDestinationId {

        @Test
        @DisplayName("should find relationship by origin and destination")
        void shouldFindByOriginAndDestination() {
            relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));

            Optional<CompetencyRelationship> found =
                relationshipRepository.findByOriginIdAndDestinationId(c1.getId(), c2.getId());

            assertThat(found).isPresent();
            assertThat(found.get().getOriginId()).isEqualTo(c1.getId());
            assertThat(found.get().getDestinationId()).isEqualTo(c2.getId());
        }

        @Test
        @DisplayName("should return empty when no matching relationship exists")
        void shouldReturnEmptyWhenNotFound() {
            Optional<CompetencyRelationship> found =
                relationshipRepository.findByOriginIdAndDestinationId(c1.getId(), c2.getId());

            assertThat(found).isEmpty();
        }

        @Test
        @DisplayName("should return empty when direction is reversed")
        void shouldReturnEmptyForReversedDirection() {
            relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));

            Optional<CompetencyRelationship> found =
                relationshipRepository.findByOriginIdAndDestinationId(c2.getId(), c1.getId());

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("existsByOriginIdAndDestinationId")
    class ExistsByOriginIdAndDestinationId {

        @Test
        @DisplayName("should return true when relationship exists")
        void shouldReturnTrueWhenExists() {
            relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));

            boolean exists = relationshipRepository.existsByOriginIdAndDestinationId(c1.getId(), c2.getId());

            assertThat(exists).isTrue();
        }

        @Test
        @DisplayName("should return false when relationship does not exist")
        void shouldReturnFalseWhenNotExists() {
            boolean exists = relationshipRepository.existsByOriginIdAndDestinationId(c1.getId(), c2.getId());

            assertThat(exists).isFalse();
        }

        @Test
        @DisplayName("should return false when direction is reversed")
        void shouldReturnFalseForReversedDirection() {
            relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));

            boolean exists = relationshipRepository.existsByOriginIdAndDestinationId(c2.getId(), c1.getId());

            assertThat(exists).isFalse();
        }
    }

    @Nested
    @DisplayName("findHighEntropyRelationshipsExcludingUser")
    class FindHighEntropyRelationshipsExcludingUser {

        @Test
        @DisplayName("should return relationships within vote range and entropy threshold")
        void shouldReturnRelationshipsMatchingCriteria() {
            CompetencyRelationship rel = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(c1.getId())
                .destinationId(c2.getId())
                .voteAssumes(2)
                .voteExtends(2)
                .voteMatches(0)
                .voteUnrelated(0)
                .totalVotes(4)
                .entropy(1.0)
                .build();
            relationshipRepository.saveAndFlush(rel);

            List<CompetencyRelationship> result = relationshipRepository
                .findHighEntropyRelationshipsExcludingUser(userId, 1, 10, 0.5, List.of(), PageRequest.of(0, 10));

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getId()).isEqualTo(rel.getId());
        }

        @Test
        @DisplayName("should exclude relationships where user has already voted")
        void shouldExcludeVotedRelationships() {
            CompetencyRelationship rel = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(c1.getId())
                .destinationId(c2.getId())
                .voteAssumes(2)
                .voteExtends(2)
                .voteMatches(0)
                .voteUnrelated(0)
                .totalVotes(4)
                .entropy(1.0)
                .build();
            relationshipRepository.saveAndFlush(rel);
            voteRepository.saveAndFlush(createVote(rel.getId(), userId, RelationshipType.ASSUMES));

            List<CompetencyRelationship> result = relationshipRepository
                .findHighEntropyRelationshipsExcludingUser(userId, 1, 10, 0.5, List.of(), PageRequest.of(0, 10));

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should exclude relationships in skippedIds")
        void shouldExcludeSkippedIds() {
            CompetencyRelationship rel = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(c1.getId())
                .destinationId(c2.getId())
                .voteAssumes(2)
                .voteExtends(2)
                .voteMatches(0)
                .voteUnrelated(0)
                .totalVotes(4)
                .entropy(1.0)
                .build();
            relationshipRepository.saveAndFlush(rel);

            List<CompetencyRelationship> result = relationshipRepository
                .findHighEntropyRelationshipsExcludingUser(userId, 1, 10, 0.5, List.of(rel.getId()), PageRequest.of(0, 10));

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should exclude relationships below entropy threshold")
        void shouldExcludeLowEntropyRelationships() {
            CompetencyRelationship rel = CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(c1.getId())
                .destinationId(c2.getId())
                .voteAssumes(4)
                .voteExtends(0)
                .voteMatches(0)
                .voteUnrelated(0)
                .totalVotes(4)
                .entropy(0.0)
                .build();
            relationshipRepository.saveAndFlush(rel);

            List<CompetencyRelationship> result = relationshipRepository
                .findHighEntropyRelationshipsExcludingUser(userId, 1, 10, 0.5, List.of(), PageRequest.of(0, 10));

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("findIntraPoolRelationships")
    class FindIntraPoolRelationships {

        @Test
        @DisplayName("should return relationships where both endpoints are in the pool")
        void shouldReturnIntraPoolRelationships() {
            CompetencyRelationship intra = relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));
            relationshipRepository.save(createRelationship(c1.getId(), c3.getId()));

            List<CompetencyRelationship> result =
                relationshipRepository.findIntraPoolRelationships(List.of(c1.getId(), c2.getId()));

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getId()).isEqualTo(intra.getId());
        }

        @Test
        @DisplayName("should exclude relationships with endpoints outside the pool")
        void shouldExcludeCrossPoolRelationships() {
            relationshipRepository.save(createRelationship(c1.getId(), c3.getId()));

            List<CompetencyRelationship> result =
                relationshipRepository.findIntraPoolRelationships(List.of(c1.getId(), c2.getId()));

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should return empty when pool has no internal relationships")
        void shouldReturnEmptyForEmptyPool() {
            List<CompetencyRelationship> result =
                relationshipRepository.findIntraPoolRelationships(List.of(c1.getId()));

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("findUnvotedByUserAndNotSkipped")
    class FindUnvotedByUserAndNotSkipped {

        @Test
        @DisplayName("should return relationships not yet voted by user")
        void shouldReturnUnvotedRelationships() {
            CompetencyRelationship rel = relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));

            List<CompetencyRelationship> result = relationshipRepository
                .findUnvotedByUserAndNotSkipped(userId, List.of(), PageRequest.of(0, 10));

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getId()).isEqualTo(rel.getId());
        }

        @Test
        @DisplayName("should exclude relationships already voted by user")
        void shouldExcludeVotedRelationships() {
            CompetencyRelationship rel = relationshipRepository.saveAndFlush(createRelationship(c1.getId(), c2.getId()));
            voteRepository.saveAndFlush(createVote(rel.getId(), userId, RelationshipType.MATCHES));

            List<CompetencyRelationship> result = relationshipRepository
                .findUnvotedByUserAndNotSkipped(userId, List.of(), PageRequest.of(0, 10));

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should exclude relationships in skippedIds")
        void shouldExcludeSkippedIds() {
            CompetencyRelationship rel = relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));

            List<CompetencyRelationship> result = relationshipRepository
                .findUnvotedByUserAndNotSkipped(userId, List.of(rel.getId()), PageRequest.of(0, 10));

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("should include relationships voted by a different user")
        void shouldIncludeRelationshipsVotedByOtherUser() {
            String otherUserId = userRepository.save(User.builder()
                .id(IdGenerator.generateCuid())
                .name("Other User")
                .email("other@example.com")
                .role(UserRole.USER)
                .build()).getId();
            CompetencyRelationship rel = relationshipRepository.saveAndFlush(createRelationship(c1.getId(), c2.getId()));
            voteRepository.saveAndFlush(createVote(rel.getId(), otherUserId, RelationshipType.EXTENDS));

            List<CompetencyRelationship> result = relationshipRepository
                .findUnvotedByUserAndNotSkipped(userId, List.of(), PageRequest.of(0, 10));

            assertThat(result).hasSize(1);
        }
    }

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("should return all saved relationships")
        void shouldReturnAllRelationships() {
            relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));
            relationshipRepository.save(createRelationship(c2.getId(), c3.getId()));

            List<CompetencyRelationship> all = relationshipRepository.findAll();

            assertThat(all).hasSize(2);
        }

        @Test
        @DisplayName("should return empty list when no relationships exist")
        void shouldReturnEmptyListWhenNoRelationships() {
            List<CompetencyRelationship> all = relationshipRepository.findAll();

            assertThat(all).isEmpty();
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("should delete existing relationship by id")
        void shouldDeleteExistingRelationship() {
            CompetencyRelationship saved = relationshipRepository.save(createRelationship(c1.getId(), c2.getId()));

            relationshipRepository.deleteById(saved.getId());

            assertThat(relationshipRepository.findById(saved.getId())).isEmpty();
        }

        @Test
        @DisplayName("should cascade delete when origin competency is deleted")
        void shouldCascadeDeleteWhenOriginCompetencyDeleted() {
            String savedId = relationshipRepository.save(createRelationship(c1.getId(), c2.getId())).getId();
            entityManager.flush();
            entityManager.clear();

            competencyRepository.deleteById(c1.getId());
            entityManager.flush();
            entityManager.clear();

            assertThat(relationshipRepository.findById(savedId)).isEmpty();
        }

        @Test
        @DisplayName("should cascade delete when destination competency is deleted")
        void shouldCascadeDeleteWhenDestinationCompetencyDeleted() {
            String savedId = relationshipRepository.save(createRelationship(c1.getId(), c2.getId())).getId();
            entityManager.flush();
            entityManager.clear();

            competencyRepository.deleteById(c2.getId());
            entityManager.flush();
            entityManager.clear();

            assertThat(relationshipRepository.findById(savedId)).isEmpty();
        }
    }
}
