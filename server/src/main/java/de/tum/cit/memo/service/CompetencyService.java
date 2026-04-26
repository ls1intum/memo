package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.CompetencyImportRow;
import de.tum.cit.memo.dto.CreateCompetencyRequest;
import de.tum.cit.memo.dto.ImportResult;
import de.tum.cit.memo.dto.UpdateCompetencyRequest;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CompetencyService {

    private final CompetencyRepository competencyRepository;

    @Transactional
    public Competency createCompetency(CreateCompetencyRequest request) {
        Competency competency = Competency.builder()
            .id(IdGenerator.generateCuid())
            .title(request.getTitle())
            .description(request.getDescription())
            .build();

        return competencyRepository.save(competency);
    }

    @Transactional(readOnly = true)
    public Competency getCompetencyById(String id) {
        return competencyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Competency not found"));
    }

    @Transactional(readOnly = true)
    public List<Competency> getAllCompetencies() {
        return competencyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Competency> getRandomCompetencies(int count) {
        if (count <= 0) {
            return List.of();
        }
        return competencyRepository.findRandomCompetencies(count);
    }

    @Transactional
    public Competency updateCompetency(String id, UpdateCompetencyRequest request) {
        Competency competency = getCompetencyById(id);

        if (request.getTitle() != null) {
            competency.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            competency.setDescription(request.getDescription());
        }

        return competencyRepository.save(competency);
    }

    @Transactional
    public void deleteCompetency(String id) {
        if (!competencyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Competency not found");
        }
        competencyRepository.deleteById(id);
    }

    @Transactional
    public ImportResult bulkImportCompetencies(List<CompetencyImportRow> rows) {
        List<Competency> toSave = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        int skipped = 0;

        for (int i = 0; i < rows.size(); i++) {
            CompetencyImportRow row = rows.get(i);
            if (row.getTitle() == null || row.getTitle().isBlank()) {
                errors.add("Row " + (i + 1) + ": title is required");
                continue;
            }
            if (competencyRepository.existsByTitle(row.getTitle())) {
                skipped++;
                continue;
            }
            toSave.add(Competency.builder()
                .id(IdGenerator.generateCuid())
                .title(row.getTitle())
                .description(row.getDescription())
                .build());
        }

        competencyRepository.saveAll(toSave);
        return new ImportResult(toSave.size(), skipped, errors);
    }
}
