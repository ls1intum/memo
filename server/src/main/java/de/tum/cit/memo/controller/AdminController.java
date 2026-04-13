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
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
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
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null) return rows;

            String[] headers = splitCsvLine(headerLine);
            Map<String, Integer> columnIndex = new HashMap<>();
            for (int i = 0; i < headers.length; i++) {
                columnIndex.put(headers[i].trim().toLowerCase(), i);
            }

            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = splitCsvLine(line);
                RelationshipImportRow row = new RelationshipImportRow();
                row.setOriginId(getColumn(parts, columnIndex, "originid"));
                row.setOriginTitle(getColumn(parts, columnIndex, "origintitle"));
                row.setDestinationId(getColumn(parts, columnIndex, "destinationid"));
                row.setDestinationTitle(getColumn(parts, columnIndex, "destinationtitle"));
                row.setRelationshipType(getColumn(parts, columnIndex, "relationshiptype"));
                rows.add(row);
            }
        }
        return rows;
    }

    private String getColumn(String[] parts, Map<String, Integer> columnIndex, String name) {
        Integer idx = columnIndex.get(name);
        if (idx == null || idx >= parts.length) return null;
        String val = parts[idx].trim();
        if (val.isEmpty()) {
            return null;
        } else {
            return val;
        }
    }

    private List<CompetencyImportRow> parseCsv(MultipartFile file) throws IOException {
        List<CompetencyImportRow> rows = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(
            new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String header = reader.readLine();
            if (header == null) {
                return rows;
            }
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = splitCsvLine(line);
                String title;
                if (parts.length > 0) {
                    title = parts[0].trim();
                } else {
                    title = "";
                }
                String description;
                if (parts.length > 1) {
                    description = parts[1].trim();
                } else {
                    description = null;
                }
                rows.add(new CompetencyImportRow(title, description));
            }
        }
        return rows;
    }

    private String[] splitCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(current.toString());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        fields.add(current.toString());
        return fields.toArray(new String[0]);
    }

    private List<CompetencyImportRow> parseJson(MultipartFile file) throws IOException {
        return objectMapper.readValue(
            file.getInputStream(),
            objectMapper.getTypeFactory().constructCollectionType(List.class, CompetencyImportRow.class)
        );
    }
}
