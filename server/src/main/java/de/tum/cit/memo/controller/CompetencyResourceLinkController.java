package de.tum.cit.memo.controller;

import de.tum.cit.memo.dto.CreateCompetencyResourceLinkRequest;
import de.tum.cit.memo.entity.CompetencyResourceLink;
import de.tum.cit.memo.service.CompetencyResourceLinkService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/competency-resource-links")
@RequiredArgsConstructor
@Tag(name = "Competency Resource Links", description = "Competency-Resource link management endpoints")
public class CompetencyResourceLinkController {

    private final CompetencyResourceLinkService linkService;

    @PostMapping
    @Operation(summary = "Create a new competency-resource link")
    public ResponseEntity<CompetencyResourceLink> createLink(@Valid @RequestBody CreateCompetencyResourceLinkRequest request) {
        CompetencyResourceLink link = linkService.createLink(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(link);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get competency-resource link by ID")
    public ResponseEntity<CompetencyResourceLink> getLinkById(@PathVariable String id) {
        CompetencyResourceLink link = linkService.getLinkById(id);
        return ResponseEntity.ok(link);
    }

    @GetMapping
    @Operation(summary = "Get all competency-resource links")
    public ResponseEntity<List<CompetencyResourceLink>> getAllLinks() {
        List<CompetencyResourceLink> links = linkService.getAllLinks();
        return ResponseEntity.ok(links);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete competency-resource link")
    public ResponseEntity<Void> deleteLink(@PathVariable String id) {
        linkService.deleteLink(id);
        return ResponseEntity.noContent().build();
    }
}
