package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.entity.CompetencyRelationship;
import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.enums.RelationshipType;
import de.tum.cit.memo.enums.UserRole;
import de.tum.cit.memo.util.IdGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@Sql(statements = {
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
    private CompetencyRepository competencyRepository;

    @Autowired
    private UserRepository userRepository;

    private Competency origin;
    private Competency destination;
    private String userId;

    @BeforeEach
    void setUp() {
        origin = competencyRepository.save(Competency.builder()
            .id(IdGenerator.generateCuid())
            .title("Origin Competency")
            .build());
        destination = competencyRepository.save(Competency.builder()
            .id(IdGenerator.generateCuid())
            .title("Destination Competency")
            .build());
        userId = userRepository.save(User.builder()
            .id(IdGenerator.generateCuid())
            .name("Test User")
            .email("test@example.com")
            .role(UserRole.USER)
            .build()).getId();
    }

    private CompetencyRelationship createRelationship(String originId, String destinationId, RelationshipType type) {
        return CompetencyRelationship.builder()
            .id(IdGenerator.generateCuid())
            .originId(originId)
            .destinationId(destinationId)
            .userId(userId)
            .relationshipType(type)
            .build();
    }

    @Nested
    @DisplayName("save")
    class Save {

        @Test
        @DisplayName("should persist relationship with all fields")
        void shouldPersistRelationship() {
            CompetencyRelationship relationship = createRelationship(origin.getId(), destination.getId(), RelationshipType.ASSUMES);

            CompetencyRelationship saved = relationshipRepository.saveAndFlush(relationship);
            entityManager.refresh(saved);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getOriginId()).isEqualTo(origin.getId());
            assertThat(saved.getDestinationId()).isEqualTo(destination.getId());
            assertThat(saved.getUserId()).isEqualTo(userId);
            assertThat(saved.getRelationshipType()).isEqualTo(RelationshipType.ASSUMES);
            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should generate createdAt timestamp automatically")
        void shouldGenerateCreatedAtTimestamp() {
            CompetencyRelationship relationship = createRelationship(origin.getId(), destination.getId(), RelationshipType.EXTENDS);

            CompetencyRelationship saved = relationshipRepository.saveAndFlush(relationship);
            entityManager.refresh(saved);

            assertThat(saved.getCreatedAt()).isNotNull();
        }
    }

    @Nested
    @DisplayName("findById")
    class FindById {

        @Test
        @DisplayName("should find existing relationship by id")
        void shouldFindExistingRelationship() {
            CompetencyRelationship saved = relationshipRepository.save(
                createRelationship(origin.getId(), destination.getId(), RelationshipType.MATCHES));

            Optional<CompetencyRelationship> found = relationshipRepository.findById(saved.getId());

            assertThat(found).isPresent();
            assertThat(found.get().getRelationshipType()).isEqualTo(RelationshipType.MATCHES);
        }

        @Test
        @DisplayName("should return empty for non-existent id")
        void shouldReturnEmptyForNonExistentId() {
            Optional<CompetencyRelationship> found = relationshipRepository.findById("non-existent-id");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("findByOriginIdAndDestinationIdAndRelationshipType")
    class FindByOriginIdAndDestinationIdAndRelationshipType {

        @Test
        @DisplayName("should find relationship by origin, destination, and type")
        void shouldFindByOriginDestinationAndType() {
            relationshipRepository.save(createRelationship(origin.getId(), destination.getId(), RelationshipType.ASSUMES));

            Optional<CompetencyRelationship> found = relationshipRepository
                .findByOriginIdAndDestinationIdAndRelationshipType(origin.getId(), destination.getId(), RelationshipType.ASSUMES);

            assertThat(found).isPresent();
            assertThat(found.get().getOriginId()).isEqualTo(origin.getId());
            assertThat(found.get().getDestinationId()).isEqualTo(destination.getId());
            assertThat(found.get().getRelationshipType()).isEqualTo(RelationshipType.ASSUMES);
        }

        @Test
        @DisplayName("should return empty when no matching relationship exists")
        void shouldReturnEmptyWhenNotFound() {
            Optional<CompetencyRelationship> found = relationshipRepository
                .findByOriginIdAndDestinationIdAndRelationshipType(origin.getId(), destination.getId(), RelationshipType.ASSUMES);

            assertThat(found).isEmpty();
        }

        @Test
        @DisplayName("should return empty when relationship type differs")
        void shouldReturnEmptyWhenTypeDiffers() {
            relationshipRepository.save(createRelationship(origin.getId(), destination.getId(), RelationshipType.ASSUMES));

            Optional<CompetencyRelationship> found = relationshipRepository
                .findByOriginIdAndDestinationIdAndRelationshipType(origin.getId(), destination.getId(), RelationshipType.EXTENDS);

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("existsByOriginIdAndDestinationIdAndRelationshipType")
    class ExistsByOriginIdAndDestinationIdAndRelationshipType {

        @Test
        @DisplayName("should return true when relationship exists")
        void shouldReturnTrueWhenExists() {
            relationshipRepository.save(createRelationship(origin.getId(), destination.getId(), RelationshipType.MATCHES));

            boolean exists = relationshipRepository.existsByOriginIdAndDestinationIdAndRelationshipType(
                origin.getId(), destination.getId(), RelationshipType.MATCHES);

            assertThat(exists).isTrue();
        }

        @Test
        @DisplayName("should return false when relationship does not exist")
        void shouldReturnFalseWhenNotExists() {
            boolean exists = relationshipRepository.existsByOriginIdAndDestinationIdAndRelationshipType(
                origin.getId(), destination.getId(), RelationshipType.MATCHES);

            assertThat(exists).isFalse();
        }

        @Test
        @DisplayName("should return false when relationship type differs")
        void shouldReturnFalseWhenTypeDiffers() {
            relationshipRepository.save(createRelationship(origin.getId(), destination.getId(), RelationshipType.UNRELATED));

            boolean exists = relationshipRepository.existsByOriginIdAndDestinationIdAndRelationshipType(
                origin.getId(), destination.getId(), RelationshipType.MATCHES);

            assertThat(exists).isFalse();
        }
    }

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("should return all saved relationships")
        void shouldReturnAllRelationships() {
            relationshipRepository.save(createRelationship(origin.getId(), destination.getId(), RelationshipType.ASSUMES));
            relationshipRepository.save(createRelationship(origin.getId(), destination.getId(), RelationshipType.EXTENDS));

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
        @DisplayName("should delete existing relationship")
        void shouldDeleteExistingRelationship() {
            CompetencyRelationship saved = relationshipRepository.save(
                createRelationship(origin.getId(), destination.getId(), RelationshipType.MATCHES));

            relationshipRepository.deleteById(saved.getId());

            assertThat(relationshipRepository.findById(saved.getId())).isEmpty();
        }

        @Test
        @DisplayName("should cascade delete when origin competency is deleted")
        void shouldCascadeDeleteWhenOriginCompetencyDeleted() {
            String savedId = relationshipRepository.save(
                createRelationship(origin.getId(), destination.getId(), RelationshipType.ASSUMES)).getId();
            entityManager.flush();
            entityManager.clear();

            competencyRepository.deleteById(origin.getId());
            entityManager.flush();
            entityManager.clear();

            assertThat(relationshipRepository.findById(savedId)).isEmpty();
        }

        @Test
        @DisplayName("should cascade delete when destination competency is deleted")
        void shouldCascadeDeleteWhenDestinationCompetencyDeleted() {
            String savedId = relationshipRepository.save(
                createRelationship(origin.getId(), destination.getId(), RelationshipType.ASSUMES)).getId();
            entityManager.flush();
            entityManager.clear();

            competencyRepository.deleteById(destination.getId());
            entityManager.flush();
            entityManager.clear();

            assertThat(relationshipRepository.findById(savedId)).isEmpty();
        }
    }
}
