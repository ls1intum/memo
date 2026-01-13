package de.tum.cit.memo.controller;

import de.tum.cit.memo.dto.CreateCompetencyRequest;
import de.tum.cit.memo.dto.UpdateCompetencyRequest;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.service.CompetencyService;
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
@RequestMapping("/api/competencies")
@RequiredArgsConstructor
@Tag(name = "Competencies", description = "Competency management endpoints")
public class CompetencyController {

    private final CompetencyService competencyService;

    @PostMapping
    @Operation(summary = "Create a new competency")
    public ResponseEntity<Competency> createCompetency(@Valid @RequestBody CreateCompetencyRequest request) {
        Competency competency = competencyService.createCompetency(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(competency);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get competency by ID")
    public ResponseEntity<Competency> getCompetencyById(@PathVariable String id) {
        Competency competency = competencyService.getCompetencyById(id);
        return ResponseEntity.ok(competency);
    }

    @GetMapping
    @Operation(summary = "Get all competencies")
    public ResponseEntity<List<Competency>> getAllCompetencies() {
        List<Competency> competencies = competencyService.getAllCompetencies();
        return ResponseEntity.ok(competencies);
    }

    @GetMapping("/random")
    @Operation(summary = "Get random competencies for mapping sessions")
    public ResponseEntity<List<Competency>> getRandomCompetencies(
        @RequestParam(defaultValue = "2") int count
    ) {
        List<Competency> competencies = competencyService.getRandomCompetencies(count);
        return ResponseEntity.ok(competencies);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update competency")
    public ResponseEntity<Competency> updateCompetency(
        @PathVariable String id,
        @Valid @RequestBody UpdateCompetencyRequest request
    ) {
        Competency competency = competencyService.updateCompetency(id, request);
        return ResponseEntity.ok(competency);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete competency")
    public ResponseEntity<Void> deleteCompetency(@PathVariable String id) {
        competencyService.deleteCompetency(id);
        return ResponseEntity.noContent().build();
    }
}
