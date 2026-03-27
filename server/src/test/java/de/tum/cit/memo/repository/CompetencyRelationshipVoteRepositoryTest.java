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
import org.springframework.test.context.jdbc.Sql;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
class CompetencyRelationshipVoteRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private CompetencyRelationshipVoteRepository voteRepository;

    @Autowired
    private CompetencyRelationshipRepository relationshipRepository;

    @Autowired
    private CompetencyRepository competencyRepository;

    @Autowired
    private UserRepository userRepository;

    private CompetencyRelationship relationship;
    private String userId;

    @BeforeEach
    void setUp() {
        Competency origin = competencyRepository.save(Competency.builder()
            .id(IdGenerator.generateCuid())
            .title("Origin Competency")
            .build());
        Competency destination = competencyRepository.save(Competency.builder()
            .id(IdGenerator.generateCuid())
            .title("Destination Competency")
            .build());
        relationship = relationshipRepository.save(CompetencyRelationship.builder()
            .id(IdGenerator.generateCuid())
            .originId(origin.getId())
            .destinationId(destination.getId())
            .voteAssumes(0)
            .voteExtends(0)
            .voteMatches(0)
            .voteUnrelated(0)
            .entropy(0.0)
            .totalVotes(0)
            .build());
        userId = userRepository.save(User.builder()
            .id(IdGenerator.generateCuid())
            .name("Test User")
            .email("test@example.com")
            .role(UserRole.USER)
            .build()).getId();
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
        @DisplayName("should persist vote with all fields")
        void shouldPersistVote() {
            CompetencyRelationshipVote vote = createVote(relationship.getId(), userId, RelationshipType.ASSUMES);

            CompetencyRelationshipVote saved = voteRepository.saveAndFlush(vote);
            entityManager.refresh(saved);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getRelationshipId()).isEqualTo(relationship.getId());
            assertThat(saved.getUserId()).isEqualTo(userId);
            assertThat(saved.getRelationshipType()).isEqualTo(RelationshipType.ASSUMES);
            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should generate createdAt timestamp automatically")
        void shouldGenerateCreatedAtTimestamp() {
            CompetencyRelationshipVote vote = createVote(relationship.getId(), userId, RelationshipType.EXTENDS);

            CompetencyRelationshipVote saved = voteRepository.saveAndFlush(vote);
            entityManager.refresh(saved);

            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should enforce unique constraint on relationship and user")
        void shouldEnforceUniqueRelationshipAndUser() {
            voteRepository.saveAndFlush(createVote(relationship.getId(), userId, RelationshipType.MATCHES));

            CompetencyRelationshipVote duplicate = createVote(relationship.getId(), userId, RelationshipType.EXTENDS);

            assertThatThrownBy(() -> voteRepository.saveAndFlush(duplicate))
                .isInstanceOf(DataIntegrityViolationException.class);
        }

        @Test
        @DisplayName("should allow same user to vote on different relationships")
        void shouldAllowSameUserOnDifferentRelationships() {
            Competency c3 = competencyRepository.save(Competency.builder()
                .id(IdGenerator.generateCuid())
                .title("Third Competency")
                .build());
            CompetencyRelationship rel2 = relationshipRepository.save(CompetencyRelationship.builder()
                .id(IdGenerator.generateCuid())
                .originId(relationship.getOriginId())
                .destinationId(c3.getId())
                .voteAssumes(0)
                .voteExtends(0)
                .voteMatches(0)
                .voteUnrelated(0)
                .entropy(0.0)
                .totalVotes(0)
                .build());

            voteRepository.saveAndFlush(createVote(relationship.getId(), userId, RelationshipType.ASSUMES));
            CompetencyRelationshipVote second = voteRepository.saveAndFlush(createVote(rel2.getId(), userId, RelationshipType.EXTENDS));

            assertThat(second.getId()).isNotNull();
        }
    }

    @Nested
    @DisplayName("findById")
    class FindById {

        @Test
        @DisplayName("should find existing vote by id")
        void shouldFindExistingVote() {
            CompetencyRelationshipVote saved = voteRepository.save(createVote(relationship.getId(), userId, RelationshipType.MATCHES));

            Optional<CompetencyRelationshipVote> found = voteRepository.findById(saved.getId());

            assertThat(found).isPresent();
            assertThat(found.get().getRelationshipType()).isEqualTo(RelationshipType.MATCHES);
        }

        @Test
        @DisplayName("should return empty for non-existent id")
        void shouldReturnEmptyForNonExistentId() {
            Optional<CompetencyRelationshipVote> found = voteRepository.findById("non-existent-id");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("existsByRelationshipIdAndUserId")
    class ExistsByRelationshipIdAndUserId {

        @Test
        @DisplayName("should return true when vote exists")
        void shouldReturnTrueWhenVoteExists() {
            voteRepository.save(createVote(relationship.getId(), userId, RelationshipType.ASSUMES));

            boolean exists = voteRepository.existsByRelationshipIdAndUserId(relationship.getId(), userId);

            assertThat(exists).isTrue();
        }

        @Test
        @DisplayName("should return false when vote does not exist")
        void shouldReturnFalseWhenVoteDoesNotExist() {
            boolean exists = voteRepository.existsByRelationshipIdAndUserId(relationship.getId(), userId);

            assertThat(exists).isFalse();
        }

        @Test
        @DisplayName("should return false for different user")
        void shouldReturnFalseForDifferentUser() {
            String otherId = userRepository.save(User.builder()
                .id(IdGenerator.generateCuid())
                .name("Other User")
                .email("other@example.com")
                .role(UserRole.USER)
                .build()).getId();
            voteRepository.save(createVote(relationship.getId(), otherId, RelationshipType.ASSUMES));

            boolean exists = voteRepository.existsByRelationshipIdAndUserId(relationship.getId(), userId);

            assertThat(exists).isFalse();
        }
    }

    @Nested
    @DisplayName("findByRelationshipIdAndUserId")
    class FindByRelationshipIdAndUserId {

        @Test
        @DisplayName("should find vote by relationship id and user id")
        void shouldFindVoteByRelationshipAndUser() {
            voteRepository.save(createVote(relationship.getId(), userId, RelationshipType.UNRELATED));

            Optional<CompetencyRelationshipVote> found =
                voteRepository.findByRelationshipIdAndUserId(relationship.getId(), userId);

            assertThat(found).isPresent();
            assertThat(found.get().getRelationshipType()).isEqualTo(RelationshipType.UNRELATED);
        }

        @Test
        @DisplayName("should return empty when no matching vote exists")
        void shouldReturnEmptyWhenNotFound() {
            Optional<CompetencyRelationshipVote> found =
                voteRepository.findByRelationshipIdAndUserId(relationship.getId(), userId);

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("findDailyVoteCountsWithPreWindowTotal")
    class FindDailyVoteCountsWithPreWindowTotal {

        @Test
        @DisplayName("should return daily count row and sentinel null-date row")
        void shouldReturnDailyCountAndSentinelRow() {
            voteRepository.saveAndFlush(createVote(relationship.getId(), userId, RelationshipType.ASSUMES));

            Instant since = Instant.now().minus(1, ChronoUnit.HOURS);
            List<DailyVoteCount> counts = voteRepository.findDailyVoteCountsWithPreWindowTotal(userId, since);

            assertThat(counts).isNotEmpty();

            List<DailyVoteCount> dateCounts = counts.stream()
                .filter(r -> r.getVoteDate() != null)
                .toList();
            assertThat(dateCounts).hasSize(1);
            assertThat(dateCounts.get(0).getVoteCount()).isEqualTo(1L);

            List<DailyVoteCount> sentinelRows = counts.stream()
                .filter(r -> r.getVoteDate() == null)
                .toList();
            assertThat(sentinelRows).hasSize(1);
            assertThat(sentinelRows.get(0).getVoteCount()).isEqualTo(0L);
        }

        @Test
        @DisplayName("should return zero in date row when no votes in window")
        void shouldReturnZeroWhenNoVotesInWindow() {
            Instant since = Instant.now().plus(1, ChronoUnit.HOURS);
            List<DailyVoteCount> counts = voteRepository.findDailyVoteCountsWithPreWindowTotal(userId, since);

            List<DailyVoteCount> dateCounts = counts.stream()
                .filter(r -> r.getVoteDate() != null)
                .toList();
            assertThat(dateCounts).isEmpty();
        }
    }

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("should return all saved votes")
        void shouldReturnAllVotes() {
            String otherId = userRepository.save(User.builder()
                .id(IdGenerator.generateCuid())
                .name("Other User")
                .email("other@example.com")
                .role(UserRole.USER)
                .build()).getId();
            voteRepository.save(createVote(relationship.getId(), userId, RelationshipType.ASSUMES));
            voteRepository.save(createVote(relationship.getId(), otherId, RelationshipType.EXTENDS));

            List<CompetencyRelationshipVote> all = voteRepository.findAll();

            assertThat(all).hasSize(2);
        }

        @Test
        @DisplayName("should return empty list when no votes exist")
        void shouldReturnEmptyListWhenNoVotes() {
            List<CompetencyRelationshipVote> all = voteRepository.findAll();

            assertThat(all).isEmpty();
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("should delete existing vote by id")
        void shouldDeleteExistingVote() {
            CompetencyRelationshipVote saved = voteRepository.save(createVote(relationship.getId(), userId, RelationshipType.MATCHES));

            voteRepository.deleteById(saved.getId());

            assertThat(voteRepository.findById(saved.getId())).isEmpty();
        }

        @Test
        @DisplayName("should cascade delete when relationship is deleted")
        void shouldCascadeDeleteWhenRelationshipDeleted() {
            String voteId = voteRepository.save(createVote(relationship.getId(), userId, RelationshipType.ASSUMES)).getId();
            entityManager.flush();
            entityManager.clear();

            relationshipRepository.deleteById(relationship.getId());
            entityManager.flush();
            entityManager.clear();

            assertThat(voteRepository.findById(voteId)).isEmpty();
        }
    }
}
