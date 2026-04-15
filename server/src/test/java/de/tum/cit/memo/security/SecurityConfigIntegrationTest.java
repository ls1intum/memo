package de.tum.cit.memo.security;

import de.tum.cit.memo.AbstractIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SuppressWarnings("null")
class SecurityConfigIntegrationTest extends AbstractIntegrationTest {

    @MockitoBean
    JwtDecoder jwtDecoder;

    @Autowired
    private MockMvc mockMvc;

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
        @DisplayName("should return 401 for PUT /api/users/{id} without token")
        void shouldRejectUpdateUser() throws Exception {
            mockMvc.perform(put("/api/users/some-id")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Updated"}
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
        @DisplayName("should return 401 for POST /api/competencies without token")
        void shouldRejectCreateCompetency() throws Exception {
            mockMvc.perform(post("/api/competencies")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Test"}
                        """))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 401 for GET /api/learning-resources without token")
        void shouldRejectGetLearningResources() throws Exception {
            mockMvc.perform(get("/api/learning-resources"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 401 for POST /api/learning-resources without token")
        void shouldRejectCreateLearningResource() throws Exception {
            mockMvc.perform(post("/api/learning-resources")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Test", "url": "https://example.com"}
                        """))
                .andExpect(status().isUnauthorized());
        }
    }

    @Nested
    @DisplayName("authenticated access is granted")
    class AuthenticatedAccessGranted {

        @Test
        @DisplayName("should return 200 for GET /api/users with valid token")
        void shouldAllowGetUsers() throws Exception {
            mockMvc.perform(get("/api/users").with(jwt()))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should return 200 for GET /api/competencies with valid token")
        void shouldAllowGetCompetencies() throws Exception {
            mockMvc.perform(get("/api/competencies").with(jwt()))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should return 200 for GET /api/learning-resources with valid token")
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
