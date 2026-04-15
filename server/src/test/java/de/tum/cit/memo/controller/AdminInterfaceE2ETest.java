package de.tum.cit.memo.controller;

import de.tum.cit.memo.AbstractIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * End-to-end tests for admin interfaces, exercising the full HTTP → Security → Controller →
 * Service → Repository → Database stack.
 */
@AutoConfigureMockMvc
@SuppressWarnings("null")
@Sql(
    statements = {
        "DELETE FROM competency_relationships_votes",
        "DELETE FROM competency_resource_links",
        "DELETE FROM competency_relationships",
        "DELETE FROM users",
        "DELETE FROM learning_resources",
        "DELETE FROM competencies"
    },
    executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD
)
class AdminInterfaceE2ETest extends AbstractIntegrationTest {

    @MockitoBean
    JwtDecoder jwtDecoder;

    @Autowired
    private MockMvc mockMvc;

    // -------------------------------------------------------------------------
    // User management
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("user management lifecycle")
    class UserManagementLifecycle {

        @Test
        @DisplayName("should create a user and return 201 with the user body")
        void shouldCreateUser() throws Exception {
            mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Alice", "email": "alice@example.com"}
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Alice"))
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());
        }

        @Test
        @DisplayName("should retrieve a created user by id")
        void shouldRetrieveUserById() throws Exception {
            String body = mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Bob", "email": "bob@example.com"}
                        """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

            String id = extractJsonField(body, "id");

            mockMvc.perform(get("/api/users/{id}", id).with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.name").value("Bob"));
        }

        @Test
        @DisplayName("should list all users including newly created ones")
        void shouldListAllUsers() throws Exception {
            mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "User One", "email": "user1@example.com"}
                        """))
                .andExpect(status().isCreated());

            mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "User Two", "email": "user2@example.com"}
                        """))
                .andExpect(status().isCreated());

            mockMvc.perform(get("/api/users").with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
        }

        @Test
        @DisplayName("should update a user's name and role")
        void shouldUpdateUser() throws Exception {
            String body = mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Carol", "email": "carol@example.com"}
                        """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

            String id = extractJsonField(body, "id");

            mockMvc.perform(put("/api/users/{id}", id)
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Carol Admin", "role": "ADMIN"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Carol Admin"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
        }

        @Test
        @DisplayName("should delete a user and return 404 on subsequent lookup")
        void shouldDeleteUser() throws Exception {
            String body = mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Dave", "email": "dave@example.com"}
                        """))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

            String id = extractJsonField(body, "id");

            mockMvc.perform(delete("/api/users/{id}", id).with(jwt()))
                .andExpect(status().isNoContent());

            mockMvc.perform(get("/api/users/{id}", id).with(jwt()))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("should reject duplicate email with 409 Conflict")
        void shouldRejectDuplicateEmail() throws Exception {
            mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Eve", "email": "duplicate@example.com"}
                        """))
                .andExpect(status().isCreated());

            mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Eve Clone", "email": "duplicate@example.com"}
                        """))
                .andExpect(status().isConflict());
        }

        @Test
        @DisplayName("should reject user creation with missing name with 400")
        void shouldRejectUserWithMissingName() throws Exception {
            mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"email": "noname@example.com"}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists());
        }

        @Test
        @DisplayName("should reject user creation with invalid email with 400")
        void shouldRejectUserWithInvalidEmail() throws Exception {
            mockMvc.perform(post("/api/users")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"name": "Bad Email", "email": "not-an-email"}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists());
        }

        @Test
        @DisplayName("should return 404 when getting a non-existent user")
        void shouldReturn404ForMissingUser() throws Exception {
            mockMvc.perform(get("/api/users/non-existent-id").with(jwt()))
                .andExpect(status().isNotFound());
        }
    }

    // -------------------------------------------------------------------------
    // Competency management
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("competency management lifecycle")
    class CompetencyManagementLifecycle {

        @Test
        @DisplayName("should create a competency and return 201 with the competency body")
        void shouldCreateCompetency() throws Exception {
            mockMvc.perform(post("/api/competencies")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Linear Algebra", "description": "Vectors and matrices"}
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.title").value("Linear Algebra"))
                .andExpect(jsonPath("$.description").value("Vectors and matrices"));
        }

        @Test
        @DisplayName("should retrieve a created competency by id")
        void shouldRetrieveCompetencyById() throws Exception {
            MvcResult result = mockMvc.perform(post("/api/competencies")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Calculus"}
                        """))
                .andExpect(status().isCreated())
                .andReturn();

            String id = extractJsonField(result.getResponse().getContentAsString(), "id");

            mockMvc.perform(get("/api/competencies/{id}", id).with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Calculus"));
        }

        @Test
        @DisplayName("should list all competencies")
        void shouldListAllCompetencies() throws Exception {
            mockMvc.perform(post("/api/competencies")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Algebra"}
                        """))
                .andExpect(status().isCreated());

            mockMvc.perform(post("/api/competencies")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Geometry"}
                        """))
                .andExpect(status().isCreated());

            mockMvc.perform(get("/api/competencies").with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))));
        }

        @Test
        @DisplayName("should update a competency's title and description")
        void shouldUpdateCompetency() throws Exception {
            MvcResult result = mockMvc.perform(post("/api/competencies")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Statistics Basics"}
                        """))
                .andExpect(status().isCreated())
                .andReturn();

            String id = extractJsonField(result.getResponse().getContentAsString(), "id");

            mockMvc.perform(put("/api/competencies/{id}", id)
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Statistics Advanced", "description": "Probability and inference"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Statistics Advanced"))
                .andExpect(jsonPath("$.description").value("Probability and inference"));
        }

        @Test
        @DisplayName("should delete a competency and return 404 on subsequent lookup")
        void shouldDeleteCompetency() throws Exception {
            MvcResult result = mockMvc.perform(post("/api/competencies")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Discrete Math"}
                        """))
                .andExpect(status().isCreated())
                .andReturn();

            String id = extractJsonField(result.getResponse().getContentAsString(), "id");

            mockMvc.perform(delete("/api/competencies/{id}", id).with(jwt()))
                .andExpect(status().isNoContent());

            mockMvc.perform(get("/api/competencies/{id}", id).with(jwt()))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("should reject competency creation with missing title with 400")
        void shouldRejectCompetencyWithMissingTitle() throws Exception {
            mockMvc.perform(post("/api/competencies")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"description": "No title here"}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists());
        }
    }

    // -------------------------------------------------------------------------
    // Learning resource management
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("learning resource management lifecycle")
    class LearningResourceManagementLifecycle {

        @Test
        @DisplayName("should create a learning resource and return 201 with the resource body")
        void shouldCreateLearningResource() throws Exception {
            mockMvc.perform(post("/api/learning-resources")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Khan Academy Calculus", "url": "https://khanacademy.org/calculus"}
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.title").value("Khan Academy Calculus"))
                .andExpect(jsonPath("$.url").value("https://khanacademy.org/calculus"));
        }

        @Test
        @DisplayName("should retrieve a created learning resource by id")
        void shouldRetrieveLearningResourceById() throws Exception {
            MvcResult result = mockMvc.perform(post("/api/learning-resources")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "MIT OpenCourseWare", "url": "https://ocw.mit.edu"}
                        """))
                .andExpect(status().isCreated())
                .andReturn();

            String id = extractJsonField(result.getResponse().getContentAsString(), "id");

            mockMvc.perform(get("/api/learning-resources/{id}", id).with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("MIT OpenCourseWare"));
        }

        @Test
        @DisplayName("should list all learning resources")
        void shouldListAllLearningResources() throws Exception {
            mockMvc.perform(post("/api/learning-resources")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Resource A", "url": "https://example.com/a"}
                        """))
                .andExpect(status().isCreated());

            mockMvc.perform(post("/api/learning-resources")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Resource B", "url": "https://example.com/b"}
                        """))
                .andExpect(status().isCreated());

            mockMvc.perform(get("/api/learning-resources").with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))));
        }

        @Test
        @DisplayName("should update a learning resource's title and url")
        void shouldUpdateLearningResource() throws Exception {
            MvcResult result = mockMvc.perform(post("/api/learning-resources")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "Old Title", "url": "https://old.example.com"}
                        """))
                .andExpect(status().isCreated())
                .andReturn();

            String id = extractJsonField(result.getResponse().getContentAsString(), "id");

            mockMvc.perform(put("/api/learning-resources/{id}", id)
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "New Title", "url": "https://new.example.com"}
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Title"))
                .andExpect(jsonPath("$.url").value("https://new.example.com"));
        }

        @Test
        @DisplayName("should delete a learning resource and return 404 on subsequent lookup")
        void shouldDeleteLearningResource() throws Exception {
            MvcResult result = mockMvc.perform(post("/api/learning-resources")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "To Be Deleted", "url": "https://delete.example.com"}
                        """))
                .andExpect(status().isCreated())
                .andReturn();

            String id = extractJsonField(result.getResponse().getContentAsString(), "id");

            mockMvc.perform(delete("/api/learning-resources/{id}", id).with(jwt()))
                .andExpect(status().isNoContent());

            mockMvc.perform(get("/api/learning-resources/{id}", id).with(jwt()))
                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("should reject learning resource creation with missing title with 400")
        void shouldRejectResourceWithMissingTitle() throws Exception {
            mockMvc.perform(post("/api/learning-resources")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"url": "https://example.com"}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists());
        }

        @Test
        @DisplayName("should reject learning resource creation with missing url with 400")
        void shouldRejectResourceWithMissingUrl() throws Exception {
            mockMvc.perform(post("/api/learning-resources")
                    .with(jwt())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {"title": "No URL"}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.url").exists());
        }
    }

    // -------------------------------------------------------------------------
    // Helper
    // -------------------------------------------------------------------------

    /**
     * Extracts a top-level string field from a minimal JSON response without pulling in
     * an extra JSON library.
     */
    private static String extractJsonField(String json, String field) {
        String key = "\"" + field + "\"";
        int keyIndex = json.indexOf(key);
        if (keyIndex < 0) {
            throw new IllegalArgumentException("Field '" + field + "' not found in: " + json);
        }
        int colonIndex = json.indexOf(':', keyIndex);
        int startIndex = json.indexOf('"', colonIndex + 1) + 1;
        int endIndex = json.indexOf('"', startIndex);
        return json.substring(startIndex, endIndex);
    }
}
