package de.tum.cit.memo.security;

import de.tum.cit.memo.AbstractIntegrationTest;
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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
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
    @DisplayName("protected endpoints")
    class ProtectedEndpoints {

        @Test
        @DisplayName("should return 401 for any protected endpoint without a token")
        void shouldReturn401ForProtectedEndpointWithoutAuth() throws Exception {
            mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 200 for a protected endpoint with a valid token")
        @Sql(
            statements = {
                "DELETE FROM competency_relationships_votes",
                "DELETE FROM competency_resource_links",
                "DELETE FROM competency_relationships",
                "DELETE FROM users"
            },
            executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD
        )
        void shouldReturn200ForProtectedEndpointWithValidToken() throws Exception {
            mockMvc.perform(get("/api/auth/me")
                    .with(jwt().jwt(j -> j.subject("kcid-security-001").claim("email", "test@example.test"))))
                .andExpect(status().isOk());
        }
    }

    @Nested
    @DisplayName("CORS preflight")
    class CorsPreflight {

        @Test
        @DisplayName("should allow OPTIONS preflight requests from permitted origins without auth")
        void shouldPermitPreflightFromAllowedOrigin() throws Exception {
            mockMvc.perform(options("/api/auth/me")
                    .header("Origin", "http://localhost:3000")
                    .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should include CORS headers in the preflight response")
        void shouldIncludeCorsHeadersInPreflightResponse() throws Exception {
            mockMvc.perform(options("/api/auth/me")
                    .header("Origin", "http://localhost:3000")
                    .header("Access-Control-Request-Method", "GET"))
                .andExpect(header().exists("Access-Control-Allow-Origin"));
        }
    }
}
