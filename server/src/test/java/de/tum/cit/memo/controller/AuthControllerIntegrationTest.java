package de.tum.cit.memo.controller;

import de.tum.cit.memo.AbstractIntegrationTest;
import de.tum.cit.memo.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "memo.allowed-email-domains=example.test")
@AutoConfigureMockMvc
@SuppressWarnings("null")
@Sql(
    statements = {
        "DELETE FROM competency_relationships_votes",
        "DELETE FROM competency_resource_links",
        "DELETE FROM competency_relationships",
        "DELETE FROM users"
    },
    executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD
)
class AuthControllerIntegrationTest extends AbstractIntegrationTest {

    @MockitoBean
    JwtDecoder jwtDecoder;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Nested
    @DisplayName("GET /api/auth/me — unauthenticated")
    class Unauthenticated {

        @Test
        @DisplayName("should return 401 when no Bearer token is provided")
        void shouldReturn401WhenNoTokenProvided() throws Exception {
            mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("GET /api/auth/me — first login")
    class FirstLogin {

        @Test
        @DisplayName("should create a new user and return the Keycloak subject as id")
        void shouldCreateNewUserAndReturnSubjectAsId() throws Exception {
            String sub = "kcid-first-login-001";

            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject(sub).claim("email", "alice@example.test"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sub))
                .andExpect(jsonPath("$.role").value("USER"));
        }

        @Test
        @DisplayName("should persist the new user to the database on first login")
        void shouldPersistNewUserToDatabase() throws Exception {
            String sub = "kcid-first-login-002";

            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject(sub).claim("email", "bob@example.test"))))
                .andExpect(status().isOk());

            assertThat(userRepository.findById(sub)).isPresent();
        }

        @Test
        @DisplayName("should assign USER role by default on first login")
        void shouldAssignUserRoleByDefault() throws Exception {
            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject("kcid-first-login-003").claim("email", "carol@example.test"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("USER"));
        }
    }

    @Nested
    @DisplayName("GET /api/auth/me — returning user")
    class ReturningUser {

        @Test
        @DisplayName("should return the same user on subsequent logins without creating duplicates")
        void shouldReturnSameUserWithoutDuplicates() throws Exception {
            String sub = "kcid-returning-user-001";

            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject(sub).claim("email", "dave@example.test"))))
                .andExpect(status().isOk());

            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject(sub).claim("email", "dave@example.test"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sub))
                .andExpect(jsonPath("$.role").value("USER"));

            assertThat(userRepository.count()).isEqualTo(1);
        }
    }

    @Nested
    @DisplayName("GET /api/auth/me — domain restriction")
    class DomainRestriction {

        @Test
        @DisplayName("should return 403 when email domain is not on the allowlist")
        void shouldReturn403ForForbiddenEmailDomain() throws Exception {
            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject("kcid-blocked-001").claim("email", "user@gmail.com"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").exists());
        }

        @Test
        @DisplayName("should return 403 when the email claim is absent and domain restriction is active")
        void shouldReturn403WhenEmailClaimMissing() throws Exception {
            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject("kcid-no-email-001"))))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 200 for an email on a permitted university domain")
        void shouldReturn200ForAllowedDomain() throws Exception {
            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject("kcid-allowed-001").claim("email", "student@example.test"))))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should match allowed domain case-insensitively")
        void shouldMatchDomainCaseInsensitively() throws Exception {
            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject("kcid-allowed-002").claim("email", "student@EXAMPLE.TEST"))))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should return 403 for an email address without an @ symbol")
        void shouldReturn403ForMalformedEmail() throws Exception {
            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject("kcid-malformed-001").claim("email", "not-an-email"))))
                .andExpect(status().isForbidden());
        }
    }
}
