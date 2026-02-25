package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.entity.CompetencyResourceLink;
import de.tum.cit.memo.entity.LearningResource;
import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.enums.ResourceMatchType;
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
    "DELETE FROM learning_resources",
    "DELETE FROM users"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@SuppressWarnings("null")
class CompetencyResourceLinkRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private CompetencyResourceLinkRepository resourceLinkRepository;

    @Autowired
    private CompetencyRepository competencyRepository;

    @Autowired
    private LearningResourceRepository learningResourceRepository;

    @Autowired
    private UserRepository userRepository;

    private Competency competency;
    private LearningResource resource;
    private String userId;

    @BeforeEach
    void setUp() {
        competency = competencyRepository.save(Competency.builder()
            .id(IdGenerator.generateCuid())
            .title("Test Competency")
            .build());
        resource = learningResourceRepository.save(LearningResource.builder()
            .id(IdGenerator.generateCuid())
            .title("Test Resource")
            .url("https://example.com")
            .build());
        userId = userRepository.save(User.builder()
            .id(IdGenerator.generateCuid())
            .name("Test User")
            .email("test@example.com")
            .role(UserRole.USER)
            .build()).getId();
    }

    private CompetencyResourceLink createLink(ResourceMatchType matchType) {
        return CompetencyResourceLink.builder()
            .id(IdGenerator.generateCuid())
            .competencyId(competency.getId())
            .resourceId(resource.getId())
            .userId(userId)
            .matchType(matchType)
            .build();
    }

    @Nested
    @DisplayName("save")
    class Save {

        @Test
        @DisplayName("should persist resource link with all fields")
        void shouldPersistResourceLink() {
            CompetencyResourceLink link = createLink(ResourceMatchType.GOOD_FIT);

            CompetencyResourceLink saved = resourceLinkRepository.saveAndFlush(link);
            entityManager.refresh(saved);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getCompetencyId()).isEqualTo(competency.getId());
            assertThat(saved.getResourceId()).isEqualTo(resource.getId());
            assertThat(saved.getUserId()).isEqualTo(userId);
            assertThat(saved.getMatchType()).isEqualTo(ResourceMatchType.GOOD_FIT);
            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should generate createdAt timestamp automatically")
        void shouldGenerateCreatedAtTimestamp() {
            CompetencyResourceLink link = createLink(ResourceMatchType.WEAK);

            CompetencyResourceLink saved = resourceLinkRepository.saveAndFlush(link);
            entityManager.refresh(saved);

            assertThat(saved.getCreatedAt()).isNotNull();
        }
    }

    @Nested
    @DisplayName("findById")
    class FindById {

        @Test
        @DisplayName("should find existing resource link by id")
        void shouldFindExistingResourceLink() {
            CompetencyResourceLink saved = resourceLinkRepository.save(createLink(ResourceMatchType.PERFECT_MATCH));

            Optional<CompetencyResourceLink> found = resourceLinkRepository.findById(saved.getId());

            assertThat(found).isPresent();
            assertThat(found.get().getMatchType()).isEqualTo(ResourceMatchType.PERFECT_MATCH);
        }

        @Test
        @DisplayName("should return empty for non-existent id")
        void shouldReturnEmptyForNonExistentId() {
            Optional<CompetencyResourceLink> found = resourceLinkRepository.findById("non-existent-id");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("should return all saved resource links")
        void shouldReturnAllResourceLinks() {
            resourceLinkRepository.save(createLink(ResourceMatchType.UNRELATED));
            resourceLinkRepository.save(createLink(ResourceMatchType.WEAK));
            resourceLinkRepository.save(createLink(ResourceMatchType.GOOD_FIT));

            List<CompetencyResourceLink> all = resourceLinkRepository.findAll();

            assertThat(all).hasSize(3);
        }

        @Test
        @DisplayName("should return empty list when no resource links exist")
        void shouldReturnEmptyListWhenNoResourceLinks() {
            List<CompetencyResourceLink> all = resourceLinkRepository.findAll();

            assertThat(all).isEmpty();
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("should delete existing resource link")
        void shouldDeleteExistingResourceLink() {
            CompetencyResourceLink saved = resourceLinkRepository.save(createLink(ResourceMatchType.WEAK));

            resourceLinkRepository.deleteById(saved.getId());

            assertThat(resourceLinkRepository.findById(saved.getId())).isEmpty();
        }

        @Test
        @DisplayName("should cascade delete when competency is deleted")
        void shouldCascadeDeleteWhenCompetencyDeleted() {
            String savedId = resourceLinkRepository.save(createLink(ResourceMatchType.GOOD_FIT)).getId();
            entityManager.flush();
            entityManager.clear();

            competencyRepository.deleteById(competency.getId());
            entityManager.flush();
            entityManager.clear();

            assertThat(resourceLinkRepository.findById(savedId)).isEmpty();
        }

        @Test
        @DisplayName("should cascade delete when learning resource is deleted")
        void shouldCascadeDeleteWhenLearningResourceDeleted() {
            String savedId = resourceLinkRepository.save(createLink(ResourceMatchType.GOOD_FIT)).getId();
            entityManager.flush();
            entityManager.clear();

            learningResourceRepository.deleteById(resource.getId());
            entityManager.flush();
            entityManager.clear();

            assertThat(resourceLinkRepository.findById(savedId)).isEmpty();
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        @Test
        @DisplayName("should update resource link match type")
        void shouldUpdateMatchType() {
            CompetencyResourceLink saved = resourceLinkRepository.save(createLink(ResourceMatchType.UNRELATED));

            saved.setMatchType(ResourceMatchType.PERFECT_MATCH);
            CompetencyResourceLink updated = resourceLinkRepository.save(saved);

            assertThat(updated.getMatchType()).isEqualTo(ResourceMatchType.PERFECT_MATCH);
            assertThat(updated.getId()).isEqualTo(saved.getId());
        }
    }
}
