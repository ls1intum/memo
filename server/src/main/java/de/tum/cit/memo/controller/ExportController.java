package de.tum.cit.memo.controller;

import de.tum.cit.memo.service.ExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only operations")
@SecurityRequirement(name = "bearer-jwt")
public class ExportController {

    private final ExportService exportService;

    @GetMapping("/export")
    @Operation(summary = "Export platform data as JSON or CSV")
    public ResponseEntity<byte[]> export(
        @RequestParam(defaultValue = "json") String format,
        @RequestParam(defaultValue = "competencies,relationships,resources,links,votes") String include
    ) throws Exception {
        Set<String> includeSet = Arrays.stream(include.split(","))
            .map(String::trim)
            .collect(Collectors.toSet());

        byte[] bytes = exportService.export(includeSet, format);
        String contentType;

        if ("csv".equals(format)) {
            contentType = "text/csv";
        } else {
            contentType = "application/json";
        }
        String filename = "memo-export-" + System.currentTimeMillis() + "." + format;

        return ResponseEntity.ok()
            .header("Content-Type", contentType)
            .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
            .body(bytes);
    }
}
