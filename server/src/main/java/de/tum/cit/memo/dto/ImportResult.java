package de.tum.cit.memo.dto;

import java.util.List;

public record ImportResult(int imported, int skipped, List<String> errors) { }
