package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.enums.UserRole;
import de.tum.cit.memo.util.IdGenerator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Sql(statements = {
    "DELETE FROM competency_resource_links",
    "DELETE FROM competency_relationships",
    "DELETE FROM users"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@SuppressWarnings("null")
class UserRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User createUser(String name, String email, UserRole role) {
        return User.builder()
            .id(IdGenerator.generateCuid())
            .name(name)
            .email(email)
            .role(role)
            .build();
    }

    @Nested
    @DisplayName("save")
    class Save {

        @Test
        @DisplayName("should persist user with all fields")
        void shouldPersistUser() {
            User user = createUser("John Doe", "john@example.com", UserRole.USER);

            User saved = userRepository.saveAndFlush(user);
            entityManager.refresh(saved);

            assertThat(saved.getId()).isNotNull();
            assertThat(saved.getName()).isEqualTo("John Doe");
            assertThat(saved.getEmail()).isEqualTo("john@example.com");
            assertThat(saved.getRole()).isEqualTo(UserRole.USER);
            assertThat(saved.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("should persist user with ADMIN role")
        void shouldPersistAdminUser() {
            User user = createUser("Admin User", "admin@example.com", UserRole.ADMIN);

            User saved = userRepository.save(user);

            assertThat(saved.getRole()).isEqualTo(UserRole.ADMIN);
        }

        @Test
        @DisplayName("should enforce unique email constraint")
        void shouldEnforceUniqueEmail() {
            User user1 = createUser("User One", "same@example.com", UserRole.USER);
            userRepository.saveAndFlush(user1);

            User user2 = createUser("User Two", "same@example.com", UserRole.USER);

            assertThatThrownBy(() -> userRepository.saveAndFlush(user2))
                .isInstanceOf(DataIntegrityViolationException.class);
        }

        @Test
        @DisplayName("should generate createdAt timestamp automatically")
        void shouldGenerateCreatedAtTimestamp() {
            User user = createUser("Test User", "test@example.com", UserRole.USER);

            User saved = userRepository.saveAndFlush(user);
            entityManager.refresh(saved);

            assertThat(saved.getCreatedAt()).isNotNull();
        }
    }

    @Nested
    @DisplayName("findById")
    class FindById {

        @Test
        @DisplayName("should find existing user by id")
        void shouldFindExistingUser() {
            User user = createUser("Test User", "test@example.com", UserRole.USER);
            User saved = userRepository.save(user);

            Optional<User> found = userRepository.findById(saved.getId());

            assertThat(found).isPresent();
            assertThat(found.get().getName()).isEqualTo("Test User");
        }

        @Test
        @DisplayName("should return empty for non-existent id")
        void shouldReturnEmptyForNonExistentId() {
            Optional<User> found = userRepository.findById("non-existent-id");

            assertThat(found).isEmpty();
        }
    }

    @Nested
    @DisplayName("findByEmail")
    class FindByEmail {

        @Test
        @DisplayName("should find user by exact email match")
        void shouldFindByExactEmail() {
            User user = createUser("Jane Doe", "jane@example.com", UserRole.USER);
            userRepository.save(user);

            Optional<User> found = userRepository.findByEmail("jane@example.com");

            assertThat(found).isPresent();
            assertThat(found.get().getName()).isEqualTo("Jane Doe");
        }

        @Test
        @DisplayName("should return empty for non-existent email")
        void shouldReturnEmptyForNonExistentEmail() {
            Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

            assertThat(found).isEmpty();
        }

        @Test
        @DisplayName("should be case-sensitive for email lookup")
        void shouldBeCaseSensitive() {
            User user = createUser("Test User", "Test@Example.com", UserRole.USER);
            userRepository.save(user);

            Optional<User> foundLower = userRepository.findByEmail("test@example.com");
            Optional<User> foundExact = userRepository.findByEmail("Test@Example.com");

            assertThat(foundLower).isEmpty();
            assertThat(foundExact).isPresent();
        }
    }

    @Nested
    @DisplayName("existsByEmail")
    class ExistsByEmail {

        @Test
        @DisplayName("should return true when email exists")
        void shouldReturnTrueWhenEmailExists() {
            User user = createUser("Test User", "exists@example.com", UserRole.USER);
            userRepository.save(user);

            boolean exists = userRepository.existsByEmail("exists@example.com");

            assertThat(exists).isTrue();
        }

        @Test
        @DisplayName("should return false when email does not exist")
        void shouldReturnFalseWhenEmailDoesNotExist() {
            boolean exists = userRepository.existsByEmail("nonexistent@example.com");

            assertThat(exists).isFalse();
        }
    }

    @Nested
    @DisplayName("findAll")
    class FindAll {

        @Test
        @DisplayName("should return all saved users")
        void shouldReturnAllUsers() {
            userRepository.save(createUser("User 1", "user1@example.com", UserRole.USER));
            userRepository.save(createUser("User 2", "user2@example.com", UserRole.USER));
            userRepository.save(createUser("Admin", "admin@example.com", UserRole.ADMIN));

            List<User> all = userRepository.findAll();

            assertThat(all).hasSize(3);
        }

        @Test
        @DisplayName("should return empty list when no users exist")
        void shouldReturnEmptyListWhenNoUsers() {
            List<User> all = userRepository.findAll();

            assertThat(all).isEmpty();
        }
    }

    @Nested
    @DisplayName("delete")
    class Delete {

        @Test
        @DisplayName("should delete existing user")
        void shouldDeleteExistingUser() {
            User user = createUser("To Delete", "delete@example.com", UserRole.USER);
            User saved = userRepository.save(user);

            userRepository.deleteById(saved.getId());

            assertThat(userRepository.findById(saved.getId())).isEmpty();
        }
    }

    @Nested
    @DisplayName("update")
    class Update {

        @Test
        @DisplayName("should update user fields")
        void shouldUpdateUserFields() {
            User user = createUser("Original Name", "original@example.com", UserRole.USER);
            User saved = userRepository.save(user);

            saved.setName("Updated Name");
            saved.setRole(UserRole.ADMIN);
            User updated = userRepository.save(saved);

            assertThat(updated.getName()).isEqualTo("Updated Name");
            assertThat(updated.getRole()).isEqualTo(UserRole.ADMIN);
            assertThat(updated.getId()).isEqualTo(saved.getId());
        }
    }
}
