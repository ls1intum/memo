package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.LearningResource;
import de.tum.cit.memo.util.IdGenerator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@Sql(statements = "DELETE FROM competency_resource_links; DELETE FROM learning_resources",
    executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@SuppressWarnings("null")
class LearningResourceRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private LearningResourceRepository learningResourceRepository;

    private LearningResource createResource(String title, String url) {
        return LearningResource.builder()
            .id(IdGenerator.generateCuid())
            .title(title)
            .url(url)
            .build();
    }

    @Nested
    @DisplayName("save")
    class Save {

        @Test
        @DisplayName("should persist learning resource with all fields")
        void shouldPersistLearningResource() {
            LearningResource resource = createResource("Spring Boot Guide", "https://spring.io/guides");

            LearningResource saved = learningResourceRepository.saveAndFlush(resource);
            entityManager.refresh(saved);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getTitle()).isEqualTo("Spring Boot Guide");
            assertThat(saved.getUrl()).isEqualTo("https://spring.io/guides");
            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should generate createdAt timestamp automatically")
        void shouldGenerateCreatedAtTimestamp() {
            LearningResource resource = createResource("Test Resource", "https://example.com");

            LearningResource saved = learningResourceRepository.saveAndFlush(resource);
            entityManager.refresh(saved);

            assertThat(saved.getCreatedAt()).isNotNull();
        }
    }

    @Nested
    @DisplayName("findById")
    class FindById {

        @Test
        @DisplayName("should find existing resource by id")
        void shouldFindExistingResource() {
            LearningResource resource = createResource("Test Resource", "https://example.com");
            LearningResource saved = learningResourceRepository.save(resource);

            Optional<LearningResource> found = learningResourceRepository.findById(saved.getId());

            assertThat(found).isPresent();
            assertThat(found.get().getTitle()).isEqualTo("Test Resource");
        }

        @Test
        @DisplayName("should return empty for non-existent id")
        void shouldReturnEmptyForNonExistentId() {
            Optional<LearningResource> found = learningResourceRepository.findById("non-existent-id");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("findByUrl")
    class FindByUrl {

        @Test
        @DisplayName("should find resource by exact url match")
        void shouldFindByExactUrl() {
            LearningResource resource = createResource("Spring Docs", "https://docs.spring.io");
            learningResourceRepository.save(resource);

            Optional<LearningResource> found = learningResourceRepository.findByUrl("https://docs.spring.io");

            assertThat(found).isPresent();
            assertThat(found.get().getTitle()).isEqualTo("Spring Docs");
        }

        @Test
        @DisplayName("should return empty for non-existent url")
        void shouldReturnEmptyForNonExistentUrl() {
            Optional<LearningResource> found = learningResourceRepository.findByUrl("https://nonexistent.com");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("existsByUrl")
    class ExistsByUrl {

        @Test
        @DisplayName("should return true when url exists")
        void shouldReturnTrueWhenUrlExists() {
            LearningResource resource = createResource("Test", "https://exists.com");
            learningResourceRepository.save(resource);

            boolean exists = learningResourceRepository.existsByUrl("https://exists.com");

            assertThat(exists).isTrue();
        }

        @Test
        @DisplayName("should return false when url does not exist")
        void shouldReturnFalseWhenUrlDoesNotExist() {
            boolean exists = learningResourceRepository.existsByUrl("https://nonexistent.com");

            assertThat(exists).isFalse();
        }
    }

    @Nested
    @DisplayName("findRandomLearningResources")
    class FindRandomLearningResources {

        @Test
        @DisplayName("should return requested number of random resources")
        void shouldReturnRequestedCount() {
            for (int i = 0; i < 10; i++) {
                learningResourceRepository.save(createResource("Resource " + i, "https://example.com/" + i));
            }

            List<LearningResource> random = learningResourceRepository.findRandomLearningResources(5);

            assertThat(random).hasSize(5);
        }

        @Test
        @DisplayName("should return all resources when count exceeds total")
        void shouldReturnAllWhenCountExceedsTotal() {
            learningResourceRepository.save(createResource("Resource 1", "https://example.com/1"));
            learningResourceRepository.save(createResource("Resource 2", "https://example.com/2"));

            List<LearningResource> random = learningResourceRepository.findRandomLearningResources(10);

            assertThat(random).hasSize(2);
        }

        @Test
        @DisplayName("should return empty list when no resources exist")
        void shouldReturnEmptyWhenNoResources() {
            List<LearningResource> random = learningResourceRepository.findRandomLearningResources(5);

            assertThat(random).isEmpty();
        }
    }

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("should return all saved resources")
        void shouldReturnAllResources() {
            learningResourceRepository.save(createResource("Resource 1", "https://example.com/1"));
            learningResourceRepository.save(createResource("Resource 2", "https://example.com/2"));
            learningResourceRepository.save(createResource("Resource 3", "https://example.com/3"));

            List<LearningResource> all = learningResourceRepository.findAll();

            assertThat(all).hasSize(3);
        }

        @Test
        @DisplayName("should return empty list when no resources exist")
        void shouldReturnEmptyListWhenNoResources() {
            List<LearningResource> all = learningResourceRepository.findAll();

            assertThat(all).isEmpty();
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("should delete existing resource")
        void shouldDeleteExistingResource() {
            LearningResource resource = createResource("To Delete", "https://delete.me");
            LearningResource saved = learningResourceRepository.save(resource);

            learningResourceRepository.deleteById(saved.getId());

            assertThat(learningResourceRepository.findById(saved.getId())).isEmpty();
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        @Test
        @DisplayName("should update resource fields")
        void shouldUpdateResourceFields() {
            LearningResource resource = createResource("Original Title", "https://original.com");
            LearningResource saved = learningResourceRepository.save(resource);

            saved.setTitle("Updated Title");
            saved.setUrl("https://updated.com");
            LearningResource updated = learningResourceRepository.save(saved);

            assertThat(updated.getTitle()).isEqualTo("Updated Title");
            assertThat(updated.getUrl()).isEqualTo("https://updated.com");
            assertThat(updated.getId()).isEqualTo(saved.getId());
        }
    }
}
