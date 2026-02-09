package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.util.IdGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SuppressWarnings("null")
class CompetencyRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private CompetencyRepository competencyRepository;

    @BeforeEach
    void setUp() {
        competencyRepository.deleteAll();
    }

    private Competency createCompetency(String title, String description) {
        return Competency.builder()
            .id(IdGenerator.generateCuid())
            .title(title)
            .description(description)
            .build();
    }

    @Nested
    @DisplayName("save")
    class Save {

        @Test
        @DisplayName("should persist competency with all fields")
        void shouldPersistCompetency() {
            Competency competency = createCompetency("Java Programming", "Learn Java fundamentals");

            Competency saved = competencyRepository.saveAndFlush(competency);
            entityManager.refresh(saved);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getTitle()).isEqualTo("Java Programming");
            assertThat(saved.getDescription()).isEqualTo("Learn Java fundamentals");
            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should persist competency without description")
        void shouldPersistCompetencyWithoutDescription() {
            Competency competency = createCompetency("Basic Competency", null);

            Competency saved = competencyRepository.saveAndFlush(competency);
            entityManager.refresh(saved);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getTitle()).isEqualTo("Basic Competency");
            assertThat(saved.getDescription()).isNull();
        }

        @Test
        @DisplayName("should generate createdAt timestamp automatically")
        void shouldGenerateCreatedAtTimestamp() {
            Competency competency = createCompetency("Test Competency", "Description");

            Competency saved = competencyRepository.saveAndFlush(competency);
            entityManager.refresh(saved);

            assertThat(saved.getCreatedAt()).isNotNull();
        }
    }

    @Nested
    @DisplayName("findById")
    class FindById {

        @Test
        @DisplayName("should find existing competency by id")
        void shouldFindExistingCompetency() {
            Competency competency = createCompetency("Test Competency", "Test Description");
            Competency saved = competencyRepository.save(competency);

            Optional<Competency> found = competencyRepository.findById(saved.getId());

            assertThat(found).isPresent();
            assertThat(found.get().getTitle()).isEqualTo("Test Competency");
        }

        @Test
        @DisplayName("should return empty for non-existent id")
        void shouldReturnEmptyForNonExistentId() {
            Optional<Competency> found = competencyRepository.findById("non-existent-id");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("findRandomCompetencies")
    class FindRandomCompetencies {

        @Test
        @DisplayName("should return requested number of random competencies")
        void shouldReturnRequestedCount() {
            for (int i = 0; i < 10; i++) {
                competencyRepository.save(createCompetency("Competency " + i, "Description " + i));
            }

            List<Competency> random = competencyRepository.findRandomCompetencies(5);

            assertThat(random).hasSize(5);
        }

        @Test
        @DisplayName("should return all competencies when count exceeds total")
        void shouldReturnAllWhenCountExceedsTotal() {
            competencyRepository.save(createCompetency("Competency 1", "Description 1"));
            competencyRepository.save(createCompetency("Competency 2", "Description 2"));

            List<Competency> random = competencyRepository.findRandomCompetencies(10);

            assertThat(random).hasSize(2);
        }

        @Test
        @DisplayName("should return empty list when no competencies exist")
        void shouldReturnEmptyWhenNoCompetencies() {
            List<Competency> random = competencyRepository.findRandomCompetencies(5);

            assertThat(random).isEmpty();
        }
    }

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("should return all saved competencies")
        void shouldReturnAllCompetencies() {
            competencyRepository.save(createCompetency("Competency 1", "Description 1"));
            competencyRepository.save(createCompetency("Competency 2", "Description 2"));
            competencyRepository.save(createCompetency("Competency 3", "Description 3"));

            List<Competency> all = competencyRepository.findAll();

            assertThat(all).hasSize(3);
        }

        @Test
        @DisplayName("should return empty list when no competencies exist")
        void shouldReturnEmptyListWhenNoCompetencies() {
            List<Competency> all = competencyRepository.findAll();

            assertThat(all).isEmpty();
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("should delete existing competency")
        void shouldDeleteExistingCompetency() {
            Competency competency = createCompetency("To Delete", "Will be deleted");
            Competency saved = competencyRepository.save(competency);

            competencyRepository.deleteById(saved.getId());

            assertThat(competencyRepository.findById(saved.getId())).isEmpty();
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        @Test
        @DisplayName("should update competency fields")
        void shouldUpdateCompetencyFields() {
            Competency competency = createCompetency("Original Title", "Original Description");
            Competency saved = competencyRepository.save(competency);

            saved.setTitle("Updated Title");
            saved.setDescription("Updated Description");
            Competency updated = competencyRepository.save(saved);

            assertThat(updated.getTitle()).isEqualTo("Updated Title");
            assertThat(updated.getDescription()).isEqualTo("Updated Description");
            assertThat(updated.getId()).isEqualTo(saved.getId());
        }
    }
}
