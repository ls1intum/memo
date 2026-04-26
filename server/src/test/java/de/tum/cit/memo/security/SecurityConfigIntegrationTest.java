package de.tum.cit.memo.security;

import de.tum.cit.memo.AbstractIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "memo.allowed-email-domains=example.test")
@AutoConfigureMockMvc
@SuppressWarnings("null")
class SecurityConfigIntegrationTest extends AbstractIntegrationTest {

    @MockitoBean
    JwtDecoder jwtDecoder;

    @Autowired
    private MockMvc mockMvc;

    // jwt() with no authorities → empty authority list → ROLE_ADMIN check fails → 403
    // jwt().authorities(ROLE_ADMIN) → ROLE_ADMIN authority set directly → 200/201

    @Nested
    @DisplayName("public endpoints")
    class PublicEndpoints {

        @Test
        @DisplayName("should allow unauthenticated access to Swagger UI")
        void shouldPermitSwaggerUiWithoutAuth() throws Exception {
            mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should allow unauthenticated access to OpenAPI docs")
        void shouldPermitOpenApiDocsWithoutAuth() throws Exception {
            mockMvc.perform(get("/api-docs"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should allow unauthenticated access to actuator health endpoint")
        void shouldPermitHealthEndpointWithoutAuth() throws Exception {
            mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("unauthenticated access is rejected")
    class UnauthenticatedAccessRejected {

        @Test
        @DisplayName("should return 401 for GET /api/auth/me without token")
        void shouldRejectMe() throws Exception {
            mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 401 for GET /api/users without token")
        void shouldRejectGetUsers() throws Exception {
            mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 401 for POST /api/users without token")
        void shouldRejectCreateUser() throws Exception {
            mockMvc.perform(post("/api/users")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Test", "email": "test@example.com"}
                        """))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 401 for DELETE /api/users/{id} without token")
        void shouldRejectDeleteUser() throws Exception {
            mockMvc.perform(delete("/api/users/some-id"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 401 for GET /api/competencies without token")
        void shouldRejectGetCompetencies() throws Exception {
            mockMvc.perform(get("/api/competencies"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 401 for POST /api/admin/competencies/import without token")
        void shouldRejectAdminImport() throws Exception {
            mockMvc.perform(post("/api/admin/competencies/import")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("[]"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 401 for GET /api/learning-resources without token")
        void shouldRejectGetLearningResources() throws Exception {
            mockMvc.perform(get("/api/learning-resources"))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("role-based access control")
    class RoleBasedAccessControl {

        @Test
        @DisplayName("should return 403 for USER role on GET /api/users")
        void userRoleCannotListUsers() throws Exception {
            mockMvc.perform(get("/api/users").with(jwt()))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 200 for ADMIN role on GET /api/users")
        void adminRoleCanListUsers() throws Exception {
            mockMvc.perform(get("/api/users")
                    .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should return 403 for USER role on POST /api/users")
        void userRoleCannotCreateUser() throws Exception {
            mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Test", "email": "rbac-test@example.com"}
                        """))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 403 for USER role on DELETE /api/users/{id}")
        void userRoleCannotDeleteUser() throws Exception {
            mockMvc.perform(delete("/api/users/any-id").with(jwt()))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 403 for USER role on DELETE /api/competencies/{id}")
        void userRoleCannotDeleteCompetency() throws Exception {
            mockMvc.perform(delete("/api/competencies/any-id").with(jwt()))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 404 for ADMIN role on DELETE /api/competencies/{id} when not found")
        void adminRoleCanAttemptDeleteCompetency() throws Exception {
            mockMvc.perform(delete("/api/competencies/non-existent")
                    .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("should return 403 for USER role on DELETE /api/learning-resources/{id}")
        void userRoleCannotDeleteLearningResource() throws Exception {
            mockMvc.perform(delete("/api/learning-resources/any-id").with(jwt()))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 404 for ADMIN role on DELETE /api/learning-resources/{id} when not found")
        void adminRoleCanAttemptDeleteLearningResource() throws Exception {
            mockMvc.perform(delete("/api/learning-resources/non-existent")
                    .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("should return 403 for USER role on POST /api/admin/competencies/import")
        void userRoleCannotImportCompetencies() throws Exception {
            mockMvc.perform(post("/api/admin/competencies/import")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("[]"))
                .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("should return 200 for ADMIN role on POST /api/admin/competencies/import")
        void adminRoleCanImportCompetencies() throws Exception {
            mockMvc.perform(post("/api/admin/competencies/import")
                    .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN")))
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        [{"title": "RBAC Test Competency"}]
                        """))
                .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("authenticated access is granted")
    class AuthenticatedAccessGranted {

        @Test
        @DisplayName("should return 200 for ADMIN role on GET /api/users")
        void shouldAllowAdminGetUsers() throws Exception {
            mockMvc.perform(get("/api/users")
                    .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should return 200 for authenticated GET /api/competencies")
        void shouldAllowGetCompetencies() throws Exception {
            mockMvc.perform(get("/api/competencies").with(jwt()))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should return 200 for authenticated GET /api/learning-resources")
        void shouldAllowGetLearningResources() throws Exception {
            mockMvc.perform(get("/api/learning-resources").with(jwt()))
                .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("CORS preflight")
    class CorsPreflight {

        @Test
        @DisplayName("should allow OPTIONS preflight requests from permitted origins without auth")
        void shouldPermitPreflightFromAllowedOrigin() throws Exception {
            mockMvc.perform(options("/api/users")
                    .header("Origin", "http://localhost:3000")
                    .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should include CORS headers in the preflight response")
        void shouldIncludeCorsHeadersInPreflightResponse() throws Exception {
            mockMvc.perform(options("/api/users")
                    .header("Origin", "http://localhost:3000")
                    .header("Access-Control-Request-Method", "GET"))
                .andExpect(header().exists("Access-Control-Allow-Origin"));
        }
    }
}
