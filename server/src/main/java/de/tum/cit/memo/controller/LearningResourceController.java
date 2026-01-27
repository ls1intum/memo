package de.tum.cit.memo.controller;

import de.tum.cit.memo.dto.CreateLearningResourceRequest;
import de.tum.cit.memo.dto.UpdateLearningResourceRequest;
import de.tum.cit.memo.entity.LearningResource;
import de.tum.cit.memo.service.LearningResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/learning-resources")
@RequiredArgsConstructor
@Tag(name = "Learning Resources", description = "Learning resource management endpoints")
@SuppressWarnings("null")
public class LearningResourceController {

    private final LearningResourceService learningResourceService;

    @PostMapping
    @Operation(summary = "Create a new learning resource")
    public ResponseEntity<LearningResource> createLearningResource(@Valid @RequestBody CreateLearningResourceRequest request) {
        LearningResource resource = learningResourceService.createLearningResource(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get learning resource by ID")
    public ResponseEntity<LearningResource> getLearningResourceById(@PathVariable String id) {
        LearningResource resource = learningResourceService.getLearningResourceById(id);
        return ResponseEntity.ok(resource);
    }

    @GetMapping("/by-url")
    @Operation(summary = "Get learning resource by URL")
    public ResponseEntity<LearningResource> getLearningResourceByUrl(@RequestParam String url) {
        return learningResourceService.getLearningResourceByUrl(url)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Get all learning resources")
    public ResponseEntity<List<LearningResource>> getAllLearningResources() {
        List<LearningResource> resources = learningResourceService.getAllLearningResources();
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/random")
    @Operation(summary = "Get random learning resources")
    public ResponseEntity<List<LearningResource>> getRandomLearningResources(
        @RequestParam(defaultValue = "1") int count
    ) {
        List<LearningResource> resources = learningResourceService.getRandomLearningResources(count);
        return ResponseEntity.ok(resources);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update learning resource")
    public ResponseEntity<LearningResource> updateLearningResource(
        @PathVariable String id,
        @Valid @RequestBody UpdateLearningResourceRequest request
    ) {
        LearningResource resource = learningResourceService.updateLearningResource(id, request);
        return ResponseEntity.ok(resource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete learning resource")
    public ResponseEntity<Void> deleteLearningResource(@PathVariable String id) {
        learningResourceService.deleteLearningResource(id);
        return ResponseEntity.noContent().build();
    }
}
