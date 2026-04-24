package de.tum.cit.memo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.tum.cit.memo.dto.CompetencyImportRow;
import de.tum.cit.memo.dto.ImportResult;
import de.tum.cit.memo.dto.RelationshipImportRow;
import de.tum.cit.memo.service.CompetencyRelationshipService;
import de.tum.cit.memo.service.CompetencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only operations")
@SecurityRequirement(name = "bearer-jwt")
@SuppressWarnings("null")
public class AdminController {

    private final CompetencyService competencyService;
    private final CompetencyRelationshipService competencyRelationshipService;
    private final ObjectMapper objectMapper;

    @PostMapping("/competencies/import")
    @Operation(summary = "Bulk import competencies from JSON array")
    public ResponseEntity<ImportResult> importJson(
        @Valid @RequestBody List<CompetencyImportRow> rows
    ) {
        return ResponseEntity.ok(competencyService.bulkImportCompetencies(rows));
    }

    @PostMapping(value = "/competencies/import/file", consumes = "multipart/form-data")
    @Operation(summary = "Bulk import competencies from uploaded CSV or JSON file")
    public ResponseEntity<ImportResult> importFile(
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        String originalFilename = file.getOriginalFilename();
        List<CompetencyImportRow> rows;
        if (originalFilename != null && originalFilename.endsWith(".csv")) {
            rows = parseCsv(file);
        } else {
            rows = parseJson(file);
        }
        return ResponseEntity.ok(competencyService.bulkImportCompetencies(rows));
    }

    @PostMapping("/relationships/import")
    @Operation(summary = "Bulk import competency relationships from JSON array")
    public ResponseEntity<ImportResult> importRelationshipsJson(
        @RequestBody List<RelationshipImportRow> rows
    ) {
        return ResponseEntity.ok(competencyRelationshipService.bulkImportRelationships(rows));
    }

    @PostMapping(value = "/relationships/import/file", consumes = "multipart/form-data")
    @Operation(summary = "Bulk import competency relationships from CSV or JSON file")
    public ResponseEntity<ImportResult> importRelationshipsFile(
        @RequestParam("file") MultipartFile file
    ) throws IOException {
        String originalFilename = file.getOriginalFilename();
        List<RelationshipImportRow> rows;
        if (originalFilename != null && originalFilename.endsWith(".csv")) {
            rows = parseCsvRelationships(file);
        } else {
            rows = objectMapper.readValue(
                file.getInputStream(),
                objectMapper.getTypeFactory().constructCollectionType(List.class, RelationshipImportRow.class)
            );
        }
        return ResponseEntity.ok(competencyRelationshipService.bulkImportRelationships(rows));
    }

    private List<RelationshipImportRow> parseCsvRelationships(MultipartFile file) throws IOException {
        List<RelationshipImportRow> rows = new ArrayList<>();
        CSVFormat format = CSVFormat.DEFAULT.builder()
            .setHeader()
            .setSkipHeaderRecord(true)
            .setTrim(true)
            .setIgnoreHeaderCase(true)
            .build();
        try (var reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             var parser = format.parse(reader)) {
            for (CSVRecord record : parser) {
                RelationshipImportRow row = new RelationshipImportRow();
                row.setOriginId(getMappedValue(record, "originId"));
                row.setOriginTitle(getMappedValue(record, "originTitle"));
                row.setDestinationId(getMappedValue(record, "destinationId"));
                row.setDestinationTitle(getMappedValue(record, "destinationTitle"));
                row.setRelationshipType(getMappedValue(record, "relationshipType"));
                rows.add(row);
            }
        }
        return rows;
    }

    private String getMappedValue(CSVRecord record, String header) {
        if (!record.isMapped(header)) {
            return null;
        }
        String val = record.get(header);
        if (val.isEmpty()) {
            return null;
        } else {
            return val;
        }
    }

    private List<CompetencyImportRow> parseCsv(MultipartFile file) throws IOException {
        List<CompetencyImportRow> rows = new ArrayList<>();
        CSVFormat format = CSVFormat.DEFAULT.builder()
            .setHeader()
            .setSkipHeaderRecord(true)
            .setTrim(true)
            .build();
        try (var reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             var parser = format.parse(reader)) {
            for (CSVRecord record : parser) {
                String title;
                if (record.size() > 0) {
                    title = record.get(0);
                } else {
                    title = "";
                }
                String description;
                if (record.size() > 1) {
                    description = record.get(1);
                } else {
                    description = null;
                }
                rows.add(new CompetencyImportRow(title, description));
            }
        }
        return rows;
    }

    private List<CompetencyImportRow> parseJson(MultipartFile file) throws IOException {
        return objectMapper.readValue(
            file.getInputStream(),
            objectMapper.getTypeFactory().constructCollectionType(List.class, CompetencyImportRow.class)
        );
    }
}
